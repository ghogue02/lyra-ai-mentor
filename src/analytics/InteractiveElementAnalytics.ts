import { supabase } from '@/integrations/supabase/client';

export interface ElementEvent {
  elementId: number;
  elementType: string;
  lessonId: number;
  userId: string;
  eventType: ElementEventType;
  eventData?: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

export enum ElementEventType {
  // Lifecycle events
  ELEMENT_LOADED = 'element_loaded',
  ELEMENT_STARTED = 'element_started',
  ELEMENT_COMPLETED = 'element_completed',
  ELEMENT_ABANDONED = 'element_abandoned',
  
  // Phase tracking
  PHASE_STARTED = 'phase_started',
  PHASE_COMPLETED = 'phase_completed',
  
  // Interaction events
  USER_INTERACTION = 'user_interaction',
  INPUT_SUBMITTED = 'input_submitted',
  OPTION_SELECTED = 'option_selected',
  RETRY_ATTEMPTED = 'retry_attempted',
  
  // Error events
  ERROR_OCCURRED = 'error_occurred',
  VALIDATION_FAILED = 'validation_failed',
  
  // Engagement events
  TIME_SPENT_UPDATE = 'time_spent_update',
  HELP_REQUESTED = 'help_requested',
  HINT_VIEWED = 'hint_viewed'
}

export interface ElementAnalytics {
  elementId: number;
  elementType: string;
  lessonId: number;
  userId: string;
  
  // Completion metrics
  startCount: number;
  completionCount: number;
  abandonmentCount: number;
  completionRate: number;
  
  // Time metrics
  totalTimeSpent: number; // in seconds
  averageTimeSpent: number;
  minTimeSpent: number;
  maxTimeSpent: number;
  
  // Interaction metrics
  totalInteractions: number;
  retryCount: number;
  errorCount: number;
  hintViewCount: number;
  helpRequestCount: number;
  
  // Phase metrics (for multi-phase elements)
  phaseCompletions: Record<string, number>;
  averagePhaseTime: Record<string, number>;
  
  // Last updated
  lastUpdated: string;
}

export interface ABTestVariant {
  variantId: string;
  elementId: number;
  variantName: string;
  configuration: Record<string, any>;
  weight: number; // Distribution weight (0-1)
  isActive: boolean;
}

export interface ABTestResult {
  variantId: string;
  elementId: number;
  sampleSize: number;
  completionRate: number;
  averageTimeSpent: number;
  engagementScore: number;
  statisticalSignificance: number;
}

class InteractiveElementAnalyticsService {
  private sessionId: string;
  private eventQueue: ElementEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private consentGranted: boolean = false;
  private activeTimers: Map<string, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.checkConsent();
    this.startEventFlushInterval();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private checkConsent(): void {
    // Check if user has granted analytics consent
    const consent = localStorage.getItem('analytics_consent');
    this.consentGranted = consent === 'granted';
  }

  public setConsent(granted: boolean): void {
    this.consentGranted = granted;
    localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
    
    if (!granted) {
      // Clear any queued events if consent is revoked
      this.eventQueue = [];
    }
  }

  private startEventFlushInterval(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000);
  }

  public async trackEvent(
    elementId: number,
    elementType: string,
    lessonId: number,
    userId: string,
    eventType: ElementEventType,
    eventData?: Record<string, any>
  ): Promise<void> {
    if (!this.consentGranted) return;

    const event: ElementEvent = {
      elementId,
      elementType,
      lessonId,
      userId,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.eventQueue.push(event);

    // Flush immediately for critical events
    if ([ElementEventType.ELEMENT_COMPLETED, ElementEventType.ERROR_OCCURRED].includes(eventType)) {
      await this.flushEvents();
    }
  }

  public startTimeTracking(elementId: number, phase?: string): void {
    const key = phase ? `${elementId}_${phase}` : `${elementId}`;
    this.activeTimers.set(key, Date.now());
  }

  public stopTimeTracking(elementId: number, phase?: string): number {
    const key = phase ? `${elementId}_${phase}` : `${elementId}`;
    const startTime = this.activeTimers.get(key);
    
    if (!startTime) return 0;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    this.activeTimers.delete(key);
    
    return timeSpent;
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.consentGranted) return;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const { error } = await supabase
        .from('element_analytics_events')
        .insert(eventsToFlush);

      if (error) {
        console.error('Failed to flush analytics events:', error);
        // Re-queue events on failure
        this.eventQueue.unshift(...eventsToFlush);
      }
    } catch (error) {
      console.error('Error flushing analytics events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...eventsToFlush);
    }
  }

