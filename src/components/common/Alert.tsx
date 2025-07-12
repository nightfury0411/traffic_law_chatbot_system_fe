// src/components/common/Alert.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function Alert({ message, type, onClose }) {
  if (!message) return null;

  const typeClasses = {
    error: 'bg-red-50 border-l-4 border-red-400 text-red-800',
    success: 'bg-green-50 border-l-4 border-green-400 text-green-800',
    info: 'bg-blue-50 border-l-4 border-blue-400 text-blue-800',
    warning: 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800',
  };

  const iconColorClass = {
    error: 'text-red-400',
    success: 'text-green-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  const icon = type === 'success' ? '✓' : <X className="h-5 w-5" />;

  return (
    <div className={`mb-6 p-4 rounded-lg shadow-sm ${typeClasses[type]}`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${iconColorClass[type]}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-medium">
            {type === 'error' && <strong>Error: </strong>}
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-auto ${iconColorClass[type]} hover:opacity-75`}
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}