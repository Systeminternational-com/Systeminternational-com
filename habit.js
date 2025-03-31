document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let habits = [];
const habitChart = new Chart(document.getElementById('habitChart'), {
    type: 'doughnut',
    data: {
        labels: ['Completed', 'Pending'],
        datasets: [{ data: [0, 0], backgroundColor: ['#00ffcc', '#e5e5e5'] }]
    }
});

const habitPool = [
    "Drink 1L of water", "Read 10 pages", "Walk 15 minutes", "Meditate for 5 minutes",
    "Write a journal entry", "Do 10 push-ups", "Plan tomorrow", "Learn a new word",
    "Call a friend", "Organize your desk"
];

function generateHabits() {
    habits = [];
    for (let i = 0; i < 5; i++) {
        const habit = habitPool[Math.floor(Math.random() * habitPool.length)];
        habits.push({ name: habit, completed: false });
    }
    updateHabitList();
    updateChart();
}

function updateHabitList() {
    const list = document.getElementById('habitList');
    list.innerHTML = habits.map((h, i) => `
        <p>
            <input type="checkbox" id="habit${i}" ${h.completed ? 'checked' : ''} onchange="toggleHabit(${i})">
            <label for="habit${i}">${h.name}</label>
        </p>
    `).join('');
}

function toggleHabit(index) {
    habits[index].completed = !habits[index].completed;
    updateChart();
}

function updateChart() {
    const completed = habits.filter(h => h.completed).length;
    const total = habits.length;
    habitChart.data.datasets[0].data = [completed, total - completed];
    habitChart.update();
    document.getElementById('completionRate').textContent = `Rate: ${total ? (completed / total * 100).toFixed(2) : 0}%`;
}
