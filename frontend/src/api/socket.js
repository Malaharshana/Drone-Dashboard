// src/api/socket.js

let listeners = [];
let intervalId = null;

function getRandom(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function generateTelemetryData() {
  return {
    battery: getRandom(0, 12),
    altitude: getRandom(10, 1000),
    temperature: getRandom(20, 70),
    roll: getRandom(-45, 45),
    pitch: getRandom(-45, 45),
    yaw: getRandom(0, 360),
    gps: {
      lat: getRandom(11.00, 11.03),
      lon: getRandom(76.94, 76.97),
      alt: getRandom(10, 100)
    },
    connection: ["Excellent", "Good", "Poor", "No Signal"][
      Math.floor(Math.random() * 4)
    ],
    timestamp: new Date().toISOString()
  };
}

function startTelemetryInterval() {
  if (intervalId) clearInterval(intervalId); // Clear previous if any

  intervalId = setInterval(() => {
    const newData = generateTelemetryData();
    listeners.forEach((cb) => cb(newData));
  }, 3000); // ✅ 7 seconds here
}

export function subscribeToTelemetry(callback) {
  listeners.push(callback);

  if (!intervalId) {
    startTelemetryInterval();
  }

  return () => {
    listeners = listeners.filter((cb) => cb !== callback);

    if (listeners.length === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
