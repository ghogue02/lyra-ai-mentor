import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CompactSlider {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  minLabel: string;
  maxLabel: string;
  category: 'Core' | 'Sourcing' | 'Constraints';
}

interface SliderPreset {
  id: string;
  name: string;
  values: { [sliderId: string]: number };
  tags: string[];
}

interface CompactPreferenceSlidersProps {
  sliders: CompactSlider[];
  values: { [sliderId: string]: number };
  onValuesChange: (values: { [sliderId: string]: number }) => void;
  presets: SliderPreset[];
  className?: string;
}

export const CompactPreferenceSliders: React.FC<CompactPreferenceSlidersProps> = ({
  sliders,
  values,
  onValuesChange,
  presets,
  className
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Core']));
  const [showPresets, setShowPresets] = useState(false);

  const categories = ['Core', 'Sourcing', 'Constraints'] as const;
  
  const categorizedSliders = categories.reduce((acc, category) => {
    acc[category] = sliders.filter(slider => slider.category === category);
    return acc;
  }, {} as Record<string, CompactSlider[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSliderChange = (sliderId: string, value: number) => {
    onValuesChange({ ...values, [sliderId]: value });
  };

  const applyPreset = (preset: SliderPreset) => {
    onValuesChange({ ...values, ...preset.values });
    setShowPresets(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Core': return '🎯';
      case 'Sourcing': return '🌐';
      case 'Constraints': return '⚖️';
      default: return '📊';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Presets */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-sm">Quick Presets</span>
          {showPresets ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {showPresets && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                variant="outline"
                size="sm"
                className="h-auto p-2 text-left"
              >
                <div>
                  <div className="font-medium text-xs">{preset.name}</div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                    {preset.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-gray-200 px-1 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Categorized Sliders */}
      {categories.map((category) => {
        const categorySliders = categorizedSliders[category];
        const isExpanded = expandedCategories.has(category);
        
        if (categorySliders.length === 0) return null;

        return (
          <div key={category} className="border rounded-lg">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getCategoryIcon(category)}</span>
                <span className="font-medium text-sm">{category}</span>
                <span className="text-xs text-gray-500">
                  ({categorySliders.length} preferences)
                </span>
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {isExpanded && (
              <div className="px-3 pb-3 space-y-3 border-t">
                {categorySliders.map((slider) => {
                  const currentValue = values[slider.id] ?? slider.value;
                  
                  return (
                    <div key={slider.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          {slider.label}
                        </label>
                        <span className="text-sm text-gray-600 font-mono">
                          {currentValue.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min={slider.min}
                          max={slider.max}
                          step={0.5}
                          value={currentValue}
                          onChange={(e) => handleSliderChange(slider.id, parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{slider.minLabel}</span>
                          <span>{slider.maxLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// CSS for slider styling
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: none;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}