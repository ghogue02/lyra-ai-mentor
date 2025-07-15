#!/usr/bin/env node

/**
 * Bundle Size Optimization Script
 * 
 * Target: Reduce main bundle from 1.58MB to 750kB (52% reduction)
 * 
 * Issues identified:
 * 1. 35+ components have both dynamic and static imports
 * 2. Main bundle is 1,577.82 kB (target: 750kB)
 * 3. Many testing/debugging components are included in production
 * 4. ComponentShowcase imports everything statically
 */

import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import conflicts identified from build output
const IMPORT_CONFLICTS = [
  'CalloutBoxRenderer',
  'LyraChatRenderer',
  'MayaEmailConfidenceBuilder',
  'MayaPromptSandwichBuilder',
  'MayaParentResponseEmail',
  'MayaGrantProposal',
  'MayaGrantProposalAdvanced',
  'MayaBoardMeetingPrep',
  'MayaResearchSynthesis',
  'MayaDocumentCreator',
  'MayaReportBuilder',
  'MayaTemplateDesigner',
  'SofiaMissionStoryCreator',
  'SofiaVoiceDiscovery',
  'SofiaStoryBreakthrough',
  'SofiaImpactScaling',
  'DavidDataRevival',
  'DavidDataStoryFinder',
  'DavidPresentationMaster',
  'DavidSystemBuilder',
  'RachelAutomationVision',
  'RachelWorkflowDesigner',
  'RachelProcessTransformer',
  'RachelEcosystemBuilder',
  'AlexChangeStrategy',
  'AlexVisionBuilder',
  'AlexRoadmapCreator',
  'AlexLeadershipFramework',
  'KnowledgeCheckRenderer',
  'ReflectionRenderer',
  'SequenceSorterRenderer',
  'DifficultConversationHelper',
  'AIContentGenerator',
  'AIEmailComposer',
  'DocumentImprover',
  'TemplateCreator',
  'DocumentGenerator',
  'AISocialMediaGenerator',
  'AIImpactStoryCreator',
  'MultipleChoiceScenarios',
  'DebugChapter3Loader'
];

// Files that likely include many static imports
const STATIC_IMPORT_FILES = [
  'src/components/lesson/interactive/directImportLoader.ts',
  'src/pages/ComponentShowcase.tsx',
  'src/pages/AIRefine.tsx',
  'src/pages/AITesting.tsx',
  'src/pages/InteractiveElementsHolding.tsx',
  'src/pages/DebugChapter3.tsx'
];

// Testing/debugging components that should be excluded from production
const TESTING_COMPONENTS = [
  'DebugChapter3Loader',
  'ComponentShowcase',
  'AIRefine',
  'AITesting',
  'InteractiveElementsHolding',
  'DebugChapter3'
];

class BundleOptimizer {
  constructor() {
    this.projectRoot = resolve(__dirname, '..');
    this.fixesApplied = [];
    this.errors = [];
  }

