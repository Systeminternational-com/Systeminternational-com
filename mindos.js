document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

class Mindos {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('mindosScores')) || { math: 0, logic: 0, memory: 0, speed: 0 };
        this.history = JSON.parse(localStorage.getItem('mindosHistory')) || [];
        this.currentPuzzle = null;
        this.startTime = null;
        this.chart = new Chart(document.getElementById('mindosChart'), {
            type: 'radar',
            data: {
                labels: ['Math', 'Logic', 'Memory', 'Speed'],
                datasets: [{ label: 'Cognitive Skills', data: [0, 0, 0, 0], backgroundColor: 'rgba(0, 255, 204, 0.2)', borderColor: '#00ffcc' }]
            },
            options: { scales: { r: { beginAtZero: true, max: 100 } } }
        });
        this.puzzles = {
            math: [
                { question: 'Solve: (12 * 15 - 30) / 5', answer: '30' },
                { question: 'What is 17% of 200?', answer: '34' }
            ],
            logic: [
                { question: 'If all Zigs are Zags and some Zags are Zogs, are some Zigs Zogs?', answer: 'maybe' },
                { question: 'A is taller than B, B is taller than C. Is A taller than C?', answer: 'yes' }
            ],
            memory: [
                { question: 'Memorize: 4, 7, 2, 9, 1. What’s the sequence?', answer: '47291' },
                { question: 'Memorize: red, blue, green. Second color?', answer: 'blue' }
            ]
        };
        this.loadStats();
    }

    generatePuzzle() {
        const types = Object.keys(this.puzzles);
        const type = types[Math.floor(Math.random() * types.length)];
        const puzzle = this.puzzles[type][Math.floor(Math.random() * this.puzzles[type].length)];
        this.currentPuzzle = { type, ...puzzle };
        this.startTime = Date.now();
        document.getElementById('puzzleOutput').innerHTML = `<p>${puzzle.question}</p>`;
        document.getElementById('answerInput').value = '';
    }

    checkAnswer() {
        if (!this.currentPuzzle) return;
        const answer = document.getElementById('answerInput').value.toLowerCase().trim();
        const timeTaken = (Date.now() - this.startTime) / 1000; // seconds
        const speedScore = Math.max(0, 100 - timeTaken * 2); // Faster = better

        if (answer === this.currentPuzzle.answer) {
            this.scores[this.currentPuzzle.type] = Math.min(100, this.scores[this.currentPuzzle.type] + 20);
            this.scores.speed = (this.scores.speed + speedScore) / 2;
            this.history.push({ ...this.currentPuzzle, timeTaken, correct: true, timestamp: Date.now() });
            document.getElementById('puzzleOutput').innerHTML += `<p>Correct! Time: ${timeTaken.toFixed(2)}s</p>`;
        } else {
            this.history.push({ ...this.currentPuzzle, timeTaken, correct: false, timestamp: Date.now() });
            document.getElementById('puzzleOutput').innerHTML += `<p>Wrong! Answer: ${this.currentPuzzle.answer}</p>`;
        }

        this.saveStats();
        this.updateUI();
        this.currentPuzzle = null;
    }

    saveStats() {
        localStorage.setItem('mindosScores', JSON.stringify(this.scores));
        localStorage.setItem('mindosHistory', JSON.stringify(this.history));
    }

    loadStats() {
        this.updateUI();
    }

    updateUI() {
        const avgScore = Object.values(this.scores).reduce((a, b) => a + b, 0) / 4;
        document.getElementById('cognitiveScore').textContent = `Score: ${avgScore.toFixed(2)}/100`;
        const strengths = Object.entries(this.scores).sort((a, b) => b[1] - a[1])[0][0];
        document.getElementById('strengths').textContent = `Strength: ${strengths.charAt(0).toUpperCase() + strengths.slice(1)}`;

        this.updateChart();
    }

    updateChart() {
        this.chart.data.datasets[0].data = [this.scores.math, this.scores.logic, this.scores.memory, this.scores.speed];
        this.chart.update();
    }

    getWeaknesses() {
        const weakest = Object.entries(this.scores).sort((a, b) => a[1] - b[1])[0];
        return weakest[1] < 50 ? weakest[0].charAt(0).toUpperCase() + weakest[0].slice(1) : 'Balanced';
    }
}

const mindos = new Mindos();

function generatePuzzle() {
    mindos.generatePuzzle();
}

function checkAnswer() {
    mindos.checkAnswer();
}
