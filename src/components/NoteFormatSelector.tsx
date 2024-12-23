import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NOTE_FORMATS } from '../utils/noteFormats/formats';
import type { NoteFormatType } from '../utils/noteFormats/types';
import { ToggleButton } from './ToggleButton';

interface NoteFormatSelectorProps {
  value: NoteFormatType;
  onChange: (format: NoteFormatType) => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  disabled?: boolean;
}

export function NoteFormatSelector({ 
  value, 
  onChange, 
  isExpanded,
  onExpandedChange,
  disabled 
}: NoteFormatSelectorProps) {
  const selectedFormat = NOTE_FORMATS[value];

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => onExpandedChange(!isExpanded)}
        className="w-full flex items-center justify-between text-left bg-white p-4"
        type="button"
      >
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">
            Note Format
          </h3>
          <p className="text-sm text-gray-500">
            Select the format for your clinical documentation
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0" />
        )}
      </button>

      {selectedFormat && !isExpanded && (
        <div className="px-4 pt-3 pb-0 flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-sm">
            {selectedFormat.label}
          </div>
        </div>
      )}
      {isExpanded && <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(NOTE_FORMATS).map((format) => (
            <ToggleButton
              key={format.id}
              label={format.label}
              isSelected={value === format.id}
              onToggle={() => onChange(format.id)}
              onInsert={() => {}}
              disabled={disabled}
              tooltip={format.description}
              hideInsert
            />
          ))}
        </div>
      </div>}
    </div>
  );
}