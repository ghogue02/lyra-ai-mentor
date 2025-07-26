import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Rocket, Network, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SofiaImpactScalingLesson: React.FC = () => {
  const [currentReach, setCurrentReach] = useState('');
  const [scalingGoals, setScalingGoals] = useState('');
  const [communicationChannels, setCommunicationChannels] = useState('');
  const [resourceConstraints, setResourceConstraints] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "Sofia's Impact Scaling System",
    content: "Scaling storytelling without losing quality or voice"
  });

  const handleBuildSystem = async () => {
    if (!currentReach.trim()) return;
    
    setIsBuilding(true);
    
    const prompt = `Sofia has proven her storytelling works and now needs to scale her impact systematically. Here's her current situation:

Current Reach & Impact: ${currentReach}
Scaling Goals: ${scalingGoals || 'Reach 10x more people while maintaining message quality and authenticity'}
Communication Channels: ${communicationChannels || 'Email, social media, presentations, website, newsletters'}
Resource Constraints: ${resourceConstraints || 'Limited time and team capacity'}

As Sofia's scaling strategist, help her build:
1. A comprehensive storytelling system that maintains quality at scale
2. Templates and frameworks that preserve her authentic voice
3. Efficient content creation workflows
4. Multi-channel distribution strategies
5. Measurement systems to track impact and effectiveness
6. Team training processes to extend her voice consistently

Create a practical, step-by-step scaling system that Sofia can implement immediately.`;

    await sendMessage(prompt);
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">Sofia's Impact Scaling System</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build Sofia's comprehensive storytelling system that scales impact across all communication channels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Rocket className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Scaling Analysis</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reach">Current Reach & Impact:</Label>
                  <Textarea
                    id="reach"
                    placeholder="Describe your current storytelling reach and measurable impact"
                    value={currentReach}
                    onChange={(e) => setCurrentReach(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="goals">Scaling Goals:</Label>
                  <Input
                    id="goals"
                    placeholder="What scale of impact do you want to achieve?"
                    value={scalingGoals}
                    onChange={(e) => setScalingGoals(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="channels">Communication Channels:</Label>
                  <Input
                    id="channels"
                    placeholder="List all channels you use or want to use"
                    value={communicationChannels}
                    onChange={(e) => setCommunicationChannels(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="constraints">Resource Constraints:</Label>
                  <Textarea
                    id="constraints"
                    placeholder="What limitations do you face in scaling your storytelling?"
                    value={resourceConstraints}
                    onChange={(e) => setResourceConstraints(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleBuildSystem}
                  disabled={!currentReach.trim() || isBuilding}
                  className="w-full"
                  size="lg"
                >
                  {isBuilding ? (
                    <>
                      <Network className="h-4 w-4 mr-2 animate-pulse" />
                      Building Scaling System...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Build My Scaling System
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-semibold">Sofia's Scaling Strategy Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sofia is excited to help you build a comprehensive system that scales your storytelling impact without losing authenticity.</p>
                    <p className="text-sm mt-2">Share your current reach and goals, and let's create a scaling system that works for you.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!message.isUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
                            <AvatarFallback>S</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary/50 text-foreground'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <div className="bg-secondary/50 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default SofiaImpactScalingLesson;