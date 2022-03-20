//key and secret used in fetchAccessToken function to get access token

//Note: the use of async and await are used in the place of fetch() and .then() (fetch an still be used if desired)
//It is an easier and very common way of handling promises to avoid complicated call back functions. Mad possible by a the Axios CDN (line 15 of index.html)

const placeholderImg =
  "https://media.istockphoto.com/photos/dog-cardboar-neutral-on-member-of-bone-gang-picture-id187895300?b=1&k=20&m=187895300&s=170667a&w=0&h=Cikee4baMVe3JW0VqfAc3o7LLFDcGGx32HvwbkdMVaM=";
const mainContainer = document.querySelector("#main");
const nav = document.getElementById("nav")
const googleMap = document.querySelector("#google-map");
const googleAddress = document.querySelector("#google-address");

const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

let petStorageArray = [];
var petData = [];
var selectPetPage = [];

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
  accessToken = data.access_token; // Saves access token
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
        formatAnimalData(data);
      });
    }
  });
};

/******** Pet Display START **********/
function formatAnimalData(data) {
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

  // After pet objects are all pushed into array, build the cards with petData objects
  buildCards(petData);
  historyButton(petStorageArray);
}

function buildCards(petArray) {
  mainContainer.innerHTML = "";
  const div1 = makeEl("div", "row mt");
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
    // If no description provided, fill in default
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
  }
  mainContainer.append(div1);
}

// Displays a single pet
async function displayPet(data, index, e) {
  mainContainer.innerHTML = "";
  const div1 = makeEl("div", "container");
  const div2 = makeEl("div", "flex-row");
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
  const div5 = makeEl("div", "flex-col");
  const pEl = makeEl("p");

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

  const div6 = makeEl("div", "card-action");
  const btn1 = makeEl("button", "waves-effect waves-light btn", "my-location");

  btn1.setAttribute("id", "back-show");
  btn1.innerHTML = 'Back<i class="fa-solid fa-paw"></i>';

  div5.append(btn1);
  div2.append(div4, div5, div6);

  div1.append(div2);
  mainContainer.append(div1);

  // Don't push to local storage if doubled
  let notDupPet = petStorageArray.findIndex((object) => {
    return object.name === data[index].name;
  });
  // Ff notDupPet === -1 it is not found in the local storage array (petStorageArray); therfore, we push it to storage.
  if (notDupPet === -1) {
    let petStorageData = data[index];
    petStorageArray.push(petStorageData);
  }

  savePet(e);

  // Run Google Map
  const state = data[index].contact.address.state;
  const cityName = data[index].contact.address.city;
  const splits = cityName.split(" ");

  if (splits.length > 1) {
    googleAddress.setAttribute(
      "src",
      `https://maps.google.com/maps?q=${splits[0]}%20${splits[1]},%20${state}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    );
    googleMap.classList.toggle("display-none");
  } else {
    googleAddress.setAttribute(
      "src",
      `https://maps.google.com/maps?q=${splits[0]},%20${state}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    );
    googleMap.classList.toggle("display-none");
  }
}

function showPet(e) {
  let petIndex = parseInt(e.target.getAttribute("data-index"));
  displayPet(petData, petIndex); //index of the pet object passed into displayPet();
}

function historyButton(petStorageHistory) {
  // HTML to display buttons for previously viewed pets
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
/******** Pet Display END **********/

/******** Find User Location START **********/
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Once user location found, save latitude and longitude and pass into Pet Finder
function showPosition(position) {
  const lat = position.coords.latitude.toString();
  const long = position.coords.longitude.toString();
  // Runs query to API when "Near Me" is clicked
  fetchPets(lat + "," + long);
}
/******** User Location END **********/

/******** Handler Functions START**********/
function petFlowHandler(e) {
  if (e.target.getAttribute("data-index")) {
    showPet(e);
  }

  if (e.target.getAttribute("id") === "back-show") {
    googleMap.classList.toggle("display-none");
    buildCards(petData);
    historyButton(petStorageArray);
  }
  // Pulls pet data from local stroage to build card. (Prevents error when running a new search).
  if (e.target.getAttribute("data-past")) {
    let index = e.target.getAttribute("data-past");
    displayPet(petStorageArray, index);
  }
}

const myLocationHandler = function () {
  getLocation();
};

const zipFormHandler = function (e) {
  e.preventDefault();
  const zipCode = document.querySelector("#zip").value;
  fetchPets(zipCode);
};

function handleError(err) {
  console.warn(`Error(${err.code}): ${err.message}`);
}
/******** Handler Function END **********/

/******** Utility START **********/
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

//Create elements with an id and multi classes
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
/******** Utility END **********/

/******** SIDE NAVBAR START **********/

nav.addEventListener("click", function () {
  const elems = document.querySelectorAll(".sidenav");
  const instances = M.Sidenav.init(elems);
});

/******** SIDE NAVBAR END **********/

/***** Event listeners ******/
myLocation.addEventListener("click", myLocationHandler);
// myLocationHandler runs the getLocation function, which uses the client side function navigator.geolocation.getCurrentPosition() (used to get the current position of the device).
// navigator.geolocation.getCurrentPosition() then runs showPosition()
// The latitude and longitude are then pulled from the position object in showPosition()
// latitude and longitude are then passed into fetchPets() which queries the pet database and send back pets near you as the variable "data".
// formatAnimalData() takes in the resolved promise data and formats data into objects. 
// The new pet objects are then pushed into petData[] for subsequent use.
// buildCards() and historyButton() are then called and render 20 pet cards and past searches 

zipForm.addEventListener("submit", zipFormHandler);
// zipFormHandler similer to myLocationHandler, just doesnt use navigator.geolocation.getCurrentPosition()
// zip code is passed into fetchPets() which queries the pet database and send back pets near you as the variable "data".
// formatAnimalData() takes in the resolved promise data and formats data into objects. 
// The new pet objects are then pushed into petData[] for subsequent use.
// buildCards() and historyButton() are then called and render 20 pet cards and past searches 

mainContainer.addEventListener("click", petFlowHandler);  
// petFlowHandler looks for click events on various buttons and determines how to handle that event. 
// If an element with the attribute of "data-index” (Adopt Me Button) is clicked, showPet() is ran and passes “data-index” value to displayPet() and renders the pet selected.  
// displayPet() pulls form petData[], which contains pet objects from the Pet Finder API, uses the index received passed to it from showPet(). That pet is then subsequently rendered.
// If the target is of id === "back-show", buildCards() is ran, which renders pet objects from petData[]. historyButton() is also invoked and creates buttons from pets stored in local storage via petStroageArray[]
// If an element with the attribute of "data-past" (pet history buttons), displayPet() renders the pet from petStorageArray[] according to its “data-past” value (index).

loadPets();