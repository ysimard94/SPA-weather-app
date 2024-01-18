import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("5 Day Forecast");
  }

  // Retourne la barre de recherche dans la page pour faire la recherche de la météo pour une ville spécifique
  getSearch() {
    return `
                <div class="search">
                    <input type="text" name="search-city" class="search-city" id="search-city" placeholder="Enter city name">
                    <button id="search-btn" class="search-btn">Submit</button>
                </div>
                <div id="container">
                    <p style="color:white;">See the forecast every 3h for the next 5 days</p>
                </div>
        `;
  }

  // Retourne une liste de cartes avec les informations météo pour la ville recherchée pour les 5 prochains jours par interval de 3 heures
  async getWeather(city) {
    try {
      const response = await fetch(
        `/forecast?city=${encodeURIComponent(city)}`
      );

      const data = await response.json();

      console.log("Returned data : ", data);

      const toRender = this.createHtmlString(data);

      return toRender;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  createHtmlString(data) {
    if (data["cod"] != 404 && data["cod"] != 400) {
      let htmlString = "";

      for (let i in data["list"]) {
        let day = data["list"][i];

        day["weather"][0]["description"] =
          day["weather"][0]["description"][0].toUpperCase() +
          day["weather"][0]["description"].slice(1);

        htmlString += `
                      <div class="card">
                          <span class="location">${data["city"]["name"]}</span>
                          <div class="details">
                              <span class="temperature">${day["main"]["temp"]}°C <img class="weather-icon" src="http://openweathermap.org/img/wn/${day["weather"][0]["icon"]}.png"></span>
                              <span class="description">${day["weather"][0]["description"]}</span>
                              <span class="feels-like">Feels like: ${day["main"]["feels_like"]}°C</span>
                              <div class="weather-details">
                                  <div class="details-left">
                                      <span>Min:<br>${day["main"]["temp_min"]}°C</span>
                                      <span class="humidity">Humidity:<br>${day["main"]["humidity"]}%</span>
                                  </div>
                                  <div class="details-right">
                                      <span>Max:<br>${day["main"]["temp_max"]}°C</span>
                                      <span class="wind">Wind:<br>${day["wind"]["speed"]}km/h</span>
                                      <span
                                  </div>
                              </div>
                              </div>
                              <span class="date">${day["dt_txt"]}</span>
                      </div>
                      </div>
                      `;
      }
      return htmlString;
      //Sinon on retourne un message d'erreur
    } else {
      return `
                          <p style="color:white;">Please enter a valid city name</p>
                      `;
    }
  }
}
