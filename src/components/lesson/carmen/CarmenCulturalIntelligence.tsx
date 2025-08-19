import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb, Globe, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { ConversationalFlow, ConversationQuestion, ConversationResponse } from '@/components/ui/interaction-patterns/ConversationalFlow';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';

type Phase = 'intro' | 'narrative' | 'workshop';

interface CulturalElement {
  id: string;
  type: 'assessment' | 'strategy' | 'implementation' | 'measurement';
  title: string;
  description: string;
  example: string;
}

const CarmenCulturalIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationAnswers, setConversationAnswers] = useState<ConversationResponse[]>([]);
  const [currentConversationPhase, setCurrentConversationPhase] = useState<'assessment' | 'strategy' | 'planning' | 'complete'>('assessment');
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Cultural Intelligence Conversation Flow
  const culturalIntelligenceQuestions: ConversationQuestion[] = [
    {
      id: 'cultural-background',
      type: 'multiple-choice',
      question: 'What best describes your current workplace cultural environment?',
      description: 'Help Carmen understand your starting point for cultural intelligence development',
      required: true,
      options: [
        { id: 'homogeneous', label: 'Primarily homogeneous team/organization', description: 'Limited cultural diversity', value: 'homogeneous' },
        { id: 'emerging-diversity', label: 'Emerging diversity initiatives', description: 'Starting to build inclusive practices', value: 'emerging-diversity' },
        { id: 'diverse-but-siloed', label: 'Diverse but siloed groups', description: 'Diversity exists but limited interaction', value: 'diverse-but-siloed' },
        { id: 'integrated-diverse', label: 'Well-integrated diverse environment', description: 'Active cultural collaboration', value: 'integrated-diverse' }
      ]
    },
    {
      id: 'cultural-challenges',
      type: 'multiple-choice',
      question: 'Which cultural challenges does your organization face most often?',
      description: 'Identify specific areas where cultural intelligence can make an impact',
      required: true,
      options: [
        { id: 'communication-barriers', label: 'Communication barriers', description: 'Language or cultural misunderstandings', value: 'communication-barriers' },
        { id: 'unconscious-bias', label: 'Unconscious bias', description: 'Unfair treatment or assumptions', value: 'unconscious-bias' },
        { id: 'exclusive-practices', label: 'Exclusive practices', description: 'Processes that exclude certain groups', value: 'exclusive-practices' },
        { id: 'limited-representation', label: 'Limited representation', description: 'Lack of diversity in leadership/teams', value: 'limited-representation' },
        { id: 'cultural-conflicts', label: 'Cultural conflicts', description: 'Different values and work styles clash', value: 'cultural-conflicts' }
      ]
    },
    {
      id: 'personal-experience',
      type: 'scale',
      question: 'How comfortable do you feel navigating cross-cultural interactions at work?',
      description: 'Your honest self-assessment helps Carmen tailor the development approach',
      required: true,
      scaleConfig: {
        min: 1,
        max: 10,
        minLabel: 'Very uncomfortable',
        maxLabel: 'Very comfortable',
        step: 1
      }
    },
    {
      id: 'improvement-goals',
      type: 'multiple-choice',
      question: 'What cultural intelligence outcomes matter most to you?',
      description: 'Focus on what success looks like for your organization',
      required: true,
      options: [
        { id: 'belonging', label: 'Increase sense of belonging', description: 'Everyone feels valued and included', value: 'belonging' },
        { id: 'collaboration', label: 'Improve cross-cultural collaboration', description: 'Better teamwork across differences', value: 'collaboration' },
        { id: 'innovation', label: 'Enhance innovation through diversity', description: 'Leverage diverse perspectives', value: 'innovation' },
        { id: 'retention', label: 'Improve retention of diverse talent', description: 'Keep great people longer', value: 'retention' },
        { id: 'reputation', label: 'Build inclusive reputation', description: 'Become known for great culture', value: 'reputation' }
      ]
    },
    {
      id: 'implementation-preference',
      type: 'single-choice',
      question: 'How would you prefer to implement cultural intelligence development?',
      description: 'Choose the approach that fits your organizational style',
      required: true,
      options: [
        { id: 'gradual-systematic', label: 'Gradual, systematic approach', description: 'Steady, long-term cultural transformation', value: 'gradual-systematic' },
        { id: 'intensive-immersive', label: 'Intensive, immersive program', description: 'Concentrated cultural intelligence bootcamp', value: 'intensive-immersive' },
        { id: 'organic-grassroots', label: 'Organic, grassroots movement', description: 'Bottom-up cultural change initiative', value: 'organic-grassroots' },
        { id: 'leadership-driven', label: 'Leadership-driven cascade', description: 'Top-down cultural intelligence rollout', value: 'leadership-driven' }
      ]
    }
  ];

  // Helper function to extract conversation insights
  const extractConversationInsights = () => {
    const insights: string[] = [];
    
    conversationAnswers.forEach(answer => {
      const question = culturalIntelligenceQuestions.find(q => q.id === answer.questionId);
      if (!question) return;
      
      switch (answer.questionId) {
        case 'cultural-background':
          insights.push(`Current environment: ${Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}`);
          break;
        case 'cultural-challenges':
          insights.push(`Primary challenges: ${Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}`);
          break;
        case 'personal-experience':
          insights.push(`Comfort level: ${answer.value}/10`);
          break;
        case 'improvement-goals':
          insights.push(`Target outcomes: ${Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}`);
          break;
        case 'implementation-preference':
          insights.push(`Preferred approach: ${answer.value}`);
          break;
      }
    });
    
    return insights;
  };

  const culturalElements: CulturalElement[] = [
    {
      id: 'assessment',
      type: 'assessment',
      title: 'Cultural Assessment',
      description: 'AI-powered analysis of current workplace culture and inclusion metrics',
      example: 'Analysis reveals strong technical collaboration but limited cross-cultural mentorship. Recommendation: Implement cultural bridge-building programs and inclusive leadership training.'
    },
    {
      id: 'strategy',
      type: 'strategy',
      title: 'Inclusion Strategy',
      description: 'Customized approaches to build inclusive and culturally intelligent workplace',
      example: 'Create cultural celebration calendar, establish employee resource groups, implement bias-aware hiring practices, and develop inclusive communication guidelines.'
    },
    {
      id: 'implementation',
      type: 'implementation',
      title: 'Cultural Transformation',
      description: 'Step-by-step roadmap for building cultural intelligence organization-wide',
      example: 'Month 1: Cultural audit and baseline metrics, Month 2: Leadership cultural intelligence training, Month 3: Employee resource group launch, Month 4: Inclusive policy updates.'
    },
    {
      id: 'measurement',
      type: 'measurement',
      title: 'Progress Tracking',
      description: 'Continuous measurement of cultural intelligence and inclusion impact',
      example: 'Monthly inclusion surveys, quarterly cultural intelligence assessments, annual diversity analytics, and real-time sentiment analysis of workplace interactions.'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I thought I was creating an inclusive workplace, but the data told a different story...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our employee surveys looked good on the surface - 'satisfaction' was high. But when I dug deeper, I found concerning patterns.",
      emotion: 'worried' as const
    },
    {
      id: '3',
      content: "Certain groups weren't speaking up in meetings. Promotion rates varied by background. Our 'open door' policy wasn't reaching everyone.",
      emotion: 'concerned' as const
    },
    {
      id: '4',
      content: "That's when I realized cultural intelligence isn't just about good intentions - it's about systematic, data-driven culture building.",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "AI helped me see invisible barriers and cultural dynamics. Where were people thriving? Where were they struggling? What made the difference?",
      emotion: 'excited' as const
    },
    {
      id: '6',
      content: "We redesigned our culture with intention. Cultural bridge programs. Inclusive leadership development. Bias-aware systems and processes.",
      emotion: 'determined' as const
    },
    {
      id: '7',
      content: "Now our workplace truly celebrates diversity while building unity. Employee engagement is up 60%, and innovation has skyrocketed with our diverse perspectives.",
      emotion: 'proud' as const
    }
  ];

  // Update prompt segments when conversation progresses
  useEffect(() => {
    const insights = extractConversationInsights();
    
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to build cultural intelligence strategies that create truly inclusive workplaces where everyone can contribute authentically and thrive together.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'conversation-insights',
        label: 'Cultural Intelligence Conversation',
        value: insights.length > 0 ? `Conversation insights: ${insights.join('. ')}` : '',
        type: 'data',
        color: 'border-l-cyan-400',
        required: false
      },
      {
        id: 'personalization',
        label: 'Personalized Approach',
        value: conversationAnswers.length > 0 
          ? 'Based on the conversational assessment, create a personalized cultural intelligence development strategy that addresses the specific context, challenges, and goals identified.' 
          : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive cultural intelligence strategy with: 1) Cultural Assessment (current state analysis based on conversation), 2) Inclusion Strategy (targeted approaches for identified challenges), 3) Cultural Transformation (implementation roadmap aligned with preferences), 4) Progress Tracking (measurement systems for desired outcomes). Focus on building authentic inclusion and leveraging diverse perspectives for innovation.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [conversationAnswers]);

  const generateCulturalStrategy = async () => {
    if (conversationAnswers.length === 0) return;
    
    const insights = extractConversationInsights();
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Cultural Intelligence and Inclusive Workplace Development',
          context: `Carmen Rodriguez needs to develop a comprehensive cultural intelligence strategy based on a personalized conversational assessment.
          
          Conversation Insights: ${insights.join('. ')}
          
          Based on this conversational assessment, create a highly personalized cultural intelligence strategy that includes: 1) Cultural assessment tailored to the identified environment and challenges, 2) Inclusive culture development strategy aligned with comfort level and goals, 3) Implementation roadmap matching the preferred approach, 4) Progress measurement system focused on desired outcomes. Focus on building genuine inclusion, cultural bridge-building, and leveraging diverse perspectives for innovation while respecting the specific context and preferences identified.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Cultural Intelligence Strategy Created!",
        description: "Carmen's AI has crafted your inclusive workplace strategy.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate cultural intelligence strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Cultural Intelligence Workshop Complete!",
      description: "You've mastered Carmen's inclusive workplace development approach!",
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
            src={getAnimationUrl('carmen-cultural-discovery.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-12 h-12 text-purple-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Cultural Intelligence Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build inclusive workplace culture with AI-powered insights and cultural intelligence analytics
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Invisible Barriers', desc: 'Experience Carmen\'s culture awakening moment', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-cultural-discovery.mp4', fallback: <MessageSquare className="w-8 h-8 text-red-500" /> },
            { title: 'AI Culture Analytics', desc: 'Learn systematic cultural intelligence approach', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-ai-analytics.mp4', fallback: <Target className="w-8 h-8 text-purple-500" /> },
            { title: 'Inclusive Culture Success', desc: 'Witness thriving diverse workplace transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-culture-triumph.mp4', fallback: <Sparkles className="w-8 h-8 text-green-500" /> }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={<img src={getCarmenManagementIconUrl('retentionCulture')} alt="Cultural Intelligence" className="w-8 h-8" />}
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
              aria-label="Start Carmen's cultural intelligence journey - Learn to build inclusive workplace culture with AI-powered insights and cultural intelligence analytics"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Carmen's Cultural Journey
              <span className="sr-only">This workshop teaches systematic cultural intelligence for creating truly inclusive workplaces</span>
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
        lessonTitle="Cultural Intelligence Hub"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="carmen-cultural-narrative"
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
        lessonTitle="Cultural Intelligence Hub"
        characterName="Carmen"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Cultural Intelligence Workshop</p>
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
            {/* Cultural Intelligence Conversational Flow */}
            <ConversationalFlow
              title="Cultural Intelligence Assessment"
              description="Let's have a thoughtful conversation about your cultural intelligence needs"
              questions={culturalIntelligenceQuestions}
              onAnswersChange={setConversationAnswers}
              onComplete={() => setCurrentConversationPhase('complete')}
              characterTheme="carmen"
              enableProgress={true}
              allowBacktrack={true}
              showQuestionNumbers={true}
              autoSave={true}
              conversationStyle="guided"
              className="max-h-none"
            />

            {/* Generate Button - Appears after conversation complete */}
            {currentConversationPhase === 'complete' && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Button 
                    onClick={generateCulturalStrategy}
                    disabled={conversationAnswers.length === 0 || isGenerating}
                    className="w-full nm-button nm-button-primary text-base py-2"
                    aria-label={isGenerating ? "Creating your cultural intelligence strategy" : "Generate personalized cultural intelligence strategy"}
                    aria-describedby="cultural-generation-status"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                        <span aria-live="polite">Carmen is building your personalized strategy...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                        Create My Cultural Intelligence Strategy
                      </>
                    )}
                    <div id="cultural-generation-status" className="sr-only">
                      {isGenerating ? "AI is currently generating your personalized cultural intelligence strategy. Please wait." : "Click to generate your cultural strategy based on the conversation"}
                    </div>
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

            {/* Generated Strategy - Full Height */}
            {generatedStrategy ? (
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-green-600" />
                    Your Cultural Strategy
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
                      <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Strategy Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Cultural Intelligence Strategy" to see Carmen's framework.
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
              aria-label="Complete the cultural intelligence workshop and return to Chapter 7"
            >
              Complete Cultural Intelligence Workshop
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

export default CarmenCulturalIntelligence;