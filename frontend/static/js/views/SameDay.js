import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Forecast for today');
    }

    // Retourne la barre de recherche dans la page pour faire la recherche de la météo pour une ville spécifique
    getSearch() {
        return `
                <div class="search">
                    <input type="text" name="search-city" class="search-city" id="search-city" placeholder="Enter city name">
                    <button id="search-btn" class="search-btn"><span class="material-symbols-outlined">
                    search
                    </span></button>
                </div>
                <div id="container">
                    <p>See the forecast for today</p>
                </div>
        `;
    }

    // Retourne une liste de cartes avec l'information de la météo d'aujourd'hui pour la ville recherchée
    async getWeather(city) {
        try {
            const response = await fetch(`/${city}`);

            console.log('Response from server:', response);

            const data = await response.json();

            console.log('Returned data :', data);

            const toRender = this.createHtmlString(data);

            return toRender;

            // return toRender;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    createHtmlString(data) {
        let htmlString = '';
        let delay = 0;
        console.log(data.currentDayData.main.humidity);
        if (data['cod'] != 404 && data['cod'] != 400) {
            data.currentDayData.weather[0].description =
                data.currentDayData.weather[0].description[0].toUpperCase() +
                data.currentDayData.weather[0].description.slice(1);
            htmlString = `
            <h2>Current weather</h2>
            <div class="card-current-weather fade-in">
                <div class="location-container">
                  <span class="location">${data.currentDayData.name}, ${
                data.currentDayData.sys.country
            }</span>
                  <img class="weather-icon" src="http://openweathermap.org/img/wn/${
                      data.currentDayData.weather[0].icon
                  }.png">
                </div>
                <div class="details">
                    <span class="temperature">${Math.round(
                        data.currentDayData.main.temp
                    )}°C</span>
                    <span class="description">${
                        data.currentDayData.weather[0].description
                    }</span>
                    <span class="feels-like">Feels like: ${
                        data.currentDayData.main.feels_like
                    }°C</span>
                    <div class="weather-details">
                        <div class="details-left">
                            <span>Min:<br>${
                                data.currentDayData.main.temp_min
                            }°C</span>
                            <span class="humidity">Humidity:<br>${
                                data.currentDayData.main.humidity
                            }%</span>
                        </div>
                        <div class="details-right">
                            <span>Max:<br>${
                                data.currentDayData.main.temp_max
                            }°C</span>
                            <span class="wind">Wind:<br>${
                                data.currentDayData.wind.speed
                            }km/h</span>
                            <span
                        </div>
                    </div>
                </div>
                </div>
            </div>
            `;

            htmlString += `<h2>Forecast over the next 5 days</h2>
            <div class="forecast-container">`;

            for (let i in data.forecastData.list) {
                let day = data.forecastData.list[i];
                delay += 100;

                day.weather[0].description =
                    day.weather[0].description[0].toUpperCase() +
                    day.weather[0].description.slice(1);

                htmlString += `
                                <div class="card fade-in" style="animation-delay: ${delay}ms">
                                    <div class="details">
                                        <span class="temperature">${Math.round(
                                            day.main.temp
                                        )}°C <img class="weather-icon" src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                }.png"></span>
                                        <span class="description">${
                                            day.weather[0].description
                                        }</span>
                                        <span class="feels-like">Feels like: ${
                                            day.main.feels_like
                                        }°C</span>
                                        <div class="weather-details">
                                            <div class="details-left">
                                                <span>Min:<br>${
                                                    day.main.temp_min
                                                }°C</span>
                                                <span class="humidity">Humidity:<br>${
                                                    day.main.humidity
                                                }%</span>
                                            </div>
                                            <div class="details-right">
                                                <span>Max:<br>${
                                                    day.main.temp_max
                                                }°C</span>
                                                <span class="wind">Wind:<br>${
                                                    day.wind.speed
                                                }km/h</span>
                                                <span
                                            </div>
                                        </div>
                                        </div>
                                        <span class="date">${day.dt_txt}</span>
                                    </div>
                                </div>
                              `;
            }

            return htmlString;
            // Sinon, on retourne une chaine HTML avec un message d'erreur
        } else {
            return `
                    <p style="color:white;">Please enter a valid city name</p>
                `;
        }
    }
}
