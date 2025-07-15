
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
