import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextualLyraChat, type LessonContext } from '../lyra/ContextualLyraChat';

// Mock hook to avoid API calls in tests
vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: [],
    sendMessage: vi.fn(),
    clearChat: vi.fn(),
    isLoading: false
  }))
}));

// Mock other dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: () => <div data-testid="lyra-avatar">Avatar</div>
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

describe('LessonContext Validation and Processing', () => {
  const validLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn the basics of AI and machine learning',
    chapterTitle: 'Chapter 1: Getting Started with AI',
    objectives: [
      'Understand basic AI concepts',
      'Learn about machine learning',
      'Explore practical applications'
    ],
    keyTerms: ['AI', 'Machine Learning', 'Neural Networks', 'Algorithms'],
    difficulty: 'beginner'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Required Fields Validation', () => {
    it('should handle valid lesson context', () => {
      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={validLessonContext}
            expanded={true}
          />
        );
      }).not.toThrow();

      expect(screen.getByText('Ch.1 • AI Foundations')).toBeInTheDocument();
    });

    it('should handle missing chapterTitle gracefully', () => {
      const contextWithoutChapterTitle = {
        ...validLessonContext,
        chapterTitle: undefined
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithoutChapterTitle}
            expanded={true}
          />
        );
      }).not.toThrow();

      expect(screen.getByText('Ch.1 • AI Foundations')).toBeInTheDocument();
    });

    it('should handle missing optional fields', () => {
      const minimalContext: LessonContext = {
        chapterNumber: 2,
        lessonTitle: 'Basic Lesson',
        phase: 'main',
        content: 'Simple content'
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={minimalContext}
            expanded={true}
          />
        );
      }).not.toThrow();

      expect(screen.getByText('Ch.2 • Basic Lesson')).toBeInTheDocument();
    });

    it('should validate chapter number boundaries', () => {
      const contexts = [
        { ...validLessonContext, chapterNumber: 0 },
        { ...validLessonContext, chapterNumber: -1 },
        { ...validLessonContext, chapterNumber: 999 }
      ];

      contexts.forEach((context, index) => {
        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={index}
            />
          );
        }).not.toThrow();
      });
    });

    it('should handle empty string values gracefully', () => {
      const contextWithEmptyStrings = {
        ...validLessonContext,
        lessonTitle: '',
        phase: '',
        content: ''
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithEmptyStrings}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Chapter-Specific Context Processing', () => {
    it('should generate Chapter 1 specific questions', () => {
      const chapter1Context = {
        ...validLessonContext,
        chapterNumber: 1,
        lessonTitle: 'AI Foundations'
      };

      render(
        <ContextualLyraChat 
          lessonContext={chapter1Context}
          expanded={true}
        />
      );

      // Should show Chapter 1 specific questions
      expect(screen.getByText('I\'m new to AI - where should I start?')).toBeInTheDocument();
      expect(screen.getByText('How can AI help my nonprofit\'s daily work?')).toBeInTheDocument();
      expect(screen.getByText('What are the most important AI concepts for beginners?')).toBeInTheDocument();
      expect(screen.getByText('I\'m worried about AI ethics - can you help me understand?')).toBeInTheDocument();
    });

    it('should generate Chapter 2 specific questions for Maya', () => {
      const chapter2Context = {
        ...validLessonContext,
        chapterNumber: 2,
        lessonTitle: 'Maya\'s Email Challenge'
      };

      render(
        <ContextualLyraChat 
          lessonContext={chapter2Context}
          expanded={true}
        />
      );

      // Should show Chapter 2 specific questions
      expect(screen.getByText('How can AI help me write better emails?')).toBeInTheDocument();
      expect(screen.getByText('How do I communicate with different donor types?')).toBeInTheDocument();
      expect(screen.getByText('What is the PACE framework Maya uses?')).toBeInTheDocument();
      expect(screen.getByText('How can I personalize messages at scale?')).toBeInTheDocument();
    });

    it('should generate fallback questions for unrecognized chapters', () => {
      const unknownChapterContext = {
        ...validLessonContext,
        chapterNumber: 15,
        lessonTitle: 'Advanced Topics'
      };

      render(
        <ContextualLyraChat 
          lessonContext={unknownChapterContext}
          expanded={true}
        />
      );

      // Should show fallback questions
      expect(screen.getByText('Help me understand this lesson: Advanced Topics')).toBeInTheDocument();
      expect(screen.getByText('How can I apply this to my nonprofit work?')).toBeInTheDocument();
      expect(screen.getByText('What should I do next?')).toBeInTheDocument();
    });
  });

  describe('Difficulty Level Processing', () => {
    it('should handle different difficulty levels', () => {
      const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];

      difficulties.forEach(difficulty => {
        const context = {
          ...validLessonContext,
          difficulty
        };

        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={difficulty}
            />
          );
        }).not.toThrow();
      });
    });

    it('should handle missing difficulty level', () => {
      const contextWithoutDifficulty = {
        ...validLessonContext,
        difficulty: undefined
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithoutDifficulty}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Objectives and Key Terms Processing', () => {
    it('should handle valid objectives array', () => {
      const contextWithObjectives = {
        ...validLessonContext,
        objectives: [
          'Learn AI basics',
          'Understand machine learning',
          'Apply knowledge practically'
        ]
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithObjectives}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle empty objectives array', () => {
      const contextWithEmptyObjectives = {
        ...validLessonContext,
        objectives: []
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithEmptyObjectives}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle valid key terms array', () => {
      const contextWithKeyTerms = {
        ...validLessonContext,
        keyTerms: ['AI', 'ML', 'Deep Learning', 'Neural Networks']
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithKeyTerms}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle empty key terms array', () => {
      const contextWithEmptyKeyTerms = {
        ...validLessonContext,
        keyTerms: []
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithEmptyKeyTerms}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Phase Validation', () => {
    it('should handle different phase values', () => {
      const phases = ['introduction', 'main', 'practice', 'conclusion', 'assessment'];

      phases.forEach(phase => {
        const context = {
          ...validLessonContext,
          phase
        };

        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={phase}
            />
          );
        }).not.toThrow();

        expect(screen.getByTestId('badge')).toHaveTextContent(`1.${phase} Help`);
      });
    });

    it('should handle custom phase names', () => {
      const customPhases = ['warm-up', 'deep-dive', 'wrap-up', 'bonus-content'];

      customPhases.forEach(phase => {
        const context = {
          ...validLessonContext,
          phase
        };

        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={phase}
            />
          );
        }).not.toThrow();
      });
    });
  });

  describe('Content Length and Format Validation', () => {
    it('should handle short content', () => {
      const contextWithShortContent = {
        ...validLessonContext,
        content: 'AI'
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithShortContent}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle long content', () => {
      const longContent = 'A'.repeat(10000); // 10k characters
      const contextWithLongContent = {
        ...validLessonContext,
        content: longContent
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithLongContent}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle content with special characters', () => {
      const contextWithSpecialContent = {
        ...validLessonContext,
        content: 'Content with émojis 🤖, symbols & <tags>, and unicode: ñáéíóú'
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithSpecialContent}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle content with markdown', () => {
      const contextWithMarkdown = {
        ...validLessonContext,
        content: '# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2'
      };

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={contextWithMarkdown}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Lesson Title Validation', () => {
    it('should handle various lesson title formats', () => {
      const titleFormats = [
        'Simple Title',
        'Title with Numbers 123',
        'Title: With Colon',
        'Title - With Dash',
        'Title (With Parentheses)',
        'Very Long Title That Might Wrap To Multiple Lines And Test Layout Handling'
      ];

      titleFormats.forEach((title, index) => {
        const context = {
          ...validLessonContext,
          lessonTitle: title
        };

        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={index}
            />
          );
        }).not.toThrow();

        expect(screen.getByText(`Ch.1 • ${title}`)).toBeInTheDocument();
      });
    });

    it('should handle special characters in lesson titles', () => {
      const specialTitles = [
        'Maya\'s Email Challenge',
        'AI & Machine Learning',
        'Chapter 1: "Introduction"',
        'Lesson #1 - Getting Started'
      ];

      specialTitles.forEach((title, index) => {
        const context = {
          ...validLessonContext,
          lessonTitle: title
        };

        expect(() => {
          render(
            <ContextualLyraChat 
              lessonContext={context}
              expanded={true}
              key={index}
            />
          );
        }).not.toThrow();
      });
    });
  });

  describe('Error Boundary and Edge Cases', () => {
    it('should handle null context gracefully', () => {
      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={null as any}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle undefined context gracefully', () => {
      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={undefined as any}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle partial context objects', () => {
      const partialContext = {
        chapterNumber: 1,
        lessonTitle: 'Test'
        // Missing required fields
      } as LessonContext;

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={partialContext}
            expanded={true}
          />
        );
      }).not.toThrow();
    });

    it('should handle context with wrong data types', () => {
      const invalidContext = {
        chapterNumber: '1' as any, // Should be number
        lessonTitle: 123 as any, // Should be string
        phase: true as any, // Should be string
        content: null as any, // Should be string
        objectives: 'not an array' as any,
        keyTerms: { invalid: 'object' } as any
      } as LessonContext;

      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={invalidContext}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Context Integration with useLyraChat', () => {
    it('should pass correct context to useLyraChat hook', () => {
      const useLyraChatMock = vi.mocked(require('@/hooks/useLyraChat').useLyraChat);
      
      render(
        <ContextualLyraChat 
          lessonContext={validLessonContext}
          expanded={true}
        />
      );

      expect(useLyraChatMock).toHaveBeenCalledWith({
        chapterTitle: 'Chapter 1: Getting Started with AI',
        lessonTitle: 'AI Foundations',
        content: 'Learn the basics of AI and machine learning',
        lessonContext: validLessonContext
      });
    });

    it('should handle context changes dynamically', () => {
      const useLyraChatMock = vi.mocked(require('@/hooks/useLyraChat').useLyraChat);
      
      const { rerender } = render(
        <ContextualLyraChat 
          lessonContext={validLessonContext}
          expanded={true}
        />
      );

      const updatedContext = {
        ...validLessonContext,
        chapterNumber: 2,
        lessonTitle: 'Updated Lesson'
      };

      rerender(
        <ContextualLyraChat 
          lessonContext={updatedContext}
          expanded={true}
        />
      );

      expect(useLyraChatMock).toHaveBeenLastCalledWith({
        chapterTitle: 'Chapter 1: Getting Started with AI',
        lessonTitle: 'Updated Lesson',
        content: 'Learn the basics of AI and machine learning',
        lessonContext: updatedContext
      });
    });
  });
});