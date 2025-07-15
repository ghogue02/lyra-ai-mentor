/**
 * Environment variable utilities
 * Simple, safe access that works with Vite
 */

/**
 * Get OpenAI API key from environment
 * Uses direct access to avoid TypeScript issues
 */
export function getOpenAIKey(): string | undefined {
  try {
    // Try the specific environment variables we know exist
    if (typeof window !== 'undefined') {
      // Browser environment - check for injected variables
      const viteKey = (window as any).VITE_OPENAI_API_KEY;
      const reactKey = (window as any).REACT_APP_OPENAI_API_KEY;
      
      if (viteKey) return viteKey;
      if (reactKey) return reactKey;
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  try {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost';
  } catch {
    return false;
  }
}