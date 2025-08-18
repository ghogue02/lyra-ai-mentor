import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Heart, TrendingUp, Award, Copy, Download, Wand2, Play, Sparkles, ArrowDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { PriorityCardSystem, PriorityCard } from '@/components/ui/interaction-patterns/PriorityCardSystem';
import { 
  createRetentionPriorityCards, 
  extractPriorityInsights,
  generateRetentionRecommendations 
} from '@/utils/retentionPriorityHelpers';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

const CarmenRetentionMastery: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);
  const [priorityMode, setPriorityMode] = useState<'selection' | 'prioritization'>('selection');
  const [riskCards, setRiskCards] = useState<PriorityCard[]>([]);
  const [interventionCards, setInterventionCards] = useState<PriorityCard[]>([]);
  const [goalCards, setGoalCards] = useState<PriorityCard[]>([]);
  const [priorityInsights, setPriorityInsights] = useState('');

  // Retention risk factors
  const riskOptions: OptionItem[] = [
    { id: 'low-engagement', label: 'Decreased Engagement', description: 'Lower participation in meetings/activities', icon: 'retentionDecline', recommended: true },
    { id: 'career-stagnation', label: 'Career Stagnation', description: 'No recent promotions or growth', icon: 'retentionStagnation', recommended: true },
    { id: 'skill-mismatch', label: 'Skills Underutilization', description: 'Talents not being fully used', icon: 'retentionTarget' },
    { id: 'poor-management', label: 'Management Issues', description: 'Conflicts with supervisor', icon: 'retentionWarning' },
    { id: 'work-life-balance', label: 'Work-Life Imbalance', description: 'Burnout or overwork concerns', icon: 'retentionBalance' },
    { id: 'compensation-gap', label: 'Compensation Concerns', description: 'Below-market pay or benefits', icon: 'retentionMoney' },
    { id: 'limited-autonomy', label: 'Limited Autonomy', description: 'Micromanagement or control issues', icon: 'retentionLocked' },
    { id: 'cultural-misfit', label: 'Cultural Misalignment', description: 'Values don\'t match organization', icon: 'retentionCulture' }
  ];

  // Intervention strategies
  const interventionOptions: OptionItem[] = [
    { id: 'career-conversations', label: 'Career Development Talks', description: 'One-on-one growth discussions', icon: 'retentionConversation', recommended: true },
    { id: 'skill-development', label: 'Skill Development Programs', description: 'Training and learning opportunities', icon: 'retentionTraining', recommended: true },
    { id: 'project-leadership', label: 'Leadership Opportunities', description: 'Lead projects or initiatives', icon: 'retentionLeadership' },
    { id: 'mentorship', label: 'Mentorship Programs', description: 'Pair with senior leaders', icon: 'retentionMentorship' },
    { id: 'flexible-work', label: 'Work Flexibility', description: 'Remote work or flexible hours', icon: 'retentionHome' },
    { id: 'recognition-programs', label: 'Recognition & Rewards', description: 'Celebrate achievements publicly', icon: 'retentionRewards' },
    { id: 'cross-training', label: 'Cross-Department Exposure', description: 'Experience different roles', icon: 'retentionRotation' },
    { id: 'wellness-support', label: 'Wellness Initiatives', description: 'Mental health and wellbeing', icon: 'retentionWellness' }
  ];

  // Success metrics
  const metricsOptions: OptionItem[] = [
    { id: 'retention-rate', label: 'Overall Retention Rate', description: 'Percentage of employees staying', icon: 'retentionStats', recommended: true },
    { id: 'engagement-scores', label: 'Employee Engagement', description: 'Regular satisfaction surveys', icon: 'retentionHeart', recommended: true },
    { id: 'internal-promotions', label: 'Internal Promotion Rate', description: 'Growth opportunities realized', icon: 'retentionUp' },
    { id: 'flight-risk-reduction', label: 'Flight Risk Scores', description: 'AI-predicted retention likelihood', icon: 'retentionTarget' },
    { id: 'career-satisfaction', label: 'Career Development Satisfaction', description: 'Growth pathway happiness', icon: 'retentionStar' },
    { id: 'manager-effectiveness', label: 'Manager Effectiveness', description: 'Leadership impact scores', icon: 'retentionManager' },
    { id: 'time-to-productivity', label: 'New Role Adaptation', description: 'Speed of adjustment to changes', icon: 'retentionSpeed' },
    { id: 'referral-quality', label: 'Employee Referral Quality', description: 'Team members recommend company', icon: 'retentionSpeak' }
  ];

  // Retention goals
  const goalOptions: OptionItem[] = [
    { id: 'retain-top-talent', label: 'Retain High Performers', description: 'Keep your best people engaged', icon: 'retentionTopStar', recommended: true },
    { id: 'reduce-turnover-costs', label: 'Reduce Turnover Costs', description: 'Lower hiring and training expenses', icon: 'retentionCostMoney', recommended: true },
    { id: 'improve-culture', label: 'Strengthen Team Culture', description: 'Build belonging and connection', icon: 'retentionHandshake' },
    { id: 'career-pathing', label: 'Create Clear Career Paths', description: 'Show growth opportunities', icon: 'retentionPath' },
    { id: 'predictive-retention', label: 'Proactive Intervention', description: 'Address issues before they become problems', icon: 'retentionCrystalBall' },
    { id: 'succession-planning', label: 'Build Succession Pipeline', description: 'Develop internal leadership', icon: 'retentionTeam' },
    { id: 'knowledge-retention', label: 'Preserve Institutional Knowledge', description: 'Keep expertise within organization', icon: 'retentionBrain' },
    { id: 'competitive-advantage', label: 'Maintain Competitive Edge', description: 'Outperform industry retention rates', icon: 'retentionRocket' }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I'll never forget the day our star program manager, Alex, submitted their resignation. I was blindsided - they seemed happy, engaged, successful.",
      emotion: 'concerned' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "That's when I realized we were playing defense instead of offense. We were reacting to resignations instead of predicting and preventing them.",
      emotion: 'enlightened' as const
    },
    {
      id: '3',
      content: "I started using AI to identify early warning signs - patterns in engagement, communication changes, performance shifts. The data told stories we weren't seeing.",
      emotion: 'strategic' as const
    },
    {
      id: '4',
      content: "But data without heart is just numbers. I combined predictive insights with genuine human connection - coffee conversations, career dreams, personal check-ins.",
      emotion: 'empathetic' as const
    },
    {
      id: '5',
      content: "Now we don't lose people anymore - we grow them. Our retention isn't about keeping people; it's about creating a place where they choose to stay and flourish.",
      emotion: 'triumphant' as const
    }
  ];

  // Update prompt segments when selections change
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to create advanced retention strategies that combine predictive AI insights with deeply human approaches to keeping best people engaged and growing.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'risk-factors',
        label: 'Retention Risk Factors',
        value: priorityMode === 'prioritization' && riskCards.length > 0 
          ? `Priority risk factors: ${extractPriorityInsights(riskCards)}`
          : selectedRisks.length > 0 
            ? `Key risk factors: ${selectedRisks.map(id => riskOptions.find(opt => opt.id === id)?.label).join(', ')}`
            : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'interventions',
        label: 'Intervention Strategies',
        value: priorityMode === 'prioritization' && interventionCards.length > 0
          ? `Priority interventions: ${extractPriorityInsights(interventionCards)}`
          : selectedInterventions.length > 0 
            ? `Preferred interventions: ${selectedInterventions.map(id => interventionOptions.find(opt => opt.id === id)?.label).join(', ')}`
            : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Retention Goals',
        value: priorityMode === 'prioritization' && goalCards.length > 0
          ? `Priority goals: ${extractPriorityInsights(goalCards)}`
          : selectedGoals.length > 0 
            ? `Strategic objectives: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}`
            : '',
        type: 'instruction',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'metrics',
        label: 'Success Metrics',
        value: selectedMetrics.length > 0 ? `Key metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'priority-insights',
        label: 'Priority Insights',
        value: priorityInsights,
        type: 'data',
        color: 'border-l-cyan-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive retention mastery strategy using Carmen\'s PREDICT-CONNECT-ELEVATE model: 1) Predictive AI analytics for early warning systems, 2) Human connection through genuine conversations, 3) Elevation through personalized growth opportunities. Include implementation roadmap, intervention protocols, and measurement systems.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedRisks, selectedInterventions, selectedGoals, selectedMetrics, priorityMode, riskCards, interventionCards, goalCards, priorityInsights]);

  // Handle priority mode transition
  const handleProceedToPrioritization = () => {
    if (selectedRisks.length === 0 || selectedInterventions.length === 0 || selectedGoals.length === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select at least one item from each category before prioritizing.",
        variant: "destructive"
      });
      return;
    }

    const priorityData = createRetentionPriorityCards(
      {
        riskFactors: selectedRisks,
        interventions: selectedInterventions,
        goals: selectedGoals,
        metrics: selectedMetrics
      },
      riskOptions,
      interventionOptions,
      goalOptions
    );

    setRiskCards(priorityData.riskCards);
    setInterventionCards(priorityData.interventionCards);
    setGoalCards(priorityData.goalCards);
    setPriorityMode('prioritization');

    toast({
      title: "Priority Mode Activated!",
      description: "Now drag and drop to prioritize your retention strategy elements."
    });
  };

  // Handle priority change
  const handlePriorityChange = (cardId: string, newPriority: number, impact: string) => {
    setPriorityInsights(impact);
  };

  const generateRetentionStrategy = async () => {
    const hasSelections = selectedRisks.length > 0 && selectedInterventions.length > 0 && selectedGoals.length > 0;
    const hasPriorities = riskCards.length > 0 && interventionCards.length > 0 && goalCards.length > 0;
    
    if (!hasSelections && !hasPriorities) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'retention-mastery-strategy',
          topic: 'Advanced AI-powered retention with human approach',
          context: `Carmen Rodriguez needs to create advanced retention strategies that combine predictive AI insights with deeply human approaches to keeping best people engaged and growing.
          
          ${priorityMode === 'prioritization' && riskCards.length > 0
            ? `Priority Risk Factors: ${riskCards.slice(0, 3).map(c => `${c.priority}. ${c.title}`).join(', ')}`
            : `Retention Risk Factors: ${selectedRisks.map(id => riskOptions.find(opt => opt.id === id)?.label).join(', ')}`}
          ${priorityMode === 'prioritization' && interventionCards.length > 0
            ? `Priority Intervention Strategies: ${interventionCards.slice(0, 3).map(c => `${c.priority}. ${c.title}`).join(', ')}`
            : `Intervention Strategies: ${selectedInterventions.map(id => interventionOptions.find(opt => opt.id === id)?.label).join(', ')}`}
          ${priorityMode === 'prioritization' && goalCards.length > 0
            ? `Priority Strategic Goals: ${goalCards.slice(0, 3).map(c => `${c.priority}. ${c.title}`).join(', ')}`
            : `Strategic Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}`}
          Success Metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}
          ${priorityInsights ? `Priority Analysis: ${priorityInsights}` : ''}
          
          Create a retention mastery strategy using Carmen's philosophy: "True retention isn't about keeping people—it's about creating an environment where they choose to stay and flourish." Use the PREDICT-CONNECT-ELEVATE model with actionable implementation steps.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Retention Strategy Created!",
        description: "Carmen designed your advanced retention mastery framework.",
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
      title: "Retention Strategy Mastery Complete!",
      description: "You've mastered Carmen's predictive retention approach!",
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
            src={getAnimationUrl('carmen-retention-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('retentionHandshake')} alt="Retention" className="w-12 h-12" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Retention Strategy Mastery
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Master advanced retention strategies that combine AI prediction with human connection
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Retention Crisis', desc: 'Losing star talent unexpectedly', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-retention-crisis.mp4', fallback: <img src={getCarmenManagementIconUrl('retentionDecline')} alt="Crisis" className="w-8 h-8" /> },
            { title: 'Predictive Mastery', desc: 'AI + empathy = retention success', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-predictive-retention.mp4', fallback: <img src={getCarmenManagementIconUrl('retentionCrystalBall')} alt="Predictive" className="w-8 h-8" /> },
            { title: 'Flourishing Teams', desc: 'People choose to stay and grow', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-retention-success.mp4', fallback: <img src={getCarmenManagementIconUrl('retentionUp')} alt="Success" className="w-8 h-8" /> }
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
              aria-label="Start Carmen's retention mastery journey - Learn predictive retention strategies with AI and empathy"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Retention Mastery Journey
              <span className="sr-only">This workshop teaches advanced retention strategies using AI prediction combined with human connection</span>
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
        lessonTitle="Retention Strategy Mastery"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-retention-narrative"
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
        lessonTitle="Retention Strategy Mastery"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Retention Strategy Workshop</p>
            <Button className="nm-button nm-button-secondary" onClick={() => navigate('/chapter/7')} aria-label="Return to Chapter 7 main page">
              Back to Chapter 7
            </Button>
          </div>
        </div>

        {/* Mobile Tabbed Layout (visible only on mobile) */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-2 mb-4">
            {priorityMode === 'selection' ? (
              ['Selection', 'Prompt', 'Results'].map((tab, index) => (
                <Button
                  key={tab}
                  variant={currentStep === index ? "default" : "outline"}
                  onClick={() => setCurrentStep(index)}
                  className="flex-1 text-sm"
                >
                  {tab}
                </Button>
              ))
            ) : (
              ['Prioritize', 'Prompt', 'Results'].map((tab, index) => (
                <Button
                  key={tab}
                  variant={currentStep === index ? "default" : "outline"}
                  onClick={() => setCurrentStep(index)}
                  className="flex-1 text-sm"
                >
                  {tab}
                </Button>
              ))
            )}
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
            {priorityMode === 'selection' ? (
              <>
                {/* Risk Factors - Compact */}
                <VisualOptionGrid
                  title="Risk Factors"
                  description="Warning signs to predict"
                  options={riskOptions}
                  selectedIds={selectedRisks}
                  onSelectionChange={setSelectedRisks}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Intervention Strategies - Compact */}
                <VisualOptionGrid
                  title="Interventions"
                  description="Proactive strategies"
                  options={interventionOptions}
                  selectedIds={selectedInterventions}
                  onSelectionChange={setSelectedInterventions}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Retention Goals - Compact */}
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

                {/* Success Metrics - Compact */}
                <VisualOptionGrid
                  title="Metrics"
                  description="Success measures"
                  options={metricsOptions}
                  selectedIds={selectedMetrics}
                  onSelectionChange={setSelectedMetrics}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Proceed to Prioritization Button */}
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <Button 
                      onClick={handleProceedToPrioritization}
                      disabled={selectedRisks.length === 0 || selectedInterventions.length === 0 || selectedGoals.length === 0}
                      className="w-full nm-button nm-button-secondary text-base py-2"
                      aria-label="Proceed to priority ranking with drag-and-drop interface"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                      Prioritize Selections
                    </Button>
                    
                    <Button 
                      onClick={generateRetentionStrategy}
                      disabled={selectedRisks.length === 0 || selectedInterventions.length === 0 || selectedGoals.length === 0 || isGenerating}
                      className="w-full nm-button nm-button-primary text-base py-2"
                      aria-label={isGenerating ? "Creating your advanced retention strategy" : "Generate advanced retention strategy using Carmen's PREDICT-CONNECT-ELEVATE model"}
                      aria-describedby="retention-generation-status"
                    >
                      {isGenerating ? (
                        <>
                          <Shield className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                          <span aria-live="polite">Creating Strategy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                          Generate Strategy
                        </>
                      )}
                      <div id="retention-generation-status" className="sr-only">
                        {isGenerating ? "AI is currently generating your personalized retention strategy. Please wait." : "Click to generate your retention strategy"}
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Priority Card Systems */}
                <PriorityCardSystem
                  title="Risk Factor Priorities"
                  description="Drag to rank retention risks by urgency"
                  cards={riskCards}
                  onCardsChange={setRiskCards}
                  characterTheme="carmen"
                  showImpactScore={true}
                  compactMode={true}
                  showPriorityTips={false}
                  onPriorityChange={handlePriorityChange}
                />

                <PriorityCardSystem
                  title="Intervention Priorities"
                  description="Rank intervention strategies by implementation priority"
                  cards={interventionCards}
                  onCardsChange={setInterventionCards}
                  characterTheme="carmen"
                  showImpactScore={true}
                  compactMode={true}
                  showPriorityTips={false}
                  onPriorityChange={handlePriorityChange}
                />

                <PriorityCardSystem
                  title="Goal Priorities"
                  description="Prioritize strategic retention objectives"
                  cards={goalCards}
                  onCardsChange={setGoalCards}
                  characterTheme="carmen"
                  showImpactScore={true}
                  compactMode={true}
                  showPriorityTips={false}
                  onPriorityChange={handlePriorityChange}
                />

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <Button 
                      onClick={() => setPriorityMode('selection')}
                      variant="outline"
                      className="w-full text-base py-2"
                    >
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Back to Selection
                    </Button>
                    
                    <Button 
                      onClick={generateRetentionStrategy}
                      disabled={isGenerating}
                      className="w-full nm-button nm-button-primary text-base py-2"
                    >
                      {isGenerating ? (
                        <>
                          <Shield className="w-4 h-4 mr-2 animate-pulse" />
                          Creating Strategy...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Prioritized Strategy
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
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
                    <Award className="w-5 h-5 text-green-600" />
                    {priorityMode === 'prioritization' ? 'Your Prioritized Retention Strategy' : 'Your Retention Strategy'}
                  </CardTitle>
                  {priorityMode === 'prioritization' && (
                    <div className="text-sm text-gray-600">
                      Strategy generated with priority-ranked elements
                    </div>
                  )}
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
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Strategy Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      {priorityMode === 'selection' 
                        ? "Make your selections and optionally prioritize them, then click 'Generate Strategy'."
                        : "Finish prioritizing your elements and click 'Generate Prioritized Strategy'."}
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
              aria-label="Complete the retention strategy mastery workshop and return to Chapter 7"
            >
              <Heart className="w-5 h-5 mr-2" />
              Complete Retention Strategy Mastery
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

export default CarmenRetentionMastery;