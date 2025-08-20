import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Users, Play, Target, Heart, TrendingUp, Clock, Building, Sliders, Settings, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';
type WorkshopStep = 'setup' | 'configure' | 'generate' | 'review';

interface CompactOption {
  id: string;
  label: string;
  icon?: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: CompactOption[];
  maxSelections: number;
}

const CarmenTalentAcquisitionRadical: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [workshopStep, setWorkshopStep] = useState<WorkshopStep>('setup');
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: string[] }>({});
  const [useSliderMode, setUseSliderMode] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Radical tab-based configuration
  const tabConfigs: TabConfig[] = [
    {
      id: 'roles',
      label: 'Roles',
      icon: <Users className="w-3 h-3" />,
      options: [
        { id: 'program-manager', label: 'Program Manager' },
        { id: 'software-engineer', label: 'Software Engineer' },
        { id: 'marketing-coordinator', label: 'Marketing Coordinator' },
        { id: 'data-analyst', label: 'Data Analyst' },
        { id: 'communications-manager', label: 'Communications Manager' },
        { id: 'operations-specialist', label: 'Operations Specialist' }
      ],
      maxSelections: 2
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: <Target className="w-3 h-3" />,
      options: [
        { id: 'long-time-to-hire', label: 'Long Time to Hire' },
        { id: 'poor-candidate-quality', label: 'Poor Candidate Quality' },
        { id: 'lack-diversity', label: 'Lack of Diversity' },
        { id: 'high-rejection-rate', label: 'High Offer Rejection Rate' },
        { id: 'bias-in-process', label: 'Unconscious Bias' },
        { id: 'poor-candidate-experience', label: 'Poor Candidate Experience' }
      ],
      maxSelections: 3
    },
    {
      id: 'strategies',
      label: 'Strategies',
      icon: <TrendingUp className="w-3 h-3" />,
      options: [
        { id: 'inclusive-job-descriptions', label: 'Inclusive Job Descriptions' },
        { id: 'structured-interviews', label: 'Structured Interviews' },
        { id: 'diverse-sourcing', label: 'Diverse Sourcing Channels' },
        { id: 'skills-assessments', label: 'Skills-Based Assessments' },
        { id: 'cultural-fit-interviews', label: 'Culture Fit Evaluation' },
        { id: 'employer-branding', label: 'Strong Employer Branding' }
      ],
      maxSelections: 3
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Heart className="w-3 h-3" />,
      options: [
        { id: 'faster-hiring', label: 'Faster Hiring Process' },
        { id: 'better-quality', label: 'Higher Quality Candidates' },
        { id: 'improve-diversity', label: 'Increase Diversity' },
        { id: 'reduce-bias', label: 'Eliminate Bias' },
        { id: 'better-experience', label: 'Improve Candidate Experience' },
        { id: 'higher-retention', label: 'Better New Hire Retention' }
      ],
      maxSelections: 2
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I was overwhelmed by 200 resumes for one position, worried about unconscious bias creeping in.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our hiring process was broken - we kept hiring people who looked and thought like us.",
      emotion: 'concerned' as const
    },
    {
      id: '3',
      content: "How do you remove bias while still finding the right cultural fit? That was my challenge.",
      emotion: 'thoughtful' as const
    },
    {
      id: '4',
      content: "AI helped us see talent more clearly while preserving the human connection that makes great teams.",
      emotion: 'hopeful' as const
    },
    {
      id: '5',
      content: "We redesigned everything: inclusive descriptions, bias-free screening, empathetic interviews.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "Our first hire was Maria - someone our old system would have missed, but became our star manager.",
      emotion: 'excited' as const
    },
    {
      id: '7',
      content: "Six months later: 60% more diversity, 40% better retention, 4.8/5 candidate experience.",
      emotion: 'triumphant' as const
    },
    {
      id: '8',
      content: "Now let me show you how to build your own compassionate, AI-powered hiring process.",
      emotion: 'empowered' as const
    }
  ];

  const handleTabSelection = (tabId: string, optionId: string) => {
    const tabConfig = tabConfigs.find(t => t.id === tabId);
    if (!tabConfig) return;

    const currentSelections = selections[tabId] || [];
    const isSelected = currentSelections.includes(optionId);

    if (isSelected) {
      // Remove selection
      setSelections(prev => ({
        ...prev,
        [tabId]: currentSelections.filter(id => id !== optionId)
      }));
    } else if (currentSelections.length < tabConfig.maxSelections) {
      // Add selection
      setSelections(prev => ({
        ...prev,
        [tabId]: [...currentSelections, optionId]
      }));
    }
  };

  const getCurrentTabSelections = () => {
    const tabId = tabConfigs[activeTab]?.id;
    return selections[tabId] || [];
  };

  const getTotalSelections = () => {
    return Object.values(selections).reduce((total, tabSelections) => total + tabSelections.length, 0);
  };

  const canGenerate = () => {
    return tabConfigs.every(tab => {
      const tabSelections = selections[tab.id] || [];
      return tabSelections.length > 0;
    });
  };

  const generateHiringStrategy = async () => {
    if (!canGenerate()) return;
    
    setIsGenerating(true);
    setWorkshopStep('generate');
    
    try {
      const context = tabConfigs.map(tab => {
        const tabSelections = selections[tab.id] || [];
        const selectedOptions = tab.options.filter(opt => tabSelections.includes(opt.id));
        return `${tab.label}: ${selectedOptions.map(opt => opt.label).join(', ')}`;
      }).join('\n');

      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'compassionate-hiring-strategy',
          topic: 'AI-powered talent acquisition with human empathy',
          context: `Carmen Rodriguez needs to create a comprehensive hiring strategy using her compassionate AI approach.
          
          ${context}
          
          Create a structured hiring strategy that follows Carmen's framework: 1) Inclusive Job Descriptions (bias removal, skills focus), 2) Bias-Free Screening (objective assessment), 3) Empathetic Interviews (human connection with growth mindset), 4) Holistic Evaluation (complete candidate picture), 5) Exceptional Candidate Experience (respect and value for all). The strategy should combine AI efficiency with human empathy for compassionate, effective hiring.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      setWorkshopStep('review');
      
      toast({
        title: "Strategy Created!",
        description: "Carmen crafted your hiring plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again.",
        variant: "destructive"
      });
      setWorkshopStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Workshop Complete!",
      description: "You've mastered Carmen's hiring framework!",
    });
    navigate('/chapter/7');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <VideoAnimation
            src={getAnimationUrl('carmen-hiring-prep.mp4')}
            fallbackIcon={<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('teamMedium')} alt="Talent" className="w-8 h-8" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Carmen's Compassionate Hiring
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Transform talent acquisition through AI-powered empathy and bias-free processes
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button 
            onClick={() => navigate('/chapter/7')}
            variant="outline"
            className="px-4 py-2"
          >
            Back to Chapter 7
          </Button>
          
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            className="px-6 py-3 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Begin Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-4"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Compassionate Talent Acquisition"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-16">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-hiring-narrative"
          characterName="Carmen"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50"
    >
      {/* Ultra-Compact Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">Carmen's Hiring Workshop</h1>
              <Badge variant="secondary" className="text-xs">
                {workshopStep === 'setup' && 'Choose Approach'}
                {workshopStep === 'configure' && `${getTotalSelections()}/10 Selected`}
                {workshopStep === 'generate' && 'Creating Strategy'}
                {workshopStep === 'review' && 'Strategy Complete'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                {showPromptPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button 
                onClick={() => navigate('/chapter/7')} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Exit
              </Button>
            </div>
          </div>
          <Progress value={
            workshopStep === 'setup' ? 10 : 
            workshopStep === 'configure' ? 30 + (getTotalSelections() / 10) * 50 : 
            workshopStep === 'generate' ? 85 : 100
          } className="h-1 mt-1" />
        </div>
      </div>

      {/* Compact Main Content */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Setup Step */}
          {workshopStep === 'setup' && (
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-xl font-bold mb-3">Choose Your Approach</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant={!useSliderMode ? "default" : "outline"}
                  onClick={() => {
                    setUseSliderMode(false);
                    setWorkshopStep('configure');
                  }}
                  className="h-16 flex-col gap-1 p-3"
                >
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick Selection</span>
                </Button>
                <Button
                  variant={useSliderMode ? "default" : "outline"}
                  onClick={() => {
                    setUseSliderMode(true);
                    setWorkshopStep('configure');
                  }}
                  className="h-16 flex-col gap-1 p-3"
                >
                  <Sliders className="w-4 h-4" />
                  <span className="text-sm font-medium">Custom Calibration</span>
                </Button>
              </div>
            </div>
          )}

          {/* Configure Step - Tabbed Interface */}
          {workshopStep === 'configure' && !useSliderMode && (
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  {tabConfigs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(index)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all",
                        activeTab === index 
                          ? "bg-white text-purple-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                      {selections[tab.id]?.length > 0 && (
                        <Badge variant="secondary" className="text-xs h-4 px-1">
                          {selections[tab.id].length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Tab Content */}
              <div className="bg-white rounded-lg border p-4 min-h-[200px] max-h-[300px]">
                {tabConfigs[activeTab] && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">
                        Select {tabConfigs[activeTab].label}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {getCurrentTabSelections().length}/{tabConfigs[activeTab].maxSelections}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {tabConfigs[activeTab].options.map((option) => {
                        const isSelected = getCurrentTabSelections().includes(option.id);
                        const isDisabled = !isSelected && getCurrentTabSelections().length >= tabConfigs[activeTab].maxSelections;
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleTabSelection(tabConfigs[activeTab].id, option.id)}
                            disabled={isDisabled}
                            className={cn(
                              "p-3 text-left text-sm rounded-lg border-2 transition-all",
                              isSelected 
                                ? "border-purple-400 bg-purple-50 text-purple-900" 
                                : "border-gray-200 bg-white hover:border-gray-300",
                              isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                              <span className="font-medium">{option.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation & Generate */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                    disabled={activeTab === 0}
                  >
                    Previous
                  </Button>
                  {activeTab < tabConfigs.length - 1 ? (
                    <Button 
                      size="sm" 
                      onClick={() => setActiveTab(activeTab + 1)}
                      disabled={getCurrentTabSelections().length === 0}
                    >
                      Next
                    </Button>
                  ) : null}
                </div>
                
                <Button 
                  onClick={generateHiringStrategy}
                  disabled={!canGenerate() || isGenerating}
                  className="px-4 py-2"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 animate-pulse" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Generate Step */}
          {workshopStep === 'generate' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4">
                <Heart className="w-full h-full text-purple-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold mb-2">Carmen is crafting your strategy...</h2>
              <p className="text-gray-600">Combining AI efficiency with human empathy</p>
            </div>
          )}

          {/* Review Step */}
          {workshopStep === 'review' && generatedStrategy && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-green-700 mb-2">Your Hiring Strategy is Ready!</h2>
                <p className="text-sm text-gray-600">Carmen's personalized framework for your organization</p>
              </div>
              
              <div className="bg-white rounded-lg border p-4 max-h-[400px] overflow-y-auto">
                <TemplateContentFormatter 
                  content={generatedStrategy}
                  contentType="lesson"
                  variant="default"
                  showMergeFieldTypes={true}
                  className="formatted-ai-content prose prose-sm max-w-none text-sm"
                />
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleComplete}
                  className="px-6 py-2 text-white"
                >
                  Complete Workshop
                </Button>
              </div>
            </div>
          )}

          {/* Collapsible Prompt Preview */}
          {showPromptPreview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-bold">AI Prompt Preview</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPromptPreview(false)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-3">
                    {tabConfigs.map(tab => {
                      const tabSelections = selections[tab.id] || [];
                      const selectedOptions = tab.options.filter(opt => tabSelections.includes(opt.id));
                      
                      return (
                        <div key={tab.id} className="border-l-2 border-purple-200 pl-3">
                          <div className="font-medium text-sm">{tab.label}</div>
                          <div className="text-xs text-gray-600">
                            {selectedOptions.length > 0 
                              ? selectedOptions.map(opt => opt.label).join(', ')
                              : 'Not configured'
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

export default CarmenTalentAcquisitionRadical;