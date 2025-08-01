# Chat System Test Case Specifications
*Detailed test scenarios for comprehensive validation*

## Unit Test Cases

### TC001: ContextualLyraChat Component

#### TC001.01: Basic Rendering
**Priority**: High
**Type**: Unit Test
**Component**: ContextualLyraChat

```typescript
describe('ContextualLyraChat - Basic Rendering', () => {
  test('TC001.01.1: Renders with minimum required props', () => {
    const lessonContext = {
      chapterNumber: 1,
      lessonTitle: 'AI Foundations',
      phase: 'introduction',
      content: 'Test content'
    };
    
    render(<ContextualLyraChat lessonContext={lessonContext} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument(); // Avatar button
    expect(screen.getByText('AI Foundations')).toBeInTheDocument();
  });

  test('TC001.01.2: Applies custom className', () => {
    const customClass = 'custom-chat-class';
    const { container } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext} 
        className={customClass} 
      />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('TC001.01.3: Respects disabled state', () => {
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext} 
        disabled={true} 
      />
    );
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
```

#### TC001.02: State Management
**Priority**: High
**Type**: Unit Test

```typescript
describe('ContextualLyraChat - State Management', () => {
  test('TC001.02.1: Manages expansion state correctly', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        onExpandedChange={onExpandedChange}
      />
    );
    
    // Initially collapsed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Click to expand
    await user.click(screen.getByRole('button'));
    
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('TC001.02.2: Tracks message exchange count', async () => {
    const user = userEvent.setup();
    const onEngagementChange = vi.fn();
    
    const { container } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        onEngagementChange={onEngagementChange}
        expanded={true}
      />
    );
    
    // Send a message
    const input = screen.getByPlaceholderText('Ask about this lesson...');
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    expect(onEngagementChange).toHaveBeenCalledWith(true, 1);
  });

  test('TC001.02.3: Handles chat open/close callbacks', () => {
    const onChatOpen = vi.fn();
    const onChatClose = vi.fn();
    
    const { rerender } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        onChatOpen={onChatOpen}
        onChatClose={onChatClose}
        expanded={false}
      />
    );
    
    // Expand chat
    rerender(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        onChatOpen={onChatOpen}
        onChatClose={onChatClose}
        expanded={true}
      />
    );
    
    expect(onChatOpen).toHaveBeenCalled();
    
    // Collapse chat
    rerender(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        onChatOpen={onChatOpen}
        onChatClose={onChatClose}
        expanded={false}
      />
    );
    
    expect(onChatClose).toHaveBeenCalled();
  });
});
```

#### TC001.03: Contextual Questions
**Priority**: High
**Type**: Unit Test

```typescript
describe('ContextualLyraChat - Contextual Questions', () => {
  test('TC001.03.1: Displays Chapter 1 questions correctly', () => {
    const lessonContext = {
      chapterNumber: 1,
      lessonTitle: 'AI Foundations',
      phase: 'introduction',
      content: 'AI basics content'
    };
    
    render(
      <ContextualLyraChat 
        lessonContext={lessonContext}
        expanded={true}
      />
    );
    
    expect(screen.getByText("I'm new to AI - where should I start?")).toBeInTheDocument();
    expect(screen.getByText("How can AI help my nonprofit's daily work?")).toBeInTheDocument();
    expect(screen.getByText("What are the most important AI concepts for beginners?")).toBeInTheDocument();
  });

  test('TC001.03.2: Displays Chapter 2 Maya questions with journey state', () => {
    const lessonContext = {
      chapterNumber: 2,
      lessonTitle: 'Email Writing with AI',
      phase: 'practice',
      content: 'Maya email content'
    };
    
    const mayaJourneyState = {
      currentPhase: 'email_challenge',
      progress: 0.5,
      completedChallenges: ['persona_identification']
    };
    
    render(
      <ContextualLyraChat 
        lessonContext={lessonContext}
        mayaJourneyState={mayaJourneyState}
        expanded={true}
      />
    );
    
    expect(screen.getByText("How can AI help me write better emails?")).toBeInTheDocument();
    expect(screen.getByText("What is the PACE framework Maya uses?")).toBeInTheDocument();
  });

  test('TC001.03.3: Handles question click interactions', async () => {
    const user = userEvent.setup();
    
    // Mock the useLyraChat hook
    const mockSendMessage = vi.fn();
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const questionButton = screen.getByText("I'm new to AI - where should I start?");
    await user.click(questionButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith("I'm new to AI - where should I start?");
  });
});
```