  public async getElementAnalytics(
    elementId: number,
    userId?: string
  ): Promise<ElementAnalytics | null> {
    try {
      let query = supabase
        .from('element_analytics_summary')
        .select('*')
        .eq('element_id', elementId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching element analytics:', error);
        return null;
      }

      return data as ElementAnalytics;
    } catch (error) {
      console.error('Error fetching element analytics:', error);
      return null;
    }
  }

  public async getEngagementMetrics(
    lessonId: number,
    dateRange?: { start: Date; end: Date }
  ): Promise<any> {
    try {
      let query = supabase
        .from('element_analytics_summary')
        .select('*')
        .eq('lesson_id', lessonId);

      if (dateRange) {
        query = query
          .gte('last_updated', dateRange.start.toISOString())
          .lte('last_updated', dateRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching engagement metrics:', error);
        return null;
      }

      // Calculate aggregate metrics
      const metrics = {
        totalElements: data.length,
        averageCompletionRate: data.reduce((sum, el) => sum + el.completion_rate, 0) / data.length,
        mostEngaging: data.sort((a, b) => b.total_interactions - a.total_interactions)[0],
        leastEngaging: data.sort((a, b) => a.total_interactions - b.total_interactions)[0],
        commonFailurePoints: data.filter(el => el.error_count > 0).sort((a, b) => b.error_count - a.error_count).slice(0, 5)
      };

      return metrics;
    } catch (error) {
      console.error('Error calculating engagement metrics:', error);
      return null;
    }
  }

  public async createABTest(
    elementId: number,
    variants: Omit<ABTestVariant, 'variantId' | 'isActive'>[]
  ): Promise<ABTestVariant[]> {
    try {
      const abTestVariants: ABTestVariant[] = variants.map(variant => ({
        ...variant,
        variantId: `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        elementId,
        isActive: true
      }));

      const { data, error } = await supabase
        .from('ab_test_variants')
        .insert(abTestVariants)
        .select();

      if (error) {
        console.error('Error creating A/B test:', error);
        return [];
      }

      return data as ABTestVariant[];
    } catch (error) {
      console.error('Error creating A/B test:', error);
      return [];
    }
  }

  public async getABTestResults(elementId: number): Promise<ABTestResult[]> {
    try {
      const { data, error } = await supabase
        .from('ab_test_results')
        .select('*')
        .eq('element_id', elementId);

      if (error) {
        console.error('Error fetching A/B test results:', error);
        return [];
      }

      return data as ABTestResult[];
    } catch (error) {
      console.error('Error fetching A/B test results:', error);
      return [];
    }
  }

  public async getABTestVariants(elementId: number): Promise<ABTestVariant[]> {
    try {
      const { data, error } = await supabase
        .from('ab_test_variants')
        .select('*')
        .eq('element_id', elementId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching A/B test variants:', error);
        return [];
      }

      return data as ABTestVariant[];
    } catch (error) {
      console.error('Error fetching A/B test variants:', error);
      return [];
    }
  }

  public selectABTestVariant(variants: ABTestVariant[]): ABTestVariant {
    // Weighted random selection
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of variants) {
      random -= variant.weight;
      if (random <= 0) {
        return variant;
      }
    }
    
    return variants[0]; // Fallback
  }

  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
  }
}

// Export singleton instance
export const analyticsService = new InteractiveElementAnalyticsService();

// Export convenient tracking functions
export const trackElementEvent = (
  elementId: number,
  elementType: string,
  lessonId: number,
  userId: string,
  eventType: ElementEventType,
  eventData?: Record<string, any>
) => analyticsService.trackEvent(elementId, elementType, lessonId, userId, eventType, eventData);

export const startTimeTracking = (elementId: number, phase?: string) => 
  analyticsService.startTimeTracking(elementId, phase);

export const stopTimeTracking = (elementId: number, phase?: string) => 
  analyticsService.stopTimeTracking(elementId, phase);

export const setAnalyticsConsent = (granted: boolean) => 
  analyticsService.setConsent(granted);