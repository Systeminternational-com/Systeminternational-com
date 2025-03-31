document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

const realityChart = new Chart(document.getElementById('realityChart'), {
    type: 'radar',
    data: {
        labels: ['Salary', 'Skills', 'Age', 'Fitness'],
        datasets: [{ label: 'Profile', data: [0, 0, 0, 0], backgroundColor: 'rgba(0, 255, 204, 0.2)', borderColor: '#00ffcc' }]
    },
    options: { scales: { r: { beginAtZero: true, max: 100 } } }
});

function analyzeReality() {
    const salary = parseInt(document.getElementById('salaryInput').value) || 0;
    const skills = document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(s => s);
    const age = parseInt(document.getElementById('ageInput').value) || 0;
    const fitness = parseInt(document.getElementById('fitnessInput').value) || 0;

    if (salary < 0 || age < 0 || fitness < 1 || fitness > 10) return;

    const salaryScore = Math.min((salary / 100000) * 100, 100); // Normalize to $100K
    const skillsScore = Math.min(skills.length * 20, 100); // 5 skills max
    const ageScore = age <= 40 ? 100 - (age - 20) * 2 : 60 - (age - 40); // Peak at 20-40
    const fitnessScore = fitness * 10;

    const aiImpact = (skillsScore * 0.4 + fitnessScore * 0.3 + salaryScore * 0.2 + ageScore * 0.1);
    document.getElementById('aiImpact').textContent = `Score: ${aiImpact.toFixed(2)}/100`;

    realityChart.data.datasets[0].data = [salaryScore, skillsScore, ageScore, fitnessScore];
    realityChart.update();

    const analysis = `
        <p>Salary: $${salary} (Score: ${salaryScore.toFixed(2)})</p>
        <p>Skills: ${skills.join(', ')} (Score: ${skillsScore.toFixed(2)})</p>
        <p>Age: ${age} (Score: ${ageScore.toFixed(2)})</p>
        <p>Fitness: ${fitness}/10 (Score: ${fitnessScore})</p>
        <p>AI Impact: ${aiImpact < 50 ? 'High risk of automation' : aiImpact < 75 ? 'Moderate risk' : 'Low risk'}</p>
    `;
    document.getElementById('realityOutput').innerHTML = analysis;
}
