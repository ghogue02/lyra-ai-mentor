
import React, { memo, useMemo } from 'react';
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
import { getElementIcon, getElementStyle } from './interactive/utils/elementUtils';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';
import { AIEmailComposer } from '@/components/testing/AIEmailComposer';
import { MayaParentResponseEmail } from '@/components/interactive/MayaParentResponseEmail';
import { MayaEmailConfidenceBuilder } from '@/components/interactive/MayaEmailConfidenceBuilder';
import { MayaPromptSandwichBuilder } from '@/components/interactive/MayaPromptSandwichBuilder';
import { MayaGrantProposal } from '@/components/interactive/MayaGrantProposal';
import { MayaGrantProposalAdvanced } from '@/components/interactive/MayaGrantProposalAdvanced';
import { MayaBoardMeetingPrep } from '@/components/interactive/MayaBoardMeetingPrep';
import { MayaResearchSynthesis } from '@/components/interactive/MayaResearchSynthesis';
import { SofiaMissionStoryCreator } from '@/components/interactive/SofiaMissionStoryCreator';
import { SofiaVoiceDiscovery } from '@/components/interactive/SofiaVoiceDiscovery';
import { SofiaStoryBreakthrough } from '@/components/interactive/SofiaStoryBreakthrough';
import { SofiaImpactScaling } from '@/components/interactive/SofiaImpactScaling';
import { DavidDataRevival } from '@/components/interactive/DavidDataRevival';
import { DavidDataStoryFinder } from '@/components/interactive/DavidDataStoryFinder';
import { DavidPresentationMaster } from '@/components/interactive/DavidPresentationMaster';
import { DavidSystemBuilder } from '@/components/interactive/DavidSystemBuilder';
import { RachelAutomationVision } from '@/components/interactive/RachelAutomationVision';
import { RachelWorkflowDesigner } from '@/components/interactive/RachelWorkflowDesigner';
import { RachelProcessTransformer } from '@/components/interactive/RachelProcessTransformer';
import { RachelEcosystemBuilder } from '@/components/interactive/RachelEcosystemBuilder';
import { AlexChangeStrategy } from '@/components/interactive/AlexChangeStrategy';
import { AlexVisionBuilder } from '@/components/interactive/AlexVisionBuilder';
import { AlexRoadmapCreator } from '@/components/interactive/AlexRoadmapCreator';
import { AlexLeadershipFramework } from '@/components/interactive/AlexLeadershipFramework';
import { GrantWritingAssistantDemo } from '@/components/testing/GrantWritingAssistantDemo';
import { DonorPersonaGenerator } from '@/components/testing/DonorPersonaGenerator';
import { DocumentGenerator } from '@/components/testing/DocumentGenerator';
import { DocumentImprover } from '@/components/testing/DocumentImprover';
import { TemplateCreator } from '@/components/testing/TemplateCreator';
import { AgendaCreator } from '@/components/testing/AgendaCreator';
import { MeetingPrepAssistant } from '@/components/testing/MeetingPrepAssistant';
import { SummaryGenerator } from '@/components/testing/SummaryGenerator';
import { ResearchAssistant } from '@/components/testing/ResearchAssistant';
import { InformationSummarizer } from '@/components/testing/InformationSummarizer';
import { TaskPrioritizer } from '@/components/testing/TaskPrioritizer';
import { ProjectPlanner } from '@/components/testing/ProjectPlanner';
import { AISocialMediaGenerator } from '@/components/testing/AISocialMediaGenerator';
import { HashtagOptimizer } from '@/components/testing/HashtagOptimizer';
import { EngagementPredictor } from '@/components/testing/EngagementPredictor';
import { AIEmailCampaignWriter } from '@/components/testing/AIEmailCampaignWriter';
import { SubjectLineTester } from '@/components/testing/SubjectLineTester';
import { ContentCalendarBuilder } from '@/components/testing/ContentCalendarBuilder';
import { ContentRepurposer } from '@/components/testing/ContentRepurposer';
import { DataAnalyzer } from '@/components/testing/DataAnalyzer';
import { ImpactDashboardCreator } from '@/components/testing/ImpactDashboardCreator';
import { SurveyCreator } from '@/components/testing/SurveyCreator';
import { ReportBuilder } from '@/components/testing/ReportBuilder';
import { DonorInsightsAnalyzer } from '@/components/testing/DonorInsightsAnalyzer';
import { TrendIdentifier } from '@/components/testing/TrendIdentifier';
import { KPITracker } from '@/components/testing/KPITracker';
import { DataStoryteller } from '@/components/testing/DataStoryteller';
import { WorkflowAutomator } from '@/components/testing/WorkflowAutomator';
import { TaskScheduler } from '@/components/testing/TaskScheduler';
import { EmailAutomationBuilder } from '@/components/testing/EmailAutomationBuilder';
import { DataEntryAutomator } from '@/components/testing/DataEntryAutomator';
import { ProcessOptimizer } from '@/components/testing/ProcessOptimizer';
import { IntegrationBuilder } from '@/components/testing/IntegrationBuilder';
import { TimeTracker } from '@/components/testing/TimeTracker';
import { AIReadinessAssessor } from '@/components/testing/AIReadinessAssessor';
import { TeamAITrainer } from '@/components/testing/TeamAITrainer';
import { ChangeLeader } from '@/components/testing/ChangeLeader';
import { AIGovernanceBuilder } from '@/components/testing/AIGovernanceBuilder';
import { ImpactMeasurement } from '@/components/testing/ImpactMeasurement';
import { InnovationRoadmap } from '@/components/testing/InnovationRoadmap';
import { StorytellingAgent } from '@/components/testing/StorytellingAgent';
import { ContentAuditAgent } from '@/components/testing/ContentAuditAgent';
import { ChapterBuilderAgent } from '@/components/testing/ChapterBuilderAgent';
import { DatabaseDebugger } from '@/components/testing/DatabaseDebugger';
import { InteractiveElementAuditor } from '@/components/testing/InteractiveElementAuditor';
import { InteractiveElementBuilder } from '@/components/testing/InteractiveElementBuilder';
import { ElementWorkflowCoordinator } from '@/components/testing/ElementWorkflowCoordinator';
import { AutomatedElementEnhancer } from '@/components/testing/AutomatedElementEnhancer';
import { DifficultConversationHelper } from '@/components/testing/DifficultConversationHelper';

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
    case 'sequence_sorter':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('workflow-process.png'),
        rightIcon: getSupabaseIconUrl('workflow-process.png')
      };
    case 'ai_email_composer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('communication.png'),
        rightIcon: getSupabaseIconUrl('communication.png')
      };
    case 'prompt_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('workflow-process.png'),
        rightIcon: getSupabaseIconUrl('learning-target.png')
      };
    case 'document_generator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('document-creation.png'),
        rightIcon: getSupabaseIconUrl('document-creation.png')
      };
    case 'document_improver':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('improvement-optimization.png'),
        rightIcon: getSupabaseIconUrl('improvement-optimization.png')
      };
    case 'template_creator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('template-library.png'),
        rightIcon: getSupabaseIconUrl('template-library.png')
      };
    case 'difficult_conversation_helper':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('communication.png'),
        rightIcon: getSupabaseIconUrl('communication.png')
      };
    case 'report_generator': // Alias for document_generator
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('document-creation.png'),
        rightIcon: getSupabaseIconUrl('document-creation.png')
      };
    case 'agenda_creator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('meeting-calendar.png'),
        rightIcon: getSupabaseIconUrl('meeting-calendar.png')
      };
    case 'meeting_prep_assistant':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('preparation-checklist.png'),
        rightIcon: getSupabaseIconUrl('preparation-checklist.png')
      };
    case 'summary_generator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('document-summary.png'),
        rightIcon: getSupabaseIconUrl('document-summary.png')
      };
    case 'research_assistant':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('research-magnify.png'),
        rightIcon: getSupabaseIconUrl('research-magnify.png')
      };
    case 'information_summarizer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('information-layers.png'),
        rightIcon: getSupabaseIconUrl('information-layers.png')
      };
    case 'task_prioritizer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('task-checklist.png'),
        rightIcon: getSupabaseIconUrl('task-checklist.png')
      };
    case 'project_planner':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('project-gantt.png'),
        rightIcon: getSupabaseIconUrl('project-gantt.png')
      };
    case 'ai_social_media_generator':
    case 'social_media_generator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('social-media.png'),
        rightIcon: getSupabaseIconUrl('social-media.png')
      };
    case 'hashtag_optimizer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('hashtag-trend.png'),
        rightIcon: getSupabaseIconUrl('hashtag-trend.png')
      };
    case 'engagement_predictor':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('engagement-analytics.png'),
        rightIcon: getSupabaseIconUrl('engagement-analytics.png')
      };
    case 'ai_email_campaign_writer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('email-campaign.png'),
        rightIcon: getSupabaseIconUrl('email-campaign.png')
      };
    case 'subject_line_tester':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('email-testing.png'),
        rightIcon: getSupabaseIconUrl('email-testing.png')
      };
    case 'content_calendar_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('content-calendar.png'),
        rightIcon: getSupabaseIconUrl('content-calendar.png')
      };
    case 'content_repurposer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('content-repurpose.png'),
        rightIcon: getSupabaseIconUrl('content-repurpose.png')
      };
    case 'data_analyzer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('data-analysis.png'),
        rightIcon: getSupabaseIconUrl('data-analysis.png')
      };
    case 'impact_dashboard_creator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('dashboard-impact.png'),
        rightIcon: getSupabaseIconUrl('dashboard-impact.png')
      };
    case 'survey_creator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('survey-feedback.png'),
        rightIcon: getSupabaseIconUrl('survey-feedback.png')
      };
    case 'report_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('report-document.png'),
        rightIcon: getSupabaseIconUrl('report-document.png')
      };
    case 'donor_insights_analyzer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('donor-insights.png'),
        rightIcon: getSupabaseIconUrl('donor-insights.png')
      };
    case 'trend_identifier':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('trend-analysis.png'),
        rightIcon: getSupabaseIconUrl('trend-analysis.png')
      };
    case 'kpi_tracker':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('kpi-metrics.png'),
        rightIcon: getSupabaseIconUrl('kpi-metrics.png')
      };
    case 'data_storyteller':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('data-story.png'),
        rightIcon: getSupabaseIconUrl('data-story.png')
      };
    case 'workflow_automator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('workflow-automation.png'),
        rightIcon: getSupabaseIconUrl('workflow-automation.png')
      };
    case 'task_scheduler':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('task-schedule.png'),
        rightIcon: getSupabaseIconUrl('task-schedule.png')
      };
    case 'email_automation_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('email-automation.png'),
        rightIcon: getSupabaseIconUrl('email-automation.png')
      };
    case 'data_entry_automator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('data-entry.png'),
        rightIcon: getSupabaseIconUrl('data-entry.png')
      };
    case 'process_optimizer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('process-optimization.png'),
        rightIcon: getSupabaseIconUrl('process-optimization.png')
      };
    case 'integration_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('integration-connect.png'),
        rightIcon: getSupabaseIconUrl('integration-connect.png')
      };
    case 'time_tracker':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('time-tracking.png'),
        rightIcon: getSupabaseIconUrl('time-tracking.png')
      };
    case 'ai_readiness_assessor':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('ai-readiness.png'),
        rightIcon: getSupabaseIconUrl('ai-readiness.png')
      };
    case 'team_ai_trainer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('team-training.png'),
        rightIcon: getSupabaseIconUrl('team-training.png')
      };
    case 'change_leader':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('change-management.png'),
        rightIcon: getSupabaseIconUrl('change-management.png')
      };
    case 'ai_governance_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('governance-shield.png'),
        rightIcon: getSupabaseIconUrl('governance-shield.png')
      };
    case 'impact_measurement':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('impact-metrics.png'),
        rightIcon: getSupabaseIconUrl('impact-metrics.png')
      };
    case 'innovation_roadmap':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('innovation-rocket.png'),
        rightIcon: getSupabaseIconUrl('innovation-rocket.png')
      };
    case 'storytelling_agent':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('storytelling-magic.png'),
        rightIcon: getSupabaseIconUrl('storytelling-magic.png')
      };
    case 'content_audit_agent':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('audit-search.png'),
        rightIcon: getSupabaseIconUrl('audit-search.png')
      };
    case 'chapter_builder_agent':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('chapter-builder.png'),
        rightIcon: getSupabaseIconUrl('chapter-builder.png')
      };
    case 'database_debugger':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('database-debug.png'),
        rightIcon: getSupabaseIconUrl('database-debug.png')
      };
    case 'interactive_element_auditor':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('audit-search.png'),
        rightIcon: getSupabaseIconUrl('audit-search.png')
      };
    case 'interactive_element_builder':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('workflow-process.png'),
        rightIcon: getSupabaseIconUrl('workflow-process.png')
      };
    case 'element_workflow_coordinator':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('network-connection.png'),
        rightIcon: getSupabaseIconUrl('network-connection.png')
      };
    case 'automated_element_enhancer':
      return {
        avatar: getSupabaseIconUrl('lyra-avatar.png'),
        leftIcon: getSupabaseIconUrl('workflow-process.png'),
        rightIcon: getSupabaseIconUrl('workflow-process.png')
      };
    default:
      return null;
  }
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

  const handleElementComplete = async () => {
    await markElementComplete();
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
            chatEngagement={chatEngagement || { hasReachedMinimum: false, exchangeCount: 0 }}
            isBlockingContent={isBlockingContent}
            onEngagementChange={handleChatEngagement}
            initialEngagementCount={chatEngagement?.exchangeCount || 0}
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
        return <MultipleChoiceScenarios />;
      case 'ai_impact_story_creator':
        return <AIImpactStoryCreator />;
      case 'ai_content_generator':
        // Check for Sofia's Mission Story Creator in lesson 11
        if (lessonId === 11 && element.title?.includes('Sofia')) {
          return <SofiaMissionStoryCreator onComplete={handleElementComplete} />;
        }
        // Check for David's Data Revival in lesson 15
        if (lessonId === 15 && element.title?.includes('David')) {
          return <DavidDataRevival onComplete={handleElementComplete} />;
        }
        return <AIContentGenerator />;
      case 'grant_writing_assistant_demo':
        return <GrantWritingAssistantDemo />;
      case 'donor_persona_generator':
        return <DonorPersonaGenerator />;
      case 'ai_email_composer':
        // Maya's Parent Response Helper - specific parent concern scenario
        if (element.title === "Maya's Parent Response Email Helper") {
          return <MayaParentResponseEmail onComplete={handleElementComplete} />;
        }
        // Maya's Email Confidence Builder - general email anxiety scenario
        if (element.title === "Turn Maya's Email Anxiety into Connection") {
          return <MayaEmailConfidenceBuilder onComplete={handleElementComplete} />;
        }
        // Legacy support for older Maya email elements
        if (element.title === "Help Maya Write the Parent Response" ||
            (lessonId === 5 && element.title?.includes('Maya') && element.title.includes('Parent'))) {
          return <MayaParentResponseEmail onComplete={handleElementComplete} />;
        }
        // Check for Sofia's Story Breakthrough in lesson 13
        if (lessonId === 13 && element.title?.includes('Sofia')) {
          return <SofiaStoryBreakthrough onComplete={handleElementComplete} />;
        }
        return <AIEmailComposer />;
      case 'prompt_builder':
        // Maya's Prompt Sandwich Builder
        if (element.title === "Master the AI Prompt Sandwich") {
          return <MayaPromptSandwichBuilder onComplete={handleElementComplete} />;
        }
        // Default fallback
        return <p className="text-gray-700">{element.content}</p>;
      case 'document_generator':
      case 'report_generator': // Alias for SQL compatibility
        // Maya's Strategic Grant Proposal Builder - advanced strategic approach
        if (element.title === "Maya's Strategic Grant Proposal Builder") {
          return <MayaGrantProposalAdvanced onComplete={handleElementComplete} />;
        }
        // Maya's Grant Proposal Challenge - basic grant proposal
        if (element.title === "Maya's Grant Proposal Challenge" || 
            (lessonId === 6 && element.title?.includes('Maya') && element.title.includes('Proposal'))) {
          return <MayaGrantProposal onComplete={handleElementComplete} />;
        }
        // Check for David's Presentation Master in lesson 17
        if (lessonId === 17 && element.title?.includes('David')) {
          return <DavidPresentationMaster onComplete={handleElementComplete} />;
        }
        return <DocumentGenerator onComplete={handleElementComplete} />;
      case 'document_improver':
        // Check for Sofia's Voice Discovery in lesson 12
        if (lessonId === 12 && element.title?.includes('Sofia')) {
          return <SofiaVoiceDiscovery onComplete={handleElementComplete} />;
        }
        return <DocumentImprover onComplete={handleElementComplete} />;
      case 'template_creator':
        // Check for Sofia's Impact Scaling in lesson 14
        if (lessonId === 14 && element.title?.includes('Sofia')) {
          return <SofiaImpactScaling onComplete={handleElementComplete} />;
        }
        // Check for David's System Builder in lesson 18
        if (lessonId === 18 && element.title?.includes('David')) {
          return <DavidSystemBuilder onComplete={handleElementComplete} />;
        }
        return <TemplateCreator onComplete={handleElementComplete} />;
      case 'agenda_creator':
        return <AgendaCreator onComplete={handleElementComplete} />;
      case 'meeting_prep_assistant':
        // Check if this is Maya's board meeting prep element in lesson 7
        if (lessonId === 7 && element.title?.includes('Maya')) {
          return <MayaBoardMeetingPrep onComplete={handleElementComplete} />;
        }
        return <MeetingPrepAssistant onComplete={handleElementComplete} />;
      case 'summary_generator':
        return <SummaryGenerator onComplete={handleElementComplete} />;
      case 'research_assistant':
        // Check if this is Maya's research synthesis element in lesson 8
        if (lessonId === 8 && element.title?.includes('Maya')) {
          return <MayaResearchSynthesis onComplete={handleElementComplete} />;
        }
        return <ResearchAssistant onComplete={handleElementComplete} />;
      case 'information_summarizer':
        return <InformationSummarizer onComplete={handleElementComplete} />;
      case 'task_prioritizer':
        return <TaskPrioritizer onComplete={handleElementComplete} />;
      case 'project_planner':
        return <ProjectPlanner onComplete={handleElementComplete} />;
      case 'ai_social_media_generator':
      case 'social_media_generator':
        return <AISocialMediaGenerator onComplete={handleElementComplete} />;
      case 'hashtag_optimizer':
        return <HashtagOptimizer onComplete={handleElementComplete} />;
      case 'engagement_predictor':
        return <EngagementPredictor onComplete={handleElementComplete} />;
      case 'ai_email_campaign_writer':
        return <AIEmailCampaignWriter onComplete={handleElementComplete} />;
      case 'subject_line_tester':
        return <SubjectLineTester onComplete={handleElementComplete} />;
      case 'content_calendar_builder':
        return <ContentCalendarBuilder onComplete={handleElementComplete} />;
      case 'content_repurposer':
        return <ContentRepurposer onComplete={handleElementComplete} />;
      case 'data_analyzer':
        return <DataAnalyzer onComplete={handleElementComplete} />;
      case 'impact_dashboard_creator':
        return <ImpactDashboardCreator onComplete={handleElementComplete} />;
      case 'survey_creator':
        return <SurveyCreator onComplete={handleElementComplete} />;
      case 'report_builder':
        return <ReportBuilder onComplete={handleElementComplete} />;
      case 'donor_insights_analyzer':
        return <DonorInsightsAnalyzer onComplete={handleElementComplete} />;
      case 'trend_identifier':
        return <TrendIdentifier onComplete={handleElementComplete} />;
      case 'kpi_tracker':
        return <KPITracker onComplete={handleElementComplete} />;
      case 'data_storyteller':
        // Check for David's Data Story Finder in lesson 16
        if (lessonId === 16 && element.title?.includes('David')) {
          return <DavidDataStoryFinder onComplete={handleElementComplete} />;
        }
        return <DataStoryteller onComplete={handleElementComplete} />;
      case 'workflow_automator':
        // Check for Rachel's Automation Vision in lesson 19
        if (lessonId === 19 && element.title?.includes('Rachel')) {
          return <RachelAutomationVision onComplete={handleElementComplete} />;
        }
        return <WorkflowAutomator onComplete={handleElementComplete} />;
      case 'task_scheduler':
        return <TaskScheduler onComplete={handleElementComplete} />;
      case 'email_automation_builder':
        return <EmailAutomationBuilder onComplete={handleElementComplete} />;
      case 'data_entry_automator':
        return <DataEntryAutomator onComplete={handleElementComplete} />;
      case 'process_optimizer':
        // Check for Rachel's Workflow Designer in lesson 20
        if (lessonId === 20 && element.title?.includes('Rachel')) {
          return <RachelWorkflowDesigner onComplete={handleElementComplete} />;
        }
        return <ProcessOptimizer onComplete={handleElementComplete} />;
      case 'integration_builder':
        // Check for Rachel's Ecosystem Builder in lesson 22
        if (lessonId === 22 && element.title?.includes('Rachel')) {
          return <RachelEcosystemBuilder onComplete={handleElementComplete} />;
        }
        return <IntegrationBuilder onComplete={handleElementComplete} />;
      case 'time_tracker':
        return <TimeTracker onComplete={handleElementComplete} />;
      case 'ai_readiness_assessor':
        return <AIReadinessAssessor onComplete={handleElementComplete} />;
      case 'team_ai_trainer':
        return <TeamAITrainer onComplete={handleElementComplete} />;
      case 'change_leader':
        // Check for Alex's Change Strategy in lesson 23
        if (lessonId === 23 && element.title?.includes('Alex')) {
          return <AlexChangeStrategy onComplete={handleElementComplete} />;
        }
        return <ChangeLeader onComplete={handleElementComplete} />;
      case 'ai_governance_builder':
        // Check for Alex's Vision Builder in lesson 24
        if (lessonId === 24 && element.title?.includes('Alex')) {
          return <AlexVisionBuilder onComplete={handleElementComplete} />;
        }
        // Check for Alex's Leadership Framework in lesson 26
        if (lessonId === 26 && element.title?.includes('Alex')) {
          return <AlexLeadershipFramework onComplete={handleElementComplete} />;
        }
        return <AIGovernanceBuilder onComplete={handleElementComplete} />;
      case 'impact_measurement':
        // Check for Rachel's Process Transformer in lesson 21
        if (lessonId === 21 && element.title?.includes('Rachel')) {
          return <RachelProcessTransformer onComplete={handleElementComplete} />;
        }
        return <ImpactMeasurement onComplete={handleElementComplete} />;
      case 'innovation_roadmap':
        // Check for Alex's Roadmap Creator in lesson 25
        if (lessonId === 25 && element.title?.includes('Alex')) {
          return <AlexRoadmapCreator onComplete={handleElementComplete} />;
        }
        return <InnovationRoadmap onComplete={handleElementComplete} />;
      case 'storytelling_agent':
        return <StorytellingAgent onComplete={handleElementComplete} />;
      case 'content_audit_agent':
        return <ContentAuditAgent onComplete={handleElementComplete} />;
      case 'chapter_builder_agent':
        return <ChapterBuilderAgent onComplete={handleElementComplete} />;
      case 'database_debugger':
        return <DatabaseDebugger onComplete={handleElementComplete} />;
      case 'interactive_element_auditor':
        return <InteractiveElementAuditor onComplete={handleElementComplete} />;
      case 'interactive_element_builder':
        return <InteractiveElementBuilder onComplete={handleElementComplete} />;
      case 'element_workflow_coordinator':
        return <ElementWorkflowCoordinator onComplete={handleElementComplete} />;
      case 'automated_element_enhancer':
        return <AutomatedElementEnhancer onComplete={handleElementComplete} />;
      case 'difficult_conversation_helper':
        return <DifficultConversationHelper onComplete={handleElementComplete} />;
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
          chatEngagement={chatEngagement || { hasReachedMinimum: false, exchangeCount: 0 }}
          isBlockingContent={isBlockingContent}
          onEngagementChange={handleChatEngagement}
          initialEngagementCount={chatEngagement?.exchangeCount || 0}
        />
      </div>
    );
  }

  // Special rendering for AI components with avatars and icons
  if (['multiple_choice_scenarios', 'ai_impact_story_creator', 'ai_content_generator', 'sequence_sorter', 'ai_email_composer', 'prompt_builder', 'document_generator', 'document_improver', 'template_creator', 'report_generator', 'difficult_conversation_helper', 'agenda_creator', 'meeting_prep_assistant', 'summary_generator', 'research_assistant', 'information_summarizer', 'task_prioritizer', 'project_planner', 'ai_social_media_generator', 'social_media_generator', 'hashtag_optimizer', 'engagement_predictor', 'ai_email_campaign_writer', 'subject_line_tester', 'content_calendar_builder', 'content_repurposer', 'data_analyzer', 'impact_dashboard_creator', 'survey_creator', 'report_builder', 'donor_insights_analyzer', 'trend_identifier', 'kpi_tracker', 'data_storyteller', 'workflow_automator', 'task_scheduler', 'email_automation_builder', 'data_entry_automator', 'process_optimizer', 'integration_builder', 'time_tracker', 'ai_readiness_assessor', 'team_ai_trainer', 'change_leader', 'ai_governance_builder', 'impact_measurement', 'innovation_roadmap', 'storytelling_agent', 'content_audit_agent', 'chapter_builder_agent', 'database_debugger', 'interactive_element_auditor', 'interactive_element_builder', 'element_workflow_coordinator', 'automated_element_enhancer'].includes(element.type)) {
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
                  {element.title}
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
          {element.type === 'lyra_chat' && chatEngagement?.hasReachedMinimum && (
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

export const InteractiveElementRenderer = memo(InteractiveElementRendererComponent);
