import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Presentation, DollarSign, Target } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const DavidPresentationMasterLesson: React.FC = () => {
  const [presentationContext, setPresentationContext] = useState('');
  const [keyData, setKeyData] = useState('');
  const [audienceProfile, setAudienceProfile] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "David's Million-Dollar Presentation",
    content: "High-stakes presentation with board and major donors"
  });

  const handleCreatePresentation = async () => {
    if (!presentationContext.trim()) return;
    
    setIsCreating(true);
    
    const prompt = `David is preparing for a million-dollar opportunity - a high-stakes presentation that could transform his organization's funding. Here are the details:

Presentation Context: ${presentationContext}
Key Data to Present: ${keyData || 'Impact metrics, research findings, and program effectiveness data'}
Audience Profile: ${audienceProfile || 'Board members, major donors, and influential decision-makers'}
Funding Goal: ${fundingGoal || 'Significant funding increase to scale impact'}

As David's presentation strategist, help him create:
1. A powerful opening that immediately captures attention with data
2. A logical flow that builds compelling case for funding
3. Data visualizations and storytelling that inspire confidence
4. Anticipation and response to potential objections
5. A memorable closing that drives decision-makers to action
6. Specific techniques to present complex data with clarity and impact

This is David's moment to prove the value of data-driven decision making. Help him craft a presentation that will be impossible to ignore.`;

    await sendMessage(prompt);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/david-avatar.png" alt="David" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">David's Million-Dollar Presentation</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help David create the high-stakes presentation that could unlock transformational funding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Presentation className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">High-Stakes Planning</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="context">Presentation Context:</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe the high-stakes presentation opportunity and its importance"
                    value={presentationContext}
                    onChange={(e) => setPresentationContext(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="data">Key Data to Present:</Label>
                  <Textarea
                    id="data"
                    placeholder="What are your most compelling data points and findings?"
                    value={keyData}
                    onChange={(e) => setKeyData(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">Audience Profile:</Label>
                  <Input
                    id="audience"
                    placeholder="Who will be making the funding decisions?"
                    value={audienceProfile}
                    onChange={(e) => setAudienceProfile(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="goal">Funding Goal:</Label>
                  <Input
                    id="goal"
                    placeholder="What funding outcome are you seeking?"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleCreatePresentation}
                  disabled={!presentationContext.trim() || isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Target className="h-4 w-4 mr-2 animate-pulse" />
                      Crafting Presentation...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Create Million-Dollar Presentation
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
                <h2 className="text-xl font-semibold">David's Strategic Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>David is ready to help you create a presentation that will demonstrate the undeniable value of your data-driven approach.</p>
                    <p className="text-sm mt-2">Share your presentation context and let's build something that secures the funding you need.</p>
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
                            <AvatarImage src="/characters/david-avatar.png" alt="David" />
                            <AvatarFallback>D</AvatarFallback>
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
                          <AvatarImage src="/characters/david-avatar.png" alt="David" />
                          <AvatarFallback>D</AvatarFallback>
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

export default DavidPresentationMasterLesson;