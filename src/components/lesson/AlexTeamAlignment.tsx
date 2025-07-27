import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Users, Heart, MessageCircle, Target, HandHeart } from 'lucide-react';
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

interface AlignmentCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexTeamAlignment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [teamContext, setTeamContext] = useState('');
  const [alignmentGoals, setAlignmentGoals] = useState('');
  const [generatedStrategies, setGeneratedStrategies] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isAligning, setIsAligning] = useState(false);

  const alignmentCategories: AlignmentCategory[] = [
    {
      id: 'resistance-management',
      name: 'Resistance Management',
      description: 'Address fears and concerns about AI adoption',
      icon: Heart,
      examples: ['Job security fears', 'Technology anxiety', 'Change resistance']
    },
    {
      id: 'skill-development',
      name: 'Skill Development',
      description: 'Unite teams around learning and growth',
      icon: Target,
      examples: ['AI literacy programs', 'Upskilling initiatives', 'Capability building']
    },
    {
      id: 'communication-alignment',
      name: 'Communication Alignment',
      description: 'Establish shared language and understanding',
      icon: MessageCircle,
      examples: ['AI terminology', 'Progress updates', 'Feedback loops']
    },
    {
      id: 'cultural-integration',
      name: 'Cultural Integration',
      description: 'Embed AI adoption into organizational culture',
      icon: HandHeart,
      examples: ['Value alignment', 'Behavioral norms', 'Recognition systems']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "One of my hardest lessons was realizing that AI transformation isn't about technology - it's about people.",
      emotion: 'reflective' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I spent months focused on which AI tools to use, but my team was pulling in different directions.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Some were excited about AI, others were scared, and many were just confused about what it all meant.",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "That's when I learned that successful transformation requires getting everyone aligned first.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "I developed the Unity Framework - a systematic approach to bringing teams together around AI adoption.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now our team moves as one. 85% adoption rate, because everyone feels heard and supported. Here's how.",
      emotion: 'accomplished' as const
    }
  ];

  const generateStrategy = async () => {
    if (!selectedChallenge || !teamContext.trim()) return;
    
    setIsAligning(true);
    try {
      const challenge = alignmentCategories.find(c => c.id === selectedChallenge);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'team-alignment-strategy',
          topic: `${challenge?.name} strategy for team unity`,
          context: `Alex Rivera at National Advocacy Coalition needs to unite team around AI adoption. Challenge: ${challenge?.name}. Team context: ${teamContext}. Alignment goals: ${alignmentGoals}. Create inclusive strategy that addresses concerns and builds collective commitment.`
        }
      });

      if (error) throw error;

      const newStrategy = {
        id: `strategy-${Date.now()}`,
        name: `${challenge?.name} Unity Plan`,
        content: data.content
      };

      setGeneratedStrategies([...generatedStrategies, newStrategy]);
      
      toast({
        title: "Alignment Strategy Created!",
        description: `Alex designed a unity plan for ${challenge?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Strategy Failed",
        description: "Unable to generate alignment strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAligning(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Team Alignment Mastered!",
      description: "You've learned Alex's Unity Framework for bringing teams together!",
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
            src={getAnimationUrl('alex-team-unity.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              🤝
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's Unity Framework
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Unite teams around AI adoption with inclusive leadership
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Team Division', desc: 'Experience organizational misalignment', color: 'from-red-500/10 to-red-500/5', animation: 'alex-team-conflicts.mp4', fallback: '💔' },
            { title: 'Discover Unity Power', desc: 'Learn inclusive alignment strategies', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-unity-breakthrough.mp4', fallback: '🤝' },
            { title: 'Alex\'s Unified Team', desc: 'Witness collective commitment', color: 'from-green-500/10 to-green-500/5', animation: 'alex-team-success.mp4', fallback: '🌟' }
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
            Begin Alex's Unity Journey
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
        lessonTitle="Unity Framework"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-unity-narrative"
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
        lessonTitle="Unity Framework"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Unity Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Alignment Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Unity Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Challenge Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Alignment Challenge</label>
                <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your team alignment challenge..." />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Context */}
              <div>
                <label className="block text-sm font-medium mb-2">Team Context & Dynamics</label>
                <Textarea
                  placeholder="Describe your team: size, roles, current attitudes toward AI, specific concerns or resistance points..."
                  value={teamContext}
                  onChange={(e) => setTeamContext(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Alignment Goals */}
              <div>
                <label className="block text-sm font-medium mb-2">Alignment Objectives</label>
                <Textarea
                  placeholder="What specific outcomes do you want? (e.g., 80% tool adoption, unified vision, reduced resistance...)"
                  value={alignmentGoals}
                  onChange={(e) => setAlignmentGoals(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateStrategy}
                disabled={!selectedChallenge || !teamContext.trim() || isAligning}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isAligning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is designing your unity strategy...
                  </>
                ) : (
                  <>
                    <HandHeart className="w-4 h-4 mr-2" />
                    Create Unity Strategy with Alex
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                Your Unity Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedStrategies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No unity strategies created yet.</p>
                  <p className="text-sm">Generate your first strategy to bring your team together!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedStrategies.map((strategy) => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{strategy.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Unity Plan</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                        {strategy.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedStrategies.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Team Alignment Workshop
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

export default AlexTeamAlignment;