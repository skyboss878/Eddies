import React, { useState, useEffect } from 'react';

const AIDashboard = () => {
  const [aiData, setAiData] = useState({
    predictiveMaintenance: [],
    diagnostics: [],
    recommendations: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading AI data
    const fetchAiData = async () => {
      try {
        // This would be your actual API call
        setTimeout(() => {
          setAiData({
            predictiveMaintenance: [
              { id: 1, vehicle: 'Toyota Camry', component: 'Brake Pads', prediction: 'Replace in 2 weeks', confidence: 85 },
              { id: 2, vehicle: 'Honda Civic', component: 'Engine Oil', prediction: 'Change in 5 days', confidence: 92 }
            ],
            diagnostics: [
              { id: 1, issue: 'Engine misfire detected', severity: 'High', recommendation: 'Check spark plugs' },
              { id: 2, issue: 'Low battery voltage', severity: 'Medium', recommendation: 'Test battery and alternator' }
            ],
            recommendations: [
              { id: 1, type: 'Cost Optimization', message: 'Consider bulk purchasing brake pads for 15% savings' },
              { id: 2, type: 'Efficiency', message: 'Schedule maintenance during low-demand periods' }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchAiData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Dashboard</h2>
      
      {/* Predictive Maintenance Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Predictive Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiData.predictiveMaintenance.map((item) => (
            <div key={item.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{item.vehicle}</h4>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {item.confidence}% confident
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Component: {item.component}</p>
              <p className="text-sm font-medium text-yellow-700">{item.prediction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostics Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Diagnostics</h3>
        <div className="space-y-3">
          {aiData.diagnostics.map((diagnostic) => (
            <div key={diagnostic.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{diagnostic.issue}</h4>
                <span className={`text-sm px-2 py-1 rounded ${
                  diagnostic.severity === 'High' ? 'bg-red-100 text-red-800' : 
                  diagnostic.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {diagnostic.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600">{diagnostic.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {aiData.recommendations.map((rec) => (
            <div key={rec.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-blue-800">{rec.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;
