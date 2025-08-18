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
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

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
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Cultural challenge options
  const challengeOptions: OptionItem[] = [
    { id: 'lack-representation', label: 'Lack of Representation', description: 'Limited diversity in leadership/teams', icon: 'culturalDiversity', recommended: true },
    { id: 'communication-barriers', label: 'Communication Barriers', description: 'Language or cultural misunderstandings', icon: 'culturalCommunication', recommended: true },
    { id: 'unconscious-bias', label: 'Unconscious Bias', description: 'Unfair treatment or assumptions', icon: 'culturalBias' },
    { id: 'exclusive-practices', label: 'Exclusive Practices', description: 'Processes that exclude certain groups', icon: 'culturalExclusion' },
    { id: 'microaggressions', label: 'Microaggressions', description: 'Subtle discriminatory comments/actions', icon: 'culturalMicro' },
    { id: 'cultural-misunderstanding', label: 'Cultural Misunderstandings', description: 'Different work styles/values clash', icon: 'culturalMisunderstanding' },
    { id: 'limited-cultural-awareness', label: 'Limited Cultural Awareness', description: 'Lack of global/cultural knowledge', icon: 'culturalAwareness' },
    { id: 'inequitable-opportunities', label: 'Inequitable Opportunities', description: 'Unequal access to growth/advancement', icon: 'culturalInequity' }
  ];

  // Cultural strategy options
  const strategyOptions: OptionItem[] = [
    { id: 'cultural-training', label: 'Cultural Intelligence Training', description: 'Education on cultural awareness', icon: 'culturalTraining', recommended: true },
    { id: 'inclusive-leadership', label: 'Inclusive Leadership Development', description: 'Train leaders on inclusive practices', icon: 'culturalLeadership', recommended: true },
    { id: 'diverse-hiring', label: 'Diverse Hiring Practices', description: 'Expand recruitment to diverse pools', icon: 'culturalHiring' },
    { id: 'employee-resource-groups', label: 'Employee Resource Groups', description: 'Communities based on shared identity', icon: 'culturalGroups' },
    { id: 'mentorship-programs', label: 'Cross-Cultural Mentorship', description: 'Pair people from different backgrounds', icon: 'culturalMentorship' },
    { id: 'celebration-programs', label: 'Cultural Celebration Programs', description: 'Honor different cultures and traditions', icon: 'culturalCelebration' },
    { id: 'policy-review', label: 'Inclusive Policy Review', description: 'Update policies for fairness', icon: 'culturalPolicy' },
    { id: 'feedback-systems', label: 'Anonymous Feedback Systems', description: 'Safe reporting of cultural issues', icon: 'culturalFeedback' }
  ];

  // Cultural goal options
  const goalOptions: OptionItem[] = [
    { id: 'increase-belonging', label: 'Increase Sense of Belonging', description: 'Everyone feels valued and included', icon: 'culturalBelonging', recommended: true },
    { id: 'improve-collaboration', label: 'Improve Cross-Cultural Collaboration', description: 'Better teamwork across differences', icon: 'culturalCollaboration', recommended: true },
    { id: 'reduce-bias', label: 'Reduce Unconscious Bias', description: 'Fair treatment for all employees', icon: 'culturalBalance' },
    { id: 'enhance-innovation', label: 'Enhance Innovation', description: 'Leverage diverse perspectives', icon: 'culturalInnovation' },
    { id: 'improve-retention', label: 'Improve Retention', description: 'Keep diverse talent longer', icon: 'culturalRetention' },
    { id: 'build-reputation', label: 'Build Inclusive Reputation', description: 'Become known for great culture', icon: 'culturalReputation' },
    { id: 'global-competency', label: 'Develop Global Competency', description: 'Work effectively across cultures', icon: 'culturalGlobal' },
    { id: 'leadership-diversity', label: 'Increase Leadership Diversity', description: 'Diverse representation in leadership', icon: 'culturalLeadership' }
  ];

  // Cultural metrics options
  const metricsOptions: OptionItem[] = [
    { id: 'inclusion-surveys', label: 'Inclusion Survey Scores', description: 'Regular employee sentiment tracking', icon: 'culturalSurvey', recommended: true },
    { id: 'diversity-metrics', label: 'Diversity Representation', description: 'Demographics across all levels', icon: 'culturalDemographics', recommended: true },
    { id: 'promotion-equity', label: 'Promotion Equity', description: 'Fair advancement across groups', icon: 'culturalPromotion' },
    { id: 'retention-rates', label: 'Retention by Demographics', description: 'Track who stays vs. leaves', icon: 'culturalRetention' },
    { id: 'cultural-competency', label: 'Cultural Competency Assessments', description: 'Skill development tracking', icon: 'culturalSkills' },
    { id: 'bias-incidents', label: 'Bias Incident Reporting', description: 'Track and address issues', icon: 'culturalIncidents' },
    { id: 'cross-cultural-collaboration', label: 'Cross-Cultural Collaboration', description: 'Quality of diverse team performance', icon: 'culturalTeamwork' },
    { id: 'leadership-effectiveness', label: 'Inclusive Leadership Effectiveness', description: 'Leader cultural intelligence scores', icon: 'culturalLeadership' }
  ];

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

  // Update prompt segments when selections change
  useEffect(() => {
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
        id: 'challenges',
        label: 'Cultural Challenges',
        value: selectedChallenges.length > 0 ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'strategies',
        label: 'Cultural Strategies',
        value: selectedStrategies.length > 0 ? `Preferred strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Cultural Goals',
        value: selectedGoals.length > 0 ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
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
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive cultural intelligence strategy with: 1) Cultural Assessment (current state analysis), 2) Inclusion Strategy (targeted approaches), 3) Cultural Transformation (implementation roadmap), 4) Progress Tracking (measurement systems). Focus on building authentic inclusion and leveraging diverse perspectives for innovation.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedChallenges, selectedStrategies, selectedGoals, selectedMetrics]);

  const generateCulturalStrategy = async () => {
    if (selectedChallenges.length === 0 || selectedStrategies.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Cultural Intelligence and Inclusive Workplace Development',
          context: `Carmen Rodriguez needs to develop a comprehensive cultural intelligence strategy for creating an inclusive workplace.
          
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Cultural Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Cultural Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          Success Metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}
          
          Create a comprehensive cultural intelligence strategy that includes: 1) Current culture assessment with AI analytics, 2) Inclusive culture development strategy, 3) Implementation roadmap with cultural transformation steps, 4) Progress measurement and continuous improvement system. Focus on building genuine inclusion, cultural bridge-building, and leveraging diverse perspectives for innovation.`
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
            aria-label="Start Carmen's cultural intelligence journey - Learn to build inclusive workplace culture with AI-powered insights and cultural intelligence analytics"
          >
            <Play className="w-5 h-5 mr-2" aria-hidden="true" />
            Begin Carmen's Cultural Journey
            <span className="sr-only">This workshop teaches systematic cultural intelligence for creating truly inclusive workplaces</span>
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Configuration */}
          <div className="space-y-6">
            {/* Cultural Challenges */}
            <VisualOptionGrid
              title="Cultural Challenges"
              description="What inclusion or cultural issues is your workplace facing?"
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

            {/* Cultural Strategies */}
            <VisualOptionGrid
              title="Cultural Intelligence Strategies"
              description="How do you want to build inclusive culture?"
              options={strategyOptions}
              selectedIds={selectedStrategies}
              onSelectionChange={setSelectedStrategies}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Cultural Goals */}
            <VisualOptionGrid
              title="Cultural Goals"
              description="What cultural transformation do you want to achieve?"
              options={goalOptions}
              selectedIds={selectedGoals}
              onSelectionChange={setSelectedGoals}
              multiSelect={true}
              maxSelections={3}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Success Metrics */}
            <VisualOptionGrid
              title="Success Metrics"
              description="How will you measure cultural progress?"
              options={metricsOptions}
              selectedIds={selectedMetrics}
              onSelectionChange={setSelectedMetrics}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Generate Button */}
            <Card>
              <CardContent className="p-6 text-center">
                <Button 
                  onClick={generateCulturalStrategy}
                  disabled={selectedChallenges.length === 0 || selectedStrategies.length === 0 || selectedGoals.length === 0 || isGenerating}
                  className="w-full nm-button nm-button-primary text-lg py-3"
                  aria-label={isGenerating ? "Creating your cultural intelligence strategy" : "Generate cultural intelligence strategy for building inclusive workplace culture"}
                  aria-describedby="cultural-generation-status"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                      <span aria-live="polite">Carmen is building your culture strategy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                      Create Cultural Intelligence Strategy
                    </>
                  )}
                  <div id="cultural-generation-status" className="sr-only">
                    {isGenerating ? "AI is currently generating your cultural intelligence strategy. Please wait." : "Click to generate your cultural strategy"}
                  </div>
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

            {/* Generated Strategy */}
            {generatedStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Your Cultural Intelligence Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-lg max-h-96 overflow-y-auto">
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