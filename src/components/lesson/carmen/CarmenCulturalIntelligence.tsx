import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [companyDescription, setCompanyDescription] = useState('');
  const [culturalChallenges, setCulturalChallenges] = useState('');
  const [inclusionGoals, setInclusionGoals] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateCulturalStrategy = async () => {
    if (!companyDescription.trim() || !culturalChallenges.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'strategic_plan',
          topic: 'Cultural Intelligence and Inclusive Workplace Development',
          context: `Carmen Rodriguez needs to develop a comprehensive cultural intelligence strategy for creating an inclusive workplace.
          
          Company Description: ${companyDescription}
          Current Cultural Challenges: ${culturalChallenges}
          Inclusion Goals: ${inclusionGoals || 'Build a truly inclusive, culturally intelligent workplace where everyone thrives'}
          
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Carmen Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('carmen-cultural-discovery.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              🌍
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Cultural Intelligence Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Build inclusive workplace culture with AI-powered insights and cultural intelligence analytics
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Invisible Barriers', desc: 'Experience Carmen\'s culture awakening moment', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-cultural-discovery.mp4', fallback: '🚧' },
            { title: 'AI Culture Analytics', desc: 'Learn systematic cultural intelligence approach', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-ai-analytics.mp4', fallback: '🎯' },
            { title: 'Inclusive Culture Success', desc: 'Witness thriving diverse workplace transformation', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-culture-triumph.mp4', fallback: '🌟' }
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
            Begin Carmen's Cultural Journey
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
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
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Culture Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Cultural Intelligence Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Description */}
              <div>
                <Label htmlFor="company">Your Company Description</Label>
                <Textarea
                  id="company"
                  placeholder="Describe your company: industry, size, current diversity, team composition..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Cultural Challenges */}
              <div>
                <Label htmlFor="challenges">Current Cultural Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What specific inclusion or cultural issues is your workplace facing?"
                  value={culturalChallenges}
                  onChange={(e) => setCulturalChallenges(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Inclusion Goals */}
              <div>
                <Label htmlFor="goals">Inclusion Goals</Label>
                <Input
                  id="goals"
                  placeholder="What cultural transformation do you want to achieve?"
                  value={inclusionGoals}
                  onChange={(e) => setInclusionGoals(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateCulturalStrategy}
                disabled={!companyDescription.trim() || !culturalChallenges.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Carmen is building your culture strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Cultural Intelligence Strategy with Carmen's AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Cultural Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  Carmen's Cultural Intelligence Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {culturalElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-orange-200 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {index + 1}. {element.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{element.description}</p>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded italic">
                        "{element.example}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg">
                    <TemplateContentFormatter 
                      content={generatedStrategy}
                      contentType="general"
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