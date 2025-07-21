// src/components/documents/DocumentTable.jsx
import React from "react";
import { FileText, Download, Edit, Trash2 } from "lucide-react";

// Định nghĩa interface cho Document
interface Document {
  id: string;
  title: string;
  description?: string;
  fileType?: string;
  file?: File;
  size?: number;
  isActive?: boolean;
  uploadedBy?: { username?: string };
}

interface DocumentTableProps {
  documents: Document[];
  loading: boolean;
  selectedDocumentIds: string[];
  setSelectedDocumentIds: (ids: string[]) => void;
  onEdit: (doc: Document) => void;
  onShowEditModal: (show: boolean) => void;
  onDelete: (id: string) => void;
  API_BASE_URL: string;
}

export default function DocumentTable({
  documents,
  loading,
  selectedDocumentIds,
  setSelectedDocumentIds,
  onEdit,
  onShowEditModal,
  onDelete,
  API_BASE_URL,
}: DocumentTableProps) {
  const handleDownload = async (docId: string) => {
    const token = localStorage.getItem("token"); // Get the token here

    if (!token) {
      alert("You are not logged in. Please log in to download.");
      // Redirect to login page or handle appropriately
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/${docId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Use the retrieved token
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to download document: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Lấy tên file từ header nếu có
      let filename = `document_${docId}`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      } else {
        // Nếu có fileType, thêm đuôi mở rộng phù hợp
        const doc = documents.find((d) => d.id === docId);
        if (doc && doc.fileType) {
          filename += `.${doc.fileType.toLowerCase()}`;
        } else {
          filename += `.bin`;
        }
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error downloading document. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedDocumentIds(
                      e.target.checked ? documents.map((doc) => doc.id) : []
                    );
                  }}
                  checked={
                    documents.length > 0 &&
                    selectedDocumentIds.length === documents.length
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocumentIds.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocumentIds([
                            ...selectedDocumentIds,
                            doc.id,
                          ]);
                        } else {
                          setSelectedDocumentIds(
                            selectedDocumentIds.filter((id) => id !== doc.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doc.title}
                        </div>
                        {doc.description && (
                          <div className="text-xs text-gray-500 truncate w-48">
                            {doc.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.fileType
                      ? doc.fileType.toUpperCase()
                      : doc.file && doc.file.type
                        ? doc.file.type.split("/")[1]?.toUpperCase() || doc.file.type
                        : "N/A"}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.size
                      ? `${(doc.size / 1024 / 1024).toFixed(2)} MB`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    {/* Assuming doc.uploadedBy would be available from API, otherwise show 'Admin' */}
                    {doc.uploadedBy?.username || "Admin"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => handleDownload(doc.id)}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button> */}
                      <button
                        onClick={() => {
                          onEdit(doc);
                          onShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 transition"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="text-red-600 hover:text-red-900 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
