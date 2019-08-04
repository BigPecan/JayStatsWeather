export function getStrings(lang, type){
  switch (lang){
    default:
      switch (type){
        case "clockData":
          return {
            "bpm"           : "bpm",
            "steps"         : "steps", 
            "kcal"          : "kcal",
            'out-of-range'  : 'Regular',
            'fat-burn'      : 'Fat Burn',
            'cardio'        : 'Cardio',
            'peak'          : 'Peak',
            'below-custom'  : 'Below Range',
            'custom'        : 'In Range',
            'above-custom'  : 'Above Range',
            
            "NO SENSOR"     : "NO SENSOR",
            "NO HEART RATE" : "NO HEART RATE",
            "Fetching at "  : "Fetching at ",
          }
        case "stats":
          return {
            "Steps"     : "Steps",
            "Distance"  : "Distance",
            "Floors"    : "Floors",
            "Active"    : "Active",
            "Calories"  : "Calories",
          }
        case "date":
          return {
            
            "Sun"       : "Sun",
            "Mon"       : "Mon",
            "Tues"      : "Tues",
            "Wed"       : "Wed",
            "Thurs"     : "Thurs",
            "Fri"       : "Fri",
            "Sat"       : "Sat",
            
            "Sunday"       : "Sunday",
            "Monday"       : "Monday",
            "Tuesday"      : "Tuesday",
            "Wednesday"    : "Wednesday",
            "Thursday"     : "Thursday",
            "Friday"       : "Friday",
            "Saturday"     : "Saturday",
   
            "Jan."      : "Jan.",
            "Feb."      : "Feb.",
            "Mar."      : "Mar.",
            "Apr."      : "Apr.",
            "May."      : "May",
            "Jun."      : "June",
            "Jul."      : "July",
            "Aug."      : "Aug.",
            "Sept."     : "Sept.",
            "Oct."      : "Oct.",
            "Nov."      : "Nov.",
            "Dec."      : "Dec.",
            
            "January"   : "January",
            "February"  : "February",
            "March"     : "March",
            "April"     : "April",
            "May"      : "May",
            "June"      : "June",
            "July"      : "July",
            "August"    : "August",
            "September" : "September",
            "October"   : "October",
            "November"  : "November",
            "December"  : "December",
          }
        case "weather":
          return {
            "Today"     : "Today", 
            "Sunday"    : "Sunday",
            "Monday"    : "Monday",
            "Tuesday"   : "Tuesday",
            "Wednesday" : "Wednesday",
            "Thursday"  : "Thursday",
            "Friday"    : "Friday",
            "Saturday"  : "Saturday",
            
            "High"      : "High",
            "Low"       : "Low",
            
            "Updating..."   : "Updating...",
            
            "Tornado"                 : "Tornado",
            "Tropical Storm"          : "Tropical Storm",
            "Hurricane"               : "Hurricane",
            "Severe Thunderstorms"    : "Bad T-Storms",
            "thunder storm"           : "T-Storm",
            "Thunderstorms"           : "T-Storms",
            "Mixed Rain And Snow"     : "Rain & Snow",
            "Mixed Rain And Sleet"    : "Rain & Sleet",
            "Mixed Snow And Sleet"    : "Snow & Sleet",
            "Freezing Drizzle"        : "Freezing Rain",
            "Drizzle"                 : "Drizzle",
            "Freezing Rain"           : "Freezing Rain",
            "Showers"                 : "Showers",
            "Snow Flurries"           : "Flurries",
            "Light Snow Showers"      : "Light Snow",
            "Blowing Snow"            : "Blowing Snow",
            "snow"                    : "Snow",
            "Snow"                    : "Snow",
            "heavy snow"              : "Heavy Snow",
            "Hail"                    : "Hail",
            "Sleet"                   : "Sleet",
            "Dust"                    : "Dust",
            "Foggy"                   : "Foggy",
            "haze"                    : "Haze",
            "mist"                    : "Mist",
            "fog"                     : "Fog",
            "Smoky"                   : "Smoky",     
            "Blustery"                : "Blustery",
            "Windy"                   : "Windy",
            "Cold"                    : "Cold",
            "overcast clouds"         : "Overcast",
            "Cloudy"                  : "Cloudy",
            "Mostly Cloudy"           : "Mostly Cloudy",  
            "few clouds"              : "Partly Cloudy",
            "scattered clouds"        : "Partly Cloudy",
            "Partly Cloudy"           : "Partly Cloudy",
            "broken clouds"           : "Mostly Cloudy",
            "Clear"                   : "Clear",
            "clear sky"               : "Clear",
            "sky is clear"            : "Clear",
            "Sunny"                   : "Sunny",
            "Fair"                    : "Fair",
            "Mixed Rain And Hail"     : "Rain & Hail",
            "Hot"                     : "Hot",
            "Isolated Thunderstorms"  : "Some T-Storms",
            "Scattered Thunderstorms" : "Some T-Storms",
            "Scattered Showers"       : "Some Rain",
            "Heavy Snow"              : "Heavy Snow",
            "Scattered Snow Showers"  : "Some Snow",
            "Thundershowers"          : "T-Showers",
            "Snow Showers"            : "Snow",
            "light snow"              : "Light Snow",
            "Isolated Thundershowers" : "Some T-Storms",
            "shower rain"             : "Rain",
            "rain"                    : "Rain",
            "light rain"              : "Light Rain",
            "light intensity shower rain" : "Light Rain",
            "heavy intensity rain"    : "Heavy Rain",
            "very heavy rain"	        : "Heavy Rain",
            "moderate rain"           : "Rain",
            "Rain"                    : "Rain",
            "Mostly Sunny"            : "Sunny",
            "thunderstorm with heavy rain" : "T-Storm",
            
            "Town and Country Mobile Village" : "Interlochen"
            
          }
        case "directions":
          return {
            "North"           : "North",
            "N."              : "N.",
            "East"            : "East",
            "E."              : "E.",
            "South"           : "South",
            "S."              : "S.",
            "West"            : "West",
            "W."              : "W.",
          }

      }
  }
}