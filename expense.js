document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.chart = new Chart(document.getElementById('expenseChart'), {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Expenses by Category',
                    data: [],
                    backgroundColor: ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA']
                }]
            },
            options: { plugins: { legend: { position: 'bottom' } } }
        });
        this.loadExpenses();
    }

    addExpense(name, amount, category, date, budget) {
        if (!name || amount <= 0 || !category || !date || budget < 0) {
            alert('Invalid input. Please check your values.');
            return;
        }
        const expense = { name, amount: parseFloat(amount), category, date, budget: parseFloat(budget) };
        this.expenses.push(expense);
        this.saveExpenses();
        this.updateUI();
    }

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    loadExpenses() {
        this.updateUI();
    }

    clearExpenses() {
        this.expenses = [];
        this.saveExpenses();
        this.updateUI();
    }

    updateUI() {
        const list = document.getElementById('expenseList');
        list.innerHTML = this.expenses.map(e => `
            <p>${e.name} (${e.category}): $${e.amount.toFixed(2)} on ${e.date}</p>
        `).join('');

        const totalSpent = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const budget = this.expenses.length ? this.expenses[this.expenses.length - 1].budget : 0;
        const budgetStatus = budget ? ((totalSpent / budget) * 100).toFixed(2) + '%' : 'N/A';
        const topCategory = this.getTopCategory();

        document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
        document.getElementById('budgetStatus').textContent = budgetStatus;
        document.getElementById('topCategory').textContent = topCategory;

        this.updateChart();
    }

    getTopCategory() {
        const categoryTotals = {};
        this.expenses.forEach(e => {
            categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        });
        return Object.keys(categoryTotals).length ? 
            Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) : 'N/A';
    }

    updateChart() {
        const categoryTotals = {};
        this.expenses.forEach(e => {
            categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        });
        this.chart.data.labels = Object.keys(categoryTotals);
        this.chart.data.datasets[0].data = Object.values(categoryTotals);
        this.chart.update();
    }

    exportExpenses() {
        const blob = new Blob([JSON.stringify(this.expenses, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expenses.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

const tracker = new ExpenseTracker();

function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const budget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
    tracker.addExpense(name, amount, category, date, budget);
}

function exportExpenses() {
    tracker.exportExpenses();
}

function clearExpenses() {
    tracker.clearExpenses();
}
