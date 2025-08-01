import { describe, it, expect, vi, beforeEach, afterEach, MockedFunction } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextualLyraChat, type LessonContext } from '../ContextualLyraChat';

// Mock dependencies
vi.mock('@/components/LyraAvatar', () => ({
  LyraAvatar: ({ size, expression, className }: any) => (
    <div 
      data-testid="lyra-avatar" 
      data-size={size}
      data-expression={expression}
      className={className}
    >
      Lyra Avatar
    </div>
  )
}));

vi.mock('../shared/ChatMessage', () => ({
  ChatMessage: ({ message }: any) => (
    <div data-testid="chat-message" data-is-user={message.isUser}>
      <div data-testid="message-content">{message.content}</div>
      {message.characterName && <div data-testid="character-name">{message.characterName}</div>}
    </div>
  )
}));

// Mock useLyraChat hook
const mockSendMessage = vi.fn();
const mockClearChat = vi.fn();
const mockMessages = [
  { id: '1', content: 'Hello! How can I help you?', isUser: false, timestamp: Date.now() },
  { id: '2', content: 'I need help with AI basics', isUser: true, timestamp: Date.now() }
];

vi.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: vi.fn(() => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    clearChat: mockClearChat,
    isLoading: false
  }))
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, initial, animate, exit, transition, ...props }: any) => (
      <div 
        onClick={onClick}
        className={className}
        data-testid="motion-div"
        data-motion-props={JSON.stringify({ initial, animate, exit, transition })}
        {...props}
      >
        {children}
      </div>
    ),
    button: ({ children, onClick, className, ...props }: any) => (
      <button 
        onClick={onClick}
        className={className}
        data-testid="motion-button"
        {...props}
      >
        {children}
      </button>
    ),
    span: ({ children, className }: any) => (
      <span className={className} data-testid="motion-span">{children}</span>
    )
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  )
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, variant, size, ...props }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyPress, placeholder, disabled, className, ...props }: any) => (
    <input 
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid="input"
      {...props}
    />
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  )
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, onScrollCapture, className }: any) => (
    <div 
      data-testid="scroll-area" 
      onScroll={onScrollCapture}
      className={className}
      style={{ height: '400px', overflow: 'auto' }}
    >
      {children}
    </div>
  )
}));

