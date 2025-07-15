import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Users,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tutorialAnalytics, TutorialInsight } from '@/services/tutorialAnalytics';
import { tutorials } from '@/data/tutorials';
import { useTutorial } from '@/contexts/TutorialContext';
import { useAuth } from '@/contexts/AuthContext';

export const TutorialDashboard: React.FC = () => {
  const { user } = useAuth();
  const { progress, getCompletionPercentage, startTutorial } = useTutorial();
  const [insights, setInsights] = useState<TutorialInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      if (user) {
        const data = await tutorialAnalytics.getTutorialInsights(user.id);
        setInsights(data);
        setLoading(false);
      }
    };

    loadInsights();
  }, [user]);

  const completionPercentage = getCompletionPercentage();
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const inProgressCount = Object.values(progress).filter(p => !p.completed && !p.skipped).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{Math.round(completionPercentage)}%</p>
                  <Progress value={completionPercentage} className="w-24 h-2 mt-2" />
                </div>
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tutorials Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    of {tutorials.length} total
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. Time per Tutorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {insights ? Math.round(insights.averageTimeSpent / 60) : 0}m
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    per tutorial
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Engagement Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {insights ? insights.userEngagementScore : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    out of 100
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* In Progress Tutorials */}
      {inProgressCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(progress)
                .filter(([_, p]) => !p.completed && !p.skipped)
                .map(([tutorialId, tutorialProgress]) => {
                  const tutorial = tutorials.find(t => t.id === tutorialId);
                  if (!tutorial) return null;

                  const progressPercentage = ((tutorialProgress.currentStep + 1) / tutorial.steps.length) * 100;

                  return (
                    <motion.div
                      key={tutorialId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {tutorial.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <Progress value={progressPercentage} className="flex-1 h-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Step {tutorialProgress.currentStep + 1} of {tutorial.steps.length}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => startTutorial(tutorialId)}
                        size="sm"
                        variant="outline"
                        className="ml-4"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Most Popular Tutorials */}
      {insights && insights.mostPopularTutorials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Popular Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.mostPopularTutorials.slice(0, 5).map((tutorialId, index) => {
                const tutorial = tutorials.find(t => t.id === tutorialId);
                if (!tutorial) return null;

                const isCompleted = progress[tutorialId]?.completed;

                return (
                  <div
                    key={tutorialId}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tutorial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tutorial.estimatedTime} min • {tutorial.steps.length} steps
                        </p>
                      </div>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Completed
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => startTutorial(tutorialId)}
                        size="sm"
                        variant="ghost"
                      >
                        Start
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* First Tutorial */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: completedCount >= 1 ? 1 : 0.5 }}
              className={`text-center p-4 rounded-lg ${
                completedCount >= 1
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <p className="text-sm font-medium">First Steps</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Complete 1 tutorial
              </p>
            </motion.div>

            {/* Half Way */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: completedCount >= Math.floor(tutorials.length / 2) ? 1 : 0.5 }}
              className={`text-center p-4 rounded-lg ${
                completedCount >= Math.floor(tutorials.length / 2)
                  ? 'bg-purple-100 dark:bg-purple-900'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">🌟</span>
              </div>
              <p className="text-sm font-medium">Halfway There</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Complete 50% of tutorials
              </p>
            </motion.div>

            {/* Speed Learner */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: insights && insights.averageTimeSpent < 300 ? 1 : 0.5 }}
              className={`text-center p-4 rounded-lg ${
                insights && insights.averageTimeSpent < 300
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <p className="text-sm font-medium">Speed Learner</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Avg time under 5 min
              </p>
            </motion.div>

            {/* Master */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: completedCount === tutorials.length ? 1 : 0.5 }}
              className={`text-center p-4 rounded-lg ${
                completedCount === tutorials.length
                  ? 'bg-yellow-100 dark:bg-yellow-900'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-600 flex items-center justify-center">
                <span className="text-white text-xl">👑</span>
              </div>
              <p className="text-sm font-medium">Tutorial Master</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Complete all tutorials
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};