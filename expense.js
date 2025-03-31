document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let expenses = [];
const expenseChart = new Chart(document.getElementById('expenseChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{ label: 'Expenses ($)', data: [], backgroundColor: '#d4af37' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseInput').value) || 0;
    const desc = document.getElementById('expenseDesc').value || `Item ${expenses.length + 1}`;
    if (amount > 0) {
        expenses.push({ amount, desc });
        const total = expenses.reduce((a, b) => a + b.amount, 0);
        document.getElementById('expenseTotal').textContent = `Total: $${total.toFixed(2)}`;
        expenseChart.data.labels = expenses.map(e => e.desc);
        expenseChart.data.datasets[0].data = expenses.map(e => e.amount);
        expenseChart.update();

        const trend = expenses.length > 1 ? (expenses[expenses.length - 1].amount > expenses[expenses.length - 2].amount ? 'Increasing' : 'Decreasing') : 'Stable';
        document.getElementById('spendTrend').textContent = `Trend: ${trend}`;
    }
}
