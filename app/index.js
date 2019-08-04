console.log("JayAllTheStuff Started");

/*
 * Entry point for the watch app
 */
import clock from "clock";
import { me } from "appbit";
import document from "document";
//import * as fs from "fs";

import * as messaging from "messaging";

import { HeartRateSensor } from "heart-rate";
import { today as todayActivity, goals} from "user-activity";
import { user } from "user-profile";
import { display } from "display";
import { preferences, units, locale } from "user-settings";
import { vibration } from "haptics"
import { battery } from "power";
import { charger } from "power";
import { memory } from "system";
console.log("JS memory initial: " + memory.js.used + "/" + memory.js.total);

import * as util from "../common/utils";
import * as allStrings from "./strings";
import * as activity from "./activity"
import * as hr from "./hr"
//import * as timeDate from "./timeDate"
import Weather from '../common/weather/device';

import { me as device } from "device";
const deviceType = (device.screen.width == 300 && device.screen.height == 300) ? "Versa" : "Ionic"

let clockView = document.getElementById("clock");
let statsView = document.getElementById("stats");
let forecastView = document.getElementById("forecast");

const timetxt = document.getElementById("clockLabel");
const datetxt = document.getElementById("dateLabel");

let userUnits =  units.temperature.toLowerCase();

let isBatteryAlert = false;
let wasBatteryAlert = true;
let isFetching = false;
let settings = {};
let weather = new Weather();

let today = new Date();
let time = util.hourAndMinToTime(today.getHours(), today.getMinutes());

// Update the clock every minute

let background = document.getElementById("clickbg");

let show = "clock";
let weatherInterval = null;
let openedWeatherRequest = false;

// Heart Rate Monitor
let hrm = new HeartRateSensor();
hr.drawHrm();

//let myLocale = "es";
//let myLocale = "zh";
let myLocale = locale.language.substring(0,2);

//----------------------------Messaging and Settings--------------

