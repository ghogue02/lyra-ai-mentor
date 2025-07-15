import { supabase } from '@/integrations/supabase/client';
import OpenAI from 'openai';

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY);
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;
const RATE_LIMIT_REQUESTS = 50;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const CACHE_EXPIRY = 300000; // 5 minutes

// Types
export interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  systemMessage?: string;
  userId?: string;
  cache?: boolean;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  cached?: boolean;
  error?: string;
}

export interface VoiceRequest {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;
  model?: string;
}

export interface TranscriptionRequest {
  audio: File | Blob;
  model?: string;
  language?: string;
  prompt?: string;
}

export interface ImageRequest {
  prompt: string;
  model?: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

export interface APIError {
  code: string;
  message: string;
  type: string;
  retry?: boolean;
  retryAfter?: number;
}

// Available Models
export const OPENAI_MODELS = {
  TEXT: {
    GPT_4_1: 'gpt-4-1106-preview',
    GPT_4_TURBO: 'gpt-4-turbo-preview',
    GPT_4O: 'gpt-4o',
    GPT_4O_MINI: 'gpt-4o-mini',
    GPT_3_5_TURBO: 'gpt-3.5-turbo'
  },
  VOICE: {
    TTS_1: 'tts-1',
    TTS_1_HD: 'tts-1-hd'
  },
  TRANSCRIPTION: {
    WHISPER_1: 'whisper-1'
  },
  IMAGE: {
    DALL_E_3: 'dall-e-3',
    DALL_E_2: 'dall-e-2'
  }
} as const;

// Cache interface
interface CacheEntry {
  response: AIResponse;
  timestamp: number;
  hash: string;
}

export class AIService {
  private static instance: AIService;
  private openai: OpenAI | null = null;
  private requestQueue: (() => Promise<any>)[] = [];
  private isProcessing = false;
  private requestCount = 0;
  private resetTime = Date.now() + RATE_LIMIT_WINDOW;
  private cache = new Map<string, CacheEntry>();
  private requestDeduplication = new Map<string, Promise<AIResponse>>();
  private healthStatus = {
    isHealthy: true,
    lastCheck: Date.now(),
    failureCount: 0,
    lastError: null as string | null
  };

