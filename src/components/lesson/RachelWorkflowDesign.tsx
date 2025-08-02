import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, GitBranch, ArrowRight, Zap, Settings, Save, Copy } from 'lucide-react';
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
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

type Phase = 'intro' | 'narrative' | 'workshop';

interface WorkflowPattern {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  triggers: string[];
  actions: string[];
  humanTouchpoints: string[];
}

const RachelWorkflowDesign: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowDesigns, setWorkflowDesigns] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isDesigning, setIsDesigning] = useState(false);

  const workflowPatterns: WorkflowPattern[] = [
    {
      id: 'trigger-action',
      name: 'Trigger-Action Workflows',
      description: 'Simple if-this-then-that automations with human oversight',
      icon: Zap,
      triggers: ['Email received', 'Form submitted', 'Calendar event', 'File uploaded'],
      actions: ['Send notification', 'Create task', 'Update database', 'Generate report'],
      humanTouchpoints: ['Approval gates', 'Quality review', 'Exception handling']
    },
    {
      id: 'sequential',
      name: 'Sequential Processing',
      description: 'Step-by-step workflows with checkpoints',
      icon: ArrowRight,
      triggers: ['Process initiation', 'Previous step completion', 'Time-based schedule'],
      actions: ['Data validation', 'Status updates', 'Document generation', 'Notifications'],
      humanTouchpoints: ['Stage approvals', 'Manual review', 'Decision points']
    },
    {
      id: 'parallel',
      name: 'Parallel Processing',
      description: 'Multiple simultaneous workflows that converge',
      icon: GitBranch,
      triggers: ['Batch processing', 'Multiple inputs', 'Parallel tasks'],
      actions: ['Concurrent execution', 'Data aggregation', 'Status synchronization'],
      humanTouchpoints: ['Conflict resolution', 'Priority management', 'Final review']
    },
    {
      id: 'adaptive',
      name: 'Adaptive Workflows',
      description: 'Smart workflows that adjust based on conditions',
      icon: Settings,
      triggers: ['Conditional logic', 'Business rules', 'Performance metrics'],
      actions: ['Dynamic routing', 'Load balancing', 'Optimization adjustments'],
      humanTouchpoints: ['Rule configuration', 'Performance monitoring', 'Strategic decisions']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I used to think workflow design was just drawing flowcharts. Boy, was I wrong.",
      emotion: 'amused' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "My first automation workflows were rigid and brittle. Every edge case broke them, and my team spent more time fixing workflows than benefiting from them.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "The breakthrough came when I realized workflows aren't just about process flow - they're about designing intelligent systems that work with humans.",
      emotion: 'enlightened' as const
    },
    {
      id: '4',
      content: "Good workflow design anticipates problems, provides escape hatches, and maintains human agency at every critical decision point.",
      emotion: 'confident' as const
    },
    {
      id: '5',
      content: "Now our workflows handle 90% of routine cases automatically, but always know when to ask for human judgment.",
      emotion: 'proud' as const
    },
    {
      id: '6',
      content: "The secret is building workflows that are both powerful and humble. Let me show you how.",
      emotion: 'excited' as const
    }
  ];

  const designWorkflow = async () => {
    if (!selectedPattern || !workflowDescription) return;
    
    setIsDesigning(true);
    try {
      const pattern = workflowPatterns.find(p => p.id === selectedPattern);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'workflow-design',
          topic: `${pattern?.name} workflow architecture`,
          context: `Rachel Thompson needs to design a ${pattern?.name} workflow for: ${workflowDescription}. Include specific triggers: ${pattern?.triggers.join(', ')}, actions: ${pattern?.actions.join(', ')}, and human touchpoints: ${pattern?.humanTouchpoints.join(', ')}. Provide detailed workflow diagram, implementation steps, error handling, and monitoring strategies.`
        }
      });

      if (error) throw error;

      const newDesign = {
        id: `workflow-${Date.now()}`,
        name: `${pattern?.name} Design`,
        content: data.content
      };

      setWorkflowDesigns([...workflowDesigns, newDesign]);
      
      toast({
        title: "Workflow Design Created!",
        description: `Rachel designed a ${pattern?.name.toLowerCase()} workflow for you.`,
      });
    } catch (error) {
      console.error('Error designing workflow:', error);
      toast({
        title: "Design Failed",
        description: "Unable to design workflow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDesigning(false);
    }
  };

  const copyDesign = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Workflow Design Copied!",
        description: "Workflow design copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy workflow design.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Workflow Design Complete!",
      description: "You've mastered Rachel's intelligent workflow design system!",
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
            src={getAnimationUrl('rachel-workflow-design.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              🔄
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Workflow Design Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build intelligent workflow transformation systems
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s Brittle Workflows', desc: 'Experience rigid automation failures', color: 'from-red-500/10 to-red-500/5', animation: 'rachel-workflow-break.mp4', fallback: '💥' },
            { title: 'Discover Intelligent Design', desc: 'Learn adaptive workflow patterns', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-smart-workflow.mp4', fallback: '🧠' },
            { title: 'Rachel\'s Flexible Systems', desc: 'Witness intelligent automation', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-workflow-success.mp4', fallback: '⚡' }
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
            Begin Rachel's Workflow Journey
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
        lessonTitle="Workflow Design Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-workflow-narrative"
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
        lessonTitle="Workflow Design Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Workflow Design Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Workflow Designer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-teal-600" />
                Intelligent Workflow Designer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pattern Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Workflow Pattern</label>
                <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workflow pattern..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowPatterns.map((pattern) => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        <div className="flex items-center gap-2">
                          <pattern.icon className="w-4 h-4" />
                          {pattern.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Workflow Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Workflow Challenge</label>
                <Textarea
                  placeholder="Describe the process you want to transform into an intelligent workflow... Include current pain points, decision points, and exception scenarios."
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Pattern Preview */}
              {selectedPattern && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">
                    {workflowPatterns.find(p => p.id === selectedPattern)?.name} Pattern
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {workflowPatterns.find(p => p.id === selectedPattern)?.description}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {(() => {
                      const pattern = workflowPatterns.find(p => p.id === selectedPattern);
                      if (!pattern) return null;
                      
                      return (
                        <>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Triggers</div>
                            <div className="flex flex-wrap gap-1">
                              {pattern.triggers.map((trigger, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Actions</div>
                            <div className="flex flex-wrap gap-1">
                              {pattern.actions.map((action, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Human Touchpoints</div>
                            <div className="flex flex-wrap gap-1">
                              {pattern.humanTouchpoints.map((touchpoint, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">
                                  {touchpoint}
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

              {/* Design Button */}
              <Button 
                onClick={designWorkflow}
                disabled={!selectedPattern || !workflowDescription || isDesigning}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isDesigning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is designing your workflow...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Design Intelligent Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Workflow Designs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Workflow Designs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workflowDesigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No workflow designs created yet.</p>
                  <p className="text-sm">Select a pattern and create your first intelligent workflow!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowDesigns.map((design) => (
                    <div key={design.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{design.name}</h4>
                        <Button 
                          onClick={() => copyDesign(design.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        <TemplateContentFormatter 
                          content={design.content}
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

        {/* Workflow Patterns Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Workflow Pattern Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowPatterns.map((pattern) => (
                <div key={pattern.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <pattern.icon className="w-full h-full text-teal-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{pattern.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                  <div className="text-xs text-gray-500">
                    <div className="mb-1">
                      <strong>Triggers:</strong> {pattern.triggers.length}
                    </div>
                    <div className="mb-1">
                      <strong>Actions:</strong> {pattern.actions.length}
                    </div>
                    <div>
                      <strong>Human Points:</strong> {pattern.humanTouchpoints.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Button */}
        {workflowDesigns.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Workflow Design Workshop
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

export default RachelWorkflowDesign;