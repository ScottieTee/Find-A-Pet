//key and secret used in fetchAccessToken function to get access token

//Note: the use of async and await are used in the place of fetch() and .then() (fetch an still be used if desired)
//It is an easier and very common way of handling promises to avoid complicated call back functions. Mad possible by a the Axios CDN (line 15 of index.html)
const placeholderImg =
  "https://media.istockphoto.com/photos/dog-cardboar-neutral-on-member-of-bone-gang-picture-id187895300?b=1&k=20&m=187895300&s=170667a&w=0&h=Cikee4baMVe3JW0VqfAc3o7LLFDcGGx32HvwbkdMVaM=";
var petData = [];
const mainContainer = document.querySelector("#main");

const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

let petStorageArray = [];

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
        for (let i = 0; i < data.animals.length; i++) {
          let city = data.animals[i].contact.address.city;
          cities.push(city);
        }
        toGeoJSON();
        console.log(data);
        displayAnimals(data);
      });
    }
  });
};

// PET Associated Code

function displayAnimals(data) {
  for (var i = 0; i < data.animals.length; i++) {
    var name = data.animals[i].name;
    var age = data.animals[i].age;
    var size = data.animals[i].size;
    var description = data.animals[i].description;
    var breed = data.animals[i].breeds;
    var color = data.animals[i].colors;
    var photo = data.animals[i].photos;
    let contact = data.animals[i].contact;

    const onePet = {
      name,
      age,
      size,
      description,
      breed,
      color,
      photo,
      contact
    };
    petData.push(onePet);
  }
  console.log(petData);
  //after pet objects are all pushed into array, build the cards with object data
  buildCards(petData);
}

function buildCards(petArray) {
  mainContainer.innerHTML = "";
  const div1 = makeEl("div", "row"); //Only make 1
  for (let i = 0; i < petArray.length; i++) {
    const div2 = makeEl("div", "col s12 l3 m6");
    const div3 = makeEl("div", "card");
    const div4 = makeEl("div", "card-image");
    const img = makeEl("img");
    // If no image, use placeholder image from placeholderImg url
    if (!petArray[i].photo[0]) {
      img.setAttribute("src", placeholderImg);
    } else if (!petArray[i].photo[0].medium) {
      img.setAttribute("src", petArray[i].photo[0].large);
    } else {
      img.setAttribute("src", petArray[i].photo[0].medium);
    }

    const span = makeEl("span", "card-title pet-name");
    span.textContent = petArray[i].name;
    div4.append(img, span);
    const div5 = makeEl("div", "card-content");
    const pEl = makeEl("p");
    pEl.setAttribute("maxlength", "15");
    // If no description provided, fill it in
    if (!petArray[i].description) {
      pEl.textContent = "Oops! No description was provided for this pet.";
    } else {
      pEl.textContent = petArray[i].description;
    }
    div5.append(pEl);
    const div6 = makeEl("div", "card-action");
    const btn = makeEl("button", "waves-effect waves-light btn", "my-location");
    btn.setAttribute("data-index", `${i}`);
    btn.innerHTML = 'Adopt Me<i class="fa-solid fa-paw"></i>';
    div6.append(btn);
    div3.append(div4, div5, div6);
    div2.append(div3);
    div1.append(div2);

    //when the button is clicked, move to localStorage function (petButton)
    btn.onclick = function (petArray) {
      var selectPet = petData; 
      petInfo(selectPet[i]);
      // savePet(selectPet[i]);
    };
  }
  mainContainer.append(div1);
}

//make divs and p for pet page content
const petInfo = function (selectPet) {
    var petDiv = document.createElement("div");
    var petName = document.createElement("p");
      petName.textContent = selectPet.name;
    var petAge = document.createElement("p");
      petAge.textContent = selectPet.age;
    var petBreed = document.createElement("p");
      petBreed.textContent = selectPet.breeds;
    var petSize = document.createElement("p");
      petSize.textContent = selectPet.size;
    var petColor = document.createElement("p");
      petColor.textContent = selectPet.colors;
    var petDescription = document.createElement("p");
      petDescription.textContent = selectPet.description;
    var petContact = document.createElement("p");
      petContact.textContent = selectPet.contact;

    petDiv.textContent = 
        petName + 
        petAge + 
        petBreed + 
        petSize + 
        petColor + 
        petDescription + 
        petContact;

    mainContainer.appendChild(petDiv);
    petDiv.appendChild(petName);
    petDiv.appendChild(petDescription);
}

//localStorage to save pet in a button at the bottom of the page
var savePet = function () {  
  //add pet name to localStorage
  var savePet = localStorage.setItem("petStorageArray", JSON.stringify(petStorageArray));
}

