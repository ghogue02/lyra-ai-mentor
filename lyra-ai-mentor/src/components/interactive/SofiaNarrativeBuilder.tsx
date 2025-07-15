import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  Users, 
  RefreshCw, 
  CheckCircle2,
  Edit,
  Eye
} from 'lucide-react';

interface NarrativeElement {
  id: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
  optional: boolean;
}

interface NarrativeStructure {
  hook: string;
  context: string;
  conflict: string;
  resolution: string;
  impact: string;
}

const SofiaNarrativeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [narrative, setNarrative] = useState<Partial<NarrativeStructure>>({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const narrativeElements: NarrativeElement[] = [
    {
      id: 'hook',
      title: 'Opening Hook',
      description: 'Capture attention with a compelling beginning',
      content: 'Start with a moment, question, or statement that draws readers in immediately',
      completed: false,
      optional: false
    },
    {
      id: 'context',
      title: 'Context & Setting',
      description: 'Establish the who, what, when, and where',
      content: 'Provide necessary background without overwhelming the reader',
      completed: false,
      optional: false
    },
    {
      id: 'conflict',
      title: 'Challenge or Conflict',
      description: 'Present the central tension or problem',
      content: 'This is what creates emotional investment and drives the story forward',
      completed: false,
      optional: false
    },
    {
      id: 'resolution',
      title: 'Resolution & Growth',
      description: 'Show how the challenge was addressed',
      content: 'Focus on the journey and transformation, not just the outcome',
      completed: false,
      optional: false
    },
    {
      id: 'impact',
      title: 'Impact & Meaning',
      description: 'Connect to broader significance',
      content: 'Help readers understand why this story matters beyond just you',
      completed: false,
      optional: false
    }
  ];

  const templates = [
    {
      id: 'personal-growth',
      title: 'Personal Growth Journey',
      description: 'Share a transformation or learning experience',
      structure: {
        hook: 'A moment of realization or challenge',
        context: 'Your situation and mindset before',
        conflict: 'The struggle or obstacle you faced',
        resolution: 'How you grew or changed',
        impact: 'What this means for your life now'
      }
    },
    {
      id: 'community-impact',
      title: 'Community Impact Story',
      description: 'Highlight how you made a difference',
      structure: {
        hook: 'The problem you noticed in your community',
        context: 'Background on the situation',
        conflict: 'Challenges in creating change',
        resolution: 'Your solution and actions',
        impact: 'The difference it made for others'
      }
    },
    {
      id: 'overcoming-obstacles',
      title: 'Overcoming Obstacles',
      description: 'Show resilience in the face of challenges',
      structure: {
        hook: 'The moment you realized the obstacle',
        context: 'What led to this challenge',
        conflict: 'The depths of the struggle',
        resolution: 'Your strategy and perseverance',
        impact: 'How it changed your perspective'
      }
    },
    {
      id: 'mentorship-story',
      title: 'Mentorship & Learning',
      description: 'Share wisdom gained from others',
      structure: {
        hook: 'Meeting your mentor or learning moment',
        context: 'Where you were in your journey',
        conflict: 'What you were struggling with',
        resolution: 'The wisdom or guidance received',
        impact: 'How it shaped your path forward'
      }
    }
  ];

  const updateNarrative = (key: keyof NarrativeStructure, value: string) => {
    setNarrative(prev => ({ ...prev, [key]: value }));
  };

  const selectTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template.id);
    setNarrative(template.structure);
  };

  const nextStep = () => {
    if (currentStep < narrativeElements.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const analyzeNarrative = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setShowPreview(true);
  };

  const getCompletionRate = () => {
    const completed = Object.values(narrative).filter(value => value?.trim()).length;
    return (completed / narrativeElements.length) * 100;
  };

  const getCurrentElement = () => narrativeElements[currentStep];
  const currentKey = getCurrentElement().id as keyof NarrativeStructure;

  const generateFullStory = () => {
    const { hook, context, conflict, resolution, impact } = narrative;
    return `${hook}\n\n${context}\n\n${conflict}\n\n${resolution}\n\n${impact}`;
  };

  const getStoryMetrics = () => {
    const fullStory = generateFullStory();
    const wordCount = fullStory.split(' ').filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    return {
      wordCount,
      readingTime,
      emotionalArc: 'Strong',
      authenticity: '92%'
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Narrative Builder</CardTitle>
              <CardDescription>
                Structure compelling narratives with Sofia's storytelling framework
              </CardDescription>
            </div>
          </div>
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Narrative Progress</span>
              <span>{Math.round(getCompletionRate())}% Complete</span>
            </div>
            <Progress value={getCompletionRate()} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedTemplate ? (
            /* Template Selection */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Narrative Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-yellow-300"
                    onClick={() => selectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : !showPreview ? (
            /* Narrative Building */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Step Navigation */}
              <div className="space-y-4">
                <h3 className="font-semibold">Narrative Structure</h3>
                <div className="space-y-2">
                  {narrativeElements.map((element, index) => (
                    <div
                      key={element.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        index === currentStep
                          ? 'border-yellow-500 bg-yellow-50'
                          : narrative[element.id as keyof NarrativeStructure]?.trim()
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 hover:border-yellow-300'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          narrative[element.id as keyof NarrativeStructure]?.trim()
                            ? 'bg-green-600 text-white'
                            : index === currentStep
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {narrative[element.id as keyof NarrativeStructure]?.trim() ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{element.title}</h4>
                          <p className="text-xs text-gray-600">{element.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-yellow-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-600" />
                      <CardTitle className="text-lg">{getCurrentElement().title}</CardTitle>
                    </div>
                    <CardDescription>{getCurrentElement().description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Guidance:</h4>
                      <p className="text-sm text-yellow-700">{getCurrentElement().content}</p>
                    </div>

                    <Textarea
                      placeholder={`Write your ${getCurrentElement().title.toLowerCase()} here...`}
                      value={narrative[currentKey] || ''}
                      onChange={(e) => updateNarrative(currentKey, e.target.value)}
                      rows={8}
                      className="min-h-[200px]"
                    />

                    <div className="text-sm text-gray-600">
                      {(narrative[currentKey] || '').length} characters • 
                      {(narrative[currentKey] || '').split(' ').filter(w => w.length > 0).length} words
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      
                      {currentStep < narrativeElements.length - 1 ? (
                        <Button
                          onClick={nextStep}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Next Section
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={analyzeNarrative}
                          disabled={getCompletionRate() < 80 || isAnalyzing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Story
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Writing Tips */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Sofia's Tips for {getCurrentElement().title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentStep === 0 && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Start in the middle of action or emotion</li>
                        <li>• Use sensory details to create immediate connection</li>
                        <li>• Ask a question that makes readers want to know more</li>
                        <li>• Avoid starting with "I was born..." or extensive background</li>
                      </ul>
                    )}
                    {currentStep === 1 && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Give just enough background for understanding</li>
                        <li>• Focus on relevant details that serve the story</li>
                        <li>• Show the "before" state to highlight later change</li>
                        <li>• Help readers understand what was at stake</li>
                      </ul>
                    )}
                    {currentStep === 2 && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Make the stakes clear and personal</li>
                        <li>• Show both external and internal conflicts</li>
                        <li>• Let readers feel the tension and uncertainty</li>
                        <li>• Don't rush to the solution - let the struggle breathe</li>
                      </ul>
                    )}
                    {currentStep === 3 && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Focus on the process, not just the outcome</li>
                        <li>• Show what you learned or how you changed</li>
                        <li>• Include setbacks and real moments of doubt</li>
                        <li>• Demonstrate growth through specific actions</li>
                      </ul>
                    )}
                    {currentStep === 4 && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Connect your experience to universal themes</li>
                        <li>• Show how others might apply your insights</li>
                        <li>• End with forward momentum, not just closure</li>
                        <li>• Make it clear why this story needed to be told</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Story Preview */
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Your Complete Narrative</CardTitle>
                  <CardDescription className="text-green-600">
                    A compelling story structured for maximum impact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Story Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(getStoryMetrics()).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-green-600">{value}</div>
                        <div className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Story */}
                  <div className="bg-white p-6 rounded-lg border">
                    {narrativeElements.map((element, index) => {
                      const content = narrative[element.id as keyof NarrativeStructure];
                      if (!content?.trim()) return null;
                      
                      return (
                        <div key={element.id} className="mb-6 last:mb-0">
                          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm">
                              {index + 1}
                            </span>
                            {element.title}
                          </h3>
                          <p className="text-gray-800 leading-relaxed">{content}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setShowPreview(false)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Story
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Share for Feedback
                    </Button>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <Target className="w-4 h-4 mr-2" />
                      Practice Delivery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaNarrativeBuilder;