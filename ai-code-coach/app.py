import os
import re
import json
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- Configure the Gemini API ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error configuring GenerativeAI: {e}")
    # Handle the error gracefully, maybe exit or use a dummy model for testing
    model = None

# --- Prompts ---
def get_problem_generation_prompt(level):
    return f"""
    You are a task generator for programming exercises. 
    There are 10 difficulty levels (1 = very easy, 10 = expert). 
    The current selected level is {level}.

    Instructions:
    1. Generate **one clear problem statement** for the user to solve.
    2. The problem must be adapted to the selected level:
       - Level 1–3: very simple beginner problems (basic loops, conditionals, lists).
       - Level 4–6: intermediate problems (sorting, searching, string manipulation, basic algorithms).
       - Level 7–8: advanced problems (recursion, dynamic programming, graph traversal).
       - Level 9–10: expert problems (optimization, parallelism, advanced data structures).
    3. Provide:
       - A concise **title** for the problem, wrapped in **<title>** tags.
       - A **problem description** (2–4 sentences), wrapped in **<description>** tags.
       - **Input and output examples** to clarify the task, wrapped in **<examples>** tags.

    Do not provide the solution, only the problem.
    """

def get_evaluation_prompt(problem, user_response):
    return f"""
    You are a programming evaluator. 
    Evaluate the user's solution to the given problem.

    Problem:
    {problem}

    User's Solution:
    ```python
    {user_response}
    ```

    Instructions:
    1. Provide a score out of 20 based on correctness, efficiency, and readability.
    2. Give **specific, constructive tips** for improvement (2–4 bullet points).
    3. Provide a **suggested corrected/improved version** of the solution.
    4. Return everything strictly in valid JSON with the following structure:

    {{
      "score": <integer from 0 to 20>,
      "tips": [
        "tip 1",
        "tip 2"
      ],
      "suggested_version": "<The full, corrected Python code as a single string with newlines represented by \\n>"
    }}
    """

# --- Routes ---
@app.route('/')
def index():
    """Renders the main web page."""
    return render_template('index.html')

@app.route('/generate-problem', methods=['POST'])
def generate_problem():
    """Generates a coding problem based on the difficulty level."""
    if not model:
        return jsonify({"error": "Generative AI model not configured."}), 500
        
    data = request.get_json()
    level = data.get('level', 5)
    
    try:
        prompt = get_problem_generation_prompt(level)
        response = model.generate_content(prompt)
        return jsonify({"problem_text": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/evaluate-solution', methods=['POST'])
def evaluate_solution():
    """Evaluates the user's solution and returns feedback."""
    if not model:
        return jsonify({"error": "Generative AI model not configured."}), 500

    data = request.get_json()
    problem = data.get('problem', '')
    user_solution = data.get('solution', '')
    
    try:
        prompt = get_evaluation_prompt(problem, user_solution)
        response = model.generate_content(prompt)
        
        # Clean the response to ensure it's valid JSON
        raw_text = response.text
        cleaned_text = re.sub(r"```[a-zA-Z]*\n?", "", raw_text).strip("`\n ")
        
        # Parse and return the JSON evaluation
        evaluation_data = json.loads(cleaned_text)
        return jsonify(evaluation_data)
        
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse the evaluation from the AI. Please try again."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)