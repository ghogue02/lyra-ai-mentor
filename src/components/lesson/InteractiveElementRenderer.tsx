import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LyraChatButton } from './LyraChatButton';
import { FullScreenChatOverlay } from './FullScreenChatOverlay';
import { MessageCircle, CheckSquare, PenTool } from 'lucide-react';
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
  onChatEngagementChange?: (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => void;
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
        return <MessageCircle className="w-4 h-4" />;
      case 'knowledge_check':
        return <CheckSquare className="w-4 h-4" />;
      case 'reflection':
        return <PenTool className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };
  const getElementStyle = () => {
    switch (element.type) {
      case 'lyra_chat':
        return 'border border-purple-200 bg-gradient-to-r from-purple-50/50 to-cyan-50/50';
      case 'knowledge_check':
        return 'border border-blue-200 bg-blue-50/30';
      case 'reflection':
        return 'border border-orange-200 bg-orange-50/30';
      default:
        return 'border border-gray-200 bg-gray-50/30';
    }
  };
  const handleKnowledgeCheck = () => {
    setShowFeedback(true);
  };
  const handleReflectionSubmit = () => {
    console.log('Reflection submitted:', reflectionText);
  };
  const renderKnowledgeCheck = () => {
    const config = element.configuration || {};
    const options = config.options || [];
    return <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{element.content}</p>
        
        <div className="space-y-3">
          {options.map((option: string, index: number) => <div key={index} className="flex items-center space-x-3">
              <Checkbox id={`option-${index}`} checked={selectedOptions.includes(option)} onCheckedChange={checked => {
            if (checked) {
              setSelectedOptions([...selectedOptions, option]);
            } else {
              setSelectedOptions(selectedOptions.filter(o => o !== option));
            }
          }} />
              <label htmlFor={`option-${index}`} className="text-sm leading-relaxed cursor-pointer">
                {option}
              </label>
            </div>)}
        </div>
        
        <Button onClick={handleKnowledgeCheck} size="sm" className="mt-4">
          Check Answers
        </Button>
        
        {showFeedback && config.feedback && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{config.feedback}</p>
          </div>}
      </div>;
  };
  const renderReflection = () => {
    const config = element.configuration || {};
    const suggestions = config.suggestions || [];
    return <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{element.content}</p>
        
        {suggestions.length > 0 && <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Consider these examples:</p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              {suggestions.map((suggestion: string, index: number) => <li key={index} className="list-disc">
                  {suggestion}
                </li>)}
            </ul>
          </div>}
        
        <Textarea placeholder="Share your thoughts..." value={reflectionText} onChange={e => setReflectionText(e.target.value)} className="min-h-[80px]" />
        
        <Button onClick={handleReflectionSubmit} disabled={!reflectionText.trim()} size="sm">
          Save Reflection
        </Button>
        
        {config.follow_up && <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-700">{config.follow_up}</p>
          </div>}
      </div>;
  };
  const renderLyraChat = () => {
    const config = element.configuration || {};
    return <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{element.content}</p>
        
        {config.greeting && <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-purple-800 text-sm">{config.greeting}</p>
          </div>}
        
        <LyraChatButton onClick={() => setIsChatOpen(true)} lessonTitle={lessonContext?.lessonTitle} />
        
        <FullScreenChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lessonContext={lessonContext} suggestedTask={config.suggested_task} onEngagementChange={onChatEngagementChange} />
      </div>;
  };
  const renderCalloutBox = () => {
    const config = element.configuration || {};
    const icon = config.icon || '💡';
    return <div className="p-4 border border-yellow-300 bg-yellow-50/50 rounded-md my-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">{icon}</span>
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">{element.title}</h4>
            <p className="text-yellow-700 text-sm leading-relaxed">{element.content}</p>
          </div>
        </div>
      </div>;
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
  return <Card className={cn("shadow-sm backdrop-blur-sm transition-all duration-300 my-8", getElementStyle())}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            {getElementIcon()}
          </div>
          <CardTitle className="text-lg font-medium">
            {element.title}
          </CardTitle>
          
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderContent()}
      </CardContent>
    </Card>;
};