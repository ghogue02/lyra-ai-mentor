import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/contexts/ProgressContext';
import { Badge } from '@/services/gamificationService';
import { Trophy, Clock, Flame, Target, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const characterColors: Record<string, string> = {
  maya: 'bg-purple-100 text-purple-700 border-purple-300',
  david: 'bg-blue-100 text-blue-700 border-blue-300',
  rachel: 'bg-green-100 text-green-700 border-green-300',
  alex: 'bg-orange-100 text-orange-700 border-orange-300',
  sofia: 'bg-pink-100 text-pink-700 border-pink-300',
};

const BadgeCard: React.FC<{ badge: Badge; isUnlocked: boolean }> = ({ badge, isUnlocked }) => {
  const progress = badge.progress || 0;
  
  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all duration-300",
        isUnlocked
          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-md"
          : "bg-gray-50 border-gray-200 opacity-75"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "text-3xl transition-all duration-300",
            isUnlocked ? "animate-bounce" : "grayscale opacity-50"
          )}
        >
          {badge.icon}
        </div>
        <div className="flex-1">
          <h4 className={cn("font-semibold", isUnlocked ? "text-gray-900" : "text-gray-600")}>
            {badge.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
          {!isUnlocked && progress > 0 && (
            <div className="mt-2">
              <Progress value={progress * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress * 100)}% complete</p>
            </div>
          )}
          {isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {badge.characterId && (
        <BadgeUI
          className={cn(
            "absolute top-2 right-2 text-xs",
            characterColors[badge.characterId] || "bg-gray-100"
          )}
        >
          {badge.characterId}
        </BadgeUI>
      )}
    </div>
  );
};

export const ProgressDashboard: React.FC = () => {
  const {
    progressData,
    badges,
    unlockedBadges,
    getSuggestedNextComponent,
    resetProgress
  } = useProgress();

  if (!progressData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const suggestedComponent = getSuggestedNextComponent();
  const levelProgress = (progressData.experience / progressData.nextLevelExperience) * 100;
  
  // Group badges by category
  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  const categoryLabels: Record<string, string> = {
    character: 'Character Mastery',
    milestone: 'Milestones',
    skill: 'Skills',
    special: 'Special'
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-3xl font-bold">{progressData.level}</p>
                <Progress value={levelProgress} className="mt-2 h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {progressData.experience} / {progressData.nextLevelExperience} XP
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Learned</p>
                <p className="text-3xl font-bold">{progressData.totalTimeSpent}</p>
                <p className="text-xs text-gray-500 mt-1">minutes</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-3xl font-bold">{progressData.currentStreak}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Best: {progressData.longestStreak} days
                </p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <p className="text-3xl font-bold">{unlockedBadges.length}</p>
                <p className="text-xs text-gray-500 mt-1">of {badges.length} total</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-gray-600">
                  {progressData.completedComponents.length} components
                </span>
              </div>
              <Progress 
                value={(progressData.completedComponents.length / 50) * 100} 
                className="h-3" 
              />
            </div>

            {suggestedComponent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Suggested Next</p>
                  <p className="text-sm text-blue-700">{suggestedComponent}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Achievement Badges</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetProgress}
            className="text-gray-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  {categoryLabels[category] || category}
                  <BadgeUI variant="secondary" className="text-xs">
                    {categoryBadges.filter(b => 
                      unlockedBadges.some(ub => ub.id === b.id)
                    ).length} / {categoryBadges.length}
                  </BadgeUI>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryBadges.map(badge => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      isUnlocked={unlockedBadges.some(ub => ub.id === badge.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Character Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Character Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['maya', 'david', 'rachel', 'alex', 'sofia'].map(character => {
              const charComponents = progressData.completedComponents.filter(c => 
                c.toLowerCase().includes(character)
              ).length;
              const totalCharComponents = 6; // Approximate number per character
              const progress = (charComponents / totalCharComponents) * 100;

              return (
                <div key={character}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{character}</span>
                    <span className="text-sm text-gray-600">
                      {charComponents} / {totalCharComponents} components
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};