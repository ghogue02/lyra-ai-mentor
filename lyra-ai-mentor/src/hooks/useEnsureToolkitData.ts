import { useEffect, useState, useRef } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ensureToolkitData, verifyToolkitData, type EnsureToolkitDataResult } from '../utils/ensureToolkitData';

export interface UseEnsureToolkitDataResult {
  isLoading: boolean;
  isVerified: boolean;
  error: string | null;
  result: EnsureToolkitDataResult | null;
  retry: () => Promise<void>;
}

/**
 * Hook to ensure toolkit data exists in the database
 * This runs once on mount and creates any missing categories or achievements
 */
export function useEnsureToolkitData(): UseEnsureToolkitDataResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnsureToolkitDataResult | null>(null);
  const hasRun = useRef(false);

  const ensureData = async () => {

    try {
      setIsLoading(true);
      setError(null);

      // First verify if data exists
      const verification = await verifyToolkitData(supabase);
      
      if (verification.isValid) {
        // All data exists, no need to create anything
        setIsVerified(true);
        setResult({
          success: true,
          categoriesCreated: 0,
          categoriesUpdated: 0,
          achievementsCreated: 0,
          errors: []
        });
      } else {
        // Some data is missing, create it
        console.log('Missing toolkit data detected:', {
          categories: verification.missingCategories,
          achievements: verification.missingAchievements
        });

        const ensureResult = await ensureToolkitData(supabase);
        setResult(ensureResult);
        
        if (ensureResult.success) {
          setIsVerified(true);
          console.log('Toolkit data ensured:', {
            categoriesCreated: ensureResult.categoriesCreated,
            categoriesUpdated: ensureResult.categoriesUpdated,
            achievementsCreated: ensureResult.achievementsCreated
          });
        } else {
          setError(ensureResult.errors.join(', '));
          console.error('Failed to ensure toolkit data:', ensureResult.errors);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error ensuring toolkit data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run once per component lifecycle
    if (!hasRun.current) {
      hasRun.current = true;
      ensureData();
    }
  }, []);

  const retry = async () => {
    hasRun.current = false;
    await ensureData();
  };

  return {
    isLoading,
    isVerified,
    error,
    result,
    retry
  };
}

/**
 * Hook to ensure toolkit data exists with automatic retry
 * Use this in critical components where data must exist
 */
export function useEnsureToolkitDataWithRetry(
  maxRetries: number = 3,
  retryDelay: number = 1000
): UseEnsureToolkitDataResult {
  const baseResult = useEnsureToolkitData();
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Retry if there's an error and we haven't exceeded max retries
    if (baseResult.error && !baseResult.isLoading && retryCount < maxRetries) {
      console.log(`Retrying toolkit data verification (attempt ${retryCount + 1}/${maxRetries})...`);
      
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        baseResult.retry();
      }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [baseResult.error, baseResult.isLoading, retryCount, maxRetries, retryDelay]);

  return baseResult;
}

/**
 * Component wrapper that ensures toolkit data before rendering children
 * Usage:
 * ```tsx
 * <EnsureToolkitData>
 *   <MyToolkitComponent />
 * </EnsureToolkitData>
 * ```
 */
export function EnsureToolkitData({ 
  children,
  fallback = <div>Loading toolkit data...</div>,
  errorFallback = (error: string) => <div>Error loading toolkit: {error}</div>
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: (error: string) => React.ReactNode;
}) {
  const { isLoading, error, isVerified } = useEnsureToolkitDataWithRetry();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (error) {
    return <>{errorFallback(error)}</>;
  }

  if (!isVerified) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}