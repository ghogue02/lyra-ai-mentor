import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Rocket, Target, Network, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';

type Phase = 'intro' | 'narrative' | 'workshop';

interface ScalingChannel {
  id: string;
  name: string;
  description: string;
  examples: string[];
  impact: string;
}

const SofiaImpactScaling: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSuccess, setCurrentSuccess] = useState('');
  const [scalingGoals, setScalingGoals] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [resourceConstraints, setResourceConstraints] = useState('');
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const scalingChannels: ScalingChannel[] = [
    {
      id: 'internal-communications',
      name: 'Internal Communications',
      description: 'Scale impact through team and organizational messaging',
      examples: ['Staff newsletters', 'Board presentations', 'Internal training materials'],
      impact: 'Aligned team amplifies your message consistently'
    },
    {
      id: 'donor-communications',
      name: 'Donor & Supporter Outreach',
      description: 'Expand reach to funding and support networks',
      examples: ['Grant applications', 'Donor newsletters', 'Thank you campaigns'],
      impact: 'Increased funding and volunteer engagement'
    },
    {
      id: 'community-engagement',
      name: 'Community Engagement',
      description: 'Connect directly with the people you serve',
      examples: ['Community forums', 'Outreach events', 'Social media engagement'],
      impact: 'Stronger community trust and participation'
    },
    {
      id: 'partnerships-collaborations',
      name: 'Partnerships & Collaborations',
      description: 'Leverage other organizations for broader reach',
      examples: ['Joint initiatives', 'Collaborative proposals', 'Network events'],
      impact: 'Multiplied impact through shared resources'
    },
    {
      id: 'public-speaking',
      name: 'Public Speaking & Events',
      description: 'Share your story at conferences and gatherings',
      examples: ['Conference presentations', 'Panel discussions', 'Workshop facilitation'],
      impact: 'Thought leadership and sector influence'
    },
    {
      id: 'digital-presence',
      name: 'Digital Presence',
      description: 'Build online platforms for story sharing',
      examples: ['Website content', 'Social media strategy', 'Online campaigns'],
      impact: 'Scalable reach with consistent messaging'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Six months after my board presentation success, something incredible happened...",
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Other nonprofit leaders started asking me to speak at their events, share my approach, even mentor their teams.",
      emotion: 'surprised' as const
    },
    {
      id: '3',
      content: "I realized my storytelling breakthrough wasn't just about one presentation - it was a system I could scale across all my communications.",
      emotion: 'enlightened' as const
    },
    {
      id: '4',
      content: "But scaling impact isn't just about doing more of the same. It's about strategically choosing where your story can create the biggest ripple effects.",
      emotion: 'thoughtful' as const
    },
    {
      id: '5',
      content: "I mapped out six key channels where my refined storytelling could multiply our organization's impact.",
      emotion: 'confident' as const
    },
    {
      id: '6',
      content: "Within a year, our funding increased 60%, volunteer applications tripled, and we formed partnerships with 8 new organizations.",
      emotion: 'triumphant' as const
    },
    {
      id: '7',
      content: "The secret wasn't working harder - it was working systematically to scale my storytelling success across multiple channels.",
      emotion: 'wise' as const
    },
    {
      id: '8',
      content: "Now I'll show you how to create your own impact scaling system that amplifies your success across your entire organization.",
      emotion: 'empowered' as const
    }
  ];

  const generateScalingStrategy = async () => {
    if (!currentSuccess.trim() || !scalingGoals.trim() || selectedChannels.length === 0) return;
    
    setIsGenerating(true);
    try {
      const selectedChannelDetails = scalingChannels.filter(channel => 
        selectedChannels.includes(channel.id)
      );

      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'impact-scaling-strategy',
          topic: 'Systematic approach to scaling storytelling success',
          context: `Sofia Martinez needs to create a comprehensive impact scaling strategy.
          
          Current Success: ${currentSuccess}
          Scaling Goals: ${scalingGoals}
          Selected Channels: ${selectedChannelDetails.map(c => c.name).join(', ')}
          Resource Constraints: ${resourceConstraints || 'No specific constraints mentioned'}
          
          Create a systematic scaling strategy that includes: 1) How to adapt the current success for each selected channel, 2) Specific action steps and timelines, 3) Resource allocation and efficiency tips, 4) Success metrics and tracking methods, 5) How to maintain consistency while customizing for different audiences. The strategy should be practical and implementable with clear priorities and phases.`
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Scaling Strategy Created!",
        description: "Sofia designed your comprehensive impact scaling plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate scaling strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleComplete = () => {
    toast({
      title: "Impact Scaling Complete!",
      description: "You've mastered Sofia's systematic approach to scaling storytelling impact!",
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
            src={getAnimationUrl('sofia-scaling-success.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
              🚀
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sofia's Impact Scaling System
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Scale your storytelling success across all communications for multiplied impact
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Success Recognition', desc: 'Sofia discovers her breakthrough can scale', color: 'from-blue-500/10 to-blue-500/5', animation: 'sofia-scaling-realization.mp4', fallback: '💡' },
            { title: 'Strategic Mapping', desc: 'Learn systematic scaling methodology', color: 'from-purple-500/10 to-purple-500/5', animation: 'sofia-strategy-mapping.mp4', fallback: '🗺️' },
            { title: 'Multiplied Impact', desc: 'Witness exponential influence growth', color: 'from-green-500/10 to-green-500/5', animation: 'sofia-impact-explosion.mp4', fallback: '🌟' }
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
            Begin Impact Scaling Journey
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
        lessonTitle="Impact Scaling System"
        characterName="Sofia"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="sofia-scaling-narrative"
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
        lessonTitle="Impact Scaling System"
        characterName="Sofia"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sofia's Impact Scaling Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/3')}>
              Back to Chapter 3
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Scaling Strategy Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-rose-600" />
                Impact Scaling Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Success */}
              <div>
                <Label htmlFor="success">Your Current Success</Label>
                <Textarea
                  id="success"
                  placeholder="Describe a recent storytelling success you want to scale (e.g., board presentation that secured funding, donor event that increased donations, etc.)"
                  value={currentSuccess}
                  onChange={(e) => setCurrentSuccess(e.target.value)}
                  className="min-h-[100px] mt-2"
                />
              </div>

              {/* Scaling Goals */}
              <div>
                <Label htmlFor="goals">Scaling Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What impact do you want to achieve by scaling this success? (e.g., increase funding by 50%, recruit 20 new volunteers, form 5 new partnerships)"
                  value={scalingGoals}
                  onChange={(e) => setScalingGoals(e.target.value)}
                  className="min-h-[80px] mt-2"
                />
              </div>

              {/* Resource Constraints */}
              <div>
                <Label htmlFor="constraints">Resource Constraints</Label>
                <Textarea
                  id="constraints"
                  placeholder="What limitations do you have? (e.g., limited time, small team, budget constraints) - Optional"
                  value={resourceConstraints}
                  onChange={(e) => setResourceConstraints(e.target.value)}
                  className="min-h-[60px] mt-2"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateScalingStrategy}
                disabled={!currentSuccess.trim() || !scalingGoals.trim() || selectedChannels.length === 0 || isGenerating}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Sofia is designing your scaling strategy...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Create Impact Scaling Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Scaling Channels & Result */}
          <div className="space-y-6">
            {/* Scaling Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  Sofia's Scaling Channels
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Select the channels where you want to scale your success:
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalingChannels.map((channel) => (
                    <div key={channel.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={channel.id}
                          checked={selectedChannels.includes(channel.id)}
                          onCheckedChange={() => handleChannelToggle(channel.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={channel.id} className="font-semibold text-gray-900 cursor-pointer">
                            {channel.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            <div className="mb-1">
                              <strong>Examples:</strong> {channel.examples.join(', ')}
                            </div>
                            <div className="text-green-600">
                              <strong>Impact:</strong> {channel.impact}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Selected: {selectedChannels.length} of {scalingChannels.length} channels
                </div>
              </CardContent>
            </Card>

            {/* Generated Strategy */}
            {generatedStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Your Impact Scaling Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {generatedStrategy}
                    </div>
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
              Complete Impact Scaling Workshop
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

export default SofiaImpactScaling;