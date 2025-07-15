import React from 'react';
import { Card } from '@/components/ui/card';
import { Quote, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';

interface StoryIntegrationProps {
  characterId: string;
  showQuote?: boolean;
  showMetrics?: boolean;
  showImpact?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export const StoryIntegration: React.FC<StoryIntegrationProps> = ({
  characterId,
  showQuote = true,
  showMetrics = true,
  showImpact = true,
  variant = 'full',
  className = ''
}) => {
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  if (variant === 'minimal') {
    return (
      <div className={`text-sm text-gray-600 italic mb-4 ${className}`}>
        <Quote className="inline w-4 h-4 mr-1 text-purple-500" />
        {story.quote}
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <Card className={`p-4 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200 ${className}`}>
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: story.color }}
          >
            {story.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900">{story.name}</h4>
            <p className="text-sm text-gray-600">{story.role} at {story.organization}</p>
            {showQuote && (
              <p className="text-sm text-gray-700 italic mt-2">"{story.quote}"</p>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  // Full variant
  return (
    <Card className={`p-6 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: story.color }}
          >
            {story.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900">{story.name}</h3>
            <p className="text-sm text-gray-600">{story.role} at {story.organization}</p>
          </div>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        
        {/* Challenge & Transformation */}
        <div className="bg-white/50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Challenge:</span> {story.challenge}
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-medium">Transformation:</span> {story.transformation}
          </p>
        </div>
        
        {/* Quote */}
        {showQuote && (
          <div className="border-l-4 border-purple-400 pl-4 py-2">
            <Quote className="w-4 h-4 text-purple-400 mb-1" />
            <p className="text-sm text-gray-700 italic">{story.quote}</p>
          </div>
        )}
        
        {/* Metrics */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <Clock className="w-4 h-4 text-red-500 mb-1" />
              <p className="text-xs text-gray-600">Before</p>
              <p className="text-sm font-medium text-red-700">{story.timeMetrics.before}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
              <p className="text-xs text-gray-600">After</p>
              <p className="text-sm font-medium text-green-700">{story.timeMetrics.after}</p>
            </div>
          </div>
        )}
        
        {/* Impact */}
        {showImpact && (
          <div className="bg-purple-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-purple-900">Impact</p>
            <p className="text-sm text-purple-700">{story.impact}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// Story Badge for inline use
export const StoryBadge: React.FC<{ characterId: string }> = ({ characterId }) => {
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  return (
    <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full text-sm">
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: story.color }}
      >
        {story.name.split(' ').map(n => n[0]).join('')}
      </div>
      <span className="text-purple-700">{story.name}'s Method</span>
    </div>
  );
};