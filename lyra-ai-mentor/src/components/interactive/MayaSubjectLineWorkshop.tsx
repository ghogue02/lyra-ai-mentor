import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Zap, TrendingUp, Eye, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SubjectLineAnalysis {
  score: number;
  clarity: number;
  urgency: number;
  personalization: number;
  length: number;
  suggestions: string[];
  improvedVersion: string;
}

interface MayaSubjectLineWorkshopProps {
  onComplete?: (score: number) => void;
}

const MayaSubjectLineWorkshop: React.FC<MayaSubjectLineWorkshopProps> = ({ onComplete }) => {
  const [subjectLine, setSubjectLine] = useState('');
  const [analysis, setAnalysis] = useState<SubjectLineAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const exampleSubjects = [
    'Meeting tomorrow',
    'Quick question about project status',
    'Urgent: Parent concerns about pickup procedure - Need your input',
    'Thank you for your donation and next steps',
    'Action needed: Budget approval due Friday'
  ];

  const analyzeSubjectLine = async () => {
    if (!subjectLine.trim()) return;
    
    setIsAnalyzing(true);
    setAttempts(prev => prev + 1);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const wordCount = subjectLine.split(' ').length;
    const charCount = subjectLine.length;
    
    // Calculate scores based on best practices
    const clarityScore = subjectLine.includes('?') ? 70 : 
                        subjectLine.toLowerCase().includes('urgent') ? 90 :
                        subjectLine.toLowerCase().includes('meeting') ? 60 : 85;
    
    const urgencyScore = subjectLine.toLowerCase().includes('urgent') ? 90 :
                        subjectLine.toLowerCase().includes('asap') ? 85 :
                        subjectLine.toLowerCase().includes('today') ? 80 : 50;
    
    const personalizationScore = subjectLine.toLowerCase().includes('you') ? 85 :
                               subjectLine.toLowerCase().includes('parent') ? 75 : 40;
    
    const lengthScore = charCount >= 30 && charCount <= 50 ? 100 :
                       charCount >= 20 && charCount <= 60 ? 80 :
                       charCount < 20 ? 60 : 40;
    
    const overallScore = (clarityScore + urgencyScore + personalizationScore + lengthScore) / 4;
    
    const suggestions = [];
    if (clarityScore < 80) suggestions.push('Be more specific about the email content');
    if (urgencyScore < 60) suggestions.push('Consider adding urgency level if time-sensitive');
    if (personalizationScore < 70) suggestions.push('Make it more personal to the recipient');
    if (lengthScore < 80) suggestions.push('Aim for 30-50 characters for optimal readability');
    if (charCount > 60) suggestions.push('Shorten to improve mobile display');
    if (!subjectLine.includes(':')) suggestions.push('Consider using colons to separate context from action');
    
    const improvedVersion = generateImprovedVersion(subjectLine, overallScore);
    
    const mockAnalysis: SubjectLineAnalysis = {
      score: Math.round(overallScore),
      clarity: clarityScore,
      urgency: urgencyScore,
      personalization: personalizationScore,
      length: lengthScore,
      suggestions,
      improvedVersion
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    onComplete?.(mockAnalysis.score);
  };

  const generateImprovedVersion = (original: string, score: number): string => {
    if (score >= 85) return original; // Already good
    
    // Simple improvement logic
    if (original.toLowerCase().includes('meeting')) {
      return 'Action needed: Meeting agenda review - Response by EOD';
    }
    if (original.toLowerCase().includes('question')) {
      return 'Quick input needed: Project timeline clarification';
    }
    if (original.toLowerCase().includes('urgent')) {
      return original; // Already has urgency
    }
    
    return `Update: ${original} - Your response needed`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle2;
    if (score >= 60) return AlertTriangle;
    return AlertTriangle;
  };

  const reset = () => {
    setSubjectLine('');
    setAnalysis(null);
    setAttempts(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Subject Line Workshop</CardTitle>
              <CardDescription>
                Optimize your email subject lines for maximum impact and open rates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your subject line:</label>
              <Input
                placeholder="Type your email subject line here..."
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                className="text-lg p-4"
                maxLength={100}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{subjectLine.length}/100 characters</span>
                <span>{subjectLine.split(' ').filter(w => w.length > 0).length} words</span>
              </div>
            </div>

            <Button
              onClick={analyzeSubjectLine}
              disabled={!subjectLine.trim() || isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Subject Line...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Subject Line
                </>
              )}
            </Button>
          </div>

          {/* Example Subject Lines */}
          {!analysis && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Try these examples:</h3>
              <div className="grid grid-cols-1 gap-2">
                {exampleSubjects.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => setSubjectLine(example)}
                  >
                    <span className="truncate">{example}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`text-6xl font-bold ${getScoreColor(analysis.score).split(' ')[0]}`}>
                        {analysis.score}
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-600">Overall Score</p>
                        <Badge className={getScoreColor(analysis.score)}>
                          {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Work'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Clarity</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-blue-600">{Math.round(analysis.clarity)}</p>
                      <Progress value={analysis.clarity} className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-gray-600">Urgency</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-orange-600">{Math.round(analysis.urgency)}</p>
                      <Progress value={analysis.urgency} className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Personal</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-green-600">{Math.round(analysis.personalization)}</p>
                      <Progress value={analysis.personalization} className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600">Length</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-purple-600">{Math.round(analysis.length)}</p>
                      <Progress value={analysis.length} className="mt-1" />
                    </div>
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
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-yellow-800">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Improved Version */}
              {analysis.improvedVersion !== subjectLine && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Suggested Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Original:</p>
                        <p className="text-gray-800 bg-white p-3 rounded border">{subjectLine}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Improved:</p>
                        <p className="text-green-800 bg-white p-3 rounded border font-medium">
                          {analysis.improvedVersion}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubjectLine(analysis.improvedVersion)}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Use This Version
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setAnalysis(null)}
                  variant="outline"
                >
                  Try Another Subject Line
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>

              {/* Attempt Counter */}
              <div className="text-center text-sm text-gray-600">
                Attempt #{attempts} • Keep practicing to master subject line optimization!
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaSubjectLineWorkshop;