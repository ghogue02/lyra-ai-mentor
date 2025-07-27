import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Heart, Users, Shield, CheckCircle, Save, Copy } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

type Phase = 'intro' | 'narrative' | 'workshop';

interface DesignPrinciple {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  checklist: string[];
}

const RachelHumanCenteredDesign: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [designPlans, setDesignPlans] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isDesigning, setIsDesigning] = useState(false);

  const designPrinciples: DesignPrinciple[] = [
    {
      id: 'human-oversight',
      name: 'Human Oversight & Control',
      description: 'Ensure humans remain in control with meaningful intervention points',
      icon: Users,
      checklist: [
        'Humans can easily override automated decisions',
        'Clear visibility into automation logic',
        'Regular human review checkpoints',
        'Easy pause/stop mechanisms',
        'Human approval for sensitive actions'
      ]
    },
    {
      id: 'transparency',
      name: 'Transparency & Trust',
      description: 'Build systems that are understandable and trustworthy',
      icon: Shield,
      checklist: [
        'Clear documentation of what gets automated',
        'Visible audit trails and logs',
        'Plain language explanations of processes',
        'Error handling that explains issues',
        'Regular transparency reports'
      ]
    },
    {
      id: 'enhancement',
      name: 'Human Enhancement Focus',
      description: 'Design automation to amplify human capabilities',
      icon: Heart,
      checklist: [
        'Frees humans for higher-value work',
        'Reduces repetitive strain and burnout',
        'Enhances decision-making with better data',
        'Preserves meaningful human interactions',
        'Supports skill development and growth'
      ]
    },
    {
      id: 'accessibility',
      name: 'Accessibility & Inclusion',
      description: 'Ensure automation works for everyone on the team',
      icon: CheckCircle,
      checklist: [
        'Works across different technical skill levels',
        'Accessible interfaces and interactions',
        'Supports diverse working styles',
        'Provides multiple ways to accomplish tasks',
        'Includes comprehensive training and support'
      ]
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "When I first started automating processes, I made the classic mistake - I focused only on efficiency.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I built this beautiful volunteer scheduling system that saved hours... but volunteers hated it. It felt cold and impersonal.",
      emotion: 'disappointed' as const
    },
    {
      id: '3',
      content: "That's when I realized: automation without humanity is just expensive software that creates new problems.",
      emotion: 'enlightened' as const
    },
    {
      id: '4',
      content: "I learned to flip the question. Instead of 'How can we automate this?' I ask 'How can technology make our humans more effective?'",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "Now our scheduling system suggests matches but lets coordinators make the final call. Volunteers feel heard, coordinators feel empowered.",
      emotion: 'hopeful' as const
    },
    {
      id: '6',
      content: "Human-centered design isn't just about interfaces - it's about preserving what makes us human. Let me show you how.",
      emotion: 'determined' as const
    }
  ];

  const designAutomation = async () => {
    if (!selectedPrinciple || !automationDescription) return;
    
    setIsDesigning(true);
    try {
      const principle = designPrinciples.find(p => p.id === selectedPrinciple);
      const checkedChecklist = principle?.checklist.filter((_, index) => 
        checkedItems[`${selectedPrinciple}-${index}`]
      ) || [];
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'human-centered-design',
          topic: `${principle?.name} automation design`,
          context: `Rachel Thompson needs to design human-centered automation for: ${automationDescription}. Focus on ${principle?.name}. Applied checklist items: ${checkedChecklist.join(', ')}. Provide specific design recommendations, implementation steps, and safeguards.`
        }
      });

      if (error) throw error;

      const newPlan = {
        id: `design-${Date.now()}`,
        name: `${principle?.name} Design Plan`,
        content: data.content
      };

      setDesignPlans([...designPlans, newPlan]);
      
      toast({
        title: "Design Plan Created!",
        description: `Rachel created a human-centered design plan for ${principle?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error creating design plan:', error);
      toast({
        title: "Design Failed",
        description: "Unable to create design plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDesigning(false);
    }
  };

  const copyPlan = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Design Plan Copied!",
        description: "Human-centered design plan copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy design plan.",
        variant: "destructive"
      });
    }
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleComplete = () => {
    toast({
      title: "Human-Centered Design Complete!",
      description: "You've mastered Rachel's approach to humane automation!",
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
            src={getAnimationUrl('rachel-thoughtful-nod.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              💝
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Human-Centered Design Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Design automation that enhances rather than replaces human potential
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s Cold Tech', desc: 'Experience soulless automation failures', color: 'from-gray-500/10 to-gray-500/5', animation: 'rachel-tech-frustration.mp4', fallback: '🤖' },
            { title: 'Discover Human Design', desc: 'Learn to put people first in automation', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-human-connection.mp4', fallback: '💝' },
            { title: 'Rachel\'s Humane Systems', desc: 'See technology that amplifies humanity', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-harmony-celebration.mp4', fallback: '🌟' }
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
            Begin Rachel's Human Design Journey
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
        lessonTitle="Human-Centered Design Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-human-design-narrative"
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
        lessonTitle="Human-Centered Design Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Human-Centered Design Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Design Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-teal-600" />
                Human-Centered Design Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Principle Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Design Principle</label>
                <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a design principle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {designPrinciples.map((principle) => (
                      <SelectItem key={principle.id} value={principle.id}>
                        <div className="flex items-center gap-2">
                          <principle.icon className="w-4 h-4" />
                          {principle.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Automation Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Automation Challenge</label>
                <Textarea
                  placeholder="Describe the automation you want to design with human-centered principles... Include current pain points and human interactions that must be preserved."
                  value={automationDescription}
                  onChange={(e) => setAutomationDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Design Checklist */}
              {selectedPrinciple && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    {designPrinciples.find(p => p.id === selectedPrinciple)?.name} Checklist
                  </label>
                  <div className="space-y-3">
                    {designPrinciples.find(p => p.id === selectedPrinciple)?.checklist.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`${selectedPrinciple}-${index}`}
                          checked={checkedItems[`${selectedPrinciple}-${index}`] || false}
                          onCheckedChange={(checked) => 
                            handleChecklistChange(`${selectedPrinciple}-${index}`, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={`${selectedPrinciple}-${index}`}
                          className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Design Button */}
              <Button 
                onClick={designAutomation}
                disabled={!selectedPrinciple || !automationDescription || isDesigning}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isDesigning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is designing human-centered automation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Human-Centered Design Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Design Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Human-Centered Designs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {designPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No design plans created yet.</p>
                  <p className="text-sm">Select a principle and create your first human-centered design!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {designPlans.map((plan) => (
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
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        {plan.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {designPlans.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Human-Centered Design Workshop
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

export default RachelHumanCenteredDesign;