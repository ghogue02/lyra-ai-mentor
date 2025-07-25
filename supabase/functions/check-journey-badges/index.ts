import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { journey_key, progress_data } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get relevant achievements for this journey
    const { data: achievements, error: achievementsError } = await supabase
      .from('toolkit_achievements')
      .select('*')
      .or(`criteria_metadata->journey_key.eq.${journey_key},criteria_type.eq.cross_journey`);

    if (achievementsError) {
      throw achievementsError;
    }

    const userId = progress_data.user_id;
    const unlockedBadges = [];

    for (const achievement of achievements) {
      const isUnlocked = await checkAchievementCriteria(
        supabase,
        achievement,
        progress_data,
        userId
      );

      if (isUnlocked) {
        // Check if already unlocked
        const { data: existing } = await supabase
          .from('user_toolkit_achievements')
          .select('id')
          .eq('user_id', userId)
          .eq('achievement_id', achievement.id)
          .eq('is_unlocked', true)
          .single();

        if (!existing) {
          // Unlock the achievement
          await supabase
            .from('user_toolkit_achievements')
            .upsert({
              user_id: userId,
              achievement_id: achievement.id,
              is_unlocked: true,
              unlocked_at: new Date().toISOString(),
              current_value: achievement.criteria_value,
              target_value: achievement.criteria_value
            });

          unlockedBadges.push(achievement);

          // Trigger badge unlock event
          console.log(`Badge unlocked: ${achievement.name} for user ${userId}`);
        }
      }
    }

    return new Response(JSON.stringify({ 
      unlockedBadges,
      message: `Checked ${achievements.length} achievements, unlocked ${unlockedBadges.length} new badges`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in check-journey-badges function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkAchievementCriteria(
  supabase: any,
  achievement: any,
  progressData: any,
  userId: string
): Promise<boolean> {
  const { criteria_type, criteria_value, criteria_metadata } = achievement;

  switch (criteria_type) {
    case 'journey_completion':
      return progressData.is_completed;

    case 'journey_score':
      return progressData.is_completed && 
             progressData.overall_score && 
             progressData.overall_score >= criteria_value;

    case 'journey_avg_score':
      // Check average score across all completions of this journey type
      const { data: journeyHistory } = await supabase
        .from('user_journey_progress')
        .select('overall_score')
        .eq('user_id', userId)
        .eq('journey_key', criteria_metadata.journey_key)
        .eq('is_completed', true)
        .not('overall_score', 'is', null);

      if (!journeyHistory || journeyHistory.length === 0) return false;
      
      const avgScore = journeyHistory.reduce((sum: number, j: any) => sum + j.overall_score, 0) / journeyHistory.length;
      return avgScore >= criteria_value;

    case 'journey_min_score':
      // Check minimum score across all completions
      const { data: allCompletions } = await supabase
        .from('user_journey_progress')
        .select('overall_score')
        .eq('user_id', userId)
        .eq('journey_key', criteria_metadata.journey_key)
        .eq('is_completed', true)
        .not('overall_score', 'is', null);

      if (!allCompletions || allCompletions.length === 0) return false;
      
      const minScore = Math.min(...allCompletions.map((j: any) => j.overall_score));
      return minScore >= criteria_value;

    case 'journey_speed':
      if (!progressData.is_completed || !progressData.started_at || !progressData.completed_at) {
        return false;
      }
      
      const startTime = new Date(progressData.started_at);
      const endTime = new Date(progressData.completed_at);
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      return durationMinutes <= criteria_value;

    case 'cross_journey':
      if (criteria_metadata.requirement === 'unique_characters') {
        const { data: userJourneys } = await supabase
          .from('user_journey_progress')
          .select('journey_key')
          .eq('user_id', userId)
          .eq('is_completed', true);

        if (!userJourneys) return false;

        const uniqueCharacters = new Set();
        userJourneys.forEach((j: any) => {
          const character = j.journey_key.split('-')[0];
          uniqueCharacters.add(character);
        });

        return uniqueCharacters.size >= criteria_value;
      }
      break;

    default:
      console.warn(`Unknown criteria type: ${criteria_type}`);
      return false;
  }

  return false;
}