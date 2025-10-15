import React, { useState } from 'react';
import { generateAIResponse } from './AIProvider.js';

const AIDiagnosticHelper = ({ vehicleInfo, onDiagnosticComplete }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);

    try {
      const prompt = `
        Vehicle info: ${JSON.stringify(vehicleInfo || {})}
        Symptoms: ${symptoms}
        Provide primary issue, confidence %, possible causes, urgency, recommended actions, estimated cost and time in JSON.
      `;

      const aiResult = await generateAIResponse(prompt);
      const parsed = JSON.parse(aiResult); // AI should return structured JSON

      setDiagnosis(parsed);
      if (onDiagnosticComplete) onDiagnosticComplete(parsed);
    } catch (err) {
      alert('AI analysis failed. Try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {!diagnosis ? (
        <>
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={4}
            placeholder="Describe vehicle symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button
            onClick={analyzeSymptoms}
            disabled={!symptoms.trim() || isAnalyzing}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </>
      ) : (
        <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(diagnosis, null, 2)}</pre>
      )}
    </div>
  );
};

export default AIDiagnosticHelper;
