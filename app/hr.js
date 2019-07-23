import document from "document"; 
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
import { battery } from "power";
import { charger } from "power";
import * as heartRateZone from "../common/heartRateZone"
//HR - START

export let hrm = new HeartRateSensor();
export var isHeartbeatAnimation  = true;
export var hrmAnimationPhase = false;
export var prevHrmRate = null;
export var hrmRate = null;
export var hrAnimated = true;
export var hrAnimatedInterval = null;
export var batteryIconVisible = false;
//export let hrEl = document.getElementById("hr-count");
export let hrIconSystoleEl = document.getElementById("hr-icon-systole");
export let hrIconDiastoleEl = document.getElementById("hr-icon-diastole");
export let hrCountEl = document.getElementById("hr-count");
//export let hrRestingEl = document.getElementById("hr-resting");
//export let hrZoneEl = document.getElementById("hr-zone");

export let language = "en";
export function setLanguage(val) { 
  language = val
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
  hrm.start();
  //console.log("Gimme Some hr ");
  hrmRate = hrm.heartRate;
  //console.log("Gimme Some hr " + hrm.heartRate);
  
  if (hrmRate) {
//    console.log("Gimme Some hr 2 ");
//    hrCountEl.text = `${hrmRate}`;
//    hrRestingEl.text = `(${user.restingHeartRate})`;
//    hrZoneEl.text ="bpm " + heartRateZone.getHeartRateZone(language, user.heartRateZone(hrmRate));
//    console.log("Zone: " + hrCountEl.text);

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
    hideHr();
  }

//  hrCountEl.text = `${hrmRate}`;  
//  hrRestingEl.text = `(${user.restingHeartRate})`;
  //hrZoneEl.text = heartRateZone.getHeartRateZone(language, user.heartRateZone(hrmRate));
//  document.getElementById("hr-count").text = ( hrm.heartRate > 0 ) ? hrm.heartRate : "--";

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