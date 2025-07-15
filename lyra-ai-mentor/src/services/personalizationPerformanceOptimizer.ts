import { 
  PersonalizationContext,
  ChoiceStep,
  LearningPatterns,
  PersonalizationPreferences
} from './systemPersonalizationService';

// =============================================================================
// PERFORMANCE OPTIMIZATION INTERFACES
// =============================================================================

interface PerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  storageOperationsPerSecond: number;
  predictionAccuracy: number;
  adaptationEffectiveness: number;
}

interface OptimizationStrategy {
  cachingStrategy: 'aggressive' | 'moderate' | 'minimal';
  predictionFrequency: 'realtime' | 'periodic' | 'ondemand';
  storageSync: 'immediate' | 'batched' | 'delayed';
  patternAnalysis: 'continuous' | 'scheduled' | 'triggered';
}

interface CacheConfiguration {
  maxEntries: number;
  ttl: number; // Time to live in milliseconds
  strategy: 'LRU' | 'LFU' | 'FIFO';
  compressionEnabled: boolean;
  persistToDisk: boolean;
}

// =============================================================================
// ADVANCED CACHING SYSTEM
// =============================================================================

class AdvancedCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number; accessCount: number; size: number }>();
  private accessOrder: K[] = [];
  private totalSize = 0;
  
  constructor(private config: CacheConfiguration) {}
  
  set(key: K, value: V): void {
    const size = this.calculateSize(value);
    const entry = {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      size
    };
    
    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.totalSize -= existing.size;
      this.removeFromAccessOrder(key);
    }
    
    // Check if we need to evict entries
    while (this.cache.size >= this.config.maxEntries || 
           (this.totalSize + size) > this.getMaxSize()) {
      this.evictEntry();
    }
    
    this.cache.set(key, entry);
    this.totalSize += size;
    this.updateAccessOrder(key);
  }
  
  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.delete(key);
      return undefined;
    }
    
    // Update access statistics
    entry.accessCount++;
    this.updateAccessOrder(key);
    
    return entry.value;
  }
  
  delete(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    this.cache.delete(key);
    this.totalSize -= entry.size;
    this.removeFromAccessOrder(key);
    
    return true;
  }
  
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.totalSize = 0;
  }
  
  getStats(): {
    size: number;
    totalMemory: number;
    hitRate: number;
    averageAccessCount: number;
  } {
    const entries = Array.from(this.cache.values());
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    
    return {
      size: this.cache.size,
      totalMemory: this.totalSize,
      hitRate: entries.length > 0 ? totalAccess / entries.length : 0,
      averageAccessCount: entries.length > 0 ? totalAccess / entries.length : 0
    };
  }
  
  private evictEntry(): void {
    let keyToEvict: K | undefined;
    
    switch (this.config.strategy) {
      case 'LRU':
        keyToEvict = this.accessOrder[0];
        break;
      case 'LFU':
        keyToEvict = this.findLeastFrequentlyUsed();
        break;
      case 'FIFO':
        keyToEvict = this.accessOrder[0];
        break;
    }
    
    if (keyToEvict !== undefined) {
      this.delete(keyToEvict);
    }
  }
  
  private findLeastFrequentlyUsed(): K | undefined {
    let minAccessCount = Infinity;
    let leastUsedKey: K | undefined;
    
    for (const [key, entry] of this.cache) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        leastUsedKey = key;
      }
    }
    
    return leastUsedKey;
  }
  
  private updateAccessOrder(key: K): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }
  
  private removeFromAccessOrder(key: K): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
  
  private calculateSize(value: V): number {
    // Simple size estimation - in production, use more sophisticated calculation
    return JSON.stringify(value).length;
  }
  
  private getMaxSize(): number {
    // 10MB default max cache size
    return 10 * 1024 * 1024;
  }
}

// =============================================================================
// BATCH OPERATION MANAGER
// =============================================================================

class BatchOperationManager {
  private operationQueue: Array<{
    id: string;
    operation: () => Promise<any>;
    priority: 'high' | 'medium' | 'low';
    timestamp: number;
    retryCount: number;
    maxRetries: number;
  }> = [];
  
  private isProcessing = false;
  private batchInterval: NodeJS.Timeout | null = null;
  
  constructor(
    private batchSize: number = 10,
    private batchIntervalMs: number = 1000,
    private maxRetries: number = 3
  ) {
    this.startBatchProcessing();
  }
  
