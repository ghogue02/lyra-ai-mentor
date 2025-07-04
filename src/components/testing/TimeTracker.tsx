import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, AlertCircle, Target, BarChart, Calendar, Timer, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TimeTrackerProps {
  onComplete?: () => void;
}

interface TimeEntry {
  activity: string;
  category: string;
  timeSpent: number;
  value: 'high' | 'medium' | 'low';
  automatable: boolean;
  optimization?: string;
}

interface TimeAnalysis {
  period: string;
  totalHours: number;
  categories: {
    name: string;
    hours: number;
    percentage: number;
    color: string;
  }[];
  valueBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  topTimeWasters: {
    activity: string;
    hoursPerWeek: number;
    impact: string;
    solution: string;
  }[];
  automationOpportunities: {
    task: string;
    currentTime: string;
    potentialSaving: string;
    method: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  recommendations: {
    category: string;
    insight: string;
    action: string;
    expectedSaving: string;
  }[];
  idealSchedule: {
    category: string;
    currentHours: number;
    recommendedHours: number;
    difference: number;
  }[];
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ onComplete }) => {
  const [role, setRole] = useState<string>('');
  const [timeLog, setTimeLog] = useState('');
  const [challenges, setChallenges] = useState<string>('');
  const [analysis, setAnalysis] = useState<TimeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const roles = [
    { value: 'executive_director', label: 'Executive Director', description: 'Leadership & management' },
    { value: 'development_director', label: 'Development Director', description: 'Fundraising focus' },
    { value: 'program_manager', label: 'Program Manager', description: 'Service delivery' },
    { value: 'communications', label: 'Communications Manager', description: 'Marketing & outreach' },
    { value: 'operations', label: 'Operations Manager', description: 'Admin & systems' },
    { value: 'volunteer_coordinator', label: 'Volunteer Coordinator', description: 'Volunteer management' },
    { value: 'finance_manager', label: 'Finance Manager', description: 'Financial oversight' },
    { value: 'generalist', label: 'Small Org Generalist', description: 'Multiple responsibilities' }
  ];

  const analyzeTime = async () => {
    if (!role || !timeLog.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateTimeAnalysis();
      setAnalysis(result);
      
      toast.success('Time analysis complete!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to analyze time usage. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTimeAnalysis = (): TimeAnalysis => {
    const templates: Record<string, () => TimeAnalysis> = {
      executive_director: () => ({
        period: 'Weekly Analysis (40 hours)',
        totalHours: 52,
        categories: [
          { name: 'Meetings', hours: 18, percentage: 35, color: 'bg-red-500' },
          { name: 'Email & Communication', hours: 10, percentage: 19, color: 'bg-blue-500' },
          { name: 'Fundraising', hours: 8, percentage: 15, color: 'bg-green-500' },
          { name: 'Strategic Planning', hours: 5, percentage: 10, color: 'bg-purple-500' },
          { name: 'Staff Management', hours: 4, percentage: 8, color: 'bg-yellow-500' },
          { name: 'Board Relations', hours: 3, percentage: 6, color: 'bg-indigo-500' },
          { name: 'Administrative', hours: 4, percentage: 8, color: 'bg-gray-500' }
        ],
        valueBreakdown: {
          high: 25,
          medium: 45,
          low: 30
        },
        topTimeWasters: [
          {
            activity: 'Inefficient meetings',
            hoursPerWeek: 6,
            impact: 'Delays decision-making, frustrates team',
            solution: 'Implement meeting agendas, time limits, and action items'
          },
          {
            activity: 'Email overload',
            hoursPerWeek: 4,
            impact: 'Constant interruptions, delayed responses',
            solution: 'Set email hours, use templates, delegate responses'
          },
          {
            activity: 'Manual reporting',
            hoursPerWeek: 3,
            impact: 'Repetitive work, prone to errors',
            solution: 'Automate with dashboard tools and scheduled reports'
          },
          {
            activity: 'Context switching',
            hoursPerWeek: 5,
            impact: 'Reduced focus and productivity',
            solution: 'Time blocking and batching similar tasks'
          }
        ],
        automationOpportunities: [
          {
            task: 'Monthly board reports',
            currentTime: '4 hours/month',
            potentialSaving: '3.5 hours',
            method: 'Automated dashboard with live data',
            priority: 'high'
          },
          {
            task: 'Staff scheduling',
            currentTime: '2 hours/week',
            potentialSaving: '1.5 hours',
            method: 'Scheduling software with self-service',
            priority: 'medium'
          },
          {
            task: 'Donor acknowledgments',
            currentTime: '3 hours/week',
            potentialSaving: '2.5 hours',
            method: 'Automated thank you workflow',
            priority: 'high'
          },
          {
            task: 'Meeting notes distribution',
            currentTime: '1 hour/week',
            potentialSaving: '45 minutes',
            method: 'Collaborative docs with auto-sharing',
            priority: 'low'
          }
        ],
        recommendations: [
          {
            category: 'Meetings',
            insight: 'You spend 35% of time in meetings, above 25% benchmark',
            action: 'Reduce recurring meetings by 25%, make others optional',
            expectedSaving: '4-5 hours/week'
          },
          {
            category: 'Strategic Work',
            insight: 'Only 10% on strategy, should be 20-25% for your role',
            action: 'Block Friday mornings for strategic planning',
            expectedSaving: 'Double strategic impact'
          },
          {
            category: 'Delegation',
            insight: 'Doing tasks below your level (data entry, scheduling)',
            action: 'Delegate or automate administrative tasks',
            expectedSaving: '3-4 hours/week'
          },
          {
            category: 'Focus Time',
            insight: 'Constant interruptions preventing deep work',
            action: 'Implement "office hours" for availability',
            expectedSaving: 'Triple productivity on key projects'
          }
        ],
        idealSchedule: [
          { category: 'Strategic Planning', currentHours: 5, recommendedHours: 10, difference: 5 },
          { category: 'Fundraising', currentHours: 8, recommendedHours: 12, difference: 4 },
          { category: 'Staff Development', currentHours: 4, recommendedHours: 6, difference: 2 },
          { category: 'Meetings', currentHours: 18, recommendedHours: 10, difference: -8 },
          { category: 'Email', currentHours: 10, recommendedHours: 5, difference: -5 },
          { category: 'Admin', currentHours: 4, recommendedHours: 2, difference: -2 }
        ]
      }),

      development_director: () => ({
        period: 'Weekly Analysis (45 hours)',
        totalHours: 45,
        categories: [
          { name: 'Donor Meetings', hours: 12, percentage: 27, color: 'bg-green-500' },
          { name: 'Grant Writing', hours: 10, percentage: 22, color: 'bg-blue-500' },
          { name: 'Database Management', hours: 8, percentage: 18, color: 'bg-purple-500' },
          { name: 'Email & Comms', hours: 6, percentage: 13, color: 'bg-yellow-500' },
          { name: 'Event Planning', hours: 5, percentage: 11, color: 'bg-red-500' },
          { name: 'Research', hours: 2, percentage: 4, color: 'bg-indigo-500' },
          { name: 'Admin', hours: 2, percentage: 4, color: 'bg-gray-500' }
        ],
        valueBreakdown: {
          high: 55,
          medium: 30,
          low: 15
        },
        topTimeWasters: [
          {
            activity: 'Manual donor data entry',
            hoursPerWeek: 4,
            impact: 'Takes time from relationship building',
            solution: 'Import tools and form integrations'
          },
          {
            activity: 'Duplicate grant content creation',
            hoursPerWeek: 3,
            impact: 'Rewriting similar content repeatedly',
            solution: 'Build grant content library'
          },
          {
            activity: 'Chasing donation receipts',
            hoursPerWeek: 2,
            impact: 'Frustrates donors, delays processing',
            solution: 'Automated receipt generation'
          },
          {
            activity: 'Event logistics coordination',
            hoursPerWeek: 3,
            impact: 'Not highest value use of skills',
            solution: 'Delegate to event committee/volunteer'
          }
        ],
        automationOpportunities: [
          {
            task: 'Donor acknowledgment letters',
            currentTime: '4 hours/week',
            potentialSaving: '3.5 hours',
            method: 'Mail merge with personalization',
            priority: 'high'
          },
          {
            task: 'Prospect research',
            currentTime: '3 hours/week',
            potentialSaving: '2 hours',
            method: 'Research tools and alerts',
            priority: 'medium'
          },
          {
            task: 'Gift processing',
            currentTime: '3 hours/week',
            potentialSaving: '2.5 hours',
            method: 'Online giving platform integration',
            priority: 'high'
          },
          {
            task: 'Monthly donor reports',
            currentTime: '2 hours/month',
            potentialSaving: '1.5 hours',
            method: 'Automated dashboard',
            priority: 'medium'
          }
        ],
        recommendations: [
          {
            category: 'Major Gifts',
            insight: 'Only 27% on donor meetings, benchmark is 40%',
            action: 'Reduce admin tasks to increase face time',
            expectedSaving: '6 more donor meetings/week'
          },
          {
            category: 'Database Work',
            insight: '8 hours on data management is excessive',
            action: 'Implement import tools and cleanup protocols',
            expectedSaving: '4 hours/week'
          },
          {
            category: 'Grant Strategy',
            insight: 'Too much time writing, not enough researching',
            action: 'Invest in grant database and templates',
            expectedSaving: 'Double grant success rate'
          },
          {
            category: 'Pipeline Development',
            insight: 'Reactive fundraising vs proactive cultivation',
            action: 'Weekly time for prospect research',
            expectedSaving: 'Build sustainable pipeline'
          }
        ],
        idealSchedule: [
          { category: 'Donor Meetings', currentHours: 12, recommendedHours: 18, difference: 6 },
          { category: 'Grant Writing', currentHours: 10, recommendedHours: 8, difference: -2 },
          { category: 'Pipeline Development', currentHours: 2, recommendedHours: 6, difference: 4 },
          { category: 'Database', currentHours: 8, recommendedHours: 3, difference: -5 },
          { category: 'Events', currentHours: 5, recommendedHours: 4, difference: -1 },
          { category: 'Admin', currentHours: 2, recommendedHours: 1, difference: -1 }
        ]
      }),

      program_manager: () => ({
        period: 'Weekly Analysis (42 hours)',
        totalHours: 42,
        categories: [
          { name: 'Direct Service', hours: 15, percentage: 36, color: 'bg-blue-500' },
          { name: 'Staff Supervision', hours: 8, percentage: 19, color: 'bg-green-500' },
          { name: 'Documentation', hours: 7, percentage: 17, color: 'bg-purple-500' },
          { name: 'Planning', hours: 5, percentage: 12, color: 'bg-yellow-500' },
          { name: 'Meetings', hours: 4, percentage: 10, color: 'bg-red-500' },
          { name: 'Training', hours: 2, percentage: 5, color: 'bg-indigo-500' },
          { name: 'Admin', hours: 1, percentage: 2, color: 'bg-gray-500' }
        ],
        valueBreakdown: {
          high: 60,
          medium: 30,
          low: 10
        },
        topTimeWasters: [
          {
            activity: 'Duplicate data entry',
            hoursPerWeek: 3,
            impact: 'Same info in multiple systems',
            solution: 'Integrate systems or single source of truth'
          },
          {
            activity: 'Scheduling coordination',
            hoursPerWeek: 2,
            impact: 'Back-and-forth emails and calls',
            solution: 'Online scheduling tool for all'
          },
          {
            activity: 'Paper-based processes',
            hoursPerWeek: 2,
            impact: 'Slow, error-prone, hard to track',
            solution: 'Digital forms and workflows'
          },
          {
            activity: 'Ad hoc reporting requests',
            hoursPerWeek: 1.5,
            impact: 'Interrupts planned work',
            solution: 'Standard reports and self-service dashboard'
          }
        ],
        automationOpportunities: [
          {
            task: 'Client check-ins',
            currentTime: '3 hours/week',
            potentialSaving: '2 hours',
            method: 'Automated survey tools',
            priority: 'medium'
          },
          {
            task: 'Progress reports',
            currentTime: '4 hours/week',
            potentialSaving: '3 hours',
            method: 'Template system with data pulls',
            priority: 'high'
          },
          {
            task: 'Volunteer scheduling',
            currentTime: '2 hours/week',
            potentialSaving: '1.5 hours',
            method: 'Self-service scheduling platform',
            priority: 'medium'
          },
          {
            task: 'Supply ordering',
            currentTime: '1 hour/week',
            potentialSaving: '45 minutes',
            method: 'Automated reorder system',
            priority: 'low'
          }
        ],
        recommendations: [
          {
            category: 'Documentation',
            insight: '17% on paperwork exceeds 10% best practice',
            action: 'Streamline forms and use voice-to-text',
            expectedSaving: '3 hours/week'
          },
          {
            category: 'Direct Service',
            insight: 'High direct service time limiting growth',
            action: 'Train senior volunteers for basic tasks',
            expectedSaving: 'Serve 20% more clients'
          },
          {
            category: 'Strategic Planning',
            insight: 'Only 12% on planning, should be 20%',
            action: 'Monthly planning retreats, delegate operations',
            expectedSaving: 'Better program outcomes'
          },
          {
            category: 'Professional Development',
            insight: 'Minimal time for skill building',
            action: 'Schedule weekly learning time',
            expectedSaving: 'Improved service quality'
          }
        ],
        idealSchedule: [
          { category: 'Direct Service', currentHours: 15, recommendedHours: 12, difference: -3 },
          { category: 'Program Development', currentHours: 5, recommendedHours: 8, difference: 3 },
          { category: 'Team Leadership', currentHours: 8, recommendedHours: 10, difference: 2 },
          { category: 'Documentation', currentHours: 7, recommendedHours: 4, difference: -3 },
          { category: 'Strategic Planning', currentHours: 5, recommendedHours: 6, difference: 1 },
          { category: 'Learning', currentHours: 2, recommendedHours: 2, difference: 0 }
        ]
      })
    };

    const template = templates[role] || templates.executive_director;
    return template();
  };

  const getValueColor = (value: string) => {
    switch (value) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Time Tracker & Optimizer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Analyze how you spend your time and find opportunities to focus on what matters
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your primary role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs text-gray-500">{r.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Log</label>
            <Textarea
              value={timeLog}
              onChange={(e) => setTimeLog(e.target.value)}
              placeholder="Describe how you typically spend your week. Example: 'Meetings 15 hrs, Email 8 hrs, Grant writing 10 hrs, Planning 3 hrs...'"
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Biggest Time Challenges (Optional)</label>
            <Textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="What makes you feel like you're not using time effectively?"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={analyzeTime} 
            disabled={isAnalyzing || !role || !timeLog.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Timer className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Time Usage...
              </>
            ) : (
              <>
                <BarChart className="h-4 w-4 mr-2" />
                Analyze My Time
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Time Analysis: {analysis.period}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Total tracked: {analysis.totalHours} hours/week
                  </p>
                </div>
                <Badge variant={analysis.totalHours > 45 ? 'destructive' : 'secondary'}>
                  {analysis.totalHours > 45 ? 'Overworked' : 'Balanced'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Time by Category</h3>
                  <div className="space-y-2">
                    {analysis.categories.map((cat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat.name}</span>
                            <span className="font-medium">{cat.hours} hrs ({cat.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${cat.color} h-2 rounded-full`}
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{analysis.valueBreakdown.high}%</p>
                    <p className="text-xs text-gray-600">High Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{analysis.valueBreakdown.medium}%</p>
                    <p className="text-xs text-gray-600">Medium Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{analysis.valueBreakdown.low}%</p>
                    <p className="text-xs text-gray-600">Low Value</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Top Time Wasters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.topTimeWasters.map((waste, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-red-900">{waste.activity}</h4>
                      <Badge variant="destructive" className="text-xs">
                        {waste.hoursPerWeek} hrs/week
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">Impact: {waste.impact}</p>
                    <p className="text-sm text-green-700">
                      <strong>Solution:</strong> {waste.solution}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Automation Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.automationOpportunities.map((opp, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-blue-900">{opp.task}</h4>
                        <Badge className={getPriorityColor(opp.priority)}>
                          {opp.priority} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-700">
                        <span>Current: {opp.currentTime}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">Save: {opp.potentialSaving}</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">Method: {opp.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-purple-900">{rec.category}</h4>
                    <p className="text-sm text-gray-700 mt-1">{rec.insight}</p>
                    <p className="text-sm text-purple-700 mt-2">
                      <strong>Action:</strong> {rec.action}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Expected Result: {rec.expectedSaving}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Ideal Time Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.idealSchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm font-medium">{item.category}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Now: {item.currentHours}h</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">Goal: {item.recommendedHours}h</span>
                      <Badge 
                        variant={item.difference > 0 ? 'default' : 'secondary'}
                        className={item.difference > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {item.difference > 0 ? '+' : ''}{item.difference}h
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-900">Total Time Savings Possible</p>
                    <p className="text-3xl font-bold text-orange-700">
                      {Math.round(analysis.automationOpportunities.reduce((acc, opp) => {
                        const hours = parseFloat(opp.potentialSaving.match(/\d+\.?\d*/)?.[0] || '0');
                        return acc + hours;
                      }, 0))} hours/week
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-600" />
                </div>
                <p className="text-sm text-orange-800">
                  That's like getting an extra day every week to focus on your mission!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Pick one automation opportunity to implement this week</li>
                    <li>Block time for your highest-value activities</li>
                    <li>Say no to low-value requests that don't align with priorities</li>
                    <li>Track your time for another week and compare results</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};