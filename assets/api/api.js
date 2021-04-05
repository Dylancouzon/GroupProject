var returnCovidData;
var returnVaccineData;
//Runs all the APis with the stateName
function runAPIs(stateName) {
    //Need to add a function that checks if the Name is valid
    getCovidData(stateName);
    getVaccineData(stateName);
}

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
            for(i=0; i < covidData[0].provinces.length; i++){
                if (covidData[0].provinces[i].province == stateName) {
                     // returnCovidData = [confirmed, recovered, deaths];
                    returnCovidData = [covidData[0].provinces[i].confirmed, covidData[0].provinces[i].recovered, covidData[0].provinces[i].deaths];
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

// Get the vaccine Data csv file and parse it into Json.
function getVaccineData(stateName) {
    var date = getDate();
    var url = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv";
    //Parse the csv Data into Json
    Papa.parse(url, {
        download: true,
        complete: function (results) {
            //need to look inside the array where results.data.date == date and results.data.stateName == statename
            for(i=0; i < results.data.length; i++){
                if (results.data[i][0] == date && results.data[i][1] == stateName) {
                    // returnVaccineData = Total number of shots given, number of people vaccinated, percentage of people vaccinated, number of people fully vaccinated, daily vaccinations
                    returnVaccineData = [results.data[i][2], results.data[i][4], results.data[i][5], results.data[i][7], results.data[i][11]];
                    console.log(returnVaccineData);
                    //Break the loop once we have the value needed
                   break;
               }
            }
        }
    });
}

//Get today's date
// Function base on https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
}

//Temporarily run the function
runAPIs("California");