import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '@/services/aiService';

interface AIResponseAnalyzerProps {
  character: {
    name: string;
    role: string;
  };
  onComplete: () => void;
}

interface Analysis {
  clarity: number;
  professionalism: number;
  engagement: number;
  actionability: number;
  improvements: string[];
  strengths: string[];
  suggestions: string;
  improvedVersion?: string;
}

export default function AIResponseAnalyzer({ character, onComplete }: AIResponseAnalyzerProps) {
  const [originalText, setOriginalText] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const aiService = AIService.getInstance();

  const analyzeText = async () => {
    if (!originalText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Analyze this text from a ${character.role}'s perspective and provide scores (0-100) and feedback:

Text: "${originalText}"

Provide a JSON response with:
- clarity (0-100)
- professionalism (0-100)
- engagement (0-100)
- actionability (0-100)
- improvements (array of 3 specific issues)
- strengths (array of 3 positive aspects)
- suggestions (one paragraph of specific improvement advice)`,
        context: 'You are an expert communications analyst. Respond ONLY with valid JSON.',
        temperature: 0.3
      });

      try {
        const parsed = JSON.parse(response.content);
        setAnalysis(parsed);
        onComplete();
      } catch (e) {
        // Fallback analysis if JSON parsing fails
        setAnalysis({
          clarity: 75,
          professionalism: 80,
          engagement: 70,
          actionability: 85,
          improvements: [
            'Could be more concise',
            'Needs stronger call to action',
            'Missing emotional connection'
          ],
          strengths: [
            'Clear main message',
            'Professional tone',
            'Good structure'
          ],
          suggestions: 'Focus on making your message more concise while adding specific examples that create emotional connection with your audience.'
        });
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const improveText = async () => {
    if (!originalText.trim() || !analysis) return;
    
    setIsImproving(true);
    try {
      const improved = await aiService.improveText(
        originalText,
        `${character.role} communication based on this analysis: ${analysis.suggestions}`
      );
      setAnalysis({ ...analysis, improvedVersion: improved });
      setActiveTab('comparison');
    } catch (error) {
      console.error('Error improving text:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Brain className="h-5 w-5 mr-2" />
            AI-Powered Content Analysis
          </CardTitle>
          <CardDescription className="text-purple-700">
            Learn how AI can help improve your communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-800">
            Paste any text you've written - emails, reports, proposals - and see how AI analyzes 
            and improves it for maximum impact.
          </p>
        </CardContent>
      </Card>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="original-text">Your Text to Analyze</Label>
          <Textarea
            id="original-text"
            placeholder="Paste your email, report, or any text here..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Try pasting a real email or document you're working on
          </p>
        </div>
        <Button 
          onClick={analyzeText}
          disabled={!originalText.trim() || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>Analyzing...</>
          ) : (
            <>
              <BarChart className="h-4 w-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  AI evaluation of your text's effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="comparison" disabled={!analysis.improvedVersion}>
                      Comparison
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="space-y-6 mt-6">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Clarity', score: analysis.clarity, icon: '🎯' },
                        { label: 'Professionalism', score: analysis.professionalism, icon: '👔' },
                        { label: 'Engagement', score: analysis.engagement, icon: '✨' },
                        { label: 'Actionability', score: analysis.actionability, icon: '🚀' }
                      ].map((metric) => (
                        <div key={metric.label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center">
                              <span className="mr-2">{metric.icon}</span>
                              {metric.label}
                            </span>
                            <Badge variant={getScoreBadge(metric.score) as any}>
                              {metric.score}%
                            </Badge>
                          </div>
                          <Progress value={metric.score} className="h-2" />
                        </div>
                      ))}
                    </div>

                    {/* Strengths and Improvements */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="border-green-200 bg-green-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center text-green-900">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {analysis.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-green-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200 bg-orange-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center text-orange-900">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Areas to Improve
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {analysis.improvements.map((improvement, index) => (
                              <li key={index} className="text-sm text-orange-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Suggestions */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">AI Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{analysis.suggestions}</p>
                      </CardContent>
                    </Card>

                    {/* Improve Button */}
                    {!analysis.improvedVersion && (
                      <Button 
                        onClick={improveText}
                        disabled={isImproving}
                        className="w-full"
                      >
                        {isImproving ? (
                          <>Improving...</>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Generate Improved Version
                          </>
                        )}
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="comparison" className="mt-6">
                    {analysis.improvedVersion && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2 text-red-600">Original</h3>
                            <Card className="border-red-200">
                              <CardContent className="pt-4">
                                <p className="text-sm whitespace-pre-wrap">{originalText}</p>
                              </CardContent>
                            </Card>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2 text-green-600">AI Improved</h3>
                            <Card className="border-green-200">
                              <CardContent className="pt-4">
                                <p className="text-sm whitespace-pre-wrap">{analysis.improvedVersion}</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        <Card className="bg-blue-50/50 border-blue-200">
                          <CardContent className="pt-4">
                            <p className="text-sm text-blue-800">
                              <strong>Key Improvements:</strong> The AI version addresses the identified issues 
                              by enhancing clarity, strengthening the call to action, and creating better 
                              emotional connection while maintaining your core message.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}