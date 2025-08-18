import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Heart, Users, TrendingUp, Clock, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

type Phase = 'intro' | 'narrative' | 'workshop';

interface EngagementFrameworkElement {
  id: string;
  title: string;
  description: string;
  approach: string;
  example: string;
}

const CarmenEngagementBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [teamSize, setTeamSize] = useState('');
  const [engagementChallenges, setEngagementChallenges] = useState('');
  const [workStyle, setWorkStyle] = useState('');
  const [currentSatisfaction, setCurrentSatisfaction] = useState('');
  const [motivationFactors, setMotivationFactors] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const engagementFrameworkElements: EngagementFrameworkElement[] = [
    {
      id: 'individual-insights',
      title: 'AI-Powered Individual Insights',
      description: 'Understand each person\'s unique motivation patterns',
      approach: 'Use data analytics to identify communication styles, work preferences, and recognition needs',
      example: 'Sarah thrives on public recognition while Alex prefers private feedback and growth opportunities'
    },
    {
      id: 'personalized-recognition',
      title: 'Personalized Recognition Systems',
      description: 'Multiple pathways for meaningful appreciation',
      approach: 'Diverse recognition options matching different personality types and preferences',
      example: 'Offer peer nominations, skill spotlights, project celebrations, and growth milestones'
    },
    {
      id: 'growth-alignment',
      title: 'Growth & Mission Alignment',
      description: 'Connect individual aspirations with organizational purpose',
      approach: 'Regular conversations linking personal goals to mission impact',
      example: 'Map each person\'s career aspirations to meaningful projects that advance our mission'
    },
    {
      id: 'psychological-safety',
      title: 'Psychological Safety Culture',
      description: 'Environment where everyone feels valued to contribute fully',
      approach: 'Create safe spaces for feedback, ideas, and authentic self-expression',
      example: 'Regular team retrospectives, anonymous suggestion systems, and open-door policies'
    },
    {
      id: 'continuous-pulse',
      title: 'Continuous Engagement Pulse',
      description: 'Real-time insights into team satisfaction and motivation',
      approach: 'Regular check-ins, pulse surveys, and proactive support systems',
      example: 'Weekly one-on-ones, monthly team health checks, and quarterly deep-dive reviews'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I watched our best program manager, Jamie, quietly disengage over three months, despite being incredibly talented.",
      emotion: 'concerned' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our engagement surveys showed 'satisfactory' scores, but I could feel the energy drain from our team meetings.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "That's when I realized we were treating engagement like a one-size-fits-all problem. But people are beautifully unique.",
      emotion: 'enlightened' as const
    },
    {
      id: '4',
      content: "I started using AI to understand each person's individual motivation patterns - their communication style, recognition preferences, growth aspirations.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "For Jamie, it wasn't about money or title. They craved intellectual challenge and wanted to see their work's direct impact on our mission.",
      emotion: 'insightful' as const
    },
    {
      id: '6',
      content: "We redesigned our approach: AI-powered individual insights, personalized recognition, growth alignment, psychological safety, and continuous pulse checks.",
      emotion: 'strategic' as const
    },
    {
      id: '7',
      content: "Within two months, Jamie was leading our most innovative project. Team engagement scores jumped from 3.2 to 4.7 out of 5.",
      emotion: 'triumphant' as const
    },
    {
      id: '8',
      content: "Now I'll show you how to create personalized engagement strategies that make every team member feel truly valued and motivated.",
      emotion: 'empowered' as const
    }
  ];

  const generateEngagementStrategy = async () => {
    if (!teamSize || !engagementChallenges.trim() || !workStyle) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'personalized-engagement-strategy',
          topic: 'AI-powered employee engagement with personalization',
          context: `Carmen Rodriguez needs to create a comprehensive engagement strategy using her personalized AI approach.
          
          Team Size: ${teamSize}
          Current Challenges: ${engagementChallenges}
          Work Style: ${workStyle}
          Current Satisfaction Level: ${currentSatisfaction || 'Not specified'}
          Key Motivation Factors: ${motivationFactors || 'Not specified'}
          
          Create a structured engagement strategy that follows Carmen's framework: 1) AI-Powered Individual Insights (understand unique motivation patterns), 2) Personalized Recognition Systems (multiple appreciation pathways), 3) Growth & Mission Alignment (connect aspirations to purpose), 4) Psychological Safety Culture (safe authentic expression), 5) Continuous Engagement Pulse (real-time team health). The strategy should make every team member feel uniquely valued and motivated.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Engagement Strategy Created!",
        description: "Carmen crafted your personalized team engagement plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Engagement Builder Mastery Complete!",
      description: "You've mastered Carmen's personalized engagement framework!",
    });
    navigate('/chapter/7');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Carmen Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('carmen-engagement-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-orange-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Engagement Builder
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create personalized engagement strategies using AI insights and human empathy
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Engagement Crisis', desc: 'Carmen\'s team disengagement struggles', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-engagement-crisis.mp4', fallback: '😔' },
            { title: 'Personalization Discovery', desc: 'Learn individual motivation patterns', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-personalization-discovery.mp4', fallback: '✨' },
            { title: 'Team Transformation', desc: 'Witness engagement renaissance', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-engagement-success.mp4', fallback: '🚀' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Engagement Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Personalized Engagement Builder"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-engagement-narrative"
          characterName="Carmen"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Personalized Engagement Builder"
        characterName="Carmen"
        progress={66 + (currentStep / 5) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 5) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Personalized Engagement Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Engagement Strategy Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stars className="w-5 h-5 text-orange-600" />
                Personalized Engagement Strategy Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Size */}
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={teamSize} onValueChange={setTeamSize}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How large is your team?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small-team">Small Team (2-10 people)</SelectItem>
                    <SelectItem value="medium-team">Medium Team (11-25 people)</SelectItem>
                    <SelectItem value="large-team">Large Team (26-50 people)</SelectItem>
                    <SelectItem value="department">Department (51+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Challenges */}
              <div>
                <Label htmlFor="challenges">Current Engagement Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What engagement issues are you facing? (e.g., low motivation, high turnover, lack of recognition)"
                  value={engagementChallenges}
                  onChange={(e) => setEngagementChallenges(e.target.value)}
                  className="min-h-[80px] mt-2"
                />
              </div>

              {/* Work Style */}
              <div>
                <Label htmlFor="workStyle">Primary Work Style</Label>
                <Select value={workStyle} onValueChange={setWorkStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How does your team primarily work?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully-remote">Fully Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Remote + Office)</SelectItem>
                    <SelectItem value="fully-onsite">Fully On-site</SelectItem>
                    <SelectItem value="flexible">Flexible Arrangements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Satisfaction */}
              <div>
                <Label htmlFor="satisfaction">Current Team Satisfaction Level</Label>
                <Select value={currentSatisfaction} onValueChange={setCurrentSatisfaction}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How satisfied is your team currently?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-low">Very Low (Major concerns)</SelectItem>
                    <SelectItem value="low">Low (Some disengagement)</SelectItem>
                    <SelectItem value="moderate">Moderate (Mixed feedback)</SelectItem>
                    <SelectItem value="good">Good (Generally positive)</SelectItem>
                    <SelectItem value="excellent">Excellent (Highly engaged)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Motivation Factors */}
              <div>
                <Label htmlFor="motivation">Key Motivation Factors</Label>
                <Textarea
                  id="motivation"
                  placeholder="What motivates your team members? (e.g., growth opportunities, recognition, autonomy, mission alignment)"
                  value={motivationFactors}
                  onChange={(e) => setMotivationFactors(e.target.value)}
                  className="min-h-[60px] mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateEngagementStrategy}
                disabled={!teamSize || !engagementChallenges.trim() || !workStyle || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 animate-pulse" />
                    Carmen is crafting your strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Personalized Engagement Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Engagement Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-amber-600" />
                  Carmen's Personalized Engagement Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementFrameworkElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-orange-200 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {index + 1}. {element.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{element.description}</p>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded italic">
                        "{element.example}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generated Strategy */}
            {generatedStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Personalized Engagement Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedStrategy}
                      contentType="lesson"
                      variant="default"
                      showMergeFieldTypes={true}
                      className="formatted-ai-content"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedStrategy && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Engagement Builder Workshop
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

export default CarmenEngagementBuilder;