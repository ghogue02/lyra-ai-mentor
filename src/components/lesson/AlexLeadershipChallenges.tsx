import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, FileText, Target, Users, AlertTriangle, Lightbulb } from 'lucide-react';
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

interface ChallengeCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexLeadershipChallenges: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [challengeResponse, setChallengeResponse] = useState('');
  const [generatedSolutions, setGeneratedSolutions] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const challengeCategories: ChallengeCategory[] = [
    {
      id: 'resistance-to-change',
      name: 'Resistance to Change',
      description: 'Overcoming organizational inertia and fear of AI',
      icon: AlertTriangle,
      examples: ['Staff refusing AI tools', 'Executive skepticism', 'Cultural pushback']
    },
    {
      id: 'skill-gaps',
      name: 'Skill & Knowledge Gaps',
      description: 'Building AI literacy across the organization',
      icon: Target,
      examples: ['Technical competency deficits', 'Digital literacy gaps', 'AI understanding barriers']
    },
    {
      id: 'resource-constraints',
      name: 'Resource Constraints',
      description: 'Managing budget and capacity limitations',
      icon: FileText,
      examples: ['Limited AI budget', 'Understaffed teams', 'Competing priorities']
    },
    {
      id: 'stakeholder-alignment',
      name: 'Stakeholder Alignment',
      description: 'Getting diverse groups on the same page',
      icon: Users,
      examples: ['Board concerns', 'Community resistance', 'Staff divisions']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Leading AI transformation at the National Advocacy Coalition has been... challenging.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "When I first proposed AI adoption, I hit resistance from every angle - staff, board, community partners.",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "Everyone had valid concerns: 'Will AI replace us?' 'What about data privacy?' 'How much will this cost?'",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "I realized I wasn't just implementing technology - I was managing a complex organizational transformation.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "That's when I developed my systematic approach to navigating AI transformation challenges.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now we've successfully integrated AI into 12 core processes, with 85% staff adoption. Let me show you how.",
      emotion: 'accomplished' as const
    }
  ];

  const analyzeChallenge = async () => {
    if (!selectedChallenge) return;
    
    setIsAnalyzing(true);
    try {
      const challenge = challengeCategories.find(c => c.id === selectedChallenge);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'leadership-solution',
          topic: `${challenge?.name} solution for AI transformation`,
          context: `Alex Rivera at National Advocacy Coalition faces ${challenge?.name.toLowerCase()} during AI transformation. Specific situation: ${challengeResponse}. Provide strategic leadership approach with practical steps.`
        }
      });

      if (error) throw error;

      const newSolution = {
        id: `solution-${Date.now()}`,
        name: `${challenge?.name} Strategy`,
        content: data.content
      };

      setGeneratedSolutions([...generatedSolutions, newSolution]);
      
      toast({
        title: "Solution Generated!",
        description: `Alex created a strategy for ${challenge?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error analyzing challenge:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Leadership Challenges Mastered!",
      description: "You've learned Alex's systematic approach to AI transformation challenges!",
    });
    navigate('/chapter/6');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Alex Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('alex-leadership-challenge.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              🎯
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's Leadership Challenge Navigator
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Master the complexities of AI transformation leadership
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Transformation Crisis', desc: 'Experience organizational resistance', color: 'from-red-500/10 to-red-500/5', animation: 'alex-resistance-challenges.mp4', fallback: '⚠️' },
            { title: 'Navigate Complex Challenges', desc: 'Learn systematic problem-solving', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-strategic-thinking.mp4', fallback: '🧭' },
            { title: 'Alex\'s Leadership Success', desc: 'Witness transformation mastery', color: 'from-green-500/10 to-green-500/5', animation: 'alex-transformation-success.mp4', fallback: '🚀' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Alex's Leadership Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={6}
        chapterTitle="Alex's AI Leadership Mastery"
        lessonTitle="Leadership Challenge Navigator"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-challenge-narrative"
          characterName="Alex"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={6}
        chapterTitle="Alex's AI Leadership Mastery"
        lessonTitle="Leadership Challenge Navigator"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Challenge Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Challenge Analyzer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
                Challenge Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Challenge Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Your Challenge Type</label>
                <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a transformation challenge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeCategories.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        <div className="flex items-center gap-2">
                          <challenge.icon className="w-4 h-4" />
                          {challenge.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Challenge Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Specific Situation</label>
                <Textarea
                  placeholder="What specific challenges are you facing with AI transformation? Be detailed about the context and stakeholders involved..."
                  value={challengeResponse}
                  onChange={(e) => setChallengeResponse(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Analyze Button */}
              <Button 
                onClick={analyzeChallenge}
                disabled={!selectedChallenge || !challengeResponse.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is analyzing your challenge...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Alex's Strategic Solution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Strategic Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Strategic Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedSolutions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No solutions generated yet.</p>
                  <p className="text-sm">Analyze your first challenge to get Alex's strategic approach!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedSolutions.map((solution) => (
                    <div key={solution.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{solution.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Strategy</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                        {solution.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedSolutions.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Leadership Challenge Workshop
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

export default AlexLeadershipChallenges;