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
}

export const FullScreenChatOverlay: React.FC<FullScreenChatOverlayProps> = ({
  isOpen,
  onClose,
  lessonContext,
  suggestedTask,
  onEngagementChange
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat
  } = useLyraChat(lessonContext);

  const { engagement, incrementExchange, resetEngagement } = useChatEngagement(3);

  // Notify parent component of engagement changes
  useEffect(() => {
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
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose} modal>
        <DialogContent 
          className="!fixed !inset-0 !z-[100] !border-0 !p-0 !gap-0 !rounded-none !bg-gray-900 !max-w-none !max-h-none !transform-none !left-0 !top-0 !translate-x-0 !translate-y-0 !w-screen !h-screen"
        >
          <div className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] h-screen w-screen bg-gray-900">
            <ChatHeader
              lessonContext={lessonContext}
              engagement={engagement}
              onClose={handleClose}
            />

            <QuickActions
              lessonContext={lessonContext}
              suggestedTask={suggestedTask}
              onQuickAction={handleQuickAction}
            />

            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              engagement={engagement}
              messagesEndRef={messagesEndRef}
              onForceClose={forceClose}
            />
            
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              inputRef={inputRef}
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
