import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MayaInteractiveJourney from '@/components/lesson/chat/lyra/maya/MayaInteractiveJourney';
import MayaToneMastery from '@/components/lesson/chat/lyra/maya/MayaToneMastery';
import MayaTemplateLibraryBuilder from '@/components/lesson/MayaTemplateLibraryBuilder';
import MayaDifficultConversationsGuide from '@/components/lesson/MayaDifficultConversationsGuide';
import MayaSubjectLineWorkshop from '@/components/lesson/MayaSubjectLineWorkshop';
import LyraFoundationsJourney from '@/components/lesson/chat/lyra/LyraFoundationsJourney';
import { LyraUnderstandingAIModelsLesson } from '@/components/lesson/LyraUnderstandingAIModelsLesson';
import { LyraPromptingFundamentalsLesson } from '@/components/lesson/LyraPromptingFundamentalsLesson';
import { LyraAIEthicsLesson } from '@/components/lesson/LyraAIEthicsLesson';
import { LyraAIToolkitSetupLesson } from '@/components/lesson/LyraAIToolkitSetupLesson';
import SofiaStorytellingJourney from '@/components/lesson/chat/sofia/SofiaStorytellingJourney';
import DavidDataJourney from '@/components/lesson/chat/david/DavidDataJourney';
import RachelAutomationJourney from '@/components/lesson/chat/rachel/RachelAutomationJourney';
import AlexLeadershipJourney from '@/components/lesson/chat/alex/AlexLeadershipJourney';

// New micro-lesson components
import SofiaMissionStoryCreatorLesson from "@/components/lesson/SofiaMissionStoryCreatorLesson";
import SofiaVoiceDiscoveryLesson from "@/components/lesson/SofiaVoiceDiscoveryLesson";
import SofiaStoryBreakthroughLesson from "@/components/lesson/SofiaStoryBreakthroughLesson";
import SofiaImpactScalingLesson from "@/components/lesson/SofiaImpactScalingLesson";
import DavidDataRevivalLesson from "@/components/lesson/DavidDataRevivalLesson";
import DavidDataStoryFinderLesson from "@/components/lesson/DavidDataStoryFinderLesson";
import DavidPresentationMasterLesson from "@/components/lesson/DavidPresentationMasterLesson";
import DavidSystemBuilderLesson from "@/components/lesson/DavidSystemBuilderLesson";
import RachelAutomationVisionLesson from "@/components/lesson/RachelAutomationVisionLesson";
import RachelWorkflowDesignerLesson from "@/components/lesson/RachelWorkflowDesignerLesson";
import RachelProcessTransformerLesson from "@/components/lesson/RachelProcessTransformerLesson";
import RachelEcosystemBuilderLesson from "@/components/lesson/RachelEcosystemBuilderLesson";
import AlexChangeStrategyLesson from "@/components/lesson/AlexChangeStrategyLesson";
import AlexVisionBuilderLesson from "@/components/lesson/AlexVisionBuilderLesson";
import AlexRoadmapCreatorLesson from "@/components/lesson/AlexRoadmapCreatorLesson";
import AlexLeadershipFrameworkLesson from "@/components/lesson/AlexLeadershipFrameworkLesson";

