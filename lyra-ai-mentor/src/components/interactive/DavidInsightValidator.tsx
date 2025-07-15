import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Brain,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Lightbulb,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ValidationResult {
  category: 'strength' | 'concern' | 'critical';
  title: string;
  description: string;
  suggestion?: string;
}

interface InsightAnalysis {
  overallScore: number;
  confidence: number;
  actionability: number;
  relevance: number;
  evidence: number;
  clarity: number;
  validations: ValidationResult[];
  recommendations: string[];
  readyToShare: boolean;
}

interface ValidationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  checkFunction: (insight: string) => { score: number; feedback: string };
}

const DavidInsightValidator: React.FC = () => {
  const [insightText, setInsightText] = useState('');
  const [analysis, setAnalysis] = useState<InsightAnalysis | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedInsights, setValidatedInsights] = useState<number>(0);

  const exampleInsights = [
    {
      title: 'Strong Insight Example',
      text: `Our literacy program data reveals a critical pattern: participants who attend consistently for the first 4 weeks have a 89% completion rate, compared to only 34% for those with irregular early attendance.

This 4-week threshold appears to be when participants build both confidence and social connections that sustain their commitment. The data shows:
- Consistent early attenders average 2.3x more improvement in reading scores
- They form study partnerships at 3x the rate of irregular attenders  
- Program satisfaction scores jump from 6.2 to 8.7 after week 4

RECOMMENDATION: We should redesign our onboarding to intensively support participants through their first month, including buddy systems, flexible scheduling options, and celebration milestones at weeks 2 and 4.

This insight directly impacts our retention budget - focusing resources on early engagement could improve outcomes by 55% while reducing per-participant costs through better completion rates.`
    },
    {
      title: 'Needs Improvement Example',
      text: `Our programs are doing well this quarter. Participation is up and people seem happy with the services. The feedback has been mostly positive.

We should continue doing what we're doing since it's working. Maybe we can expand to serve more people next year if funding allows.

Overall, things are trending in the right direction and the data supports continued operations.`
    }
  ];

  const validationCriteria: ValidationCriteria[] = [
    {
      id: 'specificity',
      name: 'Specific Evidence',
      description: 'Uses concrete numbers, percentages, or measurable outcomes',
      weight: 0.2,
      checkFunction: (insight: string) => {
        const numbers = (insight.match(/\d+(\.\d+)?%?/g) || []).length;
        const specificWords = (insight.match(/\b(exactly|specifically|precisely|measured|compared to|versus)\b/gi) || []).length;
        const score = Math.min(100, (numbers * 15) + (specificWords * 10));
        return {
          score,
          feedback: score > 70 ? 'Good use of specific data points' : 'Add more concrete numbers and measurements'
        };
      }
    },
    {
      id: 'actionability',
      name: 'Clear Action Items',
      description: 'Provides specific, implementable recommendations',
      weight: 0.25,
      checkFunction: (insight: string) => {
        const actionWords = (insight.match(/\b(should|recommend|implement|adopt|change|start|stop|increase|decrease|focus)\b/gi) || []).length;
        const recommendations = (insight.match(/recommendation:|we should|action:|next steps?:/gi) || []).length;
        const score = Math.min(100, (actionWords * 8) + (recommendations * 20));
        return {
          score,
          feedback: score > 70 ? 'Clear actionable recommendations' : 'Add specific implementation steps'
        };
      }
    },
    {
      id: 'impact',
      name: 'Business Impact',
      description: 'Connects to organizational goals or outcomes',
      weight: 0.2,
      checkFunction: (insight: string) => {
        const impactWords = (insight.match(/\b(impact|outcome|result|benefit|cost|revenue|efficiency|effectiveness|roi|return)\b/gi) || []).length;
        const stakeholders = (insight.match(/\b(participants|donors|staff|board|community|clients|users)\b/gi) || []).length;
        const score = Math.min(100, (impactWords * 12) + (stakeholders * 8));
        return {
          score,
          feedback: score > 70 ? 'Strong connection to organizational impact' : 'Clarify how this affects key outcomes'
        };
      }
    },
    {
      id: 'evidence',
      name: 'Evidence Quality',
      description: 'Based on reliable data with appropriate context',
      weight: 0.15,
      checkFunction: (insight: string) => {
        const dataWords = (insight.match(/\b(data|analysis|study|survey|research|evidence|findings)\b/gi) || []).length;
        const contextWords = (insight.match(/\b(compared to|baseline|previous|last year|benchmark|average)\b/gi) || []).length;
        const score = Math.min(100, (dataWords * 10) + (contextWords * 15));
        return {
          score,
          feedback: score > 70 ? 'Well-supported with evidence' : 'Strengthen with more data context'
        };
      }
    },
    {
      id: 'clarity',
      name: 'Communication Clarity',
      description: 'Easy to understand and well-structured',
      weight: 0.2,
      checkFunction: (insight: string) => {
        const wordCount = insight.split(' ').length;
        const sentences = insight.split(/[.!?]+/).filter(s => s.trim()).length;
        const avgSentenceLength = wordCount / sentences;
        const structure = (insight.match(/\n\n|\n-|\n\d+\.|\nRECOMMENDATION:/gi) || []).length;
        
        let score = 70; // baseline
        if (avgSentenceLength < 25) score += 15; // good sentence length
        if (structure > 0) score += 15; // has structure
        if (wordCount > 100 && wordCount < 500) score += 10; // appropriate length
        
        return {
          score: Math.min(100, score),
          feedback: score > 80 ? 'Clear and well-structured' : 'Improve structure and readability'
        };
      }
    }
  ];

  const validateInsight = async () => {
    if (!insightText.trim()) return;
    
    setIsValidating(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Run validation criteria
    const scores: { [key: string]: number } = {};
    const validations: ValidationResult[] = [];
    const recommendations: string[] = [];
    
    validationCriteria.forEach(criteria => {
      const result = criteria.checkFunction(insightText);
      scores[criteria.id] = result.score;
      
      if (result.score >= 80) {
        validations.push({
          category: 'strength',
          title: `Strong ${criteria.name}`,
          description: result.feedback
        });
      } else if (result.score >= 60) {
        validations.push({
          category: 'concern',
          title: `Moderate ${criteria.name}`,
          description: result.feedback,
          suggestion: `Consider strengthening: ${criteria.description.toLowerCase()}`
        });
      } else {
        validations.push({
          category: 'critical',
          title: `Weak ${criteria.name}`,
          description: result.feedback,
          suggestion: `Critical need: ${criteria.description.toLowerCase()}`
        });
        recommendations.push(`Improve ${criteria.name.toLowerCase()}: ${criteria.description.toLowerCase()}`);
      }
    });
    
    // Calculate weighted overall score
    const overallScore = Math.round(
      validationCriteria.reduce((sum, criteria) => {
        return sum + (scores[criteria.id] * criteria.weight);
      }, 0)
    );
    
    // Generate specific recommendations
    if (scores.specificity < 70) {
      recommendations.push('Add specific percentages, timeframes, and measurable outcomes');
    }
    if (scores.actionability < 70) {
      recommendations.push('Include concrete next steps with clear ownership and timelines');
    }
    if (scores.impact < 70) {
      recommendations.push('Connect findings to organizational goals and stakeholder benefits');
    }
    
    const analysis: InsightAnalysis = {
      overallScore,
      confidence: scores.evidence,
      actionability: scores.actionability,
      relevance: scores.impact,
      evidence: scores.evidence,
      clarity: scores.clarity,
      validations,
      recommendations,
      readyToShare: overallScore >= 75 && validations.filter(v => v.category === 'critical').length === 0
    };
    
    setAnalysis(analysis);
    setIsValidating(false);
    setValidatedInsights(prev => prev + 1);
  };

  const loadExample = (example: typeof exampleInsights[0]) => {
    setInsightText(example.text);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValidationIcon = (category: string) => {
    switch (category) {
      case 'strength': return CheckCircle2;
      case 'concern': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Eye;
    }
  };

  const getValidationColor = (category: string) => {
    switch (category) {
      case 'strength': return 'text-green-600 bg-green-50 border-green-200';
      case 'concern': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const reset = () => {
    setInsightText('');
    setAnalysis(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Insight Validator</CardTitle>
              <CardDescription>
                Validate your data insights for quality, clarity, and actionability before sharing
              </CardDescription>
            </div>
          </div>
          {validatedInsights > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Insights validated: {validatedInsights} • Building stronger data communication skills!
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Data Insight</CardTitle>
                  <CardDescription>Paste your analysis or insight for validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Example Insights */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Try example insights:</label>
                    <div className="space-y-2">
                      {exampleInsights.map((example, index) => (
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
                    </div>
                  </div>

                  {/* Insight Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Insight:</label>
                    <Textarea
                      placeholder="Paste your data insight, analysis conclusion, or recommendation here..."
                      value={insightText}
                      onChange={(e) => setInsightText(e.target.value)}
                      rows={12}
                      className="min-h-[300px] resize-none"
                    />
                    <div className="text-sm text-gray-600">
                      {insightText.length} characters • {insightText.split(' ').filter(w => w.length > 0).length} words
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={validateInsight}
                disabled={!insightText.trim() || isValidating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Validating Insight...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Validate Insight
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {analysis ? (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <Card className={`border-2 ${
                    analysis.readyToShare ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Validation Results</CardTitle>
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-3">
                        {analysis.readyToShare ? (
                          <>
                            <ThumbsUp className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">Ready to share!</span>
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">Needs improvement</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Quality score based on 5 key criteria for effective data insights
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detailed Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { key: 'clarity', label: 'Clarity & Structure', value: analysis.clarity },
                        { key: 'actionability', label: 'Actionability', value: analysis.actionability },
                        { key: 'evidence', label: 'Evidence Quality', value: analysis.evidence },
                        { key: 'relevance', label: 'Business Relevance', value: analysis.relevance },
                        { key: 'confidence', label: 'Data Confidence', value: analysis.confidence }
                      ].map(({ key, label, value }) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{label}</span>
                            <span className={`font-bold ${getScoreColor(value)}`}>
                              {value}%
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Validation Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validation Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.validations.map((validation, index) => {
                        const Icon = getValidationIcon(validation.category);
                        return (
                          <div 
                            key={index} 
                            className={`border rounded-lg p-3 ${getValidationColor(validation.category)}`}
                          >
                            <div className="flex items-start gap-2">
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{validation.title}</h4>
                                <p className="text-sm mt-1">{validation.description}</p>
                                {validation.suggestion && (
                                  <p className="text-sm mt-2 font-medium">
                                    💡 {validation.suggestion}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Improvement Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={reset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Validate Another Insight
                    </Button>
                    {analysis.readyToShare && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Share This Insight
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Validate</h3>
                    <p className="text-center">
                      Share your data insight to receive<br />
                      detailed quality assessment and feedback
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Validation Criteria Guide */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Validation Criteria</CardTitle>
              <CardDescription>What makes a strong data insight?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validationCriteria.map((criteria) => (
                  <div key={criteria.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold">{criteria.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(criteria.weight * 100)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">David's Validation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h4 className="font-semibold mb-2">Before Validation:</h4>
                  <ul className="space-y-1">
                    <li>• Include specific numbers and percentages</li>
                    <li>• Connect findings to business outcomes</li>
                    <li>• Provide clear next steps</li>
                    <li>• Use simple, jargon-free language</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Strong Insights Include:</h4>
                  <ul className="space-y-1">
                    <li>• Unexpected patterns or findings</li>
                    <li>• Comparison to benchmarks or goals</li>
                    <li>• Implications for different stakeholders</li>
                    <li>• Confidence levels and limitations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidInsightValidator;