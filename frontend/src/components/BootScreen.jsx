import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const bootSequence = [
  'Initializing Drone Command HQ...',
  'Powering up sensors...',
  'Loading Telemetry Core...',
  'Establishing satellite uplink...',
  'System check complete...',
  'Welcome, Commander.',
];

const BootScreen = ({ onComplete }) => {
  const [allLinesDone, setAllLinesDone] = useState(false);

  useEffect(() => {
    const delayPerLine = 500; // ms
    const lastLineDelay = (bootSequence.length - 1) * 500; // 6 * 500 = 3000ms
    const lastLineFadeInDuration = 400; // ms
    const extraPause = 2000; // 2 seconds to keep "Welcome, Commander." on screen

    const transitionTimer = setTimeout(() => {
      setAllLinesDone(true);
      const audio = new Audio('/sounds/boot.mp3');
      audio.volume = 0.7;
      audio.play().catch(err => console.error('Autoplay blocked:', err));

      setTimeout(() => {
        onComplete();
      }, 1000); // fade-out duration
    }, lastLineDelay + lastLineFadeInDuration + extraPause);

    return () => clearTimeout(transitionTimer);
  }, [onComplete]);

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: '#00ffe0',
        fontFamily: 'Orbitron, monospace',
        fontSize: '1.2rem',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '5vw',
      }}
    >
      {bootSequence.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.5, duration: 0.4 }}
          style={{ marginBottom: '0.8rem', textShadow: '0 0 8px cyan' }}
        >
          {line}
        </motion.div>
      ))}

      {/* Optional: Fade-out screen during transition */}
      {allLinesDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default BootScreen;
