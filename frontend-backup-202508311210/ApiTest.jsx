import React, { useEffect, useState } from 'react';

const endpoints = [
  'customers',
  'vehicles',
  'jobs',
  'estimates',
  'settings',
  // Add more if you want
];

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  // Base URL for your backend API
  const BASE_URL = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    async function fetchAll() {
      const newResults = {};
      for (const ep of endpoints) {
        try {
          const res = await fetch(`${BASE_URL}/${ep}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization here if needed, e.g.
              // 'Authorization': `Bearer ${token}`
            },
          });
          const status = res.status;
          let data;
          try {
            data = await res.json();
          } catch {
            data = await res.text();
          }
          newResults[ep] = { status, data };
        } catch (error) {
          newResults[ep] = { status: 'error', data: error.message };
        }
      }
      setResults(newResults);
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) return <div>Loading API tests...</div>;

  return (
    <div style={{ fontFamily: 'monospace', padding: '1rem' }}>
      <h2>API GET Endpoints Test</h2>
      {Object.entries(results).map(([endpoint, result]) => (
        <div key={endpoint} style={{ marginBottom: '1.5rem' }}>
          <strong>GET /api/{endpoint}</strong> — Status: {result.status}
          <pre
            style={{
              backgroundColor: '#f0f0f0',
              padding: '0.5rem',
              overflowX: 'auto',
              maxHeight: '200px',
            }}
          >
            {typeof result.data === 'string'
              ? result.data
              : JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default ApiTest;
