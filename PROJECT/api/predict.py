import json
import numpy as np
from joblib import load

# Load your trained ML model
model = load("../model/parking_model.pkl")

def handler(req, res):
    # Parse JSON input
    data = json.loads(req.body.decode())
    spot_id = data["spot_id"]
    day = data["day"]
    hour = data["hour"]
    total_slots = data["total_slots"]

    # Make prediction
    prediction = int(model.predict(np.array([[spot_id, day, hour, total_slots]]))[0])

    # Return JSON response
    res.status_code = 200
    res.headers["Content-Type"] = "application/json"
    res.write(json.dumps({"predicted": prediction}))
