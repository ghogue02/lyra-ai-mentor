import React from 'react';
import { LyraChatRenderer } from './LyraChatRenderer';
import { AIEmailComposerRenderer } from './AIEmailComposerRenderer';
import { PromptBuilderRenderer } from './PromptBuilderRenderer';
import { CalloutBoxRenderer } from './CalloutBoxRenderer';
import { KnowledgeCheckRenderer } from './KnowledgeCheckRenderer';

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
  is_visible: boolean;
  is_active: boolean;
  is_gated: boolean;
}

interface InteractiveElementRendererProps {
  element: InteractiveElement;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  chatEngagement?: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  isBlockingContent?: boolean;
  onEngagementChange?: (engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => void;
  initialEngagementCount?: number;
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonContext,
  chatEngagement,
  isBlockingContent,
  onEngagementChange,
  initialEngagementCount,
  isElementCompleted,
  onComplete
}) => {
  const renderElement = () => {
    switch (element.type) {
      case 'lyra_chat':
        return (
          <LyraChatRenderer
            element={element}
            lessonContext={lessonContext}
            chatEngagement={chatEngagement || { hasReachedMinimum: false, exchangeCount: 0 }}
            isBlockingContent={isBlockingContent || false}
            onEngagementChange={onEngagementChange || (() => {})}
            initialEngagementCount={initialEngagementCount || 0}
          />
        );
      
      case 'ai_email_composer':
        return (
          <AIEmailComposerRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );
      
      case 'prompt_builder':
        return (
          <PromptBuilderRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );
      
      case 'callout_box':
        return (
          <CalloutBoxRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );
      
      case 'knowledge_check':
        return (
          <KnowledgeCheckRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );
      
      default:
        return (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">{element.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{element.content}</p>
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
              Interactive element type: {element.type}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="interactive-element">
      {renderElement()}
    </div>
  );
};