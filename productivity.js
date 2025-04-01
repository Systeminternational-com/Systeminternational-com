document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class ProductivityDash {
    constructor() {
        this.plans = JSON.parse(localStorage.getItem('productivityPlans')) || [];
        this.chart = new Chart(document.getElementById('productivityChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    { label: 'Task Duration (min)', data: [], backgroundColor: '#22C55E' },
                    { label: 'Priority Weight', data: [], backgroundColor: '#FFFFFF' }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
        this.loadPlans();
    }

    generatePlan(hours, tasks, priorityTask, priorityLevel, timePreference) {
        if (hours < 1 || hours > 24 || tasks < 1 || tasks > 10 || !priorityTask) {
            alert('Invalid input. Please check your values.');
            return;
        }

        const totalMinutes = hours * 60;
        const plan = [];
        const priorityWeight = parseInt(priorityLevel);
        const baseTime = Math.floor(totalMinutes / (tasks + priorityWeight - 1));
        let remainingTime = totalMinutes;

        // Priority task
        const priorityDuration = Math.min(baseTime * priorityWeight, remainingTime);
        plan.push({ task: priorityTask, duration: priorityDuration, priority: true, completed: false });
        remainingTime -= priorityDuration;

        // Other tasks with dynamic weighting
        const taskWeights = Array(tasks - 1).fill(1).map(() => 0.8 + Math.random() * 0.4);
        const totalWeight = taskWeights.reduce((a, b) => a + b, 0);
        for (let i = 0; i < tasks - 1; i++) {
            const duration = Math.min(Math.floor((taskWeights[i] / totalWeight) * remainingTime), remainingTime);
            plan.push({ task: `Task ${i + 2}`, duration, priority: false, completed: false });
            remainingTime -= duration;
        }

        // Schedule with breaks
        const schedule = this.createSchedule(plan, timePreference);
        this.plans.push({ date: new Date().toISOString(), schedule });
        this.savePlans();
        this.updateUI(schedule);
    }

    createSchedule(plan, timePreference) {
        let startHour;
        switch (timePreference) {
            case 'morning': startHour = 9; break;
            case 'afternoon': startHour = 13; break;
            case 'evening': startHour = 18; break;
            default: startHour = 9;
        }

        let currentTime = new Date();
        currentTime.setHours(startHour, 0, 0, 0);
        return plan.map((p, i) => {
            const start = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            currentTime.setMinutes(currentTime.getMinutes() + p.duration);
            const end = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (i < plan.length - 1) currentTime.setMinutes(currentTime.getMinutes() + 5); // 5-min break
            return { ...p, start, end };
        });
    }

    savePlans() {
        localStorage.setItem('productivityPlans', JSON.stringify(this.plans));
    }

    loadPlans() {
        if (this.plans.length) this.updateUI(this.plans[this.plans.length - 1].schedule);
    }

    clearPlan() {
        this.plans = [];
        this.savePlans();
        this.updateUI([]);
    }

    updateUI(schedule) {
        const output = document.getElementById('planOutput');
        output.innerHTML = schedule.map((s, i) => `
            <p>
                <input type="checkbox" id="task${i}" ${s.completed ? 'checked' : ''} onchange="dash.toggleTask(${i})">
                <label for="task${i}">${s.task}: ${s.start} - ${s.end} (${s.duration} min)</label>
            </p>
        `).join('');

        this.updateChart(schedule);
        this.updateMetrics(schedule);
    }

    toggleTask(index) {
        const latestPlan = this.plans[this.plans.length - 1].schedule;
        latestPlan[index].completed = !latestPlan[index].completed;
        this.savePlans();
        this.updateUI(latestPlan);
    }

    updateChart(schedule) {
        this.chart.data.labels = schedule.map(s => s.task);
        this.chart.data.datasets[0].data = schedule.map(s => s.duration);
        this.chart.data.datasets[1].data = schedule.map(s => s.priority ? 100 : 50);
        this.chart.update();
    }

    updateMetrics(schedule) {
        const completed = schedule.filter(s => s.completed).length;
        const total = schedule.length;
        const efficiency = total ? (completed / total) * 100 : 0;
        document.getElementById('taskEfficiency').textContent = `Efficiency: ${efficiency.toFixed(2)}%`;
        document.getElementById('completionRate').textContent = `Rate: ${efficiency.toFixed(2)}%`;
    }
}

const dash = new ProductivityDash();

function generatePlan() {
    const hours = parseInt(document.getElementById('hoursInput').value) || 1;
    const tasks = parseInt(document.getElementById('tasksInput').value) || 1;
    const priority = document.getElementById('priorityInput').value || "Main Task";
    const priorityLevel = document.getElementById('priorityLevel').value;
    const timePreference = document.getElementById('timePreference').value;
    dash.generatePlan(hours, tasks, priority, priorityLevel, timePreference);
}

function clearPlan() {
    dash.clearPlan();
            }
