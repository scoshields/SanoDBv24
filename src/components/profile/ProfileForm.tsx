import React, { useState } from 'react';
import { Save, Pencil } from 'lucide-react';
import type { Profile } from '../../types/profile';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { AvatarUpload } from './AvatarUpload';
import { StickyBar } from './StickyBar';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ProfessionalInfoSection } from './sections/ProfessionalInfoSection';
import { WorkingHoursSection } from './sections/WorkingHoursSection';

interface ProfileFormProps {
  profile: Profile | null;
  onUpdate: (profile: Partial<Profile>) => Promise<void>;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>(profile || {});
  const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onUpdate(formData);
      setEditing(false);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile || {});
    setHasUnsavedChanges(false);
  };

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8">
      {editing && hasUnsavedChanges && (
        <StickyBar
          onSave={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <AvatarUpload
              url={formData.avatar_url}
              onUpload={(url) => handleChange('avatar_url', url)}
              disabled={!editing}
            />
          </div>

          <PersonalInfoSection
            data={formData}
            onChange={handleChange}
            disabled={!editing}
          />

          <ProfessionalInfoSection
            data={formData}
            onChange={handleChange}
            disabled={!editing}
          />

          <WorkingHoursSection
            value={formData.working_hours}
            onChange={(hours) => handleChange('working_hours', hours)}
            disabled={!editing}
          />

          {editing && (
            <div className="flex justify-end lg:hidden">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}