// src/components/documents/ActiveDocumentsSection.jsx
import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function ActiveDocumentsSection({ activeDocuments, API_BASE_URL }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Active Documents</h2>
      {activeDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDocuments.map(doc => (
            <div key={doc.id} className="bg-white border-green-200 p-4 rounded-lg border shadow-sm flex items-center gap-4">
              <FileText className="w-6 h-6 text-green-500" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 truncate">{doc.title}</p>
                <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => window.open(`${API_BASE_URL}/documents/${doc.id}/download`, '_blank')}
                className="text-blue-600 hover:text-blue-900"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No active documents.</p>
        </div>
      )}
    </div>
  );
}