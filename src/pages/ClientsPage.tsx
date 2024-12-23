import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm'; 
import { ClientStats } from '../components/clients/ClientStats';
import { UserPlus } from 'lucide-react';
import type { RelationshipType, RelatedClient } from '../types/relationship';
import type { Client } from '../types/client';

export function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadClients();
  }, [user?.id]);

  async function loadClients() {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }


  const handleAddRelationship = async (clientId: string, relatedClientId: string, relationshipType: RelationshipType) => {
    try {
      const { error } = await supabase
        .from('client_relationships')
        .insert([{
          client_id: clientId,
          related_client_id: relatedClientId,
          relationship_type: relationshipType
        }]);

      if (error) throw error;

      await loadRelatedClients(clientId);
    } catch (err) {
      console.error('Error adding relationship:', err);
      throw err;
    }
  };

  const handleRemoveRelationship = async (clientId: string, relatedClientId: string) => {
    try {
      const { error } = await supabase
        .from('client_relationships')
        .delete()
        .eq('client_id', clientId)
        .eq('related_client_id', relatedClientId);

      if (error) throw error;

      await loadRelatedClients(clientId);
    } catch (err) {
      console.error('Error removing relationship:', err);
      throw err;
    }
  };
  const handleAddClient = async (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [...prev, data]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
      </div>
      
      <ClientStats clients={clients} />
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client List</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {showAddForm && (
        <ClientForm
          onSubmit={handleAddClient}
          availableClients={clients}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <ClientList
        clients={clients}
        onDelete={handleDeleteClient}
      />
    </div>
  );
}