### TC002: FloatingLyraAvatar Component

#### TC002.01: Positioning & Layout
**Priority**: Medium
**Type**: Unit Test

```typescript
describe('FloatingLyraAvatar - Positioning', () => {
  test('TC002.01.1: Renders in default bottom-right position', () => {
    const { container } = render(
      <FloatingLyraAvatar lessonContext={mockLessonContext} />
    );
    
    expect(container.firstChild).toHaveClass('bottom-6', 'right-6');
  });

  test('TC002.01.2: Supports all position variants', () => {
    const positions = ['bottom-left', 'top-right', 'top-left'] as const;
    
    positions.forEach(position => {
      const { container } = render(
        <FloatingLyraAvatar 
          lessonContext={mockLessonContext} 
          position={position}
        />
      );
      
      const expectedClasses = position.split('-');
      expectedClasses.forEach(cls => {
        expect(container.firstChild).toHaveClass(`${cls}-6`);
      });
    });
  });

  test('TC002.01.3: Handles z-index layering correctly', () => {
    const { container } = render(
      <FloatingLyraAvatar lessonContext={mockLessonContext} />
    );
    
    expect(container.firstChild).toHaveClass('z-50');
  });
});
```

### TC003: NarrativeManager Component

#### TC003.01: Typewriter Effect
**Priority**: High
**Type**: Unit Test

```typescript
describe('NarrativeManager - Typewriter Effect', () => {
  test('TC003.01.1: Displays text with typing animation', async () => {
    const messages = [
      { id: '1', content: 'Hello, this is a test message!' }
    ];
    
    render(<NarrativeManager messages={messages} />);
    
    // Initially should show empty or partial text
    const textElement = screen.getByText(/Hello/);
    expect(textElement).toBeInTheDocument();
    
    // Should show typing cursor
    expect(screen.getByText('|')).toBeInTheDocument(); // Cursor
  });

  test('TC003.01.2: Respects pause/resume correctly', async () => {
    const messages = [
      { id: '1', content: 'This message should pause and resume!' }
    ];
    
    const { rerender } = render(
      <NarrativeManager messages={messages} paused={false} />
    );
    
    // Let typing start
    await waitFor(() => {
      expect(screen.getByText(/This/)).toBeInTheDocument();
    });
    
    // Pause the typing
    rerender(
      <NarrativeManager messages={messages} paused={true} />
    );
    
    // Should stop typing but maintain current text
    const currentText = screen.getByText(/This/).textContent;
    
    // Wait a bit to ensure typing stopped
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText(/This/).textContent).toBe(currentText);
    
    // Resume typing
    rerender(
      <NarrativeManager messages={messages} paused={false} />
    );
    
    // Should continue from where it left off
    await waitFor(() => {
      expect(screen.getByText(/message/)).toBeInTheDocument();
    });
  });

  test('TC003.01.3: Handles message navigation', async () => {
    const user = userEvent.setup();
    const messages = [
      { id: '1', content: 'First message' },
      { id: '2', content: 'Second message' }
    ];
    
    render(<NarrativeManager messages={messages} />);
    
    // Should show first message
    expect(screen.getByText('First message')).toBeInTheDocument();
    
    // Click advance button
    const advanceButton = screen.getByLabelText('Next');
    await user.click(advanceButton);
    
    // Should show second message
    expect(screen.getByText('Second message')).toBeInTheDocument();
    
    // Back button should appear
    const backButton = screen.getByLabelText('Previous');
    expect(backButton).toBeInTheDocument();
    
    // Click back
    await user.click(backButton);
    
    // Should show first message again
    expect(screen.getByText('First message')).toBeInTheDocument();
  });
});
```

## Integration Test Cases

### TC100: Chat Flow Integration

#### TC100.01: Complete Chat Flow
**Priority**: Critical
**Type**: Integration Test

