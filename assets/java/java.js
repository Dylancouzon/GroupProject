// create list below search bar that shows previous searches
    //
    //will be saved on local storage
//add event listener to search button, and if clicked, run function DisplayData()
    //run funciton  that will display both the map and the graph for that specific state
    // the right side will parse out the data by state
        //will have 50 different if statements saying that if search = statename, then display the data for that specific state
            //inside if statement: beneath the graph area, we will create a list of different vaccination facts for that given state
var listAreaDoc = $('#list')
var searchTextAreaDoc = $('#search')
var searchButtonDoc = $('#button')

function displayData () {

  function runAPIs () 






    var Fact1List = ('<li>')
    var Fact2List = ('<li>')
    var Fact3List = ('<li>')
    var Fact4List = ('<li>')
    var Fact5List = ('<li>')
    var Fact6List = ('<li>')
    var Fact7List = ('<li>')


    Fact1List.text ('confirmed cases: ' + returnCovidData [0])
    Fact2List.text ('recovered: ' + returnCovidData [1])
    Fact3List.text ('deaths' + returnCovidData [2])
    Fact4List.text ('number of shots state was given:' + returnVaccineData [0] )
    Fact5List.text (' number of people vaccinated:' + returnVaccineData [1] )
    Fact6List.text ('percentage of people vacinated' + returnVaccineData [2] )
    Fact7List.text ('number of people fully vaccinated:' + returnVaccineData [3] )
    Fact8List.text ('amount of daily vaccinations:' + returnVaccineData [4] )



   
    Fact1List.attr ('class','')
    Fact2List.attr ('class','')
    Fact3List.attr ('class','')
    Fact4List.attr ('class','')
    Fact5List.attr ('class','')
    Fact6List.attr ('class','')
    Fact7List.attr ('class','')
    Fact8List.attr ('class','')



    listAreaDoc.append(Fact1List)
    listAreaDoc.append(Fact2List)
    listAreaDoc.append(Fact3List)
    listAreaDoc.append(Fact4List)
    listAreaDoc.append(Fact5List)
    listAreaDoc.append(Fact6List)
    listAreaDoc.append(Fact7List)
    listAreaDoc.append(Fact8List)







}


//********************Graph***************************



searchButtonDoc.addEventListener (click, diplayData())




const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      },
      hover: {
        mode: 'index',
        intersec: false
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          },
          min: 0,
          max: 100,
          ticks: {
            // forces step size to be 50 units
            stepSize: 50
          }
        }
      }
    },
  };


  const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.CHART_COLORS.red,
    },
    {
      label: 'Dataset 2',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.blue,
      backgroundColor: Utils.CHART_COLORS.blue,
    }
  ]
};

const actions = [
    {
      name: 'Randomize',
      handler(chart) {
        chart.data.datasets.forEach(dataset => {
          dataset.data = Utils.numbers({count: chart.data.labels.length, min: 0, max: 100});
        });
        chart.update();
      }
    },
    {
      name: 'Add Dataset',
      handler(chart) {
        const data = chart.data;
        const dsColor = Utils.namedColor(chart.data.datasets.length);
        const newDataset = {
          label: 'Dataset ' + (data.datasets.length + 1),
          backgroundColor: dsColor,
          borderColor: dsColor,
          data: Utils.numbers({count: data.labels.length, min: 0, max: 100}),
        };
        chart.data.datasets.push(newDataset);
        chart.update();
      }
    },
    {
      name: 'Add Data',
      handler(chart) {
        const data = chart.data;
        if (data.datasets.length > 0) {
          data.labels = Utils.months({count: data.labels.length + 1});
  
          for (var index = 0; index < data.datasets.length; ++index) {
            data.datasets[index].data.push(Utils.rand(0, 100));
          }
  
          chart.update();
        }
      }
    },
    {
      name: 'Remove Dataset',
      handler(chart) {
        chart.data.datasets.pop();
        chart.update();
      }
    },
    {
      name: 'Remove Data',
      handler(chart) {
        chart.data.labels.splice(-1, 1); // remove the label first
  
        chart.data.datasets.forEach(dataset => {
          dataset.data.pop();
        });
  
        chart.update();
      }
    }
  ];