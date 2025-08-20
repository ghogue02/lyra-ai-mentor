import { lazy } from 'react';

// Lazy load UI interaction patterns
export const LazyPriorityCardSystem = lazy(() => import('@/components/ui/interaction-patterns/PriorityCardSystem'));
export const LazyPreferenceSliderGrid = lazy(() => import('@/components/ui/interaction-patterns/PreferenceSliderGrid'));
export const LazyInteractiveDecisionTree = lazy(() => import('@/components/ui/interaction-patterns/InteractiveDecisionTree'));
export const LazyTimelineScenarioBuilder = lazy(() => import('@/components/ui/interaction-patterns/TimelineScenarioBuilder'));
export const LazyConversationalFlow = lazy(() => import('@/components/ui/interaction-patterns/ConversationalFlow'));

// Lazy load Carmen components (Chapter 7)
export const LazyCarmenPeopleManagementJourney = lazy(() => import('@/components/lesson/carmen/CarmenPeopleManagementJourney'));
export const LazyCarmenTalentAcquisition = lazy(() => import('@/components/lesson/carmen/CarmenTalentAcquisitionTest'));
export const LazyCarmenPerformanceInsights = lazy(() => import('@/components/lesson/carmen/CarmenPerformanceInsights'));
export const LazyCarmenEngagementBuilder = lazy(() => import('@/components/lesson/carmen/CarmenEngagementBuilder'));
export const LazyCarmenRetentionMastery = lazy(() => import('@/components/lesson/carmen/CarmenRetentionMastery'));
export const LazyCarmenTeamDynamics = lazy(() => import('@/components/lesson/carmen/CarmenTeamDynamics'));
export const LazyCarmenCulturalIntelligence = lazy(() => import('@/components/lesson/carmen/CarmenCulturalIntelligence'));
export const LazyCarmenLeadershipDevelopment = lazy(() => import('@/components/lesson/carmen/CarmenLeadershipDevelopment'));

// Lazy load Maya components
export const LazyMayaInteractiveJourney = lazy(() => import('@/components/lesson/chat/lyra/maya/MayaInteractiveJourney'));
export const LazyMayaToneMastery = lazy(() => import('@/components/lesson/chat/lyra/maya/MayaToneMastery'));
export const LazyMayaTemplateLibraryBuilder = lazy(() => import('@/components/lesson/MayaTemplateLibraryBuilder'));
export const LazyMayaDifficultConversationsGuide = lazy(() => import('@/components/lesson/MayaDifficultConversationsGuide'));
export const LazyMayaSubjectLineWorkshop = lazy(() => import('@/components/lesson/MayaSubjectLineWorkshop'));

// Lazy load Lyra components
export const LazyLyraFoundationsJourney = lazy(() => import('@/components/lesson/chat/lyra/LyraFoundationsJourney'));
export const LazyLyraUnderstandingAIModelsLesson = lazy(() => import('@/components/lesson/LyraUnderstandingAIModelsLesson').then(m => ({ default: m.LyraUnderstandingAIModelsLesson })));
export const LazyLyraPromptingFundamentalsLesson = lazy(() => import('@/components/lesson/LyraPromptingFundamentalsLesson').then(m => ({ default: m.LyraPromptingFundamentalsLesson })));
export const LazyLyraAIEthicsLesson = lazy(() => import('@/components/lesson/LyraAIEthicsLesson').then(m => ({ default: m.LyraAIEthicsLesson })));
export const LazyLyraAIToolkitSetupLesson = lazy(() => import('@/components/lesson/LyraAIToolkitSetupLesson').then(m => ({ default: m.LyraAIToolkitSetupLesson })));

// Lazy load Sofia components
export const LazySofiaStorytellingJourney = lazy(() => import('@/components/lesson/chat/sofia/SofiaStorytellingJourney'));
export const LazySofiaMissionStoryCreator = lazy(() => import('@/components/lesson/SofiaMissionStoryCreator'));
export const LazySofiaVoiceDiscovery = lazy(() => import('@/components/lesson/SofiaVoiceDiscovery'));
export const LazySofiaStoryBreakthrough = lazy(() => import('@/components/lesson/SofiaStoryBreakthrough'));
export const LazySofiaImpactScaling = lazy(() => import('@/components/lesson/SofiaImpactScaling'));

// Lazy load David components
export const LazyDavidDataJourney = lazy(() => import('@/components/lesson/chat/david/DavidDataJourney'));
export const LazyDavidDataFoundations = lazy(() => import('@/components/lesson/david/DavidDataFoundations'));
export const LazyDavidVisualStorytelling = lazy(() => import('@/components/lesson/david/DavidVisualStorytelling'));
export const LazyDavidDataRevival = lazy(() => import('@/components/lesson/david/DavidDataRevival'));
export const LazyDavidStakeholderCommunication = lazy(() => import('@/components/lesson/david/DavidStakeholderCommunication'));
export const LazyDavidPredictiveInsights = lazy(() => import('@/components/lesson/david/DavidPredictiveInsights'));
export const LazyDavidDataEcosystem = lazy(() => import('@/components/lesson/david/DavidDataEcosystem'));

// Lazy load Rachel components
export const LazyRachelAutomationJourney = lazy(() => import('@/components/lesson/chat/rachel/RachelAutomationJourney'));
export const LazyRachelAutomationVision = lazy(() => import('@/components/lesson/RachelAutomationVision'));
export const LazyRachelHumanCenteredDesign = lazy(() => import('@/components/lesson/RachelHumanCenteredDesign'));
export const LazyRachelAutomationPlanning = lazy(() => import('@/components/lesson/RachelAutomationPlanning'));
export const LazyRachelWorkflowDesign = lazy(() => import('@/components/lesson/RachelWorkflowDesign'));
export const LazyRachelScalingSystems = lazy(() => import('@/components/lesson/RachelScalingSystems'));
export const LazyRachelEcosystemBuilder = lazy(() => import('@/components/lesson/RachelEcosystemBuilder'));

// Lazy load Alex components
export const LazyAlexLeadershipJourney = lazy(() => import('@/components/lesson/chat/alex/AlexLeadershipJourney'));
export const LazyAlexLeadershipChallenges = lazy(() => import('@/components/lesson/AlexLeadershipChallenges'));
export const LazyAlexVisionBuilding = lazy(() => import('@/components/lesson/AlexVisionBuilding'));
export const LazyAlexTransformationPlanning = lazy(() => import('@/components/lesson/AlexTransformationPlanning'));
export const LazyAlexTeamAlignment = lazy(() => import('@/components/lesson/AlexTeamAlignment'));
export const LazyAlexFutureLeadership = lazy(() => import('@/components/lesson/AlexFutureLeadership'));
export const LazyAlexLeadershipFramework = lazy(() => import('@/components/lesson/AlexLeadershipFramework'));

// Lazy load Tool components
export const LazyDecisionMatrixRenderer = lazy(() => import('@/components/lesson/tools/DecisionMatrixRenderer'));
export const LazyTeamCapacityCalculator = lazy(() => import('@/components/lesson/tools/TeamCapacityCalculator'));
export const LazyTeamCapacityResults = lazy(() => import('@/components/lesson/tools/TeamCapacityResults'));
export const LazyProjectCharterBuilder = lazy(() => import('@/components/lesson/tools/ProjectCharterBuilder'));