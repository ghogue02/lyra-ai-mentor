import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { BarChart3, Target, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const RachelProcessTransformerLesson: React.FC = () => {
  const [automationGoals, setAutomationGoals] = useState('');
  const [skepticalStakeholders, setSkepticalStakeholders] = useState('');
  const [measurableOutcomes, setMeasurableOutcomes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Rachel's Process Transformation Proof",
    content: "Demonstrating automation ROI to skeptical stakeholders"
  });

  const handleAnalyze = async () => {
    if (!automationGoals.trim() || !skepticalStakeholders.trim()) return;
    setIsAnalyzing(true);
    await sendMessage(`Rachel needs to prove automation value to skeptical stakeholders. Goals: ${automationGoals}. Skeptical stakeholders: ${skepticalStakeholders}. Desired outcomes: ${measurableOutcomes}. Help her develop compelling ROI metrics and transformation proof.`);
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
            <h1 className="text-3xl font-bold">Rachel's Process Transformation Proof</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What are your automation goals and objectives?"
                  value={automationGoals}
                  onChange={(e) => setAutomationGoals(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="Who are the skeptical stakeholders you need to convince?"
                  value={skepticalStakeholders}
                  onChange={(e) => setSkepticalStakeholders(e.target.value)}
                />
                <Textarea
                  placeholder="What measurable outcomes would prove success? (optional)"
                  value={measurableOutcomes}
                  onChange={(e) => setMeasurableOutcomes(e.target.value)}
                  className="min-h-20"
                />
                <Button onClick={handleAnalyze} disabled={!automationGoals.trim() || !skepticalStakeholders.trim() || isAnalyzing} className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Build ROI Proof Strategy'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Rachel helps you prove automation value through measurable transformation metrics.</p>
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

export default RachelProcessTransformerLesson;