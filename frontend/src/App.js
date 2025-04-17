import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import BootScreen from './components/BootScreen';

// Dark theme definition
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

// Main App component
function App() {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoot(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {showBoot ? <BootScreen /> : <Home />}
    </ThemeProvider>
  );
}

export default App;
