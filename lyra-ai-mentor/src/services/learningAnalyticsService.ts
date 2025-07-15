// Learning Analytics Service - Comprehensive Progress Tracking for Maya AI Platform
import { supabase } from '@/integrations/supabase/client';
import { mayaAISkillBuilderAdvanced, type AdvancedLearningAnalytics, type PersonalizationProfile } from './mayaAISkillBuilderAdvanced';

export interface LearningSession {
  id: string;
  userId: string;
  sessionStart: Date;
  sessionEnd?: Date;
  totalTimeSpent: number; // in milliseconds
  stagesCompleted: string[];
  currentStage: string;
  completionRate: number; // 0-1
  engagementScore: number; // 0-10
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

export interface ProgressMetrics {
  userId: string;
  skillArea: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  masteryScore: number; // 0-100
  timeToMastery?: number; // in milliseconds
  attemptsCount: number;
  helpRequestsCount: number;
  errorCount: number;
  successfulCompletions: number;
  lastActivity: Date;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface PerformanceInsight {
  id: string;
  userId: string;
  type: 'strength' | 'improvement' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  actionableSteps: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  generatedAt: Date;
  acknowledged: boolean;
}

export interface LearningPath {
  id: string;
  userId: string;
  currentStage: string;
  recommendedNextStages: string[];
  estimatedCompletionTime: number; // in milliseconds
  difficultyProgression: number[]; // Array of difficulty levels for upcoming stages
  adaptiveAdjustments: {
    speedUp: boolean;
    simplify: boolean;
    addPractice: boolean;
    skipAhead: boolean;
  };
  personalizedContent: {
    examples: string[];
    scenarios: string[];
    challenges: string[];
  };
}

export interface UserBehaviorAnalytics {
  userId: string;
  interactionPatterns: {
    preferredTimeOfDay: string;
    averageSessionDuration: number;
    clickHeatmaps: { [elementId: string]: number };
    scrollDepth: number[];
    timeOnPage: { [pageId: string]: number };
  };
  learningStyle: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    readingWriting: number;
  };
  cognitiveLoad: {
    optimal: boolean;
    overloaded: boolean;
    underutilized: boolean;
    suggestions: string[];
  };
}

export class LearningAnalyticsService {
  private static instance: LearningAnalyticsService;

  static getInstance(): LearningAnalyticsService {
    if (!LearningAnalyticsService.instance) {
      LearningAnalyticsService.instance = new LearningAnalyticsService();
    }
    return LearningAnalyticsService.instance;
  }

  /**
   * Start a new learning session
   */
  async startSession(userId: string, deviceInfo: { type: 'mobile' | 'tablet' | 'desktop', userAgent: string }): Promise<string> {
    try {
      const session: Partial<LearningSession> = {
        userId,
        sessionStart: new Date(),
        totalTimeSpent: 0,
        stagesCompleted: [],
        currentStage: 'intro',
        completionRate: 0,
        engagementScore: 5,
        deviceType: deviceInfo.type,
        userAgent: deviceInfo.userAgent
      };

      // In a real implementation, this would save to database
      const sessionId = `session_${Date.now()}_${userId}`;
      localStorage.setItem(`learning_session_${sessionId}`, JSON.stringify(session));
      
      return sessionId;
    } catch (error) {
      console.error('Error starting learning session:', error);
      throw error;
    }
  }

  /**
   * Update session progress
   */
  async updateSessionProgress(
    sessionId: string, 
    updates: {
      currentStage?: string;
      stageCompleted?: string;
      timeSpent?: number;
      engagementEvent?: 'interaction' | 'help_request' | 'error' | 'success';
    }
  ): Promise<void> {
    try {
      const sessionData = localStorage.getItem(`learning_session_${sessionId}`);
      if (!sessionData) return;

      const session: LearningSession = JSON.parse(sessionData);
      
      if (updates.currentStage) {
        session.currentStage = updates.currentStage;
      }
      
      if (updates.stageCompleted && !session.stagesCompleted.includes(updates.stageCompleted)) {
        session.stagesCompleted.push(updates.stageCompleted);
        session.completionRate = session.stagesCompleted.length / 9; // 9 total stages
      }
      
      if (updates.timeSpent) {
        session.totalTimeSpent += updates.timeSpent;
      }
      
      if (updates.engagementEvent) {
        session.engagementScore = this.calculateEngagementScore(session, updates.engagementEvent);
      }

      localStorage.setItem(`learning_session_${sessionId}`, JSON.stringify(session));
    } catch (error) {
      console.error('Error updating session progress:', error);
    }
  }

