import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp,
  Eye,
  Sparkles,
  Target,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { LearningPath } from '@/components/learning/LearningPath';
import { enhancedAIService } from '@/services/enhancedAIService';

interface DataPattern {
  type: 'trend' | 'comparison' | 'anomaly';
  label: string;
  icon: React.ReactNode;
  example: string;
}

const dataPatterns: DataPattern[] = [
  { 
    type: 'trend', 
    label: 'Rising Trend', 
    icon: <ArrowUp className="w-4 h-4 text-green-600" />,
    example: 'Attendance up 23% over 3 months'
  },
  { 
    type: 'trend', 
    label: 'Declining Trend', 
    icon: <ArrowDown className="w-4 h-4 text-red-600" />,
    example: 'Volunteer hours down 15%'
  },
  { 
    type: 'comparison', 
    label: 'Group Comparison', 
    icon: <Users className="w-4 h-4 text-blue-600" />,
    example: 'Program A vs Program B outcomes'
  },
  { 
    type: 'anomaly', 
    label: 'Unusual Pattern', 
    icon: <Eye className="w-4 h-4 text-purple-600" />,
    example: 'Spike in donations every December'
  }
];

export const DavidDataLearningPath: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<DataPattern | null>(null);
  const [storyElements, setStoryElements] = useState({
    context: '',
    insight: '',
    impact: ''
  });
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const objectives = [
    {
      id: '1',
      title: 'Find Stories in Your Data',
      description: 'Learn to spot meaningful patterns that matter to stakeholders'
    },
    {
      id: '2',
      title: 'Turn Numbers into Narratives',
      description: 'Transform dry statistics into compelling stories'
    },
    {
      id: '3',
      title: 'Create Impact with Insights',
      description: 'Present data that drives decisions and action'
    }
  ];

  const steps = [
    {
      id: 'learn',
      title: 'Learn Pattern Recognition',
      duration: '30 seconds',
      type: 'learn' as const,
      content: null,
      completed: false
    },
    {
      id: 'practice',
      title: 'Build Your Story',
      duration: '2 minutes',
      type: 'practice' as const,
      content: null,
      completed: false
    },
    {
      id: 'apply',
      title: 'Present Your Insight',
      duration: '2.5 minutes',
      type: 'apply' as const,
      content: null,
      completed: false
    }
  ];

  const tips = [
    { id: '1', tip: 'Start with WHY this data matters before showing WHAT it says', emoji: '🎯' },
    { id: '2', tip: 'Use comparisons to make numbers meaningful: "enough to fill 3 classrooms"', emoji: '📊' },
    { id: '3', tip: 'Lead with the outcome: "We helped 50% more families" beats "Clients: 150→225"', emoji: '📈' },
    { id: '4', tip: 'Connect data to real people: "Behind each number is a child\'s future"', emoji: '👥' },
    { id: '5', tip: 'AI can help you find patterns you might miss - ask it to analyze trends!', emoji: '🤖' }
  ];

  const generateDataStory = async () => {
    if (!selectedPattern || !storyElements.context || !storyElements.insight || !storyElements.impact) {
      toast.error('Please complete all story elements first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const story = `📊 Data Story: ${selectedPattern.example}

Context: ${storyElements.context}

Key Insight: ${storyElements.insight}

Impact: ${storyElements.impact}

What This Means:
This ${selectedPattern.label.toLowerCase()} reveals an important opportunity for our organization. By understanding this pattern, we can make data-driven decisions that directly benefit our community.

Next Steps:
1. Share this insight with stakeholders
2. Develop action plan based on findings
3. Track progress monthly`;

      setGeneratedStory(story);
      toast.success('Data story created!');
    } catch (error) {
      toast.error('Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'learn':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                The Data Storytelling Formula
              </h3>
              <p className="text-gray-700 mb-4">
                Great data stories follow a simple pattern that transforms numbers into action:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Find the Pattern</p>
                    <p className="text-sm text-gray-600">What's happening? Rising, falling, or unusual?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Explain the Why</p>
                    <p className="text-sm text-gray-600">What caused this? Why should we care?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Show the Impact</p>
                    <p className="text-sm text-gray-600">What happens if we act (or don't)?</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Before & After Example:</p>
                    <p className="text-sm text-orange-700 mt-2">
                      <strong>Before:</strong> "Q3 donations: $45,000 (up 18%)"<br />
                      <strong>After:</strong> "Your year-end campaign inspired 18% more giving - enough to serve 30 additional families through winter!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {dataPatterns.map((pattern) => (
                <Card key={pattern.label} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {pattern.icon}
                      <span className="font-medium">{pattern.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{pattern.example}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Build Your Data Story</h3>
              <p className="text-gray-600 mt-1">Transform numbers into narrative in 3 steps</p>
            </div>

            {/* Step 1: Choose Pattern */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">1</span>
                </div>
                What pattern did you find?
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {dataPatterns.map((pattern) => (
                  <Button
                    key={pattern.label}
                    variant={selectedPattern?.label === pattern.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <div className="flex items-center gap-2">
                      {pattern.icon}
                      <div className="text-left">
                        <div className="font-medium text-sm">{pattern.label}</div>
                        <div className="text-xs opacity-80">{pattern.example}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Step 2: Add Context */}
            {selectedPattern && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-700">2</span>
                  </div>
                  Add context (Why does this matter?)
                </h4>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Example: This trend started when we launched our new mentorship program..."
                  value={storyElements.context}
                  onChange={(e) => setStoryElements(prev => ({ ...prev, context: e.target.value }))}
                />
              </div>
            )}

            {/* Step 3: Describe Insight */}
            {storyElements.context && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">3</span>
                  </div>
                  What's the key insight?
                </h4>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={2}
                  placeholder="Example: Personal mentorship doubles student engagement..."
                  value={storyElements.insight}
                  onChange={(e) => setStoryElements(prev => ({ ...prev, insight: e.target.value }))}
                />
              </div>
            )}

            {/* Step 4: Impact */}
            {storyElements.insight && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">4</span>
                  </div>
                  What's the impact?
                </h4>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={2}
                  placeholder="Example: This could help 200 more students succeed this year..."
                  value={storyElements.impact}
                  onChange={(e) => setStoryElements(prev => ({ ...prev, impact: e.target.value }))}
                />
              </div>
            )}

            {/* AI Helper Tip */}
            {storyElements.context && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="pt-4">
                  <p className="text-sm">
                    <strong>💡 AI Tip:</strong> When using AI, provide your data and ask: 
                    "What story does this data tell about our impact on families?"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-6">
            {!generatedStory ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Create Your Data Story!</h3>
                <p className="text-gray-600">
                  Let's transform your insights into a compelling narrative
                </p>
                
                <Button
                  onClick={generateDataStory}
                  disabled={isGenerating || !selectedPattern || !storyElements.context}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Creating story...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Generate Data Story
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Data Story</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to share
                  </Badge>
                </div>

                {/* Story Preview */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {generatedStory}
                    </pre>
                  </CardContent>
                </Card>

                {/* Visual Impact */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium text-blue-900 mb-3">
                      Your Story's Impact:
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <TrendingUp className="w-8 h-8 mx-auto mb-1 text-green-600" />
                        <p className="text-2xl font-bold text-gray-900">3x</p>
                        <p className="text-xs text-gray-600">More engaging</p>
                      </div>
                      <div>
                        <Users className="w-8 h-8 mx-auto mb-1 text-blue-600" />
                        <p className="text-2xl font-bold text-gray-900">87%</p>
                        <p className="text-xs text-gray-600">Better recall</p>
                      </div>
                      <div>
                        <DollarSign className="w-8 h-8 mx-auto mb-1 text-purple-600" />
                        <p className="text-2xl font-bold text-gray-900">2x</p>
                        <p className="text-xs text-gray-600">Action rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 mb-3">Transform more data into stories!</p>
                  <Button 
                    onClick={() => {
                      setGeneratedStory('');
                      setSelectedPattern(null);
                      setStoryElements({ context: '', insight: '', impact: '' });
                    }} 
                    variant="outline"
                  >
                    Create Another Story
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LearningPath
      title="Data Storytelling in 5 Minutes"
      skill="Transform Numbers into Narratives"
      estimatedMinutes={5}
      objectives={objectives}
      steps={steps}
      tips={tips}
      onComplete={(data) => {
        console.log('Learning path completed:', data);
        toast.success('You\'ve mastered data storytelling!');
      }}
    >
      {renderStepContent(steps.find(s => !s.completed)?.id || 'learn')}
    </LearningPath>
  );
};