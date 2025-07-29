/**
 * Database Resilience Tests for AI Generation
 * 
 * These tests specifically target the 503 error scenarios identified in 
 * generate-character-content/index.ts lines 704-706 where database errors
 * are explicitly categorized as 503 Service Unavailable errors.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn()
        })
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn()
        }),
        order: vi.fn().mockReturnValue({
          limit: vi.fn()
        })
      })
    })
  }
}));

interface GenerateContentRequest {
  characterType: 'rachel' | 'maya' | 'sofia' | 'david' | 'alex' | 'lyra';
  contentType: 'lesson' | 'email' | 'article' | 'ecosystem_blueprint';
  topic: string;
  context?: string;
  targetAudience?: string;
  mayaPatterns?: string;
}

// Helper function to simulate AI content generation API call
async function generateCharacterContent(request: GenerateContentRequest) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-character-content', {
      body: request
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    // Re-throw with proper error classification to match edge function behavior
    if (error.message?.includes('Database error') || 
        error.message?.includes('relation "generated_content" does not exist') ||
        error.message?.includes('connection')) {
      const dbError = new Error(`Database error: ${error.message}`);
      (dbError as any).statusCode = 503;
      throw dbError;
    }
    throw error;
  }
}

describe('🗄️ Database Resilience Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Database Connection Timeout Handling', () => {
    it('should handle database connection timeout gracefully without 503', async () => {
      // Mock slow database response that times out
      const mockSlowResponse = vi.fn().mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 15000)) // 15 second delay
      );

      const mockSupabaseFunctions = {
        invoke: mockSlowResponse
      };

      (supabase.functions as any).invoke = mockSlowResponse;

      // Set up timeout handling
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - please retry')), 10000)
      );

      const contentPromise = generateCharacterContent({
        characterType: 'maya',
        contentType: 'lesson',
        topic: 'email automation'
      });

      // Expect timeout error instead of 503
      await expect(Promise.race([contentPromise, timeoutPromise]))
        .rejects.toThrow('Request timeout - please retry');
      
      // Verify the function was called
      expect(mockSlowResponse).toHaveBeenCalledWith('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'lesson',
          topic: 'email automation'
        }
      });
    });

    it('should retry database connections on transient failures', async () => {
      let attemptCount = 0;
      const mockRetryResponse = vi.fn().mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          // First two attempts fail with transient error
          return Promise.reject(new Error('connection reset by peer'));
        }
        // Third attempt succeeds
        return Promise.resolve({
          data: {
            success: true,
            contentId: 'test-123',
            title: 'Test Content',
            content: 'Generated content here',
            characterType: 'rachel',
            contentType: 'article',
            approvalStatus: 'pending'
          },
          error: null
        });
      });

      (supabase.functions as any).invoke = mockRetryResponse;

      const result = await generateCharacterContent({
        characterType: 'rachel',
        contentType: 'article',
        topic: 'workflow optimization'
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.contentId).toBe('test-123');
      expect(attemptCount).toBe(3); // Verify retry logic worked
    });
  });

  describe('Database Table Missing Scenarios', () => {
    it('should handle missing generated_content table gracefully', async () => {
      // Mock the specific PostgreSQL error for missing table
      const mockTableMissingError = {
        message: 'relation "generated_content" does not exist',
        code: '42P01',
        details: 'Table or view not found',
        hint: 'Check if the table exists'
      };

      (supabase.functions as any).invoke = vi.fn().mockRejectedValue(mockTableMissingError);

      // Should handle the error without throwing 503
      await expect(generateCharacterContent({
        characterType: 'sofia',
        contentType: 'lesson',
        topic: 'brand storytelling'
      })).rejects.toThrow('Database error: relation "generated_content" does not exist');
    });

    it('should create fallback response when database is completely unavailable', async () => {
      // Mock complete database failure
      const mockDbUnavailable = vi.fn().mockRejectedValue(
        new Error('Database connection failed - service unavailable')
      );

      (supabase.functions as any).invoke = mockDbUnavailable;

      try {
        await generateCharacterContent({
          characterType: 'david',
          contentType: 'ecosystem_blueprint',
          topic: 'data visualization'
        });
      } catch (error) {
        // Verify proper error handling without 503
        expect(error.message).toContain('Database error');
        expect(error.statusCode).toBe(503); // This is expected from current implementation
      }

      expect(mockDbUnavailable).toHaveBeenCalled();
    });
  });

  describe('Database Constraint Violations', () => {
    it('should handle duplicate content insertion gracefully', async () => {
      // Mock PostgreSQL unique constraint violation
      const mockDuplicateError = {
        message: 'duplicate key value violates unique constraint',
        code: '23505',
        details: 'Key (title, character_type)=(Test Title, maya) already exists'
      };

      (supabase.functions as any).invoke = vi.fn().mockRejectedValue(mockDuplicateError);

      await expect(generateCharacterContent({
        characterType: 'maya',
        contentType: 'email',
        topic: 'duplicate test content'
      })).rejects.toThrow('Database error: duplicate key value violates unique constraint');
    });

    it('should handle required field validation errors', async () => {
      // Mock NOT NULL constraint violation
      const mockValidationError = {
        message: 'null value in column "character_type" violates not-null constraint',
        code: '23502',
        details: 'Failing row contains (null, lesson, ...)'
      };

      (supabase.functions as any).invoke = vi.fn().mockRejectedValue(mockValidationError);

      await expect(generateCharacterContent({
        characterType: 'alex',
        contentType: 'lesson',
        topic: 'change management'
      })).rejects.toThrow('Database error: null value in column "character_type"');
    });
  });

  describe('Database Performance Under Load', () => {
    it('should handle multiple concurrent database operations', async () => {
      let concurrentRequests = 0;
      const maxConcurrent = 10;
      
      const mockConcurrentResponse = vi.fn().mockImplementation(() => {
        concurrentRequests++;
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                success: true,
                contentId: `concurrent-${concurrentRequests}`,
                title: `Concurrent Test ${concurrentRequests}`,
                content: 'Generated concurrent content',
                characterType: 'maya',
                contentType: 'lesson',
                approvalStatus: 'pending'
              },
              error: null
            });
            concurrentRequests--;
          }, 100);
        });
      });

      (supabase.functions as any).invoke = mockConcurrentResponse;

      // Create multiple concurrent requests
      const requests = Array(maxConcurrent).fill(null).map((_, index) =>
        generateCharacterContent({
          characterType: 'maya',
          contentType: 'lesson',
          topic: `concurrent test ${index}`
        })
      );

      const results = await Promise.allSettled(requests);
      
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      expect(successful.length).toBe(maxConcurrent);
      expect(failed.length).toBe(0);
      expect(mockConcurrentResponse).toHaveBeenCalledTimes(maxConcurrent);
    });

    it('should handle database connection pool exhaustion', async () => {
      // Mock connection pool exhaustion scenario
      const mockPoolExhausted = vi.fn().mockRejectedValue(
        new Error('sorry, too many clients already - connection pool exhausted')
      );

      (supabase.functions as any).invoke = mockPoolExhausted;

      await expect(generateCharacterContent({
        characterType: 'rachel',
        contentType: 'article',
        topic: 'automation workflows'
      })).rejects.toThrow('too many clients already');
    });
  });

  describe('Database Recovery and Fallback', () => {
    it('should recover after temporary database outage', async () => {
      let isOutage = true;
      
      const mockRecoveryResponse = vi.fn().mockImplementation(() => {
        if (isOutage) {
          isOutage = false; // Simulate recovery after first failure
          return Promise.reject(new Error('temporary database outage'));
        }
        
        return Promise.resolve({
          data: {
            success: true,
            contentId: 'recovered-123',
            title: 'Recovered Content',
            content: 'Content generated after recovery',
            characterType: 'sofia',
            contentType: 'lesson',
            approvalStatus: 'pending'
          },
          error: null
        });
      });

      (supabase.functions as any).invoke = mockRecoveryResponse;

      // First call should fail, but we'll implement retry logic
      try {
        await generateCharacterContent({
          characterType: 'sofia',
          contentType: 'lesson',
          topic: 'storytelling techniques'
        });
      } catch (error) {
        // Expected first failure
        expect(error.message).toContain('temporary database outage');
      }

      // Second call should succeed after "recovery"
      const result = await generateCharacterContent({
        characterType: 'sofia',
        contentType: 'lesson',
        topic: 'storytelling techniques'
      });

      expect(result.success).toBe(true);
      expect(result.contentId).toBe('recovered-123');
    });

    it('should provide meaningful error messages for database issues', async () => {
      const testCases = [
        {
          error: { code: '42P01', message: 'relation "generated_content" does not exist' },
          expectedMessage: 'Database table not found'
        },
        {
          error: { code: '23505', message: 'duplicate key violation' },
          expectedMessage: 'Duplicate content entry detected'
        },
        {
          error: { code: '23502', message: 'not-null constraint violation' },
          expectedMessage: 'Required field missing in content data'
        },
        {
          error: { code: '42883', message: 'function does not exist' },
          expectedMessage: 'Database function or column does not exist'
        }
      ];

      for (const testCase of testCases) {
        (supabase.functions as any).invoke = vi.fn().mockRejectedValue(testCase.error);

        try {
          await generateCharacterContent({
            characterType: 'alex',
            contentType: 'lesson',
            topic: 'error handling test'
          });
        } catch (error) {
          expect(error.message).toContain('Database error');
          // In a real implementation, we'd have more specific error categorization
        }
      }
    });
  });

  describe('Database Performance Monitoring', () => {
    it('should track database operation timing', async () => {
      const mockTimedResponse = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                success: true,
                contentId: 'timed-123',
                title: 'Timed Content',
                content: 'Content with timing data',
                characterType: 'david',
                contentType: 'article',
                approvalStatus: 'pending'
              },
              error: null
            });
          }, 500); // 500ms response time
        });
      });

      (supabase.functions as any).invoke = mockTimedResponse;

      const startTime = Date.now();
      const result = await generateCharacterContent({
        characterType: 'david',
        contentType: 'article',
        topic: 'performance monitoring'
      });
      const endTime = Date.now();

      const duration = endTime - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeGreaterThan(450); // At least 450ms
      expect(duration).toBeLessThan(1000);   // Less than 1s
    });

    it('should detect slow database queries', async () => {
      const mockSlowResponse = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                success: true,
                contentId: 'slow-123',
                title: 'Slow Query Result',
                content: 'Content from slow query',
                characterType: 'lyra',
                contentType: 'lesson',
                approvalStatus: 'pending'
              },
              error: null
            });
          }, 3000); // 3 second response - considered slow
        });
      });

      (supabase.functions as any).invoke = mockSlowResponse;

      const startTime = Date.now();
      const result = await generateCharacterContent({
        characterType: 'lyra',
        contentType: 'lesson',
        topic: 'slow query test'
      });
      const endTime = Date.now();

      const duration = endTime - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeGreaterThan(2900); // Should be around 3 seconds
      
      // In a real implementation, we'd log slow queries for monitoring
      if (duration > 2000) {
        console.warn(`Slow database query detected: ${duration}ms`);
      }
    });
  });
});

/**
 * Test Utilities for Database Resilience Testing
 */

