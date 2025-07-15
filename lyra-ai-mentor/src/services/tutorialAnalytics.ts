import { supabase } from '@/integrations/supabase/client';
import { Tutorial, TutorialProgress } from '@/types/tutorial';

export interface TutorialAnalytics {
  tutorialId: string;
  startedAt: Date;
  completedAt?: Date;
  skipped: boolean;
  timeSpent: number; // in seconds
  stepsCompleted: number;
  totalSteps: number;
  completionRate: number;
  userId?: string;
}

export interface TutorialInsight {
  mostPopularTutorials: string[];
  averageCompletionRate: number;
  averageTimeSpent: number;
  stepDropoffRates: Record<string, number>;
  userEngagementScore: number;
}

class TutorialAnalyticsService {
  private sessionData: Map<string, { startTime: number; stepTimes: number[] }> = new Map();

  startTutorialTracking(tutorialId: string) {
    this.sessionData.set(tutorialId, {
      startTime: Date.now(),
      stepTimes: [Date.now()],
    });
  }

  trackStepProgress(tutorialId: string, stepIndex: number) {
    const session = this.sessionData.get(tutorialId);
    if (session) {
      session.stepTimes[stepIndex] = Date.now();
    }
  }

  async completeTutorial(
    tutorialId: string,
    progress: TutorialProgress,
    tutorial: Tutorial
  ): Promise<void> {
    const session = this.sessionData.get(tutorialId);
    if (!session) return;

    const timeSpent = Math.floor((Date.now() - session.startTime) / 1000);
    const stepsCompleted = progress.currentStep + 1;
    const completionRate = (stepsCompleted / tutorial.steps.length) * 100;

    const analytics: TutorialAnalytics = {
      tutorialId,
      startedAt: new Date(session.startTime),
      completedAt: progress.completed ? new Date() : undefined,
      skipped: progress.skipped || false,
      timeSpent,
      stepsCompleted,
      totalSteps: tutorial.steps.length,
      completionRate,
    };

    // Store analytics in Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        analytics.userId = user.id;
      }

      await supabase.from('tutorial_analytics').insert({
        tutorial_id: analytics.tutorialId,
        user_id: analytics.userId,
        started_at: analytics.startedAt.toISOString(),
        completed_at: analytics.completedAt?.toISOString(),
        skipped: analytics.skipped,
        time_spent: analytics.timeSpent,
        steps_completed: analytics.stepsCompleted,
        total_steps: analytics.totalSteps,
        completion_rate: analytics.completionRate,
      });

      // Track step-by-step progress for drop-off analysis
      if (session.stepTimes.length > 1) {
        const stepAnalytics = session.stepTimes.slice(0, -1).map((startTime, index) => ({
          tutorial_id: tutorialId,
          user_id: analytics.userId,
          step_index: index,
          time_spent: Math.floor((session.stepTimes[index + 1] - startTime) / 1000),
          completed: index < progress.currentStep,
        }));

        await supabase.from('tutorial_step_analytics').insert(stepAnalytics);
      }
    } catch (error) {
      console.error('Failed to save tutorial analytics:', error);
    }

    // Clean up session data
    this.sessionData.delete(tutorialId);
  }

  async getTutorialInsights(userId?: string): Promise<TutorialInsight> {
    try {
      // Get overall tutorial completion data
      const query = supabase
        .from('tutorial_analytics')
        .select('*');

      if (userId) {
        query.eq('user_id', userId);
      }

      const { data: analytics, error } = await query;
      if (error) throw error;

      if (!analytics || analytics.length === 0) {
        return {
          mostPopularTutorials: [],
          averageCompletionRate: 0,
          averageTimeSpent: 0,
          stepDropoffRates: {},
          userEngagementScore: 0,
        };
      }

      // Calculate most popular tutorials
      const tutorialCounts = analytics.reduce((acc, record) => {
        acc[record.tutorial_id] = (acc[record.tutorial_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostPopularTutorials = Object.entries(tutorialCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      // Calculate average completion rate
      const completedAnalytics = analytics.filter(a => a.completed_at);
      const averageCompletionRate = completedAnalytics.length > 0
        ? completedAnalytics.reduce((sum, a) => sum + a.completion_rate, 0) / completedAnalytics.length
        : 0;

      // Calculate average time spent
      const averageTimeSpent = analytics.reduce((sum, a) => sum + a.time_spent, 0) / analytics.length;

      // Get step drop-off rates
      const { data: stepData } = await supabase
        .from('tutorial_step_analytics')
        .select('tutorial_id, step_index, completed')
        .eq('user_id', userId || '');

      const stepDropoffRates: Record<string, number> = {};
      if (stepData) {
        const stepsByTutorial = stepData.reduce((acc, step) => {
          if (!acc[step.tutorial_id]) acc[step.tutorial_id] = [];
          acc[step.tutorial_id].push(step);
          return acc;
        }, {} as Record<string, typeof stepData>);

        Object.entries(stepsByTutorial).forEach(([tutorialId, steps]) => {
          const totalAttempts = steps.length;
          const completed = steps.filter(s => s.completed).length;
          stepDropoffRates[tutorialId] = ((totalAttempts - completed) / totalAttempts) * 100;
        });
      }

      // Calculate user engagement score (0-100)
      const userEngagementScore = Math.min(100, Math.round(
        (averageCompletionRate * 0.4) +
        (Math.min(averageTimeSpent / 300, 1) * 30) + // Normalize time to 5 minutes
        (mostPopularTutorials.length * 6) // 6 points per tutorial tried
      ));

      return {
        mostPopularTutorials,
        averageCompletionRate,
        averageTimeSpent,
        stepDropoffRates,
        userEngagementScore,
      };
    } catch (error) {
      console.error('Failed to get tutorial insights:', error);
      return {
        mostPopularTutorials: [],
        averageCompletionRate: 0,
        averageTimeSpent: 0,
        stepDropoffRates: {},
        userEngagementScore: 0,
      };
    }
  }

  async getUserTutorialHistory(userId: string): Promise<TutorialAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('tutorial_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) throw error;

      return data.map(record => ({
        tutorialId: record.tutorial_id,
        startedAt: new Date(record.started_at),
        completedAt: record.completed_at ? new Date(record.completed_at) : undefined,
        skipped: record.skipped,
        timeSpent: record.time_spent,
        stepsCompleted: record.steps_completed,
        totalSteps: record.total_steps,
        completionRate: record.completion_rate,
        userId: record.user_id,
      }));
    } catch (error) {
      console.error('Failed to get user tutorial history:', error);
      return [];
    }
  }
}

export const tutorialAnalytics = new TutorialAnalyticsService();