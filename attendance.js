document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class AttendanceManager {
    constructor() {
        this.subjects = JSON.parse(localStorage.getItem('attendanceData')) || [];
        this.history = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
        this.chart = new Chart(document.getElementById('attendanceChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Attendance %', data: [], borderColor: '#00FFCC', fill: false },
                    { label: 'Trend', data: [], borderColor: '#FFFFFF', fill: false }
                ]
            },
            options: {
                scales: { y: { beginAtZero: true, max: 100 } },
                plugins: { legend: { display: true } }
            }
        });
        this.loadData();
    }

    addSubject(name, attended, total, semester, instructor, goal) {
        if (!name || total <= 0 || attended < 0 || attended > total || !instructor) {
            alert('Invalid input. Please check your values.');
            return;
        }
        const percentage = (attended / total) * 100;
        const subject = { name, attended, total, percentage, semester, instructor, goal, date: new Date().toISOString() };
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

    clearData() {
        this.subjects = [];
        this.history = [];
        this.saveData();
        this.updateUI();
    }

    calcAttendance() {
        if (!this.subjects.length) return { totalPercentage: 0, perfScore: 'N/A', consistency: 'N/A', goalProgress: 'N/A' };
        
        const totalAttended = this.subjects.reduce((sum, s) => sum + s.attended, 0);
        const totalDays = this.subjects.reduce((sum, s) => sum + s.total, 0);
        const totalPercentage = (totalAttended / totalDays) * 100;

        const avgAttendance = totalPercentage;
        const perfScore = avgAttendance > 85 ? 'A+' : avgAttendance > 75 ? 'A' : avgAttendance > 65 ? 'B' : 'C';
        const consistency = this.calculateConsistency();
        const goal = this.subjects.length ? parseInt(this.subjects[0].goal) : 75;
        const goalProgress = (avgAttendance / goal) * 100;

        return { totalPercentage, perfScore, consistency, goalProgress };
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
            <p>${s.name} (Sem ${s.semester}, ${s.instructor}): ${s.attended}/${s.total} (${s.percentage.toFixed(2)}%) - Goal: ${s.goal}%</p>
        `).join('');

        const { totalPercentage, perfScore, consistency, goalProgress } = this.calcAttendance();
        document.getElementById('attendanceOutput').textContent = `${totalPercentage.toFixed(2)}%`;
        document.getElementById('perfScore').textContent = `Score: ${perfScore}`;
        document.getElementById('consistency').textContent = `Index: ${consistency.toFixed(2)}%`;
        document.getElementById('goalProgress').textContent = `Progress: ${goalProgress.toFixed(2)}%`;

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
    const semester = document.getElementById('semesterSelect').value;
    const instructor = document.getElementById('instructorName').value || "Unknown";
    const goal = document.getElementById('attendanceGoal').value;
    manager.addSubject(name, attended, total, semester, instructor, goal);
}

function exportReport() {
    manager.exportReport();
}

function clearData() {
    manager.clearData();
    }
