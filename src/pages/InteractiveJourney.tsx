import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MayaInteractiveJourney from '@/components/lesson/chat/lyra/maya/MayaInteractiveJourney';
import MayaToneMastery from '@/components/lesson/chat/lyra/maya/MayaToneMastery';

// Journey configuration registry
const journeyRegistry = {
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
  }
  // Future journeys can be added here:
  // 'sofia-voice': { component: SofiaVoiceJourney, characterId: 'sofia', ... }
  // 'david-data': { component: DavidDataJourney, characterId: 'david', ... }
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