import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MayaInteractiveJourney from '@/components/lesson/chat/lyra/maya/MayaInteractiveJourney';

// Journey configuration registry
const journeyRegistry = {
  'maya-pace': {
    component: MayaInteractiveJourney,
    characterId: 'maya',
    title: 'Maya\'s PACE Framework Journey',
    description: 'Master AI communication through Maya\'s transformation'
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