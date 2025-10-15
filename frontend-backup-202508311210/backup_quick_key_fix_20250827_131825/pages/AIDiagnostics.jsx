// src/pages/AIDiagnostics.jsx - Enhanced Version
import React, { useState, useEffect } from 'react';
import apiClient from "../utils";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, Wrench, AlertTriangle, CheckCircle, Car, Zap } from 'lucide-react';

const AIDiagnostics = () => {
  const [activeTab, setActiveTab] = useState('quick');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Quick Diagnosis State
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState({
    year: '',
    make: '',
    model: '',
    engine: '',
    mileage: ''
  });

  // OBD Code State
  const [obdCode, setObdCode] = useState('');
  const [obdResults, setObdResults] = useState(null);

  // Common symptoms for quick selection
  const commonSymptoms = [
    'Check engine light',
    'Rough idle',
    'Poor acceleration',
    'Engine knocking',
    'Stalling',
    'Hard to start',
    'Overheating',
    'Strange noises',
    'Vibration',
    'Poor fuel economy',
    'Smoke from exhaust',
    'Grinding brakes'
  ];

  const addSymptom = (symptom) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setNewSymptom('');
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleQuickDiagnosis = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiClient.ai.diagnosis({
        symptoms,
        vehicle: vehicleInfo
      });
      
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Diagnosis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleObdLookup = async () => {
    if (!obdCode.trim()) {
      setError('Please enter an OBD code');
      return;
    }

    setLoading(true);
    setError(null);
    setObdResults(null);

    try {
      const response = await apiClient.ai.diagnosis({ code: obdCode.toUpperCase() });
      setObdResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'OBD lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuickDiagnosisTab = () => (
    <div className="space-y-6">
      {/* Vehicle Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Car className="mr-2 text-blue-600" size={20} />
          Vehicle Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Year"
            className="border rounded-lg px-3 py-2"
            value={vehicleInfo.year}
            onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
          />
          <input
            type="text"
            placeholder="Make (e.g., Honda)"
            className="border rounded-lg px-3 py-2"
            value={vehicleInfo.make}
            onChange={(e) => setVehicleInfo({...vehicleInfo, make: e.target.value})}
          />
          <input
            type="text"
            placeholder="Model (e.g., Civic)"
            className="border rounded-lg px-3 py-2"
            value={vehicleInfo.model}
            onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
          />
          <input
            type="text"
            placeholder="Engine (e.g., 2.0L)"
            className="border rounded-lg px-3 py-2"
            value={vehicleInfo.engine}
            onChange={(e) => setVehicleInfo({...vehicleInfo, engine: e.target.value})}
          />
          <input
            type="number"
            placeholder="Mileage"
            className="border rounded-lg px-3 py-2"
            value={vehicleInfo.mileage}
            onChange={(e) => setVehicleInfo({...vehicleInfo, mileage: e.target.value})}
          />
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-600" size={20} />
          Symptoms
        </h3>
        
        {/* Add Custom Symptom */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Describe a symptom..."
            className="flex-1 border rounded-l-lg px-3 py-2"
            value={newSymptom}
            onChange={(e) => setNewSymptom(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSymptom(newSymptom)}
          />
          <button
            onClick={() => addSymptom(newSymptom)}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Common Symptoms */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick select common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  symptoms.includes(symptom)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {symptoms.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Selected symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <span
                  key={symptom}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diagnose Button */}
      <button
        onClick={handleQuickDiagnosis}
        disabled={loading || symptoms.length === 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          loading || symptoms.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Analyzing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Zap className="mr-2" size={20} />
            Get AI Diagnosis
          </div>
        )}
      </button>
    </div>
  );

  const renderObdTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Search className="mr-2 text-blue-600" size={20} />
          OBD Code Lookup
        </h3>
        
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter OBD code (e.g., P0171)"
            className="flex-1 border rounded-lg px-3 py-2 uppercase"
            value={obdCode}
            onChange={(e) => setObdCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleObdLookup()}
          />
          <button
            onClick={handleObdLookup}
            disabled={loading || !obdCode.trim()}
            className={`px-6 py-2 rounded-lg font-semibold ${
              loading || !obdCode.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Enter diagnostic trouble codes like P0171, P0420, B1234, etc.</p>
        </div>
      </div>

      {obdResults && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Code: {obdResults.code}</h4>
          <div className="space-y-3">
            <div>
              <strong>Description:</strong>
              <p className="text-gray-700 mt-1">{obdResults.description}</p>
            </div>
            <div>
              <strong>Possible Causes:</strong>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {obdResults.causes?.map((cause, index) => (
                  <li key={index}>{cause}</li>
                )) || ['No specific causes available']}
              </ul>
            </div>
            <div>
              <strong>Recommended Actions:</strong>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {obdResults.solutions?.map((solution, index) => (
                  <li key={index}>{solution}</li>
                )) || ['Consult service manual or professional technician']}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 text-green-600" size={20} />
          AI Diagnosis Results
        </h3>
        
        <div className="space-y-4">
          {results.diagnosis && (
            <div>
              <h4 className="font-semibold text-gray-800">Primary Diagnosis:</h4>
              <p className="text-gray-700">{results.diagnosis}</p>
            </div>
          )}

          {results.confidence && (
            <div>
              <h4 className="font-semibold text-gray-800">Confidence Level:</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${results.confidence}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">{results.confidence}%</span>
              </div>
            </div>
          )}

          {results.possibleCauses && results.possibleCauses.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800">Possible Causes:</h4>
              <ul className="list-disc list-inside text-gray-700">
                {results.possibleCauses.map((cause, index) => (
                  <li key={index}>{cause}</li>
                ))}
              </ul>
            </div>
          )}

          {results.recommendedActions && results.recommendedActions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800">Recommended Actions:</h4>
              <ol className="list-decimal list-inside text-gray-700">
                {results.recommendedActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ol>
            </div>
          )}

          {results.estimatedCost && (
            <div>
              <h4 className="font-semibold text-gray-800">Estimated Repair Cost:</h4>
              <p className="text-lg font-bold text-green-600">
                ${results.estimatedCost.min} - ${results.estimatedCost.max}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Diagnostics</h1>
        <p className="text-gray-600">Get intelligent diagnostic insights powered by AI</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('quick')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quick'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quick Diagnosis
            </button>
            <button
              onClick={() => setActiveTab('obd')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'obd'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              OBD Code Lookup
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'quick' && renderQuickDiagnosisTab()}
      {activeTab === 'obd' && renderObdTab()}

      {/* Results */}
      {results && renderResults()}
    </div>
  );
};

export default AIDiagnostics;
