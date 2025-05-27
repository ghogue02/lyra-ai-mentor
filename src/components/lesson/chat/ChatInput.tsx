
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Send, Target, MessageCircle } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  engagement?: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  inputRef,
  engagement
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const getProgressMessage = () => {
    if (!engagement) return "";
    if (engagement.hasReachedMinimum) {
      return "Great job! You've completed the recommended interaction.";
    }
    const remaining = 3 - engagement.exchangeCount;
    if (engagement.exchangeCount > 0) {
      return `Keep going! ${remaining} more exchange${remaining === 1 ? '' : 's'} to complete your learning session.`;
    }
    return "Start chatting with Lyra to get personalized help!";
  };

  return (
    <div className="flex-shrink-0 bg-gray-800">
      {/* Progress Section */}
      {engagement && (
        <div className="spacing-mobile py-3 border-t border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="flex items-center gap-2 text-gray-300 truncate">
                <Target className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="truncate">Learning Progress</span>
              </span>
              <Badge 
                variant={engagement.hasReachedMinimum ? "default" : "secondary"} 
                className={`${
                  engagement.hasReachedMinimum 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-600 text-gray-200"
                } text-xs px-2 py-1 flex-shrink-0`}
              >
                {engagement.exchangeCount}/3
              </Badge>
            </div>
            <Progress 
              value={engagement.exchangeCount / 3 * 100} 
              className="h-1.5 bg-gray-700" 
            />
            <p className="text-xs text-gray-400 leading-relaxed">
              {getProgressMessage()}
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="spacing-mobile spacing-mobile-y border-t border-gray-700 safe-bottom">
        <div className="flex gap-2 sm:gap-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Lyra anything about this lesson..."
            className="mobile-input flex-1 h-10 sm:h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 text-sm sm:text-base"
            disabled={isTyping}
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="mobile-button h-10 sm:h-12 w-10 sm:w-12 p-0 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed">
          Press Enter to send • This chat is personalized to your current lesson
        </p>
      </div>
    </div>
  );
};
