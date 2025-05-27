
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

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />
          </div>
        );
      case 'list':
        const listItems = block.content.split('\n').filter(item => item.trim());
        return (
          <ul className="space-y-2">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>{item.replace(/^[•\-\*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        );
      case 'image':
        return (
          <div className="flex justify-center">
            <img 
              src={block.metadata?.url || '/placeholder.svg'} 
              alt={block.title}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        );
      case 'video':
        return (
          <div className="flex justify-center">
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
        return <p className="text-gray-700 leading-relaxed">{block.content}</p>;
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
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            {getBlockIcon()}
          </div>
          <CardTitle className="text-lg font-medium">
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
      
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};
