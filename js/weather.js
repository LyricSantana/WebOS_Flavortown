// Weather API Integration
const weatherManager = {
    weatherContent: document.querySelector('#weatherContent'),

    // WMO Code mappings
    weatherCodes: {
        0: { icon: '☀️', description: 'Clear sky' },
        1: { icon: '☀️', description: 'Mainly clear' },
        2: { icon: '⛅', description: 'Partly cloudy' },
        3: { icon: '☁️', description: 'Overcast' },
        45: { icon: '🌫️', description: 'Foggy' },
        48: { icon: '🌫️', description: 'Foggy' },
        51: { icon: '🌧️', description: 'Drizzle' },
        53: { icon: '🌧️', description: 'Drizzle' },
        55: { icon: '🌧️', description: 'Drizzle' },
        61: { icon: '🌧️', description: 'Rain' },
        63: { icon: '🌧️', description: 'Rain' },
        65: { icon: '🌧️', description: 'Rain' },
        71: { icon: '❄️', description: 'Snow' },
        73: { icon: '❄️', description: 'Snow' },
        75: { icon: '❄️', description: 'Snow' },
        77: { icon: '❄️', description: 'Snow' },
        80: { icon: '🌧️', description: 'Rainy' },
        81: { icon: '🌧️', description: 'Rainy' },
        82: { icon: '🌧️', description: 'Rainy' },
        85: { icon: '❄️', description: 'Snow' },
        86: { icon: '❄️', description: 'Snow' },
        95: { icon: '⛈️', description: 'Thunderstorm' },
        96: { icon: '⛈️', description: 'Thunderstorm' },
        99: { icon: '⛈️', description: 'Thunderstorm' }
    },

    getWeatherInfo(code) {
        return this.weatherCodes[code] || { icon: '🌤️', description: 'Unknown' };
    },

    init() {
        this.fetchWeather();
        setInterval(() => this.fetchWeather(), 600000);
    },

    fetchWeather() {
        fetch('https://geocoding-api.open-meteo.com/v1/search?name=Spokane%20Valley&state=Washington&country=United%20States&count=1&language=en&format=json')
            .then(response => {
                if (!response.ok) throw new Error('Geocoding failed');
                return response.json();
            })
            .then(geoData => {
                if (!geoData.results?.length) throw new Error('Location not found');
                const { latitude, longitude } = geoData.results[0];
                return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=auto`);
            })
            .then(response => {
                if (!response.ok) throw new Error('Weather request failed');
                return response.json();
            })
            .then(weatherData => {
                const { temperature_2m, weather_code } = weatherData.current;
                const temp = Math.round(temperature_2m);
                const weatherInfo = this.getWeatherInfo(weather_code);

                this.weatherContent.innerHTML = `
                    <div class="weatherIcon">${weatherInfo.icon}</div>
                    <div class="weatherInfo">
                        <p class="weatherTemp">${temp}°F</p>
                        <p class="weatherDesc">Spokane Valley</p>
                    </div>
                `;
            })
            .catch(error => {
                console.log('Weather fetch error:', error);
                this.weatherContent.innerHTML = '<p>Weather unavailable</p>';
            });
    }
};

weatherManager.init();
