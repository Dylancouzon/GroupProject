// create list below search bar that shows previous searches
    //will be saved on local storage
//add event listener to search button, and if clicked, run function DisplayData()
    //run funciton  that will display both the map and the graph for that specific state
    // the right side will parse out the data by state
        //will have 50 different if statements saying that if search = statename, then display the data for that specific state
            //inside if statement: beneath the graph area, we will create a list of different vaccination facts for that given state
            var listAreaDoc = $('#list');
            var searchTextAreaDoc = $('#searchText');
            var searchButtonDoc = $('#searchButton');
            var stateName = 'California';
            var historyDoc = $('#historyList');
            var historyButton = $('#dropdown');
            
            
            function displayData (stateName) {
                
              
              $(".stateTitle").html(stateName);
              var stateName = searchTextAreaDoc.val();
            
              var covidConfirmedCases = returnCovidData[0];
              covidConfirmedCases = covidConfirmedCases.toString();
              
              var covidRecoveredCases = returnCovidData[1];
              covidRecoveredCases = covidRecoveredCases.toString();
            
              var covidDeathCases = returnCovidData[2];
              covidDeathCases = covidDeathCases.toString();
            
              var stateShotsGiven = returnVaccineData [0];
              stateShotsGiven = stateShotsGiven.toString();
              
              
            
            
            
            
            
            
                var Fact1List = $('#Fact1Lista');
                var Fact2List = $('#Fact2Lista');
                var Fact3List = $('#Fact3Lista');
                var Fact4List = $('#Fact4Lista');
                var Fact5List = $('#Fact5Lista');
                var Fact6List = $('#Fact6Lista');
                var Fact7List = $('#Fact7Lista');
                var Fact8List = $('#Fact8Lista');
            
            
            
                Fact1List.text ('confirmed cases: ' + covidConfirmedCases  );
                Fact2List.text ('recovered: ' + covidRecoveredCases);
                Fact3List.text ('deaths: ' + covidDeathCases );
                Fact4List.text ('number of shots given: ' + stateShotsGiven );
                Fact5List.text (' number of people vaccinated: ' + returnVaccineData [1] );
                Fact6List.text ('percentage of people vacinated: ' + returnVaccineData [2] + '%'  );
                Fact7List.text ('number of people fully vaccinated: ' + returnVaccineData [3] );
                Fact8List.text ('amount of daily vaccinations: ' + returnVaccineData [4] );
            
            
            
                Fact1List.append(Fact1List);
                Fact2List.append(Fact2List);
                Fact3List.append(Fact3List);
                Fact4List.append(Fact4List);
                Fact5List.append(Fact5List);
                Fact6List.append(Fact6List);
                Fact7List.append(Fact7List);
                Fact8List.append(Fact8List);
            
               
            
                var newData = oldData.reverse();
                
            
            
            //********************Graph***************************
            
            $('#lineChart').replaceWith($('<canvas id="lineChart" height="100px" width="100px"></canvas>'));
            
                const CHART = $('#lineChart');
                let lineChart = new Chart(CHART, {
                  type: 'line',
                  data: {
                    labels: ["January", "February", "March", "April"], //labels the x axis
                    datasets: [
                        {   //everything here styles the graph
                            label: "number of people vaccinated",
                            fill: true,
                            lineTension: 0.1,
                           
                            backgroundColor: "rgba(75, 192, 192, 0.4)",
                            
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHitRadius: 10,
                            // input for data set
                            data: newData ,
                        }
                    ]}
                
                });
            
            }
            

             //local storage... hopefully

             var stateHistory = JSON.parse(localStorage.getItem ("arrayList") );
            
            if ( !stateHistory ) {
              stateHistory = [];
              console.log('test');
            }

            function addToArray() {
              if (searchTextAreaDoc.value != "" ) {
                stateHistory.unshift (searchTextAreaDoc.val());
                console.log(stateHistory);
                stateHistory = stateHistory.slice(0,5);
                localStorage.setItem("arrayList",JSON.stringify(stateHistory));
                searchList();
                
              }
          
            }
            
            function searchList() {
              historyDoc.empty();
              for (var i = 0 ; i< stateHistory.length; i++) {
                var createList = $('<li>');
                historyDoc.append(createList);
                var createButton = $('<button>');
                createButton.text(stateHistory[i]).addClass("button").attr("id", stateHistory[i]);
                createList.append(createButton);
              }

            }
            //function for event listener
            function displayData2(event){

              
              if(event.target.id == "searchButton"){
                var stateName = searchTextAreaDoc.val();
                
              }else{
                event.preventDefault();
                var stateName = event.target.id;
              }
              var displayErrorDoc = $('#error');

              
              var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
             

                if (states.includes(stateName)){
                  displayErrorDoc.empty();

                  displayErrorDoc.append(displayErrorDoc);

                  runAPIs(stateName);
                  setTimeout(function(){ displayData(stateName);}, 300); 
                  if(event.target.id == "searchButton"){addToArray();}            

                 

                }
                else{
                  displayErrorDoc.text('Please enter a valid State name');
                displayErrorDoc.css (  'color', 'red' );
                displayErrorDoc.append(displayErrorDoc);
                }
              
              
             
            
            }

            
            
            
            historyButton.on ('click', displayData2);
            searchButtonDoc.on ('click', displayData2);
            searchList ();
