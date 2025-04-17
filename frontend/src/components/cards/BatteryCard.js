import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';

const BatteryCard = ({ voltage, history }) => {
  return (
    <Card sx={{ width: '100%', maxWidth: 500, py: 2 }}>
      <CardContent>
        <Typography variant="h5" color="primary" sx={{ textAlign: 'center', mb: 2 }}>
          🔋 Battery
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Gauge */}
          <Box sx={{ width: 150 }}>
            <CircularProgressbar
              value={(voltage / 12) * 100}
              text={`${voltage.toFixed(2)}V`}
              styles={buildStyles({
                pathColor: voltage < 3.7 ? '#f44336' : voltage < 7 ? '#ff9800' : '#1976d2',
                textColor: '#fff',
                trailColor: '#333',
                textSize: '16px',
              })}
            />
          </Box>

          {/* Line Graph */}
          <Box sx={{ flex: 1, height: 120, pl: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 12]} />
                <Tooltip />
                <Line type="monotone" dataKey="voltage" stroke="#1976d2" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BatteryCard;
