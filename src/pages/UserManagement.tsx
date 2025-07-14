// src/pages/UserManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";

// Import components

import CreateUserModal from "../components/users/CreateUserModal";
import EditUserModal from "../components/users/EditUserModal";
import Alert from "../components/common/Alert";
import TableFilterSearch from "../components/users/TableFilterSearch";
import UserTable from "../components/users/UserTable";
import PaginationControls from "../components/documents/PaginationControls";

const API_BASE_URL = "http://localhost:3000";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for search, filter, sort, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ isActive: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const limit = 10; // Number of items per page

  // Fetch users with search, filter, sort, and pagination
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery.trim() }),
        ...(sortConfig.key && { sortBy: sortConfig.key }),
        ...(sortConfig.direction && { sortOrder: sortConfig.direction }),
      });

      // Add isActive filter if selected
      if (filters.isActive !== "") {
        params.append("isActive", filters.isActive);
      }

      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch users: ${response.statusText}`
        );
      }

      const data = await response.json();
      setUsers(data.data || []);
      setTotalPages(data.meta?.lastPage || 1);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, sortConfig, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // API Handlers (wrapped in a helper for consistent error/loading handling)
  const handleApiCall = async (apiCall, successMessage) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiCall();
      setSuccess(successMessage);
      fetchUsers(); // Refresh list after success
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const createUser = (userData) =>
    handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      setShowCreateModal(false);
    }, "User created successfully!");

  const updateUser = (id, userData) =>
    handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      setShowEditModal(false);
    }, "User updated successfully!");

  const deleteUser = (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    handleApiCall(async () => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
    }, "User deleted successfully!");
  };

  // UI Handlers for search, filter, sort, pagination
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1); // Reset to first page on new search
      fetchUsers(); // Manually trigger fetch to ensure search applies
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, isActive: e.target.value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchQuery("");
    setFilters({ isActive: "" });
    setSortConfig({ key: "createdAt", direction: "desc" });
    // fetchUsers will be called via useEffect due to state changes
  };

  return (
    <>
      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createUser}
          loading={loading}
        />
      )}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => updateUser(selectedUser.id, data)}
          loading={loading}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 p-6 transition-colors duration-300">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Management
            </h1>
            <p className="text-lg text-gray-600">
              Create, view, and manage system users
            </p>
          </div>

          {/* Alerts */}
          <Alert message={error} type="error" onClose={() => setError("")} />
          <Alert
            message={success}
            type="success"
            onClose={() => setSuccess("")}
          />

          {/* Search, Filter & Add User Controls */}
          <TableFilterSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            filterIsActive={filters.isActive}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            onAddUser={() => setShowCreateModal(true)}
          />

          {/* User Table */}
          <UserTable
            users={users}
            loading={loading}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={(user) => {
              setSelectedUser(user);
              setShowEditModal(true);
            }}
            onDelete={deleteUser}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
