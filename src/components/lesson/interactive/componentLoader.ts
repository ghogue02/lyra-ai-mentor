import React from 'react';
import { safeLazy } from './safeLazy';
import { getDirectComponent, shouldUseDirectImport } from './directImportLoader';

// Type for lazy-loaded components
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

// Cache for loaded components to avoid re-importing
const componentCache = new Map<string, LazyComponent | React.ComponentType<any>>();

// Component mapping configuration
const componentMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  // Core interactive components
  'KnowledgeCheckRenderer': () => import('./KnowledgeCheckRenderer'),
  'ReflectionRenderer': () => import('./ReflectionRenderer'),
  'LyraChatRenderer': () => import('./LyraChatRenderer'),
  'CalloutBoxRenderer': () => import('./CalloutBoxRenderer'),
  'SequenceSorterRenderer': () => import('./SequenceSorterRenderer'),
  
  // Maya components
  'MayaParentResponseEmail': () => import('@/components/interactive/MayaParentResponseEmail'),
  'MayaEmailConfidenceBuilder': () => import('@/components/interactive/MayaEmailConfidenceBuilder'),
  'MayaPromptSandwichBuilder': () => import('@/components/interactive/MayaPromptSandwichBuilder'),
  'MayaGrantProposal': () => import('@/components/interactive/MayaGrantProposal'),
  'MayaGrantProposalAdvanced': () => import('@/components/interactive/MayaGrantProposalAdvanced'),
  'MayaBoardMeetingPrep': () => import('@/components/interactive/MayaBoardMeetingPrep'),
  'MayaResearchSynthesis': () => import('@/components/interactive/MayaResearchSynthesis'),
  'MayaDocumentCreator': () => import('@/components/interactive/MayaDocumentCreator'),
  'MayaReportBuilder': () => import('@/components/interactive/MayaReportBuilder'),
  'MayaTemplateDesigner': () => import('@/components/interactive/MayaTemplateDesigner'),
  
  // Sofia components
  'SofiaMissionStoryCreator': () => import('@/components/interactive/SofiaMissionStoryCreator'),
  'SofiaVoiceDiscovery': () => import('@/components/interactive/SofiaVoiceDiscovery'),
  'SofiaStoryBreakthrough': () => import('@/components/interactive/SofiaStoryBreakthrough'),
  'SofiaImpactScaling': () => import('@/components/interactive/SofiaImpactScaling'),
  
  // David components
  'DavidDataRevival': () => import('@/components/interactive/DavidDataRevival'),
  'DavidDataStoryFinder': () => import('@/components/interactive/DavidDataStoryFinder'),
  'DavidPresentationMaster': () => import('@/components/interactive/DavidPresentationMaster'),
  'DavidSystemBuilder': () => import('@/components/interactive/DavidSystemBuilder'),
  
  // Rachel components
  'RachelAutomationVision': () => import('@/components/interactive/RachelAutomationVision'),
  'RachelWorkflowDesigner': () => import('@/components/interactive/RachelWorkflowDesigner'),
  'RachelProcessTransformer': () => import('@/components/interactive/RachelProcessTransformer'),
  'RachelEcosystemBuilder': () => import('@/components/interactive/RachelEcosystemBuilder'),
  
  // Alex components
  'AlexChangeStrategy': () => import('@/components/interactive/AlexChangeStrategy'),
  'AlexVisionBuilder': () => import('@/components/interactive/AlexVisionBuilder'),
  'AlexRoadmapCreator': () => import('@/components/interactive/AlexRoadmapCreator'),
  'AlexLeadershipFramework': () => import('@/components/interactive/AlexLeadershipFramework'),
  
  // Testing components (separate bundle)
  'AIContentGenerator': () => import('@/components/testing/AIContentGenerator'),
  'MultipleChoiceScenarios': () => import('@/components/testing/MultipleChoiceScenarios'),
  'AIImpactStoryCreator': () => import('@/components/testing/AIImpactStoryCreator'),
  'AIEmailComposer': () => import('@/components/testing/AIEmailComposer'),
  'GrantWritingAssistantDemo': () => import('@/components/testing/GrantWritingAssistantDemo'),
  'DonorPersonaGenerator': () => import('@/components/testing/DonorPersonaGenerator'),
  'DocumentGenerator': () => import('@/components/testing/DocumentGenerator'),
  'DocumentImprover': () => import('@/components/testing/DocumentImprover'),
  'TemplateCreator': () => import('@/components/testing/TemplateCreator'),
  'AgendaCreator': () => import('@/components/testing/AgendaCreator'),
  'MeetingPrepAssistant': () => import('@/components/testing/MeetingPrepAssistant'),
  'SummaryGenerator': () => import('@/components/testing/SummaryGenerator'),
  'ResearchAssistant': () => import('@/components/testing/ResearchAssistant'),
  'InformationSummarizer': () => import('@/components/testing/InformationSummarizer'),
  'TaskPrioritizer': () => import('@/components/testing/TaskPrioritizer'),
  'ProjectPlanner': () => import('@/components/testing/ProjectPlanner'),
  'AISocialMediaGenerator': () => import('@/components/testing/AISocialMediaGenerator'),
  'HashtagOptimizer': () => import('@/components/testing/HashtagOptimizer'),
  'EngagementPredictor': () => import('@/components/testing/EngagementPredictor'),
  'AIEmailCampaignWriter': () => import('@/components/testing/AIEmailCampaignWriter'),
  'SubjectLineTester': () => import('@/components/testing/SubjectLineTester'),
  'ContentCalendarBuilder': () => import('@/components/testing/ContentCalendarBuilder'),
  'ContentRepurposer': () => import('@/components/testing/ContentRepurposer'),
  'DataAnalyzer': () => import('@/components/testing/DataAnalyzer'),
  'ImpactDashboardCreator': () => import('@/components/testing/ImpactDashboardCreator'),
  'SurveyCreator': () => import('@/components/testing/SurveyCreator'),
  'ReportBuilder': () => import('@/components/testing/ReportBuilder'),
  'DonorInsightsAnalyzer': () => import('@/components/testing/DonorInsightsAnalyzer'),
  'TrendIdentifier': () => import('@/components/testing/TrendIdentifier'),
  'KPITracker': () => import('@/components/testing/KPITracker'),
  'DataStoryteller': () => import('@/components/testing/DataStoryteller'),
  'WorkflowAutomator': () => import('@/components/testing/WorkflowAutomator'),
  'TaskScheduler': () => import('@/components/testing/TaskScheduler'),
  'EmailAutomationBuilder': () => import('@/components/testing/EmailAutomationBuilder'),
  'DataEntryAutomator': () => import('@/components/testing/DataEntryAutomator'),
  'ProcessOptimizer': () => import('@/components/testing/ProcessOptimizer'),
  'IntegrationBuilder': () => import('@/components/testing/IntegrationBuilder'),
  'TimeTracker': () => import('@/components/testing/TimeTracker'),
  'AIReadinessAssessor': () => import('@/components/testing/AIReadinessAssessor'),
  'TeamAITrainer': () => import('@/components/testing/TeamAITrainer'),
  'ChangeLeader': () => import('@/components/testing/ChangeLeader'),
  'AIGovernanceBuilder': () => import('@/components/testing/AIGovernanceBuilder'),
  'ImpactMeasurement': () => import('@/components/testing/ImpactMeasurement'),
  'InnovationRoadmap': () => import('@/components/testing/InnovationRoadmap'),
  'StorytellingAgent': () => import('@/components/testing/StorytellingAgent'),
  'ContentAuditAgent': () => import('@/components/testing/ContentAuditAgent'),
  'ChapterBuilderAgent': () => import('@/components/testing/ChapterBuilderAgent'),
  'DatabaseDebugger': () => import('@/components/testing/DatabaseDebugger'),
  'InteractiveElementAuditor': () => import('@/components/testing/InteractiveElementAuditor'),
  'InteractiveElementBuilder': () => import('@/components/testing/InteractiveElementBuilder'),
  'ElementWorkflowCoordinator': () => import('@/components/testing/ElementWorkflowCoordinator'),
  'AutomatedElementEnhancer': () => import('@/components/testing/AutomatedElementEnhancer'),
  'DifficultConversationHelper': () => import('@/components/testing/DifficultConversationHelper'),
  'DebugChapter3Loader': () => import('@/components/testing/DebugChapter3Loader'),
};

