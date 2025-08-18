import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Heart, Users, TrendingUp, Clock, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

interface EngagementFrameworkElement {
  id: string;
  title: string;
  description: string;
  approach: string;
  example: string;
}

const CarmenEngagementBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Team size options
  const teamSizeOptions: OptionItem[] = [
    { id: 'small-team', label: 'Small Team', description: '2-10 people', icon: 'teamSmall', recommended: true },
    { id: 'medium-team', label: 'Medium Team', description: '11-25 people', icon: 'teamMedium' },
    { id: 'large-team', label: 'Large Team', description: '26-50 people', icon: 'teamLarge' },
    { id: 'department', label: 'Department', description: '51+ people', icon: 'teamDepartment' }
  ];

  // Engagement challenge options
  const challengeOptions: OptionItem[] = [
    { id: 'low-motivation', label: 'Low Team Motivation', description: 'Team seems disengaged or uninspired', icon: 'engagementDecline', recommended: true },
    { id: 'poor-communication', label: 'Communication Issues', description: 'Team members don\'t communicate effectively', icon: 'engagementChat', recommended: true },
    { id: 'lack-recognition', label: 'Insufficient Recognition', description: 'Good work goes unnoticed', icon: 'engagementReward' },
    { id: 'unclear-goals', label: 'Unclear Goals', description: 'Team lacks clear direction', icon: 'engagementTarget' },
    { id: 'work-life-balance', label: 'Work-Life Balance Issues', description: 'Team is overworked or stressed', icon: 'engagementBalance' },
    { id: 'limited-growth', label: 'Limited Growth Opportunities', description: 'No clear career development paths', icon: 'engagementRocket' },
    { id: 'cultural-misalignment', label: 'Cultural Misalignment', description: 'Values don\'t match organization', icon: 'engagementCulture' },
    { id: 'resource-constraints', label: 'Resource Constraints', description: 'Lacking tools or support to succeed', icon: 'engagementTools' }
  ];

  // Engagement strategy options
  const strategyOptions: OptionItem[] = [
    { id: 'personalized-recognition', label: 'Personalized Recognition', description: 'Tailored appreciation systems', icon: 'engagementStar', recommended: true },
    { id: 'career-conversations', label: 'Regular Career Conversations', description: 'One-on-one growth discussions', icon: 'engagementConversation', recommended: true },
    { id: 'flexible-work', label: 'Flexible Work Options', description: 'Remote work and flexible hours', icon: 'engagementHome' },
    { id: 'skill-development', label: 'Skill Development Programs', description: 'Learning and training opportunities', icon: 'engagementTraining' },
    { id: 'team-building', label: 'Team Building Activities', description: 'Social connection and collaboration', icon: 'engagementTeam' },
    { id: 'wellness-programs', label: 'Wellness Initiatives', description: 'Mental health and wellbeing support', icon: 'engagementWellness' },
    { id: 'feedback-systems', label: 'Continuous Feedback', description: 'Regular check-ins and reviews', icon: 'engagementFeedback' },
    { id: 'autonomy-building', label: 'Increased Autonomy', description: 'More decision-making freedom', icon: 'engagementKey' }
  ];

  // Engagement goal options
  const goalOptions: OptionItem[] = [
    { id: 'increase-satisfaction', label: 'Increase Job Satisfaction', description: 'Higher happiness and fulfillment', icon: 'engagementHappy', recommended: true },
    { id: 'improve-productivity', label: 'Boost Team Productivity', description: 'Better performance and output', icon: 'engagementSpeed', recommended: true },
    { id: 'reduce-turnover', label: 'Reduce Turnover', description: 'Keep top talent longer', icon: 'engagementRetention' },
    { id: 'enhance-collaboration', label: 'Improve Collaboration', description: 'Better teamwork and communication', icon: 'engagementHandshake' },
    { id: 'build-culture', label: 'Strengthen Culture', description: 'Create sense of belonging', icon: 'engagementCulture' },
    { id: 'develop-leaders', label: 'Develop Future Leaders', description: 'Build internal leadership pipeline', icon: 'engagementCrown' },
    { id: 'increase-innovation', label: 'Drive Innovation', description: 'Encourage creative thinking', icon: 'engagementLightbulb' },
    { id: 'improve-communication', label: 'Better Communication', description: 'Clear, open dialogue', icon: 'engagementChat' }
  ];

  const engagementFrameworkElements: EngagementFrameworkElement[] = [
    {
      id: 'individual-insights',
      title: 'AI-Powered Individual Insights',
      description: 'Understand each person\'s unique motivation patterns',
      approach: 'Use data analytics to identify communication styles, work preferences, and recognition needs',
      example: 'Sarah thrives on public recognition while Alex prefers private feedback and growth opportunities'
    },
    {
      id: 'personalized-recognition',
      title: 'Personalized Recognition Systems',
      description: 'Multiple pathways for meaningful appreciation',
      approach: 'Diverse recognition options matching different personality types and preferences',
      example: 'Offer peer nominations, skill spotlights, project celebrations, and growth milestones'
    },
    {
      id: 'growth-alignment',
      title: 'Growth & Mission Alignment',
      description: 'Connect individual aspirations with organizational purpose',
      approach: 'Regular conversations linking personal goals to mission impact',
      example: 'Map each person\'s career aspirations to meaningful projects that advance our mission'
    },
    {
      id: 'psychological-safety',
      title: 'Psychological Safety Culture',
      description: 'Environment where everyone feels valued to contribute fully',
      approach: 'Create safe spaces for feedback, ideas, and authentic self-expression',
      example: 'Regular team retrospectives, anonymous suggestion systems, and open-door policies'
    },
    {
      id: 'continuous-pulse',
      title: 'Continuous Engagement Pulse',
      description: 'Real-time insights into team satisfaction and motivation',
      approach: 'Regular check-ins, pulse surveys, and proactive support systems',
      example: 'Weekly one-on-ones, monthly team health checks, and quarterly deep-dive reviews'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I watched our best program manager, Jamie, quietly disengage over three months, despite being incredibly talented.",
      emotion: 'concerned' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our engagement surveys showed 'satisfactory' scores, but I could feel the energy drain from our team meetings.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "That's when I realized we were treating engagement like a one-size-fits-all problem. But people are beautifully unique.",
      emotion: 'enlightened' as const
    },
    {
      id: '4',
      content: "I started using AI to understand each person's individual motivation patterns - their communication style, recognition preferences, growth aspirations.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "For Jamie, it wasn't about money or title. They craved intellectual challenge and wanted to see their work's direct impact on our mission.",
      emotion: 'insightful' as const
    },
    {
      id: '6',
      content: "We redesigned our approach: AI-powered individual insights, personalized recognition, growth alignment, psychological safety, and continuous pulse checks.",
      emotion: 'strategic' as const
    },
    {
      id: '7',
      content: "Within two months, Jamie was leading our most innovative project. Team engagement scores jumped from 3.2 to 4.7 out of 5.",
      emotion: 'triumphant' as const
    },
    {
      id: '8',
      content: "Now I'll show you how to create personalized engagement strategies that make every team member feel truly valued and motivated.",
      emotion: 'empowered' as const
    }
  ];

  // Update prompt segments when selections change
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to create personalized engagement strategies using AI insights and human empathy to make every team member feel uniquely valued and motivated.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'team-data',
        label: 'Team Information',
        value: selectedTeamSize.length > 0 ? `Team size: ${teamSizeOptions.find(opt => selectedTeamSize.includes(opt.id))?.label || selectedTeamSize.join(', ')}` : '',
        type: 'data',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'challenges',
        label: 'Engagement Challenges',
        value: selectedChallenges.length > 0 ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'strategies',
        label: 'Preferred Strategies',
        value: selectedStrategies.length > 0 ? `Engagement strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Engagement Goals',
        value: selectedGoals.length > 0 ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive engagement strategy using Carmen\'s framework: 1) AI-Powered Individual Insights, 2) Personalized Recognition Systems, 3) Growth & Mission Alignment, 4) Psychological Safety Culture, 5) Continuous Engagement Pulse. Include specific implementation steps and measurement approaches.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedTeamSize, selectedChallenges, selectedStrategies, selectedGoals]);

  const generateEngagementStrategy = async () => {
    if (selectedTeamSize.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'personalized-engagement-strategy',
          topic: 'AI-powered employee engagement with personalization',
          context: `Carmen Rodriguez needs to create a comprehensive engagement strategy using her personalized AI approach.
          
          Team Size: ${teamSizeOptions.find(opt => selectedTeamSize.includes(opt.id))?.label || selectedTeamSize.join(', ')}
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Preferred Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Engagement Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          
          Create a structured engagement strategy that follows Carmen's framework: 1) AI-Powered Individual Insights (understand unique motivation patterns), 2) Personalized Recognition Systems (multiple appreciation pathways), 3) Growth & Mission Alignment (connect aspirations to purpose), 4) Psychological Safety Culture (safe authentic expression), 5) Continuous Engagement Pulse (real-time team health). The strategy should make every team member feel uniquely valued and motivated.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Engagement Strategy Created!",
        description: "Carmen crafted your personalized team engagement plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Engagement Builder Mastery Complete!",
      description: "You've mastered Carmen's personalized engagement framework!",
    });
    navigate('/chapter/7');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Carmen Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('carmen-engagement-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('engagementSatisfied')} alt="Engagement" className="w-12 h-12" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Engagement Builder
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create personalized engagement strategies using AI insights and human empathy
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Engagement Crisis', desc: 'Carmen\'s team disengagement struggles', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-engagement-crisis.mp4', fallback: <img src={getCarmenManagementIconUrl('engagementMask')} alt="Crisis" className="w-8 h-8" /> },
            { title: 'Personalization Discovery', desc: 'Learn individual motivation patterns', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-personalization-discovery.mp4', fallback: <img src={getCarmenManagementIconUrl('engagementShining')} alt="Discovery" className="w-8 h-8" /> },
            { title: 'Team Transformation', desc: 'Witness engagement renaissance', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-engagement-success.mp4', fallback: <img src={getCarmenManagementIconUrl('engagementRocket')} alt="Success" className="w-8 h-8" /> }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={item.fallback}
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

        {/* Navigation and Begin Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Back to Chapter 7 Button */}
          <Button 
            onClick={() => navigate('/chapter/7')}
            variant="outline"
            className="nm-button nm-button-secondary px-6 py-3"
            aria-label="Return to Chapter 7 main page"
          >
            Back to Chapter 7
          </Button>
          
          {/* Begin Button */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Button 
              onClick={() => setCurrentPhase('narrative')}
              size="lg"
              className="relative nm-button nm-button-primary text-white text-lg px-8 py-4 font-semibold transition-all duration-300"
              aria-label="Start Carmen's engagement building journey - Learn to create personalized engagement strategies using AI insights and human empathy"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Engagement Journey
              <span className="sr-only">This workshop teaches personalized engagement strategies that make every team member feel uniquely valued</span>
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
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Personalized Engagement Builder"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-engagement-narrative"
          characterName="Carmen"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Personalized Engagement Builder"
        characterName="Carmen"
        progress={66 + (currentStep / 5) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 5) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Personalized Engagement Workshop</p>
            <Button className="nm-button nm-button-secondary" onClick={() => navigate('/chapter/7')} aria-label="Return to Chapter 7 main page">
              Back to Chapter 7
            </Button>
          </div>
        </div>

        {/* Mobile Tabbed Layout (visible only on mobile) */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-2 mb-4">
            {['Options', 'Prompt', 'Results'].map((tab, index) => (
              <Button
                key={tab}
                variant={currentStep === index ? "default" : "outline"}
                onClick={() => setCurrentStep(index)}
                className="flex-1 text-sm"
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Three-Panel Viewport Optimized Layout */}
        <div className="grid lg:grid-cols-12 gap-6 min-h-[calc(100vh-16rem)]">
          {/* Left Panel - Option Selection (4 columns on desktop) */}
          <div className={cn(
            "lg:col-span-4 space-y-4 max-h-[calc(100vh-18rem)] overflow-y-auto lg:pr-4",
            "lg:block", 
            currentStep === 0 ? "block" : "hidden"
          )}>
            {/* Team Size Selection - Compact */}
            <VisualOptionGrid
              title="Team Size"
              description="How large is the team?"
              options={teamSizeOptions}
              selectedIds={selectedTeamSize}
              onSelectionChange={setSelectedTeamSize}
              multiSelect={false}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Engagement Challenges - Compact */}
            <VisualOptionGrid
              title="Challenges"
              description="Engagement issues"
              options={challengeOptions}
              selectedIds={selectedChallenges}
              onSelectionChange={setSelectedChallenges}
              multiSelect={true}
              maxSelections={4}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Engagement Strategies - Compact */}
            <VisualOptionGrid
              title="Strategies"
              description="How to improve engagement"
              options={strategyOptions}
              selectedIds={selectedStrategies}
              onSelectionChange={setSelectedStrategies}
              multiSelect={true}
              maxSelections={4}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Engagement Goals - Compact */}
            <VisualOptionGrid
              title="Goals"
              description="Target outcomes"
              options={goalOptions}
              selectedIds={selectedGoals}
              onSelectionChange={setSelectedGoals}
              multiSelect={true}
              maxSelections={3}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Generate Button - Compact */}
            <Card>
              <CardContent className="p-4 text-center">
                <Button 
                  onClick={generateEngagementStrategy}
                  disabled={selectedTeamSize.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0 || isGenerating}
                  className="w-full nm-button nm-button-primary text-base py-2"
                  aria-label={isGenerating ? "Creating your personalized engagement strategy" : "Generate personalized engagement strategy using AI insights and human empathy"}
                  aria-describedby="engagement-generation-status"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                      <span aria-live="polite">Carmen is crafting your strategy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                      Create Personalized Engagement Strategy
                    </>
                  )}
                  <div id="engagement-generation-status" className="sr-only">
                    {isGenerating ? "AI is currently generating your personalized engagement strategy. Please wait." : "Click to generate your engagement strategy"}
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Sticky Prompt Builder (4 columns on desktop) */}
          <div className={cn(
            "lg:col-span-4 lg:sticky lg:top-4 lg:self-start max-h-[calc(100vh-18rem)] overflow-y-auto lg:px-4",
            "lg:block",
            currentStep === 1 ? "block" : "hidden"
          )}>
            {/* Dynamic Prompt Builder */}
            <DynamicPromptBuilder
              segments={promptSegments}
              characterName="Carmen"
              characterTheme="carmen"
              showCopyButton={true}
              autoUpdate={true}
            />
          </div>

          {/* Right Panel - Results (4 columns on desktop) */}
          <div className={cn(
            "lg:col-span-4 space-y-6 max-h-[calc(100vh-18rem)] overflow-y-auto lg:pl-4",
            "lg:block",
            currentStep === 2 ? "block" : "hidden"
          )}>

            {/* Generated Strategy - Full Height */}
            {generatedStrategy ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Engagement Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg h-full overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedStrategy}
                      contentType="lesson"
                      variant="default"
                      showMergeFieldTypes={true}
                      className="formatted-ai-content"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-dashed border-2 border-gray-300">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Strategy Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Personalized Engagement Strategy" to see Carmen's framework.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedStrategy && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="nm-button nm-button-success text-white px-8 py-3"
              aria-label="Complete the engagement builder workshop and return to Chapter 7"
            >
              Complete Engagement Builder Workshop
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

export default CarmenEngagementBuilder;