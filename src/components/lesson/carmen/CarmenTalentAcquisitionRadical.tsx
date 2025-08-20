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
import { StrategyContentRendererFocused } from './StrategyContentRendererFocused';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';
type WorkshopStep = 'setup' | 'configure' | 'generate' | 'review';

interface CompactOption {
  id: string;
  label: string;
  description?: string;
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
        { id: 'program-manager', label: 'Program Manager', description: 'Cross-functional project leadership' },
        { id: 'software-engineer', label: 'Software Engineer', description: 'Technical development roles' },
        { id: 'marketing-coordinator', label: 'Marketing Coordinator', description: 'Brand and campaign management' },
        { id: 'data-analyst', label: 'Data Analyst', description: 'Analytics and insights roles' },
        { id: 'communications-manager', label: 'Communications Manager', description: 'Internal and external communications' },
        { id: 'operations-specialist', label: 'Operations Specialist', description: 'Process and efficiency optimization' }
      ],
      maxSelections: 2
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: <Target className="w-3 h-3" />,
      options: [
        { id: 'long-time-to-hire', label: 'Long Time to Hire', description: 'Recruitment process takes too long' },
        { id: 'poor-candidate-quality', label: 'Poor Candidate Quality', description: 'Applicants don\'t meet requirements' },
        { id: 'lack-diversity', label: 'Lack of Diversity', description: 'Not reaching diverse talent pools' },
        { id: 'high-rejection-rate', label: 'High Offer Rejection Rate', description: 'Candidates decline job offers' },
        { id: 'bias-in-process', label: 'Unconscious Bias', description: 'Unfair evaluation practices' },
        { id: 'poor-candidate-experience', label: 'Poor Candidate Experience', description: 'Negative feedback about process' }
      ],
      maxSelections: 3
    },
    {
      id: 'strategies',
      label: 'Strategies',
      icon: <TrendingUp className="w-3 h-3" />,
      options: [
        { id: 'inclusive-job-descriptions', label: 'Inclusive Job Descriptions', description: 'Bias-free, welcoming language' },
        { id: 'structured-interviews', label: 'Structured Interviews', description: 'Consistent evaluation framework' },
        { id: 'diverse-sourcing', label: 'Diverse Sourcing Channels', description: 'Reach underrepresented groups' },
        { id: 'skills-assessments', label: 'Skills-Based Assessments', description: 'Objective capability evaluation' },
        { id: 'cultural-fit-interviews', label: 'Culture Fit Evaluation', description: 'Values alignment assessment' },
        { id: 'employer-branding', label: 'Strong Employer Branding', description: 'Attractive company reputation' }
      ],
      maxSelections: 3
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Heart className="w-3 h-3" />,
      options: [
        { id: 'faster-hiring', label: 'Faster Hiring Process', description: 'Reduce time-to-hire significantly' },
        { id: 'better-quality', label: 'Higher Quality Candidates', description: 'Find better-qualified applicants' },
        { id: 'improve-diversity', label: 'Increase Diversity', description: 'Build more inclusive teams' },
        { id: 'reduce-bias', label: 'Eliminate Bias', description: 'Fair and objective evaluations' },
        { id: 'better-experience', label: 'Improve Candidate Experience', description: 'Positive recruitment journey' },
        { id: 'higher-retention', label: 'Better New Hire Retention', description: 'Find people who stay longer' }
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
          context: `You're helping someone build a hiring strategy that actually works. Based on their specific needs:

          ${context}
          
          Write a warm, conversational response from Carmen that feels like genuine advice from an experienced HR leader. Use natural language - no lists in parentheses, no robotic phrasing. Start with empathy about their challenges, then give practical guidance. Make it sound like Carmen is sitting across from them having coffee, sharing her real experience. Focus on the "why" behind each recommendation, not just the "what." Keep paragraphs short and readable.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      setWorkshopStep('review');
      
      toast({
        title: "Strategy Created!",
        description: "Lyra generated your personalized hiring plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: `Unable to connect to AI service. ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`,
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
        {/* Carmen Avatar */}
        <div className="w-20 h-20 mx-auto mb-6">
          <VideoAnimation
            src={getAnimationUrl('carmen-hiring-prep.mp4')}
            fallbackIcon={<div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('teamMedium')} alt="Talent" className="w-10 h-10" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Compassionate Hiring
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform talent acquisition through AI-powered empathy and bias-free processes
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Hiring Struggles', desc: 'Carmen\'s bias and inefficiency challenges', color: 'from-red-500/10 to-red-500/5', icon: '😤' },
            { title: 'AI-Empathy Framework', desc: 'Learn compassionate hiring system', color: 'from-purple-500/10 to-purple-500/5', icon: '🤖❤️' },
            { title: 'Team Transformation', desc: 'Witness diverse team success', color: 'from-green-500/10 to-green-500/5', icon: '🌟' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 p-6">
                <div className="text-2xl mb-3">{item.icon}</div>
                <Badge variant="secondary" className="mb-3">{index + 1}</Badge>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation and Begin Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button 
            onClick={() => navigate('/chapter/7')}
            variant="outline"
            className="px-6 py-3"
          >
            Back to Chapter 7
          </Button>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Button 
              onClick={() => setCurrentPhase('narrative')}
              size="lg"
              className="relative text-white text-lg px-8 py-4 font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin Hiring Journey
            </Button>
          </div>
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
                {showPromptPreview ? 'Hide' : 'AI Prompt'}
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
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Approach</h2>
                <p className="text-gray-600">Select how you'd like to build your compassionate hiring strategy</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  <Button
                    variant={!useSliderMode ? "default" : "outline"}
                    onClick={() => {
                      setUseSliderMode(false);
                      setWorkshopStep('configure');
                    }}
                    className="relative w-full h-24 flex-col gap-2 p-4 text-left"
                  >
                    <Target className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-base">Quick Selection</div>
                      <div className="text-sm opacity-75">Choose from predefined options</div>
                    </div>
                  </Button>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  <Button
                    variant={useSliderMode ? "default" : "outline"}
                    onClick={() => {
                      setUseSliderMode(true);
                      setWorkshopStep('configure');
                    }}
                    className="relative w-full h-24 flex-col gap-2 p-4 text-left"
                  >
                    <Sliders className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-base">Custom Calibration</div>
                      <div className="text-sm opacity-75">Fine-tune with preference sliders</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Clear Call to Action */}
              <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg p-4 text-center border border-purple-200">
                <p className="text-purple-800 font-medium">👆 Choose one approach above to get started</p>
                <p className="text-sm text-purple-600 mt-1">Both paths will create a personalized hiring strategy for you</p>
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
              <div className="bg-white rounded-lg border-2 border-gray-100 p-6 min-h-[280px] max-h-[350px] shadow-sm">
                {tabConfigs[activeTab] && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {tabConfigs[activeTab].icon}
                        <h3 className="font-bold text-lg text-gray-900">
                          Select {tabConfigs[activeTab].label}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {getCurrentTabSelections().length}/{tabConfigs[activeTab].maxSelections}
                        </span>
                        <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${(getCurrentTabSelections().length / tabConfigs[activeTab].maxSelections) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tabConfigs[activeTab].options.map((option) => {
                        const isSelected = getCurrentTabSelections().includes(option.id);
                        const isDisabled = !isSelected && getCurrentTabSelections().length >= tabConfigs[activeTab].maxSelections;
                        
                        return (
                          <div key={option.id} className="relative">
                            <button
                              onClick={() => handleTabSelection(tabConfigs[activeTab].id, option.id)}
                              disabled={isDisabled}
                              className={cn(
                                "w-full p-4 text-left text-sm rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                                isSelected 
                                  ? "border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-900 shadow-md" 
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                                isDisabled && "opacity-50 cursor-not-allowed hover:scale-100"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  isSelected 
                                    ? "border-purple-500 bg-purple-500" 
                                    : "border-gray-300"
                                )}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-base leading-tight mb-1">
                                    {option.label}
                                  </div>
                                  {option.description && (
                                    <div className="text-xs text-gray-500 leading-tight">
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selection Helper Text */}
                    {getCurrentTabSelections().length === 0 && (
                      <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          👆 Select up to {tabConfigs[activeTab].maxSelections} {tabConfigs[activeTab].label.toLowerCase()} to continue
                        </p>
                      </div>
                    )}
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

          {/* Configure Step - Slider Mode */}
          {workshopStep === 'configure' && useSliderMode && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Custom Calibration</h2>
                <p className="text-gray-600">Fine-tune your hiring preferences with precision sliders</p>
              </div>
              
              <div className="bg-white rounded-lg border-2 border-gray-100 p-6 shadow-sm max-h-[400px] overflow-y-auto">
                <div className="space-y-6">
                  {/* Quick Presets */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-sm mb-3">Quick Presets:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { name: 'Startup Growth', values: { diversity: 8, speed: 3, experience: 7 } },
                        { name: 'Enterprise Quality', values: { diversity: 7, speed: 8, experience: 3 } },
                        { name: 'Balanced Approach', values: { diversity: 7, speed: 6, experience: 5 } },
                        { name: 'Diversity First', values: { diversity: 10, speed: 7, experience: 6 } }
                      ].map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          className="h-auto p-2 text-xs"
                          onClick={() => {
                            // Apply preset values
                            console.log('Applying preset:', preset.name);
                          }}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Key Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diversity Priority (7/10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        defaultValue="7"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Standard</span>
                        <span>Critical Priority</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speed vs Quality (6/10)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        defaultValue="6"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fast Hiring</span>
                        <span>Thorough Process</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience vs Potential (5/10)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        defaultValue="5"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Proven Experience</span>
                        <span>High Potential</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={generateHiringStrategy}
                  disabled={isGenerating}
                  className="px-6 py-2"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 animate-pulse" />
                      Calibrating...
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4 mr-2" />
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
              <h2 className="text-xl font-bold mb-2">Lyra is generating your strategy...</h2>
              <p className="text-gray-600">Combining AI efficiency with human empathy</p>
            </div>
          )}

          {/* Review Step - Meaningful Strategy Content */}
          {workshopStep === 'review' && generatedStrategy && (
            <div className="space-y-6">
              {/* Success Header with Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-2xl blur-xl" />
                <div className="relative bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Your Hiring Strategy is Ready!</h2>
                  <p className="text-gray-600">Carmen's AI-powered framework with actionable insights and practical tools</p>
                  
                  {/* Strategy Metrics */}
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{getTotalSelections()}</div>
                      <div className="text-xs text-gray-500">Key Selections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">6</div>
                      <div className="text-xs text-gray-500">Success Metrics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">5</div>
                      <div className="text-xs text-gray-500">Templates</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Comprehensive Strategy Content */}
              <StrategyContentRendererFocused 
                generatedStrategy={generatedStrategy}
                selections={selections}
                tabConfigs={tabConfigs}
              />

              {/* Complete Workshop Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white text-lg px-8 py-4 font-semibold"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Complete Workshop
                </Button>
              </motion.div>
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