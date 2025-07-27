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
  'sofia-mission-story': {
    component: SofiaMissionStoryCreatorLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Silent Crisis Story Creator',
    description: 'Transform invisible mission into compelling narrative'
  },
  'sofia-voice-discovery': {
    component: SofiaVoiceDiscoveryLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Voice Discovery Journey',
    description: 'Discover authentic communication style'
  },
  'sofia-story-breakthrough': {
    component: SofiaStoryBreakthroughLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Breakthrough Story Creator',
    description: 'Craft breakthrough story for high-stakes presentation'
  },
  'sofia-impact-scaling': {
    component: SofiaImpactScalingLesson,
    characterId: 'sofia',
    title: 'Sofia\'s Impact Scaling System',
    description: 'Scale storytelling across all communication channels'
  },
  
  // David's micro-lessons (Chapter 4)
  'david-data-revival': {
    component: DavidDataRevivalLesson,
    characterId: 'david',
    title: 'David\'s Data Graveyard Revival',
    description: 'Resurrect buried insights from spreadsheet chaos'
  },
  'david-story-finder': {
    component: DavidDataStoryFinderLesson,
    characterId: 'david',
    title: 'David\'s Data Story Discovery',
    description: 'Weave compelling narratives from complex statistics'
  },
  'david-presentation-master': {
    component: DavidPresentationMasterLesson,
    characterId: 'david',
    title: 'David\'s Million-Dollar Presentation',
    description: 'Create high-stakes presentation for transformational funding'
  },
  'david-system-builder': {
    component: DavidSystemBuilderLesson,
    characterId: 'david',
    title: 'David\'s Data Storytelling System',
    description: 'Build comprehensive data communication infrastructure'
  },
  
  // Rachel's micro-lessons (Chapter 5)
  'rachel-automation-vision': {
    component: RachelAutomationVisionLesson,
    characterId: 'rachel',
    title: 'Rachel\'s Human-Centered Automation Vision',
    description: 'Overcome automation resistance through human benefits'
  },
  'rachel-workflow-designer': {
    component: RachelWorkflowDesignerLesson,
    characterId: 'rachel',
    title: 'Rachel\'s Workflow Design Studio',
    description: 'Design workflows that balance efficiency with satisfaction'
  },
  'rachel-process-transformer': {
    component: RachelProcessTransformerLesson,
    characterId: 'rachel',
    title: 'Rachel\'s Process Transformation Proof',
    description: 'Prove automation value through measurable transformation'
  },
  'rachel-ecosystem-builder': {
    component: RachelEcosystemBuilderLesson,
    characterId: 'rachel',
    title: 'Rachel\'s Automation Ecosystem Builder',
    description: 'Create seamless automation ecosystem'
  },
  
  // Alex's micro-lessons (Chapter 6)
  'alex-change-strategy': {
    component: AlexChangeStrategyLesson,
    characterId: 'alex',
    title: 'Alex\'s Change Leadership Strategy',
    description: 'Unite divided organization around AI transformation'
  },
  'alex-vision-builder': {
    component: AlexVisionBuilderLesson,
    characterId: 'alex',
    title: 'Alex\'s Unified Vision Builder',
    description: 'Create inspiring vision that drives collective action'
  },
  'alex-roadmap-creator': {
    component: AlexRoadmapCreatorLesson,
    characterId: 'alex',
    title: 'Alex\'s Transformation Roadmap Creator',
    description: 'Build confidence through clear implementation path'
  },
  'alex-leadership-framework': {
    component: AlexLeadershipFrameworkLesson,
    characterId: 'alex',
    title: 'Alex\'s AI Leadership Framework',
    description: 'Establish leadership model for AI-powered future'
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