function drawWeatherUpdatingMsg(){
  let conditionLabel = document.getElementById("conditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  let strings = allStrings.getStrings(myLocale, "weather");
  
  conditionLabel = strings["Updating..."];
  weatherLocationLabel = "";
  weatherImage = ""; 
}

messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  //if settings[evt.data.key] != 
  if (evt.data.key === "dateFormat" && evt.data.newValue) {
    if(settings.dateFormat != Number(JSON.parse(evt.data.newValue).selected)){
      console.log(JSON.parse(evt.data.newValue).selected)
      settings.dateFormat = Number(JSON.parse(evt.data.newValue).selected);
      setDateFormat();
    }
  }
  
  if (evt.data.key === "dateColour" && evt.data.newValue) {
      let color = JSON.parse(evt.data.newValue);
      datetxt.style.fill = color;
  }
  
  if (evt.data.key === "batteryToggle" && evt.data.newValue) {
    if (settings.batteryToggle != JSON.parse(evt.data.newValue)){
      settings.batteryToggle = JSON.parse(evt.data.newValue);
      setBattery();
    }
  }
  
  if (evt.data.key === "24hToggle" && evt.data.newValue) {
    if (settings.twentyFour != JSON.parse(evt.data.newValue)){
      settings.twentyFour = JSON.parse(evt.data.newValue);
    }
  }

  if (evt.data.key === "timeColour" && evt.data.newValue) {
      var color = JSON.parse(evt.data.newValue);
      timetxt.style.fill = color;
  }
  
  if (evt.data.key === "unitToggle" && evt.data.newValue) {
    if (settings.unitToggle != JSON.parse(evt.data.newValue)){
      settings.unitToggle = JSON.parse(evt.data.newValue);
      setUnit();
    }
  }

  if (evt.data.key === "distanceUnit" && evt.data.newValue) {
    if (settings.distancUnit != JSON.parse(evt.data.newValue).values[0].value){
      settings.distanceUnit = JSON.parse(evt.data.newValue).values[0].value;
      var distUnit = `${settings.distanceUnit}`;
      setDistanceUnit(distUnit);
    }
  }

  if (evt.data.key === "isHeartbeatAnimation" && evt.data.newValue) {
    if (settings.isHeartbeatAnimation != JSON.parse(evt.data.newValue)){
      settings.isHearbeatAnimation = JSON.parse(evt.data.newValue);
      var hrset = settings.isHearbeatAnimation;
      hr.isHeartbeatAnimationSet(hrset);
    }
  }

  if (evt.data.key === "heartRateRestingVis" && evt.data.newValue) {
    if (settings.heartRateRestingVis != JSON.parse(evt.data.newValue)){
      settings.heartRateRestingVis = JSON.parse(evt.data.newValue);
      var hrset = settings.heartRateRestingVis;
      hr.setHrRestingVis(hrset);
    } 
  }
  
  if (evt.data.key === "updateInterval" && evt.data.newValue) {
    if (settings.updateInterval != Number(JSON.parse(evt.data.newValue).values[0].value)){
      var oldInterval = settings.updateInterval;
      settings.updateInterval = Number(JSON.parse(evt.data.newValue).values[0].value);
      setUpdateInterval(oldInterval);
    }
  }

  if (evt.data.key === "locationUpdateInterval" && evt.data.newValue) {
    if (settings.updateLocationInterval = Number(JSON.parse(evt.data.newValue).values[0].value)){
      var oldInterval = settings.updateLocationInterval;
      settings.updateLocationInterval = Number(JSON.parse(evt.data.newValue).values[0].value);
      setLocationUpdateInterval(oldInterval);
    }
  }

  if (evt.data.key === "dataAgeToggle" && evt.data.newValue) {
    if (settings.showDataAge != JSON.parse(evt.data.newValue)){
      settings.showDataAge = JSON.parse(evt.data.newValue);
      setDataAge();
    }
  }

  if (evt.data.key === "fetchToggle" && evt.data.newValue) {
    settings.fetchToggle = false;//JSON.parse(evt.data.newValue);
  }  

  if (evt.data.key === "colorToggle" && evt.data.newValue) {
    settings.colorToggle = JSON.parse(evt.data.newValue);
  }  

  if (evt.data.key === "color" && evt.data.newValue) {
    if (settings.color != JSON.parse(evt.data.newValue)){
      settings.color = JSON.parse(evt.data.newValue);
      setColor();
    }
  }

  if (evt.data.key === "lowColor" && evt.data.newValue) {
    if (settings.lowColor != JSON.parse(evt.data.newValue)){
      settings.lowColor = JSON.parse(evt.data.newValue);
    }
  }
  if (evt.data.key === "medColor" && evt.data.newValue) {
    if (settings.medColor != JSON.parse(evt.data.newValue)){
      settings.medColor = JSON.parse(evt.data.newValue);
    }
  }
  if (evt.data.key === "highColor" && evt.data.newValue) {
    if (settings.highColor != JSON.parse(evt.data.newValue)){
      settings.highColor = JSON.parse(evt.data.newValue);
    }
  }
  if (evt.data.key === "comColor" && evt.data.newValue) {
    if (settings.comColor != JSON.parse(evt.data.newValue)){
      settings.comColor = JSON.parse(evt.data.newValue);
    }
  }
  if (evt.data.key === "rhrToggle" && evt.data.newValue) {
    if (settings.rhrToggle != JSON.parse(evt.data.newValue)){
      settings.rhrToggle = JSON.parse(evt.data.newValue);
      updateClockData();
    }
  }
  if (evt.data.key === "settings" && evt.data.newValue) {
    if (evt.data.newValue === "kill"){
      console.log("---------------------------------------------------killing settings");
      const SETTINGS_TYPE = "cbor";
      const SETTINGS_FILE = "settings.cbor";
      try {
        fs.unlinkSync(SETTINGS_FILE, SETTINGS_TYPE);
      } catch (ex) {
        console.log(ex)
      }
      loadSettings();
    } 
  }
  if (evt.data.key === "weather" && evt.data.newValue) {
    if (evt.data.newValue === "kill"){
      console.log("---------------------------------------------------killing weather");
      const SETTINGS_TYPE = "cbor";
      const SETTINGS_FILE = "weather.cbor";
      try {
        fs.unlinkSync(SETTINGS_FILE, SETTINGS_TYPE)
      } catch (ex) {
        console.log(ex)
      }
      const SETTINGS_TYPE = "cbor";
      const SETTINGS_FILE = "forecast.cbor";
      try {
        fs.unlinkSync(SETTINGS_FILE, SETTINGS_TYPE)
      } catch (ex) {
        console.log(ex)
      }
      fetchWeather("Reset Weather");
    }
  }
  //saveSettings();
  console.log("JS memory 2nd: " + memory.js.used + "/" + memory.js.total);
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
  
  openedWeatherRequest = true;
  fetchWeather("app socket open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

//----------------Weather------------------------

function drawWeather(data){
  console.log("Drawing Weather")
  let tempLabel = document.getElementById("tempLabel");
  let conditionLabel = document.getElementById("conditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  let strings = allStrings.getStrings(myLocale, "weather");
  
  isFetching = false;
  openedWeatherRequest = false;
  
  weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather,settings.updateInterval * 60 * 1000);
  //var time = new Date();
  //time = util.hourAndMinToTime(time.getHours(), time.getMinutes());
  console.log("Weather Desc: " + data.description + ", " + data.conditionCode)
  tempLabel.text = `${data.temperature}°`;
  if (strings[util.shortenText(data.description, data.isDay)]){
    conditionLabel.text = `${strings[util.shortenText(data.description, data.isDay)]}`;
  }else{
    conditionLabel.text = `${util.shortenText(data.description, data.isDay)}`;
  }
  let timeStamp = new Date(weatherData.timestamp);
  if (timeStamp.getDate()!=today.getDate())
    timeStamp = timeStamp.getMonth()+1+"/"+timeStamp.getDate()
  else
    if ((preferences.clockDisplay == "12h" && !settings.twentyFour) && settings.timeFormat!=1){
      timeStamp = util.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
    } else {
      timeStamp = util.zeroPad(timeStamp.getHours()) + ":" + util.zeroPad(timeStamp.getMinutes());
    }

  if (settings.showDataAge) {
    if (strings[util.shortenText(data.location, data.isDay)])
      weatherLocationLabel.text = `${strings[util.shortenText(data.location, data.isDay)]} (${timeStamp})`;
    else
      weatherLocationLabel.text = `${util.shortenText(data.location, data.isDay)} (${timeStamp})`;
  } else {
    if (strings[util.shortenText(data.location, data.isDay)])
      weatherLocationLabel.text = `${strings[util.shortenText(data.location, data.isDay)]}`;
    else 
      weatherLocationLabel.text = `${util.shortenText(data.location, data.isDay)}`;

  }
  
  weatherImage.href = util.getForecastIcon(data.conditionCode, data.description, data.isDay);  
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
  drawError(error);
}

function drawError(error){
  let tempLabel = document.getElementById("tempLabel");
  let conditionLabel = document.getElementById("conditionLabel");
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  let strings = allStrings.getStrings(myLocale, "weather");
  
  weather.setMaximumAge(90 * 1000); 
  openedWeatherRequest = false;
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather, 90 * 1000);
  if (error == "No connection with the companion")
       error = "Companion Failure"
  if (JSON.stringify(error) == "{}")
       error = "Unknown"
  if (!weatherData || !weatherData.description){
    weatherImage.href = "";
    
    conditionLabel.text = strings["Updating..."];
    weatherLocationLabel.text = ``;
  } else {
    tempLabel.text = `${weatherData.temperature}°`;
    if (strings[util.shortenText(weatherData.description, weatherData.isDay)]){
      conditionLabel.text = `${strings[util.shortenText(weatherData.description, weatherData.isDay)]}`;
    }else{
      conditionLabel.text = `${weatherData.shortenText(weatherData.description, weatherData.isDay)}`;
    }
    let timeStamp = new Date(weatherData.timestamp);
    if (timeStamp.getDate()!=today.getDate())
      timeStamp = timeStamp.getMonth()+1+"/"+timeStamp.getDate()
    else {
      if ((preferences.clockDisplay == "12h" && !settings.twentyFour) && settings.timeFormat!=1){
        timeStamp = util.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
      } else {
        timeStamp = util.zeroPad(timeStamp.getHours()) + ":" + util.zeroPad(timeStamp.getMinutes());
      }
    }
    if (settings.showDataAge){
      if (strings[util.shortenText(weatherData.location, weatherData.isDay)])
        weatherLocationLabel.text = `${strings[util.shortenText(weatherData.location, weatherData.isDay)]} (${timeStamp})`;
      else
        weatherLocationLabel.text = `${util.shortenText(weatherData.location, weatherData.isDay)} (${timeStamp})`;
    } else {
      if (strings[util.shortenText(weatherData.location, weatherData.isDay)])
        weatherLocationLabel.text = `${strings[util.shortenText(weatherData.location, weatherData.isDay)]}`;
      else
        weatherLocationLabel.text = `${util.shortenText(weatherData.location, weatherData.isDay)}`;
    }
    weatherImage.href = util.getForecastIcon(weatherData.code, weatherData.description, weatherData.isDay);  
  }
}

//-------------------------------Update Functions-----------------

// Update the <text> element with the current time
function updateClock(caller) {
  //console.log("TICK from " + caller);

  // Clock view
  let clockLabel = document.getElementById("clockLabel");
  let dateLabel = document.getElementById("dateLabel");
    

  today = new Date();
  time = util.hourAndMinToTime(today.getHours(), today.getMinutes());
  //let year = today.getYear()-100+2000;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  let ampm = " am";
  
//  let strings = allStrings.getStrings(myLocale, "date");
  
  //console.log(preferences.clockDisplay);
  if (preferences.clockDisplay == "12h" && !settings.twentyFour){
    if (hours > 12){
      ampm = " pm";
      hours -= 12;
    } else if (hours == 12){
      ampm = " pm"
    }else if (hours == 0 && ampm == " am"){
      hours += 12;
    }
  } else {
    hours = util.zeroPad(hours);
    ampm = ""
  }
  

  if (!settings.dateFormat){
    settings.dateFormat = 0;
  }
  
  //dateLabel.text = util.dateParse(settings.dateFormat, myLocale);
  dateLabel.text = util.dateParse(settings.dateFormat, myLocale);// + " "+secs;

  

  if (!settings.timeFormat){
    settings.timeFormat = 0;
  }
  
  switch (settings.timeFormat) {
    case 1:
      clockLabel.textAnchor = "middle";
      clockLabel.x = device.screen.width/2
      clockLabel.text = `${hours}:${mins}`;
      break;
    case 2:
      clockLabel.textAnchor = "start";
      clockLabel.x = 10
      clockLabel.text = `${hours}:${mins}:${secs}`;
      break;
    default:
      clockLabel.textAnchor = "middle";
      clockLabel.x = device.screen.width/2
      clockLabel.text = `${hours}:${mins}${ampm}`;
      break;
  }
  updateClockData();
}

function updateClockData() {
 
  let stepsLabel = document.getElementById("stepsLabel");
  if (deviceType == "Versa")
  let calsLabel = document.getElementById("calsLabel");
//  let strings = allStrings.getStrings(myLocale, "clockData");

  if (!settings.lowColor)
    settings.lowColor = "palegoldenrod"
  if (!settings.medColor)
    settings.medColor = "#FFCC33"
  if (!settings.highColor)
    settings.highColor = "#14D3F5"
  if (!settings.comColor)
    settings.comColor = "#5BE37D"
  
  
//  stepsLabel.style.fill = 'white';
  if (deviceType == "Versa")
    calsLabel.style.fill = 'white';

  //console.log("Activated: " +hrm.heartRate);
    
  stepsLabel.style.fill = util.goalToColor(todayActivity.adjusted.steps ? todayActivity.adjusted.steps: 0, goals.steps, 
                                           settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
//  stepsLabel.text = `${(todayActivity.adjusted.steps ? todayActivity.adjusted.steps: 0).toLocaleString()} ${strings["steps"]}`;
  if (deviceType == "Versa") {
    calsLabel.style.fill = util.goalToColor(todayActivity.adjusted.calories ? todayActivity.adjusted.calories: 0, goals.calories, 
                                           settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
//    calsLabel.text = `${(todayActivity.adjusted.calories ? todayActivity.adjusted.calories: 0).toLocaleString()} ${strings["kcal"]}`;
  }
  activity.drawAllProgress();
}

function setDistanceUnit(dUnit){
  console.log("Distance Unit: " + settings.distanceUnit);
  updateStatsData()
  
}

function updateStatsData(){

  if (isBatteryAlert != wasBatteryAlert){
    if (isBatteryAlert){
      let stepStatsLabel = document.getElementById("stepStats-label");
      let stepsStatsImage = document.getElementById("stepsStats-image");
      stepsStatsImage.x = 44
      stepStatsLabel.x = 65
    } else {
      let stepStatsLabel = document.getElementById("stepStats-label");
      let stepsStatsImage = document.getElementById("stepsStats-image");
      stepsStatsImage.x = 0
      stepStatsLabel.x = 25
    }
  }

  activity.drawAllProgress();

  if (show == "stats" && display.on){
///    let strings = allStrings.getStrings(myLocale, "stats");
    let screenWidth = device.screen.width;
    let maxLine = screenWidth * .9;

    if (!settings.lowColor)
      settings.lowColor = "tomato"
    if (!settings.medColor)
      settings.medColor = "#FFCC33"
    if (!settings.highColor)
      settings.highColor = "#14D3F5"
    if (!settings.comColor)
      settings.comColor = "#5BE37D"

    // Stats View
    let stepStatsLabel = document.getElementById("stepStats-label");
//    let stepStatsLineBack = document.getElementById("stepStats-line-back");
    let stepStatsLine = document.getElementById("stepStats-line");
    let stepStatsContainer = document.getElementById("stepStats");
    let stepStatsTgtYes = stepStatsContainer.getElementsByClassName("stats-tgt-yes")[0];
    let stepStatsTgtNo = stepStatsContainer.getElementsByClassName("stats-tgt-no")[0];
    let stepsStatsColor = util.goalToColor(todayActivity.adjusted.steps, goals.steps, settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
    
    let distStatsLabel = document.getElementById("distStats-label");
//    let distStatsLineBack = document.getElementById("distStats-line-back");
    let distStatsLine = document.getElementById("distStats-line");
    let distStatsContainer = document.getElementById("distStats");
    let distStatsTgtYes = distStatsContainer.getElementsByClassName("stats-tgt-yes")[0];
    let distStatsTgtNo = distStatsContainer.getElementsByClassName("stats-tgt-no")[0];
    let distStatsColor = util.goalToColor(todayActivity.adjusted.distance, goals.distance, settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
    
    let floorsStatsLabel = document.getElementById("floorsStats-label");
//    let floorsStatsLineBack = document.getElementById("floorsStats-line-back");
    let floorsStatsLine = document.getElementById("floorsStats-line");
    let floorsStatsContainer = document.getElementById("floorsStats");
    let floorsStatsTgtYes = floorsStatsContainer.getElementsByClassName("stats-tgt-yes")[0];
    let floorsStatsTgtNo = floorsStatsContainer.getElementsByClassName("stats-tgt-no")[0];
    let floorsStatsColor = util.goalToColor(todayActivity.adjusted.elevationGain, goals.elevationGain, settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
    
    let activeStatsLabel = document.getElementById("activeStats-label");
//    let activeStatsLineBack = document.getElementById("activeStats-line-bsck");
    let activeStatsLine = document.getElementById("activeStats-line");
    let activeStatsContainer = document.getElementById("activeStats");
    let activeStatsTgtYes = activeStatsContainer.getElementsByClassName("stats-tgt-yes")[0];
    let activeStatsTgtNo = activeStatsContainer.getElementsByClassName("stats-tgt-no")[0];
    let activeStatsColor = util.goalToColor(todayActivity.adjusted.activeMinutes, goals.activeMinutes, settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
    
    let calsStatsLabel = document.getElementById("calsStats-label");
//    let calsStatsLineBack = document.getElementById("calsStats-line-back");
    let calsStatsLine = document.getElementById("calsStats-line");
    let calsStatsContainer = document.getElementById("calsStats");
    let calsStatsTgtYes = calsStatsContainer.getElementsByClassName("stats-tgt-yes")[0];
    let calsStatsTgtNo = calsStatsContainer.getElementsByClassName("stats-tgt-no")[0];
    let calsStatsColor = util.goalToColor(todayActivity.adjusted.calories, goals.calories, settings.lowColor, settings.medColor, settings.highColor, settings.comColor);
    
    
    if (deviceType == "Versa") {
      let stepGoalLabel = document.getElementById("stepGoalLabel");
      let distGoalLabel = document.getElementById("distGoalLabel");
      let floorsGoalLabel = document.getElementById("floorsGoalLabel");
      let activeGoalLabel = document.getElementById("activeGoalLabel");
      let calsGoalLabel = document.getElementById("calsGoalLabel");
      
      stepStatsLabel.style.fill = stepsStatsColor;
      stepStatsLabel.text = "Steps" + ":";
      stepGoalLabel.style.fill = stepsStatsColor;
      stepGoalLabel.text = `${todayActivity.adjusted.steps ? todayActivity.adjusted.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;
      
      distStatsLabel.style.fill = distStatsColor;
      distStatsLabel.text = "Distance" + ":";
      distGoalLabel.style.fill = distStatsColor;
      if (units.distance == "us")
        distGoalLabel.text = `${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.000621) : 0 } / ${util.round2(goals.distance*0.000621)}`;
      else
        distGoalLabel.text = `${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.001) : 0 } / ${util.round2(goals.distance*0.001)}`;
      
      floorsStatsLabel.style.fill = stepsStatsColor;
      floorsStatsLabel.text = "Floors" + ":";
      floorsGoalLabel.style.fill = stepsStatsColor;
      floorsGoalLabel.text = `${todayActivity.adjusted.elevationGain ? todayActivity.adjusted.elevationGain : 0} / ${goals.elevationGain}`;
      
      activeStatsLabel.style.fill = activeStatsColor;
      activeStatsLabel.text = "Active" + ":";
      activeGoalLabel.style.fill = activeStatsColor;
      activeGoalLabel.text = `${todayActivity.adjusted.activeMinutes ? todayActivity.adjusted.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;
 
      calsStatsLabel.style.fill = calsStatsColor;
      calsStatsLabel.text = "Calories" + ":";
      calsGoalLabel.style.fill = calsStatsColor;
      calsGoalLabel.text = `${todayActivity.adjusted.calories ? todayActivity.adjusted.calories.toLocaleString() : 0} / ${parseInt(goals.calories).toLocaleString()}`;
    } else {
      stepStatsLabel.style.fill = stepsStatsColor; 
      stepStatsLine.style.fill = stepsStatsColor;
//      stepStatsLineBack.style.fill = stepsStatsColor;
      stepStatsTgtYes.style.fill = stepsStatsColor;
      stepStatsTgtNo.style.fill = stepsStatsColor;
      if (isBatteryAlert){
        stepStatsLabel.text = `Steps: ${todayActivity.adjusted.steps ? todayActivity.adjusted.steps.toLocaleString() : 0} / ${parseInt(goals.steps/1000)}k`;
      } else {
        stepStatsLabel.text = `Steps: ${todayActivity.adjusted.steps ? todayActivity.adjusted.steps.toLocaleString() : 0} / ${goals.steps.toLocaleString()}`;
      }

      var stepStatsGoal = goals.steps;
      var stepActual = todayActivity.adjusted.steps;
//      var maxLine = screenWidth /100 * 28;
      var maxLine = screenWidth * .9;
      if(stepStatsGoal > 0) {    
        var complete = (stepActual / stepStatsGoal);
        if (complete > 1){
          complete = 1;
          stepStatsTgtYes.style.display = "inline";
          stepStatsTgtNo.style.display = "none";
        } else {
          stepStatsTgtYes.style.display = "none";
          stepStatsTgtNo.style.display = "inline";
        }
        stepStatsLine.width = maxLine*complete;
      }else{
        var width = maxLine;
        stepStatsLine.width = maxLine;
      }

      // Multiply by .000621371 to convert from meters to miles
      distStatsLabel.style.fill = distStatsColor;
      distStatsLine.style.fill = distStatsColor;
//      distStatsLineBack.style.fill = distStatsColor;
      distStatsTgtYes.style.fill = distStatsColor;
      distStatsTgtNo.style.fill = distStatsColor;

      let ud = settings.distanceUnit;
//      if (units.distance == "us"){
      if (units.distance == "us" || ud == "us"){
//        distStatsLabel.text = `Distance: ${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.000621) : 0 } / ${util.round2(goals.distance*0.000621)}`;
        distStatsLabel.text = `Miles: ${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance/1609.344) : 0 } / ${util.round2(goals.distance/1609.344)}`;

//        var distStatsGoal = util.round2(goals.distance*0.000621);
//        var distActual = util.round2(todayActivity.adjusted.distance * 0.000621);
        var distStatsGoal = util.round2(goals.distance/1609.344);
        var distActual = util.round2(todayActivity.adjusted.distance/1609.344);
        console.log("Distance: " + distActual + "/" + distStatsGoal)
  //      var maxLine = screenWidth /100 * 28;
        if(distStatsGoal > 0) {    
          var complete = (distActual / distStatsGoal);
          if (complete > 1){
            complete = 1;
            distStatsTgtYes.style.display = "inline";
            distStatsTgtNo.style.display = "none";
          }else{
            distStatsTgtYes.style.display = "none";
            distStatsTgtNo.style.display = "inline";
          }
          distStatsLine.width = maxLine*complete;
        }else{
          var width = maxLine;
          distStatsLine.width = maxLine;
        }  
      } else {
        distStatsLabel.text = `Kilometers: ${todayActivity.adjusted.distance ? util.round2(todayActivity.adjusted.distance * 0.001) : 0 } / ${util.round2(goals.distance*0.001)}`;
        var distStatsGoal = util.round2(goals.distance*0.001);
        var distActual = util.round2(todayActivity.adjusted.distance * 0.001);
        console.log("Distance: " + distActual + "/" + distStatsGoal)
  //      var maxLine = screenWidth /100 * 28;
        if(distStatsGoal > 0) {    
          var complete = (distActual / distStatsGoal);
          if (complete > 1){
            complete = 1;
            distStatsTgtYes.style.display = "inline";
            distStatsTgtNo.style.display = "none";
          }else{
            distStatsTgtYes.style.display = "none";
            distStatsTgtNo.style.display = "inline";
          }
          distStatsLine.width = maxLine*complete;
        }else{
          var width = maxLine;
          distStatsLine.width = maxLine;
        }  
      }
      floorsStatsLabel.style.fill = floorsStatsColor;
      floorsStatsLine.style.fill = floorsStatsColor;
//      floorsStatsLineBack.style.fill = floorsStatsColor;
      floorsStatsTgtYes.style.fill = floorsStatsColor;
      floorsStatsTgtNo.style.fill = floorsStatsColor;
      floorsStatsLabel.text = `Floors: ${todayActivity.adjusted.elevationGain ? todayActivity.adjusted.elevationGain : 0} / ${goals.elevationGain}`;

      var floorsStatsGoal = goals.elevationGain;
      var floorsActual = todayActivity.adjusted.elevationGain;
//      var maxLine = screenWidth /100 * 28;
      console.log("Floors: " + floorsActual + "/" + floorsStatsGoal)
      var maxLine = screenWidth * .9;
      if(floorsStatsGoal > 0) {    
        var complete = (floorsActual / floorsStatsGoal);
        if (complete > 1){
          complete = 1;
          floorsStatsTgtYes.style.display = "inline";
          floorsStatsTgtNo.style.display = "none";
        }else{
          floorsStatsTgtYes.style.display = "none";
          floorsStatsTgtNo.style.display = "inline";
        }
        floorsStatsLine.width = maxLine*complete;
      }else{
        var width = maxLine;
        floorsStatsLine.width = maxLine;
      }  

      activeStatsLabel.style.fill = activeStatsColor;
      activeStatsLine.style.fill = activeStatsColor;
//      activeStatsLineBack.style.fill = activeStatsColor;
      activeStatsTgtYes.style.fill = activeStatsColor;
      activeStatsTgtNo.style.fill = activeStatsColor;
      activeStatsLabel.text = `Active: ${todayActivity.adjusted.activeMinutes ? todayActivity.adjusted.activeMinutes.toLocaleString() : 0} / ${goals.activeMinutes}`;

      var activeStatsGoal = goals.activeMinutes;
      var activeActual = todayActivity.adjusted.activeMinutes;
//      var maxLine = screenWidth /100 * 28;
      console.log("Active: " + activeActual + "/" + activeStatsGoal)
      var maxLine = screenWidth * .9;
      if(activeStatsGoal > 0) {    
        var complete = (activeActual / activeStatsGoal);
        if (complete > 1){
          complete = 1;
          activeStatsTgtYes.style.display = "inline";
          activeStatsTgtNo.style.display = "none";
        }else{
          activeStatsTgtYes.style.display = "none";
          activeStatsTgtNo.style.display = "inline";
        }
        activeStatsLine.width = maxLine*complete;
      }else{
        var width = maxLine;
        activeStatsLine.width = maxLine;
      }  

      calsStatsLabel.style.fill = calsStatsColor;
      calsStatsLine.style.fill = calsStatsColor;
//      calsStatsLineBack.style.fill = calsStatsColor;
      calsStatsTgtYes.style.fill = calsStatsColor;
      calsStatsTgtNo.style.fill = calsStatsColor;
      calsStatsLabel.text = `Calories: ${todayActivity.adjusted.calories ? todayActivity.adjusted.calories.toLocaleString() : 0} / ${parseInt(goals.calories).toLocaleString()}`;

      var calsStatsGoal = parseInt(goals.calories);
      var calsActual = todayActivity.adjusted.calories;
//      var maxLine = screenWidth /100 * 28;
      console.log("Calories: " + calsActual + "/" + calsStatsGoal)
      var maxLine = screenWidth * .9;
      if(calsStatsGoal > 0) {    
        var complete = (calsActual / calsStatsGoal);
        if (complete > 1){
          complete = 1;
          calsStatsTgtYes.style.display = "inline";
          calsStatsTgtNo.style.display = "none";
        }else{
          calsStatsTgtYes.style.display = "none";
          calsStatsTgtNo.style.display = "inline";
        }
        calsStatsLine.width = maxLine*complete;
      }else{
        var width = maxLine;
        calsStatsLine.width = maxLine;
      }  
    }
  }
}
  
function updateForecastData(){
  if (show == "forecast" && display.on){
    
    // Forecast View
    let todayDateLabel = document.getElementById("todayDateLabel");
    let todayWeatherImage = document.getElementById("todayWeatherImage");
    let weatherImage = document.getElementById("weatherImage");
    let todayDescriptionLabel = document.getElementById("todayDescriptionLabel");
    let todayHighLabel = document.getElementById("todayHighLabel");
    let todayHighValLabel = document.getElementById("todayHighValLabel");
    let todayLowLabel = document.getElementById("todayLowLabel");
    let todayLowValLabel = document.getElementById("todayLowValLabel");

    let tomorrowDateLabel = document.getElementById("tomorrowDateLabel");
    let tomorrowWeatherImage = document.getElementById("tomorrowWeatherImage");
    let weatherImage = document.getElementById("weatherImage");
    let tomorrowDescriptionLabel = document.getElementById("tomorrowDescriptionLabel");
    let tomorrowHighLabel = document.getElementById("tomorrowHighLabel");
    let tomorrowHighValLabel = document.getElementById("tomorrowHighValLabel");
    let tomorrowLowLabel = document.getElementById("tomorrowLowLabel");
    let tomorrowLowValLabel = document.getElementById("tomorrowLowValLabel");

    let day3DateLabel = document.getElementById("day3DateLabel");
    let day3WeatherImage = document.getElementById("day3WeatherImage");
    let day3Image = document.getElementById("day3Image");
    let day3DescriptionLabel = document.getElementById("day3DescriptionLabel");
    let day3HighLabel = document.getElementById("day3HighLabel");
    let day3HighValLabel = document.getElementById("day3HighValLabel");
    let day3LowLabel = document.getElementById("day3LowLabel");
    let day3LowValLabel = document.getElementById("day3LowValLabel");
    
    let day = new Date().getDay()
    let strings = allStrings.getStrings(myLocale, "weather");

    let todayDate = new Date(forecastData.todayDate*1000).getDay();
    console.log("--Forecast Date: " + todayDate);
    if (todayDate == day) {
      console.log("---Today!")
      todayDateLabel.text  = strings["Today"].toUpperCase();
    } else {
      console.log(util.numToDay(todayDate, "long"))
      todayDateLabel.text  = strings[util.numToDay(todayDate, "long")];
    }
    todayDateLabel.style.fill = settings.color;
    todayWeatherImage.href = util.getForecastIcon(forecastData.todayCondition, 
                                                  forecastData.tomorrowDescription,
                                                  true);
    if (strings[forecastData.todayDescription])
      todayDescriptionLabel.text = strings[forecastData.todayDescription];
    else
      todayDescriptionLabel.text = forecastData.todayDescription;
    
    if (!settings.colorToggle)
      settings.colorToggle = false
    
    if (settings.colorToggle){
      todayHighLabel.style.fill = "#FFFFFF";
      todayLowLabel.style.fill = "#FFFFFF";
      tomorrowHighLabel.style.fill = "#FFFFFF";
      tomorrowLowLabel.style.fill = "#FFFFFF";
      day3HighLabel.style.fill = "#FFFFFF";
      day3LowLabel.style.fill = "#FFFFFF";
    } else {
      todayHighLabel.style.fill = "tomato";
      todayLowLabel.style.fill = "cornflowerblue";
      tomorrowHighLabel.style.fill = "tomato";
      tomorrowLowLabel.style.fill = "cornflowerblue";
      day3HighLabel.style.fill = "tomato";
      day3LowLabel.style.fill = "cornflowerblue";
    }
    
    todayHighLabel.text = strings["High"] + ": " + forecastData.todayHigh + "°"
    todayHighValLabel.text = ""
    todayLowLabel.text = strings["Low"] + ": " + forecastData.todayLow + "°"
    todayLowValLabel.text = ""
    
    let tomorrowDate = new Date(forecastData.tomorrowDate*1000).getDay();
    if (tomorrowDate == day) {
      tomorrowDateLabel.text  = strings["Today"].toUpperCase();
    } else {
      console.log(">>TOM: " + util.numToDay(todayDate, "long").toUpperCase());
      tomorrowDateLabel.text  = strings[util.numToDay(tomorrowDate, "long")].toUpperCase();
    }
    tomorrowDateLabel.style.fill = settings.color;
    tomorrowWeatherImage.href = util.getForecastIcon(forecastData.tomorrowCondition, 
                                                     forecastData.tomorrowDescription,
                                                     true);
    if (strings[forecastData.tomorrowDescription])
      tomorrowDescriptionLabel.text = strings[forecastData.tomorrowDescription];
    else
      tomorrowDescriptionLabel.text = forecastData.tomorrowDescription;
    tomorrowHighLabel.text = strings["High"] + ": " + forecastData.tomorrowHigh + "°"
    tomorrowHighValLabel.text = ""
    tomorrowLowLabel.text = strings["Low"] + ": " + forecastData.tomorrowLow + "°"
    tomorrowLowValLabel.text = ""
    
    
    let day3Date = new Date(forecastData.day3Date*1000).getDay();
    if (day3Date == day) {
      day3DateLabel.text  = strings["Today"].toUpperCase();
    } else {
      day3DateLabel.text  = strings[util.numToDay(day3Date, "long")].toUpperCase();
    }   
    day3DateLabel.style.fill = settings.color;
    day3WeatherImage.href = util.getForecastIcon(forecastData.day3Condition, 
                                                 forecastData.day3Description,
                                                 true);
    if (strings[forecastData.day3Description])
      day3DescriptionLabel.text = strings[forecastData.day3Description];
    else
      day3DescriptionLabel.text = forecastData.day3Description;
    day3HighLabel.text = strings["High"] + ": " +  forecastData.day3High + "°"
    day3HighValLabel.text = "";
    day3LowLabel.text = strings["Low"] + ": " + forecastData.day3Low + "°"
    day3LowValLabel.text = ""
  }
}


//------------------Settings and FS--------------------

function applySettings(startIndex = 0){
  let functions = [
      setDateFormat,
      setBattery,
      setUpdateInterval,
      setLocationUpdateInterval,
      setColor,
      setDataAge,
      setUnit
//      setWeatherScroll,
//      setLocationScroll
    ]
  for (let i = startIndex; i < functions.length; i++) {
    functions[i]();
    
    if (i - startIndex >= 1) {
      setTimeout(applySettings.bind(this, i + 1), 1);
      console.log("taking a break...");
      break;
    }
  }
}

function setDateFormat(){
  if (!settings.dateFormat)
    settings.dateFormat = 0;
  console.log(`dateFormat is: ${settings.dateFormat}`);
  
  let dateLabel = document.getElementById("dateLabel");
  dateLabel.text = util.dateParse(settings.dateFormat, myLocale);
}

function setBattery(){
  let dateLabel = document.getElementById("dateLabel");
  let batteryLevelLabel = document.getElementById("batteryLevelLabel");
  let batteryLevelRect = document.getElementById("batteryLevelRect");
  let batteryLevelImage = document.getElementById("batteryLevelImage");
  
  //let batterychargeLevel = 12
  
  
  wasBatteryAlert = isBatteryAlert;
  if (((battery.chargeLevel <= 16 || battery.charging) && !isBatteryAlert) || charger.connected) {
    //console.log("battery Alert on");
    isBatteryAlert = true;
  } else if (!((battery.chargeLevel <= 16 || battery.charging) || charger.connected)){
    //console.log("battery Alert off");
    isBatteryAlert = false;
  }
  
  if (isBatteryAlert != wasBatteryAlert){
    if (isBatteryAlert){
      dateLabel.x = 35;
      batteryLevelLabel.style.fontSize = 30;
      if (deviceType == "Versa"){
        batteryLevelLabel.x = 236;
        batteryLevelLabel.y = 30;
      } else{ 
        batteryLevelLabel.x = 280;
        batteryLevelLabel.y = 26;
      }
      batteryLevelRect.style.display = "none";
      batteryLevelImage.href = "";
    } else {
      dateLabel.x = 15;
      if (deviceType == "Versa"){
        batteryLevelLabel.x = 246;
        batteryLevelLabel.y = 29;
      } else {
        batteryLevelLabel.x = 285;
        batteryLevelLabel.y = 26;
      }
      batteryLevelLabel.style.fontSize = 26;
      batteryLevelImage.href = "icons/battery/battery.png";
    }
    updateStatsData();
  }
  if (settings.batteryToggle || isBatteryAlert){
    batteryLevelLabel.style.fill = util.goalToColor(battery.chargeLevel, 90)
    if (isBatteryAlert)
      batteryLevelLabel.text = `${battery.chargeLevel}%`
    else
      batteryLevelLabel.text = `${battery.chargeLevel}`
    batteryLevelRect.style.display = "none";
    batteryLevelLabel.style.display = "inline";
  } else {
    batteryLevelRect.style.fill = util.goalToColor(battery.chargeLevel, 90)
    batteryLevelRect.width = parseInt((battery.chargeLevel/100) * 39);
    batteryLevelRect.style.display = "inline";
    batteryLevelLabel.style.display = "none";
  }
}

function setUpdateInterval(oldInterval){
  if (!settings.updateInterval)
    settings.updateInterval = 30;
  console.log(`updateInterval is: ${settings.updateInterval}`);
  //let oldInterval = settings.updateInterval;
  
  if (settings.updateInterval < oldInterval){
    weather.setMaximumAge(1 * 60 * 1000); 
    if (!openedWeatherRequest){
      console.log("Forcing Update Interval Change");
      openedWeatherRequest = true;
      fetchWeather("update interval");
    }
  }
  weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
  if (weatherInterval != null)
    clearInterval(weatherInterval);
  weatherInterval = setInterval(fetchWeather, settings.updateInterval*60*1000);
}

function setLocationUpdateInterval(oldLocationInterval){
  if (!settings.updateLocationInterval)
    settings.updateLocationInterval = 30;
  console.log(`locationUpdateInterval is: ${settings.updateLocationInterval}`);
  //let oldLocationInterval = settings.updateLocationInterval;
  
  if (settings.updateLocationInterval < oldLocationInterval){
    weather.setMaximumLocationAge(1 * 60 * 1000); 
    if (!openedWeatherRequest){
      console.log("Forcing Location Update Interval Change");
      openedWeatherRequest = true;
      fetchWeather("location interval");
    }
  }
  weather.setMaximumLocationAge(settings.updateLocationInterval * 60 * 1000);
}

function setColor(){
  if (!settings.color)
    settings.color = "#004C99";
  console.log(`Setting Seperator Bar color: ${settings.color}`);
  let seperatorEndLeft = document.getElementById("seperatorEndLeft");
  let seperatorLine = document.getElementById("seperatorLine");
  let seperatorEndRight = document.getElementById("seperatorEndRight");
  
  seperatorEndLeft.style.fill = settings.color;
  seperatorLine.style.fill = settings.color;
  seperatorEndRight.style.fill = settings.color;
}

function setDataAge(){
  if (!settings.showDataAge)
    settings.showDataAge = false;
  console.log(`Data Age: ${settings.showDataAge}`);
  
  // Weather View
  let weatherLocationLabel = document.getElementById("weatherLocationLabel");
  let weatherImage = document.getElementById("weatherImage");
  
  if (weatherData){
    let timeStamp = new Date(weatherData.timestamp);
    if (timeStamp.getDate()!=today.getDate()) {
      timeStamp = timeStamp.getMonth()+1+"/"+timeStamp.getDate()
    } else {
      if ((preferences.clockDisplay == "12h" && !settings.twentyFour) && settings.timeFormat!=1){
        timeStamp = util.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
      } else {
        timeStamp = util.zeroPad(timeStamp.getHours()) + ":" + util.zeroPad(timeStamp.getMinutes());
      }
    }
    if (weatherData.location != undefined){
      if (settings.showDataAge)
        weatherLocationLabel.text = `${util.shortenText(weatherData.location)} (${timeStamp})`;
      else
        weatherLocationLabel.text = `${util.shortenText(weatherData.location)}`;
    }
  }
}

function setUnit(){
  if (!settings.unitToggle)
    settings.unitToggle = false;
  console.log(`Celsius: ${settings.unitToggle}`);
  
  let tempLabel = document.getElementById("tempLabel");
  let conditionLabel = document.getElementById("conditionLabel");
  
  
  let oldUnits = userUnits;
  if (settings.unitToggle)
    userUnits = 'c';
  else 
    userUnits = 'f';
  
  if (weatherData){
    if (oldUnits != userUnits){
      weather.setMaximumAge(0 * 60 * 1000); 
      weather.setUnit(userUnits);
      if (!openedWeatherRequest){
        console.log("Forcing Update Unit Change");
        openedWeatherRequest = true;
        fetchWeather("set unit");
      }
      weather.setMaximumAge(settings.updateInterval * 60 * 1000); 
    }
  }
  weather.setUnit(userUnits);
//  fetchWeather("Reset Weather");
}

function loadSettings() {
  console.log("Loading Settings!")
  const SETTINGS_TYPE = "cbor";
  const SETTINGS_FILE = "settings.cbor";
  
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    console.log("Loading stock settings")
    return {
      dateFormat : 0,
      batteryToggle : false,
      timeFormat : 0,
      updateInterval : 2,
      updateLocationInterval : 2,
      unitToggle : false,
      showDataAge : true,
      fetchToggle : false,
      weatherScrollToggle : false,
      locationScrollToggle : false,
      color : "#004C99",
      seperatorImage: 0,
      lowColor: "tomato",
      medColor: "#FFCC33",
      highColor: "#14D3F5",
      comColor: "#5BE37D",
      rhrToggle: false,
      noFile : true
    }
  }
}

function loadWeather(){
  console.log("Loading Weather");
  
  const WEATHER_FILE = "weather.cbor";
  const SETTINGS_TYPE = "cbor";

  try {
    return fs.readFileSync(WEATHER_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    console.log("No Forecast Found")
    return null;
  }
}

function loadForecast(){
  console.log("Loading Forecast");
  
  const FORECAST_FILE = "forecast.cbor";
  const SETTINGS_TYPE = "cbor";

  try {
    return fs.readFileSync(FORECAST_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    console.log("No Forecast Found")
    return null;
  }
}

function saveSettings() {
  console.log("Saving Settings");
  
  const SETTINGS_FILE = "settings.cbor";
  const SETTINGS_TYPE = "cbor";
  
  //fs.unlinkSync(SETTINGS_FILE, SETTINGS_TYPE);
  settings.noFile = false;
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
  
  saveWeather();
}

function saveWeather() {
  console.log("Saving Weather");
  
  const WEATHER_FILE = "weather.cbor";
  const SETTINGS_TYPE = "cbor";
  
  fs.writeFileSync(WEATHER_FILE, weatherData, SETTINGS_TYPE);
  const FORECAST_FILE = "forecast.cbor";
  
  fs.writeFileSync(FORECAST_FILE, forecastData, SETTINGS_TYPE);
  console.log("Wrote Weather and Forecast");
}

function fetchWeather(caller){
  if (!caller)
    caller = "auto called"
  console.log(caller)
  console.log("Doing Fetch");
  settings.fetchToggle = false;

  isFetching = true;
  weather.fetch();
}

//------------------Event Handleing--------------------

background.onclick = function(evt) {
  console.log("Click");
  console.log("JS memory Event: " + memory.js.used + "/" + memory.js.total);
  if (show == "clock"){           // In Clock -> Switching to Stats
    show = "stats";
    clockView.style.display = "none";
    updateStatsData()
    activity.drawAllProgress();
    statsView.style.display = "inline";
    console.log("stats Loaded");
    display.poke()
  } else if (show == "stats"){                   // In Stats -> Switching to forcast or schedule    
    if(forecastData != null && forecastData.todayDescription != undefined) {
      show = "forecast";
      statsView.style.display = "none";
      updateForecastData();
      forecastView.style.display = "inline";//test
      console.log("forecast Loaded");
    } else {
      weather.setProvider("owmf"); 
      fetchWeather();
      show = "clock";
      statsView.style.display = "none";
      //updateClock();
      //updateClockData();
      clockView.style.display = "inline";//test
      console.log("Clock Loaded");
    } 
  } else {                                  // In Schedule -> Switching to Clock
    show = "clock";
    forecastView.style.display = "none";
    //updateClock();
    //updateClockData();
    clockView.style.display = "inline";//test
    console.log("Clock Loaded");
  }
}

battery.onchange = function() {
  setBattery()
  hr.batteryCharger();
};

display.onchange = function() {
  if (!display.on && show != "clock") {
    show = "clock";
    updateClock();
    //updateClockData();
    
    statsView.style.display = "none";
    forecastView.style.display = "none";
    hrm.start();
    
    clockView.style.display = "inline"; //test

    //hrm.stop();
  }
}

me.onunload = saveSettings;

//-----------------Startup------------------------
// Update the clock every tick event
clock.granularity = "seconds";
console.log(">>>>>>>>>>>>>>>>>>>>>> " + clock.granularity)
clock.ontick = () => updateClock("ontick");

updateClock("start");  
settings = loadSettings();
console.log(settings.color)

//var apiKey = settings.owm_apikey;
weather.setProvider("owm"); 
//weather.setApiKey(apiKey);
weather.setApiKey("30e538c070a8907d0ea7545a7fc75fdc");
weather.setMaximumAge(10 * 60 * 1000); 
weather.setFeelsLike(false);
weather.setUnit(userUnits);

let weatherData = loadWeather();
let forecastData = loadForecast();

applySettings();
//activity.drawAllProgress();

hrm.start();
hrm.onerror = function() { console.log("--------------------------------------------------HR err"); } 
fetchWeather();

//updateClockData();
setBattery();


if (weatherData == null || !weatherData || !weatherData.description){
  drawWeatherUpdatingMsg();
} else {
  drawWeather(weatherData);
}

weather.onsuccess = (data) =>{
  if (data.provider == "owm"){
    weatherData = data;
    console.log("Got Weather Data!");
    drawWeather(data);
   // setTimeout(function() {
      weather.setProvider("owmf"); 
      fetchWeather();
    //}, *1000)
    
  } else if (data.provider == "owmf"){
    forecastData = data;
    console.log("Got Forecast Data!");
    weather.setProvider("owm"); 
  }
}

//setInterval(updateClockData, 1*1000);
setInterval(setBattery, 60*1000);

setInterval(function() {
  weather.setProvider("owm");
}, 5 * 60 * 1000);

console.log("JS memory last: " + memory.js.used + "/" + memory.js.total);
