import { supabase } from '@/integrations/supabase/client';

export interface UserInteraction {
  type: 'click' | 'hover' | 'focus' | 'scroll' | 'input' | 'submit' | 'error' | 'navigation';
  target: string;
  value?: any;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews: number;
  interactions: UserInteraction[];
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    screenSize: string;
  };
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  loadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay?: number;
  totalBlockingTime?: number;
}

export interface UsagePattern {
  userId: string;
  pattern: string;
  frequency: number;
  lastOccurrence: string;
  context: Record<string, any>;
}

export interface ExportTracking {
  exportId: string;
  userId: string;
  format: string;
  size: number;
  duration: number;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface AnalyticsReport {
  period: { start: Date; end: Date };
  totalSessions: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  topInteractions: { type: string; count: number }[];
  popularElements: { element: string; interactions: number }[];
  completionRates: { element: string; rate: number }[];
  tokenUsage: TokenUsageStats;
  exportStats: ExportStats;
  performanceOverview: PerformanceOverview;
  userJourneys: UserJourney[];
}

export interface TokenUsageStats {
  total: number;
  byUser: { userId: string; tokens: number }[];
  byFeature: { feature: string; tokens: number }[];
  averagePerSession: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ExportStats {
  totalExports: number;
  byFormat: { format: string; count: number }[];
  averageSize: number;
  averageDuration: number;
  successRate: number;
}

export interface PerformanceOverview {
  averageLoadTime: number;
  p95LoadTime: number;
  errorRate: number;
  slowestPages: { page: string; loadTime: number }[];
}

export interface UserJourney {
  userId: string;
  steps: JourneyStep[];
  completedGoals: string[];
  dropoffPoint?: string;
  totalDuration: number;
}

export interface JourneyStep {
  page: string;
  action: string;
  timestamp: string;
  duration: number;
  success: boolean;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSession: Session | null = null;
  private interactionBuffer: UserInteraction[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  constructor() {
    this.initializeSession();
    this.setupEventListeners();
    this.setupPerformanceObserver();
    this.startFlushInterval();
  }

  private initializeSession(): void {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = supabase.auth.getUser();

    this.currentSession = {
      id: sessionId,
      userId: user?.data?.user?.id || 'anonymous',
      startTime: new Date().toISOString(),
      pageViews: 0,
      interactions: [],
      device: this.getDeviceInfo(),
      performance: this.getInitialPerformanceMetrics()
    };
  }

  private getDeviceInfo(): Session['device'] {
    const userAgent = navigator.userAgent.toLowerCase();
    let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    
    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      type = 'mobile';
    } else if (/ipad|tablet/.test(userAgent)) {
      type = 'tablet';
    }

    return {
      type,
      browser: this.detectBrowser(),
      os: this.detectOS(),
      screenSize: `${window.screen.width}x${window.screen.height}`
    };
  }

  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private detectOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private getInitialPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
      timeToInteractive: navigation?.domInteractive - navigation?.fetchStart || 0,
      firstContentfulPaint: this.getMetricValue('first-contentful-paint'),
      largestContentfulPaint: this.getMetricValue('largest-contentful-paint'),
      cumulativeLayoutShift: this.getCLS()
    };
  }

  private getMetricValue(metricName: string): number {
    const entries = performance.getEntriesByName(metricName);
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private getCLS(): number {
    let clsValue = 0;
    const entries = performance.getEntriesByType('layout-shift') as any[];
    
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    
    return clsValue;
  }

  private setupEventListeners(): void {
    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.trackInteraction({
        type: 'click',
        target: this.getElementIdentifier(target),
        timestamp: new Date().toISOString(),
        metadata: {
          text: target.textContent?.slice(0, 50),
          tagName: target.tagName
        }
      });
    });

