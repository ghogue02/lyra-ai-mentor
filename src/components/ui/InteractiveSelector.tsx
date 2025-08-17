import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  description?: string;
  value?: number;
}

interface InteractiveSelectorProps {
  title: string;
  options: Option[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  variant?: 'grid' | 'list';
  className?: string;
}

export const InteractiveSelector: React.FC<InteractiveSelectorProps> = ({
  title,
  options,
  selectedIds,
  onSelect,
  multiSelect = false,
  variant = 'list',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-semibold text-lg">{title}</h4>
      <div className={variant === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3' : 'space-y-3'}>
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`w-full h-auto justify-start p-4 text-left ${
                  variant === 'list' ? 'min-h-[80px]' : 'min-h-[100px]'
                }`}
                onClick={() => onSelect(option.id)}
              >
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`font-medium text-base text-left ${isSelected ? 'text-white' : ''}`}>{option.label}</div>
                      {option.value && (
                        <Badge variant={isSelected ? "secondary" : "outline"} className="ml-2">
                          {option.value}h
                        </Badge>
                      )}
                    </div>
                    {option.description && (
                      <div className={`text-sm leading-relaxed text-left whitespace-normal ${
                        isSelected ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {option.description}
                      </div>
                    )}
                  </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

interface RatingGridProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  className?: string;
}

export const RatingGrid: React.FC<RatingGridProps> = ({
  title,
  value,
  onChange,
  max = 10,
  min = 1,
  className = ''
}) => {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{title}</span>
        <Badge variant="secondary" className="text-base px-3 py-1">{value}/{max}</Badge>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {values.map(val => (
          <button
            key={val}
            className={`h-12 rounded font-medium transition-colors ${
              value >= val 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => onChange(val)}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

interface ScenarioOption {
  id: string;
  name: string;
  description: string;
  data: any;
}

interface ScenarioSelectorProps {
  title: string;
  scenarios: ScenarioOption[];
  onSelect: (scenario: ScenarioOption) => void;
  className?: string;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  title,
  scenarios,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <motion.div
            key={scenario.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="w-full h-auto justify-start p-6 text-left"
              onClick={() => onSelect(scenario)}
            >
              <div className="w-full space-y-2">
                <div className="font-medium text-base text-left">{scenario.name}</div>
                <div className="text-sm text-muted-foreground leading-relaxed text-left whitespace-normal">
                  {scenario.description}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};