import React from 'react';
import { LyraChatRenderer } from './LyraChatRenderer';
import { AIEmailComposerRenderer } from './AIEmailComposerRenderer';
import { PromptBuilderRenderer } from './PromptBuilderRenderer';
import { CalloutBoxRenderer } from './CalloutBoxRenderer';
import { KnowledgeCheckRenderer } from './KnowledgeCheckRenderer';
import { AIPersonalityQuizRenderer } from './AIPersonalityQuizRenderer';
import { AIAvatarCreatorRenderer } from './AIAvatarCreatorRenderer';
import { AIMottoGeneratorRenderer } from './AIMottoGeneratorRenderer';
import { AIDreamTeamRenderer } from './AIDreamTeamRenderer';
import { AIPromptPracticeRenderer } from './AIPromptPracticeRenderer';
import { AICommunicationSimRenderer } from './AICommunicationSimRenderer';
import { AISuccessVisualizerRenderer } from './AISuccessVisualizerRenderer';
import { DataStorytellerRenderer } from './renderers/DataStorytellerRenderer';
import { DocumentImproverRenderer } from './renderers/DocumentImproverRenderer';
import { AIEmailComposerRenderer as AIEmailComposerRendererNew } from './renderers/AIEmailComposerRenderer';
import { ChatSystem } from '../../chat-system/ChatSystem';

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
    // Special routing for Chapter 1 - Glass ChatSystem
    if (lessonContext?.chapterTitle === "Chapter 1" || 
        lessonContext?.lessonTitle?.includes("Hello, I'm Lyra") ||
        element.type === 'lyra_introduction') {
      return (
        <ChatSystem 
          lessonModule={{
            chapterNumber: 1,
            title: lessonContext?.lessonTitle || "Hello, I'm Lyra!",
            content: lessonContext?.content || "",
            chapterTitle: lessonContext?.chapterTitle || "Chapter 1",
            phase: "interactive"
          }}
          position="bottom-right"
          className="fixed z-50"
          onEngagementChange={(hasEngaged) => {
            onEngagementChange?.({ 
              hasReachedMinimum: hasEngaged, 
              exchangeCount: hasEngaged ? 3 : 0 
            });
          }}
        />
      );
    }

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
      
      case 'ai_content_generator':
        return (
          <DataStorytellerRenderer
            elementId={element.id}
            title={element.title}
            configuration={element.configuration}
            onComplete={async () => await onComplete()}
          />
        );

      case 'document_improver':
        return (
          <DocumentImproverRenderer
            elementId={element.id}
            title={element.title}
            configuration={element.configuration}
            onComplete={async () => await onComplete()}
          />
        );

      case 'ai_email_composer':
        return (
          <AIEmailComposerRendererNew
            elementId={element.id}
            title={element.title}
            configuration={element.configuration}
            onComplete={async () => await onComplete()}
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

      case 'ai_personality_quiz':
        return (
          <AIPersonalityQuizRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_avatar_creator':
        return (
          <AIAvatarCreatorRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_motto_generator':
        return (
          <AIMottoGeneratorRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_dream_team':
        return (
          <AIDreamTeamRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_prompt_practice':
        return (
          <AIPromptPracticeRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_communication_sim':
        return (
          <AICommunicationSimRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={onComplete}
          />
        );

      case 'ai_success_visualizer':
        return (
          <AISuccessVisualizerRenderer
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