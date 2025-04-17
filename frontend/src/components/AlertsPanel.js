// src/components/AlertsPanel.js
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const alertStyles = {
  base: {
    padding: '16px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 600,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, #1f2937, #111827)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '16px',
  },
  battery: {
    background: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
  },
  gps: {
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
  },
  imu: {
    background: 'linear-gradient(135deg, #92400e, #f97316)',
  },
};

const speak = (text) => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel(); // Stop previous speech immediately
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
};
  

const AlertsPanel = ({ telemetry }) => {
  const [alerts, setAlerts] = useState([]);
  const prevYawRef = useRef(null);
  const lastAlertRef = useRef([]);

  useEffect(() => {
    if (!telemetry) return;

    const newAlerts = [];

    if (telemetry.battery < 3.7) {
      newAlerts.push({
        type: 'battery',
        text: '⚠️ Battery Critical!',
        speech: 'Warning. Battery level critical.',
      });
    }

    if (!telemetry.gps || telemetry.gps.lat === 0 || telemetry.gps.lon === 0) {
      newAlerts.push({
        type: 'gps',
        text: '📡 Lost Signal: Attempting Reconnect…',
        speech: 'GPS signal lost. Attempting reconnect.',
      });
    }

    if (prevYawRef.current !== null) {
      const diff = Math.abs(telemetry.yaw - prevYawRef.current);
      if (diff > 45) {
        newAlerts.push({
          type: 'imu',
          text: '⚠️ Instability Detected',
          speech: 'Drone instability detected.',
        });
      }
    }
    prevYawRef.current = telemetry.yaw;

    const newSpeechAlerts = newAlerts.filter(
      (alert) => !lastAlertRef.current.some((a) => a.text === alert.text)
    );

    newSpeechAlerts.forEach((alert) => speak(alert.speech));
    lastAlertRef.current = newAlerts;

    setAlerts(newAlerts);
  }, [telemetry]);

  return (
    <Stack spacing={2}>
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              ...alertStyles.base,
              ...(alert.type === 'battery'
                ? alertStyles.battery
                : alert.type === 'gps'
                ? alertStyles.gps
                : alertStyles.imu),
              animation: 'pulseGlow 2s infinite alternate',
            }}
          >
            <Typography variant="h6">{alert.text}</Typography>
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  );
};

export default AlertsPanel;
