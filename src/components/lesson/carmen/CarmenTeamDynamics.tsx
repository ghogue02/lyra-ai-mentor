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
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

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
  const [selectedTeamType, setSelectedTeamType] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Team type options
  const teamTypeOptions: OptionItem[] = [
    { id: 'cross-functional', label: 'Cross-Functional Team', description: 'Members from different departments', icon: 'teamCrossFunctional', recommended: true },
    { id: 'product-team', label: 'Product Development Team', description: 'Focused on building products', icon: 'teamProduct' },
    { id: 'remote-team', label: 'Remote/Distributed Team', description: 'Team members work remotely', icon: 'teamRemote' },
    { id: 'project-team', label: 'Project Team', description: 'Temporary team for specific project', icon: 'teamProject' },
    { id: 'leadership-team', label: 'Leadership Team', description: 'Senior management group', icon: 'teamLeadership' },
    { id: 'technical-team', label: 'Technical/Engineering Team', description: 'Focused on technical work', icon: 'teamTechnical' },
    { id: 'sales-team', label: 'Sales Team', description: 'Revenue-focused team', icon: 'teamSales' },
    { id: 'creative-team', label: 'Creative Team', description: 'Design and content creation', icon: 'teamCreative' }
  ];

  // Team challenge options
  const challengeOptions: OptionItem[] = [
    { id: 'poor-communication', label: 'Poor Communication', description: 'Information not shared effectively', icon: 'teamCommunication', recommended: true },
    { id: 'lack-trust', label: 'Lack of Trust', description: 'Team members don\'t trust each other', icon: 'teamTrust', recommended: true },
    { id: 'role-confusion', label: 'Role Confusion', description: 'Unclear responsibilities', icon: 'teamRoles' },
    { id: 'conflict-management', label: 'Conflict Management', description: 'Difficulty resolving disagreements', icon: 'teamConflict' },
    { id: 'low-engagement', label: 'Low Engagement', description: 'Team members seem disinterested', icon: 'teamEngagement' },
    { id: 'coordination-issues', label: 'Coordination Problems', description: 'Work not synchronized well', icon: 'teamCoordination' },
    { id: 'cultural-differences', label: 'Cultural Differences', description: 'Diverse backgrounds creating friction', icon: 'teamCultural' },
    { id: 'remote-challenges', label: 'Remote Work Challenges', description: 'Distributed team coordination', icon: 'teamRemoteWork' }
  ];

  // Team strategy options
  const strategyOptions: OptionItem[] = [
    { id: 'team-building-activities', label: 'Team Building Activities', description: 'Social and collaborative exercises', icon: 'teamBuilding', recommended: true },
    { id: 'communication-protocols', label: 'Communication Protocols', description: 'Clear guidelines for sharing info', icon: 'teamProtocols', recommended: true },
    { id: 'psychological-safety', label: 'Psychological Safety', description: 'Create safe space for open dialogue', icon: 'teamSafety' },
    { id: 'role-clarification', label: 'Role Clarification', description: 'Define clear responsibilities', icon: 'teamClarity' },
    { id: 'feedback-systems', label: 'Regular Feedback Systems', description: 'Ongoing performance discussions', icon: 'teamFeedback' },
    { id: 'collaboration-tools', label: 'Collaboration Tools', description: 'Technology to support teamwork', icon: 'teamTools' },
    { id: 'conflict-resolution', label: 'Conflict Resolution Training', description: 'Skills for managing disagreements', icon: 'teamResolution' },
    { id: 'shared-goals', label: 'Shared Goal Setting', description: 'Align on common objectives', icon: 'teamGoals' }
  ];

  // Team goal options
  const goalOptions: OptionItem[] = [
    { id: 'improve-collaboration', label: 'Improve Collaboration', description: 'Better teamwork and cooperation', icon: 'teamCollaboration', recommended: true },
    { id: 'increase-productivity', label: 'Increase Team Productivity', description: 'Higher output and efficiency', icon: 'teamProductivity', recommended: true },
    { id: 'enhance-communication', label: 'Enhance Communication', description: 'Clearer, more effective dialogue', icon: 'teamCommunication' },
    { id: 'build-trust', label: 'Build Trust', description: 'Stronger relationships and confidence', icon: 'teamTrustBuilding' },
    { id: 'reduce-conflicts', label: 'Reduce Conflicts', description: 'Fewer disputes and tensions', icon: 'teamPeace' },
    { id: 'improve-innovation', label: 'Improve Innovation', description: 'More creative solutions and ideas', icon: 'teamInnovation' },
    { id: 'enhance-adaptability', label: 'Enhance Adaptability', description: 'Better response to changes', icon: 'teamAdaptability' },
    { id: 'strengthen-culture', label: 'Strengthen Team Culture', description: 'Positive, inclusive environment', icon: 'teamCulture' }
  ];

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

  // Update prompt segments when selections change
  useEffect(() => {
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
        id: 'team-type',
        label: 'Team Type',
        value: selectedTeamType.length > 0 ? `Team type: ${teamTypeOptions.find(opt => selectedTeamType.includes(opt.id))?.label || selectedTeamType.join(', ')}` : '',
        type: 'data',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'challenges',
        label: 'Team Challenges',
        value: selectedChallenges.length > 0 ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'strategies',
        label: 'Optimization Strategies',
        value: selectedStrategies.length > 0 ? `Preferred strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Team Goals',
        value: selectedGoals.length > 0 ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive team optimization plan with: 1) Team Assessment (current dynamics analysis), 2) Optimization Strategy (custom collaboration approaches), 3) Implementation Plan (step-by-step roadmap), 4) Performance Monitoring (continuous improvement system). Focus on psychological safety, communication optimization, and leveraging individual strengths.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedTeamType, selectedChallenges, selectedStrategies, selectedGoals]);

  const generateTeamPlan = async () => {
    if (selectedTeamType.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Team Dynamics Optimization with AI Insights',
          context: `Carmen Rodriguez needs to optimize team dynamics for better collaboration and performance.
          
          Team Type: ${teamTypeOptions.find(opt => selectedTeamType.includes(opt.id))?.label || selectedTeamType.join(', ')}
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Optimization Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Team Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          
          Create a comprehensive team dynamics optimization plan that includes: 1) AI-powered team assessment, 2) Custom collaboration strategies, 3) Implementation roadmap, 4) Performance monitoring system. Focus on building psychological safety, optimizing communication, and leveraging individual strengths for collective success.`
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Configuration */}
          <div className="space-y-6">
            {/* Team Type Selection */}
            <VisualOptionGrid
              title="Team Type"
              description="What type of team are you optimizing?"
              options={teamTypeOptions}
              selectedIds={selectedTeamType}
              onSelectionChange={setSelectedTeamType}
              multiSelect={false}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Team Challenges */}
            <VisualOptionGrid
              title="Team Challenges"
              description="What collaboration or performance issues is your team facing?"
              options={challengeOptions}
              selectedIds={selectedChallenges}
              onSelectionChange={setSelectedChallenges}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
              enableCustom={true}
              customPlaceholder="Add your own challenge..."
            />

            {/* Team Strategies */}
            <VisualOptionGrid
              title="Optimization Strategies"
              description="How do you want to improve team dynamics?"
              options={strategyOptions}
              selectedIds={selectedStrategies}
              onSelectionChange={setSelectedStrategies}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Team Goals */}
            <VisualOptionGrid
              title="Team Goals"
              description="What outcomes do you want to achieve?"
              options={goalOptions}
              selectedIds={selectedGoals}
              onSelectionChange={setSelectedGoals}
              multiSelect={true}
              maxSelections={3}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Generate Button */}
            <Card>
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={generateTeamPlan}
                  disabled={selectedTeamType.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0 || isGenerating}
                  className="w-full nm-button nm-button-primary text-lg py-3"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Carmen is optimizing your team...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Team Optimization Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Framework & Results */}
          <div className="space-y-6">
            {/* Dynamic Prompt Builder */}
            <DynamicPromptBuilder
              segments={promptSegments}
              characterName="Carmen"
              characterTheme="carmen"
              showCopyButton={true}
              autoUpdate={true}
            />

            {/* Generated Plan */}
            {generatedPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Team Optimization Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg max-h-96 overflow-y-auto">
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