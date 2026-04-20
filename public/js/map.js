// Extract coordinates from DB (MongoDB stores as [longitude, latitude])
// Leaflet uses [latitude, longitude]
const coordinates = [listing.geometry.coordinates[1], listing.geometry.coordinates[0]];

// Initialize the Map
const map = L.map('map', {
  scrollWheelZoom: false
}).setView(coordinates, 12);

// Add OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add Marker
const marker = L.marker(coordinates).addTo(map);

// Bind Popup
marker.bindPopup(
  `<h6>${listing.title}</h6><p><b>${listing.location}, ${listing.country}</b></p><p>Exact location will be provided after booking!</p>`
).openPopup();

// Custom Zoom Controls used in show.ejs
let zoomin = () => {
  map.zoomIn();
};

let zoomout = () => {
  map.zoomOut();
};
