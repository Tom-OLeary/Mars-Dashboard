require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

/**
 * @description - Fetches image of the day data from the NASA API
 */
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

/**
 * @description - Fetches rover data from the NASA API
 */
app.get("/photos/:rover", async (req, res) => {
  const { rover } = req.params;
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=100&api_key=${process.env.API_KEY}`).then(res => res.json());

    const data = {};
    data.photos = image.photos.map(photo => ({
      img_src: photo.img_src, 
      photoId: photo.id, 
      earth_date: photo.earth_date,
      camera: photo.camera,
    }));
    data.rover = image.photos[0].rover;

    res.send(data);
  } catch (err) {
    console.log("error:", err);
  }
});

/**
 * @description - Fetches most recent images data from the NASA API
 */
app.get("/latest/:rover", async (req, res) => {
  const { rover } = req.params;
  try {
    let image = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`).then(res => res.json());

    const data = {};
    data.photos = image.latest_photos.map(data => ({
      id: data.id,
      earth_date: data.earth_date,
      img_src: data.img_src,
      camera: data.camera,
    }));

    res.send(data);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));