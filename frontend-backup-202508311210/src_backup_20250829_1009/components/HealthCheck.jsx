import React, { useState, useEffect } from 'react';

const HealthCheck = () => {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/health');
        if (response.ok) {
          setBackendStatus('ok');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('error');
      }
    };

    checkBackend();
    // Check every 30 seconds instead of every 5 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Only show if there's an error or we're checking
  if (backendStatus === 'ok') {
    return null; // Don't render anything when everything is working
  }

  if (backendStatus === 'error') {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
        <p className="text-sm">⚠️ Backend connection issue - Some features may not work</p>
      </div>
    );
  }

  // Show minimal checking state
  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-1 z-50">
      <p className="text-xs">Connecting...</p>
    </div>
  );
};

export default HealthCheck;
