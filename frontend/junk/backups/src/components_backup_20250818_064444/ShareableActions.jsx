// src/components/ShareableActions.jsx
import React, { useState } from 'react';
import { 
  PrinterIcon, 
  ShareIcon, 
  EnvelopeIcon,
  DocumentArrowDownIcon,
  LinkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export const ShareableActions = ({ 
  title, 
  data, 
  entityType, 
  entityId, 
  onPrint, 
  onExport,
  className = "" 
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${entityType}/${entityId}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${title} - Eddie's Askan Automotive`);
    const body = encodeURIComponent(
      `Please find the ${entityType} details below:\n\n${generateShareLink()}\n\nBest regards,\nEddie's Askan Automotive`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    // Add print styles to document
    const printStyles = document.createElement('link');
    printStyles.rel = 'stylesheet';
    printStyles.href = '/src/styles/print.css';
    printStyles.media = 'print';
    document.head.appendChild(printStyles);

    // Trigger print
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }

    // Clean up
    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 1000);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-gray-600 text-white rounded-l-lg hover:bg-gray-700 flex items-center border-r border-gray-500"
        title="Print"
      >
        <PrinterIcon className="h-4 w-4 mr-2" />
        Print
      </button>

      {/* Share Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 flex items-center"
          title="Share"
        >
          <ShareIcon className="h-4 w-4 mr-2" />
          Share
        </button>

        {showShareMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <LinkIcon className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              
              <button
                onClick={handleEmailShare}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Link
              </button>
              
              {onExport && (
                <button
                  onClick={() => {
                    onExport('pdf');
                    setShowShareMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

// src/hooks/usePrintable.js
import { useEffect } from 'react';

export const usePrintable = (title, isActive = false) => {
  useEffect(() => {
    if (isActive) {
      // Set document title for print
      const originalTitle = document.title;
      document.title = title;

      // Add timestamp for print
      const timestamp = new Date().toLocaleString();
      document.body.setAttribute('data-print-timestamp', timestamp);

      return () => {
        document.title = originalTitle;
        document.body.removeAttribute('data-print-timestamp');
      };
    }
  }, [title, isActive]);

  const handlePrint = () => {
    window.print();
  };

  return { handlePrint };
};

// src/components/PrintableLayout.jsx
import React from 'react';
import { usePrintable } from '../hooks/usePrintable';

export const PrintableLayout = ({ 
  title, 
  subtitle, 
  children, 
  headerInfo,
  className = "" 
}) => {
  const { handlePrint } = usePrintable(title, true);

  return (
    <div className={`print-container ${className}`}>
      {/* Print Header */}
      <div className="customer-print-header">
        <div className="flex justify-between items-start">
          <div>
            <h1>{title}</h1>
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
      <div className="print-content">
        {children}
      </div>

      {/* Print Footer */}
      <div className="print-timestamp" data-timestamp={new Date().toLocaleString()} />
    </div>
  );
};
