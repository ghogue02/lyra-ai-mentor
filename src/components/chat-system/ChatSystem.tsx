import React, { useEffect, useCallback } from 'react';
import { ChatProvider, useChatState, useChatActions } from './core/ChatContext';
import { LyraAvatar } from '@/components/LyraAvatar';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { QuickQuestions } from './components/QuickQuestions';
import { TypewriterText } from './components/TypewriterText';
import { cn } from '@/lib/utils';
import type { LessonModule } from './types/chatTypes';

interface ChatSystemProps {
  lessonModule: LessonModule;
  onNarrativePause?: () => void;
  onNarrativeResume?: () => void;
  onEngagementChange?: (isEngaged: boolean, messageCount: number) => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
  initialExpanded?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6', 
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

// Internal chat widget component
const ChatWidget: React.FC = () => {
  const { state } = useChatState();
  const { toggleExpanded, minimize, close, sendMessage } = useChatActions();
  
  const { isExpanded, isMinimized, messages, isTyping, currentLesson } = state;

  // Auto-scroll management with RAF for smooth performance
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const messagesEnd = document.getElementById('chat-messages-end');
      messagesEnd?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Floating avatar (collapsed state)
  if (!isExpanded) {
    return (
      <div
        className="group cursor-pointer nm-interactive nm-card nm-shadow-floating"
        onClick={toggleExpanded}
      >
        <div className="nm-p-sm">
          <LyraAvatar 
            size="lg" 
            withWave={true} 
            expression="helping"
            className="nm-shadow-accent nm-animate-float" 
          />
        </div>
        
        {/* Neumorphic tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="nm-card nm-glass nm-p-sm nm-text-primary nm-rounded-md">
            <span className="text-xs font-medium whitespace-nowrap">Chat with Lyra</span>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded chat interface - neumorphic glass design
  return (
    <div
      className={cn(
        "nm-hero-card nm-glass flex flex-col animate-scale-in-spring overflow-hidden",
        isMinimized ? "h-auto" : "h-[600px] w-96"
      )}
    >
        {/* Neumorphic Header */}
        <div className="flex items-center justify-between nm-p-lg border-b border-white/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="nm-avatar nm-shadow-subtle">
              <LyraAvatar size="sm" expression="helping" />
            </div>
            <div>
              <h3 className="font-medium text-sm nm-text-primary">Lyra</h3>
              <p className="text-xs nm-text-secondary">AI Learning Companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={minimize}
              className="nm-button-ghost w-8 h-8 flex items-center justify-center nm-rounded-md nm-interactive hover:nm-surface-elevated transition-all duration-200"
              title={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? (
                <svg className="w-4 h-4 nm-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5" />
                </svg>
              ) : (
                <svg className="w-4 h-4 nm-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </button>
            <button
              onClick={close}
              className="nm-button-ghost w-8 h-8 flex items-center justify-center nm-rounded-md nm-interactive hover:nm-surface-elevated transition-all duration-200"
              title="Close chat"
            >
              <svg className="w-4 h-4 nm-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Quick Questions (shown when no messages) */}
            {messages.length === 0 && (
              <div className="flex-shrink-0">
                <QuickQuestions />
              </div>
            )}
            
            {/* Messages Area with proper scrolling */}
            {messages.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <MessageList />
                  
                  {/* Neumorphic Typing indicator */}
                  {isTyping && (
                    <div className="nm-p-lg">
                      <div className="flex items-start gap-3">
                        <div className="nm-avatar nm-shadow-subtle">
                          <LyraAvatar size="sm" expression="thinking" />
                        </div>
                        <div className="nm-card nm-surface-sunken nm-p-md nm-rounded-xl">
                          <TypewriterText 
                            text="..." 
                            speed={500}
                            showCursor={true}
                            className="nm-text-secondary"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div id="chat-messages-end" />
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0">
              <ChatInput />
            </div>
          </div>
        )}
      </div>
  );
};

// Main ChatSystem component
export const ChatSystem: React.FC<ChatSystemProps> = ({
  lessonModule,
  onNarrativePause,
  onNarrativeResume,
  onEngagementChange,
  className,
  position = 'bottom-right',
  disabled = false,
  initialExpanded = false
}) => {
  if (disabled) {
    return null;
  }

  return (
    <ChatProvider
      lessonModule={lessonModule}
      onNarrativePause={onNarrativePause}
      onNarrativeResume={onNarrativeResume}
      onEngagementChange={onEngagementChange}
      initialExpanded={initialExpanded}
    >
      <div className={cn(
        "fixed z-50 max-w-sm w-full",
        positionClasses[position],
        className
      )}>
        <ChatWidget />
      </div>
    </ChatProvider>
  );
};

export default ChatSystem;