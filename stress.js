document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let stressFactors = [];
const stressChart = new Chart(document.getElementById('stressChart'), {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{ data: [], backgroundColor: ['#d4af37', '#00ffcc', '#ff00ff', '#1c2526'] }]
    }
});

function addStress() {
    const factor = document.getElementById('stressInput').value;
    const level = parseInt(document.getElementById('stressLevel').value) || 0;
    if (factor && level >= 1 && level <= 10) {
        stressFactors.push({ factor, level });
        updateStressList();
        updateChart();
        const avgStress = stressFactors.reduce((a, b) => a + b.level, 0) / stressFactors.length;
        document.getElementById('stressScore').textContent = `Score: ${avgStress.toFixed(2)}/10`;
    }
}

function updateStressList() {
    const list = document.getElementById('stressList');
    list.innerHTML = stressFactors.map(s => `<p>${s.factor}: ${s.level}/10</p>`).join('');
}

function updateChart() {
    stressChart.data.labels = stressFactors.map(s => s.factor);
    stressChart.data.datasets[0].data = stressFactors.map(s => s.level);
    stressChart.update();
}
