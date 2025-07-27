import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Network, Zap, Link } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const RachelEcosystemBuilderLesson: React.FC = () => {
  const [currentSystems, setCurrentSystems] = useState('');
  const [integrationGoals, setIntegrationGoals] = useState('');
  const [organizationalCapacity, setOrganizationalCapacity] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Rachel's Automation Ecosystem Builder",
    content: "Creating seamless automation ecosystem"
  });

  const handleBuild = async () => {
    if (!currentSystems.trim() || !integrationGoals.trim()) return;
    setIsBuilding(true);
    await sendMessage(`Rachel needs to build an integrated automation ecosystem. Current systems: ${currentSystems}. Integration goals: ${integrationGoals}. Organizational capacity: ${organizationalCapacity}. Help her create a seamless automation system that transforms organizational capacity.`);
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={5}
        chapterTitle="Chapter 5: Workflow Automation"
        lessonTitle="Rachel's Automation Ecosystem Builder"
        characterName="Rachel"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/rachel-avatar.png" alt="Rachel" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Rachel's Automation Ecosystem Builder</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What systems and tools do you currently use?"
                  value={currentSystems}
                  onChange={(e) => setCurrentSystems(e.target.value)}
                  className="min-h-24"
                />
                <Textarea
                  placeholder="What are your integration and automation goals?"
                  value={integrationGoals}
                  onChange={(e) => setIntegrationGoals(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="What's your organization's capacity for change? (optional)"
                  value={organizationalCapacity}
                  onChange={(e) => setOrganizationalCapacity(e.target.value)}
                />
                <Button onClick={handleBuild} disabled={!currentSystems.trim() || !integrationGoals.trim() || isBuilding} className="w-full">
                  <Network className="h-4 w-4 mr-2" />
                  {isBuilding ? 'Building...' : 'Build Automation Ecosystem'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Rachel helps you create integrated automation systems that transform organizational capacity.</p>
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

export default RachelEcosystemBuilderLesson;