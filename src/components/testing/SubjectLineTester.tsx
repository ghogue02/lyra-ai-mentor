import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Clock, Copy, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SubjectLineTesterProps {
  onComplete?: () => void;
}

interface SubjectLineAnalysis {
  score: number;
  prediction: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  lengthAnalysis: {
    characters: number;
    status: 'optimal' | 'good' | 'too_long' | 'too_short';
    recommendation: string;
  };
  wordAnalysis: {
    powerWords: string[];
    spamWords: string[];
    emotionalTone: string;
  };
}

export const SubjectLineTester: React.FC<SubjectLineTesterProps> = ({ onComplete }) => {
  const [subjectLine, setSubjectLine] = useState('');
  const [emailType, setEmailType] = useState<string>('');
  const [analysis, setAnalysis] = useState<SubjectLineAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const emailTypes = [
    { value: 'donation', label: 'Donation Appeal', description: 'Fundraising emails' },
    { value: 'newsletter', label: 'Newsletter', description: 'Regular updates' },
    { value: 'event', label: 'Event Invitation', description: 'Event promotions' },
    { value: 'volunteer', label: 'Volunteer Request', description: 'Recruitment emails' },
    { value: 'thank_you', label: 'Thank You', description: 'Appreciation emails' },
    { value: 'impact', label: 'Impact Report', description: 'Success stories' }
  ];

  const analyzeSubjectLine = async () => {
    if (!subjectLine.trim() || !emailType) {
      toast.error('Please enter a subject line and select email type');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = performAnalysis();
      setAnalysis(result);
      
      toast.success('Subject line analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze subject line. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAnalysis = (): SubjectLineAnalysis => {
    const length = subjectLine.length;
    const words = subjectLine.toLowerCase().split(' ');
    
    // Power words that increase engagement
    const powerWords = ['exclusive', 'urgent', 'limited', 'free', 'new', 'important', 
                       'thank', 'help', 'impact', 'story', 'update', 'invitation',
                       'special', 'announce', 'celebrate', 'join', 'support', 'transform'];
    
    // Spam trigger words to avoid
    const spamWords = ['click here', 'act now', 'buy now', 'cash', 'credit', 
                      'guarantee', 'no obligation', 'risk-free', 'winner', '100%',
                      'amazing', 'congratulations', 'prize', 'promotion'];
    
    // Analyze power words
    const foundPowerWords = words.filter(word => 
      powerWords.some(pw => word.includes(pw))
    );
    
    // Analyze spam words
    const foundSpamWords = words.filter(word => 
      spamWords.some(sw => subjectLine.toLowerCase().includes(sw))
    );
    
    // Calculate base score
    let score = 70;
    
    // Length analysis
    let lengthStatus: 'optimal' | 'good' | 'too_long' | 'too_short' = 'good';
    let lengthRecommendation = '';
    
    if (length >= 30 && length <= 50) {
      lengthStatus = 'optimal';
      score += 10;
      lengthRecommendation = 'Perfect length for maximum visibility';
    } else if (length >= 20 && length < 30) {
      lengthStatus = 'good';
      score += 5;
      lengthRecommendation = 'Good length, but could be slightly longer';
    } else if (length > 50 && length <= 70) {
      lengthStatus = 'good';
      lengthRecommendation = 'Good, but may get cut off on mobile';
    } else if (length > 70) {
      lengthStatus = 'too_long';
      score -= 10;
      lengthRecommendation = 'Too long - will be truncated on most devices';
    } else {
      lengthStatus = 'too_short';
      score -= 5;
      lengthRecommendation = 'Too short - add more context';
    }
    
    // Power words boost
    score += foundPowerWords.length * 5;
    
    // Spam words penalty
    score -= foundSpamWords.length * 10;
    
    // Email type specific adjustments
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    
    // Check for personalization
    if (subjectLine.includes('[First Name]') || subjectLine.includes('[Name]')) {
      score += 10;
      strengths.push('Uses personalization');
    } else {
      suggestions.push('Consider adding personalization like [First Name]');
    }
    
    // Check for urgency/timeliness
    const urgencyWords = ['today', 'tomorrow', 'tonight', 'deadline', 'last chance', 'ends'];
    if (urgencyWords.some(word => subjectLine.toLowerCase().includes(word))) {
      score += 5;
      strengths.push('Creates urgency');
    }
    
    // Check for questions
    if (subjectLine.includes('?')) {
      score += 5;
      strengths.push('Uses curiosity-inducing question');
    }
    
    // Check for numbers
    if (/\d/.test(subjectLine)) {
      score += 5;
      strengths.push('Includes specific numbers');
    }
    
    // Email type specific analysis
    switch (emailType) {
      case 'donation':
        if (!subjectLine.toLowerCase().includes('help') && 
            !subjectLine.toLowerCase().includes('support') && 
            !subjectLine.toLowerCase().includes('give')) {
          suggestions.push('Consider including action words like "help" or "support"');
        }
        if (!subjectLine.toLowerCase().includes('impact') && 
            !subjectLine.toLowerCase().includes('difference')) {
          suggestions.push('Mention the impact or difference donors can make');
        }
        break;
        
      case 'newsletter':
        if (!subjectLine.toLowerCase().includes('update') && 
            !subjectLine.toLowerCase().includes('news')) {
          suggestions.push('Consider mentioning it\'s an update or newsletter');
        }
        break;
        
      case 'event':
        if (!subjectLine.includes('join') && 
            !subjectLine.includes('invite') && 
            !subjectLine.includes('you\'re invited')) {
          suggestions.push('Include invitation language');
        }
        if (!/\d/.test(subjectLine)) {
          suggestions.push('Include the event date');
        }
        break;
    }
    
    // Compile weaknesses
    if (foundSpamWords.length > 0) {
      weaknesses.push(`Contains spam trigger words: ${foundSpamWords.join(', ')}`);
    }
    if (lengthStatus === 'too_long' || lengthStatus === 'too_short') {
      weaknesses.push(`Subject line is ${lengthStatus.replace('_', ' ')}`);
    }
    if (subjectLine === subjectLine.toUpperCase()) {
      weaknesses.push('Avoid using ALL CAPS');
      score -= 15;
    }
    if ((subjectLine.match(/!/g) || []).length > 1) {
      weaknesses.push('Too many exclamation marks');
      score -= 5;
    }
    
    // Add generic strengths
    if (foundPowerWords.length > 0) {
      strengths.push(`Uses power words: ${foundPowerWords.join(', ')}`);
    }
    
    // Emotional tone analysis
    let emotionalTone = 'Neutral';
    const positiveWords = ['thank', 'celebrate', 'success', 'amazing', 'wonderful', 'great'];
    const urgentWords2 = ['urgent', 'important', 'critical', 'deadline'];
    const curiousWords = ['discover', 'reveal', 'secret', 'find out'];
    
    if (positiveWords.some(word => subjectLine.toLowerCase().includes(word))) {
      emotionalTone = 'Positive/Grateful';
    } else if (urgentWords2.some(word => subjectLine.toLowerCase().includes(word))) {
      emotionalTone = 'Urgent/Important';
    } else if (curiousWords.some(word => subjectLine.toLowerCase().includes(word))) {
      emotionalTone = 'Curious/Intriguing';
    }
    
    // Ensure score is within bounds
    score = Math.min(Math.max(score, 0), 100);
    
    // Generate prediction
    let prediction = '';
    if (score >= 80) {
      prediction = 'High open rate expected (25-35%)';
    } else if (score >= 60) {
      prediction = 'Good open rate expected (18-25%)';
    } else if (score >= 40) {
      prediction = 'Average open rate expected (12-18%)';
    } else {
      prediction = 'Below average open rate expected (<12%)';
    }
    
    return {
      score,
      prediction,
      strengths: strengths.length > 0 ? strengths : ['Clear and concise message'],
      weaknesses,
      suggestions: suggestions.length > 0 ? suggestions : ['Your subject line is well-optimized!'],
      lengthAnalysis: {
        characters: length,
        status: lengthStatus,
        recommendation: lengthRecommendation
      },
      wordAnalysis: {
        powerWords: foundPowerWords,
        spamWords: foundSpamWords,
        emotionalTone
      }
    };
  };

  const copySubjectLine = () => {
    navigator.clipboard.writeText(subjectLine);
    toast.success('Subject line copied!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            Subject Line Tester
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test and optimize your email subject lines for maximum open rates
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Type</label>
            <Select value={emailType} onValueChange={setEmailType}>
              <SelectTrigger>
                <SelectValue placeholder="What type of email?" />
              </SelectTrigger>
              <SelectContent>
                {emailTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subject Line
              {subjectLine && (
                <span className="ml-2 text-xs text-gray-500">
                  ({subjectLine.length} characters)
                </span>
              )}
            </label>
            <div className="relative">
              <Input
                value={subjectLine}
                onChange={(e) => setSubjectLine(e.target.value)}
                placeholder="Enter your subject line here..."
                className="pr-10"
              />
              {subjectLine && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1"
                  onClick={copySubjectLine}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tip: You can use [First Name] for personalization
            </p>
          </div>

          <Button 
            onClick={analyzeSubjectLine} 
            disabled={isAnalyzing || !subjectLine.trim() || !emailType}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Subject Line...
              </>
            ) : (
              <>
                <FlaskConical className="h-4 w-4 mr-2" />
                Test Subject Line
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </div>
                <Badge className={`mt-2 ${getScoreBadgeColor(analysis.score)}`}>
                  {analysis.prediction}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Length Analysis
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Character count:</span>
                    <Badge variant={analysis.lengthAnalysis.status === 'optimal' ? 'default' : 'secondary'}>
                      {analysis.lengthAnalysis.characters} characters
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{analysis.lengthAnalysis.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {analysis.weaknesses.length > 0 ? (
                      analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-600 mt-0.5">!</span>
                          <span className="text-sm">{weakness}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No major issues found</li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Optimization Suggestions</h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">→</span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Word Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Emotional Tone:</span>
                    <Badge variant="outline">{analysis.wordAnalysis.emotionalTone}</Badge>
                  </div>
                  {analysis.wordAnalysis.powerWords.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Power Words Found:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.wordAnalysis.powerWords.map((word, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-50">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.wordAnalysis.spamWords.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-red-600">Spam Triggers Found:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.wordAnalysis.spamWords.map((word, index) => (
                          <Badge key={index} variant="secondary" className="bg-red-50">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Pro tip:</strong> Test 2-3 variations of your subject line with a small segment 
                  before sending to your full list. Track open rates to find what resonates with your audience.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};