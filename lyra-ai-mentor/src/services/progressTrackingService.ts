import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  id?: string;
  user_id: string;
  lesson_id?: number;
  chapter_id?: number;
  element_id?: number;
  started_at?: string;
  completed_at?: string;
  last_accessed_at?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  progress_percentage: number;
  time_spent_seconds: number;
  current_step: number;
  total_steps: number;
  data: Record<string, any>;
  confidence_score?: number;
  difficulty_rating?: number;
  completion_quality?: number;
  email_efficiency_before?: number;
  email_efficiency_after?: number;
  stress_level_before?: number;
  stress_level_after?: number;
}

export interface MayaProgressMetrics {
  emailEfficiencyImprovement: number; // percentage improvement
  timeReclaimed: number; // minutes per week
  confidenceGrowth: number; // 1-10 scale improvement
  stressReduction: number; // 1-10 scale improvement
  skillsMastered: string[];
  weeklyImpact: {
    emailsSent: number;
    avgTimePerEmail: number;
    familyTimeReclaimed: number;
  };
}

class ProgressTrackingService {
  // Core progress tracking
  async trackProgress(
    userId: string,
    params: {
      lessonId?: number;
      chapterId?: number;
      elementId?: number;
      status?: UserProgress['status'];
      progressPercentage?: number;
      timeSpentSeconds?: number;
      currentStep?: number;
      totalSteps?: number;
      data?: Record<string, any>;
      confidenceScore?: number;
      difficultyRating?: number;
      completionQuality?: number;
    }
  ): Promise<UserProgress> {
    const { data, error } = await supabase.rpc('upsert_user_progress', {
      p_user_id: userId,
      p_lesson_id: params.lessonId,
      p_chapter_id: params.chapterId,
      p_element_id: params.elementId,
      p_status: params.status,
      p_progress_percentage: params.progressPercentage,
      p_time_spent_seconds: params.timeSpentSeconds,
      p_current_step: params.currentStep,
      p_total_steps: params.totalSteps,
      p_data: params.data,
      p_confidence_score: params.confidenceScore,
      p_difficulty_rating: params.difficultyRating,
      p_completion_quality: params.completionQuality
    });

    if (error) {
      console.error('Error tracking progress:', error);
      throw error;
    }

    return data;
  }

  // Maya-specific progress tracking
  async trackMayaEmailProgress(
    userId: string,
    elementId: number,
    metrics: {
      emailTimeBefore?: number;
      emailTimeAfter?: number;
      stressBefore?: number;
      stressAfter?: number;
      confidenceScore?: number;
      completionData?: Record<string, any>;
    }
  ): Promise<void> {
    await this.trackProgress(userId, {
      elementId,
      status: 'completed',
      progressPercentage: 100,
      confidenceScore: metrics.confidenceScore,
      data: {
        emailEfficiencyBefore: metrics.emailTimeBefore,
        emailEfficiencyAfter: metrics.emailTimeAfter,
        stressLevelBefore: metrics.stressBefore,
        stressLevelAfter: metrics.stressAfter,
        transformationData: metrics.completionData,
        completedAt: new Date().toISOString()
      }
    });
  }

