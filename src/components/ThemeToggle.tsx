import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { Tooltip } from './Tooltip';

export function ThemeToggle() {
  const { settings, updateSettings } = useSettings();
  const isDark = settings?.theme === 'dark';

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    await updateSettings({ theme: newTheme });
  };

  return (
    <Tooltip content={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <button
        onClick={toggleTheme}
        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </Tooltip>
  );
}