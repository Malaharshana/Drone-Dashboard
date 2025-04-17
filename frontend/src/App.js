import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    primary: {
      main: '#00ffff', // Cyan
    },
    secondary: {
      main: '#ff6b00', // Orange
    },
  },
  typography: {
    fontFamily: `'Orbitron', sans-serif`,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
};

export default App;
