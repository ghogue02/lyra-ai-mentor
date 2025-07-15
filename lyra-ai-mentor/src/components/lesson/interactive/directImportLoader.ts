import React from 'react';
import { PerformanceMonitor } from '@/monitoring/PerformanceMonitor';
import { createTrackedComponent } from '@/monitoring/hooks/useComponentTracking';

// OPTIMIZED: Use dynamic imports to prevent bundle bloat
// Only import core components statically to avoid conflicts

// Core renderer components (used in InteractiveElementRenderer)
import { CalloutBoxRenderer } from './CalloutBoxRenderer';
import { LyraChatRenderer } from './LyraChatRenderer';

// Core interactive components that may use lazy loading
import { KnowledgeCheckRenderer } from './KnowledgeCheckRenderer';
import { ReflectionRenderer } from './ReflectionRenderer';
import { SequenceSorterRenderer } from './SequenceSorterRenderer';

// Production-optimized: Use async imports for character and testing components
// This ensures components are only loaded when needed, reducing initial bundle size
const asyncComponentLoader = {
  // Maya components (Chapter 2) - Load only when Maya chapter is accessed
  MayaEmailConfidenceBuilder: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaEmailConfidenceBuilder').then(m => m.MayaEmailConfidenceBuilder),
  MayaPromptSandwichBuilder: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaPromptSandwichBuilder').then(m => m.MayaPromptSandwichBuilder),
  MayaParentResponseEmail: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaParentResponseEmail').then(m => m.MayaParentResponseEmail),
  MayaGrantProposal: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaGrantProposal').then(m => m.MayaGrantProposal),
  MayaGrantProposalAdvanced: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaGrantProposalAdvanced').then(m => m.MayaGrantProposalAdvanced),
  MayaBoardMeetingPrep: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaBoardMeetingPrep').then(m => m.MayaBoardMeetingPrep),
  MayaResearchSynthesis: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaResearchSynthesis').then(m => m.MayaResearchSynthesis),
  MayaDocumentCreator: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaDocumentCreator').then(m => m.MayaDocumentCreator),
  MayaReportBuilder: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaReportBuilder').then(m => m.MayaReportBuilder),
  MayaTemplateDesigner: () => import(/* webpackChunkName: "maya-components" */ '@/components/interactive/MayaTemplateDesigner').then(m => m.MayaTemplateDesigner),

  // Sofia components (Chapter 3) - Load only when Sofia chapter is accessed
  SofiaMissionStoryCreator: () => import(/* webpackChunkName: "sofia-components" */ '@/components/interactive/SofiaMissionStoryCreator').then(m => m.SofiaMissionStoryCreator),
  SofiaVoiceDiscovery: () => import(/* webpackChunkName: "sofia-components" */ '@/components/interactive/SofiaVoiceDiscovery').then(m => m.SofiaVoiceDiscovery),
  SofiaStoryBreakthrough: () => import(/* webpackChunkName: "sofia-components" */ '@/components/interactive/SofiaStoryBreakthrough').then(m => m.SofiaStoryBreakthrough),
  SofiaImpactScaling: () => import(/* webpackChunkName: "sofia-components" */ '@/components/interactive/SofiaImpactScaling').then(m => m.SofiaImpactScaling),

  // David components (Chapter 4) - Load only when David chapter is accessed
  DavidDataRevival: () => import(/* webpackChunkName: "david-components" */ '@/components/interactive/DavidDataRevival').then(m => m.DavidDataRevival),
  DavidDataStoryFinder: () => import(/* webpackChunkName: "david-components" */ '@/components/interactive/DavidDataStoryFinder').then(m => m.DavidDataStoryFinder),
  DavidPresentationMaster: () => import(/* webpackChunkName: "david-components" */ '@/components/interactive/DavidPresentationMaster').then(m => m.DavidPresentationMaster),
  DavidSystemBuilder: () => import(/* webpackChunkName: "david-components" */ '@/components/interactive/DavidSystemBuilder').then(m => m.DavidSystemBuilder),

  // Rachel components (Chapter 5) - Load only when Rachel chapter is accessed
  RachelAutomationVision: () => import(/* webpackChunkName: "rachel-components" */ '@/components/interactive/RachelAutomationVision').then(m => m.RachelAutomationVision),
  RachelWorkflowDesigner: () => import(/* webpackChunkName: "rachel-components" */ '@/components/interactive/RachelWorkflowDesigner').then(m => m.RachelWorkflowDesigner),
  RachelProcessTransformer: () => import(/* webpackChunkName: "rachel-components" */ '@/components/interactive/RachelProcessTransformer').then(m => m.RachelProcessTransformer),
  RachelEcosystemBuilder: () => import(/* webpackChunkName: "rachel-components" */ '@/components/interactive/RachelEcosystemBuilder').then(m => m.RachelEcosystemBuilder),

  // Alex components (Chapter 6) - Load only when Alex chapter is accessed
  AlexChangeStrategy: () => import(/* webpackChunkName: "alex-components" */ '@/components/interactive/AlexChangeStrategy').then(m => m.AlexChangeStrategy),
  AlexVisionBuilder: () => import(/* webpackChunkName: "alex-components" */ '@/components/interactive/AlexVisionBuilder').then(m => m.AlexVisionBuilder),
  AlexRoadmapCreator: () => import(/* webpackChunkName: "alex-components" */ '@/components/interactive/AlexRoadmapCreator').then(m => m.AlexRoadmapCreator),
  AlexLeadershipFramework: () => import(/* webpackChunkName: "alex-components" */ '@/components/interactive/AlexLeadershipFramework').then(m => m.AlexLeadershipFramework),

  // Testing components - Only load when testing features are accessed
  DifficultConversationHelper: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/DifficultConversationHelper').then(m => m.DifficultConversationHelper),
  AIContentGenerator: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/AIContentGenerator').then(m => m.AIContentGenerator),
  AIEmailComposer: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/AIEmailComposer').then(m => m.AIEmailComposer),
  DocumentImprover: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/DocumentImprover').then(m => m.DocumentImprover),
  TemplateCreator: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/TemplateCreator').then(m => m.TemplateCreator),
  DocumentGenerator: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/DocumentGenerator').then(m => m.DocumentGenerator),
  AISocialMediaGenerator: () => import(/* webpackChunkName: "testing-components" */ '@/components/testing/AISocialMediaGenerator').then(m => m.AISocialMediaGenerator),
};

