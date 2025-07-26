import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const DavidDataStoryFinderLesson: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState('');
  const [researchFindings, setResearchFindings] = useState('');
  const [audienceContext, setAudienceContext] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "David's Data Story Discovery",
    content: "Finding story in numbers that captivates audiences"
  });

  const handleFindStory = async () => {
    if (!statisticsData.trim()) return;
    
    setIsFinding(true);
    
    const prompt = `David has complex statistics and research findings that need to become compelling narratives. Here's what he's working with:

Statistics & Data: ${statisticsData}
Research Findings: ${researchFindings || 'Complex research results that need to be made accessible'}
Audience Context: ${audienceContext || 'Board members, funders, and community stakeholders'}

As David's data storytelling mentor, help him:
1. Identify the human stories hidden within the statistics
2. Create narrative frameworks that make numbers emotionally compelling
3. Develop metaphors and analogies that make complex data accessible
4. Build story arcs that lead audiences from data to action
5. Transform research findings into memorable, shareable stories

Focus on practical storytelling techniques that turn David's data into stories that stick and inspire.`;

    await sendMessage(prompt);
    setIsFinding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={4}
        chapterTitle="Chapter 4: Data Intelligence"
        lessonTitle="David's Data Story Discovery"
        characterName="David"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/david-avatar.png" alt="David" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">David's Data Story Discovery</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guide David through weaving compelling narratives from complex statistics and research findings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Story Discovery</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="statistics">Your Statistics & Data:</Label>
                  <Textarea
                    id="statistics"
                    placeholder="Share the key statistics, metrics, or data points you need to present"
                    value={statisticsData}
                    onChange={(e) => setStatisticsData(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="research">Research Findings:</Label>
                  <Textarea
                    id="research"
                    placeholder="What research results or complex findings need to be communicated?"
                    value={researchFindings}
                    onChange={(e) => setResearchFindings(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">Audience Context:</Label>
                  <Input
                    id="audience"
                    placeholder="Who needs to understand and be moved by this data?"
                    value={audienceContext}
                    onChange={(e) => setAudienceContext(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleFindStory}
                  disabled={!statisticsData.trim() || isFinding}
                  className="w-full"
                  size="lg"
                >
                  {isFinding ? (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2 animate-pulse" />
                      Finding Story in Data...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Discover My Data Story
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
                <h2 className="text-xl font-semibold">David's Storytelling Workshop</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>David is excited to help you find the compelling human stories hidden within your statistics and research.</p>
                    <p className="text-sm mt-2">Share your data and let's discover the narratives that will captivate your audience.</p>
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

export default DavidDataStoryFinderLesson;