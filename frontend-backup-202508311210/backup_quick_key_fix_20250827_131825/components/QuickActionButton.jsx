import React from 'react';

const QuickActionButton = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      type="button"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default QuickActionButton;
