/**
 * Analytics and insights for interaction patterns
 */

export interface PatternAnalytics {
  patternType: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  interactionCount: number;
  completionRate: number;
  userSatisfaction?: number;
  effectivenessScore: number;
  insights: PatternInsight[];
  metadata: Record<string, any>;
}

export interface PatternInsight {
  type: 'performance' | 'usability' | 'engagement' | 'completion';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  data: any;
}

export interface InteractionEvent {
  timestamp: Date;
  type: string;
  patternType: string;
  elementId?: string;
  value?: any;
  metadata?: Record<string, any>;
}

class PatternAnalyticsService {
  private events: InteractionEvent[] = [];
  private sessions: Map<string, PatternAnalytics> = new Map();

  /**
   * Track an interaction event
   */
  trackEvent(event: Omit<InteractionEvent, 'timestamp'>): void {
    const fullEvent: InteractionEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.events.push(fullEvent);
    
    // Update session analytics
    this.updateSessionAnalytics(event.patternType, fullEvent);
  }

  /**
   * Start a new pattern session
   */
  startSession(patternType: string, sessionId: string, metadata: Record<string, any> = {}): void {
    const analytics: PatternAnalytics = {
      patternType,
      sessionId,
      startTime: new Date(),
      interactionCount: 0,
      completionRate: 0,
      effectivenessScore: 0,
      insights: [],
      metadata
    };
    
    this.sessions.set(sessionId, analytics);
  }

  /**
   * End a pattern session and generate insights
   */
  endSession(sessionId: string): PatternAnalytics | null {
    const analytics = this.sessions.get(sessionId);
    if (!analytics) return null;

    analytics.endTime = new Date();
    analytics.duration = analytics.endTime.getTime() - analytics.startTime.getTime();
    
    // Generate insights
    analytics.insights = this.generateInsights(sessionId);
    analytics.effectivenessScore = this.calculateEffectiveness(analytics);
    
    return analytics;
  }

  /**
   * Get analytics for a specific session
   */
  getSessionAnalytics(sessionId: string): PatternAnalytics | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get aggregated analytics across all sessions
   */
  getAggregatedAnalytics(patternType?: string): {
    totalSessions: number;
    averageDuration: number;
    averageInteractions: number;
    averageEffectiveness: number;
    commonInsights: PatternInsight[];
  } {
    const sessions = Array.from(this.sessions.values());
    const filteredSessions = patternType 
      ? sessions.filter(s => s.patternType === patternType)
      : sessions;

    if (filteredSessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        averageInteractions: 0,
        averageEffectiveness: 0,
        commonInsights: []
      };
    }

    const totalDuration = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalInteractions = filteredSessions.reduce((sum, s) => sum + s.interactionCount, 0);
    const totalEffectiveness = filteredSessions.reduce((sum, s) => sum + s.effectivenessScore, 0);

    // Find common insights
    const insightCounts = new Map<string, number>();
    filteredSessions.forEach(session => {
      session.insights.forEach(insight => {
        const key = `${insight.type}:${insight.title}`;
        insightCounts.set(key, (insightCounts.get(key) || 0) + 1);
      });
    });

    const commonInsights = Array.from(insightCounts.entries())
      .filter(([_, count]) => count >= Math.ceil(filteredSessions.length * 0.3)) // 30% threshold
      .map(([key, _]) => {
        const [type, title] = key.split(':');
        return filteredSessions
          .find(s => s.insights.some(i => i.type === type && i.title === title))
          ?.insights
          .find(i => i.type === type && i.title === title);
      })
      .filter(Boolean) as PatternInsight[];

