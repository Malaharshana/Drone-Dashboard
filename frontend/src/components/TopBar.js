// src/components/TopBar.js
import React, { useEffect, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Chip, Stack, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    speechSynthesis.speak(u);
  }, { once: true });
}


const getBatteryColor = (battery) => {
  if (battery < 3.7) return 'error';
  if (battery < 7) return 'warning';
  return 'success';
};

const getSignalColor = (connection) => {
  if (connection === 'Excellent') return 'success';
  if (connection === 'Poor') return 'warning';
  return 'error';
};

const TopBar = ({ telemetry, telemetryReady }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const initVoices = () => {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
    };
  
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = initVoices;
      } else {
        initVoices();
      }
    }
  }, []);
  
  const battery = telemetry?.battery;
  const connection = telemetry?.connection;
  const gps = telemetry?.gps;

  const batteryAlertRef = useRef(false);
  const connectionAlertRef = useRef(false);

  useEffect(() => {
    if (!telemetryReady) return; // Don't speak until ready

    if (battery < 4 && !batteryAlertRef.current) {
      batteryAlertRef.current = true;
      const utterance = new SpeechSynthesisUtterance('Battery level critical');
      speechSynthesis.speak(utterance);
    }

    if (battery >= 4 && batteryAlertRef.current) {
      batteryAlertRef.current = false;
      speechSynthesis.cancel();
    }

    if (connection === 'No Signal' && !connectionAlertRef.current) {
      connectionAlertRef.current = true;
      const utterance = new SpeechSynthesisUtterance('Connection lost');
      speechSynthesis.speak(utterance);
    }

    if (connection !== 'No Signal' && connectionAlertRef.current) {
      connectionAlertRef.current = false;
      speechSynthesis.cancel();
    }
  }, [battery, connection, telemetryReady]);

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(to right, #0f172a, #1e293b)',
        borderBottom: '2px solid #00f2ff',
        boxShadow: '0 0 15px #00f2ff',
        fontFamily: 'Orbitron, monospace',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textShadow: '0 0 2px cyan',
          }}
        >
          DRONE DASHBOARD
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Battery */}
          <Box>
            <Chip
              icon={<BatteryFullIcon />}
              label={`${battery ? ((battery / 12) * 100).toFixed(0) : 0}%`}
              color={getBatteryColor(battery)}
              variant="outlined"
              sx={{
                backgroundColor: battery < 4 ? '#ff1744' : undefined,
                color: battery < 4 ? 'white' : undefined,
                fontWeight: 'bold',
                borderColor: battery < 4 ? '#ff1744' : '#00f2ff',
                '&:hover': { boxShadow: '0 0 8px #ff1744' },
              }}
            />
            {battery < 4 && (
              <Typography
                variant="caption"
                sx={{
                  color: 'red',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Battery Low!
              </Typography>
            )}
          </Box>

          {/* GPS */}
          <Chip
            icon={<GpsFixedIcon />}
            label={
              gps ? `${gps.lat.toFixed(2)}, ${gps.lon.toFixed(2)}` : 'No GPS'
            }
            color="info"
            variant="outlined"
            sx={{
              borderColor: '#00f2ff',
              color: 'white',
              '&:hover': { boxShadow: '0 0 8px #0ff' },
            }}
          />

          {/* Time */}
          <Chip
            icon={<AccessTimeIcon />}
            label={time.toLocaleTimeString()}
            color="secondary"
            variant="outlined"
            sx={{
              borderColor: '#00f2ff',
              color: 'white',
              '&:hover': { boxShadow: '0 0 8px #0ff' },
            }}
          />

          {/* Signal */}
          <Chip
            icon={<SignalCellularAltIcon />}
            label={connection || 'No Signal'}
            color={getSignalColor(connection)}
            variant="outlined"
            sx={{
              borderColor: '#00f2ff',
              color: 'white',
              '&:hover': { boxShadow: '0 0 8px #0ff' },
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
