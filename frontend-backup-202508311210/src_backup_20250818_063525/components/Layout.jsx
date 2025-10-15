// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import AIDiagnosticHelper from './AIDiagnosticHelper';
import AIEstimateModal from './AIEstimateModal';
import GlobalToastDisplay from './GlobalToastDisplay';

const Layout = () => {
  const [aiEstimateOpen, setAiEstimateOpen] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const handleDiagnosticComplete = (result) => {
    setDiagnosticResult(result);
    setAiEstimateOpen(true);
  };

  const handleEstimateSaved = (estimate) => {
    console.log('Saved Estimate:', estimate);
    // Call backend API to persist AI-generated estimate here
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Global AI Helpers */}
      <AIDiagnosticHelper
        vehicleInfo={null}
        onDiagnosticComplete={handleDiagnosticComplete}
      />
      <AIEstimateModal
        isOpen={aiEstimateOpen}
        onClose={() => setAiEstimateOpen(false)}
        onEstimateGenerated={handleEstimateSaved}
        initialData={
          diagnosticResult
            ? {
                description: diagnosticResult.primaryIssue,
                serviceType: 'other',
              }
            : null
        }
      />

      {/* Global Toasts */}
      <GlobalToastDisplay />
    </div>
  );
};

export default Layout;
