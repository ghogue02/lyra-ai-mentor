
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeCheckRenderer } from './interactive/KnowledgeCheckRenderer';
import { ReflectionRenderer } from './interactive/ReflectionRenderer';
import { LyraChatRenderer } from './interactive/LyraChatRenderer';
import { CalloutBoxRenderer } from './interactive/CalloutBoxRenderer';
import { useElementCompletion } from './interactive/hooks/useElementCompletion';
import { useChatEngagement } from './interactive/hooks/useChatEngagement';
import { getElementIcon, getElementStyle } from './interactive/utils/elementUtils';

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
}

interface InteractiveElementRendererProps {
  element: InteractiveElement;
  lessonId: number;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  onChatEngagementChange?: (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => void;
  onElementComplete?: (elementId: number) => void;
  isBlockingContent?: boolean;
}

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonId,
  lessonContext,
  onChatEngagementChange,
  onElementComplete,
  isBlockingContent = false
}) => {
  const { isElementCompleted, markElementComplete } = useElementCompletion(
    element.id, 
    lessonId, 
    onElementComplete
  );
  
  const { chatEngagement, handleChatEngagementChange } = useChatEngagement(
    element.id,
    lessonId,
    onChatEngagementChange
  );

  const handleElementComplete = async () => {
    await markElementComplete();
  };

  const handleChatEngagement = async (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => {
    handleChatEngagementChange(engagement);
    if (engagement.hasReachedMinimum && !isElementCompleted) {
      console.log(`InteractiveElementRenderer: Marking element ${element.id} as completed due to engagement threshold`);
      await markElementComplete();
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'knowledge_check':
        return (
          <KnowledgeCheckRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={handleElementComplete}
          />
        );
      case 'reflection':
        return (
          <ReflectionRenderer
            element={element}
            lessonId={lessonId}
            onComplete={handleElementComplete}
          />
        );
      case 'lyra_chat':
        return (
          <LyraChatRenderer
            element={element}
            lessonContext={lessonContext}
            chatEngagement={chatEngagement}
            isBlockingContent={isBlockingContent}
            onEngagementChange={handleChatEngagement}
            initialEngagementCount={chatEngagement.exchangeCount}
          />
        );
      case 'callout_box':
        return (
          <CalloutBoxRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={handleElementComplete}
          />
        );
      default:
        return <p className="text-gray-700">{element.content}</p>;
    }
  };

  // Special rendering for callout box - no card wrapper
  if (element.type === 'callout_box') {
    return (
      <CalloutBoxRenderer
        element={element}
        isElementCompleted={isElementCompleted}
        onComplete={handleElementComplete}
      />
    );
  }

  // Special rendering for lyra_chat - no card wrapper
  if (element.type === 'lyra_chat') {
    return (
      <div className="my-8">
        <LyraChatRenderer
          element={element}
          lessonContext={lessonContext}
          chatEngagement={chatEngagement}
          isBlockingContent={isBlockingContent}
          onEngagementChange={handleChatEngagement}
          initialEngagementCount={chatEngagement.exchangeCount}
        />
      </div>
    );
  }

  const IconComponent = getElementIcon(element.type);

  return (
    <Card className={cn("shadow-sm backdrop-blur-sm transition-all duration-300 my-8", getElementStyle(element.type))}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            <IconComponent className="w-4 h-4" />
          </div>
          <CardTitle className="text-lg font-medium">
            {element.title}
          </CardTitle>
          {isElementCompleted && (
            <Badge className="bg-green-100 text-green-700 ml-auto">
              <CheckSquare className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {element.type === 'lyra_chat' && chatEngagement.hasReachedMinimum && (
            <Badge className="bg-purple-100 text-purple-700 ml-auto">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
