import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface OptionItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  tags?: string[];
  recommended?: boolean;
}

export interface VisualOptionGridProps {
  title: string;
  description?: string;
  options: OptionItem[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  maxSelections?: number;
  showCategories?: boolean;
  enableCustom?: boolean;
  customPlaceholder?: string;
  onCustomAdd?: (customText: string) => void;
  className?: string;
  gridCols?: 2 | 3 | 4;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
}

const themeColors = {
  carmen: {
    primary: 'border-orange-500 bg-orange-50 text-orange-700',
    secondary: 'border-orange-200 hover:border-orange-300',
    selected: 'border-orange-600 bg-orange-100',
    badge: 'bg-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700'
  },
  sofia: {
    primary: 'border-rose-500 bg-rose-50 text-rose-700',
    secondary: 'border-rose-200 hover:border-rose-300', 
    selected: 'border-rose-600 bg-rose-100',
    badge: 'bg-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700'
  },
  alex: {
    primary: 'border-blue-500 bg-blue-50 text-blue-700',
    secondary: 'border-blue-200 hover:border-blue-300',
    selected: 'border-blue-600 bg-blue-100',
    badge: 'bg-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  maya: {
    primary: 'border-green-500 bg-green-50 text-green-700',
    secondary: 'border-green-200 hover:border-green-300',
    selected: 'border-green-600 bg-green-100',
    badge: 'bg-green-600',
    button: 'bg-green-600 hover:bg-green-700'
  },
  default: {
    primary: 'border-gray-500 bg-gray-50 text-gray-700',
    secondary: 'border-gray-200 hover:border-gray-300',
    selected: 'border-gray-600 bg-gray-100',
    badge: 'bg-gray-600',
    button: 'bg-gray-600 hover:bg-gray-700'
  }
};

export const VisualOptionGrid: React.FC<VisualOptionGridProps> = ({
  title,
  description,
  options,
  selectedIds,
  onSelectionChange,
  multiSelect = true,
  maxSelections,
  showCategories = false,
  enableCustom = false,
  customPlaceholder = "Add your own...",
  onCustomAdd,
  className,
  gridCols = 2,
  characterTheme = 'default'
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const theme = themeColors[characterTheme];

  const handleOptionClick = (optionId: string) => {
    if (!multiSelect) {
      onSelectionChange([optionId]);
      return;
    }

    let newSelection: string[];
    if (selectedIds.includes(optionId)) {
      newSelection = selectedIds.filter(id => id !== optionId);
    } else {
      if (maxSelections && selectedIds.length >= maxSelections) {
        return; // Don't allow more selections
      }
      newSelection = [...selectedIds, optionId];
    }
    
    onSelectionChange(newSelection);
  };

  const handleCustomAdd = () => {
    if (customText.trim() && onCustomAdd) {
      onCustomAdd(customText.trim());
      setCustomText('');
      setShowCustomInput(false);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Group options by category if needed
  const categorizedOptions = showCategories
    ? options.reduce((acc, option) => {
        const category = option.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(option);
        return acc;
      }, {} as Record<string, OptionItem[]>)
    : { 'All Options': options };

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
          
          {/* Selection Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <Badge variant="secondary">
                  {selectedIds.length} selected
                  {maxSelections && ` of ${maxSelections}`}
                </Badge>
              )}
              
              {multiSelect && maxSelections && selectedIds.length >= maxSelections && (
                <Badge variant="destructive" className="text-xs">
                  Maximum reached
                </Badge>
              )}
            </div>
            
            {selectedIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="text-xs text-gray-500"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className="space-y-6">
          {Object.entries(categorizedOptions).map(([category, categoryOptions]) => (
            <div key={category}>
              {/* Category Header (if showing categories) */}
              {showCategories && Object.keys(categorizedOptions).length > 1 && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-2 p-0 h-auto font-semibold text-gray-700"
                  >
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {category}
                    <Badge variant="outline" className="ml-2">
                      {categoryOptions.length}
                    </Badge>
                  </Button>
                </div>
              )}

              <AnimatePresence>
                {(!showCategories || expandedCategories.has(category) || Object.keys(categorizedOptions).length === 1) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('grid gap-3', gridColsClass[gridCols])}
                  >
                    {categoryOptions.map((option, index) => {
                      const isSelected = selectedIds.includes(option.id);
                      const isDisabled = !multiSelect && selectedIds.length > 0 && !isSelected;
                      const isMaxedOut = multiSelect && maxSelections && selectedIds.length >= maxSelections && !isSelected;

                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleOptionClick(option.id)}
                          disabled={isDisabled || isMaxedOut}
                          className={cn(
                            'relative p-4 rounded-lg border-2 text-left transition-all duration-200',
                            'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                            isSelected ? theme.selected : theme.secondary,
                            (isDisabled || isMaxedOut) && 'opacity-50 cursor-not-allowed',
                            'group'
                          )}
                        >
                          {/* Selection Indicator */}
                          <div className="absolute top-3 right-3">
                            <motion.div
                              className={cn(
                                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                isSelected ? theme.badge + ' border-transparent text-white' : 'border-gray-300'
                              )}
                              initial={false}
                              animate={{ scale: isSelected ? 1.1 : 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </motion.div>
                          </div>

                          {/* Option Content */}
                          <div className="pr-8">
                            {option.icon && (
                              <div className="mb-2 text-xl">
                                {option.icon}
                              </div>
                            )}
                            
                            <div className="flex items-start gap-2 mb-2">
                              <h4 className="font-semibold text-sm text-gray-900 group-hover:text-gray-700">
                                {option.label}
                              </h4>
                              {option.recommended && (
                                <Badge variant="secondary" className="text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            
                            {option.description && (
                              <p className="text-xs text-gray-600 mb-2">
                                {option.description}
                              </p>
                            )}
                            
                            {option.tags && option.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {option.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Custom Option */}
        {enableCustom && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {!showCustomInput ? (
              <Button
                variant="outline"
                onClick={() => setShowCustomInput(true)}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                {customPlaceholder}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter your custom option..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomAdd()}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleCustomAdd}
                    disabled={!customText.trim()}
                    className={theme.button}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualOptionGrid;