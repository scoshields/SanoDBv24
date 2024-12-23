import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { UserSettings } from '../types/settings';

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply theme when settings change
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings?.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings?.theme]);

  useEffect(() => {
    async function loadSettings() {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // If we found existing settings, use them
        if (data) {
          setSettings(data);
          return;
        }

        // If no settings exist, create them with a single upsert
        const { data: newSettings, error: upsertError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            note_format: 'girp',
            theme: 'system'
          }, {
            onConflict: 'user_id'
          })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        setSettings(newSettings);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [user?.id]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      if (!user?.id) return;

      const { data: updatedSettings, error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id,
          ...newSettings
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(updatedSettings);
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return { settings, loading, error, updateSettings };
}