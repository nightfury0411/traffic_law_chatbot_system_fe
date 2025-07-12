// src/components/common/ModalBackdrop.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function ModalBackdrop({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}