  addOperation(
    id: string,
    operation: () => Promise<any>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    this.operationQueue.push({
      id,
      operation,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: this.maxRetries
    });
    
    // Sort by priority and timestamp
    this.operationQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp;
    });
  }
  
  private startBatchProcessing(): void {
    this.batchInterval = setInterval(() => {
      if (!this.isProcessing && this.operationQueue.length > 0) {
        this.processBatch();
      }
    }, this.batchIntervalMs);
  }
  
  private async processBatch(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      const batch = this.operationQueue.splice(0, this.batchSize);
      const promises = batch.map(async (item) => {
        try {
          await item.operation();
        } catch (error) {
          console.error(`Batch operation ${item.id} failed:`, error);
          
          // Retry if under max retries
          if (item.retryCount < item.maxRetries) {
            item.retryCount++;
            this.operationQueue.push(item);
          }
        }
      });
      
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  getQueueSize(): number {
    return this.operationQueue.length;
  }
  
  getStats(): {
    queueSize: number;
    isProcessing: boolean;
    averageWaitTime: number;
  } {
    const now = Date.now();
    const averageWaitTime = this.operationQueue.length > 0
      ? this.operationQueue.reduce((sum, op) => sum + (now - op.timestamp), 0) / this.operationQueue.length
      : 0;
    
    return {
      queueSize: this.operationQueue.length,
      isProcessing: this.isProcessing,
      averageWaitTime
    };
  }
  
  destroy(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
  }
}

// =============================================================================
// PREDICTIVE PRELOADER
// =============================================================================

class PredictivePreloader {
  private preloadCache = new Map<string, any>();
  private predictionModel: Map<string, { nextItems: string[]; confidence: number }> = new Map();
  
  constructor(
    private maxPreloadItems: number = 50,
    private confidenceThreshold: number = 0.7
  ) {}
  
  recordAccess(userId: string, itemId: string, context: any): void {
    const key = `${userId}_${itemId}`;
    const existing = this.predictionModel.get(key);
    
    if (existing) {
      // Update prediction model
      this.updatePredictionModel(key, context);
    } else {
      // Initialize prediction model
      this.predictionModel.set(key, {
        nextItems: [],
        confidence: 0.1
      });
    }
  }
  
  async preloadPredictedItems(
    userId: string,
    currentItemId: string,
    loadFunction: (itemId: string) => Promise<any>
  ): Promise<void> {
    const key = `${userId}_${currentItemId}`;
    const predictions = this.predictionModel.get(key);
    
    if (!predictions || predictions.confidence < this.confidenceThreshold) {
      return;
    }
    
    const preloadPromises = predictions.nextItems
      .slice(0, 5) // Limit preload count
      .map(async (itemId) => {
        const cacheKey = `preload_${userId}_${itemId}`;
        
        if (!this.preloadCache.has(cacheKey)) {
          try {
            const data = await loadFunction(itemId);
            this.preloadCache.set(cacheKey, {
              data,
              timestamp: Date.now()
            });
          } catch (error) {
            console.error(`Preload failed for ${itemId}:`, error);
          }
        }
      });
    
    await Promise.all(preloadPromises);
    
    // Cleanup old preloaded items
    this.cleanupPreloadCache();
  }
  
  getPreloadedItem(userId: string, itemId: string): any | null {
    const cacheKey = `preload_${userId}_${itemId}`;
    const cached = this.preloadCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes TTL
      return cached.data;
    }
    
    return null;
  }
  
  private updatePredictionModel(key: string, context: any): void {
    // Simplified prediction model update
    // In production, this would use sophisticated ML algorithms
    const prediction = this.predictionModel.get(key)!;
    prediction.confidence = Math.min(0.95, prediction.confidence + 0.1);
    
    // Add next item based on context
    if (context.nextItemId && !prediction.nextItems.includes(context.nextItemId)) {
      prediction.nextItems.push(context.nextItemId);
      
      // Keep only top predictions
      if (prediction.nextItems.length > 10) {
        prediction.nextItems = prediction.nextItems.slice(-10);
      }
    }
  }
  
  private cleanupPreloadCache(): void {
    if (this.preloadCache.size <= this.maxPreloadItems) return;
    
    const now = Date.now();
    const entries = Array.from(this.preloadCache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest entries
    const itemsToRemove = entries.slice(0, entries.length - this.maxPreloadItems);
    itemsToRemove.forEach(([key]) => this.preloadCache.delete(key));
  }
  
  getStats(): {
    cacheSize: number;
    modelSize: number;
    averageConfidence: number;
  } {
    const confidences = Array.from(this.predictionModel.values()).map(p => p.confidence);
    const averageConfidence = confidences.length > 0 
      ? confidences.reduce((sum, c) => sum + c, 0) / confidences.length 
      : 0;
    
    return {
      cacheSize: this.preloadCache.size,
      modelSize: this.predictionModel.size,
      averageConfidence
    };
  }
}

