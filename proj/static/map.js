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
            iconUrl: '/static/car.jpg',
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
    let x=getRandomInt(1,3);
    icon = L.icon({
        iconUrl: '/static/therapy'+x+'-modified.png',
        iconSize: [50, 50], // size of the icon
        // iconAnchor: [22, 94],
        popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
        className: 'marker'
    });
    var dict = {
        Name: info.name,
        Coordinates: coordinates,
        Categories: info.categories
    };
    dict["therapyType"]=therapy[getRandomInt(0,therapy.length-1)];
    let optionz=[];
    for(let j in data){
        console.log(data[j]);
        dict[j]=data[j][getRandomInt(0,data[j].length-1)];
        optionz.push(getRandomInt(0,data[j].length-1)+parseInt(1));
    }
    console.log(optionz);
    popup = `<div class="container">
                <h4 style='display:inline'><b>${info.name}</b><h6 style='display:inline'>, ${info.formatted}</h6></h4>
                <div>
                <h4><img src="/static/dog.jpg" style="height:35px;display: inline"> <img src="/static/cross${optionz[2]}.png" style="height:35px;display: inline">
                <img src="/static/wheelchair.jpg" style="height:35px;display: inline"> <img src="/static/cross${optionz[1]}.png" style="height:35px;display: inline"></h4>
                <h4><img src="/static/free.jpg" style="height:35px;display: inline"> <img src="/static/cross${optionz[0]}.png" style="height:35px;display: inline">
                <img src="/static/gov.jpg" style="height:35px;display: inline"> <img src="/static/cross${optionz[3]}.png" style="height:35px;"></h4>
                <h4><img src="/static/traffic.jpg" style="height:35px;"> <img src="/static/cross${optionz[4]}.png" style="height:35px;"></h4>
                <a href=${info.categories[0]}><em class="fab fa-linkedin"></em></a>
                <a href=${info.distance}><em class="fab fa-github"></em></a>
                </div>
                </div>`;
    marker = L.marker([coordinates[1], coordinates[0]], {icon: icon}).addTo(map);
    marker.bindPopup(popup);
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
    return (c * r).toFixed(1);
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
var radius1=200;
function animate2(nodes,good_nodes){
    console.log("good nodes",good_nodes,nodes)
    // let circle = L.circle([nodes[nodes.length-1].Coordinates[1],nodes[nodes.length-1].Coordinates[0]], {
    //     color: 'black',
    //     fillColor: '#f03',
    //     fillOpacity: 0.5,
    //     radius: radius1
    // }).addTo(map);
    // radius1+=2000;
    for(let nodeIndex=+0;nodeIndex<good_nodes.length;nodeIndex+=1){
        console.log("heey",nodeIndex);
        icon = L.icon({
            iconUrl: '/static/gpic.png',
            iconSize: [50, 50], // size of the icon
            // iconAnchor: [22, 94],
            className: 'marker'
        });
        popup = `<div class="container">
            <h4 style='display:inline'><b></b><h6 style='display:inline'>${nodes[good_nodes[nodeIndex]].Name}</h6></h4>
            <div>
            <a href=''><em class="fab fa-linkedin"></em></a>
            <a href=''><em class="fab fa-github"></em></a>
            </div>
        </div>`;
        marker = L.marker([nodes[good_nodes[nodeIndex]].Coordinates[1],nodes[good_nodes[nodeIndex]].Coordinates[0]]).addTo(map);
        marker.bindPopup(popup);
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
            for(let km=1;km<2;km+=1){
                if(distance(nodes[node],nodes[node2])<=km && distance(nodes[node],nodes[node2])>0){
                    inserted+=1;
                    adj[+node].push(+node2);
                }
            }
        }
    }
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
                if(visited.includes(+adj[node][j])==false){
                    console.log("visiting",adj[node][j],"from ",node);
                    visited.push(+adj[node][j]);
                    queue.push(+adj[node][j]);
                }
            }
        }
        console.log("max possible score in this layer is ",maxScore,"OF NODE",nodes[good_nodes[good_nodes.length-1]]);
        animate2(nodes,good_nodes);
    }
}

function TSP_SUBSET(nodes,path){
    console.log(nodes);
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
                    console.log("Shortest path",parseFloat(value[0])+distance(value[1],nodes[neighbours]));
                    document.getElementById('content1').innerHTML="The shortest path for your round trip is "+(parseFloat(value[0])+parseFloat(distance(value[1],nodes[neighbours])))+" Km";
                    document.getElementById('content2').innerHTML="Click start trip! and follow the path of the car, for the shortest route";
                    if(parseFloat(value[0])+parseFloat(distance(value[1],nodes[neighbours]))>0){
                        document.getElementById('yes1').click();
                    }
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
                queue.push([parseFloat(value[0])+parseFloat(distance(value[1],nodes[neighbours])),nodes[neighbours],new_mask,JSON.stringify(new_path)]);
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
    "Location": ["Easy to access","Difficult to access"]
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
                httpRequest="https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:"+position.coords.longitude+","+position.coords.latitude+",5000&bias=proximity:"+position.coords.longitude+","+position.coords.latitude+"&limit=20&apiKey=d0cb9c1f0e4a4def9cb160e707238b15"
                console.log("one ",httpRequest);
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
                    //BFS(nodes);
                    TSP_SUBSET(nodes,getPath());
                  })
                .catch(error => console.log('error', error));
                // let circle = L.circle([position.coords.latitude, position.coords.longitude], {
                //     color: 'black',
                //     //fillColor: '#f03',
                //     //fillOpacity: 0.5,
                //     radius: 200000
                // }).addTo(map);
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

window.onload = function() {
  document.getElementById("yes1").click();
};


document.getElementById("truck-button1").onclick = function() {BFS(nodes)};
