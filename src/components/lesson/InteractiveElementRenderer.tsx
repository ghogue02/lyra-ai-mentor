import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { LyraChatButton } from './LyraChatButton';
import { FullScreenChatOverlay } from './FullScreenChatOverlay';
import { MessageCircle, CheckSquare, PenTool, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  onElementComplete?: (elementId: number) => void;
}

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonId,
  lessonContext,
  onChatEngagementChange,
  onElementComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReflectionSaving, setIsReflectionSaving] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [isElementCompleted, setIsElementCompleted] = useState(false);
  const [chatEngagement, setChatEngagement] = useState<{
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }>({
    hasReachedMinimum: false,
    exchangeCount: 0
  });

  // Load completion status and existing data when component mounts
  useEffect(() => {
    if (user) {
      loadCompletionStatus();
      if (element.type === 'reflection') {
        loadExistingReflection();
      }
      if (element.type === 'lyra_chat') {
        loadChatEngagement();
      }
    }
  }, [user, element.id, lessonId]);

  const loadCompletionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interactive_element_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('interactive_element_id', element.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;

      if (data?.completed) {
        setIsElementCompleted(true);
      }
    } catch (error: any) {
      console.error('Error loading completion status:', error);
    }
  };

  const loadExistingReflection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('content')
        .eq('user_id', user.id)
        .eq('interactive_element_id', element.id)
        .eq('lesson_id', lessonId)
        .eq('interaction_type', 'reflection')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data?.content) {
        setReflectionText(data.content);
        setReflectionSaved(true);
      }
    } catch (error: any) {
      console.error('Error loading existing reflection:', error);
    }
  };

  const loadChatEngagement = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('content, metadata')
        .eq('user_id', user.id)
        .eq('interactive_element_id', element.id)
        .eq('lesson_id', lessonId)
        .eq('interaction_type', 'chat_engagement');

      if (error) throw error;

      if (data && data.length > 0) {
        const exchangeCount = data.length;
        const hasReachedMinimum = exchangeCount >= 3;
        
        setChatEngagement({
          exchangeCount,
          hasReachedMinimum
        });

        onChatEngagementChange?.({
          exchangeCount,
          hasReachedMinimum
        });
      }
    } catch (error: any) {
      console.error('Error loading chat engagement:', error);
    }
  };

  const markElementComplete = async () => {
    if (!user || isElementCompleted) return;

    try {
      const { error } = await supabase
        .from('interactive_element_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          interactive_element_id: element.id,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsElementCompleted(true);
      onElementComplete?.(element.id);
    } catch (error: any) {
      console.error('Error marking element complete:', error);
    }
  };

  const getElementIcon = () => {
    switch (element.type) {
      case 'lyra_chat':
        return <MessageCircle className="w-4 h-4" />;
      case 'knowledge_check':
        return <CheckSquare className="w-4 h-4" />;
      case 'reflection':
        return <PenTool className="w-4 h-4" />;
      case 'callout_box':
        return <Eye className="w-4 h-4" />;
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
      case 'callout_box':
        return 'border border-yellow-200 bg-yellow-50/30';
      default:
        return 'border border-gray-200 bg-gray-50/30';
    }
  };

  const handleKnowledgeCheck = async () => {
    setShowFeedback(true);
    await markElementComplete();
  };

  const handleReflectionSubmit = async () => {
    if (!user || !reflectionText.trim()) return;

    setIsReflectionSaving(true);
    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          interactive_element_id: element.id,
          interaction_type: 'reflection',
          content: reflectionText.trim(),
          metadata: {
            question: element.content,
            element_title: element.title
          }
        });

      if (error) throw error;

      setReflectionSaved(true);
      await markElementComplete();
      toast({
        title: "Reflection saved!",
        description: "Your thoughts have been saved to your learning journal."
      });
    } catch (error: any) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error saving reflection",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsReflectionSaving(false);
    }
  };

  const handleChatEngagementChange = async (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => {
    setChatEngagement(engagement);
    onChatEngagementChange?.(engagement);
    
    // Save chat engagement to database
    if (user && engagement.exchangeCount > chatEngagement.exchangeCount) {
      try {
        await supabase
          .from('user_interactions')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            interactive_element_id: element.id,
            interaction_type: 'chat_engagement',
            content: `Chat exchange ${engagement.exchangeCount}`,
            metadata: {
              exchange_count: engagement.exchangeCount,
              has_reached_minimum: engagement.hasReachedMinimum
            }
          });
      } catch (error: any) {
        console.error('Error saving chat engagement:', error);
      }
    }

    if (engagement.hasReachedMinimum && !isElementCompleted) {
      markElementComplete();
    }
  };

  const handleCalloutBoxRead = async () => {
    await markElementComplete();
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
        
        <Button onClick={handleKnowledgeCheck} size="sm" className="mt-4" disabled={isElementCompleted}>
          {isElementCompleted ? 'Completed' : 'Check Answers'}
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
        
        <Textarea
          placeholder="Share your thoughts..."
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          className="min-h-[80px]"
          disabled={reflectionSaved}
        />
        
        {reflectionSaved ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm">Reflection saved to your learning journal</span>
          </div>
        ) : (
          <Button
            onClick={handleReflectionSubmit}
            disabled={!reflectionText.trim() || isReflectionSaving}
            size="sm"
          >
            {isReflectionSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        )}
        
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
        
        <FullScreenChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lessonContext={lessonContext} suggestedTask={config.suggested_task} onEngagementChange={handleChatEngagementChange} />
      </div>;
  };

  const renderCalloutBox = () => {
    const config = element.configuration || {};
    const icon = config.icon || '💡';
    return <div className="p-4 border border-yellow-300 bg-yellow-50/50 rounded-md my-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">{icon}</span>
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-1">{element.title}</h4>
            <p className="text-yellow-700 text-sm leading-relaxed mb-3">{element.content}</p>
            {!isElementCompleted && (
              <Button
                onClick={handleCalloutBoxRead}
                variant="outline"
                size="sm"
                className="text-xs hover:bg-yellow-100 hover:border-yellow-400"
              >
                <Eye className="w-3 h-3 mr-1" />
                Mark as Read
              </Button>
            )}
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

  return (
    <Card className={cn("shadow-sm backdrop-blur-sm transition-all duration-300 my-8", getElementStyle())}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            {getElementIcon()}
          </div>
          <CardTitle className="text-lg font-medium">
            {element.title}
          </CardTitle>
          {isElementCompleted && (
            <Badge className="bg-green-100 text-green-700 ml-auto">
              <CheckSquare className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {element.type === 'lyra_chat' && chatEngagement.hasReachedMinimum && (
            <Badge className="bg-purple-100 text-purple-700 ml-auto">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat Complete
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
