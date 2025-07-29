import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, PieChart, Play, BarChart3, LineChart, TrendingUp, Eye } from 'lucide-react';
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

interface VisualizationType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  bestFor: string[];
  example: string;
}

const DavidVisualStorytelling: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVisualization, setSelectedVisualization] = useState<string>('');
  const [dataStory, setDataStory] = useState('');
  const [visualDesigns, setVisualDesigns] = useState<Array<{id: string, type: string, design: string, narrative: string}>>([]);
  const [isCreating, setIsCreating] = useState(false);

  const visualizationTypes: VisualizationType[] = [
    {
      id: 'impact-dashboard',
      name: 'Impact Dashboard',
      description: 'Comprehensive overview of organizational impact',
      icon: BarChart3,
      bestFor: ['Board presentations', 'Annual reports', 'Funder meetings', 'Progress tracking'],
      example: 'Children served: 2,847 | Success rate: 94% | Community reach: 15 schools'
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: 'Show progress over time with compelling narratives',
      icon: LineChart,
      bestFor: ['Growth stories', 'Improvement tracking', 'Seasonal patterns', 'Long-term impact'],
      example: 'Reading scores improved 40% over 2 years, with steepest gains in underserved areas'
    },
    {
      id: 'comparative-charts',
      name: 'Comparative Charts',
      description: 'Highlight differences and relationships in data',
      icon: PieChart,
      bestFor: ['Before/after comparisons', 'Program effectiveness', 'Demographic insights', 'Resource allocation'],
      example: 'Program participants vs. community average: 2x higher graduation rates'
    },
    {
      id: 'story-infographics',
      name: 'Story Infographics',
      description: 'Visual narratives that combine data with human stories',
      icon: Eye,
      bestFor: ['Social media', 'Donor communications', 'Public awareness', 'Grant applications'],
      example: 'Maria\'s journey: From struggling reader to honor roll student in 18 months'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After establishing solid data foundations, I faced a new challenge.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "How do you turn clean data into visuals that actually tell a story?",
      emotion: 'curious' as const
    },
    {
      id: '3',
      content: "I was creating charts that were technically correct but emotionally flat.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "Funders would look at my graphs and say 'That's nice' then move on.",
      emotion: 'disappointed' as const
    },
    {
      id: '5',
      content: "Then I learned the secret: every visualization needs a narrative arc.",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "Now my charts don't just show data - they tell the story of transformation, hope, and impact.",
      emotion: 'enlightened' as const
    }
  ];

  const createVisualization = async () => {
    if (!selectedVisualization) return;
    
    setIsCreating(true);
    try {
      const visualization = visualizationTypes.find(v => v.id === selectedVisualization);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'visual-design',
          topic: `${visualization?.name} for nonprofit data storytelling`,
          context: `David Chen needs to create a compelling ${visualization?.name.toLowerCase()} that transforms raw nonprofit data into an engaging visual narrative. Include specific design recommendations, narrative elements, and stakeholder-focused messaging.`
        }
      });

      if (error) throw error;

      const newDesign = {
        id: `visual-${Date.now()}`,
        type: visualization?.name || 'Visualization',
        design: data.content?.design || `Professional ${visualization?.name.toLowerCase()} with clear hierarchy and compelling visual elements.`,
        narrative: data.content?.narrative || `This visualization tells the story of impact through strategic data presentation and emotional connection.`
      };

      setVisualDesigns([...visualDesigns, newDesign]);
      
      toast({
        title: "Visualization Created!",
        description: `David designed a ${visualization?.name.toLowerCase()} for your data story.`,
      });
    } catch (error) {
      console.error('Error creating visualization:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create visualization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Visual Storytelling Complete!",
      description: "You've mastered David's visual storytelling techniques!",
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
            src={getAnimationUrl('david-chart-creation.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              📈
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Visual Storytelling Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform data into compelling visual narratives that inspire action
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Boring Charts', desc: 'Experience lifeless data presentations', color: 'from-red-500/10 to-red-500/5', animation: 'david-boring-charts.mp4', fallback: '📊' },
            { title: 'Visual Narrative Discovery', desc: 'Learn to craft compelling data stories', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-visual-breakthrough.mp4', fallback: '✨' },
            { title: 'Engaging Visualizations', desc: 'Create charts that inspire and persuade', color: 'from-green-500/10 to-green-500/5', animation: 'david-engaging-visuals.mp4', fallback: '🚀' }
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
            Begin Visual Storytelling Journey
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
        lessonTitle="Visual Storytelling Workshop"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-visual-narrative"
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
        lessonTitle="Visual Storytelling Workshop"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Visual Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Visualization Creator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Visualization Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visualization Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Visualization Type</label>
                <Select value={selectedVisualization} onValueChange={setSelectedVisualization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a visualization type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {visualizationTypes.map((visualization) => (
                      <SelectItem key={visualization.id} value={visualization.id}>
                        <div className="flex items-center gap-2">
                          <visualization.icon className="w-4 h-4" />
                          {visualization.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Visualization Details */}
              {selectedVisualization && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selected = visualizationTypes.find(v => v.id === selectedVisualization);
                    return selected ? (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{selected.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selected.description}</p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-blue-600 mb-1">Best for:</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.bestFor.map((use, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{use}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 bg-white p-2 rounded">
                          <strong>Example:</strong> {selected.example}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Create Button */}
              <Button 
                onClick={createVisualization}
                disabled={!selectedVisualization || isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isCreating ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                    David is creating visualization...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Create with David's Expertise
                  </>
                )}
              </Button>

              {/* Custom Story Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or describe your data story</label>
                <Textarea
                  placeholder="Describe the data story you want to tell and the message you want your visualization to convey..."
                  value={dataStory}
                  onChange={(e) => setDataStory(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Visual Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Your Visual Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visualDesigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No visualizations created yet.</p>
                  <p className="text-sm">Create your first visualization to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visualDesigns.map((design) => (
                    <div key={design.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{design.type}</h4>
                        <Badge variant="outline">Visual</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <strong className="text-blue-800">Design:</strong>
                          <TemplateContentFormatter 
                            content={design.design}
                            contentType="article"
                            variant="compact"
                            showMergeFieldTypes={false}
                            className="formatted-ai-content mt-2"
                          />
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <strong className="text-green-800">Narrative:</strong>
                          <TemplateContentFormatter 
                            content={design.narrative}
                            contentType="lesson"
                            variant="compact"
                            showMergeFieldTypes={false}
                            className="formatted-ai-content mt-2"
                          />
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
        {visualDesigns.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Visual Storytelling Workshop
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

export default DavidVisualStorytelling;