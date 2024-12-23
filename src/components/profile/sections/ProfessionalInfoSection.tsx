import React from 'react';
import { US_STATES } from '../../../utils/states';
import { SPECIALTIES } from '../../../utils/specialties';
import { LANGUAGES } from '../../../utils/languages';
import { COMMON_CERTIFICATIONS } from '../../../utils/certifications';
import type { Profile } from '../../../types/profile';
import { X } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  data: Partial<Profile>;
  onChange: (field: keyof Profile, value: any) => void;
  disabled?: boolean;
}

export function ProfessionalInfoSection({ data, onChange, disabled }: ProfessionalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Professional Information
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Professional Title
          </label>
          <input
            type="text"
            id="title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <input
            type="number"
            id="years_experience"
            min="0"
            value={data.years_experience || ''}
            onChange={(e) => onChange('years_experience', parseInt(e.target.value) || null)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="licensing_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Licensing State
          </label>
          <select
            id="licensing_state"
            value={data.licensing_state || ''}
            onChange={(e) => onChange('licensing_state', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          >
            <option value="">Select state...</option>
            {Object.entries(US_STATES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            License Number
          </label>
          <input
            type="text"
            id="license_number"
            value={data.license_number || ''}
            onChange={(e) => onChange('license_number', e.target.value)}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Certifications
          </label>
          <select
            id="certifications"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onChange('certifications', [...(data.certifications || []), e.target.value]);
              }
            }}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          >
            <option value="">Add certification...</option>
            {COMMON_CERTIFICATIONS.map(cert => (
              <option 
                key={cert} 
                value={cert}
                disabled={data.certifications?.includes(cert)}
              >
                {cert}
              </option>
            ))}
          </select>
          {data.certifications && data.certifications.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.certifications.map(cert => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                >
                  {cert}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onChange('certifications', data.certifications?.filter(c => c !== cert))}
                      className="p-0.5 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Specialties
          </label>
          <select
            id="specialties"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onChange('specialties', [...(data.specialties || []), e.target.value]);
              }
            }}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          >
            <option value="">Add specialty...</option>
            {SPECIALTIES.map(specialty => (
              <option 
                key={specialty} 
                value={specialty}
                disabled={data.specialties?.includes(specialty)}
              >
                {specialty}
              </option>
            ))}
          </select>
          {data.specialties && data.specialties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                >
                  {specialty}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onChange('specialties', data.specialties?.filter(s => s !== specialty))}
                      className="p-0.5 hover:text-green-900 dark:hover:text-green-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="languages_spoken" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Languages Spoken
          </label>
          <select
            id="languages_spoken"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                onChange('languages_spoken', [...(data.languages_spoken || []), e.target.value]);
              }
            }}
            disabled={disabled}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          >
            <option value="">Add language...</option>
            {LANGUAGES.map(language => (
              <option 
                key={language} 
                value={language}
                disabled={data.languages_spoken?.includes(language)}
              >
                {language}
              </option>
            ))}
          </select>
          {data.languages_spoken && data.languages_spoken.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.languages_spoken.map(language => (
                <span
                  key={language}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                >
                  {language}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => onChange('languages_spoken', data.languages_spoken?.filter(l => l !== language))}
                      className="p-0.5 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Professional Bio
          </label>
          <textarea
            id="bio"
            value={data.bio || ''}
            onChange={(e) => onChange('bio', e.target.value)}
            disabled={disabled}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
}