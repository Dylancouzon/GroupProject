
// function styleFeature is a loop, don't know why but it is.
// feature.i.NAME for the name of the state in the Data 
// So a call to the function getVaccineData(stateName) should get us everything we need
// if (censusVariable < censusMin) {censusMin = censusVariable; } function to add inside getVaccineData to know min and max

// Temporary values
var censusMin = 12;
var censusMax = 35;
var censusTempValue = 18;

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

// Add the styling to each state
function styleFeature(feature) {
  const low = [5, 69, 54]; // color of smallest datum
  const high = [151, 83, 34]; // color of largest datum
  // delta represents where the value sits between the min and max
  const delta =
    (censusTempValue - censusMin) /
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

    // update the label
    document.getElementById("data-label").textContent = e.feature.getProperty(
      "NAME"
    );
    document.getElementById("data-value").textContent = 'test';
    document.getElementById("data-box").style.display = "block";
  }
  
//Mouse out function
  function mouseOutOfRegion(e) {
    // reset the hover state, returning the border to normal
    e.feature.setProperty("state", "normal");
  }