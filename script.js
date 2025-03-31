// Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Task Nexus
function optimizeTask() {
    const task = document.getElementById('taskInput').value;
    const output = document.getElementById('taskOutput');
    output.textContent = task ? `Task "${task}" optimized. Priority: Quantum High.` : "Input required.";
}

// Focus Core
let timer, timeLeft = 1500;
function startTimer() {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('timerOutput').textContent = "Cycle Complete.";
        }
    }, 1000);
}
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerOutput').textContent = `Cycle: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Goal Matrix
function trackGoal() {
    const goal = document.getElementById('goalInput').value;
    const output = document.getElementById('goalOutput');
    output.textContent = goal ? `Objective "${goal}" synced. Progress: 0%.` : "Define an objective.";
}

// Mood Scanner
function scanMood() {
    const moods = ["Optimal", "Flux", "Overload", "Stable"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    document.getElementById('moodOutput').textContent = `State: ${randomMood}.`;
}

// Productivity Dashboard
let productivityData = [0, 0, 0, 0, 0, 0, 0];
const productivityChart = new Chart(document.getElementById('productivityChart'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Focus Hours', data: productivityData, borderColor: '#00ffcc', fill: false }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});
function updateProductivity() {
    productivityData = productivityData.map(() => Math.random() * 5);
    productivityChart.data.datasets[0].data = productivityData;
    productivityChart.update();
}

// Expense Tracker
let expenses = [];
const expenseChart = new Chart(document.getElementById('expenseChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{ label: 'Expenses ($)', data: [], backgroundColor: '#ff00ff' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});
function addExpense() {
    const amount = parseFloat(document.getElementById('expenseInput').value);
    if (amount) {
        expenses.push(amount);
        const total = expenses.reduce((a, b) => a + b, 0);
        document.getElementById('expenseTotal').textContent = `Total: $${total.toFixed(2)}`;
        expenseChart.data.labels.push(`Item ${expenses.length}`);
        expenseChart.data.datasets[0].data = expenses;
        expenseChart.update();
    }
}

// Weather Sync (Using OpenWeather API - Replace API_KEY)
function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Get free key at openweathermap.org
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('weatherOutput').textContent = `Sync: ${data.main.temp}°C, ${data.weather[0].description}`;
        })
        .catch(() => {
            document.getElementById('weatherOutput').textContent = "City not found.";
        });
}
