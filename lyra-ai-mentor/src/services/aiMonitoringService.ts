import { getAIConfig, CharacterType } from '@/config/aiConfig';

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

interface RequestMetrics {
  id: string;
  timestamp: number;
  character?: CharacterType;
  component: string;
  usage: TokenUsage;
  responseTime: number;
  success: boolean;
  error?: string;
}

interface DailyUsage {
  date: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  errorRate: number;
}

export class AIMonitoringService {
  private static instance: AIMonitoringService;
  private requests: RequestMetrics[] = [];
  private dailyUsage: Map<string, DailyUsage> = new Map();
  private rateLimitTracker = {
    requestsThisMinute: 0,
    requestsThisHour: 0,
    tokensThisMinute: 0,
    lastMinuteReset: Date.now(),
    lastHourReset: Date.now(),
  };

  private constructor() {
    this.loadStoredData();
    this.startCleanupInterval();
  }

  static getInstance(): AIMonitoringService {
    if (!AIMonitoringService.instance) {
      AIMonitoringService.instance = new AIMonitoringService();
    }
    return AIMonitoringService.instance;
  }

  private loadStoredData(): void {
    try {
      const storedRequests = localStorage.getItem('ai_requests');
      if (storedRequests) {
        this.requests = JSON.parse(storedRequests);
      }

      const storedDaily = localStorage.getItem('ai_daily_usage');
      if (storedDaily) {
        this.dailyUsage = new Map(JSON.parse(storedDaily));
      }
    } catch (error) {
      console.warn('Failed to load AI monitoring data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('ai_requests', JSON.stringify(this.requests.slice(-1000))); // Keep last 1000
      localStorage.setItem('ai_daily_usage', JSON.stringify(Array.from(this.dailyUsage.entries())));
    } catch (error) {
      console.warn('Failed to save AI monitoring data:', error);
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
      this.requests = this.requests.filter(req => req.timestamp > cutoff);

      // Clean up old daily usage (keep 30 days)
      const cutoffDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      for (const [date] of this.dailyUsage) {
        if (date < cutoffDate) {
          this.dailyUsage.delete(date);
        }
      }

      this.saveData();
    }, 60 * 60 * 1000); // Every hour
  }

  private updateRateLimitTracker(): void {
    const now = Date.now();
    
    // Reset counters if needed
    if (now - this.rateLimitTracker.lastMinuteReset > 60000) {
      this.rateLimitTracker.requestsThisMinute = 0;
      this.rateLimitTracker.tokensThisMinute = 0;
      this.rateLimitTracker.lastMinuteReset = now;
    }

    if (now - this.rateLimitTracker.lastHourReset > 3600000) {
      this.rateLimitTracker.requestsThisHour = 0;
      this.rateLimitTracker.lastHourReset = now;
    }
  }

  private estimateCost(usage: TokenUsage): number {
    // GPT-4o pricing (approximate)
    const inputCostPer1K = 0.005; // $0.005 per 1K input tokens
    const outputCostPer1K = 0.015; // $0.015 per 1K output tokens

    const inputCost = (usage.promptTokens / 1000) * inputCostPer1K;
    const outputCost = (usage.completionTokens / 1000) * outputCostPer1K;

    return inputCost + outputCost;
  }

  canMakeRequest(estimatedTokens: number = 800): { allowed: boolean; reason?: string } {
    const config = getAIConfig();
    this.updateRateLimitTracker();

    // Check rate limits
    if (this.rateLimitTracker.requestsThisMinute >= config.RATE_LIMITS.REQUESTS_PER_MINUTE) {
      return { allowed: false, reason: 'Rate limit: too many requests per minute' };
    }

    if (this.rateLimitTracker.requestsThisHour >= config.RATE_LIMITS.REQUESTS_PER_HOUR) {
      return { allowed: false, reason: 'Rate limit: too many requests per hour' };
    }

    if (this.rateLimitTracker.tokensThisMinute + estimatedTokens > config.RATE_LIMITS.TOKENS_PER_MINUTE) {
      return { allowed: false, reason: 'Rate limit: too many tokens per minute' };
    }

    // Check daily cost limit
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = this.dailyUsage.get(today);
    if (todayUsage && todayUsage.totalCost >= config.RATE_LIMITS.COST_LIMIT_PER_DAY) {
      return { allowed: false, reason: 'Daily cost limit exceeded' };
    }

    return { allowed: true };
  }

