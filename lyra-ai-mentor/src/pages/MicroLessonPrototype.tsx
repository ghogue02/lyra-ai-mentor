/**
 * MICRO-LESSON PROTOTYPE PAGE
 * First implementation of the micro-learning system with Maya's Email Subject Line Mastery
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Target, Trophy, Users, BarChart } from 'lucide-react';
import { MicroLessonPlayer } from '@/components/microlearning/MicroLessonPlayer';
import { SkillMasteryTracker } from '@/components/microlearning/SkillMasteryTracker';
import { MICRO_LEARNING_EXAMPLES } from '@/config/microLearningSystem';
import { UserAttempt, UserContext } from '@/config/microLearningSystem';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const MicroLessonPrototype: React.FC = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(MICRO_LEARNING_EXAMPLES[0]); // Maya's subject line mastery
  const [userContext, setUserContext] = useState<UserContext>({
    organizationName: 'Hope Gardens Community Center',
    organizationType: 'Community Development Nonprofit',
    role: 'Communications Coordinator',
    stakeholders: ['donors', 'volunteers', 'board-members', 'community-partners'],
    currentSkillLevel: {}
  });
  const [completedAttempts, setCompletedAttempts] = useState<UserAttempt[]>([]);
  const [skillsMastered, setSkillsMastered] = useState<Record<string, number>>({});
  const [showLessonPlayer, setShowLessonPlayer] = useState(false);
  const [showSkillTracker, setShowSkillTracker] = useState(false);

  const handleStartLesson = () => {
    setShowLessonPlayer(true);
    toast({
      title: "Starting Micro-Lesson",
      description: `Let's master: ${currentLesson.skillFocus}`,
      variant: "default"
    });
  };

  const handleLessonComplete = (attempt: UserAttempt) => {
    setCompletedAttempts(prev => [...prev, attempt]);
    
    if (attempt.passed) {
      toast({
        title: "Micro-Lesson Complete! 🎉",
        description: `You've mastered ${currentLesson.skillFocus} with a score of ${attempt.scores.overall}/10`,
        variant: "default"
      });
      
      // For this prototype, we'll return to the overview and show skill tracker
      setShowLessonPlayer(false);
      setShowSkillTracker(true);
    }
  };

  const handleSkillMastered = (skillFocus: string, score: number) => {
    setSkillsMastered(prev => ({
      ...prev,
      [skillFocus]: score
    }));
    
    toast({
      title: "Skill Mastered! 🏆",
      description: `You've achieved mastery in: ${skillFocus}`,
      variant: "default"
    });
  };

  const handleSkillSavedToToolkit = (skill: string, attempt: UserAttempt) => {
    toast({
      title: "Saved to Toolkit! 🛠️",
      description: `Your best ${skill} practice is now in your toolkit.`,
      variant: "default"
    });
  };

  const renderLessonOverview = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="absolute left-6 top-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Micro-Learning Prototype</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the new approach: Granular, AI-powered micro-lessons with scaffolded progression
        </p>
        <Badge variant="secondary" className="px-4 py-2">
          First Implementation: Email Subject Line Mastery
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Micro-Skills Focus</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Each lesson teaches ONE specific skill with laser focus
            </p>
            <Badge variant="outline">Single Skill Mastery</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-lg">AI-Powered Scoring</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Real-time AI evaluation with rubric-based feedback
            </p>
            <Badge variant="outline">7.5/10 to Pass</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Scaffolded Learning</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Progressive difficulty: Multiple choice → Free-form
            </p>
            <Badge variant="outline">4 Stages</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Current Lesson Details */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl text-purple-800">{currentLesson.title}</CardTitle>
              <p className="text-purple-600 mt-1">with {currentLesson.character}</p>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {currentLesson.scaffoldingStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Skill Focus:</h4>
            <p className="text-gray-700">{currentLesson.skillFocus}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Real-World Application:</h4>
            <p className="text-gray-700">{currentLesson.context.realWorldApplication}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">AI Integration:</h4>
            <p className="text-gray-700">{currentLesson.aiIntegration.userAIInteraction}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rubric Criteria:</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {currentLesson.rubric.criteria.map((criterion, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{criterion.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(criterion.weight * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{criterion.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleStartLesson}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              Start Micro-Lesson
              <Target className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Organization Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Organization:</h4>
              <p className="text-gray-700">{userContext.organizationName}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Type:</h4>
              <p className="text-gray-700">{userContext.organizationType}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Your Role:</h4>
              <p className="text-gray-700">{userContext.role}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Stakeholders:</h4>
              <div className="flex flex-wrap gap-1">
                {userContext.stakeholders?.map((stakeholder, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {stakeholder.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      {(completedAttempts.length > 0 || Object.keys(skillsMastered).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(skillsMastered).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills Mastered:</h4>
                <div className="space-y-2">
                  {Object.entries(skillsMastered).map(([skill, score]) => (
                    <div key={skill} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-green-800">{skill}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {score}/10 Mastered
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedAttempts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Attempts:</h4>
                <div className="space-y-2">
                  {completedAttempts.slice(-3).map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Attempt #{attempt.attempt}</span>
                        <p className="text-xs text-gray-600">{new Date(attempt.timestamp).toLocaleString()}</p>
                      </div>
                      <Badge variant={attempt.passed ? "default" : "secondary"}>
                        {attempt.scores.overall}/10 {attempt.passed ? 'Passed' : 'Retry'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation to Skill Tracker */}
      {(completedAttempts.length > 0 || Object.keys(skillsMastered).length > 0) && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">View Your Skill Progress</h3>
                <p className="text-blue-700">Track mastery levels and save your best work to the toolkit.</p>
              </div>
              <Button 
                onClick={() => setShowSkillTracker(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <BarChart className="h-4 w-4 mr-2" />
                View Skills Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (showLessonPlayer) {
    return (
      <MicroLessonPlayer
        lesson={currentLesson}
        userContext={userContext}
        onComplete={handleLessonComplete}
        onSkillMastered={handleSkillMastered}
      />
    );
  }

  if (showSkillTracker) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSkillTracker(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skills Dashboard</h1>
            <p className="text-gray-600">Track your micro-learning progress and mastery</p>
          </div>
        </div>
        
        <SkillMasteryTracker
          skillProgress={skillsMastered}
          recentAttempts={completedAttempts}
          onSaveToToolkit={handleSkillSavedToToolkit}
        />
      </div>
    );
  }

  return renderLessonOverview();
};

export default MicroLessonPrototype;