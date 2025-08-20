import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Users, Play, Target, Heart, TrendingUp, Clock, Building, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl, getCarmenManagementIconUrl } from '@/utils/supabaseIcons';
import { CompactVisualOptionGrid, CompactOptionItem } from '@/components/ui/CompactVisualOptionGrid';
import { CompactPreferenceSliders } from '@/components/ui/CompactPreferenceSliders';
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
  
  // Preference slider values for nuanced hiring calibration
  const [sliderValues, setSliderValues] = useState<{ [sliderId: string]: number }>({});
  const [useSliderMode, setUseSliderMode] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Role type options
  const roleOptions: CompactOptionItem[] = [
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
  const challengeOptions: CompactOptionItem[] = [
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
  const strategyOptions: CompactOptionItem[] = [
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
  const goalOptions: CompactOptionItem[] = [
    { id: 'faster-hiring', label: 'Faster Hiring Process', description: 'Reduce time-to-hire significantly', icon: 'talentSpeed', recommended: true },
    { id: 'better-quality', label: 'Higher Quality Candidates', description: 'Find better-qualified applicants', icon: 'talentQuality', recommended: true },
    { id: 'improve-diversity', label: 'Increase Diversity', description: 'Build more inclusive teams', icon: 'talentDiversity' },
    { id: 'reduce-bias', label: 'Eliminate Bias', description: 'Fair and objective evaluations', icon: 'talentBalance' },
    { id: 'better-experience', label: 'Improve Candidate Experience', description: 'Positive recruitment journey', icon: 'talentExperience' },
    { id: 'higher-retention', label: 'Better New Hire Retention', description: 'Find people who stay longer', icon: 'talentRetention' },
    { id: 'cost-efficiency', label: 'Reduce Hiring Costs', description: 'More efficient recruitment spend', icon: 'talentCost' },
    { id: 'build-pipeline', label: 'Build Talent Pipeline', description: 'Continuous candidate relationships', icon: 'talentPipeline' }
  ];

  // Define hiring preference sliders for nuanced calibration
  const hiringPreferenceSliders = [
    {
      id: 'experience-vs-potential',
      label: 'Experience vs Potential',
      description: 'Balance between proven experience and growth potential',
      min: 0,
      max: 10,
      step: 0.5,
      value: sliderValues['experience-vs-potential'] || 5,
      defaultValue: 5,
      minLabel: 'Proven Experience',
      maxLabel: 'High Potential',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'Core' as const,
      metadata: {
        priority: 'high',
        impact: 'high',
        helpText: 'Consider whether you prioritize candidates with extensive experience or those with strong potential for growth.'
      }
    },
    {
      id: 'skills-vs-culture',
      label: 'Skills vs Culture Fit',
      description: 'Weight technical skills against cultural alignment',
      min: 0,
      max: 10,
      step: 0.5,
      value: sliderValues['skills-vs-culture'] || 5,
      defaultValue: 5,
      minLabel: 'Technical Skills',
      maxLabel: 'Culture Fit',
      icon: <Heart className="w-4 h-4" />,
      category: 'Core' as const,
      metadata: {
        priority: 'high',
        impact: 'high',
        helpText: 'Balance the importance of technical competence against how well candidates align with your company culture.'
      }
    },
    {
      id: 'diversity-priority',
      label: 'Diversity Importance',
      description: 'Priority level for diverse candidate sourcing',
      min: 1,
      max: 10,
      step: 1,
      value: sliderValues['diversity-priority'] || 8,
      defaultValue: 8,
      minLabel: 'Standard',
      maxLabel: 'Critical Priority',
      icon: <Users className="w-4 h-4" />,
      category: 'Sourcing' as const,
      color: 'accent-purple-600',
      metadata: {
        priority: 'high',
        impact: 'medium',
        helpText: 'Set how important diverse representation is in your hiring pipeline and sourcing efforts.'
      }
    },
    {
      id: 'time-vs-quality',
      label: 'Speed vs Quality',
      description: 'Balance hiring speed against thorough evaluation',
      min: 0,
      max: 10,
      step: 0.5,
      value: sliderValues['time-vs-quality'] || 6,
      defaultValue: 6,
      minLabel: 'Fast Hiring',
      maxLabel: 'Thorough Process',
      icon: <Clock className="w-4 h-4" />,
      category: 'Core' as const,
      metadata: {
        priority: 'medium',
        impact: 'high',
        helpText: 'Decide whether to prioritize quick hiring decisions or comprehensive candidate evaluation.'
      }
    },
    {
      id: 'internal-vs-external',
      label: 'Internal vs External',
      description: 'Preference for promoting internally vs external hiring',
      min: 0,
      max: 10,
      step: 1,
      value: sliderValues['internal-vs-external'] || 3,
      defaultValue: 3,
      minLabel: 'External Focus',
      maxLabel: 'Internal First',
      icon: <Building className="w-4 h-4" />,
      category: 'Sourcing' as const,
      metadata: {
        priority: 'medium',
        impact: 'medium',
        helpText: 'Set preference for internal promotions and transfers versus external candidate recruitment.'
      }
    },
    {
      id: 'cost-sensitivity',
      label: 'Cost Sensitivity',
      description: 'How much budget constraints affect hiring decisions',
      min: 1,
      max: 10,
      step: 1,
      value: sliderValues['cost-sensitivity'] || 4,
      defaultValue: 4,
      minLabel: 'Budget Flexible',
      maxLabel: 'Cost Critical',
      icon: <Target className="w-4 h-4" />,
      category: 'Constraints' as const,
      inversed: true,
      metadata: {
        priority: 'medium',
        impact: 'medium',
        helpText: 'Indicate how strictly budget constraints should influence hiring decisions and salary negotiations.'
      }
    },
    {
      id: 'innovation-vs-stability',
      label: 'Innovation vs Stability',
      description: 'Preference for innovative risk-takers vs reliable performers',
      min: 0,
      max: 10,
      step: 0.5,
      value: sliderValues['innovation-vs-stability'] || 5.5,
      defaultValue: 5.5,
      minLabel: 'Reliable Performers',
      maxLabel: 'Innovation Focus',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'Core' as const,
      metadata: {
        priority: 'medium',
        impact: 'high',
        helpText: 'Balance between candidates who bring stability versus those who drive innovation and change.'
      }
    },
    {
      id: 'remote-flexibility',
      label: 'Remote Work Flexibility',
      description: 'Openness to remote and hybrid work arrangements',
      min: 0,
      max: 10,
      step: 1,
      value: sliderValues['remote-flexibility'] || 7,
      defaultValue: 7,
      minLabel: 'Office Required',
      maxLabel: 'Fully Remote OK',
      icon: <Users className="w-4 h-4" />,
      category: 'Sourcing' as const,
      metadata: {
        priority: 'medium',
        impact: 'medium',
        helpText: 'Set how flexible you are with remote work options, which affects your candidate pool size.'
      }
    }
  ];

  // Predefined slider presets for common hiring scenarios
  const sliderPresets = [
    {
      id: 'startup-growth',
      name: 'Startup Growth Mode',
      description: 'Fast hiring with emphasis on potential and cultural fit',
      values: {
        'experience-vs-potential': 7,
        'skills-vs-culture': 6,
        'diversity-priority': 8,
        'time-vs-quality': 3,
        'internal-vs-external': 2,
        'cost-sensitivity': 7,
        'innovation-vs-stability': 8,
        'remote-flexibility': 8
      },
      tags: ['startup', 'growth', 'agile']
    },
    {
      id: 'enterprise-quality',
      name: 'Enterprise Quality Focus',
      description: 'Thorough process prioritizing experience and proven skills',
      values: {
        'experience-vs-potential': 3,
        'skills-vs-culture': 4,
        'diversity-priority': 7,
        'time-vs-quality': 8,
        'internal-vs-external': 6,
        'cost-sensitivity': 4,
        'innovation-vs-stability': 4,
        'remote-flexibility': 5
      },
      tags: ['enterprise', 'quality', 'thorough']
    },
    {
      id: 'balanced-approach',
      name: 'Balanced Approach',
      description: 'Well-rounded hiring strategy with moderate preferences',
      values: {
        'experience-vs-potential': 5,
        'skills-vs-culture': 5,
        'diversity-priority': 7,
        'time-vs-quality': 6,
        'internal-vs-external': 4,
        'cost-sensitivity': 5,
        'innovation-vs-stability': 5.5,
        'remote-flexibility': 6
      },
      tags: ['balanced', 'moderate', 'flexible']
    },
    {
      id: 'diversity-first',
      name: 'Diversity & Inclusion First',
      description: 'Maximum focus on building diverse, inclusive teams',
      values: {
        'experience-vs-potential': 6,
        'skills-vs-culture': 7,
        'diversity-priority': 10,
        'time-vs-quality': 7,
        'internal-vs-external': 3,
        'cost-sensitivity': 3,
        'innovation-vs-stability': 6,
        'remote-flexibility': 9
      },
      tags: ['diversity', 'inclusion', 'equity']
    }
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

  // Initialize slider values with defaults
  useEffect(() => {
    const defaultValues: { [id: string]: number } = {};
    hiringPreferenceSliders.forEach(slider => {
      defaultValues[slider.id] = slider.defaultValue;
    });
    setSliderValues(defaultValues);
  }, []);

  // Update prompt segments when selections or slider values change
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
        id: 'preferences',
        label: 'Hiring Preferences',
        value: useSliderMode && Object.keys(sliderValues).length > 0 ? `Preference calibration: ${hiringPreferenceSliders.map(slider => `${slider.label} (${(sliderValues[slider.id] || slider.defaultValue).toFixed(1)}/${slider.max})`).join(', ')}` : '',
        type: 'data',
        color: 'border-l-cyan-400',
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
  }, [selectedRoles, selectedChallenges, selectedStrategies, selectedGoals, sliderValues, useSliderMode]);

  const generateHiringStrategy = async () => {
    if (!useSliderMode && (selectedRoles.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0)) return;
    if (useSliderMode && Object.keys(sliderValues).length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'compassionate-hiring-strategy',
          topic: 'AI-powered talent acquisition with human empathy',
          context: `Carmen Rodriguez needs to create a comprehensive hiring strategy using her compassionate AI approach.
          
          ${useSliderMode ? `
          Preference-Based Hiring Configuration:
          ${hiringPreferenceSliders.map(slider => {
            const value = sliderValues[slider.id] || slider.defaultValue;
            const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
            return `• ${slider.label}: ${value.toFixed(1)}/${slider.max} (${percentage.toFixed(0)}% - ${slider.description})`;
          }).join('\n          ')}
          ` : `
          Role Types: ${selectedRoles.map(id => roleOptions.find(opt => opt.id === id)?.label).join(', ')}
          Current Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}
          Preferred Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Hiring Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          `}
          
          Create a structured hiring strategy that follows Carmen's framework: 1) Inclusive Job Descriptions (bias removal, skills focus), 2) Bias-Free Screening (objective assessment), 3) Empathetic Interviews (human connection with growth mindset), 4) Holistic Evaluation (complete candidate picture), 5) Exceptional Candidate Experience (respect and value for all). ${useSliderMode ? 'The strategy should reflect the nuanced preferences indicated by the slider values, providing specific recommendations based on the calibrated balance between different hiring priorities.' : 'The strategy should combine AI efficiency with human empathy for compassionate, effective hiring.'}`
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
        {/* Compact Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Carmen's Compassionate Hiring Workshop</h1>
              <p className="text-sm text-gray-600">Build AI-powered hiring strategies with human empathy</p>
            </div>
            <Button className="nm-button nm-button-secondary text-sm px-4 py-2" onClick={() => navigate('/chapter/7')} aria-label="Return to Chapter 7 main page">
              Back to Chapter 7
            </Button>
          </div>
          <Progress value={66 + (currentStep / 5) * 34} className="h-2 mb-1" />
          <p className="text-xs text-gray-500">Workshop Progress: {Math.round(66 + (currentStep / 5) * 34)}%</p>
        </div>

        {/* Compact Progressive Layout */}
        <div className="space-y-4">
          
          {/* Compact Mode Toggle */}
          <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Choose Your Approach</h2>
                <p className="text-gray-600 text-sm">Select how you'd like to build your hiring strategy</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                <Button
                  variant={!useSliderMode ? "default" : "outline"}
                  onClick={() => setUseSliderMode(false)}
                  className="h-16 flex-col space-y-1 text-left p-3"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Target className="w-4 h-4" />
                    Quick Selection
                  </div>
                  <div className="text-xs text-muted-foreground">Predefined options</div>
                </Button>
                <Button
                  variant={useSliderMode ? "default" : "outline"}
                  onClick={() => setUseSliderMode(true)}
                  className="h-16 flex-col space-y-1 text-left p-3"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Sliders className="w-4 h-4" />
                    Custom Calibration
                  </div>
                  <div className="text-xs text-muted-foreground">Custom calibration</div>
                </Button>
              </div>
            </CardContent>
          </Card>

        {/* Main Content - Single Column Flow */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Configuration Section */}
          <div className="space-y-6">
            {useSliderMode ? (
              /* Preference Slider Mode - Better Spacing */
              <CompactPreferenceSliders
                sliders={hiringPreferenceSliders}
                values={sliderValues}
                onValuesChange={setSliderValues}
                presets={sliderPresets}
              />
            ) : (
              <div className="space-y-3">
                {/* Compact Role Types Selection */}
                <CompactVisualOptionGrid
                  title="What roles are you hiring for?"
                  options={roleOptions}
                  selectedIds={selectedRoles}
                  onSelectionChange={setSelectedRoles}
                  multiSelect={true}
                  maxSelections={3}
                />

                {/* Compact Hiring Challenges */}
                <CompactVisualOptionGrid
                  title="What hiring challenges do you face?"
                  options={challengeOptions}
                  selectedIds={selectedChallenges}
                  onSelectionChange={setSelectedChallenges}
                  multiSelect={true}
                  maxSelections={4}
                />

                {/* Compact Hiring Strategies */}
                <CompactVisualOptionGrid
                  title="Which strategies interest you most?"
                  options={strategyOptions}
                  selectedIds={selectedStrategies}
                  onSelectionChange={setSelectedStrategies}
                  multiSelect={true}
                  maxSelections={4}
                />

                {/* Compact Hiring Goals */}
                <CompactVisualOptionGrid
                  title="What are your main hiring goals?"
                  options={goalOptions}
                  selectedIds={selectedGoals}
                  onSelectionChange={setSelectedGoals}
                  multiSelect={true}
                  maxSelections={3}
                />
              </div>
            )}
            
            {/* Generate Button Section - Compact */}
            <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50">
              <CardContent className="p-4 text-center">
                {useSliderMode ? (
                  <Button 
                    onClick={generateHiringStrategy}
                    disabled={Object.keys(sliderValues).length === 0 || isGenerating}
                    size="default"
                    className="px-8 py-3 text-base font-semibold nm-button nm-button-primary"
                    aria-label={isGenerating ? "Creating your nuanced hiring strategy" : "Generate hiring strategy based on preference calibration"}
                  >
                    {isGenerating ? (
                      <>
                        <Heart className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                        <span aria-live="polite">Carmen is calibrating...</span>
                      </>
                    ) : (
                      <>
                        <Sliders className="w-5 h-5 mr-2" aria-hidden="true" />
                        Generate Strategy
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={generateHiringStrategy}
                    disabled={selectedRoles.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0 || isGenerating}
                    size="default"
                    className="px-8 py-3 text-base font-semibold nm-button nm-button-primary"
                    aria-label={isGenerating ? "Creating your compassionate hiring strategy" : "Generate compassionate hiring strategy using AI-powered empathy and bias-free processes"}
                  >
                    {isGenerating ? (
                      <>
                        <Heart className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                        <span aria-live="polite">Carmen is crafting...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                        Create Strategy
                      </>
                    )}
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
                  {useSliderMode 
                    ? "Nuanced strategy based on your preferences"
                    : "Personalized strategy from your selections"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Prompt Preview - Optional Collapsible */}
          <details className="group">
            <summary className="cursor-pointer list-none">
              <Card className="group-open:border-purple-200 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Play className="w-5 h-5 text-purple-600" />
                      AI Prompt Preview
                    </CardTitle>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                  <p className="text-sm text-muted-foreground">See how your selections build Carmen's AI prompt</p>
                </CardHeader>
              </Card>
            </summary>
            <div className="mt-4">
              <DynamicPromptBuilder
                segments={promptSegments}
                characterName="Carmen"
                characterTheme="carmen"
                showCopyButton={true}
                autoUpdate={true}
              />
            </div>
          </details>

          {/* Generated Strategy - Prominent Display */}
          {generatedStrategy && (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-purple-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Your Compassionate Hiring Strategy
                </CardTitle>
                <p className="text-muted-foreground">Carmen's personalized framework for your organization</p>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <TemplateContentFormatter 
                    content={generatedStrategy}
                    contentType="lesson"
                    variant="default"
                    showMergeFieldTypes={true}
                    className="formatted-ai-content prose prose-sm max-w-none"
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