
const map = L.map('map').setView([17.6078, 8.0817], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2,
}).addTo(map);
let x=0;
let nodes=[];
function process(coordinates,info){
    x+=1;
    if(x>3) {
        x=3;
    }
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
    var dict = {
        Name: info.name,
        Coordinates: coordinates,
        Categories: info.categories,
        therapyType: 'Counselling'
    };
    nodes.push(dict);
}

function distance(Place1, Place2) {
    let lat1 = Place1.Coordinates[1], lat2 = Place2.Coordinates[1];
    let lon1 = Place1.Coordinates[0], lon2 = Place2.Coordinates[0];
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

const therapy = ["Counselling", "Art", "Hypnotherapy","Depression", "CBT", "Existential"];

function getPath(){
    let required = [];
    for(let type in therapy){
        if ($("#"+therapy[type]).is(':checked')){
            required.push(therapy[type]);
        }
    }
    return required;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function TSP_SUBSET(nodes,path){
    console.log(nodes,path);
    var dict = {"Source":0}; //type->mask
    for(let type in path){
        dict[path[type]]=+type + +1; //map therapy type to integer
    }
    var target=1;
    for(let type in path){
        target|=1<<dict[path[type]];
    }
    var n=nodes.length;
    var queue=[]
    let visited=[]
    let steps=0;
    queue.push([0,nodes[n-1],1<<dict[nodes[n-1].therapyType]]) //[distance so far, current node, mask]
    visited.push(JSON.stringify([nodes[n-1].Name,1]));
    while(steps<50){
        steps+=1;
        queue.sort(function(a,b){ //mimic priority queue, best first search
          return a[0] - b[0];
        });
        let value = queue.shift();
        if(value[1].Name=="Source" && value[2]==target){
            console.log("Shortest path",value[0]);
            break;
        }
        for(let neighbours in nodes){
            let new_mask=value[2]|(1<<dict[nodes[neighbours].therapyType]);
            //if not visited nodes.name, new_mask
            if(visited.includes(JSON.stringify([nodes[neighbours].Name,new_mask]))==true){
                continue;
            }
            console.log(JSON.stringify(visited));
            queue.push([value[0]+distance(value[1],nodes[neighbours]),nodes[neighbours],new_mask]);
            visited.push(JSON.stringify([nodes[neighbours].Name,new_mask]));
        }
    }
    //queue
    //sort queue
    //[distance,mask of visited]
    //visit other stuff
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
                httpRequest="https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:80.2817361,13.0924013,5000&bias=proximity:"+position.coords.longitude+","+position.coords.latitude+"&limit=2&apiKey=d0cb9c1f0e4a4def9cb160e707238b15"
                fetch(httpRequest, requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    l=result.features;
                    for(var i=0;i<l.length;i++){
                        process(l[i].geometry.coordinates,l[i].properties)
                    }
                    var dict = {
                        Name: 'Source',
                        Coordinates: [position.coords.longitude, position.coords.latitude],
                        Categories: 'NULL',
                        therapyType: 'Source',
                    };
                    nodes.push(dict);
                    TSP_SUBSET(nodes,getPath());
                  })
                .catch(error => console.log('error', error));
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

/*
    Dropdown with Multiple checkbox select with jQuery - May 27, 2013
    (c) 2013 @ElmahdiMahmoud
    license: https://www.opensource.org/licenses/mit-license.php
*/

$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).val() + ",";

  if ($(this).is(':checked')) {
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $(".hida").hide();
  } else {
    $('span[title="' + title + '"]').remove();
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);

  }
});
