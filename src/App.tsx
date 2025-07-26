
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ContentLab from "./pages/ContentLab";
import Lesson from "./pages/Lesson";
import InteractiveJourney from "./pages/InteractiveJourney";
import Chapter2Hub from "./pages/Chapter2Hub";
import Chapter1Hub from "./pages/Chapter1Hub";
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
           </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
