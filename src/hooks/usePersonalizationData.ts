
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationAnswers {
  role: string;
  tech_comfort: string;
  ai_experience: string;
  learning_style: string;
}

export const usePersonalizationData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const savePersonalizationData = async (answers: PersonalizationAnswers, userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: answers.role,
          tech_comfort: answers.tech_comfort,
          ai_experience: answers.ai_experience,
          learning_style: answers.learning_style,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your learning preferences have been saved.",
      });
    } catch (error: any) {
      console.error('Error saving personalization data:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { savePersonalizationData, loading };
};
