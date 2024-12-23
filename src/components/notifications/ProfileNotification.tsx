import React from 'react';
import { UserCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileNotificationProps {
  onDismiss: () => void;
}

export function ProfileNotification({ onDismiss }: ProfileNotificationProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Complete your profile to get the most out of Sano
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/profile"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Update Profile
          </Link>
          <button
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}