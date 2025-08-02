import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Map, Calendar, DollarSign, Users, Save, Copy, CheckCircle } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

type Phase = 'intro' | 'narrative' | 'workshop';

interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: string;
  complexity: 'low' | 'medium' | 'high';
}

const RachelAutomationPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [projectScope, setProjectScope] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [roadmaps, setRoadmaps] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isPlanning, setIsPlanning] = useState(false);

  const roadmapPhases: RoadmapPhase[] = [
    {
      id: 'assessment',
      name: 'Process Assessment & Mapping',
      description: 'Identify and prioritize automation opportunities',
      icon: Map,
      duration: '2-4 weeks',
      complexity: 'low'
    },
    {
      id: 'pilot',
      name: 'Pilot Implementation',
      description: 'Start with low-risk, high-impact quick wins',
      icon: CheckCircle,
      duration: '4-8 weeks',
      complexity: 'medium'
    },
    {
      id: 'scaling',
      name: 'Scaling & Integration',
      description: 'Expand successful pilots across the organization',
      icon: Users,
      duration: '3-6 months',
      complexity: 'high'
    },
    {
      id: 'optimization',
      name: 'Optimization & Maintenance',
      description: 'Continuous improvement and system maintenance',
      icon: DollarSign,
      duration: 'Ongoing',
      complexity: 'medium'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I learned the hard way that jumping into automation without a plan is like trying to renovate a house while living in it.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "My first attempt was chaos. I tried to automate everything at once - email, scheduling, reporting, donor management.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Projects overlapped, timelines exploded, and my team was confused. Half the automations broke because they depended on systems we were still changing.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "That's when I discovered the power of phased implementation. Start small, prove value, then scale systematically.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "Now I follow a structured roadmap: assess, pilot, scale, optimize. Each phase builds on the last, minimizing risk while maximizing learning.",
      emotion: 'confident' as const
    },
    {
      id: '6',
      content: "Our latest automation project delivered ROI in 6 weeks instead of 6 months. Let me show you how to build your roadmap.",
      emotion: 'excited' as const
    }
  ];

  const createRoadmap = async () => {
    if (!selectedPhase || !projectScope) return;
    
    setIsPlanning(true);
    try {
      const phase = roadmapPhases.find(p => p.id === selectedPhase);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'automation-roadmap',
          topic: `${phase?.name} implementation plan`,
          context: `Rachel Thompson needs a detailed roadmap for ${phase?.name} phase. Project scope: ${projectScope}. Timeline: ${timeline}. Budget: ${budget}. Team size: ${teamSize}. Provide specific milestones, deliverables, risk mitigation strategies, and success metrics.`
        }
      });

      if (error) throw error;

      const newRoadmap = {
        id: `roadmap-${Date.now()}`,
        name: `${phase?.name} Roadmap`,
        content: data.content
      };

      setRoadmaps([...roadmaps, newRoadmap]);
      
      toast({
        title: "Roadmap Created!",
        description: `Rachel created an implementation roadmap for ${phase?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error creating roadmap:', error);
      toast({
        title: "Planning Failed",
        description: "Unable to create roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const copyRoadmap = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Roadmap Copied!",
        description: "Implementation roadmap copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy roadmap.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Automation Planning Complete!",
      description: "You've mastered Rachel's systematic approach to automation implementation!",
    });
    navigate('/chapter/5');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Rachel Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('rachel-planning-focus.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              📋
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Automation Planning Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create systematic roadmaps for successful automation implementation
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s Planning Chaos', desc: 'Experience unstructured automation attempts', color: 'from-red-500/10 to-red-500/5', animation: 'rachel-chaos-overwhelm.mp4', fallback: '😵‍💫' },
            { title: 'Discover Systematic Planning', desc: 'Learn phased implementation strategies', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-strategic-planning.mp4', fallback: '📋' },
            { title: 'Rachel\'s Roadmap Success', desc: 'See structured automation triumph', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-roadmap-victory.mp4', fallback: '🎯' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Rachel's Planning Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={5}
        chapterTitle="Rachel's Workflow Automation Mastery"
        lessonTitle="Automation Planning Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-planning-narrative"
          characterName="Rachel"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={5}
        chapterTitle="Rachel's Workflow Automation Mastery"
        lessonTitle="Automation Planning Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Automation Planning Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Roadmap Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-teal-600" />
                Implementation Roadmap Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phase Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Implementation Phase</label>
                <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a roadmap phase..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roadmapPhases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        <div className="flex items-center gap-2">
                          <phase.icon className="w-4 h-4" />
                          {phase.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <Input
                    placeholder="e.g., 3 months"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <Input
                    placeholder="e.g., $10-50k"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Team Size</label>
                <Input
                  placeholder="e.g., 3-5 people"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                />
              </div>

              {/* Project Scope */}
              <div>
                <label className="block text-sm font-medium mb-2">Project Scope & Goals</label>
                <Textarea
                  placeholder="Describe the automation project scope, key objectives, and expected outcomes..."
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Create Button */}
              <Button 
                onClick={createRoadmap}
                disabled={!selectedPhase || !projectScope || isPlanning}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isPlanning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is creating your roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Implementation Roadmap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Roadmaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Implementation Roadmaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roadmaps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No roadmaps created yet.</p>
                  <p className="text-sm">Select a phase and create your first implementation plan!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roadmaps.map((roadmap) => (
                    <div key={roadmap.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{roadmap.name}</h4>
                        <Button 
                          onClick={() => copyRoadmap(roadmap.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        <TemplateContentFormatter 
                          content={roadmap.content}
                          contentType="general"
                          variant="compact"
                          showMergeFieldTypes={false}
                          className="formatted-ai-content"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Phase Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Phase Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {roadmapPhases.map((phase, index) => (
                <div key={phase.id} className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <phase.icon className="w-full h-full text-teal-600" />
                  </div>
                  <Badge variant="secondary" className="mb-2">{index + 1}</Badge>
                  <h4 className="font-semibold mb-2">{phase.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>Duration: {phase.duration}</div>
                    <Badge 
                      variant={phase.complexity === 'high' ? 'destructive' : phase.complexity === 'medium' ? 'outline' : 'secondary'}
                      className="mt-1"
                    >
                      {phase.complexity} complexity
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Button */}
        {roadmaps.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Automation Planning Workshop
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

export default RachelAutomationPlanning;