//Load json data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//Load data with d3.
d3.json(url).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

//Data markers reflect the mag of th earthquake by their size
function markerSize (mag) {
    return mag * 2000;};


//Marker color by the depth.

