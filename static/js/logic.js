//Load json data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


//Load data with d3.
d3.json(url).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

//Data markers reflect the mag of th earthquake by their size.
function markerSize (mag) {
    return mag * 2000;};


//Marker color by the depth. Greater depth = darker color.
function chooseColor(depth) {
    if (depth < 10) 
        return "#88eb10"; 
    else if (depth <30) 
        return "#cdde9b";
    else if (depth <50) 
        return "#edbf64";
    else if (depth <70) 
        return "#f0602b";
    else if (depth <90) 
        return "#b00202";
    else return "black";
}
//Create markers for each feature.
function createFeatures (earthquakeData) {
    //Bind popup that displays additional info for each marker.
    function onEachFeature(feature,layer) {
        layer.bindPopup(`<h1>Location: ${feature.properties.place}</h1> <hr> <h3>Date: ${new Date(feature.properties.time)}</h3><hr> <h3>Depth: ${feature.geometry.coordinates[2]}</h3> <h3>Magnitude: ${feature.properties.mag}</h3>`);
    }
    //Create a geojson layer for array
    let earthquakeslayers  = L.geoJSON (earthquakeData, {
        onEachFeature: onEachFeature});

    //Marker properties
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius:feature.properties.mag *5, 
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                color:"black",
                weight: 0.5});
            },
        
        onEachFeature: onEachFeature
    });

    //Use createMap function with earthquakes layer    
    createMap(earthquakes);
}

function createMap (earthquakes) {
    //Base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    let baseMaps = {
        "Street Map":street};

    let myMap =  L.map("map", {
        center:[
            10.819089, -120.036361],
        zoom: 4, 
        layers: [street, earthquakes]
    
    });

    L.control.layers(baseMaps, {collapsed:false}); 
    
    //Create Lengend
    let legend = L.control({position:"bottomright"});

    legend.onAdd = function() {
        
        let div = L.DomUtil.create("div", "info legend");
        let depth = [-10,10,30,50,70,90];

        div.innerHTML += "<h3 style = 'text-align:center'>Depth</h>"

        for (let i =0; i <depth.length; i++) {
            div.innerHTML += 
            '<i style = "background:' + chooseColor(depth [i] +1) + '"></i>'+ 
            depth[i] + (depth[i+1] ? '&ndash;' +depth [i+1]+ '<br>': '+');
            
        }
        return div;
    }; 

    legend.addTo(myMap);
}
