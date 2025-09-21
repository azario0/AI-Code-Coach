# AI Code Coach

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20API-4285F4.svg)

AI Code Coach is an interactive web application designed to help developers practice their coding skills. It leverages the power of Google's Gemini API to dynamically generate programming problems of varying difficulty and provide intelligent, constructive feedback on user-submitted solutions.

## ✨ Features

-   **Dynamic Problem Generation**: Get a fresh, unique coding challenge every time you click "Generate".
-   **Adjustable Difficulty**: Use a simple slider to select a difficulty level from 1 (beginner) to 10 (expert).
-   **AI-Powered Evaluation**: Submit your solution and receive an instant, detailed evaluation from the Gemini AI.
-   **Constructive Feedback**: Get a score out of 20, specific tips for improvement, and a complete, corrected/improved version of your code.
-   **Clean & Modern UI**: A sleek, dark-themed, and responsive single-page application for a seamless user experience.

## 🛠️ Tech Stack

-   **Backend**: Python, Flask
-   **AI Integration**: Google Generative AI (`google-generativeai`)
-   **Frontend**: HTML5, CSS3, Vanilla JavaScript
-   **Environment Management**: `python-dotenv`

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Python 3.9+
-   `pip` for package management
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://makersuite.google.com/).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/azario0/AI-Code-Coach.git
    cd AI-Code-Coach
    ```

2.  **Create and activate a virtual environment:**
    -   On macOS/Linux:
        ```sh
        python3 -m venv venv
        source venv/bin/activate
        ```
    -   On Windows:
        ```sh
        python -m venv venv
        venv\Scripts\activate
        ```

3.  **Install the required dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Configure your API Key:**
    -   Create a file named `.env` in the root of the project directory.
    -   Add your Gemini API key to this file as shown below:
        ```
        GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```
    -   The `.env` file is included in `.gitignore` to prevent you from accidentally committing your secret key.

### Running the Application

1.  **Start the Flask server:**
    ```sh
    python app.py
    ```

2.  **Open your browser:**
    Navigate to `http://127.0.0.1:5000` to use the application.

## ⚙️ How It Works

The application follows a simple, asynchronous flow:

1.  **Problem Generation**:
    -   The user selects a difficulty level and clicks the "Generate Problem" button.
    -   The frontend JavaScript sends a `POST` request to the `/generate-problem` endpoint on the Flask server.
    -   The Flask backend constructs a detailed prompt and sends it to the Gemini API.
    -   The AI generates a problem statement, which is sent back to the frontend and displayed to the user.

2.  **Solution Evaluation**:
    -   The user writes their Python solution and clicks "Submit & Evaluate".
    -   The frontend sends a `POST` request to the `/evaluate-solution` endpoint, containing both the original problem and the user's code.
    -   The Flask backend creates a new prompt, asking the Gemini API to act as a code evaluator.
    -   The AI analyzes the solution and returns a JSON object containing a score, improvement tips, and a suggested code version.
    -   The Flask server forwards this JSON to the frontend, where it is parsed and displayed in the evaluation section.

## 📁 Project Structure

```
/AI-Code-Coach/
|
├── app.py                  # Main Flask application logic
├── requirements.txt        # Python dependencies
├── .env                    # For storing the API key (create this yourself)
|
├── /templates/
│   └── index.html          # Main HTML user interface
|
└── /static/
    ├── /css/
    │   └── style.css       # Styling for the app
    └── /js/
        └── main.js         # JavaScript for interactivity and API calls
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for details.

