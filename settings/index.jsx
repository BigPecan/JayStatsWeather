import * as allStrings from "./strings.js";
import { settingsStorage } from "settings";


function mySettings(props) {
  
  let myLocale = props.settings.locale
  let strings = allStrings.getStrings(myLocale);
  let colourSet = [
    {color: "#FF00FF"},   
    {color: "#FFFF00"},  
    {color: "#00FFFF"},  
    {color: "#FF0000"},  
    {color: "#00FF00"},  
    {color: "#0000FF"},  

    {color: "white"} ,
    {color: 'black'},
    {color: 'cornsilk'},
    {color: 'gold'},
    {color: 'aquamarine'},
    {color: 'deepskyblue'},

    {color: 'teal'},
    {color: 'violet'},
    {color: 'midnightblue'},
    {color: 'yellowgreen'},
    {color: 'crimson'},
    {color: 'lightseagreen'},

    {color: 'salmon'},
    {color: '#00FA9A'},  
    {color: 'darkred'},  
    {color: 'darkslategrey'},      
    {color: 'darkorchid'},
    {color: 'darkorange'},

    {color: 'lightsteelblue'},
    {color: 'skyblue'},
    {color: '#8B4513'},
    {color: 'khaki'}, 
    {color: 'palegoldenrod'},  
    {color: 'navy'},

    {color: 'deeppink'},
    {color: 'royalblue'},
    {color: 'orangered'},
    {color: 'greenyellow'}, 
    {color: 'tomato'},  
    {color: 'forestgreen'},

    {color: '#00163a'},
    {color: '#21003a'},
    {color: '#3a1d00'},
    {color: '#969696'}, 
    {color: '#494949'}, 
    {color: '#2d2d2d'}
  ];  
  return (
    <Page>
      <Section title="Localisation">
        <Select 
          label="Distance Unit (forces to Miles or Kilometers)"
          settingsKey="distanceUnit" 
          options={[ 
            {value:" ", name:"None"}, 
            {value:"m", name:"meters"}, 
            {value:"km", name:"kilometers"}, 
            {value:"us", name:"feet"}, 
            {value:"us", name:"miles"} 
          ]} 
        />
      </Section>
      <Section
        title={<Text bold align="center">TimeDateWeather Settings</Text>}>
        <TextInput
          label="Open Weather Map API key"
          settingsKey="owm_apikey"
          placeholder="<default>"
        />
        <Button
          list
          label="Reset Weather"
          onClick={() => props.settingsStorage.setItem('weather', 'kill')}
        />
      </Section>
      <Section
        title={<Text bold align="center">Heading and Time</Text>}>
        <Select
          label="Date Format"
          settingsKey="dateFormat"
          options={[
            {name: strings["Wed, Jan 31"]},
            {name: strings["Wednesday 31"]},
            {name: strings["Jan 31, 2018"]},
            {name: "1/31/2018"},
            {name: strings["Wed 31 Jan"]},
            {name: strings["31 Jan 2018"]},
            {name: "31/1/2018"},
            {name: "2018.01.31"},
            {name: "31. 1. 2018"},
            {name: "31.01.2018"},
          ]}
        />
        <Toggle
           settingsKey="batteryToggle"
           label="Change Battery Bar to Battery %"
         />
        <Toggle
           settingsKey="24hToggle"
           label="Force 24 Hour Time"
         />
        <Select
          label="Time Format"
          settingsKey="timeFormat"
          options={[
            {name: "12:00 am (only 12 hour time)"},
            {name: "12:00"},
            {name: "12:00:00"}
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="left">Select a Separator Bar color</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={colourSet} />
      </Section>
      <Section
        title={<Text bold align="left">Select a Time Color</Text>}>
        <ColorSelect
          settingsKey="timeColour"
          colors={colourSet} />
      </Section>
      <Section
        title={<Text bold align="left">Select a Date Color</Text>}>
        <ColorSelect
          settingsKey="dateColour"
          colors={colourSet} />
      </Section>
      <Section
        title={<Text bold align="center">Custom Range Colors</Text>}>
        <Text>
          {strings["Low Color"]}
        </Text>
        <ColorSelect
          settingsKey="lowColor"
          colors={[
            {color: "khaki"},
            {color: "coral"},
            {color: "tomato"},
            {color: "firebrick"}
          ]}
        />
        <Text>
          {strings["Medium Color"]}
        </Text>
        <ColorSelect
          settingsKey="medColor"
          colors={[
            {color: "palegoldenrod"},
            {color: "yellow"},
            {color: "#FFCC33"},
            {color: "gold"},
          ]}
        />
        <Text>
          {strings["High Color"]}
        </Text>
        <ColorSelect
          settingsKey="highColor"
          colors={[
            {color: "#00FFFF"},
            {color: "cyan"},
            {color: "#14D3F5"},
            {color: "dodgerblue"},
          ]}
        />
        <Text>
          {strings["Complete Color"]}
        </Text>
        <ColorSelect
          settingsKey="comColor"
          colors={[
            {color: "cornsilk"},
            {color: "lawngreen"},
            {color: "#5BE37D"},
            {color: "forestgreen"},
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">Activities</Text>}>
        <Toggle
           settingsKey="heartRateRestingVis"
           label={strings["rhr"] }
         />
        <Toggle
           settingsKey="isHeartbeatAnimation"
           label="Heartbeat animation"
        />
      </Section>
      <Section
        title={<Text bold align="center">Weather</Text>}>
        <Toggle
           settingsKey="unitToggle"
           label={strings["Celsius"]}
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
        <Select
          label="Weather Update Interval"
          settingsKey="updateInterval"
          options={[
            {name:strings["5 minutes"], value:5},
            {name:strings["15 minutes"], value:15},
            {name:strings["30 minutes"], value:30},
            {name:strings["1 hour"], value:60},
            {name:strings["2 hours"], value:120},
          ]}
         />
        <Text align="center">
          {strings["WATCH battery"]}
        </Text>
        <Select
          label="Location Update Interval"
          settingsKey="locationUpdateInterval"
          options={[
            {name:strings["5 minutes"], value:5},
            {name:strings["15 minutes"], value:15},
            {name:strings["30 minutes"], value:30},
            {name:strings["1 hour"], value:60},
            {name:strings["2 hours"], value:120},
          ]}
         />
         <Text align="center">
            {strings["PHONE battery"]}
         </Text>
        <Toggle
           settingsKey="dataAgeToggle"
           label={strings["update time"]}
         />
        <Toggle
           settingsKey="colorToggle"
           label={strings["high low color"] }
         />
      </Section>
      <Section
        title={<Text bold align="center">Contact Me</Text>}>
        <Link source="https://openweathermap.org">
          <TextImageRow
            label="OpenWeatherMap"
            sublabel="Weather data provided by OpenWeatherMap.org"
            icon="https://github.com/cmspooner/ForecastTime/blob/master/resources/icons/settings/OpenWeatherMap.png?raw=true"
          />
        </Link>
      </Section>
      <Section
        title={<Text bold align="center">Build Version and English Only Notes</Text>}>
        <Text>
          1.0.1.8 Corrected issue with heartrate and weather text not displaying correctly.
        </Text>
        <Text>
          1.0.1.7 Added arc to main screen instead of line for progress.
        </Text>
        <Text>
          1.0.1.6 Adjustments to screens and code fixes.
        </Text>
        <Text>
          1.0.1.5 Corrected bug with Stats distance Units.
        </Text>
        <Text>
          1.0.1.4 Corrected bug with Stats distance display.
        </Text>
        <Text>
          1.0.1.3 Updated Stats page font and wording.
        </Text>
        <Text>
          1.0.1.2 Added end points to status lines. Consolidating and cleaning code.
        </Text>
        <Text>
          1.0.1.1 Removed weather scrolling.
        </Text>
        <Text>
          1.0.1.0 Font adjustment to stats.
        </Text>
        <Text>
          1.0.0.9 Added progress bars to stats page.
        </Text>
        <Text>
          1.0.0.8 Font adjustments and some code changes to stats.
        </Text>
        <Text>
          1.0.0.7 Code clean-up and a little bit of spacing adjustment.
        </Text>
        <Text>
          1.0.0.6 More visual adjstments.
        </Text>
        <Text>
          1.0.0.6 Adjusted spacing for Weather; cleaned up code for temperature and condition.
        </Text>
        <Text>
          1.0.0.5 Separated Temperature and Condition so I am able to set different colors for each.
        </Text>
        <Text>
          1.0.0.4 Cleaned up some spacing issues and some items on the settings screen.
        </Text>
        <Text>
          1.0.0.4 Let the clean-up begin.
        </Text>
        <Text>
          1.0.0.4 Changes to hr display and animation.
        </Text>
        <Text>
          1.0.0.3 Changes to steps counter.
        </Text>
        <Text>
          1.0.0.2 Testing changes to weather.
        </Text>
        <Text>
          1.0.0.1 beta: re-work of cmspooner ForecastTime face.
        </Text>
         <Text>
          1.0: cmspooner First Release.
        </Text>
      </Section>
      <Section
        title={<Text bold align="center">Reset Data</Text>}>
        <Button
          list
          label="Reset Settings"
          onClick={() => props.settingsStorage.setItem('settings', 'kill')}
        />

      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
