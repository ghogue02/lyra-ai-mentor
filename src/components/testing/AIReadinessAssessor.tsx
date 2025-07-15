import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Users, Shield, Sparkles, BarChart } from 'lucide-react';
import { toast } from 'sonner';

interface AIReadinessAssessorProps {
  onComplete?: () => void;
}

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

interface AssessmentResult {
  overallScore: number;
  readinessLevel: 'emerging' | 'developing' | 'advancing' | 'leading';
  categoryScores: {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
    insights: string[];
  }[];
  strengths: string[];
  gaps: string[];
  recommendations: {
    priority: 'immediate' | 'short-term' | 'long-term';
    area: string;
    action: string;
    impact: string;
    resources: string[];
  }[];
  roadmap: {
    phase: string;
    timeline: string;
    goals: string[];
    successMetrics: string[];
  }[];
}

export const AIReadinessAssessor: React.FC<AIReadinessAssessorProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  const questions: AssessmentQuestion[] = [
    {
      id: 'leadership',
      category: 'Leadership & Vision',
      question: 'How would you describe your leadership team\'s attitude toward AI?',
      options: [
        { value: 1, label: 'Skeptical/Unaware', description: 'Limited understanding or interest in AI' },
        { value: 2, label: 'Curious but Cautious', description: 'Interested but concerned about risks' },
        { value: 3, label: 'Supportive', description: 'Actively exploring AI opportunities' },
        { value: 4, label: 'Champions', description: 'Leading AI initiatives with clear vision' }
      ]
    },
    {
      id: 'skills',
      category: 'Skills & Capabilities',
      question: 'What is your team\'s current AI/technology skill level?',
      options: [
        { value: 1, label: 'Basic', description: 'Limited tech skills, minimal AI exposure' },
        { value: 2, label: 'Developing', description: 'Some tech-savvy staff, basic AI awareness' },
        { value: 3, label: 'Proficient', description: 'Good tech skills, some AI tool usage' },
        { value: 4, label: 'Advanced', description: 'Strong tech skills, regular AI adoption' }
      ]
    },
    {
      id: 'data',
      category: 'Data Readiness',
      question: 'How organized and accessible is your organization\'s data?',
      options: [
        { value: 1, label: 'Scattered', description: 'Data in multiple formats, locations, minimal standards' },
        { value: 2, label: 'Basic Organization', description: 'Some centralization, inconsistent formats' },
        { value: 3, label: 'Well-Organized', description: 'Centralized systems, good data quality' },
        { value: 4, label: 'Data-Driven', description: 'Clean, integrated data with analytics' }
      ]
    },
    {
      id: 'culture',
      category: 'Organizational Culture',
      question: 'How does your organization typically respond to new technology?',
      options: [
        { value: 1, label: 'Resistant', description: 'Prefer traditional methods, slow to change' },
        { value: 2, label: 'Cautious Adoption', description: 'Eventually adopt after others prove success' },
        { value: 3, label: 'Open to Innovation', description: 'Willing to try new tools and approaches' },
        { value: 4, label: 'Innovation-First', description: 'Actively seek and pilot new solutions' }
      ]
    },
    {
      id: 'resources',
      category: 'Resources & Investment',
      question: 'What resources can you allocate to AI initiatives?',
      options: [
        { value: 1, label: 'Minimal', description: 'Very limited budget or staff time' },
        { value: 2, label: 'Some Flexibility', description: 'Can allocate small budget/time for pilots' },
        { value: 3, label: 'Dedicated Resources', description: 'Budget line item and staff time available' },
        { value: 4, label: 'Strategic Investment', description: 'Significant budget and dedicated team' }
      ]
    },
    {
      id: 'ethics',
      category: 'Ethics & Governance',
      question: 'How prepared are you to handle AI ethics and privacy concerns?',
      options: [
        { value: 1, label: 'Not Considered', description: 'Haven\'t thought about AI ethics yet' },
        { value: 2, label: 'Basic Awareness', description: 'Know it\'s important, no policies yet' },
        { value: 3, label: 'Developing Policies', description: 'Working on guidelines and protocols' },
        { value: 4, label: 'Comprehensive Framework', description: 'Clear policies and regular reviews' }
      ]
    },
    {
      id: 'current_use',
      category: 'Current AI Usage',
      question: 'Are you currently using any AI tools in your organization?',
      options: [
        { value: 1, label: 'None', description: 'No AI tools in use' },
        { value: 2, label: 'Basic Tools', description: 'Using simple AI features (spell check, etc.)' },
        { value: 3, label: 'Multiple Tools', description: 'Several AI tools for different functions' },
        { value: 4, label: 'Integrated AI', description: 'AI embedded in core workflows' }
      ]
    },
    {
      id: 'goals',
      category: 'Strategic Alignment',
      question: 'How well-defined are your AI goals and use cases?',
      options: [
        { value: 1, label: 'Undefined', description: 'No clear AI goals or use cases' },
        { value: 2, label: 'Exploring Options', description: 'Identifying potential applications' },
        { value: 3, label: 'Clear Priorities', description: 'Specific use cases identified' },
        { value: 4, label: 'Strategic Roadmap', description: 'Detailed plan with timelines and metrics' }
      ]
    }
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateAssessment(newAnswers);
    }
  };

  const generateAssessment = async (allAnswers: Record<string, number>) => {
    setIsAssessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalScore = Object.values(allAnswers).reduce((sum, score) => sum + score, 0);
      const maxScore = questions.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);
      
      let readinessLevel: 'emerging' | 'developing' | 'advancing' | 'leading';
      if (percentage < 30) readinessLevel = 'emerging';
      else if (percentage < 55) readinessLevel = 'developing';
      else if (percentage < 80) readinessLevel = 'advancing';
      else readinessLevel = 'leading';

      const categoryScores = Array.from(new Set(questions.map(q => q.category))).map(category => {
        const categoryQuestions = questions.filter(q => q.category === category);
        const categoryScore = categoryQuestions.reduce((sum, q) => sum + (allAnswers[q.id] || 0), 0);
        const categoryMax = categoryQuestions.length * 4;
        const categoryPercentage = Math.round((categoryScore / categoryMax) * 100);

        const insights = generateCategoryInsights(category, categoryPercentage);

        return {
          category,
          score: categoryScore,
          maxScore: categoryMax,
          percentage: categoryPercentage,
          insights
        };
      });

      const result: AssessmentResult = {
        overallScore: percentage,
        readinessLevel,
        categoryScores,
        strengths: generateStrengths(categoryScores),
        gaps: generateGaps(categoryScores),
        recommendations: generateRecommendations(categoryScores, readinessLevel),
        roadmap: generateRoadmap(readinessLevel)
      };

      setResult(result);
      toast.success('Assessment complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate assessment. Please try again.');
    } finally {
      setIsAssessing(false);
    }
  };

  const generateCategoryInsights = (category: string, percentage: number): string[] => {
    const insights: Record<string, string[]> = {
      'Leadership & Vision': percentage >= 75 ? 
        ['Leadership is ready to champion AI initiatives', 'Clear vision will accelerate adoption'] :
        percentage >= 50 ?
        ['Leadership support exists but needs strengthening', 'Consider AI education for executives'] :
        ['Leadership buy-in is critical for success', 'Start with small wins to build confidence'],
      
      'Skills & Capabilities': percentage >= 75 ?
        ['Strong technical foundation in place', 'Ready for advanced AI implementations'] :
        percentage >= 50 ?
        ['Good baseline skills, targeted training needed', 'Focus on practical AI applications'] :
        ['Significant upskilling required', 'Start with AI literacy programs'],
      
      'Data Readiness': percentage >= 75 ?
        ['Excellent data foundation for AI', 'Can leverage advanced analytics'] :
        percentage >= 50 ?
        ['Data needs some organization', 'Focus on data quality improvements'] :
        ['Data infrastructure needs attention', 'Start with basic data management'],
      
      'Organizational Culture': percentage >= 75 ?
        ['Culture supports innovation and change', 'Natural fit for AI adoption'] :
        percentage >= 50 ?
        ['Some cultural adaptation needed', 'Build on existing openness'] :
        ['Cultural shift required', 'Focus on change management'],
      
      'Resources & Investment': percentage >= 75 ?
        ['Strong resource commitment', 'Can pursue ambitious AI projects'] :
        percentage >= 50 ?
        ['Adequate resources for pilot projects', 'Demonstrate ROI for more investment'] :
        ['Limited resources require strategic focus', 'Start with low-cost, high-impact tools'],
      
      'Ethics & Governance': percentage >= 75 ?
        ['Robust ethical framework in place', 'Lead by example in responsible AI'] :
        percentage >= 50 ?
        ['Good awareness, formalize policies', 'Develop comprehensive guidelines'] :
        ['Ethics must be addressed early', 'Create basic AI use policies'],
      
      'Current AI Usage': percentage >= 75 ?
        ['Already leveraging AI effectively', 'Ready to scale and expand'] :
        percentage >= 50 ?
        ['Good starting point with AI tools', 'Systematize and expand usage'] :
        ['Limited AI exposure', 'Start with user-friendly tools'],
      
      'Strategic Alignment': percentage >= 75 ?
        ['Clear AI strategy aligned with mission', 'Execute on roadmap'] :
        percentage >= 50 ?
        ['Goals emerging, needs refinement', 'Develop detailed implementation plan'] :
        ['AI strategy needs development', 'Define specific use cases']
    };

    return insights[category] || ['Assessment data collected', 'Recommendations below'];
  };

  const generateStrengths = (scores: any[]): string[] => {
    const strengths = scores
      .filter(s => s.percentage >= 60)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3)
      .map(s => `Strong ${s.category.toLowerCase()} (${s.percentage}% ready)`);
    
    if (strengths.length === 0) {
      return ['Commitment to improvement', 'Willingness to assess readiness', 'Growth mindset'];
    }
    
    return strengths;
  };

  const generateGaps = (scores: any[]): string[] => {
    const gaps = scores
      .filter(s => s.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)
      .map(s => `${s.category} needs development (currently ${s.percentage}%)`);
    
    if (gaps.length === 0) {
      return ['Continue building on strong foundation', 'Stay current with AI advances'];
    }
    
    return gaps;
  };

  const generateRecommendations = (scores: any[], level: string): any[] => {
    const recommendations = [];

    // Always recommend based on lowest scores first
    const sortedScores = [...scores].sort((a, b) => a.percentage - b.percentage);

    for (const score of sortedScores.slice(0, 3)) {
      if (score.category === 'Leadership & Vision' && score.percentage < 60) {
        recommendations.push({
          priority: 'immediate' as const,
          area: 'Leadership Engagement',
          action: 'Schedule AI education session for leadership team',
          impact: 'Build crucial top-level support for AI initiatives',
          resources: ['AI for Executives workshop', 'Case studies from similar nonprofits', 'ROI calculators']
        });
      } else if (score.category === 'Skills & Capabilities' && score.percentage < 60) {
        recommendations.push({
          priority: 'immediate' as const,
          area: 'Team Training',
          action: 'Launch AI literacy program for all staff',
          impact: 'Build foundation for successful AI adoption',
          resources: ['Online AI courses', 'Lunch-and-learn sessions', 'Hands-on workshops']
        });
      } else if (score.category === 'Data Readiness' && score.percentage < 60) {
        recommendations.push({
          priority: 'short-term' as const,
          area: 'Data Infrastructure',
          action: 'Audit and organize existing data systems',
          impact: 'Enable effective AI tool implementation',
          resources: ['Data audit checklist', 'CRM optimization guide', 'Data governance templates']
        });
      }
    }

    // Add level-specific recommendations
    if (level === 'emerging' || level === 'developing') {
      recommendations.push({
        priority: 'short-term' as const,
        area: 'Quick Wins',
        action: 'Implement 2-3 simple AI tools (email, social media, writing)',
        impact: 'Build confidence and demonstrate value',
        resources: ['AI tool comparison guide', 'Implementation playbooks', 'Success metrics templates']
      });
    }

    if (level === 'advancing' || level === 'leading') {
      recommendations.push({
        priority: 'long-term' as const,
        area: 'Strategic Integration',
        action: 'Develop comprehensive AI strategy aligned with mission',
        impact: 'Transform organizational capabilities',
        resources: ['AI strategy framework', 'Integration roadmap', 'Change management toolkit']
      });
    }

    return recommendations;
  };

  const generateRoadmap = (level: string): any[] => {
    const roadmaps: Record<string, any[]> = {
      emerging: [
        {
          phase: 'Foundation (Months 1-3)',
          timeline: '3 months',
          goals: ['Build AI awareness', 'Address concerns', 'Identify champions'],
          successMetrics: ['Leadership buy-in achieved', '50% staff attended AI intro', 'First AI tool selected']
        },
        {
          phase: 'Pilot (Months 4-6)',
          timeline: '3 months',
          goals: ['Launch 1-2 AI pilots', 'Document learnings', 'Measure impact'],
          successMetrics: ['Pilot tools adopted by teams', '20% time savings documented', 'User satisfaction >70%']
        },
        {
          phase: 'Expand (Months 7-12)',
          timeline: '6 months',
          goals: ['Roll out successful tools', 'Train all staff', 'Develop policies'],
          successMetrics: ['3-5 AI tools in regular use', 'All staff trained', 'AI use policies in place']
        }
      ],
      developing: [
        {
          phase: 'Optimize (Months 1-2)',
          timeline: '2 months',
          goals: ['Improve current AI usage', 'Identify gaps', 'Build team skills'],
          successMetrics: ['Current tools optimized', 'Skills gaps identified', 'Training plan created']
        },
        {
          phase: 'Integrate (Months 3-6)',
          timeline: '4 months',
          goals: ['Connect AI tools', 'Automate workflows', 'Measure efficiency'],
          successMetrics: ['Key workflows automated', '30% efficiency gains', 'Data flows connected']
        },
        {
          phase: 'Scale (Months 7-12)',
          timeline: '6 months',
          goals: ['Expand AI across org', 'Advanced implementations', 'Culture shift'],
          successMetrics: ['AI in all departments', 'Advanced tools deployed', 'Innovation culture established']
        }
      ],
      advancing: [
        {
          phase: 'Innovate (Months 1-3)',
          timeline: '3 months',
          goals: ['Custom AI solutions', 'Advanced analytics', 'Predictive models'],
          successMetrics: ['Custom tools built', 'Predictive insights generated', 'Strategic decisions AI-informed']
        },
        {
          phase: 'Transform (Months 4-9)',
          timeline: '6 months',
          goals: ['Reimagine services', 'AI-first processes', 'Measure impact'],
          successMetrics: ['Services transformed', 'New capabilities launched', 'Impact metrics improved 40%+']
        },
        {
          phase: 'Lead (Months 10-12)',
          timeline: '3 months',
          goals: ['Share knowledge', 'Mentor others', 'Shape sector'],
          successMetrics: ['Best practices shared', 'Other orgs mentored', 'Recognized as AI leader']
        }
      ],
      leading: [
        {
          phase: 'Optimize Excellence (Ongoing)',
          timeline: 'Continuous',
          goals: ['Continuous improvement', 'Stay cutting-edge', 'Maximum impact'],
          successMetrics: ['Industry benchmark', 'Innovation pipeline', 'Measurable mission advancement']
        },
        {
          phase: 'Ecosystem Building',
          timeline: 'Ongoing',
          goals: ['Partner development', 'Sector advancement', 'Policy influence'],
          successMetrics: ['Strategic partnerships', 'Sector-wide adoption', 'Policy contributions']
        }
      ]
    };

    return roadmaps[level] || roadmaps.emerging;
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'leading': return 'text-green-600 bg-green-100';
      case 'advancing': return 'text-blue-600 bg-blue-100';
      case 'developing': return 'text-yellow-600 bg-yellow-100';
      case 'emerging': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-100 text-red-800';
      case 'short-term': return 'bg-yellow-100 text-yellow-800';
      case 'long-term': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your AI Readiness Assessment</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive evaluation of your organization's AI preparedness
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{result.overallScore}%</div>
                <Badge className={getReadinessColor(result.readinessLevel)}>
                  {result.readinessLevel.charAt(0).toUpperCase() + result.readinessLevel.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Readiness by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.categoryScores.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.percentage >= 75 ? 'bg-green-500' :
                        category.percentage >= 50 ? 'bg-blue-500' :
                        category.percentage >= 25 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="space-y-1">
                    {category.insights.map((insight, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-gray-400 mt-0.5">•</span>
                        {insight}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Areas for Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.gaps.map((gap, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span className="text-sm">{gap}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Prioritized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{rec.area}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec.action}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Impact:</strong> {rec.impact}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Resources:</p>
                    {rec.resources.map((resource, i) => (
                      <p key={i} className="text-xs text-gray-500 pl-2">• {resource}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Your AI Transformation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.roadmap.map((phase, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-indigo-900">{phase.phase}</h4>
                    <Badge variant="outline">{phase.timeline}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Goals:</p>
                      <ul className="space-y-1">
                        {phase.goals.map((goal, i) => (
                          <li key={i} className="text-gray-600">• {goal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Success Metrics:</p>
                      <ul className="space-y-1">
                        {phase.successMetrics.map((metric, i) => (
                          <li key={i} className="text-gray-600">• {metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Brain className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-900 mb-2">Your Next Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
                  <li>Share this assessment with your leadership team</li>
                  <li>Choose one immediate priority recommendation to start</li>
                  <li>Set up monthly check-ins to track progress</li>
                  <li>Celebrate small wins to build momentum</li>
                  <li>Reassess in 6 months to measure growth</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800 text-center">
              <strong>Remember:</strong> AI transformation is a journey, not a destination. 
              Every step forward, no matter how small, brings you closer to amplifying your impact.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Readiness Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">
            Evaluate your organization's preparedness for AI adoption
          </p>
        </CardHeader>
        <CardContent>
          {!isAssessing && currentQuestion < questions.length && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <Badge variant="outline">{questions[currentQuestion].category}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
                
                <RadioGroup onValueChange={(value) => handleAnswer(parseInt(value))}>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option) => (
                      <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                        <Label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                          <div>
                            <p className="font-medium">{option.label}</p>
                            {option.description && (
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="mt-4"
                >
                  Previous Question
                </Button>
              )}
            </>
          )}

          {isAssessing && (
            <div className="text-center py-8">
              <BarChart className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">Analyzing your responses...</p>
              <p className="text-sm text-gray-600 mt-2">Generating personalized recommendations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!result && !isAssessing && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">Your responses are confidential</p>
                <p>This assessment helps identify opportunities and create a customized roadmap for your AI journey.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};