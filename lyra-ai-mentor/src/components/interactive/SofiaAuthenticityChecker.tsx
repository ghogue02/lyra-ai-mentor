import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Eye, 
  RefreshCw, 
  TrendingUp,
  Users,
  Target,
  Star
} from 'lucide-react';

interface AuthenticityMetrics {
  overall: number;
  vulnerability: number;
  specificity: number;
  universality: number;
  emotionalHonesty: number;
  personalVoice: number;
}

interface AuthenticityFeedback {
  strengths: string[];
  improvements: string[];
  authenticity_markers: string[];
  red_flags: string[];
  suggestions: string[];
}

interface StoryAnalysis {
  metrics: AuthenticityMetrics;
  feedback: AuthenticityFeedback;
  grade: 'A' | 'B' | 'C' | 'D';
  readyToShare: boolean;
}

const SofiaAuthenticityChecker: React.FC = () => {
  const [storyText, setStoryText] = useState('');
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkedStories, setCheckedStories] = useState<number>(0);

  const exampleStories = [
    {
      title: 'Authentic Example',
      text: `Last Tuesday, I cried in the grocery store parking lot. Not dramatic sobbing - just quiet tears while sitting in my car, holding a rejection email on my phone.

I'd applied for a position I really wanted, one that felt like it was made for me. When I saw "Thank you for your interest, but..." I felt this familiar sting of not being enough.

But here's what surprised me: after five minutes of feeling sorry for myself, I started laughing. Not because rejection is funny, but because I realized I was proud of myself for trying. Six months ago, I wouldn't have even applied.

That night, I called my sister and told her about it. She said, "You know what I love about you? You bounce back faster every time." And she was right. Each rejection taught me something about resilience I couldn't learn any other way.

Now when I see that grocery store, I don't think about failure. I think about the courage it takes to keep trying, and how that moment in the parking lot was actually a victory disguised as a defeat.`
    },
    {
      title: 'Needs More Authenticity',
      text: `I faced many challenges in my career, but I always persevered through hard work and determination. Success doesn't come easy, but with the right mindset, anyone can achieve their goals.

There were times when I felt discouraged, but I learned valuable lessons from each setback. These experiences made me stronger and more resilient. I discovered that failure is just a stepping stone to success.

Through positive thinking and consistent effort, I overcame obstacles and reached my objectives. This journey taught me the importance of believing in yourself and never giving up on your dreams.`
    }
  ];

  const analyzeStory = async () => {
    if (!storyText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate metrics based on text analysis
    const wordCount = storyText.split(' ').length;
    const personalPronouns = (storyText.match(/\b(I|me|my|myself)\b/gi) || []).length;
    const emotionWords = (storyText.match(/\b(felt|feel|crying|laughing|afraid|happy|sad|angry|excited|nervous|proud|embarrassed|grateful|frustrated)\b/gi) || []).length;
    const specificDetails = (storyText.match(/\b(exactly|specifically|Tuesday|3pm|red dress|coffee shop|grocery store)\b/gi) || []).length;
    const vulnerableWords = (storyText.match(/\b(failed|mistake|wrong|embarrassed|cried|scared|confused|uncertain)\b/gi) || []).length;
    const cliches = (storyText.match(/\b(everything happens for a reason|blessing in disguise|when life gives you lemons|journey of a thousand miles)\b/gi) || []).length;
    
    // Calculate scores
    const vulnerability = Math.min(100, 40 + (vulnerableWords * 15) + (emotionWords * 8));
    const specificity = Math.min(100, 30 + (specificDetails * 20) + (wordCount > 100 ? 15 : 0));
    const personalVoice = Math.min(100, 50 + (personalPronouns / wordCount * 100) * 2 - (cliches * 20));
    const emotionalHonesty = Math.min(100, 35 + (emotionWords * 12) + (vulnerableWords * 10));
    const universality = Math.min(100, 60 + Math.random() * 30);
    const overall = (vulnerability + specificity + personalVoice + emotionalHonesty + universality) / 5;
    
    const metrics: AuthenticityMetrics = {
      overall: Math.round(overall),
      vulnerability: Math.round(vulnerability),
      specificity: Math.round(specificity),
      universality: Math.round(universality),
      emotionalHonesty: Math.round(emotionalHonesty),
      personalVoice: Math.round(personalVoice)
    };
    
    // Generate feedback
    const strengths = [];
    const improvements = [];
    const authenticity_markers = [];
    const red_flags = [];
    const suggestions = [];
    
    if (vulnerability >= 70) {
      strengths.push('Strong vulnerability - you\'re sharing real, human experiences');
      authenticity_markers.push('Honest about difficult emotions');
    } else {
      improvements.push('Consider sharing more about your internal experience');
      suggestions.push('What were you really feeling in that moment?');
    }
    
    if (specificity >= 70) {
      strengths.push('Rich, specific details that feel real and lived-in');
      authenticity_markers.push('Concrete details that only you would know');
    } else {
      improvements.push('Add more specific, sensory details');
      suggestions.push('What exactly did you see, hear, or feel?');
    }
    
    if (personalVoice >= 70) {
      strengths.push('Clear personal voice comes through');
      authenticity_markers.push('Sounds like a real person talking');
    } else {
      improvements.push('Let more of your unique voice come through');
      suggestions.push('Write like you\'re talking to a close friend');
    }
    
    if (cliches > 0) {
      red_flags.push('Contains clichés that distance readers');
      suggestions.push('Replace common phrases with your own words');
    }
    
    if (emotionWords < 3) {
      red_flags.push('Limited emotional expression');
      suggestions.push('Don\'t be afraid to name your feelings directly');
    }
    
    if (wordCount < 50) {
      improvements.push('Story feels too brief to build connection');
      suggestions.push('Expand with more detail and context');
    }
    
    const feedback: AuthenticityFeedback = {
      strengths,
      improvements,
      authenticity_markers,
      red_flags,
      suggestions
    };
    
    // Determine grade and readiness
    let grade: 'A' | 'B' | 'C' | 'D' = 'D';
    if (overall >= 85) grade = 'A';
    else if (overall >= 75) grade = 'B';
    else if (overall >= 65) grade = 'C';
    
    const readyToShare = overall >= 75 && red_flags.length === 0;
    
    const storyAnalysis: StoryAnalysis = {
      metrics,
      feedback,
      grade,
      readyToShare
    };
    
    setAnalysis(storyAnalysis);
    setIsAnalyzing(false);
    setCheckedStories(prev => prev + 1);
  };

  const loadExample = (example: typeof exampleStories[0]) => {
    setStoryText(example.text);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const reset = () => {
    setStoryText('');
    setAnalysis(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Authenticity Checker</CardTitle>
              <CardDescription>
                Validate your story's authenticity before sharing with the world
              </CardDescription>
            </div>
          </div>
          {checkedStories > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Stories checked: {checkedStories} • Keep practicing to strengthen your authentic voice!
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story Input */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Story</CardTitle>
                  <CardDescription>Paste your story for authenticity analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Share your story here..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    rows={12}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="text-sm text-gray-600">
                    {storyText.length} characters • {storyText.split(' ').filter(w => w.length > 0).length} words
                  </div>
                </CardContent>
              </Card>

              {/* Example Stories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Try These Examples</CardTitle>
                  <CardDescription>See how different stories score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {exampleStories.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => loadExample(example)}
                    >
                      <div>
                        <div className="font-medium">{example.title}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {example.text.substring(0, 80)}...
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Button
                onClick={analyzeStory}
                disabled={!storyText.trim() || isAnalyzing}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Authenticity...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Check Authenticity
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              {analysis ? (
                <div className="space-y-4">
                  {/* Overall Grade */}
                  <Card className={`border-2 ${
                    analysis.readyToShare ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Authenticity Grade</CardTitle>
                        <div className={`text-4xl font-bold ${getGradeColor(analysis.grade)}`}>
                          {analysis.grade}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        {analysis.readyToShare ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">Ready to share!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">Needs refinement</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Overall authenticity score: {analysis.metrics.overall}%
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Authenticity Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(analysis.metrics).filter(([key]) => key !== 'overall').map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-bold ${getScoreColor(value)}`}>
                              {value}%
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  {analysis.feedback.strengths.length > 0 && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          What's Working
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-green-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Authenticity Markers */}
                  {analysis.feedback.authenticity_markers.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Authenticity Markers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {analysis.feedback.authenticity_markers.map((marker, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Heart className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-700">{marker}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Red Flags */}
                  {analysis.feedback.red_flags.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Red Flags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.feedback.red_flags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-700">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Improvements */}
                  {analysis.feedback.improvements.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Areas for Growth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-yellow-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggestions */}
                  {analysis.feedback.suggestions.length > 0 && (
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Sofia's Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs text-white font-bold">?</span>
                              </div>
                              <span className="text-sm text-purple-700">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={reset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Check Another Story
                    </Button>
                    {analysis.readyToShare && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Share This Story
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-center">
                      Share your story to receive<br />
                      detailed authenticity feedback
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SofiaAuthenticityChecker;