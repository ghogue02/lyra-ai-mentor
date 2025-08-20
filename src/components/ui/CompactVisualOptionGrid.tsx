import React from 'react';
import { cn } from '@/lib/utils';
import { getCarmenManagementIconUrl } from '@/utils/supabaseIcons';

export interface CompactOptionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  recommended?: boolean;
}

interface CompactVisualOptionGridProps {
  title: string;
  options: CompactOptionItem[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  maxSelections?: number;
  className?: string;
}

export const CompactVisualOptionGrid: React.FC<CompactVisualOptionGridProps> = ({
  title,
  options,
  selectedIds,
  onSelectionChange,
  multiSelect = false,
  maxSelections = 3,
  className
}) => {
  const handleOptionClick = (optionId: string) => {
    if (!multiSelect) {
      onSelectionChange([optionId]);
      return;
    }

    if (selectedIds.includes(optionId)) {
      onSelectionChange(selectedIds.filter(id => id !== optionId));
    } else if (selectedIds.length < maxSelections) {
      onSelectionChange([...selectedIds, optionId]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-900">{title}</h3>
        {multiSelect && (
          <span className="text-xs text-gray-500">
            {selectedIds.length}/{maxSelections}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.slice(0, 8).map((option) => {
          const isSelected = selectedIds.includes(option.id);
          const isDisabled = multiSelect && !isSelected && selectedIds.length >= maxSelections;
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isDisabled}
              className={cn(
                "relative p-3 rounded-lg border-2 text-left transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected 
                  ? "border-purple-400 bg-purple-50 shadow-sm" 
                  : "border-gray-200 bg-white hover:border-gray-300",
                isDisabled && "opacity-50 cursor-not-allowed",
                option.recommended && !isSelected && "ring-1 ring-purple-200"
              )}
            >
              {option.recommended && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full" />
              )}
              
              <div className="flex items-start gap-2">
                {option.icon && (
                  <img 
                    src={getCarmenManagementIconUrl(option.icon)} 
                    alt="" 
                    className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-gray-900 leading-tight">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-gray-600 mt-1 leading-tight line-clamp-2">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};