    return {
      totalSessions: filteredSessions.length,
      averageDuration: totalDuration / filteredSessions.length,
      averageInteractions: totalInteractions / filteredSessions.length,
      averageEffectiveness: totalEffectiveness / filteredSessions.length,
      commonInsights
    };
  }

  /**
   * Update session analytics with new event
   */
  private updateSessionAnalytics(patternType: string, event: InteractionEvent): void {
    // Find the most recent session for this pattern type
    const sessions = Array.from(this.sessions.values())
      .filter(s => s.patternType === patternType && !s.endTime)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    const currentSession = sessions[0];
    if (currentSession) {
      currentSession.interactionCount++;
      
      // Update completion rate based on event type
      if (event.type === 'completion' || event.type === 'submit') {
        currentSession.completionRate = 100;
      }
    }
  }

  /**
   * Generate insights for a session
   */
  private generateInsights(sessionId: string): PatternInsight[] {
    const analytics = this.sessions.get(sessionId);
    if (!analytics) return [];

    const insights: PatternInsight[] = [];
    const sessionEvents = this.events.filter(e => 
      e.timestamp >= analytics.startTime && 
      (!analytics.endTime || e.timestamp <= analytics.endTime)
    );

    // Performance insights
    if (analytics.duration && analytics.duration > 5 * 60 * 1000) { // 5 minutes
      insights.push({
        type: 'performance',
        title: 'Extended Session Duration',
        description: 'User took longer than average to complete the interaction pattern.',
        severity: 'medium',
        recommendation: 'Consider simplifying the pattern or providing better guidance.',
        data: { duration: analytics.duration }
      });
    }

    // Usability insights
    if (analytics.interactionCount > 20) {
      insights.push({
        type: 'usability',
        title: 'High Interaction Count',
        description: 'User required many interactions to complete the pattern.',
        severity: 'medium',
        recommendation: 'Review pattern complexity and consider streamlining the flow.',
        data: { interactionCount: analytics.interactionCount }
      });
    }

    // Engagement insights
    const errorEvents = sessionEvents.filter(e => e.type === 'error');
    if (errorEvents.length > 3) {
      insights.push({
        type: 'engagement',
        title: 'Multiple Errors',
        description: 'User encountered several errors during the interaction.',
        severity: 'high',
        recommendation: 'Improve error handling and validation messages.',
        data: { errorCount: errorEvents.length }
      });
    }

    // Completion insights
    if (analytics.completionRate < 100) {
      insights.push({
        type: 'completion',
        title: 'Incomplete Session',
        description: 'User did not complete the interaction pattern.',
        severity: 'high',
        recommendation: 'Investigate barriers to completion and improve user guidance.',
        data: { completionRate: analytics.completionRate }
      });
    }

    return insights;
  }

  /**
   * Calculate effectiveness score for a session
   */
  private calculateEffectiveness(analytics: PatternAnalytics): number {
    let score = 10; // Start with perfect score

    // Deduct points for long duration
    if (analytics.duration) {
      const durationMinutes = analytics.duration / (1000 * 60);
      if (durationMinutes > 10) {
        score -= Math.min(3, (durationMinutes - 10) / 5);
      }
    }

    // Deduct points for high interaction count
    if (analytics.interactionCount > 15) {
      score -= Math.min(2, (analytics.interactionCount - 15) / 10);
    }

    // Deduct points for incomplete sessions
    if (analytics.completionRate < 100) {
      score -= (100 - analytics.completionRate) / 20;
    }

    // Deduct points for severe insights
    const severeInsights = analytics.insights.filter(i => i.severity === 'high').length;
    score -= severeInsights * 1.5;

    const mediumInsights = analytics.insights.filter(i => i.severity === 'medium').length;
    score -= mediumInsights * 0.5;

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Export analytics data
   */
  exportData(): {
    events: InteractionEvent[];
    sessions: PatternAnalytics[];
    aggregated: ReturnType<typeof this.getAggregatedAnalytics>;
  } {
    return {
      events: [...this.events],
      sessions: Array.from(this.sessions.values()),
      aggregated: this.getAggregatedAnalytics()
    };
  }

  /**
   * Clear all analytics data
   */
  clearData(): void {
    this.events = [];
    this.sessions.clear();
  }
}

// Export singleton instance
export const patternAnalytics = new PatternAnalyticsService();

/**
 * React hook for pattern analytics
 */
export function usePatternAnalytics(patternType: string, sessionId?: string) {
  const currentSessionId = sessionId || `${patternType}-${Date.now()}`;

  const startSession = (metadata: Record<string, any> = {}) => {
    patternAnalytics.startSession(patternType, currentSessionId, metadata);
  };

  const trackEvent = (type: string, elementId?: string, value?: any, metadata?: Record<string, any>) => {
    patternAnalytics.trackEvent({
      type,
      patternType,
      elementId,
      value,
      metadata
    });
  };

  const endSession = () => {
    return patternAnalytics.endSession(currentSessionId);
  };

  const getSessionAnalytics = () => {
    return patternAnalytics.getSessionAnalytics(currentSessionId);
  };

  const getAggregatedAnalytics = () => {
    return patternAnalytics.getAggregatedAnalytics(patternType);
  };

  return {
    sessionId: currentSessionId,
    startSession,
    trackEvent,
    endSession,
    getSessionAnalytics,
    getAggregatedAnalytics
  };
}