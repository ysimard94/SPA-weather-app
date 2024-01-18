const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8081;

console.log(process.env.API_KEY);

app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);

app.get("/forecast", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City parameter is missing" });
  }

  const data = await getDataFromWeather("forecast", city);

  console.log(data);
  return res.json(data);
});

app.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

async function getDataFromWeather(type, city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${process.env.API_KEY}&units=metric`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return data;
}

app.listen(port, () => console.log(`Server running on port ${port}`));
