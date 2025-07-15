
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAITestingAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (type: string, prompt: string, context?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-testing-assistant', {
        body: { type, prompt, context }
      });

      if (supabaseError) throw supabaseError;
      return data.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { callAI, loading, error };
};