  // Get user progress
  async getUserProgress(
    userId: string,
    filters?: {
      lessonId?: number;
      chapterId?: number;
      elementId?: number;
      status?: UserProgress['status'];
    }
  ): Promise<UserProgress[]> {
    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (filters?.lessonId) {
      query = query.eq('lesson_id', filters.lessonId);
    }
    if (filters?.chapterId) {
      query = query.eq('chapter_id', filters.chapterId);
    }
    if (filters?.elementId) {
      query = query.eq('element_id', filters.elementId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }

    return data || [];
  }

  // Maya's transformation metrics
  async getMayaTransformationMetrics(userId: string): Promise<MayaProgressMetrics> {
    const progress = await this.getUserProgress(userId, { chapterId: 2 });
    
    const emailProgress = progress.filter(p => 
      p.data?.emailEfficiencyBefore && p.data?.emailEfficiencyAfter
    );

    if (emailProgress.length === 0) {
      return {
        emailEfficiencyImprovement: 0,
        timeReclaimed: 0,
        confidenceGrowth: 0,
        stressReduction: 0,
        skillsMastered: [],
        weeklyImpact: {
          emailsSent: 0,
          avgTimePerEmail: 32, // Default before AI
          familyTimeReclaimed: 0
        }
      };
    }

    // Calculate improvements
    const avgBefore = emailProgress.reduce((sum, p) => sum + (p.data.emailEfficiencyBefore || 32), 0) / emailProgress.length;
    const avgAfter = emailProgress.reduce((sum, p) => sum + (p.data.emailEfficiencyAfter || 5), 0) / emailProgress.length;
    const efficiencyImprovement = ((avgBefore - avgAfter) / avgBefore) * 100;

    // Estimate weekly impact (assuming 15 emails/week)
    const weeklyEmails = 15;
    const timeReclaimedPerWeek = (avgBefore - avgAfter) * weeklyEmails;

    // Calculate confidence and stress improvements
    const confidenceScores = progress.filter(p => p.confidence_score).map(p => p.confidence_score!);
    const avgConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length 
      : 5;

    const stressBefore = emailProgress.reduce((sum, p) => sum + (p.data.stressLevelBefore || 8), 0) / emailProgress.length;
    const stressAfter = emailProgress.reduce((sum, p) => sum + (p.data.stressLevelAfter || 3), 0) / emailProgress.length;

    // Determine skills mastered
    const completedElements = progress.filter(p => p.status === 'completed');
    const skillsMastered = this.determineSkillsMastered(completedElements);

    return {
      emailEfficiencyImprovement: Math.round(efficiencyImprovement),
      timeReclaimed: Math.round(timeReclaimedPerWeek),
      confidenceGrowth: Math.round((avgConfidence - 3) * 10) / 10, // Assuming 3 was starting confidence
      stressReduction: Math.round((stressBefore - stressAfter) * 10) / 10,
      skillsMastered,
      weeklyImpact: {
        emailsSent: weeklyEmails,
        avgTimePerEmail: Math.round(avgAfter),
        familyTimeReclaimed: Math.round(timeReclaimedPerWeek)
      }
    };
  }

  private determineSkillsMastered(completedElements: UserProgress[]): string[] {
    const skills: string[] = [];
    
    if (completedElements.some(e => e.data?.emailRecipeCompleted)) {
      skills.push('AI Email Recipe Method');
    }
    if (completedElements.some(e => e.data?.voiceDiscovered)) {
      skills.push('Authentic Voice Discovery');
    }
    if (completedElements.some(e => e.data?.confidenceBuilt)) {
      skills.push('Communication Confidence');
    }
    if (completedElements.some(e => e.data?.workflowOptimized)) {
      skills.push('Workflow Optimization');
    }
    if (completedElements.some(e => e.data?.stressManaged)) {
      skills.push('Stress Management');
    }

    return skills;
  }

  // Predictive support
  async getPredictiveInsights(userId: string): Promise<{
    nextChallenges: string[];
    recommendedActions: string[];
    stressRiskFactors: string[];
    optimizationOpportunities: string[];
  }> {
    const progress = await this.getUserProgress(userId);
    const recentProgress = progress.filter(p => 
      new Date(p.last_accessed_at!).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );

    // Analyze patterns for predictions
    const stressLevels = recentProgress
      .filter(p => p.data?.stressLevelAfter)
      .map(p => p.data.stressLevelAfter);
    
    const avgStress = stressLevels.length > 0 
      ? stressLevels.reduce((sum, level) => sum + level, 0) / stressLevels.length 
      : 5;

    const completionRates = recentProgress.map(p => p.progress_percentage);
    const avgCompletion = completionRates.length > 0 
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length 
      : 50;

    return {
      nextChallenges: this.predictNextChallenges(avgStress, avgCompletion),
      recommendedActions: this.getRecommendedActions(recentProgress),
      stressRiskFactors: this.identifyStressRisks(avgStress),
      optimizationOpportunities: this.findOptimizationOpportunities(progress)
    };
  }

  private predictNextChallenges(avgStress: number, avgCompletion: number): string[] {
    const challenges: string[] = [];
    
    if (avgStress > 6) {
      challenges.push('Managing communication anxiety');
    }
    if (avgCompletion < 70) {
      challenges.push('Maintaining consistent practice');
    }
    if (avgStress > 7 && avgCompletion > 80) {
      challenges.push('Applying skills under pressure');
    }
    
    return challenges;
  }

  private getRecommendedActions(recentProgress: UserProgress[]): string[] {
    const actions: string[] = [];
    
    if (recentProgress.length < 3) {
      actions.push('Schedule daily 5-minute practice sessions');
    }
    
    const lowConfidenceElements = recentProgress.filter(p => (p.confidence_score || 0) < 6);
    if (lowConfidenceElements.length > 0) {
      actions.push('Revisit confidence-building exercises');
    }
    
    return actions;
  }

  private identifyStressRisks(avgStress: number): string[] {
    const risks: string[] = [];
    
    if (avgStress > 7) {
      risks.push('High communication stress levels');
    }
    if (avgStress > 8) {
      risks.push('Risk of reverting to old patterns');
    }
    
    return risks;
  }

  private findOptimizationOpportunities(progress: UserProgress[]): string[] {
    const opportunities: string[] = [];
    
    const timeSpent = progress.reduce((sum, p) => sum + p.time_spent_seconds, 0);
    if (timeSpent > 1800) { // 30 minutes
      opportunities.push('Optimize learning efficiency');
    }
    
    const completedCount = progress.filter(p => p.status === 'completed').length;
    if (completedCount > 5) {
      opportunities.push('Ready for advanced workflows');
    }
    
    return opportunities;
  }

  // Real-time coaching suggestions
  async getCoachingSuggestions(
    userId: string,
    currentActivity: string,
    stressLevel?: number
  ): Promise<string[]> {
    const suggestions: string[] = [];
    
    if (stressLevel && stressLevel > 7) {
      suggestions.push("Take a deep breath. Remember: AI is here to help, not replace your voice.");
      suggestions.push("Start with Maya's confidence-building exercise before continuing.");
    }
    
    if (currentActivity.includes('email')) {
      const mayaProgress = await this.getUserProgress(userId, { chapterId: 2 });
      if (mayaProgress.length === 0) {
        suggestions.push("Try Maya's email recipe method first - it reduces 32-minute emails to 5 minutes!");
      }
    }
    
    return suggestions;
  }
}

export const progressTrackingService = new ProgressTrackingService();