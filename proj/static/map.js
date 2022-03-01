
const map = L.map('map').setView([17.6078, 8.0817], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 2,
}).addTo(map);
let x=0;
let nodes=[];

const sleep=(delay)=>new Promise((resolve)=>setTimeout(resolve,delay))

async function animate(path,nodes){
    await sleep(5000);
    for(let pathIndex in path){
        icon = L.icon({
            iconUrl: '/static/car.png',
            iconSize: [50, 50], // size of the icon
            // iconAnchor: [22, 94],
            className: 'marker'
        });
        console.log("marking",nodes[path[pathIndex]].Coordinates[1],nodes[path[pathIndex]]);
        marker = L.marker([nodes[path[pathIndex]].Coordinates[1],nodes[path[pathIndex]].Coordinates[0]], {icon: icon}).addTo(map);
        await sleep(5000);
        marker.remove();
    }
}

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
    for(let j in data){
        dict[j]=data[j][getRandomInt(0,data[j].length-1)];
    }
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

var pathz;
var nodez;

function animate2(nodes,good_nodes){
    console.log("gud",good_nodes);
    for(let nodeIndex=+0;nodeIndex<good_nodes.length;nodeIndex+=1){
        console.log("heey",nodeIndex);
        icon = L.icon({
            iconUrl: '/static/gpic.png',
            iconSize: [50, 50], // size of the icon
            // iconAnchor: [22, 94],
            className: 'marker'
        });
        console.log(good_nodes[nodeIndex],nodes);
        console.log("marking",nodes[good_nodes[nodeIndex]].Coordinates[1],nodes[good_nodes[nodeIndex]]);
        marker = L.marker([nodes[good_nodes[nodeIndex]].Coordinates[1],nodes[good_nodes[nodeIndex]].Coordinates[0]], {icon: icon}).addTo(map);
    }
}


async function BFS(nodes){
    var n=nodes.length;
    var adj={};
    for(let node in nodes) {
        adj[node]=[];
    }
    for(let node in nodes){
        for(let node2 in nodes){
            let inserted=0;
            for(let km=1;km<20;km+=1){
                if(distance(nodes[node],nodes[node2])<=km && distance(nodes[node],nodes[node2])>km-1){
                    inserted+=1;
                    adj[+node].push(+node2);
                }
                if(inserted>0) {
                    break;
                }
            }
        }
    }
    console.log("adj list",adj);
    var visited=[];
    let queue=[];
    queue.push(n-1);
    visited.push(n-1);
    let kk=+0;
    await sleep(5000);
    while(queue.length!=0 && kk<10){
        await sleep(5000);
        kk+=1;
        const nn=queue.length;
        let good_nodes=[];
        let maxScore=0;
        for(let zz=0;zz<nn;zz+=1){
            let node = queue.shift();
            console.log("exploring",node);
            let score=0;
            //calculate score of this node
            for(let i in data){
                if(userData[i]==nodes[node][i] || userData[i]=="N/A"){
                    score+=1
                }
            }
            if(score>maxScore) {
                maxScore=score;
                good_nodes=[];
            }
            if(score==maxScore) {
                good_nodes.push(+node);
            }
            for(let j in adj[node]){
                console.log("j= ",adj[node][j],visited,visited.includes(+adj[node][j]));
                if(visited.includes(+adj[node][j])==false){
                    console.log("visiting",adj[node][j],"from ",node);
                    visited.push(+adj[node][j]);
                    queue.push(+adj[node][j]);
                }
            }
        }
        console.log("max possible score in this layer is ",maxScore);
        animate2(nodes,good_nodes);
    }
    console.log("adj",adj);
}

