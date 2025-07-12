// src/components/documents/EditDocumentModal.jsx
import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react'; // Import UploadCloud icon

export default function EditDocumentModal({ document, onClose, onSubmit, onFileSubmit, loading }) {
  // formData for title, description, isActive
  const [formData, setFormData] = useState({
    title: document.title || '',
    description: document.description || '',
    isActive: document.isActive || false
  });

  // State for the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(document.originalFileName || ''); // To display current/new file name

  // Handle changes for text/checkbox inputs
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name); // Update displayed file name
    } else {
      setSelectedFile(null);
      setFileName(document.originalFileName || ''); // Revert to original if no file selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Submit metadata (title, description, isActive)
    // Assuming onSubmit handles the PUT /api/documents/:id route
    onSubmit(formData);

    // 2. Submit file if a new one is selected
    // Assuming onFileSubmit handles the PUT /api/documents/:id/file route
    if (selectedFile) {
      onFileSubmit(selectedFile);
    }

    // You might want to handle success/error states and close the modal
    // based on the outcome of *both* submissions.
    // For simplicity, we're calling both. You might need a more
    // sophisticated state management here, e.g., waiting for both to complete.
  };


  return (
    <div className="fixed inset-0  flex items-center justify-center p-4 z-50"> {/* Added overlay styles */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Document</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title" // Changed to 'title' to match formData key
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description" // Changed to 'description'
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* NEW: File Upload Section */}
            <div>
              <label htmlFor="document-file" className="block text-sm font-medium text-gray-700 mb-1">
                Document File (Leave blank to keep current)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="document-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload new file</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, XLSX, etc.</p>
                  </div>
                  <input id="document-file" type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: <span className="font-semibold">{fileName}</span>
                </p>
              )}
            </div>
            {/* END NEW: File Upload Section */}

            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  id="isActive" // Changed to 'isActive'
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">Set as active document</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}