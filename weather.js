document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

let weatherData = [];
const weatherChart = new Chart(document.getElementById('weatherChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{ label: 'Temperature (°C)', data: [], borderColor: '#d4af37', fill: false }]
    },
    options: { scales: { y: { beginAtZero: false } } }
});

function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your OpenWeatherMap API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            document.getElementById('weatherOutput').textContent = `Sync: ${temp}°C, ${data.weather[0].description}`;
            weatherData.push(temp);
            weatherChart.data.labels.push(new Date().toLocaleTimeString());
            weatherChart.data.datasets[0].data = weatherData;
            weatherChart.update();

            const variance = weatherData.length > 1 ? Math.max(...weatherData) - Math.min(...weatherData) : 0;
            document.getElementById('tempVariance').textContent = `Variance: ${variance.toFixed(2)}°C`;
        })
        .catch(() => {
            document.getElementById('weatherOutput').textContent = "City not found.";
        });
}
