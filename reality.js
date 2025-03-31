document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class RealityCheck {
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('realityProfiles')) || [];
        this.chart = new Chart(document.getElementById('realityChart'), {
            type: 'radar',
            data: {
                labels: ['Financial Stability', 'Skill Relevance', 'Age Factor', 'Health Index'],
                datasets: [{ label: 'Life Profile', data: [0, 0, 0, 0], backgroundColor: 'rgba(0, 255, 204, 0.2)', borderColor: '#00ffcc' }]
            },
            options: { scales: { r: { beginAtZero: true, max: 100 } } }
        });
        this.aiRiskFactors = {
            techSkills: ['programming', 'data', 'ai', 'software'],
            manualSkills: ['labor', 'construction', 'driving']
        };
        this.loadProfile();
    }

    analyzeReality(salary, skills, age, fitness) {
        if (salary < 0 || age < 0 || fitness < 1 || fitness > 10 || !skills.length) return;

        const profile = this.calculateProfile(salary, skills, age, fitness);
        this.profiles.push({ ...profile, timestamp: new Date().toISOString() });
        this.saveProfile();
        this.updateUI(profile);
    }

    calculateProfile(salary, skills, age, fitness) {
        const financialStability = Math.min((salary / 150000) * 100, 100); // Normalize to $150K
        const skillRelevance = this.calculateSkillRelevance(skills);
        const ageFactor = age <= 35 ? 100 - (age - 20) * 2 : age <= 50 ? 80 - (age - 35) : 50 - (age - 50) / 2;
        const healthIndex = fitness * 10;

        const aiImpact = this.calculateAIImpact(skillRelevance, ageFactor, financialStability, healthIndex);
        return { financialStability, skillRelevance, ageFactor, healthIndex, aiImpact, skills, salary, age, fitness };
    }

    calculateSkillRelevance(skills) {
        const techScore = skills.filter(s => this.aiRiskFactors.techSkills.some(t => s.toLowerCase().includes(t))).length * 25;
        const manualScore = skills.filter(s => this.aiRiskFactors.manualSkills.some(m => s.toLowerCase().includes(m))).length * 10;
        return Math.min(techScore - manualScore + 20, 100);
    }

    calculateAIImpact(skillRelevance, ageFactor, financialStability, healthIndex) {
        const weights = { skillRelevance: 0.4, ageFactor: 0.2, financialStability: 0.2, healthIndex: 0.2 };
        return (skillRelevance * weights.skillRelevance + ageFactor * weights.ageFactor + 
                financialStability * weights.financialStability + healthIndex * weights.healthIndex);
    }

    saveProfile() {
        localStorage.setItem('realityProfiles', JSON.stringify(this.profiles));
    }

    loadProfile() {
        if (this.profiles.length) this.updateUI(this.profiles[this.profiles.length - 1]);
    }

    updateUI(profile) {
        const output = `
            <p>Financial Stability: ${profile.financialStability.toFixed(2)}/100 ($${profile.salary})</p>
            <p>Skill Relevance: ${profile.skillRelevance.toFixed(2)}/100 (${profile.skills.join(', ')})</p>
            <p>Age Factor: ${profile.ageFactor.toFixed(2)}/100 (${profile.age} years)</p>
            <p>Health Index: ${profile.healthIndex}/100 (${profile.fitness}/10)</p>
            <p>AI Impact: ${profile.aiImpact < 50 ? 'High Risk' : profile.aiImpact < 75 ? 'Moderate Risk' : 'Low Risk'}</p>
            <p>Advice: ${this.getCareerAdvice(profile)}</p>
        `;
        document.getElementById('realityOutput').innerHTML = output;
        document.getElementById('aiImpact').textContent = `Score: ${profile.aiImpact.toFixed(2)}/100`;

        this.updateChart(profile);
    }

    updateChart(profile) {
        this.chart.data.datasets[0].data = [profile.financialStability, profile.skillRelevance, profile.ageFactor, profile.healthIndex];
        this.chart.update();
    }

    getCareerAdvice(profile) {
        if (profile.aiImpact < 50) return "Upskill in AI/tech fields urgently to stay relevant.";
        if (profile.skillRelevance < 60) return "Diversify skills with high-demand tech areas.";
        if (profile.healthIndex < 70) return "Prioritize fitness to boost long-term productivity.";
        return "Maintain your edge with continuous learning and health focus.";
    }
}

const reality = new RealityCheck();

function analyzeReality() {
    const salary = parseInt(document.getElementById('salaryInput').value) || 0;
    const skills = document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(s => s);
    const age = parseInt(document.getElementById('ageInput').value) || 0;
    const fitness = parseInt(document.getElementById('fitnessInput').value) || 0;
    reality.analyzeReality(salary, skills, age, fitness);
        }
