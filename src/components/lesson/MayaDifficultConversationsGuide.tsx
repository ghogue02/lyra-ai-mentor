import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, MessageCircle, Play, Heart, Shield, Lightbulb, AlertTriangle, CheckCircle, Users } from 'lucide-react';
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

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'High' | 'Medium' | 'Low';
  context: string;
  examples: string[];
}

const MayaDifficultConversationsGuide: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [userMessage, setUserMessage] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const conversationScenarios: ConversationScenario[] = [
    {
      id: 'budget-cuts',
      title: 'Budget Cut Announcement',
      description: 'Communicating difficult financial decisions with transparency',
      icon: AlertTriangle,
      difficulty: 'High',
      context: 'Need to inform staff about program budget cuts while maintaining morale',
      examples: ['Staff layoffs', 'Program suspension', 'Salary freezes']
    },
    {
      id: 'donor-disappointment',
      title: 'Disappointed Major Donor',
      description: 'Addressing donor concerns while rebuilding trust',
      icon: Heart,
      difficulty: 'High',
      context: 'Major donor is upset about program outcomes and considering withdrawal',
      examples: ['Unmet expectations', 'Program delays', 'Transparency issues']
    },
    {
      id: 'volunteer-conflict',
      title: 'Volunteer Team Conflict',
      description: 'Mediating disputes while preserving relationships',
      icon: Users,
      difficulty: 'Medium',
      context: 'Long-term volunteers are in conflict over event planning approaches',
      examples: ['Personality clashes', 'Method disagreements', 'Leadership disputes']
    },
    {
      id: 'community-criticism',
      title: 'Public Community Criticism',
      description: 'Responding to negative feedback in public forums',
      icon: Shield,
      difficulty: 'Medium',
      context: 'Organization is facing criticism on social media about service delivery',
      examples: ['Social media backlash', 'Public complaints', 'Media scrutiny']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "After building my template library, I thought I had email communication solved.",
      emotion: 'hopeful' as const,
      showAvatar: true
    },
    {
      id: '2',
      content: "But then came the really hard conversations - the ones that no template could handle.",
      emotion: 'worried' as const
    },
    {
      id: '3',
      content: "Like when I had to tell our volunteers that their favorite program was being cut.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "Or when a major donor called me disappointed about our latest impact report.",
      emotion: 'anxious' as const
    },
    {
      id: '5',
      content: "I realized that difficult conversations aren't about perfect words - they're about authentic connection.",
      emotion: 'enlightened' as const
    },
    {
      id: '6',
      content: "Now I have a framework that turns these tough moments into opportunities for deeper trust.",
      emotion: 'excited' as const
    }
  ];

  const generateResponse = async () => {
    if (!selectedScenario || !userMessage.trim()) return;
    
    setIsGenerating(true);
    try {
      const scenario = conversationScenarios.find(s => s.id === selectedScenario);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'difficult-conversation',
          topic: `${scenario?.title} response`,
          context: `Maya Rodriguez needs to craft a thoughtful response for: ${scenario?.context}. User's message: "${userMessage}". Provide a compassionate, professional response that shows empathy while maintaining organizational integrity. Include Maya's warm tone and nonprofit experience.`
        }
      });

      if (error) throw error;

      setGeneratedResponse(data.content);
      
      if (!completedScenarios.includes(selectedScenario)) {
        setCompletedScenarios([...completedScenarios, selectedScenario]);
      }
      
      toast({
        title: "Response Generated!",
        description: `Maya crafted a thoughtful approach for this difficult conversation.`,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Difficult Conversations Mastered!",
      description: "You've learned Maya's framework for handling challenging communications!",
    });
    navigate('/chapter/2');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Maya Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('maya-empathetic-listening.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              💬
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Maya's Difficult Conversations Guide
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Handle challenging communications with empathy and skill
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Maya\'s Communication Crisis', desc: 'When tough conversations went wrong', color: 'from-red-500/10 to-red-500/5', animation: 'maya-conversation-struggle.mp4', fallback: '⚠️' },
            { title: 'Discover Empathy Framework', desc: 'Learn authentic connection principles', color: 'from-purple-500/10 to-purple-500/5', animation: 'maya-empathy-breakthrough.mp4', fallback: '💡' },
            { title: 'Maya\'s Trust Building', desc: 'Transform conflicts into connections', color: 'from-green-500/10 to-green-500/5', animation: 'maya-trust-success.mp4', fallback: '✓' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Maya's Conversation Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={2}
        chapterTitle="Maya's Communication Mastery"
        lessonTitle="Difficult Conversations Guide"
        characterName="Maya"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="maya-conversations-narrative"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={2}
        chapterTitle="Maya's Communication Mastery"
        lessonTitle="Difficult Conversations Guide"
        characterName="Maya"
        progress={66 + (completedScenarios.length / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (completedScenarios.length / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Maya's Conversation Workshop • {completedScenarios.length}/4 scenarios completed</p>
            <Button variant="outline" onClick={() => navigate('/chapter/2')}>
              Back to Chapter 2
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Scenario Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Difficult Conversation Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scenario Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose a Challenging Scenario</label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a conversation scenario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {conversationScenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <div className="flex items-center gap-2">
                          <scenario.icon className="w-4 h-4" />
                          <span>{scenario.title}</span>
                          {completedScenarios.includes(scenario.id) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scenario Details */}
              {selectedScenario && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  {(() => {
                    const scenario = conversationScenarios.find(s => s.id === selectedScenario);
                    return (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{scenario?.title}</h4>
                          <Badge variant={scenario?.difficulty === 'High' ? 'destructive' : scenario?.difficulty === 'Medium' ? 'secondary' : 'default'}>
                            {scenario?.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{scenario?.description}</p>
                        <p className="text-sm font-medium">Context: {scenario?.context}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Initial Message/Response</label>
                <Textarea
                  placeholder="Write how you would approach this difficult conversation..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateResponse}
                disabled={!selectedScenario || !userMessage.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2 animate-pulse" />
                    Maya is crafting the response...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Maya's Empathetic Response
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Maya's Empathetic Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!generatedResponse ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a scenario and share your approach.</p>
                  <p className="text-sm">Maya will show you how to handle it with empathy and skill.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        💬
                      </div>
                      <span className="font-semibold text-green-800">Maya's Approach</span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {generatedResponse}
                    </div>
                  </div>

                  {/* Framework Tips */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Maya's Framework</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Listen first:</strong> Understand their perspective</li>
                      <li>• <strong>Acknowledge feelings:</strong> Validate their emotions</li>
                      <li>• <strong>Share context:</strong> Provide necessary background</li>
                      <li>• <strong>Find solutions:</strong> Focus on moving forward together</li>
                      <li>• <strong>Follow up:</strong> Maintain the relationship</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {completedScenarios.length >= 2 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Master Difficult Conversations
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

export default MayaDifficultConversationsGuide;