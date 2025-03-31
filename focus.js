document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class FocusCore {
    constructor() {
        this.timer = null;
        this.timeLeft = 1500; // 25 minutes
        this.cycles = 0;
        this.sessions = JSON.parse(localStorage.getItem('focusSessions')) || [];
        this.chart = new Chart(document.getElementById('focusChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Focus Time (min)', data: [], borderColor: '#00ffcc', fill: false },
                    { label: 'Efficiency (%)', data: [], borderColor: '#e5e5e5', fill: false }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
        this.loadSessions();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 1500;
        const startTime = Date.now();
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            this.updateChart();

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.cycles++;
                const session = {
                    duration: 25,
                    completed: true,
                    timestamp: startTime,
                    efficiency: this.calculateEfficiency()
                };
                this.sessions.push(session);
                this.saveSessions();
                document.getElementById('timerOutput').textContent = "Cycle Complete!";
                this.updateMetrics();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timerOutput').textContent = `Cycle: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    calculateEfficiency() {
        const completedSessions = this.sessions.filter(s => s.completed).length;
        return this.sessions.length ? (completedSessions / this.sessions.length) * 100 : 0;
    }

    saveSessions() {
        localStorage.setItem('focusSessions', JSON.stringify(this.sessions));
    }

    loadSessions() {
        this.updateChart();
        this.updateMetrics();
    }

    updateChart() {
        const focusData = this.sessions.map(s => s.duration);
        const efficiencyData = this.sessions.map(s => s.efficiency);
        this.chart.data.labels = this.sessions.map(s => new Date(s.timestamp).toLocaleTimeString());
        this.chart.data.datasets[0].data = focusData;
        this.chart.data.datasets[1].data = efficiencyData;
        this.chart.update();
    }

    updateMetrics() {
        const efficiency = this.calculateEfficiency();
        document.getElementById('focusEfficiency').textContent = `Efficiency: ${efficiency.toFixed(2)}%`;
    }

    getStreak() {
        let streak = 0;
        const today = new Date().setHours(0, 0, 0, 0);
        for (let i = this.sessions.length - 1; i >= 0; i--) {
            const sessionDate = new Date(this.sessions[i].timestamp).setHours(0, 0, 0, 0);
            if (sessionDate === today - streak * 86400000) streak++;
            else break;
        }
        return streak;
    }
}

const focus = new FocusCore();

function startTimer() {
    focus.startTimer();
}
