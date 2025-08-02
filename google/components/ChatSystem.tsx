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
        className="group cursor-pointer animate-scale-in transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={toggleExpanded}
      >
        <div className="relative">
          <LyraAvatar 
            size="lg" 
            withWave={true} 
            expression="helping"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300" 
          />
        </div>
        
        {/* Simple tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
            Chat with Lyra
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded chat interface
  return (
    <div
      className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full animate-scale-in-spring"
    >
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <LyraAvatar size="sm" expression="helping" />
            <div>
              <h3 className="font-medium text-sm text-gray-900">Lyra</h3>
              <p className="text-xs text-gray-500">AI Learning Companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={minimize}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMinimized ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </button>
            <button
              onClick={close}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick Questions (shown when no messages) */}
            {messages.length === 0 && <QuickQuestions />}
            
            {/* Messages Area */}
            {messages.length > 0 && (
              <div className="flex-1 min-h-0">
                <MessageList />
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="px-4 pb-4">
                    <div className="flex items-start gap-3">
                      <LyraAvatar size="sm" expression="thinking" />
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <TypewriterText 
                          text="..." 
                          speed={500}
                          showCursor={true}
                          className="text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div id="chat-messages-end" />
              </div>
            )}

            {/* Input Area */}
            <ChatInput />
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
        "fixed z-50 max-w-sm w-full h-[500px]",
        positionClasses[position],
        className
      )}>
        <ChatWidget />
      </div>
    </ChatProvider>
  );
};

export default ChatSystem;