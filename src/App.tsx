
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ContentLab from "./pages/ContentLab";
import ShowcasePage from "./pages/ShowcasePage";
import AITestingPage from "./pages/AITestingPage";
import InteractiveElementsPage from "./pages/InteractiveElementsPage";
import AIRefinePage from "./pages/AIRefinePage";
import AIPlaygroundPage from "./pages/AIPlaygroundPage";
import JourneyShowcasePage from "./pages/JourneyShowcasePage";
import SkillsDashboardPage from "./pages/SkillsDashboardPage";
import Lesson from "./pages/Lesson";
import LyraNarratedMayaDemo from "./pages/LyraNarratedMayaDemo";
import Chapter2Hub from "./pages/Chapter2Hub";
import { ChapterOverviewPage, ChapterLessonPage } from "./components/chapter/ChapterPages";

const queryClient = new QueryClient();


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
            <AuthProvider>
              <BrowserRouter>
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
                path="/content-lab" 
                element={
                  <ProtectedRoute>
                    <ContentLab />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/showcase" 
                element={
                  <ProtectedRoute>
                    <ShowcasePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-testing" 
                element={
                  <ProtectedRoute>
                    <AITestingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/interactive-elements" 
                element={
                  <ProtectedRoute>
                    <InteractiveElementsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-refine" 
                element={
                  <ProtectedRoute>
                    <AIRefinePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-playground" 
                element={
                  <ProtectedRoute>
                    <AIPlaygroundPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/journey-showcase" 
                element={
                  <ProtectedRoute>
                    <JourneyShowcasePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills-dashboard" 
                element={
                  <ProtectedRoute>
                    <SkillsDashboardPage />
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
              <Route 
                path="/chapter/2" 
                element={
                  <ProtectedRoute>
                    <Chapter2Hub />
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
              <Route 
                path="/lyra-maya-demo" 
                element={
                  <ProtectedRoute>
                    <LyraNarratedMayaDemo />
                  </ProtectedRoute>
                } 
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
           </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
