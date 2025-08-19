import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSuspenseProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading component...</p>
    </div>
  </div>
);

export const LoadingSuspense: React.FC<LoadingSuspenseProps> = ({ 
  fallback = <DefaultFallback />, 
  children 
}) => {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
};

export default LoadingSuspense;