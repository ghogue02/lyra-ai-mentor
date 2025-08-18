import React, { useState } from 'react';
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
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

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
  const [roleType, setRoleType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [hiringChallenges, setHiringChallenges] = useState('');
  const [diversityGoals, setDiversityGoals] = useState('');
  const [timeToHire, setTimeToHire] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateHiringStrategy = async () => {
    if (!roleType || !companySize.trim() || !hiringChallenges.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'compassionate-hiring-strategy',
          topic: 'AI-powered talent acquisition with human empathy',
          context: `Carmen Rodriguez needs to create a comprehensive hiring strategy using her compassionate AI approach.
          
          Role Type: ${roleType}
          Company Size: ${companySize}
          Current Challenges: ${hiringChallenges}
          Diversity Goals: ${diversityGoals || 'Not specified'}
          Target Time to Hire: ${timeToHire || 'Not specified'}
          
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Carmen Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('carmen-hiring-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-orange-600" />
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Carmen's Compassionate Hiring
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform talent acquisition through AI-powered empathy and bias-free processes
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Hiring Frustration', desc: 'Carmen\'s bias and inefficiency struggles', color: 'from-red-500/10 to-red-500/5', animation: 'carmen-hiring-struggle.mp4', fallback: '😤' },
            { title: 'AI-Empathy Framework', desc: 'Learn compassionate hiring system', color: 'from-orange-500/10 to-orange-500/5', animation: 'carmen-framework-discovery.mp4', fallback: '❤️' },
            { title: 'Hiring Transformation', desc: 'Witness diverse team success', color: 'from-green-500/10 to-green-500/5', animation: 'carmen-hiring-success.mp4', fallback: '🎉' }
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
            Begin Hiring Journey
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6"
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
            <Button variant="outline" onClick={() => navigate('/chapter/7')}>
              Back to Chapter 7
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Hiring Strategy Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                Compassionate Hiring Strategy Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Type */}
              <div>
                <Label htmlFor="role">Role Type</Label>
                <Select value={roleType} onValueChange={setRoleType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="What type of role are you hiring for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="program-manager">Program Manager</SelectItem>
                    <SelectItem value="software-engineer">Software Engineer</SelectItem>
                    <SelectItem value="marketing-coordinator">Marketing Coordinator</SelectItem>
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="communications-manager">Communications Manager</SelectItem>
                    <SelectItem value="operations-specialist">Operations Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Size */}
              <div>
                <Label htmlFor="size">Organization Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., 50-person nonprofit, 200-person startup, Fortune 500 company"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Hiring Challenges */}
              <div>
                <Label htmlFor="challenges">Current Hiring Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What problems are you facing? (e.g., lack of diversity, long time to hire, candidate experience issues)"
                  value={hiringChallenges}
                  onChange={(e) => setHiringChallenges(e.target.value)}
                  className="min-h-[80px] mt-2"
                />
              </div>

              {/* Diversity Goals */}
              <div>
                <Label htmlFor="diversity">Diversity & Inclusion Goals</Label>
                <Textarea
                  id="diversity"
                  placeholder="What are your diversity objectives? (optional)"
                  value={diversityGoals}
                  onChange={(e) => setDiversityGoals(e.target.value)}
                  className="min-h-[60px] mt-2"
                />
              </div>

              {/* Time to Hire */}
              <div>
                <Label htmlFor="time">Target Time to Hire</Label>
                <Select value={timeToHire} onValueChange={setTimeToHire}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How quickly do you need to hire?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="6-weeks">6 weeks</SelectItem>
                    <SelectItem value="2-months">2 months</SelectItem>
                    <SelectItem value="3-months">3+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateHiringStrategy}
                disabled={!roleType || !companySize.trim() || !hiringChallenges.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 animate-pulse" />
                    Carmen is crafting your strategy...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Create Compassionate Hiring Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Hiring Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Carmen's Compassionate Hiring Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hiringFrameworkElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-orange-200 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {index + 1}. {element.title}
                        </h4>
                      </div>
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
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Compassionate Hiring Strategy
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