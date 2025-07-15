import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SofiaVoiceDiscovery } from '../../SofiaVoiceDiscovery';
import { AITestUtils, AITestData } from '../../../../test/ai-test-utils';
import { AI_TEST_CONFIG, AI_MOCK_RESPONSES } from '../../../../test/ai-component-test-config';
import { createTestElement, PerformanceTestUtils } from '../testUtils';

describe('SofiaVoiceStory - Comprehensive Test Suite', () => {
  const mockElement = createTestElement({
    type: 'sofia_voice_discovery',
    title: 'Authentic Voice Discovery',
    content: 'Discover and develop your authentic storytelling voice',
    configuration: {
      voice_analysis: true,
      story_generation: true,
      authenticity_scoring: true,
      voice_coaching: true,
      audio_recording: true
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    AITestUtils.mocks.aiService.generateResponse.mockReset();
    AITestUtils.mocks.voiceService.transcribe.mockReset();
    AITestUtils.mocks.analyticsService.track.mockReset();
    
    // Mock audio context
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createGain: vi.fn(() => ({ connect: vi.fn(), gain: { value: 1 } })),
      createOscillator: vi.fn(() => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn() })),
      destination: {},
      close: vi.fn()
    }));
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Voice Analysis and Discovery', () => {
    it('should analyze written voice patterns', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce(
        AI_MOCK_RESPONSES.STORY_CREATOR.voice_analysis
      );

      render(<SofiaVoiceDiscovery element={mockElement} />);

      // Input sample text
      const textArea = screen.getByLabelText(/your writing sample/i);
      await user.type(textArea, 'I believe in the power of community. When we come together...');
      
      await user.click(screen.getByRole('button', { name: /analyze voice/i }));

      await waitFor(() => {
        expect(screen.getByText('Authenticity Score: 85')).toBeInTheDocument();
        expect(screen.getByText('Clarity Score: 92')).toBeInTheDocument();
        expect(screen.getByText('Engagement Score: 78')).toBeInTheDocument();
      });
    });

    it('should provide voice improvement suggestions', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        voice_insights: [
          {
            aspect: 'authenticity',
            score: 75,
            feedback: 'Your voice shows genuine passion, but could be more personal',
            suggestions: ['Share specific personal experiences', 'Use more "I" statements']
          },
          {
            aspect: 'clarity',
            score: 88,
            feedback: 'Clear and well-structured communication',
            suggestions: ['Continue using concrete examples']
          }
        ]
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.type(screen.getByLabelText(/writing sample/i), 'Sample text for analysis');
      await user.click(screen.getByRole('button', { name: /get feedback/i }));

      await waitFor(() => {
        expect(screen.getByText('Share specific personal experiences')).toBeInTheDocument();
        expect(screen.getByText('Use more "I" statements')).toBeInTheDocument();
      });
    });

    it('should track voice development over time', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        voice_progression: {
          current_session: { authenticity: 80, clarity: 85, engagement: 75 },
          previous_session: { authenticity: 70, clarity: 82, engagement: 68 },
          improvement: { authenticity: +10, clarity: +3, engagement: +7 },
          trends: ['Increasing authenticity', 'Consistent clarity', 'Growing engagement']
        }
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /view progress/i }));

      await waitFor(() => {
        expect(screen.getByText('Increasing authenticity')).toBeInTheDocument();
        expect(screen.getByText('+10')).toBeInTheDocument();
      });
    });
  });

  describe('Audio Voice Analysis', () => {
    it('should record and analyze spoken voice', async () => {
      await AITestUtils.Patterns.testVoiceInteraction({
        component: () => <SofiaVoiceDiscovery element={mockElement} />,
        transcription: 'Hello, I want to share my story about community impact.',
        expectedResponse: 'Your spoken voice shows warmth and conviction. Consider emphasizing key emotional moments.'
      });
    });

    it('should provide vocal delivery feedback', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.voiceService.transcribe.mockResolvedValueOnce('Test speech content');
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        vocal_analysis: {
          pace: { score: 85, feedback: 'Good speaking pace, well-paced delivery' },
          tone: { score: 78, feedback: 'Warm and engaging tone' },
          clarity: { score: 92, feedback: 'Excellent articulation' },
          emotion: { score: 73, feedback: 'Show more passion in key moments' }
        }
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      // Start voice recording
      const recordButton = screen.getByLabelText(/record voice/i);
      await user.click(recordButton);
      
      // Simulate recording completion
      await waitFor(() => {
        expect(mockVoiceService.startRecording).toHaveBeenCalled();
      });
      
      await user.click(recordButton); // Stop recording
      
      await waitFor(() => {
        expect(screen.getByText('Good speaking pace, well-paced delivery')).toBeInTheDocument();
        expect(screen.getByText('Show more passion in key moments')).toBeInTheDocument();
      });
    });

    it('should handle audio processing errors', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.voiceService.transcribe.mockRejectedValueOnce(
        new Error('Audio processing failed')
      );

      render(<SofiaVoiceDiscovery element={mockElement} />);

      const recordButton = screen.getByLabelText(/record voice/i);
      await user.click(recordButton);
      await user.click(recordButton); // Stop recording

      await waitFor(() => {
        expect(screen.getByText(/unable to process audio/i)).toBeInTheDocument();
      });
    });
  });

  describe('Story Generation and Development', () => {
    it('should generate story outlines based on voice', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce(
        AI_MOCK_RESPONSES.STORY_CREATOR.story_outline
      );

      render(<SofiaVoiceDiscovery element={mockElement} />);

      // Set story parameters
      await user.type(screen.getByLabelText(/story theme/i), 'community transformation');
      await user.selectOptions(screen.getByLabelText(/target audience/i), 'donors');
      await user.click(screen.getByRole('button', { name: /generate outline/i }));

      await waitFor(() => {
        expect(screen.getByText('Hook the audience with a compelling opening')).toBeInTheDocument();
        expect(screen.getByText('Develop the narrative with supporting details')).toBeInTheDocument();
      });
    });

    it('should provide story content suggestions', async () => {
      await AITestUtils.Patterns.testAISuggestions({
        component: () => <SofiaVoiceDiscovery element={mockElement} />,
        inputText: 'education nonprofit impact',
        expectedSuggestions: AI_MOCK_RESPONSES.STORY_CREATOR.content_suggestions
      });
    });

    it('should adapt stories to different audiences', async () => {
      const user = userEvent.setup();
      
      const audiences = ['board_members', 'volunteers', 'beneficiaries', 'general_public'];
      
      for (const audience of audiences) {
        AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
          adapted_story: {
            audience: audience,
            tone: audience === 'board_members' ? 'professional' : 'conversational',
            content: `Story adapted for ${audience}`
          }
        });
        
        render(<SofiaVoiceDiscovery element={mockElement} />);
        
        await user.selectOptions(screen.getByLabelText(/audience/i), audience);
        await user.click(screen.getByRole('button', { name: /adapt story/i }));
        
        await waitFor(() => {
          expect(screen.getByText(`Story adapted for ${audience}`)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Authenticity Coaching', () => {
    it('should provide authenticity coaching', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        coaching_insights: [
          {
            area: 'personal_connection',
            score: 70,
            coaching: 'Share more of your personal journey and motivations',
            exercises: ['Write about why this work matters to you personally']
          },
          {
            area: 'emotional_resonance',
            score: 85,
            coaching: 'Your emotional connection is strong, maintain this authenticity',
            exercises: ['Practice telling stories that moved you personally']
          }
        ]
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.type(screen.getByLabelText(/story draft/i), 'Our organization helps children in need...');
      await user.click(screen.getByRole('button', { name: /get coaching/i }));

      await waitFor(() => {
        expect(screen.getByText('Share more of your personal journey')).toBeInTheDocument();
        expect(screen.getByText('Your emotional connection is strong')).toBeInTheDocument();
      });
    });

    it('should suggest authenticity exercises', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        exercises: [
          {
            title: 'Personal Values Exploration',
            description: 'Identify the values that drive your passion for this work',
            duration: '15 minutes',
            instructions: ['List your top 5 personal values', 'Connect each to your work']
          },
          {
            title: 'Story Vulnerability Practice',
            description: 'Practice sharing appropriate personal challenges',
            duration: '20 minutes',
            instructions: ['Think of a challenge you overcame', 'Connect it to your mission']
          }
        ]
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /practice exercises/i }));

      await waitFor(() => {
        expect(screen.getByText('Personal Values Exploration')).toBeInTheDocument();
        expect(screen.getByText('Story Vulnerability Practice')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Accessibility', () => {
    it('should handle real-time voice analysis efficiently', async () => {
      const responseTime = await AITestUtils.Performance.testAIResponseTime({
        component: () => <SofiaVoiceDiscovery element={mockElement} />,
        action: async () => {
          const user = userEvent.setup();
          const recordButton = screen.getByLabelText(/record voice/i);
          await user.click(recordButton);
          await user.click(recordButton); // Stop recording
        },
        maxResponseTime: 3000 // Voice analysis should be under 3 seconds
      });

      expect(responseTime).toBeLessThan(3000);
    });

    it('should support keyboard navigation for voice controls', async () => {
      await AITestUtils.Accessibility.testKeyboardNavigation(
        () => <SofiaVoiceDiscovery element={mockElement} />
      );
    });

    it('should provide alternative text for voice visualizations', async () => {
      const user = userEvent.setup();
      
      render(<SofiaVoiceDiscovery element={mockElement} />);

      // Start recording to trigger voice visualization
      const recordButton = screen.getByLabelText(/record voice/i);
      await user.click(recordButton);

      await waitFor(() => {
        const visualization = screen.getByRole('img', { name: /voice waveform/i });
        expect(visualization).toHaveAttribute('alt', expect.stringContaining('waveform'));
      });
    });
  });

  describe('Story Collaboration and Sharing', () => {
    it('should enable story collaboration', async () => {
      const user = userEvent.setup();
      
      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.type(screen.getByLabelText(/story title/i), 'Community Impact Story');
      await user.type(screen.getByLabelText(/story content/i), 'Our community program...');
      
      await user.click(screen.getByRole('button', { name: /share for feedback/i }));
      await user.type(screen.getByLabelText(/collaborator email/i), 'colleague@example.com');
      await user.click(screen.getByRole('button', { name: /send invitation/i }));

      expect(screen.getByText('Collaboration invitation sent')).toBeInTheDocument();
    });

    it('should version control story drafts', async () => {
      const user = userEvent.setup();
      
      render(<SofiaVoiceDiscovery element={mockElement} />);

      // Create initial story
      await user.type(screen.getByLabelText(/story content/i), 'First draft of the story');
      await user.click(screen.getByRole('button', { name: /save draft/i }));
      
      // Edit story
      await user.clear(screen.getByLabelText(/story content/i));
      await user.type(screen.getByLabelText(/story content/i), 'Revised version of the story');
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await user.click(screen.getByRole('button', { name: /view versions/i }));

      expect(screen.getByText('Version 1')).toBeInTheDocument();
      expect(screen.getByText('Version 2')).toBeInTheDocument();
    });
  });

  describe('Integration Testing', () => {
    it('should integrate with content management system', async () => {
      await AITestUtils.Integration.testCompleteAIWorkflow({
        component: () => <SofiaVoiceDiscovery element={mockElement} />,
        inputData: AITestData.storyData,
        expectedSteps: ['voice_analysis', 'story_generation', 'authenticity_check', 'final_review'],
        expectedOutput: 'Authentic story ready for publication'
      });
    });

    it('should export stories in multiple formats', async () => {
      const user = userEvent.setup();
      
      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.type(screen.getByLabelText(/story content/i), 'Complete story content...');
      await user.click(screen.getByRole('button', { name: /export story/i }));

      // Check export options
      expect(screen.getByText(/export as pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/export as word/i)).toBeInTheDocument();
      expect(screen.getByText(/export as html/i)).toBeInTheDocument();
    });
  });

  describe('Voice Training and Improvement', () => {
    it('should provide voice training exercises', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.generateResponse.mockResolvedValueOnce({
        training_exercises: [
          {
            name: 'Tone Consistency',
            description: 'Practice maintaining consistent emotional tone',
            type: 'audio',
            difficulty: 'intermediate'
          },
          {
            name: 'Pace Variation',
            description: 'Learn to vary speaking pace for emphasis',
            type: 'audio',
            difficulty: 'advanced'
          }
        ]
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /voice training/i }));

      await waitFor(() => {
        expect(screen.getByText('Tone Consistency')).toBeInTheDocument();
        expect(screen.getByText('Pace Variation')).toBeInTheDocument();
      });
    });

    it('should track training progress', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.aiService.analyzeContent.mockResolvedValueOnce({
        training_progress: {
          completed_exercises: 8,
          total_exercises: 12,
          skill_improvements: {
            authenticity: 15,
            clarity: 10,
            engagement: 20
          },
          next_recommended: 'Advanced Storytelling Techniques'
        }
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      await user.click(screen.getByRole('button', { name: /view progress/i }));

      await waitFor(() => {
        expect(screen.getByText('8 of 12 exercises completed')).toBeInTheDocument();
        expect(screen.getByText('+15 authenticity improvement')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle microphone permission denial', async () => {
      const user = userEvent.setup();
      
      // Mock navigator.mediaDevices.getUserMedia to reject
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: vi.fn().mockRejectedValueOnce(new Error('Permission denied'))
        }
      });

      render(<SofiaVoiceDiscovery element={mockElement} />);

      const recordButton = screen.getByLabelText(/record voice/i);
      await user.click(recordButton);

      await waitFor(() => {
        expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument();
      });
    });

    it('should handle very short audio recordings', async () => {
      const user = userEvent.setup();
      
      AITestUtils.mocks.voiceService.transcribe.mockResolvedValueOnce('');

      render(<SofiaVoiceDiscovery element={mockElement} />);

      const recordButton = screen.getByLabelText(/record voice/i);
      await user.click(recordButton);
      
      // Immediately stop recording
      await user.click(recordButton);

      await waitFor(() => {
        expect(screen.getByText(/recording too short/i)).toBeInTheDocument();
      });
    });

    it('should handle very long story content', async () => {
      const user = userEvent.setup();
      const longContent = 'word '.repeat(1000); // 1000 words
      
      render(<SofiaVoiceDiscovery element={mockElement} />);

      const textArea = screen.getByLabelText(/story content/i);
      await user.type(textArea, longContent);

      expect(screen.getByText(/content length warning/i)).toBeInTheDocument();
    });
  });
});