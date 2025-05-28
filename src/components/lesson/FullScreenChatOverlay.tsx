import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLyraChat } from '@/hooks/useLyraChat';
import { useChatEngagement } from '@/hooks/useChatEngagement';
import { ChatHeader } from './chat/ChatHeader';
import { QuickActions } from './chat/QuickActions';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { CloseConfirmationDialog } from './chat/CloseConfirmationDialog';
import { InteractiveAiDemo } from './chat/InteractiveAiDemo';

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
  const [hasIncrementedForCurrentMessage, setHasIncrementedForCurrentMessage] = useState(false);
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);

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

  // Check if we should show the interactive demo - improved detection
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      const content = lastMessage.content.toLowerCase();
      const showDemo = content.includes('ai magic demo') || 
                      content.includes('show me how ai transforms') ||
                      content.includes('ai data analysis demo') ||
                      content.includes('ready to see how ai transforms') ||
                      content.includes('transforms fundraising data');
      console.log('Demo detection check:', { content: content.substring(0, 100), showDemo });
      setShowInteractiveDemo(showDemo);
    }
  }, [messages]);

  // Also check for demo trigger from quick actions
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.isUser);
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage) {
      const content = lastUserMessage.content.toLowerCase();
      const isDemoRequest = content.includes('ai magic demo') || 
                           content.includes('show me the ai magic demo');
      console.log('User demo request check:', { content, isDemoRequest });
      if (isDemoRequest) {
        setShowInteractiveDemo(true);
      }
    }
  }, [messages]);

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
    if (actualExchanges > engagement.exchangeCount && !hasIncrementedForCurrentMessage) {
      console.log('FullScreenChatOverlay: Updating engagement count to match actual exchanges');
      setEngagementCount(actualExchanges);
      setHasIncrementedForCurrentMessage(true);
    }
  }, [messages, engagement.exchangeCount, setEngagementCount, hasIncrementedForCurrentMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasIncrementedForCurrentMessage(false);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    console.log('FullScreenChatOverlay: Sending message and preparing to increment engagement');
    setHasIncrementedForCurrentMessage(false);
    
    await sendMessage(inputValue);
    inputRef.current?.focus();
    
    // Hide quick actions after first message on mobile to save space
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  const handleAiDemo = () => {
    console.log('FullScreenChatOverlay: Starting AI Magic Demo in chat');
    setHasIncrementedForCurrentMessage(false);
    setShowInteractiveDemo(true); // Immediately show demo
    sendMessage("Show me the AI magic demo - how AI transforms fundraising data!");
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
    console.log('FullScreenChatOverlay: Quick action triggered, preparing to increment engagement');
    setHasIncrementedForCurrentMessage(false);
    
    // Check if this is an AI demo request
    if (action.toLowerCase().includes('ai magic demo')) {
      setShowInteractiveDemo(true);
    }
    
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
    setShowInteractiveDemo(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose} modal>
        <DialogContent 
          className="fixed inset-0 z-[100] w-screen h-screen max-w-none max-h-none p-0 m-0 border-0 rounded-none bg-gray-900 overflow-hidden"
          style={{ width: '100vw', height: '100vh', transform: 'none', left: 0, top: 0 }}
        >
          <div className="flex flex-col h-full w-full bg-gray-900 overflow-hidden">
            <ChatHeader
              lessonContext={lessonContext}
              engagement={engagement}
              onClose={handleClose}
            />

            {showQuickActions && (
              <div className="flex-shrink-0">
                <QuickActions
                  lessonContext={lessonContext}
                  suggestedTask={suggestedTask}
                  onQuickAction={handleQuickAction}
                  onResetChat={handleResetChat}
                  userProfile={userProfile}
                />
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatMessages
                messages={messages}
                isTyping={isTyping}
                engagement={engagement}
                messagesEndRef={messagesEndRef}
                onForceClose={forceClose}
                onSendMessage={sendMessage}
              />
              
              {showInteractiveDemo && (
                <div className="p-4">
                  <InteractiveAiDemo
                    onSendMessage={sendMessage}
                    userProfile={userProfile}
                    isVisible={showInteractiveDemo}
                  />
                </div>
              )}
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
        </DialogContent>
      </Dialog>

      <CloseConfirmationDialog
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onForceClose={forceClose}
        exchangeCount={engagement.exchangeCount}
      />
    </>
  );
};
