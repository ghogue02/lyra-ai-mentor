import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { HelpProvider } from '@/contexts/HelpContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import { CharacterStoryProvider } from '@/contexts/CharacterStoryContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { Loader2 } from 'lucide-react';
import './App.css';

// Optimized lazy imports with code splitting
const Index = lazy(() => import('@/pages/Index'));
const Chapter1 = lazy(() => import('@/pages/Chapter1'));
const Chapter2Hub = lazy(() => import('@/pages/Chapter2Hub'));
const Chapter3Demo = lazy(() => import('@/pages/Chapter3Demo'));
const Chapter4Demo = lazy(() => import('@/pages/Chapter4Demo'));
const Chapter5Demo = lazy(() => import('@/pages/Chapter5Demo'));
const Chapter6Demo = lazy(() => import('@/pages/Chapter6Demo'));
const MayaSideBySideFixed = lazy(() => import('@/pages/MayaSideBySideFixed'));
const AIPlaygroundTest = lazy(() => import('@/pages/AIPlaygroundTest'));
const AIPlaygroundPublic = lazy(() => import('@/pages/AIPlaygroundPublic'));
const LearningPaths = lazy(() => import('@/pages/LearningPaths'));
const ProgressConstellation = lazy(() => import('@/pages/ProgressConstellation'));

// Route-based component preloading
const routePreloadMap: Record<string, () => Promise<any>> = {
  '/': () => import('@/pages/Index'),
  '/chapter1': () => import('@/pages/Chapter1'),
  '/chapter2': () => import('@/pages/Chapter2Hub'),
  '/chapter3': () => import('@/pages/Chapter3Demo'),
  '/chapter4': () => import('@/pages/Chapter4Demo'),
  '/chapter5': () => import('@/pages/Chapter5Demo'),
  '/chapter6': () => import('@/pages/Chapter6Demo'),
  '/ai-playground': () => import('@/pages/AIPlaygroundTest'),
};

// Loading component with performance tracking
const PageLoader = ({ name = 'page' }: { name?: string }) => {
  useEffect(() => {
    performanceMonitor.measureComponent(`${name}-loading`, () => {
      console.debug(`Loading ${name}...`);
    });
  }, [name]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading {name}...</p>
      </div>
    </div>
  );
};

// Error boundary for route errors
class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Failed to load page
            </h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optimized QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Preload adjacent routes for faster navigation
function useRoutePreloader() {
  useEffect(() => {
    const preloadAdjacentRoutes = () => {
      const currentPath = window.location.pathname;
      
      // Preload based on common navigation patterns
      if (currentPath === '/') {
        import('@/pages/Chapter1');
        import('@/pages/LearningPaths');
      } else if (currentPath.includes('chapter')) {
        const chapterNum = parseInt(currentPath.match(/chapter(\d)/)?.[1] || '0');
        if (chapterNum > 1) {
          import(`@/pages/Chapter${chapterNum - 1}Demo`).catch(() => {});
        }
        if (chapterNum < 6) {
          import(`@/pages/Chapter${chapterNum + 1}Demo`).catch(() => {});
        }
      }
    };

    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadAdjacentRoutes, { timeout: 2000 });
    } else {
      setTimeout(preloadAdjacentRoutes, 1000);
    }
  }, []);
}

function App() {
  useRoutePreloader();

  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.measureComponent('App-initialization', () => {
      console.log('🚀 Lyra AI Mentor initialized');
    });

    // Prefetch critical assets
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Prefetch fonts and critical CSS
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/fonts/inter-var.woff2';
        document.head.appendChild(link);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <ProgressProvider>
            <CharacterStoryProvider>
              <HelpProvider>
                <TutorialProvider>
                  <Router>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <RouteErrorBoundary>
                        <Suspense fallback={<PageLoader />}>
                          <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Index />} />
                            <Route path="/public/ai-playground" element={<AIPlaygroundPublic />} />
                            
                            {/* Chapter routes */}
                            <Route path="/chapter1" element={<Chapter1 />} />
                            <Route path="/chapter2" element={<Chapter2Hub />} />
                            <Route path="/chapter2/maya" element={<MayaSideBySideFixed />} />
                            <Route path="/chapter3" element={<Chapter3Demo />} />
                            <Route path="/chapter4" element={<Chapter4Demo />} />
                            <Route path="/chapter5" element={<Chapter5Demo />} />
                            <Route path="/chapter6" element={<Chapter6Demo />} />
                            
                            {/* Feature routes */}
                            <Route path="/ai-playground" element={<AIPlaygroundTest />} />
                            <Route path="/learning-paths" element={<LearningPaths />} />
                            <Route path="/progress" element={<ProgressConstellation />} />
                            
                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </Suspense>
                      </RouteErrorBoundary>
                      <Toaster richColors position="bottom-center" />
                    </div>
                  </Router>
                </TutorialProvider>
              </HelpProvider>
            </CharacterStoryProvider>
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;