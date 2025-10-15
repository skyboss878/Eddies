// TEMPORARY COMPONENT - SAFE TO DELETE AFTER TESTING

import React from 'react';
import { useLocation } from 'react-router-dom';

const RoutingTestComponent = () => {
  const location = useLocation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a202c',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#48bb78', marginBottom: '1rem' }}>
        ✅ Routing Test Successful!
      </h1>
      <p style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#2d3748',
        borderRadius: '8px',
        fontFamily: 'monospace'
      }}>
        Current Path: <span style={{ color: '#f6ad55' }}>{location.pathname}</span>
      </p>
      <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#a0aec0' }}>
        You can now delete this file and remove the test route from your router configuration.
      </p>
    </div>
  );
};

export default RoutingTestComponent;
