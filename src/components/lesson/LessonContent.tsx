
import React from 'react';
import { ContentBlockRenderer } from './ContentBlockRenderer';
import { InteractiveElementRenderer } from './InteractiveElementRenderer';

interface ContentBlock {
  id: number;
  type: string;
  title: string;
  content: string;
  metadata: any;
  order_index: number;
}

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
}

interface LessonContentProps {
  contentBlocks: ContentBlock[];
  interactiveElements: InteractiveElement[];
  completedBlocks: Set<number>;
  completedInteractiveElements: Set<number>;
  chatEngagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
  lessonId: string;
  lessonContext?: {
    chapterTitle: string;
    lessonTitle: string;
    content: string;
  };
  onMarkBlockCompleted: (blockId: number) => void;
  onChatEngagementChange: (engagement: { hasReachedMinimum: boolean; exchangeCount: number; }) => void;
  onInteractiveElementComplete: (elementId: number) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  contentBlocks,
  interactiveElements,
  completedBlocks,
  completedInteractiveElements,
  chatEngagement,
  lessonId,
  lessonContext,
  onMarkBlockCompleted,
  onChatEngagementChange,
  onInteractiveElementComplete
}) => {
  // Find the first Lyra chat element to determine blocking point
  const findFirstLyraChatIndex = () => {
    return regularContent.findIndex(item => item.contentType === 'interactive' && item.type === 'lyra_chat');
  };

  // Check if content should be blocked based on chat completion
  const shouldBlockContent = (index: number) => {
    const firstLyraChatIndex = findFirstLyraChatIndex();

    // If no Lyra chat found, don't block anything
    if (firstLyraChatIndex === -1) return false;

    // If this is before or at the first Lyra chat, don't block
    if (index <= firstLyraChatIndex) return false;

    // Block if chat engagement hasn't reached minimum
    console.log(`LessonContent: Checking if content at index ${index} should be blocked. Chat engagement:`, chatEngagement);
    return !chatEngagement.hasReachedMinimum;
  };

  // Merge and sort all content blocks and interactive elements
  const regularContent = [
    ...contentBlocks.map(block => ({
      ...block,
      contentType: 'block' as const
    })),
    ...interactiveElements.map(element => ({
      ...element,
      contentType: 'interactive' as const
    }))
  ].sort((a, b) => a.order_index - b.order_index);

  const firstLyraChatIndex = findFirstLyraChatIndex();

  return (
    <div className="mx-auto space-y-8 max-w-4xl">
      {regularContent.map((item, index) => {
        const isBlocked = shouldBlockContent(index);
        console.log(`LessonContent: Rendering item at index ${index}, blocked: ${isBlocked}, type: ${item.type}`);

        // Remove the ContentBlocker visual element - just skip blocked content
        if (isBlocked) {
          return null;
        }

        return (
          <div 
            key={`${item.contentType}-${item.id}`} 
            className={chatEngagement.hasReachedMinimum && index > firstLyraChatIndex ? "animate-fade-in" : ""}
          >
            {item.contentType === 'block' ? (
              <ContentBlockRenderer 
                block={item as ContentBlock}
                isCompleted={completedBlocks.has(item.id)}
                onComplete={() => onMarkBlockCompleted(item.id)}
              />
            ) : (
              <InteractiveElementRenderer 
                element={item as InteractiveElement}
                lessonId={parseInt(lessonId)}
                lessonContext={lessonContext}
                onChatEngagementChange={onChatEngagementChange}
                onElementComplete={onInteractiveElementComplete}
                isBlockingContent={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
