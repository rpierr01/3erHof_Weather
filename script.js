// script.js
const apiKey = '1b87aaccd7e27a2c762da2585997ff11';
const lat = 48.2811;
const lon = 14.2472;

// Current weather
const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;

fetch(urlCurrent)
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

// Weather forecast (next 5 forecasts, every 3h)
const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`;

fetch(urlForecast)
  .then(response => response.json())
  .then(data => {
    const forecasts = data.list.slice(0, 5).map(f => {
      const date = new Date(f.dt * 1000);
      const hours = date.getHours().toString().padStart(2, '0') + ':00';
      const desc = f.weather[0].description;
      const temp = f.main.temp.toFixed(1);
      return `<p><strong>${hours}</strong> - ${desc}, ${temp} °C</p>`;
    }).join('');

    document.getElementById('forecast').innerHTML = `
      <h2>Forecast</h2>
      ${forecasts}
    `;
  })
  .catch(error => {
    document.getElementById('forecast').innerHTML = `<p>Unable to load forecast data.</p>`;
    console.error('Forecast API error:', error);
  });