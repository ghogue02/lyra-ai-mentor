
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollCompletion } from '@/hooks/useScrollCompletion';
import { InteractiveEngagement } from './InteractiveEngagement';

interface ContentBlock {
  id: number;
  type: string;
  title: string;
  content: string;
  metadata: any;
  order_index: number;
}

interface ContentBlockRendererProps {
  block: ContentBlock;
  isCompleted: boolean;
  onComplete: () => void;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
  isCompleted: initiallyCompleted,
  onComplete
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Use scroll completion for introduction and basic content blocks
  const shouldUseScrollCompletion = ['introduction', 'section'].includes(block.type);
  
  const { elementRef, isCompleted: scrollCompleted } = useScrollCompletion({
    threshold: 0.8,
    delay: shouldUseScrollCompletion ? 3000 : 0,
    onComplete: shouldUseScrollCompletion ? onComplete : undefined
  });

  // Determine completion state
  const isCompleted = initiallyCompleted || scrollCompleted || hasInteracted;

  // Handle interactive completion
  const handleInteraction = () => {
    setHasInteracted(true);
    if (!shouldUseScrollCompletion) {
      onComplete();
    }
  };

  // Get engagement type based on block type
  const getEngagementType = () => {
    switch (block.type) {
      case 'example':
        return 'understanding';
      case 'section':
        return 'insight';
      default:
        return null;
    }
  };

  const getBlockStyle = () => {
    switch (block.type) {
      case 'introduction':
        return 'border-l-2 border-l-purple-300 pl-6';
      case 'section':
        return 'border-l-2 border-l-blue-300 pl-6';
      case 'example':
        return 'border-l-2 border-l-green-300 pl-6 bg-green-50/30';
      default:
        return '';
    }
  };

  const engagementType = getEngagementType();

  return (
    <div 
      ref={elementRef}
      className={cn(
        "relative py-6 transition-all duration-300",
        getBlockStyle()
      )}
    >
      {/* Small completion indicator */}
      {isCompleted && (
        <div className="absolute -left-2 top-6">
          <div className="bg-white rounded-full p-1 shadow-sm">
            <CheckCircle className="w-3 h-3 text-green-600" />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-4">
        {block.title && (
          <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {block.title}
          </h3>
        )}
        
        <div className="prose prose-gray max-w-none prose-p:leading-relaxed prose-p:text-gray-700">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
            {block.content}
          </div>
        </div>
        
        {/* Interactive engagement for specific block types */}
        {engagementType && !isCompleted && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <InteractiveEngagement
              type={engagementType}
              onInteract={handleInteraction}
              isCompleted={isCompleted}
            />
          </div>
        )}
      </div>
    </div>
  );
};
