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

/**
 * ShareableActions
 * A component to provide print, share, email, and export functionality for any entity.
 */
export const ShareableActions = ({
  title,
  entityType,
  entityId,
  onPrint,
  onExport,
  className = ""
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate shareable URL
  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${entityType}/${entityId}`;
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Share via email
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`${title} - Eddie's Askan Automotive`);
    const body = encodeURIComponent(
      `Please find the ${entityType} details below:\n\n${generateShareLink()}\n\nBest regards,\nEddie's Askan Automotive`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Print
  const handlePrint = () => {
    // Optional: load print styles
    const printStyles = document.createElement('link');
    printStyles.rel = 'stylesheet';
    printStyles.href = '/src/styles/print.css';
    printStyles.media = 'print';
    document.head.appendChild(printStyles);

    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }

    // Cleanup after print
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
              {/* Copy Link */}
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

              {/* Email Link */}
              <button
                onClick={handleEmailShare}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Link
              </button>

              {/* Export PDF */}
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
