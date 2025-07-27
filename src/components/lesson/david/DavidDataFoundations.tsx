import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Database, Play, BarChart3, Target, Users, TrendingUp } from 'lucide-react';
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

interface DataFoundation {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  principles: string[];
}

const DavidDataFoundations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFoundation, setSelectedFoundation] = useState<string>('');
  const [dataInsight, setDataInsight] = useState('');
  const [foundationPlan, setFoundationPlan] = useState<Array<{id: string, principle: string, implementation: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dataFoundations: DataFoundation[] = [
    {
      id: 'quality-standards',
      name: 'Data Quality Standards',
      description: 'Establish clean, reliable, and consistent data practices',
      icon: Target,
      principles: ['Data accuracy verification', 'Consistent formatting', 'Source validation', 'Regular audits']
    },
    {
      id: 'collection-strategy',
      name: 'Strategic Collection',
      description: 'Purposeful data gathering aligned with organizational goals',
      icon: Database,
      principles: ['Mission-aligned metrics', 'Stakeholder-focused data', 'Impact measurement', 'Efficiency tracking']
    },
    {
      id: 'visualization-principles',
      name: 'Visualization Principles',
      description: 'Transform numbers into compelling visual narratives',
      icon: BarChart3,
      principles: ['Audience-appropriate charts', 'Clear labeling', 'Color for meaning', 'Progressive disclosure']
    },
    {
      id: 'audience-alignment',
      name: 'Audience Alignment',
      description: 'Tailor data presentation to different stakeholder needs',
      icon: Users,
      principles: ['Board-level summaries', 'Funder impact stories', 'Staff operational metrics', 'Community testimonials']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Hi, I'm David Chen from Riverside Children's Foundation.",
      emotion: 'nervous' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I have this overwhelming problem - we collect SO much data, but I can't turn it into stories that matter.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Spreadsheets with thousands of rows, reports that no one reads, numbers that don't inspire action.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "Our board meetings are just me rattling off statistics while everyone's eyes glaze over.",
      emotion: 'disappointed' as const
    },
    {
      id: '5',
      content: "But then I discovered something powerful - data storytelling foundations.",
      emotion: 'hopeful' as const
    },
    {
      id: '6',
      content: "Now I can transform our mountain of data into compelling narratives that secure funding and demonstrate real impact.",
      emotion: 'enlightened' as const
    }
  ];

  const analyzeDataFoundation = async () => {
    if (!selectedFoundation) return;
    
    setIsAnalyzing(true);
    try {
      const foundation = dataFoundations.find(f => f.id === selectedFoundation);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'data-foundation-plan',
          topic: `${foundation?.name} implementation for nonprofit organization`,
          context: `David Chen at Riverside Children's Foundation needs a practical implementation plan for ${foundation?.name.toLowerCase()}. Include specific steps, metrics, and tools for data-driven storytelling.`
        }
      });

      if (error) throw error;

      const newPlan = foundation?.principles.map((principle, index) => ({
        id: `plan-${Date.now()}-${index}`,
        principle,
        implementation: data.content || `Implement ${principle.toLowerCase()} with systematic approach and regular measurement.`
      })) || [];

      setFoundationPlan([...foundationPlan, ...newPlan]);
      
      toast({
        title: "Foundation Plan Created!",
        description: `David analyzed ${foundation?.name.toLowerCase()} for your organization.`,
      });
    } catch (error) {
      console.error('Error analyzing foundation:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze foundation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Data Foundations Complete!",
      description: "You've mastered David's data storytelling foundations!",
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
            src={getAnimationUrl('david-data-overwhelm.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              📊
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Data Storytelling Foundations
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform overwhelming data into compelling impact narratives
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'David\'s Data Overwhelm', desc: 'Experience the chaos of unstructured data', color: 'from-red-500/10 to-red-500/5', animation: 'david-data-overwhelm.mp4', fallback: '📊' },
            { title: 'Discover Foundation Power', desc: 'Learn systematic data storytelling principles', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-insight-discovery.mp4', fallback: '✨' },
            { title: 'David\'s Foundation Success', desc: 'Witness organized, compelling data narratives', color: 'from-green-500/10 to-green-500/5', animation: 'david-visualization-success.mp4', fallback: '🚀' }
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
            Begin David's Foundation Journey
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
        lessonTitle="Data Storytelling Foundations"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-foundations-narrative"
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
        lessonTitle="Data Storytelling Foundations"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Foundation Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Foundation Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Foundation Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foundation Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Foundation Area</label>
                <Select value={selectedFoundation} onValueChange={setSelectedFoundation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a foundation area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dataFoundations.map((foundation) => (
                      <SelectItem key={foundation.id} value={foundation.id}>
                        <div className="flex items-center gap-2">
                          <foundation.icon className="w-4 h-4" />
                          {foundation.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Analyze Button */}
              <Button 
                onClick={analyzeDataFoundation}
                disabled={!selectedFoundation || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isAnalyzing ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                    David is analyzing foundations...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze with David's Expertise
                  </>
                )}
              </Button>

              {/* Custom Insight Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or note your own data insights</label>
                <Textarea
                  placeholder="Describe the data challenge you're facing and what insights you need to extract..."
                  value={dataInsight}
                  onChange={(e) => setDataInsight(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Foundation Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Your Foundation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {foundationPlan.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No foundation plans created yet.</p>
                  <p className="text-sm">Analyze a foundation area to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {foundationPlan.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{plan.principle}</h4>
                        <Badge variant="outline">Foundation</Badge>
                      </div>
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                        {plan.implementation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {foundationPlan.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Foundation Workshop
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

export default DavidDataFoundations;