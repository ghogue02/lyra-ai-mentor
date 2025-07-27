import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Presentation, Target, Zap, TrendingUp, Clock } from 'lucide-react';
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

type Phase = 'intro' | 'narrative' | 'workshop';

interface PresentationElement {
  id: string;
  title: string;
  description: string;
  timeAllocation: string;
  example: string;
}

const SofiaStoryBreakthrough: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [presentationType, setPresentationType] = useState('');
  const [audience, setAudience] = useState('');
  const [objectives, setObjectives] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [generatedPresentation, setGeneratedPresentation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const presentationElements: PresentationElement[] = [
    {
      id: 'hook',
      title: 'Compelling Hook',
      description: 'Open with a story that immediately captures attention',
      timeAllocation: '10% of total time',
      example: '"Three months ago, Maria sat in this same boardroom, too afraid to speak. Today, she\'s leading a community advocacy group of 50 families."'
    },
    {
      id: 'problem',
      title: 'Problem Definition',
      description: 'Make the invisible crisis visible and urgent',
      timeAllocation: '20% of total time',
      example: 'Paint the picture of barriers faced by immigrant families - language, cultural navigation, system complexity that creates isolation.'
    },
    {
      id: 'solution',
      title: 'Solution Showcase',
      description: 'Present your unique approach with concrete evidence',
      timeAllocation: '30% of total time',
      example: 'Our culturally responsive programs with bilingual advocates who understand the journey because they\'ve lived it.'
    },
    {
      id: 'impact',
      title: 'Impact Stories',
      description: 'Share transformation stories with specific data',
      timeAllocation: '25% of total time',
      example: '85% of families in our program report increased confidence in accessing services. Maria\'s story represents 200+ similar transformations.'
    },
    {
      id: 'call-to-action',
      title: 'Clear Call to Action',
      description: 'Specific, actionable next steps for your audience',
      timeAllocation: '15% of total time',
      example: 'We need 3 board members to champion our expansion proposal. Who will help us transform 500 more families this year?'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "The quarterly board meeting was in three days, and I had 15 minutes to secure funding for our expansion.",
      emotion: 'anxious' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I had all the data, the impact stories, the budget breakdown. But I knew data doesn't move people - stories do.",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "The problem was, I had dozens of powerful stories but only 15 minutes. How do you create breakthrough moments in high-stakes situations?",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "That's when I discovered the Story Breakthrough Framework - a systematic way to craft presentations that create decisive moments.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "I opened with Maria's transformation story, painted the invisible crisis, showcased our unique solution, and shared concrete impact data.",
      emotion: 'confident' as const
    },
    {
      id: '6',
      content: "Then I made a specific ask: 'We need 3 board champions for our expansion. The question isn't if we should help 500 more families - it's how fast we can start.'",
      emotion: 'empowered' as const
    },
    {
      id: '7',
      content: "The room went silent. Then the board chair said, 'I'll be your first champion.' Two more hands went up immediately.",
      emotion: 'triumphant' as const
    },
    {
      id: '8',
      content: "We got full funding approval that day. Now let me show you how to create your own story breakthrough moments.",
      emotion: 'excited' as const
    }
  ];

  const generatePresentation = async () => {
    if (!presentationType || !audience.trim() || !objectives.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'story-breakthrough-presentation',
          topic: 'High-stakes presentation with story breakthrough framework',
          context: `Sofia Martinez needs to create a compelling presentation using her Story Breakthrough Framework.
          
          Presentation Type: ${presentationType}
          Audience: ${audience}
          Objectives: ${objectives}
          Time Limit: ${timeLimit || 'No specific limit mentioned'}
          Key Message: ${keyMessage || 'Not specified'}
          
          Create a structured presentation that follows Sofia's breakthrough framework: 1) Compelling Hook (story-driven opening), 2) Problem Definition (make invisible visible), 3) Solution Showcase (unique approach with evidence), 4) Impact Stories (transformation with data), 5) Clear Call to Action (specific next steps). The presentation should be designed for high-stakes situations where decisions need to be made and action needs to be taken.`
        }
      });

      if (error) throw error;

      setGeneratedPresentation(data.content);
      
      toast({
        title: "Presentation Created!",
        description: "Sofia crafted your story breakthrough presentation.",
      });
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate presentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Story Breakthrough Complete!",
      description: "You've mastered Sofia's high-stakes presentation framework!",
    });
    navigate('/chapter/3');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Sofia Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('sofia-presentation-prep.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
              🎯
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sofia's Story Breakthrough
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create presentations that drive decisions and inspire action in high-stakes moments
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'High-Stakes Pressure', desc: 'Sofia\'s board presentation challenge', color: 'from-red-500/10 to-red-500/5', animation: 'sofia-presentation-pressure.mp4', fallback: '⏰' },
            { title: 'Breakthrough Framework', desc: 'Learn systematic presentation structure', color: 'from-purple-500/10 to-purple-500/5', animation: 'sofia-framework-discovery.mp4', fallback: '🎯' },
            { title: 'Presentation Triumph', desc: 'Witness decisive moment success', color: 'from-green-500/10 to-green-500/5', animation: 'sofia-presentation-success.mp4', fallback: '🚀' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-purple-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Breakthrough Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={3}
        chapterTitle="Sofia's Storytelling Mastery"
        lessonTitle="Story Breakthrough"
        characterName="Sofia"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="sofia-breakthrough-narrative"
          characterName="Sofia"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={3}
        chapterTitle="Sofia's Storytelling Mastery"
        lessonTitle="Story Breakthrough"
        characterName="Sofia"
        progress={66 + (currentStep / 5) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 5) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sofia's Story Breakthrough Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/3')}>
              Back to Chapter 3
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Presentation Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-rose-600" />
                Breakthrough Presentation Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Presentation Type */}
              <div>
                <Label htmlFor="type">Presentation Type</Label>
                <Select value={presentationType} onValueChange={setPresentationType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="What type of presentation?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="board-presentation">Board Presentation</SelectItem>
                    <SelectItem value="funding-pitch">Funding Pitch</SelectItem>
                    <SelectItem value="conference-keynote">Conference Keynote</SelectItem>
                    <SelectItem value="donor-event">Donor Event Speech</SelectItem>
                    <SelectItem value="community-meeting">Community Meeting</SelectItem>
                    <SelectItem value="stakeholder-update">Stakeholder Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audience */}
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="Who will be in the room? (e.g., board members, potential donors, community leaders)"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Objectives */}
              <div>
                <Label htmlFor="objectives">Presentation Objectives</Label>
                <Textarea
                  id="objectives"
                  placeholder="What specific outcomes do you want? (e.g., secure funding approval, gain 3 new volunteers, get board buy-in)"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  className="min-h-[80px] mt-2"
                />
              </div>

              {/* Time Limit */}
              <div>
                <Label htmlFor="time">Time Limit</Label>
                <Select value={timeLimit} onValueChange={setTimeLimit}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How much time do you have?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-minutes">5 minutes</SelectItem>
                    <SelectItem value="10-minutes">10 minutes</SelectItem>
                    <SelectItem value="15-minutes">15 minutes</SelectItem>
                    <SelectItem value="20-minutes">20 minutes</SelectItem>
                    <SelectItem value="30-minutes">30 minutes</SelectItem>
                    <SelectItem value="45-minutes">45 minutes</SelectItem>
                    <SelectItem value="60-minutes">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Key Message */}
              <div>
                <Label htmlFor="message">Key Message</Label>
                <Textarea
                  id="message"
                  placeholder="What's the one thing you want them to remember? (optional)"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  className="min-h-[60px] mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generatePresentation}
                disabled={!presentationType || !audience.trim() || !objectives.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Sofia is crafting your breakthrough...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Breakthrough Presentation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Framework & Result */}
          <div className="space-y-6">
            {/* Breakthrough Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Sofia's Breakthrough Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {presentationElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-rose-200 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {index + 1}. {element.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {element.timeAllocation}
                        </div>
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

            {/* Generated Presentation */}
            {generatedPresentation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Breakthrough Presentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {generatedPresentation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedPresentation && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Story Breakthrough Workshop
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

export default SofiaStoryBreakthrough;