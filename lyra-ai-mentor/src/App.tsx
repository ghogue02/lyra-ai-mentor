
import React, { useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CharacterStoryProvider } from "@/contexts/CharacterStoryContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { GuidedTutorial } from "@/components/tutorial";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PerformanceMonitorComponent, PerformanceErrorBoundary } from "@/monitoring/PerformanceMonitor.tsx";
import { PerformanceMonitor } from "@/monitoring/PerformanceMonitor";
import { trackWebVitals } from "@/monitoring/middleware";
import { useQueryPerformanceMonitoring } from "@/monitoring/hooks/useQueryPerformance";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Lesson from "./pages/Lesson";
import AITesting from "./pages/AITesting";
import AIRefine from "./pages/AIRefine";
import InteractiveElementsHolding from "./pages/InteractiveElementsHolding";
import DebugChapter3 from "./pages/DebugChapter3";
import PerformanceDashboard from "./pages/PerformanceDashboard";
// Production-optimized: Lazy load showcase to reduce bundle size
const ComponentShowcase = React.lazy(() => import("./pages/ComponentShowcase"));
const MagicalFeaturesDemo = React.lazy(() => import("./pages/MagicalFeaturesDemo"));
const ProgressConstellation = React.lazy(() => import("./pages/ProgressConstellation"));
const AIPlayground = React.lazy(() => import("./pages/AIPlayground"));
const JourneyShowcase = React.lazy(() => import("./pages/JourneyShowcase"));
const SkillsDashboard = React.lazy(() => import("./pages/SkillsDashboard"));
const StoryIntegrationDemo = React.lazy(() => import("./pages/StoryIntegrationDemo"));
const PerformanceMetrics = React.lazy(() => import("./pages/PerformanceMetrics"));
const AIPlaygroundTest = React.lazy(() => import("./pages/AIPlaygroundTest"));
const MultimodalShowcase = React.lazy(() => import("./pages/MultimodalShowcase"));
const AIPlaygroundPublic = React.lazy(() => import("./pages/AIPlaygroundPublic"));
const LearningPaths = React.lazy(() => import("./pages/LearningPaths"));
const VoiceTestDemo = React.lazy(() => import("./pages/VoiceTestDemo"));
const MicroLessonDemo = React.lazy(() => import("./pages/MicroLessonDemo"));
const MicroLessonEnhancedDemo = React.lazy(() => import("./pages/MicroLessonEnhancedDemo"));
const ExportIntegrationDemo = React.lazy(() => import("./pages/ExportIntegrationDemo"));
const TutorialShowcase = React.lazy(() => import("./pages/TutorialShowcase"));
const AIErrorHandlingDemo = React.lazy(() => import("./pages/AIErrorHandlingDemo"));
const MinimalUIDemo = React.lazy(() => import("./pages/MinimalUIDemo"));
const MayaSideBySide = React.lazy(() => import("./pages/MayaSideBySideFixed"));
const LyraNarratedMayaDemo = React.lazy(() => import("./pages/LyraNarratedMayaDemo"));
const VisualOptionsShowcase = React.lazy(() => import("./pages/VisualOptionsShowcase"));
const MayaEmailMasteryLesson = React.lazy(() => import("../testing/chapter-3/lesson-11/MayaEmailMasteryLesson"));
const SofiaVoiceDiscoveryLesson = React.lazy(() => import("../testing/chapter-3/lesson-12/SofiaVoiceDiscoveryLesson"));
const Chapter2Hub = React.lazy(() => import("./pages/Chapter2Hub"));
const MayaToneMasteryLesson = React.lazy(() => import("./pages/MayaToneMasteryLesson"));
const MayaTemplateLibraryLesson = React.lazy(() => import("./pages/MayaTemplateLibraryLesson"));
const MayaDifficultConversationsLesson = React.lazy(() => import("./pages/MayaDifficultConversationsLesson"));
const MayaSubjectWorkshopLesson = React.lazy(() => import("./pages/MayaSubjectWorkshopLesson"));
const Chapter3Demo = React.lazy(() => import("./pages/Chapter3Demo"));
const Chapter4Demo = React.lazy(() => import("./pages/Chapter4Demo"));
const Chapter5Demo = React.lazy(() => import("./pages/Chapter5Demo"));
const Chapter6Demo = React.lazy(() => import("./pages/Chapter6Demo"));
const RulesEngineConfig = React.lazy(() => import("./pages/RulesEngineConfig"));
const LessonPrototypeStudio = React.lazy(() => import("./components/demo/LessonPrototypeStudio"));
const AutomatedPrototypeRunner = React.lazy(() => import("./components/admin/AutomatedPrototypeRunner"));
const PrototypeResultsViewer = React.lazy(() => import("./components/admin/PrototypeResultsViewer"));
const ComponentGenerationRunner = React.lazy(() => import("./components/admin/ComponentGenerationRunner"));
const SimplePrototypeViewer = React.lazy(() => import("./components/admin/SimplePrototypeViewer"));
const MicroLessonPrototype = React.lazy(() => import("./pages/MicroLessonPrototype"));
const StorylineLessonPrototype = React.lazy(() => import("./pages/StorylineLessonPrototype"));
const StorylineCharacterSelection = React.lazy(() => import("./pages/StorylineCharacterSelection"));

