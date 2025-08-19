import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import LoadingSuspense from '@/components/ui/LoadingSuspense';
import {
  // Maya components
  LazyMayaInteractiveJourney,
  LazyMayaToneMastery,
  LazyMayaTemplateLibraryBuilder,
  LazyMayaDifficultConversationsGuide,
  LazyMayaSubjectLineWorkshop,
  
  // Lyra components
  LazyLyraFoundationsJourney,
  LazyLyraUnderstandingAIModelsLesson,
  LazyLyraPromptingFundamentalsLesson,
  LazyLyraAIEthicsLesson,
  LazyLyraAIToolkitSetupLesson,
  
  // Sofia components
  LazySofiaStorytellingJourney,
  LazySofiaMissionStoryCreator,
  LazySofiaVoiceDiscovery,
  LazySofiaStoryBreakthrough,
  LazySofiaImpactScaling,
  
  // David components
  LazyDavidDataJourney,
  LazyDavidDataFoundations,
  LazyDavidVisualStorytelling,
  LazyDavidDataRevival,
  LazyDavidStakeholderCommunication,
  LazyDavidPredictiveInsights,
  LazyDavidDataEcosystem,
  
  // Rachel components
  LazyRachelAutomationJourney,
  LazyRachelAutomationVision,
  LazyRachelHumanCenteredDesign,
  LazyRachelAutomationPlanning,
  LazyRachelWorkflowDesign,
  LazyRachelScalingSystems,
  LazyRachelEcosystemBuilder,
  
  // Alex components
  LazyAlexLeadershipJourney,
  LazyAlexLeadershipChallenges,
  LazyAlexVisionBuilding,
  LazyAlexTransformationPlanning,
  LazyAlexTeamAlignment,
  LazyAlexFutureLeadership,
  LazyAlexLeadershipFramework,
  
  // Tool components
  LazyDecisionMatrixRenderer,
  LazyTeamCapacityCalculator,
  LazyTeamCapacityResults,
  LazyProjectCharterBuilder,
  
  // Carmen components
  LazyCarmenPeopleManagementJourney,
  LazyCarmenTalentAcquisition,
  LazyCarmenPerformanceInsights,
  LazyCarmenEngagementBuilder,
  LazyCarmenRetentionMastery,
  LazyCarmenTeamDynamics,
  LazyCarmenCulturalIntelligence,
  LazyCarmenLeadershipDevelopment,
} from '@/utils/lazyComponents';

