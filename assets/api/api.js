var returnCovidData;
var returnVaccineData;
var censusValue;
var mapData = {};
var date = getDate();
var vaccineUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv";
var oldData = [];

// Just to avoid any bugs
//returnVaccineData = setTimeout(function(){ console.log(returnVaccineData); }, 100);
//returnCovidData = setTimeout(function(){ console.log(returnCovidData); }, 100);
//Get the data from the previous months in descending order
//setTimeout(function(){ console.log(oldData); }, 100);

//Temporarily run the function
runAPIs("Alabama");

//Runs all the APis with the stateName
function runAPIs(stateName) {
    //Need to add a function that checks if the Name is valid
    getCovidData(stateName);
    getVaccineData(stateName, date);
}

/**
 * 
 * Covid Data
 * 
 * 
 */
// Api call to get the covid Data using the XMLHttpRequest Object
//Return the result with renderCovidData 
function getCovidData(stateName) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var covidData = JSON.parse(this.response);

            //Returns the confirmed, recovered and deaths in the last 24hrs   
                    
            for (i = 0; i < covidData[0].provinces.length; i++) {
                if (covidData[0].provinces[i].province == stateName) {
                    // returnCovidData = [confirmed, recovered, deaths];
                    returnCovidData = [covidData[0].provinces[i].confirmed, covidData[0].provinces[i].recovered, covidData[0].provinces[i].deaths];
                    //returnData(returnCovidData, false);
                    //Break the loop once we have the value needed
                    break;
                }
            }
            
        }
    });
    
    // XMLHttpRequest
    xhr.open("GET", "https://covid-19-data.p.rapidapi.com/report/country/name?date=2020-04-01&name=USA");
    xhr.setRequestHeader("x-rapidapi-key", "af9daf036amsh4c7360d9db21318p14bbcajsn1c70e54a7721");
    xhr.setRequestHeader("x-rapidapi-host", "covid-19-data.p.rapidapi.com");
    xhr.send(data);
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
            for (i = 0; i < results.data.length; i++) {

                for(j=0; j<4; j++){
                    if(results.data[i][0] == getDate(-j)){
                        oldData[j] = results.data[i][4];
                    }
                }
                

                //Return an object for the map
                if(results.data[i][0] == date){
                    //use return data
                    //Correct a difference in Key name
                    if(results.data[i][1] == "New York State"){
                        mapData["New York"] = results.data[i][5];
                    }else{
                    mapData[results.data[i][1]] = results.data[i][5];
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


//Get today's date
// Function based on https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
function getDate(prevMonth) {
    var today = new Date();
    
    // Used for the oldData fuction
    if(prevMonth){
         var month = 1+prevMonth;
    }else{
        var month = 1;
    }

    // Because the data doesn't start till mid January, we are not able to get any result back if we look before at a day before the start date.
    if(prevMonth === -3){
        var dd = 20;
    }else{
        var dd = String(today.getDate()).padStart(2, '0');
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

// function styleFeature is a loop, don't know why but it is.
// feature.i.NAME for the name of the state in the Data 
// So a call to the function getVaccineData(stateName) should get us everything we need
// if (censusVariable < censusMin) {censusMin = censusVariable; } function to add inside getVaccineData to know min and max

// Temporary values
var censusMin = 13.33;
var censusMax = 26.19;
var censusValue;
// Actual code
var map;

// Initialize and add the map
function initMap() {
   
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        //Center the map on the USA
        center: { lat: 40, lng: -100 },
    });

    //Calls styleFeature function && mouseover events
    map.data.setStyle(styleFeature);
    map.data.addListener("mouseover", mouseInToRegion);
    map.data.addListener("mouseout", mouseOutOfRegion);

    //Add the Min and Max values to the legend
    document.getElementById("census-min").textContent = "Min: " + censusMin;
    document.getElementById("census-max").textContent = "Max: " + censusMax;

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
    // Attribute random value until getVaccineData bug fix
    // censusValue = Math.floor(Math.random() * 13)+13;
    //console.log(censusValue);
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
setTimeout(function(){ initMap(); }, 100);
