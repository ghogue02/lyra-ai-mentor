import React, { useState } from 'react';
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { BrandedButton } from "@/components/ui/BrandedButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLyraChat } from "@/hooks/useLyraChat";
import { Map, Calendar, CheckCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const AlexRoadmapCreatorLesson: React.FC = () => {
  const [aiAdoptionGoals, setAiAdoptionGoals] = useState('');
  const [currentCapabilities, setCurrentCapabilities] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { messages, sendMessage, isLoading } = useLyraChat({
    lessonTitle: "Alex's Transformation Roadmap Creator",
    content: "Building confidence through clear implementation path"
  });

  const handleCreate = async () => {
    if (!aiAdoptionGoals.trim() || !currentCapabilities.trim()) return;
    setIsCreating(true);
    await sendMessage(`Alex needs to create practical roadmap for organizational AI adoption with clear milestones. AI adoption goals: ${aiAdoptionGoals}. Current capabilities: ${currentCapabilities}. Timeline: ${timeline}. Help create a confidence-building implementation roadmap.`);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={6}
        chapterTitle="Chapter 6: AI Leadership & Transformation"
        lessonTitle="Alex's Transformation Roadmap Creator"
        characterName="Alex"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/alex-avatar.png" alt="Alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Alex's Transformation Roadmap Creator</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveCard className="border-2 border-primary/20">
            <div className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="What are your AI adoption goals and desired outcomes?"
                  value={aiAdoptionGoals}
                  onChange={(e) => setAiAdoptionGoals(e.target.value)}
                  className="min-h-24"
                />
                <Textarea
                  placeholder="What are your organization's current capabilities and resources?"
                  value={currentCapabilities}
                  onChange={(e) => setCurrentCapabilities(e.target.value)}
                  className="min-h-24"
                />
                <Input
                  placeholder="What's your target timeline? (optional)"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
                <BrandedButton 
                  onClick={handleCreate} 
                  disabled={!aiAdoptionGoals.trim() || !currentCapabilities.trim() || isCreating} 
                  className="w-full"
                  icon="workflow"
                  loading={isCreating}
                  animated={true}
                  glow={true}
                >
                  {isCreating ? 'Creating...' : 'Create Implementation Roadmap'}
                </BrandedButton>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className="border-2 border-secondary/20">
            <div className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Alex helps you create practical roadmaps with clear milestones that build confidence.</p>
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
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
};

export default AlexRoadmapCreatorLesson;