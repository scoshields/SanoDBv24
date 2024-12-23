import React, { useCallback, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { UserCircle, Upload } from 'lucide-react';

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export function AvatarUpload({ url, onUpload, disabled }: AvatarUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setError(null);
        setUploading(true);

        if (!event.target.files || event.target.files.length === 0) {
          throw new Error('You must select an image to upload.');
        }

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

        // Upload file to Supabase storage
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        if (!data?.path) {
          throw new Error('Upload failed - no path returned');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path);

        onUpload(publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error uploading avatar');
      } finally {
        setUploading(false);
      }
    },
    [user, onUpload]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {url ? (
          <img
            src={url}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        
        {!disabled && (
          <label
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            htmlFor="avatar"
          >
            <Upload className="w-8 h-8 text-white" />
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {uploading && (
        <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
      )}

      <input
        type="file"
        id="avatar"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
}