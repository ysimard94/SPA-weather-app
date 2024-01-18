import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Forecast for today");
  }

  // Retourne la barre de recherche dans la page pour faire la recherche de la météo pour une ville spécifique
  getSearch() {
    return `
                <div class="search">
                    <input type="text" name="search-city" class="search-city" id="search-city" placeholder="Enter city name">
                    <button id="search-btn" class="search-btn">Submit</button>
                </div>
                <div id="container">
                    <p style="color:white;">See the forecast for today</p>
                </div>
        `;
  }

  // Retourne une liste de cartes avec l'information de la météo d'aujourd'hui pour la ville recherchée
  async getWeather(city) {
    try {
      const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);

      const data = await response.json();

      console.log("Returned data :", data);

      const toRender = this.createHtmlString(data);

      return toRender;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  createHtmlString(data) {
    if (data["cod"] != 404 && data["cod"] != 400) {
      data["weather"][0]["description"] =
        data["weather"][0]["description"][0].toUpperCase() +
        data["weather"][0]["description"].slice(1);
      return `
            <div class="card">
                <span class="location">${data["name"]}</span>
                <div class="details">
                    <span class="temperature">${data["main"]["temp"]}°C <img class="weather-icon" src="http://openweathermap.org/img/wn/${data["weather"][0]["icon"]}.png"></span>
                    <span class="description">${data["weather"][0]["description"]}</span>
                    <span class="feels-like">Feels like: ${data["main"]["feels_like"]}°C</span>
                    <div class="weather-details">
                        <div class="details-left">
                            <span>Min:<br>${data["main"]["temp_min"]}°C</span>
                            <span class="humidity">Humidity:<br>${data["main"]["humidity"]}%</span>
                        </div>
                        <div class="details-right">
                            <span>Max:<br>${data["main"]["temp_max"]}°C</span>
                            <span class="wind">Wind:<br>${data["wind"]["speed"]}km/h</span>
                            <span
                        </div>
                    </div>
                </div>
            </div>
            `;
      // Sinon, on retourne une chaine HTML avec un message d'erreur
    } else {
      return `
                    <p style="color:white;">Please enter a valid city name</p>
                `;
    }
  }
}
