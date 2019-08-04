import document from "document"; 
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
import { battery } from "power";
import { charger } from "power";
import { locale } from "user-settings";

import * as heartRateZone from "../common/heartRateZone"
import * as allStrings from "./strings"
//HR - START

export let hrm = new HeartRateSensor();
export var isHeartbeatAnimation  = true;
export var hrmAnimationPhase = false;
export var prevHrmRate = null;
export var hrmRate = null;
export var hrAnimated = true;
export var hrAnimatedInterval = null;
export var batteryIconVisible = false;
export let hrIconSystoleEl = document.getElementById("hr-icon-systole");
export let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");
export let hrCountEl = document.getElementById("hr-count");
export let hrRestingEl = document.getElementById("hr-resting");
//export let hrZoneEl = document.getElementById("hr-zone");

let settings = {};
let myLocale = locale.language.substring(0,2);

export let language = "en";
export function setLanguage(val) { 
  language = val
  drawHrm();
}

export function setHrRestingVis(visibility) {
  hrRestingEl.style.display = (!visibility ? "none" : "inline");
  drawHrm();
}

export function isHeartbeatAnimationSet(val) { 
  isHeartbeatAnimation = val;
  if(val){
    drawHrm();
  }
  else{
    //console.log("Stopme Some hr ");
    stopHrAnimation();
  }
}
//HR - END

//HR Draw - START

//export function setHrZoneVis(visibility) {
//  hrZoneEl.style.display = (!visibility ? "none" : "inline");
//}

export function initHrInterval() {
  clearInterval(hrAnimatedInterval);
  hrAnimatedInterval = setInterval(animateHr, 30000/hrmRate);
}

export function stopHrAnimation() {
  hrAnimated = false;
  clearInterval(hrAnimatedInterval);
  hrIconDiastoleEl.style.display = "inline";
  hrIconSystoleEl.style.display = "none";
}

export function hideHr() {
   //console.log("Gimme Some hr hide");
   hrmRate = null;
   prevHrmRate = null;   
   stopHrAnimation();
   //hrEl.style.display = "none";
}

export function animateHr() {   
    if (hrmAnimationPhase) {
      hrIconDiastoleEl.style.display = "none";
      hrIconSystoleEl.style.display = "inline";
    } else {
      hrIconDiastoleEl.style.display = "inline";
      hrIconSystoleEl.style.display = "none";
    }
  
    hrmAnimationPhase =!hrmAnimationPhase;
  
    if (prevHrmRate != hrmRate) {
      clearInterval(hrAnimatedInterval);
      if (isHeartbeatAnimation) {
        prevHrmRate = hrmRate;
        initHrInterval();
      }
    }     
    prevHrmRate = hrmRate;
}

export function drawHrm() { 
  let strings = allStrings.getStrings(myLocale, "clockData");
  hrm.start();
  hrmRate = hrm.heartRate;
  //console.log("Gimme Some hr " + hrm.heartRate);

  if (!settings.lowColor)
    settings.lowColor = "tomato"
  if (!settings.medColor)
    settings.medColor = "#FFCC33"
  if (!settings.highColor)
//    settings.highColor = "#14D3F5"
    settings.highColor = "cornflowerblue"
  if (!settings.comColor)
    settings.comColor = "#5BE37D"
  
  if (!settings.rhrToggle)
    settings.rhrToggle = false;
  
  if (hrmRate) {
    if (user.heartRateZone(hrm.heartRate) == "out-of-range"){
      hrCountEl.style.fill = settings.highColor;  // #14D3F5
    } else if (user.heartRateZone(hrm.heartRate) == "fat-burn"){
      hrCountEl.style.fill = settings.comColor; // #5BE37D
    } else if (user.heartRateZone(hrm.heartRate) == "cardio"){
      hrCountEl.style.fill = settings.medColor; // #FFCC33
    } else if (user.heartRateZone(hrm.heartRate) == "peak"){
      hrCountEl.style.fill = settings.lowColor; // #F83C40
    }

//    hrCountEl.text = `${hrmRate}`;
    hrRestingEl.text = `(${user.restingHeartRate})`;
    hrRestingEl.style.fill = "#969696";
    var hrTxt = `${user.heartRateZone(hrm.heartRate)}`;
    hrCountEl.text = `${hrm.heartRate} ${strings["bpm"]} - ${strings[hrTxt]}`;

    if (!prevHrmRate) {
      hrCountEl.style.display = "inline";    
    }
    if (!hrAnimated && isHeartbeatAnimation) {
      clearInterval(hrAnimatedInterval);   
      prevHrmRate = hrmRate;
      initHrInterval();
      hrAnimated = true;      
    }
  } else {
    hrCountEl.text = strings["NO HEART RATE"];
    hideHr();
  }

  if (hrRestingEl.style.display == "inline") {
      hrCountEl.x = 76;
  } else {
      hrCountEl.x = 46;
  }
}

export function batteryCharger() {
  if(battery.chargeLevel <= 20) {
    batteryIconVisible = true;
    hideHr();
  } else {
    if(charger.connected) {
      batteryIconVisible = true;
      hideHr();
    } else {
      batteryIconVisible = false;
      drawHrm();
    }
  }
}

drawHrm();
hrm.onreading = drawHrm;
//HR Draw - END