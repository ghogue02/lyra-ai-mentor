
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useElementCompletion = (elementId: number, lessonId: number, onElementComplete?: (elementId: number) => void) => {
  const { user } = useAuth();
  const [isElementCompleted, setIsElementCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      loadCompletionStatus();
    }
  }, [user, elementId, lessonId]);

  const loadCompletionStatus = async () => {
    if (!user) return;

    try {
      console.log(`useElementCompletion: Loading completion status for element ${elementId}`);
      
      const { data, error } = await supabase
        .from('interactive_element_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('interactive_element_id', elementId)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;

      if (data?.completed) {
        console.log(`useElementCompletion: Element ${elementId} is already completed`);
        setIsElementCompleted(true);
        onElementComplete?.(elementId);
      }
    } catch (error: any) {
      console.error('Error loading completion status:', error);
    }
  };

  const markElementComplete = async () => {
    if (!user || isElementCompleted) return;

    try {
      console.log(`useElementCompletion: Marking element ${elementId} as completed`);
      
      const { error } = await supabase
        .from('interactive_element_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          interactive_element_id: elementId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log(`useElementCompletion: Element ${elementId} marked as completed successfully`);
      setIsElementCompleted(true);
      onElementComplete?.(elementId);
    } catch (error: any) {
      console.error('Error marking element complete:', error);
    }
  };

  return {
    isElementCompleted,
    setIsElementCompleted,
    markElementComplete
  };
};
