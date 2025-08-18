import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb, TrendingUp, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

type Phase = 'intro' | 'narrative' | 'workshop';

interface TeamDynamicsElement {
  id: string;
  type: 'assessment' | 'strategy' | 'implementation' | 'monitoring';
  title: string;
  description: string;
  example: string;
}

const CarmenTeamDynamics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [teamDescription, setTeamDescription] = useState('');
  const [teamChallenges, setTeamChallenges] = useState('');
  const [teamGoals, setTeamGoals] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const dynamicsElements: TeamDynamicsElement[] = [
    {
      id: 'assessment',
      type: 'assessment',
      title: 'Team Assessment',
      description: 'AI-powered analysis of current team dynamics and collaboration patterns',
      example: 'Our team shows strong technical skills but struggles with cross-departmental communication. AI suggests implementing structured check-ins and shared project dashboards.'
    },
    {
      id: 'strategy',
      type: 'strategy',
      title: 'Optimization Strategy',
      description: 'Custom strategies to enhance collaboration and productivity',
      example: 'Implement pair programming sessions, establish clear communication protocols, and create mentorship partnerships based on complementary strengths.'
    },
    {
      id: 'implementation',
      type: 'implementation',
      title: 'Implementation Plan',
      description: 'Step-by-step roadmap for building cohesive team dynamics',
      example: 'Week 1: Team assessment surveys, Week 2: Individual coaching sessions, Week 3: Group dynamics workshops, Week 4: New collaboration tools rollout.'
    },
    {
      id: 'monitoring',
      type: 'monitoring',
      title: 'Performance Monitoring',
      description: 'Continuous tracking and adjustment of team performance metrics',
      example: 'Monthly pulse surveys, quarterly 360 reviews, real-time collaboration analytics, and predictive models for team satisfaction trends.'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I'll never forget the day our 'dream team' project completely fell apart...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "On paper, we had the best developers, the most creative designers, and experienced project managers. But somehow, we couldn't work together.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Meetings turned into blame games. Communication broke down. Our star performers became isolated islands of talent.",
      emotion: 'disappointed' as const
    },
    {
      id: '4',
      content: "That's when I discovered that great teams aren't born - they're systematically built using data-driven insights.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "AI helped me understand our team's hidden dynamics. Who collaborated naturally? Where were the communication bottlenecks? What motivated each individual?",
      emotion: 'enlightened' as const
    },
    {
      id: '6',
      content: "With these insights, we redesigned how our team worked together. We created psychological safety, optimized communication flows, and built on each person's strengths.",
      emotion: 'hopeful' as const
    },
    {
      id: '7',
      content: "Six months later, that same team delivered our most successful project ever. Now I help other leaders build cohesive, high-performing teams using AI insights.",
      emotion: 'excited' as const
    }
  ];

  const generateTeamPlan = async () => {
    if (!teamDescription.trim() || !teamChallenges.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Team Dynamics Optimization with AI Insights',
          context: `Carmen Rodriguez needs to optimize team dynamics for better collaboration and performance.
          
          Team Description: ${teamDescription}
          Current Challenges: ${teamChallenges}
          Goals: ${teamGoals || 'Improve team collaboration, productivity, and satisfaction'}
          
          Create a comprehensive team dynamics optimization plan that includes: 1) AI-powered team assessment, 2) Custom collaboration strategies, 3) Implementation roadmap, 4) Performance monitoring system. Focus on building psychological safety, optimizing communication, and leveraging individual strengths for collective success.`
        }
      });

      if (error) throw error;

      setGeneratedPlan(data.content);
      
      toast({
        title: "Team Dynamics Plan Created!",
        description: "Carmen's AI has crafted your team optimization strategy.",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate team dynamics plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Team Dynamics Workshop Complete!",
      description: "You've mastered Carmen's team dynamics optimization approach!",
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
            src={getAnimationUrl('carmen-team-challenge.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              👥
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Team Dynamics Optimizer
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build cohesive, high-performing teams with AI-powered insights and strategies
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Dream Team Disaster', desc: 'Experience Carmen\'s team collaboration breakdown', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-team-challenge.mp4', fallback: '🔥' },
            { title: 'AI Dynamics Discovery', desc: 'Learn systematic team optimization approach', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-ai-discovery.mp4', fallback: '🎯' },
            { title: 'Cohesive Team Success', desc: 'Witness high-performing team transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-team-triumph.mp4', fallback: '🚀' }
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
            Begin Carmen's Team Journey
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
        lessonTitle="Team Dynamics Optimizer"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-team-narrative"
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
        lessonTitle="Team Dynamics Optimizer"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Team Dynamics Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Team Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Team Dynamics Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Description */}
              <div>
                <Label htmlFor="team">Your Team Description</Label>
                <Textarea
                  id="team"
                  placeholder="Describe your team: size, roles, working style, current projects..."
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Team Challenges */}
              <div>
                <Label htmlFor="challenges">Current Team Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What specific collaboration or performance issues is your team facing?"
                  value={teamChallenges}
                  onChange={(e) => setTeamChallenges(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Team Goals */}
              <div>
                <Label htmlFor="goals">Team Goals</Label>
                <Input
                  id="goals"
                  placeholder="What do you want to achieve with your team? (e.g., better communication, higher productivity)"
                  value={teamGoals}
                  onChange={(e) => setTeamGoals(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateTeamPlan}
                disabled={!teamDescription.trim() || !teamChallenges.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Carmen is optimizing your team...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Team Optimization Plan with Carmen's AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Team Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Carmen's Team Optimization Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dynamicsElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-orange-200 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {index + 1}. {element.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{element.description}</p>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded italic">
                        "{element.example}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generated Plan */}
            {generatedPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Team Optimization Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                    <TemplateContentFormatter 
                      content={generatedPlan}
                      contentType="general"
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
        {generatedPlan && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Team Dynamics Workshop
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

export default CarmenTeamDynamics;