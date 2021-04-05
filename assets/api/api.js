// Not sure how the stateID is gonna be declared yet
var stateID;

//Runs all the APis with the stateID
function runAPIs(stateID){
    
    getCovidData(stateID);
   
}



// Api call for get the covid Data using the XMLHttpRequest Object
//Return the result with renderCovidData 
function getCovidData(stateID) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var covidData = JSON.parse(this.response);
            //Returns the confirmed, recovered and deaths in the last 24hrs
            ren
            renderCovidData(covidData[0].provinces[stateID].confirmed, covidData[0].provinces[stateID].recovered, covidData[0].provinces[stateID].deaths);
        }
    });

    // XMLHttpRequest
    xhr.open("GET", "https://covid-19-data.p.rapidapi.com/report/country/name?date=2020-04-01&name=USA");
    xhr.setRequestHeader("x-rapidapi-key", "af9daf036amsh4c7360d9db21318p14bbcajsn1c70e54a7721");
    xhr.setRequestHeader("x-rapidapi-host", "covid-19-data.p.rapidapi.com");
    xhr.send(data);
};