function loadPets() {
  var data = localStorage.getItem("petStorageArray");
  petStorageArray = JSON.parse(data);
  if (petStorageArray === null) {
    petStorageArray = [];
    return false;
  }
}

//Make elements
const makeEl = function (el, classN, idName) {
  if (!classN && !idName) {
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

async function displayPet(data, index) {
  mainContainer.innerHTML = "";
  const mapDiv = makeEl('div', 'map', 'map')
  const div1 = makeEl("div", "row"); //Only make 1
  const div2 = makeEl("div", "col s12 l3 m6");
  const div3 = makeEl("div", "card");
  const div4 = makeEl("div", "card-image");
  const img = makeEl("img");
  // If no image, use placeholder image from placeholderImg url
  if (!data[index].photo[0]) {
    img.setAttribute("src", placeholderImg);
  } else if (!data[index].photo[0].medium) {
    img.setAttribute("src", data[index].photo[0].large);
  } else {
    img.setAttribute("src", data[index].photo[0].medium);
  }

  const span = makeEl("span", "card-title pet-name");
  span.textContent = data[index].name;
  div4.append(img, span);
  const div5 = makeEl("div", "card-content");
  const pEl = makeEl("p");
  pEl.setAttribute("maxlength", "15");
  // If no description provided, fill it in
  if (!data[index].description) {
    pEl.textContent = "Oops! No description was provided for this pet.";
  } else {
    pEl.textContent = data[index].description;
  }
  div5.append(pEl);
  const div6 = makeEl("div", "card-action");
  const btn1 = makeEl("button", "waves-effect waves-light btn", "my-location");
  // btn1.setAttribute("data-index", `${index}`);
  btn1.setAttribute("id", "back-show");
  btn1.innerHTML = 'Adopt Me<i class="fa-solid fa-paw"></i>';
  //const btn2 = makeEl("button", "waves-effect waves-light btn", "my-location");
  div6.append(btn1);
  div3.append(div4, div5, div6);
  div2.append(div3);
  div1.append(div2);
  mainContainer.append(div1, mapDiv);

  const city = petData[index].contact.address.city; 
  let geoLoc = await cityToGeoData(city);
  console.log(geoLoc);
  buildMap(geoLoc);


  //localstorage object
    let petStorageData = data[index];
    petStorageArray.push(petStorageData);
    console.log(petStorageArray);

  //if statement for html history function
  if (petStorageArray > 0) {
    historyButton(petStorageHistory);
  }
  savePet();
}

function showPet(e) {
  //if (e.target.getAttribute("data-index")) {
    let petIndex = parseInt(e.target.getAttribute("data-index"))
    //console.log(typeof petIndex);
    displayPet(petData, petIndex);
  // }
}

function petFlowHandler (e) {
  if (e.target.getAttribute("data-index")) {
    showPet(e);
  };

  if (e.target.getAttribute("id") === "back-show") {
    buildCards(petData);
    historyButton(petStorageArray);
  }
}

function historyButton (petStorageHistory, index) {
//html to display buttons for previously viewed pets
  var divEl = document.createElement("div");
  divEl.textContent = "previously viewed pets";
  //buttonEl.textContent = petStorageArray.name;

  for (var i = 0; i < petStorageHistory.length; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.textContent = petStorageHistory[i].name;
    buttonEl.classList = "waves-effect waves-light btn";
    buttonEl.innerHTML = `${petStorageHistory[i].name}<i class="fa-solid fa-paw"></i>`;
    divEl.appendChild(buttonEl);
    
  }

  mainContainer.appendChild(divEl);
}

// PET Associated Code

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

async function buildMap(geo) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYXBwc29sbyIsImEiOiJjbDA5dmptYWowaGcwM2lwOTY0dGxlOWp3In0.kulAfdlLVedrwX0Yh0qruQ";

  const map = await new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: geo, // starting position [lng, lat]
    zoom: 6, // starting zoom
  });

  // Create a default Marker and add it to the map.

  for (let i = 0; i < cityGeoJSON.length; i++) {
    let marker1 = await new mapboxgl.Marker({ color: "rgb(20, 200, 225)" })
      .setLngLat(geo)
      .addTo(map);
  }
}

// console.log(nameData);
// console.log(ageData);
// console.log(sizeData);
// console.log(breedData);
// console.log(colorData);
// console.log(photo);

//api data
//name
//age
//size
//breed
//color
//photo

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

mainContainer.addEventListener("click", petFlowHandler);

// Navbar Dropdown

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});

loadPets();