function TSP_SUBSET(nodes,path){
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
    queue.push([0,nodes[n-1],1<<dict[nodes[n-1].therapyType],JSON.stringify([n-1])]); //[distance so far, current node, mask]
    visited.push(JSON.stringify([nodes[n-1].Name,1]));
    while(steps<5000 && queue.length!=0){
        steps+=1;
        queue.sort(function(a,b){ //mimic priority queue, best first search
          return a[0] - b[0];
        });
        let value = queue.shift();
        for(let neighbours in nodes){
            if((nodes[neighbours].Name=="Source") || ((value[2]&(1<<dict[nodes[neighbours].therapyType]))==0)){
                let new_mask=value[2]|(1<<dict[nodes[neighbours].therapyType]);
                //if not visited nodes.name, new_mask
                if(nodes[neighbours].Name=="Source" && new_mask==target){
                    console.log("Shortest path",value[0]+distance(value[1],nodes[neighbours]));
                    console.log(value[3]);
                    pathz=JSON.parse(value[3]);
                    nodez=nodes;
                    //animate(JSON.parse(value[3]),nodes);
                    return;
                }
                if(new_mask==value[2] || visited.includes(JSON.stringify([nodes[neighbours].Name,new_mask]))==true){
                    continue;
                }
                let new_path=JSON.parse(value[3]);
                new_path.push(+neighbours);
                queue.push([value[0]+distance(value[1],nodes[neighbours]),nodes[neighbours],new_mask,JSON.stringify(new_path)]);
                visited.push(JSON.stringify([nodes[neighbours].Name,new_mask]));
            }
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

var data={
    "Service": ["Free of charge","Paid"],
    "Wheelchair": ["No","Yes","Limited"],
    "Pets": ["No","Yes","Leashed"],
    "Entity": ["Government","Private"],
    "Location": ["Easy to access","Difficult to access","N/A"]
};

var userData={};

function getUserData(){
    let j=1;
    for(let i in data){
        userData[i]=document.getElementById("dropdown-variants-Primary"+j).value;
        j+=1;
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
                httpRequest="https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:"+position.coords.longitude+","+position.coords.latitude+",5000&bias=proximity:"+position.coords.longitude+","+position.coords.latitude+"&limit=15&apiKey=[removed]"
                console.log("one ",httpRequest);
                //httpRequest="https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:80.2193408,13.0809856,5000&bias=proximity:80.2193408,13.0809856&limit=15&apiKey=d0cb9c1f0e4a4def9cb160e707238b15";
                console.log("two ",httpRequest);
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
                    for(let j in data){
                        dict[j]=data[j][getRandomInt(0,data[j].length-1)];
                    }

                    console.log(dict);
                    nodes.push(dict);
                    getUserData();
                    console.log(userData);
                    BFS(nodes);
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

document.querySelectorAll('.truck-button').forEach(button => {
    button.addEventListener('click', e => {

        e.preventDefault();
        
        let box = button.querySelector('.box'),
            truck = button.querySelector('.truck');
        
        if(!button.classList.contains('done')) {
            
            if(!button.classList.contains('animation')) {

                button.classList.add('animation');

                gsap.to(button, {
                    '--box-s': 1,
                    '--box-o': 1,
                    duration: .3,
                    delay: .5
                });

                gsap.to(box, {
                    x: 0,
                    duration: .4,
                    delay: .7
                });

                gsap.to(button, {
                    '--hx': -5,
                    '--bx': 50,
                    duration: .18,
                    delay: .92
                });

                gsap.to(box, {
                    y: 0,
                    duration: .1,
                    delay: 1.15
                });

                gsap.set(button, {
                    '--truck-y': 0,
                    '--truck-y-n': -26
                });

                gsap.to(button, {
                    '--truck-y': 1,
                    '--truck-y-n': -25,
                    duration: .2,
                    delay: 1.25,
                    onComplete() {
                        gsap.timeline({
                            onComplete() {
                                button.classList.add('done');
                            }
                        }).to(truck, {
                            x: 0,
                            duration: .4
                        }).to(truck, {
                            x: 40,
                            duration: 1
                        }).to(truck, {
                            x: 20,
                            duration: .6
                        }).to(truck, {
                            x: 96,
                            duration: .4
                        });
                        gsap.to(button, {
                            '--progress': 1,
                            duration: 2.4,
                            ease: "power2.in"
                        });
                    }
                });
                
            }
            
        } else {
            button.classList.remove('animation', 'done');
            gsap.set(truck, {
                x: 4
            });
            gsap.set(button, {
                '--progress': 0,
                '--hx': 0,
                '--bx': 0,
                '--box-s': .5,
                '--box-o': 0,
                '--truck-y': 0,
                '--truck-y-n': -26
            });
            gsap.set(box, {
                x: -24,
                y: -6
            });
        }

    });
});

document.getElementById("truck-button").onclick = function() {animate(pathz,nodez)};