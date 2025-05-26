
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isViewed, setIsViewed] = useState(false);

  const handleMarkAsRead = () => {
    setIsViewed(true);
    onComplete();
  };

  const getBlockStyle = () => {
    switch (block.type) {
      case 'introduction':
        return 'border-l-4 border-l-purple-500 bg-purple-50/50';
      case 'section':
        return 'border-l-4 border-l-blue-500 bg-blue-50/50';
      case 'example':
        return 'border-l-4 border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-4 border-l-gray-300 bg-gray-50/50';
    }
  };

  const getTypeLabel = () => {
    switch (block.type) {
      case 'introduction':
        return { label: 'Introduction', color: 'bg-purple-100 text-purple-700' };
      case 'section':
        return { label: 'Section', color: 'bg-blue-100 text-blue-700' };
      case 'example':
        return { label: 'Example', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Content', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const typeInfo = getTypeLabel();

  return (
    <Card className={cn(
      "border-0 shadow-lg bg-white/60 backdrop-blur-sm transition-all duration-300",
      getBlockStyle(),
      isCompleted && "ring-2 ring-green-200"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={typeInfo.color}>
                {typeInfo.label}
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </Badge>
              )}
            </div>
            {block.title && (
              <CardTitle className="text-xl font-semibold text-gray-800">
                {block.title}
              </CardTitle>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="prose prose-gray max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {block.content}
        </div>
        
        {!isCompleted && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={handleMarkAsRead}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Mark as Read
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