// Journey configuration registry with lazy components
const journeyRegistry = {
  'lyra-foundations': {
    component: LazyLyraFoundationsJourney,
    characterId: 'lyra',
    title: 'Lyra\'s AI Foundations Journey',
    description: 'Start your AI journey with Lyra as your guide'
  },
  'understanding-models': {
    component: LazyLyraUnderstandingAIModelsLesson,
    characterId: 'lyra',
    title: 'Understanding AI Models',
    description: 'Learn to choose the right AI model for different tasks'
  },
  'prompting-fundamentals': {
    component: LazyLyraPromptingFundamentalsLesson,
    characterId: 'lyra',
    title: 'AI Prompting Fundamentals',
    description: 'Master the art of communicating with AI'
  },
  'ai-ethics': {
    component: LazyLyraAIEthicsLesson,
    characterId: 'lyra',
    title: 'AI Ethics for Nonprofits',
    description: 'Navigate responsible AI use in mission-driven work'
  },
  'ai-toolkit-setup': {
    component: LazyLyraAIToolkitSetupLesson,
    characterId: 'lyra',
    title: 'Setting Up Your AI Toolkit',
    description: 'Build your personalized AI workspace'
  },
  'maya-pace': {
    component: LazyMayaInteractiveJourney,
    characterId: 'maya',
    title: 'Maya\'s PACE Framework Journey',
    description: 'Master AI communication through Maya\'s transformation'
  },
  'maya-tone-mastery': {
    component: LazyMayaToneMastery,
    characterId: 'maya',
    title: 'Maya\'s Tone Mastery Workshop',
    description: 'Master tone adaptation with Maya Rodriguez'
  },
  'template-library': {
    component: LazyMayaTemplateLibraryBuilder,
    characterId: 'maya',
    title: 'Maya\'s Template Library Builder',
    description: 'Create reusable email templates for organizational efficiency'
  },
  'difficult-conversations': {
    component: LazyMayaDifficultConversationsGuide,
    characterId: 'maya',
    title: 'Maya\'s Difficult Conversations Guide',
    description: 'Handle challenging communications with empathy and skill'
  },
  'subject-workshop': {
    component: LazyMayaSubjectLineWorkshop,
    characterId: 'maya',
    title: 'Maya\'s Subject Line Workshop',
    description: 'Craft compelling email openings that get opened and read'
  },
  'sofia-storytelling': {
    component: LazySofiaStorytellingJourney,
    characterId: 'sofia',
    title: 'Sofia\'s Storytelling Journey',
    description: 'Discover your authentic voice with Sofia Martinez'
  },
  'david-data': {
    component: LazyDavidDataJourney,
    characterId: 'david',
    title: 'David\'s Data Storytelling Journey',
    description: 'Transform data into compelling stories with David Chen'
  },
  'rachel-automation': {
    component: LazyRachelAutomationJourney,
    characterId: 'rachel',
    title: 'Rachel\'s Automation Journey',
    description: 'Build efficient workflows with Rachel Thompson'
  },
  'alex-leadership': {
    component: LazyAlexLeadershipJourney,
    characterId: 'alex',
    title: 'Alex\'s Leadership Journey',
    description: 'Lead AI transformation with Alex Rivera'
  },
  
  // Sofia's micro-lessons (Chapter 3)
  'mission-story-creator': {
    component: LazySofiaMissionStoryCreator,
    characterId: 'sofia',
    title: 'Sofia\'s Mission Story Creator',
    description: 'Transform invisible mission into compelling narrative'
  },
  'voice-discovery': {
    component: LazySofiaVoiceDiscovery,
    characterId: 'sofia',
    title: 'Sofia\'s Voice Discovery Workshop',
    description: 'Discover authentic communication style'
  },
  'story-breakthrough': {
    component: LazySofiaStoryBreakthrough,
    characterId: 'sofia',
    title: 'Sofia\'s Story Breakthrough Lab',
    description: 'Craft breakthrough story for high-stakes presentation'
  },
  'impact-scaling': {
    component: LazySofiaImpactScaling,
    characterId: 'sofia',
    title: 'Sofia\'s Impact Scaling Mastery',
    description: 'Scale storytelling across all communication channels'
  },
  
  // David's micro-lessons (Chapter 4)
  'david-data-foundations': {
    component: LazyDavidDataFoundations,
    characterId: 'david',
    title: 'David\'s Data Foundations',
    description: 'Transform raw nonprofit data into compelling impact narratives'
  },
  'visual-storytelling': {
    component: LazyDavidVisualStorytelling,
    characterId: 'david',
    title: 'Visual Storytelling Workshop',
    description: 'Create stunning data visualizations that communicate impact clearly'
  },
  'data-revival': {
    component: LazyDavidDataRevival,
    characterId: 'david',
    title: 'Data Narrative Construction Lab',
    description: 'Build compelling stories from complex datasets with AI assistance'
  },
  'stakeholder-communication': {
    component: LazyDavidStakeholderCommunication,
    characterId: 'david',
    title: 'Stakeholder Communication Mastery',
    description: 'Tailor data presentations for different audience types and contexts'
  },
  'predictive-insights': {
    component: LazyDavidPredictiveInsights,
    characterId: 'david', 
    title: 'Predictive Insights Strategy',
    description: 'Use AI to forecast trends and create forward-looking impact reports'
  },
  'data-ecosystem': {
    component: LazyDavidDataEcosystem,
    characterId: 'david',
    title: 'Data Ecosystem Builder',
    description: 'Create comprehensive data systems for ongoing impact measurement'
  },
  
  // Rachel's micro-lessons (Chapter 5)
  'rachel-automation-vision': {
    component: LazyRachelAutomationVision,
    characterId: 'rachel',
    title: 'Rachel\'s Automation Vision',
    description: 'Discover how to map and automate your nonprofit\'s key processes'
  },
  'human-centered-design': {
    component: LazyRachelHumanCenteredDesign,
    characterId: 'rachel',
    title: 'Human-Centered Design Workshop',
    description: 'Build automation that enhances rather than replaces human connection'
  },
  'automation-planning': {
    component: LazyRachelAutomationPlanning,
    characterId: 'rachel',
    title: 'Automation Planning Lab',
    description: 'Create step-by-step implementation roadmaps with AI guidance'
  },
  'workflow-design': {
    component: LazyRachelWorkflowDesign,
    characterId: 'rachel',
    title: 'Workflow Design Mastery',
    description: 'Lead organizational transformation with AI-powered workflow optimization'
  },
  'scaling-systems': {
    component: LazyRachelScalingSystems,
    characterId: 'rachel',
    title: 'Scaling Systems Strategy',
    description: 'Build a comprehensive AI automation ecosystem for your organization'
  },
  'ecosystem-builder': {
    component: LazyRachelEcosystemBuilder,
    characterId: 'rachel',
    title: 'Ecosystem Builder',
    description: 'Create comprehensive AI ecosystem for lasting organizational transformation'
  },
  
  // Alex's micro-lessons (Chapter 6)
  'leadership-challenges': {
    component: LazyAlexLeadershipChallenges,
    characterId: 'alex',
    title: 'Alex\'s Leadership Challenges',
    description: 'Navigate the complexities of leading AI transformation in nonprofits'
  },
  'vision-building': {
    component: LazyAlexVisionBuilding,
    characterId: 'alex',
    title: 'Vision Building Workshop',
    description: 'Create compelling AI transformation visions with strategic facilitation'
  },
  'transformation-planning': {
    component: LazyAlexTransformationPlanning,
    characterId: 'alex',
    title: 'Transformation Planning Lab',
    description: 'Design comprehensive change management strategies with AI guidance'
  },
  'team-alignment': {
    component: LazyAlexTeamAlignment,
    characterId: 'alex',
    title: 'Team Alignment Mastery',
    description: 'Unite your organization around AI adoption with communication tools'
  },
  'leadership-framework': {
    component: LazyAlexLeadershipFramework,
    characterId: 'alex',
    title: 'Leadership Framework Mastery',
    description: 'Develop comprehensive AI leadership skills for lasting organizational transformation'
  },
  
  // Tools (Chapter 3 integrations)
  'decision-matrix': {
    component: LazyDecisionMatrixRenderer,
    characterId: 'sofia',
    title: 'Decision Matrix',
    description: 'Evaluate and prioritize storytelling initiatives with weighted criteria'
  },
  'team-capacity': {
    component: LazyTeamCapacityCalculator,
    characterId: 'sofia',
    title: 'Team Capacity Calculator',
    description: 'Validate feasibility and optimize workload for upcoming campaigns'
  },
  'team-capacity-results': {
    component: LazyTeamCapacityResults,
    characterId: 'sofia',
    title: 'Team Capacity Analysis Results',
    description: 'Visual analysis and insights from your capacity assessment'
  },
  'project-charter': {
    component: LazyProjectCharterBuilder,
    characterId: 'sofia',
    title: 'Project Charter',
    description: 'Draft a clear charter with AI-marked placeholders to review'
  },
  // Chapter 7 - Carmen's AI-Powered People Management  
  'carmen-people-management-journey': {
    component: LazyCarmenPeopleManagementJourney,
    characterId: 'carmen',
    title: 'Carmen\'s People Management Journey', 
    description: 'Experience Carmen\'s transformation and learn her AI-powered people management approach'
  },
  'talent-acquisition': {
    component: LazyCarmenTalentAcquisition,
    characterId: 'carmen',
    title: 'AI-Powered Talent Acquisition',
    description: 'Transform your hiring process with Carmen\'s compassionate approach'
  },
  'performance-insights': {
    component: LazyCarmenPerformanceInsights,
    characterId: 'carmen', 
    title: 'Performance Insights Workshop',
    description: 'Master data-driven performance management while maintaining human connection'
  },
  'engagement-builder': {
    component: LazyCarmenEngagementBuilder,
    characterId: 'carmen',
    title: 'Employee Engagement Builder', 
    description: 'Create personalized engagement strategies using AI-powered people analytics'
  },
  'retention-mastery': {
    component: LazyCarmenRetentionMastery,
    characterId: 'carmen',
    title: 'Retention Strategy Mastery',
    description: 'Develop AI-enhanced retention strategies that honor both data and humanity'
  },
  'team-dynamics': {
    component: LazyCarmenTeamDynamics,
    characterId: 'carmen',
    title: 'Team Dynamics Optimizer',
    description: 'Build stronger, more cohesive teams using AI-powered insights'
  },
  'cultural-intelligence': {
    component: LazyCarmenCulturalIntelligence,
    characterId: 'carmen', 
    title: 'Cultural Intelligence Hub',
    description: 'Foster inclusive workplace cultures by combining AI analytics with cultural sensitivity'
  },
  'leadership-development': {
    component: LazyCarmenLeadershipDevelopment,
    characterId: 'carmen',
    title: 'Leadership Development Lab',
    description: 'Develop next-generation leaders using personalized AI coaching'
  }
};

const InteractiveJourney: React.FC = () => {
  const { chapterId, journeyId } = useParams();
  
  if (!chapterId || !journeyId) {
    return <Navigate to="/dashboard" replace />;
  }

  const journey = journeyRegistry[journeyId as keyof typeof journeyRegistry];
  
  if (!journey) {
    return <Navigate to={`/chapter/${chapterId}`} replace />;
  }

  const JourneyComponent = journey.component;

  return (
    <LoadingSuspense>
      <JourneyComponent />
    </LoadingSuspense>
  );
};

export default InteractiveJourney;