import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import type { Client } from '../../types/client';
import type { RelationshipType, RelatedClient } from '../../types/relationship';

interface ClientRelationshipsProps {
  client: Client;
  relatedClients: RelatedClient[];
  availableClients: Client[];
  onAddRelationship: (relatedClientId: string, relationshipType: RelationshipType) => Promise<void>;
  onRemoveRelationship: (relatedClientId: string) => Promise<void>;
}

export function ClientRelationships({
  client,
  relatedClients,
  availableClients,
  onAddRelationship,
  onRemoveRelationship
}: ClientRelationshipsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedType, setSelectedType] = useState<RelationshipType>('child');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  const handleClientClick = async (relatedClientId: string) => {
    if (navigating) return;
    setNavigating(true);
    
    // Force a full reload of the client data by navigating
    navigate(`/app/clients/${relatedClientId}`);
    
    // Reset navigation state after a short delay
    setTimeout(() => setNavigating(false), 500);
  };

  const handleAddRelationship = async () => {
    setError(null);

    try {
      await onAddRelationship(selectedClient, selectedType);
      setShowAddForm(false);
      setSelectedClient('');
      setSelectedType('child');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Related Clients
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Plus className="h-4 w-4" />
          Add Relationship
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adding a relationship for <span className="font-medium">{client.first_name} {client.last_name}</span>
            </p>

            <div>
              <label htmlFor="related_client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Related Client
              </label>
              <select
                id="related_client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select who {client.first_name} is related to...</option>
                {availableClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="relationship_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {client.first_name} is their...
              </label>
              <select
                id="relationship_type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as RelationshipType)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRelationship}
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Relationship
              </button>
            </div>
          </div>
        </div>
      )}

      {relatedClients.length > 0 ? (
        <div className="space-y-2">
          {relatedClients.map(related => (
            <div
              key={related.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              onClick={() => handleClientClick(related.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleClientClick(related.id)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {related.first_name} {related.last_name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({related.relationship_type})
                </span>
              </div>
              <button
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRelationship(related.id);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No related clients
        </p>
      )}
    </div>
  );
}