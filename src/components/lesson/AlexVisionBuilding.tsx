import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Eye, Target, Users, Lightbulb, Star } from 'lucide-react';
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

interface VisionCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexVisionBuilding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState<string>('');
  const [currentState, setCurrentState] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [generatedVisions, setGeneratedVisions] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isCreating, setIsCreating] = useState(false);

  const visionCategories: VisionCategory[] = [
    {
      id: 'ai-transformation',
      name: 'AI-Powered Future',
      description: 'Vision for comprehensive AI integration',
      icon: Sparkles,
      examples: ['Smart automation', 'Data-driven decisions', 'Enhanced capabilities']
    },
    {
      id: 'stakeholder-unity',
      name: 'Stakeholder Alignment',
      description: 'Unified direction for diverse groups',
      icon: Users,
      examples: ['Shared purpose', 'Common goals', 'Collective action']
    },
    {
      id: 'organizational-impact',
      name: 'Mission Impact',
      description: 'Amplified organizational effectiveness',
      icon: Target,
      examples: ['Greater reach', 'Improved outcomes', 'Sustainable growth']
    },
    {
      id: 'innovation-culture',
      name: 'Innovation Culture',
      description: 'Embracing change and continuous improvement',
      icon: Lightbulb,
      examples: ['Learning mindset', 'Adaptation readiness', 'Creative solutions']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "When I started at the National Advocacy Coalition, everyone had different ideas about our future.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Board members focused on funding, staff worried about workload, community partners had their own priorities.",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "Without a shared vision, every AI initiative became a debate. We were pulling in different directions.",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "I realized I needed to create a vision that spoke to everyone's core values and aspirations.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "So I developed the Vision Clarity Framework - a systematic approach to building inspiring, unifying visions.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now our entire organization is aligned around a shared AI future. Let me show you how to create that clarity.",
      emotion: 'accomplished' as const
    }
  ];

  const createVision = async () => {
    if (!selectedFocus || !currentState.trim()) return;
    
    setIsCreating(true);
    try {
      const focus = visionCategories.find(c => c.id === selectedFocus);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'vision-statement',
          topic: `${focus?.name} vision for organizational transformation`,
          context: `Alex Rivera at National Advocacy Coalition needs to create compelling vision for ${focus?.name.toLowerCase()}. Current state: ${currentState}. Stakeholders: ${stakeholders}. Create inspiring, actionable vision that unifies diverse groups around common purpose.`
        }
      });

      if (error) throw error;

      const newVision = {
        id: `vision-${Date.now()}`,
        name: `${focus?.name} Vision`,
        content: data.content
      };

      setGeneratedVisions([...generatedVisions, newVision]);
      
      toast({
        title: "Vision Created!",
        description: `Alex crafted an inspiring ${focus?.name.toLowerCase()} vision.`,
      });
    } catch (error) {
      console.error('Error creating vision:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create vision. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Vision Building Mastered!",
      description: "You've learned Alex's approach to creating compelling organizational visions!",
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
            src={getAnimationUrl('alex-vision-clarity.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              👁️
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's Vision Clarity Framework
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create compelling visions that unite diverse stakeholders
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Vision Confusion', desc: 'Experience organizational misalignment', color: 'from-red-500/10 to-red-500/5', animation: 'alex-confusion-chaos.mp4', fallback: '🌀' },
            { title: 'Discover Vision Power', desc: 'Learn systematic vision creation', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-vision-moment.mp4', fallback: '💡' },
            { title: 'Alex\'s Unity Success', desc: 'Witness stakeholder alignment', color: 'from-green-500/10 to-green-500/5', animation: 'alex-unified-team.mp4', fallback: '🤝' }
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
            Begin Alex's Vision Journey
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
        lessonTitle="Vision Clarity Framework"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-vision-narrative"
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
        lessonTitle="Vision Clarity Framework"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Vision Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Vision Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Vision Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vision Focus Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Vision Focus</label>
                <Select value={selectedFocus} onValueChange={setSelectedFocus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your vision focus area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {visionCategories.map((category) => (
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

              {/* Current State */}
              <div>
                <label className="block text-sm font-medium mb-2">Current State & Context</label>
                <Textarea
                  placeholder="Describe your organization's current situation, challenges, and what needs to change..."
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Stakeholders */}
              <div>
                <label className="block text-sm font-medium mb-2">Key Stakeholders</label>
                <Textarea
                  placeholder="Who needs to be aligned? (board, staff, community, partners, etc.)"
                  value={stakeholders}
                  onChange={(e) => setStakeholders(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Create Button */}
              <Button 
                onClick={createVision}
                disabled={!selectedFocus || !currentState.trim() || isCreating}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isCreating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is crafting your vision...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Create Inspiring Vision with Alex
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Visions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Your Vision Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedVisions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No visions created yet.</p>
                  <p className="text-sm">Build your first vision to unite your stakeholders!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVisions.map((vision) => (
                    <div key={vision.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{vision.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Vision</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                        {vision.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedVisions.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Vision Building Workshop
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

export default AlexVisionBuilding;