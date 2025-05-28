
import React, { useRef, useEffect, useState } from 'react';
import { useLyraChat } from '@/hooks/useLyraChat';
import { useChatEngagement } from '@/hooks/useChatEngagement';
import { ChatHeader } from './chat/ChatHeader';
import { QuickActions } from './chat/QuickActions';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { CloseConfirmationDialog } from './chat/CloseConfirmationDialog';

interface FullScreenChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
  onEngagementChange?: (engagement: { hasReachedMinimum: boolean; exchangeCount: number }) => void;
  initialEngagementCount?: number;
}

export const FullScreenChatOverlay: React.FC<FullScreenChatOverlayProps> = ({
  isOpen,
  onClose,
  lessonContext,
  suggestedTask,
  onEngagementChange,
  initialEngagementCount = 0
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    userProfile
  } = useLyraChat(lessonContext);

  const { engagement, incrementExchange, resetEngagement, setEngagementCount } = useChatEngagement(3, initialEngagementCount);

  // Initialize engagement count with database value when component mounts
  useEffect(() => {
    console.log('FullScreenChatOverlay: Initializing with engagement count:', initialEngagementCount);
    if (initialEngagementCount > 0) {
      setEngagementCount(initialEngagementCount);
    }
  }, [initialEngagementCount, setEngagementCount]);

  // Notify parent component of engagement changes
  useEffect(() => {
    console.log('FullScreenChatOverlay: Notifying parent of engagement change:', engagement);
    onEngagementChange?.(engagement);
  }, [engagement, onEngagementChange]);

  // Track when we should increment engagement based on actual message exchanges
  useEffect(() => {
    const userMessageCount = messages.filter(msg => msg.isUser).length;
    const aiMessageCount = messages.filter(msg => !msg.isUser).length;
    
    // Only count as an exchange if we have both a user message and AI response
    const actualExchanges = Math.min(userMessageCount, aiMessageCount);
    
    console.log('FullScreenChatOverlay: Message analysis:', {
      userMessages: userMessageCount,
      aiMessages: aiMessageCount,
      actualExchanges,
      currentEngagement: engagement.exchangeCount
    });

    // Update engagement count if we have more actual exchanges than recorded
    if (actualExchanges > engagement.exchangeCount) {
      console.log('FullScreenChatOverlay: Updating engagement count to match actual exchanges');
      setEngagementCount(actualExchanges);
    }
  }, [messages, engagement.exchangeCount, setEngagementCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    inputRef.current?.focus();
    
    // Hide quick actions after first message on mobile to save space
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  const handleAiDemo = () => {
    console.log('Starting AI Magic Demo');
    sendMessage("Show me how AI transforms fundraising data into actionable insights!");
    setShowQuickActions(false);
  };

  const handleClose = () => {
    if (!engagement.hasReachedMinimum && engagement.exchangeCount > 0) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  const forceClose = () => {
    setShowCloseConfirmation(false);
    onClose();
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action triggered');
    sendMessage(action);
    
    // Hide quick actions after use on mobile
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  const handleResetChat = () => {
    clearChat();
    resetEngagement();
    setShowQuickActions(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/80" onClick={handleClose} />
      
      {/* Chat Container */}
      <div className="fixed inset-0 z-[101] grid grid-rows-[auto_auto_1fr_auto] w-screen h-screen bg-gray-900">
        <ChatHeader
          lessonContext={lessonContext}
          engagement={engagement}
          onClose={handleClose}
        />

        {showQuickActions && (
          <QuickActions
            lessonContext={lessonContext}
            suggestedTask={suggestedTask}
            onQuickAction={handleQuickAction}
            onResetChat={handleResetChat}
            userProfile={userProfile}
          />
        )}

        <div className="overflow-hidden">
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            engagement={engagement}
            messagesEndRef={messagesEndRef}
            onForceClose={forceClose}
            onSendMessage={sendMessage}
          />
        </div>
        
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          onAiDemo={handleAiDemo}
          isTyping={isTyping}
          inputRef={inputRef}
          engagement={engagement}
        />
      </div>

      <CloseConfirmationDialog
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onForceClose={forceClose}
        exchangeCount={engagement.exchangeCount}
      />
    </>
  );
};
