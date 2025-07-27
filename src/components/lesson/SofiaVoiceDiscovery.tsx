import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, Mic, Users, Heart, Volume2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VideoAnimation from '@/components/ui/VideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';

type Phase = 'intro' | 'narrative' | 'workshop';

interface VoiceAttribute {
  id: string;
  name: string;
  description: string;
  examples: string[];
  opposite: string;
}

const SofiaVoiceDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [values, setValues] = useState('');
  const [audienceType, setAudienceType] = useState('');
  const [generatedVoice, setGeneratedVoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const voiceAttributes: VoiceAttribute[] = [
    {
      id: 'warmth',
      name: 'Warmth',
      description: 'Compassionate and approachable tone',
      examples: ['We understand...', 'Together we can...', 'Your story matters...'],
      opposite: 'Clinical/Cold'
    },
    {
      id: 'authenticity',
      name: 'Authenticity',
      description: 'Genuine and honest communication',
      examples: ['Here\'s the truth...', 'I won\'t sugarcoat this...', 'From my heart...'],
      opposite: 'Scripted/Artificial'
    },
    {
      id: 'empowerment',
      name: 'Empowerment',
      description: 'Inspiring confidence and action',
      examples: ['You have the power to...', 'Your voice can change...', 'You\'re not alone in...'],
      opposite: 'Disempowering/Helpless'
    },
    {
      id: 'clarity',
      name: 'Clarity',
      description: 'Clear and accessible language',
      examples: ['Simply put...', 'Here\'s what this means...', 'In plain terms...'],
      opposite: 'Confusing/Jargon-heavy'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After my mission story breakthrough, something amazing happened...",
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Board members started asking me to speak at other events. Donors wanted to hear more. But I realized something crucial...",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "I had found my story, but I hadn't found my voice. I was still mimicking other speakers, using their words, their style.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "One day, a community member said, 'Sofia, when you talk about families like mine, it feels different. Real. Like you truly understand.'",
      emotion: 'enlightened' as const
    },
    {
      id: '5',
      content: "That's when I realized - my authentic voice wasn't something I needed to create. It was something I needed to discover.",
      emotion: 'hopeful' as const
    },
    {
      id: '6',
      content: "My voice came from my values, my experiences, my genuine care for our community. It was uniquely mine.",
      emotion: 'confident' as const
    },
    {
      id: '7',
      content: "Now when I speak, I don't try to sound like anyone else. I sound like Sofia - and that's exactly what people need to hear.",
      emotion: 'empowered' as const
    }
  ];

  const generateVoiceProfile = async () => {
    if (!communicationStyle.trim() || !values.trim()) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'voice-discovery',
          topic: 'Authentic voice development and discovery',
          context: `Sofia Martinez needs to help discover an authentic communication voice. 
          
          Current Communication Style: ${communicationStyle}
          Core Values: ${values}
          Primary Audience: ${audienceType || 'Community members and supporters'}
          
          Create a comprehensive voice profile that includes: 1) Authentic voice attributes based on their values and style, 2) Specific language patterns and phrases they should use, 3) What makes their voice unique and compelling, 4) Practical examples of how to apply this voice in different situations. Focus on helping them discover their natural voice rather than creating an artificial persona.`
        }
      });

      if (error) throw error;

      setGeneratedVoice(data.content);
      
      toast({
        title: "Voice Profile Created!",
        description: "Sofia helped you discover your authentic communication voice.",
      });
    } catch (error) {
      console.error('Error generating voice profile:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate voice profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Voice Discovery Complete!",
      description: "You've mastered Sofia's authentic voice discovery process!",
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
            src={getAnimationUrl('sofia-voice-discovery.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
              🎤
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sofia's Voice Discovery
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Discover your authentic communication voice that resonates with your audience
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Voice Searching', desc: 'Sofia\'s struggle to find her authentic voice', color: 'from-orange-500/10 to-orange-500/5', animation: 'sofia-voice-search.mp4', fallback: '🔍' },
            { title: 'Authentic Discovery', desc: 'Learn voice discovery methodology', color: 'from-purple-500/10 to-purple-500/5', animation: 'sofia-voice-discovery.mp4', fallback: '✨' },
            { title: 'Voice Mastery', desc: 'Witness authentic voice transformation', color: 'from-green-500/10 to-green-500/5', animation: 'sofia-voice-triumph.mp4', fallback: '🎯' }
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
            Begin Voice Discovery Journey
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
        lessonTitle="Voice Discovery"
        characterName="Sofia"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="sofia-voice-narrative"
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
        lessonTitle="Voice Discovery"
        characterName="Sofia"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sofia's Voice Discovery Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/3')}>
              Back to Chapter 3
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Voice Discovery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-rose-600" />
                Voice Discovery Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Communication Style */}
              <div>
                <label className="block text-sm font-medium mb-2">How do you naturally communicate?</label>
                <Textarea
                  placeholder="Describe your natural speaking/writing style. Are you formal or casual? Direct or gentle? Passionate or measured?"
                  value={communicationStyle}
                  onChange={(e) => setCommunicationStyle(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Core Values */}
              <div>
                <label className="block text-sm font-medium mb-2">What are your core values?</label>
                <Textarea
                  placeholder="What do you deeply care about? What drives your work? What principles guide your decisions?"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Audience Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Primary Audience</label>
                <Select value={audienceType} onValueChange={setAudienceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who do you communicate with most?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community-members">Community Members</SelectItem>
                    <SelectItem value="donors-supporters">Donors & Supporters</SelectItem>
                    <SelectItem value="volunteers">Volunteers</SelectItem>
                    <SelectItem value="board-leadership">Board & Leadership</SelectItem>
                    <SelectItem value="partner-organizations">Partner Organizations</SelectItem>
                    <SelectItem value="general-public">General Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateVoiceProfile}
                disabled={!communicationStyle.trim() || !values.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Sofia is discovering your voice...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Discover My Authentic Voice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Voice Attributes & Result */}
          <div className="space-y-6">
            {/* Voice Attributes Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  Sofia's Voice Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {voiceAttributes.map((attribute) => (
                    <div key={attribute.id} className="border-l-4 border-rose-200 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{attribute.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{attribute.description}</p>
                      <div className="text-xs text-gray-500">
                        <div className="mb-1">
                          <strong>Examples:</strong> {attribute.examples.join(', ')}
                        </div>
                        <div>
                          <strong>Opposite:</strong> {attribute.opposite}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generated Voice Profile */}
            {generatedVoice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-600" />
                    Your Authentic Voice Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {generatedVoice}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completion Button */}
        {generatedVoice && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Voice Discovery Workshop
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

export default SofiaVoiceDiscovery;