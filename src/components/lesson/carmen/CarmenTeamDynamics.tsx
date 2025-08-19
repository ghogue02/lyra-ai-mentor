import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb, TrendingUp, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { PriorityCardSystem, PriorityCard } from '@/components/ui/interaction-patterns/PriorityCardSystem';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

interface TeamDynamicsElement {
  id: string;
  type: 'assessment' | 'strategy' | 'implementation' | 'monitoring';
  title: string;
  description: string;
  example: string;
}

const CarmenTeamDynamics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [teamDynamicsPriorities, setTeamDynamicsPriorities] = useState<PriorityCard[]>([]);
  const [currentOptimizationPhase, setCurrentOptimizationPhase] = useState<'assessment' | 'prioritization' | 'planning' | 'complete'>('assessment');
  const [teamContext, setTeamContext] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Team Dynamics Priority Cards - for drag-and-drop prioritization
  const teamDynamicsCards: PriorityCard[] = [
    {
      id: 'communication-improvement',
      title: 'Communication Enhancement',
      description: 'Improve clarity, frequency, and effectiveness of team communication',
      category: 'Communication',
      icon: '💬',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'high',
        effort: 'medium',
        urgency: 'high',
        risk: 'low',
        estimatedTime: 8,
        tags: ['communication', 'collaboration']
      }
    },
    {
      id: 'trust-building',
      title: 'Trust & Psychological Safety',
      description: 'Create an environment where team members feel safe to be vulnerable and take risks',
      category: 'Culture',
      icon: '🤝',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'high',
        effort: 'high',
        urgency: 'medium',
        risk: 'low',
        estimatedTime: 16,
        tags: ['trust', 'psychological-safety', 'culture']
      }
    },
    {
      id: 'role-clarity',
      title: 'Role Clarity & Accountability',
      description: 'Define clear responsibilities and decision-making authority for each team member',
      category: 'Structure',
      icon: '🎯',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'high',
        effort: 'medium',
        urgency: 'high',
        risk: 'low',
        estimatedTime: 6,
        tags: ['roles', 'accountability', 'clarity']
      }
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution Skills',
      description: 'Develop healthy approaches to disagreement and problem-solving',
      category: 'Skills',
      icon: '⚖️',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'medium',
        effort: 'medium',
        urgency: 'medium',
        risk: 'medium',
        estimatedTime: 12,
        tags: ['conflict', 'resolution', 'skills']
      }
    },
    {
      id: 'collaboration-tools',
      title: 'Collaboration Tools & Processes',
      description: 'Implement technology and workflows that support effective teamwork',
      category: 'Tools',
      icon: '🛠️',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'medium',
        effort: 'low',
        urgency: 'low',
        risk: 'low',
        estimatedTime: 4,
        tags: ['tools', 'processes', 'technology']
      }
    },
    {
      id: 'team-building',
      title: 'Team Building & Relationships',
      description: 'Strengthen interpersonal connections and shared identity',
      category: 'Culture',
      icon: '🏗️',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'medium',
        effort: 'medium',
        urgency: 'low',
        risk: 'low',
        estimatedTime: 8,
        tags: ['team-building', 'relationships', 'culture']
      }
    },
    {
      id: 'performance-feedback',
      title: 'Performance Feedback Systems',
      description: 'Create regular, constructive feedback loops for continuous improvement',
      category: 'Performance',
      icon: '📊',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'high',
        effort: 'medium',
        urgency: 'medium',
        risk: 'low',
        estimatedTime: 10,
        tags: ['feedback', 'performance', 'improvement']
      }
    },
    {
      id: 'decision-making',
      title: 'Decision-Making Processes',
      description: 'Establish clear frameworks for how decisions are made and communicated',
      category: 'Structure',
      icon: '🎲',
      priority: 5,
      originalPriority: 5,
      metadata: {
        impact: 'high',
        effort: 'medium',
        urgency: 'medium',
        risk: 'medium',
        estimatedTime: 8,
        tags: ['decision-making', 'processes', 'governance']
      }
    }
  ];

  // Helper function to generate insights from priority ranking
  const generatePriorityInsights = (prioritizedCards: PriorityCard[]) => {
    const topPriorities = prioritizedCards.slice(0, 3);
    const insights: string[] = [];
    
    insights.push(`Top 3 priorities: ${topPriorities.map(card => card.title).join(', ')}`);
    
    const categories = prioritizedCards.reduce((acc, card) => {
      acc[card.category || 'Other'] = (acc[card.category || 'Other'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
    if (topCategory) {
      insights.push(`Primary focus area: ${topCategory[0]} (${topCategory[1]} priorities)`);
    }
    
    const highImpactCount = prioritizedCards.filter(card => card.metadata?.impact === 'high').length;
    insights.push(`${highImpactCount} high-impact initiatives identified`);
    
    return insights;
  };

  const dynamicsElements: TeamDynamicsElement[] = [
    {
      id: 'assessment',
      type: 'assessment',
      title: 'Team Assessment',
      description: 'AI-powered analysis of current team dynamics and collaboration patterns',
      example: 'Our team shows strong technical skills but struggles with cross-departmental communication. AI suggests implementing structured check-ins and shared project dashboards.'
    },
    {
      id: 'strategy',
      type: 'strategy',
      title: 'Optimization Strategy',
      description: 'Custom strategies to enhance collaboration and productivity',
      example: 'Implement pair programming sessions, establish clear communication protocols, and create mentorship partnerships based on complementary strengths.'
    },
    {
      id: 'implementation',
      type: 'implementation',
      title: 'Implementation Plan',
      description: 'Step-by-step roadmap for building cohesive team dynamics',
      example: 'Week 1: Team assessment surveys, Week 2: Individual coaching sessions, Week 3: Group dynamics workshops, Week 4: New collaboration tools rollout.'
    },
    {
      id: 'monitoring',
      type: 'monitoring',
      title: 'Performance Monitoring',
      description: 'Continuous tracking and adjustment of team performance metrics',
      example: 'Monthly pulse surveys, quarterly 360 reviews, real-time collaboration analytics, and predictive models for team satisfaction trends.'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I'll never forget the day our 'dream team' project completely fell apart...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "On paper, we had the best developers, the most creative designers, and experienced project managers. But somehow, we couldn't work together.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "Meetings turned into blame games. Communication broke down. Our star performers became isolated islands of talent.",
      emotion: 'disappointed' as const
    },
    {
      id: '4',
      content: "That's when I discovered that great teams aren't born - they're systematically built using data-driven insights.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "AI helped me understand our team's hidden dynamics. Who collaborated naturally? Where were the communication bottlenecks? What motivated each individual?",
      emotion: 'enlightened' as const
    },
    {
      id: '6',
      content: "With these insights, we redesigned how our team worked together. We created psychological safety, optimized communication flows, and built on each person's strengths.",
      emotion: 'hopeful' as const
    },
    {
      id: '7',
      content: "Six months later, that same team delivered our most successful project ever. Now I help other leaders build cohesive, high-performing teams using AI insights.",
      emotion: 'excited' as const
    }
  ];

  // Update prompt segments when priorities change
  useEffect(() => {
    const insights = teamDynamicsPriorities.length > 0 ? generatePriorityInsights(teamDynamicsPriorities) : [];
    
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to optimize team dynamics using AI insights to build cohesive, high-performing teams that leverage each member\'s strengths for collective success.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'team-context',
        label: 'Team Context',
        value: teamContext ? `Team context: ${teamContext}` : '',
        type: 'data',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'priority-insights',
        label: 'Team Dynamics Priorities',
        value: insights.length > 0 ? `Priority analysis: ${insights.join('. ')}` : '',
        type: 'data',
        color: 'border-l-cyan-400',
        required: false
      },
      {
        id: 'prioritized-approach',
        label: 'Prioritized Implementation',
        value: teamDynamicsPriorities.length > 0 
          ? 'Based on the priority ranking, create a focused team optimization plan that addresses the highest-priority areas first while building synergies between related initiatives.' 
          : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive team optimization plan with: 1) Team Assessment (current dynamics analysis based on priorities), 2) Optimization Strategy (prioritized collaboration approaches), 3) Implementation Plan (step-by-step roadmap following priority order), 4) Performance Monitoring (continuous improvement system). Focus on psychological safety, communication optimization, and leveraging individual strengths.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [teamDynamicsPriorities, teamContext]);

  const generateTeamPlan = async () => {
    if (teamDynamicsPriorities.length === 0) return;
    
    const insights = generatePriorityInsights(teamDynamicsPriorities);
    const topPriorities = teamDynamicsPriorities.slice(0, 5);
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Team Dynamics Optimization with AI Insights',
          context: `Carmen Rodriguez needs to optimize team dynamics based on a prioritized assessment of team improvement areas.
          
          Team Context: ${teamContext || 'General team optimization'}
          Priority Analysis: ${insights.join('. ')}
          
          Top Priority Areas (in order):
          ${topPriorities.map((card, index) => 
            `${index + 1}. ${card.title} - ${card.description} (Impact: ${card.metadata?.impact}, Effort: ${card.metadata?.effort})`
          ).join('\n')}
          
          Create a comprehensive team dynamics optimization plan that includes: 1) AI-powered team assessment focused on priority areas, 2) Prioritized collaboration strategies targeting highest-impact improvements, 3) Implementation roadmap following priority order with quick wins and strategic initiatives, 4) Performance monitoring system tracking priority metrics. Focus on building psychological safety, optimizing communication, and leveraging individual strengths for collective success.`
        }
      });

      if (error) throw error;

      setGeneratedPlan(data.content);
      
      toast({
        title: "Team Dynamics Plan Created!",
        description: "Carmen's AI has crafted your team optimization strategy.",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate team dynamics plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Team Dynamics Workshop Complete!",
      description: "You've mastered Carmen's team dynamics optimization approach!",
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
            src={getAnimationUrl('carmen-team-challenge.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-purple-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Team Dynamics Optimizer
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build cohesive, high-performing teams with AI-powered insights and strategies
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Dream Team Disaster', desc: 'Experience Carmen\'s team collaboration breakdown', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-team-challenge.mp4', fallback: <Heart className="w-8 h-8 text-red-500" /> },
            { title: 'AI Dynamics Discovery', desc: 'Learn systematic team optimization approach', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-ai-discovery.mp4', fallback: <Target className="w-8 h-8 text-purple-500" /> },
            { title: 'Cohesive Team Success', desc: 'Witness high-performing team transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-team-triumph.mp4', fallback: <TrendingUp className="w-8 h-8 text-green-500" /> }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={<img src={getCarmenManagementIconUrl('teamMedium')} alt="Team Dynamics" className="w-8 h-8" />}
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
              aria-label="Start Carmen's team dynamics journey - Learn to optimize team collaboration and performance using AI insights"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Carmen's Team Journey
              <span className="sr-only">This workshop teaches team dynamics optimization strategies that build high-performing collaborative teams</span>
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
        lessonTitle="Team Dynamics Optimizer"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-team-narrative"
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
        lessonTitle="Team Dynamics Optimizer"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Team Dynamics Workshop</p>
            <Button className="nm-button nm-button-secondary" onClick={() => navigate('/chapter/7')}>
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
            {/* Team Context Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Team Context</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Describe your team (size, type, current challenges, etc.)..."
                  value={teamContext}
                  onChange={(e) => setTeamContext(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
                />
              </CardContent>
            </Card>

            {/* Team Dynamics Priority System */}
            <PriorityCardSystem
              title="Team Dynamics Prioritization"
              description="Drag and rank team improvement areas by priority"
              availableCards={teamDynamicsCards}
              selectedCards={teamDynamicsPriorities}
              onCardsChange={setTeamDynamicsPriorities}
              maxSelections={8}
              showMetadata={true}
              enableComparison={true}
              enableFiltering={true}
              characterTheme="carmen"
              viewMode="compact"
              className="max-h-none"
            />

            {/* Generate Button - Appears after priorities set */}
            {teamDynamicsPriorities.length > 0 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Button 
                    onClick={generateTeamPlan}
                    disabled={teamDynamicsPriorities.length === 0 || isGenerating}
                    className="w-full nm-button nm-button-primary text-base py-2"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                        Carmen is optimizing your team...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create Prioritized Team Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
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

            {/* Generated Plan - Full Height */}
            {generatedPlan ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Team Optimization Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg h-full overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedPlan}
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
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Plan Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Team Optimization Plan" to see Carmen's framework.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedPlan && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="nm-button nm-button-success text-white px-8 py-3"
              aria-label="Complete the team dynamics workshop and return to Chapter 7"
            >
              Complete Team Dynamics Workshop
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

export default CarmenTeamDynamics;