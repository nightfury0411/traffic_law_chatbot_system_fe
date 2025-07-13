import React from 'react';
import { Edit, Trash2, ShieldCheck, UserPlus, RefreshCw } from 'lucide-react';
import SortIcon from '../common/SortIcon';
// Import the new SortIcon component


export default function UserTable({ users, loading, sortConfig, onSort, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => onSort('firstName')}
              >
                <div className="flex items-center">
                  Name
                  {/* Pass the direction prop to SortIcon */}
                  <SortIcon direction={sortConfig.key === 'firstName' ? sortConfig.direction : null} />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => onSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {/* Pass the direction prop to SortIcon */}
                  <SortIcon direction={sortConfig.key === 'email' ? sortConfig.direction : null} />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors"
                onClick={() => onSort('createdAt')}
              >
                <div className="flex items-center">
                  Joined Date
                  {/* Pass the direction prop to SortIcon */}
                  <SortIcon direction={sortConfig.key === 'createdAt' ? sortConfig.direction : null} />
                </div>
              </th>
             
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <RefreshCw size={24} className="animate-spin text-blue-600 mr-2" />
                    <span className="text-gray-500">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="text-gray-500">
                    <UserPlus size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No users found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isAdmin && <ShieldCheck size={14} />}
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
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