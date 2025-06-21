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

// Short-term forecast
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
      <h2>Short-term Forecast</h2>
      ${forecasts}
    `;
  })
  .catch(error => {
    document.getElementById('forecast').innerHTML = `<p>Unable to load forecast data.</p>`;
    console.error('Forecast API error:', error);
  });

// Weekly forecast with max temp and main weather condition
fetch(urlForecast)
  .then(response => response.json())
  .then(data => {
    const dailyMap = new Map();

    data.list.forEach(f => {
      const date = new Date(f.dt * 1000);
      const day = date.toLocaleDateString('en-GB', { weekday: 'long' });
      if (!dailyMap.has(day)) {
        dailyMap.set(day, []);
      }
      dailyMap.get(day).push({
        temp: f.main.temp,
        condition: f.weather[0].description
      });
    });

    const weeklyHTML = Array.from(dailyMap.entries()).slice(0, 5).map(([day, entries]) => {
      const maxTemp = Math.max(...entries.map(e => e.temp)).toFixed(1);
      const condition = entries[Math.floor(entries.length / 2)].condition;
      return `<p><strong>${day}</strong> - Max: ${maxTemp} °C, ${condition}</p>`;
    }).join('');

    document.getElementById('weekly').innerHTML = `
      <h2>Weekly Forecast</h2>
      ${weeklyHTML}
    `;
  })
  .catch(error => {
    document.getElementById('weekly').innerHTML = `<p>Unable to load weekly forecast.</p>`;
    console.error('Weekly forecast error:', error);
  });