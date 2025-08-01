import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Network, Play, Database, Workflow, Settings, Globe } from 'lucide-react';
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

interface EcosystemComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  integrations: string[];
  benefits: string;
}

const DavidDataEcosystem: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [ecosystemVision, setEcosystemVision] = useState('');
  const [ecosystemBlueprints, setEcosystemBlueprints] = useState<Array<{id: string, component: string, blueprint: string, implementation: string}>>([]);
  const [isDesigning, setIsDesigning] = useState(false);

  const ecosystemComponents: EcosystemComponent[] = [
    {
      id: 'unified-dashboard',
      name: 'Unified Dashboard',
      description: 'Central command center for all organizational data and insights',
      icon: Database,
      integrations: ['CRM systems', 'Program databases', 'Financial tools', 'Communication platforms'],
      benefits: 'Real-time organizational overview with drill-down capabilities for detailed analysis'
    },
    {
      id: 'automated-workflows',
      name: 'Automated Workflows',
      description: 'Intelligent data flows that eliminate manual processes and reduce errors',
      icon: Workflow,
      integrations: ['Survey tools', 'Reporting systems', 'Email platforms', 'Grant management'],
      benefits: 'Reduce manual data entry by 80% while ensuring consistent, timely reporting'
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics Hub',
      description: 'AI-powered forecasting and trend analysis across all organizational functions',
      icon: Settings,
      integrations: ['Historical data', 'External benchmarks', 'Demographic data', 'Economic indicators'],
      benefits: 'Anticipate challenges and opportunities 3-6 months in advance with 85% accuracy'
    },
    {
      id: 'stakeholder-portals',
      name: 'Stakeholder Portals',
      description: 'Customized data experiences for different audience needs and preferences',
      icon: Globe,
      integrations: ['Board systems', 'Donor platforms', 'Staff tools', 'Community interfaces'],
      benefits: 'Increase stakeholder engagement by 40% through personalized, relevant data presentations'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After years of building data skills piece by piece, I realized something crucial was missing.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I had great foundations, beautiful visualizations, revived insights, and targeted communications.",
      emotion: 'proud' as const
    },
    {
      id: '3',
      content: "But they were all disconnected islands. Our CRM didn't talk to our program database. Our financial reports lived in isolation.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "I was spending more time moving data between systems than actually analyzing it.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '5',
      content: "That's when I learned about data ecosystems - creating an integrated, intelligent data environment.",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "Now our data flows seamlessly, updates automatically, and provides insights across every aspect of our organization. It's like conducting an orchestra instead of playing solo instruments.",
      emotion: 'enlightened' as const
    }
  ];

  const designEcosystem = async () => {
    if (!selectedComponent) return;
    
    setIsDesigning(true);
    try {
      const component = ecosystemComponents.find(c => c.id === selectedComponent);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'article',
          topic: `${component?.name} for nonprofit data ecosystem`,
          context: `David Chen needs to design a comprehensive ${component?.name.toLowerCase()} for Riverside Children's Foundation. Include specific integration points: ${component?.integrations.join(', ')}. The system should deliver: ${component?.benefits}. Provide detailed implementation blueprint with technical requirements and step-by-step deployment plan.`
        }
      });

      if (error) throw error;

      const newBlueprint = {
        id: `blueprint-${Date.now()}`,
        component: component?.name || 'Ecosystem Component',
        blueprint: data.content?.blueprint || `Comprehensive design for ${component?.name.toLowerCase()} including architecture, data flows, user interfaces, and integration specifications.`,
        implementation: data.content?.implementation || `Phased implementation plan with technical requirements, timeline, and success metrics for optimal deployment and adoption.`
      };

      setEcosystemBlueprints([...ecosystemBlueprints, newBlueprint]);
      
      toast({
        title: "Ecosystem Blueprint Created!",
        description: `David designed a ${component?.name.toLowerCase()} for your data ecosystem.`,
      });
    } catch (error) {
      console.error('Error designing ecosystem:', error);
      toast({
        title: "Design Failed",
        description: "Unable to create ecosystem blueprint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDesigning(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Data Ecosystem Complete!",
      description: "You've mastered David's comprehensive data ecosystem design!",
    });
    navigate('/chapter/4');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* David Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('david-ecosystem-orchestration.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              🌐
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Data Ecosystem Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Design comprehensive, integrated data systems for organizational excellence
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Data Silos Crisis', desc: 'Experience disconnected, inefficient systems', color: 'from-red-500/10 to-red-500/5', animation: 'david-data-silos.mp4', fallback: '🏝️' },
            { title: 'Ecosystem Vision', desc: 'Learn integrated data architecture design', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-ecosystem-design.mp4', fallback: '✨' },
            { title: 'Orchestrated Excellence', desc: 'Master seamless, intelligent data systems', color: 'from-green-500/10 to-green-500/5', animation: 'david-ecosystem-success.mp4', fallback: '🚀' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Data Ecosystem Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Data Ecosystem Workshop"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-ecosystem-narrative"
          characterName="David"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Data Ecosystem Workshop"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Ecosystem Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Ecosystem Designer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Ecosystem Designer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Component Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Ecosystem Component</label>
                <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an ecosystem component..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ecosystemComponents.map((component) => (
                      <SelectItem key={component.id} value={component.id}>
                        <div className="flex items-center gap-2">
                          <component.icon className="w-4 h-4" />
                          {component.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Component Details */}
              {selectedComponent && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selected = ecosystemComponents.find(c => c.id === selectedComponent);
                    return selected ? (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{selected.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selected.description}</p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-blue-600 mb-1">Key integrations:</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.integrations.map((integration, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{integration}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 bg-white p-2 rounded">
                          <strong>Benefits:</strong> {selected.benefits}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Design Button */}
              <Button 
                onClick={designEcosystem}
                disabled={!selectedComponent || isDesigning}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isDesigning ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    David is designing ecosystem...
                  </>
                ) : (
                  <>
                    <Network className="w-4 h-4 mr-2" />
                    Design with David's Expertise
                  </>
                )}
              </Button>

              {/* Custom Vision Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or describe your ecosystem vision</label>
                <Textarea
                  placeholder="Describe your ideal data ecosystem - what systems need to integrate, what workflows should be automated, and what outcomes you want to achieve..."
                  value={ecosystemVision}
                  onChange={(e) => setEcosystemVision(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Ecosystem Blueprints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Your Ecosystem Blueprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ecosystemBlueprints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No blueprints created yet.</p>
                  <p className="text-sm">Design your first ecosystem component!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ecosystemBlueprints.map((blueprint) => (
                    <div key={blueprint.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{blueprint.component}</h4>
                        <Badge variant="outline">Blueprint</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong className="text-blue-800">Design:</strong> {blueprint.blueprint}
                        </div>
                        <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                          <strong className="text-green-800">Implementation:</strong> {blueprint.implementation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {ecosystemBlueprints.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Data Ecosystem Workshop
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

export default DavidDataEcosystem;