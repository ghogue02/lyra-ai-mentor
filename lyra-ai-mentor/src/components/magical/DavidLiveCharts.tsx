import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  target?: number;
}

interface DavidLiveChartsProps {
  template: string;
  animationSpeed?: number;
  showComparison?: boolean;
}

export const DavidLiveCharts: React.FC<DavidLiveChartsProps> = ({
  template,
  animationSpeed = 1000,
  showComparison = false
}) => {
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample data based on template type
  const getTemplateData = () => {
    switch (template) {
      case 'The Transformation Journey':
        return [
          { name: 'Baseline', value: 30, target: 85 },
          { name: 'Month 1', value: 35, target: 85 },
          { name: 'Month 2', value: 45, target: 85 },
          { name: 'Month 3', value: 60, target: 85 },
          { name: 'Month 4', value: 75, target: 85 },
          { name: 'Month 5', value: 85, target: 85 }
        ];
      case 'The Comparison Revelation':
        return [
          { name: 'Our Program', value: 95, industry: 60 },
          { name: 'Industry Avg', value: 60, industry: 60 },
          { name: 'Difference', value: 35, industry: 0 }
        ];
      case 'The Hidden Pattern':
        return [
          { name: 'Weekday', value: 65, weekend: 90 },
          { name: 'Weekend', value: 90, weekend: 90 },
          { name: 'Improvement', value: 25, weekend: 0 }
        ];
      default:
        return [
          { name: 'Before', value: 40 },
          { name: 'After', value: 85 }
        ];
    }
  };

  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const fullData = getTemplateData();

  useEffect(() => {
    // Reset when template changes
    setCurrentDataIndex(0);
    setChartData([]);
    setIsAnimating(false);
  }, [template]);

  const animateChart = () => {
    if (isAnimating || currentDataIndex >= fullData.length) return;
    
    setIsAnimating(true);
    
    const interval = setInterval(() => {
      setCurrentDataIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex <= fullData.length) {
          setChartData(fullData.slice(0, nextIndex));
        }
        
        if (nextIndex >= fullData.length) {
          clearInterval(interval);
          setIsAnimating(false);
        }
        
        return nextIndex;
      });
    }, animationSpeed);
  };

  const resetAnimation = () => {
    setCurrentDataIndex(0);
    setChartData([]);
    setIsAnimating(false);
  };

  const getChartTitle = () => {
    switch (template) {
      case 'The Transformation Journey':
        return 'Employment Rate Transformation';
      case 'The Comparison Revelation':
        return 'Program Retention Comparison';
      case 'The Hidden Pattern':
        return 'Success Rate by Schedule';
      default:
        return 'Data Story Visualization';
    }
  };

  const getInsight = () => {
    switch (template) {
      case 'The Transformation Journey':
        return `${currentDataIndex > 0 ? `Month ${currentDataIndex - 1}: ` : ''}${chartData.length > 0 ? `${chartData[chartData.length - 1]?.value || 0}% employment rate` : 'Starting baseline measurement'}`;
      case 'The Comparison Revelation':
        return `Our ${chartData.length > 0 ? chartData[0]?.value || 0 : 0}% retention vs ${chartData.length > 1 ? chartData[1]?.value || 0 : 0}% industry average`;
      case 'The Hidden Pattern':
        return `Weekend programs show ${chartData.length > 1 ? `${(chartData[1]?.value || 0) - (chartData[0]?.value || 0)}% higher` : 'improved'} success rates`;
      default:
        return 'Data reveals the story of transformation';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-700">
          📊 {getChartTitle()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={animateChart}
            disabled={isAnimating}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isAnimating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isAnimating ? 'Animating...' : 'Animate Story'}
          </button>
          <button
            onClick={resetAnimation}
            className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {template === 'The Transformation Journey' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#059669' }}
                />
                {showComparison && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#6b7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#10b981" />
                {template === 'The Comparison Revelation' && (
                  <Bar dataKey="industry" fill="#94a3b8" />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Live Insight</span>
        </div>
        <p className="text-green-800 font-medium">
          {getInsight()}
        </p>
        
        {chartData.length > 0 && (
          <div className="mt-3 text-xs text-green-600">
            Data points revealed: {chartData.length} of {fullData.length}
            {isAnimating && <span className="ml-2">🔄 Animating...</span>}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-green-600">
        <span>David's Data Storytelling Magic ✨</span>
        <span>{Math.round((chartData.length / fullData.length) * 100)}% story revealed</span>
      </div>
    </div>
  );
};