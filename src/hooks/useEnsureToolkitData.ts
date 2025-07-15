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

      const verification = await verifyToolkitData(supabase);
      
      if (verification.isValid) {
        setIsVerified(true);
        setResult({
          success: true,
          categoriesCreated: 0,
          categoriesUpdated: 0,
          achievementsCreated: 0,
          errors: []
        });
      } else {
        const ensureResult = await ensureToolkitData(supabase);
        setResult(ensureResult);
        
        if (ensureResult.success) {
          setIsVerified(true);
        } else {
          setError(ensureResult.errors.join(', '));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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