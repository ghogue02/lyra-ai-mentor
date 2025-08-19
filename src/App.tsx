
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSuspense from "@/components/ui/LoadingSuspense";
import MinimalErrorBoundary from "@/components/ui/minimal-error-boundary";
// Temporarily use direct imports to avoid lazy loading issues
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Chapter7Hub from "@/pages/Chapter7Hub";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

console.log('🎯 App component starting...');

const App = () => {
  console.log('🔄 App render starting...');

  return (
    <MinimalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Essential routes only - simplified for debugging */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/chapter/7" element={<Chapter7Hub />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Catch all - temporary simple fallback */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                      <p>This route is temporarily disabled during debugging.</p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </MinimalErrorBoundary>
  );
};

export default App;