/**
 * Load a component dynamically
 * @param componentName - Name of the component to load
 * @returns Lazy-loaded React component or direct component
 */
export function loadComponent(componentName: string): LazyComponent | React.ComponentType<any> {
  try {
    // Ensure componentName is a string
    const safeComponentName = typeof componentName === 'string' ? componentName : String(componentName || '');
    
    console.log('[ComponentLoader] =================');
    console.log('[ComponentLoader] loadComponent called:', { 
      componentName: safeComponentName,
      callerStack: new Error().stack?.split('\n').slice(2, 5).join('\n')
    });
    
    // Check if this component should use direct import
    if (shouldUseDirectImport(safeComponentName)) {
      const directComponent = getDirectComponent(safeComponentName);
      if (directComponent) {
        console.log('[ComponentLoader] ✅ Using DIRECT import for:', safeComponentName);
        return directComponent;
      }
    }
    
    // Check cache first
    if (componentCache.has(safeComponentName)) {
      console.log('[ComponentLoader] 📦 Using cached component:', safeComponentName);
      return componentCache.get(safeComponentName)!;
    }
    
    // Get the import function
    const importFn = componentMap[safeComponentName];
    if (!importFn) {
      const errorMsg = `Component ${safeComponentName} not found in component map`;
      console.error('[ComponentLoader] ❌ Error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('[ComponentLoader] ⚠️ Creating LAZY component for:', safeComponentName);
    console.log('[ComponentLoader] This might be the cause of object-to-primitive errors!');
    
    // Create lazy component with enhanced error handling
    const LazyComponent = React.lazy(() => 
      importFn().catch(error => {
        const errorStr = String(error);
        const errorMessage = error?.message || errorStr;
        console.error(`[ComponentLoader] Failed to load component ${safeComponentName}:`, {
          error: errorStr,
          message: errorMessage,
          stack: error?.stack ? String(error.stack) : 'No stack trace'
        });
        
        // Return a fallback component that renders a simple error message
        // Ensure all values are primitives to avoid object-to-primitive errors
        return {
          default: () => React.createElement('div', {
            className: 'p-4 text-red-600 border border-red-200 rounded',
            'data-error': 'component-load-failed'
          }, `Component "${String(safeComponentName)}" failed to load: ${String(errorMessage)}`)
        };
      })
    );
    
    // Cache it
    componentCache.set(safeComponentName, LazyComponent);
    console.log('[ComponentLoader] 📦 Cached lazy component:', safeComponentName);
    
    return LazyComponent;
  } catch (error) {
    console.error('[ComponentLoader] Critical error:', {
      error: String(error),
      componentName: String(componentName),
      type: typeof componentName
    });
    
    // Return a minimal fallback component
    return React.lazy(() => Promise.resolve({
      default: () => React.createElement('div', {
        className: 'p-4 text-red-600 border border-red-200 rounded'
      }, 'Component loading failed')
    }));
  }
}

/**
 * Get component by element type and context
 * @param elementType - Type of the interactive element
 * @param lessonId - ID of the lesson
 * @param elementTitle - Title of the element
 * @returns Component name to load
 */
export function getComponentName(
  elementType: string, 
  lessonId: number, 
  elementTitle: string | any
): string | null {
  try {
    // Ensure all parameters are safe primitives
    const safeElementType = typeof elementType === 'string' ? elementType : String(elementType || '');
    const safeLessonId = typeof lessonId === 'number' ? lessonId : parseInt(String(lessonId || 0));
    const title = typeof elementTitle === 'string' ? elementTitle : String(elementTitle || '');

    console.log('getComponentName called:', { 
      elementType: safeElementType, 
      lessonId: safeLessonId, 
      title: title.substring(0, 50) + (title.length > 50 ? '...' : '')
    });

    // Early validation to prevent object-to-primitive errors
    if (!safeElementType || !safeLessonId) {
      console.warn('getComponentName: Invalid parameters', { 
        elementType: safeElementType, 
        lessonId: safeLessonId, 
        elementTitle: title 
      });
      return null;
    }
  
  // Map element types to components based on business logic
  switch (safeElementType) {
    case 'knowledge_check':
      return 'KnowledgeCheckRenderer';
    
    case 'reflection':
      return 'ReflectionRenderer';
    
    case 'lyra_chat':
      return 'LyraChatRenderer';
    
    case 'callout_box':
      return 'CalloutBoxRenderer';
    
    case 'sequence_sorter':
      return 'SequenceSorterRenderer';
    
    case 'multiple_choice_scenarios':
      return 'MultipleChoiceScenarios';
    
    case 'ai_impact_story_creator':
      return 'AIImpactStoryCreator';
    
    case 'ai_content_generator':
      // Check for character-specific components
      if (safeLessonId === 11 && title.includes('Sofia')) {
        return 'SofiaMissionStoryCreator';
      }
      if (safeLessonId === 15 && title.includes('David')) {
        return 'DavidDataRevival';
      }
      return 'AIContentGenerator';
    
    case 'ai_email_composer':
      // Maya's email components
      if (title === "Maya's Parent Response Email Helper") {
        return 'MayaParentResponseEmail';
      }
      if (title === "Turn Maya's Email Anxiety into Connection") {
        return 'MayaEmailConfidenceBuilder';
      }
      // Sofia's components
      if (safeLessonId === 13 && title.includes('Sofia')) {
        return 'SofiaStoryBreakthrough';
      }
      return 'AIEmailComposer';
    
    case 'prompt_builder':
      if (title === "Master the AI Prompt Sandwich") {
        return 'MayaPromptSandwichBuilder';
      }
      return null;
    
    case 'document_generator':
    case 'report_generator':
      // Maya's document components
      if (title === "Maya's Strategic Grant Proposal Builder") {
        return 'MayaGrantProposalAdvanced';
      }
      if (title === "Maya's Grant Proposal Challenge" || 
          (safeLessonId === 6 && title.includes('Maya') && title.includes('Proposal'))) {
        return 'MayaGrantProposal';
      }
      // New Maya Lesson 6 components
      if (safeLessonId === 6 && title.includes('Maya') && title.includes('Document')) {
        return 'MayaDocumentCreator';
      }
      if (safeLessonId === 6 && title.includes('Maya') && title.includes('Report')) {
        return 'MayaReportBuilder';
      }
      // David's components
      if (safeLessonId === 17 && title.includes('David')) {
        return 'DavidPresentationMaster';
      }
      return 'DocumentGenerator';
    
    // Add all other element type mappings...
    case 'meeting_prep_assistant':
      if (safeLessonId === 7 && title.includes('Maya')) {
        return 'MayaBoardMeetingPrep';
      }
      return 'MeetingPrepAssistant';
    
    case 'research_assistant':
      if (safeLessonId === 8 && title.includes('Maya')) {
        return 'MayaResearchSynthesis';
      }
      return 'ResearchAssistant';
    
    case 'document_improver':
      if (safeLessonId === 12 && title.includes('Sofia')) {
        return 'SofiaVoiceDiscovery';
      }
      return 'DocumentImprover';
    
    case 'template_creator':
      // Maya's template designer for Lesson 6
      if (safeLessonId === 6 && title.includes('Maya') && title.includes('Template')) {
        return 'MayaTemplateDesigner';
      }
      if (safeLessonId === 14 && title.includes('Sofia')) {
        return 'SofiaImpactScaling';
      }
      if (safeLessonId === 18 && title.includes('David')) {
        return 'DavidSystemBuilder';
      }
      return 'TemplateCreator';
    
    case 'grant_writing_assistant_demo':
      return 'GrantWritingAssistantDemo';
    
    case 'donor_persona_generator':
      return 'DonorPersonaGenerator';
    
    case 'agenda_creator':
      return 'AgendaCreator';
    
    case 'summary_generator':
      return 'SummaryGenerator';
    
    case 'information_summarizer':
      return 'InformationSummarizer';
    
    case 'task_prioritizer':
      return 'TaskPrioritizer';
    
    case 'project_planner':
      return 'ProjectPlanner';
    
    case 'ai_social_media_generator':
    case 'social_media_generator':
      return 'AISocialMediaGenerator';
    
    case 'hashtag_optimizer':
      return 'HashtagOptimizer';
    
    case 'engagement_predictor':
      return 'EngagementPredictor';
    
    case 'ai_email_campaign_writer':
      return 'AIEmailCampaignWriter';
    
    case 'subject_line_tester':
      return 'SubjectLineTester';
    
    case 'content_calendar_builder':
      return 'ContentCalendarBuilder';
    
    case 'content_repurposer':
      return 'ContentRepurposer';
    
    case 'data_analyzer':
      return 'DataAnalyzer';
    
    case 'impact_dashboard_creator':
      return 'ImpactDashboardCreator';
    
    case 'survey_creator':
      return 'SurveyCreator';
    
    case 'report_builder':
      return 'ReportBuilder';
    
    case 'donor_insights_analyzer':
      return 'DonorInsightsAnalyzer';
    
    case 'trend_identifier':
      return 'TrendIdentifier';
    
    case 'kpi_tracker':
      return 'KPITracker';
    
    case 'data_storyteller':
      if (safeLessonId === 16 && title.includes('David')) {
        return 'DavidDataStoryFinder';
      }
      return 'DataStoryteller';
    
    case 'workflow_automator':
      if (safeLessonId === 19 && title.includes('Rachel')) {
        return 'RachelAutomationVision';
      }
      return 'WorkflowAutomator';
    
    case 'task_scheduler':
      return 'TaskScheduler';
    
    case 'email_automation_builder':
      return 'EmailAutomationBuilder';
    
    case 'data_entry_automator':
      return 'DataEntryAutomator';
    
    case 'process_optimizer':
      if (safeLessonId === 20 && title.includes('Rachel')) {
        return 'RachelWorkflowDesigner';
      }
      return 'ProcessOptimizer';
    
    case 'integration_builder':
      if (safeLessonId === 22 && title.includes('Rachel')) {
        return 'RachelEcosystemBuilder';
      }
      return 'IntegrationBuilder';
    
    case 'time_tracker':
      return 'TimeTracker';
    
    case 'ai_readiness_assessor':
      return 'AIReadinessAssessor';
    
    case 'team_ai_trainer':
      return 'TeamAITrainer';
    
    case 'change_leader':
      if (safeLessonId === 23 && title.includes('Alex')) {
        return 'AlexChangeStrategy';
      }
      return 'ChangeLeader';
    
    case 'ai_governance_builder':
      if (safeLessonId === 24 && title.includes('Alex')) {
        return 'AlexVisionBuilder';
      }
      if (safeLessonId === 26 && title.includes('Alex')) {
        return 'AlexLeadershipFramework';
      }
      return 'AIGovernanceBuilder';
    
    case 'impact_measurement':
      if (safeLessonId === 21 && title.includes('Rachel')) {
        return 'RachelProcessTransformer';
      }
      return 'ImpactMeasurement';
    
    case 'innovation_roadmap':
      if (safeLessonId === 25 && title.includes('Alex')) {
        return 'AlexRoadmapCreator';
      }
      return 'InnovationRoadmap';
    
    case 'storytelling_agent':
      return 'StorytellingAgent';
    
    case 'content_audit_agent':
      return 'ContentAuditAgent';
    
    case 'chapter_builder_agent':
      return 'ChapterBuilderAgent';
    
    case 'database_debugger':
      return 'DatabaseDebugger';
    
    case 'interactive_element_auditor':
      return 'InteractiveElementAuditor';
    
    case 'interactive_element_builder':
      return 'InteractiveElementBuilder';
    
    case 'element_workflow_coordinator':
      return 'ElementWorkflowCoordinator';
    
    case 'automated_element_enhancer':
      return 'AutomatedElementEnhancer';
    
    case 'difficult_conversation_helper':
      return 'DifficultConversationHelper';
    
    default:
      console.log(`getComponentName: No mapping found for type "${safeElementType}"`);
      return null;
  }
  } catch (error) {
    console.error('getComponentName: Error processing parameters:', {
      error: String(error),
      elementType: typeof elementType + ' ' + String(elementType).substring(0, 50),
      lessonId: typeof lessonId + ' ' + String(lessonId),
      elementTitle: typeof elementTitle + ' ' + String(elementTitle).substring(0, 50)
    });
    return null;
  }
}

/**
 * Preload components for better performance
 * @param componentNames - Array of component names to preload
 */
export async function preloadComponents(componentNames: string[]): Promise<void> {
  const promises = componentNames.map(name => {
    const importFn = componentMap[name];
    if (importFn && !componentCache.has(name)) {
      return importFn().then(() => {
        // Component is now loaded in the browser cache
      });
    }
    return Promise.resolve();
  });
  
  await Promise.all(promises);
}