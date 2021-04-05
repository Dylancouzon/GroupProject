var CovidData;
var stateName = "Alabama";
//Runs all the APis with the stateID
function runAPIs(stateID) {

    getCovidData(stateID);
    getVaccineData(stateName);
}

// Api call to get the covid Data using the XMLHttpRequest Object
//Return the result with renderCovidData 
function getCovidData(stateID) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var covidData = JSON.parse(this.response);
            //Returns the confirmed, recovered and deaths in the last 24hrs
            // Needs to be activated
            // renderCovidData(confirmed, recovered, deaths);
            // renderCovidData(covidData[0].provinces[stateID].confirmed, covidData[0].provinces[stateID].recovered, covidData[0].provinces[stateID].deaths);
            // OR
            // CovidData = [confirmed, recovered, deaths];
            CovidData = [covidData[0].provinces[stateID].confirmed, covidData[0].provinces[stateID].recovered, covidData[0].provinces[stateID].deaths];
            // OR
            //renderCovidData = {
            //confirmed: xx,
            // recovered: xx,
            //deaths: xx
            //}
        }
    });

    // XMLHttpRequest
    xhr.open("GET", "https://covid-19-data.p.rapidapi.com/report/country/name?date=2020-04-01&name=USA");
    xhr.setRequestHeader("x-rapidapi-key", "af9daf036amsh4c7360d9db21318p14bbcajsn1c70e54a7721");
    xhr.setRequestHeader("x-rapidapi-host", "covid-19-data.p.rapidapi.com");
    xhr.send(data);
}

// Get the vaccine Data csv file and parse it into Json.
function getVaccineData(stateName) {
    var date = getDate();
    var url = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv";
    //Parse the csv Data into Json
    Papa.parse(url, {
        download: true,
        complete: function (results) {
            //need to look inside the array where date == date and stateName == statename
            console.log(results.data);
        }
    });
}

//Get today's date
// Function base on https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
function getDate(){
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
return today;
}

//Temporarily run the function
runAPIs(1);