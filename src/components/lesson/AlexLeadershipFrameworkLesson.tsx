import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Crown, Zap, Rocket } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AlexLeadershipFrameworkLesson: React.FC = () => {
  const [leadershipChallenges, setLeadershipChallenges] = useState('');
  const [organizationalContext, setOrganizationalContext] = useState('');
  const [futureVision, setFutureVision] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Alex's AI Leadership Framework",
    content: "Establishing leadership model for the AI-powered future"
  });

  const handleBuild = async () => {
    if (!leadershipChallenges.trim() || !organizationalContext.trim()) return;
    setIsBuilding(true);
    await sendMessage(`Alex needs to build sustainable leadership framework for guiding AI-powered organizational transformation. Leadership challenges: ${leadershipChallenges}. Organizational context: ${organizationalContext}. Future vision: ${futureVision}. Help create AI leadership framework.`);
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/alex-avatar.png" alt="Alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Alex's AI Leadership Framework</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What leadership challenges are you facing in AI transformation?"
                  value={leadershipChallenges}
                  onChange={(e) => setLeadershipChallenges(e.target.value)}
                  className="min-h-24"
                />
                <Textarea
                  placeholder="What's your organizational context and culture?"
                  value={organizationalContext}
                  onChange={(e) => setOrganizationalContext(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="What's your vision for the AI-powered future? (optional)"
                  value={futureVision}
                  onChange={(e) => setFutureVision(e.target.value)}
                />
                <Button onClick={handleBuild} disabled={!leadershipChallenges.trim() || !organizationalContext.trim() || isBuilding} className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  {isBuilding ? 'Building...' : 'Build Leadership Framework'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Alex helps you establish sustainable leadership frameworks for the AI-powered future.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!message.isUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/characters/alex-avatar.png" alt="Alex" />
                            <AvatarFallback>A</AvatarFallback>
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

export default AlexLeadershipFrameworkLesson;