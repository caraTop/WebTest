let puzzles = [];
let unlockedCount = 1; // First puzzle unlocked by default
let currentPuzzleIndex = 0;

const clueList = document.getElementById("clueList");
const puzzleText = document.getElementById("puzzleText");
const submitButton = document.getElementById("submitAnswer");
const answerInput = document.getElementById("answerInput");

// Load saved progress
function loadProgress() {
    const savedUnlocked = localStorage.getItem("unlockedCount");
    if (savedUnlocked !== null) {
        unlockedCount = parseInt(savedUnlocked);
    }
}

// Save progress
function saveProgress() {
    localStorage.setItem("unlockedCount", unlockedCount);
}

// Save answer
function saveAnswer(index, answer) {
    localStorage.setItem("answer_" + index, answer);
}

// Load answer
function loadAnswer(index) {
    return localStorage.getItem("answer_" + index) || "";
}

// Render clue list
function renderClues() {
    clueList.innerHTML = "";

    for (let i = 0; i < unlockedCount; i++) {
        const li = document.createElement("li");
        li.textContent = puzzles[i].title;
        li.onclick = () => loadPuzzle(i);
        clueList.appendChild(li);
    }
}

// Load puzzle
function loadPuzzle(index) {
    currentPuzzleIndex = index;
    puzzleText.textContent = puzzles[index].text;
    answerInput.value = loadAnswer(index);
}

// Submit answer
submitButton.addEventListener("click", () => {
    const answer = answerInput.value.trim();
    if (!answer) return;

    saveAnswer(currentPuzzleIndex, answer);

    // Unlock next puzzle (without checking correctness)
    if (currentPuzzleIndex === unlockedCount - 1 && unlockedCount < puzzles.length) {
        unlockedCount++;
        saveProgress();
        renderClues();
    }
});

// Load JSON
fetch("puzzles.json")
    .then(response => response.json())
    .then(data => {
        puzzles = data.puzzles;

        loadProgress();
        renderClues();
        loadPuzzle(0);
    });
