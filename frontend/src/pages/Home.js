import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import TopBar from '../components/TopBar';
import TelemetryPanel from '../components/TelemetryPanel';
import MapView from '../components/MapView';
import { subscribeToTelemetry } from '../api/socket';

const Home = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [alerts, setAlerts] = useState({
    battery: null,
    gps: null,
    imu: null,
    connection: null,
  });

  const [batteryHistory, setBatteryHistory] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [altitudeHistory, setAltitudeHistory] = useState([]);
  const [imuHistory, setImuHistory] = useState([]);

  const lastGps = useRef(null);
  const lastYaw = useRef(null);
  const lastYawChangeTime = useRef(Date.now());

  const hasGpsFrozen = (current) => {
    if (!lastGps.current) return false;
    return (
      lastGps.current.lat === current.lat &&
      lastGps.current.lon === current.lon &&
      lastGps.current.alt === current.alt
    );
  };

  const isYawErratic = (currentYaw) => {
    const delta = Math.abs(currentYaw - (lastYaw.current || 0));
    const now = Date.now();

    if (delta > 120 && now - lastYawChangeTime.current < 1000) {
      return true;
    }

    lastYawChangeTime.current = now;
    return false;
  };

  useEffect(() => {
    const unsubscribe = subscribeToTelemetry((incoming) => {
      setTelemetry(incoming);
      const time = new Date().toLocaleTimeString();

      setBatteryHistory((prev) => [...prev.slice(-20), { time, value: incoming.battery }]);
      setTemperatureHistory((prev) => [...prev.slice(-20), { time, value: incoming.temperature }]);
      setAltitudeHistory((prev) => [...prev.slice(-20), { time, value: incoming.altitude }]);
      setImuHistory((prev) => [...prev.slice(-20), {
        time,
        roll: incoming.roll,
        pitch: incoming.pitch,
        yaw: incoming.yaw,
      }]);

      const newAlerts = {
        battery: incoming.battery < 3.7 ? '⚠️ Battery Critical!' : null,
        gps: hasGpsFrozen(incoming.gps) ? '📡 Lost Signal: GPS Frozen' : null,
        imu: isYawErratic(incoming.yaw) ? '⚠️ Instability Detected' : null,
        connection: incoming.connection === 'No Signal' ? '🚫 Connection Lost!' : null,
      };

      setAlerts(newAlerts);
      lastGps.current = incoming.gps;
      lastYaw.current = incoming.yaw;
    });

    return () => unsubscribe();
  }, []);

  const chartData = {
    batteryHistory,
    temperatureHistory,
    altitudeHistory,
    imuHistory,
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', height: '100vh', overflow: 'hidden' }}>
      <TopBar telemetry={telemetry} />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left Panel */}
        <Box sx={{ width: '750px', overflowY: 'auto', borderRight: '1px solid #1e293b' }}>
          <TelemetryPanel telemetry={telemetry} chartData={chartData} alerts={alerts} />
        </Box>

        {/* Right Panel */}
        <Box sx={{ flexGrow: 2, p: 5, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>🗺 DRONE NAVIGATION AND TRACKING</Typography>

          {telemetry && (
            <>
              {/* Connection Status */}
              <Card
                sx={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  mb: 3,
                  border: '1px solid #0ff',
                  boxShadow: '0 0 10px rgba(0,255,255,0.3)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 0 25px rgba(0,255,255,0.8), 0 0 10px #0ff inset',
                    transform: 'scale(1.02)',
                    borderColor: '#00ffff',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#0ff', fontWeight: 'bold' }}>📡 Connection Status</Typography>
                  <Chip
                    label={telemetry.connection}
                    color={
                      telemetry.connection === 'Excellent'
                        ? 'success'
                        : telemetry.connection === 'Poor'
                        ? 'warning'
                        : 'error'
                    }
                    sx={{
                      my: 1,
                      fontWeight: 'bold',
                      backgroundColor: '#0f172a',
                      border: '1px solid #0ff',
                      color: '#0ff',
                      '&:hover': {
                        boxShadow: '0 0 10px #0ff',
                      },
                    }}
                  />
                  {alerts.connection && (
                    <Typography sx={{ color: 'red', fontWeight: 'bold' }}>
                      {alerts.connection}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* GPS Info */}
              <Card
                sx={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  mb: 3,
                  border: '1px solid #0ff',
                  boxShadow: '0 0 10px rgba(0,255,255,0.3)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 0 25px rgba(0,255,255,0.8), 0 0 10px #0ff inset',
                    transform: 'scale(1.02)',
                    borderColor: '#00ffff',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#0ff', fontWeight: 'bold' }}>🧭 GPS Coordinates</Typography>
                  <Typography variant="body2" sx={{ color: 'lightgray' }}>
                    Latitude: {telemetry?.gps?.lat?.toFixed(4)} <br />
                    Longitude: {telemetry?.gps?.lon?.toFixed(4)} <br />
                    Altitude: {telemetry?.gps?.alt?.toFixed(2)} m
                  </Typography>
                  {alerts.gps && (
                    <Typography sx={{ color: 'red', fontWeight: 'bold', mt: 1 }}>
                      {alerts.gps}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <MapView telemetry={telemetry} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