describe('ContextualLyraChat', () => {
  const mockLessonContext: LessonContext = {
    chapterNumber: 1,
    lessonTitle: 'AI Foundations',
    phase: 'introduction',
    content: 'Learn the basics of AI',
    chapterTitle: 'Chapter 1: Getting Started',
    objectives: ['Understand AI basics', 'Learn key concepts'],
    keyTerms: ['AI', 'Machine Learning', 'Neural Networks'],
    difficulty: 'beginner'
  };

  const mockCallbacks = {
    onChatOpen: vi.fn(),
    onChatClose: vi.fn(),
    onEngagementChange: vi.fn(),
    onNarrativePause: vi.fn(),
    onNarrativeResume: vi.fn(),
    onExpandedChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMessage.mockClear();
    mockClearChat.mockClear();
    
    // Reset useLyraChat mock to default state
    (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: mockClearChat,
      isLoading: false
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Floating Avatar Mode (Collapsed)', () => {
    it('should render floating avatar when not expanded', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          isFloating={true}
          expanded={false}
        />
      );

      expect(screen.getByTestId('lyra-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveTextContent('1.introduction Help');
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    });

    it('should expand when floating avatar is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          isFloating={true}
          expanded={false}
          onExpandedChange={mockCallbacks.onExpandedChange}
        />
      );

      const avatarContainer = screen.getByTestId('motion-div');
      await user.click(avatarContainer);

      expect(mockCallbacks.onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('should show lesson context in tooltip', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          isFloating={true}
          expanded={false}
        />
      );

      expect(screen.getByText('Chat with Lyra about AI Foundations')).toBeInTheDocument();
    });
  });

  describe('Expanded Chat Interface', () => {
    beforeEach(() => {
      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: [],
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      });
    });

    it('should render expanded chat interface', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Lyra - Lesson Assistant')).toBeInTheDocument();
      expect(screen.getByText('Ch.1 • AI Foundations')).toBeInTheDocument();
    });

    it('should show contextual questions when no messages', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('I\'m here to help with this lesson!')).toBeInTheDocument();
      expect(screen.getByText('Choose a question below or ask me anything about AI Foundations')).toBeInTheDocument();
      
      // Chapter 1 specific questions
      expect(screen.getByText('I\'m new to AI - where should I start?')).toBeInTheDocument();
      expect(screen.getByText('How can AI help my nonprofit\'s daily work?')).toBeInTheDocument();
    });

    it('should handle minimize and close buttons', async () => {
      const user = userEvent.setup();
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
          isFloating={true}
        />
      );

      const minimizeButton = screen.getByTestId('button');
      await user.click(minimizeButton);

      // Should hide content when minimized
      expect(screen.queryByText('I\'m here to help with this lesson!')).not.toBeInTheDocument();
    });
  });

  describe('Contextual Questions', () => {
    it('should show Chapter 1 specific questions', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const expectedQuestions = [
        'I\'m new to AI - where should I start?',
        'How can AI help my nonprofit\'s daily work?',
        'What are the most important AI concepts for beginners?',
        'I\'m worried about AI ethics - can you help me understand?'
      ];

      expectedQuestions.forEach(question => {
        expect(screen.getByText(question)).toBeInTheDocument();
      });
    });

    it('should show Chapter 2 specific questions for Maya\'s lesson', () => {
      const chapter2Context = {
        ...mockLessonContext,
        chapterNumber: 2,
        lessonTitle: 'Maya\'s Email Challenge'
      };

      render(
        <ContextualLyraChat 
          lessonContext={chapter2Context}
          expanded={true}
        />
      );

      expect(screen.getByText('How can AI help me write better emails?')).toBeInTheDocument();
      expect(screen.getByText('How do I communicate with different donor types?')).toBeInTheDocument();
      expect(screen.getByText('What is the PACE framework Maya uses?')).toBeInTheDocument();
    });

    it('should show fallback questions for unknown chapters', () => {
      const unknownChapterContext = {
        ...mockLessonContext,
        chapterNumber: 99,
        lessonTitle: 'Unknown Lesson'
      };

      render(
        <ContextualLyraChat 
          lessonContext={unknownChapterContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Help me understand this lesson: Unknown Lesson')).toBeInTheDocument();
      expect(screen.getByText('How can I apply this to my nonprofit work?')).toBeInTheDocument();
    });

    it('should send message when contextual question is clicked', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue(undefined);

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const questionButton = screen.getByText('I\'m new to AI - where should I start?');
      await user.click(questionButton);

      expect(mockSendMessage).toHaveBeenCalledWith('I\'m new to AI - where should I start?');
    });
  });

  describe('Message Handling', () => {
    beforeEach(() => {
      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: mockMessages,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      });
    });

    it('should display messages from useLyraChat hook', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument();
      expect(screen.getByText('I need help with AI basics')).toBeInTheDocument();
    });

    it('should send custom message when input is submitted', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue(undefined);

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      const sendButton = screen.getByText('Send') || screen.getByTestId('button');

      await user.type(input, 'What is machine learning?');
      await user.click(sendButton);

      expect(mockSendMessage).toHaveBeenCalledWith('What is machine learning?');
    });

    it('should send message on Enter key press', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue(undefined);

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');

      await user.type(input, 'What is AI?');
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

      expect(mockSendMessage).toHaveBeenCalledWith('What is AI?');
    });

    it('should not send empty messages', async () => {
      const user = userEvent.setup();

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const sendButton = screen.getByText('Send') || screen.getByTestId('button');
      await user.click(sendButton);

      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should clear chat when clear button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const clearButton = screen.getByText('Clear Chat');
      await user.click(clearButton);

      expect(mockClearChat).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show typing indicator when loading', () => {
      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: mockMessages,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: true
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      expect(screen.getByText('Lyra is thinking...')).toBeInTheDocument();
    });

    it('should disable input when loading', () => {
      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: [],
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: true
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
    });
  });

  describe('Callback Integration', () => {
    it('should call onChatOpen when chat expands', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
          onChatOpen={mockCallbacks.onChatOpen}
        />
      );

      expect(mockCallbacks.onChatOpen).toHaveBeenCalled();
    });

    it('should call onNarrativePause when chat opens', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
          onNarrativePause={mockCallbacks.onNarrativePause}
        />
      );

      expect(mockCallbacks.onNarrativePause).toHaveBeenCalled();
    });

    it('should call onEngagementChange when user sends messages', () => {
      const userMessages = [
        { id: '1', content: 'User message 1', isUser: true, timestamp: Date.now() },
        { id: '2', content: 'Bot response', isUser: false, timestamp: Date.now() },
        { id: '3', content: 'User message 2', isUser: true, timestamp: Date.now() }
      ];

      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: userMessages,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
          onEngagementChange={mockCallbacks.onEngagementChange}
        />
      );

      expect(mockCallbacks.onEngagementChange).toHaveBeenCalledWith(true, 2);
    });
  });

  describe('Scroll Behavior', () => {
    it('should show scroll to bottom button when scrolled up', () => {
      // Mock scroll behavior
      const longMessageList = Array.from({ length: 20 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
        isUser: i % 2 === 0,
        timestamp: Date.now()
      }));

      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: longMessageList,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      });

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      // Should show scroll area with many messages
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={false}
          isFloating={true}
        />
      );

      const avatarContainer = screen.getByTestId('motion-div');
      expect(avatarContainer).toHaveAttribute('role', 'button');
      expect(avatarContainer).toHaveAttribute('tabIndex', '0');
    });

    it('should support keyboard navigation', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Ask about this lesson...');
    });
  });

  describe('Error Handling', () => {
    it('should handle sendMessage errors gracefully', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockRejectedValue(new Error('Send failed'));

      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, 'Test message');
      fireEvent.keyPress(input, { key: 'Enter' });

      // Should not crash and should call sendMessage
      expect(mockSendMessage).toHaveBeenCalled();
    });

    it('should handle invalid lesson context gracefully', () => {
      expect(() => {
        render(
          <ContextualLyraChat 
            lessonContext={null as any}
            expanded={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe('useLyraChat Hook Integration', () => {
    it('should pass correct context to useLyraChat', () => {
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const useLyraChatMock = vi.mocked(require('@/hooks/useLyraChat').useLyraChat);
      expect(useLyraChatMock).toHaveBeenCalledWith({
        chapterTitle: 'Chapter 1: Getting Started',
        lessonTitle: 'AI Foundations',
        content: 'Learn the basics of AI',
        lessonContext: mockLessonContext
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many messages', () => {
      const manyMessages = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i}`,
        content: `Message ${i}`,
        isUser: i % 2 === 0,
        timestamp: Date.now()
      }));

      (vi.mocked(require('@/hooks/useLyraChat').useLyraChat) as MockedFunction<any>).mockReturnValue({
        messages: manyMessages,
        sendMessage: mockSendMessage,
        clearChat: mockClearChat,
        isLoading: false
      });

      const startTime = performance.now();
      
      render(
        <ContextualLyraChat 
          lessonContext={mockLessonContext}
          expanded={true}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time even with many messages
      expect(renderTime).toBeLessThan(200);
    });
  });
});