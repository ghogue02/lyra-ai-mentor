import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Calendar, Map, Users, CheckCircle, ArrowRight } from 'lucide-react';
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

interface PlanningCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const AlexTransformationPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScope, setSelectedScope] = useState<string>('');
  const [organizationDetails, setOrganizationDetails] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [generatedPlans, setGeneratedPlans] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isPlanning, setIsPlanning] = useState(false);

  const planningCategories: PlanningCategory[] = [
    {
      id: 'department-ai',
      name: 'Department AI Integration',
      description: 'Focused transformation for specific departments',
      icon: Users,
      examples: ['HR automation', 'Marketing AI tools', 'Operations optimization']
    },
    {
      id: 'organization-wide',
      name: 'Organization-Wide Transformation',
      description: 'Comprehensive AI adoption across all functions',
      icon: Map,
      examples: ['Cultural change', 'Process redesign', 'Technology stack overhaul']
    },
    {
      id: 'pilot-program',
      name: 'Pilot Program Launch',
      description: 'Strategic testing and validation approach',
      icon: CheckCircle,
      examples: ['Limited scope testing', 'Proof of concept', 'Risk mitigation']
    },
    {
      id: 'scaling-existing',
      name: 'Scaling Existing AI',
      description: 'Expanding successful AI initiatives',
      icon: ArrowRight,
      examples: ['Broader deployment', 'Additional use cases', 'Enhanced capabilities']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "My biggest mistake early on was jumping into AI transformation without a solid plan.",
      emotion: 'regretful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I thought we could just start using AI tools and everything would fall into place. Wrong.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Six months in, we had scattered AI experiments, confused staff, and no clear progress.",
      emotion: 'disappointed' as const
    },
    {
      id: '4',
      content: "That's when I learned the importance of systematic transformation planning.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "I developed the Strategic Change Framework - a step-by-step approach to AI transformation.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Now we have clear phases, measurable milestones, and stakeholder buy-in. Let me show you the system.",
      emotion: 'accomplished' as const
    }
  ];

  const generatePlan = async () => {
    if (!selectedScope || !organizationDetails.trim()) return;
    
    setIsPlanning(true);
    try {
      const scope = planningCategories.find(c => c.id === selectedScope);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'alex',
          contentType: 'transformation-plan',
          topic: `${scope?.name} strategic plan for AI transformation`,
          context: `Alex Rivera at National Advocacy Coalition needs comprehensive transformation plan for ${scope?.name.toLowerCase()}. Organization details: ${organizationDetails}. Timeframe: ${timeframe}. Create detailed strategic plan with phases, milestones, and change management strategies.`
        }
      });

      if (error) throw error;

      const newPlan = {
        id: `plan-${Date.now()}`,
        name: `${scope?.name} Strategy`,
        content: data.content
      };

      setGeneratedPlans([...generatedPlans, newPlan]);
      
      toast({
        title: "Transformation Plan Created!",
        description: `Alex designed a strategic plan for ${scope?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Planning Failed",
        description: "Unable to generate plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Transformation Planning Mastered!",
      description: "You've learned Alex's systematic approach to change management!",
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
            src={getAnimationUrl('alex-strategic-planning.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              📋
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alex's Strategic Change Framework
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Design comprehensive transformation strategies
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Alex\'s Planning Chaos', desc: 'Experience scattered transformation attempts', color: 'from-red-500/10 to-red-500/5', animation: 'alex-chaotic-planning.mp4', fallback: '🌪️' },
            { title: 'Discover Strategic Planning', desc: 'Learn systematic change management', color: 'from-indigo-500/10 to-indigo-500/5', animation: 'alex-planning-breakthrough.mp4', fallback: '🎯' },
            { title: 'Alex\'s Transformation Success', desc: 'Witness organized change mastery', color: 'from-green-500/10 to-green-500/5', animation: 'alex-successful-transformation.mp4', fallback: '📈' }
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
            Begin Alex's Planning Journey
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
        lessonTitle="Strategic Change Framework"
        characterName="Alex"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="alex-planning-narrative"
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
        lessonTitle="Strategic Change Framework"
        characterName="Alex"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Alex's Transformation Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/6')}>
              Back to Chapter 6
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Strategic Planner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-600" />
                Strategic Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scope Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Transformation Scope</label>
                <Select value={selectedScope} onValueChange={setSelectedScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transformation scope..." />
                  </SelectTrigger>
                  <SelectContent>
                    {planningCategories.map((category) => (
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

              {/* Organization Details */}
              <div>
                <label className="block text-sm font-medium mb-2">Organization Context</label>
                <Textarea
                  placeholder="Describe your organization: size, structure, current AI maturity, key challenges, available resources..."
                  value={organizationDetails}
                  onChange={(e) => setOrganizationDetails(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium mb-2">Transformation Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Months (Quick Win)</SelectItem>
                    <SelectItem value="6-months">6 Months (Focused Initiative)</SelectItem>
                    <SelectItem value="12-months">12 Months (Major Transformation)</SelectItem>
                    <SelectItem value="18-months">18+ Months (Comprehensive Change)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generatePlan}
                disabled={!selectedScope || !organizationDetails.trim() || isPlanning}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {isPlanning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Alex is designing your strategy...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Strategic Plan with Alex
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Your Strategic Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No transformation plans created yet.</p>
                  <p className="text-sm">Generate your first strategic plan to guide your AI transformation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-indigo-800">{plan.name}</h4>
                        <Badge variant="outline" className="text-green-600">Alex's Strategy</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
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
        {generatedPlans.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Transformation Planning Workshop
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

export default AlexTransformationPlanning;