import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb, Crown, Award } from 'lucide-react';
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

interface LeadershipElement {
  id: string;
  type: 'assessment' | 'development' | 'coaching' | 'succession';
  title: string;
  description: string;
  example: string;
}

const CarmenLeadershipDevelopment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [leadershipContext, setLeadershipContext] = useState('');
  const [developmentChallenges, setDevelopmentChallenges] = useState('');
  const [leadershipGoals, setLeadershipGoals] = useState('');
  const [generatedProgram, setGeneratedProgram] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const leadershipElements: LeadershipElement[] = [
    {
      id: 'assessment',
      type: 'assessment',
      title: 'Leadership Assessment',
      description: 'AI-powered analysis of current leadership capabilities and potential',
      example: 'Analysis identifies strong strategic thinking but opportunities for emotional intelligence development. Recommends targeted coaching in empathetic leadership and change management.'
    },
    {
      id: 'development',
      type: 'development',
      title: 'Development Programs',
      description: 'Customized leadership development pathways with AI coaching insights',
      example: 'Create personalized learning tracks: executive presence workshops, AI-assisted decision-making training, cross-functional leadership rotations, and peer mentoring circles.'
    },
    {
      id: 'coaching',
      type: 'coaching',
      title: 'AI-Enhanced Coaching',
      description: 'Intelligent coaching system that adapts to individual leadership styles',
      example: 'Real-time feedback on communication patterns, predictive insights for team dynamics, scenario-based leadership simulations, and continuous performance optimization.'
    },
    {
      id: 'succession',
      type: 'succession',
      title: 'Succession Planning',
      description: 'Strategic pipeline development for next-generation leaders',
      example: 'AI-driven talent pipeline mapping, leadership readiness assessments, succession risk analysis, and accelerated development programs for high-potential leaders.'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I was promoted to lead a team of 50, but nobody taught me how to actually lead...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I was great at my technical role, but leadership felt like speaking a foreign language. Every decision felt like a guess.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "My team was struggling. Projects were delayed. People were leaving. I was working 80-hour weeks just trying to keep up.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "That's when I discovered leadership isn't a talent you're born with - it's a skill you can systematically develop with the right insights.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "AI helped me understand my leadership patterns. What motivated each team member? How could I communicate more effectively? Where were my blind spots?",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "I built a personal leadership development system. AI coaching. Data-driven feedback. Continuous learning loops tailored to my style and challenges.",
      emotion: 'determined' as const
    },
    {
      id: '7',
      content: "Now I lead with confidence. My team thrives. We've become the highest-performing group in the company. And I'm mentoring the next generation of leaders.",
      emotion: 'proud' as const
    }
  ];

  const generateLeadershipProgram = async () => {
    if (!leadershipContext.trim() || !developmentChallenges.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'development_plan',
          topic: 'Next-Generation Leadership Development with AI Coaching',
          context: `Carmen Rodriguez needs to create a comprehensive leadership development program that leverages AI for coaching and development.
          
          Leadership Context: ${leadershipContext}
          Development Challenges: ${developmentChallenges}
          Leadership Goals: ${leadershipGoals || 'Develop confident, effective leaders who can thrive in the AI-enhanced workplace'}
          
          Create a comprehensive leadership development program that includes: 1) AI-powered leadership assessment and capabilities analysis, 2) Personalized development pathways with AI coaching, 3) Systematic leadership skill building with real-world application, 4) Succession planning and pipeline development. Focus on building leaders who can combine human intelligence with AI capabilities for exceptional results.`
        }
      });

      if (error) throw error;

      setGeneratedProgram(data.content);
      
      toast({
        title: "Leadership Development Program Created!",
        description: "Carmen's AI has designed your leadership development strategy.",
      });
    } catch (error) {
      console.error('Error generating program:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate leadership development program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Leadership Development Workshop Complete!",
      description: "You've mastered Carmen's AI-enhanced leadership development approach!",
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
            src={getAnimationUrl('carmen-leadership-struggle.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              👑
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Leadership Development Lab
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Develop next-generation leaders with AI-enhanced coaching and systematic skill building
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Leadership Struggle', desc: 'Experience Carmen\'s leadership development challenge', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-leadership-struggle.mp4', fallback: '😰' },
            { title: 'AI Leadership Coaching', desc: 'Learn systematic leadership development approach', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-ai-coaching.mp4', fallback: '🎯' },
            { title: 'Leadership Excellence', desc: 'Witness confident leader transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-leadership-triumph.mp4', fallback: '👑' }
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
            Begin Carmen's Leadership Journey
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
        lessonTitle="Leadership Development Lab"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-leadership-narrative"
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
        lessonTitle="Leadership Development Lab"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Leadership Development Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Leadership Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-600" />
                Leadership Development Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Leadership Context */}
              <div>
                <Label htmlFor="context">Your Leadership Context</Label>
                <Textarea
                  id="context"
                  placeholder="Describe your leadership situation: team size, industry, current responsibilities, leadership challenges..."
                  value={leadershipContext}
                  onChange={(e) => setLeadershipContext(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Development Challenges */}
              <div>
                <Label htmlFor="challenges">Leadership Development Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What specific leadership skills or situations do you want to improve?"
                  value={developmentChallenges}
                  onChange={(e) => setDevelopmentChallenges(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Leadership Goals */}
              <div>
                <Label htmlFor="goals">Leadership Goals</Label>
                <Input
                  id="goals"
                  placeholder="What kind of leader do you want to become?"
                  value={leadershipGoals}
                  onChange={(e) => setLeadershipGoals(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateLeadershipProgram}
                disabled={!leadershipContext.trim() || !developmentChallenges.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Carmen is designing your leadership program...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Leadership Development Program with Carmen's AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Leadership Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Carmen's Leadership Development Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadershipElements.map((element, index) => (
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

            {/* Generated Program */}
            {generatedProgram && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-green-600" />
                    Your Leadership Development Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                    <TemplateContentFormatter 
                      content={generatedProgram}
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
        {generatedProgram && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Leadership Development Workshop
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

export default CarmenLeadershipDevelopment;