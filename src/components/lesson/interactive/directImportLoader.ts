import React from 'react';
import { PerformanceMonitor } from '@/monitoring/PerformanceMonitor';
import { createTrackedComponent } from '@/monitoring/hooks/useComponentTracking';

// Direct imports for problematic components to bypass React.lazy entirely
// These imports are now tracked for performance monitoring

// Core renderer components (used in InteractiveElementRenderer)
import { CalloutBoxRenderer } from './CalloutBoxRenderer';
import { LyraChatRenderer } from './LyraChatRenderer';

// Maya components (Chapter 2)
import { MayaEmailConfidenceBuilder } from '@/components/interactive/MayaEmailConfidenceBuilder';
import { MayaPromptSandwichBuilder } from '@/components/interactive/MayaPromptSandwichBuilder';
import { MayaParentResponseEmail } from '@/components/interactive/MayaParentResponseEmail';
import { MayaGrantProposal } from '@/components/interactive/MayaGrantProposal';
import { MayaGrantProposalAdvanced } from '@/components/interactive/MayaGrantProposalAdvanced';
import { MayaBoardMeetingPrep } from '@/components/interactive/MayaBoardMeetingPrep';
import { MayaResearchSynthesis } from '@/components/interactive/MayaResearchSynthesis';
import { MayaDocumentCreator } from '@/components/interactive/MayaDocumentCreator';
import { MayaReportBuilder } from '@/components/interactive/MayaReportBuilder';
import { MayaTemplateDesigner } from '@/components/interactive/MayaTemplateDesigner';

// Sofia components (Chapter 3)
import { SofiaMissionStoryCreator } from '@/components/interactive/SofiaMissionStoryCreator';
import { SofiaVoiceDiscovery } from '@/components/interactive/SofiaVoiceDiscovery';
import { SofiaStoryBreakthrough } from '@/components/interactive/SofiaStoryBreakthrough';
import { SofiaImpactScaling } from '@/components/interactive/SofiaImpactScaling';

// David components (Chapter 4)
import { DavidDataRevival } from '@/components/interactive/DavidDataRevival';
import { DavidDataStoryFinder } from '@/components/interactive/DavidDataStoryFinder';
import { DavidPresentationMaster } from '@/components/interactive/DavidPresentationMaster';
import { DavidSystemBuilder } from '@/components/interactive/DavidSystemBuilder';

// Rachel components (Chapter 5)
import { RachelAutomationVision } from '@/components/interactive/RachelAutomationVision';
import { RachelWorkflowDesigner } from '@/components/interactive/RachelWorkflowDesigner';
import { RachelProcessTransformer } from '@/components/interactive/RachelProcessTransformer';
import { RachelEcosystemBuilder } from '@/components/interactive/RachelEcosystemBuilder';

// Alex components (Chapter 6)
import { AlexChangeStrategy } from '@/components/interactive/AlexChangeStrategy';
import { AlexVisionBuilder } from '@/components/interactive/AlexVisionBuilder';
import { AlexRoadmapCreator } from '@/components/interactive/AlexRoadmapCreator';
import { AlexLeadershipFramework } from '@/components/interactive/AlexLeadershipFramework';

// Core interactive components that may use lazy loading
import { KnowledgeCheckRenderer } from './KnowledgeCheckRenderer';
import { ReflectionRenderer } from './ReflectionRenderer';
import { SequenceSorterRenderer } from './SequenceSorterRenderer';

// Testing components that might be used in lessons
import { DifficultConversationHelper } from '@/components/testing/DifficultConversationHelper';
import { AIContentGenerator } from '@/components/testing/AIContentGenerator';
import { AIEmailComposer } from '@/components/testing/AIEmailComposer';
import { DocumentImprover } from '@/components/testing/DocumentImprover';
import { TemplateCreator } from '@/components/testing/TemplateCreator';
import { DocumentGenerator } from '@/components/testing/DocumentGenerator';
import { AISocialMediaGenerator } from '@/components/testing/AISocialMediaGenerator';

// Map of components that should be loaded directly
const directImportMap: Record<string, React.ComponentType<any>> = {
  // Core renderer components
  CalloutBoxRenderer,
  LyraChatRenderer,
  
  // Maya components
  MayaEmailConfidenceBuilder,
  MayaPromptSandwichBuilder,
  MayaParentResponseEmail,
  MayaGrantProposal,
  MayaGrantProposalAdvanced,
  MayaBoardMeetingPrep,
  MayaResearchSynthesis,
  MayaDocumentCreator,
  MayaReportBuilder,
  MayaTemplateDesigner,
  
  // Sofia components
  SofiaMissionStoryCreator,
  SofiaVoiceDiscovery,
  SofiaStoryBreakthrough,
  SofiaImpactScaling,
  
  // David components
  DavidDataRevival,
  DavidDataStoryFinder,
  DavidPresentationMaster,
  DavidSystemBuilder,
  
  // Rachel components
  RachelAutomationVision,
  RachelWorkflowDesigner,
  RachelProcessTransformer,
  RachelEcosystemBuilder,
  
  // Alex components
  AlexChangeStrategy,
  AlexVisionBuilder,
  AlexRoadmapCreator,
  AlexLeadershipFramework,
  
  // Core interactive components
  KnowledgeCheckRenderer,
  ReflectionRenderer,
  SequenceSorterRenderer,
  
  // Testing components
  DifficultConversationHelper,
  AIContentGenerator,
  AIEmailComposer,
  DocumentImprover,
  TemplateCreator,
  DocumentGenerator,
  AISocialMediaGenerator
};

/**
 * Get a component directly without lazy loading
 * This bypasses all React.lazy issues for problematic components
 * Now includes performance tracking for all direct imports
 */
export function getDirectComponent(componentName: string): React.ComponentType<any> | null {
  const startTime = performance.now();
  console.log('[DirectImportLoader] Checking for direct import:', componentName);
  
  const component = directImportMap[componentName];
  if (component) {
    const loadTime = performance.now() - startTime;
    console.log('[DirectImportLoader] Using direct import for:', componentName);
    
    // Track the component load performance
    PerformanceMonitor.trackComponentLoad(`DirectImport:${componentName}`, loadTime);
    
    // Return the tracked version of the component
    return createTrackedComponent(component, componentName);
  }
  
  console.log('[DirectImportLoader] No direct import found for:', componentName);
  return null;
}

/**
 * Check if a component should use direct import
 */
export function shouldUseDirectImport(componentName: string): boolean {
  return componentName in directImportMap;
}

/**
 * Get list of all components using direct import
 */
export function getDirectImportComponents(): string[] {
  return Object.keys(directImportMap);
}