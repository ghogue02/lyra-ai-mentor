import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb, Crown, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { TimelineScenarioBuilder, TimelineMilestone, TimelineScenario } from '@/components/ui/interaction-patterns/TimelineScenarioBuilder';
import { leadershipMilestoneTemplates, timelineUtils } from '@/utils/timelineUtils';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

interface LeadershipElement {
  id: string;
  type: 'assessment' | 'development' | 'coaching' | 'succession';
  title: string;
  description: string;
  example: string;
}

const CarmenLeadershipDevelopment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [generatedProgram, setGeneratedProgram] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);
  const [currentScenario, setCurrentScenario] = useState<TimelineScenario | null>(null);
  const [selectedMilestones, setSelectedMilestones] = useState<TimelineMilestone[]>([]);
  const [useTimelineBuilder, setUseTimelineBuilder] = useState(false);

  // Leadership challenge options
  const challengeOptions: OptionItem[] = [
    { id: 'new-to-leadership', label: 'New to Leadership', description: 'First-time manager or leader', icon: 'leadershipNew', recommended: true },
    { id: 'team-conflicts', label: 'Managing Team Conflicts', description: 'Difficulty resolving team disputes', icon: 'leadershipConflict', recommended: true },
    { id: 'difficult-conversations', label: 'Difficult Conversations', description: 'Struggling with feedback/performance talks', icon: 'leadershipConversation' },
    { id: 'delegation-issues', label: 'Delegation Challenges', description: 'Hard to let go of control', icon: 'leadershipDelegation' },
    { id: 'change-management', label: 'Leading Through Change', description: 'Managing organizational transitions', icon: 'leadershipChange' },
    { id: 'remote-leadership', label: 'Remote Team Leadership', description: 'Leading distributed teams', icon: 'leadershipRemote' },
    { id: 'cross-functional', label: 'Cross-Functional Leadership', description: 'Leading without direct authority', icon: 'leadershipMatrix' },
    { id: 'scaling-leadership', label: 'Scaling Leadership', description: 'Growing from individual contributor', icon: 'leadershipScale' }
  ];

  // Leadership skill options
  const skillOptions: OptionItem[] = [
    { id: 'emotional-intelligence', label: 'Emotional Intelligence', description: 'Self-awareness and empathy', icon: 'leadershipEQ', recommended: true },
    { id: 'communication-skills', label: 'Communication Skills', description: 'Clear, inspiring communication', icon: 'leadershipCommunication', recommended: true },
    { id: 'strategic-thinking', label: 'Strategic Thinking', description: 'Long-term planning and vision', icon: 'leadershipStrategy' },
    { id: 'decision-making', label: 'Decision Making', description: 'Confident, data-driven choices', icon: 'leadershipDecision' },
    { id: 'coaching-mentoring', label: 'Coaching & Mentoring', description: 'Developing others effectively', icon: 'leadershipCoaching' },
    { id: 'influence-persuasion', label: 'Influence & Persuasion', description: 'Gaining buy-in without authority', icon: 'leadershipInfluence' },
    { id: 'conflict-resolution', label: 'Conflict Resolution', description: 'Mediating and solving disputes', icon: 'leadershipResolution' },
    { id: 'performance-management', label: 'Performance Management', description: 'Setting goals and accountability', icon: 'leadershipPerformance' }
  ];

  // Leadership goal options
  const goalOptions: OptionItem[] = [
    { id: 'build-confidence', label: 'Build Leadership Confidence', description: 'Feel more assured in leadership role', icon: 'leadershipConfidence', recommended: true },
    { id: 'improve-team-performance', label: 'Improve Team Performance', description: 'Boost team productivity and results', icon: 'leadershipResults', recommended: true },
    { id: 'enhance-engagement', label: 'Enhance Team Engagement', description: 'Increase motivation and satisfaction', icon: 'leadershipEngagement' },
    { id: 'develop-others', label: 'Develop Others', description: 'Build skills in team members', icon: 'leadershipDevelopment' },
    { id: 'drive-innovation', label: 'Drive Innovation', description: 'Foster creative thinking and solutions', icon: 'leadershipInnovation' },
    { id: 'improve-communication', label: 'Improve Team Communication', description: 'Better collaboration and transparency', icon: 'leadershipTeamTalk' },
    { id: 'lead-change', label: 'Lead Change Effectively', description: 'Guide teams through transitions', icon: 'leadershipTransformation' },
    { id: 'build-culture', label: 'Build Positive Culture', description: 'Create inclusive, supportive environment', icon: 'leadershipCulture' }
  ];

  // Development method options
  const methodOptions: OptionItem[] = [
    { id: 'ai-coaching', label: 'AI-Enhanced Coaching', description: 'Personalized AI guidance and feedback', icon: 'leadershipAI', recommended: true },
    { id: 'peer-learning', label: 'Peer Learning Groups', description: 'Learn with other leaders', icon: 'leadershipPeers', recommended: true },
    { id: 'mentorship', label: 'Executive Mentorship', description: 'One-on-one guidance from seniors', icon: 'leadershipMentor' },
    { id: 'simulation-training', label: 'Leadership Simulations', description: 'Practice in safe environments', icon: 'leadershipSimulation' },
    { id: 'feedback-systems', label: '360-Degree Feedback', description: 'Multi-source performance insights', icon: 'leadershipFeedback' },
    { id: 'action-learning', label: 'Action Learning Projects', description: 'Real-world application opportunities', icon: 'leadershipAction' },
    { id: 'skills-workshops', label: 'Skills-Based Workshops', description: 'Targeted capability building', icon: 'leadershipWorkshop' },
    { id: 'book-clubs', label: 'Leadership Book Clubs', description: 'Shared learning through reading', icon: 'leadershipBooks' }
  ];

  const leadershipElements: LeadershipElement[] = [
    {
      id: 'assessment',
      type: 'assessment',
      title: 'Leadership Assessment',
      description: 'AI-powered analysis of current leadership capabilities and potential',
      example: 'Analysis identifies strong strategic thinking but opportunities for emotional intelligence development. Recommends targeted coaching in empathetic leadership and change management.'
    },
    {
      id: 'development',
      type: 'development',
      title: 'Development Programs',
      description: 'Customized leadership development pathways with AI coaching insights',
      example: 'Create personalized learning tracks: executive presence workshops, AI-assisted decision-making training, cross-functional leadership rotations, and peer mentoring circles.'
    },
    {
      id: 'coaching',
      type: 'coaching',
      title: 'AI-Enhanced Coaching',
      description: 'Intelligent coaching system that adapts to individual leadership styles',
      example: 'Real-time feedback on communication patterns, predictive insights for team dynamics, scenario-based leadership simulations, and continuous performance optimization.'
    },
    {
      id: 'succession',
      type: 'succession',
      title: 'Succession Planning',
      description: 'Strategic pipeline development for next-generation leaders',
      example: 'AI-driven talent pipeline mapping, leadership readiness assessments, succession risk analysis, and accelerated development programs for high-potential leaders.'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I was promoted to lead a team of 50, but nobody taught me how to actually lead...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I was great at my technical role, but leadership felt like speaking a foreign language. Every decision felt like a guess.",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "My team was struggling. Projects were delayed. People were leaving. I was working 80-hour weeks just trying to keep up.",
      emotion: 'overwhelmed' as const
    },
    {
      id: '4',
      content: "That's when I discovered leadership isn't a talent you're born with - it's a skill you can systematically develop with the right insights.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "AI helped me understand my leadership patterns. What motivated each team member? How could I communicate more effectively? Where were my blind spots?",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "I built a personal leadership development system. AI coaching. Data-driven feedback. Continuous learning loops tailored to my style and challenges.",
      emotion: 'determined' as const
    },
    {
      id: '7',
      content: "Now I lead with confidence. My team thrives. We've become the highest-performing group in the company. And I'm mentoring the next generation of leaders.",
      emotion: 'proud' as const
    }
  ];

  // Update prompt segments when selections change
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to create comprehensive leadership development programs that leverage AI coaching while maintaining human connection to build confident, effective leaders.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'challenges',
        label: 'Leadership Challenges',
        value: useTimelineBuilder && selectedMilestones.length > 0 
          ? `Timeline milestones: ${selectedMilestones.filter(m => m.type === 'challenge').map(m => m.title).join(', ')}`
          : selectedChallenges.length > 0 
            ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` 
            : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'skills',
        label: 'Target Skills',
        value: useTimelineBuilder && selectedMilestones.length > 0
          ? `Skill development milestones: ${selectedMilestones.filter(m => m.type === 'skill').map(m => m.title).join(', ')}`
          : selectedSkills.length > 0 
            ? `Skills to develop: ${selectedSkills.map(id => skillOptions.find(opt => opt.id === id)?.label).join(', ')}` 
            : '',
        type: 'instruction',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Leadership Goals',
        value: useTimelineBuilder && selectedMilestones.length > 0
          ? `Goal milestones: ${selectedMilestones.filter(m => m.type === 'goal').map(m => m.title).join(', ')}`
          : selectedGoals.length > 0 
            ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` 
            : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'methods',
        label: 'Development Methods',
        value: useTimelineBuilder && selectedMilestones.length > 0
          ? `Method milestones: ${selectedMilestones.filter(m => m.type === 'method').map(m => m.title).join(', ')}`
          : selectedMethods.length > 0 
            ? `Preferred methods: ${selectedMethods.map(id => methodOptions.find(opt => opt.id === id)?.label).join(', ')}` 
            : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'timeline',
        label: 'Timeline Structure',
        value: useTimelineBuilder && currentScenario 
          ? `Development timeline: ${currentScenario.duration} weeks with ${currentScenario.milestones.length} milestones. Critical path includes: ${timelineUtils.generateTimelineInsights(currentScenario).criticalPath.slice(0, 3).join(', ')}`
          : '',
        type: 'data',
        color: 'border-l-cyan-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: useTimelineBuilder 
          ? 'Create a comprehensive leadership development program based on the timeline scenario with: 1) Timeline-based implementation plan, 2) Milestone-specific activities and success criteria, 3) AI-Enhanced coaching integration points, 4) Risk mitigation strategies for identified bottlenecks. Include specific timelines, dependencies, and measurable outcomes.'
          : 'Create a comprehensive leadership development program with: 1) Leadership Assessment (capability analysis), 2) Development Programs (customized learning paths), 3) AI-Enhanced Coaching (intelligent guidance), 4) Succession Planning (pipeline development). Include specific activities, timelines, and success metrics.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedChallenges, selectedSkills, selectedGoals, selectedMethods, useTimelineBuilder, selectedMilestones, currentScenario]);

  // Handle timeline scenario updates
  const handleScenarioUpdate = (scenario: TimelineScenario) => {
    setCurrentScenario(scenario);
  };

  const handleMilestoneSelection = (milestones: TimelineMilestone[]) => {
    setSelectedMilestones(milestones);
  };

  const generateLeadershipProgram = async () => {
    const hasTraditionalSelections = selectedChallenges.length > 0 || selectedSkills.length > 0 || selectedGoals.length > 0;
    const hasTimelineSelections = useTimelineBuilder && selectedMilestones.length > 0;
    
    if (!hasTraditionalSelections && !hasTimelineSelections) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'development_plan',
          topic: 'Next-Generation Leadership Development with AI Coaching',
          context: useTimelineBuilder && currentScenario 
            ? `Carmen Rodriguez needs to create a comprehensive leadership development program based on a ${currentScenario.duration}-week timeline scenario.
            
            Timeline Scenario: ${currentScenario.name} - ${currentScenario.description}
            Selected Milestones: ${selectedMilestones.map(m => `${m.title} (Week ${m.timeframe}, ${m.type})`).join(', ')}
            Critical Path: ${timelineUtils.generateTimelineInsights(currentScenario).criticalPath.join(', ')}
            Risk Factors: ${timelineUtils.generateTimelineInsights(currentScenario).riskFactors.map(r => r.description).join(', ')}
            
            Create a timeline-based leadership development program that includes: 1) Week-by-week implementation plan following the timeline, 2) Milestone-specific activities and success criteria, 3) AI-enhanced coaching integration at key points, 4) Risk mitigation strategies for identified bottlenecks, 5) Dependencies and prerequisites management. Focus on practical implementation with measurable outcomes.`
            : `Carmen Rodriguez needs to create a comprehensive leadership development program that leverages AI for coaching and development.
            
            Leadership Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
            Target Skills: ${selectedSkills.map(id => skillOptions.find(opt => opt.id === id)?.label).join(', ')}
            Leadership Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
            Development Methods: ${selectedMethods.map(id => methodOptions.find(opt => opt.id === id)?.label).join(', ')}
            
            Create a comprehensive leadership development program that includes: 1) AI-powered leadership assessment and capabilities analysis, 2) Personalized development pathways with AI coaching, 3) Systematic leadership skill building with real-world application, 4) Succession planning and pipeline development. Focus on building leaders who can combine human intelligence with AI capabilities for exceptional results.`
        }
      });

      if (error) throw error;

      setGeneratedProgram(data.content);
      
      toast({
        title: "Leadership Development Program Created!",
        description: "Carmen's AI has designed your leadership development strategy.",
      });
    } catch (error) {
      console.error('Error generating program:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate leadership development program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Leadership Development Workshop Complete!",
      description: "You've mastered Carmen's AI-enhanced leadership development approach!",
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
            src={getAnimationUrl('carmen-leadership-struggle.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-purple-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Leadership Development Lab
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Develop next-generation leaders with AI-enhanced coaching and systematic skill building
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Leadership Struggle', desc: 'Experience Carmen\'s leadership development challenge', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-leadership-struggle.mp4', fallback: <Users className="w-8 h-8 text-red-500" /> },
            { title: 'AI Leadership Coaching', desc: 'Learn systematic leadership development approach', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-ai-coaching.mp4', fallback: <Target className="w-8 h-8 text-purple-500" /> },
            { title: 'Leadership Excellence', desc: 'Witness confident leader transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-leadership-triumph.mp4', fallback: <Crown className="w-8 h-8 text-green-500" /> }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={<img src={getCarmenManagementIconUrl('retentionLeadership')} alt="Leadership Development" className="w-8 h-8" />}
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
              aria-label="Start Carmen's leadership development journey - Learn to develop next-generation leaders with AI-enhanced coaching and systematic skill building"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Carmen's Leadership Journey
              <span className="sr-only">This workshop teaches comprehensive leadership development using AI coaching and systematic skill building</span>
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
        lessonTitle="Leadership Development Lab"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-leadership-narrative"
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
        lessonTitle="Leadership Development Lab"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Leadership Development Workshop</p>
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

        {/* Builder Mode Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white rounded-lg p-2 shadow-sm border">
            <div className="flex items-center space-x-2">
              <Button
                variant={!useTimelineBuilder ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTimelineBuilder(false)}
                className="text-sm"
              >
                Traditional Builder
              </Button>
              <Button
                variant={useTimelineBuilder ? "default" : "outline"}
                size="sm"
                onClick={() => setUseTimelineBuilder(true)}
                className="text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Timeline Builder
              </Button>
            </div>
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
            {useTimelineBuilder ? (
              /* Timeline Scenario Builder */
              <div className="space-y-4">
                <TimelineScenarioBuilder
                  title="Leadership Development Timeline"
                  description="Create your leadership journey with interactive milestones"
                  availableMilestones={leadershipMilestoneTemplates}
                  onScenarioUpdate={handleScenarioUpdate}
                  onMilestoneSelection={handleMilestoneSelection}
                  characterTheme="carmen"
                  maxDuration={52}
                  enableComparison={true}
                  enableSimulation={true}
                  className="max-h-none"
                />
                
                {/* Generate Button for Timeline */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <Button 
                      onClick={generateLeadershipProgram}
                      disabled={selectedMilestones.length === 0 || isGenerating}
                      className="w-full nm-button nm-button-primary text-base py-2"
                      aria-label={isGenerating ? "Creating your timeline-based leadership development program" : "Generate timeline-based leadership development program"}
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                          <span aria-live="polite">Carmen is designing your timeline program...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                          Create Timeline Leadership Program
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Traditional Option Grids */
              <>
                {/* Leadership Challenges - Compact */}
                <VisualOptionGrid
                  title="Challenges"
                  description="Leadership situations"
                  options={challengeOptions}
                  selectedIds={selectedChallenges}
                  onSelectionChange={setSelectedChallenges}
                  multiSelect={true}
                  maxSelections={3}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Leadership Skills - Compact */}
                <VisualOptionGrid
                  title="Skills"
                  description="Capabilities to build"
                  options={skillOptions}
                  selectedIds={selectedSkills}
                  onSelectionChange={setSelectedSkills}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Leadership Goals - Compact */}
                <VisualOptionGrid
                  title="Goals"
                  description="Leadership outcomes"
                  options={goalOptions}
                  selectedIds={selectedGoals}
                  onSelectionChange={setSelectedGoals}
                  multiSelect={true}
                  maxSelections={3}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Development Methods - Compact */}
                <VisualOptionGrid
                  title="Methods"
                  description="How to learn and develop"
                  options={methodOptions}
                  selectedIds={selectedMethods}
                  onSelectionChange={setSelectedMethods}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />

                {/* Generate Button - Compact */}
                <Card>
                  <CardContent className="p-4 text-center">
                    <Button 
                      onClick={generateLeadershipProgram}
                      disabled={selectedChallenges.length === 0 || selectedSkills.length === 0 || selectedGoals.length === 0 || isGenerating}
                      className="w-full nm-button nm-button-primary text-base py-2"
                      aria-label={isGenerating ? "Creating your leadership development program" : "Generate comprehensive leadership development program with AI-enhanced coaching"}
                      aria-describedby="leadership-generation-status"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                          <span aria-live="polite">Carmen is designing your leadership program...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                          Create Leadership Development Program
                        </>
                      )}
                      <div id="leadership-generation-status" className="sr-only">
                        {isGenerating ? "AI is currently generating your leadership development program. Please wait." : "Click to generate your leadership program"}
                      </div>
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

            {/* Generated Program - Full Height */}
            {generatedProgram ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Crown className="w-5 h-5 text-green-600" />
                    Your Leadership Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg h-full overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedProgram}
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
                      <Crown className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Program Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Leadership Development Program" to see Carmen's framework.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedProgram && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="nm-button nm-button-success text-white px-8 py-3"
              aria-label="Complete the leadership development workshop and return to Chapter 7"
            >
              Complete Leadership Development Workshop
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

export default CarmenLeadershipDevelopment;