document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

const productivityChart = new Chart(document.getElementById('productivityChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{ label: 'Task Duration (min)', data: [], backgroundColor: '#00ffcc' }]
    },
    options: { scales: { y: { beginAtZero: true } } }
});

function generatePlan() {
    const hours = parseInt(document.getElementById('hoursInput').value) || 1;
    const tasks = parseInt(document.getElementById('tasksInput').value) || 1;
    const priority = document.getElementById('priorityInput').value || "Main Task";
    
    if (hours < 1 || hours > 24 || tasks < 1 || tasks > 10) return;

    const totalMinutes = hours * 60;
    const baseTimePerTask = Math.floor(totalMinutes / tasks);
    let plan = [];
    let remainingTime = totalMinutes;

    // Priority task gets more time
    plan.push({ task: priority, duration: Math.min(baseTimePerTask * 1.5, remainingTime) });
    remainingTime -= plan[0].duration;

    // Distribute remaining time
    for (let i = 1; i < tasks; i++) {
        const duration = Math.min(baseTimePerTask, remainingTime / (tasks - i));
        plan.push({ task: `Task ${i + 1}`, duration });
        remainingTime -= duration;
    }

    // Generate schedule
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM
    let schedule = plan.map(p => {
        const start = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        currentTime.setMinutes(currentTime.getMinutes() + p.duration);
        const end = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${p.task}: ${start} - ${end} (${p.duration} min)`;
    });

    document.getElementById('planOutput').innerHTML = schedule.map(s => `<p>${s}</p>`).join('');
    productivityChart.data.labels = plan.map(p => p.task);
    productivityChart.data.datasets[0].data = plan.map(p => p.duration);
    productivityChart.update();

    const efficiency = (totalMinutes / (tasks * baseTimePerTask)) * 100;
    document.getElementById('taskEfficiency').textContent = `Efficiency: ${Math.min(efficiency, 100).toFixed(2)}%`;
}
