document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class HabitBuilder {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.chart = new Chart(document.getElementById('habitChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Habit Completion (%)',
                    data: [],
                    borderColor: '#F97316',
                    fill: false
                }]
            },
            options: { scales: { y: { beginAtZero: true, max: 100 } } }
        });
        this.loadHabits();
    }

    addHabit(name, frequency, goal, reminderTime) {
        if (!name || goal <= 0) {
            alert('Invalid input. Please check your values.');
            return;
        }
        const habit = {
            name,
            frequency,
            goal: parseInt(goal),
            reminderTime,
            progress: 0,
            streak: 0,
            history: []
        };
        this.habits.push(habit);
        this.saveHabits();
        this.updateUI();
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    loadHabits() {
        this.updateUI();
    }

    clearHabits() {
        this.habits = [];
        this.saveHabits();
        this.updateUI();
    }

    toggleHabit(index) {
        const habit = this.habits[index];
        habit.progress++;
        if (habit.progress >= habit.goal) {
            habit.streak++;
            habit.progress = 0;
        }
        habit.history.push({ date: new Date().toISOString(), completed: habit.progress >= habit.goal });
        this.saveHabits();
        this.updateUI();
    }

    updateUI() {
        const list = document.getElementById('habitList');
        list.innerHTML = this.habits.map((h, i) => `
            <p>
                <input type="checkbox" id="habit${i}" ${h.progress >= h.goal ? 'checked' : ''} onchange="builder.toggleHabit(${i})">
                <label for="habit${i}">${h.name} (${h.frequency}, Goal: ${h.goal}, Progress: ${h.progress}/${h.goal}) - Reminder: ${h.reminderTime}</label>
            </p>
        `).join('');

        const longestStreak = this.habits.length ? Math.max(...this.habits.map(h => h.streak)) : 0;
        const completionRate = this.habits.length ? (this.habits.reduce((sum, h) => sum + (h.progress / h.goal), 0) / this.habits.length) * 100 : 0;

        document.getElementById('habitStreak').textContent = `${longestStreak} Days`;
        document.getElementById('completionRate').textContent = `${completionRate.toFixed(2)}%`;

        this.updateChart();
    }

    updateChart() {
        const history = this.habits.flatMap(h => h.history.map(hh => ({ date: hh.date, completed: hh.completed })));
        this.chart.data.labels = history.map(h => new Date(h.date).toLocaleDateString());
        this.chart.data.datasets[0].data = history.map(h => h.completed ? 100 : 0);
        this.chart.update();
    }
}

const builder = new HabitBuilder();

function addHabit() {
    const name = document.getElementById('habitName').value;
    const frequency = document.getElementById('habitFrequency').value;
    const goal = parseInt(document.getElementById('habitGoal').value) || 1;
    const reminderTime = document.getElementById('reminderTime').value;
    builder.addHabit(name, frequency, goal, reminderTime);
}

function clearHabits() {
    builder.clearHabits();
        }
