// src/components/modals/PromptModal.jsx – Production Ready

import React, { useState, useEffect } from 'react';

const PromptModal = ({
  message = 'Please enter a value:',
  onConfirm,
  onCancel,
  inputValue,
  onInputChange,
  title = 'Input Required',
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  inputPlaceholder = '',
}) => {
  const [internalInputValue, setInternalInputValue] = useState(inputValue || '');

  const currentValue = typeof inputValue !== 'undefined' ? inputValue : internalInputValue;
  const handleInputChange =
    typeof onInputChange === 'function'
      ? onInputChange
      : (e) => setInternalInputValue(e.target.value);

  const handleSubmit = () => {
    if (!currentValue.trim()) return;
    onConfirm(currentValue.trim());
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') handleSubmit();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentValue, onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-title"
      aria-describedby="prompt-message"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full animate-fade-in-down">
        <h2 id="prompt-title" className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>

        <p id="prompt-message" className="text-base font-medium text-gray-700 mb-4">
          {message}
        </p>

        <input
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          autoFocus
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
