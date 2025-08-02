import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Target, Users, Workflow, BarChart, Save, Copy } from 'lucide-react';
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

interface AutomationOpportunity {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  timeInvested: string;
  timeSaved: string;
  impact: 'high' | 'medium' | 'low';
}

const RachelAutomationVision: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [processDescription, setProcessDescription] = useState('');
  const [automationOpportunities, setAutomationOpportunities] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processCategories: AutomationOpportunity[] = [
    {
      id: 'data-entry',
      name: 'Data Entry & Collection',
      description: 'Transform manual data tasks into automated workflows',
      icon: Target,
      timeInvested: '20 hours/week',
      timeSaved: '16 hours/week',
      impact: 'high'
    },
    {
      id: 'communication',
      name: 'Communication Workflows',
      description: 'Automate repetitive communications while preserving human touch',
      icon: Users,
      timeInvested: '15 hours/week',
      timeSaved: '12 hours/week',
      impact: 'high'
    },
    {
      id: 'reporting',
      name: 'Report Generation',
      description: 'Create automated reporting systems with human oversight',
      icon: BarChart,
      timeInvested: '10 hours/week',
      timeSaved: '8 hours/week',
      impact: 'medium'
    },
    {
      id: 'scheduling',
      name: 'Scheduling & Coordination',
      description: 'Build intelligent scheduling systems that respect human preferences',
      icon: Workflow,
      timeInvested: '8 hours/week',
      timeSaved: '6 hours/week',
      impact: 'medium'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I used to be terrified of automation. I thought it would make our work less human.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "My team at Green Future Alliance was drowning in manual processes - data entry, scheduling, endless reports.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '3',
      content: "People were burning out. Our mission was suffering because we spent more time on admin than actual impact.",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "That's when I discovered human-centered automation. The key insight? Technology should amplify human potential, not replace it.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "We started with one simple automation - volunteer scheduling. Suddenly, our coordinator had 10 extra hours per week for relationship building.",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "Now we've automated 60% of our manual processes, but our work has never been more human-centered. Let me show you how.",
      emotion: 'hopeful' as const
    }
  ];

  const analyzeProcess = async () => {
    if (!selectedProcess || !processDescription) return;
    
    setIsAnalyzing(true);
    try {
      const process = processCategories.find(p => p.id === selectedProcess);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'automation-analysis',
          topic: `${process?.name} automation strategy`,
          context: `Rachel Thompson at Green Future Alliance needs to automate: ${processDescription}. Focus on human-centered automation that enhances rather than replaces human work. Include specific steps, tools, and ROI calculations.`
        }
      });

      if (error) throw error;

      const newAnalysis = {
        id: `analysis-${Date.now()}`,
        name: `${process?.name} Automation Plan`,
        content: data.content
      };

      setAutomationOpportunities([...automationOpportunities, newAnalysis]);
      
      toast({
        title: "Automation Vision Created!",
        description: `Rachel mapped your ${process?.name.toLowerCase()} automation opportunity.`,
      });
    } catch (error) {
      console.error('Error analyzing process:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyAnalysis = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Analysis Copied!",
        description: "Automation plan copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy analysis.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Automation Vision Complete!",
      description: "You've mastered Rachel's human-centered automation approach!",
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
            src={getAnimationUrl('rachel-friendly-wave.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              🤖
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Automation Vision Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Map automation opportunities that enhance human potential
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s Process Chaos', desc: 'Experience overwhelming manual work', color: 'from-red-500/10 to-red-500/5', animation: 'rachel-process-chaos.mp4', fallback: '😰' },
            { title: 'Discover Automation Power', desc: 'Learn human-centered automation approach', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-automation-lightbulb.mp4', fallback: '💡' },
            { title: 'Rachel\'s Workflow Harmony', desc: 'Witness her transformation', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-workflow-harmony.mp4', fallback: '🚀' }
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
            Begin Rachel's Automation Journey
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
        lessonTitle="Automation Vision Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-automation-narrative"
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
        lessonTitle="Automation Vision Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Automation Vision Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Process Analyzer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600" />
                Process Automation Mapper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Process Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Process Category</label>
                <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a process to automate..." />
                  </SelectTrigger>
                  <SelectContent>
                    {processCategories.map((category) => (
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

              {/* Process Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Current Process</label>
                <Textarea
                  placeholder="Describe the manual process you want to automate... Include pain points, time spent, and human touchpoints that must be preserved."
                  value={processDescription}
                  onChange={(e) => setProcessDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Analyze Button */}
              <Button 
                onClick={analyzeProcess}
                disabled={!selectedProcess || !processDescription || isAnalyzing}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is mapping automation opportunities...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Map Automation Opportunities
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Automation Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Automation Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {automationOpportunities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No automation plans created yet.</p>
                  <p className="text-sm">Map your first process to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {automationOpportunities.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plan.name}</h4>
                        <Button 
                          onClick={() => copyAnalysis(plan.content)}
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

        {/* ROI Calculator */}
        {selectedProcess && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                Automation ROI Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const process = processCategories.find(p => p.id === selectedProcess);
                if (!process) return null;
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{process.timeInvested}</div>
                      <div className="text-sm text-gray-600">Current Time Investment</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{process.timeSaved}</div>
                      <div className="text-sm text-gray-600">Potential Time Savings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 capitalize">{process.impact}</div>
                      <div className="text-sm text-gray-600">Expected Impact</div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Completion Button */}
        {automationOpportunities.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Automation Vision Workshop
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

export default RachelAutomationVision;