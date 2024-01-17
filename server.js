const express = require('express')
const path = require('path')
const app = express()
const { PORT } = require('../WeatherApp/config')

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))

app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"))
})

app.listen(PORT)