const queryClient = new QueryClient();

// Inner component that uses React Query hooks
const AppWithQueryTracking = ({ children }: { children: React.ReactNode }) => {
  useQueryPerformanceMonitoring();
  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    // Initialize web vitals tracking
    trackWebVitals();
    
    // Set up performance alert logging
    const unsubscribe = PerformanceMonitor.onAlert((alert) => {
      if (alert.severity === 'critical') {
        console.error('[Performance Critical]', alert.message);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppWithQueryTracking>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PerformanceMonitorComponent enableConsoleLogging={true}>
          <PerformanceErrorBoundary>
            <AuthProvider>
              <ProgressProvider>
                <CharacterStoryProvider>
                  <TutorialProvider>
                    <BrowserRouter>
                      <GuidedTutorial />
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/:chapterId/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-testing" 
                element={
                  <ProtectedRoute>
                    <AITesting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-refine" 
                element={
                  <ProtectedRoute>
                    <AIRefine />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/interactive-elements" 
                element={
                  <ProtectedRoute>
                    <InteractiveElementsHolding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/debug-chapter3" 
                element={
                  <ProtectedRoute>
                    <DebugChapter3 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/showcase" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                      <ComponentShowcase />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/export-demo" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                      <ExportIntegrationDemo />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/error-handling-demo" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                      <AIErrorHandlingDemo />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/performance" 
                element={
                  <ProtectedRoute>
                    <PerformanceDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/magical-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading magical features...</div>}>
                    <MagicalFeaturesDemo />
                  </Suspense>
                } 
              />
              <Route 
                path="/progress-constellation" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading constellation...</div>}>
                    <ProgressConstellation />
                  </Suspense>
                } 
              />
              <Route 
                path="/performance-metrics" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading performance metrics...</div>}>
                    <PerformanceMetrics />
                  </Suspense>
                } 
              />
              {/* AI Learning Playground Routes */}
              <Route 
                path="/ai-playground" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading AI Playground...</div>}>
                    <AIPlayground />
                  </Suspense>
                } 
              />
              <Route 
                path="/journey-showcase" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Journey Showcase...</div>}>
                    <JourneyShowcase />
                  </Suspense>
                } 
              />
              <Route 
                path="/skills-dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Skills Dashboard...</div>}>
                      <SkillsDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/story-integration" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Story Integration...</div>}>
                    <StoryIntegrationDemo />
                  </Suspense>
                } 
              />
              <Route 
                path="/multimodal" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Multimodal Features...</div>}>
                    <MultimodalShowcase />
                  </Suspense>
                } 
              />
              {/* Test Environment Route */}
              <Route 
                path="/test/ai-playground" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Test Environment...</div>}>
                    <AIPlaygroundTest />
                  </Suspense>
                } 
              />
              {/* Public AI Showcase */}
              <Route 
                path="/ai-showcase" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading AI Showcase...</div>}>
                    <AIPlaygroundPublic />
                  </Suspense>
                } 
              />
              {/* Voice Test Demo */}
              <Route 
                path="/voice-test" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Voice Test...</div>}>
                    <VoiceTestDemo />
                  </Suspense>
                } 
              />
              {/* Learning Paths */}
              <Route 
                path="/learning-paths/*" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Learning Paths...</div>}>
                    <LearningPaths />
                  </Suspense>
                } 
              />
              {/* Micro-Lesson Demo */}
              <Route 
                path="/micro-lesson-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Micro-Lesson Demo...</div>}>
                    <MicroLessonDemo />
                  </Suspense>
                }
              />
              {/* Enhanced Micro-Lesson Demo */}
              <Route 
                path="/micro-lesson-enhanced" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Enhanced Micro-Lesson Demo...</div>}>
                    <MicroLessonEnhancedDemo />
                  </Suspense>
                } 
              />
              {/* Export Integration Demo */}
              <Route 
                path="/export-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Export Demo...</div>}>
                    <ExportIntegrationDemo />
                  </Suspense>
                } 
              />
              {/* Tutorial Showcase */}
              <Route 
                path="/tutorial-showcase" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Tutorial System...</div>}>
                    <TutorialShowcase />
                  </Suspense>
                } 
              />
              {/* Minimal UI Demo */}
              <Route 
                path="/minimal-ui-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Minimal UI Demo...</div>}>
                    <MinimalUIDemo />
                  </Suspense>
                } 
              />
              {/* Maya Side by Side Interactive */}
              <Route 
                path="/maya-interactive" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Interactive Lesson...</div>}>
                    <MayaSideBySide />
                  </Suspense>
                } 
              />
              {/* Lyra Narrated Maya Demo */}
              <Route 
                path="/lyra-maya-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Lyra's Narration...</div>}>
                    <LyraNarratedMayaDemo />
                  </Suspense>
                } 
              />
              {/* Chapter 2 Hub and Micro-Lessons */}
              <Route 
                path="/chapter/2/lesson/5" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chapter 2 Hub...</div>}>
                    <Chapter2Hub />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter/2/lesson/5/tone-mastery" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Tone Mastery...</div>}>
                    <MayaToneMasteryLesson />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter/2/lesson/5/template-library" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Template Library...</div>}>
                    <MayaTemplateLibraryLesson />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter/2/lesson/5/difficult-conversations" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Difficult Conversations...</div>}>
                    <MayaDifficultConversationsLesson />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter/2/lesson/5/subject-workshop" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Subject Workshop...</div>}>
                    <MayaSubjectWorkshopLesson />
                  </Suspense>
                } 
              />
              {/* Visual Options Showcase */}
              <Route 
                path="/visual-options" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Visual Options...</div>}>
                    <VisualOptionsShowcase />
                  </Suspense>
                } 
              />
              {/* Chapter 3 Lesson 11: Maya's Email Communication Mastery */}
              <Route 
                path="/testing/chapter-3/lesson-11" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Maya's Email Mastery Lesson...</div>}>
                    <MayaEmailMasteryLesson />
                  </Suspense>
                } 
              />
              {/* Chapter 3 Lesson 12: Sofia's Voice Discovery Journey */}
              <Route 
                path="/testing/chapter-3/lesson-12" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Sofia's Voice Discovery Lesson...</div>}>
                    <SofiaVoiceDiscoveryLesson />
                  </Suspense>
                } 
              />
              {/* Chapter Demo Routes */}
              <Route 
                path="/chapter3-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chapter 3: Communication & Storytelling...</div>}>
                    <Chapter3Demo />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter4-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chapter 4: Data & Decision Making...</div>}>
                    <Chapter4Demo />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter5-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chapter 5: Automation & Efficiency...</div>}>
                    <Chapter5Demo />
                  </Suspense>
                } 
              />
              <Route 
                path="/chapter6-demo" 
                element={
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Chapter 6: Organizational Transformation...</div>}>
                    <Chapter6Demo />
                  </Suspense>
                } 
              />
              {/* Rules Engine Configuration (Admin/Development) */}
              <Route 
                path="/admin/rules-engine" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Rules Engine Configurator...</div>}>
                      <RulesEngineConfig />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Live AI Prototype Studio (Admin/Development) */}
              <Route 
                path="/admin/lesson-prototype-studio" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Live AI Prototype Studio...</div>}>
                      <LessonPrototypeStudio />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Automated Prototype Creation (Admin/Development) */}
              <Route 
                path="/admin/automated-prototypes" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Automated Prototype Creator...</div>}>
                      <AutomatedPrototypeRunner />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Prototype Results Viewer (Admin/Development) */}
              <Route 
                path="/admin/prototype-results" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Prototype Results...</div>}>
                      <PrototypeResultsViewer />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Component Generation Engine (Admin/Development) */}
              <Route 
                path="/admin/component-generation" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Component Generation Engine...</div>}>
                      <ComponentGenerationRunner />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Simple Prototype Viewer (Admin/Development) */}
              <Route 
                path="/admin/simple-prototypes" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Simple Prototype Viewer...</div>}>
                      <SimplePrototypeViewer />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Micro-Learning Prototype */}
              <Route 
                path="/micro-learning-prototype" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Micro-Learning Prototype...</div>}>
                      <MicroLessonPrototype />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Storyline Learning Prototype */}
              <Route 
                path="/storyline-learning-prototype" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Storyline Learning Prototype...</div>}>
                      <StorylineLessonPrototype />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              {/* Character Selection for Storyline Learning */}
              <Route 
                path="/storyline-characters" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Character Selection...</div>}>
                      <StorylineCharacterSelection />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
                    </BrowserRouter>
                  </TutorialProvider>
                </CharacterStoryProvider>
              </ProgressProvider>
            </AuthProvider>
        </PerformanceErrorBoundary>
        </PerformanceMonitorComponent>
      </TooltipProvider>
      </AppWithQueryTracking>
    </QueryClientProvider>
  );
};

export default App;
