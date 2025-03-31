document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let currentPuzzle, scores = { math: 0, logic: 0, memory: 0 }, attempts = 0;
const mindosChart = new Chart(document.getElementById('mindosChart'), {
    type: 'bar',
    data: {
        labels: ['Math', 'Logic', 'Memory'],
        datasets: [{ label: 'Score', data: [0, 0, 0], backgroundColor: '#00ffcc' }]
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
});

const puzzles = [
    { type: 'math', question: 'What is 7 * 8?', answer: '56' },
    { type: 'logic', question: 'If A is B’s brother and B is C’s sister, is A related to C?', answer: 'yes' },
    { type: 'memory', question: 'Memorize: 3, 9, 2, 7. What’s the 3rd number?', answer: '2' }
];

function generatePuzzle() {
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    document.getElementById('puzzleOutput').innerHTML = `<p>${currentPuzzle.question}</p>`;
    document.getElementById('answerInput').value = '';
}

function checkAnswer() {
    const answer = document.getElementById('answerInput').value.toLowerCase().trim();
    if (answer === currentPuzzle.answer) {
        scores[currentPuzzle.type] += 20;
        attempts++;
        updateChart();
        document.getElementById('puzzleOutput').innerHTML += `<p>Correct!</p>`;
    } else {
        document.getElementById('puzzleOutput').innerHTML += `<p>Wrong! Answer was ${currentPuzzle.answer}</p>`;
    }

    const avgScore = (scores.math + scores.logic + scores.memory) / 3;
    document.getElementById('cognitiveScore').textContent = `Score: ${avgScore.toFixed(2)}/100`;
    const strengths = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    document.getElementById('strengths').textContent = `Strength: ${strengths.charAt(0).toUpperCase() + strengths.slice(1)}`;
}

function updateChart() {
    mindosChart.data.datasets[0].data = [scores.math, scores.logic, scores.memory];
    mindosChart.update();
}
