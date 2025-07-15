export type AIErrorType = 
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'INVALID_INPUT'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

export interface AIError extends Error {
  type: AIErrorType;
  statusCode?: number;
  details?: any;
  retryable: boolean;
  userMessage: string;
}

export class AIServiceError extends Error implements AIError {
  type: AIErrorType;
  statusCode?: number;
  details?: any;
  retryable: boolean;
  userMessage: string;
  
  constructor(
    type: AIErrorType,
    message: string,
    userMessage: string,
    options?: {
      statusCode?: number;
      details?: any;
      retryable?: boolean;
    }
  ) {
    super(message);
    this.name = 'AIServiceError';
    this.type = type;
    this.userMessage = userMessage;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.retryable = options?.retryable ?? true;
  }
}

export function handleAIError(error: any): AIError {
  // Network errors
  if (error.message?.toLowerCase().includes('network') || 
      error.message?.toLowerCase().includes('fetch') ||
      error.code === 'ECONNREFUSED') {
    return new AIServiceError(
      'NETWORK_ERROR',
      error.message,
      "Can't reach the AI service. Please check your internet connection and try again.",
      { retryable: true }
    );
  }
  
  // API errors
  if (error.response?.status >= 400 && error.response?.status < 500) {
    const statusCode = error.response.status;
    
    // Rate limiting
    if (statusCode === 429) {
      return new AIServiceError(
        'RATE_LIMIT',
        'Rate limit exceeded',
        "You're moving fast! Take a breather and try again in a few seconds.",
        { statusCode, retryable: true }
      );
    }
    
    // Unauthorized
    if (statusCode === 401 || statusCode === 403) {
      return new AIServiceError(
        'API_ERROR',
        'Authentication error',
        "There's an issue with AI service access. Please try again or contact support.",
        { statusCode, retryable: false }
      );
    }
    
    // Bad request
    if (statusCode === 400) {
      return new AIServiceError(
        'INVALID_INPUT',
        'Invalid request',
        "Something's not quite right with that request. Please check your input and try again.",
        { statusCode, retryable: false }
      );
    }
  }
  
  // Server errors
  if (error.response?.status >= 500) {
    return new AIServiceError(
      'SERVICE_UNAVAILABLE',
      'Service unavailable',
      "The AI is taking a break. Please try again in a moment.",
      { statusCode: error.response.status, retryable: true }
    );
  }
  
  // Timeout errors
  if (error.code === 'ECONNABORTED' || 
      error.message?.toLowerCase().includes('timeout')) {
    return new AIServiceError(
      'TIMEOUT',
      'Request timeout',
      "The AI is thinking too hard! Let's try again with a simpler request.",
      { retryable: true }
    );
  }
  
  // Default error
  return new AIServiceError(
    'UNKNOWN',
    error.message || 'Unknown error',
    "Oops! Something unexpected happened. Let's try again!",
    { details: error, retryable: true }
  );
}

// Retry logic with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const aiError = handleAIError(error);
      
      // Don't retry if not retryable
      if (!aiError.retryable) {
        throw aiError;
      }
      
      // Don't retry on last attempt
      if (i === maxRetries - 1) {
        throw aiError;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, i) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw handleAIError(lastError);
}

// Helper to check if we should show a retry button
export function shouldShowRetry(error: AIError): boolean {
  return error.retryable && error.type !== 'INVALID_INPUT';
}

// Helper to get retry delay suggestion
export function getRetryDelay(error: AIError): number {
  switch (error.type) {
    case 'RATE_LIMIT':
      return 5000; // 5 seconds for rate limits
    case 'SERVICE_UNAVAILABLE':
      return 3000; // 3 seconds for service issues
    case 'NETWORK_ERROR':
      return 2000; // 2 seconds for network issues
    default:
      return 1000; // 1 second default
  }
}