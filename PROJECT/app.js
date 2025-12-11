// Firebase initialization
console.log("app.js loaded!");

const firebaseConfig = {
    apiKey: "AIzaSyClhRAQ0ppN1DKETNP5uDXqVHXtpQ8gVR0",
    authDomain: "parkeasy-f780d.firebaseapp.com",
    projectId: "parkeasy-f780d",
    storageBucket: "parkeasy-f780d.firebasestorage.ap522133493980",
    messagingSenderId: "522133493980",
    appId: "1:522133493980:web:e0238613a2f23ef15dbc19"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Create map using Leaflet (OpenStreetMap)
var map = L.map('map').setView([26.1445, 91.7362], 15);

// Load map tiles from OpenStreetMap (FREE)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Get user location
navigator.geolocation.getCurrentPosition(pos => {
  let lat = pos.coords.latitude;
  let lng = pos.coords.longitude;

  L.marker([lat, lng]).addTo(map)
    .bindPopup("You are here")
    .openPopup();

  map.setView([lat, lng], 15);
});

// Load parking spots from Firestore
db.collection("parking").get().then(snapshot => {
  snapshot.forEach(doc => {
    let data = doc.data();

    // Create marker
  L.marker([data.lat, data.lng]).addTo(map)
  .bindPopup(`
    <b>${data.name}</b><br>
    Available: ${data.available_slots}/${data.total_slots}
  `);
  });
});