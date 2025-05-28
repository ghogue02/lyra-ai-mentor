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
    return data.publicUrl;
  };

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
      
      // Check if this section contains bullet points
      const lines = trimmedSection.split('\n');
      const isBulletList = lines.some(line => 
        line.trim().startsWith('•') || 
        line.trim().startsWith('-') || 
        line.trim().startsWith('*')
      );
      
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
    
    // Split content into stories (assuming they're separated by double newlines)
    const stories = block.content.split('\n\n').filter(story => story.trim());
    
    return (
      <div className="space-y-8">
        {stories.map((story, index) => {
          const imageUrl = storyImages[index] ? getImageUrl(storyImages[index]) : null;
          
          return (
            <div key={index} className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
              {imageUrl && (
                <div className="md:w-1/3 flex-shrink-0">
                  <img 
                    src={imageUrl} 
                    alt={`Success Story ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}
              <div className={imageUrl ? "md:w-2/3" : "w-full"}>
                <div className="prose prose-base max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {formatInlineText(story.trim())}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-base max-w-none overflow-hidden">
            {formatTextContent(block.content)}
          </div>
        );
      case 'text_with_image':
        const imageFile = block.metadata?.image_file;
        const layout = block.metadata?.layout;
        const imageUrl = imageFile ? getImageUrl(imageFile) : null;
        
        // Handle success stories layout
        if (layout === 'success_stories') {
          return renderSuccessStories();
        }
        
        // Handle image left, text right layout
        if (layout === 'image_left_text_right' && imageUrl) {
          return (
            <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
              {/* Image container - full height on left */}
              <div className="lg:w-2/5 flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={block.title}
                  className="w-full h-full object-cover rounded-lg shadow-sm min-h-[300px] lg:min-h-[400px]"
                />
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
    <Card 
      ref={blockRef}
      onClick={handleCardClick}
      className={cn(
        "shadow-sm backdrop-blur-sm transition-all duration-300 my-8 cursor-pointer",
        "border border-gray-200 bg-white/60",
        isCompleted ? "border-green-200 bg-green-50/30" : "hover:bg-gray-50/80"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            {getBlockIcon()}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-800">
            {block.title}
          </CardTitle>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 ml-auto">
              <CheckCircle className="w-3 h-3 mr-1" />
              Read
            </Badge>
          )}
          {!isCompleted && (
            <span className="text-xs text-gray-500 ml-auto">Click to mark as read</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-6 pb-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
