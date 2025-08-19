/**
 * User Interaction Analytics System
 * Tracks user behavior patterns, AI interaction usage, and engagement metrics
 */

import { InteractionEvent, PatternUsageMetrics } from '../types';

export class InteractionAnalytics {
  private static instance: InteractionAnalytics;
  private interactions: InteractionEvent[] = [];
  private patterns: Map<string, PatternUsageMetrics> = new Map();
  private sessions: Map<string, {
    startTime: Date;
    interactions: InteractionEvent[];
    patterns: string[];
  }> = new Map();
  private isTracking = false;

  private constructor() {}

  static getInstance(): InteractionAnalytics {
    if (!InteractionAnalytics.instance) {
      InteractionAnalytics.instance = new InteractionAnalytics();
    }
    return InteractionAnalytics.instance;
  }

  /**
   * Start interaction tracking
   */
  startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.setupEventListeners();
    console.log('📊 Interaction analytics started');
  }

  /**
   * Stop interaction tracking
   */
  stopTracking(): void {
    this.isTracking = false;
    this.removeEventListeners();
    console.log('📊 Interaction analytics stopped');
  }

  /**
   * Track a user interaction
   */
  trackInteraction(interaction: Omit<InteractionEvent, 'id' | 'timestamp'>): string {
    const event: InteractionEvent = {
      id: `interaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...interaction
    };

    this.interactions.push(event);
    this.updateSession(event);
    this.updatePatternMetrics(event);

    // Limit memory usage
    if (this.interactions.length > 10000) {
      this.interactions = this.interactions.slice(-5000);
    }

    return event.id;
  }

  /**
   * Track AI interaction specifically
   */
  trackAIInteraction(interaction: {
    sessionId: string;
    userId?: string;
    component: string;
    type: 'chat-open' | 'message-sent' | 'suggestion-used' | 'pattern-applied';
    data: {
      messageLength?: number;
      responseTime?: number;
      patternId?: string;
      satisfaction?: number;
      context?: Record<string, any>;
    };
    duration?: number;
    success: boolean;
  }): string {
    return this.trackInteraction({
      sessionId: interaction.sessionId,
      userId: interaction.userId,
      type: 'ai-interaction',
      component: interaction.component,
      element: interaction.type,
      data: interaction.data,
      duration: interaction.duration,
      success: interaction.success
    });
  }

  /**
   * Track pattern usage
   */
  trackPatternUsage(usage: {
    sessionId: string;
    userId?: string;
    patternId: string;
    patternType: PatternUsageMetrics['patternType'];
    component: string;
    engagementTime: number;
    success: boolean;
    satisfactionScore?: number;
    context?: Record<string, any>;
  }): string {
    const interactionId = this.trackInteraction({
      sessionId: usage.sessionId,
      userId: usage.userId,
      type: 'pattern-usage',
      component: usage.component,
      element: usage.patternId,
      data: {
        patternType: usage.patternType,
        engagementTime: usage.engagementTime,
        satisfactionScore: usage.satisfactionScore,
        ...usage.context
      },
      duration: usage.engagementTime,
      success: usage.success
    });

    this.updatePatternUsageMetrics(usage);
    return interactionId;
  }

  /**
   * Get interactions with filtering
   */
  getInteractions(filters?: {
    sessionId?: string;
    userId?: string;
    type?: InteractionEvent['type'][];
    component?: string;
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): InteractionEvent[] {
    let filtered = this.interactions;

    if (filters) {
      filtered = this.interactions.filter(interaction => {
        const matchesSession = !filters.sessionId || interaction.sessionId === filters.sessionId;
        const matchesUser = !filters.userId || interaction.userId === filters.userId;
        const matchesType = !filters.type || filters.type.includes(interaction.type);
        const matchesComponent = !filters.component || interaction.component === filters.component;
        const matchesTimeRange = !filters.timeRange || (
          interaction.timestamp >= filters.timeRange.start && 
          interaction.timestamp <= filters.timeRange.end
        );

        return matchesSession && matchesUser && matchesType && 
               matchesComponent && matchesTimeRange;
      });
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Get pattern usage analytics
   */
  getPatternAnalytics(patternId?: string): PatternUsageMetrics[] {
    if (patternId) {
      const pattern = this.patterns.get(patternId);
      return pattern ? [pattern] : [];
    }

    return Array.from(this.patterns.values())
      .sort((a, b) => b.usageCount - a.usageCount);
  }

  /**
   * Get interaction statistics
   */
  getInteractionStats(timeRange?: { start: Date; end: Date }): {
    totalInteractions: number;
    uniqueUsers: number;
    uniqueSessions: number;
    avgSessionDuration: number;
    byType: Record<InteractionEvent['type'], number>;
    byComponent: Record<string, number>;
    successRate: number;
    engagementMetrics: {
      avgInteractionsPerSession: number;
      avgInteractionDuration: number;
      bounceRate: number; // sessions with only 1 interaction
    };
    aiInteractionMetrics: {
      chatSessions: number;
      avgMessagesPerSession: number;
      avgResponseTime: number;
      patternUsageRate: number;
      satisfactionScore: number;
    };
    topComponents: Array<{ component: string; interactions: number; successRate: number }>;
  } {
    const interactions = timeRange ? this.getInteractions({ timeRange }) : this.interactions;
    
    const stats = {
      totalInteractions: interactions.length,
      uniqueUsers: new Set(interactions.map(i => i.userId).filter(Boolean)).size,
      uniqueSessions: new Set(interactions.map(i => i.sessionId)).size,
      avgSessionDuration: 0,
      byType: {} as Record<InteractionEvent['type'], number>,
      byComponent: {} as Record<string, number>,
      successRate: 0,
      engagementMetrics: {
        avgInteractionsPerSession: 0,
        avgInteractionDuration: 0,
        bounceRate: 0
      },
      aiInteractionMetrics: {
        chatSessions: 0,
        avgMessagesPerSession: 0,
        avgResponseTime: 0,
        patternUsageRate: 0,
        satisfactionScore: 0
      },
      topComponents: [] as Array<{ component: string; interactions: number; successRate: number }>
    };

    if (interactions.length === 0) return stats;

    // Basic metrics
    const successfulInteractions = interactions.filter(i => i.success);
    stats.successRate = (successfulInteractions.length / interactions.length) * 100;

    // Group by type and component
    interactions.forEach(interaction => {
      stats.byType[interaction.type] = (stats.byType[interaction.type] || 0) + 1;
      stats.byComponent[interaction.component] = (stats.byComponent[interaction.component] || 0) + 1;
    });

    // Session metrics
    const sessionData = new Map<string, InteractionEvent[]>();
    interactions.forEach(interaction => {
      if (!sessionData.has(interaction.sessionId)) {
        sessionData.set(interaction.sessionId, []);
      }
      sessionData.get(interaction.sessionId)!.push(interaction);
    });

    // Session duration and engagement
    let totalSessionDuration = 0;
    let totalInteractionDuration = 0;
    let interactionsWithDuration = 0;
    let singleInteractionSessions = 0;

    sessionData.forEach(sessionInteractions => {
      if (sessionInteractions.length === 1) {
        singleInteractionSessions++;
      }

      sessionInteractions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      if (sessionInteractions.length > 1) {
        const sessionDuration = sessionInteractions[sessionInteractions.length - 1].timestamp.getTime() - 
                               sessionInteractions[0].timestamp.getTime();
        totalSessionDuration += sessionDuration;
      }

      sessionInteractions.forEach(interaction => {
        if (interaction.duration) {
          totalInteractionDuration += interaction.duration;
          interactionsWithDuration++;
        }
      });
    });

    stats.avgSessionDuration = sessionData.size > 0 ? totalSessionDuration / sessionData.size : 0;
    stats.engagementMetrics.avgInteractionsPerSession = interactions.length / sessionData.size;
    stats.engagementMetrics.avgInteractionDuration = interactionsWithDuration > 0 ? 
      totalInteractionDuration / interactionsWithDuration : 0;
    stats.engagementMetrics.bounceRate = (singleInteractionSessions / sessionData.size) * 100;

    // AI interaction metrics
    const aiInteractions = interactions.filter(i => i.type === 'ai-interaction');
    const chatSessions = new Set(aiInteractions.map(i => i.sessionId)).size;
    stats.aiInteractionMetrics.chatSessions = chatSessions;

    if (aiInteractions.length > 0) {
      const messageSentInteractions = aiInteractions.filter(i => i.element === 'message-sent');
      stats.aiInteractionMetrics.avgMessagesPerSession = chatSessions > 0 ? 
        messageSentInteractions.length / chatSessions : 0;

      const responseTimes = aiInteractions
        .map(i => i.data.responseTime)
        .filter((t): t is number => typeof t === 'number');
      stats.aiInteractionMetrics.avgResponseTime = responseTimes.length > 0 ?
        responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

      const patternInteractions = interactions.filter(i => i.type === 'pattern-usage');
      stats.aiInteractionMetrics.patternUsageRate = aiInteractions.length > 0 ?
        (patternInteractions.length / aiInteractions.length) * 100 : 0;

      const satisfactionScores = aiInteractions
        .map(i => i.data.satisfaction)
        .filter((s): s is number => typeof s === 'number');
      stats.aiInteractionMetrics.satisfactionScore = satisfactionScores.length > 0 ?
        satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length : 0;
    }

    // Top components
    const componentStats = new Map<string, { total: number; successful: number }>();
    interactions.forEach(interaction => {
      if (!componentStats.has(interaction.component)) {
        componentStats.set(interaction.component, { total: 0, successful: 0 });
      }
      const stats = componentStats.get(interaction.component)!;
      stats.total++;
      if (interaction.success) stats.successful++;
    });

    stats.topComponents = Array.from(componentStats.entries())
      .map(([component, data]) => ({
        component,
        interactions: data.total,
        successRate: (data.successful / data.total) * 100
      }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 10);

    return stats;
  }

  /**
   * Get user journey analysis
   */
  getUserJourney(userId: string, timeRange?: { start: Date; end: Date }): {
    sessions: Array<{
      sessionId: string;
      startTime: Date;
      endTime: Date;
      interactions: InteractionEvent[];
      patterns: string[];
      duration: number;
      success: boolean;
    }>;
    totalSessions: number;
    avgSessionDuration: number;
    mostUsedComponents: string[];
    preferredPatterns: string[];
    engagementTrend: 'increasing' | 'decreasing' | 'stable';
  } {
    const userInteractions = this.getInteractions({
      userId,
      timeRange
    });

    const sessionMap = new Map<string, InteractionEvent[]>();
    userInteractions.forEach(interaction => {
      if (!sessionMap.has(interaction.sessionId)) {
        sessionMap.set(interaction.sessionId, []);
      }
      sessionMap.get(interaction.sessionId)!.push(interaction);
    });

    const sessions = Array.from(sessionMap.entries()).map(([sessionId, interactions]) => {
      interactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const startTime = interactions[0].timestamp;
      const endTime = interactions[interactions.length - 1].timestamp;
      const duration = endTime.getTime() - startTime.getTime();
      const patterns = Array.from(new Set(
        interactions
          .filter(i => i.type === 'pattern-usage')
          .map(i => i.element)
          .filter(Boolean)
      ));
      const success = interactions.some(i => i.success);

      return {
        sessionId,
        startTime,
        endTime,
        interactions,
        patterns,
        duration,
        success
      };
    });

    sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const avgSessionDuration = sessions.length > 0 ?
      sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length : 0;

    // Component usage frequency
    const componentUsage = new Map<string, number>();
    userInteractions.forEach(interaction => {
      componentUsage.set(interaction.component, (componentUsage.get(interaction.component) || 0) + 1);
    });
    const mostUsedComponents = Array.from(componentUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([component]) => component);

    // Pattern preferences
    const patternUsage = new Map<string, number>();
    userInteractions
      .filter(i => i.type === 'pattern-usage')
      .forEach(interaction => {
        if (interaction.element) {
          patternUsage.set(interaction.element, (patternUsage.get(interaction.element) || 0) + 1);
        }
      });
    const preferredPatterns = Array.from(patternUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pattern]) => pattern);

    // Engagement trend
    let engagementTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (sessions.length >= 3) {
      const recentSessions = sessions.slice(-3);
      const olderSessions = sessions.slice(0, 3);
      const recentAvgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
      const olderAvgDuration = olderSessions.reduce((sum, s) => sum + s.duration, 0) / olderSessions.length;
      
      const changePercent = ((recentAvgDuration - olderAvgDuration) / olderAvgDuration) * 100;
      if (Math.abs(changePercent) > 10) {
        engagementTrend = changePercent > 0 ? 'increasing' : 'decreasing';
      }
    }

    return {
      sessions,
      totalSessions: sessions.length,
      avgSessionDuration,
      mostUsedComponents,
      preferredPatterns,
      engagementTrend
    };
  }

  /**
   * Export analytics data
   */
  exportAnalytics(format: 'json' | 'csv' = 'json'): string {
    const data = {
      interactions: this.interactions,
      patterns: Array.from(this.patterns.values()),
      stats: this.getInteractionStats(),
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      return this.convertToCSV(this.interactions);
    }

    return JSON.stringify(data, null, 2);
  }

  // Private methods
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Track page navigation
    window.addEventListener('beforeunload', () => {
      // Save session data before page unload
      this.saveSessions();
    });

    // Track clicks globally (optional)
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.dataset.trackClick) {
        this.trackInteraction({
          sessionId: 'global',
          type: 'click',
          component: target.dataset.component || 'unknown',
          element: target.tagName.toLowerCase(),
          data: {
            text: target.textContent,
            className: target.className,
            coordinates: { x: event.clientX, y: event.clientY }
          },
          success: true
        });
      }
    });
  }

  private removeEventListeners(): void {
    // Clean up any event listeners if needed
  }

  private updateSession(interaction: InteractionEvent): void {
    let session = this.sessions.get(interaction.sessionId);
    
    if (!session) {
      session = {
        startTime: interaction.timestamp,
        interactions: [],
        patterns: []
      };
      this.sessions.set(interaction.sessionId, session);
    }

    session.interactions.push(interaction);
    
    if (interaction.type === 'pattern-usage' && interaction.element) {
      if (!session.patterns.includes(interaction.element)) {
        session.patterns.push(interaction.element);
      }
    }
  }

  private updatePatternMetrics(interaction: InteractionEvent): void {
    if (interaction.type === 'pattern-usage' && interaction.element) {
      this.updatePatternUsageMetrics({
        patternId: interaction.element,
        patternType: interaction.data.patternType || 'interaction-pattern',
        engagementTime: interaction.duration || 0,
        success: interaction.success,
        satisfactionScore: interaction.data.satisfactionScore
      } as any);
    }
  }

  private updatePatternUsageMetrics(usage: {
    patternId: string;
    patternType: PatternUsageMetrics['patternType'];
    engagementTime: number;
    success: boolean;
    satisfactionScore?: number;
  }): void {
    let pattern = this.patterns.get(usage.patternId);
    
    if (!pattern) {
      pattern = {
        patternId: usage.patternId,
        patternType: usage.patternType,
        usageCount: 0,
        avgEngagementTime: 0,
        successRate: 0,
        dropoffRate: 0,
        userSatisfactionScore: 0,
        lastUsed: new Date(),
        trends: {
          daily: [],
          weekly: [],
          monthly: []
        }
      };
      this.patterns.set(usage.patternId, pattern);
    }

    // Update metrics
    const totalUsage = pattern.usageCount + 1;
    pattern.avgEngagementTime = 
      (pattern.avgEngagementTime * pattern.usageCount + usage.engagementTime) / totalUsage;
    
    const successfulUsage = (pattern.successRate / 100) * pattern.usageCount + (usage.success ? 1 : 0);
    pattern.successRate = (successfulUsage / totalUsage) * 100;
    
    if (usage.satisfactionScore !== undefined) {
      const totalSatisfaction = (pattern.userSatisfactionScore || 0) * pattern.usageCount + usage.satisfactionScore;
      pattern.userSatisfactionScore = totalSatisfaction / totalUsage;
    }
    
    pattern.usageCount = totalUsage;
    pattern.lastUsed = new Date();
  }

  private saveSessions(): void {
    // Implement session persistence if needed
    try {
      const sessionData = Array.from(this.sessions.entries());
      localStorage.setItem('analytics-sessions', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  }

  private convertToCSV(interactions: InteractionEvent[]): string {
    if (interactions.length === 0) return '';
    
    const headers = [
      'id', 'sessionId', 'userId', 'type', 'component', 'element',
      'timestamp', 'duration', 'success'
    ];
    
    const rows = interactions.map(interaction => [
      interaction.id,
      interaction.sessionId,
      interaction.userId || '',
      interaction.type,
      interaction.component,
      interaction.element || '',
      interaction.timestamp.toISOString(),
      interaction.duration || '',
      interaction.success
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}