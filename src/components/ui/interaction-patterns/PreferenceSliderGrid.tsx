import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Sliders, 
  RotateCcw, 
  BarChart3, 
  Target,
  Eye,
  EyeOff,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  Info,
  TrendingUp
} from 'lucide-react';

// ================================
// TYPE DEFINITIONS
// ================================

export interface PreferenceSlider {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  defaultValue: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  color?: string;
  inversed?: boolean; // If true, lower values are "better"
  dependencies?: SliderDependency[];
  validation?: {
    min?: number;
    max?: number;
    customValidator?: (value: number, allValues: { [id: string]: number }) => string | null;
  };
  metadata?: {
    priority?: 'low' | 'medium' | 'high';
    impact?: 'low' | 'medium' | 'high';
    tags?: string[];
    helpText?: string;
  };
}

export interface SliderDependency {
  sliderId: string;
  relationship: 'increases' | 'decreases' | 'mirrors' | 'opposes';
  factor: number; // Multiplier for the relationship
  condition?: (value: number) => boolean;
}

export interface SliderPreset {
  id: string;
  name: string;
  description: string;
  values: { [sliderId: string]: number };
  tags?: string[];
}

export interface RadarChartData {
  category: string;
  value: number;
  fullMark: number;
  color: string;
}

export interface PreferenceSliderGridProps {
  title: string;
  description?: string;
  sliders: PreferenceSlider[];
  values: { [sliderId: string]: number };
  onValuesChange: (values: { [sliderId: string]: number }) => void;
  onComplete?: (finalValues: { [sliderId: string]: number }) => void;
  className?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  presets?: SliderPreset[];
  showRadarChart?: boolean;
  showRealTimeUpdates?: boolean;
  gridColumns?: 1 | 2 | 3;
  enableDependencies?: boolean;
  enablePresets?: boolean;
  enableExportImport?: boolean;
  showValidation?: boolean;
  compactMode?: boolean;
}

// ================================
// THEME CONFIGURATION
// ================================

const themeColors = {
  carmen: {
    primary: 'bg-purple-600',
    primaryText: 'text-purple-700',
    secondary: 'bg-purple-50 border-purple-200',
    accent: 'border-purple-400',
    slider: 'accent-purple-600',
    gradient: 'from-purple-100 to-cyan-100'
  },
  sofia: {
    primary: 'bg-rose-600',
    primaryText: 'text-rose-700',
    secondary: 'bg-rose-50 border-rose-200',
    accent: 'border-rose-400',
    slider: 'accent-rose-600',
    gradient: 'from-rose-100 to-purple-100'
  },
  alex: {
    primary: 'bg-blue-600',
    primaryText: 'text-blue-700',
    secondary: 'bg-blue-50 border-blue-200',
    accent: 'border-blue-400',
    slider: 'accent-blue-600',
    gradient: 'from-blue-100 to-indigo-100'
  },
  maya: {
    primary: 'bg-green-600',
    primaryText: 'text-green-700',
    secondary: 'bg-green-50 border-green-200',
    accent: 'border-green-400',
    slider: 'accent-green-600',
    gradient: 'from-green-100 to-teal-100'
  },
  default: {
    primary: 'bg-gray-600',
    primaryText: 'text-gray-700',
    secondary: 'bg-gray-50 border-gray-200',
    accent: 'border-gray-400',
    slider: 'accent-gray-600',
    gradient: 'from-gray-100 to-gray-200'
  }
};

// ================================
// UTILITY FUNCTIONS
// ================================

const getSliderColorClass = (slider: PreferenceSlider, value: number): string => {
  if (slider.color) return slider.color;
  
  const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
  
  if (slider.inversed) {
    if (percentage <= 33) return 'accent-green-500';
    if (percentage <= 66) return 'accent-yellow-500';
    return 'accent-red-500';
  } else {
    if (percentage <= 33) return 'accent-red-500';
    if (percentage <= 66) return 'accent-yellow-500';
    return 'accent-green-500';
  }
};

// ================================
// MAIN COMPONENT
// ================================

