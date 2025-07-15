import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Users, 
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  CheckCircle2,
  Star,
  Award,
  Clock,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  Play
} from 'lucide-react';

interface LeadershipSkill {
  id: string;
  name: string;
  category: 'strategic' | 'interpersonal' | 'operational' | 'adaptive';
  description: string;
  currentLevel: number; // 1-5 scale
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
  developmentActions: DevelopmentAction[];
  assessments: SkillAssessment[];
  resources: LearningResource[];
}

interface DevelopmentAction {
  id: string;
  title: string;
  type: 'training' | 'mentoring' | 'project' | 'reading' | 'practice';
  description: string;
  timeCommitment: number; // hours
  deadline: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  outcome?: string;
}

interface SkillAssessment {
  id: string;
  date: Date;
  assessor: string;
  type: 'self' | 'supervisor' | '360_feedback' | 'peer';
  score: number; // 1-5 scale
  strengths: string[];
  improvementAreas: string[];
  notes: string;
}

interface LearningResource {
  id: string;
  title: string;
  type: 'book' | 'course' | 'article' | 'video' | 'podcast' | 'workshop';
  description: string;
  duration: number; // hours
  provider: string;
  url?: string;
  completed: boolean;
  rating?: number; // 1-5 scale
  notes?: string;
}

interface LeadershipPlan {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  goals: string[];
  skills: LeadershipSkill[];
  mentors: Mentor[];
  milestones: Milestone[];
  status: 'active' | 'completed' | 'paused';
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  contactInfo: string;
  lastMeeting?: Date;
  nextMeeting?: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  evidence: string[];
  reflection: string;
}