// Journey configuration registry
const journeyRegistry = {
  'lyra-foundations': {
    component: LyraFoundationsJourney,
    characterId: 'lyra',
    title: 'Lyra\'s AI Foundations Journey',
    description: 'Start your AI journey with Lyra as your guide'
  },
  'understanding-models': {
    component: LyraUnderstandingAIModelsLesson,
    characterId: 'lyra',
    title: 'Understanding AI Models',
    description: 'Learn to choose the right AI model for different tasks'
  },
  'prompting-fundamentals': {
    component: LyraPromptingFundamentalsLesson,
    characterId: 'lyra',
    title: 'AI Prompting Fundamentals',
    description: 'Master the art of communicating with AI'
  },
  'ai-ethics': {
    component: LyraAIEthicsLesson,
    characterId: 'lyra',
    title: 'AI Ethics for Nonprofits',
    description: 'Navigate responsible AI use in mission-driven work'
  },
  'ai-toolkit-setup': {
    component: LyraAIToolkitSetupLesson,
    characterId: 'lyra',
    title: 'Setting Up Your AI Toolkit',
    description: 'Build your personalized AI workspace'
  },
  'maya-pace': {
    component: MayaInteractiveJourney,
    characterId: 'maya',
    title: 'Maya\'s PACE Framework Journey',
    description: 'Master AI communication through Maya\'s transformation'
  },
  'maya-tone-mastery': {
    component: MayaToneMastery,
    characterId: 'maya',
    title: 'Maya\'s Tone Mastery Workshop',
    description: 'Master tone adaptation with Maya Rodriguez'
  },
  'template-library': {
    component: MayaTemplateLibraryBuilder,
    characterId: 'maya',
    title: 'Maya\'s Template Library Builder',
    description: 'Create reusable email templates for organizational efficiency'
  },
  'difficult-conversations': {
    component: MayaDifficultConversationsGuide,
    characterId: 'maya',
    title: 'Maya\'s Difficult Conversations Guide',
    description: 'Handle challenging communications with empathy and skill'
  },
  'subject-workshop': {
    component: MayaSubjectLineWorkshop,
    characterId: 'maya',
    title: 'Maya\'s Subject Line Workshop',
    description: 'Craft compelling email openings that get opened and read'
  },
  'sofia-storytelling': {
    component: SofiaStorytellingJourney,
    characterId: 'sofia',
    title: 'Sofia\'s Storytelling Journey',
    description: 'Discover your authentic voice with Sofia Martinez'
  },
  'david-data': {
    component: DavidDataJourney,
    characterId: 'david',
    title: 'David\'s Data Storytelling Journey',
    description: 'Transform data into compelling stories with David Chen'
  },
  'rachel-automation': {
    component: RachelAutomationJourney,
    characterId: 'rachel',
    title: 'Rachel\'s Automation Journey',
    description: 'Build efficient workflows with Rachel Thompson'
  },
  'alex-leadership': {
    component: AlexLeadershipJourney,
    characterId: 'alex',
    title: 'Alex\'s Leadership Journey',
    description: 'Lead AI transformation with Alex Rivera'
  },
  
  // Sofia's micro-lessons (Chapter 3)
  'mission-story-creator': {
    component: SofiaMissionStoryCreatorLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Mission Story Creator',
    description: 'Transform invisible mission into compelling narrative'
  },
  'voice-discovery': {
    component: SofiaVoiceDiscoveryLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Voice Discovery Workshop',
    description: 'Discover authentic communication style'
  },
  'story-breakthrough': {
    component: SofiaStoryBreakthroughLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Story Breakthrough Lab',
    description: 'Craft breakthrough story for high-stakes presentation'
  },
  'impact-scaling': {
    component: SofiaImpactScalingLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Impact Scaling Mastery',
    description: 'Scale storytelling across all communication channels'
  },
  
  // David's micro-lessons (Chapter 4)
  'david-data-foundations': {
    component: DavidDataRevivalLesson,
    characterId: 'david',
    title: 'David\'s Data Foundations',
    description: 'Transform raw nonprofit data into compelling impact narratives'
  },
  'visual-storytelling': {
    component: DavidDataStoryFinderLesson,
    characterId: 'david',
    title: 'Visual Storytelling Workshop',
    description: 'Create stunning data visualizations that communicate impact clearly'
  },
  'data-revival': {
    component: DavidPresentationMasterLesson,
    characterId: 'david',
    title: 'Data Narrative Construction Lab',
    description: 'Build compelling stories from complex datasets with AI assistance'
  },
  'stakeholder-communication': {
    component: DavidSystemBuilderLesson,
    characterId: 'david',
    title: 'Stakeholder Communication Mastery',
    description: 'Tailor data presentations for different audience types and contexts'
  },
  'predictive-insights': {
    component: DavidDataRevivalLesson,
    characterId: 'david', 
    title: 'Predictive Insights Strategy',
    description: 'Use AI to forecast trends and create forward-looking impact reports'
  },
  'data-ecosystem': {
    component: DavidSystemBuilderLesson,
    characterId: 'david',
    title: 'Data Ecosystem Builder',
    description: 'Create comprehensive data systems for ongoing impact measurement'
  },
  
  // Rachel's micro-lessons (Chapter 5)
  'automation-vision': {
    component: RachelAutomationVisionLesson,
    characterId: 'rachel',
    title: 'Rachel\'s Automation Vision',
    description: 'Discover how to map and automate your nonprofit\'s key processes'
  },
  'human-centered-design': {
    component: RachelWorkflowDesignerLesson,
    characterId: 'rachel',
    title: 'Human-Centered Design Workshop',
    description: 'Build automation that enhances rather than replaces human connection'
  },
  'automation-planning': {
    component: RachelProcessTransformerLesson,
    characterId: 'rachel',
    title: 'Automation Planning Lab',
    description: 'Create step-by-step implementation roadmaps with AI guidance'
  },
  'workflow-design': {
    component: RachelEcosystemBuilderLesson,
    characterId: 'rachel',
    title: 'Change Management Mastery',
    description: 'Lead organizational transformation with AI-powered communication'
  },
  'scaling-systems': {
    component: RachelProcessTransformerLesson,
    characterId: 'rachel',
    title: 'Scaling Systems Strategy',
    description: 'Build a comprehensive AI automation ecosystem for your organization'
  },
  'ecosystem-builder': {
    component: RachelEcosystemBuilderLesson,
    characterId: 'rachel',
    title: 'Ecosystem Builder',
    description: 'Create comprehensive AI ecosystem for lasting organizational transformation'
  },
  
  // Alex's micro-lessons (Chapter 6)
  'leadership-challenges': {
    component: AlexChangeStrategyLesson,
    characterId: 'alex',
    title: 'Alex\'s Leadership Challenges',
    description: 'Navigate the complexities of leading AI transformation in nonprofits'
  },
  'vision-building': {
    component: AlexVisionBuilderLesson,
    characterId: 'alex',
    title: 'Vision Building Workshop',
    description: 'Create compelling AI transformation visions with strategic facilitation'
  },
  'transformation-planning': {
    component: AlexRoadmapCreatorLesson,
    characterId: 'alex',
    title: 'Transformation Planning Lab',
    description: 'Design comprehensive change management strategies with AI guidance'
  },
  'team-alignment': {
    component: AlexVisionBuilderLesson,
    characterId: 'alex',
    title: 'Team Alignment Mastery',
    description: 'Unite your organization around AI adoption with communication tools'
  },
  'future-leadership': {
    component: AlexRoadmapCreatorLesson,
    characterId: 'alex',
    title: 'Future Leadership Strategy',
    description: 'Build a sustainable AI-powered organizational roadmap for lasting impact'
  },
  'leadership-framework': {
    component: AlexLeadershipFrameworkLesson,
    characterId: 'alex',
    title: 'Leadership Framework Mastery',
    description: 'Develop comprehensive AI leadership skills for lasting organizational transformation'
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

  return <JourneyComponent />;
};

export default InteractiveJourney;