import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, Clock, Target, Brain, Award, AlertCircle, 
  CheckCircle2, Star, Zap, BookOpen, Users, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { learningAnalyticsService, type ProgressMetrics, type PerformanceInsight } from '@/services/learningAnalyticsService';
// import { useUser } from '@supabase/auth-helpers-react';

interface ProgressDashboardProps {
  className?: string;
  compact?: boolean;
}

const COLORS = {
  primary: '#7C3AED',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
};

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const user = { id: 'demo-user' }; // Mock user for now
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id, selectedTimeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await learningAnalyticsService.getUserAnalytics(user?.id || '');
      setAnalytics(analyticsData);
      setInsights(analyticsData.insights);

      // Generate effectiveness report
      const endDate = new Date();
      const startDate = new Date();
      if (selectedTimeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (selectedTimeRange === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      const effectivenessReport = await learningAnalyticsService.generateEffectivenessReport(
        user?.id || '', 
        { start: startDate, end: endDate }
      );
      
      setAnalytics((prev: any) => ({
        ...prev,
        effectiveness: effectivenessReport
      }));
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className="ml-3 text-gray-600">Loading your progress...</span>
      </div>
    );
  }

  const skillMasteryData = analytics?.progress?.map((p: ProgressMetrics) => ({
    name: p.skillArea.replace(' ', '\n'),
    mastery: p.masteryScore,
    level: p.currentLevel
  })) || [];

  const engagementData = [
    { name: 'Mon', engagement: 8.2, timeSpent: 45 },
    { name: 'Tue', engagement: 7.8, timeSpent: 38 },
    { name: 'Wed', engagement: 9.1, timeSpent: 52 },
    { name: 'Thu', engagement: 8.5, timeSpent: 41 },
    { name: 'Fri', engagement: 7.9, timeSpent: 35 },
    { name: 'Sat', engagement: 8.8, timeSpent: 48 },
    { name: 'Sun', engagement: 9.3, timeSpent: 55 }
  ];

  const learningStyleData = analytics?.behaviorAnalytics ? [
    { name: 'Visual', value: analytics.behaviorAnalytics.learningStyle.visual * 100, color: COLORS.primary },
    { name: 'Auditory', value: analytics.behaviorAnalytics.learningStyle.auditory * 100, color: COLORS.secondary },
    { name: 'Kinesthetic', value: analytics.behaviorAnalytics.learningStyle.kinesthetic * 100, color: COLORS.success },
    { name: 'Reading/Writing', value: analytics.behaviorAnalytics.learningStyle.readingWriting * 100, color: COLORS.info }
  ] : [];

  const progressStats = [
    {
      title: 'Overall Effectiveness',
      value: `${Math.round((analytics?.effectiveness?.overallEffectiveness || 0) * 100)}%`,
      icon: TrendingUp,
      color: COLORS.success,
      trend: '+12%'
    },
    {
      title: 'Time Efficiency',
      value: `${Math.round((analytics?.effectiveness?.timeEfficiency || 0) * 100)}%`,
      icon: Clock,
      color: COLORS.info,
      trend: '+8%'
    },
    {
      title: 'Engagement Level',
      value: `${Math.round((analytics?.effectiveness?.engagementLevel || 0) * 100)}%`,
      icon: Zap,
      color: COLORS.primary,
      trend: '+15%'
    },
    {
      title: 'Retention Rate',
      value: `${Math.round((analytics?.effectiveness?.retentionRate || 0) * 100)}%`,
      icon: Brain,
      color: COLORS.secondary,
      trend: '+5%'
    }
  ];

  const InsightCard = ({ insight }: { insight: PerformanceInsight }) => {
    const getInsightIcon = (type: string) => {
      switch (type) {
        case 'strength': return <Star className="w-5 h-5 text-yellow-500" />;
        case 'improvement': return <AlertCircle className="w-5 h-5 text-blue-500" />;
        case 'recommendation': return <Target className="w-5 h-5 text-purple-500" />;
        case 'milestone': return <Award className="w-5 h-5 text-green-500" />;
        default: return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'critical': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getInsightIcon(insight.type)}
            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
          </div>
          <Badge className={cn('text-xs', getPriorityColor(insight.priority))}>
            {insight.priority}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
        
        {insight.actionableSteps.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Action Steps:
            </span>
            <ul className="space-y-1">
              {insight.actionableSteps.map((step, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    );
  };

  if (compact) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {progressStats.slice(0, 2).map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
            </Card>
          ))}
        </div>

        {insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <InsightCard insight={insights[0]} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Learning Analytics</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === 'all' ? 'All Time' : `Last ${range}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">{stat.trend} from last period</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Mastery Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skill Mastery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillMasteryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="mastery" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Weekly Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke={COLORS.primary} 
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Style Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Learning Style Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={learningStyleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                >
                  {learningStyleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Path Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Path Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.learningPath?.recommendedNextStages?.map((stage: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{stage.replace('-', ' ').toUpperCase()}</span>
                  <Badge variant="outline">Recommended</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Performance Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effectiveness Recommendations */}
      {analytics?.effectiveness?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.effectiveness.recommendations.map((rec: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressDashboard;