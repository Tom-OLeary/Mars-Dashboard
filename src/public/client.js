/**
 * Tom O'Leary
 * Project - Mars Dashboard
 * This project pulls rover data from the NASA API and displays details as well as recent images
 * --> client.js
 */

/**
* @description - Stores rover data
*/
const store = Immutable.Map({
  apod: "",
  rovers: ["curiosity", "spirit", "opportunity"],
  selectedRover: "",
  photoData: {},
  roverDetails: {},
  latestPhotos: {},
});

// Add markup to the page
let root = document.getElementById("content1");

/**
 * @description - Updates store values
 * @param {Object} object - Current store object
 * @param {Object} newState - Updated store object
 * @param {string} id - Corresponding HTML id value
 */
const updateStore = (object, newState, id) => {
  root = document.getElementById(id);
  const newStore = store.merge(object, newState);
  render(root, newStore);
};

/**
 * @description - Renders items to the page
 * @param {Node} root - Location to send data
 * @param {Object} state - Current store value
 */
const render = async (root, state) => {
  root.innerHTML = App(state);
};

/**
 * @description - Create content
 * @param {Object} state - Current store value
 * @returns {string} - Image of the day innerHTML
 * @returns {function RoverData(state)}
 */
const App = state => {
  const day = new Date();
  document.getElementById("footer").textContent = day;

  if (state.get("selectedRover") === "apod" || state.get("apod")) {
    let x = document.getElementById("content1");
    x.innerHTML = ImageOfTheDay(state.get("apod"));

    return x.innerHTML;
  } else { return RoverData(state); }
};

// ------------------------------------------------------  COMPONENTS

/**
 * @description - Gets image of the day
 * @param {string} apod - Current rover
 * @returns {string} - Image of the day innerHTML
 */
const ImageOfTheDay = apod => {
  let result;
  if (!apod) {
    getImageOfTheDay();
  } else if (apod.getIn(["image", "code"])) {
    result = ` <h2>There is currently no data available</h2>`
  } else if (apod.getIn(["image", "media_type"]) === "video") {
    result = `<p>See today's featured video 
            <a href="${apod.getIn(["image", "url",])}">here</a>
          </p>
          <p>${apod.getIn(["image", "title"])}</p>
          <p>${apod.getIn(["image", "explanation"])}</p>`
  } else {
    result = `<img src="${apod.getIn(["image", "url"])}"  class="center">
          <h3>${apod.getIn(["image", "title"])} </h3>
          <p>${apod.getIn(["image", "explanation"])}</p>`
  }

  return result;
};

/**
 * @description - Collects rover data
 * @param {Object} state - Current store value
 * @returns {string} - Rover data innerHTML
 */
const RoverData = (state) => {
  const store = state.toJS();
  let { roverDetails, photoData} = store;

  let div = document.createElement("div");

  const latestImage = Photo(store);
  const randomData = randomize(photoData);
  const data = imageText(photoData, roverDetails, randomData);
  const imageIds = ["#img-1", "#img-2", "#img-3"];

  imageIds.forEach((x, index) => document.querySelector(x).src = photoData[randomData[index]].img_src);

  slideCaption(randomData, photoData);

  div.append(data, latestImage);
  
  return div.innerHTML;
}

/**
 * @description - Collects recent image data
 * @param {Object} state - Current store value
 * @returns {Node} - Div contents for recent photos
 */
const Photo = (state) => {
  let { latestPhotos } = state;

  const elements = ["div", "h3", "h3", "p", "img"];
  let [div, header, headerDetails, details, latestImage] = elements.map(e => document.createElement(e));

  header.innerHTML = "Latest Image";
  header.id = "image-header";
  header.className = "content-headers";

  headerDetails.innerHTML = "Recent Image Details";
  headerDetails.className = "content-headers";

  latestImage.src = latestPhotos[0].img_src;
  latestImage.className = "latest-photo";

  details.innerHTML = `Date Taken: ${latestPhotos[0].earth_date} <br> Image ID: ${latestPhotos[0].id} <br> Camera: ${latestPhotos[0].camera.full_name}`;

  div.append(header, headerDetails, details, latestImage);

  return div;
}

/**
 * @description - Collects slideshow image data
 * @param {Object} photoData - Current photoData values
 * @param {Object} roverDetails - Current roverDetails values
 * @param {number} randomData - List of random numbers based on object length
 * @returns {Node} - Div contents for slideshow photos
 */
