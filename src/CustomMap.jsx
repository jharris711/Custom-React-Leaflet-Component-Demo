import React, { useEffect } from "react";

import L from "leaflet";

import Container from "@material-ui/core/Container";

// This is the tile we will be using for this demo, but feel
// free to change it to your preference!
const MAP_TILE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

// Define our component. We will be using a functional component
// in thie demo, but class-based works great as well:
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
