var returnCovidData;
var returnVaccineData;
var map;
var mapData = {};
var oldData = [];
var date = getDate();
var vaccineUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv";
var censusMin = 100;
var censusMax = 0;
var timer = 300;

// setTimeout Just to avoid any bugs, Increase the timer var if some values return undefined
// returnVaccineData = Total number of shots given, number of people vaccinated, percentage of people vaccinated, number of people fully vaccinated, daily vaccinations
//returnVaccineData = setTimeout(function(){ console.log(returnVaccineData); }, timer);
// returnCovidData = [confirmed, recovered, deaths, todayCases, todayDeaths];
//returnCovidData = setTimeout(function(){ console.log(returnCovidData); }, timer);
// oldData = [This month, Month-1, Month-2, Month-3];
//setTimeout(function(){ console.log(oldData); }, timer);

//runAPIs("California");
//Runs all the APis with the stateName
function runAPIs(stateName) {
    if (stateName) {
        getCovidData(stateName);
        getVaccineData(stateName, date);
        getVaccineLocationData(stateName);
        setTimeout(function () { initMap(); }, timer);
        $("#mapContainer").css("display", "block");
    }
}
/**
 * 
 * Covid Data
 * 
 * 
 */
// Api call to get the covid Data using Ajax
//Return the result with renderCovidData 
function getCovidData(stateName) {
let settings = {
    "url": "https://disease.sh/v3/covid-19/states/"+ stateName +"?yesterday=true",
    "method": "GET",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
            // returnCovidData = [confirmed, recovered, deaths, todayCases, todayDeaths];
            returnCovidData = [response.cases, response.recovered, response.deaths, response.todayCases, response.todayDeaths];
  });
}
/**
 * 
 * Vaccine Data
 * 
 * 
 */
// Get the vaccine Data csv file and parse it into Json.
function getVaccineData(stateName, date) {
    
    //Parse the csv Data into Json
    Papa.parse(vaccineUrl, {
        download: true,
        complete: function (results) {

            //need to look inside the array where results.data.date == date and results.data.stateName == statename
            for (i = 0; i < results.data.length - 1; i++) {
                for (j = 0; j < 4; j++) {
                    if (results.data[i][0] == getDate(-j)) {
                        oldData[j] = results.data[i][4];
                    }
                }



                //Return an object for the map
                if (results.data[i][0] == date) {
                    // Exclude Federated States of Micronesia because technically not part of the USA
                    if (results.data[i][1] != "Federated States of Micronesia") {
                        //use return data
                        //Correct a difference in Key name
                        if (results.data[i][1] == "New York State") {

                            mapData["New York"] = results.data[i][5];

                        } else {

                            mapData[results.data[i][1]] = results.data[i][5];

                        }

                        //Set the censusMin
                        if (parseInt(results.data[i][5]) < censusMin && results.data[i][5]) {
                            censusMin = results.data[i][5];
                        }

                        //Set the censusMax
                        if (parseInt(results.data[i][5]) > censusMax) {
                            censusMax = results.data[i][5];
                        }
                    }
                }
                //Return the array with all the values for the main box
                if (results.data[i][0] == date && results.data[i][1] == stateName) {
                    // returnVaccineData = Total number of shots given, number of people vaccinated, percentage of people vaccinated, number of people fully vaccinated, daily vaccinations
                    returnVaccineData = [results.data[i][2], results.data[i][4], results.data[i][5], results.data[i][7], results.data[i][11]];

                }
            }
        }
    });

}

