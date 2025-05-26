
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollCompletion } from '@/hooks/useScrollCompletion';
import { InteractiveEngagement } from './InteractiveEngagement';
import { ScrollProgress } from './ScrollProgress';

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
  
  const { elementRef, isCompleted: scrollCompleted, progress } = useScrollCompletion({
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
        return 'border-l-4 border-l-purple-500 bg-purple-50/50';
      case 'section':
        return 'border-l-4 border-l-blue-500 bg-blue-50/50';
      case 'example':
        return 'border-l-4 border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50/50';
    }
  };

  const getTypeLabel = () => {
    switch (block.type) {
      case 'introduction':
        return { label: 'Introduction', color: 'bg-purple-100 text-purple-700' };
      case 'section':
        return { label: 'Section', color: 'bg-blue-100 text-blue-700' };
      case 'example':
        return { label: 'Example', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Content', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const typeInfo = getTypeLabel();
  const engagementType = getEngagementType();

  return (
    <Card 
      ref={elementRef}
      className={cn(
        "border-0 shadow-lg bg-white/60 backdrop-blur-sm transition-all duration-300",
        getBlockStyle(),
        isCompleted && "ring-2 ring-green-200"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={typeInfo.color}>
                {typeInfo.label}
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </Badge>
              )}
            </div>
            {block.title && (
              <CardTitle className="text-xl font-semibold text-gray-800">
                {block.title}
              </CardTitle>
            )}
          </div>
        </div>
        
        {/* Show scroll progress for auto-completing blocks */}
        {shouldUseScrollCompletion && !isCompleted && (
          <div className="mt-3">
            <ScrollProgress 
              progress={progress} 
              isCompleted={isCompleted}
              showLabel={true}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="prose prose-gray max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {block.content}
        </div>
        
        {/* Interactive engagement for specific block types */}
        {engagementType && !isCompleted && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <InteractiveEngagement
              type={engagementType}
              onInteract={handleInteraction}
              isCompleted={isCompleted}
            />
          </div>
        )}
        
        {/* Completion celebration */}
        {isCompleted && (shouldUseScrollCompletion || hasInteracted) && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {shouldUseScrollCompletion ? "Great! You've absorbed this content." : "Excellent engagement!"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
