// src/components/users/TableFilterSearch.jsx
import React from 'react';
import { Search, Filter, RefreshCw, UserPlus } from 'lucide-react';

export default function TableFilterSearch({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  filterIsActive,
  onFilterChange,
  onRefresh,
  onAddUser,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={onSearchChange}
            onKeyPress={onSearchSubmit}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={filterIsActive}
            onChange={onFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>


      </div>
    </div>
  );
}