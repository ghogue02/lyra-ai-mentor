import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Network, Puzzle, Zap, Globe, Save, Copy, Building } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

type Phase = 'intro' | 'narrative' | 'workshop';

interface EcosystemComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  integrations: string[];
  capabilities: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
}

const RachelEcosystemBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [ecosystemVision, setEcosystemVision] = useState('');
  const [organizationSize, setOrganizationSize] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [ecosystemBlueprints, setEcosystemBlueprints] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const ecosystemComponents: EcosystemComponent[] = [
    {
      id: 'communication',
      name: 'Communication Hub',
      description: 'Unified messaging, email automation, and stakeholder engagement',
      icon: Network,
      integrations: ['Email platforms', 'Chat systems', 'Social media', 'CRM'],
      capabilities: ['Auto-responses', 'Personalization', 'Broadcast management', 'Analytics'],
      complexity: 'basic'
    },
    {
      id: 'data-intelligence',
      name: 'Data Intelligence Center',
      description: 'Data collection, analysis, and insights automation',
      icon: Building,
      integrations: ['Databases', 'Analytics tools', 'Reporting systems', 'APIs'],
      capabilities: ['Real-time dashboards', 'Predictive analytics', 'Automated reports', 'Data validation'],
      complexity: 'intermediate'
    },
    {
      id: 'workflow-orchestration',
      name: 'Workflow Orchestration Engine',
      description: 'Multi-process coordination and intelligent routing',
      icon: Puzzle,
      integrations: ['Process tools', 'Task managers', 'Approval systems', 'Scheduling'],
      capabilities: ['Smart routing', 'Load balancing', 'Exception handling', 'Process optimization'],
      complexity: 'advanced'
    },
    {
      id: 'integration-platform',
      name: 'Integration Platform',
      description: 'Connect and synchronize all organizational systems',
      icon: Zap,
      integrations: ['Third-party APIs', 'Legacy systems', 'Cloud services', 'Databases'],
      capabilities: ['Real-time sync', 'Data transformation', 'Error recovery', 'Version management'],
      complexity: 'advanced'
    },
    {
      id: 'user-experience',
      name: 'User Experience Layer',
      description: 'Human-friendly interfaces and interaction points',
      icon: Globe,
      integrations: ['Web interfaces', 'Mobile apps', 'Voice systems', 'Chatbots'],
      capabilities: ['Self-service portals', 'Intelligent assistance', 'Accessibility features', 'Multi-channel support'],
      complexity: 'intermediate'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After years of building individual automations, I realized I had created a fragmented digital ecosystem.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "We had email automation here, scheduling automation there, data processing somewhere else. But they didn't talk to each other.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Data was duplicated, processes had gaps, and staff were still doing manual handoffs between automated systems.",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "That's when I learned about ecosystem thinking - designing automation as an interconnected, intelligent whole.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "We rebuilt Green Future Alliance as a unified automation ecosystem. Now when a volunteer signs up, 15 systems coordinate seamlessly.",
      emotion: 'proud' as const
    },
    {
      id: '6',
      content: "The result? A digital nervous system that amplifies every human action across the entire organization. Let me show you how to build one.",
      emotion: 'excited' as const
    }
  ];

  const buildEcosystem = async () => {
    if (selectedComponents.length === 0 || !ecosystemVision) return;
    
    setIsBuilding(true);
    try {
      const components = ecosystemComponents.filter(c => selectedComponents.includes(c.id));
      const componentNames = components.map(c => c.name).join(', ');
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'rachel',
          contentType: 'article',
          topic: 'Complete automation ecosystem architecture',
          context: `Rachel Thompson needs to design a comprehensive automation ecosystem for: ${ecosystemVision}. Organization size: ${organizationSize}. Implementation timeframe: ${timeframe}. Selected components: ${componentNames}. Provide detailed architecture blueprint, integration strategies, implementation phases, governance framework, and success metrics. Focus on human-centered design and scalable systems.`
        }
      });

      if (error) throw error;

      const newBlueprint = {
        id: `ecosystem-${Date.now()}`,
        name: 'Complete Automation Ecosystem',
        content: data.content
      };

      setEcosystemBlueprints([...ecosystemBlueprints, newBlueprint]);
      
      toast({
        title: "Ecosystem Blueprint Created!",
        description: "Rachel designed a complete automation ecosystem for your organization.",
      });
    } catch (error) {
      console.error('Error building ecosystem:', error);
      toast({
        title: "Blueprint Failed",
        description: "Unable to create ecosystem blueprint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const copyBlueprint = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Blueprint Copied!",
        description: "Ecosystem blueprint copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy blueprint.",
        variant: "destructive"
      });
    }
  };

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComponents([...selectedComponents, componentId]);
    } else {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    }
  };

  const handleComplete = () => {
    toast({
      title: "Ecosystem Builder Complete!",
      description: "You've mastered Rachel's complete automation ecosystem approach!",
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
            src={getAnimationUrl('rachel-ecosystem-vision.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              🌐
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rachel's Ecosystem Builder Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Design complete automation ecosystems that transform organizations
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Rachel\'s Fragmented Systems', desc: 'Experience disconnected automation chaos', color: 'from-red-500/10 to-red-500/5', animation: 'rachel-fragmented-chaos.mp4', fallback: '🧩' },
            { title: 'Discover Ecosystem Thinking', desc: 'Learn holistic system integration', color: 'from-teal-500/10 to-teal-500/5', animation: 'rachel-ecosystem-vision.mp4', fallback: '🌐' },
            { title: 'Rachel\'s Digital Ecosystem', desc: 'See unified automation excellence', color: 'from-green-500/10 to-green-500/5', animation: 'rachel-ecosystem-harmony.mp4', fallback: '🚀' }
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
            Begin Rachel's Ecosystem Journey
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
        lessonTitle="Ecosystem Builder Workshop"
        characterName="Rachel"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="rachel-ecosystem-narrative"
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
        lessonTitle="Ecosystem Builder Workshop"
        characterName="Rachel"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Rachel's Ecosystem Builder Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/5')}>
              Back to Chapter 5
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Ecosystem Designer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-teal-600" />
                Ecosystem Architecture Designer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organization Context */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Size</label>
                  <Input
                    placeholder="e.g., 50 employees"
                    value={organizationSize}
                    onChange={(e) => setOrganizationSize(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Implementation Timeframe</label>
                  <Input
                    placeholder="e.g., 12 months"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                </div>
              </div>

              {/* Ecosystem Vision */}
              <div>
                <label className="block text-sm font-medium mb-2">Ecosystem Vision & Goals</label>
                <Textarea
                  placeholder="Describe your vision for a complete automation ecosystem... Include organizational goals, key processes, integration needs, and success criteria."
                  value={ecosystemVision}
                  onChange={(e) => setEcosystemVision(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Component Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Ecosystem Components</label>
                <div className="space-y-4">
                  {ecosystemComponents.map((component) => (
                    <div key={component.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id={component.id}
                          checked={selectedComponents.includes(component.id)}
                          onCheckedChange={(checked) => 
                            handleComponentToggle(component.id, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <component.icon className="w-4 h-4 text-teal-600" />
                            <label 
                              htmlFor={component.id}
                              className="font-medium cursor-pointer"
                            >
                              {component.name}
                            </label>
                            <Badge 
                              variant={
                                component.complexity === 'advanced' ? 'destructive' : 
                                component.complexity === 'intermediate' ? 'outline' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {component.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                          <div className="text-xs text-gray-500">
                            <div className="mb-1">
                              <strong>Integrations:</strong> {component.integrations.join(', ')}
                            </div>
                            <div>
                              <strong>Capabilities:</strong> {component.capabilities.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Button */}
              <Button 
                onClick={buildEcosystem}
                disabled={selectedComponents.length === 0 || !ecosystemVision || isBuilding}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isBuilding ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Rachel is building your ecosystem...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Build Complete Ecosystem Blueprint
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Ecosystem Blueprints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Ecosystem Blueprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ecosystemBlueprints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No ecosystem blueprints created yet.</p>
                  <p className="text-sm">Select components and create your first ecosystem blueprint!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ecosystemBlueprints.map((blueprint) => (
                    <div key={blueprint.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{blueprint.name}</h4>
                        <Button 
                          onClick={() => copyBlueprint(blueprint.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                        {blueprint.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Components Summary */}
        {selectedComponents.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Selected Ecosystem Components ({selectedComponents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ecosystemComponents
                  .filter(c => selectedComponents.includes(c.id))
                  .map((component) => (
                    <div key={component.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <component.icon className="w-5 h-5 text-teal-600" />
                        <h4 className="font-semibold">{component.name}</h4>
                        <Badge 
                          variant={
                            component.complexity === 'advanced' ? 'destructive' : 
                            component.complexity === 'intermediate' ? 'outline' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {component.complexity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{component.description}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Button */}
        {ecosystemBlueprints.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Ecosystem Builder Workshop
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

export default RachelEcosystemBuilder;