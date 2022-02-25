
const map = L.map('map').setView([17.6078, 8.0817], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2,
}).addTo(map);

let x=0;
function process(coordinates,info){
    x+=1;
    if(x>3) {
        x=3;
    }
    console.log("adding..")
    icon = L.icon({
        iconUrl: '/static/therapy'+x+'-modified.png',
        iconSize: [50, 50], // size of the icon
        // iconAnchor: [22, 94],
        popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
        className: 'marker'
    });
    popup = `<div class="container">
                <h4 style='display:inline'><b>${info.name}</b><h6 style='display:inline'>, ${info.formatted}</h6></h4>
                <div>
                <h4>Distance ${info.distance} </h1>
                <a href=${info.categories[0]}><em class="fab fa-linkedin"></em></a>
                <a href=${info.distance}><em class="fab fa-github"></em></a>
                </div>
                </div>`;
    marker = L.marker([coordinates[1], coordinates[0]], {icon: icon}).addTo(map);
    marker.bindPopup(popup);
}

function distance(Fellow1, Fellow2) {
    let lat1 = Fellow1.lat, lat2 = Fellow2.lat, lon1 = Fellow1.long, lon2 = Fellow2.long
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    // calculate the result
    return (c * r);
}


let popup;
let icon;
let marker;

// Set the visitor's pin on the map on demand
const setVisitorPin = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                map.flyTo([position.coords.latitude, position.coords.longitude], 13);
                // On success..Get current cordinates.
                var requestOptions = {
                    method: 'GET',
                };
                var cooords=[];
                var type=[];
                httpRequest="https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:80.2817361,13.0924013,5000&bias=proximity:"+position.coords.longitude+","+position.coords.latitude+"&limit=50&apiKey=removed"
                fetch(httpRequest, requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    l=result.features;
                    for(var i=0;i<l.length;i++){
                        console.log(l[i].geometry.coordinates)
                        process(l[i].geometry.coordinates,l[i].properties)
                    }
                  })
                .catch(error => console.log('error', error));
                    console.log(cooords);
                    console.log(type);
                let circle = L.circle([position.coords.latitude, position.coords.longitude], {
                    color: 'black',
                    //fillColor: '#f03',
                    //fillOpacity: 0.5,
                    radius: 200000
                }).addTo(map);
                //circle.bindPopup("You are here!").openPopup();
            },
            function (error) {
                // On error code..Do nothing
            },
            {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
        );
    }
}

const bindToPinButton = () => {
    const button = document.querySelector("#add-my-pin");
    let buttonClickListener = () => {
        setVisitorPin();
        button.removeEventListener("click", buttonClickListener);
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        button.classList.add("disabled");
    }

    button.addEventListener("click", buttonClickListener);
}
document.addEventListener("DOMContentLoaded", bindToPinButton);
