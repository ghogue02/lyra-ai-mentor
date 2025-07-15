import React from 'react';
import { InteractiveElementRenderer } from './InteractiveElementRenderer';
import { StoryContentRenderer } from './StoryContentRenderer';

interface ContentBlock {
  id: number;
  title: string;
  content: string;
  type: string;
  order_index: number;
  onClick?: () => void;
}

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
  related_content_block_id?: number;
  placement_after_content?: boolean;
}

interface ContentPlacementSystemProps {
  contentBlocks: ContentBlock[];
  interactiveElements: InteractiveElement[];
  lessonId: number;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  onChatEngagementChange?: (engagement: { hasReachedMinimum: boolean; exchangeCount: number }) => void;
  onElementComplete?: (elementId: number) => void;
  chatEngagement?: { hasReachedMinimum: boolean; exchangeCount: number };
}

interface ContentSequenceItem {
  type: 'content' | 'interactive';
  item: ContentBlock | InteractiveElement;
  order: number;
}

export const ContentPlacementSystem: React.FC<ContentPlacementSystemProps> = ({
  contentBlocks,
  interactiveElements,
  lessonId,
  lessonContext,
  onChatEngagementChange,
  onElementComplete,
  chatEngagement
}) => {
  
  // Create a unified content sequence that respects database order_index values
  const createContentSequence = (): ContentSequenceItem[] => {
    const sequence: ContentSequenceItem[] = [];
    
    // Add all content blocks
    contentBlocks.forEach(block => {
      sequence.push({
        type: 'content',
        item: block,
        order: block.order_index
      });
    });
    
    // Add interactive elements using their database order_index (no smart overrides)
    interactiveElements.forEach(element => {
      sequence.push({
        type: 'interactive',
        item: element,
        order: element.order_index // Use exact database positioning
      });
    });
    
    // Sort by order
    return sequence.sort((a, b) => a.order - b.order);
  };
  
  // Smart matching of interactive elements to content blocks
  const findRelatedContentBlock = (element: InteractiveElement, blocks: ContentBlock[]): ContentBlock | null => {
    // Maya-specific placement logic
    if (element.title?.includes('Maya')) {
      // Parent Response Email Helper should come after email-related content
      if (element.title.includes('Parent Response') || element.title.includes('Email Helper')) {
        return blocks.find(block => 
          block.title?.toLowerCase().includes('email') || 
          block.title?.toLowerCase().includes('parent') ||
          block.content?.toLowerCase().includes('email crisis')
        ) || null;
      }
      
      // Email Confidence Builder should come after anxiety/crisis content
      if (element.title.includes('Email Anxiety') || element.title.includes('Connection')) {
        return blocks.find(block => 
          block.title?.toLowerCase().includes('crisis') ||
          block.title?.toLowerCase().includes('anxiety') ||
          block.content?.toLowerCase().includes('email crisis')
        ) || null;
      }
      
      // Grant Proposal elements should come after funding/proposal content
      if (element.title.includes('Grant') || element.title.includes('Proposal')) {
        return blocks.find(block => 
          block.title?.toLowerCase().includes('grant') ||
          block.title?.toLowerCase().includes('proposal') ||
          block.title?.toLowerCase().includes('funding')
        ) || null;
      }
      
      // Board Meeting elements should come after meeting/board content
      if (element.title.includes('Board Meeting') || element.title.includes('Meeting Prep')) {
        return blocks.find(block => 
          block.title?.toLowerCase().includes('board') ||
          block.title?.toLowerCase().includes('meeting') ||
          block.content?.toLowerCase().includes('board chair')
        ) || null;
      }
      
      // Research elements should come after research/data content
      if (element.title.includes('Research') || element.title.includes('Synthesis')) {
        return blocks.find(block => 
          block.title?.toLowerCase().includes('research') ||
          block.title?.toLowerCase().includes('organization') ||
          block.content?.toLowerCase().includes('research')
        ) || null;
      }
    }
    
    return null;
  };
  
  const renderContentBlock = (block: ContentBlock) => {
    // Detect story-heavy content blocks that would benefit from enhanced formatting
    const isStoryBlock = (content: string, title: string): boolean => {
      // Comprehensive story indicators for all characters and narrative content
      const storyIndicators = [
        // Character names
        'Maya', 'Sofia', 'David', 'Rachel', 'Alex',
        // Story narrative words
        'Monday morning', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
        'thought', 'felt', 'realized', 'wondered', 'remembered',
        'imagined', 'decided', 'noticed', 'understood',
        // Story phrases
        'thought she\'d', 'thought he\'d', 'doesn\'t know yet', 'about to change',
        'little did she know', 'little did he know',
        // Character-specific contexts
        'anxiety', 'email crisis', 'storytelling', 'data graveyard',
        'automation', 'efficiency', 'transformation', 'resistance',
        // Story settings and situations
        'nonprofit', 'organization', 'office', 'meeting', 'challenge',
        'breakthrough', 'discovery', 'solution', 'success'
      ];
      
      // Check if content is long and narrative-like
      const wordCount = content.split(' ').length;
      const hasDialogue = content.includes('"') && content.includes('"');
      const hasStoryElements = storyIndicators.some(indicator => 
        content.toLowerCase().includes(indicator.toLowerCase()) || 
        title.toLowerCase().includes(indicator.toLowerCase())
      );
      
      // More inclusive criteria for story content
      return (wordCount > 100 && hasStoryElements) || hasDialogue || wordCount > 300;
    };
    
    // Use StoryContentRenderer for story-heavy blocks
    if (isStoryBlock(block.content, block.title)) {
      return (
        <div key={`content-${block.id}`} className="mb-8">
          <StoryContentRenderer
            title={block.title}
            rawContent={block.content}
            onComplete={block.onClick}
          />
        </div>
      );
    }
    
    // Default rendering for non-story content
    return (
      <div key={`content-${block.id}`} className="mb-6">
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">{block.title}</h3>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        </div>
      </div>
    );
  };
  
  const renderInteractiveElement = (element: InteractiveElement) => {
    return (
      <div key={`interactive-${element.id}`} className="mb-8">
        <InteractiveElementRenderer
          element={element}
          lessonId={lessonId}
          lessonContext={lessonContext}
          onChatEngagementChange={onChatEngagementChange}
          onElementComplete={onElementComplete}
          chatEngagement={chatEngagement}
        />
      </div>
    );
  };
  
  const sequence = createContentSequence();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {sequence.map((item, index) => {
        if (item.type === 'content') {
          return renderContentBlock(item.item as ContentBlock);
        } else {
          return renderInteractiveElement(item.item as InteractiveElement);
        }
      })}
    </div>
  );
};