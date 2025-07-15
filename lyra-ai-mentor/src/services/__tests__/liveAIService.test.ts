/**
 * Tests for LiveAIService to ensure it initializes correctly
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LiveAIService } from '../liveAIService';

// Mock import.meta.env for testing
const mockEnv = {
  VITE_OPENAI_API_KEY: 'test-api-key',
  REACT_APP_OPENAI_API_KEY: 'fallback-api-key'
};

// Mock import.meta.env
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv
    }
  },
  writable: true
});

describe('LiveAIService', () => {
  beforeEach(() => {
    // Reset singleton instance
    (LiveAIService as any).instance = undefined;
  });

  it('should initialize without errors', () => {
    expect(() => {
      const service = LiveAIService.getInstance();
      expect(service).toBeDefined();
    }).not.toThrow();
  });

  it('should return API status', () => {
    const service = LiveAIService.getInstance();
    const status = service.getAPIStatus();
    
    expect(status).toBeDefined();
    expect(status.openai).toBeDefined();
    expect(status.openai.available).toBe(true);
    expect(status.openai.model).toBe('gpt-4o');
  });

  it('should handle missing API key gracefully', () => {
    // Mock empty environment
    Object.defineProperty(globalThis, 'import', {
      value: {
        meta: {
          env: {}
        }
      },
      writable: true
    });

    const service = LiveAIService.getInstance();
    const status = service.getAPIStatus();
    
    expect(status.openai.available).toBe(false);
  });
});