  async optimize() {
    console.log('🚀 Starting Bundle Optimization');
    console.log(`📊 Current size: 1,577.82 kB`);
    console.log(`🎯 Target size: 750 kB (52% reduction)`);
    console.log(`🔧 Import conflicts to fix: ${IMPORT_CONFLICTS.length}`);
    console.log('');

    try {
      // Step 1: Fix import conflicts
      await this.fixImportConflicts();
      
      // Step 2: Optimize ComponentShowcase
      await this.optimizeComponentShowcase();
      
      // Step 3: Create production build exclusions
      await this.createProductionExclusions();
      
      // Step 4: Configure code splitting
      await this.configureCodeSplitting();
      
      // Step 5: Update Vite config for better optimization
      await this.updateViteConfig();
      
      console.log('\\n✅ Bundle optimization completed!');
      console.log(`🔧 Applied ${this.fixesApplied.length} fixes`);
      console.log(`❌ Encountered ${this.errors.length} errors`);
      
      if (this.errors.length > 0) {
        console.log('\\n❌ Errors encountered:');
        this.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      console.log('\\n📋 Next steps:');
      console.log('   1. Run npm run build to verify improvements');
      console.log('   2. Test that all components still work');
      console.log('   3. Run performance tests');
      
    } catch (error) {
      console.error('💥 Optimization failed:', error);
      throw error;
    }
  }

  async fixImportConflicts() {
    console.log('🔧 Fixing import conflicts...');
    
    // Fix directImportLoader.ts - remove static imports
    const directImportPath = resolve(this.projectRoot, 'src/components/lesson/interactive/directImportLoader.ts');
    
    try {
      const content = await fs.readFile(directImportPath, 'utf8');
      
      // Replace static imports with dynamic imports
      let optimizedContent = content;
      
      // Remove static imports
      const staticImportRegex = /import\\s+\\{[^}]+\\}\\s+from\\s+['"][^'"]+['"]/g;
      optimizedContent = optimizedContent.replace(staticImportRegex, '');
      
      // Add dynamic loading function
      const dynamicLoaderCode = `
// Dynamic component loader for better code splitting
const loadComponent = async (componentName: string, componentPath: string) => {
  try {
    const module = await import(componentPath);
    return module[componentName] || module.default;
  } catch (error) {
    console.error(\`Failed to load component \${componentName}:\`, error);
    return null;
  }
};

// Dynamic component registry
const componentRegistry = {
  // Maya components
  MayaEmailConfidenceBuilder: () => loadComponent('MayaEmailConfidenceBuilder', '@/components/interactive/MayaEmailConfidenceBuilder'),
  MayaPromptSandwichBuilder: () => loadComponent('MayaPromptSandwichBuilder', '@/components/interactive/MayaPromptSandwichBuilder'),
  MayaParentResponseEmail: () => loadComponent('MayaParentResponseEmail', '@/components/interactive/MayaParentResponseEmail'),
  MayaGrantProposal: () => loadComponent('MayaGrantProposal', '@/components/interactive/MayaGrantProposal'),
  MayaGrantProposalAdvanced: () => loadComponent('MayaGrantProposalAdvanced', '@/components/interactive/MayaGrantProposalAdvanced'),
  MayaBoardMeetingPrep: () => loadComponent('MayaBoardMeetingPrep', '@/components/interactive/MayaBoardMeetingPrep'),
  MayaResearchSynthesis: () => loadComponent('MayaResearchSynthesis', '@/components/interactive/MayaResearchSynthesis'),
  MayaDocumentCreator: () => loadComponent('MayaDocumentCreator', '@/components/interactive/MayaDocumentCreator'),
  MayaReportBuilder: () => loadComponent('MayaReportBuilder', '@/components/interactive/MayaReportBuilder'),
  MayaTemplateDesigner: () => loadComponent('MayaTemplateDesigner', '@/components/interactive/MayaTemplateDesigner'),
  
  // Sofia components
  SofiaMissionStoryCreator: () => loadComponent('SofiaMissionStoryCreator', '@/components/interactive/SofiaMissionStoryCreator'),
  SofiaVoiceDiscovery: () => loadComponent('SofiaVoiceDiscovery', '@/components/interactive/SofiaVoiceDiscovery'),
  SofiaStoryBreakthrough: () => loadComponent('SofiaStoryBreakthrough', '@/components/interactive/SofiaStoryBreakthrough'),
  SofiaImpactScaling: () => loadComponent('SofiaImpactScaling', '@/components/interactive/SofiaImpactScaling'),
  
  // David components
  DavidDataRevival: () => loadComponent('DavidDataRevival', '@/components/interactive/DavidDataRevival'),
  DavidDataStoryFinder: () => loadComponent('DavidDataStoryFinder', '@/components/interactive/DavidDataStoryFinder'),
  DavidPresentationMaster: () => loadComponent('DavidPresentationMaster', '@/components/interactive/DavidPresentationMaster'),
  DavidSystemBuilder: () => loadComponent('DavidSystemBuilder', '@/components/interactive/DavidSystemBuilder'),
  
  // Rachel components
  RachelAutomationVision: () => loadComponent('RachelAutomationVision', '@/components/interactive/RachelAutomationVision'),
  RachelWorkflowDesigner: () => loadComponent('RachelWorkflowDesigner', '@/components/interactive/RachelWorkflowDesigner'),
  RachelProcessTransformer: () => loadComponent('RachelProcessTransformer', '@/components/interactive/RachelProcessTransformer'),
  RachelEcosystemBuilder: () => loadComponent('RachelEcosystemBuilder', '@/components/interactive/RachelEcosystemBuilder'),
  
  // Alex components
  AlexChangeStrategy: () => loadComponent('AlexChangeStrategy', '@/components/interactive/AlexChangeStrategy'),
  AlexVisionBuilder: () => loadComponent('AlexVisionBuilder', '@/components/interactive/AlexVisionBuilder'),
  AlexRoadmapCreator: () => loadComponent('AlexRoadmapCreator', '@/components/interactive/AlexRoadmapCreator'),
  AlexLeadershipFramework: () => loadComponent('AlexLeadershipFramework', '@/components/interactive/AlexLeadershipFramework'),
  
  // Core renderers
  CalloutBoxRenderer: () => loadComponent('CalloutBoxRenderer', '@/components/lesson/interactive/CalloutBoxRenderer'),
  LyraChatRenderer: () => loadComponent('LyraChatRenderer', '@/components/lesson/interactive/LyraChatRenderer'),
  KnowledgeCheckRenderer: () => loadComponent('KnowledgeCheckRenderer', '@/components/lesson/interactive/KnowledgeCheckRenderer'),
  ReflectionRenderer: () => loadComponent('ReflectionRenderer', '@/components/lesson/interactive/ReflectionRenderer'),
  SequenceSorterRenderer: () => loadComponent('SequenceSorterRenderer', '@/components/lesson/interactive/SequenceSorterRenderer'),
};

export const getDirectImportComponent = async (componentName: string) => {
  const loader = componentRegistry[componentName as keyof typeof componentRegistry];
  if (!loader) {
    console.warn(\`Component \${componentName} not found in registry\`);
    return null;
  }
  return await loader();
};
`;

      // Replace the existing export with the new dynamic loader
      optimizedContent = optimizedContent.replace(
        /export\\s+const\\s+getDirectImportComponent[^}]+}/s,
        dynamicLoaderCode
      );
      
