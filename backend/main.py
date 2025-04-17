import asyncio
import random
import datetime
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS so your frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/telemetry")
async def telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(">>> WebSocket connection accepted, starting telemetry stream...")
    while True:
        telemetry = {
            "battery": round(random.uniform(0, 12), 2),
            "temperature": round(random.uniform(20, 80), 1),
            "connection": random.choice(["Excellent", "Good", "Poor", "No Signal"]),
            "gps": {
                "lat": round(random.uniform(12.97, 12.99), 4),
                "lon": round(random.uniform(77.59, 77.61), 4),
                "alt": round(random.uniform(10, 100), 2)
            },
            "imu": {
                "roll": round(random.uniform(-180, 180), 2),
                "pitch": round(random.uniform(-180, 180), 2),
                "yaw": round(random.uniform(-180, 180), 2)
            },
            "altitude": round(random.uniform(10, 100), 2),
            "timestamp": datetime.datetime.now().isoformat()
        }

        await websocket.send_json(telemetry)
        await asyncio.sleep(3)  # Wait 7 seconds before sending next update
