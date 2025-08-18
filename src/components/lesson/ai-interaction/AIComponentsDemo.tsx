import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Eye, 
  Sparkles, 
  Heart, 
  Users, 
  Target,
  Brain,
  Settings,
  CheckCircle
} from 'lucide-react';

import { ProgressiveAIReveal, AIRevealStep } from './ProgressiveAIReveal';
import { CarmenAIProcessor, AIProcessingTask } from './CarmenAIProcessor';
import { InteractiveAIContent } from './InteractiveAIContent';
import { EnhancedCarmenAvatar } from './EnhancedCarmenAvatar';

export interface AIComponentsDemoProps {
  className?: string;
}

export const AIComponentsDemo: React.FC<AIComponentsDemoProps> = ({ className }) => {
  const [selectedComponent, setSelectedComponent] = useState<'progressive' | 'processor' | 'interactive' | 'avatar'>('progressive');
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [highContrast, setHighContrast] = useState(false);

  // Sample data for Progressive AI Reveal
  const progressiveSteps: AIRevealStep[] = [
    {
      id: 'analyze',
      title: 'Analyzing Current State',
      description: 'Carmen reviews your team\'s engagement data',
      processingMessage: 'Carmen is thoughtfully reviewing your team dynamics...',
      completionMessage: 'I\'ve identified key engagement patterns in your team',
      icon: <Brain className="w-5 h-5" />,
      estimatedDuration: 2000,
      characterPersonality: 'thoughtful',
      content: 'Based on your team data, I see strong collaboration but opportunities for individual recognition improvement.'
    },
    {
      id: 'strategize',
      title: 'Creating Strategy',
      description: 'Developing personalized engagement approaches',
      processingMessage: 'Carmen is crafting strategies tailored to each team member...',
      completionMessage: 'Your personalized engagement strategy is ready!',
      icon: <Target className="w-5 h-5" />,
      estimatedDuration: 3000,
      characterPersonality: 'strategic',
      content: 'I recommend a three-pronged approach: peer recognition, growth opportunities, and flexible work arrangements.'
    },
    {
      id: 'implement',
      title: 'Implementation Plan',
      description: 'Building actionable steps for rollout',
      processingMessage: 'Carmen is creating your implementation roadmap...',
      completionMessage: 'Your 90-day implementation plan is complete!',
      icon: <CheckCircle className="w-5 h-5" />,
      estimatedDuration: 2500,
      characterPersonality: 'empathetic',
      content: 'Week 1: Launch peer recognition system. Week 3: Individual development conversations. Week 6: Flexible work pilot.'
    }
  ];

  // Sample data for Carmen AI Processor
  const processingTasks: AIProcessingTask[] = [
    {
      id: 'survey-design',
      title: 'Engagement Survey Design',
      description: 'Create a comprehensive employee engagement survey',
      type: 'engagement-strategy',
      prompt: 'Design an engagement survey that captures individual motivation patterns and team dynamics',
      context: 'Carmen is creating engagement strategies that honor individual needs while building team cohesion',
      expectedOutputType: 'structured',
      estimatedTime: 3,
      carmenPersonality: {
        mode: 'analytical',
        message: 'I\'ve designed a survey that respects individual privacy while gathering actionable insights',
        emotion: 'focused',
        processingStyle: 'thorough'
      }
    },
    {
      id: 'action-plan',
      title: 'Engagement Action Plan',
      description: 'Develop specific actions based on survey insights',
      type: 'engagement-strategy',
      prompt: 'Create actionable engagement initiatives that can be implemented immediately',
      context: 'Carmen focuses on practical solutions that teams can start using right away',
      expectedOutputType: 'strategy',
      estimatedTime: 2,
      carmenPersonality: {
        mode: 'empathetic',
        message: 'These actions will help every team member feel valued and heard',
        emotion: 'caring',
        processingStyle: 'compassionate'
      }
    }
  ];

  const sampleContent = `**Employee Recognition Strategy**

At the heart of every great team is a culture where each person feels genuinely valued. This recognition strategy balances individual preferences with collective celebration.

## Core Principles
• **Individual Choice**: People prefer different types of recognition
• **Timely Feedback**: Recognition is most effective when it's immediate
• **Peer-to-Peer**: Colleagues often see contributions that managers miss
• **Growth-Oriented**: Recognition should connect to development opportunities

## Implementation Framework
1. **Discovery Phase**: Survey team members about their recognition preferences
2. **System Setup**: Implement multiple recognition channels
3. **Training**: Help managers and peers give meaningful recognition
4. **Measurement**: Track engagement improvements and gather feedback

This approach ensures that recognition feels authentic and meaningful to each team member.`;

  const deviceClasses = {
    mobile: 'max-w-sm mx-auto',
    tablet: 'max-w-2xl mx-auto',
    desktop: 'max-w-6xl mx-auto'
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-4">
            Enhanced AI Interaction Components Demo
          </h1>
          <p className="text-lg text-orange-700 max-w-3xl mx-auto">
            Experience Carmen's enhanced AI components designed for mobile-first responsive design with full accessibility support.
          </p>
        </div>

        {/* Controls */}
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Settings className="w-5 h-5" />
              <span>Demo Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* Device View Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Device View:</span>
                <div className="flex rounded-lg border border-gray-200 p-1">
                  {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
                    <Button
                      key={device}
                      size="sm"
                      variant={deviceView === device ? "default" : "ghost"}
                      onClick={() => setDeviceView(device)}
                      className="h-8 px-3"
                    >
                      {getDeviceIcon(device)}
                      <span className="ml-1 capitalize">{device}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Accessibility Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={highContrast ? "default" : "outline"}
                  onClick={() => setHighContrast(!highContrast)}
                  className="h-8"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  High Contrast
                </Button>
              </div>

              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Current: {deviceView} view
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Component Demo Area */}
        <div className={`${deviceClasses[deviceView]} transition-all duration-300 ${highContrast ? 'high-contrast' : ''}`}>
          <Tabs value={selectedComponent} onValueChange={(value) => setSelectedComponent(value as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="progressive" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className={deviceView === 'mobile' ? 'hidden' : 'inline'}>Progressive</span>
              </TabsTrigger>
              <TabsTrigger value="processor" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span className={deviceView === 'mobile' ? 'hidden' : 'inline'}>Processor</span>
              </TabsTrigger>
              <TabsTrigger value="interactive" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className={deviceView === 'mobile' ? 'hidden' : 'inline'}>Interactive</span>
              </TabsTrigger>
              <TabsTrigger value="avatar" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className={deviceView === 'mobile' ? 'hidden' : 'inline'}>Avatar</span>
              </TabsTrigger>
            </TabsList>

            {/* Progressive AI Reveal Demo */}
            <TabsContent value="progressive" className="space-y-4">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Progressive AI Reveal</CardTitle>
                  <p className="text-sm text-orange-600">
                    Watch as Carmen progressively reveals AI-generated content with character-specific processing states.
                  </p>
                </CardHeader>
                <CardContent>
                  <ProgressiveAIReveal
                    steps={progressiveSteps}
                    characterName="Carmen"
                    characterTheme="carmen"
                    showProgress={true}
                    autoAdvance={true}
                    pauseBetweenSteps={1500}
                    onStepComplete={(stepId, content) => console.log('Step completed:', stepId, content)}
                    onAllComplete={() => console.log('All steps completed!')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Carmen AI Processor Demo */}
            <TabsContent value="processor" className="space-y-4">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Carmen AI Processor</CardTitle>
                  <p className="text-sm text-orange-600">
                    Experience Carmen's personality-driven AI processing with different emotional states and processing styles.
                  </p>
                </CardHeader>
                <CardContent>
                  <CarmenAIProcessor
                    tasks={processingTasks}
                    showCarmenGuidance={true}
                    allowRetry={true}
                    allowExport={true}
                    maxRetries={3}
                    onTaskComplete={(taskId, content) => console.log('Task completed:', taskId, content)}
                    onAllComplete={(results) => console.log('All tasks completed:', results)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interactive AI Content Demo */}
            <TabsContent value="interactive" className="space-y-4">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Interactive AI Content</CardTitle>
                  <p className="text-sm text-orange-600">
                    Edit, refine, and version AI-generated content with Carmen's intelligent suggestions.
                  </p>
                </CardHeader>
                <CardContent>
                  <InteractiveAIContent
                    initialContent={sampleContent}
                    title="Employee Recognition Strategy"
                    contentType="engagement-strategy"
                    characterName="Carmen"
                    allowRefinement={true}
                    allowVersioning={true}
                    allowExport={true}
                    showCharacterGuidance={true}
                    maxVersions={5}
                    onContentChange={(content) => console.log('Content changed:', content)}
                    onSave={(content, metadata) => console.log('Content saved:', content, metadata)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Carmen Avatar Demo */}
            <TabsContent value="avatar" className="space-y-4">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Enhanced Carmen Avatar</CardTitle>
                  <p className="text-sm text-orange-600">
                    Chat with Carmen in her enhanced avatar system with personality modes and contextual assistance.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative min-h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <EnhancedCarmenAvatar
                      mode="embedded"
                      className="h-full"
                      lessonContext={{
                        chapterTitle: "AI Components Demo",
                        lessonTitle: "Enhanced Carmen Avatar",
                        content: "Interactive demo of Carmen's enhanced avatar system",
                        phase: "demo",
                        hrTopic: "engagement-builder"
                      }}
                      showPersonalityModes={true}
                      enableVoice={false}
                      contextualQuestions={[
                        "How do these new components improve the user experience?",
                        "What accessibility features are built into the components?",
                        "How does the mobile-first design work?",
                        "Can you explain the different personality modes?"
                      ]}
                      onEngagementChange={(engaged, messageCount) => 
                        console.log('Engagement changed:', engaged, messageCount)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature Summary */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Enhanced Features Implemented</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Mobile-First Design</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Responsive breakpoints</li>
                  <li>• Touch-optimized interactions</li>
                  <li>• Adaptive layouts</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Accessibility</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Screen reader support</li>
                  <li>• ARIA live regions</li>
                  <li>• Keyboard navigation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Character Personality</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Multiple personality modes</li>
                  <li>• Contextual responses</li>
                  <li>• Emotion-driven interactions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Progressive Loading</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Step-by-step reveal</li>
                  <li>• Processing animations</li>
                  <li>• Completion feedback</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Content Editing</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Real-time editing</li>
                  <li>• Version history</li>
                  <li>• Refinement suggestions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Enhanced Chat</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Carmen-specific responses</li>
                  <li>• Contextual questions</li>
                  <li>• Personality switching</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIComponentsDemo;