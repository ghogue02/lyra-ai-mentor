
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeCheckRenderer } from './interactive/KnowledgeCheckRenderer';
import { ReflectionRenderer } from './interactive/ReflectionRenderer';
import { LyraChatRenderer } from './interactive/LyraChatRenderer';
import { CalloutBoxRenderer } from './interactive/CalloutBoxRenderer';
import { SequenceSorterRenderer } from './interactive/SequenceSorterRenderer';
import { AIContentGenerator } from '@/components/testing/AIContentGenerator';
import { MultipleChoiceScenarios } from '@/components/testing/MultipleChoiceScenarios';
import { AIImpactStoryCreator } from '@/components/testing/AIImpactStoryCreator';
import { useElementCompletion } from './interactive/hooks/useElementCompletion';
import { useChatEngagement } from './interactive/hooks/useChatEngagement';
import { getElementIcon, getElementStyle } from './interactive/utils/elementUtils';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';

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
  isBlockingContent?: boolean;
}

// Helper function to get avatar and icons for AI components
const getAIComponentAssets = (type: string) => {
  switch (type) {
    case 'ai_content_generator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('communication.png'),
        rightIcon: getSupabaseIconUrl('data-analytics.png')
      };
    case 'multiple_choice_scenarios':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('learning-target.png'),
        rightIcon: getSupabaseIconUrl('achievement-trophy.png')
      };
    case 'ai_impact_story_creator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('mission-heart.png'),
        rightIcon: getSupabaseIconUrl('growth-plant.png')
      };
    default:
      return null;
  }
};

export const InteractiveElementRenderer: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonId,
  lessonContext,
  onChatEngagementChange,
  onElementComplete,
  isBlockingContent = false
}) => {
  const { isElementCompleted, markElementComplete } = useElementCompletion(
    element.id, 
    lessonId, 
    onElementComplete
  );
  
  const { chatEngagement, handleChatEngagementChange } = useChatEngagement(
    element.id,
    lessonId,
    onChatEngagementChange
  );

  const handleElementComplete = async () => {
    await markElementComplete();
  };

  const handleChatEngagement = async (engagement: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  }) => {
    handleChatEngagementChange(engagement);
    if (engagement.hasReachedMinimum && !isElementCompleted) {
      console.log(`InteractiveElementRenderer: Marking element ${element.id} as completed due to engagement threshold`);
      await markElementComplete();
    }
  };

  const renderContent = () => {
    switch (element.type) {
      case 'knowledge_check':
        return (
          <KnowledgeCheckRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={handleElementComplete}
          />
        );
      case 'reflection':
        return (
          <ReflectionRenderer
            element={element}
            lessonId={lessonId}
            onComplete={handleElementComplete}
          />
        );
      case 'lyra_chat':
        return (
          <LyraChatRenderer
            element={element}
            lessonContext={lessonContext}
            chatEngagement={chatEngagement}
            isBlockingContent={isBlockingContent}
            onEngagementChange={handleChatEngagement}
            initialEngagementCount={chatEngagement.exchangeCount}
          />
        );
      case 'callout_box':
        return (
          <CalloutBoxRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={handleElementComplete}
          />
        );
      case 'sequence_sorter':
        return (
          <SequenceSorterRenderer
            element={element}
            isElementCompleted={isElementCompleted}
            onComplete={handleElementComplete}
          />
        );
      case 'multiple_choice_scenarios':
        return (
          <MultipleChoiceScenarios />
        );
      case 'ai_impact_story_creator':
        return (
          <AIImpactStoryCreator />
        );
      case 'ai_content_generator':
        return (
          <AIContentGenerator />
        );
      default:
        return <p className="text-gray-700">{element.content}</p>;
    }
  };

  // Special rendering for callout box - no card wrapper
  if (element.type === 'callout_box') {
    return (
      <CalloutBoxRenderer
        element={element}
        isElementCompleted={isElementCompleted}
        onComplete={handleElementComplete}
      />
    );
  }

  // Special rendering for lyra_chat - no card wrapper
  if (element.type === 'lyra_chat') {
    return (
      <div className="my-8">
        <LyraChatRenderer
          element={element}
          lessonContext={lessonContext}
          chatEngagement={chatEngagement}
          isBlockingContent={isBlockingContent}
          onEngagementChange={handleChatEngagement}
          initialEngagementCount={chatEngagement.exchangeCount}
        />
      </div>
    );
  }

  // Special rendering for AI components with avatars and icons
  if (['multiple_choice_scenarios', 'ai_impact_story_creator', 'ai_content_generator'].includes(element.type)) {
    const assets = getAIComponentAssets(element.type);
    
    return (
      <Card className="shadow-sm backdrop-blur-sm transition-all duration-300 my-8 border border-purple-200/50">
        <CardContent className="p-8">
          {assets && (
            <div className="flex flex-col items-center mb-8">
              {/* Avatar */}
              <div className="mb-6">
                <img 
                  src={assets.avatar} 
                  alt="AI Assistant" 
                  className="w-16 h-16 rounded-full border-2 border-purple-200 shadow-lg"
                  onError={(e) => {
                    console.log('Avatar failed to load:', assets.avatar);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Title with flanking icons */}
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={assets.leftIcon} 
                  alt="" 
                  className="w-6 h-6 opacity-70"
                  onError={(e) => {
                    console.log('Left icon failed to load:', assets.leftIcon);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  {element.title}
                </h2>
                <img 
                  src={assets.rightIcon} 
                  alt="" 
                  className="w-6 h-6 opacity-70"
                  onError={(e) => {
                    console.log('Right icon failed to load:', assets.rightIcon);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Completion badge */}
              {isElementCompleted && (
                <Badge className="bg-green-100 text-green-700 mb-4">
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          )}
          
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  const IconComponent = getElementIcon(element.type);

  return (
    <Card className={cn("shadow-sm backdrop-blur-sm transition-all duration-300 my-8", getElementStyle(element.type))}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            <IconComponent className="w-4 h-4" />
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
