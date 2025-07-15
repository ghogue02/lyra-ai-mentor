/**
 * SKILL MASTERY TRACKER
 * Component for tracking and displaying user skill progression in micro-learning
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, BookOpen, Save } from 'lucide-react';
import { UserAttempt } from '@/config/microLearningSystem';
// import { useToolkit } from '@/hooks/useToolkit'; // Temporarily removed for testing
import { toast } from '@/hooks/use-toast';

interface SkillMasteryTrackerProps {
  skillProgress: Record<string, number>;
  recentAttempts: UserAttempt[];
  onSaveToToolkit?: (skill: string, bestAttempt: UserAttempt) => void;
}

interface SkillSummary {
  skill: string;
  currentScore: number;
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'mastered';
  masteryColor: string;
  bestAttempt?: UserAttempt;
  attemptCount: number;
  improvement: number;
}

export const SkillMasteryTracker: React.FC<SkillMasteryTrackerProps> = ({
  skillProgress,
  recentAttempts,
  onSaveToToolkit
}) => {
  // const { addItem } = useToolkit(); // Temporarily removed for testing

  const getMasteryLevel = (score: number): SkillSummary['masteryLevel'] => {
    if (score >= 9) return 'mastered';
    if (score >= 7.5) return 'proficient';
    if (score >= 6) return 'developing';
    return 'novice';
  };

  const getMasteryColor = (level: SkillSummary['masteryLevel']): string => {
    switch (level) {
      case 'mastered': return 'text-green-600 bg-green-50 border-green-200';
      case 'proficient': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'developing': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'novice': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSkillSummaries = (): SkillSummary[] => {
    return Object.entries(skillProgress).map(([skill, currentScore]) => {
      const skillAttempts = recentAttempts.filter(attempt => 
        attempt.lessonId.includes(skill.toLowerCase().replace(/\s+/g, '_'))
      );
      
      const bestAttempt = skillAttempts.reduce((best, current) => 
        !best || current.scores.overall > best.scores.overall ? current : best, 
        null as UserAttempt | null
      );

      const firstScore = skillAttempts.length > 0 ? skillAttempts[0].scores.overall : currentScore;
      const improvement = currentScore - firstScore;

      const masteryLevel = getMasteryLevel(currentScore);
      const masteryColor = getMasteryColor(masteryLevel);

      return {
        skill,
        currentScore,
        masteryLevel,
        masteryColor,
        bestAttempt: bestAttempt || undefined,
        attemptCount: skillAttempts.length,
        improvement
      };
    }).sort((a, b) => b.currentScore - a.currentScore);
  };

  const handleSaveToToolkit = async (skillSummary: SkillSummary) => {
    if (!skillSummary.bestAttempt) {
      toast({
        title: "No Attempt to Save",
        description: "Complete a micro-lesson attempt first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create toolkit item from best attempt
      const toolkitItem = {
        title: `${skillSummary.skill} - Best Practice`,
        content: skillSummary.bestAttempt.userResponse,
        type: 'skill-template' as const,
        category: 'micro-learning',
        metadata: {
          skill: skillSummary.skill,
          score: skillSummary.bestAttempt.scores.overall,
          masteryLevel: skillSummary.masteryLevel,
          lessonId: skillSummary.bestAttempt.lessonId,
          rubricScores: skillSummary.bestAttempt.scores.criteria,
          aiOutput: skillSummary.bestAttempt.aiGeneratedOutput
        },
        chapter: 'micro-learning',
        lesson: skillSummary.bestAttempt.lessonId
      };

      // await addItem(toolkitItem); // Temporarily simulate save
      
      toast({
        title: "Saved to Toolkit! 🎯",
        description: `Your best ${skillSummary.skill} practice has been saved.`,
        variant: "default"
      });

      // Callback for parent component
      if (onSaveToToolkit) {
        onSaveToToolkit(skillSummary.skill, skillSummary.bestAttempt);
      }
    } catch (error) {
      console.error('Failed to save to toolkit:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save to toolkit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const skillSummaries = getSkillSummaries();

  if (skillSummaries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Skill Journey</h3>
          <p className="text-gray-600">Complete your first micro-lesson to begin tracking your skills.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Skill Mastery Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {skillSummaries.filter(s => s.masteryLevel === 'mastered').length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {skillSummaries.filter(s => s.masteryLevel === 'proficient').length}
              </div>
              <div className="text-sm text-gray-600">Proficient</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {skillSummaries.filter(s => s.masteryLevel === 'developing').length}
              </div>
              <div className="text-sm text-gray-600">Developing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {recentAttempts.length}
              </div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Skill Cards */}
      <div className="grid gap-4">
        {skillSummaries.map((skillSummary) => (
          <Card key={skillSummary.skill} className={`border-l-4 ${skillSummary.masteryColor}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{skillSummary.skill}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={skillSummary.masteryColor}
                    >
                      {skillSummary.masteryLevel.charAt(0).toUpperCase() + skillSummary.masteryLevel.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {skillSummary.attemptCount} attempts
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{skillSummary.currentScore}/10</div>
                  {skillSummary.improvement > 0 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="h-3 w-3" />
                      +{skillSummary.improvement.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Mastery</span>
                  <span>{Math.round((skillSummary.currentScore / 10) * 100)}%</span>
                </div>
                <Progress 
                  value={(skillSummary.currentScore / 10) * 100} 
                  className="h-2"
                />
              </div>

              {/* Best Attempt Preview */}
              {skillSummary.bestAttempt && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Best Response:</h4>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {skillSummary.bestAttempt.userResponse}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      {new Date(skillSummary.bestAttempt.timestamp).toLocaleDateString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveToToolkit(skillSummary)}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-3 w-3" />
                      Save to Toolkit
                    </Button>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="pt-2 border-t">
                {skillSummary.masteryLevel === 'mastered' ? (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Skill mastered! Consider teaching others or exploring advanced applications.
                  </p>
                ) : skillSummary.masteryLevel === 'proficient' ? (
                  <p className="text-sm text-blue-600 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Nearly there! Practice complex scenarios to achieve mastery.
                  </p>
                ) : skillSummary.masteryLevel === 'developing' ? (
                  <p className="text-sm text-orange-600 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Good progress! Focus on consistency and attention to detail.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Keep practicing! Each attempt builds your skills.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillMasteryTracker;