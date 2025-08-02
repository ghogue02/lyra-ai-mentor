import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, User, MessageSquare, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AICommunicationSimRendererProps {
  element: {
    id: number;
    configuration: {
      personalities: Array<{
        name: string;
        description: string;
      }>;
      scenarios: string[];
    };
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AICommunicationSimRenderer: React.FC<AICommunicationSimRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const { user, session } = useAuth();
  const [selectedPersonality, setSelectedPersonality] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const personalities = element.configuration?.personalities || [];
  const scenarios = element.configuration?.scenarios || [];

  const sendMessage = useCallback(async () => {
    if (!userMessage.trim() || !user) return;

    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);
    setUserMessage('');
    setIsGenerating(true);

    try {
      const personality = personalities[selectedPersonality];
      const scenario = scenarios[selectedScenario];
      
      const systemPrompt = `You are an AI assistant with this personality: ${personality.name} - ${personality.description}. You are helping with this scenario: ${scenario}. Respond in character, keeping your unique perspective and approach. Be helpful but stay true to your personality type. Keep responses concise but valuable.`;

      const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/chat-with-lyra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...newConversation.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            }))
          ],
          userId: user.id,
          useCleanFormatting: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResponse += data.content;
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }

      setConversation([...newConversation, { role: 'ai', content: fullResponse }]);

      // Complete after 3 exchanges
      if (newConversation.length >= 6 && !isElementCompleted) { // 6 messages = 3 exchanges
        await onComplete();
      }
    } catch (error) {
      console.error('Error in AI communication:', error);
      setConversation([...newConversation, { 
        role: 'ai', 
        content: 'I apologize, but I\'m having trouble responding right now. Please try again.' 
      }]);
    } finally {
      setIsGenerating(false);
    }
  }, [userMessage, conversation, personalities, scenarios, selectedPersonality, selectedScenario, user, session, isElementCompleted, onComplete]);

  const startSimulation = useCallback(() => {
    setHasStarted(true);
    const personality = personalities[selectedPersonality];
    const scenario = scenarios[selectedScenario];
    
    const greeting = `Hello! I'm ${personality.name}. I'm here to help you with ${scenario.toLowerCase()}. How can I assist you today?`;
    setConversation([{ role: 'ai', content: greeting }]);
  }, [personalities, scenarios, selectedPersonality, selectedScenario]);

  const resetSimulation = useCallback(() => {
    setConversation([]);
    setUserMessage('');
    setHasStarted(false);
  }, []);

  if (personalities.length === 0 || scenarios.length === 0) {
    return (
      <Card className="premium-card">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Simulation configuration not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="premium-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Communication Simulator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Practice conversations with different AI personalities
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!hasStarted ? (
            <div className="space-y-6">
              {/* Personality Selection */}
              <div>
                <Label className="text-base font-medium">Choose an AI Personality:</Label>
                <div className="grid gap-3 mt-3">
                  {personalities.map((personality, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedPersonality(index)}
                      variant={selectedPersonality === index ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-medium">{personality.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{personality.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scenario Selection */}
              <div>
                <Label className="text-base font-medium">Choose a Scenario:</Label>
                <div className="grid gap-2 mt-3">
                  {scenarios.map((scenario, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedScenario(index)}
                      variant={selectedScenario === index ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                    >
                      {scenario}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={startSimulation} className="w-full">
                <Bot className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Setup Display */}
              <div className="flex gap-2 mb-4">
                <Badge variant="outline">{personalities[selectedPersonality].name}</Badge>
                <Badge variant="outline">{scenarios[selectedScenario]}</Badge>
              </div>

              {/* Conversation */}
              <div className="bg-muted/30 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-background border p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!userMessage.trim() || isGenerating}
                  size="sm"
                  className="self-end"
                >
                  Send
                </Button>
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={resetSimulation} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Simulation
                </Button>
                {conversation.length >= 6 && (
                  <Badge className="bg-primary/10 text-primary px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Practice Complete!
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};