// =============================================================================
// PERFORMANCE OPTIMIZER MAIN CLASS
// =============================================================================

export class PersonalizationPerformanceOptimizer {
  private cache: AdvancedCache<string, any>;
  private batchManager: BatchOperationManager;
  private preloader: PredictivePreloader;
  private metrics: PerformanceMetrics;
  private strategy: OptimizationStrategy;
  
  constructor(
    cacheConfig: Partial<CacheConfiguration> = {},
    optimizationStrategy: Partial<OptimizationStrategy> = {}
  ) {
    this.cache = new AdvancedCache({
      maxEntries: 1000,
      ttl: 300000, // 5 minutes
      strategy: 'LRU',
      compressionEnabled: true,
      persistToDisk: false,
      ...cacheConfig
    });
    
    this.batchManager = new BatchOperationManager();
    this.preloader = new PredictivePreloader();
    
    this.strategy = {
      cachingStrategy: 'moderate',
      predictionFrequency: 'periodic',
      storageSync: 'batched',
      patternAnalysis: 'scheduled',
      ...optimizationStrategy
    };
    
    this.metrics = {
      cacheHitRate: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      storageOperationsPerSecond: 0,
      predictionAccuracy: 0,
      adaptationEffectiveness: 0
    };
    
    this.initializePerformanceMonitoring();
  }
  
  // =============================================================================
  // CACHING OPERATIONS
  // =============================================================================
  
  getCachedPersonalizationContext(userId: string, sessionId: string): PersonalizationContext | null {
    const key = `context_${userId}_${sessionId}`;
    return this.cache.get(key) || null;
  }
  
  setCachedPersonalizationContext(
    userId: string, 
    sessionId: string, 
    context: PersonalizationContext
  ): void {
    const key = `context_${userId}_${sessionId}`;
    this.cache.set(key, context);
  }
  
  getCachedChoices(userId: string, sessionId: string): ChoiceStep[] | null {
    const key = `choices_${userId}_${sessionId}`;
    return this.cache.get(key) || null;
  }
  
  setCachedChoices(userId: string, sessionId: string, choices: ChoiceStep[]): void {
    const key = `choices_${userId}_${sessionId}`;
    this.cache.set(key, choices);
  }
  
  getCachedPatterns(userId: string): LearningPatterns | null {
    const key = `patterns_${userId}`;
    return this.cache.get(key) || null;
  }
  
  setCachedPatterns(userId: string, patterns: LearningPatterns): void {
    const key = `patterns_${userId}`;
    this.cache.set(key, patterns);
  }
  
  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================
  
  batchStorageOperation(
    operationId: string,
    operation: () => Promise<any>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    this.batchManager.addOperation(operationId, operation, priority);
  }
  
  // =============================================================================
  // PREDICTIVE OPERATIONS
  // =============================================================================
  
  recordPersonalizationAccess(
    userId: string,
    contentId: string,
    context: any
  ): void {
    this.preloader.recordAccess(userId, contentId, context);
  }
  
  async preloadPersonalizationData(
    userId: string,
    currentContentId: string,
    loadFunction: (contentId: string) => Promise<any>
  ): Promise<void> {
    return this.preloader.preloadPredictedItems(userId, currentContentId, loadFunction);
  }
  
  getPreloadedPersonalizationData(userId: string, contentId: string): any | null {
    return this.preloader.getPreloadedItem(userId, contentId);
  }
  
  // =============================================================================
  // OPTIMIZATION STRATEGIES
  // =============================================================================
  
  optimizeForUser(userPatterns: LearningPatterns): OptimizationStrategy {
    // Dynamic optimization based on user patterns
    const strategy: OptimizationStrategy = { ...this.strategy };
    
    // Adjust caching strategy based on user activity
    if (userPatterns.sessionLengthPattern === 'short-bursts') {
      strategy.cachingStrategy = 'aggressive';
      strategy.predictionFrequency = 'realtime';
    } else if (userPatterns.sessionLengthPattern === 'long-focus') {
      strategy.cachingStrategy = 'moderate';
      strategy.predictionFrequency = 'periodic';
    }
    
    // Adjust storage sync based on user engagement
    if (userPatterns.likelihoodToComplete > 0.8) {
      strategy.storageSync = 'immediate';
    } else {
      strategy.storageSync = 'batched';
    }
    
    return strategy;
  }
  
