// src/components/PrintableLayout.jsx
import React from 'react';
import { usePrintable } from '../hooks/usePrintable';

/**
 * PrintableLayout
 * Wrapper layout for any printable page/content
 */
export const PrintableLayout = ({
  title,
  subtitle,
  children,
  headerInfo,
  className = ''
}) => {
  const { handlePrint } = usePrintable(title, true);

  return (
    <div className={`print-container ${className}`}>
      {/* Print Header */}
      <div className="customer-print-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          <div className="text-right text-sm">
            <div className="font-bold">Eddie's Askan Automotive</div>
            <div>123 Main St, Bakersfield, CA 93301</div>
            <div>(661) 555-0123</div>
          </div>
        </div>

        {headerInfo && (
          <div className="customer-print-info mt-4">
            {Object.entries(headerInfo).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="print-content mt-4">{children}</div>

      {/* Print Timestamp */}
      <div
        className="print-timestamp mt-4 text-xs text-gray-500"
        data-timestamp={new Date().toLocaleString()}
      >
        Printed on {new Date().toLocaleString()}
      </div>

      {/* Optional: Print button for testing */}
      <div className="mt-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
};