function imageText(photoData, roverDetails, randomData) {
  let div = document.createElement("div");
  let slidesH = document.createElement("h3");

  slidesH.innerHTML = `Slideshow Images`;
  slidesH.className = "content-headers";

  div.appendChild(slidesH);

  const photoDetails = {
    "Photo ID: ": {
      "Image 1 ID: ": photoData[randomData[0]].photoId,
      "Image 2 ID: ": photoData[randomData[1]].photoId,
      "Image 3 ID: ": photoData[randomData[2]].photoId,
    },
    "Photo Taken: ": {
      "Image 1 Taken: ": photoData[randomData[0]].earth_date,
      "Image 2 Taken: ": photoData[randomData[1]].earth_date,
      "Image 3 Taken: ": photoData[randomData[2]].earth_date,
    },
    "Launch Date: ": roverDetails.launch_date,
    "Landing Date: ": roverDetails.landing_date,
    "Current Status: ": roverDetails.status
  };

  const elements = [..."p".repeat(5)];

  elements.forEach(function (e, index) {
    let data = document.createElement(e);

    if (index === 2) {
      let roversH = document.createElement("h3");
      roversH.innerHTML = `Rover Details`;
      roversH.className = "content-headers";
      div.appendChild(roversH);
    }

    (index === 0) 
      ? data.innerHTML = getImageData("Photo ID: ", photoDetails) : 
    (index === 1) 
      ? data.innerHTML = getImageData("Photo Taken: ", photoDetails)
      : data.innerHTML = `${Object.keys(photoDetails)[index]}` + Object.values(photoDetails)[index];

    div.appendChild(data);
  });

  return div;
}

/**
 * @description - Sets slideshow caption
 * @param {Object} photoData - Current photoData values
 * @param {number} randomData - List of random numbers based on object length
 */
function slideCaption(randomData, photoData) {
  document.querySelectorAll(".text").forEach(text => {
    let imageCam = document.createElement("p");

    if (text.id === "img-data-1") { 
      imageCam.innerHTML = photoData[randomData[0]].camera.full_name; 
    } else if (text.id === "img-data-2") { 
      imageCam.innerHTML = photoData[randomData[1]].camera.full_name; 
    } else { 
      imageCam.innerHTML = photoData[randomData[2]].camera.full_name; 
    }

    text.textContent = imageCam.textContent;
  });
}

/**
 * @description - Sets page background image
 * @param {string} rover - Current rover
 */
function setBackgroundImage(rover) {
    document.body.background = `images/${rover}.jpg`;
  }

/**
 * @description - Sets page header to match rover
 * @param {string} rover - Current rover
 */
function setHeader(rover) {
  if (rover === 'apod') { 
    document.getElementById("head").innerHTML = `Media Item of the Day`; 
  } else { 
    document.getElementById("head").innerHTML = rover.charAt(0).toUpperCase() + rover.substring(1); 
  }
}

/**
 * @description - Sets slideshow image data
 * @param {string} key - Data description
 * @param {Object} photoDetails - Current photoDetails values
 * @returns {string} - Image data
 */
function getImageData(key, photoDetails) {
  const results = [...Array(3).keys()].map(index => 
    `${Object.keys(photoDetails[key])[index]}` + Object.values(photoDetails[key])[index])
    .reduce((acc, curr) => acc + `<br>` + curr);

  return results;
}

/**
 * @description - Sets random number list based on object length
 * @param {Object} photoData - Current photoData values
 * @returns {number} - List of random numbers
 */
function randomize(photoData) {
  let nums = [];
  for (let i = 0; i < 3; i++) {
    nums.push(Math.floor(Math.random() * (photoData.length - 1)));
  }
  return nums;
}

/**
 * @description - Toggles slideshow
 * @param {string} className - Corresponding class name of item
 * @param {string} status - Value of on or off
 */
function toggleViews(className, status) {
  (status === "on") 
    ? className.forEach(name => document.querySelector(name).style.display = "block")
    : className.forEach(name => document.querySelector(name).style.display = "none");
}

/**
 * @description - Fetches image of the day data from localhost
 * @returns {Object} - Image of the day data
 */
const getImageOfTheDay = () => {
  return fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }, "content1"));
};

/**
 * @description - Fetches rover data and updates store
 * @param {string} selectedRover - Current rover
 * @param {string} id - HTML id value
 */
const getData = (selectedRover, id) => {
  setBackgroundImage(selectedRover);
  setHeader(selectedRover);
  if (selectedRover === 'apod') {
    toggleViews([".slideshow-container", ".dots"], "off");
    updateStore(store, { selectedRover });
  } else {
    toggleViews([".slideshow-container", ".dots"], "on");
    fetch(`http://localhost:3000/photos/${selectedRover}`)
    .then(res => res.json())
    .then(data => {
      let newStore = { photoData: data.photos, roverDetails: data.rover};
      getLatestPhotos(newStore, selectedRover, id);
    });  
  }  
};

/**
 * @description - Fetches most recent photo data and updates store
 * @param {Object} state - Current store value
 * @param {string} selectedRover - Current rover
 * @param {string} id - HTML id value
 */
const getLatestPhotos = (state, selectedRover, id) => {
    fetch(`http://localhost:3000/latest/${selectedRover}`)
    .then(res => res.json())
    .then(data => {
      let newStore = {photoData: state.photoData, roverDetails: state.roverDetails, latestPhotos: data.photos};
      updateStore(store, newStore, id);
    }
    );
}

