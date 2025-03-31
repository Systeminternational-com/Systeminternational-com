document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let subjects = [];
const attendanceChart = new Chart(document.getElementById('attendanceChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{ label: 'Attendance %', data: [], backgroundColor: '#00ffcc' }]
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
});

function addSubject() {
    const name = document.getElementById('subjectName').value;
    const attended = parseInt(document.getElementById('attendedDays').value) || 0;
    const total = parseInt(document.getElementById('totalDays').value) || 0;
    if (name && total > 0 && attended <= total) {
        const percentage = (attended / total) * 100;
        subjects.push({ name, attended, total, percentage });
        updateSubjectList();
        updateChart();
    }
}

function updateSubjectList() {
    const list = document.getElementById('subjectList');
    list.innerHTML = subjects.map(s => `<p>${s.name}: ${s.attended}/${s.total} (${s.percentage.toFixed(2)}%)</p>`).join('');
}

function calcAttendance() {
    if (subjects.length === 0) return;
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    const totalDays = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalPercentage = (totalAttended / totalDays) * 100;
    document.getElementById('attendanceOutput').textContent = `Total Attendance: ${totalPercentage.toFixed(2)}%`;

    const avgAttendance = totalPercentage;
    document.getElementById('perfScore').textContent = `Score: ${avgAttendance > 75 ? 'A' : avgAttendance > 50 ? 'B' : 'C'}`;
    const consistency = subjects.length > 1 ? Math.min(...subjects.map(s => s.percentage)) : 100;
    document.getElementById('consistency').textContent = `Index: ${consistency.toFixed(2)}%`;
}

function updateChart() {
    attendanceChart.data.labels = subjects.map(s => s.name);
    attendanceChart.data.datasets[0].data = subjects.map(s => s.percentage);
    attendanceChart.update();
}
