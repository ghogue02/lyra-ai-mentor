import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    clearChat
  } = useLyraChat(lessonContext);

  const { engagement, incrementExchange, resetEngagement, setEngagementCount } = useChatEngagement(3, initialEngagementCount);

  // Initialize engagement count with database value when component mounts
  useEffect(() => {
    console.log('FullScreenChatOverlay: Setting initial engagement count to:', initialEngagementCount);
    setEngagementCount(initialEngagementCount);
  }, [initialEngagementCount, setEngagementCount]);

  // Notify parent component of engagement changes
  useEffect(() => {
    console.log('FullScreenChatOverlay: Engagement changed:', engagement);
    onEngagementChange?.(engagement);
  }, [engagement, onEngagementChange]);

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
    incrementExchange();
    inputRef.current?.focus();
    
    // Hide quick actions after first message on mobile to save space
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
  };

  const handleClose = () => {
    if (!engagement.hasReachedMinimum && engagement.exchangeCount > 0) {
      setShowCloseConfirmation(true);
    } else {
      resetEngagement();
      onClose();
    }
  };

  const forceClose = () => {
    resetEngagement();
    setShowCloseConfirmation(false);
    onClose();
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
    incrementExchange();
    
    // Hide quick actions after use on mobile
    if (window.innerWidth < 768) {
      setShowQuickActions(false);
    }
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
              />
            </div>
            
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
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
