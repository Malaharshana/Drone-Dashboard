import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import droneIconImg from '../assets/drone-icon.png';

const DroneMarker = ({ position, yaw }) => {
  const droneIcon = L.icon({
    iconUrl: droneIconImg,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'rotating-drone-icon',
  });

  return (
    <Marker
      position={position}
      icon={droneIcon}
    />
  );
};

const AutoPan = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
};

const MapView = ({ telemetry }) => {
  const [trail, setTrail] = useState([]);
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    if (!telemetry?.gps?.lat || !telemetry?.gps?.lon) return;

    const newPoint = [telemetry.gps.lat, telemetry.gps.lon];
    const now = Date.now();

    if (now - lastUpdate.current > 3000) {
      setTrail((prev) => [...prev.slice(-30), newPoint]);
      lastUpdate.current = now;
    }
  }, [telemetry]);

  const currentPos = telemetry?.gps
    ? [telemetry.gps.lat, telemetry.gps.lon]
    : [12.98, 77.6];

  const yaw = telemetry?.yaw || 0;

  return (
    <MapContainer
      center={currentPos}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: '500px', borderRadius: '12px', overflow: 'hidden' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={trail} color="lime" weight={4} />
      <DroneMarker position={currentPos} yaw={yaw} />
      <AutoPan position={currentPos} />
    </MapContainer>
  );
};

export default MapView;
