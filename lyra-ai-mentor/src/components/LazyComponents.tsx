// Centralized lazy component imports with optimized loading
import { withLazyLoading, lazyWithRetry } from '@/utils/lazyComponents';

// Character Components - Load on demand
export const MayaEmailComposer = withLazyLoading(
  () => import('@/components/interactive/MayaEmailComposer'),
  'Maya Email Composer'
);

export const SofiaVoiceDiscovery = withLazyLoading(
  () => import('@/components/interactive/SofiaVoiceDiscovery'),
  'Sofia Voice Discovery'
);

export const DavidDataStoryFinder = withLazyLoading(
  () => import('@/components/interactive/DavidDataStoryFinder'),
  'David Data Story Finder'
);

export const RachelAutomationBuilder = withLazyLoading(
  () => import('@/components/interactive/RachelAutomationBuilder'),
  'Rachel Automation Builder'
);

export const AlexChangeStrategy = withLazyLoading(
  () => import('@/components/interactive/AlexChangeStrategy'),
  'Alex Change Strategy'
);

// AI Playground - Heavy component, load with retry
export const AIPlaygroundTest = withLazyLoading(
  () => lazyWithRetry(() => import('@/pages/AIPlaygroundTest')),
  'AI Playground'
);

// Document Export Components - Load when needed
export const ExportComponents = {
  // PDFExporter: withLazyLoading(
  //   () => import('@/components/export/PDFExporter'),
  //   'PDF Exporter'
  // ),
  // DocxExporter: withLazyLoading(
  //   () => import('@/components/export/DocxExporter'),
  //   'Docx Exporter'
  // ),
};

// Testing Components - Only load in development
export const TestingComponents = import.meta.env.DEV ? {
  InteractiveElementBuilder: withLazyLoading(
    () => import('@/components/testing/InteractiveElementBuilder'),
    'Interactive Element Builder'
  ),
  ChapterBuilderAgent: withLazyLoading(
    () => import('@/components/testing/ChapterBuilderAgent'),
    'Chapter Builder Agent'
  ),
  AutomatedElementEnhancer: withLazyLoading(
    () => import('@/components/testing/AutomatedElementEnhancer'),
    'Automated Element Enhancer'
  ),
} : {};

// Chart Components - Load when data visualization is needed
export const ChartComponents = {
  ProgressDashboard: withLazyLoading(
    () => import('@/components/analytics/ProgressDashboard'),
    'Progress Dashboard'
  ),
  AIImpactCalculator: withLazyLoading(
    () => import('@/components/ai-playground/AIImpactCalculator'),
    'AI Impact Calculator'
  ),
};

// Maya Lesson Components
export const MayaLessonComponents = {
  LyraNarratedMayaSideBySideComplete: withLazyLoading(
    () => import('@/components/lesson/chat/lyra/maya/LyraNarratedMayaSideBySideComplete'),
    'Maya Side-by-Side Lesson'
  ),
  MayaDifficultConversationsWorkshop: withLazyLoading(
    () => import('@/components/interactive/MayaDifficultConversationsWorkshop'),
    'Maya Difficult Conversations'
  ),
  MayaTemplateDesigner: withLazyLoading(
    () => import('@/components/interactive/MayaTemplateDesigner'),
    'Maya Template Designer'
  ),
};

// Preload critical components based on route
export function preloadRouteComponents(route: string) {
  switch (route) {
    case '/chapter2/maya':
      import('@/components/interactive/MayaEmailComposer');
      break;
    case '/chapter3/sofia':
      import('@/components/interactive/SofiaVoiceStory');
      break;
    case '/chapter4/david':
      import('@/components/interactive/DavidDataAnalyzer');
      break;
    case '/chapter5/rachel':
      import('@/components/interactive/RachelAutomationBuilder');
      break;
    case '/chapter6/alex':
      import('@/components/interactive/AlexChangeStrategy');
      break;
    case '/ai-playground':
      import('@/pages/AIPlaygroundTest');
      break;
  }
}