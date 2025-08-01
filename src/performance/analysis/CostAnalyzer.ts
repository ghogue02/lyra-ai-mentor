/**
 * GPT-4.1 Cost Analysis System
 * Monitors token usage and provides cost optimization insights
 */

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
  model: string;
  context: string;
}

export interface CostMetrics {
  totalCost: number;
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  averageCostPerRequest: number;
  tokenEfficiency: number;
  budgetUtilization: number;
}

export interface PricingTier {
  model: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextLimit: number;
  outputLimit: number;
}

export class CostAnalyzer {
  private usageHistory: TokenUsage[] = [];
  private readonly pricingTiers: Map<string, PricingTier> = new Map();

  constructor() {
    // GPT-4.1 pricing configuration
    this.pricingTiers.set('gpt-4.1', {
      model: 'gpt-4.1',
      inputPricePerMillion: 2.0,  // $2 per 1M input tokens
      outputPricePerMillion: 8.0, // $8 per 1M output tokens
      contextLimit: 1000000,      // 1M token context
      outputLimit: 32767          // 32,767 max output tokens
    });

    // Legacy GPT-4 for comparison
    this.pricingTiers.set('gpt-4', {
      model: 'gpt-4',
      inputPricePerMillion: 30.0,  // $30 per 1M input tokens
      outputPricePerMillion: 60.0, // $60 per 1M output tokens
      contextLimit: 128000,        // 128k context
      outputLimit: 4096            // 4k max output tokens
    });
  }

  /**
   * Calculate cost for a specific request
   */
  calculateRequestCost(
    inputTokens: number,
    outputTokens: number,
    model: string = 'gpt-4.1'
  ): number {
    const pricing = this.pricingTiers.get(model);
    if (!pricing) {
      throw new Error(`Unknown model: ${model}`);
    }

    const inputCost = (inputTokens / 1000000) * pricing.inputPricePerMillion;
    const outputCost = (outputTokens / 1000000) * pricing.outputPricePerMillion;
    
    return inputCost + outputCost;
  }

  /**
   * Log token usage for analysis
   */
  logUsage(usage: Omit<TokenUsage, 'cost' | 'totalTokens'>): void {
    const cost = this.calculateRequestCost(
      usage.inputTokens,
      usage.outputTokens,
      usage.model
    );

    const tokenUsage: TokenUsage = {
      ...usage,
      totalTokens: usage.inputTokens + usage.outputTokens,
      cost,
    };

    this.usageHistory.push(tokenUsage);
    
    // Keep only last 10,000 entries for performance
    if (this.usageHistory.length > 10000) {
      this.usageHistory = this.usageHistory.slice(-10000);
    }
  }

  /**
   * Get comprehensive cost metrics
   */
  getCostMetrics(timeframe: 'day' | 'week' | 'month' = 'day'): CostMetrics {
    const now = new Date();
    const cutoffTime = new Date();

    switch (timeframe) {
      case 'day':
        cutoffTime.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffTime.setMonth(now.getMonth() - 1);
        break;
    }

    const recentUsage = this.usageHistory.filter(
      usage => usage.timestamp >= cutoffTime
    );

    const totalCost = recentUsage.reduce((sum, usage) => sum + usage.cost, 0);
    const totalTokens = recentUsage.reduce((sum, usage) => sum + usage.totalTokens, 0);
    const requestCount = recentUsage.length;

    return {
      totalCost,
      dailyCost: timeframe === 'day' ? totalCost : totalCost / 30,
      weeklyCost: timeframe === 'week' ? totalCost : totalCost / (30/7),
      monthlyCost: timeframe === 'month' ? totalCost : totalCost * 30,
      averageCostPerRequest: requestCount > 0 ? totalCost / requestCount : 0,
      tokenEfficiency: totalTokens > 0 ? totalCost / (totalTokens / 1000) : 0,
      budgetUtilization: 0 // To be set based on budget configuration
    };
  }

  /**
   * Compare costs between models
   */
  compareModelCosts(
    inputTokens: number,
    outputTokens: number,
    models: string[] = ['gpt-4.1', 'gpt-4']
  ): Map<string, number> {
    const comparison = new Map<string, number>();
    
    models.forEach(model => {
      try {
        const cost = this.calculateRequestCost(inputTokens, outputTokens, model);
        comparison.set(model, cost);
      } catch (error) {
        console.warn(`Could not calculate cost for model ${model}:`, error);
      }
    });

    return comparison;
  }

  /**
   * Forecast monthly budget based on current usage
   */
  forecastMonthlyBudget(currentMonthlyBudget?: number): {
    projectedCost: number;
    budgetStatus: 'under' | 'over' | 'approaching';
    daysRemaining: number;
    recommendedDailyLimit: number;
  } {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysElapsed = Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - daysElapsed;

    const monthToDateUsage = this.usageHistory.filter(
      usage => usage.timestamp >= startOfMonth
    );

    const currentMonthlyCost = monthToDateUsage.reduce(
      (sum, usage) => sum + usage.cost, 0
    );

    const dailyAverage = currentMonthlyCost / daysElapsed;
    const projectedCost = dailyAverage * daysInMonth;

    let budgetStatus: 'under' | 'over' | 'approaching' = 'under';
    if (currentMonthlyBudget) {
      if (projectedCost > currentMonthlyBudget) {
        budgetStatus = 'over';
      } else if (projectedCost > currentMonthlyBudget * 0.8) {
        budgetStatus = 'approaching';
      }
    }

    return {
      projectedCost,
      budgetStatus,
      daysRemaining,
      recommendedDailyLimit: currentMonthlyBudget 
        ? (currentMonthlyBudget - currentMonthlyCost) / daysRemaining 
        : dailyAverage
    };
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const recentMetrics = this.getCostMetrics('week');
    
    if (recentMetrics.averageCostPerRequest > 0.01) {
      recommendations.push(
        'Consider implementing response caching for repeated queries'
      );
    }

    const gpt41Usage = this.usageHistory.filter(u => u.model === 'gpt-4.1');
    const avgContextSize = gpt41Usage.length > 0 
      ? gpt41Usage.reduce((sum, u) => sum + u.inputTokens, 0) / gpt41Usage.length 
      : 0;

    if (avgContextSize > 500000) {
      recommendations.push(
        'Context size is large - consider context compression techniques'
      );
    }

    if (avgContextSize < 100000) {
      recommendations.push(
        'Good context efficiency - you\'re utilizing GPT-4.1\'s 1M context well'
      );
    }

    return recommendations;
  }

  /**
   * Export usage data for analysis
   */
  exportUsageData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = 'timestamp,model,inputTokens,outputTokens,totalTokens,cost,context';
      const rows = this.usageHistory.map(usage => 
        `${usage.timestamp.toISOString()},${usage.model},${usage.inputTokens},${usage.outputTokens},${usage.totalTokens},${usage.cost.toFixed(6)},${usage.context}`
      );
      return [headers, ...rows].join('\n');
    }

    return JSON.stringify(this.usageHistory, null, 2);
  }
}