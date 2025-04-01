document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class FocusCore {
    constructor() {
        this.timer = null;
        this.timeLeft = 1500;
        this.initialTime = 1500;
        this.breakTime = 300;
        this.cycles = 0;
        this.isPaused = false;
        this.isBreak = false;
        this.sessions = JSON.parse(localStorage.getItem('focusSessions')) || [];
        this.chart = new Chart(document.getElementById('focusChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Focus Time (min)', data: [], borderColor: '#FF6F61', fill: false },
                    { label: 'Efficiency (%)', data: [], borderColor: '#FFFFFF', fill: false }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
        this.loadSessions();
    }

    startTimer() {
        if (this.timer) return;
        this.initialTime = parseInt(document.getElementById('cycleDuration').value);
        this.breakTime = parseInt(document.getElementById('breakDuration').value);
        this.timeLeft = this.isBreak ? this.breakTime : this.initialTime;
        const startTime = Date.now();
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateTimerDisplay();
                this.updateChart();

                if (this.timeLeft <= 0) {
                    this.isBreak = !this.isBreak;
                    this.timeLeft = this.isBreak ? this.breakTime : this.initialTime;
                    if (!this.isBreak) {
                        this.cycles++;
                        const taskName = document.getElementById('taskName').value || `Session ${this.cycles}`;
                        const session = {
                            task: taskName,
                            duration: this.initialTime / 60,
                            completed: true,
                            timestamp: startTime,
                            efficiency: this.calculateEfficiency()
                        };
                        this.sessions.push(session);
                        this.saveSessions();
                        this.updateMetrics();
                    }
                    document.getElementById('timerOutput').textContent = this.isBreak ? "Break Time!" : "Cycle Complete!";
                }
            }
        }, 1000);
    }

    pauseTimer() {
        this.isPaused = !this.isPaused;
        document.getElementById('timerOutput').textContent = this.isPaused ? "Paused" : this.updateTimerDisplay();
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.timeLeft = this.initialTime;
        this.isPaused = false;
        this.isBreak = false;
        this.updateTimerDisplay();
    }

    clearSessions() {
        this.sessions = [];
        this.cycles = 0;
        this.saveSessions();
        this.updateUI();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timerOutput').textContent = `${this.isBreak ? 'Break' : 'Cycle'}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        document.getElementById('streak').textContent = `Streak: ${this.getStreak()}`;
        document.getElementById('totalSessions').textContent = `${this.sessions.length}`;
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

    updateUI() {
        this.updateChart();
        this.updateMetrics();
    }
}

const focus = new FocusCore();

function startTimer() {
    focus.startTimer();
}

function pauseTimer() {
    focus.pauseTimer();
}

function resetTimer() {
    focus.resetTimer();
}

function clearSessions() {
    focus.clearSessions();
            }
