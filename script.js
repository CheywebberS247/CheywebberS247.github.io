document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    localStorage.setItem('username', name);
});

function getCurrentDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour12: true
    });
    const date = now.toLocaleDateString('en-US', {
        timeZone: 'America/New_York'
    });
    return { time, date };
}

function mapWeatherCodeToDescription(code) {
    const weatherDescriptions = {
        0: 'clear sky',
        1: 'mainly clear',
        2: 'partly cloudy',
        3: 'overcast'
    };
    return weatherDescriptions[code] || 'unknown';
}

async function fetchWeather() {
    const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current_weather=true'
    );
    const data = await response.json();
    return mapWeatherCodeToDescription(data.current_weather.weathercode);
}

async function updateMessage() {
    const name = localStorage.getItem('username') || 'Guest';
    const { time, date } = getCurrentDateTime();
    const weather = await fetchWeather();

    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';

    document.getElementById('welcomeMessage').innerText =
        `${greeting} ${name}! It's ${time} EST on ${date}, and it's ${weather} right now.`;

    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
        document.getElementById('lastVisit').innerText =
            `Last visit: ${lastVisit}`;
    }

    localStorage.setItem('lastVisit', `${date} at ${time}`);
}

setInterval(updateMessage, 1000);
updateMessage();
