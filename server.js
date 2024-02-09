const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8081;

console.log(process.env.API_KEY);

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});

app.get('/:city', async (req, res) => {
    const city = req.params.city;

    console.log(city);

    if (!city) {
        return res
            .status(400)
            .json({ error: 'City parameter is missing', status: '400' });
    }

    const currentDayData = await getDataFromWeather('weather', city);
    const forecastData = await getDataFromWeather('forecast', city);

    console.log('Current weather data: ', currentDayData);
    console.log('Forecast data: ', forecastData);

    return res.json({ currentDayData, forecastData });
});

app.use(express.static(path.resolve(__dirname, 'frontend')));

async function getDataFromWeather(type, city) {
    console.log(
        'Fetching data from weather API',
        process.env.API_KEY,
        type,
        city
    );
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${process.env.API_KEY}&units=metric`
    );

    const data = await response.json();

    console.log('Data from weather API: ', data);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return data;
}

app.listen(port, () => console.log(`Server running on port ${port}`));
