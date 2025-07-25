import { supabase } from '@/integrations/supabase/client';

export interface JourneyDefinition {
  id: string;
  journey_key: string;
  name: string;
  description: string;
  character_name: string;
  category: string;
  total_phases: number;
  estimated_duration?: number;
  difficulty_level: string;
  scoring_enabled: boolean;
  scoring_criteria?: any;
  badge_requirements?: any;
  metadata?: any;
  is_active: boolean;
}

export interface UserJourneyProgress {
  id: string;
  user_id: string;
  journey_id: string;
  journey_key: string;
  current_phase: number;
  total_phases: number;
  phase_data: any;
  overall_score?: number;
  phase_scores?: any;
  completion_data?: any;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  is_completed: boolean;
}

export interface JourneyScore {
  overall_score: number;
  breakdown: Record<string, number>;
  feedback: string;
}

class JourneyProgressService {
  // Journey Management
  async getJourneyDefinition(journeyKey: string): Promise<JourneyDefinition | null> {
    const { data, error } = await supabase
      .from('journey_definitions')
      .select('*')
      .eq('journey_key', journeyKey)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching journey definition:', error);
      return null;
    }

    return data;
  }

  async getAllJourneyDefinitions(): Promise<JourneyDefinition[]> {
    const { data, error } = await supabase
      .from('journey_definitions')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching journey definitions:', error);
      return [];
    }

    return data || [];
  }

  // Progress Management
  async startJourney(journeyKey: string): Promise<UserJourneyProgress | null> {
    const journeyDef = await this.getJourneyDefinition(journeyKey);
    if (!journeyDef) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_journey_progress')
      .upsert({
        user_id: user.id,
        journey_id: journeyDef.id,
        journey_key: journeyKey,
        current_phase: 1,
        total_phases: journeyDef.total_phases,
        phase_data: {},
        started_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
        is_completed: false
      }, {
        onConflict: 'user_id,journey_key'
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting journey:', error);
      return null;
    }

    return data;
  }

  async updateJourneyProgress(
    journeyKey: string,
    updates: Partial<Pick<UserJourneyProgress, 'current_phase' | 'phase_data' | 'completion_data'>>
  ): Promise<UserJourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_journey_progress')
      .update({
        ...updates,
        last_accessed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('journey_key', journeyKey)
      .select()
      .single();

    if (error) {
      console.error('Error updating journey progress:', error);
      return null;
    }

    return data;
  }

  async completeJourney(
    journeyKey: string,
    finalData: any,
    score?: number
  ): Promise<UserJourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const completionTime = new Date().toISOString();

    const { data, error } = await supabase
      .from('user_journey_progress')
      .update({
        is_completed: true,
        completed_at: completionTime,
        completion_data: finalData,
        overall_score: score,
        last_accessed_at: completionTime
      })
      .eq('user_id', user.id)
      .eq('journey_key', journeyKey)
      .select()
      .single();

    if (error) {
      console.error('Error completing journey:', error);
      return null;
    }

    // Check for badge achievements
    await this.checkBadgeAchievements(journeyKey, data);

    return data;
  }

  async getJourneyProgress(journeyKey: string): Promise<UserJourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('journey_key', journeyKey)
      .single();

    if (error) {
      return null; // Journey not started yet
    }

    return data;
  }

  async getUserJourneyHistory(): Promise<UserJourneyProgress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching journey history:', error);
      return [];
    }

    return data || [];
  }

  // Scoring System
  async scoreJourneyContent(
    journeyKey: string,
    content: any,
    phase?: number
  ): Promise<JourneyScore | null> {
    const journeyDef = await this.getJourneyDefinition(journeyKey);
    if (!journeyDef?.scoring_enabled || !journeyDef.scoring_criteria) {
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('score-journey-content', {
        body: {
          journey_key: journeyKey,
          content,
          phase,
          scoring_criteria: journeyDef.scoring_criteria
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error scoring journey content:', error);
      return null;
    }
  }

  // Badge Achievement Checking
  private async checkBadgeAchievements(
    journeyKey: string,
    progressData: UserJourneyProgress
  ): Promise<void> {
    try {
      await supabase.functions.invoke('check-journey-badges', {
        body: {
          journey_key: journeyKey,
          progress_data: progressData
        }
      });
    } catch (error) {
      console.error('Error checking badge achievements:', error);
    }
  }

  // Analytics
  async getJourneyAnalytics(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const history = await this.getUserJourneyHistory();
    const completed = history.filter(j => j.is_completed);
    const inProgress = history.filter(j => !j.is_completed);

    const averageScore = completed.length > 0
      ? completed.reduce((sum, j) => sum + (j.overall_score || 0), 0) / completed.length
      : 0;

    const totalDuration = completed.reduce((sum, j) => {
      if (j.started_at && j.completed_at) {
        const start = new Date(j.started_at);
        const end = new Date(j.completed_at);
        return sum + (end.getTime() - start.getTime());
      }
      return sum;
    }, 0);

    return {
      totalJourneys: history.length,
      completedJourneys: completed.length,
      inProgressJourneys: inProgress.length,
      averageScore: Math.round(averageScore),
      totalTimeSpent: Math.round(totalDuration / (1000 * 60)), // minutes
      characterProgress: this.groupJourneysByCharacter(completed)
    };
  }

  private groupJourneysByCharacter(journeys: UserJourneyProgress[]): Record<string, number> {
    return journeys.reduce((acc, journey) => {
      // This would need journey definition lookup for character name
      // For now, extract from journey_key
      const character = journey.journey_key.split('-')[0];
      acc[character] = (acc[character] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const journeyProgressService = new JourneyProgressService();