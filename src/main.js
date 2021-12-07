// importing the sass stylesheet for bundling
import "./../sass/styles.scss";
import "./../css/weather-icons-wind.css";
import "./../css/weather-icons-wind.min.css";
import "./../css/weather-icons.css";
import "./../css/weather-icons.min.css";
import {CookieManager} from "./CookieManager";
import { Spinner } from "spin.js";
import "./../node_modules/spin.js/spin.css";

// XML Stuff
let xhr;
let xhr2;
let xmlObject;
let xmlObject2;
let cityCount = 0;
let cityList;
let cityName;
let cityName2;
let province;
let forecast;
let currentTemperature;
let lowTemperature;
let highTemperature;
let feelsLike;
let precipitation;
let humidity;
let airPressure;
let windDirection;
let windType;
let windSpeed;
let windCode;
let windCodeIcon;
let forecastIcon;

const CELCIUS = '<i class="wi wi-celsius"></i>';
const API_KEY = "6e2dfd90cdb9ff5659ffe6532cec03c3";
let data = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+",CA&mode=xml&appid=" + API_KEY;

// ---------------------------------------------- Creating Spinner Object -------------------------------------------------------------------
let loadingOverlay;

let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelectorAll(".loading-overlay")[0]);

// ---------------------------------------------- Creating Cookiemanager Object -------------------------------------------------------------
let lastCheckedCity;
let cityTracker = new CookieManager();
let cityValue;
let index;

// ------------------------------

function populateDropDown(){
    cityTracker.readCookie("lastCheckedCity");
    index = lastCheckedCity;
    for(let i=0; i < cityCount; i++){
        let option = document.createElement("option");
        option.text = xmlObject.getElementsByTagName("name")[i].textContent + ", "+ xmlObject.getElementsByTagName("province")[i].textContent;
        cityList.add(option);
    }
    //console.log(index);
    // Set the selected index to the last view city which was saved in the cookie 
    cityList.selectedIndex = index;

    // listen for the drop down menu to be changed
    cityList.addEventListener("change", onChanged);
}


function populateWeatherData(){
    // Setting the xml object to grab data from
    let weatherData = xmlObject2;
    //console.log(xmlObject2);

    // Getting City Name:
    let cityElement = weatherData.getElementsByTagName("city")[0];
    cityValue = cityElement.getAttribute("name");
    // Setting city name in HTML
    cityName2.innerHTML = "<strong>"+cityValue+"</strong>" + ", " + "<strong>"+ province+"</strong>";

    // Getting forcast:
    let forecastElement = weatherData.getElementsByTagName("weather")[0];
    let forecastValue = forecastElement.getAttribute("value");
    let forecastIconValue = forecastElement.getAttribute("icon");
    // Setting icon and forcast in HTML
    forecastIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/`+forecastIconValue+`@2x.png">`;
    forecast.innerHTML = `<strong>`+forecastValue+`</strong>`;

    // Getting Temperature Values:
    let temperatureElement = weatherData.getElementsByTagName("temperature")[0];
    let feelsLikeElement = weatherData.getElementsByTagName("feels_like")[0];
    let temperatureCurrent = temperatureElement.getAttribute("value");
    let temperatureHigh = temperatureElement.getAttribute("max");
    let temperatureMin = temperatureElement.getAttribute("min");
    let feel = feelsLikeElement.getAttribute("value");
    // Setting the temperatures in HTML
    currentTemperature.innerHTML = temperatureCurrent + CELCIUS + " Current";
    lowTemperature.innerHTML = temperatureMin + CELCIUS + " Low";
    highTemperature.innerHTML = temperatureHigh + CELCIUS + " High"; 
    feelsLike.innerHTML = "Feels like " + feel + CELCIUS;

    // Getting Percipitation Values:
    let precipitationElement = weatherData.getElementsByTagName("precipitation")[0];
    let precipitationValue = precipitationElement.getAttribute("mode");
    // If there is no precipitation value set it to 0mm
    if (precipitationValue == "no"){
        precipitation.innerHTML = "0 mm"; 
    }
    else{
        // If there is precipitation set the value
        precipitation.innerHTML =  precipitationValue;    
    }


    // Getting Humidity Values:
    let humidityElement = weatherData.getElementsByTagName("humidity")[0];
    let humidityValue = humidityElement.getAttribute("value");
    let humidityUnit = humidityElement.getAttribute("unit");
    // Setting the humidity value in HTML
    humidity.innerHTML = humidityValue+humidityUnit;

    // Getting Air Pressure Values: 
    let airPressureElement = weatherData.getElementsByTagName("pressure")[0];
    let airPressureValue = airPressureElement.getAttribute("value");
    let airPressureUnit = airPressureElement.getAttribute("unit");
    // Setting the air pressure value in HTML
    airPressure.innerHTML = airPressureValue + " " + airPressureUnit;

    // Getting Wind Values: 
    let windElement = weatherData.getElementsByTagName("wind")[0];
    let windSpeedElement = weatherData.getElementsByTagName("speed")[0];
    let windDirectionElement = weatherData.getElementsByTagName("direction")[0];
    let windDirectionValue = windDirectionElement.getAttribute("name");
    let windSpeedValue = windSpeedElement.getAttribute("value");
    let windNameValue = windSpeedElement.getAttribute("name");
    // Setting the wind direction values in HTML
    windDirection.innerHTML = windDirectionValue;
    windType.innerHTML = windNameValue;
    windSpeed.innerHTML = (windSpeedValue*3.6).toFixed(2) + " km/h" + " speed";

    // Getting Wind Code:
    let windDirectionCode = weatherData.getElementsByTagName("direction")[0];
    let windCodeValue = windDirectionCode.getAttribute("code");
    //windCode = windCodeValue.toLowerCase();
    if(windCodeValue != null){
        windCode = windCodeValue.toLowerCase();
        //windCodeValue.toLowerCase();
        windCodeIcon.innerHTML = `<i class="wi wi-wind wi-towards`+"-"+windCode+`"`+`></i><strong> Wind</strong>`;
    }
    else{

    }
    // Save selection to cookie
    detectedChange();
}

