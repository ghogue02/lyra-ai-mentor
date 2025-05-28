
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  label: string;
  value: number;
  color: string;
  detail: string;
}

interface AnimatedProgressChartProps {
  title: string;
  items: ProgressItem[];
  isVisible: boolean;
  onComplete?: () => void;
}

export const AnimatedProgressChart: React.FC<AnimatedProgressChartProps> = ({
  title,
  items,
  isVisible,
  onComplete
}) => {
  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [currentValues, setCurrentValues] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setVisibleItems(0);
      setCurrentValues([]);
      return;
    }

    const animateChart = async () => {
      // Show items one by one
      for (let i = 0; i < items.length; i++) {
        setVisibleItems(i + 1);
        
        // Animate progress bar fill
        const targetValue = items[i].value;
        const steps = 20;
        const increment = targetValue / steps;
        
        for (let step = 0; step <= steps; step++) {
          const value = Math.min(step * increment, targetValue);
          setCurrentValues(prev => {
            const newValues = [...prev];
            newValues[i] = value;
            return newValues;
          });
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      onComplete?.();
    };

    animateChart();
  }, [isVisible, items, onComplete]);

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-slate-900 border-blue-500/30">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-blue-300 font-semibold">{title}</span>
      </div>
      
      <div className="space-y-4">
        {items.slice(0, visibleItems).map((item, index) => (
          <div 
            key={index}
            className="space-y-2 opacity-0 animate-fade-in"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">{item.label}</span>
              <span className="text-blue-300 text-sm font-mono">
                {Math.round(currentValues[index] || 0)}%
              </span>
            </div>
            <Progress 
              value={currentValues[index] || 0} 
              className="h-2"
              style={{
                background: 'rgba(59, 130, 246, 0.1)'
              }}
            />
            <p className="text-gray-400 text-xs">{item.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
