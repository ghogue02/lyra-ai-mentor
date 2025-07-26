import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Users2, Target, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AlexChangeStrategyLesson: React.FC = () => {
  const [resistancePoints, setResistancePoints] = useState('');
  const [stakeholderGroups, setStakeholderGroups] = useState('');
  const [transformationGoals, setTransformationGoals] = useState('');
  const [isStrategizing, setIsStrategizing] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Alex's Change Leadership Strategy",
    content: "Uniting divided organization around AI transformation"
  });

  const handleStrategize = async () => {
    if (!resistancePoints.trim() || !stakeholderGroups.trim()) return;
    setIsStrategizing(true);
    await sendMessage(`Alex needs to develop comprehensive strategy for overcoming organizational resistance to AI transformation. Resistance points: ${resistancePoints}. Stakeholder groups: ${stakeholderGroups}. Transformation goals: ${transformationGoals}. Help create change leadership strategy.`);
    setIsStrategizing(false);
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
            <h1 className="text-3xl font-bold">Alex's Change Leadership Strategy</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What resistance points are you encountering?"
                  value={resistancePoints}
                  onChange={(e) => setResistancePoints(e.target.value)}
                  className="min-h-24"
                />
                <Textarea
                  placeholder="What stakeholder groups need to be aligned?"
                  value={stakeholderGroups}
                  onChange={(e) => setStakeholderGroups(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="What are your transformation goals? (optional)"
                  value={transformationGoals}
                  onChange={(e) => setTransformationGoals(e.target.value)}
                />
                <Button onClick={handleStrategize} disabled={!resistancePoints.trim() || !stakeholderGroups.trim() || isStrategizing} className="w-full">
                  <Users2 className="h-4 w-4 mr-2" />
                  {isStrategizing ? 'Strategizing...' : 'Develop Change Strategy'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <ArrowUpRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Alex helps you develop strategies to unite divided organizations around AI transformation.</p>
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

export default AlexChangeStrategyLesson;