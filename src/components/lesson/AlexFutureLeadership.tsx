import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Compass, Rocket, Star, TrendingUp, Globe } from 'lucide-react';
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

interface RoadmapCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexFutureLeadership: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('');
  const [organizationVision, setOrganizationVision] = useState('');
  const [sustainabilityGoals, setSustainabilityGoals] = useState('');
  const [generatedRoadmaps, setGeneratedRoadmaps] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const roadmapCategories: RoadmapCategory[] = [
    {
      id: 'short-term',
      name: '6-Month Sprint',
      description: 'Quick wins and foundation building',
      icon: Rocket,
      examples: ['Pilot programs', 'Initial training', 'Quick victories']
    },
    {
      id: 'medium-term',
      name: '18-Month Transformation',
      description: 'Comprehensive organizational change',
      icon: TrendingUp,
      examples: ['Full deployment', 'Culture shift', 'Process integration']
    },
    {
      id: 'long-term',
      name: '3-Year Innovation Leadership',
      description: 'Market leadership and advanced capabilities',
      icon: Star,
      examples: ['Industry innovation', 'Competitive advantage', 'Thought leadership']
    },
    {
      id: 'legacy-building',
      name: '5+ Year Legacy Framework',
      description: 'Sustainable transformation and institutional change',
      icon: Globe,
      examples: ['Institutional memory', 'Knowledge transfer', 'Enduring impact']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "The biggest challenge in AI transformation isn't the first year - it's building something that lasts.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I've seen too many organizations start strong with AI initiatives, only to lose momentum and fall back to old ways.",
      emotion: 'concerned' as const
    },
    {
      id: '3',
      content: "Early in my leadership journey, I focused on immediate wins but didn't think about sustainability.",
      emotion: 'regretful' as const
    },
    {
      id: '4',
      content: "That's when I realized leaders need to build roadmaps that outlast their tenure.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "I developed the Future-Ready Leadership Framework - creating sustainable AI roadmaps for long-term success.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now our AI transformation is designed to evolve and improve for decades. Let me show you how to build that legacy.",
      emotion: 'accomplished' as const
    }
  ];

  const buildRoadmap = async () => {
    if (!selectedTimeframe || !organizationVision.trim()) return;
    
    setIsBuilding(true);
    try {
      const timeframe = roadmapCategories.find(c => c.id === selectedTimeframe);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'future-roadmap',
          topic: `${timeframe?.name} AI leadership roadmap`,
          context: `Alex Rivera at National Advocacy Coalition needs sustainable AI roadmap for ${timeframe?.name.toLowerCase()}. Organization vision: ${organizationVision}. Sustainability goals: ${sustainabilityGoals}. Create comprehensive roadmap with milestones, success metrics, and long-term sustainability strategies.`
        }
      });

      if (error) throw error;

      const newRoadmap = {
        id: `roadmap-${Date.now()}`,
        name: `${timeframe?.name} Roadmap`,
        content: data.content
      };

      setGeneratedRoadmaps([...generatedRoadmaps, newRoadmap]);
      
      toast({
        title: "Future Roadmap Created!",
        description: `Alex designed a sustainable ${timeframe?.name.toLowerCase()} plan.`,
      });
    } catch (error) {
      console.error('Error building roadmap:', error);
      toast({
        title: "Roadmap Failed",
        description: "Unable to build roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Future Leadership Mastered!",
      description: "You've learned Alex's approach to building sustainable AI roadmaps!",
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
            src={getAnimationUrl('alex-future-vision.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              🌟
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's Future-Ready Leadership Framework
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build sustainable AI roadmaps for long-term success
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Sustainability Crisis', desc: 'Experience short-term thinking pitfalls', color: 'from-red-500/10 to-red-500/5', animation: 'alex-unsustainable-approach.mp4', fallback: '⚠️' },
            { title: 'Discover Future Planning', desc: 'Learn sustainable roadmap building', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-future-clarity.mp4', fallback: '🔮' },
            { title: 'Alex\'s Legacy Leadership', desc: 'Witness enduring transformation', color: 'from-green-500/10 to-green-500/5', animation: 'alex-legacy-success.mp4', fallback: '🏛️' }
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
            Begin Alex's Future Journey
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
        lessonTitle="Future-Ready Leadership Framework"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-future-narrative"
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
        lessonTitle="Future-Ready Leadership Framework"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Future Planning Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Roadmap Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                Future Roadmap Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeframe Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Planning Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your planning horizon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roadmapCategories.map((category) => (
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

              {/* Organization Vision */}
              <div>
                <label className="block text-sm font-medium mb-2">Long-term Organizational Vision</label>
                <Textarea
                  placeholder="Describe your organization's future vision: What impact do you want to achieve? How will AI enable your mission?"
                  value={organizationVision}
                  onChange={(e) => setOrganizationVision(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Sustainability Goals */}
              <div>
                <label className="block text-sm font-medium mb-2">Sustainability Priorities</label>
                <Textarea
                  placeholder="What needs to be sustainable? (e.g., funding model, staff capabilities, technology infrastructure, organizational culture...)"
                  value={sustainabilityGoals}
                  onChange={(e) => setSustainabilityGoals(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Build Button */}
              <Button 
                onClick={buildRoadmap}
                disabled={!selectedTimeframe || !organizationVision.trim() || isBuilding}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isBuilding ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is building your future roadmap...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Build Future Roadmap with Alex
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Roadmaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Your Future Roadmaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedRoadmaps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Compass className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No future roadmaps created yet.</p>
                  <p className="text-sm">Build your first roadmap to guide long-term AI transformation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedRoadmaps.map((roadmap) => (
                    <div key={roadmap.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{roadmap.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Roadmap</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                        {roadmap.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedRoadmaps.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Future Leadership Workshop
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

export default AlexFutureLeadership;