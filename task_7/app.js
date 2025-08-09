// Weather Dashboard App
class WeatherDashboard {
    constructor() {
        this.apiKey = 'cf77fc65036e5a3d31864227c2a4adc4'; 
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.currentCity = '';
        
        this.initializeElements();
        this.attachEventListeners();
        this.checkApiKey();
    }

    initializeElements() {
        // Intro elements
        this.introSection = document.getElementById('introSection');
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.showSearchBtn = document.getElementById('showSearchBtn');
        
        // Search elements
        this.searchSection = document.getElementById('searchSection');
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.backToIntroBtn = document.getElementById('backToIntroBtn');
        this.useLocationBtn = document.getElementById('useLocationBtn');
        
        // Display elements
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherContent = document.getElementById('weatherContent');
        
        // Current weather elements
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.currentTemp = document.getElementById('currentTemp');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        
        // Forecast elements
        this.forecastContainer = document.getElementById('forecastContainer');
    }

    attachEventListeners() {
        // Intro section listeners
        this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.showSearchBtn.addEventListener('click', () => this.showSearchSection());
        
        // Search section listeners
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.backToIntroBtn.addEventListener('click', () => this.showIntroSection());
        this.useLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    checkApiKey() {
        if (!this.apiKey) {
            this.showError('Please add your OpenWeatherMap API key to app.js. Get one free at openweathermap.org/api');
            return;
        }
        
        // Show intro section by default
        this.showIntroSection();
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        await this.searchWeather(city);
    }

    async searchWeather(city) {
        if (!this.apiKey) {
            this.showError('API key is required. Please add your OpenWeatherMap API key to app.js');
            return;
        }

        this.showLoading();
        this.currentCity = city;
        
        try {
            // Get current weather and forecast in parallel
            const [currentWeather, forecast] = await Promise.all([
                this.fetchCurrentWeather(city),
                this.fetchForecast(city)
            ]);
            
            this.displayCurrentWeather(currentWeather);
            this.displayForecast(forecast);
            this.showWeatherContent();
            
            // Save to localStorage
            localStorage.setItem('lastSearchedCity', city);
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.showError(error.message);
        }
    }

    async fetchCurrentWeather(city) {
        const response = await fetch(
            `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling.`);
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            } else {
                throw new Error(`Weather data unavailable (${response.status})`);
            }
        }
        
