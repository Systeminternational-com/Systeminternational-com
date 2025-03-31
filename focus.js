document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let timer, timeLeft = 1500, cycles = 0;
const focusChart = new Chart(document.getElementById('focusChart'), {
    type: 'doughnut',
    data: {
        labels: ['Remaining', 'Elapsed'],
        datasets: [{ data: [1500, 0], backgroundColor: ['#d4af37', '#00ffcc'] }]
    }
});

function startTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        updateChart();
        if (timeLeft <= 0) {
            clearInterval(timer);
            cycles++;
            document.getElementById('timerOutput').textContent = "Cycle Complete!";
            document.getElementById('focusEfficiency').textContent = `Efficiency: ${(cycles * 25 / (cycles + 1)).toFixed(2)}%`;
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerOutput').textContent = `Cycle: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateChart() {
    focusChart.data.datasets[0].data = [timeLeft, 1500 - timeLeft];
    focusChart.update();
}
