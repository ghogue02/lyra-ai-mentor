import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, TrendingUp, Users, Database, Shield, Save, Copy, BarChart3 } from 'lucide-react';
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

interface ScalingDimension {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  challenges: string[];
  solutions: string[];
  metrics: string[];
}

const RachelScalingSystems: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState<string>('');
  const [scalingContext, setScalingContext] = useState('');
  const [currentScale, setCurrentScale] = useState('');
  const [targetScale, setTargetScale] = useState('');
  const [scalingPlans, setScalingPlans] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isScaling, setIsScaling] = useState(false);

  const scalingDimensions: ScalingDimension[] = [
    {
      id: 'volume',
      name: 'Volume Scaling',
      description: 'Handle increased transaction volume and data processing',
      icon: TrendingUp,
      challenges: ['Performance degradation', 'Resource bottlenecks', 'Processing delays'],
      solutions: ['Load balancing', 'Queue management', 'Caching strategies', 'Database optimization'],
      metrics: ['Transactions per hour', 'Response time', 'Error rate', 'Resource utilization']
    },
    {
      id: 'users',
      name: 'User Scaling',
      description: 'Support growing number of users and concurrent access',
      icon: Users,
      challenges: ['Concurrent access', 'User management', 'Permission complexity'],
      solutions: ['Session management', 'Role-based access', 'User onboarding automation', 'Support scaling'],
      metrics: ['Active users', 'Concurrent sessions', 'Onboarding time', 'Support tickets']
    },
    {
      id: 'data',
      name: 'Data Scaling',
      description: 'Manage exponential growth in data storage and processing',
      icon: Database,
      challenges: ['Storage costs', 'Query performance', 'Data integrity', 'Backup complexity'],
      solutions: ['Data archiving', 'Indexing optimization', 'Distributed storage', 'Automated cleanup'],
      metrics: ['Data growth rate', 'Query performance', 'Storage costs', 'Backup success rate']
    },
    {
      id: 'complexity',
      name: 'Complexity Scaling',
      description: 'Handle increasing system complexity and dependencies',
      icon: Shield,
      challenges: ['Integration points', 'Maintenance overhead', 'Error propagation', 'Debugging difficulty'],
      solutions: ['Microservices architecture', 'API management', 'Monitoring systems', 'Documentation automation'],
      metrics: ['System dependencies', 'Mean time to recovery', 'Deployment frequency', 'Bug resolution time']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Success is wonderful until it breaks your systems. That's exactly what happened to us at Green Future Alliance.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our volunteer automation worked perfectly for 50 people. But when we grew to 500 volunteers, everything fell apart.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Emails were delayed by hours, the scheduling system crashed weekly, and our database was running out of space.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "I realized that automation isn't just about making things work - it's about making things that keep working as you grow.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "We rebuilt with scaling in mind: load balancing, data archiving, error recovery, and monitoring. Now we handle 2000+ volunteers smoothly.",
      emotion: 'proud' as const
    },
    {
      id: '6',
      content: "Scaling isn't just about bigger numbers - it's about building systems that gracefully handle growth. Let me show you how.",
      emotion: 'excited' as const
    }
  ];

  const createScalingPlan = async () => {
    if (!selectedDimension || !scalingContext) return;
    
    setIsScaling(true);
    try {
      const dimension = scalingDimensions.find(d => d.id === selectedDimension);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'scaling-strategy',
          topic: `${dimension?.name} scaling plan`,
          context: `Rachel Thompson needs a comprehensive scaling strategy for: ${scalingContext}. Current scale: ${currentScale}. Target scale: ${targetScale}. Focus on ${dimension?.name}. Address challenges: ${dimension?.challenges.join(', ')}. Implement solutions: ${dimension?.solutions.join(', ')}. Track metrics: ${dimension?.metrics.join(', ')}. Provide detailed implementation steps, timeline, risk mitigation, and monitoring strategies.`
        }
      });

      if (error) throw error;

      const newPlan = {
        id: `scaling-${Date.now()}`,
        name: `${dimension?.name} Strategy`,
        content: data.content
      };

      setScalingPlans([...scalingPlans, newPlan]);
      
      toast({
        title: "Scaling Plan Created!",
        description: `Rachel created a ${dimension?.name.toLowerCase()} strategy for you.`,
      });
    } catch (error) {
      console.error('Error creating scaling plan:', error);
      toast({
        title: "Planning Failed",
        description: "Unable to create scaling plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScaling(false);
    }
  };

  const copyPlan = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Scaling Plan Copied!",
        description: "Scaling strategy copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy scaling plan.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Scaling Systems Complete!",
      description: "You've mastered Rachel's comprehensive automation scaling approach!",
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
            src={getAnimationUrl('rachel-scaling-growth.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              📈
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Scaling Systems Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build comprehensive automation that scales with your growth
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s System Breakdown', desc: 'Experience automation collapse under growth', color: 'from-red-500/10 to-red-500/5', animation: 'rachel-system-crash.mp4', fallback: '💥' },
            { title: 'Discover Scaling Principles', desc: 'Learn growth-aware architecture', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-scaling-insights.mp4', fallback: '📊' },
            { title: 'Rachel\'s Scalable Empire', desc: 'Witness systems that grow gracefully', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-scaling-triumph.mp4', fallback: '🚀' }
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
            Begin Rachel's Scaling Journey
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
        lessonTitle="Scaling Systems Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-scaling-narrative"
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
        lessonTitle="Scaling Systems Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Scaling Systems Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Scaling Planner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Scaling Strategy Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dimension Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Scaling Dimension</label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scaling dimension..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scalingDimensions.map((dimension) => (
                      <SelectItem key={dimension.id} value={dimension.id}>
                        <div className="flex items-center gap-2">
                          <dimension.icon className="w-4 h-4" />
                          {dimension.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scale Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Scale</label>
                  <Input
                    placeholder="e.g., 100 users"
                    value={currentScale}
                    onChange={(e) => setCurrentScale(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Scale</label>
                  <Input
                    placeholder="e.g., 1000 users"
                    value={targetScale}
                    onChange={(e) => setTargetScale(e.target.value)}
                  />
                </div>
              </div>

              {/* Scaling Context */}
              <div>
                <label className="block text-sm font-medium mb-2">Scaling Context & Challenges</label>
                <Textarea
                  placeholder="Describe your current system, growth plans, pain points, and specific scaling challenges you're facing..."
                  value={scalingContext}
                  onChange={(e) => setScalingContext(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Dimension Preview */}
              {selectedDimension && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">
                    {scalingDimensions.find(d => d.id === selectedDimension)?.name} Overview
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {scalingDimensions.find(d => d.id === selectedDimension)?.description}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {(() => {
                      const dimension = scalingDimensions.find(d => d.id === selectedDimension);
                      if (!dimension) return null;
                      
                      return (
                        <>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Key Challenges</div>
                            <div className="flex flex-wrap gap-1">
                              {dimension.challenges.map((challenge, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">
                                  {challenge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Solutions</div>
                            <div className="flex flex-wrap gap-1">
                              {dimension.solutions.map((solution, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {solution}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Key Metrics</div>
                            <div className="flex flex-wrap gap-1">
                              {dimension.metrics.map((metric, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Create Button */}
              <Button 
                onClick={createScalingPlan}
                disabled={!selectedDimension || !scalingContext || isScaling}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isScaling ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is creating your scaling strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Scaling Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Scaling Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Scaling Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scalingPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No scaling plans created yet.</p>
                  <p className="text-sm">Select a dimension and create your first scaling strategy!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scalingPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Button 
                          onClick={() => copyPlan(plan.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        <TemplateContentFormatter 
                          content={plan.content}
                          contentType="article"
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

        {/* Scaling Dimensions Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Scaling Dimensions Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scalingDimensions.map((dimension) => (
                <div key={dimension.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <dimension.icon className="w-full h-full text-teal-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{dimension.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{dimension.description}</p>
                  <div className="text-xs text-gray-500">
                    <div className="mb-1">
                      <strong>Challenges:</strong> {dimension.challenges.length}
                    </div>
                    <div className="mb-1">
                      <strong>Solutions:</strong> {dimension.solutions.length}
                    </div>
                    <div>
                      <strong>Metrics:</strong> {dimension.metrics.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Button */}
        {scalingPlans.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Scaling Systems Workshop
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

export default RachelScalingSystems;