let listeners = [];
let intervalId = null;
let telemetryStarted = false;

function getRandom(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function generateTelemetryData() {
  return {
    battery: getRandom(2.5, 4.5),
    altitude: getRandom(10, 1000),
    temperature: getRandom(20, 70),
    roll: getRandom(-45, 45),
    pitch: getRandom(-45, 45),
    yaw: getRandom(0, 360),
    gps: {
      lat: getRandom(11.0, 11.03),
      lon: getRandom(76.94, 76.97),
      alt: getRandom(10, 100),
    },
    connection: ['Excellent', 'Good', 'Poor', 'No Signal'][
      Math.floor(Math.random() * 4)
    ],
    timestamp: new Date().toISOString(),
  };
}

// Pre-warm voice engine on load
const warmUpVoice = () => {
  const utterance = new SpeechSynthesisUtterance('initializing');
  utterance.volume = 0;
  speechSynthesis.speak(utterance);
};

warmUpVoice();

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  let attempts = 0;
  const trySpeak = () => {
    if (!speechSynthesis.speaking) {
      speechSynthesis.speak(utterance);
    } else if (attempts < 3) {
      attempts++;
      setTimeout(trySpeak, 150);
    }
  };

  trySpeak();
};

let batteryAlertSpoken = false;
let connectionAlertSpoken = false;

function startTelemetryInterval() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    const newData = generateTelemetryData();

    if (!telemetryStarted) telemetryStarted = true;

    // Voice alert logic
    if (newData.battery < 3.7 && !batteryAlertSpoken) {
      batteryAlertSpoken = true;
      speak('Warning. Battery level is critical.');
    }
    if (newData.battery >= 3.7 && batteryAlertSpoken) {
      batteryAlertSpoken = false;
    }

    if (newData.connection === 'No Signal' && !connectionAlertSpoken) {
      connectionAlertSpoken = true;
      speak('Connection lost.');
    }
    if (newData.connection !== 'No Signal' && connectionAlertSpoken) {
      connectionAlertSpoken = false;
    }

    listeners.forEach((cb) => cb(newData));
  }, 3000);
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
      telemetryStarted = false;
    }
  };
}

export function isTelemetryVoiceReady() {
  return telemetryStarted;
}