import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Users, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RachelAutomationVisionLesson: React.FC = () => {
  const [automationChallenges, setAutomationChallenges] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Rachel's Human-Centered Automation Vision",
    content: "Overcoming automation resistance through human benefits"
  });

  const handleAnalyze = async () => {
    if (!automationChallenges.trim()) return;
    setIsAnalyzing(true);
    await sendMessage(`Rachel faces automation resistance. Help her develop human-centered automation strategies: ${automationChallenges}`);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/rachel-avatar.png" alt="Rachel" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Rachel's Human-Centered Automation Vision</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe automation challenges and resistance you're facing..."
                  value={automationChallenges}
                  onChange={(e) => setAutomationChallenges(e.target.value)}
                  className="min-h-32"
                />
                <Button onClick={handleAnalyze} disabled={!automationChallenges.trim() || isAnalyzing} className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Develop Human-Centered Vision'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Rachel helps you create automation that enhances human potential.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!message.isUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/characters/rachel-avatar.png" alt="Rachel" />
                            <AvatarFallback>R</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[80%] rounded-lg p-3 ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary/50'}`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RachelAutomationVisionLesson;