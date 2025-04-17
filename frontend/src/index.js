import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'leaflet/dist/leaflet.css'; // Leaflet styles
import './index.css';
import './styles/alerts.css';
import './styles/telemetry.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
