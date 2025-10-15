// src/components/ai/AIEstimateModal.jsx
import React from 'react';
import AIDiagnosticHelper from './AIDiagnosticHelper';

const AIEstimateModal = ({ isOpen, onClose, onEstimateGenerated, vehicleInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6">
        <h2 className="text-xl font-bold mb-4">AI Service Estimate</h2>
        <AIDiagnosticHelper
          vehicleInfo={vehicleInfo}
          onDiagnosticComplete={(diag) => {
            const estimate = {
              id: Date.now(),
              vehicle: `${vehicleInfo.make} ${vehicleInfo.model}`,
              service: diag.primaryIssue,
              total: diag.estimatedCost.max,
              notes: diag.recommendedActions
            };
            onEstimateGenerated(estimate);
            onClose();
          }}
        />
        <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default AIEstimateModal;
