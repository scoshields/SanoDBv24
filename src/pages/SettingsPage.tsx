import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';
import { NOTE_FORMATS } from '../utils/noteFormats/formats';
import type { UserSettings, ThemeType } from '../types/settings';

export function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !settings) return;
    
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const { data: updatedSettings, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          note_format: settings.note_format,
          theme: settings.theme
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(updatedSettings);
      setSaveSuccess(true);

      // Show success message for 3 seconds
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}
        
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 rounded-md">
            <p className="text-sm text-green-700 dark:text-green-200 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Success!</span>
              Settings saved successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="note_format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Note Format
            </label>
            <select
              id="note_format"
              value={settings?.note_format || 'girp'}
              onChange={(e) => handleChange('note_format', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(NOTE_FORMATS).map(([id, format]) => (
                <option key={id} value={id}>
                  {format.label} - {format.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme Preference
            </label>
            <select
              id="theme"
              value={settings?.theme || 'system'}
              onChange={(e) => handleChange('theme', e.target.value as ThemeType)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="system">System Default</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}