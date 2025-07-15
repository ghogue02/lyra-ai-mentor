import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  MessageCircle, 
  Maximize2, 
  Minimize2,
  Mic,
  Paperclip,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';
import { useResponsive, useKeyboardVisibility, useViewportHeight } from '@/hooks/useResponsive';
import { Card } from '@/components/ui/card';

interface MobileChatInterfaceProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({ 
  isExpanded = false, 
  onToggleExpanded,
  lessonContext,
  fullScreen = false,
  onToggleFullScreen
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobile, isLandscape } = useResponsive();
  const isKeyboardVisible = useKeyboardVisibility();
  const viewportHeight = useViewportHeight();
  const [showQuickActions, setShowQuickActions] = useState(true);
  
  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat
  } = useLyraChat(lessonContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-hide quick actions when keyboard is visible
  useEffect(() => {
    if (isKeyboardVisible) {
      setShowQuickActions(false);
    }
  }, [isKeyboardVisible]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Explain simply",
    "Give example",
    "Key takeaway",
    "How to apply?"
  ];

  const handleQuickAction = (action: string) => {
    const contextualAction = lessonContext 
      ? `${action} for "${lessonContext.lessonTitle}"`
      : action;
    sendMessage(contextualAction);
    setShowQuickActions(false);
  };

  // Floating chat button
  if (!isExpanded) {
    return (
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggleExpanded}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  const chatHeight = fullScreen 
    ? viewportHeight 
    : isLandscape 
      ? viewportHeight * 0.8 
      : viewportHeight * 0.7;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50",
          fullScreen && "inset-0"
        )}
        style={{ 
          height: fullScreen ? '100%' : 'auto',
          maxHeight: fullScreen ? '100%' : `${chatHeight}px`
        }}
      >
        <Card className={cn(
          "h-full border-0 rounded-t-2xl shadow-2xl",
          fullScreen && "rounded-none"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <LyraAvatar size="sm" withWave={false} />
              <div>
                <h3 className="font-semibold">Lyra</h3>
                {lessonContext && (
                  <p className="text-xs text-purple-100 truncate max-w-[200px]">
                    {lessonContext.lessonTitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onToggleFullScreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFullScreen}
                  className="text-white hover:bg-white/20"
                >
                  {fullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleExpanded}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
            style={{ 
              maxHeight: isKeyboardVisible 
                ? `${chatHeight - 200}px` 
                : `${chatHeight - 140}px`
            }}
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  message.isUser && "flex-row-reverse"
                )}>
                  {!message.isUser && (
                    <LyraAvatar size="sm" withWave={false} className="mt-1" />
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      message.isUser
                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                        : "bg-white shadow-sm"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2">
                  <LyraAvatar size="sm" withWave={false} className="mt-1" />
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <AnimatePresence>
            {showQuickActions && !isKeyboardVisible && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 py-2 border-t bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">Quick actions</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowQuickActions(false)}
                    className="h-6 w-6"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs h-8"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                disabled
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowQuickActions(false)}
                placeholder="Type a message..."
                className="flex-1"
                disabled={isTyping}
              />
              
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  disabled
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="shrink-0 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};