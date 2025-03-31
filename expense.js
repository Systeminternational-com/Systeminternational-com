document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
        this.budget = JSON.parse(localStorage.getItem('budget')) || { monthly: 0 };
        this.chart = new Chart(document.getElementById('expenseChart'), {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{ label: 'Expenses ($)', data: [], backgroundColor: ['#00ffcc', '#e5e5e5', '#00e6b8', '#999', '#666'] }]
            }
        });
        this.loadExpenses();
    }

    addExpense(amount, desc) {
        if (amount <= 0 || !desc) return;
        const category = this.assignCategory(desc);
        const expense = { amount, desc, category, date: new Date().toISOString(), id: Date.now() };
        this.expenses.push(expense);
        this.saveExpenses();
        this.updateUI();
    }

    assignCategory(desc) {
        const lowerDesc = desc.toLowerCase();
        if (lowerDesc.includes('food') || lowerDesc.includes('eat')) return 'Food';
        if (lowerDesc.includes('transport') || lowerDesc.includes('travel')) return 'Transport';
        if (lowerDesc.includes('entertain') || lowerDesc.includes('movie')) return 'Entertainment';
        if (lowerDesc.includes('bill') || lowerDesc.includes('rent')) return 'Bills';
        return 'Other';
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    loadExpenses() {
        this.updateUI();
    }

    updateUI() {
        const total = this.expenses.reduce((a, b) => a + b.amount, 0);
        document.getElementById('expenseTotal').textContent = `Total: $${total.toFixed(2)}`;

        const categoryTotals = this.categories.map(cat => {
            return this.expenses.filter(e => e.category === cat).reduce((a, b) => a + b.amount, 0);
        });
        this.chart.data.labels = this.categories;
        this.chart.data.datasets[0].data = categoryTotals;
        this.chart.update();

        this.updateMetrics();
    }

    updateMetrics() {
        const monthlyExpenses = this.expenses.filter(e => {
            const date = new Date(e.date);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).reduce((a, b) => a + b.amount, 0);

        const trend = this.calculateTrend();
        document.getElementById('spendTrend').textContent = `Trend: ${trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable'} (${trend.toFixed(2)}%)`;
    }

    calculateTrend() {
        if (this.expenses.length < 2) return 0;
        const sorted = this.expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const recent = sorted.slice(-5).reduce((a, b) => a + b.amount, 0) / 5;
        const previous = sorted.slice(-10, -5).reduce((a, b) => a + b.amount, 0) / 5 || recent;
        return ((recent - previous) / previous) * 100;
    }

    setBudget(amount) {
        this.budget.monthly = amount;
        localStorage.setItem('budget', JSON.stringify(this.budget));
    }

    getBudgetStatus() {
        const monthlyExpenses = this.expenses.filter(e => {
            const date = new Date(e.date);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).reduce((a, b) => a + b.amount, 0);
        return this.budget.monthly ? ((monthlyExpenses / this.budget.monthly) * 100).toFixed(2) : 'N/A';
    }
}

const tracker = new ExpenseTracker();

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseInput').value) || 0;
    const desc = document.getElementById('expenseDesc').value || `Item ${tracker.expenses.length + 1}`;
    tracker.addExpense(amount, desc);
    // Optional: tracker.setBudget(1000); // Set monthly budget (uncomment and adjust)
    }
