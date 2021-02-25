[Leaflet.js](https://leafletjs.com/index.html) is one of the most popular open-source Javscript libraries for interactive mapping applications. Its incredibly easy to use and the documentation is very well written and easy to understand. Its no wonder that someone eventually came up with the [React-Leaflet](https://react-leaflet.js.org/) library, as an attempt to make it easier to use inside of [React.js](https://reactjs.org/) apps.

Despite its noble cause and the developer's great effort, I feel like React-Leaflet fails in its mission to make it easier to use Leaflet with React. It could just be me, but I feel as though it takes the process of creating a map application more of a headache than it needs to be. Outside of the basic map instances like that provided in the ["Getting Started" section](https://react-leaflet.js.org/docs/start-setup), figuring out how to use React-Leaflet is quite difficult and frustrating. Not to mention, the documentation is incredibly complex, confusing, and flat-out hard to read through, although it does look nice. I've spent more time than I'd like to admit trying to figure out the docs and they are the biggest reason I don't like to use or recommend React-Leaflet.

But, fear not! If you are like me and have a need to create an application with both Leaflet.js and React, there is another way. We are going to create a React-based application with a custom map component built with Leaflet.js. The finished code will be available at this [GitHub repo](https://github.com/jharris711/Custom-React-Leaflet-Component-Demo) and a Code Sandbox with a live demo is setup [here](https://codesandbox.io/s/nostalgic-kare-kbpye?file=/README.md)

---

### Create React App:

First, let's create our React app with [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) and change into the map-app directory. In the terminal:

```bash
npx create-react-app map-app
cd map-app
```

---

### Install dependencies:

Now, we need to install the dependencies for our application. We will be installing [Leaflet.js](https://leafletjs.com/) for our map and [Material UI](https://material-ui.com/) for some styled components we will be adding. We won't be using it too much in this demo, but we will in the future. In your terminal:

```bash
npm i leaflet @material-ui/core @material-ui/icons @material-ui/lab
```

---

### Import Leaflet CSS & JS and Roboto Font for Material UI:

In the public directory of your React app, find and open the index.html file. Inside of the head element, paste the following links to import Roboto font from Google Fonts and the required Leaflet CSS & JS files:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
  crossorigin=""
/>
<script
  src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
  integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
  crossorigin=""
></script>
```

---

### Creating the Map component:

We can go ahead and get rid of everything inside of the src directory at this point, except for App.js, index.js, and index.css. Now, inside of src, create a file named CustomMap.jsx. The code should look something like this:

##### CustomMap.jsx

```javascript
import React, { useEffect } from "react";

import L from "leaflet";

import Container from "@material-ui/core/Container";

// This is the tile we will be using for this demo, but feel
// free to change it to your preference!
const MAP_TILE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

// Define our component. We will be using a functional component
// in this demo, but class-based works great as well:
const CustomMap = () => {
  // Define the styles that are to be passed to the map instance:
  const mapStyles = {
    overflow: "hidden",
    width: "100%",
    height: "100vh"
  };

  // Some layers that will be applied to our map:
  const layers = {
    circles: L.layerGroup(),
    markers: L.layerGroup(),
    polygons: L.layerGroup()
  };

  // Create our map tile layer:
  const map_tile = L.tileLayer(MAP_TILE, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define the base maps and overlays object that will be
  // passed to our layer control:
  const overlays = {
    circles: layers.circles,
    markers: layers.markers,
    polygons: layers.polygons
  };
  const baseMaps = {
    OpenStreetMap: map_tile
  };

  // Define the params that will be passed to the map:
  const mapParams = {
    center: [20, 0],
    zoom: 2,
    zoomControl: false,
    maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
    closePopupOnClick: false,
    layers: [map_tile, layers.circles, layers.markers, layers.polygons]
  };

  // In this useEffect hook, we will create our map instance.
  // Since we are leaving the dependency array empty, this useEffect
  // will act similar to the componentDidMount lifecycle method used
  // by class-based components. The useEffect hook will only run the
  // first time the component is rendered:
  useEffect(() => {
    // Instantiates a map object given the DOM ID of a <div>
    // element and optionally an object literal with Map option aka
    // the mapParams we defined earlier:
    const map = L.map("map", mapParams);
    // This is also where we add things like event listeners
    // to our map:
    map.on("zoomstart", () => {
      console.log("ZOOM STARTED");
    });
    // Create the layer control:
    L.control.layers(baseMaps, overlays).addTo(map);
    //
    // Add a zoom control:
    L.control.zoom({ position: "topright" }).addTo(map);
    //

    // Create a marker and add it to the marker layer:
    const marker = L.marker([51.5, -0.09])
      .addTo(layers.markers)
      .bindPopup("<b>Hello world!</b><br />I am a popup.")
      .openPopup();

    // Create a circle and add it to the circle layer:
    const circle = L.circle([51.508, -0.11], 5000, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5
    })
      .addTo(layers.circles)
      .setRadius(500000)
      .bindPopup("I am a circle.");

    // Same thing with the polygons:
    const poly = L.polygon([
      [51.5074, 0.1278],
      [6.5244, 3.3792],
      [40.7128, -74.006]
    ])
      .addTo(layers.polygons)
      .bindPopup("I am a polygon.");
  }, []);

  return (
    // Finally, we return the map. I have this one inside of an
    // MUI container:
    <Container disableGutters maxWidth="false">
      {/* This is the div that will hold our map. Pass in the 
      styles that we declared earlier and make sure it has 
      an id of "map". */}
      <div id="map" style={mapStyles} />
    </Container>
  );
};

export default CustomMap;
```

Then, we can switch back over to our App.js, import the CustomMap component, and start the server:

##### App.js

```Javascript
import React from 'react'
import CustomMap from './CustomMap'

const App = () => {
  return (
    <div className="App">
      <CustomMap />
    </div>
  );
}

export default App;
```

And in the terminal:

```bash
npm start
```

---

### Conclusion

Now, if you go to localhost:3000 in your browser you should have a map on your screen with some markers and shapes. That's it. You just created a Leaflet Map component inside of a React application without the headache of reading the React-Leaflet docs! It's super simple and allows you to have a much better, stress-free development experience.

---

I will be posting more articles soon about things like how to use the useRefs hooks to create a custom map tile filter in React, integrating MUI Datatables and AG-Grid and more. I'd love to hear your questions and comments about this article and your suggestions for the future! Thanks for reading.
