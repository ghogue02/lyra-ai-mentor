import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLyraChat } from "@/hooks/useLyraChat";
import { MessageSquare, Database, BarChart3, Eye } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MicroLessonNavigator } from "@/components/navigation/MicroLessonNavigator";

const DavidDataRevivalLesson: React.FC = () => {
  const [dataDescription, setDataDescription] = useState('');
  const [buriedInsights, setBuriedInsights] = useState('');
  const [dataComplexity, setDataComplexity] = useState('');
  const [isReviving, setIsReviving] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useLyraChat({
    lessonTitle: "David's Data Graveyard Revival",
    content: "Data graveyard - insights lost in complexity"
  });

  const handleReviveData = async () => {
    if (!dataDescription.trim()) return;
    
    setIsReviving(true);
    
    const prompt = `David is facing a data graveyard where valuable insights are buried in complexity. Here's what we're working with:

Data Description: ${dataDescription}
Buried Insights: ${buriedInsights || 'Important patterns and trends that could drive decision-making'}
Data Complexity Issues: ${dataComplexity || 'Too much data, unclear relationships, hard to interpret'}

As David's data revival specialist, help him:
1. Identify the most valuable insights hidden in the data
2. Transform complex data into clear, actionable intelligence
3. Create compelling data stories that resonate with stakeholders
4. Develop systematic approaches to uncover future insights
5. Build confidence in data interpretation and presentation

Focus on practical techniques that David can apply immediately to resurrect his buried insights.`;

    await sendMessage(prompt);
    setIsReviving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      <MicroLessonNavigator 
        chapterNumber={4}
        chapterTitle="Chapter 4: Data Intelligence"
        lessonTitle="David's Data Graveyard Revival"
        characterName="David"
      />
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/characters/david-avatar.png" alt="David" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-foreground">David's Data Graveyard Revival</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help David resurrect buried insights and transform spreadsheet chaos into compelling data stories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Data Archaeology</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="data">Describe your data situation:</Label>
                  <Textarea
                    id="data"
                    placeholder="What data do you have? Spreadsheets, reports, databases, surveys, etc."
                    value={dataDescription}
                    onChange={(e) => setDataDescription(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="insights">What insights are buried?</Label>
                  <Input
                    id="insights"
                    placeholder="What important patterns or trends do you suspect exist?"
                    value={buriedInsights}
                    onChange={(e) => setBuriedInsights(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="complexity">What makes your data complex?</Label>
                  <Textarea
                    id="complexity"
                    placeholder="What makes it hard to find insights in your data?"
                    value={dataComplexity}
                    onChange={(e) => setDataComplexity(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                
                <Button 
                  onClick={handleReviveData}
                  disabled={!dataDescription.trim() || isReviving}
                  className="w-full"
                  size="lg"
                >
                  {isReviving ? (
                    <>
                      <Eye className="h-4 w-4 mr-2 animate-pulse" />
                      Reviving Data Insights...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Resurrect My Data Insights
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
                <h2 className="text-xl font-semibold">David's Data Revival Session</h2>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 min-h-96 max-h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>David is here to help you transform your data graveyard into a treasure trove of actionable insights.</p>
                    <p className="text-sm mt-2">Share your data situation and let's uncover the valuable insights hiding in your data.</p>
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

export default DavidDataRevivalLesson;