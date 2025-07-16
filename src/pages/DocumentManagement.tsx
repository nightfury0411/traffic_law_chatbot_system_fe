// src/pages/DocumentManagementPage.jsx (hoặc src/components/DocumentManagementPage.jsx nếu bạn muốn coi nó là một phần của components)
import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";

import UploadDocumentModal from "../components/documents/UploadDocumentModal";
import EditDocumentModal from "../components/documents/EditDocumentModal";
import ActiveDocumentsSection from "../components/documents/ActiveDocumentsSection";
import DocumentTable from "../components/documents/DocumentTable";
import PaginationControls from "../components/documents/PaginationControls";

const API_BASE_URL = "http://localhost:3000";

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState([]);
  const [activeDocuments, setActiveDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [filter, setFilter] = useState({ type: "", isActive: "" });

  const limit = 10;
  const fileTypes = ["pdf", "doc", "docx", "txt", "jpg", "png", "zip"]; // Có thể đưa ra ngoài nếu dùng chung

  // Fetch documents with search and pagination
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(filter.type && { type: filter.type }),
        ...(filter.isActive && { isActive: filter.isActive }),
      });

      const response = await fetch(`${API_BASE_URL}/documents?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      setDocuments(data.data || []);
      setTotalPages(data.meta?.lastPage || 1);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, searchQuery]);

  const fetchActiveDocuments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/active`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch active documents");

      const data = await response.json();
      setActiveDocuments(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleApiCall = async (apiCall, successMessage) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiCall();
      setSuccess(successMessage);
      // Refresh both lists after any successful operation
      fetchDocuments();
      fetchActiveDocuments();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      fetchActiveDocuments();
      setLoading(false);
    }
  };

  const uploadDocument = async (formData) => {
    await handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document");
      }
      setShowUploadModal(false);
    }, "Document uploaded successfully!");
  };
  const uploadDocumentFile = async (id, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // Make sure 'file' matches your backend's expected field name, e.g., multer().single('file')

      const response = await fetch(`${API_BASE_URL}/documents/${id}/file`, {
        method: "PUT",
        headers: {
          // REMOVE THE 'Content-Type' HEADER WHEN USING FormData WITH fetch
          // 'Content-Type': 'multipart/form-data', // <-- DELETE THIS LINE
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // Just pass the formData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document file");
      }
      setShowEditModal(false); // Consider moving this to the parent component after both metadata and file updates succeed
    } catch (error) {
      console.error("Error uploading document file:", error);
      throw error;
    } finally {
      fetchActiveDocuments();
      setLoading(false);
    }
  };
  const updateDocument = async (id, updateData) => {
    await handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update document");
      }
      setShowEditModal(false);
    }, "Document updated successfully!");
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    await handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete document");
      }
    }, "Document deleted successfully!");
  };

  const setActiveDocumentsHandler = async () => {
    await handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/documents/set-active`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentIds: selectedDocumentIds }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to set active documents");
      }
      setSelectedDocumentIds([]); // Clear selection after setting active
    }, "Active documents updated successfully!");
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchActiveDocuments();
  }, [fetchActiveDocuments]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      // Khi nhấn Enter, chuyển về trang 1 và fetch lại tài liệu
      setCurrentPage(1);
      fetchDocuments();
    }
  };

  // Cần thêm useEffect để fetch lại khi currentPage thay đổi (từ phân trang)
  // hoặc khi filter thay đổi
  useEffect(() => {
    // Chỉ fetch lại nếu không phải là lần đầu tiên component mount
    // hoặc nếu sự thay đổi của currentPage/filter không phải do search
    // Để tránh fetch 2 lần khi search (search đã set currentPage về 1 rồi fetch)
    if (
      currentPage !== 1 ||
      filter.type ||
      filter.isActive ||
      searchQuery === ""
    ) {
      fetchDocuments();
    }
  }, [currentPage, filter]); // Theo dõi currentPage và filter để tự động fetch

  return (
    <>
      {/* Modals */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={uploadDocument}
          loading={loading}
        />
      )}

      {showEditModal && selectedDocument && (
        <EditDocumentModal
          document={selectedDocument}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updateData) =>
            updateDocument(selectedDocument.id, updateData)
          }
          onFileSubmit={(file) => uploadDocumentFile(selectedDocument.id, file)}
          loading={loading}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Management
            </h1>
            <p className="text-gray-600">
              Manage your documents, upload new files, and control access
            </p>
          </div>
        </div>

        {/* Active Documents Section */}
        <ActiveDocumentsSection
          activeDocuments={activeDocuments}
          API_BASE_URL={API_BASE_URL}
        />

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-100 border-red-500 text-red-700 border-l-4 p-4 rounded-md">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-100 border-green-500 text-green-700 border-l-4 p-4 rounded-md">
            <p>{success}</p>
          </div>
        )}

        {/* Document Controls and Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                {/* Search Input */}
                <svg
                  className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents and press Enter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter by Status (isActive) */}
            <select
              value={filter.isActive}
              onChange={(e) => {
                setFilter({ ...filter, isActive: e.target.value });
                setCurrentPage(1); // Reset page on filter change
              }}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Upload
            </button>
          </div>

          {/* Bulk Actions (Set Active) */}
          {selectedDocumentIds.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border-blue-200 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  {selectedDocumentIds.length} document(s) selected
                </span>
                <button
                  onClick={setActiveDocumentsHandler}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <svg
                    className="lucide lucide-check-circle w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Set as Active
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Documents Table */}
        <DocumentTable
          documents={documents}
          loading={loading}
          selectedDocumentIds={selectedDocumentIds}
          setSelectedDocumentIds={setSelectedDocumentIds}
          onEdit={setSelectedDocument} // Pass setSelectedDocument which will then trigger showEditModal in parent
          onShowEditModal={setShowEditModal} // Pass setter for EditModal visibility
          onDelete={deleteDocument}
          API_BASE_URL={API_BASE_URL}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
