import React, { memo, useMemo, Suspense, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElementCompletion } from './interactive/hooks/useElementCompletion';
import { useElementAnalytics } from '@/hooks/useElementAnalytics';
import { getElementIcon, getElementStyle } from './interactive/utils/elementUtils';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';
import { loadComponent, getComponentName } from './interactive/componentLoader';
import { SafeErrorBoundary, initializeDebugger } from './interactive/debugLazy';
import { CalloutBoxRenderer } from './interactive/CalloutBoxRenderer';
import { LyraChatRenderer } from './interactive/LyraChatRenderer';

// Initialize debugging on import
if (typeof window !== 'undefined') {
  initializeDebugger();
}

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
  chatEngagement?: {
    hasReachedMinimum: boolean;
    exchangeCount: number;
  };
}

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
    <span className="ml-2 text-gray-600">Loading component...</span>
  </div>
);

// Error boundary component
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Helper function to get avatar and icons for AI components
const getAIComponentAssets = (type: string) => {
  const iconMap: Record<string, { avatar: string; leftIcon: string; rightIcon: string }> = {
    'ai_content_generator': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('communication.png'),
      rightIcon: getSupabaseIconUrl('data-analytics.png')
    },
    'multiple_choice_scenarios': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('learning-target.png'),
      rightIcon: getSupabaseIconUrl('achievement-trophy.png')
    },
    'ai_impact_story_creator': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('mission-heart.png'),
      rightIcon: getSupabaseIconUrl('growth-plant.png')
    },
    'sequence_sorter': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('workflow-process.png'),
      rightIcon: getSupabaseIconUrl('workflow-process.png')
    },
    'ai_email_composer': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('communication.png'),
      rightIcon: getSupabaseIconUrl('communication.png')
    },
    'prompt_builder': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('workflow-process.png'),
      rightIcon: getSupabaseIconUrl('learning-target.png')
    },
    'document_generator': {
      avatar: getSupabaseIconUrl('lyra-avatar.png'),
      leftIcon: getSupabaseIconUrl('document-creation.png'),
      rightIcon: getSupabaseIconUrl('document-creation.png')
    },
    // Add other mappings as needed...
  };
  
  return iconMap[type] || null;
};

