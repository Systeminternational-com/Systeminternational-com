document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Data Persistence and Complex State Management
class AttendanceManager {
    constructor() {
        this.subjects = JSON.parse(localStorage.getItem('attendanceData')) || [];
        this.history = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
        this.chart = new Chart(document.getElementById('attendanceChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Attendance %', data: [], borderColor: '#00ffcc', fill: false },
                    { label: 'Trend', data: [], borderColor: '#e5e5e5', fill: false }
                ]
            },
            options: {
                scales: { y: { beginAtZero: true, max: 100 } },
                plugins: { legend: { display: true } }
            }
        });
        this.loadData();
    }

    addSubject(name, attended, total) {
        if (!name || total <= 0 || attended < 0 || attended > total) return;
        const percentage = (attended / total) * 100;
        const subject = { name, attended, total, percentage, date: new Date().toISOString() };
        this.subjects.push(subject);
        this.history.push({ ...subject, timestamp: Date.now() });
        this.saveData();
        this.updateUI();
    }

    saveData() {
        localStorage.setItem('attendanceData', JSON.stringify(this.subjects));
        localStorage.setItem('attendanceHistory', JSON.stringify(this.history));
    }

    loadData() {
        this.updateUI();
    }

    calcAttendance() {
        if (!this.subjects.length) return { totalPercentage: 0, perfScore: 'N/A', consistency: 'N/A' };
        
        const totalAttended = this.subjects.reduce((sum, s) => sum + s.attended, 0);
        const totalDays = this.subjects.reduce((sum, s) => sum + s.total, 0);
        const totalPercentage = (totalAttended / totalDays) * 100;

        const avgAttendance = totalPercentage;
        const perfScore = avgAttendance > 85 ? 'A+' : avgAttendance > 75 ? 'A' : avgAttendance > 65 ? 'B' : 'C';
        const consistency = this.calculateConsistency();

        return { totalPercentage, perfScore, consistency };
    }

    calculateConsistency() {
        if (this.subjects.length < 2) return 100;
        const percentages = this.subjects.map(s => s.percentage);
        const mean = percentages.reduce((a, b) => a + b, 0) / percentages.length;
        const variance = percentages.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / percentages.length;
        return Math.max(0, 100 - Math.sqrt(variance) * 5);
    }

    updateUI() {
        const list = document.getElementById('subjectList');
        list.innerHTML = this.subjects.map(s => `
            <p>${s.name}: ${s.attended}/${s.total} (${s.percentage.toFixed(2)}%) - ${new Date(s.date).toLocaleDateString()}</p>
        `).join('');

        const { totalPercentage, perfScore, consistency } = this.calcAttendance();
        document.getElementById('attendanceOutput').textContent = `Total Attendance: ${totalPercentage.toFixed(2)}%`;
        document.getElementById('perfScore').textContent = `Score: ${perfScore}`;
        document.getElementById('consistency').textContent = `Index: ${consistency.toFixed(2)}%`;

        this.updateChart();
    }

    updateChart() {
        const trendData = this.history.map(h => ({ x: h.timestamp, y: h.percentage }));
        this.chart.data.labels = this.subjects.map(s => s.name);
        this.chart.data.datasets[0].data = this.subjects.map(s => s.percentage);
        this.chart.data.datasets[1].data = trendData.map(d => d.y);
        this.chart.data.labels = trendData.map(d => new Date(d.x).toLocaleDateString());
        this.chart.update();
    }

    exportReport() {
        const report = {
            subjects: this.subjects,
            summary: this.calcAttendance(),
            history: this.history
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_report.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

const manager = new AttendanceManager();

function addSubject() {
    const name = document.getElementById('subjectName').value;
    const attended = parseInt(document.getElementById('attendedDays').value) || 0;
    const total = parseInt(document.getElementById('totalDays').value) || 0;
    manager.addSubject(name, attended, total);
}

function calcAttendance() {
    manager.updateUI();
    // Optional: manager.exportReport(); // Uncomment to enable report export
            }