function populateCityNotFound(){
    // Setting variable to use to elimiate redundency
    let cityNotFound = "City Not Found!";
    let notAvailable = "N/A";
    // Setting all values to empty or Not available if the city is not found
    cityName2.innerHTML = `<strong>`+cityNotFound+`</strong>`;
    currentTemperature.innerHTML = notAvailable;
    lowTemperature.innerHTML = "";
    highTemperature.innerHTML = "";
    feelsLike.innerHTML = "";
    precipitation.innerHTML = notAvailable;
    humidity.innerHTML = notAvailable;
    airPressure.innerHTML = notAvailable;
    windDirection.innerHTML = notAvailable;
    windType.innerHTML = "";
    windSpeed.innerHTML = "";
    forecast.innerHTML = `<strong>`+notAvailable+`</strong>`;
    forecastIcon.innerHTML = "";
    windCodeIcon.innerHTML = notAvailable+`<strong> Wind</strong>`;
    // Save the index to the cookie
    detectedChange();
}



function detectedChange() {
    // Save data to the cookie
    cityTracker.writeCookie("lastCheckedCity", index, 365);
}


function onChanged(e) {
    // Getting the index value of the selection for further us in the cookie
    let loadingData = document.getElementById("changeTxtColor");
    loadingData.style.color = "#CCCCCC";
    let selectedElm = document.getElementById("targetDropDown");
    index = selectedElm.selectedIndex;

    // Get the city and the province seperated in order to get the XML request for hte city
    let option = cityList.selectedOptions[0];
    let current= option.value;
    let cityArray = current.split(",");
    province = cityArray[1];
    let cityOnly = cityArray[0];
    let cityNoSpace = cityOnly.replace(' ', "+");
    cityName = cityNoSpace;
    data = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+",CA&mode=xml&units=metric&appid=" + API_KEY;
    fetchData();
}

function fetchData() {
    // Fetch the data of the weather
    xhr2 = new XMLHttpRequest();
    xhr2.addEventListener("load", onLoadedWeather);
    xhr2.addEventListener("error", onErrorWeather);
    xhr2.open("GET", data, true);
    xhr2.send();
}

function onLoadedWeather() {
    // Populate weather data if it was recieved succesfully
    if (xhr2.status == 200) {
        // grab the XML response
        xmlObject2 = xhr2.responseXML;
        let loadingData = document.getElementById("changeTxtColor");
        loadingData.style.color = "#000000";
        populateWeatherData();
        
    } 
    // If error when retrieving data populate the data with city not found and N/A values
    else if (xhr2.status == 404) {
        populateCityNotFound();
        console.log("city not found");
    }
    // If there was an error retriving call the error function 
    else {
        onErrorWeather();
    }

}

function onErrorWeather(){
    // If there is an error recieving the data this will be put in the console
    console.log("*** Error has occured during AJAX data retrieval of Weather");
}

function onLoaded(e) {
    // Load the xml document to populate the drop down list with
    if (xhr.status == 200) {
        // grab the XML response
        xmlObject = xhr.responseXML;
        cityCount = xmlObject.getElementsByTagName("city").length;
        if (cityCount > 0) {
            // populate the drop down if there was no error 
            populateDropDown();
            onChanged();
            loadingOverlay.style.display = "none";
        } 
    }
    // If there was an error call the onerror function  
    else {
        onError();
    }

}

function onError(){
    // output to console if there was an error populating the drop down
    console.log("*** Error has occured during AJAX data retrieval");
}


function main() {
    // Reading the cookie 
    cityTracker.readCookie("lastCheckedCity");
    // set the saved value in the cookie to last checked city
    lastCheckedCity = cityTracker.readCookie("lastCheckedCity");

    // Targetomg all elements to be dynamically changed with new data 
    cityName2 = document.querySelector(".content__city");
    forecast = document.querySelector(".content__forecast");
    forecastIcon = document.querySelector(".content__forecasticon");
    currentTemperature = document.querySelector(".content__temperaturecurrent");
    lowTemperature = document.querySelector(".content__temperaturehigh");
    highTemperature = document.querySelector(".content__temperaturelow");
    feelsLike = document.querySelector(".content__feelslike");
    precipitation = document.querySelector(".content__precipitation");
    humidity = document.querySelector(".content__humidity");
    airPressure = document.querySelector(".content__airpressure");
    windDirection = document.querySelector(".content__winddirection");
    windType = document.querySelector(".content__windtype");
    windSpeed = document.querySelector(".content__windspeed");
    windCodeIcon = document.querySelector(".content__windicon");
    cityList = document.querySelector(".nav__menu");
    loadingOverlay = document.querySelector(".loading-overlay");

    // Get the list of cities to populate the drop down with
    xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoaded);
    xhr.addEventListener("error", onError);
    xhr.open("GET", 'cities.xml', true);
    xhr.send();

} 

main();