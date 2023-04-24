let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octuber",
  "November",
  "December",
];

let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let currentDate = document.querySelector("#date");
currentDate.innerHTML = `${day}, ${month} ${date}, ${year}  ${hours}:${minutes}`;

function search(city) {
  let apiKey = "e681516ecc3005d3d7bb306277bd0086";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#input-City").value;
  search(city);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "ed55b36e362d8733f7d859247cedeaf2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let displayTemp = document.querySelector("#current-temp");
  displayTemp.innerHTML = `${temperature} `;

  celsiusTemperature = response.data.main.temp;

  let changeCity = document.querySelector("#current-city");
  changeCity.innerHTML = response.data.name;
  console.log(response.data);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  let pressure = document.querySelector("#pressure");
  pressure.innerHTML = `Pressure: ${response.data.main.pressure} mb`;
  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}º`;
  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}º`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function currentPosition(position) {
  let apiKey = "e681516ecc3005d3d7bb306277bd0086";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function showGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}
let currentLocate = document.querySelector("#current-button");
currentLocate.addEventListener("click", showGeoLocation);

let form = document.querySelector("#city-form");
form.addEventListener("submit", handleSubmit);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
        <div class="weather-forecast-date">
           <h5>${formatDay(forecastDay.dt)}</h5>
        </div>
        <img src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" id="icon-forecast"/>
        <div class="temperature">
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temp.min
          )}º </span>
            | 
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temp.max
          )}º </span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

search("Utrecht");
