import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  MessageCircle, 
  Lightbulb, 
  Shield, 
  TrendingUp,
  Clock,
  Mic,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';
import { useAuth } from '@/contexts/AuthContext';

export const MayaAdaptiveCoaching: React.FC<{
  currentActivity: string;
  stressLevel?: number;
  timeAvailable?: number;
  specificChallenge?: string;
  onCoachingComplete?: () => void;
}> = ({ 
  currentActivity, 
  stressLevel, 
  timeAvailable = 15, 
  specificChallenge,
  onCoachingComplete 
}) => {
  const { user } = useAuth();
  const { 
    coachingSession, 
    requestCoaching, 
    personalityProfile,
    startVoiceSession,
    voiceSession,
    error 
  } = useAdaptiveAI();
  
  const [isRequestingCoaching, setIsRequestingCoaching] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentStress, setCurrentStress] = useState(stressLevel || 5);

  // Auto-request coaching when component loads
  useEffect(() => {
    if (user?.id && !coachingSession && !isRequestingCoaching) {
      handleRequestCoaching();
    }
  }, [user?.id, currentActivity]);

  const handleRequestCoaching = async () => {
    setIsRequestingCoaching(true);
    try {
      await requestCoaching({
        currentActivity,
        stressLevel: currentStress,
        timeAvailable,
        specificChallenge,
        character: 'maya'
      });
    } catch (err) {
      console.error('Failed to request coaching:', err);
    } finally {
      setIsRequestingCoaching(false);
    }
  };

  const handleVoiceCoaching = async (sessionType: 'confidence-building' | 'stress-management' | 'skill-practice' | 'real-time-help') => {
    try {
      setIsVoiceActive(true);
      await startVoiceSession(sessionType);
    } catch (err) {
      console.error('Failed to start voice session:', err);
      setIsVoiceActive(false);
    }
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStressLevelText = (level: number) => {
    if (level <= 3) return 'Calm & Confident';
    if (level <= 6) return 'Moderately Stressed';
    return 'High Stress';
  };

  if (isRequestingCoaching) {
    return (
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
            <span className="text-purple-800">Maya's AI coach is analyzing your situation...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRequestCoaching}
            className="ml-2"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coachingSession) {
    return (
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No coaching session available</p>
            <Button onClick={handleRequestCoaching}>
              Request Maya's Coaching
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Coaching Session Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-purple-900">Maya's AI Coach</CardTitle>
                <p className="text-sm text-purple-700">Personalized support for {currentActivity}</p>
              </div>
            </div>
            <Badge className={`px-3 py-1 ${getStressLevelColor(currentStress)}`}>
              {getStressLevelText(currentStress)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-purple-800">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{coachingSession.estimatedTime} min session</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Adapted for {personalityProfile?.communicationStyle || 'your style'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress Management (if needed) */}
      {coachingSession.stressManagement && coachingSession.stressManagement.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-base text-orange-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Stress Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coachingSession.stressManagement.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-orange-100/50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-orange-800">{tip}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleVoiceCoaching('stress-management')}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Mic className="w-4 h-4 mr-1" />
                Voice Breathing Exercise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coachingSession.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-800">{suggestion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-purple-600" />
            Just for You, Maya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {coachingSession.personalizedTips.map((tip, index) => (
              <div key={index} className="p-2 bg-purple-50 rounded border-l-4 border-purple-200">
                <span className="text-sm text-purple-800">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confidence Builders */}
      {coachingSession.confidenceBuilders && coachingSession.confidenceBuilders.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-base text-green-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Confidence Boosters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coachingSession.confidenceBuilders.map((builder, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-100/50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{builder}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleVoiceCoaching('confidence-building')}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <Mic className="w-4 h-4 mr-1" />
                Voice Confidence Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-base text-blue-900">Your Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {coachingSession.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                </div>
                <span className="text-sm text-blue-800">{step}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              size="sm"
              onClick={onCoachingComplete}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Working
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleVoiceCoaching('real-time-help')}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Mic className="w-4 h-4 mr-1" />
              Voice Guide
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleRequestCoaching}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Session Player (if active) */}
      {voiceSession && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Coaching Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isVoiceActive ? "secondary" : "default"}
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                >
                  {isVoiceActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isVoiceActive ? 'Pause' : 'Start'} Session
                </Button>
                <Badge variant="outline">Interactive Practice</Badge>
              </div>
              
              {isVoiceActive && (
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <p className="text-sm text-indigo-800 mb-2">
                    Ready to practice? Let's work through this together:
                  </p>
                  <div className="space-y-1">
                    {voiceSession.voicePrompts?.map((prompt: string, index: number) => (
                      <p key={index} className="text-xs text-indigo-700">• {prompt}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MayaAdaptiveCoaching;