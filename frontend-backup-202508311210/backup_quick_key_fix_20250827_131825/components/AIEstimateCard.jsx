// src/components/AIEstimateCard.jsx
import React, { useState } from "react";
import AIEstimateModal from "./AIEstimateModal";
import {
  CurrencyDollarIcon,
  SparklesIcon,
  ClockIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

const AIEstimateCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [latestEstimate, setLatestEstimate] = useState(null);

  const handleEstimateGenerated = (estimate) => {
    setLatestEstimate(estimate);
    setModalOpen(false);
  };

  const handlePrint = () => {
    if (!latestEstimate) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<html><head><title>Estimate</title></head><body><pre>${JSON.stringify(latestEstimate, null, 2)}</pre></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    if (!latestEstimate) return;
    const blob = new Blob([JSON.stringify(latestEstimate, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estimate_${latestEstimate.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-purple-600" />
          AI Service Estimate
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <SparklesIcon className="w-4 h-4 mr-1" />
          Generate / Edit
        </button>
      </div>

      {/* Estimate Summary */}
      {latestEstimate ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{latestEstimate.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-medium">{latestEstimate.vehicle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-medium">{latestEstimate.service}</p>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1 text-gray-700" />
              <p className="font-medium">{latestEstimate.estimatedHours} hrs</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b text-gray-700">Item</th>
                  <th className="px-3 py-2 border-b text-gray-700">Description</th>
                  <th className="px-3 py-2 border-b text-gray-700 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {latestEstimate.breakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 font-medium text-gray-900">{item.item}</td>
                    <td className="px-3 py-2 text-gray-600">{item.description}</td>
                    <td className="px-3 py-2 text-right text-gray-900">${item.cost}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="px-3 py-2 font-medium text-gray-900">
                    Subtotal
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900">
                    ${latestEstimate.subtotal}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-3 py-2 text-gray-600">
                    Tax (8%)
                  </td>
                  <td className="px-3 py-2 text-right text-gray-900">${latestEstimate.tax}</td>
                </tr>
                <tr className="bg-purple-50">
                  <td colSpan="2" className="px-3 py-2 font-bold text-purple-900 text-lg">
                    Total
                  </td>
                  <td className="px-3 py-2 font-bold text-purple-900 text-lg text-right">
                    ${latestEstimate.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <ul className="space-y-1">
              {latestEstimate.notes.map((note, idx) => (
                <li key={idx}>• {note}</li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center transition-colors"
            >
              <PrinterIcon className="w-4 h-4 mr-1" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Download JSON
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No AI estimate generated yet.</p>
      )}

      {/* Modal */}
      <AIEstimateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEstimateGenerated={handleEstimateGenerated}
      />
    </div>
  );
};

export default AIEstimateCard;
