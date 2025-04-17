# 🛰️ Drone Command HQ – Real-time Drone Telemetry Dashboard

A sci-fi themed, fully immersive web-based dashboard that simulates **real-time drone telemetry**. Designed with cinematic animations, glassmorphism UI, and mission control aesthetics, this dashboard is perfect for showcasing drone data in a stunning, futuristic way.

---

## ⚙️ Features

### 🛰 Live GPS Map (Leaflet)
- Real-time drone location tracking
- Auto-panning map with animated polylines showing movement trails
- Custom drone icons with rotation support

### 📊 Telemetry Dashboard (UI Cards)
- **Animated Circular Gauges** for:
  - Battery
  - Altitude
  - Temperature
  - IMU (Roll, Pitch, Yaw)
- **Live Line Graphs** synced with the gauges
- **Sci-fi Styling** with neon/glassmorphism effects

### ✨ Framer Motion Animations
- Cinematic dashboard boot-up sequence
- Smooth transitions between interface elements
- Subtle motion and hover effects for a tactile feel

### 🧪 Frontend-Based Data Simulation
- Uses **mocked/randomized data** (no backend needed to run)
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

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Malaharshana/Drone-Dashboard.git
cd DRONETELEMETRYDASHBOARD
```

### 2. Run the Frontend (React)

```bash
cd frontend
npm install
npm start
```

> Frontend will run at: [http://localhost:3000](http://localhost:3000)

### 3. Run the Backend (FastAPI)

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

> Backend will run at: [http://localhost:8000](http://localhost:8000)

---

## 🔌 WebSocket Endpoint

- **`/telemetry/ws`**
  - Type: WebSocket
  - Sends: Battery, GPS, IMU, Altitude, and Connection data in real-time
  - Used in frontend via `src/api/socket.js`

---

## 📸 Screenshots

> _Drop your screenshots into a folder like `frontend/public/screenshots/` and use these links:_

```
![Dashboard UI](./frontend/public/screenshots/dashboard.png)
![Live Map](./frontend/public/screenshots/map.png)
```

---

## 🛠️ Tech Stack

- **Frontend**: React, Material UI, Framer Motion, MUI, Vite, Leaflet
- **Backend (optional)**: Python, FastAPI, Uvicorn

- **Communication**: WebSocket

---

## 📽 Demo Video

> _Coming soon: Add your YouTube/Loom demo link here_

---
