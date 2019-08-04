import document from "document";
import { today as todayActivity, goals} from "user-activity";

import * as util from "../common/utils";

//Progress - START
export var distanceUnit = "m";
export function distanceUnitSet(val) { distanceUnit = val }
export let stepsArc = document.getElementById("stepsArc");
export let stepsLabel = document.getElementById("stepsLabel");

//Progress - END

//Progress Draw - START
export function drawProgress() {
//  let prefix = progressEl.prefix;
  
  let actual = (todayActivity.adjusted.steps);
  let goal = (goals.steps);
 
  var dispText = "";
  dispText = "Steps";
  stepsLabel.text = `${dispText}: ${actual}/${goal}`;
  stepsArc.sweepAngle = util.getGoalArc(actual, goal);
  if (actual/goal >= 1){
      stepsArc.style.fill = "gold";
  }
} 


export function drawAllProgress() {
  drawProgress();
}

export function resetProgressPrevState() {

}

export function initFastProgressInterval() {
}

//Progress Draw - END