  private constructor() {
    this.initializeOpenAI();
    this.startHealthCheck();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private initializeOpenAI(): void {
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found. Please set OPENAI_API_KEY in environment variables.');
      this.healthStatus.isHealthy = false;
      this.healthStatus.lastError = 'Missing API key';
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Only for development
      });
      this.healthStatus.isHealthy = true;
      this.healthStatus.lastError = null;
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      this.healthStatus.isHealthy = false;
      this.healthStatus.lastError = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  private startHealthCheck(): void {
    setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  private async checkHealth(): Promise<void> {
    if (!this.openai) {
      this.healthStatus.isHealthy = false;
      this.healthStatus.lastError = 'OpenAI client not initialized';
      return;
    }

    try {
      // Simple health check with minimal token usage
      const response = await this.openai.chat.completions.create({
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
        temperature: 0
      });

      this.healthStatus.isHealthy = true;
      this.healthStatus.lastCheck = Date.now();
      this.healthStatus.failureCount = 0;
      this.healthStatus.lastError = null;
    } catch (error) {
      this.healthStatus.isHealthy = false;
      this.healthStatus.failureCount++;
      this.healthStatus.lastError = error instanceof Error ? error.message : 'Unknown error';
      
      // Re-initialize OpenAI client if health check fails multiple times
      if (this.healthStatus.failureCount >= 3) {
        this.initializeOpenAI();
      }
    }
  }

  public getHealthStatus() {
    return { ...this.healthStatus };
  }

  private generateCacheKey(request: AIRequest): string {
    const key = `${request.model || 'default'}-${request.prompt}-${request.context || ''}-${request.temperature || 0.7}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '');
  }

  private getCachedResponse(cacheKey: string): AIResponse | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRY;
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }

    return { ...entry.response, cached: true };
  }

  private setCachedResponse(cacheKey: string, response: AIResponse): void {
    this.cache.set(cacheKey, {
      response: { ...response, cached: false },
      timestamp: Date.now(),
      hash: cacheKey
    });

    // Cleanup old entries
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = MAX_RETRIES
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        if (attempt < maxRetries - 1) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }

  private isNonRetryableError(error: any): boolean {
    const errorMessage = error?.message?.toLowerCase() || '';
    const errorCode = error?.code || '';
    
    // Authentication errors
    if (errorCode === 'invalid_api_key' || errorMessage.includes('authentication')) {
      return true;
    }
    
    // Invalid request errors
    if (errorCode === 'invalid_request_error' || errorMessage.includes('invalid')) {
      return true;
    }
    
    // Quota exceeded (but should retry after some time)
    if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
      return false; // Actually, we should retry these
    }
    
    return false;
  }

  private handleError(error: any): APIError {
    const errorMessage = error?.message || 'Unknown error occurred';
    const errorCode = error?.code || 'unknown_error';
    
    // Rate limit errors
    if (errorMessage.includes('rate limit') || errorCode === 'rate_limit_exceeded') {
      return {
        code: 'rate_limit_exceeded',
        message: 'API rate limit exceeded. Please try again in a moment.',
        type: 'rate_limit',
        retry: true,
        retryAfter: 60000 // 1 minute
      };
    }
    
    // Authentication errors
    if (errorCode === 'invalid_api_key' || errorMessage.includes('authentication')) {
      return {
        code: 'authentication_failed',
        message: 'API authentication failed. Please check your API key.',
        type: 'authentication',
        retry: false
      };
    }
    
    // Quota errors
    if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
      return {
        code: 'quota_exceeded',
        message: 'API quota exceeded. Please check your billing settings.',
        type: 'quota',
        retry: true,
        retryAfter: 3600000 // 1 hour
      };
    }
    
    // Server errors
    if (errorMessage.includes('server') || errorCode.includes('server')) {
      return {
        code: 'server_error',
        message: 'OpenAI server error. Please try again.',
        type: 'server',
        retry: true,
        retryAfter: 5000 // 5 seconds
      };
    }
    
    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return {
        code: 'network_error',
        message: 'Network connection error. Please check your internet connection.',
        type: 'network',
        retry: true,
        retryAfter: 10000 // 10 seconds
      };
    }
    
    // Default error
    return {
      code: 'unknown_error',
      message: `An error occurred: ${errorMessage}`,
      type: 'unknown',
      retry: true,
      retryAfter: 5000
    };
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      // Rate limiting: 50 requests per minute
      if (Date.now() > this.resetTime) {
        this.requestCount = 0;
        this.resetTime = Date.now() + RATE_LIMIT_WINDOW;
      }
      
      if (this.requestCount >= RATE_LIMIT_REQUESTS) {
        // Wait until rate limit resets
        const waitTime = this.resetTime - Date.now();
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          this.requestCount++;
          // Add small delay between requests to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error('Error processing AI request:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    // Check cache first
    if (request.cache !== false) {
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getCachedResponse(cacheKey);
      if (cached) return cached;
    }

    // Check for deduplication
    const dedupeKey = this.generateCacheKey(request);
    const existing = this.requestDeduplication.get(dedupeKey);
    if (existing) return existing;

    // Create new request promise
    const requestPromise = new Promise<AIResponse>((resolve, reject) => {
      const executeRequest = async () => {
        try {
          if (!this.openai) {
            throw new Error('OpenAI client not initialized. Please check your API key.');
          }

          // Direct OpenAI API call
          const completion = await this.retryWithExponentialBackoff(async () => {
            return await this.openai!.chat.completions.create({
              model: request.model || OPENAI_MODELS.TEXT.GPT_4O_MINI,
              messages: [
                {
                  role: 'system',
                  content: request.systemMessage || request.context || 'You are a helpful AI assistant for nonprofit professionals.'
                },
                {
                  role: 'user',
                  content: request.prompt
                }
              ],
              max_tokens: request.maxTokens || 500,
              temperature: request.temperature || 0.7,
              user: request.userId
            });
          });

          const content = completion.choices[0]?.message?.content || '';
          const usage = completion.usage ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens
          } : undefined;

          const response: AIResponse = {
            content,
            usage,
            model: completion.model,
            cached: false
          };

          // Cache the response
          if (request.cache !== false) {
            this.setCachedResponse(dedupeKey, response);
          }

          // Clear deduplication
          this.requestDeduplication.delete(dedupeKey);

          resolve(response);
        } catch (error) {
          // Clear deduplication on error
          this.requestDeduplication.delete(dedupeKey);
          
          const apiError = this.handleError(error);
          reject(new Error(apiError.message));
        }
      };

      this.requestQueue.push(executeRequest);
      this.processQueue();
    });

    // Store in deduplication map
    this.requestDeduplication.set(dedupeKey, requestPromise);

    return requestPromise;
  }

  async streamResponse(
    request: AIRequest,
    onChunk: (chunk: string) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized. Please check your API key.');
      }

      // Direct OpenAI streaming API call
      const stream = await this.retryWithExponentialBackoff(async () => {
        return await this.openai!.chat.completions.create({
          model: request.model || OPENAI_MODELS.TEXT.GPT_4O_MINI,
          messages: [
            {
              role: 'system',
              content: request.systemMessage || request.context || 'You are a helpful AI assistant for nonprofit professionals.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7,
          stream: true,
          user: request.userId
        });
      });

      // Process the streaming response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }

      onComplete?.();
    } catch (error) {
      console.error('Streaming error:', error);
      const apiError = this.handleError(error);
      throw new Error(apiError.message);
    }
  }


  // === TEXT GENERATION METHODS ===
  
  async improveText(text: string, purpose: string): Promise<string> {
    const response = await this.generateResponse({
      prompt: `Improve the following text for ${purpose}. Make it more engaging and professional while maintaining the core message:\n\n${text}`,
      systemMessage: 'You are an expert nonprofit communications specialist with deep experience in crafting compelling, accessible content.',
      model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
      temperature: 0.8,
      maxTokens: 1000
    });
    return response.content;
  }

  async generatePrompt(task: string, details: string): Promise<string> {
    const response = await this.generateResponse({
      prompt: `Create an effective prompt for: ${task}\n\nDetails: ${details}\n\nGenerate a clear, specific prompt that will help achieve this task.`,
      systemMessage: 'You are an expert at crafting effective AI prompts that produce high-quality, specific results.',
      model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
      temperature: 0.7,
      maxTokens: 500
    });
    return response.content;
  }

  async analyzeImpact(before: string, after: string): Promise<string> {
    const response = await this.generateResponse({
      prompt: `Compare these two versions and explain the improvements:\n\nBEFORE:\n${before}\n\nAFTER:\n${after}\n\nHighlight the key improvements and their impact.`,
      systemMessage: 'You are an expert at analyzing communication effectiveness and providing actionable feedback.',
      model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
      temperature: 0.6,
      maxTokens: 800
    });
    return response.content;
  }

  async calculateTimeSaved(task: string, aiApproach: string): Promise<number> {
    const response = await this.generateResponse({
      prompt: `Estimate time saved for this task:\nTask: ${task}\nAI Approach: ${aiApproach}\n\nProvide only a number in minutes.`,
      systemMessage: 'You are an expert at estimating task durations and AI efficiency gains.',
      model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
      temperature: 0.5,
      maxTokens: 50
    });
    
    const minutes = parseInt(response.content.match(/\d+/)?.[0] || '0');
    return isNaN(minutes) ? 0 : minutes;
  }

  // === VOICE SYNTHESIS METHODS ===
  
  async generateSpeech(request: VoiceRequest): Promise<ArrayBuffer> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.retryWithExponentialBackoff(async () => {
        return await this.openai!.audio.speech.create({
          model: request.model || OPENAI_MODELS.VOICE.TTS_1,
          voice: request.voice || 'alloy',
          input: request.text,
          speed: request.speed || 1.0
        });
      });

      return await response.arrayBuffer();
    } catch (error) {
      const apiError = this.handleError(error);
      throw new Error(apiError.message);
    }
  }

  async generateSpeechUrl(request: VoiceRequest): Promise<string> {
    const audioBuffer = await this.generateSpeech(request);
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  // === SPEECH RECOGNITION METHODS ===
  
  async transcribeAudio(request: TranscriptionRequest): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.retryWithExponentialBackoff(async () => {
        return await this.openai!.audio.transcriptions.create({
          file: request.audio,
          model: request.model || OPENAI_MODELS.TRANSCRIPTION.WHISPER_1,
          language: request.language,
          prompt: request.prompt
        });
      });

      return response.text;
    } catch (error) {
      const apiError = this.handleError(error);
      throw new Error(apiError.message);
    }
  }

  // === IMAGE GENERATION METHODS ===
  
  async generateImage(request: ImageRequest): Promise<string[]> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.retryWithExponentialBackoff(async () => {
        return await this.openai!.images.generate({
          model: request.model || OPENAI_MODELS.IMAGE.DALL_E_3,
          prompt: request.prompt,
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          style: request.style || 'vivid',
          n: request.n || 1
        });
      });

      return response.data.map(img => img.url!).filter(Boolean);
    } catch (error) {
      const apiError = this.handleError(error);
      throw new Error(apiError.message);
    }
  }

  // === MULTIMODAL METHODS ===
  
  async analyzeImageWithText(imageUrl: string, question: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.retryWithExponentialBackoff(async () => {
        return await this.openai!.chat.completions.create({
          model: OPENAI_MODELS.TEXT.GPT_4O,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: question },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 500
        });
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      const apiError = this.handleError(error);
      throw new Error(apiError.message);
    }
  }

  // === UTILITY METHODS ===
  
  async validateApiKey(): Promise<boolean> {
    try {
      await this.checkHealth();
      return this.healthStatus.isHealthy;
    } catch {
      return false;
    }
  }

  getUsageStats(): { requestCount: number; cacheHits: number; cacheSize: number } {
    return {
      requestCount: this.requestCount,
      cacheHits: Array.from(this.cache.values()).filter(entry => entry.response.cached).length,
      cacheSize: this.cache.size
    };
  }

  clearCache(): void {
    this.cache.clear();
    this.requestDeduplication.clear();
  }

  // === BATCH OPERATIONS ===
  
  async batchGenerate(requests: AIRequest[]): Promise<AIResponse[]> {
    const promises = requests.map(request => this.generateResponse(request));
    return Promise.all(promises);
  }

  async batchGenerateImages(requests: ImageRequest[]): Promise<string[][]> {
    const promises = requests.map(request => this.generateImage(request));
    return Promise.all(promises);
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export types for external use
export type { AIRequest, AIResponse, VoiceRequest, TranscriptionRequest, ImageRequest, APIError };