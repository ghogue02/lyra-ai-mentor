import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LyraChatButton } from './LyraChatButton';
import { FullScreenChatOverlay } from './FullScreenChatOverlay';
import { MessageCircle, CheckSquare, PenTool, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveElement {
  id: number;
  type: string;
  title: string;
  content: string;
  configuration: any;
  order_index: number;
}

interface InteractiveElementRendererProps {
  element: InteractiveElement;
  lessonId: number;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  onChatEngagementChange?: (engagement: { hasReachedMinimum: boolean; exchangeCount: number }) => void;
}

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonId,
  lessonContext,
  onChatEngagementChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getElementIcon = () => {
    switch (element.type) {
      case 'lyra_chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'knowledge_check':
        return <CheckSquare className="w-5 h-5" />;
      case 'reflection':
        return <PenTool className="w-5 h-5" />;
      case 'callout_box':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getElementStyle = () => {
    switch (element.type) {
      case 'lyra_chat':
        return 'border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50';
      case 'knowledge_check':
        return 'border-blue-200 bg-blue-50/50';
      case 'reflection':
        return 'border-orange-200 bg-orange-50/50';
      case 'callout_box':
        return 'border-yellow-200 bg-yellow-50/50';
      default:
        return 'border-gray-200 bg-gray-50/50';
    }
  };

  const handleKnowledgeCheck = () => {
    setShowFeedback(true);
  };

  const handleReflectionSubmit = () => {
    // Here you could save the reflection to the database
    console.log('Reflection submitted:', reflectionText);
  };

  const renderKnowledgeCheck = () => {
    const config = element.configuration || {};
    const options = config.options || [];
    
    return (
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">{element.content}</p>
        
        <div className="space-y-3">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${index}`}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOptions([...selectedOptions, option]);
                  } else {
                    setSelectedOptions(selectedOptions.filter(o => o !== option));
                  }
                }}
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        
        <Button onClick={handleKnowledgeCheck} className="mt-4">
          Check Answers
        </Button>
        
        {showFeedback && config.feedback && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{config.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  const renderReflection = () => {
    const config = element.configuration || {};
    const suggestions = config.suggestions || [];
    
    return (
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">{element.content}</p>
        
        {suggestions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Consider these examples:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Textarea
          placeholder="Share your thoughts..."
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button onClick={handleReflectionSubmit} disabled={!reflectionText.trim()}>
          Save Reflection
        </Button>
        
        {config.follow_up && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">{config.follow_up}</p>
          </div>
        )}
      </div>
    );
  };

  const renderLyraChat = () => {
    const config = element.configuration || {};
    
    return (
      <div className="space-y-4">
        <p className="text-gray-700 mb-4">{element.content}</p>
        
        {config.greeting && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
            <p className="text-purple-800 text-sm">{config.greeting}</p>
          </div>
        )}
        
        <LyraChatButton
          onClick={() => setIsChatOpen(true)}
          lessonTitle={lessonContext?.lessonTitle}
        />
        
        <FullScreenChatOverlay
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          lessonContext={lessonContext}
          suggestedTask={config.suggested_task}
          onEngagementChange={onChatEngagementChange}
        />
      </div>
    );
  };

  const renderCalloutBox = () => {
    const config = element.configuration || {};
    const icon = config.icon || '💡';
    
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">{element.title}</h4>
            <p className="text-yellow-700">{element.content}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (element.type) {
      case 'knowledge_check':
        return renderKnowledgeCheck();
      case 'reflection':
        return renderReflection();
      case 'lyra_chat':
        return renderLyraChat();
      case 'callout_box':
        return renderCalloutBox();
      default:
        return <p className="text-gray-700">{element.content}</p>;
    }
  };

  if (element.type === 'callout_box') {
    return renderCalloutBox();
  }

  return (
    <Card className={cn(
      "border-0 shadow-lg backdrop-blur-sm transition-all duration-300",
      getElementStyle()
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/80">
            {getElementIcon()}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              {element.title}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              Interactive
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
