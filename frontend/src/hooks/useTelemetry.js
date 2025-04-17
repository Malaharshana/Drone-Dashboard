import { useEffect, useState } from 'react';

const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/telemetry');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setLoading(false); // Data will start coming now
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);  // Debugging log to see the data in console
      setTelemetry(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return { telemetry, loading };
};

export default useTelemetry;
