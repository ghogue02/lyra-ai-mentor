import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Settings, Workflow, Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const DavidSystemBuilderLesson: React.FC = () => {
  const [currentDataFlow, setCurrentDataFlow] = useState('');
  const [stakeholderNeeds, setStakeholderNeeds] = useState('');
  const [reportingRequirements, setReportingRequirements] = useState('');
  const [systemGoals, setSystemGoals] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "David's Data Storytelling System",
    content: "Creating sustainable data storytelling infrastructure"
  });

  const handleBuildSystem = async () => {
    if (!currentDataFlow.trim()) return;
    
    setIsBuilding(true);
    
    const prompt = `David needs to build a comprehensive data storytelling system that creates ongoing impact. Here's his current situation:

Current Data Flow: ${currentDataFlow}
Stakeholder Needs: ${stakeholderNeeds || 'Regular insights, clear reporting, actionable recommendations'}
Reporting Requirements: ${reportingRequirements || 'Monthly reports, quarterly presentations, annual impact summaries'}
System Goals: ${systemGoals || 'Automated insight generation, consistent storytelling, sustainable communication'}

As David's systems architect, help him build:
1. A sustainable data collection and analysis workflow
2. Standardized templates for consistent data storytelling
3. Automated reporting systems that maintain narrative quality
4. Training protocols for team members to use the system
5. Quality control processes to ensure story consistency
6. Scalable frameworks that grow with organizational needs

Create a comprehensive system that transforms David's organization into a data storytelling powerhouse.`;

    await sendMessage(prompt);
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={4}
        chapterTitle="Chapter 4: Data Storytelling & Impact Analysis"
        lessonTitle="David's Data Storytelling System"
        characterName="David"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/david-avatar.png" alt="David" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">David's Data Storytelling System</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build David's comprehensive system for ongoing data communication and insight sharing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">System Architecture</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataflow">Current Data Flow:</Label>
                  <Textarea
                    id="dataflow"
                    placeholder="Describe how data currently moves through your organization"
                    value={currentDataFlow}
                    onChange={(e) => setCurrentDataFlow(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stakeholders">Stakeholder Needs:</Label>
                  <Input
                    id="stakeholders"
                    placeholder="What do different stakeholders need from your data?"
                    value={stakeholderNeeds}
                    onChange={(e) => setStakeholderNeeds(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="reporting">Reporting Requirements:</Label>
                  <Input
                    id="reporting"
                    placeholder="What regular reports and presentations do you need?"
                    value={reportingRequirements}
                    onChange={(e) => setReportingRequirements(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="goals">System Goals:</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you want this system to achieve long-term?"
                    value={systemGoals}
                    onChange={(e) => setSystemGoals(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleBuildSystem}
                  disabled={!currentDataFlow.trim() || isBuilding}
                  className="w-full"
                  size="lg"
                >
                  {isBuilding ? (
                    <>
                      <Workflow className="h-4 w-4 mr-2 animate-pulse" />
                      Building System...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Build Data Storytelling System
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
                <h2 className="text-xl font-semibold">David's System Design Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>David is excited to help you build a comprehensive system that transforms your organization into a data storytelling powerhouse.</p>
                    <p className="text-sm mt-2">Share your current data flow and let's design a system that scales your impact.</p>
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

export default DavidSystemBuilderLesson;