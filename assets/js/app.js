//key and secret used in fetchAccessToken function to get access token

//Note: the use of async and await are used in the place of fetch() and .then() (fetch an still be used if desired)
//It is an easier and very common way of handling promises to avoid complicated call back functions. Mad possible by a the Axios CDN (line 15 of index.html)
const placeholderImg =
  "https://media.istockphoto.com/photos/dog-cardboar-neutral-on-member-of-bone-gang-picture-id187895300?b=1&k=20&m=187895300&s=170667a&w=0&h=Cikee4baMVe3JW0VqfAc3o7LLFDcGGx32HvwbkdMVaM=";
const mainContainer = document.querySelector("#main");

const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

let petStorageArray = [];
var petData = [];
var selectPetPage = [];

const cities = [];
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
      contact,
    };
    petData.push(onePet);
  }
  console.log(petData);
  //after pet objects are all pushed into array, build the cards with object data
  buildCards(petData);
  historyButton(petStorageArray);
}

function buildCards(petArray) {
  mainContainer.innerHTML = "";
  const div1 = makeEl("div", "row mt"); //Only make 1
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
    pEl.classList = "pet-info";
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
      //petInfo(selectPet[i]);
    };
  }
  mainContainer.append(div1);
}

//localStorage to save pet in a button at the bottom of the page
var savePet = function () {
  //add pet name to localStorage
  localStorage.setItem("petStorageArray", JSON.stringify(petStorageArray));
};

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

async function displayPet(data, index, e) {
  mainContainer.innerHTML = "";
  const div1 = makeEl("div", "container"); //Only make 1
  const div2 = makeEl("div", "flex-row");
  //const div3 = makeEl("div", "row s12 l6 m6");
  const div4 = makeEl("div", "img-contain flex-col");
  const img = makeEl("img", "pet-page-img");

  // If no image, use placeholder image from placeholderImg url

  if (!data[index].photo[0]) {
    img.setAttribute("src", placeholderImg);
  } else if (!data[index].photo[0].medium) {
    img.setAttribute("src", data[index].photo[0].large);
  } else {
    img.setAttribute("src", data[index].photo[0].medium);
  }

  const h3 = makeEl("h3", "pet-name");
  h3.textContent = data[index].name;
  div4.append(img);
  //div4.append(h3);
  const div5 = makeEl("div", "flex-col");
  const pEl = makeEl("p");
  //pEl.setAttribute("maxlength", "15");
  // If no description provided, fill it in
  if (!data[index].description) {
    pEl.textContent = "Oops! No description was provided for this pet.";
  } else {
    pEl.textContent = data[index].description;
  }

  const petDiv = makeEl("div", "col pet-page-info");

  const petAge = makeEl("p");
  petAge.textContent = "AGE: " + data[index].age;
  const petSize = makeEl("p");
  petSize.textContent = "SIZE: " + data[index].size;
  const petBreed = makeEl("p");
  petBreed.textContent = "BREED: " + data[index].breed["primary"];
  const petColor = makeEl("p");
  petColor.textContent = "COLOR: " + data[index].color["primary"];
  const petDescription = makeEl("p");
  petDescription.textContent = data[index].description;
  const petContact = makeEl("p");
  petContact.textContent = "CONTACT: " + data[index].contact["email"];

  div5.append(h3);
  div5.append(petDiv);
  petDiv.append(
    petAge,
    petSize,
    petBreed,
    petColor,
    petDescription,
    petContact
  );
  //div5.append(pEl);
  const div6 = makeEl("div", "card-action");
  const btn1 = makeEl("button", "waves-effect waves-light btn", "my-location");
  // btn1.setAttribute("data-index", `${index}`);
  btn1.setAttribute("id", "back-show");
  btn1.innerHTML = 'Back<i class="fa-solid fa-paw"></i>';
  //const btn2 = makeEl("button", "waves-effect waves-light btn", "my-location");
  div5.append(btn1);
  div2.append(div4, div5, div6);
  //div2.append(div3);
  div1.append(div2);
  mainContainer.append(div1);

  const city = petData[index].contact.address.city;
  let geoLoc = await cityToGeoData(city);

  //localstorage object
  console.log(petStorageArray);

  //Don't push to local storage if doubled
  let notDupPet = petStorageArray.findIndex((object) => {
    return object.name === data[index].name;
  });
  // if notDupPet === -1 it is bacuase it is not found in the local storage array (petStorageArray). So we push it to storage
  if (notDupPet === -1) {
    let petStorageData = data[index];
    petStorageArray.push(petStorageData);
  }
  savePet(e);
}

function petFlowHandler(e) {
  if (e.target.getAttribute("data-index")) {
    showPet(e);
  }

  if (e.target.getAttribute("id") === "back-show") {
    buildCards(petData);
    historyButton(petStorageArray);
  }
  // Pulls pet data from local stroage to build card. (Prevents error when running a new search).
  if (e.target.getAttribute("data-past")) {
    let index = e.target.getAttribute("data-past");
    displayPet(petStorageArray, index);
  }
}

function showPet(e) {
  let petIndex = parseInt(e.target.getAttribute("data-index"));
  displayPet(petData, petIndex); //index of the pet object passed into displayPet();
}

function historyButton(petStorageHistory) {
  //html to display buttons for previously viewed pets
  var div1 = document.createElement("div");
  div1.id = "past-pets";
  div1.innerHTML = "<h3>Previously Viewed Pets</h3>";

  var div2 = makeEl("div", "button-container");

  for (var i = 0; i < petStorageHistory.length; i++) {
    let petName = petStorageHistory[i].name;
    var buttonEl = document.createElement("button");
    buttonEl.textContent = petStorageHistory[i].name;
    buttonEl.classList = "col waves-effect waves-light btn";
    buttonEl.innerHTML = `${petStorageHistory[i].name}<i class="fa-solid fa-paw"></i>`;

    let foundPetIndex = petStorageArray.findIndex((object) => {
      return object.name == petName;
    });

    buttonEl.setAttribute("data-past", `${foundPetIndex}`);
    div2.appendChild(buttonEl);
  }
  div1.append(div2);
  mainContainer.appendChild(div1);
}
// PET Associated Code Ends

// Find user location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Once user location found, get latitude and longitude
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

/******** City to Coordinates Conversion **********/

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
  }
}

/***** Event listeners ******/

myLocation.addEventListener("click", myLocationHandler);

zipForm.addEventListener("submit", zipFormHandler);

mainContainer.addEventListener("click", petFlowHandler);

// Navbar Dropdown
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});

loadPets();
