import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  onInsert: () => void;
  disabled?: boolean;
  insertOnly?: boolean;
  tooltip?: string;
  hideInsert?: boolean;
}

export function ToggleButton({ 
  label, 
  isSelected, 
  onToggle, 
  onInsert,
  disabled,
  insertOnly,
  tooltip,
  hideInsert
}: ToggleButtonProps) {
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled || insertOnly}
        className={cn(
          "flex-1 px-3 py-2 text-sm text-left transition-all relative",
          hideInsert ? "rounded-lg" : "rounded-l-lg border-r-0",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          isSelected
            ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
          (disabled || insertOnly) && "opacity-50 cursor-not-allowed"
        )}
        title={tooltip}
      >
        {label}
        {isSelected && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600">
            ✓
          </span>
        )}
        {tooltip && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {tooltip}
          </span>
        )}
      </button>
      {!hideInsert && <button
        type="button"
        onClick={onInsert}
        disabled={disabled}
        className={cn(
          "px-3 transition-all flex-shrink-0 hover:scale-110 bg-white",
          "rounded-r-lg border border-l-0",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "text-gray-600 hover:bg-gray-50 border-gray-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        title="Quick add at cursor position"
      >
        <Plus className="w-4 h-4" />
      </button>
      }
    </div>
  );
}