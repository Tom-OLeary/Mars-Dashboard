# Mars Rover Dashboard 

## NASA API
[Website](https://api.nasa.gov/)

### Functionality

* Collects data from the Mars Rover section of the NASA API. 
* Displays today's 'image of the day' as well as recent and past images/information about the three Mars rovers. 

## Tech Stack (Dependencies)
- Node/Express
- HTML CSS
- Immutable JS
- Body Parser
- Dotenv

### Getting Started

1. Clone this repo and install the dependencies

2. This project uses yarn as a package manager, so to install your depencies run:

    ```yarn install``` 

**If you don’t have yarn installed globally, follow their installation documentation here according to your operating system: https://yarnpkg.com/lang/en/docs/install

3. Get a NASA developer API key in order to access the API endpoints from the website linked above.

4. Run `yarn start` in your terminal and go to `http:localhost:3000` to check that the app is running correctly.

## Main Files: Project Structure

  ```sh
  ├── README.md
  ├── src *** Contains client.js and index.html Files
  │   ├── public
  │   │    ├── images *** Background Images
  │   │    ├── assets
  │   │    └── ├── stylesheets *** CSS Files
  │   │
  │   └── server *** index.js
  └── .env *** Storing API Key
  ```

### UI Features

- A slideshow gallery of past images sent from each Mars rover.
- The launch date, landing date, name and status along with other information about the rover.
- A selection bar for the user to choose which rover's information they want to see.

- Responsive. Reformatted for display on phones (max-width 768px) and desktop (min-width 991px, max-width 1824px).
- Dynamically switch the UI to view one of the three rovers 

### Frontend
```
client.js - Formats and sends data to DOM
index.html
```

### Backend
- Built with Node/Express
- Makes calls to the NASA API
```
index.js
```

### Acknowledgements
- Tab animation/design template can be found [here](https://codepen.io/ejsado/pen/gPVgVv) developed by Eric Sadowski
- Tab icons were downloaded from [icons8](https://icons8.com/)
- The Udacity team for providing an initial skeleton for the project
