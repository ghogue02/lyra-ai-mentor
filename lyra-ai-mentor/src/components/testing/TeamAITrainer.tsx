import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Target, Calendar, BookOpen, Award, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TeamAITrainerProps {
  onComplete?: () => void;
}

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  format: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  outcomes: string[];
  activities: string[];
}

interface TrainingPlan {
  organizationProfile: {
    size: string;
    currentSkillLevel: string;
    goals: string[];
    timeframe: string;
  };
  curriculum: {
    phase: string;
    modules: TrainingModule[];
    milestone: string;
  }[];
  deliveryMethods: {
    method: string;
    frequency: string;
    duration: string;
    bestFor: string;
  }[];
  resistanceStrategies: {
    concern: string;
    response: string;
    activity: string;
  }[];
  successMetrics: {
    metric: string;
    baseline: string;
    target: string;
    measurement: string;
  }[];
  resources: {
    type: string;
    title: string;
    description: string;
    link?: string;
  }[];
}

export const TeamAITrainer: React.FC<TeamAITrainerProps> = ({ onComplete }) => {
  const [teamSize, setTeamSize] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<string>('');
  const [trainingGoals, setTrainingGoals] = useState<string>('');
  const [timeCommitment, setTimeCommitment] = useState<string>('');
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const teamSizes = [
    { value: 'small', label: 'Small (1-10)', description: 'Intimate, personalized training' },
    { value: 'medium', label: 'Medium (11-25)', description: 'Department-level training' },
    { value: 'large', label: 'Large (26-50)', description: 'Organization-wide rollout' },
    { value: 'enterprise', label: 'Enterprise (50+)', description: 'Multi-site coordination' }
  ];

  const skillLevels = [
    { value: 'novice', label: 'AI Novice', description: 'Little to no AI experience' },
    { value: 'basic', label: 'Basic Users', description: 'Use simple AI tools occasionally' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular AI tool users' },
    { value: 'mixed', label: 'Mixed Levels', description: 'Wide range of skills' }
  ];

  const goals = [
    { value: 'awareness', label: 'Build AI Awareness', description: 'Understand AI possibilities' },
    { value: 'adoption', label: 'Drive Tool Adoption', description: 'Get team using AI tools' },
    { value: 'productivity', label: 'Boost Productivity', description: 'Maximize efficiency gains' },
    { value: 'innovation', label: 'Foster Innovation', description: 'Create AI-first culture' },
    { value: 'specific_tools', label: 'Master Specific Tools', description: 'Deep dive on chosen tools' }
  ];

  const timeOptions = [
    { value: 'minimal', label: '1-2 hours/month', description: 'Light touch approach' },
    { value: 'moderate', label: '1-2 hours/week', description: 'Steady progress' },
    { value: 'intensive', label: '4+ hours/week', description: 'Rapid transformation' },
    { value: 'bootcamp', label: 'Full immersion', description: 'Dedicated training period' }
  ];

  const generateTrainingPlan = async () => {
    if (!teamSize || !currentLevel || !trainingGoals || !timeCommitment) {
      toast.error('Please complete all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const plan = createCustomPlan();
      setTrainingPlan(plan);
      
      toast.success('Training plan created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createCustomPlan = (): TrainingPlan => {
    const templates: Record<string, () => TrainingPlan> = {
      'novice_awareness': () => ({
        organizationProfile: {
          size: teamSizes.find(t => t.value === teamSize)?.label || '',
          currentSkillLevel: 'AI Novice',
          goals: ['Build foundational AI understanding', 'Address concerns and myths', 'Create excitement for possibilities'],
          timeframe: '3-4 months'
        },
        curriculum: [
          {
            phase: 'Phase 1: AI Foundations (Month 1)',
            modules: [
              {
                id: 'intro',
                title: 'AI Demystified',
                duration: '90 minutes',
                format: 'Interactive workshop',
                level: 'beginner',
                topics: ['What is AI really?', 'AI vs human intelligence', 'Common AI myths debunked'],
                outcomes: ['Understand AI basics', 'Reduce AI anxiety', 'See relevance to nonprofit work'],
                activities: ['AI or Not game', 'Personal AI audit', 'Mission impact brainstorm']
              },
              {
                id: 'ethics',
                title: 'AI Ethics & Your Mission',
                duration: '60 minutes',
                format: 'Discussion-based',
                level: 'beginner',
                topics: ['AI bias awareness', 'Privacy considerations', 'Responsible AI use'],
                outcomes: ['Identify ethical considerations', 'Align AI use with values', 'Create usage guidelines'],
                activities: ['Case study analysis', 'Values mapping', 'Policy co-creation']
              }
            ],
            milestone: 'Team understands AI fundamentals and organizational approach'
          },
          {
            phase: 'Phase 2: Hands-On Exploration (Month 2)',
            modules: [
              {
                id: 'tools_intro',
                title: 'AI Tools Safari',
                duration: '2 hours',
                format: 'Hands-on lab',
                level: 'beginner',
                topics: ['ChatGPT basics', 'Image generation', 'Writing assistants'],
                outcomes: ['Use 3 basic AI tools', 'Complete real work tasks', 'Build confidence'],
                activities: ['Tool rotation stations', 'Real task completion', 'Success story sharing']
              },
              {
                id: 'quick_wins',
                title: 'AI Quick Wins',
                duration: '90 minutes',
                format: 'Workshop',
                level: 'beginner',
                topics: ['Email drafting', 'Social media posts', 'Meeting summaries'],
                outcomes: ['Save 2+ hours/week', 'Identify personal use cases', 'Share successes'],
                activities: ['Before/after demos', 'Personal workflow mapping', 'Time savings calculation']
              }
            ],
            milestone: 'Each team member actively using at least one AI tool'
          },
          {
            phase: 'Phase 3: Building Momentum (Month 3-4)',
            modules: [
              {
                id: 'collaboration',
                title: 'AI Team Collaboration',
                duration: '90 minutes',
                format: 'Team workshop',
                level: 'intermediate',
                topics: ['Shared AI workflows', 'Knowledge sharing', 'Best practices'],
                outcomes: ['Create team standards', 'Build support network', 'Scale successes'],
                activities: ['Workflow design sprint', 'Peer teaching', 'Success metrics review']
              },
              {
                id: 'innovation',
                title: 'AI Innovation Lab',
                duration: '2 hours',
                format: 'Creative session',
                level: 'intermediate',
                topics: ['Brainstorming with AI', 'Process improvement', 'New possibilities'],
                outcomes: ['Identify 3 innovation projects', 'Create pilot plans', 'Assign champions'],
                activities: ['Design thinking with AI', 'Pilot project planning', 'Resource allocation']
              }
            ],
            milestone: 'Team culture embraces AI as standard tool'
          }
        ],
        deliveryMethods: [
          {
            method: 'Monthly All-Hands Workshop',
            frequency: 'Once per month',
            duration: '2 hours',
            bestFor: 'Major concepts and team alignment'
          },
          {
            method: 'Weekly Lunch & Learns',
            frequency: 'Every Wednesday',
            duration: '30 minutes',
            bestFor: 'Tool tips and success sharing'
          },
          {
            method: 'Buddy System',
            frequency: 'Ongoing',
            duration: 'As needed',
            bestFor: 'Peer support and troubleshooting'
          },
          {
            method: 'Office Hours',
            frequency: 'Twice weekly',
            duration: '1 hour slots',
            bestFor: 'Individual help and advanced questions'
          }
        ],
        resistanceStrategies: [
          {
            concern: 'AI will replace our jobs',
            response: 'AI enhances human work, not replaces it',
            activity: 'Show before/after examples of enhanced work'
          },
          {
            concern: 'Too complicated to learn',
            response: 'Start with simple, familiar tasks',
            activity: 'One-button wins demonstration'
          },
          {
            concern: 'No time for learning',
            response: 'AI saves more time than training takes',
            activity: 'ROI calculator with real examples'
          },
          {
            concern: 'Security and privacy risks',
            response: 'Address with clear policies',
            activity: 'Co-create usage guidelines'
          }
        ],
        successMetrics: [
          {
            metric: 'Tool Adoption Rate',
            baseline: '0%',
            target: '80% using at least one tool',
            measurement: 'Monthly survey'
          },
          {
            metric: 'Time Savings',
            baseline: '0 hours/week',
            target: '2+ hours/week per person',
            measurement: 'Time tracking logs'
          },
          {
            metric: 'Confidence Level',
            baseline: 'Low/anxious',
            target: 'Comfortable/excited',
            measurement: 'Quarterly assessment'
          },
          {
            metric: 'Innovation Ideas',
            baseline: '0',
            target: '3 pilots launched',
            measurement: 'Project tracking'
          }
        ],
        resources: [
          {
            type: 'Guide',
            title: 'AI Tools Starter Kit',
            description: 'Curated list of beginner-friendly tools with tutorials'
          },
          {
            type: 'Template',
            title: 'Prompt Library',
            description: 'Copy-paste prompts for common nonprofit tasks'
          },
          {
            type: 'Video Series',
            title: '5-Minute AI Wins',
            description: 'Quick tutorials for immediate productivity gains'
          },
          {
            type: 'Community',
            title: 'Internal AI Champions Network',
            description: 'Slack channel for questions and sharing'
          }
        ]
      }),

      'intermediate_productivity': () => ({
        organizationProfile: {
          size: teamSizes.find(t => t.value === teamSize)?.label || '',
          currentSkillLevel: 'Intermediate Users',
          goals: ['Maximize productivity gains', 'Standardize best practices', 'Scale AI usage'],
          timeframe: '2-3 months'
        },
        curriculum: [
          {
            phase: 'Phase 1: Advanced Techniques (Month 1)',
            modules: [
              {
                id: 'advanced_prompting',
                title: 'Prompt Engineering Mastery',
                duration: '2 hours',
                format: 'Hands-on workshop',
                level: 'intermediate',
                topics: ['Advanced prompting techniques', 'Context optimization', 'Output refinement'],
                outcomes: ['10x better AI outputs', 'Create prompt templates', 'Train others'],
                activities: ['Prompt challenges', 'Template building', 'A/B testing outputs']
              },
              {
                id: 'workflow_integration',
                title: 'AI Workflow Integration',
                duration: '90 minutes',
                format: 'Process mapping session',
                level: 'intermediate',
                topics: ['End-to-end automation', 'Tool chaining', 'Process optimization'],
                outcomes: ['Automate 3 workflows', 'Connect multiple tools', 'Measure improvements'],
                activities: ['Workflow mapping', 'Integration setup', 'ROI calculation']
              }
            ],
            milestone: 'Team using AI for complex, multi-step processes'
          },
          {
            phase: 'Phase 2: Specialization (Month 2)',
            modules: [
              {
                id: 'role_specific',
                title: 'AI for Your Role',
                duration: '2 hours',
                format: 'Role-based tracks',
                level: 'advanced',
                topics: ['Fundraising AI', 'Program delivery AI', 'Operations AI', 'Communications AI'],
                outcomes: ['Master role-specific tools', 'Create custom workflows', 'Become team expert'],
                activities: ['Tool deep dives', 'Custom solution building', 'Peer teaching prep']
              },
              {
                id: 'data_analytics',
                title: 'AI-Powered Analytics',
                duration: '2 hours',
                format: 'Data workshop',
                level: 'intermediate',
                topics: ['Data visualization', 'Predictive insights', 'Report automation'],
                outcomes: ['Create live dashboards', 'Generate insights', 'Automate reporting'],
                activities: ['Dashboard creation', 'Insight generation', 'Storytelling with data']
              }
            ],
            milestone: 'Each department has AI-powered processes'
          },
          {
            phase: 'Phase 3: Innovation Sprint (Month 3)',
            modules: [
              {
                id: 'ai_hackathon',
                title: 'AI Innovation Challenge',
                duration: 'Full day',
                format: 'Team hackathon',
                level: 'advanced',
                topics: ['Creative problem solving', 'Rapid prototyping', 'Cross-functional collaboration'],
                outcomes: ['Develop new solutions', 'Win executive support', 'Launch pilots'],
                activities: ['Problem identification', 'Solution sprints', 'Pitch presentations']
              },
              {
                id: 'scaling_excellence',
                title: 'Scaling AI Excellence',
                duration: '90 minutes',
                format: 'Strategy session',
                level: 'advanced',
                topics: ['Change management', 'Knowledge sharing', 'Continuous improvement'],
                outcomes: ['Create scaling plan', 'Build mentor network', 'Establish CoE'],
                activities: ['Roadmap creation', 'Mentor matching', 'Success celebration']
              }
            ],
            milestone: 'Organization recognized as AI-forward nonprofit'
          }
        ],
        deliveryMethods: [
          {
            method: 'Skill Sprints',
            frequency: 'Bi-weekly',
            duration: '90 minutes',
            bestFor: 'Deep skill development'
          },
          {
            method: 'Department Huddles',
            frequency: 'Weekly',
            duration: '30 minutes',
            bestFor: 'Role-specific applications'
          },
          {
            method: 'Innovation Days',
            frequency: 'Monthly',
            duration: 'Half day',
            bestFor: 'Creative exploration'
          },
          {
            method: 'Peer Mentoring',
            frequency: 'Ongoing',
            duration: 'Flexible',
            bestFor: 'Continuous support'
          }
        ],
        resistanceStrategies: [
          {
            concern: 'Already too busy',
            response: 'Show immediate time ROI',
            activity: 'Live workflow transformation demo'
          },
          {
            concern: 'Tools changing too fast',
            response: 'Focus on principles, not just tools',
            activity: 'Teach transferable skills'
          },
          {
            concern: 'Quality concerns',
            response: 'Emphasize human oversight',
            activity: 'Quality assurance framework'
          }
        ],
        successMetrics: [
          {
            metric: 'Productivity Gain',
            baseline: '10%',
            target: '40% time savings',
            measurement: 'Task timing studies'
          },
          {
            metric: 'Process Automation',
            baseline: '2 processes',
            target: '15+ processes',
            measurement: 'Automation inventory'
          },
          {
            metric: 'Innovation Pipeline',
            baseline: '1 idea',
            target: '10 active projects',
            measurement: 'Project tracker'
          },
          {
            metric: 'Team Capability',
            baseline: 'Basic users',
            target: 'Advanced practitioners',
            measurement: 'Skills assessment'
          }
        ],
        resources: [
          {
            type: 'Playbook',
            title: 'Advanced AI Playbook',
            description: 'Comprehensive guide to complex implementations'
          },
          {
            type: 'Toolkit',
            title: 'Automation Templates',
            description: 'Pre-built workflows for common processes'
          },
          {
            type: 'Dashboard',
            title: 'AI Impact Tracker',
            description: 'Real-time metrics on AI ROI'
          },
          {
            type: 'Network',
            title: 'AI Excellence Network',
            description: 'Connect with other AI-forward nonprofits'
          }
        ]
      })
    };

    // Select template based on inputs
    const key = `${currentLevel}_${trainingGoals}`;
    const template = templates[key] || templates.novice_awareness;
    
    return template();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Team AI Training Planner
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create a customized AI training program for your team
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Team Size</label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger>
                  <SelectValue placeholder="How many people?" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div>
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-gray-500">{size.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Skill Level</label>
              <Select value={currentLevel} onValueChange={setCurrentLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Team's AI experience" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-gray-500">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Training Goal</label>
            <Select value={trainingGoals} onValueChange={setTrainingGoals}>
              <SelectTrigger>
                <SelectValue placeholder="What do you want to achieve?" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    <div>
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Commitment</label>
            <Select value={timeCommitment} onValueChange={setTimeCommitment}>
              <SelectTrigger>
                <SelectValue placeholder="How much time can team dedicate?" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    <div>
                      <div className="font-medium">{time.label}</div>
                      <div className="text-xs text-gray-500">{time.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateTrainingPlan} 
            disabled={isGenerating || !teamSize || !currentLevel || !trainingGoals || !timeCommitment}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <GraduationCap className="h-4 w-4 mr-2 animate-spin" />
                Creating Training Plan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Training Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {trainingPlan && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your AI Training Program</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {trainingPlan.organizationProfile.timeframe} journey to AI excellence
                  </p>
                </div>
                <Badge variant="secondary">
                  {trainingPlan.organizationProfile.size}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Goals:</span>
                  {trainingPlan.organizationProfile.goals.map((goal, index) => (
                    <Badge key={index} variant="outline">
                      {goal}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Starting Point:</span>
                  <span className="text-sm text-gray-600">{trainingPlan.organizationProfile.currentSkillLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {trainingPlan.curriculum.map((phase, phaseIndex) => (
            <Card key={phaseIndex}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  {phase.phase}
                </CardTitle>
                <p className="text-sm text-gray-600">{phase.milestone}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phase.modules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {module.duration}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {module.format}
                            </Badge>
                            <Badge className={`text-xs ${getLevelColor(module.level)}`}>
                              {module.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Topics</p>
                          <ul className="space-y-1">
                            {module.topics.map((topic, i) => (
                              <li key={i} className="text-gray-600">• {topic}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Learning Outcomes</p>
                          <ul className="space-y-1">
                            {module.outcomes.map((outcome, i) => (
                              <li key={i} className="text-gray-600">• {outcome}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Activities</p>
                          <ul className="space-y-1">
                            {module.activities.map((activity, i) => (
                              <li key={i} className="text-gray-600">• {activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingPlan.deliveryMethods.map((method, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{method.method}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 {method.frequency}</p>
                      <p>⏱️ {method.duration}</p>
                      <p>✨ {method.bestFor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overcoming Resistance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingPlan.resistanceStrategies.map((strategy, index) => (
                  <div key={index} className="border-l-4 border-amber-500 pl-4">
                    <p className="font-medium text-amber-900">"{strategy.concern}"</p>
                    <p className="text-sm text-gray-700 mt-1">{strategy.response}</p>
                    <p className="text-sm text-green-700 mt-2">
                      <strong>Activity:</strong> {strategy.activity}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingPlan.successMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium text-green-900">{metric.metric}</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-gray-600">Baseline: {metric.baseline}</p>
                      <p className="text-green-700 font-medium">Target: {metric.target}</p>
                      <p className="text-gray-600">How: {metric.measurement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Training Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingPlan.resources.map((resource, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Badge variant="outline">{resource.type}</Badge>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Award className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Implementation Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Start with volunteers - early adopters build momentum</li>
                    <li>Celebrate every win, no matter how small</li>
                    <li>Make it relevant - use real work examples</li>
                    <li>Create safe spaces for experimentation</li>
                    <li>Document and share success stories</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  <strong>Ready to launch?</strong> Start with a pilot group of enthusiastic team members. 
                  Their success will inspire others and create natural evangelists for AI adoption.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};