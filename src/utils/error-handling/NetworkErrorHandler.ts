interface NetworkRequest {
  url: string;
  options: RequestInit;
  timestamp: number;
  attempts: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition: (error: Error, response?: Response) => boolean;
}

interface NetworkError {
  type: 'timeout' | 'offline' | 'server' | 'dns' | 'cors' | 'unknown';
  message: string;
  status?: number;
  retryable: boolean;
}

export class NetworkErrorHandler {
  private failedRequests: Map<string, NetworkRequest> = new Map();
  private retryQueues: Map<string, NetworkRequest[]> = new Map();
  private isOnline: boolean = navigator.onLine;
  private connectionQuality: 'poor' | 'good' | 'excellent' = 'good';
  
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    retryCondition: (error: Error, response?: Response) => {
      // Retry on network errors, timeouts, and 5xx status codes
      if (!response) return true;
      return response.status >= 500 || response.status === 408 || response.status === 429;
    }
  };

  constructor() {
    this.setupNetworkMonitoring();
    this.setupConnectionQualityMonitoring();
  }

  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processRetryQueues();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Monitor for connection quality changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', () => {
        this.assessConnectionQuality();
      });
    }
  }

  private setupConnectionQualityMonitoring(): void {
    // Assess initial connection quality
    this.assessConnectionQuality();
    
    // Periodically reassess connection quality
    setInterval(() => {
      this.assessConnectionQuality();
    }, 30000); // Every 30 seconds
  }

  private assessConnectionQuality(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const downlink = connection.downlink || 10; // Mbps
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
        this.connectionQuality = 'poor';
      } else if (effectiveType === '3g' || downlink < 2) {
        this.connectionQuality = 'good';
      } else {
        this.connectionQuality = 'excellent';
      }
    }
  }

  async handleRequest(
    url: string, 
    options: RequestInit = {}, 
    customRetryConfig?: Partial<RetryConfig>
  ): Promise<Response> {
    const config = { ...this.defaultRetryConfig, ...customRetryConfig };
    const requestKey = this.generateRequestKey(url, options);
    
    const request: NetworkRequest = {
      url,
      options,
      timestamp: Date.now(),
      attempts: 0
    };

    return this.executeRequest(request, config);
  }

  private async executeRequest(request: NetworkRequest, config: RetryConfig): Promise<Response> {
    request.attempts++;

    try {
      // Check if we're offline
      if (!this.isOnline) {
        throw new Error('Network offline');
      }

      // Adjust timeout based on connection quality
      const timeout = this.getTimeoutForConnection();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestOptions: RequestInit = {
        ...request.options,
        signal: controller.signal
      };

      const response = await fetch(request.url, requestOptions);
      clearTimeout(timeoutId);

      // Check if response indicates an error that should be retried
      if (!response.ok && config.retryCondition(new Error(`HTTP ${response.status}`), response)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Success - remove from failed requests if it was there
      const requestKey = this.generateRequestKey(request.url, request.options);
      this.failedRequests.delete(requestKey);

      return response;
    } catch (error) {
      return this.handleRequestError(request, error as Error, config);
    }
  }

  private async handleRequestError(
    request: NetworkRequest, 
    error: Error, 
    config: RetryConfig
  ): Promise<Response> {
    const networkError = this.categorizeError(error);
    const requestKey = this.generateRequestKey(request.url, request.options);

    // Store failed request for potential retry
    this.failedRequests.set(requestKey, request);

    // Check if we should retry
    if (request.attempts < config.maxRetries && networkError.retryable && config.retryCondition(error)) {
      const delay = this.calculateRetryDelay(request.attempts, config);
      
      // If offline, queue for later retry
      if (!this.isOnline) {
        this.queueForRetry(requestKey, request);
        throw error;
      }

      // Wait and retry
      await this.delay(delay);
      return this.executeRequest(request, config);
    }

    // Max retries exceeded or non-retryable error
    throw error;
  }

  private categorizeError(error: Error): NetworkError {
    const message = error.message.toLowerCase();

    if (message.includes('timeout') || message.includes('aborted')) {
      return {
        type: 'timeout',
        message: 'Request timed out',
        retryable: true
      };
    }

    if (message.includes('offline') || message.includes('network')) {
      return {
        type: 'offline',
        message: 'Network is offline',
        retryable: true
      };
    }

    if (message.includes('cors')) {
      return {
        type: 'cors',
        message: 'CORS error',
        retryable: false
      };
    }

    if (message.includes('dns') || message.includes('name not resolved')) {
      return {
        type: 'dns',
        message: 'DNS resolution failed',
        retryable: true
      };
    }

    if (message.includes('http 5') || message.includes('server error')) {
      return {
        type: 'server',
        message: 'Server error',
        retryable: true
      };
    }

    return {
      type: 'unknown',
      message: error.message,
      retryable: true
    };
  }

  private calculateRetryDelay(attempt: number, config: RetryConfig): number {
    const baseDelay = config.baseDelay;
    const multiplier = Math.pow(config.backoffMultiplier, attempt - 1);
    const delay = Math.min(baseDelay * multiplier, config.maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * delay;
    
    // Adjust for connection quality
    const qualityMultiplier = this.getDelayMultiplierForConnection();
    
    return Math.round((delay + jitter) * qualityMultiplier);
  }

  private getTimeoutForConnection(): number {
    switch (this.connectionQuality) {
      case 'poor':
        return 30000; // 30 seconds
      case 'good':
        return 15000; // 15 seconds
      case 'excellent':
        return 10000; // 10 seconds
      default:
        return 15000;
    }
  }

  private getDelayMultiplierForConnection(): number {
    switch (this.connectionQuality) {
      case 'poor':
        return 2.0; // Wait longer on poor connections
      case 'good':
        return 1.0;
      case 'excellent':
        return 0.5; // Retry faster on excellent connections
      default:
        return 1.0;
    }
  }

  private queueForRetry(requestKey: string, request: NetworkRequest): void {
    if (!this.retryQueues.has(requestKey)) {
      this.retryQueues.set(requestKey, []);
    }
    this.retryQueues.get(requestKey)!.push(request);
  }

  private async processRetryQueues(): Promise<void> {
    if (!this.isOnline) return;

    const promises: Promise<void>[] = [];

    this.retryQueues.forEach((requests, requestKey) => {
      promises.push(this.processRequestQueue(requestKey, requests));
    });

    await Promise.allSettled(promises);
    this.retryQueues.clear();
  }

  private async processRequestQueue(requestKey: string, requests: NetworkRequest[]): Promise<void> {
    // Process the most recent request from the queue
    const latestRequest = requests[requests.length - 1];
    
    try {
      await this.executeRequest(latestRequest, this.defaultRetryConfig);
    } catch (error) {
      console.warn(`Failed to process queued request: ${requestKey}`, error);
    }
  }

  private generateRequestKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public method for automatic recovery
  async attemptRecovery(): Promise<void> {
    // Test basic connectivity
    try {
      const testResponse = await fetch('/', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      if (testResponse.ok) {
        this.isOnline = true;
        await this.processRetryQueues();
      }
    } catch (error) {
      // Try alternative connectivity test
      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        this.isOnline = true;
      } catch {
        this.isOnline = false;
        throw new Error('Network connectivity test failed');
      }
    }
  }

  // Wrapper for common API calls with automatic error handling
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${window.location.origin}${endpoint}`;
    
    const response = await this.handleRequest(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Specialized method for Supabase function calls
  async supabaseFunction(functionName: string, body: any, retries = 3): Promise<any> {
    return this.handleRequest(`/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getSupabaseToken()}`
      },
      body: JSON.stringify(body)
    }, { maxRetries: retries });
  }

  private getSupabaseToken(): string {
    // Get token from auth context or localStorage
    try {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.access_token || '';
      }
    } catch {
      // Fallback
    }
    return '';
  }

  // Public methods for monitoring
  public getNetworkStatus(): {
    isOnline: boolean;
    connectionQuality: string;
    failedRequestsCount: number;
    queuedRequestsCount: number;
  } {
    const queuedCount = Array.from(this.retryQueues.values())
      .reduce((total, queue) => total + queue.length, 0);

    return {
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      failedRequestsCount: this.failedRequests.size,
      queuedRequestsCount: queuedCount
    };
  }

  public clearFailedRequests(): void {
    this.failedRequests.clear();
    this.retryQueues.clear();
  }
}