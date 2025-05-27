import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Image, Video, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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

  // Auto-complete content blocks when they come into view
  useEffect(() => {
    if (!user || isCompleted || hasTriggeredCompletion.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Mark as completed after 2 seconds of viewing
          setTimeout(() => {
            if (!hasTriggeredCompletion.current && !isCompleted) {
              console.log(`Auto-completing content block ${block.id}: ${block.title}`);
              hasTriggeredCompletion.current = true;
              onComplete();
            }
          }, 2000);
        }
      },
      { threshold: 0.5 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [user, isCompleted, onComplete, block.id, block.title]);

  const getBlockIcon = () => {
    switch (block.type) {
      case 'text':
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
    // Split content by double line breaks to create paragraphs
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
        // Render as a list
        return (
          <ul key={index} className="space-y-3 mb-6 pl-1">
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
        );
      } else {
        // Render as a paragraph
        return (
          <p key={index} className="text-gray-700 text-base leading-relaxed mb-6 last:mb-0">
            {formatInlineText(trimmedSection.replace(/\n/g, ' '))}
          </p>
        );
      }
    });
  };

  const formatInlineText = (text: string) => {
    // Handle bold text formatting - catch any text surrounded by asterisks
    // This will match *text*, **text**, *text**, **text*, etc.
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

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-base max-w-none">
            {formatTextContent(block.content)}
          </div>
        );
      case 'list':
        const listItems = block.content.split('\n').filter(item => item.trim());
        return (
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
          <div className="prose prose-base max-w-none">
            {formatTextContent(block.content)}
          </div>
        );
    }
  };

  return (
    <Card 
      ref={blockRef}
      className={cn(
        "shadow-sm backdrop-blur-sm transition-all duration-300 my-8",
        "border border-gray-200 bg-white/60"
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
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-6 pb-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
