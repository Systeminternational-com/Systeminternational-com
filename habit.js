document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let habits = [];
const habitChart = new Chart(document.getElementById('habitChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{ label: 'Days Completed', data: [], backgroundColor: '#d4af37' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});

function addHabit() {
    const habit = document.getElementById('habitInput').value;
    if (habit) {
        const streak = Math.floor(Math.random() * 30); // Simulated streak
        habits.push({ name: habit, streak });
        updateHabitList();
        updateChart();
        document.getElementById('streakScore').textContent = `Score: ${Math.max(...habits.map(h => h.streak))}`;
    }
}

function updateHabitList() {
    const list = document.getElementById('habitList');
    list.innerHTML = habits.map(h => `<p>${h.name}: ${h.streak} days</p>`).join('');
}

function updateChart() {
    habitChart.data.labels = habits.map(h => h.name);
    habitChart.data.datasets[0].data = habits.map(h => h.streak);
    habitChart.update();
}
