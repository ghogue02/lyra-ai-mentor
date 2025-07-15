import { Tutorial } from '../../types/tutorial';
import { mayaEmailComposerTutorial } from './maya-email-composer';
import { sofiaVoiceDiscoveryTutorial } from './sofia-voice-discovery';
import { davidDataStoryFinderTutorial } from './david-data-story-finder';
import { rachelAutomationVisionTutorial } from './rachel-automation-vision';
import { alexChangeStrategyTutorial } from './alex-change-strategy';

export const tutorials: Tutorial[] = [
  mayaEmailComposerTutorial,
  sofiaVoiceDiscoveryTutorial,
  davidDataStoryFinderTutorial,
  rachelAutomationVisionTutorial,
  alexChangeStrategyTutorial,
];

export const tutorialCategories = {
  communication: 'Communication',
  storytelling: 'Storytelling',
  dataAnalysis: 'Data Analysis',
  automation: 'Automation',
  strategy: 'Strategy',
};