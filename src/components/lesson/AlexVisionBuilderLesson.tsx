import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Eye, Lightbulb, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const AlexVisionBuilderLesson: React.FC = () => {
  const [currentState, setCurrentState] = useState('');
  const [diverseStakeholders, setDiverseStakeholders] = useState('');
  const [sharedValues, setSharedValues] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Alex's Unified Vision Builder",
    content: "Creating inspiring vision that drives collective action"
  });

  const handleBuild = async () => {
    if (!currentState.trim() || !diverseStakeholders.trim()) return;
    setIsBuilding(true);
    await sendMessage(`Alex needs to create shared vision that motivates diverse stakeholders toward common goals. Current state: ${currentState}. Diverse stakeholders: ${diverseStakeholders}. Shared values: ${sharedValues}. Help create an inspiring unified vision.`);
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={6}
        chapterTitle="Chapter 6: Strategic Leadership"
        lessonTitle="Alex's Unified Vision Builder"
        characterName="Alex"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/alex-avatar.png" alt="Alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Alex's Unified Vision Builder</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What's the current state of your organization?"
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  className="min-h-24"
                />
                <Textarea
                  placeholder="Who are the diverse stakeholders you need to unite?"
                  value={diverseStakeholders}
                  onChange={(e) => setDiverseStakeholders(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="What shared values can you leverage? (optional)"
                  value={sharedValues}
                  onChange={(e) => setSharedValues(e.target.value)}
                />
                <Button onClick={handleBuild} disabled={!currentState.trim() || !diverseStakeholders.trim() || isBuilding} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  {isBuilding ? 'Building...' : 'Create Unified Vision'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Alex helps you create inspiring visions that motivate diverse stakeholders toward common goals.</p>
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

export default AlexVisionBuilderLesson;