// src/components/modals/ConfirmModal.jsx
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ConfirmModal({ 
  isOpen = true, 
  message, 
  title = "Confirm Action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm, 
  onCancel,
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200", 
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600", 
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    }
  };

  const styles = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className={`${styles.bg} ${styles.border} border-t-4 px-6 py-4 rounded-t-lg`}>
          <div className="flex items-center">
            <ExclamationTriangleIcon className={`w-6 h-6 ${styles.icon} mr-3`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${styles.button} border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
