const API_KEY = "6e16721118d37632436c59e0cdf18c96";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const errorText = document.getElementById("errorId");

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    displayError("Please Enter a City Name");
  }
});

// FUNCTION TO FETCH WEATHER DATA
async function fetchWeatherData(city) {
  weatherDisplay.innerHTML = "";
  errorText.textContent = "";
  weatherDisplay.classList.remove("error");
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=imperial`;

  try {
    const response = await fetch(url); // MAKING THE API REQUEST
    const data = await response.json(); // PARSING THE JSON DATA

    if (response.ok) {
      displayWeather(data);
    } else {
      displayError(`error: ${data.message|| 'City Not Found'}`);
    }
  } catch (error) {
    console.error("Error Fetching Weather Data:", error)
    displayError("Could Not Fetch Weather Data. Please Try Again Later.")
  } 
}

// FUNCTION TO DISPLAY WEATHER DATA

function displayWeather(data){
  // CHECKING IF DATA EXISTS
  if (!data || !data.main || !data.weather || !data.name){
    displayError("Unexpected Weather Data Format. Please Try Another City.");
    return;
  }
  const { name, main, weather, sys, wind } = data; //COMMON PROPERTIES

  const temperature = main.temp;
  const feelsLike = main.feels_like;
  const description = weather[0].description;
  const iconCode = weather[0].icon;
  const humidity = main.humidity;
  const windSpeed = wind.speed; // IN METERS PER SECOND
  const country = sys.country;

  // WEATHER DISPLAY HTML

  weatherDisplay.innerHTML = `
  <h2>${name}, ${country}</h2>
  <img src = "https://openweathermap.org/img/wn/${iconCode}@2x.png" alt = "${description}">
  <p class = "temperature">${Math.round(temperature)}°F</p>
  <p> Feels Like: ${Math.round(feelsLike)}°F</p>
  <p> Condition: ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
  <p> Humidity: ${humidity}%</p>
  <p> Wind Speed: ${windSpeed}m/s</p>
  `;
  weatherDisplay.classList.remove("error");

}

//DISPLAY ERROR MSG
function displayError(message) {
  weatherDisplay.innerHTML = "<p class = 'weatherDisplayText'> No weather data available, sorry.</p>";
  errorText.textContent = message;
  weatherDisplay.classList.add("error"); // REMEMBER TO ADD CSS ERROR STYLING HERE
}