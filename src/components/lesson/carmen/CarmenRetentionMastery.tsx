import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Heart, TrendingUp, Award, Copy, Download, Wand2, Play, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { VisualOptionGrid, OptionItem } from '@/components/ui/VisualOptionGrid';
import { DynamicPromptBuilder, PromptSegment } from '@/components/ui/DynamicPromptBuilder';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

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

  // Retention risk factors
  const riskOptions: OptionItem[] = [
    { id: 'low-engagement', label: 'Decreased Engagement', description: 'Lower participation in meetings/activities', icon: '📉', recommended: true },
    { id: 'career-stagnation', label: 'Career Stagnation', description: 'No recent promotions or growth', icon: '⏸️', recommended: true },
    { id: 'skill-mismatch', label: 'Skills Underutilization', description: 'Talents not being fully used', icon: '🎯' },
    { id: 'poor-management', label: 'Management Issues', description: 'Conflicts with supervisor', icon: '⚠️' },
    { id: 'work-life-balance', label: 'Work-Life Imbalance', description: 'Burnout or overwork concerns', icon: '⚖️' },
    { id: 'compensation-gap', label: 'Compensation Concerns', description: 'Below-market pay or benefits', icon: '💰' },
    { id: 'limited-autonomy', label: 'Limited Autonomy', description: 'Micromanagement or control issues', icon: '🔒' },
    { id: 'cultural-misfit', label: 'Cultural Misalignment', description: 'Values don\'t match organization', icon: '🎭' }
  ];

  // Intervention strategies
  const interventionOptions: OptionItem[] = [
    { id: 'career-conversations', label: 'Career Development Talks', description: 'One-on-one growth discussions', icon: '💬', recommended: true },
    { id: 'skill-development', label: 'Skill Development Programs', description: 'Training and learning opportunities', icon: '📚', recommended: true },
    { id: 'project-leadership', label: 'Leadership Opportunities', description: 'Lead projects or initiatives', icon: '👑' },
    { id: 'mentorship', label: 'Mentorship Programs', description: 'Pair with senior leaders', icon: '🤝' },
    { id: 'flexible-work', label: 'Work Flexibility', description: 'Remote work or flexible hours', icon: '🏠' },
    { id: 'recognition-programs', label: 'Recognition & Rewards', description: 'Celebrate achievements publicly', icon: '🏆' },
    { id: 'cross-training', label: 'Cross-Department Exposure', description: 'Experience different roles', icon: '🔄' },
    { id: 'wellness-support', label: 'Wellness Initiatives', description: 'Mental health and wellbeing', icon: '🌱' }
  ];

  // Success metrics
  const metricsOptions: OptionItem[] = [
    { id: 'retention-rate', label: 'Overall Retention Rate', description: 'Percentage of employees staying', icon: '📊', recommended: true },
    { id: 'engagement-scores', label: 'Employee Engagement', description: 'Regular satisfaction surveys', icon: '❤️', recommended: true },
    { id: 'internal-promotions', label: 'Internal Promotion Rate', description: 'Growth opportunities realized', icon: '⬆️' },
    { id: 'flight-risk-reduction', label: 'Flight Risk Scores', description: 'AI-predicted retention likelihood', icon: '🎯' },
    { id: 'career-satisfaction', label: 'Career Development Satisfaction', description: 'Growth pathway happiness', icon: '🌟' },
    { id: 'manager-effectiveness', label: 'Manager Effectiveness', description: 'Leadership impact scores', icon: '👨‍💼' },
    { id: 'time-to-productivity', label: 'New Role Adaptation', description: 'Speed of adjustment to changes', icon: '⚡' },
    { id: 'referral-quality', label: 'Employee Referral Quality', description: 'Team members recommend company', icon: '🗣️' }
  ];

  // Retention goals
  const goalOptions: OptionItem[] = [
    { id: 'retain-top-talent', label: 'Retain High Performers', description: 'Keep your best people engaged', icon: '⭐', recommended: true },
    { id: 'reduce-turnover-costs', label: 'Reduce Turnover Costs', description: 'Lower hiring and training expenses', icon: '💰', recommended: true },
    { id: 'improve-culture', label: 'Strengthen Team Culture', description: 'Build belonging and connection', icon: '🤝' },
    { id: 'career-pathing', label: 'Create Clear Career Paths', description: 'Show growth opportunities', icon: '🛤️' },
    { id: 'predictive-retention', label: 'Proactive Intervention', description: 'Address issues before they become problems', icon: '🔮' },
    { id: 'succession-planning', label: 'Build Succession Pipeline', description: 'Develop internal leadership', icon: '👥' },
    { id: 'knowledge-retention', label: 'Preserve Institutional Knowledge', description: 'Keep expertise within organization', icon: '🧠' },
    { id: 'competitive-advantage', label: 'Maintain Competitive Edge', description: 'Outperform industry retention rates', icon: '🚀' }
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
        color: 'border-l-orange-400',
        required: true
      },
      {
        id: 'risk-factors',
        label: 'Retention Risk Factors',
        value: selectedRisks.length > 0 ? `Key risk factors: ${selectedRisks.map(id => riskOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'data',
        color: 'border-l-red-400',
        required: false
      },
      {
        id: 'interventions',
        label: 'Intervention Strategies',
        value: selectedInterventions.length > 0 ? `Preferred interventions: ${selectedInterventions.map(id => interventionOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
        type: 'instruction',
        color: 'border-l-green-400',
        required: false
      },
      {
        id: 'goals',
        label: 'Retention Goals',
        value: selectedGoals.length > 0 ? `Strategic objectives: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}` : '',
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
        value: 'Create a comprehensive retention mastery strategy using Carmen\'s PREDICT-CONNECT-ELEVATE model: 1) Predictive AI analytics for early warning systems, 2) Human connection through genuine conversations, 3) Elevation through personalized growth opportunities. Include implementation roadmap, intervention protocols, and measurement systems.',
        type: 'format',
        color: 'border-l-gray-400',
        required: true
      }
    ];
    
    setPromptSegments(segments);
  }, [selectedRisks, selectedInterventions, selectedGoals, selectedMetrics]);

  const generateRetentionStrategy = async () => {
    if (selectedRisks.length === 0 || selectedInterventions.length === 0 || selectedGoals.length === 0) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'retention-mastery-strategy',
          topic: 'Advanced AI-powered retention with human approach',
          context: `Carmen Rodriguez needs to create advanced retention strategies that combine predictive AI insights with deeply human approaches to keeping best people engaged and growing.
          
          Retention Risk Factors: ${selectedRisks.map(id => riskOptions.find(opt => opt.id === id)?.label).join(', ')}
          Intervention Strategies: ${selectedInterventions.map(id => interventionOptions.find(opt => opt.id === id)?.label).join(', ')}
          Strategic Goals: ${selectedGoals.map(id => goalOptions.find(opt => opt.id === id)?.label).join(', ')}
          Success Metrics: ${selectedMetrics.map(id => metricsOptions.find(opt => opt.id === id)?.label).join(', ')}
          
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Carmen Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('carmen-retention-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-orange-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Retention Strategy Mastery
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Master advanced retention strategies that combine AI prediction with human connection
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Retention Crisis', desc: 'Losing star talent unexpectedly', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-retention-crisis.mp4', fallback: '😔' },
            { title: 'Predictive Mastery', desc: 'AI + empathy = retention success', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-predictive-retention.mp4', fallback: '🔮' },
            { title: 'Flourishing Teams', desc: 'People choose to stay and grow', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-retention-success.mp4', fallback: '🌟' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <VideoAnimation
                      src={getAnimationUrl(item.animation)}
                      fallbackIcon={<span className="text-3xl">{item.fallback}</span>}
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Retention Mastery Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
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
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Configuration */}
          <div className="space-y-6">
            {/* Risk Factors */}
            <VisualOptionGrid
              title="Retention Risk Factors"
              description="What warning signs do you want to predict and prevent?"
              options={riskOptions}
              selectedIds={selectedRisks}
              onSelectionChange={setSelectedRisks}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Intervention Strategies */}
            <VisualOptionGrid
              title="Intervention Strategies"
              description="How will you proactively address retention risks?"
              options={interventionOptions}
              selectedIds={selectedInterventions}
              onSelectionChange={setSelectedInterventions}
              multiSelect={true}
              maxSelections={4}
              gridCols={2}
              characterTheme="carmen"
            />

            {/* Retention Goals */}
            <VisualOptionGrid
              title="Strategic Retention Goals"
              description="What outcomes do you want to achieve?"
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
              description="How will you measure retention success?"
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
                  onClick={generateRetentionStrategy}
                  disabled={selectedRisks.length === 0 || selectedInterventions.length === 0 || selectedGoals.length === 0 || isGenerating}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-lg py-3"
                >
                  {isGenerating ? (
                    <>
                      <Shield className="w-5 h-5 mr-2 animate-pulse" />
                      Carmen is crafting your retention strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Advanced Retention Strategy
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

            {/* Generated Strategy */}
            {generatedStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Your Advanced Retention Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg max-h-96 overflow-y-auto">
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
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
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
      {/* Carmen's Character Guidance */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Carmen's Retention Mastery</h3>
              <p className="text-amber-700 text-sm">
                "True retention isn't about keeping people—it's about creating an environment where they choose to stay and flourish. Let's master this together."
              </p>
            </div>
          </div>
        </div>
      </div>

};

export default CarmenRetentionMastery;