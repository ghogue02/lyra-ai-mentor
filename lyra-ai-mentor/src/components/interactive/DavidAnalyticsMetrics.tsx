import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Clock,
  Brain,
  Zap,
  CheckCircle2,
  Award,
  Star,
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react';

interface SkillMetric {
  category: 'visualization' | 'analysis' | 'storytelling' | 'presentation';
  currentLevel: number;
  targetLevel: number;
  practiceHours: number;
  improvementRate: number;
  strengths: string[];
  areas_for_growth: string[];
  recentAchievements: string[];
}

interface LearningSession {
  id: string;
  date: Date;
  type: 'lesson' | 'practice' | 'project' | 'feedback';
  topic: string;
  duration: number;
  score: number;
  skills_practiced: string[];
  insights_gained: string[];
}

interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

const DavidAnalyticsMetrics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const skillMetrics: SkillMetric[] = [
    {
      category: 'visualization',
      currentLevel: 78,
      targetLevel: 90,
      practiceHours: 24,
      improvementRate: 8,
      strengths: ['Chart type selection', 'Color usage', 'Data clarity'],
      areas_for_growth: ['Interactive dashboards', 'Complex data sets'],
      recentAchievements: ['Mastered quick chart creation', 'Improved design consistency']
    },
    {
      category: 'analysis',
      currentLevel: 82,
      targetLevel: 85,
      practiceHours: 31,
      improvementRate: 12,
      strengths: ['Pattern recognition', 'Statistical thinking', 'Data validation'],
      areas_for_growth: ['Advanced statistics', 'Predictive modeling'],
      recentAchievements: ['Completed insight validation training', 'Improved analysis speed by 40%']
    },
    {
      category: 'storytelling',
      currentLevel: 71,
      targetLevel: 80,
      practiceHours: 18,
      improvementRate: 15,
      strengths: ['Narrative structure', 'Audience adaptation'],
      areas_for_growth: ['Emotional connection', 'Visual storytelling'],
      recentAchievements: ['Created first data story presentation', 'Received positive feedback from team']
    },
    {
      category: 'presentation',
      currentLevel: 65,
      targetLevel: 75,
      practiceHours: 12,
      improvementRate: 6,
      strengths: ['Data clarity', 'Preparation thoroughness'],
      areas_for_growth: ['Confidence building', 'Handling questions', 'Voice modulation'],
      recentAchievements: ['Completed first board presentation', 'Reduced nervous habits by 50%']
    }
  ];

  const recentSessions: LearningSession[] = [
    {
      id: '1',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'practice',
      topic: 'Quick Chart Generation',
      duration: 25,
      score: 88,
      skills_practiced: ['Chart selection', 'Data input', 'Design choices'],
      insights_gained: ['Color schemes impact readability', 'Simple charts often work best']
    },
    {
      id: '2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'lesson',
      topic: 'Data Story Structure',
      duration: 45,
      score: 92,
      skills_practiced: ['Narrative building', 'Audience analysis', 'Message clarity'],
      insights_gained: ['Context is crucial for engagement', 'End with actionable insights']
    },
    {
      id: '3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'project',
      topic: 'Nonprofit Impact Analysis',
      duration: 120,
      score: 85,
      skills_practiced: ['Data analysis', 'Insight extraction', 'Report writing'],
      insights_gained: ['Stakeholder perspectives matter', 'Visual aids enhance understanding']
    },
    {
      id: '4',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'feedback',
      topic: 'Presentation Skills Review',
      duration: 30,
      score: 79,
      skills_practiced: ['Voice coaching', 'Confidence building', 'Q&A handling'],
      insights_gained: ['Practice reduces anxiety', 'Prepare for common objections']
    }
  ];

  const performanceGoals: PerformanceGoal[] = [
    {
      id: 'viz-mastery',
      title: 'Visualization Mastery',
      description: 'Reach 90% proficiency in data visualization skills',
      category: 'visualization',
      target_value: 90,
      current_value: 78,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'on_track'
    },
    {
      id: 'story-confidence',
      title: 'Storytelling Confidence',
      description: 'Build confidence in data storytelling presentations',
      category: 'storytelling',
      target_value: 80,
      current_value: 71,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      status: 'on_track'
    },
    {
      id: 'presentation-skills',
      title: 'Presentation Excellence',
      description: 'Deliver confident, engaging data presentations',
      category: 'presentation',
      target_value: 75,
      current_value: 65,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'at_risk'
    },
    {
      id: 'analysis-speed',
      title: 'Rapid Analysis',
      description: 'Improve analysis speed while maintaining quality',
      category: 'analysis',
      target_value: 85,
      current_value: 82,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      priority: 'low',
      status: 'on_track'
    }
  ];

  const getOverallProgress = () => {
    const totalCurrent = skillMetrics.reduce((sum, skill) => sum + skill.currentLevel, 0);
    const totalTarget = skillMetrics.reduce((sum, skill) => sum + skill.targetLevel, 0);
    return Math.round((totalCurrent / totalTarget) * 100);
  };

  const getTotalPracticeHours = () => {
    return skillMetrics.reduce((sum, skill) => sum + skill.practiceHours, 0);
  };

  const getAverageScore = () => {
    if (recentSessions.length === 0) return 0;
    const totalScore = recentSessions.reduce((sum, session) => sum + session.score, 0);
    return Math.round(totalScore / recentSessions.length);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visualization': return BarChart3;
      case 'analysis': return Brain;
      case 'storytelling': return Users;
      case 'presentation': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visualization': return 'text-blue-600 bg-blue-100';
      case 'analysis': return 'text-green-600 bg-green-100';
      case 'storytelling': return 'text-purple-600 bg-purple-100';
      case 'presentation': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return Brain;
      case 'practice': return Target;
      case 'project': return BarChart3;
      case 'feedback': return Users;
      default: return CheckCircle2;
    }
  };

  const exportMetrics = () => {
    const metricsData = {
      skillMetrics,
      recentSessions,
      performanceGoals,
      summary: {
        overallProgress: getOverallProgress(),
        totalPracticeHours: getTotalPracticeHours(),
        averageScore: getAverageScore(),
        exportDate: new Date().toISOString()
      }
    };
    
    navigator.clipboard.writeText(JSON.stringify(metricsData, null, 2));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Data Storytelling Analytics</CardTitle>
                <CardDescription>
                  Track your progress and improvement across all data skills
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportMetrics}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{getOverallProgress()}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
                <Progress value={getOverallProgress()} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{getTotalPracticeHours()}h</div>
                <div className="text-sm text-gray-600">Practice Hours</div>
                <div className="flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-xs text-gray-500">This month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{getAverageScore()}%</div>
                <div className="text-sm text-gray-600">Avg Score</div>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-xs text-gray-500">Recent sessions</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{recentSessions.length}</div>
                <div className="text-sm text-gray-600">Sessions</div>
                <div className="flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-xs text-gray-500">This week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Development Progress</CardTitle>
              <CardDescription>Your proficiency across key data storytelling areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {skillMetrics.map((skill) => {
                  const Icon = getCategoryIcon(skill.category);
                  const progress = (skill.currentLevel / skill.targetLevel) * 100;
                  
                  return (
                    <div key={skill.category} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(skill.category)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold capitalize">{skill.category}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{skill.currentLevel}/{skill.targetLevel}</span>
                            <Badge variant="outline" className="text-xs">
                              +{skill.improvementRate}% this month
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progress} className="h-3" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-green-700 mb-1">Strengths:</h5>
                          <ul className="space-y-1">
                            {skill.strengths.slice(0, 2).map((strength, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-yellow-700 mb-1">Growth Areas:</h5>
                          <ul className="space-y-1">
                            {skill.areas_for_growth.slice(0, 2).map((area, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <Target className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">{area}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {skill.recentAchievements.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <h5 className="text-xs font-medium text-blue-800 mb-1">Recent Achievements:</h5>
                          <ul className="space-y-1">
                            {skill.recentAchievements.slice(0, 2).map((achievement, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <Award className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-blue-700">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Goals</CardTitle>
              <CardDescription>Track progress toward your learning objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceGoals.map((goal) => {
                  const progress = (goal.current_value / goal.target_value) * 100;
                  const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(goal.priority)} variant="outline">
                            {goal.priority}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)} variant="secondary">
                            {goal.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {goal.current_value}/{goal.target_value} ({Math.round(progress)}%)
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{daysLeft} days left</span>
                          </div>
                          <span className="capitalize">{goal.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Learning Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Learning Sessions</CardTitle>
              <CardDescription>Your latest practice and learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => {
                  const Icon = getSessionTypeIcon(session.type);
                  
                  return (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{session.topic}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge variant="outline" className="text-xs capitalize">
                                {session.type}
                              </Badge>
                              <span>{session.duration} min</span>
                              <span>•</span>
                              <span>{session.date.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            session.score >= 90 ? 'text-green-600' : 
                            session.score >= 80 ? 'text-blue-600' : 
                            session.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {session.score}%
                          </div>
                          <div className="text-xs text-gray-600">Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium mb-1">Skills Practiced:</h5>
                          <div className="flex flex-wrap gap-1">
                            {session.skills_practiced.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Key Insights:</h5>
                          <ul className="space-y-1">
                            {session.insights_gained.slice(0, 2).map((insight, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <Brain className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Growth Insights */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">David's Growth Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">This Month's Highlights:</h4>
                  <ul className="space-y-1">
                    <li>• Visualization skills improved by 8%</li>
                    <li>• Analysis speed increased 40%</li>
                    <li>• Completed 85 practice hours</li>
                    <li>• Achieved 3 major milestones</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Focus Areas:</h4>
                  <ul className="space-y-1">
                    <li>• Presentation confidence building</li>
                    <li>• Advanced storytelling techniques</li>
                    <li>• Interactive dashboard creation</li>
                    <li>• Q&A handling skills</li>
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

export default DavidAnalyticsMetrics;