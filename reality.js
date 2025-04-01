document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class RealityCheck {
    constructor() {
        this.financialData = {
            retirementAge: 65,
            averageReturns: { low: 0.03, medium: 0.05, high: 0.07 },
            inflationRate: 0.02,
            retirementSavingsGoal: 1000000,
            youngAdvice: [
                "Start investing early in low-cost index funds to benefit from compound interest.",
                "Aim to save at least 15% of your income each month.",
                "Build an emergency fund covering 3-6 months of expenses."
            ],
            midAgeAdvice: [
                "Diversify your investments across stocks, bonds, and real estate.",
                "Increase your retirement contributions to 20% of your income.",
                "Consider consulting a financial advisor for personalized strategies."
            ],
            oldAgeAdvice: [
                "Shift investments to low-risk options like bonds or fixed-income securities.",
                "Plan your withdrawal strategy to ensure your savings last through retirement.",
                "Review your estate plan and ensure your will is up to date."
            ]
        };
        this.loadAdvice();
    }

    generateAdvice(age, income, expenses, savings, riskTolerance) {
        if (age < 18 || income < 0 || expenses < 0 || savings < 0) {
            alert('Invalid input. Please check your values.');
            return;
        }

        const netWorth = savings - expenses;
        const yearsToRetirement = this.financialData.retirementAge - age;
        const monthlySavings = income - expenses;
        const annualSavings = monthlySavings * 12;
        const returnRate = this.financialData.averageReturns[riskTolerance];
        const futureValue = this.calculateFutureValue(savings, annualSavings, returnRate, yearsToRetirement);
        const retirementReadiness = (futureValue / this.financialData.retirementSavingsGoal) * 100;

        let advice;
        if (age < 30) advice = this.financialData.youngAdvice;
        else if (age < 50) advice = this.financialData.midAgeAdvice;
        else advice = this.financialData.oldAgeAdvice;

        const result = { netWorth, retirementReadiness, advice };
        localStorage.setItem('realityAdvice', JSON.stringify(result));
        this.updateUI(result);
    }

    calculateFutureValue(initial, annual, rate, years) {
        let total = initial;
        for (let i = 0; i < years; i++) {
            total = (total + annual) * (1 + rate - this.financialData.inflationRate);
        }
        return total;
    }

    loadAdvice() {
        const savedAdvice = JSON.parse(localStorage.getItem('realityAdvice'));
        if (savedAdvice) this.updateUI(savedAdvice);
    }

    clearAdvice() {
        localStorage.removeItem('realityAdvice');
        this.updateUI({ netWorth: 0, retirementReadiness: 0, advice: [] });
    }

    updateUI(result) {
        document.getElementById('netWorth').textContent = `$${result.netWorth.toFixed(2)}`;
        document.getElementById('retirementReadiness').textContent = `${result.retirementReadiness.toFixed(2)}%`;
        document.getElementById('adviceOutput').innerHTML = result.advice.map(a => `<p>${a}</p>`).join('');
    }
}

const reality = new RealityCheck();

function generateAdvice() {
    const age = parseInt(document.getElementById('age').value) || 0;
    const income = parseFloat(document.getElementById('income').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    const savings = parseFloat(document.getElementById('savings').value) || 0;
    const riskTolerance = document.getElementById('riskTolerance').value;
    reality.generateAdvice(age, income, expenses, savings, riskTolerance);
}

function clearAdvice() {
    reality.clearAdvice();
                               }