// Get the Vaccination centers data from https://www.vaccinespotter.org/api
function getVaccineLocationData(stateName) {
    fetch("https://www.vaccinespotter.org/api/v0/states.json")
        .then(response => {
            return response.json();
        })
        .then(function (data) {
            //Creates The title and the ul Element
            let otherHalf = false;
            let divEl = $("<div>").css("text-align","center");
            let pEl = $("<h2 class='title is-2'>List of pharmacies providing vaccines in that state</h2>")
            let ulEl = $("<ul>").addClass("locationList").css("float","left");
            //Append it to the element with a class of centerbox
            divEl.append(pEl, ulEl);
            $(".centerbox").append(divEl);

            
            
            // Iterate trough the data and look for pharmacies that provides vaccines in that state
            for (i = 0; i < data.length; i++) {

                if (data[i].name == stateName) {
                    for (j = 0; j < data[i].provider_brands.length; j++) {
                        let half = Math.ceil(data[i].provider_brands.length / 2);
                        if (j == half) {
                            var ulEl2 = $("<ul>").addClass("locationList2").css("width","50%").css("float","left");
                            divEl.append(ulEl2);
                            otherHalf = true;
                        }
                        // Create element
                        let liEl = $(`<li><a href="${data[i].provider_brands[j].url}">${data[i].provider_brands[j].name}</a></li>`);

                        if (otherHalf) {
                            ulEl2.append(liEl);
                        } else {
                            ulEl.append(liEl);
                        }
                    }
                }

            }


        });
}



//Get today's date
// Function based on https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
function getDate(prevMonth) {
    var today = new Date();

    // Return an anterior date for the Graph API
    if (prevMonth) {
        var month = 1 + prevMonth;
    } else {
        var month = 1;
    }

    // Because the data doesn't start till mid January, we are not able to get any result back if we look before at a day before the start date.
    if (prevMonth === -3) {
        var dd = 20;
    } else {
        //Picks the date of yesterday
        var dd = String(today.getDate() - 1).padStart(2, '0');
    }

    var mm = String(today.getMonth() + month).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
}

/**
 * 
 * MAPS
 * 
 * 
 */
// Initialize and add the map
function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        //Center the map on the USA
        center: { lat: 40, lng: -100 },
    });

    //Calls styleFeature function && mouseover events
    map.data.setStyle(styleFeature);
    map.data.addListener("mouseover", mouseInToRegion);
    map.data.addListener("mouseout", mouseOutOfRegion);

    //Add the Min and Max values to the legend
    document.getElementById("census-min").textContent = "Min: " + censusMin + "%";
    document.getElementById("census-max").textContent = "Max: " + censusMax + "%";

    loadMapShapes();
}

// Load the states polygons
function loadMapShapes() {
    // load US state outline polygons from a GeoJson file
    map.data.loadGeoJson(
        "https://storage.googleapis.com/mapsdevsite/json/states.js",
        { idPropertyName: "STATE" }
    );
}

// Add the styling to each state.
function styleFeature(feature) {
    const low = [5, 69, 54]; // color of smallest datum
    const high = [151, 83, 34]; // color of largest datum
    let name = feature.i.NAME;
    //Get the census value
    // delta represents where the value sits between the min and max
    const delta =
        (mapData[name] - censusMin) /
        (censusMax - censusMin);
    const color = [];

    for (let i = 0; i < 3; i++) {
        // calculate an integer color based on the delta
        color.push((high[i] - low[i]) * delta + low[i]);
    }
    // determine whether to show this shape or not
    let showRow = true;

    let outlineWeight = 0.5,
        zIndex = 1;

    // Need to add the mouseInToRegion function for that to work
    if (feature.getProperty("state") === "hover") {
        outlineWeight = zIndex = 2;
    }
    return {
        strokeWeight: outlineWeight,
        strokeColor: "#fff",
        zIndex: zIndex,
        fillColor: "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
        fillOpacity: 0.75,
        visible: showRow,
    };


}

//Mouse in function
function mouseInToRegion(e) {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty("state", "hover");
    let name = e.feature.i.NAME;
    // update the label
    document.getElementById("data-label").textContent = e.feature.getProperty(
        "NAME"
    );
    document.getElementById("data-value").textContent = mapData[name] + "%";
    document.getElementById("data-box").style.display = "block";
}

//Mouse out function
function mouseOutOfRegion(e) {
    // reset the hover state, returning the border to normal
    e.feature.setProperty("state", "normal");
}

// Init the map after 50ms to make sure the data is loaded first