export const PreferenceSliderGrid: React.FC<PreferenceSliderGridProps> = ({
  title,
  description,
  sliders,
  values,
  onValuesChange,
  onComplete,
  className,
  characterTheme = 'default',
  presets = [],
  showRadarChart = false,
  showRealTimeUpdates = true,
  gridColumns = 2,
  enableDependencies = true,
  enablePresets = true,
  enableExportImport = false,
  showValidation = true,
  compactMode = false
}) => {
  const [hoveredSliderId, setHoveredSliderId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(showRadarChart);
  const [validationErrors, setValidationErrors] = useState<{ [sliderId: string]: string }>({});
  const [isCompact, setIsCompact] = useState(compactMode);

  const theme = themeColors[characterTheme];

  // Apply dependencies when values change
  useEffect(() => {
    if (!enableDependencies) return;
    
    const newValues = { ...values };
    let hasChanges = false;
    
    sliders.forEach(slider => {
      if (!slider.dependencies) return;
      
      slider.dependencies.forEach(dep => {
        const depValue = values[dep.sliderId];
        if (depValue === undefined) return;
        
        if (dep.condition && !dep.condition(depValue)) return;
        
        let newValue = newValues[slider.id];
        
        switch (dep.relationship) {
          case 'increases':
            newValue = Math.min(slider.max, newValue + (depValue * dep.factor));
            break;
          case 'decreases':
            newValue = Math.max(slider.min, newValue - (depValue * dep.factor));
            break;
          case 'mirrors':
            newValue = depValue * dep.factor;
            break;
          case 'opposes':
            newValue = slider.max - (depValue * dep.factor);
            break;
        }
        
        // Clamp to slider bounds
        newValue = Math.max(slider.min, Math.min(slider.max, newValue));
        
        if (Math.abs(newValues[slider.id] - newValue) > 0.01) {
          newValues[slider.id] = newValue;
          hasChanges = true;
        }
      });
    });
    
    if (hasChanges) {
      onValuesChange(newValues);
    }
  }, [values, sliders, enableDependencies, onValuesChange]);

  // Validate values
  useEffect(() => {
    if (!showValidation) return;
    
    const errors: { [sliderId: string]: string } = {};
    
    sliders.forEach(slider => {
      const value = values[slider.id];
      if (value === undefined) return;
      
      if (slider.validation) {
        const { validation } = slider;
        
        if (validation.min !== undefined && value < validation.min) {
          errors[slider.id] = `Value must be at least ${validation.min}`;
        }
        
        if (validation.max !== undefined && value > validation.max) {
          errors[slider.id] = `Value must be at most ${validation.max}`;
        }
        
        if (validation.customValidator) {
          const error = validation.customValidator(value, values);
          if (error) {
            errors[slider.id] = error;
          }
        }
      }
    });
    
    setValidationErrors(errors);
  }, [values, sliders, showValidation]);

  // Handle slider value change
  const handleSliderChange = useCallback((sliderId: string, value: number) => {
    const newValues = { ...values, [sliderId]: value };
    onValuesChange(newValues);
  }, [values, onValuesChange]);

  // Reset all sliders to default
  const handleReset = useCallback(() => {
    const defaultValues: { [id: string]: number } = {};
    sliders.forEach(slider => {
      defaultValues[slider.id] = slider.defaultValue;
    });
    onValuesChange(defaultValues);
  }, [sliders, onValuesChange]);

  // Apply preset
  const applyPreset = useCallback((preset: SliderPreset) => {
    const newValues = { ...values };
    Object.entries(preset.values).forEach(([sliderId, value]) => {
      if (sliders.find(s => s.id === sliderId)) {
        newValues[sliderId] = value;
      }
    });
    onValuesChange(newValues);
  }, [values, sliders, onValuesChange]);

  // Export/Import functions
  const exportValues = useCallback(() => {
    const data = {
      title,
      timestamp: new Date().toISOString(),
      values
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-preferences.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [title, values]);

  const importValues = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.values) {
          onValuesChange(data.values);
        }
      } catch (error) {
        console.error('Failed to import values:', error);
      }
    };
    reader.readAsText(file);
  }, [onValuesChange]);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (!showChart) return [];
    
    return sliders.map(slider => ({
      category: slider.label,
      value: values[slider.id] || slider.defaultValue,
      fullMark: slider.max,
      color: slider.color || '#8884d8'
    }));
  }, [sliders, values, showChart]);

  // ================================
  // RENDER FUNCTIONS
  // ================================

  const renderSlider = (slider: PreferenceSlider) => {
    const value = values[slider.id] || slider.defaultValue;
    const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
    const hasError = validationErrors[slider.id];
    const isHovered = hoveredSliderId === slider.id;
    
    return (
      <motion.div
        key={slider.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-200',
          hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white',
          isHovered && 'shadow-md border-purple-300'
        )}
        onMouseEnter={() => setHoveredSliderId(slider.id)}
        onMouseLeave={() => setHoveredSliderId(null)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {slider.icon && <span className="text-lg">{slider.icon}</span>}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 leading-tight">
                {slider.label}
              </h4>
              {slider.category && !isCompact && (
                <Badge variant="outline" className="text-xs mt-1">
                  {slider.category}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="text-sm font-mono">
              {value.toFixed(slider.step < 1 ? 1 : 0)}{slider.unit}
            </Badge>
            {slider.metadata?.priority && (
              <Badge 
                variant={slider.metadata.priority === 'high' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {slider.metadata.priority}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {slider.description && !isCompact && (
          <p className="text-sm text-gray-600 mb-3">{slider.description}</p>
        )}

        {/* Slider */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={value}
              onChange={(e) => handleSliderChange(slider.id, Number(e.target.value))}
              className={cn(
                'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
                getSliderColorClass(slider, value)
              )}
            />
            
            {/* Value indicator */}
            <div 
              className="absolute top-0 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg pointer-events-none"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Labels */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>{slider.minLabel || slider.min}</span>
            <span>{slider.maxLabel || slider.max}</span>
          </div>
        </div>

        {/* Validation Error */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700"
          >
            {hasError}
          </motion.div>
        )}

        {/* Help Text */}
        {slider.metadata?.helpText && isHovered && !isCompact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700"
          >
            <Info className="w-3 h-3 inline mr-1" />
            {slider.metadata.helpText}
          </motion.div>
        )}

        {/* Dependencies visualization */}
        {enableDependencies && slider.dependencies && slider.dependencies.length > 0 && !isCompact && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Dependencies:</h5>
            <div className="space-y-1">
              {slider.dependencies.map((dep, index) => {
                const depSlider = sliders.find(s => s.id === dep.sliderId);
                if (!depSlider) return null;
                
                return (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="capitalize">{dep.relationship}</span>
                    <span>with</span>
                    <span className="font-medium">{depSlider.label}</span>
                    <span>×{dep.factor}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderRadarChart = () => {
    if (!showChart || radarData.length === 0) return null;
    
    // Simple radar chart representation
    const angleStep = (2 * Math.PI) / radarData.length;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    const points = radarData.map((item, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const value = (item.value / item.fullMark) * radius;
      const x = centerX + Math.cos(angle) * value;
      const y = centerY + Math.sin(angle) * value;
      return { x, y, label: item.category, value: item.value };
    });
    
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Preferences Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm mx-auto">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Grid circles */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map(scale => (
                <circle
                  key={scale}
                  cx={centerX}
                  cy={centerY}
                  r={radius * scale}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Grid lines */}
              {radarData.map((_, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                return (
                  <line
                    key={index}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Data area */}
              <path
                d={pathData}
                fill="rgba(147, 51, 234, 0.2)"
                stroke="#9333ea"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#9333ea"
                />
              ))}
              
              {/* Labels */}
              {radarData.map((item, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const labelRadius = radius + 20;
                const x = centerX + Math.cos(angle) * labelRadius;
                const y = centerY + Math.sin(angle) * labelRadius;
                return (
                  <text
                    key={index}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-600"
                  >
                    {item.category}
                  </text>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPresets = () => {
    if (!enablePresets || presets.length === 0) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presets.map(preset => (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => applyPreset(preset)}
                className="p-4 h-auto text-left justify-start"
              >
                <div>
                  <h4 className="font-semibold">{preset.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                  {preset.tags && (
                    <div className="flex gap-1 mt-2">
                      {preset.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  // ================================
  // MAIN RENDER
  // ================================

  return (
    <Card className={cn('w-full nm-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            {title}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="text-xs"
            >
              {showChart ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              Chart
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompact(!isCompact)}
              className="text-xs"
            >
              {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              {isCompact ? 'Expand' : 'Compact'}
            </Button>
            
            {enableExportImport && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportValues}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                
                <label className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <span>
                      <Upload className="w-3 h-3 mr-1" />
                      Import
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importValues}
                    className="hidden"
                  />
                </label>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardTitle>
        
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{sliders.length} preferences to configure</span>
          {showRealTimeUpdates && (
            <span>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Real-time updates enabled
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderRadarChart()}
        {renderPresets()}
        
        {/* Sliders Grid */}
        <div className={cn('grid gap-4', gridColsClass[gridColumns])}>
          {sliders.map(renderSlider)}
        </div>
        
        {/* Summary */}
        {showRealTimeUpdates && (
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Current Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {sliders.slice(0, 6).map(slider => (
                  <div key={slider.id} className="flex justify-between">
                    <span className="text-gray-600">{slider.label}:</span>
                    <span className="font-medium">
                      {(values[slider.id] || slider.defaultValue).toFixed(slider.step < 1 ? 1 : 0)}
                      {slider.unit}
                    </span>
                  </div>
                ))}
              </div>
              {sliders.length > 6 && (
                <p className="text-xs text-gray-500 mt-2">
                  + {sliders.length - 6} more preferences configured
                </p>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Completion Action */}
        {onComplete && (
          <div className="text-center pt-6 border-t">
            <Button
              onClick={() => onComplete(values)}
              className={cn('px-8 py-3', theme.primary)}
            >
              <Target className="w-4 h-4 mr-2" />
              Apply Preferences
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreferenceSliderGrid;