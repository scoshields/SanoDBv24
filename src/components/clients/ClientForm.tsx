import React, { useState } from 'react';
import { Save, X, UserCheck, UserX } from 'lucide-react';
import { ClientRelationships } from './ClientRelationships';
import type { Client } from '../../types/client';
import type { RelationshipType, RelatedClient } from '../../types/relationship';

interface ClientFormProps {
  client?: Client;
  readOnly?: boolean;
  availableClients?: Client[];
  relatedClients?: RelatedClient[];
  onAddRelationship?: (relatedClientId: string, relationshipType: RelationshipType) => Promise<void>;
  onRemoveRelationship?: (relatedClientId: string) => Promise<void>;
  onSubmit: (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({ 
  client, 
  readOnly = false,
  availableClients = [], 
  relatedClients = [],
  onAddRelationship,
  onRemoveRelationship,
  onSubmit, 
  onCancel 
}: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: client?.first_name || '',
    last_name: client?.last_name || '',
    status: client?.status || 'active',
    date_of_birth: client?.date_of_birth || '',
    therapy_start_date: client?.therapy_start_date || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    emergency_contact_name: client?.emergency_contact_name || '',
    emergency_contact_phone: client?.emergency_contact_phone || '',
    emergency_contact_relationship: client?.emergency_contact_relationship || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {client ? (readOnly ? 'Client Details' : 'Edit Client') : 'Add New Client'}
        </h2>
        {!readOnly && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {client && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                formData.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {formData.status === 'active' ? (
                  <UserCheck className="h-4 w-4 mr-2" />
                ) : (
                  <UserX className="h-4 w-4 mr-2" />
                )}
                {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </span>
              {client.inactive_date && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Inactive since: {new Date(client.inactive_date).toLocaleDateString()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                status: prev.status === 'active' ? 'inactive' : 'active'
              }))}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                formData.status === 'active'
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
              }`}
            >
              {formData.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              readOnly={readOnly}
              value={formData.first_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              readOnly={readOnly}
              value={formData.last_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              readOnly={readOnly}
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="therapy_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Therapy Start Date
            </label>
            <input
              type="date"
              id="therapy_start_date"
              name="therapy_start_date"
              readOnly={readOnly}
              value={formData.therapy_start_date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              readOnly={readOnly}
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              readOnly={readOnly}
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              readOnly={readOnly}
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency Contact Name
            </label>
            <input
              type="text"
              id="emergency_contact_name"
              name="emergency_contact_name"
              readOnly={readOnly}
              value={formData.emergency_contact_name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              readOnly={readOnly}
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>

          <div>
            <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency Contact Relationship
            </label>
            <input
              type="text"
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              readOnly={readOnly}
              value={formData.emergency_contact_relationship}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm ${
                readOnly
                  ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
            />
          </div>
        </div>

        {!readOnly && <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Client'}
          </button>
        </div>}

        {client && onAddRelationship && onRemoveRelationship && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <ClientRelationships
              client={client}
              relatedClients={relatedClients}
              availableClients={availableClients.filter(c => c.id !== client.id)}
              onAddRelationship={onAddRelationship}
              onRemoveRelationship={onRemoveRelationship}
            />
          </div>
        )}
      </form>
    </div>
  );
}