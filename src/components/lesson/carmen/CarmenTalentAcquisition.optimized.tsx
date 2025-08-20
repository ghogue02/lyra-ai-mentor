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
import CompactVisualOptionGrid from '@/components/ui/CompactVisualOptionGrid';
import CompactPreferenceSliders from '@/components/ui/CompactPreferenceSliders';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { cn } from '@/lib/utils';
import '../../../styles/compact-viewport.css';

type Phase = 'intro' | 'narrative' | 'workshop';

const CarmenTalentAcquisitionOptimized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [sliderValues, setSliderValues] = useState<{ [sliderId: string]: number }>({});
  const [useSliderMode, setUseSliderMode] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptSegments, setPromptSegments] = useState<PromptSegment[]>([]);

  // Compact role options (reduced description length)
  const roleOptions = [
    { id: 'program-manager', label: 'Program Manager', description: 'Cross-functional leadership', icon: 'talentManager', recommended: true },
    { id: 'software-engineer', label: 'Software Engineer', description: 'Technical development', icon: 'talentDeveloper' },
    { id: 'marketing-coordinator', label: 'Marketing Coord.', description: 'Brand management', icon: 'talentMarketing' },
    { id: 'data-analyst', label: 'Data Analyst', description: 'Analytics & insights', icon: 'talentAnalyst' },
    { id: 'communications-manager', label: 'Comms Manager', description: 'Internal/external comms', icon: 'talentCommunications' },
    { id: 'operations-specialist', label: 'Operations Spec.', description: 'Process optimization', icon: 'talentOperations' },
    { id: 'customer-success', label: 'Customer Success', description: 'Client relationships', icon: 'talentCustomer' },
    { id: 'product-manager', label: 'Product Manager', description: 'Product strategy', icon: 'talentProduct' }
  ];

  // Compact challenge options
  const challengeOptions = [
    { id: 'long-time-to-hire', label: 'Slow Hiring', description: 'Process takes too long', icon: 'talentClock', recommended: true },
    { id: 'poor-candidate-quality', label: 'Poor Quality', description: 'Unqualified applicants', icon: 'talentFilter', recommended: true },
    { id: 'lack-diversity', label: 'Low Diversity', description: 'Limited talent pools', icon: 'talentDiversity' },
    { id: 'high-rejection-rate', label: 'High Rejections', description: 'Offers declined', icon: 'talentDecline' },
    { id: 'bias-in-process', label: 'Unconscious Bias', description: 'Unfair evaluations', icon: 'talentBalance' },
    { id: 'poor-candidate-experience', label: 'Poor Experience', description: 'Negative process feedback', icon: 'talentExperience' }
  ];

  // Compact strategy options  
  const strategyOptions = [
    { id: 'inclusive-job-descriptions', label: 'Inclusive JDs', description: 'Bias-free language', icon: 'talentInclusive', recommended: true },
    { id: 'structured-interviews', label: 'Structured Interviews', description: 'Consistent framework', icon: 'talentStructured', recommended: true },
    { id: 'diverse-sourcing', label: 'Diverse Sourcing', description: 'Reach underrep groups', icon: 'talentNetwork' },
    { id: 'skills-assessments', label: 'Skills Assessment', description: 'Objective evaluation', icon: 'talentSkills' },
    { id: 'cultural-fit-interviews', label: 'Culture Fit', description: 'Values alignment', icon: 'talentCulture' },
    { id: 'employer-branding', label: 'Employer Brand', description: 'Company reputation', icon: 'talentBrand' }
  ];

  // Compact goal options
  const goalOptions = [
    { id: 'faster-hiring', label: 'Faster Process', description: 'Reduce time-to-hire', icon: 'talentSpeed', recommended: true },
    { id: 'better-quality', label: 'Higher Quality', description: 'Better candidates', icon: 'talentQuality', recommended: true },
    { id: 'improve-diversity', label: 'More Diversity', description: 'Inclusive teams', icon: 'talentDiversity' },
    { id: 'reduce-bias', label: 'Less Bias', description: 'Fair evaluations', icon: 'talentBalance' },
    { id: 'better-experience', label: 'Better Experience', description: 'Positive journey', icon: 'talentExperience' },
    { id: 'higher-retention', label: 'Better Retention', description: 'Longer-term hires', icon: 'talentRetention' }
  ];

  // Simplified preference sliders
  const hiringPreferenceSliders = [
    {
      id: 'experience-vs-potential',
      label: 'Experience vs Potential',
      description: 'Balance proven experience vs growth potential',
      min: 0, max: 10, step: 0.5, defaultValue: 5,
      minLabel: 'Experience', maxLabel: 'Potential', category: 'Core'
    },
    {
      id: 'skills-vs-culture',
      label: 'Skills vs Culture Fit',
      description: 'Technical skills vs cultural alignment',
      min: 0, max: 10, step: 0.5, defaultValue: 5,
      minLabel: 'Skills', maxLabel: 'Culture', category: 'Core'
    },
    {
      id: 'time-vs-quality',
      label: 'Speed vs Quality',
      description: 'Hiring speed vs thorough evaluation',
      min: 0, max: 10, step: 0.5, defaultValue: 6,
      minLabel: 'Fast', maxLabel: 'Thorough', category: 'Core'
    },
    {
      id: 'diversity-priority',
      label: 'Diversity Priority',
      description: 'Importance of diverse sourcing',
      min: 1, max: 10, step: 1, defaultValue: 8,
      minLabel: 'Standard', maxLabel: 'Critical', category: 'Sourcing'
    },
    {
      id: 'internal-vs-external',
      label: 'Internal vs External',
      description: 'Internal promotion vs external hiring',
      min: 0, max: 10, step: 1, defaultValue: 3,
      minLabel: 'External', maxLabel: 'Internal', category: 'Sourcing'
    },
    {
      id: 'cost-sensitivity',
      label: 'Budget Flexibility',
      description: 'How budget affects decisions',
      min: 1, max: 10, step: 1, defaultValue: 4,
      minLabel: 'Flexible', maxLabel: 'Critical', category: 'Constraints'
    }
  ];

  // Slider presets
  const sliderPresets = [
    {
      id: 'startup-growth',
      name: 'Startup',
      description: 'Fast growth with potential focus',
      icon: '🚀',
      values: { 'experience-vs-potential': 7, 'skills-vs-culture': 6, 'time-vs-quality': 3, 'diversity-priority': 8, 'internal-vs-external': 2, 'cost-sensitivity': 7 }
    },
    {
      id: 'enterprise-quality', 
      name: 'Enterprise',
      description: 'Quality focus with experience',
      icon: '🏢',
      values: { 'experience-vs-potential': 3, 'skills-vs-culture': 4, 'time-vs-quality': 8, 'diversity-priority': 7, 'internal-vs-external': 6, 'cost-sensitivity': 4 }
    },
    {
      id: 'balanced-approach',
      name: 'Balanced', 
      description: 'Well-rounded approach',
      icon: '⚖️',
      values: { 'experience-vs-potential': 5, 'skills-vs-culture': 5, 'time-vs-quality': 6, 'diversity-priority': 7, 'internal-vs-external': 4, 'cost-sensitivity': 5 }
    }
  ];

  // Narrative messages (shortened)
  const narrativeMessages = [
    { id: '1', content: "I was overwhelmed by 200 resumes for one position, worried about unconscious bias.", emotion: 'frustrated' as const, showAvatar: true },
    { id: '2', content: "Our hiring was broken. We kept hiring people like us, missing incredible talent.", emotion: 'concerned' as const },
    { id: '3', content: "How do you remove bias while finding the right cultural fit?", emotion: 'thoughtful' as const },
    { id: '4', content: "AI could help us see talent clearly while preserving human connection.", emotion: 'hopeful' as const },
    { id: '5', content: "We redesigned everything: inclusive descriptions, bias-free screening, empathetic interviews.", emotion: 'determined' as const },
    { id: '6', content: "Our first hire using the new process was Maria - someone we would have missed before.", emotion: 'excited' as const },
    { id: '7', content: "Six months later: 60% more diversity, 40% better retention, 4.8/5 candidate scores.", emotion: 'triumphant' as const },
    { id: '8', content: "Let me show you how to build your compassionate, AI-powered hiring process.", emotion: 'empowered' as const }
  ];

  // Initialize slider values
  useEffect(() => {
    const defaultValues: { [id: string]: number } = {};
    hiringPreferenceSliders.forEach(slider => {
      defaultValues[slider.id] = slider.defaultValue;
    });
    setSliderValues(defaultValues);
  }, []);

  // Update prompt segments
  useEffect(() => {
    const segments: PromptSegment[] = [
      {
        id: 'context',
        label: 'Carmen\'s Approach',
        value: 'Carmen creates compassionate hiring strategies combining AI efficiency with human empathy.',
        type: 'context', color: 'border-l-purple-400', required: true
      },
      {
        id: 'roles',
        label: 'Role Types',
        value: selectedRoles.length > 0 ? `Hiring for: ${selectedRoles.map(id => roleOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data', color: 'border-l-blue-400', required: false
      },
      {
        id: 'challenges',
        label: 'Challenges',
        value: selectedChallenges.length > 0 ? `Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data', color: 'border-l-red-400', required: false
      },
      {
        id: 'strategies',
        label: 'Strategies',
        value: selectedStrategies.length > 0 ? `Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction', color: 'border-l-green-400', required: false
      },
      {
        id: 'goals',
        label: 'Goals',
        value: selectedGoals.length > 0 ? `Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction', color: 'border-l-purple-400', required: false
      }
    ];
    setPromptSegments(segments);
  }, [selectedRoles, selectedChallenges, selectedStrategies, selectedGoals]);

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
          context: `Create structured hiring strategy following Carmen's framework: 1) Inclusive Job Descriptions, 2) Bias-Free Screening, 3) Empathetic Interviews, 4) Holistic Evaluation, 5) Exceptional Candidate Experience.
          
          ${useSliderMode ? `Preferences: ${hiringPreferenceSliders.map(slider => `${slider.label}: ${(sliderValues[slider.id] || slider.defaultValue).toFixed(1)}/${slider.max}`).join(', ')}` : 
          `Roles: ${selectedRoles.map(id => roleOptions.find(opt => opt.id === id)?.label).join(', ')}
          Challenges: ${selectedChallenges.map(id => challengeOptions.find(opt => opt.id === id)?.label).join(', ')}  
          Strategies: ${selectedStrategies.map(id => strategyOptions.find(opt => opt.id === id)?.label).join(', ')}
          Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}`}`
        }
      });

      if (error) throw error;
      setGeneratedStrategy(data.content);
      
      toast({
        title: "Strategy Created!",
        description: "Carmen crafted your hiring plan.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Workshop Complete!",
      description: "You've mastered Carmen's hiring framework!",
    });
    navigate('/chapter/7');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6">
          <VideoAnimation
            src={getAnimationUrl('carmen-hiring-prep.mp4')}
            fallbackIcon={<div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={getCarmenManagementIconUrl('teamMedium')} alt="Talent" className="w-10 h-10" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        <h1 className="compact-header mb-3 text-gray-900">Carmen's Compassionate Hiring</h1>
        <p className="text-lg text-gray-600 mb-8">Transform talent acquisition through AI-powered empathy</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mb-6 mx-auto">
          {[
            { title: 'Hiring Struggles', desc: 'Bias and inefficiency problems', color: 'from-red-500/10 to-red-500/5' },
            { title: 'AI Framework', desc: 'Learn compassionate system', color: 'from-purple-500/10 to-purple-500/5' },
            { title: 'Team Success', desc: 'Diverse hiring wins', color: 'from-green-500/10 to-green-500/5' }
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-lg blur-lg opacity-50`} />
              <div className="relative compact-card hover:shadow-lg transition-shadow">
                <Badge variant="secondary" className="mb-2 text-xs">{index + 1}</Badge>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button onClick={() => navigate('/chapter/7')} variant="outline" className="compact-button">
            Back to Chapter 7
          </Button>
          <Button onClick={() => setCurrentPhase('narrative')} className="compact-button bg-purple-600 hover:bg-purple-700 text-white">
            <Play className="w-4 h-4 mr-2" />
            Begin Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="viewport-container bg-gradient-to-br from-purple-50 via-white to-cyan-50"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management"
        lessonTitle="Compassionate Hiring"
        characterName="Carmen"
        progress={33}
      />
      <div className="viewport-content pt-16">
        <div className="max-w-4xl mx-auto">
          <NarrativeManager
            messages={narrativeMessages}
            onComplete={() => setCurrentPhase('workshop')}
            phaseId="carmen-hiring-narrative"
            characterName="Carmen"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="viewport-container bg-gradient-to-br from-purple-50 via-white to-cyan-50"
    >
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management"
        lessonTitle="Compassionate Hiring"
        characterName="Carmen"
        progress={66}
      />
      
      <div className="viewport-content pt-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="compact-header text-gray-900">Compassionate Hiring Workshop</h1>
              <p className="text-sm text-gray-600">Build AI-powered hiring strategies</p>
            </div>
            <Button onClick={() => navigate('/chapter/7')} variant="outline" size="sm">Back</Button>
          </div>

          {/* Mode Toggle - Compact */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50">
            <CardContent className="p-4">
              <h2 className="compact-subheader text-center mb-3">Choose Your Approach</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={!useSliderMode ? "default" : "outline"}
                  onClick={() => setUseSliderMode(false)}
                  className="h-16 flex-col p-2 text-xs"
                >
                  <Target className="w-4 h-4 mb-1" />
                  <span>Quick Selection</span>
                </Button>
                <Button
                  variant={useSliderMode ? "default" : "outline"}  
                  onClick={() => setUseSliderMode(true)}
                  className="h-16 flex-col p-2 text-xs"
                >
                  <Sliders className="w-4 h-4 mb-1" />
                  <span>Custom Sliders</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content - Ultra Compact */}
          <div className="space-y-4">
            {useSliderMode ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="compact-subheader">Fine-Tune Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompactPreferenceSliders
                    sliders={hiringPreferenceSliders}
                    values={sliderValues}
                    onValuesChange={setSliderValues}
                    presets={sliderPresets}
                    characterTheme="carmen"
                    maxHeight={200}
                    showPresets={true}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Types */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      Roles (max 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompactVisualOptionGrid
                      options={roleOptions}
                      selectedIds={selectedRoles}
                      onSelectionChange={setSelectedRoles}
                      maxSelections={3}
                      maxHeight={120}
                      itemsPerRow={2}
                      characterTheme="carmen"
                    />
                  </CardContent>
                </Card>

                {/* Challenges */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-600" />
                      Challenges (max 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompactVisualOptionGrid
                      options={challengeOptions}
                      selectedIds={selectedChallenges}
                      onSelectionChange={setSelectedChallenges}
                      maxSelections={3}
                      maxHeight={120}
                      itemsPerRow={2}
                      characterTheme="carmen"
                    />
                  </CardContent>
                </Card>

                {/* Strategies */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Strategies (max 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompactVisualOptionGrid
                      options={strategyOptions}
                      selectedIds={selectedStrategies}
                      onSelectionChange={setSelectedStrategies}
                      maxSelections={3}
                      maxHeight={120}
                      itemsPerRow={2}
                      characterTheme="carmen"
                    />
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      Goals (max 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CompactVisualOptionGrid
                      options={goalOptions}
                      selectedIds={selectedGoals}
                      onSelectionChange={setSelectedGoals}
                      maxSelections={3}
                      maxHeight={120}
                      itemsPerRow={2}
                      characterTheme="carmen"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Generate Button - Compact */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50">
              <CardContent className="p-4 text-center">
                <Button 
                  onClick={generateHiringStrategy}
                  disabled={(!useSliderMode && (selectedRoles.length === 0 || selectedChallenges.length === 0 || selectedGoals.length === 0)) || (useSliderMode && Object.keys(sliderValues).length === 0) || isGenerating}
                  className="compact-button bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 animate-pulse" />
                      Crafting Strategy...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Strategy
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-600 mt-2">Carmen will create your personalized plan</p>
              </CardContent>
            </Card>

            {/* Generated Strategy - Compact */}
            {generatedStrategy && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-purple-50">
                <CardHeader className="pb-2">
                  <CardTitle className="compact-subheader flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Hiring Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded border shadow-sm max-h-80 overflow-y-auto">
                    <TemplateContentFormatter 
                      content={generatedStrategy}
                      contentType="lesson"
                      variant="default"
                      className="text-sm prose prose-sm max-w-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Complete Button */}
          {generatedStrategy && (
            <div className="text-center pt-4">
              <Button onClick={handleComplete} className="compact-button bg-green-600 hover:bg-green-700 text-white">
                Complete Workshop
              </Button>
            </div>
          )}
        </div>
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

export default CarmenTalentAcquisitionOptimized;