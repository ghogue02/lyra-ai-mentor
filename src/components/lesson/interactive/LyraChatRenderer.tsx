
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { LyraChatButton } from '../LyraChatButton';
import { FullScreenChatOverlay } from '../FullScreenChatOverlay';
import { MessageCircle } from 'lucide-react';

interface LyraChatRendererProps {
  element: {
    configuration: any;
  };
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  chatEngagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  isBlockingContent: boolean;
  onEngagementChange: (engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => void;
  initialEngagementCount: number;
}

export const LyraChatRenderer: React.FC<LyraChatRendererProps> = ({
  element,
  lessonContext,
  chatEngagement,
  isBlockingContent,
  onEngagementChange,
  initialEngagementCount
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="space-y-4">
      {isBlockingContent && (
        <div className="p-4 bg-gradient-to-r from-purple-100 to-cyan-100 border border-purple-300 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">Required Interaction</span>
            <Badge className="bg-purple-600 text-white text-xs">
              {chatEngagement.exchangeCount}/3
            </Badge>
          </div>
          <p className="text-sm text-purple-700">
            Complete this chat session to unlock the rest of the lesson content.
          </p>
        </div>
      )}
      
      <LyraChatButton 
        onClick={() => setIsChatOpen(true)} 
        lessonTitle={lessonContext?.lessonTitle} 
      />
      
      <FullScreenChatOverlay 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        lessonContext={lessonContext} 
        suggestedTask={element.configuration?.suggested_task} 
        onEngagementChange={onEngagementChange}
        initialEngagementCount={initialEngagementCount}
      />
    </div>
  );
};
