import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Mic, 
  Heart, 
  Target, 
  BarChart3, 
  Calendar,
  Users,
  Star,
  Volume2,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface VoiceMetrics {
  authenticity: number;
  confidence: number;
  clarity: number;
  engagement: number;
  storytelling: number;
  emotional_range: number;
}

interface SessionData {
  date: string;
  duration: number;
  type: string;
  metrics: VoiceMetrics;
  improvements: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

const SofiaVoiceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const currentMetrics: VoiceMetrics = {
    authenticity: 87,
    confidence: 73,
    clarity: 91,
    engagement: 82,
    storytelling: 88,
    emotional_range: 75
  };

  const sessionHistory: SessionData[] = [
    {
      date: '2025-01-05',
      duration: 8,
      type: 'Authenticity Training',
      metrics: { authenticity: 87, confidence: 73, clarity: 91, engagement: 82, storytelling: 88, emotional_range: 75 },
      improvements: ['Increased vulnerability by 12%', 'Better emotional expression']
    },
    {
      date: '2025-01-03',
      duration: 6,
      type: 'Voice Recording',
      metrics: { authenticity: 84, confidence: 70, clarity: 89, engagement: 79, storytelling: 85, emotional_range: 72 },
      improvements: ['Improved pacing', 'More specific details']
    },
    {
      date: '2025-01-01',
      duration: 5,
      type: 'Story Practice',
      metrics: { authenticity: 81, confidence: 68, clarity: 87, engagement: 76, storytelling: 82, emotional_range: 69 },
      improvements: ['Better story structure', 'Increased confidence']
    },
    {
      date: '2024-12-30',
      duration: 7,
      type: 'Breathing Exercise',
      metrics: { authenticity: 78, confidence: 65, clarity: 85, engagement: 73, storytelling: 79, emotional_range: 66 },
      improvements: ['Stronger breath support', 'Clearer articulation']
    },
    {
      date: '2024-12-28',
      duration: 4,
      type: 'Voice Coach',
      metrics: { authenticity: 75, confidence: 62, clarity: 83, engagement: 70, storytelling: 76, emotional_range: 63 },
      improvements: ['First vulnerability exercise', 'Baseline established']
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-story',
      title: 'First Story Shared',
      description: 'Completed your first authentic story',
      icon: '📖',
      unlocked: true,
      unlockedDate: new Date('2024-12-28')
    },
    {
      id: 'vulnerability-breakthrough',
      title: 'Vulnerability Breakthrough',
      description: 'Achieved 80%+ authenticity score',
      icon: '💖',
      unlocked: true,
      unlockedDate: new Date('2025-01-01')
    },
    {
      id: 'clarity-master',
      title: 'Clarity Master',
      description: 'Maintained 90%+ clarity for a week',
      icon: '🎯',
      unlocked: true,
      unlockedDate: new Date('2025-01-03')
    },
    {
      id: 'storytelling-pro',
      title: 'Storytelling Pro',
      description: 'Completed 10 storytelling sessions',
      icon: '🌟',
      unlocked: false
    },
    {
      id: 'confident-voice',
      title: 'Confident Voice',
      description: 'Reach 85% confidence score',
      icon: '💪',
      unlocked: false
    },
    {
      id: 'engagement-expert',
      title: 'Engagement Expert',
      description: 'Achieve 90%+ engagement consistently',
      icon: '🎪',
      unlocked: false
    }
  ];

  const getMetricChange = (metric: keyof VoiceMetrics) => {
    if (sessionHistory.length < 2) return 0;
    const current = sessionHistory[0].metrics[metric];
    const previous = sessionHistory[1].metrics[metric];
    return current - previous;
  };

  const getMetricTrend = (metric: keyof VoiceMetrics) => {
    const change = getMetricChange(metric);
    if (change > 0) return { color: 'text-green-600', icon: '↗️' };
    if (change < 0) return { color: 'text-red-600', icon: '↘️' };
    return { color: 'text-gray-600', icon: '→' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const calculateOverallProgress = () => {
    const scores = Object.values(currentMetrics);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getTotalPracticeTime = () => {
    return sessionHistory.reduce((total, session) => total + session.duration, 0);
  };

  const getStreakDays = () => {
    // Simplified streak calculation
    return 5;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Voice Development Analytics</CardTitle>
                <CardDescription>
                  Track your storytelling voice progress and development over time
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{calculateOverallProgress()}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
                <Progress value={calculateOverallProgress()} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{getTotalPracticeTime()}min</div>
                <div className="text-sm text-gray-600">Total Practice</div>
                <div className="flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-xs text-gray-500">This month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{getStreakDays()}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
                <div className="flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-gray-500">Keep it up!</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{sessionHistory.length}</div>
                <div className="text-sm text-gray-600">Sessions</div>
                <div className="flex items-center justify-center mt-1">
                  <Mic className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voice Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Development Metrics</CardTitle>
              <CardDescription>Your current scores across key voice development areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(currentMetrics).map(([key, value]) => {
                  const trend = getMetricTrend(key as keyof VoiceMetrics);
                  const change = getMetricChange(key as keyof VoiceMetrics);
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                            {value}%
                          </span>
                          <span className={`text-xs ${trend.color}`}>
                            {change !== 0 && `${change > 0 ? '+' : ''}${change}`} {trend.icon}
                          </span>
                        </div>
                      </div>
                      <Progress value={value} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <CardDescription>Your voice development journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionHistory.slice(0, 5).map((session, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{session.type}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} • {session.duration} min
                        </p>
                      </div>
                      <Badge variant="outline">
                        Session {sessionHistory.length - index}
                      </Badge>
                    </div>
                    
                    {/* Session Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(session.metrics.authenticity)}`}>
                          {session.metrics.authenticity}%
                        </div>
                        <div className="text-xs text-gray-600">Authenticity</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(session.metrics.confidence)}`}>
                          {session.metrics.confidence}%
                        </div>
                        <div className="text-xs text-gray-600">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(session.metrics.storytelling)}`}>
                          {session.metrics.storytelling}%
                        </div>
                        <div className="text-xs text-gray-600">Storytelling</div>
                      </div>
                    </div>

                    {/* Improvements */}
                    {session.improvements.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-800 mb-1">Key Improvements:</h5>
                        <ul className="space-y-1">
                          {session.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Voice Development Achievements
              </CardTitle>
              <CardDescription>Milestones in your authentic voice journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h4 className={`font-semibold ${
                        achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="mt-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Unlocked {achievement.unlockedDate.toLocaleDateString()}
                          </Badge>
                        </div>
                      )}
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-gray-500">
                            🔒 Locked
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Development Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Sofia's Progress Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">Accelerate Your Growth:</h4>
                  <ul className="space-y-1">
                    <li>• Practice daily, even if just for 5 minutes</li>
                    <li>• Record yourself to track vocal improvements</li>
                    <li>• Share stories with trusted friends for feedback</li>
                    <li>• Focus on progress, not perfection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Next Level Goals:</h4>
                  <ul className="space-y-1">
                    <li>• Reach 85% confidence score consistently</li>
                    <li>• Complete 10 total storytelling sessions</li>
                    <li>• Maintain 90%+ clarity for two weeks</li>
                    <li>• Help someone else find their voice</li>
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

export default SofiaVoiceAnalytics;