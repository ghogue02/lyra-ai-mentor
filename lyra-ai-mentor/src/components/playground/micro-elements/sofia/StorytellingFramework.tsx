import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Lightbulb, Heart, Zap, Download } from 'lucide-react';

interface StoryFramework {
  situation: string;
  task: string;
  action: string;
  result: string;
  emotion: string;
  lesson: string;
}

const StorytellingFramework: React.FC = () => {
  const [framework, setFramework] = useState<StoryFramework>({
    situation: '',
    task: '',
    action: '',
    result: '',
    emotion: '',
    lesson: ''
  });
  
  const [generatedStory, setGeneratedStory] = useState('');
  const [storyType, setStoryType] = useState('impact');

  const storyTypes = {
    impact: {
      name: 'Impact Story',
      description: 'Show the real-world change your work creates',
      template: 'Challenge → Action → Transformation'
    },
    journey: {
      name: 'Journey Story',
      description: 'Share personal or organizational growth',
      template: 'Starting Point → Obstacles → Growth → New Reality'
    },
    vision: {
      name: 'Vision Story',
      description: 'Paint a picture of the future you\'re building',
      template: 'Current State → Desired Future → Path Forward'
    }
  };

  const generateStory = () => {
    if (!framework.situation || !framework.action || !framework.result) return;
    
    const story = `
**The Challenge**
${framework.situation}

**What We Did**
${framework.action}

**The Impact**
${framework.result}

**The Feeling**
${framework.emotion}

**The Lesson**
${framework.lesson}

**Call to Action**
This is why your support matters. Together, we can create more stories like this one.
    `.trim();
    
    setGeneratedStory(story);
  };

  const exportStory = () => {
    const storyData = {
      framework: framework,
      generatedStory: generatedStory,
      storyType: storyType,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(storyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'storytelling-framework.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Storytelling Framework</h1>
        </div>
        <p className="text-muted-foreground">
          Build compelling stories that connect with your audience and drive action.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(storyTypes).map(([key, type]) => (
          <Card 
            key={key} 
            className={`cursor-pointer transition-all ${
              storyType === key ? 'ring-2 ring-purple-500' : 'hover:shadow-md'
            }`}
            onClick={() => setStoryType(key)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{type.name}</CardTitle>
              <CardDescription className="text-sm">{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-xs">
                {type.template}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Story Builder
          </CardTitle>
          <CardDescription>
            Fill in each section to build your story using the STAR+E+L framework.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Situation/Challenge</label>
              <Textarea
                placeholder="What was the situation or challenge? Set the scene..."
                value={framework.situation}
                onChange={(e) => setFramework(prev => ({ ...prev, situation: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Task/Goal</label>
              <Input
                placeholder="What needed to be accomplished?"
                value={framework.task}
                onChange={(e) => setFramework(prev => ({ ...prev, task: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Action Taken</label>
              <Textarea
                placeholder="What specific actions were taken? Be detailed..."
                value={framework.action}
                onChange={(e) => setFramework(prev => ({ ...prev, action: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Result/Impact</label>
              <Textarea
                placeholder="What was the outcome? Include specific results..."
                value={framework.result}
                onChange={(e) => setFramework(prev => ({ ...prev, result: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Emotion</label>
              <Input
                placeholder="How did it feel? What emotions were involved?"
                value={framework.emotion}
                onChange={(e) => setFramework(prev => ({ ...prev, emotion: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Lesson/Takeaway</label>
              <Input
                placeholder="What's the key lesson or insight?"
                value={framework.lesson}
                onChange={(e) => setFramework(prev => ({ ...prev, lesson: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={generateStory}
            className="w-full flex items-center gap-2"
            disabled={!framework.situation || !framework.action || !framework.result}
          >
            <Zap className="h-4 w-4" />
            Generate Story
          </Button>
        </CardContent>
      </Card>

      {generatedStory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Generated Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-medium">
                {generatedStory}
              </pre>
            </div>
            
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                Your story is ready! You can now use this in emails, presentations, or social media.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button onClick={exportStory} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Story Framework
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StorytellingFramework;