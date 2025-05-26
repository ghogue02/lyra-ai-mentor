
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Minimize2, Maximize2 } from 'lucide-react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isExpanded = false, 
  onToggleExpanded 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! 👋 I'm Lyra, your AI mentor. I'm here to help you navigate your learning journey. What questions do you have about AI?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question! Let me help you understand that concept better. Based on your learning profile, I'll explain this in a way that matches your style.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleExpanded}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <LyraAvatar size="sm" withWave={false} className="w-8 h-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px]">
      <Card className="h-full border-0 shadow-2xl bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <LyraAvatar size="sm" withWave={false} />
            <div>
              <h3 className="font-semibold">Lyra</h3>
              <p className="text-xs text-purple-100">Your AI Mentor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="text-white hover:bg-white/20"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
        
        <CardContent className="flex flex-col h-full p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg text-sm",
                    message.isUser
                      ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about AI..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