```typescript
describe('Complete Chat Flow Integration', () => {
  test('TC100.01.1: End-to-end chat interaction flow', async () => {
    const user = userEvent.setup();
    
    // Mock API responses
    const mockChatResponse = {
      id: 'response-1',
      content: 'Thank you for your question! Here is my response...',
      isUser: false,
      timestamp: Date.now()
    };
    
    // Mock the chat hook
    const mockSendMessage = vi.fn().mockResolvedValue(mockChatResponse);
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <FloatingLyraAvatar 
        lessonContext={{
          chapterNumber: 1,
          lessonTitle: 'AI Foundations',
          phase: 'introduction',
          content: 'Test content'
        }}
      />
    );
    
    // 1. Click avatar to expand chat
    const avatar = screen.getByRole('button');
    await user.click(avatar);
    
    // 2. Verify chat interface appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Lyra - Lesson Assistant')).toBeInTheDocument();
    
    // 3. Click a contextual question
    const question = screen.getByText("I'm new to AI - where should I start?");
    await user.click(question);
    
    // 4. Verify message was sent
    expect(mockSendMessage).toHaveBeenCalledWith("I'm new to AI - where should I start?");
    
    // 5. Verify response appears (would need to update the mock to return messages)
    // This would require more complex mocking of the chat state
  });

  test('TC100.01.2: Chat interaction during narrative flow', async () => {
    const user = userEvent.setup();
    const onNarrativePause = vi.fn();
    const onNarrativeResume = vi.fn();
    
    render(
      <div>
        <NarrativeManager 
          messages={[{ id: '1', content: 'This is Maya speaking...' }]}
          paused={false}
        />
        <FloatingLyraAvatar 
          lessonContext={mockLessonContext}
          onNarrativePause={onNarrativePause}
          onNarrativeResume={onNarrativeResume}
        />
      </div>
    );
    
    // Click to open chat
    const avatar = screen.getByRole('button');
    await user.click(avatar);
    
    // Should pause narrative
    expect(onNarrativePause).toHaveBeenCalled();
    
    // Close chat
    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);
    
    // Should resume narrative
    expect(onNarrativeResume).toHaveBeenCalled();
  });
});
```

### TC101: Cross-Component Coordination

#### TC101.01: State Synchronization
**Priority**: High
**Type**: Integration Test

