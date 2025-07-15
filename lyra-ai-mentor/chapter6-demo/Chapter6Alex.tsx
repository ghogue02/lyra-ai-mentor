import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AlexNavigation } from './components/navigation/AlexNavigation';
import { AlexCharacterIntro } from './components/character/AlexCharacterIntro';
import { DataCommunicationFoundations } from './lessons/lesson-1/DataCommunicationFoundations';
import { VisualizationAndClarity } from './lessons/lesson-2/VisualizationAndClarity';
import { TechnicalToBusinessTranslation } from './lessons/lesson-3/TechnicalToBusinessTranslation';
import { StakeholderPresentationMastery } from './lessons/lesson-4/StakeholderPresentationMastery';
import { DataCommunicationWorkshops } from './lessons/lesson-5/DataCommunicationWorkshops';

interface Chapter6AlexProps {
  className?: string;
}

export const Chapter6Alex: React.FC<Chapter6AlexProps> = ({ className = '' }) => {
  return (
    <div className={`chapter-6-alex ${className}`}>
      <AlexNavigation />
      <Routes>
        <Route path="/" element={<AlexCharacterIntro />} />
        <Route path="/lesson-1" element={<DataCommunicationFoundations />} />
        <Route path="/lesson-2" element={<VisualizationAndClarity />} />
        <Route path="/lesson-3" element={<TechnicalToBusinessTranslation />} />
        <Route path="/lesson-4" element={<StakeholderPresentationMastery />} />
        <Route path="/lesson-5" element={<DataCommunicationWorkshops />} />
      </Routes>
    </div>
  );
};

export default Chapter6Alex;