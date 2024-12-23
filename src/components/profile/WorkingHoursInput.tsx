import React from 'react';
import type { WorkingHours } from '../../types/profile';

interface WorkingHoursInputProps {
  value: WorkingHours | null;
  onChange: (hours: WorkingHours) => void;
  disabled?: boolean;
}

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export function WorkingHoursInput({ value, onChange, disabled }: WorkingHoursInputProps) {
  const handleTimeChange = (day: keyof WorkingHours, field: 'start' | 'end', time: string) => {
    const newHours = { ...value } as WorkingHours;
    if (!newHours[day]) {
      newHours[day] = { start: '', end: '' };
    }
    newHours[day]![field] = time;
    onChange(newHours);
  };

  return (
    <div className="space-y-4">
      {DAYS.map((day) => (
        <div key={day} className="flex items-center gap-4">
          <div className="w-28">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {day}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={value?.[day]?.start || ''}
              onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
              disabled={disabled}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="time"
              value={value?.[day]?.end || ''}
              onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
              disabled={disabled}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
            />
          </div>
        </div>
      ))}
    </div>
  );
}