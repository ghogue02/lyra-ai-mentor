import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Zap, Star, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const SofiaStoryBreakthroughLesson: React.FC = () => {
  const [eventDetails, setEventDetails] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [audienceProfile, setAudienceProfile] = useState('');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "Sofia's Breakthrough Story Creator",
    content: "Creating compelling narrative for high-stakes presentation"
  });

  const handleCreateBreakthrough = async () => {
    if (!eventDetails.trim()) return;
    
    setIsCreating(true);
    
    const prompt = `Sofia is preparing for a major breakthrough presentation that could transform her organization's funding. Here are the details:

Event/Presentation Details: ${eventDetails}
Key Message to Convey: ${keyMessage || 'Transform how people see our mission and impact'}
Audience Profile: ${audienceProfile || 'Major donors, board members, and influential stakeholders'}
Success Metrics: ${successMetrics || 'Secure significant funding and long-term support'}

As Sofia's breakthrough story strategist, help her create:
1. A captivating opening that immediately hooks the audience
2. A compelling narrative structure that builds momentum
3. Emotional connection points that inspire action
4. A powerful call-to-action that drives results
5. Specific language and phrases that resonate with this high-stakes audience

This is Sofia's moment - help her craft a story that will be remembered and acted upon.`;

    await sendMessage(prompt);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={3}
        chapterTitle="Chapter 3: Mission Storytelling"
        lessonTitle="Sofia's Breakthrough Story Creator"
        characterName="Sofia"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">Sofia's Breakthrough Story Creator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help Sofia craft the breakthrough story that will captivate the annual gala audience and unlock major funding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Breakthrough Preparation</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event">Event/Presentation Details:</Label>
                  <Textarea
                    id="event"
                    placeholder="Describe the high-stakes event, timeline, and context"
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Key Message:</Label>
                  <Input
                    id="message"
                    placeholder="What's the core message you want to convey?"
                    value={keyMessage}
                    onChange={(e) => setKeyMessage(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">Audience Profile:</Label>
                  <Input
                    id="audience"
                    placeholder="Who will be in the room? What motivates them?"
                    value={audienceProfile}
                    onChange={(e) => setAudienceProfile(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="success">Success Metrics:</Label>
                  <Textarea
                    id="success"
                    placeholder="What would make this presentation a breakthrough success?"
                    value={successMetrics}
                    onChange={(e) => setSuccessMetrics(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateBreakthrough}
                  disabled={!eventDetails.trim() || isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Crafting Breakthrough Story...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Create Breakthrough Presentation
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
                <h2 className="text-xl font-semibold">Sofia's High-Stakes Strategy Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sofia is here to help you create the breakthrough story that will captivate your audience and drive unprecedented results.</p>
                    <p className="text-sm mt-2">Share your presentation details and let's craft something truly impactful together.</p>
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

export default SofiaStoryBreakthroughLesson;