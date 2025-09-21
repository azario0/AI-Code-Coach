document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const difficultySlider = document.getElementById('difficulty-slider');
    const levelDisplay = document.getElementById('level-display');
    const generateBtn = document.getElementById('generate-btn');
    const evaluateBtn = document.getElementById('evaluate-btn');
    const solutionCode = document.getElementById('solution-code');

    const challengeArea = document.getElementById('challenge-area');
    const problemDisplay = document.getElementById('problem-display');
    const problemLoader = document.getElementById('problem-loader');
    const problemContent = document.getElementById('problem-content');
    const problemTitle = document.getElementById('problem-title');
    const problemDescription = document.getElementById('problem-description');
    const problemExamples = document.getElementById('problem-examples');

    const evaluationDisplay = document.getElementById('evaluation-display');
    const evaluationLoader = document.getElementById('evaluation-loader');
    const evaluationContent = document.getElementById('evaluation-content');
    const evaluationScore = document.getElementById('evaluation-score');
    const evaluationTips = document.getElementById('evaluation-tips');
    const suggestedCode = document.getElementById('suggested-code');
    
    // Store the problem text globally to send with evaluation
    let currentProblemText = "";

    // --- Event Listeners ---
    difficultySlider.addEventListener('input', () => {
        levelDisplay.textContent = difficultySlider.value;
    });

    generateBtn.addEventListener('click', handleGenerateProblem);
    evaluateBtn.addEventListener('click', handleEvaluateSolution);

    // --- Functions ---
    async function handleGenerateProblem() {
        setLoadingState(generateBtn, true, 'Generating...');
        challengeArea.classList.remove('hidden');
        problemContent.classList.add('hidden');
        problemLoader.classList.remove('hidden');
        evaluationDisplay.classList.add('hidden'); // Hide previous results
        
        try {
            const response = await fetch('/generate-problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level: difficultySlider.value })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            currentProblemText = data.problem_text;
            displayProblem(currentProblemText);

        } catch (error) {
            console.error('Error generating problem:', error);
            problemDescription.textContent = "Failed to generate a problem. Please check the console and try again.";
        } finally {
            setLoadingState(generateBtn, false, 'Generate Problem');
            problemLoader.classList.add('hidden');
            problemContent.classList.remove('hidden');
        }
    }

    async function handleEvaluateSolution() {
        setLoadingState(evaluateBtn, true, 'Evaluating...');
        evaluationDisplay.classList.remove('hidden');
        evaluationContent.classList.add('hidden');
        evaluationLoader.classList.remove('hidden');

        const userCode = solutionCode.value;
        if (!userCode.trim()) {
            alert("Please enter your solution code.");
            setLoadingState(evaluateBtn, false, 'Submit & Evaluate');
            return;
        }

        try {
            const response = await fetch('/evaluate-solution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: currentProblemText,
                    solution: userCode
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayEvaluation(data);

        } catch (error) {
            console.error('Error evaluating solution:', error);
            alert(`Evaluation failed: ${error.message}`);
        } finally {
            setLoadingState(evaluateBtn, false, 'Submit & Evaluate');
            evaluationLoader.classList.add('hidden');
            evaluationContent.classList.remove('hidden');
        }
    }

    function displayProblem(problemText) {
        // Simple parser for custom tags
        const title = problemText.match(/<title>(.*?)<\/title>/s)?.[1] || "Untitled Problem";
        const description = problemText.match(/<description>(.*?)<\/description>/s)?.[1] || "No description provided.";
        const examples = problemText.match(/<examples>(.*?)<\/examples>/s)?.[1] || "No examples provided.";

        problemTitle.textContent = title.trim();
        problemDescription.textContent = description.trim();
        problemExamples.textContent = examples.trim();
    }
    
    function displayEvaluation(data) {
        evaluationScore.textContent = data.score;
        
        // Clear previous tips
        evaluationTips.innerHTML = ''; 
        data.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            evaluationTips.appendChild(li);
        });

        suggestedCode.textContent = data.suggested_version;
    }

    function setLoadingState(button, isLoading, loadingText) {
        button.disabled = isLoading;
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
        } else {
            button.textContent = button.dataset.originalText || 'Generate Problem';
        }
    }
});