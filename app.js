
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// for liveroloading your front-end
const livereload = require("livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

// the below line will help to parse the html elements
app.use(bodyParser.urlencoded({extended: true}));

// the line below will help to include css
app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    // https is imp https.get() will not take http websites
    const query = req.body.cityName;
    const apiKey ="8bba938ec3b496d8081bf05e871385ef";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    https.get(url, function (response) {
        response.on("data", function (data) {

            // The data we get from url is usually in hexadecimal code so we need to change to JSON object.
            const weatherData = JSON.parse(data);
            if(weatherData.message === 'city not found') {
                res.write("<h1>No Information regarding " + query + "</h1>");
                res.sendFile(__dirname + "/result.html");
            } else {
                const temp = weatherData.main.temp;
                const weatherDesp = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.write("<h1>The temprature in " + query + " is " + temp + " degree celsius</h1>");
                res.write("<h2>Weather in " + query + ": <span>" + weatherDesp + "</span></h2>");
                res.write("<img src='" + imgUrl + "' alt='weather image'>");

                res.sendFile(__dirname + "/result.html");
            }
        })
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
})

// request browser to reload page
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });