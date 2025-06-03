
import React, { memo, useMemo } from 'react';
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

const LessonContentComponent: React.FC<LessonContentProps> = ({
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
  // Memoize content to prevent unnecessary recalculations
  const regularContent = useMemo(() => {
    return [
      ...contentBlocks.map(block => ({
        ...block,
        contentType: 'block' as const
      })),
      ...interactiveElements.map(element => ({
        ...element,
        contentType: 'interactive' as const
      }))
    ].sort((a, b) => a.order_index - b.order_index);
  }, [contentBlocks, interactiveElements]);

  // Memoize blocking logic
  const { firstLyraChatIndex, shouldBlockContent } = useMemo(() => {
    const firstLyraChatIndex = regularContent.findIndex(
      item => item.contentType === 'interactive' && item.type === 'lyra_chat'
    );

    const shouldBlockContent = (index: number) => {
      if (firstLyraChatIndex === -1) return false;
      if (index <= firstLyraChatIndex) return false;
      return !chatEngagement.hasReachedMinimum;
    };

    return { firstLyraChatIndex, shouldBlockContent };
  }, [regularContent, chatEngagement.hasReachedMinimum]);

  return (
    <div className="mx-auto space-y-6 max-w-4xl pb-16">
      {regularContent.map((item, index) => {
        const isBlocked = shouldBlockContent(index);

        // Skip blocked content entirely to prevent flickering
        if (isBlocked) {
          return null;
        }

        return (
          <div 
            key={`${item.contentType}-${item.id}`} 
            className="transition-opacity duration-500"
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
                chatEngagement={chatEngagement}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const LessonContent = memo(LessonContentComponent);
