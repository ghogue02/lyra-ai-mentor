import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Heart, Brain, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface VoiceProfile {
  authenticity: number;
  clarity: number;
  uniqueness: number;
  confidence: number;
  characteristics: string[];
  strengths: string[];
  suggestions: string[];
}

interface DiscoveryPrompt {
  id: string;
  category: 'values' | 'experiences' | 'perspective' | 'passion';
  question: string;
  helperText: string;
}

const SofiaVoiceDiscoveryEngine: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // Add swipe gestures for mobile navigation
  useSwipeGestures({
    onSwipeLeft: () => {
      if (currentPrompt < discoveryPrompts.length - 1 && responses[discoveryPrompts[currentPrompt].id]?.trim()) {
        nextPrompt();
      }
    },
    onSwipeRight: () => {
      if (currentPrompt > 0) {
        prevPrompt();
      }
    }
  });

  const discoveryPrompts: DiscoveryPrompt[] = [
    {
      id: 'core_values',
      category: 'values',
      question: 'What values guide your decisions when no one is watching?',
      helperText: 'Think about moments when you acted according to your deepest principles, even when it was difficult.'
    },
    {
      id: 'defining_moment',
      category: 'experiences',
      question: 'Describe a moment that fundamentally changed how you see yourself or the world.',
      helperText: 'This could be a success, failure, loss, discovery, or any experience that shifted your perspective.'
    },
    {
      id: 'unique_perspective',
      category: 'perspective',
      question: 'What do you see or understand differently than most people around you?',
      helperText: 'Consider your background, experiences, or insights that give you a unique viewpoint.'
    },
    {
      id: 'passionate_about',
      category: 'passion',
      question: 'What could you talk about for hours without getting tired?',
      helperText: 'Think beyond just interests - what energizes you and makes you feel most alive?'
    },
    {
      id: 'greatest_fear',
      category: 'vulnerability',
      question: 'What fear holds you back, and how do you work with it?',
      helperText: 'Authentic voices often emerge when we acknowledge and work with our vulnerabilities.'
    },
    {
      id: 'impact_story',
      category: 'purpose',
      question: 'Tell me about a time when you made a difference in someone\'s life.',
      helperText: 'This could be small or large - focus on how it felt and what it meant to you.'
    },
    {
      id: 'authentic_self',
      category: 'identity',
      question: 'When do you feel most like yourself?',
      helperText: 'Describe the circumstances, people, or activities where your true self emerges naturally.'
    }
  ];

  const updateResponse = (promptId: string, response: string) => {
    setResponses(prev => ({ ...prev, [promptId]: response }));
  };

  const nextPrompt = () => {
    if (currentPrompt < discoveryPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
    }
  };

  const prevPrompt = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1);
    }
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis of responses
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const responseCount = Object.keys(responses).length;
    const avgResponseLength = Object.values(responses).reduce((sum, resp) => sum + resp.length, 0) / responseCount;
    
    // Calculate voice metrics based on responses
    const authenticity = Math.min(100, 60 + (responseCount * 5) + (avgResponseLength > 100 ? 15 : 0));
    const clarity = Math.min(100, 50 + (responseCount * 6) + (avgResponseLength > 150 ? 20 : 10));
    const uniqueness = Math.min(100, 55 + (responseCount * 5) + (Math.random() * 15));
    const confidence = Math.min(100, 45 + (responseCount * 7) + (avgResponseLength > 120 ? 18 : 8));
    
    const characteristics = [
      'Empathetic storyteller',
      'Values-driven communicator',
      'Authentic vulnerability',
      'Purpose-focused narrative',
      'Community-centered perspective'
    ];
    
    const strengths = [
      'Natural ability to connect personal experience to universal themes',
      'Strong emotional intelligence in storytelling',
      'Genuine vulnerability that builds trust',
      'Clear sense of purpose and values',
      'Ability to find meaning in everyday experiences'
    ];
    
    const suggestions = [
      'Trust your instinct to share personal experiences - they\'re your greatest strength',
      'Practice weaving your values into your stories more explicitly',
      'Consider how your unique background offers perspectives others need to hear',
      'Experiment with different ways to express vulnerability safely',
      'Develop signature phrases or metaphors that reflect your worldview'
    ];
    
    const profile: VoiceProfile = {
      authenticity: Math.round(authenticity),
      clarity: Math.round(clarity),
      uniqueness: Math.round(uniqueness),
      confidence: Math.round(confidence),
      characteristics,
      strengths,
      suggestions
    };
    
    setVoiceProfile(profile);
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const getProgressPercentage = () => {
    return (Object.keys(responses).length / discoveryPrompts.length) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'values': return Heart;
      case 'experiences': return Brain;
      case 'perspective': return Sparkles;
      case 'passion': return Mic;
      default: return CheckCircle2;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'values': return 'text-red-600';
      case 'experiences': return 'text-blue-600';
      case 'perspective': return 'text-purple-600';
      case 'passion': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const startOver = () => {
    setCurrentPrompt(0);
    setResponses({});
    setVoiceProfile(null);
    setShowResults(false);
  };

  const currentPromptData = discoveryPrompts[currentPrompt];
  const Icon = getCategoryIcon(currentPromptData?.category);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl md:text-2xl truncate">Voice Discovery Engine</CardTitle>
              <CardDescription className="text-sm">
                {isMobile ? 'Find your authentic voice' : 'Find your authentic voice through guided self-reflection'}
              </CardDescription>
            </div>
          </div>
          {/* Progress Bar - Mobile optimized */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Discovery Progress</span>
              <span>{Object.keys(responses).length}/{discoveryPrompts.length} prompts completed</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResults ? (
            /* Discovery Process */
            <div className="space-y-6">
              {/* Current Prompt */}
              <Card className="border-yellow-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${getCategoryColor(currentPromptData.category)}`} />
                    <div>
                      <CardTitle className="text-lg">
                        Question {currentPrompt + 1} of {discoveryPrompts.length}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {currentPromptData.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      {currentPromptData.question}
                    </h3>
                    <p className="text-sm text-yellow-700">
                      {currentPromptData.helperText}
                    </p>
                  </div>
                  
                  <Textarea
                    placeholder="Take your time to reflect and write authentically..."
                    value={responses[currentPromptData.id] || ''}
                    onChange={(e) => updateResponse(currentPromptData.id, e.target.value)}
                    rows={6}
                    className="min-h-[150px]"
                  />
                  
                  <div className="text-sm text-gray-600">
                    {(responses[currentPromptData.id] || '').length} characters
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={prevPrompt}
                      disabled={currentPrompt === 0}
                    >
                      Previous
                    </Button>
                    
                    {currentPrompt < discoveryPrompts.length - 1 ? (
                      <Button
                        onClick={nextPrompt}
                        disabled={!responses[currentPromptData.id]?.trim()}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={analyzeVoice}
                        disabled={Object.keys(responses).length < 4 || isAnalyzing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Voice...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Discover My Voice
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Prompts Summary */}
              {Object.keys(responses).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Responses So Far</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {discoveryPrompts.filter(p => responses[p.id]).map((prompt, index) => (
                        <div key={prompt.id} className="border-l-4 border-yellow-300 pl-4">
                          <h4 className="font-medium text-sm">{prompt.question}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {responses[prompt.id].substring(0, 100)}
                            {responses[prompt.id].length > 100 ? '...' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Voice Profile Results */
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Your Authentic Voice Profile</CardTitle>
                  <CardDescription className="text-green-600">
                    Based on your reflections, here's what makes your voice unique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(voiceProfile!.authenticity)}`}>
                        {voiceProfile!.authenticity}%
                      </div>
                      <div className="text-sm text-gray-600">Authenticity</div>
                      <Progress value={voiceProfile!.authenticity} className="mt-2 h-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(voiceProfile!.clarity)}`}>
                        {voiceProfile!.clarity}%
                      </div>
                      <div className="text-sm text-gray-600">Clarity</div>
                      <Progress value={voiceProfile!.clarity} className="mt-2 h-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(voiceProfile!.uniqueness)}`}>
                        {voiceProfile!.uniqueness}%
                      </div>
                      <div className="text-sm text-gray-600">Uniqueness</div>
                      <Progress value={voiceProfile!.uniqueness} className="mt-2 h-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(voiceProfile!.confidence)}`}>
                        {voiceProfile!.confidence}%
                      </div>
                      <div className="text-sm text-gray-600">Confidence</div>
                      <Progress value={voiceProfile!.confidence} className="mt-2 h-2" />
                    </div>
                  </div>

                  {/* Voice Characteristics */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3">Your Voice Characteristics:</h3>
                    <div className="flex flex-wrap gap-2">
                      {voiceProfile!.characteristics.map((char, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3">Your Storytelling Strengths:</h3>
                    <ul className="space-y-2">
                      {voiceProfile!.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3">Sofia's Recommendations:</h3>
                    <ul className="space-y-2">
                      {voiceProfile!.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 justify-center pt-4">
                    <Button variant="outline" onClick={startOver}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Create Story with My Voice
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

export default SofiaVoiceDiscoveryEngine;