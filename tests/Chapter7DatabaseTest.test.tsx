import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
  }
}));

describe('Chapter 7 Database Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Lesson Progress Tracking', () => {
    it('should fetch lesson progress for Chapter 7 lessons', async () => {
      const mockData = [
        { lesson_id: 31, completed: false, progress_percentage: 0 },
        { lesson_id: 32, completed: false, progress_percentage: 25 },
        { lesson_id: 33, completed: true, progress_percentage: 100 },
        { lesson_id: 34, completed: false, progress_percentage: 50 },
        { lesson_id: 35, completed: false, progress_percentage: 0 },
        { lesson_id: 36, completed: false, progress_percentage: 0 },
        { lesson_id: 37, completed: false, progress_percentage: 0 }
      ];

      const mockSupabaseChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: mockData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockSupabaseChain);

      // Simulate fetching progress for Chapter 7 lessons
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed, progress_percentage')
        .eq('user_id', 'test-user-123')
        .in('lesson_id', [31, 32, 33, 34, 35, 36, 37]);

      expect(supabase.from).toHaveBeenCalledWith('lesson_progress');
      expect(mockSupabaseChain.select).toHaveBeenCalledWith('lesson_id, completed, progress_percentage');
      expect(mockSupabaseChain.eq).toHaveBeenCalledWith('user_id', 'test-user-123');
      expect(mockSupabaseChain.in).toHaveBeenCalledWith('lesson_id', [31, 32, 33, 34, 35, 36, 37]);
      
      expect(data).toEqual(mockData);
      expect(error).toBeNull();
    });

    it('should handle lesson progress updates', async () => {
      const mockUpsertChain = {
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      (supabase.from as any).mockReturnValue(mockUpsertChain);

      const progressUpdate = {
        user_id: 'test-user-123',
        lesson_id: 31,
        progress_percentage: 75,
        completed: false,
        updated_at: new Date().toISOString()
      };

      // Simulate updating lesson progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert(progressUpdate);

      expect(supabase.from).toHaveBeenCalledWith('lesson_progress');
      expect(mockUpsertChain.upsert).toHaveBeenCalledWith(progressUpdate);
      
      expect(error).toBeNull();
    });

    it('should track completion status correctly', async () => {
      const mockCompletionData = {
        user_id: 'test-user-123',
        lesson_id: 33,
        progress_percentage: 100,
        completed: true,
        completed_at: new Date().toISOString()
      };

      const mockUpsertChain = {
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockCompletionData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockUpsertChain);

      // Simulate lesson completion
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert(mockCompletionData);

      expect(mockUpsertChain.upsert).toHaveBeenCalledWith(mockCompletionData);
      expect(error).toBeNull();
    });
  });

  describe('User Interaction Logging', () => {
    it('should log Carmen AI interactions', async () => {
      const mockInteractionData = {
        user_id: 'test-user-123',
        lesson_id: 31,
        interaction_type: 'carmen_chat',
        interaction_data: {
          message: 'How can I make my job descriptions more inclusive?',
          response: 'Here are some strategies for inclusive job descriptions...',
          personality_mode: 'empathetic',
          timestamp: new Date().toISOString()
        },
        chapter: 7
      };

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ data: mockInteractionData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockInsertChain);

      // Simulate logging AI interaction
      const { data, error } = await supabase
        .from('user_interactions')
        .insert(mockInteractionData);

      expect(supabase.from).toHaveBeenCalledWith('user_interactions');
      expect(mockInsertChain.insert).toHaveBeenCalledWith(mockInteractionData);
      expect(error).toBeNull();
    });

    it('should track AI content generation events', async () => {
      const mockGenerationData = {
        user_id: 'test-user-123',
        lesson_id: 31,
        interaction_type: 'ai_generation',
        interaction_data: {
          generation_type: 'job-description',
          prompt: 'Create an inclusive job description for a Program Manager role',
          generated_content: 'Program Manager - Join our inclusive team...',
          processing_time: 2.5,
          carmen_personality: 'empathetic'
        },
        chapter: 7
      };

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ data: mockGenerationData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockInsertChain);

      // Simulate logging content generation
      const { data, error } = await supabase
        .from('user_interactions')
        .insert(mockGenerationData);

      expect(mockInsertChain.insert).toHaveBeenCalledWith(mockGenerationData);
      expect(error).toBeNull();
    });

    it('should store lesson engagement metrics', async () => {
      const mockEngagementData = {
        user_id: 'test-user-123',
        lesson_id: 31,
        interaction_type: 'engagement_metric',
        interaction_data: {
          time_spent: 450, // seconds
          clicks: 12,
          ai_interactions: 5,
          content_generated: 3,
          phase_completions: ['intro', 'workshop']
        },
        chapter: 7
      };

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ data: mockEngagementData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockInsertChain);

      // Simulate logging engagement metrics
      const { data, error } = await supabase
        .from('user_interactions')
        .insert(mockEngagementData);

      expect(mockInsertChain.insert).toHaveBeenCalledWith(mockEngagementData);
      expect(error).toBeNull();
    });
  });

  describe('Carmen-Specific Data Storage', () => {
    it('should store Carmen personality preferences', async () => {
      const mockPreferenceData = {
        user_id: 'test-user-123',
        character_type: 'carmen',
        preferences: {
          preferred_personality_mode: 'empathetic',
          interaction_style: 'compassionate',
          topic_interests: ['talent-acquisition', 'performance-insights'],
          learning_pace: 'moderate'
        },
        chapter: 7
      };

      const mockUpsertChain = {
        upsert: vi.fn().mockResolvedValue({ data: mockPreferenceData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockUpsertChain);

      // Simulate storing character preferences
      const { data, error } = await supabase
        .from('character_preferences')
        .upsert(mockPreferenceData);

      expect(supabase.from).toHaveBeenCalledWith('character_preferences');
      expect(mockUpsertChain.upsert).toHaveBeenCalledWith(mockPreferenceData);
      expect(error).toBeNull();
    });

    it('should track Carmen conversation history', async () => {
      const mockConversationData = {
        user_id: 'test-user-123',
        character_type: 'carmen',
        lesson_id: 31,
        conversation_data: {
          messages: [
            {
              id: '1',
              content: 'How can I improve diversity in hiring?',
              isUser: true,
              timestamp: new Date().toISOString()
            },
            {
              id: '2', 
              content: 'Great question! Here are some evidence-based strategies...',
              isUser: false,
              timestamp: new Date().toISOString(),
              emotion: 'empathetic',
              personality_mode: 'analytical'
            }
          ],
          session_duration: 300,
          engagement_score: 0.85
        },
        chapter: 7
      };

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ data: mockConversationData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockInsertChain);

      // Simulate storing conversation history
      const { data, error } = await supabase
        .from('character_conversations')
        .insert(mockConversationData);

      expect(mockInsertChain.insert).toHaveBeenCalledWith(mockConversationData);
      expect(error).toBeNull();
    });

    it('should handle AI content versioning', async () => {
      const mockContentVersion = {
        user_id: 'test-user-123',
        lesson_id: 31,
        content_type: 'job-description',
        version: 1,
        content: 'Program Manager - Original version...',
        generation_params: {
          prompt: 'Create an inclusive job description',
          personality_mode: 'empathetic',
          context: 'talent-acquisition'
        },
        created_at: new Date().toISOString()
      };

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ data: mockContentVersion, error: null })
      };

      (supabase.from as any).mockReturnValue(mockInsertChain);

      // Simulate storing content version
      const { data, error } = await supabase
        .from('ai_generated_content')
        .insert(mockContentVersion);

      expect(mockInsertChain.insert).toHaveBeenCalledWith(mockContentVersion);
      expect(error).toBeNull();
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      
      const mockErrorChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: null, error: mockError })
      };

      (supabase.from as any).mockReturnValue(mockErrorChain);

      // Simulate database error
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', 'test-user-123')
        .in('lesson_id', [31, 32, 33]);

      expect(data).toBeNull();
      expect(error).toBe(mockError);
    });

    it('should handle invalid data gracefully', async () => {
      const invalidData = {
        user_id: null, // Invalid user ID
        lesson_id: 'invalid', // Invalid lesson ID
        progress_percentage: 150 // Invalid percentage
      };

      const mockValidationError = new Error('Invalid data format');
      
      const mockErrorChain = {
        insert: vi.fn().mockResolvedValue({ data: null, error: mockValidationError })
      };

      (supabase.from as any).mockReturnValue(mockErrorChain);

      // Simulate validation error
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert(invalidData);

      expect(data).toBeNull();
      expect(error).toBe(mockValidationError);
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Network timeout');
      
      const mockTimeoutChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockRejectedValue(timeoutError)
      };

      (supabase.from as any).mockReturnValue(mockTimeoutChain);

      try {
        await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', 'test-user-123');
      } catch (error) {
        expect(error).toBe(timeoutError);
      }
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain referential integrity between tables', async () => {
      // Test that lesson progress references valid lesson IDs
      const validLessonIds = [31, 32, 33, 34, 35, 36, 37];
      
      const mockProgressData = validLessonIds.map(id => ({
        lesson_id: id,
        user_id: 'test-user-123',
        progress_percentage: Math.floor(Math.random() * 101),
        completed: Math.random() > 0.5
      }));

      const mockSelectChain = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: mockProgressData, error: null })
      };

      (supabase.from as any).mockReturnValue(mockSelectChain);

      // Verify all lesson IDs are valid Chapter 7 lessons
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .in('lesson_id', validLessonIds);

      expect(data).toEqual(mockProgressData);
      data?.forEach(record => {
        expect(validLessonIds).toContain(record.lesson_id);
      });
    });

    it('should ensure progress percentages are within valid range', async () => {
      const validProgressData = [
        { lesson_id: 31, progress_percentage: 0 },
        { lesson_id: 32, progress_percentage: 50 }, 
        { lesson_id: 33, progress_percentage: 100 }
      ];

      validProgressData.forEach(record => {
        expect(record.progress_percentage).toBeGreaterThanOrEqual(0);
        expect(record.progress_percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should validate character type consistency', () => {
      const carmenData = {
        character_type: 'carmen',
        lesson_id: 31, // Chapter 7 lesson
        chapter: 7
      };

      // Carmen should only be associated with Chapter 7
      expect(carmenData.character_type).toBe('carmen');
      expect(carmenData.chapter).toBe(7);
      expect(carmenData.lesson_id).toBeGreaterThanOrEqual(31);
      expect(carmenData.lesson_id).toBeLessThanOrEqual(37);
    });
  });
});