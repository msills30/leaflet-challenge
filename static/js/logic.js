// Store our API endpoint as queryUrl.

//https://leafletjs.com/examples/choropleth/ Thank you website

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Create a Leaflet map instance.
  let map = L.map("map").setView([37.09, -95.71], 4);

  // Create a tile layer for the map background.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
    maxZoom: 18,
  }).addTo(map);

  // Loop through the earthquake data array and create markers with circles for each earthquake.
  for (let i = 0; i < earthquakeData.length; i++) {
    let earthquake = earthquakeData[i];

    // Conditionals for color based on magnitude.
        let color = "";
    if (earthquake.geometry.coordinates[2] > 90) {
      color = "red";
    } else if (earthquake.geometry.coordinates[2] > 70) {
      color = "orangered";
    } else if (earthquake.geometry.coordinates[2] > 50) {
      color = "orange";
    } else if (earthquake.geometry.coordinates[2] > 30) {
      color = "yellow";
    } else if (earthquake.geometry.coordinates[2] > 10) {
      color = "yellowgreen";
    } else if (earthquake.geometry.coordinates[2] > -10) {
      color = "lawngreen";
    } else {
      color = "";
    }

    // Create a marker with a circle for each earthquake.
    let marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      fillOpacity: 0.8,
      color: "black",
      fillColor: color,
      weight: 0.5,
      radius: Math.sqrt(earthquake.geometry.coordinates[2]) * 2,
    }).addTo(map);

    // Add a popup to the marker with earthquake information.
    marker.bindPopup(`<h3>${earthquake.properties.place}</h3></h3> Depth:${earthquake.geometry.coordinates[2]}</h3><hr>${new Date(earthquake.properties.time)}</p>`);
  }

  // Create a legend control
let legend = L.control({ position: "bottomright" });

// Function to generate the HTML content for the legend
legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "legend");

  // Define the labels and corresponding colors for the legend
  let labels = ["-10 to 10", "10 to 30", "30 to 50", "50 to 70", "70 to 90", "90+"];
  let colors = ["lawngreen", "yellowgreen", "yellow", "orange", "orangered", "red"];

  // Loop through the labels and colors to create the legend items
  for (let i = 0; i < labels.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
  }
  return div;
};

// Add the legend to the map
legend.addTo(map);
        
}


