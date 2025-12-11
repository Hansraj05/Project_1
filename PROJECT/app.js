console.log("app.js loaded!");

// ------------------------------
// 1. Firebase Setup
// ------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyClhRAQ0ppN1DKETNP5uDXqVHXtpQ8gVR0",
    authDomain: "parkeasy-f780d.firebaseapp.com",
    projectId: "parkeasy-f780d",
    storageBucket: "parkeasy-f780d.firebasestorage.app",
    messagingSenderId: "522133493980",
    appId: "1:522133493980:web:e0238613a2f23ef15dbc19"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ------------------------------
// 2. ML API URL (CHANGE THIS)
// ------------------------------
const ML_API_URL = "https://YOUR-PROJECT-NAME.vercel.app/api/predict"; 
// 🔴 Replace with your real Vercel URL

// ------------------------------
// 3. Create Map
// ------------------------------
var map = L.map('map').setView([26.1445, 91.7362], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// ------------------------------
// 4. Get User Location
// ------------------------------
navigator.geolocation.getCurrentPosition(pos => {
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;

    L.marker([lat, lng]).addTo(map)
      .bindPopup("You are here")
      .openPopup();

    map.setView([lat, lng], 15);
});

// ------------------------------
// 5. ML Prediction Function
// ------------------------------
async function getPrediction(spot_id, total_slots) {

    let now = new Date();
    let day = now.getDay();  // Sunday = 0
    let hour = now.getHours();

    try {
        const response = await fetch(ML_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                spot_id,
                day,
                hour,
                total_slots
            })
        });

        const data = await response.json();
        return data.predicted ?? 0;

    } catch (error) {
        console.error("ML API ERROR:", error);
        return 0; // fallback value
    }
}

// ------------------------------
// 6. Load Parking Spots + Show Predictions
// ------------------------------
db.collection("parking").get().then(snapshot => {
    snapshot.forEach(async doc => {
        let data = doc.data();

        let predicted_available = await getPrediction(
            data.spot_id,
            data.total_slots
        );

        L.marker([data.lat, data.lng]).addTo(map)
            .bindPopup(`
                <b>${data.name}</b><br>
                <b>AI Predicted Available:</b> ${predicted_available}/${data.total_slots}
            `);
    });
});
