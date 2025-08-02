
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
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ContentLab from "./pages/ContentLab";
import Lesson from "./pages/Lesson";
import InteractiveJourney from "./pages/InteractiveJourney";
import Chapter1Hub from "./pages/Chapter1Hub";
import Chapter2Hub from "./pages/Chapter2Hub";
import Chapter3Hub from "./pages/Chapter3Hub";
import Chapter4Hub from "./pages/Chapter4Hub";
import Chapter5Hub from "./pages/Chapter5Hub";
import Chapter6Hub from "./pages/Chapter6Hub";
import TestLyra from "./pages/TestLyra";
import TestMaya from "./pages/TestMaya";
import { ChapterOverviewPage, ChapterLessonPage } from "./components/chapter/ChapterPages";

const queryClient = new QueryClient();


const App = () => {
  return (
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
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/test-lyra" element={<TestLyra />} />
              <Route path="/test-maya" element={<TestMaya />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content-lab" 
                element={
                  <ProtectedRoute>
                    <ContentLab />
                  </ProtectedRoute>
                } 
              />
              {/* Chapter and Lesson Routes */}
              <Route 
                path="/lesson/:lessonId" 
                element={
                  <ProtectedRoute>
                    <Lesson />
                  </ProtectedRoute>
                } 
              />
              {/* Chapter routes - Chapters 1 and 2 have custom hubs, others use generic overview */}
              <Route 
                path="/chapter/1" 
                element={
                  <ProtectedRoute>
                    <Chapter1Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/2" 
                element={
                  <ProtectedRoute>
                    <Chapter2Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/3" 
                element={
                  <ProtectedRoute>
                    <Chapter3Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/4" 
                element={
                  <ProtectedRoute>
                    <Chapter4Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/5" 
                element={
                  <ProtectedRoute>
                    <Chapter5Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/6" 
                element={
                  <ProtectedRoute>
                    <Chapter6Hub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chapter/:chapterId" 
                element={
                  <ProtectedRoute>
                    <ChapterOverviewPage />
                  </ProtectedRoute>
                } 
              />
              {/* New scalable interactive journey route */}
              <Route 
                path="/chapter/:chapterId/interactive/:journeyId" 
                element={
                  <ProtectedRoute>
                    <InteractiveJourney />
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
                    <ChapterLessonPage />
                  </ProtectedRoute>
                } 
              />
               <Route path="*" element={<NotFound />} />
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
  );
};

export default App;
