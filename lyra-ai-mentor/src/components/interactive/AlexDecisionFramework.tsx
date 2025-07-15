import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Scale, 
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Calculator,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Plus,
  ArrowRight
} from 'lucide-react';

interface Decision {
  id: string;
  title: string;
  description: string;
  category: 'strategic' | 'operational' | 'financial' | 'programmatic';
  urgency: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  stakeholders: string[];
  options: DecisionOption[];
  criteria: DecisionCriteria[];
  framework: 'weighted_scoring' | 'pros_cons' | 'cost_benefit' | 'decision_matrix';
  status: 'evaluating' | 'decided' | 'implemented' | 'reviewed';
  createdAt: Date;
  decidedAt?: Date;
  chosenOption?: string;
}

interface DecisionOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  costs: number;
  timeframe: string;
  risks: string[];
  score?: number;
  rationale?: string;
}

interface DecisionCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-10 scale
  type: 'benefit' | 'cost' | 'risk' | 'feasibility';
  measurable: boolean;
}

interface CriteriaScore {
  optionId: string;
  criteriaId: string;
  score: number; // 1-10 scale
  justification: string;
}

interface DecisionFramework {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  steps: string[];
  timeRequired: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

interface DecisionAnalysis {
  recommendation: string;
  confidence: number; // 0-100
  keyFactors: string[];
  risks: string[];
  nextSteps: string[];
  sensitivity: {
    criteria: string;
    impact: string;
  }[];
}

const AlexDecisionFramework: React.FC = () => {
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [activeStep, setActiveStep] = useState<'setup' | 'options' | 'criteria' | 'scoring' | 'analysis'>('setup');
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [criteriaScores, setCriteriaScores] = useState<CriteriaScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const decisionFrameworks: DecisionFramework[] = [
    {
      id: 'weighted-scoring',
      name: 'Weighted Scoring Matrix',
      description: 'Systematic evaluation using weighted criteria scores',
      bestFor: ['Strategic planning', 'Program selection', 'Vendor evaluation', 'Investment decisions'],
      steps: ['Define criteria', 'Assign weights', 'Score options', 'Calculate totals', 'Analyze results'],
      timeRequired: '45-90 minutes',
      complexity: 'moderate'
    },
    {
      id: 'pros-cons',
      name: 'Enhanced Pros & Cons',
      description: 'Structured comparison with impact weighting',
      bestFor: ['Quick decisions', 'Binary choices', 'Team discussions', 'Initial screening'],
      steps: ['List pros and cons', 'Weight by importance', 'Consider implementation', 'Compare totals'],
      timeRequired: '20-30 minutes',
      complexity: 'simple'
    },
    {
      id: 'cost-benefit',
      name: 'Cost-Benefit Analysis',
      description: 'Quantitative analysis of financial and non-financial impacts',
      bestFor: ['Budget decisions', 'Program ROI', 'Resource allocation', 'Grant applications'],
      steps: ['Identify all costs', 'Quantify benefits', 'Calculate ratios', 'Consider intangibles', 'Risk assessment'],
      timeRequired: '60-120 minutes',
      complexity: 'complex'
    },
    {
      id: 'decision-matrix',
      name: 'Multi-Criteria Decision Matrix',
      description: 'Comprehensive framework for complex decisions with multiple stakeholders',
      bestFor: ['Complex strategic decisions', 'Multi-stakeholder situations', 'Long-term planning'],
      steps: ['Stakeholder input', 'Criteria definition', 'Option evaluation', 'Weighted analysis', 'Consensus building'],
      timeRequired: '2-4 hours',
      complexity: 'complex'
    }
  ];

  const sampleDecisions: Decision[] = [
    {
      id: 'program-expansion',
      title: 'Expand Youth Program to New Location',
      description: 'Decide whether to open a second site for our after-school program',
      category: 'programmatic',
      urgency: 'medium',
      complexity: 'moderate',
      stakeholders: ['Program Director', 'Board', 'Current families', 'New community'],
      framework: 'weighted_scoring',
      status: 'evaluating',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      options: [
        {
          id: 'expand-now',
          name: 'Expand to Eastside Community Center',
          description: 'Open second location serving 40 additional youth',
          pros: [
            'Serves underserved community',
            'Strong community partnership',
            'Existing facility available',
            'Experienced staff interested'
          ],
          cons: [
            'Requires additional $75K annual funding',
            'Stretches current management capacity',
            'Different demographic needs different programming',
            'Transportation challenges for some families'
          ],
          costs: 75000,
          timeframe: '6 months to launch',
          risks: [
            'Funding shortfall',
            'Enrollment below projections',
            'Quality concerns with rapid expansion'
          ]
        },
        {
          id: 'wait-strengthen',
          name: 'Wait and Strengthen Current Program',
          description: 'Focus on deepening impact at current location first',
          pros: [
            'Ensures quality before expansion',
            'Builds stronger financial foundation',
            'Develops systems and processes',
            'Reduces organizational risk'
          ],
          cons: [
            'Delays serving additional youth',
            'May lose partnership opportunity',
            'Competitor might enter market',
            'Current families asking for expansion'
          ],
          costs: 0,
          timeframe: '12-18 months before expansion',
          risks: [
            'Lost opportunity cost',
            'Community expectations not met',
            'Staff frustration with delayed growth'
          ]
        },
        {
          id: 'partial-expansion',
          name: 'Pilot Program with Limited Scope',
          description: 'Start with 2-day per week program to test demand',
          pros: [
            'Lower financial risk',
            'Tests market demand',
            'Builds community relationships',
            'Allows gradual scaling'
          ],
          cons: [
            'Limited impact for families',
            'May not be financially sustainable',
            'Complex scheduling and logistics',
            'Harder to attract quality staff'
          ],
          costs: 25000,
          timeframe: '3 months to launch pilot',
          risks: [
            'Confusion about program commitment',
            'Insufficient critical mass',
            'Higher per-participant costs'
          ]
        }
      ],
      criteria: [
        {
          id: 'community-impact',
          name: 'Community Impact',
          description: 'Number of youth served and depth of impact',
          weight: 9,
          type: 'benefit',
          measurable: true
        },
        {
          id: 'financial-sustainability',
          name: 'Financial Sustainability',
          description: 'Long-term financial viability and risk',
          weight: 8,
          type: 'cost',
          measurable: true
        },
        {
          id: 'organizational-capacity',
          name: 'Organizational Capacity',
          description: 'Ability to maintain quality while growing',
          weight: 7,
          type: 'feasibility',
          measurable: false
        },
        {
          id: 'strategic-alignment',
          name: 'Strategic Alignment',
          description: 'Fits with long-term organizational goals',
          weight: 6,
          type: 'benefit',
          measurable: false
        }
      ]
    }
  ];

  React.useEffect(() => {
    if (decisions.length === 0) {
      setDecisions(sampleDecisions);
    }
  }, []);

  const createNewDecision = () => {
    const newDecision: Decision = {
      id: `decision-${Date.now()}`,
      title: '',
      description: '',
      category: 'strategic',
      urgency: 'medium',
      complexity: 'moderate',
      stakeholders: [],
      options: [],
      criteria: [],
      framework: 'weighted_scoring',
      status: 'evaluating',
      createdAt: new Date()
    };
    setCurrentDecision(newDecision);
    setActiveStep('setup');
  };

  const calculateOptionScores = () => {
    if (!currentDecision) return {};
    
    const scores: { [optionId: string]: number } = {};
    
    currentDecision.options.forEach(option => {
      let totalScore = 0;
      let totalWeight = 0;
      
      currentDecision.criteria.forEach(criteria => {
        const score = criteriaScores.find(cs => 
          cs.optionId === option.id && cs.criteriaId === criteria.id
        );
        if (score) {
          totalScore += score.score * criteria.weight;
          totalWeight += criteria.weight;
        }
      });
      
      scores[option.id] = totalWeight > 0 ? totalScore / totalWeight : 0;
    });
    
    return scores;
  };

  const generateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const scores = calculateOptionScores();
    const sortedOptions = currentDecision?.options.sort((a, b) => 
      (scores[b.id] || 0) - (scores[a.id] || 0)
    ) || [];
    
    const analysis: DecisionAnalysis = {
      recommendation: sortedOptions[0]?.name || 'No clear recommendation',
      confidence: 85,
      keyFactors: [
        'Community impact potential is highest with expansion option',
        'Financial sustainability concerns favor gradual approach',
        'Organizational capacity is the critical limiting factor'
      ],
      risks: [
        'Rapid expansion may compromise program quality',
        'Delayed action could result in lost community partnership',
        'Pilot approach may create unclear expectations'
      ],
      nextSteps: [
        'Conduct detailed financial modeling for top option',
        'Meet with community partners to discuss implementation',
        'Develop staffing and management plan',
        'Create board presentation with recommendation'
      ],
      sensitivity: [
        {
          criteria: 'Financial Sustainability',
          impact: 'Small changes in funding assumptions significantly affect ranking'
        },
        {
          criteria: 'Organizational Capacity',
          impact: 'Management capability assessment is critical to final decision'
        }
      ]
    };
    
    console.log('Decision analysis generated:', analysis);
    setIsAnalyzing(false);
    return analysis;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategic': return 'text-purple-600 bg-purple-100';
      case 'operational': return 'text-blue-600 bg-blue-100';
      case 'financial': return 'text-green-600 bg-green-100';
      case 'programmatic': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'complex': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Decision Framework</CardTitle>
              <CardDescription>
                Structured decision-making tools and frameworks for complex organizational choices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentDecision ? (
            /* Decision Portfolio */
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{decisions.length}</div>
                    <div className="text-sm text-gray-600">Active Decisions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {decisions.filter(d => d.status === 'decided').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {decisions.filter(d => d.urgency === 'high').length}
                    </div>
                    <div className="text-sm text-gray-600">High Urgency</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {decisions.reduce((sum, d) => sum + d.options.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Options Evaluated</div>
                  </CardContent>
                </Card>
              </div>

              {/* Framework Selection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Decision Frameworks</CardTitle>
                      <CardDescription>Choose the right framework for your decision type</CardDescription>
                    </div>
                    <Button onClick={createNewDecision}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Decision
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {decisionFrameworks.map((framework) => (
                    <div key={framework.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{framework.name}</h4>
                          <p className="text-gray-600">{framework.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getComplexityColor(framework.complexity)} variant="secondary">
                            {framework.complexity}
                          </Badge>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              createNewDecision();
                              setCurrentDecision(prev => prev ? { ...prev, framework: framework.id as any } : null);
                            }}
                          >
                            Use Framework
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Best For:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {framework.bestFor.map((use, index) => (
                              <li key={index}>• {use}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Process Steps:</div>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {framework.steps.map((step, index) => (
                              <li key={index}>{index + 1}. {step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        ⏱️ Time Required: {framework.timeRequired}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Current Decisions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Decisions</CardTitle>
                  <CardDescription>Your active decision-making processes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {decisions.map((decision) => (
                    <div key={decision.id} 
                         className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => setCurrentDecision(decision)}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{decision.title}</h4>
                          <p className="text-gray-600">{decision.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(decision.category)} variant="secondary">
                            {decision.category}
                          </Badge>
                          <Badge className={getUrgencyColor(decision.urgency)} variant="secondary">
                            {decision.urgency} urgency
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{decision.options.length}</div>
                          <div className="text-xs text-blue-600">Options</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{decision.criteria.length}</div>
                          <div className="text-xs text-green-600">Criteria</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">{decision.stakeholders.length}</div>
                          <div className="text-xs text-purple-600">Stakeholders</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600 capitalize">{decision.status}</div>
                          <div className="text-xs text-orange-600">Status</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Created: {decision.createdAt.toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Decision Detail */
            <div className="space-y-6">
              {/* Decision Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentDecision.title || 'New Decision'}</CardTitle>
                      <CardDescription>{currentDecision.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentDecision(null)}>
                      Back to Portfolio
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Navigation Steps */}
              <div className="flex gap-2 border-b">
                {[
                  { id: 'setup', label: 'Setup', icon: Target },
                  { id: 'options', label: 'Options', icon: Lightbulb },
                  { id: 'criteria', label: 'Criteria', icon: Scale },
                  { id: 'scoring', label: 'Scoring', icon: Calculator },
                  { id: 'analysis', label: 'Analysis', icon: BarChart3 }
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <Button
                      key={step.id}
                      variant={activeStep === step.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveStep(step.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {step.label}
                    </Button>
                  );
                })}
              </div>

              {/* Step Content */}
              {activeStep === 'setup' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Decision Setup</CardTitle>
                    <CardDescription>Define the decision context and parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Decision Title</label>
                      <Input 
                        placeholder="What decision are you making?"
                        value={currentDecision.title}
                        onChange={(e) => setCurrentDecision(prev => prev ? { ...prev, title: e.target.value } : null)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        placeholder="Provide context and background for this decision..."
                        value={currentDecision.description}
                        onChange={(e) => setCurrentDecision(prev => prev ? { ...prev, description: e.target.value } : null)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={currentDecision.category}
                          onChange={(e) => setCurrentDecision(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                        >
                          <option value="strategic">Strategic</option>
                          <option value="operational">Operational</option>
                          <option value="financial">Financial</option>
                          <option value="programmatic">Programmatic</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Urgency</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={currentDecision.urgency}
                          onChange={(e) => setCurrentDecision(prev => prev ? { ...prev, urgency: e.target.value as any } : null)}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Complexity</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={currentDecision.complexity}
                          onChange={(e) => setCurrentDecision(prev => prev ? { ...prev, complexity: e.target.value as any } : null)}
                        >
                          <option value="simple">Simple</option>
                          <option value="moderate">Moderate</option>
                          <option value="complex">Complex</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeStep === 'options' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Decision Options</CardTitle>
                    <CardDescription>Define the available choices and alternatives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentDecision.options.map((option, index) => (
                      <div key={option.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{option.name}</h4>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-green-700 mb-2">Pros:</div>
                            <ul className="text-sm space-y-1">
                              {option.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-red-700 mb-2">Cons:</div>
                            <ul className="text-sm space-y-1">
                              {option.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium">Cost:</span> ${option.costs.toLocaleString()}</div>
                          <div><span className="font-medium">Timeframe:</span> {option.timeframe}</div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeStep === 'scoring' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Option Scoring</CardTitle>
                        <CardDescription>Score each option against your criteria</CardDescription>
                      </div>
                      <Button 
                        onClick={generateAnalysis}
                        disabled={isAnalyzing}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentDecision.options.map((option) => {
                        const scores = calculateOptionScores();
                        const optionScore = scores[option.id] || 0;
                        
                        return (
                          <div key={option.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold">{option.name}</h4>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">
                                  {optionScore.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-600">Overall Score</div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {currentDecision.criteria.map((criteria) => (
                                <div key={criteria.id} className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{criteria.name}</div>
                                    <div className="text-xs text-gray-600">Weight: {criteria.weight}/10</div>
                                  </div>
                                  <div className="w-32">
                                    <Input 
                                      type="number"
                                      min="1"
                                      max="10"
                                      placeholder="1-10"
                                      className="text-center"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Decision Making Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Decision-Making Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Structured Approach:</h4>
                  <ul className="space-y-1">
                    <li>• Define clear decision criteria upfront</li>
                    <li>• Include diverse stakeholder perspectives</li>
                    <li>• Weight criteria based on organizational values</li>
                    <li>• Consider both quantitative and qualitative factors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementation Success:</h4>
                  <ul className="space-y-1">
                    <li>• Plan for change management and communication</li>
                    <li>• Build in checkpoints for course correction</li>
                    <li>• Document rationale for future reference</li>
                    <li>• Learn from outcomes to improve future decisions</li>
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

export default AlexDecisionFramework;