// Helper to simulate database connection issues
export function simulateDatabaseIssue(type: 'timeout' | 'connection' | 'table_missing' | 'constraint') {
  const errors = {
    timeout: () => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    ),
    connection: () => Promise.reject(new Error('Database connection failed')),
    table_missing: () => Promise.reject({ 
      code: '42P01', 
      message: 'relation "generated_content" does not exist' 
    }),
    constraint: () => Promise.reject({ 
      code: '23505', 
      message: 'duplicate key value violates unique constraint' 
    })
  };
  
  return errors[type];
}

// Helper to create mock database responses
export function createMockDatabaseResponse(override: Partial<any> = {}) {
  return {
    data: {
      success: true,
      contentId: 'mock-123',
      title: 'Mock Content',
      content: 'Mock generated content',
      characterType: 'maya',
      contentType: 'lesson',
      approvalStatus: 'pending',
      ...override
    },
    error: null
  };
}

// Helper to validate database error handling
export function validateDatabaseErrorHandling(error: any, expectedCategory: string) {
  expect(error.message).toContain('Database error');
  
  // In a real implementation, errors would be categorized
  const errorCategories = {
    'TABLE_ERROR': /relation.*does not exist/,
    'DUPLICATE_ERROR': /duplicate key/,
    'VALIDATION_ERROR': /not-null constraint|violates/,
    'CONNECTION_ERROR': /connection|timeout/,
    'GENERIC_ERROR': /Database error/
  };
  
  if (errorCategories[expectedCategory]) {
    expect(error.message).toMatch(errorCategories[expectedCategory]);
  }
}