import React, { useState } from 'react';
import { obd2Service } from '../../services/aiService';
import LoadingSpinner from '../LoadingSpinner';

const OBD2Lookup = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    
    try {
      const data = await obd2Service.lookupCode(code);
      setResult(data);
    } catch (error) {
      setResult({ error: 'Code lookup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">OBD2 Code Lookup</h3>
      
      <div className="flex space-x-3 mb-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter OBD2 code (e.g., P0420)"
          className="flex-1 px-3 py-2 border rounded-md"
          maxLength={5}
        />
        <button
          onClick={handleLookup}
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? <LoadingSpinner size="small" /> : 'Lookup'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div>
              <h4 className="font-semibold text-lg">{result.code}</h4>
              <p className="text-gray-700 mb-2">{result.description}</p>
              {result.severity && (
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  result.severity === 'high' ? 'bg-red-100 text-red-800' :
                  result.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {result.severity} severity
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OBD2Lookup;
