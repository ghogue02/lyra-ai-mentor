import { aiService, AIRequest, AIResponse } from './aiService';
import { aiMonitoringService } from './aiMonitoringService';
import { getAIConfig, CharacterType } from '@/config/aiConfig';

// Optimized AI Service with better caching and performance
export class OptimizedAIService {
  private static instance: OptimizedAIService;
  private cache = new Map<string, { response: string; timestamp: number; hits: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_CACHE_SIZE = 100;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private readonly MAX_CONCURRENT_REQUESTS = 3;
  private activeRequests = 0;

  private constructor() {
    // Periodic cache cleanup
    setInterval(() => this.cleanupCache(), 60 * 1000); // Every minute
  }

  static getInstance(): OptimizedAIService {
    if (!OptimizedAIService.instance) {
      OptimizedAIService.instance = new OptimizedAIService();
    }
    return OptimizedAIService.instance;
  }

  private getCacheKey(prompt: string, context: string): string {
    // More efficient cache key generation
    const hash = this.simpleHash(`${prompt}-${context}`);
    return `ai-${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private getCachedResponse(cacheKey: string): string | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    // Update hit count for LRU
    cached.hits++;
    return cached.response;
  }

  private setCachedResponse(cacheKey: string, response: string): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Find and remove least recently used item
      let lruKey = '';
      let minHits = Infinity;
      let oldestTime = Date.now();
      
      this.cache.forEach((value, key) => {
        const score = value.hits * 1000 + (Date.now() - value.timestamp);
        if (score < minHits * 1000 + (Date.now() - oldestTime)) {
          lruKey = key;
          minHits = value.hits;
          oldestTime = value.timestamp;
        }
      });
      
      if (lruKey) {
        this.cache.delete(lruKey);
      }
    }

    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now(),
      hits: 0
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  async makeAIRequest(
    prompt: string,
    systemMessage: string,
    component: string,
    character?: CharacterType,
    options: {
      temperature?: number;
      maxTokens?: number;
      useCache?: boolean;
      priority?: 'high' | 'normal' | 'low';
    } = {}
  ): Promise<string> {
    const { useCache = true, priority = 'normal' } = options;
    
    // Check cache first
    if (useCache) {
      const cacheKey = this.getCacheKey(prompt, systemMessage);
      const cached = this.getCachedResponse(cacheKey);
      if (cached) {
        console.debug(`🎯 Cache hit for ${component}`);
        return cached;
      }
    }

    // Queue request based on priority
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        try {
          this.activeRequests++;
          const response = await this.executeRequest(
            prompt,
            systemMessage,
            component,
            character,
            options
          );
          
          if (useCache) {
            const cacheKey = this.getCacheKey(prompt, systemMessage);
            this.setCachedResponse(cacheKey, response);
          }
          
          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (priority === 'high' || this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
        executeRequest();
      } else {
        // Add to queue based on priority
        if (priority === 'low') {
          this.requestQueue.push(executeRequest);
        } else {
          this.requestQueue.unshift(executeRequest);
        }
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    if (this.activeRequests >= this.MAX_CONCURRENT_REQUESTS) return;

    this.isProcessing = true;
    
    while (this.requestQueue.length > 0 && this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
      const request = this.requestQueue.shift();
      if (request) {
        request();
      }
    }
    
    this.isProcessing = false;
  }

  private async executeRequest(
    prompt: string,
    systemMessage: string,
    component: string,
    character?: CharacterType,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const config = getAIConfig();
    const startTime = performance.now();

    // Check rate limits
    const canRequest = aiMonitoringService.canMakeRequest(
      options.maxTokens || config.DEFAULTS.MAX_TOKENS
    );
    
    if (!canRequest.allowed) {
      throw new Error(canRequest.reason || 'Request not allowed');
    }

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: options.temperature || config.DEFAULTS.TEMPERATURE,
        maxTokens: options.maxTokens || config.DEFAULTS.MAX_TOKENS,
        model: character 
          ? config.CHARACTERS[character].model || config.MODELS.TEXT_GENERATION 
          : config.MODELS.TEXT_GENERATION,
        cache: true
      });

      const responseTime = performance.now() - startTime;

      // Record metrics
      aiMonitoringService.recordRequest(
        component,
        response.usage || {
          promptTokens: Math.ceil(prompt.length / 4),
          completionTokens: Math.ceil(response.content.length / 4),
          totalTokens: Math.ceil((prompt.length + response.content.length) / 4),
          estimatedCost: 0
        },
        responseTime,
        true,
        character
      );

      return response.content;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      aiMonitoringService.recordRequest(
        component,
        { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
        responseTime,
        false,
        character,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      throw error;
    }
  }

  // Batch processing for multiple requests
  async batchRequests(
    requests: Array<{
      prompt: string;
      systemMessage: string;
      component: string;
      character?: CharacterType;
      options?: any;
    }>
  ): Promise<string[]> {
    // Process in chunks to avoid overwhelming the API
    const chunkSize = 3;
    const results: string[] = [];
    
    for (let i = 0; i < requests.length; i += chunkSize) {
      const chunk = requests.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(req => 
          this.makeAIRequest(
            req.prompt,
            req.systemMessage,
            req.component,
            req.character,
            req.options
          )
        )
      );
      results.push(...chunkResults);
    }
    
    return results;
  }

  // Preload common requests
  async preloadCommonRequests(character: CharacterType): Promise<void> {
    const config = getAIConfig();
    const commonPrompts = config.CHARACTERS[character].commonPrompts || [];
    
    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window && commonPrompts.length > 0) {
      requestIdleCallback(() => {
        commonPrompts.forEach(prompt => {
          this.makeAIRequest(
            prompt,
            config.CHARACTERS[character].systemMessage,
            `${character}-preload`,
            character,
            { priority: 'low', useCache: true }
          ).catch(() => {}); // Ignore preload errors
        });
      });
    }
  }

  // Get cache statistics
  getCacheStats(): {
    size: number;
    hits: number;
    maxSize: number;
    oldestEntry: number | null;
  } {
    let totalHits = 0;
    let oldestTimestamp = Date.now();
    
    this.cache.forEach(value => {
      totalHits += value.hits;
      if (value.timestamp < oldestTimestamp) {
        oldestTimestamp = value.timestamp;
      }
    });
    
    return {
      size: this.cache.size,
      hits: totalHits,
      maxSize: this.MAX_CACHE_SIZE,
      oldestEntry: this.cache.size > 0 ? Date.now() - oldestTimestamp : null
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const optimizedAIService = OptimizedAIService.getInstance();