  /**
   * End learning session and analyze performance
   */
  async endSession(sessionId: string): Promise<PerformanceInsight[]> {
    try {
      const sessionData = localStorage.getItem(`learning_session_${sessionId}`);
      if (!sessionData) return [];

      const session: LearningSession = JSON.parse(sessionData);
      session.sessionEnd = new Date();

      // Generate performance insights
      const insights = await this.generateSessionInsights(session);
      
      // Update user progress metrics
      await this.updateProgressMetrics(session);
      
      // Clear session data
      localStorage.removeItem(`learning_session_${sessionId}`);
      
      return insights;
    } catch (error) {
      console.error('Error ending session:', error);
      return [];
    }
  }

  /**
   * Get comprehensive user analytics
   */
  async getUserAnalytics(userId: string): Promise<{
    progress: ProgressMetrics[];
    insights: PerformanceInsight[];
    learningPath: LearningPath;
    behaviorAnalytics: UserBehaviorAnalytics;
  }> {
    try {
      // In a real implementation, this would query the database
      const mockData = {
        progress: await this.getProgressMetrics(userId),
        insights: await this.getPerformanceInsights(userId),
        learningPath: await this.generateLearningPath(userId),
        behaviorAnalytics: await this.analyzeBehaviorPatterns(userId)
      };
      
      return mockData;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  /**
   * Generate adaptive learning recommendations
   */
  async generateAdaptiveLearning(userId: string, performanceData: any): Promise<{
    difficultyAdjustment: number;
    recommendedActivities: string[];
    learningSupports: string[];
    motivationalMessages: string[];
  }> {
    try {
      const analysis = this.analyzePerformancePatterns(performanceData);
      
      return {
        difficultyAdjustment: analysis.suggestedDifficulty,
        recommendedActivities: analysis.activities,
        learningSupports: analysis.supports,
        motivationalMessages: analysis.motivation
      };
    } catch (error) {
      console.error('Error generating adaptive learning:', error);
      throw error;
    }
  }

  /**
   * Track user interaction for behavior analysis
   */
  async trackInteraction(userId: string, interaction: {
    type: 'click' | 'scroll' | 'hover' | 'focus' | 'voice' | 'gesture';
    element: string;
    timestamp: Date;
    context: string;
    duration?: number;
    value?: any;
  }): Promise<void> {
    try {
      const storageKey = `user_interactions_${userId}`;
      const existingData = localStorage.getItem(storageKey);
      const interactions = existingData ? JSON.parse(existingData) : [];
      
      interactions.push(interaction);
      
      // Keep only last 1000 interactions to prevent storage bloat
      if (interactions.length > 1000) {
        interactions.splice(0, interactions.length - 1000);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(interactions));
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  /**
   * Generate learning effectiveness report
   */
  async generateEffectivenessReport(userId: string, timeRange: { start: Date; end: Date }): Promise<{
    overallEffectiveness: number;
    skillMastery: { [skill: string]: number };
    timeEfficiency: number;
    engagementLevel: number;
    retentionRate: number;
    recommendations: string[];
  }> {
    try {
      // Analyze learning data within time range
      const analytics = await this.getUserAnalytics(userId);
      
      return {
        overallEffectiveness: this.calculateOverallEffectiveness(analytics),
        skillMastery: this.calculateSkillMastery(analytics.progress),
        timeEfficiency: this.calculateTimeEfficiency(analytics),
        engagementLevel: this.calculateEngagementLevel(analytics),
        retentionRate: this.calculateRetentionRate(analytics),
        recommendations: this.generateEffectivenessRecommendations(analytics)
      };
    } catch (error) {
      console.error('Error generating effectiveness report:', error);
      throw error;
    }
  }

  // Private helper methods

  private calculateEngagementScore(session: LearningSession, event: string): number {
    let score = session.engagementScore;
    
    switch (event) {
      case 'interaction':
        score = Math.min(10, score + 0.1);
        break;
      case 'success':
        score = Math.min(10, score + 0.5);
        break;
      case 'help_request':
        score = Math.min(10, score + 0.2);
        break;
      case 'error':
        score = Math.max(0, score - 0.1);
        break;
    }
    
    return score;
  }

  private async generateSessionInsights(session: LearningSession): Promise<PerformanceInsight[]> {
    const insights: PerformanceInsight[] = [];
    
    // Completion rate insight
    if (session.completionRate >= 0.8) {
      insights.push({
        id: `insight_${Date.now()}_completion`,
        userId: session.userId,
        type: 'strength',
        title: 'Excellent Progress!',
        description: `You completed ${Math.round(session.completionRate * 100)}% of the learning journey.`,
        actionableSteps: ['Continue building on this momentum', 'Consider advancing to intermediate level'],
        priority: 'high',
        category: 'completion',
        generatedAt: new Date(),
        acknowledged: false
      });
    } else if (session.completionRate < 0.3) {
      insights.push({
        id: `insight_${Date.now()}_completion`,
        userId: session.userId,
        type: 'improvement',
        title: 'Let\'s Boost Your Progress',
        description: 'You\'ve completed less than 30% of the content. Let\'s identify what\'s challenging.',
        actionableSteps: ['Try shorter learning sessions', 'Request help when needed', 'Take breaks between stages'],
        priority: 'medium',
        category: 'completion',
        generatedAt: new Date(),
        acknowledged: false
      });
    }
    
    // Engagement insight
    if (session.engagementScore >= 8) {
      insights.push({
        id: `insight_${Date.now()}_engagement`,
        userId: session.userId,
        type: 'strength',
        title: 'High Engagement Level',
        description: 'You\'re actively participating and showing great focus!',
        actionableSteps: ['Continue this engagement pattern', 'Consider exploring advanced features'],
        priority: 'medium',
        category: 'engagement',
        generatedAt: new Date(),
        acknowledged: false
      });
    }
    
    return insights;
  }

  private async updateProgressMetrics(session: LearningSession): Promise<void> {
    // This would update the user's progress metrics in the database
    const progressKey = `progress_metrics_${session.userId}`;
    const existingProgress = localStorage.getItem(progressKey);
    const progress = existingProgress ? JSON.parse(existingProgress) : {};
    
    progress.lastSession = session;
    progress.totalSessions = (progress.totalSessions || 0) + 1;
    progress.totalTimeSpent = (progress.totalTimeSpent || 0) + session.totalTimeSpent;
    progress.averageEngagement = ((progress.averageEngagement || 5) + session.engagementScore) / 2;
    
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  private async getProgressMetrics(userId: string): Promise<ProgressMetrics[]> {
    // Mock implementation - would query database in real implementation
    return [
      {
        userId,
        skillArea: 'PACE Framework',
        currentLevel: 'intermediate',
        masteryScore: 75,
        attemptsCount: 3,
        helpRequestsCount: 1,
        errorCount: 2,
        successfulCompletions: 2,
        lastActivity: new Date(),
        strengthAreas: ['Purpose Definition', 'Audience Analysis'],
        improvementAreas: ['Tone Adaptation']
      }
    ];
  }

  private async getPerformanceInsights(userId: string): Promise<PerformanceInsight[]> {
    // Mock implementation
    return [];
  }

  private async generateLearningPath(userId: string): Promise<LearningPath> {
    return {
      id: `path_${userId}_${Date.now()}`,
      userId,
      currentStage: 'pace-tone',
      recommendedNextStages: ['pace-execute', 'tone-mastery'],
      estimatedCompletionTime: 30 * 60 * 1000, // 30 minutes
      difficultyProgression: [3, 4, 5],
      adaptiveAdjustments: {
        speedUp: false,
        simplify: false,
        addPractice: true,
        skipAhead: false
      },
      personalizedContent: {
        examples: ['Nonprofit fundraising emails', 'Community updates'],
        scenarios: ['Urgent program updates', 'Thank you messages'],
        challenges: ['Difficult conversation handling']
      }
    };
  }

  private async analyzeBehaviorPatterns(userId: string): Promise<UserBehaviorAnalytics> {
    return {
      userId,
      interactionPatterns: {
        preferredTimeOfDay: 'morning',
        averageSessionDuration: 25 * 60 * 1000, // 25 minutes
        clickHeatmaps: {},
        scrollDepth: [0.8, 0.9, 0.7],
        timeOnPage: {}
      },
      learningStyle: {
        visual: 0.7,
        auditory: 0.2,
        kinesthetic: 0.1,
        readingWriting: 0.6
      },
      cognitiveLoad: {
        optimal: true,
        overloaded: false,
        underutilized: false,
        suggestions: ['Maintain current pacing', 'Consider adding visual aids']
      }
    };
  }

  private analyzePerformancePatterns(performanceData: any) {
    // Simple analysis logic - in real implementation would be more sophisticated
    return {
      suggestedDifficulty: 5,
      activities: ['Practice tone adaptation', 'Template creation exercises'],
      supports: ['Visual examples', 'Step-by-step guidance'],
      motivation: ['You\'re making great progress!', 'Keep up the excellent work!']
    };
  }

  private calculateOverallEffectiveness(analytics: any): number {
    // Calculate based on completion rates, time efficiency, and engagement
    return 0.75; // 75% effectiveness
  }

  private calculateSkillMastery(progress: ProgressMetrics[]): { [skill: string]: number } {
    const mastery: { [skill: string]: number } = {};
    progress.forEach(p => {
      mastery[p.skillArea] = p.masteryScore;
    });
    return mastery;
  }

  private calculateTimeEfficiency(analytics: any): number {
    return 0.8; // 80% time efficiency
  }

  private calculateEngagementLevel(analytics: any): number {
    return 0.85; // 85% engagement
  }

  private calculateRetentionRate(analytics: any): number {
    return 0.9; // 90% retention
  }

  private generateEffectivenessRecommendations(analytics: any): string[] {
    return [
      'Continue with current learning pace',
      'Focus more on practical applications',
      'Consider peer learning opportunities'
    ];
  }
}

export const learningAnalyticsService = LearningAnalyticsService.getInstance();