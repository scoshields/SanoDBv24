import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ClientForm } from '../components/clients/ClientForm';
import type { Client } from '../types/client';
import type { RelatedClient } from '../types/relationship';

export function ClientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [relatedClients, setRelatedClients] = useState<RelatedClient[]>([]);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Reset states when id changes
    setClient(null);
    setRelatedClients([]);
    setError(null);
    setLoading(true);
    
    loadClient();
    loadAvailableClients();
  }, [id]);

  async function loadClient() {
    try {
      if (!id) return;

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Load related clients
      const { data: relatedData, error: relatedError } = await supabase
        .from('client_relationships')
        .select(`
          related_client_id,
          relationship_type,
          related_client:clients!client_relationships_related_client_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('client_id', id);

      if (relatedError) throw relatedError;

      setRelatedClients(
        relatedData.map(r => ({
          id: r.related_client.id,
          first_name: r.related_client.first_name,
          last_name: r.related_client.last_name,
          relationship_type: r.relationship_type
        }))
      );
    } catch (err) {
      console.error('Error loading client:', err);
      setError(err instanceof Error ? err.message : 'Failed to load client');
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setAvailableClients(data || []);
    } catch (err) {
      console.error('Error loading available clients:', err);
    }
  }

  const handleUpdateClient = async (updates: Partial<Client>) => {
    try {
      if (!client?.id) return;

      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', client.id);

      if (error) throw error;

      setClient(prev => prev ? { ...prev, ...updates } : null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const handleAddRelationship = async (relatedClientId: string, relationshipType: string) => {
    try {
      if (!client?.id) return;
      
      // Add the relationship from client to related client
      const { error } = await supabase
        .from('client_relationships')
        .insert([{
          client_id: client.id,
          related_client_id: relatedClientId,
          relationship_type: relationshipType
        }]);

      if (error) throw error;

      // The reciprocal relationship is handled by the database trigger
      // Just reload the client data to get updated relationships
      await loadClient();
    } catch (err) {
      console.error('Error adding relationship:', err);
      throw err;
    }
  };

  const handleRemoveRelationship = async (relatedClientId: string) => {
    try {
      if (!client?.id) return;

      // Delete the relationship - the reciprocal will be handled by the database trigger
      const { error } = await supabase
        .from('client_relationships')
        .delete()
        .eq('client_id', client.id)
        .eq('related_client_id', relatedClientId);

      if (error) throw error;

      // Reload to get updated relationships
      await loadClient();
    } catch (err) {
      console.error('Error removing relationship:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Client not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/app/clients')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Clients
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {client.first_name} {client.last_name}
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isEditing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
          }`}
        >
          <Pencil className="h-4 w-4" />
          {isEditing ? 'Cancel Editing' : 'Edit Details'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <ClientForm
        client={client}
        readOnly={!isEditing}
        availableClients={availableClients.filter(c => c.id !== client.id)}
        relatedClients={relatedClients}
        onAddRelationship={handleAddRelationship}
        onRemoveRelationship={handleRemoveRelationship}
        onSubmit={handleUpdateClient}
        onCancel={() => navigate('/app/clients')}
      />
    </div>
  );
}