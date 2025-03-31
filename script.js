function optimizeTask() {
    const task = document.getElementById('taskInput').value;
    const output = document.getElementById('taskOutput');
    output.textContent = task ? `Task "${task}" optimized. Priority: Quantum High. ETA: Instant.` : "Input required.";
}

let timer;
let timeLeft = 1500; // 25 minutes in seconds

function startTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('timerOutput').textContent = "Cycle Complete. Recalibrate.";
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerOutput').textContent = `Cycle: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function trackGoal() {
    const goal = document.getElementById('goalInput').value;
    const output = document.getElementById('goalOutput');
    output.textContent = goal ? `Objective "${goal}" synced. Progress: 0%.` : "Define an objective.";
}

function scanMood() {
    const moods = ["Optimal", "Flux", "Overload", "Stable"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    document.getElementById('moodOutput').textContent = `State: ${randomMood}. Adjust accordingly.`;
}
