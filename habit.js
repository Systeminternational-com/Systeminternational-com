document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class HabitBuilder {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.history = JSON.parse(localStorage.getItem('habitHistory')) || {};
        this.chart = new Chart(document.getElementById('habitChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    { label: 'Completion (%)', data: [], backgroundColor: '#00ffcc' },
                    { label: 'Difficulty', data: [], backgroundColor: '#e5e5e5' }
                ]
            },
            options: { scales: { y: { beginAtZero: true, max: 100 } } }
        });
        this.habitPool = [
            { name: "Drink 1L of water", difficulty: 1 }, { name: "Read 20 pages", difficulty: 3 },
            { name: "Run 5km", difficulty: 5 }, { name: "Meditate for 10 minutes", difficulty: 2 },
            { name: "Write 500 words", difficulty: 4 }, { name: "Do 20 push-ups", difficulty: 3 },
            { name: "Learn a new skill (30 min)", difficulty: 5 }, { name: "Call a friend", difficulty: 1 },
            { name: "Organize your workspace", difficulty: 2 }, { name: "No social media for 2 hours", difficulty: 4 }
        ];
        this.loadHabits();
    }

    generateHabits() {
        this.habits = [];
        const today = new Date().toDateString();
        if (this.history[today]) return this.loadHabits(); // One set per day

        for (let i = 0; i < 5; i++) {
            const habit = this.habitPool[Math.floor(Math.random() * this.habitPool.length)];
            this.habits.push({ ...habit, completed: false, streak: 0, id: Date.now() + i });
        }
        this.history[today] = this.habits;
        this.saveHabits();
        this.updateUI();
    }

    toggleHabit(index) {
        this.habits[index].completed = !this.habits[index].completed;
        this.updateStreak(index);
        this.saveHabits();
        this.updateUI();
    }

    updateStreak(index) {
        const habit = this.habits[index];
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const prevHabits = this.history[yesterday] || [];
        const prevHabit = prevHabits.find(h => h.name === habit.name && h.completed);
        habit.streak = prevHabit ? prevHabit.streak + 1 : habit.completed ? 1 : 0;
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
        localStorage.setItem('habitHistory', JSON.stringify(this.history));
    }

    loadHabits() {
        const today = new Date().toDateString();
        this.habits = this.history[today] || this.habits;
        this.updateUI();
    }

    updateUI() {
        const list = document.getElementById('habitList');
        list.innerHTML = this.habits.map((h, i) => `
            <p>
                <input type="checkbox" id="habit${i}" ${h.completed ? 'checked' : ''} onchange="builder.toggleHabit(${i})">
                <label for="habit${i}">${h.name} (Streak: ${h.streak})</label>
            </p>
        `).join('');
        this.updateChart();
        this.updateMetrics();
    }

    updateChart() {
        const completion = this.habits.map(h => h.completed ? 100 : 0);
        this.chart.data.labels = this.habits.map(h => h.name);
        this.chart.data.datasets[0].data = completion;
        this.chart.data.datasets[1].data = this.habits.map(h => h.difficulty * 20);
        this.chart.update();
    }

    updateMetrics() {
        const completed = this.habits.filter(h => h.completed).length;
        const total = this.habits.length;
        const rate = total ? (completed / total) * 100 : 0;
        document.getElementById('completionRate').textContent = `Rate: ${rate.toFixed(2)}%`;
    }

    getRewards() {
        const totalDifficulty = this.habits.filter(h => h.completed).reduce((a, b) => a + b.difficulty, 0);
        return totalDifficulty >= 15 ? 'Premium Badge' : totalDifficulty >= 10 ? 'Silver Badge' : 'Keep Going!';
    }
}

const builder = new HabitBuilder();

function generateHabits() {
    builder.generateHabits();
                                         }
