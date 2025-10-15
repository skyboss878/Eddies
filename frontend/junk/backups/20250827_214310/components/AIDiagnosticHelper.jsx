import React, { useState } from 'react';

const AIDiagnosticHelper = ({ vehicleInfo, onDiagnosticComplete }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const analyzeSympitoms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockDiagnosis = {
        primaryIssue: 'Brake System Warning',
        confidence: 89,
        possibleCauses: [
          { issue: 'Worn brake pads', probability: 75, urgency: 'high' },
          { issue: 'Low brake fluid', probability: 45, urgency: 'medium' },
          { issue: 'Brake sensor malfunction', probability: 30, urgency: 'low' }
        ],
        recommendedActions: [
          'Inspect brake pad thickness',
          'Check brake fluid level',
          'Test brake system pressure'
        ],
        estimatedCost: { min: 150, max: 450 },
        estimatedTime: '1-2 hours'
      };
      
      setDiagnosis(mockDiagnosis);
      setIsAnalyzing(false);
      
      if (onDiagnosticComplete) {
        onDiagnosticComplete(mockDiagnosis);
      }
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-semibold text-gray-900">AI Diagnostic Assistant</h3>
        </div>
        
        {!diagnosis ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the vehicle symptoms or customer concerns:
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="e.g., Strange noise when braking, engine hesitation, warning lights..."
              />
            </div>
            
            <button
              onClick={analyzeSympitoms}
              disabled={!symptoms.trim() || isAnalyzing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing with AI...</span>
                </div>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">{diagnosis.primaryIssue}</h4>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {diagnosis.confidence}% confident
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Possible Causes:</h4>
              <div className="space-y-2">
                {diagnosis.possibleCauses.map((cause, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{cause.issue}</span>
                      <span className="text-sm text-gray-600 ml-2">({cause.probability}% likely)</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      cause.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      cause.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {cause.urgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2">Estimated Cost</h5>
                <p className="text-green-800">${diagnosis.estimatedCost.min} - ${diagnosis.estimatedCost.max}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-2">Estimated Time</h5>
                <p className="text-purple-800">{diagnosis.estimatedTime}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setDiagnosis(null);
                setSymptoms('');
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDiagnosticHelper;