  adjustPerformanceForDevice(deviceType: 'desktop' | 'mobile' | 'tablet'): void {
    switch (deviceType) {
      case 'mobile':
        // Optimize for mobile constraints
        this.strategy.cachingStrategy = 'minimal';
        this.strategy.predictionFrequency = 'ondemand';
        this.strategy.storageSync = 'delayed';
        break;
      case 'tablet':
        // Balanced approach for tablets
        this.strategy.cachingStrategy = 'moderate';
        this.strategy.predictionFrequency = 'periodic';
        this.strategy.storageSync = 'batched';
        break;
      case 'desktop':
        // Full performance for desktop
        this.strategy.cachingStrategy = 'aggressive';
        this.strategy.predictionFrequency = 'realtime';
        this.strategy.storageSync = 'immediate';
        break;
    }
  }
  
  // =============================================================================
  // PERFORMANCE MONITORING
  // =============================================================================
  
  private initializePerformanceMonitoring(): void {
    setInterval(() => {
      this.updateMetrics();
    }, 10000); // Update metrics every 10 seconds
  }
  
  private updateMetrics(): void {
    const cacheStats = this.cache.getStats();
    const batchStats = this.batchManager.getStats();
    const preloadStats = this.preloader.getStats();
    
    this.metrics = {
      cacheHitRate: cacheStats.hitRate,
      averageResponseTime: batchStats.averageWaitTime,
      memoryUsage: cacheStats.totalMemory,
      storageOperationsPerSecond: batchStats.queueSize > 0 ? 1000 / batchStats.averageWaitTime : 0,
      predictionAccuracy: preloadStats.averageConfidence,
      adaptationEffectiveness: this.calculateAdaptationEffectiveness()
    };
  }
  
  private calculateAdaptationEffectiveness(): number {
    // Simplified calculation - in production would use more sophisticated metrics
    return Math.min(0.95, this.metrics.cacheHitRate * this.metrics.predictionAccuracy);
  }
  
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  getPerformanceReport(): {
    metrics: PerformanceMetrics;
    recommendations: string[];
    optimizations: string[];
  } {
    const recommendations: string[] = [];
    const optimizations: string[] = [];
    
    if (this.metrics.cacheHitRate < 0.7) {
      recommendations.push('Consider increasing cache size or TTL');
      optimizations.push('cache_optimization');
    }
    
    if (this.metrics.averageResponseTime > 1000) {
      recommendations.push('Storage operations are slow - consider batch optimization');
      optimizations.push('batch_optimization');
    }
    
    if (this.metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      recommendations.push('Memory usage is high - consider cache cleanup');
      optimizations.push('memory_optimization');
    }
    
    if (this.metrics.predictionAccuracy < 0.5) {
      recommendations.push('Prediction model needs improvement');
      optimizations.push('prediction_optimization');
    }
    
    return {
      metrics: this.metrics,
      recommendations,
      optimizations
    };
  }
  
  // =============================================================================
  // CLEANUP AND MAINTENANCE
  // =============================================================================
  
  performMaintenance(): void {
    // Clear expired cache entries
    this.cache.clear();
    
    // Process remaining batch operations
    // (This would be more sophisticated in production)
    
    console.log('Personalization performance maintenance completed');
  }
  
  destroy(): void {
    this.cache.clear();
    this.batchManager.destroy();
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const personalizationPerformanceOptimizer = new PersonalizationPerformanceOptimizer({
  maxEntries: 500,
  ttl: 300000, // 5 minutes
  strategy: 'LRU'
}, {
  cachingStrategy: 'moderate',
  predictionFrequency: 'periodic',
  storageSync: 'batched',
  patternAnalysis: 'scheduled'
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const createOptimizedPersonalizationHook = <T>(
  hookFunction: (...args: any[]) => T,
  cacheKey: string,
  ttl: number = 300000
) => {
  return (...args: any[]): T => {
    const key = `${cacheKey}_${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = personalizationPerformanceOptimizer.cache.get(key);
    if (cached) {
      return cached;
    }
    
    // Execute hook function
    const result = hookFunction(...args);
    
    // Cache the result
    personalizationPerformanceOptimizer.cache.set(key, result);
    
    return result;
  };
};

export const debouncePersonalizationOperation = (
  operation: (...args: any[]) => Promise<any>,
  delay: number = 500
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await operation(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};