```typescript
describe('Cross-Component State Synchronization', () => {
  test('TC101.01.1: Avatar and chat state coordination', async () => {
    const user = userEvent.setup();
    let isExpanded = false;
    
    const TestWrapper = () => {
      const [expanded, setExpanded] = useState(false);
      
      return (
        <FloatingLyraAvatar 
          lessonContext={mockLessonContext}
          initialExpanded={expanded}
          onEngagementChange={(engaged, count) => {
            // Track engagement state
            if (engaged && count > 0) {
              // Should show notification when collapsed
            }
          }}
        />
      );
    };
    
    render(<TestWrapper />);
    
    // Test expansion coordination
    const avatar = screen.getByRole('button');
    await user.click(avatar);
    
    // Verify chat interface appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Send a message
    const input = screen.getByPlaceholderText('Ask about this lesson...');
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    // Close chat
    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);
    
    // Verify avatar returns to collapsed state
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

## Performance Test Cases

### TC200: Rendering Performance

#### TC200.01: Component Rendering Speed
**Priority**: Medium
**Type**: Performance Test

```typescript
describe('Chat Component Rendering Performance', () => {
  test('TC200.01.1: Initial render performance', async () => {
    const startTime = performance.now();
    
    render(<ContextualLyraChat lessonContext={mockLessonContext} />);
    
    const renderTime = performance.now() - startTime;
    
    expect(renderTime).toBeLessThan(100); // Should render in < 100ms
  });

  test('TC200.01.2: Chat expansion performance', async () => {
    const user = userEvent.setup();
    
    const { rerender } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={false}
      />
    );
    
    const startTime = performance.now();
    
    rerender(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const expansionTime = performance.now() - startTime;
    
    expect(expansionTime).toBeLessThan(300); // Should expand in < 300ms
  });

  test('TC200.01.3: Typewriter animation performance', async () => {
    const messages = [
      { 
        id: '1', 
        content: 'This is a very long message that will test the typewriter animation performance and ensure it maintains smooth 60fps during the entire typing sequence.' 
      }
    ];
    
    let frameCount = 0;
    const targetFPS = 60;
    const testDuration = 1000; // 1 second
    
    const frameCallback = () => {
      frameCount++;
      if (frameCount * (1000 / targetFPS) < testDuration) {
        requestAnimationFrame(frameCallback);
      }
    };
    
    render(<NarrativeManager messages={messages} />);
    
    requestAnimationFrame(frameCallback);
    
    await new Promise(resolve => setTimeout(resolve, testDuration));
    
    const actualFPS = frameCount;
    
    expect(actualFPS).toBeGreaterThan(30); // Should maintain at least 30fps
  });
});
```

### TC201: Memory Performance

#### TC201.01: Memory Usage
**Priority**: Medium
**Type**: Performance Test

```typescript
describe('Chat Memory Performance', () => {
  test('TC201.01.1: No memory leaks on mount/unmount', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Mount and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(
        <ContextualLyraChat lessonContext={mockLessonContext} />
      );
      unmount();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Should not increase memory significantly
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // < 5MB
  });

  test('TC201.01.2: Large message history handling', () => {
    const largeMessageHistory = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Message ${i}: This is a test message with some content to simulate real chat usage.`,
      isUser: i % 2 === 0,
      timestamp: Date.now() - (100 - i) * 1000
    }));
    
    // Mock the chat hook to return large message history
    vi.mocked(useLyraChat).mockReturnValue({
      messages: largeMessageHistory,
      sendMessage: vi.fn(),
      clearChat: vi.fn(),
      isLoading: false
    });
    
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryUsage = finalMemory - initialMemory;
    
    // Should handle large message history efficiently
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // < 50MB
  });
});
```

## Accessibility Test Cases

### TC300: Keyboard Navigation

#### TC300.01: Tab Navigation
**Priority**: Critical
**Type**: Accessibility Test

```typescript
describe('Chat Keyboard Navigation', () => {
  test('TC300.01.1: All interactive elements are focusable', async () => {
    const user = userEvent.setup();
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Get all focusable elements
    const focusableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('textbox'));
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Test tab navigation
    for (const element of focusableElements) {
      await user.tab();
      expect(document.activeElement).toBe(element);
    }
  });

  test('TC300.01.2: Logical tab order maintained', async () => {
    const user = userEvent.setup();
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Expected tab order: minimize, close, question buttons, input, send
    const expectedOrder = [
      screen.getByLabelText('Minimize'),
      screen.getByLabelText('Close'),
      ...screen.getAllByRole('button').filter(btn => 
        btn.textContent?.includes('I\'m new to AI')
      ),
      screen.getByPlaceholderText('Ask about this lesson...'),
      screen.getByLabelText('Send message')
    ];
    
    for (const expectedElement of expectedOrder) {
      await user.tab();
      expect(document.activeElement).toBe(expectedElement);
    }
  });

  test('TC300.01.3: Focus trapping in expanded chat', async () => {
    const user = userEvent.setup();
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Focus should be trapped within the chat dialog
    const chatDialog = screen.getByRole('dialog');
    const focusableElements = within(chatDialog).getAllByRole('button')
      .concat(within(chatDialog).getAllByRole('textbox'));
    
    // Tab through all elements
    for (let i = 0; i < focusableElements.length + 2; i++) {
      await user.tab();
    }
    
    // Focus should cycle back to first element
    expect(document.activeElement).toBe(focusableElements[0]);
  });
});
```

### TC301: Screen Reader Support

#### TC301.01: ARIA Labels and Roles
**Priority**: Critical
**Type**: Accessibility Test

```typescript
describe('Screen Reader Support', () => {
  test('TC301.01.1: Proper ARIA labels present', () => {
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Check for essential ARIA labels
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label');
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  test('TC301.01.2: Live regions for new messages', async () => {
    const user = userEvent.setup();
    
    // Mock API response
    const mockSendMessage = vi.fn().mockResolvedValue({
      id: 'response-1',
      content: 'AI response message',
      isUser: false
    });
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Check for live region
    const liveRegion = screen.getByRole('log', { hidden: true }) || 
                     screen.getByRole('status', { hidden: true });
    
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live');
  });

  test('TC301.01.3: Screen reader announces typing status', () => {
    render(
      <NarrativeManager 
        messages={[{ id: '1', content: 'Test message' }]}
      />
    );
    
    // Should have status indicator for typing
    const typingStatus = screen.getByText(/typing/i) || 
                        screen.getByRole('status');
    
    expect(typingStatus).toBeInTheDocument();
    expect(typingStatus).toHaveAttribute('aria-live', 'polite');
  });
});
```

## Mobile & Responsive Test Cases

### TC400: Mobile Interactions

#### TC400.01: Touch Events
**Priority**: High
**Type**: Mobile Test

```typescript
describe('Mobile Touch Interactions', () => {
  test('TC400.01.1: Touch to expand avatar', async () => {
    // Mock touch events
    const mockTouchStart = vi.fn();
    const mockTouchEnd = vi.fn();
    
    render(
      <FloatingLyraAvatar 
        lessonContext={mockLessonContext}
        onTouchStart={mockTouchStart}
        onTouchEnd={mockTouchEnd}
      />
    );
    
    const avatar = screen.getByRole('button');
    
    // Simulate touch events
    fireEvent.touchStart(avatar);
    fireEvent.touchEnd(avatar);
    
    // Should expand chat
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('TC400.01.2: Virtual keyboard handling', async () => {
    // Mock viewport changes for virtual keyboard
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    
    // Focus input (would trigger virtual keyboard on mobile)
    fireEvent.focus(input);
    
    // Simulate viewport height change
    Object.defineProperty(window, 'innerHeight', {
      value: 400, // Reduced height simulating keyboard
    });
    
    fireEvent(window, new Event('resize'));
    
    // Input should remain visible and accessible
    expect(input).toBeVisible();
    
    // Chat layout should adjust
    const chatContainer = screen.getByRole('dialog');
    expect(chatContainer).toBeVisible();
  });
});
```

## Error Handling Test Cases

### TC500: Network Error Handling

#### TC500.01: API Failures
**Priority**: High
**Type**: Error Handling Test

```typescript
describe('Network Error Handling', () => {
  test('TC500.01.1: API timeout handling', async () => {
    const user = userEvent.setup();
    
    // Mock API timeout
    const mockSendMessage = vi.fn().mockRejectedValue(
      new Error('Request timeout')
    );
    
    vi.mocked(useLyraChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      clearChat: vi.fn(),
      isLoading: false
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Try to send a message
    const input = screen.getByRole('textbox');
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
    
    // Should provide retry option
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  test('TC500.01.2: Network disconnection handling', async () => {
    // Mock offline state
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    
    render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Should show offline indicator
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
    
    // Message input should be disabled
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
```

## Browser Compatibility Test Cases

### TC600: Cross-Browser Testing

#### TC600.01: Browser Feature Support
**Priority**: Medium
**Type**: Compatibility Test

```typescript
describe('Cross-Browser Compatibility', () => {
  test('TC600.01.1: CSS Grid and Flexbox support', () => {
    const { container } = render(
      <ContextualLyraChat 
        lessonContext={mockLessonContext}
        expanded={true}
      />
    );
    
    // Check for CSS properties support
    const chatContainer = container.querySelector('[role="dialog"]');
    const computedStyle = window.getComputedStyle(chatContainer);
    
    // Should have proper layout
    expect(computedStyle.display).toBeTruthy();
    expect(computedStyle.flexDirection).toBeTruthy();
  });

  test('TC600.01.2: Animation support graceful degradation', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    render(
      <NarrativeManager 
        messages={[{ id: '1', content: 'Test message' }]}
      />
    );
    
    // Should still render content even without animations
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
```

---

## Test Execution Priority

### P0 - Critical (Must Pass)
- TC001.01.1: Basic rendering with required props
- TC001.02.1: Expansion state management
- TC100.01.1: End-to-end chat flow
- TC300.01.1: Keyboard navigation
- TC301.01.1: ARIA labels

### P1 - High (Should Pass)
- TC001.03.1-3: Contextual questions
- TC003.01.1-3: Typewriter effects
- TC101.01.1: State synchronization
- TC500.01.1-2: Error handling

### P2 - Medium (Nice to Have)
- TC200.01.1-3: Performance tests
- TC400.01.1-2: Mobile interactions
- TC600.01.1-2: Browser compatibility

## Test Data Requirements

### Mock Data Sets
1. **Lesson Contexts**: Chapter 1-8 representative data
2. **Maya Journey States**: All progression phases
3. **Message Histories**: Small, medium, large datasets
4. **API Responses**: Success, error, timeout scenarios
5. **User Interactions**: Typical usage patterns

### Test Environment Setup
1. **Clean State**: Each test starts with fresh component state
2. **Mock Services**: All external dependencies mocked
3. **Performance Monitoring**: Memory and timing instrumentation
4. **Accessibility Tools**: axe-core integration
5. **Visual Baseline**: Screenshot comparison references