    // Input tracking
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== 'password') {
        this.trackInteraction({
          type: 'input',
          target: this.getElementIdentifier(target),
          value: target.value.length, // Track length, not content
          timestamp: new Date().toISOString(),
          metadata: {
            inputType: target.type,
            fieldName: target.name || target.id
          }
        });
      }
    });

    // Form submission tracking
    document.addEventListener('submit', (e) => {
      const target = e.target as HTMLFormElement;
      this.trackInteraction({
        type: 'submit',
        target: this.getElementIdentifier(target),
        timestamp: new Date().toISOString(),
        metadata: {
          formId: target.id,
          formName: target.name
        }
      });
    });

    // Error tracking
    window.addEventListener('error', (e) => {
      this.trackInteraction({
        type: 'error',
        target: e.filename || 'unknown',
        timestamp: new Date().toISOString(),
        metadata: {
          message: e.message,
          line: e.lineno,
          column: e.colno
        }
      });
    });

    // Page navigation tracking
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      analyticsService.trackNavigation(window.location.pathname);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      analyticsService.trackNavigation(window.location.pathname);
    };

    window.addEventListener('popstate', () => {
      this.trackNavigation(window.location.pathname);
    });

    // Scroll tracking (throttled)
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackInteraction({
          type: 'scroll',
          target: 'window',
          timestamp: new Date().toISOString(),
          metadata: {
            scrollY: window.scrollY,
            scrollPercentage: (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          }
        });
      }, 500);
    });

    // Session end tracking
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            if (this.currentSession) {
              this.currentSession.performance.largestContentfulPaint = entry.startTime;
            }
          }
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.error('Error setting up performance observer:', e);
      }
    }
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Track dynamic content loading
          this.trackInteraction({
            type: 'navigation',
            target: 'dynamic-content',
            timestamp: new Date().toISOString(),
            metadata: {
              addedNodes: mutation.addedNodes.length
            }
          });
        }
      });
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private getElementIdentifier(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushInteractions();
    }, 30000); // Flush every 30 seconds
  }

  trackInteraction(interaction: UserInteraction): void {
    if (!this.currentSession) return;
    
    this.interactionBuffer.push(interaction);
    this.currentSession.interactions.push(interaction);

    // Flush immediately for critical interactions
    if (['error', 'submit'].includes(interaction.type)) {
      this.flushInteractions();
    }
  }

  trackNavigation(path: string): void {
    if (!this.currentSession) return;
    
    this.currentSession.pageViews++;
    this.trackInteraction({
      type: 'navigation',
      target: path,
      timestamp: new Date().toISOString()
    });
  }

  async trackExport(exportData: Omit<ExportTracking, 'exportId' | 'userId' | 'timestamp'>): Promise<void> {
    const user = await supabase.auth.getUser();
    
    const tracking: ExportTracking = {
      exportId: `export_${Date.now()}`,
      userId: user?.data?.user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      ...exportData
    };

    try {
      const { error } = await supabase
        .from('export_tracking')
        .insert(tracking);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking export:', error);
    }
  }

  async trackTokenUsage(feature: string, tokens: number): Promise<void> {
    const user = await supabase.auth.getUser();
    
    try {
      const { error } = await supabase
        .from('token_usage')
        .insert({
          user_id: user?.data?.user?.id || 'anonymous',
          feature,
          tokens,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking token usage:', error);
    }
  }

  private async flushInteractions(): Promise<void> {
    if (this.interactionBuffer.length === 0 || !this.currentSession) return;

    const interactions = [...this.interactionBuffer];
    this.interactionBuffer = [];

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert(
          interactions.map(interaction => ({
            session_id: this.currentSession!.id,
            user_id: this.currentSession!.userId,
            ...interaction
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error flushing interactions:', error);
      // Re-add to buffer on failure
      this.interactionBuffer.unshift(...interactions);
    }
  }

  private async endSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = Date.now() - new Date(this.currentSession.startTime).getTime();

    await this.flushInteractions();

    try {
      const { error } = await supabase
        .from('sessions')
        .insert(this.currentSession);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async generateReport(startDate: Date, endDate: Date): Promise<AnalyticsReport> {
    try {
      // Fetch sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (sessionsError) throw sessionsError;

      // Fetch interactions
      const sessionIds = sessions?.map(s => s.id) || [];
      const { data: interactions, error: interactionsError } = await supabase
        .from('user_interactions')
        .select('*')
        .in('session_id', sessionIds);

      if (interactionsError) throw interactionsError;

      // Fetch token usage
      const { data: tokenUsage, error: tokenError } = await supabase
        .from('token_usage')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (tokenError) throw tokenError;

      // Fetch export stats
      const { data: exports, error: exportError } = await supabase
        .from('export_tracking')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (exportError) throw exportError;

      // Calculate metrics
      const totalSessions = sessions?.length || 0;
      const uniqueUsers = new Set(sessions?.map(s => s.user_id)).size;
      const averageSessionDuration = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) / totalSessions || 0;

      // Interaction analysis
      const interactionCounts = new Map<string, number>();
      const elementInteractions = new Map<string, number>();
      
      interactions?.forEach(interaction => {
        interactionCounts.set(interaction.type, (interactionCounts.get(interaction.type) || 0) + 1);
        elementInteractions.set(interaction.target, (elementInteractions.get(interaction.target) || 0) + 1);
      });

      const topInteractions = Array.from(interactionCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([type, count]) => ({ type, count }));

      const popularElements = Array.from(elementInteractions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([element, interactions]) => ({ element, interactions }));

      // Token usage analysis
      const totalTokens = tokenUsage?.reduce((sum, t) => sum + t.tokens, 0) || 0;
      const tokensByUser = new Map<string, number>();
      const tokensByFeature = new Map<string, number>();

      tokenUsage?.forEach(usage => {
        tokensByUser.set(usage.user_id, (tokensByUser.get(usage.user_id) || 0) + usage.tokens);
        tokensByFeature.set(usage.feature, (tokensByFeature.get(usage.feature) || 0) + usage.tokens);
      });

      // Export analysis
      const exportsByFormat = new Map<string, number>();
      exports?.forEach(exp => {
        exportsByFormat.set(exp.format, (exportsByFormat.get(exp.format) || 0) + 1);
      });

      // Performance analysis
      const loadTimes = sessions?.map(s => s.performance?.load_time || 0).filter(t => t > 0) || [];
      const averageLoadTime = loadTimes.reduce((sum, t) => sum + t, 0) / loadTimes.length || 0;
      const p95LoadTime = loadTimes.sort((a, b) => a - b)[Math.floor(loadTimes.length * 0.95)] || 0;

      // Calculate completion rates (placeholder - would need actual element completion data)
      const completionRates = [
        { element: 'MayaEmailComposer', rate: 0.85 },
        { element: 'AlexVisionBuilder', rate: 0.78 },
        { element: 'DavidDataStoryteller', rate: 0.82 }
      ];

      return {
        period: { start: startDate, end: endDate },
        totalSessions,
        uniqueUsers,
        averageSessionDuration,
        topInteractions,
        popularElements,
        completionRates,
        tokenUsage: {
          total: totalTokens,
          byUser: Array.from(tokensByUser.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([userId, tokens]) => ({ userId, tokens })),
          byFeature: Array.from(tokensByFeature.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([feature, tokens]) => ({ feature, tokens })),
          averagePerSession: totalTokens / totalSessions || 0,
          trend: 'stable' // Would need historical data to calculate
        },
        exportStats: {
          totalExports: exports?.length || 0,
          byFormat: Array.from(exportsByFormat.entries())
            .map(([format, count]) => ({ format, count })),
          averageSize: exports?.reduce((sum, e) => sum + e.size, 0) / exports?.length || 0,
          averageDuration: exports?.reduce((sum, e) => sum + e.duration, 0) / exports?.length || 0,
          successRate: exports?.filter(e => e.success).length / exports?.length || 0
        },
        performanceOverview: {
          averageLoadTime,
          p95LoadTime,
          errorRate: interactions?.filter(i => i.type === 'error').length / interactions?.length || 0,
          slowestPages: [] // Would need page-specific performance data
        },
        userJourneys: [] // Would need more complex journey tracking
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      throw error;
    }
  }

  async getUserJourney(userId: string, sessionId?: string): Promise<UserJourney> {
    try {
      let query = supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data: interactions, error } = await query;

      if (error) throw error;

      const steps: JourneyStep[] = [];
      let lastTimestamp = null;

      interactions?.forEach(interaction => {
        const timestamp = new Date(interaction.timestamp);
        const duration = lastTimestamp ? timestamp.getTime() - lastTimestamp.getTime() : 0;

        if (interaction.type === 'navigation' || interaction.type === 'submit') {
          steps.push({
            page: interaction.target,
            action: interaction.type,
            timestamp: interaction.timestamp,
            duration,
            success: interaction.type !== 'error'
          });
        }

        lastTimestamp = timestamp;
      });

      const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

      return {
        userId,
        steps,
        completedGoals: [], // Would need goal tracking
        totalDuration
      };
    } catch (error) {
      console.error('Error fetching user journey:', error);
      throw error;
    }
  }

  async identifyUsagePatterns(userId: string): Promise<UsagePattern[]> {
    try {
      const { data: interactions, error } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Analyze interaction sequences
      const patterns = new Map<string, UsagePattern>();

      // Simple pattern detection: sequences of 3 interactions
      for (let i = 0; i < interactions.length - 2; i++) {
        const sequence = [
          interactions[i].type,
          interactions[i + 1].type,
          interactions[i + 2].type
        ].join(' -> ');

        if (patterns.has(sequence)) {
          const pattern = patterns.get(sequence)!;
          pattern.frequency++;
          pattern.lastOccurrence = interactions[i].timestamp;
        } else {
          patterns.set(sequence, {
            userId,
            pattern: sequence,
            frequency: 1,
            lastOccurrence: interactions[i].timestamp,
            context: {
              targets: [
                interactions[i].target,
                interactions[i + 1].target,
                interactions[i + 2].target
              ]
            }
          });
        }
      }

      return Array.from(patterns.values())
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10);
    } catch (error) {
      console.error('Error identifying usage patterns:', error);
      return [];
    }
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.endSession();
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();