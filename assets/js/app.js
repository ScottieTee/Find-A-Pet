//key and secret used in fetchAccessToken function to get access token

//Note: the use of async and await are used in the place of fetch() and .then() (fetch an still be used if desired)
//It is an easier and very common way of handling promises to avoid complicated call back functions. Mad possible by a the Axios CDN (line 15 of index.html)

const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

// cities[] is filled with city names from pet locations in fetchPets() for loop
const cities = [];
// cities[] is then converted to coordinates via toGeoJSON() and stored in cityGeoJSON[] - this data is for the map pins
let cityGeoJSON = [];

const fetchAccessToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", apiKey);
  params.append("client_secret", secret);
  const petfinderRes = await fetch(
    "https://api.petfinder.com/v2/oauth2/token",
    {
      method: "POST",
      body: params,
    }
  );
  const data = await petfinderRes.json();
  accessToken = data.access_token; //Saves access token
};

// If no access token, get one and store it in above accessToken variable
if (!accessToken) {
  fetchAccessToken();
}

// Petfinder API call
const fetchPets = (location) => {
  fetch(`https://api.petfinder.com/v2/animals?location=${location}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    if (res) {
      res.json().then((data) => {
        console.log(data);
        for (let i = 0; i < data.animals.length; i++) {
          let city = data.animals[i].contact.address.city;
          cities.push(city);
        }
        toGeoJSON();
      });
    }
  });
};

// Find user location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Once user location found, latitude and longitude
function showPosition(position) {
  const lat = position.coords.latitude.toString();
  const long = position.coords.longitude.toString();
  // Runs query to API when "Near Me" is clicked
  fetchPets(lat + "," + long);
}

function handleError(err) {
  console.warn(`Error(${err.code}): ${err.message}`);
}

const myLocationHandler = function () {
  getLocation();
  //fetchPets(...myLocation);
};

const zipFormHandler = function (e) {
  e.preventDefault();
  const zipCode = document.querySelector("#zip").value;
  fetchPets(zipCode);
};

/******** MAP **********/

async function cityToGeoData(city) {
  const respons = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=c20b708b2952fc5492619c70affe0677`
  );
  if (respons) {
    const lat = respons.data[0].lat;
    const lon = respons.data[0].lon;
    const geoData = [lon, lat];
    return geoData;
  } else {
    alert("Error with geo location");
  }
}

async function toGeoJSON() {
  for (let i = 0; i < cities.length; i++) {
    let data = await cityToGeoData(cities[i]);

    cityGeoJSON.push(data);
    //console.log(data);

    if (i === cities.length - 1) {
      //buildMap();
    }
  }
  //console.log(cityGeoJSON);
}

function buildMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYXBwc29sbyIsImEiOiJjbDA5dmptYWowaGcwM2lwOTY0dGxlOWp3In0.kulAfdlLVedrwX0Yh0qruQ";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [-80.9, 35.2], // starting position [lng, lat]
    zoom: 6, // starting zoom
  });

  // Create a default Marker and add it to the map.

  for (let i = 0; i < cityGeoJSON.length; i++) {
    let marker1 = new mapboxgl.Marker({ color: "rgb(20, 200, 225)" })
      .setLngLat(cityGeoJSON[i])
      .addTo(map);
  }
}

/***** Event listeners ******/

myLocation.addEventListener("click", myLocationHandler);

// myLocationHandler runs the getLocation function, which uses the client side function navigator.geolocation.getCurrentPosition() (used to get the current position of the device).
// navigator.geolocation.getCurrentPosition() then runs showPosition()
// The latitude and longitude are then pulled from the position object in showPosition()
// latitude and longitude are then passed into fetchPets() which queries the pet database and send back pets near you as the variable "data".
// data is then passed onto a for loop to pull out the pet cities and stores city names into the cities array.
// The function toGeoJSON() is ran after the for loop completes.
// toGeoJSON() then runs the function cityToGeoData() which converts the city names (cities array), form the pet data, into coordinates (latitude and longitude) and is stored in an array called cityGeoJSON[]
// Once pet city names have been converted to lat and long, buildMap() is ran.
// Build map pulls lat and long data from cityGeoJSON[] and places the pins on the map.

zipForm.addEventListener("submit", zipFormHandler);

// zipFormHandler similer to myLocationHandler, just doesnt use navigator.geolocation.getCurrentPosition()
// zip code is passed into fetchPets() which queries the pet database and send back pets near you as the variable "data".
// data is then passed onto a for loop to pull out the pet cities and stores city names into the cities array.
// The function toGeoJSON() is ran after the for loop completes.
// toGeoJSON() then runs the function cityToGeoData() which converts the city names (cities array), form the pet data, into coordinates (latitude and longitude) and is stored in an array called cityGeoJSON[]
// Once pet city names have been converted to lat and long, buildMap() is ran.
// Build map pulls lat and long data from cityGeoJSON[] and places the cursores on the map.

// Navbar Dropdown

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});


//cards dynamically created 
let main = document.querySelector('#main');

//make elements
const makeEl = (el, classN, idName) => {
if (!classN && !idName){
  const element = document.createElement(el);
  return element;
} else if (!idName) {
  const element = document.createElement(el);
  element.className = `${classN}`;
  return element;
} else {
  const element = document.createElement(el);
  element.className = classN;
  element.id = idName;
  return element;
}
};

const div1 = makeEl('div', 'nav-wrapper')
const a1 = makeEl('brand-logo')
const a2 = makeEl('sidenav-trigger')
const list1 = makeEl('ul', 'right')
const list2 = makeEl('ul', 'right', 'mobile-demo')
const div2 = makeEl('div', 'row')
const div3 = makeEl('div', 'col')
const div4 = makeEl ('div', 'card')
const 


 // let newEl = document.createElement(el);
  //newEl.classList = cl;
  //return newEl
