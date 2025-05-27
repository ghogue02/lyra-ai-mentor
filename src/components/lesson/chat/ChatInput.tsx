
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  inputRef
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-700 p-6 bg-gray-800">
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
          onClick={onSendMessage}
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
  );
};
