function optimizeTask() {
    const task = document.getElementById('taskInput').value;
    const output = document.getElementById('taskOutput');
    if (task) {
        output.textContent = `Optimized Plan for "${task}": Scheduled for 03:70 PM, 3070 Time. Priority: Quantum High.`;
    } else {
        output.textContent = "Please enter a task to optimize.";
    }
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
            document.getElementById('timerOutput').textContent = "Focus Complete! Take a break.";
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerOutput').textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
