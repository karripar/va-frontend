
"use client";

import L from "leaflet";

// next.js requires some configuration for leaflet's default icon
export const DefaultIcon = L.icon({
  iconUrl: '/metropolia-squirrel.png',
  iconSize: [60, 60], // size of the icon
  iconAnchor: [15, 45], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -60], // point from which the popup should open relative to the iconAnchor
});


L.Marker.prototype.options.icon = DefaultIcon;
