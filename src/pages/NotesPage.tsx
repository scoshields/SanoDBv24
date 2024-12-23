import React from 'react';
import { MainApp } from '../components/MainApp';

export function NotesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Clinical Notes</h1>
      <MainApp />
    </div>
  );
}