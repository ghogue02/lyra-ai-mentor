import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Shield, Crown, Brain, Heart, Zap } from 'lucide-react';
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

interface FrameworkCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexLeadershipFramework: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [leadershipContext, setLeadershipContext] = useState('');
  const [organizationGoals, setOrganizationGoals] = useState('');
  const [generatedFrameworks, setGeneratedFrameworks] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const frameworkCategories: FrameworkCategory[] = [
    {
      id: 'ai-ethics-governance',
      name: 'AI Ethics & Governance',
      description: 'Responsible AI leadership principles',
      icon: Shield,
      examples: ['Ethical AI guidelines', 'Bias prevention', 'Transparency protocols']
    },
    {
      id: 'change-leadership',
      name: 'Change Leadership Model',
      description: 'Leading transformation with AI assistance',
      icon: Crown,
      examples: ['Change communication', 'Resistance management', 'Cultural evolution']
    },
    {
      id: 'decision-intelligence',
      name: 'Decision Intelligence Framework',
      description: 'AI-enhanced decision making processes',
      icon: Brain,
      examples: ['Data-driven decisions', 'AI insights integration', 'Risk assessment']
    },
    {
      id: 'people-first-ai',
      name: 'People-First AI Leadership',
      description: 'Human-centered approach to AI adoption',
      icon: Heart,
      examples: ['Employee empowerment', 'Skill development', 'Wellbeing focus']
    },
    {
      id: 'innovation-acceleration',
      name: 'Innovation Acceleration',
      description: 'Rapid innovation with AI capabilities',
      icon: Zap,
      examples: ['Experimentation culture', 'Fast iteration', 'Learning cycles']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After 18 months of AI transformation at the National Advocacy Coalition, I realized something crucial.",
      emotion: 'reflective' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "All the tools, processes, and strategies in the world don't matter without a solid leadership framework.",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "I was making decisions reactively, handling each AI challenge as it came up, without consistent principles.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "That's when I developed the AI Leadership Framework - a systematic approach to leading in the age of AI.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "It combines ethical governance, people-first principles, and innovation acceleration into one cohesive system.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now every decision aligns with our values and drives sustainable progress. Let me show you how to build yours.",
      emotion: 'accomplished' as const
    }
  ];

  const buildFramework = async () => {
    if (!selectedFramework || !leadershipContext.trim()) return;
    
    setIsBuilding(true);
    try {
      const framework = frameworkCategories.find(c => c.id === selectedFramework);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'leadership-framework',
          topic: `${framework?.name} leadership framework for AI transformation`,
          context: `Alex Rivera at National Advocacy Coalition needs comprehensive leadership framework for ${framework?.name.toLowerCase()}. Leadership context: ${leadershipContext}. Organization goals: ${organizationGoals}. Create practical framework with principles, practices, and implementation guidelines.`
        }
      });

      if (error) throw error;

      const newFramework = {
        id: `framework-${Date.now()}`,
        name: `${framework?.name} Framework`,
        content: data.content
      };

      setGeneratedFrameworks([...generatedFrameworks, newFramework]);
      
      toast({
        title: "Leadership Framework Created!",
        description: `Alex designed a comprehensive ${framework?.name.toLowerCase()} framework.`,
      });
    } catch (error) {
      console.error('Error building framework:', error);
      toast({
        title: "Framework Failed",
        description: "Unable to build framework. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Leadership Framework Mastered!",
      description: "You've learned Alex's systematic approach to AI leadership!",
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
            src={getAnimationUrl('alex-leadership-mastery.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              👑
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's AI Leadership Framework
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Establish principled leadership practices for the AI era
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Leadership Chaos', desc: 'Experience reactive leadership challenges', color: 'from-red-500/10 to-red-500/5', animation: 'alex-reactive-leadership.mp4', fallback: '🌀' },
            { title: 'Discover Framework Power', desc: 'Learn systematic leadership principles', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-framework-discovery.mp4', fallback: '🏗️' },
            { title: 'Alex\'s Leadership Mastery', desc: 'Witness principled transformation success', color: 'from-green-500/10 to-green-500/5', animation: 'alex-leadership-excellence.mp4', fallback: '👑' }
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
            Begin Alex's Framework Journey
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
        lessonTitle="AI Leadership Framework"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-framework-narrative"
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
        lessonTitle="AI Leadership Framework"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Framework Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Framework Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-indigo-600" />
                Leadership Framework Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Framework Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Framework Focus Area</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your leadership framework focus..." />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworkCategories.map((category) => (
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

              {/* Leadership Context */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Leadership Context</label>
                <Textarea
                  placeholder="Describe your leadership role, responsibilities, and the specific AI leadership challenges you face..."
                  value={leadershipContext}
                  onChange={(e) => setLeadershipContext(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Organization Goals */}
              <div>
                <label className="block text-sm font-medium mb-2">Organization Goals & Values</label>
                <Textarea
                  placeholder="What are your organization's core values and strategic objectives? How should AI support these?"
                  value={organizationGoals}
                  onChange={(e) => setOrganizationGoals(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Build Button */}
              <Button 
                onClick={buildFramework}
                disabled={!selectedFramework || !leadershipContext.trim() || isBuilding}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isBuilding ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is building your framework...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Build Leadership Framework with Alex
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Frameworks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Your Leadership Frameworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedFrameworks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Crown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No leadership frameworks created yet.</p>
                  <p className="text-sm">Build your first framework to establish principled AI leadership!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedFrameworks.map((framework) => (
                    <div key={framework.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{framework.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Framework</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                        {framework.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedFrameworks.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Leadership Framework Workshop
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

export default AlexLeadershipFramework;