import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Clock, 
  TrendingUp, 
  Star, 
  Mail, 
  Users, 
  Home,
  Award,
  Sparkles,
  Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';

export interface MayaStorylineState {
  currentChapter: number;
  currentLesson: number;
  emailConfidenceLevel: number; // 1-10
  timeEfficiencyGain: number; // minutes saved per email
  familyTimeReclaimed: number; // hours per week
  majorMilestones: string[];
  currentChallenge: string;
  nextGoal: string;
  totalProgress: number; // 0-100%
}

export const MayaStorylineIntegration: React.FC<{
  lessonId?: number;
  onProgressUpdate?: (progress: MayaStorylineState) => void;
}> = ({ lessonId, onProgressUpdate }) => {
  const { user } = useAuth();
  const { mayaMetrics, personalityProfile, refreshMayaMetrics } = useAdaptiveAI();
  const [storylineState, setStorylineState] = useState<MayaStorylineState>({
    currentChapter: 2,
    currentLesson: lessonId || 5,
    emailConfidenceLevel: 3,
    timeEfficiencyGain: 0,
    familyTimeReclaimed: 0,
    majorMilestones: [],
    currentChallenge: "Email anxiety affecting work-life balance",
    nextGoal: "Master AI email recipe method",
    totalProgress: 0
  });

  // Update storyline state based on Maya metrics
  useEffect(() => {
    if (mayaMetrics) {
      const newState: MayaStorylineState = {
        ...storylineState,
        emailConfidenceLevel: Math.min(10, 3 + Math.floor(mayaMetrics.confidenceGrowth)),
        timeEfficiencyGain: Math.round(27 * (mayaMetrics.emailEfficiencyImprovement / 100)),
        familyTimeReclaimed: Math.round(mayaMetrics.timeReclaimed / 60), // Convert minutes to hours
        majorMilestones: determineMilestones(mayaMetrics),
        currentChallenge: getCurrentChallenge(mayaMetrics),
        nextGoal: getNextGoal(mayaMetrics),
        totalProgress: calculateTotalProgress(mayaMetrics)
      };
      
      setStorylineState(newState);
      onProgressUpdate?.(newState);
    }
  }, [mayaMetrics]);

  const determineMilestones = (metrics: any) => {
    const milestones: string[] = [];
    
    if (metrics.emailEfficiencyImprovement > 20) {
      milestones.push("First successful AI email sent");
    }
    if (metrics.emailEfficiencyImprovement > 50) {
      milestones.push("Email recipe method mastered");
    }
    if (metrics.timeReclaimed > 60) {
      milestones.push("One hour per week reclaimed for family");
    }
    if (metrics.confidenceGrowth > 3) {
      milestones.push("Professional communication confidence gained");
    }
    if (metrics.skillsMastered.length >= 3) {
      milestones.push("AI workflow integration achieved");
    }
    
    return milestones;
  };

  const getCurrentChallenge = (metrics: any) => {
    if (metrics.emailEfficiencyImprovement < 25) {
      return "Learning to trust AI as a writing partner";
    }
    if (metrics.confidenceGrowth < 3) {
      return "Building confidence in professional communications";
    }
    if (metrics.timeReclaimed < 120) {
      return "Optimizing workflow for maximum time savings";
    }
    return "Sharing AI knowledge with Hope Gardens team";
  };

  const getNextGoal = (metrics: any) => {
    if (metrics.emailEfficiencyImprovement < 50) {
      return "Achieve 50% email efficiency improvement";
    }
    if (metrics.timeReclaimed < 180) {
      return "Reclaim 3+ hours per week for mission work";
    }
    if (metrics.skillsMastered.length < 4) {
      return "Master advanced AI communication tools";
    }
    return "Become Hope Gardens' AI communication leader";
  };

  const calculateTotalProgress = (metrics: any) => {
    // Calculate overall Maya transformation progress
    const factors = [
      metrics.emailEfficiencyImprovement / 100, // 0-1 scale
      metrics.confidenceGrowth / 7, // Assuming max 7 point growth
      metrics.timeReclaimed / 300, // Assuming max 5 hours/week goal
      metrics.skillsMastered.length / 5, // Assuming 5 total skills
    ];
    
    const avgProgress = factors.reduce((sum, factor) => sum + Math.min(1, factor), 0) / factors.length;
    return Math.round(avgProgress * 100);
  };

  return (
    <div className="space-y-6">
      {/* Maya's Journey Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-900">Maya's Confidence Journey</CardTitle>
              <p className="text-purple-700">Program Director at Hope Gardens Community Center</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-800">Overall Progress</span>
              <span className="text-sm font-bold text-purple-900">{storylineState.totalProgress}%</span>
            </div>
            <Progress value={storylineState.totalProgress} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-lg font-bold text-purple-900">{storylineState.emailConfidenceLevel}/10</span>
                </div>
                <p className="text-xs text-purple-700">Confidence</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Timer className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-lg font-bold text-purple-900">{storylineState.timeEfficiencyGain}min</span>
                </div>
                <p className="text-xs text-purple-700">Time Saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Home className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-lg font-bold text-purple-900">{storylineState.familyTimeReclaimed}hrs</span>
                </div>
                <p className="text-xs text-purple-700">Family Time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Challenge & Next Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Current Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">{storylineState.currentChallenge}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Next Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800">{storylineState.nextGoal}</p>
          </CardContent>
        </Card>
      </div>

      {/* Major Milestones */}
      {storylineState.majorMilestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Maya's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {storylineState.majorMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-800">{milestone}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maya's Transformation Story */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Maya's Story So Far</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-800">
            <p>
              <strong>The Challenge:</strong> Maya used to spend 32 minutes writing each email, 
              often feeling anxious about tone and clarity. With 15+ emails per week, 
              this consumed 8+ hours—time taken from her family and mission work.
            </p>
            
            <p>
              <strong>The Discovery:</strong> Through AI learning, Maya discovered the "email recipe method"—
              a simple 3-ingredient approach that transforms email writing from stressful to systematic.
            </p>
            
            {storylineState.totalProgress > 30 && (
              <p>
                <strong>The Breakthrough:</strong> Maya now writes professional emails in under 5 minutes, 
                reclaiming {storylineState.familyTimeReclaimed} hours per week for what matters most—
                her family and the families Hope Gardens serves.
              </p>
            )}
            
            {storylineState.totalProgress > 70 && (
              <p>
                <strong>The Impact:</strong> Maya's transformation inspired her entire team. 
                Her confidence in communication has grown from {storylineState.emailConfidenceLevel - Math.floor(storylineState.totalProgress / 20)}/10 
                to {storylineState.emailConfidenceLevel}/10, and she's become Hope Gardens' 
                unofficial AI communication mentor.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Impact Summary */}
      {mayaMetrics && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              This Week's Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {mayaMetrics.weeklyImpact.emailsSent}
                </div>
                <p className="text-xs text-green-600">Emails Sent</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {mayaMetrics.weeklyImpact.avgTimePerEmail}min
                </div>
                <p className="text-xs text-blue-600">Avg Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {mayaMetrics.weeklyImpact.familyTimeReclaimed}min
                </div>
                <p className="text-xs text-purple-600">Time Saved</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">
                  {storylineState.emailConfidenceLevel}/10
                </div>
                <p className="text-xs text-orange-600">Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MayaStorylineIntegration;