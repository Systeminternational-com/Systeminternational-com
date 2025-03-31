document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let productivityData = [0, 0, 0, 0, 0, 0, 0];
const productivityChart = new Chart(document.getElementById('productivityChart'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Focus Hours', data: productivityData, borderColor: '#d4af37', fill: false }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});

function updateProductivity() {
    productivityData = productivityData.map(() => Math.random() * 10);
    productivityChart.data.datasets[0].data = productivityData;
    productivityChart.update();

    const peak = Math.max(...productivityData);
    const peakDay = productivityChart.data.labels[productivityData.indexOf(peak)];
    document.getElementById('peakDay').textContent = `Day: ${peakDay}`;
    const avg = productivityData.reduce((a, b) => a + b, 0) / 7;
    document.getElementById('avgHours').textContent = `Hours: ${avg.toFixed(2)}`;
}
