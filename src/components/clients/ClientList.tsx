import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientForm } from './ClientForm';
import type { Client } from '../../types/client';

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => Promise<void>;
}

export function ClientList({ clients, onDelete }: ClientListProps) {
  const navigate = useNavigate();

  const handleDelete = async (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.first_name} ${client.last_name}?`)) {
      try {
        await onDelete(client.id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No clients found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 -mx-4 sm:mx-0 max-w-full">
      <div className="overflow-x-auto shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Therapy Start Date
              </th>
              <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Emergency Contact
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {client.first_name} {client.last_name}
                  </div>
                  {client.date_of_birth && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      DOB: {new Date(client.date_of_birth).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                  {client.inactive_date && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Since: {new Date(client.inactive_date).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {client.email && (
                      <div>{client.email}</div>
                    )}
                    {client.phone && (
                      <div>{client.phone}</div>
                    )}
                    {client.address && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.address}</div>
                    )}
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                  {client.therapy_start_date && (
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(client.therapy_start_date).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                  {client.emergency_contact_name && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {client.emergency_contact_name}
                      </div>
                      {client.emergency_contact_phone && (
                        <div className="text-gray-500 dark:text-gray-400">
                          {client.emergency_contact_phone}
                        </div>
                      )}
                      {client.emergency_contact_relationship && (
                        <div className="text-gray-500 dark:text-gray-400">
                          ({client.emergency_contact_relationship})
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-4">
                    <button
                      onClick={() => navigate(`/app/clients/${client.id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg touch-target transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden md:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg touch-target transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}