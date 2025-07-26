import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Sparkles, Heart, Users, Target } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const SofiaMissionStoryCreatorLesson: React.FC = () => {
  const [missionDescription, setMissionDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "Sofia's Silent Crisis Story Creator",
    content: "Transform invisible mission into compelling narrative"
  });

  const handleGenerateStory = async () => {
    if (!missionDescription.trim()) return;
    
    setIsGenerating(true);
    
    const prompt = `Sofia needs help transforming her invisible mission into a compelling story. Here's what we know:

Mission Description: ${missionDescription}
Target Audience: ${targetAudience || 'Community members and potential supporters'}
Current Challenge: ${currentChallenge || 'Mission feels invisible and hard to explain'}

As Sofia's story development mentor, help create a compelling narrative that:
1. Makes the invisible crisis visible and relatable
2. Creates emotional connection with the audience
3. Inspires action and support
4. Maintains authenticity to Sofia's voice

Please provide a structured story approach with specific examples and language suggestions.`;

    await sendMessage(prompt);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={3}
        chapterTitle="Chapter 3: Mission Storytelling"
        lessonTitle="Sofia's Silent Crisis Story Creator"
        characterName="Sofia"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/sofia-avatar.png" alt="Sofia" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">Sofia's Silent Crisis Story Creator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help Sofia transform her invisible mission into a compelling narrative that captures hearts and opens minds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Mission Context</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mission">Describe your mission/cause:</Label>
                  <Textarea
                    id="mission"
                    placeholder="What is the invisible crisis or cause you're working to address?"
                    value={missionDescription}
                    onChange={(e) => setMissionDescription(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">Target Audience:</Label>
                  <Input
                    id="audience"
                    placeholder="Who do you want to reach with your story?"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="challenge">Current Challenge:</Label>
                  <Textarea
                    id="challenge"
                    placeholder="What makes this mission hard to explain or connect with?"
                    value={currentChallenge}
                    onChange={(e) => setCurrentChallenge(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateStory}
                  disabled={!missionDescription.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Creating Story Framework...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Transform Into Compelling Story
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-semibold">Sofia's Story Development Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Sofia is ready to help you craft a compelling story that makes your invisible mission visible and inspiring.</p>
                    <p className="text-sm mt-2">Fill in your mission details and click "Transform Into Compelling Story" to begin.</p>
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

export default SofiaMissionStoryCreatorLesson;