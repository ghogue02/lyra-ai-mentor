import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, MessageSquare, Heart, Users, Target, Lightbulb } from 'lucide-react';
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

type Phase = 'intro' | 'narrative' | 'workshop';

interface MissionStoryElement {
  id: string;
  type: 'problem' | 'solution' | 'impact' | 'call-to-action';
  title: string;
  description: string;
  example: string;
}

const SofiaMissionStoryCreator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [missionDescription, setMissionDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [invisibleCrisis, setInvisibleCrisis] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const storyElements: MissionStoryElement[] = [
    {
      id: 'problem',
      type: 'problem',
      title: 'The Invisible Crisis',
      description: 'Reveal the hidden challenge your organization addresses',
      example: 'Behind closed doors in our community, immigrant families struggle with language barriers that leave them isolated and unable to access essential services.'
    },
    {
      id: 'solution',
      type: 'solution',
      title: 'Your Unique Solution',
      description: 'Show how your organization creates change',
      example: 'Hope Gardens Community Center bridges this gap with culturally sensitive programs that meet families where they are, building confidence alongside language skills.'
    },
    {
      id: 'impact',
      type: 'impact',
      title: 'Transformative Impact',
      description: 'Paint a picture of the change you create',
      example: 'Last month, Maria successfully advocated for her son at a parent-teacher conference - something unimaginable six months ago when she could barely ask for help.'
    },
    {
      id: 'call-to-action',
      type: 'call-to-action',
      title: 'Join the Mission',
      description: 'Invite others to be part of the solution',
      example: 'Every $50 donation sponsors one family\'s journey from isolation to empowerment. Will you help us turn invisible struggles into visible success stories?'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "I used to struggle with a painful truth about our work at Hope Gardens...",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Our mission felt invisible. People would ask what we do, and I'd stumble through explanations about 'serving immigrant families.'",
      emotion: 'frustrated' as const
    },
    {
      id: '3',
      content: "They'd nod politely, but I could see in their eyes - they didn't really understand the silent crisis we were addressing.",
      emotion: 'disappointed' as const
    },
    {
      id: '4',
      content: "Then I learned the power of making the invisible visible through storytelling.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "Instead of talking about 'services,' I started sharing Maria's story - how she went from afraid to ask for help to confidently advocating for her son.",
      emotion: 'enlightened' as const
    },
    {
      id: '6',
      content: "Suddenly, people got it. They could see the crisis, feel the impact, and understand how they could help.",
      emotion: 'hopeful' as const
    },
    {
      id: '7',
      content: "Now our funding has increased 40% because people truly understand what we do. Let me show you how to craft your own mission story.",
      emotion: 'excited' as const
    }
  ];

  const generateMissionStory = async () => {
    if (!missionDescription.trim() || !invisibleCrisis.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'article',
          topic: 'Transforming invisible mission into compelling story',
          context: `Sofia Martinez at Hope Gardens Community Center needs to transform her organization's mission into a compelling story. 
          
          Mission: ${missionDescription}
          Target Audience: ${targetAudience || 'Community members and potential supporters'}
          Invisible Crisis: ${invisibleCrisis}
          
          Create a compelling narrative that follows Sofia's storytelling framework: 1) Reveal the invisible crisis, 2) Show the unique solution, 3) Paint the transformative impact, 4) Invite people to join the mission. Use concrete examples and emotional language that makes the invisible visible.`
        }
      });

      if (error) throw error;

      setGeneratedStory(data.content);
      
      toast({
        title: "Mission Story Created!",
        description: "Sofia helped transform your invisible mission into a compelling story.",
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Mission Story Complete!",
      description: "You've mastered Sofia's mission storytelling approach!",
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
            src={getAnimationUrl('sofia-mission-struggle.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
              💫
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sofia's Mission Story Creator
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Transform your invisible mission into a compelling story that inspires action
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'The Invisible Crisis', desc: 'Experience Sofia\'s struggle with mission clarity', color: 'from-red-500/10 to-red-500/5', animation: 'sofia-mission-struggle.mp4', fallback: '🔍' },
            { title: 'Story Framework Discovery', desc: 'Learn systematic storytelling approach', color: 'from-purple-500/10 to-purple-500/5', animation: 'sofia-story-discovery.mp4', fallback: '✨' },
            { title: 'Mission Story Success', desc: 'Witness compelling story transformation', color: 'from-green-500/10 to-green-500/5', animation: 'sofia-impact-triumph.mp4', fallback: '🚀' }
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
            Begin Sofia's Story Journey
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
        lessonTitle="Mission Story Creator"
        characterName="Sofia"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="sofia-mission-narrative"
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
        lessonTitle="Mission Story Creator"
        characterName="Sofia"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sofia's Mission Story Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/3')}>
              Back to Chapter 3
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Story Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                Mission Story Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mission Description */}
              <div>
                <Label htmlFor="mission">Your Organization's Mission</Label>
                <Textarea
                  id="mission"
                  placeholder="Describe what your organization does and who you serve..."
                  value={missionDescription}
                  onChange={(e) => setMissionDescription(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="Who needs to understand your mission? (e.g., donors, volunteers, community)"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Invisible Crisis */}
              <div>
                <Label htmlFor="crisis">The Invisible Crisis</Label>
                <Textarea
                  id="crisis"
                  placeholder="What hidden problem does your organization address that people don't see or understand?"
                  value={invisibleCrisis}
                  onChange={(e) => setInvisibleCrisis(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateMissionStory}
                disabled={!missionDescription.trim() || !invisibleCrisis.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Sofia is crafting your story...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Mission Story with Sofia's AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Story Framework & Result */}
          <div className="space-y-6">
            {/* Story Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  Sofia's Story Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storyElements.map((element, index) => (
                    <div key={element.id} className="border-l-4 border-rose-200 pl-4">
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

            {/* Generated Story */}
            {generatedStory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Your Mission Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {generatedStory}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedStory && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Mission Story Workshop
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

export default SofiaMissionStoryCreator;