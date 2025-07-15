
// Code splitting configuration for better bundle optimization
export const chunkConfig = {
  // Character-based chunks
  maya: [
    'MayaEmailConfidenceBuilder',
    'MayaPromptSandwichBuilder',
    'MayaParentResponseEmail',
    'MayaGrantProposal',
    'MayaGrantProposalAdvanced',
    'MayaBoardMeetingPrep',
    'MayaResearchSynthesis',
    'MayaDocumentCreator',
    'MayaReportBuilder',
    'MayaTemplateDesigner'
  ],
  
  sofia: [
    'SofiaMissionStoryCreator',
    'SofiaVoiceDiscovery',
    'SofiaStoryBreakthrough',
    'SofiaImpactScaling'
  ],
  
  david: [
    'DavidDataRevival',
    'DavidDataStoryFinder',
    'DavidPresentationMaster',
    'DavidSystemBuilder'
  ],
  
  rachel: [
    'RachelAutomationVision',
    'RachelWorkflowDesigner',
    'RachelProcessTransformer',
    'RachelEcosystemBuilder'
  ],
  
  alex: [
    'AlexChangeStrategy',
    'AlexVisionBuilder',
    'AlexRoadmapCreator',
    'AlexLeadershipFramework'
  ],
  
  core: [
    'CalloutBoxRenderer',
    'LyraChatRenderer',
    'KnowledgeCheckRenderer',
    'ReflectionRenderer',
    'SequenceSorterRenderer'
  ],
  
  testing: [
    'DebugChapter3Loader',
    'ComponentShowcase',
    'AIRefine',
    'AITesting',
    'InteractiveElementsHolding',
    'DifficultConversationHelper',
    'AIContentGenerator',
    'AIEmailComposer',
    'DocumentImprover',
    'TemplateCreator',
    'DocumentGenerator',
    'AISocialMediaGenerator',
    'AIImpactStoryCreator',
    'MultipleChoiceScenarios'
  ]
};

export const getChunkForComponent = (componentName: string): string => {
  for (const [chunkName, components] of Object.entries(chunkConfig)) {
    if (components.includes(componentName)) {
      return chunkName;
    }
  }
  return 'default';
};
