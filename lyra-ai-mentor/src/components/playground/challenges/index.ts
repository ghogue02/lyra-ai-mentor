// Lazy load challenge components for better performance
import { lazy } from 'react';

export const MayaEmailChallenge = lazy(() => import('./MayaEmailChallenge'));
export const SofiaVoiceFinder = lazy(() => import('./SofiaVoiceFinder'));
export const DavidDataStoryteller = lazy(() => import('./DavidDataStoryteller'));
export const RachelAutomationBuilder = lazy(() => import('./RachelAutomationBuilder'));
export const AlexChangeNavigator = lazy(() => import('./AlexChangeNavigator'));

// Export challenge metadata for use in the playground
export const challengeComponents = {
  maya: MayaEmailChallenge,
  sofia: SofiaVoiceFinder,
  david: DavidDataStoryteller,
  rachel: RachelAutomationBuilder,
  alex: AlexChangeNavigator
};