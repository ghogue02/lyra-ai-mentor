import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { InteractiveElementRenderer } from '@/components/lesson/InteractiveElementRenderer';
import { LessonWithPlacement } from '@/components/lesson/LessonWithPlacement';
import { createTestElement, createTestLessonContext } from '@/components/interactive/__tests__/testUtils';

// Mock Supabase client for integration tests
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ 
            data: [
              { id: 1, title: 'Test Lesson', content: 'Test content' }
            ], 
            error: null 
          })),
        })),
        single: vi.fn(() => Promise.resolve({ 
          data: { id: 1, title: 'Test Lesson', content: 'Test content' }, 
          error: null 
        })),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: [{ id: 1 }], error: null })),
    })),
  })),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('User Workflows Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Learning Journey', () => {
    it('should complete a full lesson with multiple interactive elements', async () => {
      const elements = [
        createTestElement({
          id: 1,
          type: 'callout_box',
          title: 'Introduction',
          content: 'Welcome to the lesson',
          order_index: 1,
        }),
        createTestElement({
          id: 2,
          type: 'knowledge_check',
          title: 'Knowledge Check',
          content: 'Test your understanding',
          order_index: 2,
          configuration: {
            question: 'What is AI?',
            answers: ['Artificial Intelligence', 'Alien Intelligence', 'Automatic Intelligence'],
            correctAnswer: 0,
          },
        }),
        createTestElement({
          id: 3,
          type: 'reflection',
          title: 'Reflection',
          content: 'Reflect on what you learned',
          order_index: 3,
        }),
      ];

      const completedElements = new Set<number>();
      const onElementComplete = vi.fn((elementId: number) => {
        completedElements.add(elementId);
      });

      render(
        <BrowserRouter>
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={onElementComplete}
              />
            ))}
          </div>
        </BrowserRouter>
      );

      // Step 1: Read introduction
      expect(screen.getByText('Welcome to the lesson')).toBeInTheDocument();
      
      // Step 2: Complete knowledge check
      const knowledgeCheckTitle = screen.getByText('Knowledge Check');
      expect(knowledgeCheckTitle).toBeInTheDocument();
      
      const correctAnswer = screen.getByText('Artificial Intelligence');
      await userEvent.click(correctAnswer);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onElementComplete).toHaveBeenCalledWith(2);
      });

      // Step 3: Complete reflection
      const reflectionInput = screen.getByRole('textbox');
      await userEvent.type(reflectionInput, 'I learned that AI stands for Artificial Intelligence');
      
      const reflectionSubmit = screen.getByRole('button', { name: /submit|save/i });
      await userEvent.click(reflectionSubmit);
      
      await waitFor(() => {
        expect(onElementComplete).toHaveBeenCalledWith(3);
      });

      // Verify all elements completed
      expect(completedElements.size).toBe(2); // Knowledge check and reflection
    });

    it('should handle lesson progression with gated content', async () => {
      const elements = [
        createTestElement({
          id: 1,
          type: 'callout_box',
          title: 'Prerequisite',
          content: 'Complete this first',
          order_index: 1,
          gated: false,
        }),
        createTestElement({
          id: 2,
          type: 'ai_content_generator',
          title: 'Advanced Content',
          content: 'This is gated content',
          order_index: 2,
          gated: true,
        }),
      ];

      const onElementComplete = vi.fn();

      render(
        <BrowserRouter>
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={onElementComplete}
              />
            ))}
          </div>
        </BrowserRouter>
      );

      // First element should be visible
      expect(screen.getByText('Complete this first')).toBeInTheDocument();
      
      // Second element should be gated
      expect(screen.getByText(/complete previous/i)).toBeInTheDocument();
      
      // Complete first element
      const firstElement = screen.getByText('Prerequisite');
      await userEvent.click(firstElement);
      
      // Now second element should be available
      await waitFor(() => {
        expect(screen.getByText('This is gated content')).toBeInTheDocument();
      });
    });
  });

  describe('AI Playground User Workflows', () => {
    it('should complete AI content generation workflow', async () => {
      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'AI Content Generator',
        content: 'Generate content using AI',
        configuration: {
          prompt: 'Write a professional email',
          maxLength: 200,
        },
      });

      const onElementComplete = vi.fn();

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={onElementComplete}
          />
        </BrowserRouter>
      );

      // Enter prompt
      const promptInput = screen.getByRole('textbox');
      await userEvent.type(promptInput, 'Write a professional email about project status');
      
      // Click generate button
      const generateButton = screen.getByRole('button', { name: /generate|create/i });
      await userEvent.click(generateButton);
      
      // Wait for generation to complete
      await waitFor(() => {
        expect(screen.getByText(/generated|created|result/i)).toBeInTheDocument();
      });
      
      // Should track completion
      expect(onElementComplete).toHaveBeenCalledWith(element.id);
    });

    it('should handle document generation with templates', async () => {
      const element = createTestElement({
        type: 'document_generator',
        title: 'Document Generator',
        content: 'Generate documents from templates',
        configuration: {
          templates: ['Email', 'Report', 'Proposal'],
        },
      });

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </BrowserRouter>
      );

      // Select template
      const templateSelect = screen.getByRole('combobox');
      await userEvent.click(templateSelect);
      
      const emailTemplate = screen.getByText('Email');
      await userEvent.click(emailTemplate);
      
      // Fill in template fields
      const subjectInput = screen.getByLabelText(/subject/i);
      await userEvent.type(subjectInput, 'Test Subject');
      
      const bodyInput = screen.getByLabelText(/body|message/i);
      await userEvent.type(bodyInput, 'Test message body');
      
      // Generate document
      const generateButton = screen.getByRole('button', { name: /generate|create/i });
      await userEvent.click(generateButton);
      
      // Should show generated document
      await waitFor(() => {
        expect(screen.getByText(/document generated|preview/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Component Interactions', () => {
    it('should handle data flow between components', async () => {
      const elements = [
        createTestElement({
          id: 1,
          type: 'template_creator',
          title: 'Create Template',
          content: 'Create a template',
          order_index: 1,
        }),
        createTestElement({
          id: 2,
          type: 'document_generator',
          title: 'Use Template',
          content: 'Use the created template',
          order_index: 2,
        }),
      ];

      render(
        <BrowserRouter>
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={vi.fn()}
              />
            ))}
          </div>
        </BrowserRouter>
      );

      // Create template in first component
      const templateNameInput = screen.getByLabelText(/template name/i);
      await userEvent.type(templateNameInput, 'My Custom Template');
      
      const templateContentInput = screen.getByLabelText(/template content/i);
      await userEvent.type(templateContentInput, 'Hello {{name}}, this is a test template.');
      
      const createButton = screen.getByRole('button', { name: /create|save/i });
      await userEvent.click(createButton);
      
      // Wait for template to be created
      await waitFor(() => {
        expect(screen.getByText(/template created/i)).toBeInTheDocument();
      });
      
      // Use template in second component
      const templateSelect = screen.getByRole('combobox');
      await userEvent.click(templateSelect);
      
      const customTemplate = screen.getByText('My Custom Template');
      await userEvent.click(customTemplate);
      
      // Should show template in second component
      expect(screen.getByText(/hello.*test template/i)).toBeInTheDocument();
    });
  });

  describe('Multi-User Collaboration', () => {
    it('should handle collaborative document editing', async () => {
      const element = createTestElement({
        type: 'document_generator',
        title: 'Collaborative Document',
        content: 'Edit document collaboratively',
        configuration: {
          collaborative: true,
          users: ['User1', 'User2'],
        },
      });

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </BrowserRouter>
      );

      // Should show collaborative features
      expect(screen.getByText(/collaborative|shared/i)).toBeInTheDocument();
      
      // Should show other users
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('User2')).toBeInTheDocument();
      
      // Make an edit
      const documentInput = screen.getByRole('textbox');
      await userEvent.type(documentInput, 'Collaborative edit test');
      
      // Should show edit indicator
      await waitFor(() => {
        expect(screen.getByText(/saving|syncing/i)).toBeInTheDocument();
      });
    });
  });

  describe('Database Integration', () => {
    it('should save and retrieve user progress', async () => {
      const element = createTestElement({
        type: 'reflection',
        title: 'Personal Reflection',
        content: 'Reflect on your learning',
      });

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </BrowserRouter>
      );

      // Enter reflection
      const reflectionInput = screen.getByRole('textbox');
      const reflectionText = 'This is my personal reflection on the lesson.';
      await userEvent.type(reflectionInput, reflectionText);
      
      // Save reflection
      const saveButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(saveButton);
      
      // Should call database insert
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('user_progress');
      });
    });

    it('should handle database sync conflicts', async () => {
      // Mock database conflict
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: null, 
              error: { code: 'CONFLICT', message: 'Data conflict' }
            })),
          })),
        })),
      });

      const element = createTestElement({
        type: 'ai_content_generator',
        title: 'Content Generator',
        content: 'Generate content',
      });

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </BrowserRouter>
      );

      // Should handle conflict gracefully
      await waitFor(() => {
        expect(screen.getByText(/conflict|sync error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Under Load', () => {
    it('should handle multiple concurrent users', async () => {
      const elements = Array.from({ length: 10 }, (_, i) => 
        createTestElement({
          id: i + 1,
          type: 'ai_content_generator',
          title: `Generator ${i + 1}`,
          content: `Content generator ${i + 1}`,
        })
      );

      const startTime = performance.now();
      
      render(
        <BrowserRouter>
          <div>
            {elements.map(element => (
              <InteractiveElementRenderer
                key={element.id}
                element={element}
                lessonId={1}
                lessonContext={createTestLessonContext()}
                onElementComplete={vi.fn()}
              />
            ))}
          </div>
        </BrowserRouter>
      );
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within reasonable time
      expect(loadTime).toBeLessThan(1000); // 1 second
      
      // All components should be rendered
      elements.forEach(element => {
        expect(screen.getByText(element.title)).toBeInTheDocument();
      });
    });
  });

  describe('Mobile User Experience', () => {
    it('should provide optimized mobile experience', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const element = createTestElement({
        type: 'lyra_chat',
        title: 'Mobile Chat',
        content: 'Chat optimized for mobile',
      });

      render(
        <BrowserRouter>
          <InteractiveElementRenderer
            element={element}
            lessonId={1}
            lessonContext={createTestLessonContext()}
            onElementComplete={vi.fn()}
          />
        </BrowserRouter>
      );

      // Should show mobile-optimized interface
      expect(screen.getByText('Mobile Chat')).toBeInTheDocument();
      
      // Should have mobile-friendly interactions
      const chatInput = screen.getByRole('textbox');
      expect(chatInput).toHaveAttribute('type', 'text');
      
      // Touch interactions should work
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);
      
      // Should handle mobile input
      await userEvent.type(chatInput, 'Mobile test message');
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mobile test message')).toBeInTheDocument();
      });
    });
  });
});
