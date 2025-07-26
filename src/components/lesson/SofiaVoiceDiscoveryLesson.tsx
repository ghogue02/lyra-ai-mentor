import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Mic, Users, Lightbulb } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const SofiaVoiceDiscoveryLesson: React.FC = () => {
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [currentStruggles, setCurrentStruggles] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "Sofia's Voice Discovery Journey",
    content: "Finding authentic communication style that resonates with diverse audiences"
  });

  const handleDiscoverVoice = async () => {
    if (!communicationStyle.trim()) return;
    
    setIsAnalyzing(true);
    
    const prompt = `Sofia is on a journey to discover her authentic communication voice. Here's her current situation:

Current Communication Style: ${communicationStyle}
Audience She Needs to Reach: ${audienceType || 'Professional stakeholders and community members'}
Communication Struggles: ${currentStruggles || 'Finding balance between professional and authentic'}

As Sofia's voice discovery mentor, help her:
1. Identify her natural communication strengths
2. Develop an authentic voice that feels professional yet genuine
3. Create specific language patterns that resonate with her audience
4. Build confidence in her unique communication style

Provide personalized guidance and specific examples of how Sofia can express herself authentically.`;

    await sendMessage(prompt);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={3}
        chapterTitle="Chapter 3: Mission Storytelling"
        lessonTitle="Sofia's Voice Discovery Journey"
        characterName="Sofia"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">Sofia's Voice Discovery Journey</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guide Sofia through discovering her authentic communication style that resonates with diverse audiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Mic className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Voice Analysis</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="style">How do you naturally communicate?</Label>
                  <Textarea
                    id="style"
                    placeholder="Describe your natural speaking/writing style, what feels comfortable to you?"
                    value={communicationStyle}
                    onChange={(e) => setCommunicationStyle(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">Who do you need to communicate with?</Label>
                  <Input
                    id="audience"
                    placeholder="Donors, board members, community, staff, etc."
                    value={audienceType}
                    onChange={(e) => setAudienceType(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="struggles">What communication challenges do you face?</Label>
                  <Textarea
                    id="struggles"
                    placeholder="What makes communication feel difficult or inauthentic?"
                    value={currentStruggles}
                    onChange={(e) => setCurrentStruggles(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleDiscoverVoice}
                  disabled={!communicationStyle.trim() || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2 animate-pulse" />
                      Analyzing Your Voice...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Discover My Authentic Voice
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
                <h2 className="text-xl font-semibold">Sofia's Voice Coaching Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sofia is here to help you discover your authentic communication voice that feels both professional and genuine.</p>
                    <p className="text-sm mt-2">Share your communication style and click "Discover My Authentic Voice" to begin your journey.</p>
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

export default SofiaVoiceDiscoveryLesson;