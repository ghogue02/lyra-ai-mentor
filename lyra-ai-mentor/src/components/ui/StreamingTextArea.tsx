import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StreamingTextAreaProps {
  isStreaming: boolean;
  content: string;
  onComplete?: () => void;
  className?: string;
  showCopy?: boolean;
  title?: string;
}

export const StreamingTextArea: React.FC<StreamingTextAreaProps> = ({
  isStreaming,
  content,
  onComplete,
  className = '',
  showCopy = true,
  title = 'AI Response'
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && content) {
      // Simulate streaming effect by gradually revealing content
      const words = content.split(' ');
      let currentWordIndex = 0;
      
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedContent(words.slice(0, currentWordIndex + 1).join(' '));
          currentWordIndex++;
          
          // Auto-scroll to bottom
          if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, 100); // Adjust speed as needed
      
      return () => clearInterval(interval);
    } else if (!isStreaming && content) {
      setDisplayedContent(content);
      setIsComplete(true);
    }
  }, [isStreaming, content, onComplete]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayedContent);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <Card className={`border-2 ${isStreaming ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </Badge>
            )}
            {isComplete && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <Check className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
            {showCopy && displayedContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-gray-600 hover:text-gray-900"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div
          ref={contentRef}
          className="max-h-96 overflow-y-auto bg-white rounded-lg p-4 shadow-sm"
        >
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {displayedContent}
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
            )}
          </div>
        </div>
        
        {isStreaming && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is crafting your response...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((displayedContent.length / content.length) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};