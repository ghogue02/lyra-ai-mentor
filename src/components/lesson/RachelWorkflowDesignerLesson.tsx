import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Settings, Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const RachelWorkflowDesignerLesson: React.FC = () => {
  const [currentProcess, setCurrentProcess] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [isDesigning, setIsDesigning] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Rachel's Workflow Design Studio",
    content: "Balancing efficiency with human-centered design"
  });

  const handleDesign = async () => {
    if (!currentProcess.trim() || !painPoints.trim()) return;
    setIsDesigning(true);
    await sendMessage(`Rachel needs to design workflows that improve both efficiency and job satisfaction. Current process: ${currentProcess}. Pain points: ${painPoints}. Stakeholders: ${stakeholders}. Help her create human-centered workflow designs.`);
    setIsDesigning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={5}
        chapterTitle="Chapter 5: Process Automation"
        lessonTitle="Rachel's Workflow Design Studio"
        characterName="Rachel"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/rachel-avatar.png" alt="Rachel" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Rachel's Workflow Design Studio</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Input
                  placeholder="What process needs improvement?"
                  value={currentProcess}
                  onChange={(e) => setCurrentProcess(e.target.value)}
                />
                <Textarea
                  placeholder="What are the main pain points and inefficiencies?"
                  value={painPoints}
                  onChange={(e) => setPainPoints(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="Who are the key stakeholders affected?"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                />
                <Button onClick={handleDesign} disabled={!currentProcess.trim() || !painPoints.trim() || isDesigning} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  {isDesigning ? 'Designing...' : 'Design Human-Centered Workflow'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Rachel helps you design workflows that balance efficiency with human satisfaction.</p>
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

export default RachelWorkflowDesignerLesson;