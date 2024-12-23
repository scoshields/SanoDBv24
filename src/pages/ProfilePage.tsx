import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ProfileForm } from '../components/profile/ProfileForm';
import type { Profile } from '../types/profile';

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (updatedProfile: Partial<Profile>) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updatedProfile })
        .select()
        .single();

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      ) : (
        <ProfileForm profile={profile} onUpdate={handleUpdateProfile} />
      )}
    </div>
  );
}