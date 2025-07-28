import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Image, Video, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  isCompleted,
  onComplete
}) => {
  const { user } = useAuth();
  const blockRef = useRef<HTMLDivElement>(null);
  const hasTriggeredCompletion = useRef(false);

  // Function to get image URL from Supabase storage
  const getImageUrl = (filename: string) => {
    if (!filename) return null;
    const { data } = supabase.storage
      .from('lesson-images')
      .getPublicUrl(filename);
    console.log(`ContentBlockRenderer: Getting image URL for ${filename}:`, data.publicUrl);
    return data.publicUrl;
  };

  // Debug logging for content blocks
  useEffect(() => {
    console.log(`ContentBlockRenderer: Rendering block "${block.title}" with type "${block.type}" and metadata:`, block.metadata);
  }, [block]);

  // Improved auto-complete logic with lower thresholds and better timing
  useEffect(() => {
    if (!user || isCompleted || hasTriggeredCompletion.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Lower threshold - mark as read when 30% is visible
        if (entry.intersectionRatio > 0.3) {
          // Much shorter delay - 1 second instead of 2
          setTimeout(() => {
            if (!hasTriggeredCompletion.current && !isCompleted) {
              console.log(`Auto-completing content block ${block.id}: ${block.title}`);
              hasTriggeredCompletion.current = true;
              onComplete();
            }
          }, 1000);
        }
      },
      { 
        threshold: [0.1, 0.3, 0.5, 0.7], // Multiple thresholds for better detection
        rootMargin: '0px 0px -10% 0px' // Start detection slightly before fully visible
      }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [user, isCompleted, onComplete, block.id, block.title]);

  // Manual completion fallback - click anywhere on the card to mark as read
  const handleCardClick = () => {
    if (!isCompleted && user && !hasTriggeredCompletion.current) {
      console.log(`Manual completion triggered for block ${block.id}: ${block.title}`);
      hasTriggeredCompletion.current = true;
      onComplete();
    }
  };

  const getBlockIcon = () => {
    switch (block.type) {
      case 'text':
      case 'text_with_image':
      case 'section':
      case 'example':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'list':
        return <List className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatTextContent = (content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      
      // Check if this section contains actual bullet points (not just bold headers)
      const lines = trimmedSection.split('\n');
      const isBulletList = lines.some(line => {
        const trimmedLine = line.trim();
        // Only consider it a bullet if it starts with bullet chars AND is not a bold header
        return (trimmedLine.startsWith('•') || 
                trimmedLine.startsWith('-') || 
                trimmedLine.startsWith('*')) &&
               !trimmedLine.match(/^\*\*.*\*\*$/); // Exclude bold headers like **Title**
      });
      
      if (isBulletList) {
        return (
          <div key={index} className="mb-6 last:mb-0">
            <ul className="space-y-3 pl-1">
              {lines.map((line, lineIndex) => {
                const cleanLine = line.trim().replace(/^[•\-\*]\s*/, '');
                if (!cleanLine) return null;
                
                return (
                  <li key={lineIndex} className="flex items-start gap-3 leading-relaxed">
                    <span className="text-purple-500 mt-1 text-sm font-bold">•</span>
                    <span className="text-gray-700 text-base leading-relaxed">
                      {formatInlineText(cleanLine)}
                    </span>
                  </li>
                );
              }).filter(Boolean)}
            </ul>
          </div>
        );
      } else {
        return (
          <div key={index} className="text-gray-700 text-base leading-relaxed mb-6 last:mb-0">
            <p>{formatInlineText(trimmedSection.replace(/\n/g, ' '))}</p>
          </div>
        );
      }
    });
  };

  const formatInlineText = (text: string) => {
    // Handle bold text formatting - catch any text surrounded by asterisks
    const parts = text.split(/(\*+[^*]+\*+)/g);
    
    return parts.map((part, index) => {
      // Check if this part contains asterisks (indicating bold text)
      if (part.includes('*') && part.match(/\*+[^*]+\*+/)) {
        // Remove ALL asterisks and make text bold
        const boldText = part.replace(/\*/g, '');
        return (
          <strong key={index} className="font-semibold text-gray-800">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  // Render success stories with individual images
  const renderSuccessStories = () => {
    const storyImages = block.metadata?.story_images || [];
    
    // Split content by looking for story titles (text between ** markers)
    const content = block.content;
    
    // Find all sections that start with **Title** pattern
    const storyPattern = /\*\*([^*]+)\*\*/g;
    const matches = [...content.matchAll(storyPattern)];
    
    // Split content into sections based on the story titles
    const stories = [];
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      if (index > 0) {
        // Get content from previous match to current match
        const storyContent = content.substring(lastIndex, match.index).trim();
        if (storyContent) {
          stories.push(storyContent);
        }
      }
      lastIndex = match.index;
    });
    
    // Add the last story (from last match to end, but exclude "What These Stories Share")
    const finalContent = content.substring(lastIndex).trim();
    if (finalContent && !finalContent.includes('What These Stories Share')) {
      stories.push(finalContent);
    } else if (finalContent.includes('What These Stories Share')) {
      // Split at "What These Stories Share" and only take the story part
      const storyPart = finalContent.split('What These Stories Share')[0].trim();
      if (storyPart) {
        stories.push(storyPart);
      }
    }
    
    // Filter out any empty stories and limit to first 3 (matching number of images)
    const validStories = stories.filter(story => story.length > 10).slice(0, 3);
    
    return (
      <div className="space-y-8">
        {validStories.map((story, index) => {
          const imageUrl = storyImages[index] ? getImageUrl(storyImages[index]) : null;
          
          return (
            <div key={index} className="neu-text-container p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {imageUrl && (
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="neu-character w-full h-48 p-2">
                      <img 
                        src={imageUrl} 
                        alt={`Success Story ${index + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
                <div className={imageUrl ? "md:w-2/3" : "w-full"}>
                  <div className="prose prose-base max-w-none">
                    <div className="text-gray-700 leading-relaxed">
                      {formatTextContent(story.trim())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Render the concluding section separately without an image */}
        {content.includes('What These Stories Share') && (
          <div className="neu-quote p-6 border-l-purple-500">
            <div className="prose prose-base max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {formatTextContent(content.split('What These Stories Share')[1]?.trim() || '')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Check if this block has image metadata regardless of type
  const hasImageMetadata = () => {
    return block.metadata?.image_file || block.metadata?.layout === 'success_stories';
  };

  // Render content with image if metadata exists
  const renderContentWithImage = () => {
    const imageFile = block.metadata?.image_file;
    const layout = block.metadata?.layout;
    const imageUrl = imageFile ? getImageUrl(imageFile) : null;
    
    console.log(`ContentBlockRenderer: Processing block with image for "${block.title}". Image file: ${imageFile}, Layout: ${layout}, Image URL: ${imageUrl}`);
    
    // Handle success stories layout
    if (layout === 'success_stories') {
      return renderSuccessStories();
    }
    
    // Handle image left, text right layout
    if (layout === 'image_left_text_right' && imageUrl) {
      return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
          {/* Image container - optimized for square images */}
          <div className="lg:w-2/5 flex-shrink-0">
            <div className="neu-character w-full h-96 p-4">
              <img 
                src={imageUrl} 
                alt={block.title}
                className="w-full h-full object-contain rounded-lg"
                onLoad={() => console.log(`ContentBlockRenderer: Image loaded successfully for ${block.title}`)}
                onError={(e) => console.error(`ContentBlockRenderer: Image failed to load for ${block.title}:`, e)}
              />
            </div>
          </div>
          {/* Text content on right */}
          <div className="lg:w-3/5 flex flex-col justify-center">
            <div className="prose prose-base max-w-none overflow-hidden">
              {formatTextContent(block.content)}
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback to regular text if no special layout or missing image
    console.log(`ContentBlockRenderer: Falling back to text-only for "${block.title}"`);
    return (
      <div className="prose prose-base max-w-none overflow-hidden">
        {formatTextContent(block.content)}
      </div>
    );
  };

  const renderContent = () => {
    // First check if this block has image metadata, regardless of type
    if (hasImageMetadata()) {
      return renderContentWithImage();
    }

    // Handle specific block types without image metadata
    switch (block.type) {
      case 'text':
      case 'section':
      case 'example':
        return (
          <div className="prose prose-base max-w-none overflow-hidden">
            {formatTextContent(block.content)}
          </div>
        );
      case 'text_with_image':
        // This should have been handled above, but fallback to text
        return (
          <div className="prose prose-base max-w-none overflow-hidden">
            {formatTextContent(block.content)}
          </div>
        );
      case 'list':
        const listItems = block.content.split('\n').filter(item => item.trim());
        return (
          <div className="mb-6 last:mb-0">
            <ul className="space-y-3 pl-1">
              {listItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 leading-relaxed">
                  <span className="text-purple-500 mt-1 text-sm font-bold">•</span>
                  <span className="text-gray-700 text-base leading-relaxed">
                    {formatInlineText(item.replace(/^[•\-\*]\s*/, ''))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'image':
        return (
          <div className="flex justify-center my-6">
            <img 
              src={block.metadata?.url || '/placeholder.svg'} 
              alt={block.title}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        );
      case 'video':
        return (
          <div className="flex justify-center my-6">
            <video 
              controls 
              className="max-w-full h-auto rounded-lg shadow-sm"
              src={block.metadata?.url}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return (
          <div className="prose prose-base max-w-none overflow-hidden">
            {formatTextContent(block.content)}
          </div>
        );
    }
  };

  return (
    <div 
      ref={blockRef}
      onClick={handleCardClick}
      data-testid="content-block-renderer"
      data-content-block-id={block.id}
      className={cn(
        "neu-card neu-card-hover transition-all duration-300 my-8 cursor-pointer",
        isCompleted && "border-l-4 border-l-green-500"
      )}
    >
      <div className="p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "neu-character w-10 h-10 flex items-center justify-center",
            isCompleted ? "bg-green-50" : "bg-gray-50"
          )}>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="text-gray-500">
                {getBlockIcon()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {block.title}
            </h3>
            {isCompleted ? (
              <div className="neu-text-container inline-flex items-center gap-2 px-3 py-1">
                <span className="text-xs font-semibold text-green-700">Read</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Click to mark as read</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="neu-text-container p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