const AlexLeadershipDevelopment: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<LeadershipPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'resources' | 'mentoring' | 'assessment'>('overview');
  const [plans, setPlans] = useState<LeadershipPlan[]>([]);

  const samplePlans: LeadershipPlan[] = [
    {
      id: 'nonprofit-leadership',
      name: 'Nonprofit Executive Leadership Development',
      description: 'Comprehensive leadership development plan for nonprofit executives focusing on strategic thinking, team leadership, and organizational transformation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'active',
      goals: [
        'Develop strategic vision and long-term planning capabilities',
        'Enhance team leadership and communication skills',
        'Build expertise in change management and organizational development',
        'Strengthen financial management and fundraising leadership',
        'Cultivate community engagement and stakeholder relationship skills'
      ],
      skills: [
        {
          id: 'strategic-thinking',
          name: 'Strategic Thinking & Planning',
          category: 'strategic',
          description: 'Ability to develop long-term vision, analyze trends, and create strategic plans',
          currentLevel: 3,
          targetLevel: 5,
          priority: 'high',
          developmentActions: [
            {
              id: 'strategy-course',
              title: 'Strategic Planning for Nonprofits Course',
              type: 'training',
              description: 'Complete online course on nonprofit strategic planning',
              timeCommitment: 20,
              deadline: new Date('2024-03-31'),
              status: 'completed',
              outcome: 'Developed new strategic framework for organization'
            },
            {
              id: 'strategic-project',
              title: 'Lead 3-Year Strategic Plan Development',
              type: 'project',
              description: 'Lead organizational strategic planning process',
              timeCommitment: 40,
              deadline: new Date('2024-06-30'),
              status: 'in_progress'
            }
          ],
          assessments: [
            {
              id: 'baseline-strategy',
              date: new Date('2024-01-15'),
              assessor: 'Board Chair',
              type: 'supervisor',
              score: 3,
              strengths: ['Good analytical skills', 'Understands organizational context'],
              improvementAreas: ['Long-term visioning', 'Environmental scanning'],
              notes: 'Shows promise but needs to think beyond current challenges'
            }
          ],
          resources: [
            {
              id: 'good-to-great-book',
              title: 'Good to Great and the Social Sectors',
              type: 'book',
              description: 'Jim Collins\' framework for excellence in nonprofits',
              duration: 8,
              provider: 'HarperBusiness',
              completed: true,
              rating: 5,
              notes: 'Excellent insights on building sustainable nonprofit excellence'
            },
            {
              id: 'strategy-workshop',
              title: 'BoardSource Strategic Planning Workshop',
              type: 'workshop',
              description: 'Interactive workshop on nonprofit strategic planning',
              duration: 16,
              provider: 'BoardSource',
              completed: false
            }
          ]
        },
        {
          id: 'team-leadership',
          name: 'Team Leadership & Communication',
          category: 'interpersonal',
          description: 'Skills in leading teams, communicating effectively, and inspiring others',
          currentLevel: 4,
          targetLevel: 5,
          priority: 'high',
          developmentActions: [
            {
              id: 'coaching-training',
              title: 'Leadership Coaching Certification',
              type: 'training',
              description: 'Develop coaching skills for team leadership',
              timeCommitment: 30,
              deadline: new Date('2024-08-31'),
              status: 'in_progress'
            }
          ],
          assessments: [
            {
              id: '360-feedback',
              date: new Date('2024-02-01'),
              assessor: 'Team Members',
              type: '360_feedback',
              score: 4,
              strengths: ['Clear communicator', 'Supportive manager', 'Open to feedback'],
              improvementAreas: ['Delegation', 'Conflict resolution'],
              notes: 'Team appreciates collaborative approach but wants more empowerment'
            }
          ],
          resources: [
            {
              id: 'crucial-conversations',
              title: 'Crucial Conversations',
              type: 'book',
              description: 'Tools for talking when stakes are high',
              duration: 6,
              provider: 'McGraw-Hill',
              completed: true,
              rating: 4
            }
          ]
        },
        {
          id: 'change-management',
          name: 'Change Management',
          category: 'adaptive',
          description: 'Leading organizational change and transformation initiatives',
          currentLevel: 2,
          targetLevel: 4,
          priority: 'medium',
          developmentActions: [
            {
              id: 'change-certification',
              title: 'Prosci Change Management Certification',
              type: 'training',
              description: 'Professional certification in change management methodology',
              timeCommitment: 24,
              deadline: new Date('2024-09-30'),
              status: 'not_started'
            }
          ],
          assessments: [],
          resources: [
            {
              id: 'switch-book',
              title: 'Switch: How to Change Things When Change Is Hard',
              type: 'book',
              description: 'Heath brothers\' approach to leading change',
              duration: 7,
              provider: 'Broadway Books',
              completed: false
            }
          ]
        }
      ],
      mentors: [
        {
          id: 'senior-ed',
          name: 'Maria Rodriguez',
          role: 'Executive Director, Community Foundation',
          expertise: ['Strategic Planning', 'Board Relations', 'Fundraising'],
          meetingFrequency: 'monthly',
          contactInfo: 'maria.rodriguez@foundation.org',
          lastMeeting: new Date('2024-06-15'),
          nextMeeting: new Date('2024-07-15')
        },
        {
          id: 'board-chair',
          name: 'Dr. James Wilson',
          role: 'Retired CEO, Current Board Chair',
          expertise: ['Leadership', 'Organizational Development', 'Financial Management'],
          meetingFrequency: 'biweekly',
          contactInfo: 'j.wilson@email.com',
          lastMeeting: new Date('2024-06-20'),
          nextMeeting: new Date('2024-07-04')
        }
      ],
      milestones: [
        {
          id: 'q1-assessment',
          title: 'Complete Q1 Leadership Assessment',
          description: 'Baseline 360-degree feedback assessment',
          targetDate: new Date('2024-03-31'),
          status: 'completed',
          evidence: ['360 feedback report', 'Self-assessment results'],
          reflection: 'Identified key strengths in communication and areas for growth in strategic thinking'
        },
        {
          id: 'strategic-plan',
          title: 'Launch New Strategic Plan',
          description: 'Complete and launch organization\'s 3-year strategic plan',
          targetDate: new Date('2024-06-30'),
          status: 'in_progress',
          evidence: [],
          reflection: ''
        },
        {
          id: 'team-effectiveness',
          title: 'Improve Team Effectiveness Score',
          description: 'Increase team effectiveness rating from 3.5 to 4.2',
          targetDate: new Date('2024-09-30'),
          status: 'pending',
          evidence: [],
          reflection: ''
        }
      ]
    }
  ];

  React.useEffect(() => {
    if (plans.length === 0) {
      setPlans(samplePlans);
    }
  }, []);

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'strategic': return 'text-purple-600 bg-purple-100';
      case 'interpersonal': return 'text-blue-600 bg-blue-100';
      case 'operational': return 'text-green-600 bg-green-100';
      case 'adaptive': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'course': return Play;
      case 'workshop': return Users;
      case 'video': return Play;
      default: return BookOpen;
    }
  };

  const calculateSkillProgress = (skill: LeadershipSkill) => {
    return ((skill.currentLevel - 1) / (skill.targetLevel - 1)) * 100;
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${hours * 60}min`;
    return `${hours}h`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Leadership Development Center</CardTitle>
              <CardDescription>
                Personalized leadership development planning and progress tracking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentPlan ? (
            /* Plan Overview */
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{plans.length}</div>
                    <div className="text-sm text-gray-600">Development Plans</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {plans.reduce((sum, p) => sum + p.skills.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Skills Tracked</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {plans.reduce((sum, p) => sum + p.mentors.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Active Mentors</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {plans.reduce((sum, p) => 
                        sum + p.milestones.filter(m => m.status === 'completed').length, 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Completed Milestones</div>
                  </CardContent>
                </Card>
              </div>

              {/* Development Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leadership Development Plans</CardTitle>
                  <CardDescription>Your active and completed development journeys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map((plan) => {
                    const completedSkills = plan.skills.filter(s => s.currentLevel >= s.targetLevel).length;
                    const completedMilestones = plan.milestones.filter(m => m.status === 'completed').length;
                    
                    return (
                      <div key={plan.id} 
                           className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                           onClick={() => setCurrentPlan(plan)}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{plan.name}</h4>
                            <p className="text-gray-600">{plan.description}</p>
                          </div>
                          <Badge className={getStatusColor(plan.status)} variant="secondary">
                            {plan.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">{plan.skills.length}</div>
                            <div className="text-xs text-purple-600">Skills</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">{completedSkills}</div>
                            <div className="text-xs text-green-600">Mastered</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{plan.mentors.length}</div>
                            <div className="text-xs text-blue-600">Mentors</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <div className="text-lg font-bold text-orange-600">{completedMilestones}</div>
                            <div className="text-xs text-orange-600">Milestones</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {plan.startDate.toLocaleDateString()} - {plan.endDate.toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="outline">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Plan Detail */
            <div className="space-y-6">
              {/* Plan Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentPlan.name}</CardTitle>
                      <CardDescription>{currentPlan.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPlan(null)}>
                      Back to Plans
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b">
                {[
                  { id: 'overview', label: 'Overview', icon: Target },
                  { id: 'skills', label: 'Skills', icon: TrendingUp },
                  { id: 'resources', label: 'Resources', icon: BookOpen },
                  { id: 'mentoring', label: 'Mentoring', icon: Users },
                  { id: 'assessment', label: 'Assessment', icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Development Goals */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Development Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentPlan.goals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Upcoming Milestones */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentPlan.milestones
                        .filter(m => m.status !== 'completed')
                        .slice(0, 3)
                        .map((milestone) => (
                          <div key={milestone.id} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{milestone.title}</h5>
                              <Badge className={getStatusColor(milestone.status)} variant="secondary">
                                {milestone.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {milestone.targetDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  {currentPlan.skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{skill.name}</CardTitle>
                            <CardDescription>{skill.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getSkillCategoryColor(skill.category)} variant="secondary">
                              {skill.category}
                            </Badge>
                            <Badge className={getPriorityColor(skill.priority)} variant="secondary">
                              {skill.priority} priority
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Progress</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>Current Level: {skill.currentLevel}/5</span>
                                <span>Target Level: {skill.targetLevel}/5</span>
                              </div>
                              <Progress value={calculateSkillProgress(skill)} className="h-3" />
                              <div className="text-xs text-gray-600">
                                {Math.round(calculateSkillProgress(skill))}% to target
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Development Actions</h4>
                            <div className="space-y-2">
                              {skill.developmentActions.slice(0, 3).map((action) => (
                                <div key={action.id} className="flex items-center gap-2 text-sm">
                                  <Badge className={getStatusColor(action.status)} variant="secondary">
                                    {action.status.replace('_', ' ')}
                                  </Badge>
                                  <span>{action.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.skills.flatMap(skill => skill.resources).map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    
                    return (
                      <Card key={resource.id} className={resource.completed ? 'bg-green-50' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{resource.title}</h4>
                                {resource.completed && (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <span>📚 {resource.provider}</span>
                                <span>⏱️ {formatDuration(resource.duration)}</span>
                                <Badge variant="outline">{resource.type}</Badge>
                              </div>
                              {resource.rating && (
                                <div className="flex items-center gap-2">
                                  <div className="flex">{renderStars(resource.rating)}</div>
                                  <span className="text-xs text-gray-600">({resource.rating}/5)</span>
                                </div>
                              )}
                              {resource.notes && (
                                <p className="text-xs text-gray-600 mt-2 italic">"{resource.notes}"</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {activeTab === 'mentoring' && (
                <div className="space-y-4">
                  {currentPlan.mentors.map((mentor) => (
                    <Card key={mentor.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{mentor.name}</h4>
                            <p className="text-gray-600">{mentor.role}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Expertise Areas:</h5>
                            <div className="flex flex-wrap gap-1">
                              {mentor.expertise.map((area, index) => (
                                <Badge key={index} variant="outline">{area}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Meeting Frequency:</span>
                              <span className="capitalize">{mentor.meetingFrequency}</span>
                            </div>
                            {mentor.lastMeeting && (
                              <div className="flex justify-between">
                                <span>Last Meeting:</span>
                                <span>{mentor.lastMeeting.toLocaleDateString()}</span>
                              </div>
                            )}
                            {mentor.nextMeeting && (
                              <div className="flex justify-between">
                                <span>Next Meeting:</span>
                                <span>{mentor.nextMeeting.toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-4">
                  {currentPlan.skills.flatMap(skill => 
                    skill.assessments.map(assessment => ({ skill, assessment }))
                  ).map(({ skill, assessment }, index) => (
                    <Card key={`${skill.id}-${assessment.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{skill.name} Assessment</h4>
                            <p className="text-sm text-gray-600">
                              By {assessment.assessor} • {assessment.date.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{assessment.score}/5</div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-green-700 mb-2">Strengths:</h5>
                            <ul className="space-y-1">
                              {assessment.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2">Areas for Improvement:</h5>
                            <ul className="space-y-1">
                              {assessment.improvementAreas.map((area, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Lightbulb className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span>{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {assessment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <h5 className="font-medium mb-1">Notes:</h5>
                            <p className="text-sm text-gray-700">{assessment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leadership Development Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Leadership Development Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Development:</h4>
                  <ul className="space-y-1">
                    <li>• Set specific, measurable leadership goals</li>
                    <li>• Seek feedback from multiple perspectives</li>
                    <li>• Practice new skills in low-risk environments</li>
                    <li>• Reflect regularly on learning and growth</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accelerated Learning:</h4>
                  <ul className="space-y-1">
                    <li>• Find mentors who challenge and support you</li>
                    <li>• Take on stretch assignments and projects</li>
                    <li>• Learn from both successes and failures</li>
                    <li>• Build diverse leadership experiences</li>
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

export default AlexLeadershipDevelopment;