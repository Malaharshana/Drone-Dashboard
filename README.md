# 🛰️ Drone Command HQ – Real-time Drone Telemetry Dashboard

A **sci-fi themed, fully immersive web-based dashboard** that simulates real-time drone telemetry. Designed with cinematic animations, glassmorphism UI, and mission control aesthetics, this dashboard is perfect for showcasing drone data in a stunning, futuristic way.

---

## ⚙️ Features

### 🛰 Live GPS Map (Leaflet)
- Real-time drone location tracking
- Auto-panning map with animated polylines showing movement trails
- Custom drone icons with rotation support

### 📊 Telemetry Dashboard (UI Cards)
- Animated Circular Gauges for:
  - Battery
  - Altitude
  - Temperature
  - IMU (Roll, Pitch, Yaw)
- Live Line Graphs synced with the gauges
- Sci-fi Styling with neon/glassmorphism effects

### ✨ Framer Motion Animations
- Cinematic dashboard boot-up sequence
- Smooth transitions between interface elements
- Subtle motion and hover effects for a tactile feel

### 🔔 System Health Alerts
- **Battery Critical** – Visual alert when voltage < 4V  
- **GPS Signal Lost** – Displays "No Signal" with flashing status  
- **IMU Instability** – Detected from high fluctuations in Roll/Pitch/Yaw  
- Alerts visually appear **inside telemetry cards** with cinematic glitches

### 🔊 Voice Alerts (In-Browser)
- Voice synthesis warns for:
  - **Low Battery**
  - **Lost Connection**
- Seamlessly integrated into the dashboard without interrupting visuals

### 🧪 Frontend-Based Data Simulation
- Uses mocked/randomized data (no backend needed to run)
- Easily extendable to real hardware via WebSocket endpoint

### 🧭 Top Bar with Live Status Display
- Live system time
- Battery percentage
- GPS coordinates
- Connection health
- Built with MUI Chips and live color-coded feedback

### 🖥 Fully Responsive & Sci-Fi UI
- Adaptive layouts for desktops, tablets, and mobiles
- Dark mode with glowing edges, soft shadows, and neon gradients
- Inspired by futuristic mission control systems

---


## 🧠 Simulated Telemetry Data

The **Python FastAPI backend** streams the following telemetry values via WebSocket in real-time:

| Parameter     | Description                             |
|---------------|-----------------------------------------|
| `battery`     | Voltage (0–12V)                         |
| `temperature` | Temperature in °C                       |
| `imu`         | Roll, Pitch, Yaw angles (°)             |
| `altitude`    | Altitude in meters                      |
| `gps`         | Latitude, Longitude, Altitude           |
| `connection`  | Signal strength: Excellent / Poor / No Signal|

---

## ✅ Evaluation Checklist

✔️ Real-time updates using WebSocket  
✔️ Gauges + Graphs + Maps  
✔️ Animation, boot-up sound, and themed transitions  
✔️ Fully responsive layout  
✔️ Clear, creative, immersive UI  
✔️ No hardware dependency  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Malaharshana/Drone-Dashboard.git
cd DRONETELEMETRYDASHBOARD
```

### 2. Run the Frontend (React + Vite)

```bash
cd frontend
npm install
npm start
```

Runs at: [http://localhost:3000](http://localhost:3000)

### 3. Run the Backend (FastAPI)

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

Runs at: [http://localhost:8000](http://localhost:8000)

---

## 🔌 WebSocket Endpoint

- **Endpoint:** `/telemetry/ws`  
- **Protocol:** WebSocket  
- **Used in:** `frontend/src/api/socket.js`  
- Streams battery, GPS, IMU, temperature, altitude, and connection data in real-time to frontend

---

## 🧱 Project Structure

```
DRONETELEMETRYDASHBOARD/
│
├── backend/            # FastAPI backend
│   └── main.py
│
├── frontend/           # React + Vite UI
│   ├── public/
│   └── src/
│       ├── api/socket.js
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── styles/
│       ├── App.js
│       └── index.js
│
├── .gitignore
├── package.json
├── README.md           # ← You are here!
```

---

## 🛠️ Tech Stack

| Layer      | Tech Used                                           |
|------------|-----------------------------------------------------|
| **Frontend** | React, Vite, Material UI (MUI), Leaflet, Framer Motion |
| **Backend**  | Python, FastAPI, Uvicorn                           |
| **Communication** | WebSocket                                   |

---

## 📽 Demo Video

🎬 Coming soon: Add your YouTube / Loom / Drive demo link here.

---

## 👨‍💻 Author

**Malaharshana A P**  
🔗 [GitHub](https://github.com/Malaharshana)  
📧 24l162@psgitech.ac.in