const InteractiveElementRendererComponent: React.FC<InteractiveElementRendererProps> = ({
  element,
  lessonId,
  lessonContext,
  onChatEngagementChange,
  onElementComplete,
  isBlockingContent = false,
  chatEngagement
}) => {
  const { isElementCompleted, markElementComplete } = useElementCompletion(
    element.id, 
    lessonId, 
    onElementComplete
  );

  // Initialize analytics tracking
  const analytics = useElementAnalytics({
    elementId: element.id,
    elementType: element.type,
    lessonId,
    onComplete: onElementComplete
  });

  // Track element start when it becomes visible
  useEffect(() => {
    analytics.trackStart();
  }, []);

  const handleElementComplete = async () => {
    await markElementComplete();
    analytics.trackComplete();
  };

  // Stable chat engagement handler
  const handleChatEngagement = useMemo(() => {
    return async (engagement: {
      hasReachedMinimum: boolean;
      exchangeCount: number;
    }) => {
      onChatEngagementChange?.(engagement);
      if (engagement.hasReachedMinimum && !isElementCompleted) {
        await markElementComplete();
      }
    };
  }, [onChatEngagementChange, isElementCompleted, markElementComplete]);

  // Dynamic component rendering
  const renderDynamicContent = () => {
    try {
      console.log('InteractiveElementRenderer: renderDynamicContent called for element:', element.id);
      
      // Ensure all properties are strings to prevent "Cannot convert object to primitive value" error
      const elementTitle = typeof element.title === 'string' ? element.title : String(element.title || '');
      const elementType = typeof element.type === 'string' ? element.type : String(element.type || '');
      const elementContent = typeof element.content === 'string' ? element.content : String(element.content || '');
      
      console.log('InteractiveElementRenderer: Element props processed:', {
        id: element.id,
        type: elementType,
        title: elementTitle.substring(0, 50) + (elementTitle.length > 50 ? '...' : ''),
        lessonId
      });
      
      const componentName = getComponentName(elementType, lessonId, elementTitle);
      console.log('InteractiveElementRenderer: getComponentName returned:', componentName);
      
      if (!componentName) {
        console.log('InteractiveElementRenderer: No component mapping, using fallback content');
        // Fallback for unmapped components
        return <p className="text-gray-700">{elementContent}</p>;
      }
      
      console.log('InteractiveElementRenderer: Loading component:', componentName);
      const DynamicComponent = loadComponent(componentName);
      console.log('InteractiveElementRenderer: Component loaded successfully:', componentName);
      
      // Props based on component type
      const componentProps: any = {
        element: {
          ...element,
          title: elementTitle,
          type: elementType,
          content: elementContent
        },
        onComplete: handleElementComplete,
        isElementCompleted,
        analytics, // Pass analytics to all components
      };
      
      // Add specific props for different component types
      if (elementType === 'lyra_chat') {
        Object.assign(componentProps, {
          lessonContext,
          chatEngagement: chatEngagement || { hasReachedMinimum: false, exchangeCount: 0 },
          isBlockingContent,
          onEngagementChange: handleChatEngagement,
          initialEngagementCount: chatEngagement?.exchangeCount || 0,
        });
      }
      
      // Additional debugging for the lazy component
      console.log('InteractiveElementRenderer: Rendering component with props:', {
        componentName,
        elementId: element.id,
        propsKeys: Object.keys(componentProps),
        componentType: typeof DynamicComponent,
        hasPayload: '_payload' in DynamicComponent
      });
      
      return (
        <SafeErrorBoundary 
          fallback={
            <div className="text-red-600 p-4 border border-red-200 rounded bg-red-50">
              <p className="font-medium">Component Error</p>
              <p className="text-sm mt-1">Failed to render {componentName}</p>
              <p className="text-xs mt-2 text-gray-500">Element ID: {element.id}</p>
            </div>
          }
        >
          <Suspense fallback={<LoadingComponent />}>
            <DynamicComponent {...componentProps} />
          </Suspense>
        </SafeErrorBoundary>
      );
    } catch (error) {
      console.error('InteractiveElementRenderer: Critical error in renderDynamicContent:', {
        error: String(error),
        message: error?.message ? String(error.message) : 'No message',
        elementId: element.id,
        elementType: typeof element.type + ' ' + String(element.type || ''),
        elementTitle: typeof element.title + ' ' + String(element.title || '').substring(0, 50),
        lessonId
      });
      const safeContent = typeof element.content === 'string' ? element.content : String(element.content || 'Content not available');
      return (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <p className="text-red-600 font-medium">Component Error</p>
          <p className="text-gray-700">{safeContent}</p>
          <p className="text-xs text-gray-500 mt-2">Element ID: {element.id}</p>
        </div>
      );
    }
  };

  // Special rendering for callout box - no card wrapper
  if (element.type === 'callout_box') {
    console.log('[InteractiveElementRenderer] Rendering CalloutBoxRenderer directly (no React.lazy)');
    return (
      <CalloutBoxRenderer
        element={element}
        isElementCompleted={isElementCompleted}
        onComplete={handleElementComplete}
        analytics={analytics}
      />
    );
  }

  // Special rendering for lyra_chat - no card wrapper
  if (element.type === 'lyra_chat') {
    console.log('[InteractiveElementRenderer] Rendering LyraChatRenderer directly (no React.lazy)');
    return (
      <div className="my-8">
        <LyraChatRenderer
          element={element}
          lessonContext={lessonContext}
          chatEngagement={chatEngagement || { hasReachedMinimum: false, exchangeCount: 0 }}
          isBlockingContent={isBlockingContent}
          onEngagementChange={handleChatEngagement}
          initialEngagementCount={chatEngagement?.exchangeCount || 0}
          analytics={analytics}
        />
      </div>
    );
  }

  // Check if this is an AI component with special rendering
  const aiComponentTypes = [
    'multiple_choice_scenarios', 'ai_impact_story_creator', 'ai_content_generator', 
    'sequence_sorter', 'ai_email_composer', 'prompt_builder', 'document_generator',
    'document_improver', 'template_creator', 'report_generator', 'difficult_conversation_helper',
    'agenda_creator', 'meeting_prep_assistant', 'summary_generator', 'research_assistant',
    'information_summarizer', 'task_prioritizer', 'project_planner', 'ai_social_media_generator',
    'social_media_generator', 'hashtag_optimizer', 'engagement_predictor', 'ai_email_campaign_writer',
    'subject_line_tester', 'content_calendar_builder', 'content_repurposer', 'data_analyzer',
    'impact_dashboard_creator', 'survey_creator', 'report_builder', 'donor_insights_analyzer',
    'trend_identifier', 'kpi_tracker', 'data_storyteller', 'workflow_automator', 'task_scheduler',
    'email_automation_builder', 'data_entry_automator', 'process_optimizer', 'integration_builder',
    'time_tracker', 'ai_readiness_assessor', 'team_ai_trainer', 'change_leader', 'ai_governance_builder',
    'impact_measurement', 'innovation_roadmap', 'storytelling_agent', 'content_audit_agent',
    'chapter_builder_agent', 'database_debugger', 'interactive_element_auditor', 
    'interactive_element_builder', 'element_workflow_coordinator', 'automated_element_enhancer'
  ];

  if (aiComponentTypes.includes(element.type)) {
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
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  {typeof element.title === 'string' ? element.title : String(element.title || '')}
                </h2>
                <img 
                  src={assets.rightIcon} 
                  alt="" 
                  className="w-6 h-6 opacity-70"
                  onError={(e) => {
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
          
          {renderDynamicContent()}
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
            {typeof element.title === 'string' ? element.title : String(element.title || '')}
          </CardTitle>
          {isElementCompleted && (
            <Badge className="bg-green-100 text-green-700 ml-auto">
              <CheckSquare className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {element.type === 'lyra_chat' && chatEngagement?.hasReachedMinimum && (
            <Badge className="bg-purple-100 text-purple-700 ml-auto">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderDynamicContent()}
      </CardContent>
    </Card>
  );
};

export const InteractiveElementRenderer = memo(InteractiveElementRendererComponent);