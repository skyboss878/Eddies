import AIDiagnosticHelper from '../components/ai/AIDiagnosticHelper';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataOperations } from '../hooks/useDataOperations';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Wrench, FileText, Send, Trash2, WrenchIcon, ListOrdered } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Diagnosis() {
  const navigate = useNavigate();
  const { vehiclesMap, customersMap, jobOps, utils } = useDataOperations();
  const [diagnosisHistory, setDiagnosisHistory] = useLocalStorage('diagnosisHistory', []);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [latestDiagnosis, setLatestDiagnosis] = useState(null);

  const handleDiagnosis = async () => {
    if (!issueDescription.trim()) return utils.showMessage('Please describe the issue first', 'error');

const result = await AIDiagnosticHelper.diagnoseVehicle({ description: issueDescription, vehicleId: selectedVehicleId });
    if (result.success) {
      const newResult = {
        id: Date.now(),
        description: issueDescription,
        vehicleId: selectedVehicleId,
        timestamp: new Date().toISOString(),
        ...result.data, // include diagnosis, fix, parts, labor, confidence
        confidence: result.data.confidence || 0.7,
      };
      setLatestDiagnosis(newResult);
      setDiagnosisHistory(prev => [newResult, ...prev]);
    }
  };

  const handlePrint = () => {
    if (!latestDiagnosis) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AI Vehicle Diagnosis Report', 20, 20);

    let y = 35;
    doc.setFontSize(12);
    doc.text(`Issue: ${latestDiagnosis.description}`, 20, y); y += 10;
    doc.text(`Diagnosis: ${latestDiagnosis.diagnosis}`, 20, y); y += 10;
    doc.text(`Fix: ${latestDiagnosis.fix || '-'}`, 20, y); y += 10;

    if (latestDiagnosis.parts?.length) {
      doc.text('Parts:', 20, y); y += 10;
      latestDiagnosis.parts.forEach(p => {
        doc.text(`- ${p.quantity}x ${p.name} @ $${p.cost}`, 25, y); y += 10;
      });
    }

    if (latestDiagnosis.labor?.length) {
      doc.text('Labor:', 20, y); y += 10;
      latestDiagnosis.labor.forEach(l => {
        doc.text(`- ${l.description} (${l.hours} hrs @ $${l.rate}/hr)`, 25, y); y += 10;
      });
    }

    doc.text(`Confidence: ${Math.round(latestDiagnosis.confidence * 100)}%`, 20, y); y += 10;
    doc.text(`Time: ${new Date(latestDiagnosis.timestamp).toLocaleString()}`, 20, y);
    doc.save("diagnosis-report.pdf");
  };

  const createJobFromDiagnosis = () => {
    if (!latestDiagnosis || !selectedVehicleId) return utils.showMessage('Please complete a diagnosis and select a vehicle first', 'error');
    navigate('/create-job', {
      state: {
        vehicleId: selectedVehicleId,
        description: `${latestDiagnosis.description}\n\nAI Diagnosis:\n${latestDiagnosis.diagnosis}`,
      },
    });
  };

  const isLoading = utils.isLoading('diagnoseJob');
  const vehicles = Array.from(vehiclesMap.values());

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-black via-gray-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-4 flex items-center justify-center gap-3">
            <Wrench className="h-10 w-10" /> AI Vehicle Diagnosis
          </h1>
          <p className="text-gray-300 text-lg">Describe the vehicle issue for AI-powered diagnostic insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="bg-black/60 rounded-xl shadow-lg border border-gray-700 p-6">
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full mb-4 p-2 rounded border border-gray-600 bg-gray-900 text-white"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year})</option>
              ))}
            </select>
            <textarea
              placeholder="Describe the vehicle issue"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={6}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white resize-none"
            />
            <button
              onClick={handleDiagnosis}
              disabled={isLoading || !issueDescription.trim()}
              className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? 'Analyzing...' : 'Get AI Diagnosis'}
            </button>
          </div>

          {/* Output */}
          <div className="bg-black/60 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-green-300 mb-6">Diagnosis Results</h2>
            {latestDiagnosis ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <h3 className="font-semibold text-green-300 mb-1">Diagnosis:</h3>
                  <p className="text-gray-200 leading-relaxed">{latestDiagnosis.diagnosis}</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <h3 className="font-semibold text-blue-300 mb-1">Fix:</h3>
                  <p className="text-gray-200 leading-relaxed">{latestDiagnosis.fix || 'N/A'}</p>
                </div>

                {/* Parts */}
                {latestDiagnosis.parts?.length > 0 && (
                  <div className="p-4 bg-gray-900/30 border border-gray-600/20 rounded-lg">
                    <h3 className="font-semibold text-yellow-300 mb-1">Parts</h3>
                    <ul className="list-disc ml-5 text-gray-300">
                      {latestDiagnosis.parts.map((p, i) => (
                        <li key={i}>{p.quantity}x {p.name} @ ${p.cost}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Labor */}
                {latestDiagnosis.labor?.length > 0 && (
                  <div className="p-4 bg-gray-900/30 border border-gray-600/20 rounded-lg">
                    <h3 className="font-semibold text-pink-300 mb-1">Labor</h3>
                    <ul className="list-disc ml-5 text-gray-300">
                      {latestDiagnosis.labor.map((l, i) => (
                        <li key={i}>{l.description} - {l.hours} hrs @ ${l.rate}/hr</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-3">
                  <button onClick={createJobFromDiagnosis} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" /> Create Work Order
                  </button>
                  <button onClick={handlePrint} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" /> Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">Your results will appear here...</div>
            )}
          </div>
        </div>

        {/* History */}
        {diagnosisHistory.length > 0 && (
          <div className="mt-8 bg-black/60 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-300">Recent Diagnoses</h2>
              <button onClick={() => setDiagnosisHistory([])} className="flex items-center text-sm px-3 py-1 bg-red-700 rounded hover:bg-red-800">
                <Trash2 className="h-4 w-4 mr-1" /> Clear History
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Optional: Map recent items here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