// Map of components that should be loaded directly (CORE ONLY)
const directImportMap: Record<string, React.ComponentType<any>> = {
  // Core renderer components - keep static for essential functionality
  CalloutBoxRenderer,
  LyraChatRenderer,
  KnowledgeCheckRenderer,
  ReflectionRenderer,
  SequenceSorterRenderer,
};

/**
 * Get a component (direct import for core, async for character components)
 * This optimizes bundle size while maintaining functionality
 */
export function getDirectComponent(componentName: string): React.ComponentType<any> | null {
  const startTime = performance.now();
  console.log('[DirectImportLoader] Checking for component:', componentName);
  
  // First, check if it's a core component that needs direct import
  const directComponent = directImportMap[componentName];
  if (directComponent) {
    const loadTime = performance.now() - startTime;
    console.log('[DirectImportLoader] Using direct import for core component:', componentName);
    
    // Track the component load performance
    PerformanceMonitor.trackComponentLoad(`DirectImport:${componentName}`, loadTime);
    
    // Return the tracked version of the component
    return createTrackedComponent(directComponent, componentName);
  }
  
  // Check if it's a character/testing component that should be async loaded
  const asyncLoader = asyncComponentLoader[componentName as keyof typeof asyncComponentLoader];
  if (asyncLoader) {
    console.log('[DirectImportLoader] Will use async loading for:', componentName);
    // Return a lazy component for character/testing components
    return React.lazy(async () => {
      const loadStart = performance.now();
      try {
        const component = await asyncLoader();
        const loadTime = performance.now() - loadStart;
        PerformanceMonitor.trackComponentLoad(`AsyncImport:${componentName}`, loadTime);
        return { default: createTrackedComponent(component, componentName) };
      } catch (error) {
        console.error('[DirectImportLoader] Failed to load component:', componentName, error);
        throw error;
      }
    });
  }
  
  console.log('[DirectImportLoader] No component found for:', componentName);
  return null;
}

/**
 * Check if a component is available (either direct or async)
 */
export function shouldUseDirectImport(componentName: string): boolean {
  return componentName in directImportMap || componentName in asyncComponentLoader;
}

/**
 * Get list of all available components
 */
export function getDirectImportComponents(): string[] {
  return [...Object.keys(directImportMap), ...Object.keys(asyncComponentLoader)];
}

/**
 * Check if component is core (direct import) vs character/testing (async)
 */
export function isCoreComponent(componentName: string): boolean {
  return componentName in directImportMap;
}