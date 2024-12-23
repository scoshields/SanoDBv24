import React from 'react';
import type { Profile } from '../../../types/profile';

interface PersonalInfoSectionProps {
  data: Partial<Profile>;
  onChange: (field: keyof Profile, value: any) => void;
  disabled?: boolean;
}

export function PersonalInfoSection({ data, onChange, disabled }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Personal Information
      </h3>
      
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="is_searchable"
          checked={data.is_searchable || false}
          onChange={(e) => onChange('is_searchable', e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700"
        />
        <div className="flex flex-col">
          <label htmlFor="is_searchable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Make profile searchable
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Allow other mental health professionals or possible clients to find and connect with you
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={data.first_name || ''}
            onChange={(e) => onChange('first_name', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            value={data.last_name || ''}
            onChange={(e) => onChange('last_name', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Business Email
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="clinic_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Clinic/Practice Name
          </label>
          <input
            type="text"
            id="clinic_name"
            value={data.clinic_name || ''}
            onChange={(e) => onChange('clinic_name', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="clinic_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Clinic/Practice Address
          </label>
          <input
            type="text"
            id="clinic_address"
            value={data.clinic_address || ''}
            onChange={(e) => onChange('clinic_address', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="clinic_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Clinic/Practice Phone
          </label>
          <input
            type="tel"
            id="clinic_phone"
            value={data.clinic_phone || ''}
            onChange={(e) => onChange('clinic_phone', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
}