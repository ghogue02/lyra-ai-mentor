import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MayaInteractiveJourney from '@/components/lesson/chat/lyra/maya/MayaInteractiveJourney';
import MayaToneMastery from '@/components/lesson/chat/lyra/maya/MayaToneMastery';
import LyraFoundationsJourney from '@/components/lesson/chat/lyra/LyraFoundationsJourney';
import SofiaStorytellingJourney from '@/components/lesson/chat/sofia/SofiaStorytellingJourney';
import DavidDataJourney from '@/components/lesson/chat/david/DavidDataJourney';
import RachelAutomationJourney from '@/components/lesson/chat/rachel/RachelAutomationJourney';
import AlexLeadershipJourney from '@/components/lesson/chat/alex/AlexLeadershipJourney';

// Journey configuration registry
const journeyRegistry = {
  'lyra-foundations': {
    component: LyraFoundationsJourney,
    characterId: 'lyra',
    title: 'Lyra\'s AI Foundations Journey',
    description: 'Start your AI journey with Lyra as your guide'
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