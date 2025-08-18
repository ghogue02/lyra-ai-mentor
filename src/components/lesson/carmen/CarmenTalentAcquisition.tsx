import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Users, Play, Target, Heart, TrendingUp, Clock, Building } from 'lucide-react';
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

interface HiringFrameworkElement {
  id: string;
  title: string;
  description: string;
  implementation: string;
  example: string;
}

const CarmenTalentAcquisition: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Role type options
  const roleOptions: OptionItem[] = [
    { id: 'program-manager', label: 'Program Manager', description: 'Cross-functional project leadership', icon: 'talentManager', recommended: true },
    { id: 'software-engineer', label: 'Software Engineer', description: 'Technical development roles', icon: 'talentDeveloper' },
    { id: 'marketing-coordinator', label: 'Marketing Coordinator', description: 'Brand and campaign management', icon: 'talentMarketing' },
    { id: 'data-analyst', label: 'Data Analyst', description: 'Analytics and insights roles', icon: 'talentAnalyst' },
    { id: 'communications-manager', label: 'Communications Manager', description: 'Internal and external communications', icon: 'talentCommunications' },
    { id: 'operations-specialist', label: 'Operations Specialist', description: 'Process and efficiency optimization', icon: 'talentOperations' },
    { id: 'customer-success', label: 'Customer Success', description: 'Client relationship and retention', icon: 'talentCustomer' },
    { id: 'product-manager', label: 'Product Manager', description: 'Product strategy and development', icon: 'talentProduct' }
  ];

  // Hiring challenge options
  const challengeOptions: OptionItem[] = [
    { id: 'long-time-to-hire', label: 'Long Time to Hire', description: 'Recruitment process takes too long', icon: 'talentClock', recommended: true },
    { id: 'poor-candidate-quality', label: 'Poor Candidate Quality', description: 'Applicants don\'t meet requirements', icon: 'talentFilter', recommended: true },
    { id: 'lack-diversity', label: 'Lack of Diversity', description: 'Not reaching diverse talent pools', icon: 'talentDiversity' },
    { id: 'high-rejection-rate', label: 'High Offer Rejection Rate', description: 'Candidates decline job offers', icon: 'talentDecline' },
    { id: 'bias-in-process', label: 'Unconscious Bias', description: 'Unfair evaluation practices', icon: 'talentBalance' },
    { id: 'poor-candidate-experience', label: 'Poor Candidate Experience', description: 'Negative feedback about process', icon: 'talentExperience' },
    { id: 'limited-talent-pool', label: 'Limited Talent Pool', description: 'Not enough qualified candidates', icon: 'talentPool' },
    { id: 'inconsistent-interviews', label: 'Inconsistent Interviews', description: 'No standardized evaluation process', icon: 'talentInterview' }
  ];

  // Hiring strategy options
  const strategyOptions: OptionItem[] = [
    { id: 'inclusive-job-descriptions', label: 'Inclusive Job Descriptions', description: 'Bias-free, welcoming language', icon: 'talentInclusive', recommended: true },
    { id: 'structured-interviews', label: 'Structured Interviews', description: 'Consistent evaluation framework', icon: 'talentStructured', recommended: true },
    { id: 'diverse-sourcing', label: 'Diverse Sourcing Channels', description: 'Reach underrepresented groups', icon: 'talentNetwork' },
    { id: 'skills-assessments', label: 'Skills-Based Assessments', description: 'Objective capability evaluation', icon: 'talentSkills' },
    { id: 'cultural-fit-interviews', label: 'Culture Fit Evaluation', description: 'Values alignment assessment', icon: 'talentCulture' },
    { id: 'employer-branding', label: 'Strong Employer Branding', description: 'Attractive company reputation', icon: 'talentBrand' },
    { id: 'referral-programs', label: 'Employee Referral Programs', description: 'Leverage internal networks', icon: 'talentReferral' },
    { id: 'feedback-systems', label: 'Candidate Feedback Systems', description: 'Continuous process improvement', icon: 'talentFeedback' }
  ];

  // Hiring goal options
  const goalOptions: OptionItem[] = [
    { id: 'faster-hiring', label: 'Faster Hiring Process', description: 'Reduce time-to-hire significantly', icon: 'talentSpeed', recommended: true },
    { id: 'better-quality', label: 'Higher Quality Candidates', description: 'Find better-qualified applicants', icon: 'talentQuality', recommended: true },
    { id: 'improve-diversity', label: 'Increase Diversity', description: 'Build more inclusive teams', icon: 'talentDiversity' },
    { id: 'reduce-bias', label: 'Eliminate Bias', description: 'Fair and objective evaluations', icon: 'talentBalance' },
    { id: 'better-experience', label: 'Improve Candidate Experience', description: 'Positive recruitment journey', icon: 'talentExperience' },
    { id: 'higher-retention', label: 'Better New Hire Retention', description: 'Find people who stay longer', icon: 'talentRetention' },
    { id: 'cost-efficiency', label: 'Reduce Hiring Costs', description: 'More efficient recruitment spend', icon: 'talentCost' },
    { id: 'build-pipeline', label: 'Build Talent Pipeline', description: 'Continuous candidate relationships', icon: 'talentPipeline' }
  ];

  const hiringFrameworkElements: HiringFrameworkElement[] = [
    {
      id: 'inclusive-descriptions',
      title: 'Inclusive Job Descriptions',
      description: 'Remove bias and attract diverse talent through language',
      implementation: 'Use AI to analyze job postings for bias, emphasize skills over requirements',
      example: 'Transform "rockstar developer needed" to "collaborative developer with growth mindset seeking impact"'
    },
    {
      id: 'bias-free-screening',
      title: 'Bias-Free Screening',
      description: 'Objective initial assessment focused on capabilities',
      implementation: 'Structured rubrics, blind resume reviews, skill-based assessments',
      example: 'Skills matrix scoring replaces "culture fit" subjective judgments'
    },
    {
      id: 'empathetic-interviews',
      title: 'Empathetic Interviews',
      description: 'Human-centered conversations that reveal potential',
      implementation: 'Behavioral questions, growth mindset focus, psychological safety',
      example: '"Tell me about a time you learned from failure" vs "What are your weaknesses?"'
    },
    {
      id: 'holistic-evaluation',
      title: 'Holistic Evaluation',
      description: 'Complete candidate picture beyond test scores',
      implementation: 'Multiple perspectives, diverse interview panels, potential assessment',
      example: 'Values alignment + skills + growth potential = hiring decision'
    },
    {
      id: 'candidate-experience',
      title: 'Exceptional Experience',
      description: 'Every candidate feels valued throughout the process',
      implementation: 'Clear communication, timely feedback, respectful interactions',
      example: 'Personalized feedback to every candidate, regardless of outcome'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I remember staring at a stack of 200 resumes for a single position, feeling overwhelmed and worried about unconscious bias.",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our hiring process was broken. We kept hiring people who looked and thought like us, missing incredible talent.",
      emotion: 'concerned' as const
    },
    {
      id: '3',
      content: "I knew we needed to change, but how do you remove bias while still finding the right cultural fit?",
      emotion: 'thoughtful' as const
    },
    {
      id: '4',
      content: "That's when I discovered AI could help us see talent more clearly, while preserving the human connection that makes great teams.",
      emotion: 'hopeful' as const
    },
    {
      id: '5',
      content: "We redesigned our entire process: inclusive job descriptions, bias-free screening, empathetic interviews, and holistic evaluation.",
      emotion: 'determined' as const
    },
    {
      id: '6',
      content: "The first hire using our new process was Maria - someone our old system would have missed, but who became our star program manager.",
      emotion: 'excited' as const
    },
    {
      id: '7',
      content: "Within six months, our team diversity increased 60%, our retention improved 40%, and our candidate experience scores hit 4.8/5.",
      emotion: 'triumphant' as const
    },
    {
      id: '8',
      content: "Now let me show you how to build your own compassionate, AI-powered hiring process that finds amazing people.",
      emotion: 'empowered' as const
    }
  ];

  // Update prompt segments when selections change
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen Rodriguez needs to create compassionate hiring strategies that combine AI efficiency with human empathy to find the right people while ensuring fair, inclusive processes.',
        type: 'context',
        color: 'border-l-purple-400',
        required: true
      },
      {
        id: 'roles',
        label: 'Role Types',
        value: selectedRoles.length > 0 ? `Hiring for: ${selectedRoles.map(id => roleOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-blue-400',
        required: false
      },
      {
        id: 'challenges',
        label: 'Hiring Challenges',
        value: selectedChallenges.length > 0 ? `Current challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'strategies',
        label: 'Preferred Strategies',
        value: selectedStrategies.length > 0 ? `Hiring strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Hiring Goals',
        value: selectedGoals.length > 0 ? `Desired outcomes: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-purple-400',
        required: false
      },
      {
        id: 'format',
        label: 'Output Framework',
        value: 'Create a comprehensive hiring strategy using Carmen\'s framework: 1) Inclusive Job Descriptions, 2) Bias-Free Screening, 3) Empathetic Interviews, 4) Holistic Evaluation, 5) Exceptional Candidate Experience. Include specific implementation steps and success metrics.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedRoles, selectedChallenges, selectedStrategies, selectedGoals]);

  const generateHiringStrategy = async () => {
    if (selectedRoles.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'compassionate-hiring-strategy',
          topic: 'AI-powered talent acquisition with human empathy',
          context: `Carmen Rodriguez needs to create a comprehensive hiring strategy using her compassionate AI approach.
          
          Role Types: ${selectedRoles.map(id => roleOptions.find(opt => opt.id === id)?.label).join(', ')}
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Preferred Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Hiring Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          
          Create a structured hiring strategy that follows Carmen's framework: 1) Inclusive Job Descriptions (bias removal, skills focus), 2) Bias-Free Screening (objective assessment), 3) Empathetic Interviews (human connection with growth mindset), 4) Holistic Evaluation (complete candidate picture), 5) Exceptional Candidate Experience (respect and value for all). The strategy should combine AI efficiency with human empathy for compassionate, effective hiring.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Hiring Strategy Created!",
        description: "Carmen crafted your compassionate talent acquisition plan.",
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
      title: "Talent Acquisition Mastery Complete!",
      description: "You've mastered Carmen's compassionate hiring framework!",
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
            src={getAnimationUrl('carmen-hiring-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('teamMedium')} alt="Talent" className="w-12 h-12" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4" id="main-heading">
          Carmen's Compassionate Hiring
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform talent acquisition through AI-powered empathy and bias-free processes
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Hiring Frustration', desc: 'Carmen\'s bias and inefficiency struggles', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-hiring-struggle.mp4', fallback: <img src={getCarmenManagementIconUrl('performanceUniform')} alt="Frustration" className="w-8 h-8" /> },
            { title: 'AI-Empathy Framework', desc: 'Learn compassionate hiring system', color: 'from-purple-500/10 to-purple-500/5', animation: 'carmen-framework-discovery.mp4', fallback: <img src={getCarmenManagementIconUrl('performanceBalance')} alt="Framework" className="w-8 h-8" /> },
            { title: 'Hiring Transformation', desc: 'Witness diverse team success', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-hiring-success.mp4', fallback: <img src={getCarmenManagementIconUrl('retentionTeam')} alt="Transformation" className="w-8 h-8" /> }
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
              aria-label="Start Carmen's compassionate hiring journey - Learn AI-powered talent acquisition with human empathy and bias-free processes"
            >
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Begin Hiring Journey
              <span className="sr-only">This workshop teaches compassionate hiring strategies that combine AI efficiency with human empathy</span>
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
        lessonTitle="Compassionate Talent Acquisition"
        characterName="Carmen"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
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
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Mastery"
        lessonTitle="Compassionate Talent Acquisition"
        characterName="Carmen"
        progress={66 + (currentStep / 5) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 5) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Carmen's Compassionate Hiring Workshop</p>
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
            {/* Role Types Selection - Compact */}
            <VisualOptionGrid
              title="Role Types"
              description="What roles are you hiring?"
              options={roleOptions}
              selectedIds={selectedRoles}
              onSelectionChange={setSelectedRoles}
              multiSelect={true}
              maxSelections={3}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Hiring Challenges - Compact */}
            <VisualOptionGrid
              title="Challenges"
              description="Hiring issues"
              options={challengeOptions}
              selectedIds={selectedChallenges}
              onSelectionChange={setSelectedChallenges}
              multiSelect={true}
              maxSelections={4}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Hiring Strategies - Compact */}
            <VisualOptionGrid
              title="Strategies"
              description="How to improve hiring"
              options={strategyOptions}
              selectedIds={selectedStrategies}
              onSelectionChange={setSelectedStrategies}
              multiSelect={true}
              maxSelections={4}
              gridCols={1}
              characterTheme="carmen"
            />

            {/* Hiring Goals - Compact */}
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
                  onClick={generateHiringStrategy}
                  disabled={selectedRoles.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0 || isGenerating}
                  className="w-full nm-button nm-button-primary text-base py-2"
                  aria-label={isGenerating ? "Creating your compassionate hiring strategy" : "Generate compassionate hiring strategy using AI-powered empathy and bias-free processes"}
                  aria-describedby="hiring-generation-status"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                      <span aria-live="polite">Carmen is crafting your strategy...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                      Create Compassionate Hiring Strategy
                    </>
                  )}
                  <div id="hiring-generation-status" className="sr-only">
                    {isGenerating ? "AI is currently generating your compassionate hiring strategy. Please wait." : "Click to generate your hiring strategy"}
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
                    Your Hiring Strategy
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
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Strategy Awaiting Creation</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                      Make your selections on the left and click "Create Compassionate Hiring Strategy" to see Carmen's framework.
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
              aria-label="Complete the talent acquisition workshop and return to Chapter 7"
            >
              Complete Talent Acquisition Workshop
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

export default CarmenTalentAcquisition;