import React from 'react';
import { 
  FileText, 
  Brain, 
  AlertCircle, 
  Eye, 
  MessageCircle, 
  ArrowRight 
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SectionButtonProps {
  section: 'format' | 'therapy' | 'concerns' | 'observations' | 'response' | 'plans';
  isActive: boolean;
  count?: number;
  onClick: () => void;
  disabled?: boolean;
}

const SECTION_ICONS = {
  format: FileText,
  therapy: Brain,
  concerns: AlertCircle,
  observations: Eye,
  response: MessageCircle,
  plans: ArrowRight
};

const SECTION_LABELS = {
  format: 'Note Format',
  therapy: 'Therapy',
  concerns: 'Concerns',
  observations: 'Observations',
  response: 'Response',
  plans: 'Plans'
};

export function SectionButton({ section, isActive, count, onClick, disabled }: SectionButtonProps) {
  const Icon = SECTION_ICONS[section];
  const label = SECTION_LABELS[section];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "relative group hover:scale-105 hover:rotate-3",
        isActive
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
        {label}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
      </span>
    </button>
  );
}