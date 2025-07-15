import { useEffect } from 'react';
import { PerformanceMonitor } from '../PerformanceMonitor';

// List of components that are directly imported and need tracking
const TRACKED_COMPONENTS = [
  'AlexChangeStrategy',
  'AlexLeadershipFramework',
  'AlexRoadmapCreator',
  'AlexVisionBuilder',
  'DavidDataRevival',
  'DavidDataStoryFinder',
  'DavidPresentationMaster',
  'DavidSystemBuilder',
  'MayaBoardMeetingPrep',
  'MayaEmailComposer',
  'MayaEmailConfidenceBuilder',
  'MayaGrantProposal',
  'MayaGrantProposalAdvanced',
  'MayaParentResponseEmail',
  'MayaPromptSandwichBuilder',
  'MayaResearchSynthesis',
  'RachelAutomationVision',
  'RachelEcosystemBuilder',
  'RachelProcessTransformer',
  'RachelWorkflowDesigner',
  'SofiaImpactScaling',
  'SofiaMissionStoryCreator',
  'SofiaStoryBreakthrough',
  'SofiaVoiceDiscovery',
  'AIContentGeneratorRenderer',
  'CalloutBoxRenderer',
  'KnowledgeCheckRenderer',
  'LyraChatRenderer',
  'ReflectionRenderer',
  'SequenceSorterRenderer',
  'GrantWritingAssistantDemo',
  'SubjectLineTester',
  'DocumentImprover',
  'TimeTracker',
  'InformationSummarizer'
];

// Enhanced component tracking for lazy-loaded components
export function useComponentLoadTracking(componentName: string, isLoaded: boolean) {
  useEffect(() => {
    if (isLoaded && TRACKED_COMPONENTS.includes(componentName)) {
      // Component has been loaded, track it
      const loadEndTime = performance.now();
      
      // Try to find the load start time from performance entries
      const navigationStart = performance.timing?.navigationStart || 0;
      const loadTime = loadEndTime - navigationStart;
      
      PerformanceMonitor.trackComponentLoad(componentName, loadTime);
      
      // Check if this is one of the problematic components
      if (loadTime > 100) {
        console.warn(`Slow component load detected: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
    }
  }, [componentName, isLoaded]);
}

// Auto-wrap components with performance tracking
export function createTrackedComponent<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  if (!TRACKED_COMPONENTS.includes(componentName)) {
    TRACKED_COMPONENTS.push(componentName);
  }
  
  // Return the component as-is for now
  // TODO: Implement withPerformanceTracking wrapper
  return Component;
}

// Hook to monitor overall import performance
export function useImportPerformanceMonitoring() {
  useEffect(() => {
    // Monitor dynamic imports
    const originalImport = window.import || ((m: string) => import(m));
    
    // @ts-ignore
    window.import = async (module: string) => {
      const startTime = performance.now();
      
      try {
        const result = await originalImport(module);
        const loadTime = performance.now() - startTime;
        
        // Extract component name from module path
        const match = module.match(/\/([^/]+)\.(tsx?|jsx?)$/);
        const componentName = match ? match[1] : module;
        
        if (TRACKED_COMPONENTS.some(name => module.includes(name))) {
          PerformanceMonitor.trackComponentLoad(`Dynamic: ${componentName}`, loadTime);
        }
        
        return result;
      } catch (error) {
        PerformanceMonitor.trackError(
          new Error(`Failed to import module: ${module} - ${error}`)
        );
        throw error;
      }
    };
    
    return () => {
      // @ts-ignore
      window.import = originalImport;
    };
  }, []);
}

// Batch performance tracking for multiple components
export function useBatchComponentTracking(components: { name: string; loaded: boolean }[]) {
  useEffect(() => {
    const loadedComponents = components.filter(c => c.loaded);
    
    if (loadedComponents.length > 0) {
      // Track batch load performance
      const batchLoadTime = performance.now() - performance.timing.navigationStart;
      
      console.log(`Batch loaded ${loadedComponents.length} components in ${batchLoadTime.toFixed(2)}ms`);
      
      // Track individual components
      loadedComponents.forEach(({ name }) => {
        if (TRACKED_COMPONENTS.includes(name)) {
          PerformanceMonitor.trackComponentLoad(name, batchLoadTime / loadedComponents.length);
        }
      });
      
      // Alert if too many components loaded at once
      if (loadedComponents.length > 10) {
        console.warn(`Large batch load detected: ${loadedComponents.length} components loaded simultaneously`);
      }
    }
  }, [components]);
}

// Monitor component render performance patterns
export function useRenderPatternAnalysis(componentName: string) {
  useEffect(() => {
    let renderCount = 0;
    let lastRenderTime = Date.now();
    
    const checkRenderPattern = () => {
      renderCount++;
      const now = Date.now();
      const timeSinceLastRender = now - lastRenderTime;
      
      // Detect rapid re-renders
      if (timeSinceLastRender < 100 && renderCount > 5) {
        PerformanceMonitor.trackError(
          new Error(`Rapid re-render detected in ${componentName}: ${renderCount} renders in ${timeSinceLastRender}ms`)
        );
      }
      
      lastRenderTime = now;
    };
    
    checkRenderPattern();
    
    // Reset counter after 1 second
    const resetInterval = setInterval(() => {
      renderCount = 0;
    }, 1000);
    
    return () => clearInterval(resetInterval);
  });
}

// Export the list of tracked components for reference
export { TRACKED_COMPONENTS };