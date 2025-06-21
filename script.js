const apiKey = '1b87aaccd7e27a2c762da2585997ff11';
const lat = 48.2811;
const lon = 14.2472;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const temp = data.main.temp.toFixed(1);
    const feels = data.main.feels_like.toFixed(1);
    const desc = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    document.getElementById('weather').innerHTML = `
      <h2>${desc.charAt(0).toUpperCase() + desc.slice(1)}</h2>
      <p><strong>Temperature:</strong> ${temp} °C (feels like ${feels} °C)</p>
      <p><strong>Humidity:</strong> ${humidity} %</p>
      <p><strong>Wind speed:</strong> ${wind} m/s</p>
    `;
  })
  .catch(error => {
    document.getElementById('weather').innerHTML = `<p>Unable to load weather data. Please check your internet connection or API key.</p>`;
    console.error('API error:', error);
  });