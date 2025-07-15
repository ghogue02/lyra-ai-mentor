import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Volume2, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface ToneAnalysis {
  overall: 'professional' | 'warm' | 'neutral' | 'cold' | 'informal';
  confidence: number;
  warmth: number;
  clarity: number;
  professionalism: number;
  suggestions: string[];
  improvedVersion?: string;
  emotionalTone: string[];
}

const MayaToneChecker: React.FC = () => {
  const [emailText, setEmailText] = useState('');
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');

  const exampleEmails = [
    {
      title: 'Too Cold',
      content: `Your request has been denied. The policy clearly states that exceptions are not permitted. 

Please refer to the handbook for guidelines.

Best,
Maya`
    },
    {
      title: 'Good Balance',
      content: `Hi Sarah,

Thank you for reaching out about the pickup procedure concerns. I completely understand your worries as a parent, and I appreciate you bringing this to my attention.

After reviewing our current process, I can see where improvements are needed. Let me share what we're implementing to address your concerns and ensure all families feel confident about their children's safety.

I'd love to schedule a brief call this week to discuss this further and hear any additional thoughts you might have.

Warm regards,
Maya`
    },
    {
      title: 'Too Informal',
      content: `Hey there!

So about that thing you mentioned... yeah, we can totally work on that! LOL, I know our pickup thing has been kinda crazy lately. 

Let me know what you think and we'll figure it out! 😊

Maya`
    }
  ];

  const analyzeEmailTone = async () => {
    if (!emailText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple tone analysis logic
    const text = emailText.toLowerCase();
    
    // Calculate metrics
    const warmthWords = ['thank', 'appreciate', 'understand', 'feel', 'care', 'welcome', 'glad', 'happy'];
    const coldWords = ['denied', 'not permitted', 'policy', 'must', 'required', 'cannot'];
    const professionalWords = ['regarding', 'concerning', 'please', 'sincerely', 'best regards', 'cordially'];
    const informalWords = ['hey', 'yeah', 'lol', 'kinda', 'totally', 'awesome'];
    
    const warmthScore = warmthWords.filter(word => text.includes(word)).length * 20;
    const coldScore = coldWords.filter(word => text.includes(word)).length * 15;
    const professionalScore = professionalWords.filter(word => text.includes(word)).length * 15;
    const informalScore = informalWords.filter(word => text.includes(word)).length * 20;
    
    const warmth = Math.min(100, Math.max(20, warmthScore - coldScore + 40));
    const professionalism = Math.min(100, Math.max(20, professionalScore - informalScore + 50));
    const clarity = emailText.split('.').length > 2 ? 80 : 60;
    const confidence = text.includes('i understand') || text.includes('we can') ? 85 : 65;
    
    // Determine overall tone
    let overall: ToneAnalysis['overall'] = 'neutral';
    if (warmth > 70 && professionalism > 60) overall = 'warm';
    else if (professionalism > 80) overall = 'professional';
    else if (warmth < 40 || coldScore > 0) overall = 'cold';
    else if (informalScore > 0) overall = 'informal';
    
    // Generate suggestions
    const suggestions = [];
    if (warmth < 60) suggestions.push('Add more empathetic language to show understanding');
    if (professionalism < 50) suggestions.push('Use more professional language and structure');
    if (clarity < 70) suggestions.push('Break content into shorter, clearer sentences');
    if (confidence < 70) suggestions.push('Express more confidence in your solutions and expertise');
    if (text.includes('no') || text.includes('cannot')) suggestions.push('Focus on what you CAN do rather than what you cannot');
    
    // Identify emotional tones
    const emotionalTone = [];
    if (warmth > 70) emotionalTone.push('Empathetic');
    if (confidence > 75) emotionalTone.push('Confident');
    if (professionalism > 75) emotionalTone.push('Professional');
    if (text.includes('thank') || text.includes('appreciate')) emotionalTone.push('Grateful');
    if (coldScore > 0) emotionalTone.push('Distant');
    if (informalScore > 0) emotionalTone.push('Casual');
    
    const mockAnalysis: ToneAnalysis = {
      overall,
      confidence: Math.round(confidence),
      warmth: Math.round(warmth),
      clarity: Math.round(clarity),
      professionalism: Math.round(professionalism),
      suggestions,
      emotionalTone
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'warm': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'cold': return 'bg-red-100 text-red-800';
      case 'informal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const loadExample = (example: typeof exampleEmails[0]) => {
    setEmailText(example.content);
    setSelectedExample(example.title);
    setAnalysis(null);
  };

  const reset = () => {
    setEmailText('');
    setAnalysis(null);
    setSelectedExample('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Tone Checker</CardTitle>
              <CardDescription>
                Analyze and optimize the emotional tone of your emails
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Content:</label>
                <Textarea
                  placeholder="Paste your email content here to analyze its tone..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <div className="text-sm text-gray-500">
                  {emailText.length} characters • {emailText.split(' ').filter(w => w.length > 0).length} words
                </div>
              </div>

              {/* Example Buttons */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Try these examples:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {exampleEmails.map((example, index) => (
                    <Button
                      key={index}
                      variant={selectedExample === example.title ? "default" : "outline"}
                      className="justify-start text-left h-auto p-3"
                      onClick={() => loadExample(example)}
                    >
                      <div>
                        <div className="font-medium">{example.title}</div>
                        <div className="text-xs opacity-80 mt-1">
                          {example.content.substring(0, 60)}...
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={analyzeEmailTone}
                disabled={!emailText.trim() || isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Tone...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze Email Tone
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              {analysis ? (
                <div className="space-y-4">
                  {/* Overall Tone */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Tone Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-3">
                        <Badge className={`text-lg px-4 py-2 ${getToneColor(analysis.overall)}`}>
                          {analysis.overall.charAt(0).toUpperCase() + analysis.overall.slice(1)}
                        </Badge>
                        <div className="grid grid-cols-2 gap-3">
                          {analysis.emotionalTone.map((tone, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {tone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tone Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">Warmth</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.warmth)}`}>
                          {analysis.warmth}%
                        </div>
                        <Progress value={analysis.warmth} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Professional</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.professionalism)}`}>
                          {analysis.professionalism}%
                        </div>
                        <Progress value={analysis.professionalism} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Confidence</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.confidence)}`}>
                          {analysis.confidence}%
                        </div>
                        <Progress value={analysis.confidence} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Clarity</span>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity)}`}>
                          {analysis.clarity}%
                        </div>
                        <Progress value={analysis.clarity} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Suggestions */}
                  {analysis.suggestions.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-yellow-800">Improvement Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-yellow-800 text-sm">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tone Guidelines */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Maya's Tone Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Warm & Professional:</strong> Balance empathy with expertise</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Solution-Focused:</strong> Lead with what you can do</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Clear & Confident:</strong> Use decisive, clear language</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span><strong>Empathetic:</strong> Acknowledge feelings and concerns</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyze Another Email
                  </Button>
                </div>
              ) : (
                <Card className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Enter email content to analyze its tone</p>
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

export default MayaToneChecker;