        return await response.json();
    }

    async fetchForecast(city) {
        const response = await fetch(
            `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`Forecast data unavailable (${response.status})`);
        }
        
        return await response.json();
    }

    async fetchWeatherByCoords(lat, lon) {
        if (!this.apiKey) {
            this.showError('API key is required. Please add your OpenWeatherMap API key to app.js');
            return;
        }

        try {
            const [currentWeather, forecast] = await Promise.all([
                fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`),
                fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
            ]);

            if (!currentWeather.ok || !forecast.ok) {
                throw new Error('Unable to fetch weather data for your location');
            }

            const [currentData, forecastData] = await Promise.all([
                currentWeather.json(),
                forecast.json()
            ]);

            this.displayCurrentWeather(currentData);
            this.displayForecast(forecastData);
            this.showWeatherContent();
            
            // Update input with city name
            this.cityInput.value = currentData.name;
            this.currentCity = currentData.name;

        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            this.showError(error.message);
        }
    }

    displayCurrentWeather(data) {
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.currentDate.textContent = date;
        this.currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        this.weatherDescription.textContent = data.weather[0].description;
        this.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.humidity.textContent = `${data.main.humidity}%`;
        this.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.pressure.textContent = `${data.main.pressure} hPa`;

        // Set weather icon
        this.setWeatherIcon(data.weather[0].main, data.weather[0].icon);
    }

    displayForecast(data) {
        // Get forecast for next 3 days (excluding today)
        const dailyForecasts = this.processForecastData(data.list);
        
        this.forecastContainer.innerHTML = '';
        
        dailyForecasts.slice(0, 3).forEach(day => {
            const forecastItem = this.createForecastItem(day);
            this.forecastContainer.appendChild(forecastItem);
        });
    }

    processForecastData(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: date,
                    temps: [],
                    weather: item.weather[0],
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed
                };
            }
            
            dailyData[dateKey].temps.push(item.main.temp);
        });
        
        return Object.values(dailyData).map(day => ({
            date: day.date,
            high: Math.round(Math.max(...day.temps)),
            low: Math.round(Math.min(...day.temps)),
            weather: day.weather,
            humidity: day.humidity,
            windSpeed: day.windSpeed
        }));
    }

    createForecastItem(dayData) {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        
        const dayName = dayData.date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = dayData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        item.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-date" style="font-size: 0.9rem; color: #636e72;">${monthDay}</div>
            <div class="forecast-icon">
                <i class="${this.getWeatherIconClass(dayData.weather.main, dayData.weather.icon)}"></i>
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${dayData.high}°</span>
                <span class="forecast-low">${dayData.low}°</span>
            </div>
            <div class="forecast-desc">${dayData.weather.description}</div>
        `;
        
        return item;
    }

    setWeatherIcon(weatherMain, iconCode) {
        const iconClass = this.getWeatherIconClass(weatherMain, iconCode);
        this.weatherIcon.className = iconClass;
    }

    getWeatherIconClass(weatherMain, iconCode) {
        const isDay = iconCode.includes('d');
        
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                return isDay ? 'fas fa-sun' : 'fas fa-moon';
            case 'clouds':
                return isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
            case 'rain':
                return 'fas fa-cloud-rain';
            case 'drizzle':
                return 'fas fa-cloud-drizzle';
            case 'thunderstorm':
                return 'fas fa-bolt';
            case 'snow':
                return 'fas fa-snowflake';
            case 'mist':
            case 'smoke':
            case 'haze':
            case 'dust':
            case 'fog':
                return 'fas fa-smog';
            default:
                return 'fas fa-cloud';
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let message = 'Unable to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message += 'Location request timed out.';
                        break;
                    default:
                        message += 'Please try searching for a city instead.';
                        break;
                }
                this.showError(message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.error.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.error.classList.remove('hidden');
        this.loading.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
    }

    showWeatherContent() {
        this.weatherContent.classList.remove('hidden');
        this.loading.classList.add('hidden');
        this.error.classList.add('hidden');
    }

    hideWeatherContent() {
        this.weatherContent.classList.add('hidden');
        this.loading.classList.add('hidden');
        this.error.classList.add('hidden');
    }

    showIntroSection() {
        this.introSection.classList.remove('hidden');
        this.searchSection.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
        this.loading.classList.add('hidden');
        this.error.classList.add('hidden');
    }

    showSearchSection() {
        this.introSection.classList.add('hidden');
        this.searchSection.classList.remove('hidden');
        this.weatherContent.classList.add('hidden');
        this.loading.classList.add('hidden');
        this.error.classList.add('hidden');
        this.cityInput.focus();
    }
}

// Initialize the weather dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});

// Instructions for API Key Setup
console.log(`
🌤️  WEATHER DASHBOARD SETUP INSTRUCTIONS 🌤️

To use this weather dashboard, you need a free API key from OpenWeatherMap:

1. Go to: https://openweathermap.org/api
2. Sign up for a free account
3. Generate an API key
4. Replace the empty apiKey value in app.js with your key:
   
   this.apiKey = 'your_api_key_here';

5. Save the file and refresh the page

Features included:
✅ Real-time weather data for any city
✅ Current weather with temperature, humidity, wind speed, pressure
✅ 3-day weather forecast
✅ Geolocation support (click the location button)
✅ Search functionality with error handling
✅ Responsive, modern UI design
✅ Loading states and error messages

Enjoy your weather dashboard! 🌈
`);
