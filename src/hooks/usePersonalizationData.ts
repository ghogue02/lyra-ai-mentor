
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersonalizationAnswers {
  role: string;
  techComfort: string;
  aiExperience: string;
  learningStyle: string;
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
          tech_comfort: answers.techComfort,
          ai_experience: answers.aiExperience,
          learning_style: answers.learningStyle,
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
