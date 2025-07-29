
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAITestingAssistant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAI = async (type: string, prompt: string, context?: string, characterType: string = 'lyra') => {
    setLoading(true);
    setError(null);

    try {
      // Use the working generate-character-content Edge Function
      const { data, error: supabaseError } = await supabase.functions.invoke('generate-character-content', {
        body: { 
          characterType: characterType,
          contentType: type,
          topic: prompt,
          context: context || undefined,
          targetAudience: 'learners' // Default target audience
        }
      });

      if (supabaseError) throw supabaseError;
      
      // The generate-character-content function returns { success, content, ... }
      if (data && data.success && data.content) {
        return data.content;
      } else {
        throw new Error(data?.error || 'Failed to generate content');
      }
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