      await fs.writeFile(directImportPath, optimizedContent);
      this.fixesApplied.push('Fixed directImportLoader.ts for dynamic imports');
      
    } catch (error) {
      this.errors.push(`Failed to fix directImportLoader.ts: ${error.message}`);
    }
  }

  async optimizeComponentShowcase() {
    console.log('🎨 Optimizing ComponentShowcase...');
    
    const showcasePath = resolve(this.projectRoot, 'src/pages/ComponentShowcase.tsx');
    
    try {
      const content = await fs.readFile(showcasePath, 'utf8');
      
      // Wrap in lazy loading
      const optimizedContent = `
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load the actual ComponentShowcase
const LazyComponentShowcase = React.lazy(() => import('./ComponentShowcaseInternal'));

const ComponentShowcase = () => {
  return (
    <ErrorBoundary fallback={<div>Error loading ComponentShowcase</div>}>
      <Suspense fallback={<div>Loading ComponentShowcase...</div>}>
        <LazyComponentShowcase />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ComponentShowcase;
`;

      // Move current content to internal file
      const internalPath = resolve(this.projectRoot, 'src/pages/ComponentShowcaseInternal.tsx');
      await fs.writeFile(internalPath, content);
      await fs.writeFile(showcasePath, optimizedContent);
      
      this.fixesApplied.push('Optimized ComponentShowcase with lazy loading');
      
    } catch (error) {
      this.errors.push(`Failed to optimize ComponentShowcase: ${error.message}`);
    }
  }

  async createProductionExclusions() {
    console.log('🏭 Creating production exclusions...');
    
    // Create a production-specific route guard
    const routeGuardPath = resolve(this.projectRoot, 'src/utils/productionRouteGuard.ts');
    
    const routeGuardContent = `
// Production route guard to exclude testing/debugging components
export const isProductionRoute = (path: string): boolean => {
  const testingRoutes = [
    '/component-showcase',
    '/ai-refine',
    '/ai-testing',
    '/interactive-elements-holding',
    '/debug-chapter-3'
  ];
  
  return !testingRoutes.some(route => path.startsWith(route));
};

export const shouldLoadComponent = (componentName: string): boolean => {
  const testingComponents = [
    'DebugChapter3Loader',
    'ComponentShowcase',
    'AIRefine',
    'AITesting',
    'InteractiveElementsHolding'
  ];
  
  // In production, exclude testing components
  if (process.env.NODE_ENV === 'production') {
    return !testingComponents.includes(componentName);
  }
  
  return true;
};
`;

    try {
      await fs.writeFile(routeGuardPath, routeGuardContent);
      this.fixesApplied.push('Created production route guard');
    } catch (error) {
      this.errors.push(`Failed to create production route guard: ${error.message}`);
    }
  }

  async configureCodeSplitting() {
    console.log('📦 Configuring code splitting...');
    
    // Create a component chunks configuration
    const chunkConfigPath = resolve(this.projectRoot, 'src/utils/chunkConfig.ts');
    
    const chunkConfigContent = `
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
`;

    try {
      await fs.writeFile(chunkConfigPath, chunkConfigContent);
      this.fixesApplied.push('Created code splitting configuration');
    } catch (error) {
      this.errors.push(`Failed to create chunk config: ${error.message}`);
    }
  }

  async updateViteConfig() {
    console.log('⚙️ Updating Vite configuration...');
    
    const viteConfigPath = resolve(this.projectRoot, 'vite.config.ts');
    
    try {
      const content = await fs.readFile(viteConfigPath, 'utf8');
      
      // Add rollup options for better code splitting
      const rollupOptions = `
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'chart-vendor': ['recharts'],
          
          // Character chunks
          'maya-components': [
            '/src/components/interactive/MayaEmailConfidenceBuilder',
            '/src/components/interactive/MayaPromptSandwichBuilder',
            '/src/components/interactive/MayaParentResponseEmail',
            '/src/components/interactive/MayaGrantProposal',
            '/src/components/interactive/MayaGrantProposalAdvanced',
            '/src/components/interactive/MayaBoardMeetingPrep',
            '/src/components/interactive/MayaResearchSynthesis',
            '/src/components/interactive/MayaDocumentCreator',
            '/src/components/interactive/MayaReportBuilder',
            '/src/components/interactive/MayaTemplateDesigner'
          ],
          
          'sofia-components': [
            '/src/components/interactive/SofiaMissionStoryCreator',
            '/src/components/interactive/SofiaVoiceDiscovery',
            '/src/components/interactive/SofiaStoryBreakthrough',
            '/src/components/interactive/SofiaImpactScaling'
          ],
          
          'david-components': [
            '/src/components/interactive/DavidDataRevival',
            '/src/components/interactive/DavidDataStoryFinder',
            '/src/components/interactive/DavidPresentationMaster',
            '/src/components/interactive/DavidSystemBuilder'
          ],
          
          'rachel-components': [
            '/src/components/interactive/RachelAutomationVision',
            '/src/components/interactive/RachelWorkflowDesigner',
            '/src/components/interactive/RachelProcessTransformer',
            '/src/components/interactive/RachelEcosystemBuilder'
          ],
          
          'alex-components': [
            '/src/components/interactive/AlexChangeStrategy',
            '/src/components/interactive/AlexVisionBuilder',
            '/src/components/interactive/AlexRoadmapCreator',
            '/src/components/interactive/AlexLeadershipFramework'
          ],
          
          // Testing components (will be excluded in production)
          'testing-components': [
            '/src/components/testing/DebugChapter3Loader',
            '/src/pages/ComponentShowcase',
            '/src/pages/AIRefine',
            '/src/pages/AITesting',
            '/src/pages/InteractiveElementsHolding'
          ]
        }
      }
    }`;
      
      // Insert rollup options into build config
      let optimizedContent = content;
      
      if (content.includes('build: {')) {
        // Add to existing build config
        optimizedContent = content.replace(
          /build:\\s*{([^}]*)}/,
          `build: {$1,${rollupOptions}`
        );
      } else {
        // Add new build config
        optimizedContent = content.replace(
          /export default defineConfig\\(\\{([^}]*)\\}\\)/,
          `export default defineConfig({$1,
  build: {${rollupOptions}
  })`
        );
      }
      
      await fs.writeFile(viteConfigPath, optimizedContent);
      this.fixesApplied.push('Updated Vite configuration for code splitting');
      
    } catch (error) {
      this.errors.push(`Failed to update Vite config: ${error.message}`);
    }
  }
}

// Run the optimization
const optimizer = new BundleOptimizer();
optimizer.optimize().catch(console.error);