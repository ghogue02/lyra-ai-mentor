import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptMessage {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
  audioAvailable?: boolean;
}

interface TranscriptDisplayProps {
  messages: TranscriptMessage[];
  isOpen: boolean;
  onClose: () => void;
  onPlayAudio?: (messageId: string) => void;
  currentlyPlaying?: string;
  className?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  messages,
  isOpen,
  onClose,
  onPlayAudio,
  currentlyPlaying,
  className
}) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<'all' | 'user' | 'ai'>('all');
  
  const filteredMessages = messages.filter(msg => 
    selectedSpeaker === 'all' || msg.speaker === selectedSpeaker
  );

  const downloadTranscript = () => {
    const transcript = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.speaker === 'user' ? 'You' : 'Lyra'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyra-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "absolute bottom-full mb-2 right-0 w-96 h-96 shadow-xl",
      "flex flex-col bg-white/95 backdrop-blur-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">Conversation Transcript</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTranscript}
            title="Download transcript"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 p-4 border-b">
        <Button
          variant={selectedSpeaker === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSpeaker('all')}
          className="text-xs"
        >
          All
        </Button>
        <Button
          variant={selectedSpeaker === 'user' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSpeaker('user')}
          className="text-xs"
        >
          You
        </Button>
        <Button
          variant={selectedSpeaker === 'ai' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSpeaker('ai')}
          className="text-xs"
        >
          Lyra
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "border-l-4 pl-4 py-2",
                message.speaker === 'user' 
                  ? "border-purple-500" 
                  : "border-cyan-500"
              )}
              role="article"
              aria-label={`${message.speaker === 'user' ? 'You' : 'Lyra'} said at ${message.timestamp.toLocaleTimeString()}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.speaker === 'user' ? 'You' : 'Lyra'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message.text}
                  </p>
                </div>
                {message.audioAvailable && onPlayAudio && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPlayAudio(message.id)}
                    className="flex-shrink-0"
                    aria-label={currentlyPlaying === message.id ? "Stop audio" : "Play audio"}
                  >
                    {currentlyPlaying === message.id ? (
                      <VolumeX className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Accessibility info */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <p>
          <span className="font-medium">Tip:</span> This transcript is screen reader friendly. 
          Use arrow keys to navigate between messages.
        </p>
      </div>
    </Card>
  );
};