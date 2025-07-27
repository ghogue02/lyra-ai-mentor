import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Search, Play, Archive, Lightbulb, RefreshCw, Zap } from 'lucide-react';
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

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  hiddenInsights: string[];
}

const DavidDataRevival: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [revivalQuery, setRevivalQuery] = useState('');
  const [revivedInsights, setRevivedInsights] = useState<Array<{id: string, source: string, insight: string, impact: string}>>([]);
  const [isReviving, setIsReviving] = useState(false);

  const dataSources: DataSource[] = [
    {
      id: 'dormant-surveys',
      name: 'Dormant Surveys',
      description: 'Unanalyzed feedback sitting in storage for months or years',
      icon: Archive,
      hiddenInsights: ['Satisfaction trends', 'Unmet needs', 'Service gaps', 'Improvement opportunities']
    },
    {
      id: 'historical-records',
      name: 'Historical Records',
      description: 'Old program data that could reveal long-term patterns',
      icon: RefreshCw,
      hiddenInsights: ['Success predictors', 'Seasonal patterns', 'Program evolution', 'Best practices']
    },
    {
      id: 'administrative-data',
      name: 'Administrative Data',
      description: 'Operational metrics often overlooked for storytelling',
      icon: Search,
      hiddenInsights: ['Efficiency trends', 'Resource utilization', 'Cost effectiveness', 'Operational excellence']
    },
    {
      id: 'cross-referenced-datasets',
      name: 'Cross-Referenced Datasets',
      description: 'Separate data sources that reveal insights when combined',
      icon: Zap,
      hiddenInsights: ['Correlation discoveries', 'Hidden relationships', 'Compound effects', 'Holistic impact']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "You know what's frustrating? We have goldmines of data just sitting there.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Surveys from three years ago that were never properly analyzed. Program records going back a decade.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '3',
      content: "Everyone talks about being 'data-driven' but we're ignoring 80% of our data because it's 'old' or 'messy.'",
      emotion: 'disappointed' as const
    },
    {
      id: '4',
      content: "Then I learned about data revival - the art of resurrecting buried insights.",
      emotion: 'curious' as const
    },
    {
      id: '5',
      content: "That 'old' survey revealed why our retention improved. Those 'messy' records showed our most effective interventions.",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "Now I'm like a data archaeologist, uncovering stories that have been hiding in plain sight for years.",
      emotion: 'enlightened' as const
    }
  ];

  const reviveData = async () => {
    if (!selectedDataSource) return;
    
    setIsReviving(true);
    try {
      const dataSource = dataSources.find(d => d.id === selectedDataSource);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'data-revival-insight',
          topic: `${dataSource?.name} analysis for nonprofit organization`,
          context: `David Chen needs to revive insights from ${dataSource?.name.toLowerCase()} at Riverside Children's Foundation. Generate specific insights about ${dataSource?.hiddenInsights.join(', ')} that can drive decision-making and demonstrate impact.`
        }
      });

      if (error) throw error;

      const newInsight = {
        id: `insight-${Date.now()}`,
        source: dataSource?.name || 'Data Source',
        insight: data.content?.insight || `Significant patterns discovered in ${dataSource?.name.toLowerCase()} revealing opportunities for enhanced impact and operational efficiency.`,
        impact: data.content?.impact || `This insight can improve program effectiveness by 15-25% and strengthen stakeholder communications with concrete evidence of success.`
      };

      setRevivedInsights([...revivedInsights, newInsight]);
      
      toast({
        title: "Data Revived!",
        description: `David uncovered hidden insights from ${dataSource?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error reviving data:', error);
      toast({
        title: "Revival Failed",
        description: "Unable to revive data insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReviving(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Data Revival Complete!",
      description: "You've mastered David's data archaeology techniques!",
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
            src={getAnimationUrl('david-data-archaeology.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              🔍
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Data Revival Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Resurrect buried insights from dormant data sources
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Buried Data Crisis', desc: 'Discover mountains of unused insights', color: 'from-red-500/10 to-red-500/5', animation: 'david-buried-data.mp4', fallback: '📚' },
            { title: 'Data Archaeology Method', desc: 'Learn systematic data revival techniques', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-data-discovery.mp4', fallback: '✨' },
            { title: 'Insight Resurrection', desc: 'Transform old data into new discoveries', color: 'from-green-500/10 to-green-500/5', animation: 'david-data-success.mp4', fallback: '🚀' }
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
            Begin Data Revival Journey
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
        lessonTitle="Data Revival Workshop"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-revival-narrative"
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
        lessonTitle="Data Revival Workshop"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Data Revival Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Data Revival Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Data Revival Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Source Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Data Source to Revive</label>
                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dormant data source..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        <div className="flex items-center gap-2">
                          <source.icon className="w-4 h-4" />
                          {source.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Source Details */}
              {selectedDataSource && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selected = dataSources.find(s => s.id === selectedDataSource);
                    return selected ? (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{selected.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selected.description}</p>
                        <div>
                          <p className="text-xs font-medium text-blue-600 mb-1">Hidden insights may include:</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.hiddenInsights.map((insight, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{insight}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Revive Button */}
              <Button 
                onClick={reviveData}
                disabled={!selectedDataSource || isReviving}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isReviving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    David is reviving data...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Revive with David's Expertise
                  </>
                )}
              </Button>

              {/* Custom Revival Query */}
              <div>
                <label className="block text-sm font-medium mb-2">Or describe your buried data</label>
                <Textarea
                  placeholder="Describe the old or dormant data you have and what insights you hope to uncover..."
                  value={revivalQuery}
                  onChange={(e) => setRevivalQuery(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Revived Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Revived Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revivedInsights.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No insights revived yet.</p>
                  <p className="text-sm">Start your data archaeology expedition!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {revivedInsights.map((insight) => (
                    <div key={insight.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{insight.source}</h4>
                        <Badge variant="outline">Revived</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong className="text-blue-800">Insight:</strong> {insight.insight}
                        </div>
                        <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                          <strong className="text-green-800">Impact:</strong> {insight.impact}
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
        {revivedInsights.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Data Revival Workshop
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

export default DavidDataRevival;