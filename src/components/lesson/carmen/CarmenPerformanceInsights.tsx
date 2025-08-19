import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, TrendingUp, Heart, BarChart3, Users, Copy, Download, Wand2, Play, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { ConversationalFlow, ConversationQuestion, ConversationResponses } from '@/components/ui/interaction-patterns/ConversationalFlow';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

const CarmenPerformanceInsights: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [conversationResponses, setConversationResponses] = useState<ConversationResponses>({});
  const [useConversationalFlow, setUseConversationalFlow] = useState(true);
  const [generatedInsights, setGeneratedInsights] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Team size options
  const teamSizeOptions: OptionItem[] = [
    { id: 'small-team', label: 'Small Team', description: '2-10 people', icon: 'teamSmall', recommended: true },
    { id: 'medium-team', label: 'Medium Team', description: '11-25 people', icon: 'teamMedium' },
    { id: 'large-team', label: 'Large Team', description: '26-50 people', icon: 'teamLarge' },
    { id: 'department', label: 'Department', description: '51+ people', icon: 'teamDepartment' }
  ];

  // Performance challenges options
  const challengeOptions: OptionItem[] = [
    { id: 'unclear-expectations', label: 'Unclear Performance Expectations', description: 'Goals and standards not well defined', icon: 'performanceGoals', recommended: true },
    { id: 'biased-evaluations', label: 'Biased Evaluation Process', description: 'Subjective or unfair assessments', icon: 'performanceBalance', recommended: true },
    { id: 'lack-feedback', label: 'Infrequent Feedback', description: 'Not enough ongoing communication', icon: 'performanceFeedback' },
    { id: 'no-development', label: 'Limited Development Planning', description: 'No clear growth pathways', icon: 'performanceGrowth' },
    { id: 'poor-conversations', label: 'Difficult Performance Conversations', description: 'Managers struggle with feedback delivery', icon: 'performanceFeedback' },
    { id: 'no-recognition', label: 'Insufficient Recognition', description: 'Good performance goes unnoticed', icon: 'performanceRecognition' },
    { id: 'data-blind', label: 'Data-Blind Decisions', description: 'Decisions made without objective metrics', icon: 'performanceMetrics' },
    { id: 'one-size-fits-all', label: 'One-Size-Fits-All Approach', description: 'No personalization for individual needs', icon: 'performanceUniform' }
  ];

  // Performance goals options
  const goalOptions: OptionItem[] = [
    { id: 'increase-satisfaction', label: 'Increase Employee Satisfaction', description: 'Boost morale and engagement', icon: 'engagementSatisfied', recommended: true },
    { id: 'improve-retention', label: 'Improve Retention Rates', description: 'Reduce turnover and build loyalty', icon: 'retentionHandshake', recommended: true },
    { id: 'enhance-development', label: 'Enhance Career Development', description: 'Create clear growth pathways', icon: 'engagementRocket' },
    { id: 'boost-productivity', label: 'Boost Team Productivity', description: 'Improve performance outcomes', icon: 'engagementSpeed' },
    { id: 'strengthen-culture', label: 'Strengthen Team Culture', description: 'Build collaborative environment', icon: 'engagementShining' },
    { id: 'eliminate-bias', label: 'Eliminate Performance Bias', description: 'Ensure fair and objective evaluations', icon: 'engagementMask' },
    { id: 'continuous-feedback', label: 'Enable Continuous Feedback', description: 'Move beyond annual reviews', icon: 'engagementCycle' },
    { id: 'recognize-achievements', label: 'Better Recognition Systems', description: 'Celebrate success effectively', icon: 'engagementMedal' }
  ];

  // Key metrics options
  const metricsOptions: OptionItem[] = [
    { id: 'goal-achievement', label: 'Goal Achievement Rate', description: 'Percentage of objectives met', icon: 'performanceGoals', recommended: true },
    { id: 'employee-satisfaction', label: 'Employee Satisfaction Scores', description: 'Regular pulse surveys', icon: 'performanceGrowth', recommended: true },
    { id: 'retention-rate', label: 'Team Retention Rate', description: 'Percentage of team members staying', icon: 'retentionHandshake' },
    { id: 'promotion-rate', label: 'Internal Promotion Rate', description: 'Growth opportunities realized', icon: 'retentionUp' },
    { id: 'feedback-frequency', label: 'Feedback Frequency', description: 'Regular check-in cadence', icon: 'performanceFeedback' },
    { id: 'development-hours', label: 'Development Hours', description: 'Time invested in growth', icon: 'retentionTraining' },
    { id: 'peer-recognition', label: 'Peer Recognition Events', description: 'Team appreciation instances', icon: 'retentionSpeak' },
    { id: 'performance-ratings', label: 'Performance Rating Distribution', description: 'Balanced evaluation spread', icon: 'performanceMetrics' }
  ];

  // Conversational Flow Questions
  const conversationQuestions: ConversationQuestion[] = [
    {
      id: 'team-size',
      type: 'single-choice',
      question: "Let's start with the basics - what size team are we talking about here?",
      description: "Understanding your team size helps me tailor the performance approach to your specific context.",
      required: true,
      carmenResponse: "Perfect! The size of your team really shapes how we approach performance conversations. Smaller teams allow for more intimate, personalized approaches, while larger teams need more systematic frameworks.",
      options: [
        { id: 'small-team', label: 'Small Team (2-10 people)', description: 'Tight-knit group with close collaboration', value: 'small-team', icon: 'teamSmall', recommended: true },
        { id: 'medium-team', label: 'Medium Team (11-25 people)', description: 'Growing team with developing processes', value: 'medium-team', icon: 'teamMedium' },
        { id: 'large-team', label: 'Large Team (26-50 people)', description: 'Established team needing structured approaches', value: 'large-team', icon: 'teamLarge' },
        { id: 'department', label: 'Department (51+ people)', description: 'Large organization requiring systematic frameworks', value: 'department', icon: 'teamDepartment' }
      ]
    },
    {
      id: 'primary-challenge',
      type: 'single-choice',
      question: "What's your biggest performance management headache right now?",
      description: "I want to focus on what's causing you the most stress in your current performance process.",
      required: true,
      carmenResponse: "I completely understand that frustration. This is exactly the kind of challenge that keeps managers up at night. The good news is, we can absolutely turn this around with the right approach.",
      options: [
        { id: 'unclear-expectations', label: 'Unclear Performance Expectations', description: 'Team members don\'t know what success looks like', value: 'unclear-expectations', icon: 'performanceGoals', recommended: true },
        { id: 'biased-evaluations', label: 'Biased or Unfair Evaluations', description: 'Concerns about objectivity in assessments', value: 'biased-evaluations', icon: 'performanceBalance', recommended: true },
        { id: 'difficult-conversations', label: 'Difficult Performance Conversations', description: 'Struggling to deliver feedback effectively', value: 'difficult-conversations', icon: 'performanceFeedback' },
        { id: 'lack-feedback', label: 'Infrequent Feedback Cycles', description: 'Too much time between meaningful check-ins', value: 'lack-feedback', icon: 'performanceFeedback' }
      ]
    },
    {
      id: 'additional-challenges',
      type: 'multiple-choice',
      question: "Are there any other challenges you're dealing with? Select all that apply.",
      description: "Performance issues often come in clusters. Let's identify everything we need to address.",
      required: false,
      carmenResponse: "These are all interconnected challenges. When we fix one, it often helps with the others. That's the beauty of a holistic approach to performance management.",
      options: [
        { id: 'no-development', label: 'Limited Development Planning', description: 'No clear growth pathways for team members', value: 'no-development', icon: 'performanceGrowth' },
        { id: 'no-recognition', label: 'Insufficient Recognition', description: 'Good performance goes unnoticed', value: 'no-recognition', icon: 'performanceRecognition' },
        { id: 'data-blind', label: 'Data-Blind Decisions', description: 'Decisions made without objective metrics', value: 'data-blind', icon: 'performanceMetrics' },
        { id: 'one-size-fits-all', label: 'One-Size-Fits-All Approach', description: 'No personalization for individual needs', value: 'one-size-fits-all', icon: 'performanceUniform' }
      ]
    },
    {
      id: 'desired-outcome',
      type: 'single-choice',
      question: "If you could wave a magic wand, what would be your dream outcome?",
      description: "Let's get clear on what success looks like for your team's performance transformation.",
      required: true,
      carmenResponse: "That's a beautiful vision! When teams feel genuinely supported and see clear growth paths, everything changes. They become more engaged, more productive, and actually look forward to performance conversations.",
      options: [
        { id: 'increase-satisfaction', label: 'Team Members Love Their Work', description: 'High engagement and job satisfaction', value: 'increase-satisfaction', icon: 'engagementSatisfied', recommended: true },
        { id: 'improve-retention', label: 'People Want to Stay and Grow', description: 'Strong retention and internal development', value: 'improve-retention', icon: 'retentionHandshake', recommended: true },
        { id: 'enhance-development', label: 'Clear Career Pathways', description: 'Everyone has a growth plan they\'re excited about', value: 'enhance-development', icon: 'engagementRocket' },
        { id: 'boost-productivity', label: 'Higher Performance Outcomes', description: 'Better results through better support', value: 'boost-productivity', icon: 'engagementSpeed' }
      ]
    },
    {
      id: 'success-metrics',
      type: 'multiple-choice',
      question: "How would you measure success? What metrics would tell you things are working?",
      description: "Let's identify 2-3 key indicators that would show your performance transformation is succeeding.",
      required: true,
      carmenResponse: "Excellent choices! These metrics will help us track both the human and business impact of our performance improvements. Data and heart working together - that's my favorite combination.",
      options: [
        { id: 'goal-achievement', label: 'Goal Achievement Rate', description: 'Higher percentage of objectives being met', value: 'goal-achievement', icon: 'performanceGoals', recommended: true },
        { id: 'employee-satisfaction', label: 'Employee Satisfaction Scores', description: 'Better pulse survey results', value: 'employee-satisfaction', icon: 'performanceGrowth', recommended: true },
        { id: 'retention-rate', label: 'Team Retention Rate', description: 'People choosing to stay and grow here', value: 'retention-rate', icon: 'retentionHandshake' },
        { id: 'feedback-frequency', label: 'Regular Feedback Cadence', description: 'Consistent, meaningful check-ins happening', value: 'feedback-frequency', icon: 'performanceFeedback' }
      ]
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I used to dread performance review season. The anxiety, the defensiveness, the awkward conversations that left everyone feeling worse.",
      emotion: 'concerned' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Then I realized we were approaching it all wrong. Performance reviews aren't about judgment - they're about growth and potential.",
      emotion: 'enlightened' as const
    },
    {
      id: '3',
      content: "I started combining objective data with empathetic conversations. Instead of 'Here's what you did wrong,' it became 'Here's where you're shining and how we can build on that.'",
      emotion: 'strategic' as const
    },
    {
      id: '4',
      content: "The transformation was incredible. Team members started looking forward to these conversations because they knew they'd leave feeling empowered and clear about their growth path.",
      emotion: 'triumphant' as const
    },
    {
      id: '5',
      content: "Now I'll show you how to create performance insights that light up potential rather than dim spirits. Let's make every conversation a catalyst for growth.",
      emotion: 'empowered' as const
    }
  ];

  // Helper function to build challenges text from conversation
  const buildChallengesFromConversation = () => {
    const challenges = [];
    if (conversationResponses['primary-challenge']) {
      challenges.push(conversationResponses['primary-challenge'].value);
    }
    if (conversationResponses['additional-challenges'] && Array.isArray(conversationResponses['additional-challenges'].value)) {
      challenges.push(...conversationResponses['additional-challenges'].value);
    }
    return challenges.length > 0 ? `Performance challenges: ${challenges.join(', ')}` : '';
  };

  // Handle conversation responses
  const handleConversationResponse = (questionId: string, value: any) => {
    setConversationResponses(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        value,
        timestamp: new Date()
      }
    }));

    // Update legacy state based on conversation responses
    switch (questionId) {
      case 'team-size':
        setSelectedTeamSize([value]);
        break;
      case 'primary-challenge':
        setSelectedChallenges([value]);
        break;
      case 'additional-challenges':
        setSelectedChallenges(prev => {
          const primaryChallenge = conversationResponses['primary-challenge']?.value;
          const additionalChallenges = Array.isArray(value) ? value : [];
          return primaryChallenge ? [primaryChallenge, ...additionalChallenges] : additionalChallenges;
        });
        break;
      case 'desired-outcome':
        setSelectedGoals([value]);
        break;
      case 'success-metrics':
        setSelectedMetrics(Array.isArray(value) ? value : [value]);
        break;
    }
  };

  const handleConversationComplete = (responses: ConversationResponses) => {
    // Trigger AI generation when conversation is complete
    generatePerformanceInsights();
  };

  // Update prompt segments when selections change
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Context',
        value: 'Carmen Rodriguez needs to create performance insights using her empathetic, data-driven approach that combines objective analysis with meaningful human development conversations.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'team-data',
        label: 'Team Information',
        value: selectedTeamSize.length > 0 ? `Team size: ${teamSizeOptions.find(opt => selectedTeamSize.includes(opt.id))?.label || selectedTeamSize.join(', ')}` : conversationResponses['team-size'] ? `Team size: ${conversationResponses['team-size'].value}` : '',
        type: 'data',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'challenges',
        label: 'Performance Challenges',
        value: selectedChallenges.length > 0 ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : conversationResponses['primary-challenge'] || conversationResponses['additional-challenges'] ? buildChallengesFromConversation() : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Improvement Goals',
        value: selectedGoals.length > 0 ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : conversationResponses['desired-outcome'] ? `Dream outcome: ${conversationResponses['desired-outcome'].value}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'metrics',
        label: 'Key Metrics to Track',
        value: selectedMetrics.length > 0 ? `Success metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}` : conversationResponses['success-metrics'] ? `Success metrics: ${Array.isArray(conversationResponses['success-metrics'].value) ? conversationResponses['success-metrics'].value.join(', ') : conversationResponses['success-metrics'].value}` : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Format',
        value: 'Create a comprehensive performance insights framework with: 1) Data-driven analysis approach, 2) Empathetic conversation techniques, 3) Growth-focused development plans, 4) Bias-free evaluation methods, 5) Recognition and feedback systems. Include specific action steps and implementation guidance.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedTeamSize, selectedChallenges, selectedGoals, selectedMetrics, conversationResponses]);

  const generatePerformanceInsights = async () => {
    if (selectedTeamSize.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'performance-insights-framework',
          topic: 'AI-powered performance management with empathy and data',
          context: `Carmen Rodriguez needs to create comprehensive performance insights using her approach that combines objective data analysis with meaningful human development conversations.
          
          Team Size: ${teamSizeOptions.find(opt => selectedTeamSize.includes(opt.id))?.label || selectedTeamSize.join(', ')}
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Improvement Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          Key Metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}
          
          Create a performance insights framework following Carmen's philosophy: performance conversations should light up potential, not dim spirits. Include: 1) Data-driven analysis methods, 2) Empathetic conversation techniques, 3) Growth-focused development planning, 4) Bias elimination strategies, 5) Recognition systems. Make it actionable and inspiring.`
        }
      });

      if (error) throw error;

      setGeneratedInsights(data.content);
      
      toast({
        title: "Performance Insights Created!",
        description: "Carmen crafted your empathetic, data-driven performance framework.",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Performance Insights Workshop Complete!",
      description: "You've mastered Carmen's empathetic, data-driven approach!",
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
            src={getAnimationUrl('carmen-performance-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('performanceMetrics')} alt="Performance" className="w-12 h-12" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Performance Insights Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform performance reviews from dreaded tasks into growth conversations
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Performance Anxiety', desc: 'Carmen\'s review season struggles', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-performance-anxiety.mp4', fallback: <img src={getCarmenManagementIconUrl('performanceBalance')} alt="Anxiety" className="w-8 h-8" /> },
            { title: 'Data + Heart Discovery', desc: 'Combine metrics with empathy', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-data-heart.mp4', fallback: <img src={getCarmenManagementIconUrl('performanceFeedback')} alt="Heart" className="w-8 h-8" /> },
            { title: 'Growth Conversations', desc: 'Performance reviews become celebrations', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-performance-success.mp4', fallback: <img src={getCarmenManagementIconUrl('performanceGrowth')} alt="Growth" className="w-8 h-8" /> }
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
              aria-label="Start Carmen's performance insights journey - Learn to transform performance reviews into growth conversations"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Performance Journey
              <span className="sr-only">This interactive workshop will teach you to create empathetic, data-driven performance frameworks</span>
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
        lessonTitle="Performance Insights Workshop"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-performance-narrative"
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
        lessonTitle="Performance Insights Workshop"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Performance Insights Workshop</p>
            <Button className="nm-button nm-button-secondary" onClick={() => navigate('/chapter/7')} aria-label="Return to Chapter 7 main page">
              Back to Chapter 7
            </Button>
          </div>
        </div>

        {/* Mobile Tabbed Layout (visible only on mobile) */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-2 mb-4">
            {['Conversation', 'Prompt', 'Results'].map((tab, index) => (
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
          {/* Left Panel - Conversational Flow (4 columns on desktop) */}
          <div className={cn(
            "lg:col-span-4 max-h-[calc(100vh-18rem)] lg:pr-4",
            "lg:block", 
            currentStep === 0 ? "block" : "hidden"
          )}>
            {useConversationalFlow ? (
              <ConversationalFlow
                title="Performance Insights Chat"
                description="Let's have a conversation about your team's performance needs"
                questions={conversationQuestions}
                responses={conversationResponses}
                onResponseChange={handleConversationResponse}
                onComplete={handleConversationComplete}
                characterTheme="carmen"
                characterName="Carmen"
                showProgress={true}
                allowBacktrack={true}
                conversationalTone="empathetic"
                autoProgress={true}
                className="h-full"
              />
            ) : (
              <div className="space-y-4">
                {/* Fallback to original grid layout */}
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
                <VisualOptionGrid
                  title="Challenges"
                  description="Performance issues"
                  options={challengeOptions}
                  selectedIds={selectedChallenges}
                  onSelectionChange={setSelectedChallenges}
                  multiSelect={true}
                  maxSelections={4}
                  gridCols={1}
                  characterTheme="carmen"
                />
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
                <Card>
                  <CardContent className="p-4 text-center">
                    <Button 
                      onClick={generatePerformanceInsights}
                      disabled={selectedTeamSize.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0 || isGenerating}
                      className="w-full nm-button nm-button-primary text-base py-2"
                    >
                      {isGenerating ? (
                        <>
                          <BarChart3 className="w-5 h-5 mr-2 animate-pulse" />
                          Carmen is analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Create Framework
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Toggle between conversation and grid layout */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUseConversationalFlow(!useConversationalFlow)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {useConversationalFlow ? 'Switch to Grid View' : 'Switch to Conversation'}
              </Button>
            </div>
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

            {/* Generated Insights - Full Height */}
            {generatedInsights ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Performance Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg h-full overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedInsights}
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
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Framework Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Performance Insights Framework" to see Carmen's empathetic performance approach.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedInsights && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="nm-button nm-button-success text-white px-8 py-3"
              aria-label="Complete the performance insights workshop and return to Chapter 7"
            >
              Complete Performance Insights Workshop
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

export default CarmenPerformanceInsights;