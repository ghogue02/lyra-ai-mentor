import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Brain, Play, TrendingUp, Sparkles, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';

type Phase = 'intro' | 'narrative' | 'workshop';

interface PredictionType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  applications: string[];
  timeframe: string;
}

const DavidPredictiveInsights: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState<string>('');
  const [predictionQuery, setPredictionQuery] = useState('');
  const [predictiveModels, setPredictiveModels] = useState<Array<{id: string, type: string, prediction: string, confidence: string, actionable: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const predictionTypes: PredictionType[] = [
    {
      id: 'outcome-forecasting',
      name: 'Outcome Forecasting',
      description: 'Predict program outcomes and participant success rates',
      icon: Sparkles,
      applications: ['Graduation rates', 'Job placement success', 'Skill acquisition', 'Retention predictions'],
      timeframe: '3-12 months ahead'
    },
    {
      id: 'resource-optimization',
      name: 'Resource Optimization',
      description: 'Forecast resource needs and optimize allocation strategies',
      icon: Target,
      applications: ['Staffing requirements', 'Budget planning', 'Capacity management', 'Equipment needs'],
      timeframe: '6-18 months ahead'
    },
    {
      id: 'risk-prediction',
      name: 'Risk Prediction',
      description: 'Identify potential challenges before they become critical',
      icon: TrendingUp,
      applications: ['At-risk participants', 'Program disruptions', 'Funding gaps', 'Performance decline'],
      timeframe: '1-6 months ahead'
    },
    {
      id: 'opportunity-identification',
      name: 'Opportunity Identification',
      description: 'Discover emerging opportunities for expansion and improvement',
      icon: Zap,
      applications: ['Market expansion', 'Partnership potential', 'Innovation opportunities', 'Scaling readiness'],
      timeframe: '6-24 months ahead'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "You know what's been a game-changer? Moving from reactive to predictive thinking.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "For years, we only knew what happened after it happened. A student dropped out. Funding fell short. Programs underperformed.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "We were always playing catch-up, always responding to crises instead of preventing them.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "Then I discovered how AI could help us look forward, not just backward.",
      emotion: 'curious' as const
    },
    {
      id: '5',
      content: "Now we can predict which students need extra support, when funding shortfalls might occur, where our next expansion should be.",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "Our data doesn't just tell us what was - it shows us what could be, and helps us shape what will be.",
      emotion: 'enlightened' as const
    }
  ];

  const generatePrediction = async () => {
    if (!selectedPrediction) return;
    
    setIsAnalyzing(true);
    try {
      const predictionType = predictionTypes.find(p => p.id === selectedPrediction);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'predictive-analysis',
          topic: `${predictionType?.name} for nonprofit organization`,
          context: `David Chen needs to implement ${predictionType?.name.toLowerCase()} at Riverside Children's Foundation. Generate AI-powered insights for ${predictionType?.applications.join(', ')} with ${predictionType?.timeframe} forecasting horizon. Include specific predictions, confidence levels, and actionable recommendations.`
        }
      });

      if (error) throw error;

      const newPrediction = {
        id: `prediction-${Date.now()}`,
        type: predictionType?.name || 'Prediction',
        prediction: data.content?.prediction || `AI analysis suggests significant patterns in ${predictionType?.applications[0]?.toLowerCase()} with actionable insights for organizational improvement.`,
        confidence: data.content?.confidence || `85% confidence based on historical data patterns and trend analysis`,
        actionable: data.content?.actionable || `Implement targeted interventions within next 30-60 days to optimize outcomes and prevent potential challenges.`
      };

      setPredictiveModels([...predictiveModels, newPrediction]);
      
      toast({
        title: "Prediction Generated!",
        description: `David created AI-powered insights for ${predictionType?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to generate predictions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Predictive Insights Complete!",
      description: "You've mastered David's AI-powered forecasting techniques!",
    });
    navigate('/chapter/4');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* David Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('david-ai-analysis.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              🔮
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Predictive Insights Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Harness AI-powered forecasting to anticipate challenges and opportunities
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Reactive Decision-Making', desc: 'Experience the chaos of constant crisis response', color: 'from-red-500/10 to-red-500/5', animation: 'david-reactive-crisis.mp4', fallback: '🚨' },
            { title: 'AI-Powered Forecasting', desc: 'Learn to predict and prevent challenges', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-ai-breakthrough.mp4', fallback: '✨' },
            { title: 'Proactive Leadership', desc: 'Master anticipatory organizational management', color: 'from-green-500/10 to-green-500/5', animation: 'david-predictive-success.mp4', fallback: '🚀' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={<span className="text-3xl">{item.fallback}</span>}
                      className="w-full h-full"
                      context="character"
                    />
                  </div>
                  <Badge variant="secondary" className="mb-3">{index + 1}</Badge>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Begin Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Predictive Insights Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Predictive Insights Workshop"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-predictive-narrative"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Predictive Insights Workshop"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Predictive Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Prediction Engine */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Prediction Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prediction Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Prediction Type</label>
                <Select value={selectedPrediction} onValueChange={setSelectedPrediction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prediction type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {predictionTypes.map((prediction) => (
                      <SelectItem key={prediction.id} value={prediction.id}>
                        <div className="flex items-center gap-2">
                          <prediction.icon className="w-4 h-4" />
                          {prediction.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Prediction Details */}
              {selectedPrediction && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selected = predictionTypes.find(p => p.id === selectedPrediction);
                    return selected ? (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{selected.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selected.description}</p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-blue-600 mb-1">Applications:</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.applications.map((app, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{app}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 bg-white p-2 rounded">
                          <strong>Timeframe:</strong> {selected.timeframe}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Generate Button */}
              <Button 
                onClick={generatePrediction}
                disabled={!selectedPrediction || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    AI is analyzing patterns...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate AI Predictions
                  </>
                )}
              </Button>

              {/* Custom Query Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or describe your prediction needs</label>
                <Textarea
                  placeholder="Describe the specific outcomes you want to forecast, challenges you want to anticipate, or opportunities you want to identify..."
                  value={predictionQuery}
                  onChange={(e) => setPredictionQuery(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Prediction Models */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Your Prediction Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              {predictiveModels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No predictions generated yet.</p>
                  <p className="text-sm">Create your first AI-powered forecast!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictiveModels.map((model) => (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{model.type}</h4>
                        <Badge variant="outline">AI Prediction</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong className="text-blue-800">Prediction:</strong> {model.prediction}
                        </div>
                        <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                          <strong className="text-yellow-800">Confidence:</strong> {model.confidence}
                        </div>
                        <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                          <strong className="text-green-800">Action Plan:</strong> {model.actionable}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {predictiveModels.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Predictive Insights Workshop
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {currentPhase === 'intro' && renderIntroPhase()}
      {currentPhase === 'narrative' && renderNarrativePhase()}
      {currentPhase === 'workshop' && renderWorkshopPhase()}
    </AnimatePresence>
  );
};

export default DavidPredictiveInsights;