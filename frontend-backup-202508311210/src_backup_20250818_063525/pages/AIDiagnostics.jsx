import AIDiagnosticHelper from '../components/ai/AIDiagnosticHelper';
import { useData } from '../contexts/DataContext';
import React, { useState, useEffect } from 'react';
import { Search, Zap, AlertTriangle, CheckCircle, Clock, DollarSign, Wrench, FileText, Download } from 'lucide-react';

const AIDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState('comprehensive'); // comprehensive, quick, lookup
  const [diagnosis, setDiagnosis] = useState(null);
  
  // Form data
  const [vehicleInfo, setVehicleInfo] = useState({
    year: '',
    make: '',
    model: '',
    engine: '',
    mileage: '',
    vin: ''
  });
  
  const [symptoms, setSymptoms] = useState('');
  const [obdCodes, setObdCodes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [quickVehicle, setQuickVehicle] = useState('');
  const [quickSymptoms, setQuickSymptoms] = useState('');
  const [lookupCodes, setLookupCodes] = useState('');
  const [lookupResults, setLookupResults] = useState(null);

  const handleComprehensiveDiagnosis = async () => {
    setLoading(true);
    setDiagnosis(null);
    
    try {
      const response = await fetch('/api/ai/diagnostics/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          vehicle_info: vehicleInfo,
          symptoms,
          obd_codes: obdCodes,
          additional_notes: additionalNotes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setDiagnosis(result);
    } catch (error) {
      console.error('Comprehensive diagnosis error:', error);
      alert('Failed to generate comprehensive diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDiagnosis = async () => {
    setLoading(true);
    setDiagnosis(null);
    
    try {
      const response = await fetch('/api/ai/diagnostics/quick-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          vehicle: quickVehicle,
          symptoms: quickSymptoms
        })
      });
      
      const result = await response.json();
      setDiagnosis(result);
    } catch (error) {
      console.error('Quick diagnosis error:', error);
      alert('Failed to generate quick diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOBDLookup = async () => {
    setLoading(true);
    setLookupResults(null);
    
    try {
      const response = await fetch('/api/ai/diagnostics/obd-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          codes: lookupCodes
        })
      });
      
      const result = await response.json();
      setLookupResults(result);
    } catch (error) {
      console.error('OBD lookup error:', error);
      alert('Failed to lookup OBD codes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const exportDiagnosis = () => {
    if (!diagnosis) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      diagnosis: diagnosis,
      exported_by: 'Eddie\'s Automotive'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `diagnosis_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 AI Vehicle Diagnostics
        </h1>
        <p className="text-gray-600">
          Advanced AI-powered diagnostic system for comprehensive vehicle analysis
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setDiagnosticMode('comprehensive')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'comprehensive'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔍 Comprehensive Analysis
          </button>
          <button
            onClick={() => setDiagnosticMode('quick')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'quick'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚡ Quick Diagnosis
          </button>
          <button
            onClick={() => setDiagnosticMode('lookup')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'lookup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 OBD Code Lookup
          </button>
        </div>
      </div>

      {/* Comprehensive Analysis Mode */}
      {diagnosticMode === 'comprehensive' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={vehicleInfo.year}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={vehicleInfo.make}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, make: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Toyota"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={vehicleInfo.model}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
                  <input
                    type="text"
                    value={vehicleInfo.engine}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, engine: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2.5L 4-Cylinder"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                <input
                  type="number"
                  value={vehicleInfo.mileage}
                  onChange={(e) => setVehicleInfo({...vehicleInfo, mileage: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85000"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Diagnostic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Symptoms *
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what the customer is experiencing: engine runs rough, hesitates during acceleration, unusual noises, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OBD-II Codes
                </label>
                <input
                  type="text"
                  value={obdCodes}
                  onChange={(e) => setObdCodes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="P0301 P0302 P0171 (separate multiple codes with spaces)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional observations, recent repairs, or customer notes..."
                />
              </div>
            </div>

            <button
              onClick={handleComprehensiveDiagnosis}
              disabled={loading || (!symptoms && !obdCodes)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Generate AI Diagnosis
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {diagnosis && diagnosis.success && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Diagnostic Results</h2>
                  <button
                    onClick={exportDiagnosis}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>

                {/* Primary Diagnosis */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg border ${getSeverityColor(diagnosis.diagnosis?.diagnosis?.severity)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Primary Diagnosis</span>
                    </div>
                    <h3 className="font-medium text-lg mb-2">
                      {diagnosis.diagnosis?.diagnosis?.primary_issue}
                    </h3>
                    <p className="text-sm mb-3">
                      {diagnosis.diagnosis?.diagnosis?.root_cause}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        <strong>Confidence:</strong> {diagnosis.diagnosis?.diagnosis?.confidence_level}
                      </span>
                      <span>
                        <strong>Severity:</strong> {diagnosis.diagnosis?.diagnosis?.severity}
                      </span>
                      <span>
                        <strong>Est. Time:</strong> {diagnosis.diagnosis?.diagnosis?.estimated_repair_time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Parts */}
                {diagnosis.diagnosis?.diagnosis?.recommended_parts?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Recommended Parts
                    </h3>
                    <div className="space-y-3">
                      {diagnosis.diagnosis.diagnosis.recommended_parts.map((part, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{part.part_name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(part.priority)}`}>
                              {part.priority} Priority
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Part #:</strong> {part.part_number}</p>
                            <p><strong>Quantity:</strong> {part.quantity}</p>
                            <p><strong>Est. Cost:</strong> {part.estimated_cost}</p>
                            <p><strong>Reason:</strong> {part.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repair Procedures */}
                {diagnosis.diagnosis?.diagnosis?.repair_procedures?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Repair Procedures
                    </h3>
                    <div className="space-y-4">
                      {diagnosis.diagnosis.diagnosis.repair_procedures.map((procedure, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {procedure.step}
                            </div>
                            <h4 className="font-medium">Step {procedure.step}</h4>
                            <span className="text-sm text-gray-500">
                              (~{procedure.estimated_time})
                            </span>
                          </div>
                          <p className="text-sm mb-3">{procedure.description}</p>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Tools:</strong> {procedure.tools_required?.join(', ')}</p>
                            <p className="text-red-600"><strong>Safety:</strong> {procedure.safety_notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost Estimate */}
                {diagnosis.diagnosis?.diagnosis?.cost_estimate && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Estimate
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Parts Total:</strong></p>
                          <p className="text-xl font-semibold text-blue-600">
                            {diagnosis.diagnosis.diagnosis.cost_estimate.parts_total}
                          </p>
                        </div>
                        <div>
                          <p><strong>Labor:</strong></p>
                          <p className="text-sm text-gray-600">
                            {diagnosis.diagnosis.diagnosis.cost_estimate.labor_hours} hrs @ {diagnosis.diagnosis.diagnosis.cost_estimate.labor_rate}/hr
                          </p>
                          <p className="text-xl font-semibold text-blue-600">
                            {diagnosis.diagnosis.diagnosis.cost_estimate.labor_total}
                          </p>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Estimate:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {diagnosis.diagnosis.diagnosis.cost_estimate.total_estimate}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Range: {diagnosis.diagnosis.diagnosis.cost_estimate.range}
                      </p>
                    </div>
                  </div>
                )}

                {/* Testing Procedures */}
                {diagnosis.diagnosis?.diagnosis?.testing_procedures?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recommended Tests
                    </h3>
                    <div className="space-y-3">
                      {diagnosis.diagnosis.diagnosis.testing_procedures.map((test, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-2">{test.test}</h4>
                          <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                          <div className="text-xs text-gray-500">
                            <p><strong>Expected Result:</strong> {test.expected_result}</p>
                            <p><strong>Tools Needed:</strong> {test.tools_needed?.join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wiring Diagrams */}
                {diagnosis.diagnosis?.diagnosis?.wiring_diagrams?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">🔌 Wiring Diagram Info</h3>
                    <div className="space-y-3">
                      {diagnosis.diagnosis.diagnosis.wiring_diagrams.map((diagram, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-2">{diagram.system} System</h4>
                          <p className="text-sm text-gray-600 mb-2">{diagram.description}</p>
                          <div className="text-xs text-gray-500">
                            <p><strong>Key Components:</strong> {diagram.key_components?.join(', ')}</p>
                            <p><strong>Common Failures:</strong> {diagram.common_failure_points}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Recommendations */}
                {diagnosis.diagnosis?.diagnosis?.additional_recommendations?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">💡 Additional Recommendations</h3>
                    <ul className="space-y-2">
                      {diagnosis.diagnosis.diagnosis.additional_recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Diagnosis Mode */}
      {diagnosticMode === 'quick' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Diagnosis</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle (Year Make Model)
                </label>
                <input
                  type="text"
                  value={quickVehicle}
                  onChange={(e) => setQuickVehicle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2018 Toyota Camry"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms
                </label>
                <textarea
                  value={quickSymptoms}
                  onChange={(e) => setQuickSymptoms(e.target.value)}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Car won't start, clicking sound when turning key, headlights dim..."
                />
              </div>

              <button
                onClick={handleQuickDiagnosis}
                disabled={loading || !quickSymptoms}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Quick Diagnosis
                  </>
                )}
              </button>
            </div>

            {/* Quick Diagnosis Results */}
            {diagnosis && diagnosis.success && diagnosis.quick_diagnosis && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Quick Diagnosis Results</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Likely Causes</h4>
                  <ul className="space-y-1">
                    {diagnosis.quick_diagnosis.likely_causes?.map((cause, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Immediate Actions</h4>
                  <ul className="space-y-1">
                    {diagnosis.quick_diagnosis.immediate_actions?.map((action, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Recommended Tests</h4>
                  <ul className="space-y-1">
                    {diagnosis.quick_diagnosis.recommended_tests?.map((test, index) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OBD Code Lookup Mode */}
      {diagnosticMode === 'lookup' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">OBD-II Code Lookup</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OBD-II Codes
                </label>
                <input
                  type="text"
                  value={lookupCodes}
                  onChange={(e) => setLookupCodes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="P0301 P0171 B1234 (separate multiple codes with spaces)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter one or more OBD-II codes (P, B, C, or U codes)
                </p>
              </div>

              <button
                onClick={handleOBDLookup}
                disabled={loading || !lookupCodes}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Lookup Codes
                  </>
                )}
              </button>
            </div>

            {/* Lookup Results */}
            {lookupResults && lookupResults.success && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Code Information ({lookupResults.total_codes} codes found)
                </h3>
                
                {lookupResults.codes.map((code, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(code.severity)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{code.code}</h4>
                      <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                        {code.category}
                      </span>
                    </div>
                    <p className="font-medium mb-2">{code.description}</p>
                    <div className="text-sm space-y-1">
                      <p><strong>System:</strong> {code.system}</p>
                      <p><strong>Severity:</strong> {code.severity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDiagnostics;
