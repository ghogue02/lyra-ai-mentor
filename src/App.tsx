
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CharacterStoryProvider } from "@/contexts/CharacterStoryContext";
import { GlobalChatProvider } from "@/contexts/GlobalChatContext";
import GlobalChatLyra from "@/components/chat-system/GlobalChatLyra";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PerformanceWrapper, PerformanceMonitor, BundleAnalyzer, AccessibilityTester } from "@/components/performance/PerformanceIntegration";
import { BrandedToastContainer } from "@/hooks/use-branded-toast";
import LoadingSuspense from "@/components/ui/LoadingSuspense";
import { ApplicationErrorBoundary, AsyncErrorBoundary } from "@/components/error-boundaries";
import {
  LazyIndex,
  LazyAuth,
  LazyDashboard,
  LazyProfile,
  LazyNotFound,
  LazyContentLab,
  LazyLesson,
  LazyInteractiveJourney,
  LazyChapter1Hub,
  LazyChapter2Hub,
  LazyChapter3Hub,
  LazyChapter4Hub,
  LazyChapter5Hub,
  LazyChapter6Hub,
  LazyChapter7Hub,
  LazyTestLyra,
  LazyTestMaya,
  LazyChapterOverviewPage,
  LazyChapterLessonPage,
} from "./utils/lazyRoutes";

const queryClient = new QueryClient();


const App = () => {
  return (
    <ApplicationErrorBoundary
      context="Application Root"
      enableAutoRecovery={true}
      maxRetries={3}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <AsyncErrorBoundary
        enableAutoRecovery={true}
      >
        <PerformanceWrapper 
          enablePerformanceMonitoring={true}
          enableAccessibilityFeatures={true}
        >
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthProvider>
                <CharacterStoryProvider>
                  <BrowserRouter>
                    <GlobalChatProvider>
                <Routes>
              <Route path="/" element={
                <LoadingSuspense>
                  <LazyIndex />
                </LoadingSuspense>
              } />
              <Route path="/auth" element={
                <LoadingSuspense>
                  <LazyAuth />
                </LoadingSuspense>
              } />
              <Route path="/test-lyra" element={
                <LoadingSuspense>
                  <LazyTestLyra />
                </LoadingSuspense>
              } />
              <Route path="/test-maya" element={
                <LoadingSuspense>
                  <LazyTestMaya />
                </LoadingSuspense>
              } />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyDashboard />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyProfile />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content-lab" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyContentLab />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              {/* Chapter and Lesson Routes */}
              <Route 
                path="/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyLesson />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              {/* Chapter routes - Chapters 1 and 2 have custom hubs, others use generic overview */}
              <Route 
                path="/chapter/1" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter1Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/2" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter2Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/3" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter3Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/4" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter4Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/5" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter5Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/6" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter6Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/7" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapter7Hub />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/:chapterId" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapterOverviewPage />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              {/* New scalable interactive journey route */}
              <Route 
                path="/chapter/:chapterId/interactive/:journeyId" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyInteractiveJourney />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              {/* Team Capacity Results route */}
              <Route 
                path="/chapter/:chapterId/interactive/:journeyId/results" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyInteractiveJourney />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
              {/* Redirect legacy Maya demo route to new structure */}
              <Route 
                path="/lyra-maya-demo" 
                element={<Navigate to="/chapter/2/interactive/maya-pace" replace />} 
              />
              <Route 
                path="/chapter/:chapterId/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <LoadingSuspense>
                      <LazyChapterLessonPage />
                    </LoadingSuspense>
                  </ProtectedRoute>
                } 
              />
               <Route path="*" element={
                <LoadingSuspense>
                  <LazyNotFound />
                </LoadingSuspense>
              } />
                </Routes>
                <GlobalChatLyra />
                    </GlobalChatProvider>
                  </BrowserRouter>
                </CharacterStoryProvider>
              </AuthProvider>
              
              {/* Development Tools */}
              <PerformanceMonitor />
              <BundleAnalyzer />
              <AccessibilityTester />
              
              {/* Branded Toast Container */}
              <BrandedToastContainer />
            </TooltipProvider>
          </QueryClientProvider>
        </PerformanceWrapper>
      </AsyncErrorBoundary>
    </ApplicationErrorBoundary>
  );
};

export default App;
