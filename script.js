// script.js
const apiKey = '1b87aaccd7e27a2c762da2585997ff11';
const lat = 48.2811;
const lon = 14.2472;

const sunIcons = ['01d'];

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
    const icon = data.weather[0].icon;
    const iconClass = sunIcons.includes(icon) ? 'icon-sun' : '';

    document.getElementById('weather').innerHTML = `
      <h2><img class="${iconClass}" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt=""> ${desc.charAt(0).toUpperCase() + desc.slice(1)}</h2>
      <p><strong>Temperature:</strong> ${temp} °C (feels like ${feels} °C)</p>
      <p><strong>Humidity:</strong> ${humidity} %</p>
      <p><strong>Wind speed:</strong> ${wind} m/s</p>
    `;
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
      const icon = f.weather[0].icon;
      const iconClass = sunIcons.includes(icon) ? 'icon-sun' : '';
      const temp = f.main.temp.toFixed(1);
      return `<p><img class="${iconClass}" src="https://openweathermap.org/img/wn/${icon}.png" alt=""> <strong>${hours}</strong> - ${desc}, ${temp} °C</p>`;
    }).join('');

    document.getElementById('forecast').innerHTML = `
      <h2>Short-term Forecast</h2>
      ${forecasts}
    `;
  });

// Weekly forecast with min/max temp and icon
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
        condition: f.weather[0].description,
        icon: f.weather[0].icon
      });
    });

    const days = [];
    const minTemps = [];
    const maxTemps = [];

    const weeklyHTML = Array.from(dailyMap.entries()).slice(0, 5).map(([day, entries]) => {
      const temps = entries.map(e => e.temp);
      const min = Math.min(...temps).toFixed(1);
      const max = Math.max(...temps).toFixed(1);
      const middleEntry = entries[Math.floor(entries.length / 2)];
      const icon = middleEntry.icon;
      const iconClass = sunIcons.includes(icon) ? 'icon-sun' : '';
      const condition = middleEntry.condition;

      days.push(day);
      minTemps.push(parseFloat(min));
      maxTemps.push(parseFloat(max));

      return `<p><img class="${iconClass}" src="https://openweathermap.org/img/wn/${icon}.png" alt=""> <strong>${day}</strong> - Min: ${min} °C, Max: ${max} °C, ${condition}</p>`;
    }).join('');

    document.getElementById('weekly').innerHTML = `
      <h2>Weekly Forecast</h2>
      ${weeklyHTML}
    `;

    new Chart(document.getElementById("weeklyChart"), {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: "Min Temp (°C)",
            data: minTemps,
            borderColor: "#3399cc",
            backgroundColor: "#3399cc66",
            fill: true
          },
          {
            label: "Max Temp (°C)",
            data: maxTemps,
            borderColor: "#cc3333",
            backgroundColor: "#cc333366",
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Weekly Temperature Trend'
          }
        }
      }
    });
  });