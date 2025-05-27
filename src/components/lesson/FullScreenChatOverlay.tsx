
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Send, X, CheckCircle, MessageCircle, Target } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { useLyraChat } from '@/hooks/useLyraChat';
import { useChatEngagement } from '@/hooks/useChatEngagement';

interface FullScreenChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: {
    chapterTitle?: string;
    lessonTitle?: string;
    content?: string;
  };
  suggestedTask?: string;
}

export const FullScreenChatOverlay: React.FC<FullScreenChatOverlayProps> = ({
  isOpen,
  onClose,
  lessonContext,
  suggestedTask
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  const getQuickActions = () => {
    const actions = [];
    
    if (suggestedTask) {
      actions.push(suggestedTask);
    }
    
    if (lessonContext) {
      actions.push("Explain this concept in simple terms");
      actions.push("Give me a real nonprofit example");
      actions.push("What's the key takeaway here?");
      actions.push("How can I apply this at my organization?");
    } else {
      actions.push("What should I know about AI?");
      actions.push("How can AI help nonprofits?");
      actions.push("Give me a practical example");
    }
    
    return actions;
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (action: string) => {
    sendMessage(action);
    incrementExchange();
  };

  const getProgressMessage = () => {
    if (engagement.hasReachedMinimum) {
      return "Great job! You've completed the recommended interaction.";
    }
    if (engagement.shouldShowEncouragement) {
      return `Keep going! ${3 - engagement.exchangeCount} more exchange${3 - engagement.exchangeCount === 1 ? '' : 's'} to complete your learning session.`;
    }
    return "Start chatting with Lyra to get personalized help!";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-none w-screen h-screen p-0 gap-0 rounded-none border-0 bg-gray-900">
          <div className="flex flex-col h-full bg-gray-900">
            {/* Header */}
            <DialogHeader className="flex-shrink-0 p-6 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <LyraAvatar size="md" withWave={true} />
                  <div>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Chat with Lyra
                    </DialogTitle>
                    <p className="text-sm text-gray-300">
                      {lessonContext 
                        ? `Getting help with: ${lessonContext.lessonTitle}`
                        : 'Your AI Mentor for Nonprofit Leaders'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4 text-purple-400" />
                    Learning Progress
                  </span>
                  <Badge variant={engagement.hasReachedMinimum ? "default" : "secondary"} className={engagement.hasReachedMinimum ? "bg-green-600 text-white" : "bg-gray-600 text-gray-200"}>
                    {engagement.exchangeCount}/3 exchanges
                  </Badge>
                </div>
                <Progress 
                  value={(engagement.exchangeCount / 3) * 100} 
                  className="h-2 bg-gray-700"
                />
                <p className="text-xs text-gray-400">{getProgressMessage()}</p>
              </div>
            </DialogHeader>

            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <div className="flex-shrink-0 p-4 border-b border-gray-700 bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-3 font-medium">Try these prompts to get started:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs h-8 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500 transition-colors"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages - Fixed scrolling with proper height constraints */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex animate-fade-in",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "flex items-start gap-3 max-w-[80%]",
                        message.isUser && "flex-row-reverse"
                      )}>
                        {!message.isUser && (
                          <LyraAvatar size="sm" withWave={false} className="mt-1" />
                        )}
                        <div
                          className={cn(
                            "p-4 rounded-lg text-sm leading-relaxed shadow-lg",
                            message.isUser
                              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none"
                              : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start gap-3">
                        <LyraAvatar size="sm" withWave={false} className="mt-1" />
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg rounded-bl-none">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completion message */}
                  {engagement.hasReachedMinimum && (
                    <div className="flex justify-center animate-fade-in">
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 max-w-md text-center">
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-200 mb-1">Great work!</h4>
                        <p className="text-sm text-green-300">
                          You've completed your learning session with Lyra. Feel free to continue chatting or close to move on to the next part of your lesson.
                        </p>
                        <Button
                          onClick={forceClose}
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
            
            {/* Input */}
            <div className="flex-shrink-0 border-t border-gray-700 p-6 bg-gray-800">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Lyra anything about this lesson..."
                  className="flex-1 h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send • This chat is personalized to your current lesson
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close confirmation dialog */}
      <Dialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <DialogContent className="max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Continue Learning?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              You're making great progress! We recommend having at least 3 exchanges with Lyra to get the most out of this lesson. 
              You currently have {engagement.exchangeCount} exchange{engagement.exchangeCount === 1 ? '' : 's'}.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCloseConfirmation(false)} className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                Keep Chatting
              </Button>
              <Button onClick={forceClose} variant="destructive">
                Close Anyway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
