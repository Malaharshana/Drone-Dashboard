import '../styles/telemetry.css';
import React from 'react';
import { motion } from 'framer-motion';

import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const TelemetryPanel = ({ telemetry, chartData }) => {
  if (!telemetry) return <Typography color="gray">Waiting for telemetry...</Typography>;

  const {
    battery,
    temperature,
    altitude,
    roll,
    pitch,
    yaw,
  } = telemetry;

  const {
    batteryHistory = [],
    temperatureHistory = [],
    altitudeHistory = [],
    imuHistory = [],
  } = chartData || {};

  const Graph = ({ data, lines, yDomain }) => (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis domain={yDomain} />
        <Tooltip />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const hudCardStyle = {
    width: '100%',
    maxWidth: 500,
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid #00fff2',
    borderRadius: '12px',
    backdropFilter: 'blur(8px)',
    color: '#00fff2',
    boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 18px rgba(0, 255, 255, 0.6)',
      borderColor: 'rgba(0, 255, 255, 0.6)',
    },
  };

  const hudTitleStyle = {
    mb: 2,
    color: '#00fff2',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.7)',
    fontWeight: 'bold',
  };

  const GaugeWithGraph = ({ title, icon, value, max, unit, color, graphLines, data, yDomain }) => (
    <Card sx={hudCardStyle}>
      <CardContent>
        <Typography variant="h5" sx={hudTitleStyle}>{icon} {title}</Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ width: 120 }}>
            <CircularProgressbar
              value={(value / max) * 100}
              text={`${value.toFixed(1)}${unit}`}
              styles={buildStyles({
                pathColor: color,
                textColor: '#fff',
                trailColor: '#222',
                textSize: '14px',
              })}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Graph data={data} lines={graphLines} yDomain={yDomain} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const getBatteryAlert = (value) => {
    return value < 3.7 ? '⚠️ Battery Critical!' : null;
  };

  const getGPSAlert = (prevLat, newLat, prevLon, newLon) => {
    if (!prevLat || !newLat || !prevLon || !newLon) return null;
    const latDiff = Math.abs(prevLat - newLat);
    const lonDiff = Math.abs(prevLon - newLon);
    return latDiff < 0.0001 && lonDiff < 0.0001 ? '📡 Lost Signal: Attempting Reconnect…' : null;
  };

  const getIMUAlert = (yawHistory) => {
    if (!yawHistory || yawHistory.length < 3) return null;
    const recentYaw = yawHistory.slice(-3).map((d) => d.yaw);
    const deltas = recentYaw.slice(1).map((val, i) => Math.abs(val - recentYaw[i]));
    const isErratic = deltas.some((delta) => delta > 90);
    return isErratic ? '⚠️ Instability Detected' : null;
  };

  const batteryAlert = telemetry ? getBatteryAlert(telemetry.battery) : null;
  const gpsAlert =
    telemetry && chartData.batteryHistory.length > 1
      ? getGPSAlert(
          chartData.batteryHistory[chartData.batteryHistory.length - 2]?.lat,
          telemetry.gps?.lat,
          chartData.batteryHistory[chartData.batteryHistory.length - 2]?.lon,
          telemetry.gps?.lon
        )
      : null;
  const imuAlert = getIMUAlert(chartData.imuHistory);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        px: 2,
        py: 2,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} alignItems="center" justifyContent="flex-start">
                  <Typography variant="h5" sx={{ mb: 2, color: 'white'}}>
                  📊 TELEMETRY DATA
                  </Typography>

        <GaugeWithGraph
          title="Battery"
          icon="🔋"
          value={battery}
          max={12}
          unit="V"
          color={battery < 3.7 ? '#f44336' : battery < 7 ? '#ff9800' : '#1976d2'}
          graphLines={[{ key: 'value', color: '#1976d2' }]}
          data={batteryHistory}
          yDomain={[0, 12]}
        />

        <GaugeWithGraph
          title="Temperature"
          icon="🌡️"
          value={temperature}
          max={100}
          unit="°C"
          color={temperature > 70 ? '#f44336' : temperature > 50 ? '#ff9800' : '#1976d2'}
          graphLines={[{ key: 'value', color: '#ff9800' }]}
          data={temperatureHistory}
          yDomain={[0, 100]}
        />

        <GaugeWithGraph
          title="Altitude"
          icon="🧭"
          value={altitude}
          max={1000}
          unit="m"
          color="#4caf50"
          graphLines={[{ key: 'value', color: '#4caf50' }]}
          data={altitudeHistory}
          yDomain={[0, 1000]}
        />

        <Card sx={hudCardStyle}>
          <CardContent>
            <Typography variant="h5" sx={hudTitleStyle}>📈 IMU</Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack spacing={1}>
                {[{ label: 'Roll', value: roll, color: '#00bcd4' },
                  { label: 'Pitch', value: pitch, color: '#8bc34a' },
                  { label: 'Yaw', value: yaw, color: '#ff5722' }].map(({ label, value, color }) => (
                    <Box key={label} sx={{ width: 80, textAlign: 'center' }}>
                      <CircularProgressbar
                        value={(Math.abs(value) / 180) * 100}
                        text={`${value.toFixed(1)}°`}
                        styles={buildStyles({
                          pathColor: color,
                          textColor: '#fff',
                          trailColor: '#333',
                          textSize: '12px',
                        })}
                      />
                      <Typography variant="caption" color="gray">{label}</Typography>
                    </Box>
                ))}
              </Stack>
              <Box sx={{ flexGrow: 1 }}>
                <Graph
                  data={imuHistory}
                  lines={[
                    { key: 'roll', color: '#00bcd4' },
                    { key: 'pitch', color: '#8bc34a' },
                    { key: 'yaw', color: '#ff5722' }
                  ]}
                  yDomain={[-180, 180]}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default TelemetryPanel;
