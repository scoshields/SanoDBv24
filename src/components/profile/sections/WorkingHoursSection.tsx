import React from 'react';
import type { WorkingHours } from '../../../types/profile';

const DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
] as const;

interface WorkingHoursSectionProps {
  value: WorkingHours | null;
  onChange: (hours: WorkingHours) => void;
  disabled?: boolean;
}

export function WorkingHoursSection({ value, onChange, disabled }: WorkingHoursSectionProps) {
  const handleTimeChange = (day: keyof WorkingHours, field: 'start' | 'end', time: string) => {
    const newHours = { ...value } as WorkingHours;
    if (!newHours[day]) {
      newHours[day] = { start: '', end: '' };
    }
    newHours[day][field] = time;
    onChange(newHours);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Working Hours
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Set your typical working hours for each day. Leave empty for days you don't work.
      </p>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="space-y-4">
          {DAYS.map(({ id, label }) => (
            <div key={id} className="flex items-center gap-4">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={value?.[id]?.start || ''}
                  onChange={(e) => handleTimeChange(id, 'start', e.target.value)}
                  disabled={disabled}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="time"
                  value={value?.[id]?.end || ''}
                  onChange={(e) => handleTimeChange(id, 'end', e.target.value)}
                  disabled={disabled}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        * All times are in your local timezone
      </p>
    </div>
  );
}