  recordRequest(
    component: string,
    usage: Partial<TokenUsage>,
    responseTime: number,
    success: boolean,
    character?: CharacterType,
    error?: string
  ): void {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    const fullUsage: TokenUsage = {
      promptTokens: usage.promptTokens || 0,
      completionTokens: usage.completionTokens || 0,
      totalTokens: usage.totalTokens || 0,
      estimatedCost: usage.estimatedCost || this.estimateCost(usage as TokenUsage)
    };

    const request: RequestMetrics = {
      id: `req_${now}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now,
      character,
      component,
      usage: fullUsage,
      responseTime,
      success,
      error
    };

    this.requests.push(request);

    // Update rate limit tracker
    this.rateLimitTracker.requestsThisMinute++;
    this.rateLimitTracker.requestsThisHour++;
    this.rateLimitTracker.tokensThisMinute += fullUsage.totalTokens;

    // Update daily usage
    const existingDaily = this.dailyUsage.get(today) || {
      date: today,
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      errorRate: 0
    };

    const updatedDaily: DailyUsage = {
      ...existingDaily,
      totalRequests: existingDaily.totalRequests + 1,
      totalTokens: existingDaily.totalTokens + fullUsage.totalTokens,
      totalCost: existingDaily.totalCost + fullUsage.estimatedCost,
      errorRate: this.calculateErrorRate(today)
    };

    this.dailyUsage.set(today, updatedDaily);
    this.saveData();
  }

  private calculateErrorRate(date: string): number {
    const dayRequests = this.requests.filter(req => {
      const reqDate = new Date(req.timestamp).toISOString().split('T')[0];
      return reqDate === date;
    });

    if (dayRequests.length === 0) return 0;

    const errors = dayRequests.filter(req => !req.success).length;
    return (errors / dayRequests.length) * 100;
  }

  getUsageStats(): {
    today: DailyUsage;
    thisWeek: { requests: number; tokens: number; cost: number };
    rateLimits: {
      requestsThisMinute: number;
      requestsThisHour: number;
      tokensThisMinute: number;
    };
    topComponents: { component: string; requests: number }[];
    errorRate: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = this.dailyUsage.get(today) || {
      date: today,
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      errorRate: 0
    };

    // Calculate week stats
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekRequests = this.requests.filter(req => req.timestamp > weekAgo);
    const weekTokens = weekRequests.reduce((sum, req) => sum + req.usage.totalTokens, 0);
    const weekCost = weekRequests.reduce((sum, req) => sum + req.usage.estimatedCost, 0);

    // Top components
    const componentCounts = new Map<string, number>();
    weekRequests.forEach(req => {
      componentCounts.set(req.component, (componentCounts.get(req.component) || 0) + 1);
    });

    const topComponents = Array.from(componentCounts.entries())
      .map(([component, requests]) => ({ component, requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);

    // Overall error rate
    const totalRequests = this.requests.length;
    const totalErrors = this.requests.filter(req => !req.success).length;
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

    return {
      today: todayUsage,
      thisWeek: {
        requests: weekRequests.length,
        tokens: weekTokens,
        cost: weekCost
      },
      rateLimits: {
        requestsThisMinute: this.rateLimitTracker.requestsThisMinute,
        requestsThisHour: this.rateLimitTracker.requestsThisHour,
        tokensThisMinute: this.rateLimitTracker.tokensThisMinute
      },
      topComponents,
      errorRate
    };
  }

  getDailyHistory(days: number = 7): DailyUsage[] {
    const history: DailyUsage[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      const usage = this.dailyUsage.get(date) || {
        date,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        errorRate: 0
      };
      history.push(usage);
    }

    return history;
  }

  getCharacterUsage(character: CharacterType): {
    requests: number;
    tokens: number;
    cost: number;
    avgResponseTime: number;
  } {
    const characterRequests = this.requests.filter(req => req.character === character);
    
    return {
      requests: characterRequests.length,
      tokens: characterRequests.reduce((sum, req) => sum + req.usage.totalTokens, 0),
      cost: characterRequests.reduce((sum, req) => sum + req.usage.estimatedCost, 0),
      avgResponseTime: characterRequests.length > 0 
        ? characterRequests.reduce((sum, req) => sum + req.responseTime, 0) / characterRequests.length
        : 0
    };
  }

  exportData(): string {
    return JSON.stringify({
      requests: this.requests,
      dailyUsage: Array.from(this.dailyUsage.entries()),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  clearData(): void {
    this.requests = [];
    this.dailyUsage.clear();
    localStorage.removeItem('ai_requests');
    localStorage.removeItem('ai_daily_usage');
  }
}

export const aiMonitoringService = AIMonitoringService.getInstance();