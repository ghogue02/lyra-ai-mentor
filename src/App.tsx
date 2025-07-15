
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import ComponentShowcase from "./pages/ComponentShowcase";

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
                    <ComponentShowcase />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        </PerformanceErrorBoundary>
        </PerformanceMonitorComponent>
      </TooltipProvider>
      </AppWithQueryTracking>
    </QueryClientProvider>
  );
};

export default App;
