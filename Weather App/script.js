const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const loadingScreen = document.querySelector(".loading-container");

const weatherInfoContainer = document.querySelector(".weather-info-container");

const grantAccessBtn = document.querySelector("[date-grantAccessBtn");

const searchForm = document.querySelector("[  data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]");

const apiError = document.querySelector(".api-error-container");

// Initial Variables
const API_Key = "0578b75c213e618b2d435cb6b15d5175";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

// Get coordites from the local storage. If not present show Grant Access Container to ask user for location permission. If present call the function to show weather.
function getfromSessionStorage() {
  const localCoordinates = JSON.parse(
    sessionStorage.getItem("user-coordinates")
  );
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    fetchUserWeatherInfo(localCoordinates);
  }
}

// Get locaation while Grant Access button clicked and user gives the permission to fetch the system location.
function getLocation() {
  // Check if the Geolocation API is supported by the browser
  if (navigator.geolocation) {
    // Get the current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const userCoordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        sessionStorage.setItem(
          "user-coordinates",
          JSON.stringify(userCoordinates)
        );
        fetchUserWeatherInfo(userCoordinates);

        console.log(
          "Latitude: " +
            userCoordinates.lat +
            ", Longitude: " +
            userCoordinates.lon
        );
      },
      // Error callback
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
grantAccessBtn.addEventListener("click", getLocation);

// Using Coordinates fetch the weather data using API call
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    weatherInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    console.error("Error while fetching data : ", error);
    grantAccessBtn.classList.add("active");
    alert("Something wrong happed from the API call. Please try again.");
    // alert(`Error: ${error.message}. Please try again.`);
  }
}

// Take Data from search box and render it to the UI
async function fetchSearchUserWeatherInfo(cityName) {
  loadingScreen.classList.add("active");
  weatherInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_Key}&units=metric`
    );
    // console.log(response)
    if (!response.ok) {
      // Check for HTTP errors
      throw new Error(
        `API request failed with status "${response.statusText}" with status code ${response.status}`
      );
    }

    const data = await response.json();
    loadingScreen.classList.remove("active");

    weatherInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    apiError.classList.add("active");
    console.error("Error while fetching data : ", error);
    loadingScreen.classList.remove("active");
  }
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  apiError.classList.remove("active");

  if (cityName == "") alert("Enter City First!");
  else fetchSearchUserWeatherInfo(cityName);
});

// Render the data to the UI
function renderWeatherInfo(weatherInfo) {
  // fetch all the elements
  const cityName = document.querySelector("[data-cityName");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDesc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  console.log(weatherInfo);

  //  fetch values from weatherInfo object and put iy into UI elements
  cityName.innerText = weatherInfo?.name;
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function switchTab(newTab) {
  if (newTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = newTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //kya search form wala container is invisible, if yes then make it visible
      weatherInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      apiError.classList.remove("active");

      searchForm.classList.add("active");
    } else {
      //main pehle search wale tab pr tha, ab your weather tab visible karna h
      searchForm.classList.remove("active");
      apiError.classList.remove("active");
      weatherInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as input paramter
  switchTab(searchTab);
});

/* This code is written by Bikash Santra
Linkedin : https://www.linkedin.com/in/bikash-santra-886901217/ */
