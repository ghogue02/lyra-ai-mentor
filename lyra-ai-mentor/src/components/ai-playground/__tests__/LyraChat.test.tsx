import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LyraChat } from '../LyraChat';
import { CharacterStoryProvider } from '@/contexts/CharacterStoryContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
jest.mock('@/hooks/useLyraChat', () => ({
  useLyraChat: () => ({
    messages: [
      {
        id: '1',
        content: 'Hi! I\'m Lyra, your AI mentor.',
        isUser: false,
        timestamp: new Date()
      }
    ],
    isTyping: false,
    inputValue: '',
    setInputValue: jest.fn(),
    sendMessage: jest.fn(),
    clearChat: jest.fn(),
    userProfile: null,
    engagement: { exchangeCount: 0 }
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CharacterStoryProvider>
        {children}
      </CharacterStoryProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('LyraChat', () => {
  it('renders chat button when collapsed', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={false} />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Open chat with Lyra')).toBeInTheDocument();
  });

  it('renders full chat interface when expanded', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Lyra')).toBeInTheDocument();
    expect(screen.getByText('Your AI Mentor')).toBeInTheDocument();
  });

  it('displays character-specific context when provided', () => {
    render(
      <TestWrapper>
        <LyraChat 
          isExpanded={true} 
          characterContext="maya"
          lessonContext={{
            lessonTitle: "Email Excellence"
          }}
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Helping with Email Composition')).toBeInTheDocument();
  });

  it('shows voice control buttons', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Enable voice input')).toBeInTheDocument();
    expect(screen.getByLabelText('Mute responses')).toBeInTheDocument();
  });

  it('displays messages correctly', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    expect(screen.getByText("Hi! I'm Lyra, your AI mentor.")).toBeInTheDocument();
  });

  it('shows quick actions based on character context', () => {
    render(
      <TestWrapper>
        <LyraChat 
          isExpanded={true} 
          characterContext="maya"
        />
      </TestWrapper>
    );
    
    expect(screen.getByText('Help me write a professional email')).toBeInTheDocument();
  });

  it('toggles voice input when mic button is clicked', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    const voiceButton = screen.getByLabelText('Enable voice input');
    fireEvent.click(voiceButton);
    
    expect(screen.getByLabelText('Disable voice input')).toBeInTheDocument();
  });

  it('toggles audio output when volume button is clicked', () => {
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    const audioButton = screen.getByLabelText('Mute responses');
    fireEvent.click(audioButton);
    
    expect(screen.getByLabelText('Unmute responses')).toBeInTheDocument();
  });

  it('calls onToggleExpanded when close button is clicked', () => {
    const mockToggle = jest.fn();
    render(
      <TestWrapper>
        <LyraChat isExpanded={true} onToggleExpanded={mockToggle} />
      </TestWrapper>
    );
    
    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);
    
    expect(mockToggle).toHaveBeenCalled();
  });

  it('renders typing indicator when AI is thinking', () => {
    jest.mock('@/hooks/useLyraChat', () => ({
      useLyraChat: () => ({
        messages: [],
        isTyping: true,
        inputValue: '',
        setInputValue: jest.fn(),
        sendMessage: jest.fn(),
        clearChat: jest.fn(),
        userProfile: null,
        engagement: { exchangeCount: 0 }
      })
    }));

    render(
      <TestWrapper>
        <LyraChat isExpanded={true} />
      </TestWrapper>
    );
    
    expect(screen.getByText('Lyra is thinking...')).toBeInTheDocument();
  });
});