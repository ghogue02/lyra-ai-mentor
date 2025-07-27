import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Users, Play, Target, Presentation, MessageSquare, Heart } from 'lucide-react';
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

interface StakeholderType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  dataNeeds: string[];
  communicationStyle: string;
}

const DavidStakeholderCommunication: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('');
  const [communicationContext, setCommunicationContext] = useState('');
  const [stakeholderMessages, setStakeholderMessages] = useState<Array<{id: string, stakeholder: string, message: string, dataPoints: string}>>([]);
  const [isCreating, setIsCreating] = useState(false);

  const stakeholderTypes: StakeholderType[] = [
    {
      id: 'board-members',
      name: 'Board Members',
      description: 'Governance leaders focused on strategic oversight and fiduciary responsibility',
      icon: Target,
      dataNeeds: ['High-level impact metrics', 'Financial efficiency', 'Strategic progress', 'Risk indicators'],
      communicationStyle: 'Executive summaries with clear ROI and strategic implications'
    },
    {
      id: 'major-donors',
      name: 'Major Donors',
      description: 'Philanthropic partners seeking meaningful impact from their investments',
      icon: Heart,
      dataNeeds: ['Tangible impact stories', 'Personal connection', 'Outcome evidence', 'Future potential'],
      communicationStyle: 'Emotional narratives backed by concrete evidence of change'
    },
    {
      id: 'program-staff',
      name: 'Program Staff',
      description: 'Front-line team members implementing services and working with beneficiaries',
      icon: Users,
      dataNeeds: ['Operational metrics', 'Client outcomes', 'Process improvements', 'Resource needs'],
      communicationStyle: 'Actionable insights with practical applications for daily work'
    },
    {
      id: 'community-partners',
      name: 'Community Partners',
      description: 'Collaborative organizations and local stakeholders in shared initiatives',
      icon: MessageSquare,
      dataNeeds: ['Collaborative impact', 'Shared outcomes', 'Partnership value', 'Community benefit'],
      communicationStyle: 'Collaborative framing emphasizing mutual benefit and shared success'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Here's something I learned the hard way - one size does NOT fit all when it comes to data communication.",
      emotion: 'thoughtful' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "I used to present the same data dump to everyone - board members, donors, staff, partners.",
      emotion: 'embarrassed' as const
    },
    {
      id: '3',
      content: "The board glazed over at individual stories. Donors yawned at aggregate statistics. Staff felt overwhelmed by high-level summaries.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "Each stakeholder group has different needs, different languages, different attention spans.",
      emotion: 'understanding' as const
    },
    {
      id: '5',
      content: "Now I craft targeted data stories - strategic for the board, emotional for donors, actionable for staff.",
      emotion: 'confident' as const
    },
    {
      id: '6',
      content: "Same data, multiple stories. Same impact, different languages. Everyone gets what they need to stay engaged.",
      emotion: 'enlightened' as const
    }
  ];

  const createStakeholderMessage = async () => {
    if (!selectedStakeholder) return;
    
    setIsCreating(true);
    try {
      const stakeholder = stakeholderTypes.find(s => s.id === selectedStakeholder);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'david',
          contentType: 'stakeholder-communication',
          topic: `Data communication for ${stakeholder?.name}`,
          context: `David Chen needs to communicate nonprofit impact data to ${stakeholder?.name.toLowerCase()} at Riverside Children's Foundation. Create a message that addresses their specific needs: ${stakeholder?.dataNeeds.join(', ')}. Use ${stakeholder?.communicationStyle}.`
        }
      });

      if (error) throw error;

      const newMessage = {
        id: `message-${Date.now()}`,
        stakeholder: stakeholder?.name || 'Stakeholder',
        message: data.content?.message || `Tailored communication for ${stakeholder?.name.toLowerCase()} focusing on their specific data needs and preferred communication style.`,
        dataPoints: data.content?.dataPoints || `Key metrics: ${stakeholder?.dataNeeds.slice(0, 3).join(', ')}`
      };

      setStakeholderMessages([...stakeholderMessages, newMessage]);
      
      toast({
        title: "Message Created!",
        description: `David crafted a targeted message for ${stakeholder?.name.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Error creating message:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create stakeholder message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Stakeholder Communication Complete!",
      description: "You've mastered David's stakeholder communication strategies!",
    });
    navigate('/chapter/4');
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* David Avatar */}
        <div className="w-24 h-24 mx-auto mb-8">
          <VideoAnimation
            src={getAnimationUrl('david-stakeholder-presentation.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              👥
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          David's Stakeholder Communication Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Tailor data presentations to different audience needs and preferences
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'One-Size-Fits-All Failure', desc: 'Experience the disconnect of generic presentations', color: 'from-red-500/10 to-red-500/5', animation: 'david-generic-presentation.mp4', fallback: '😴' },
            { title: 'Audience Analysis', desc: 'Learn to understand stakeholder needs', color: 'from-blue-500/10 to-blue-500/5', animation: 'david-audience-discovery.mp4', fallback: '✨' },
            { title: 'Targeted Communication', desc: 'Master audience-specific data storytelling', color: 'from-green-500/10 to-green-500/5', animation: 'david-targeted-success.mp4', fallback: '🚀' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
          <Button 
            onClick={() => setCurrentPhase('narrative')}
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Begin Stakeholder Communication Journey
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNarrativePhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Stakeholder Communication Workshop"
        characterName="David"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="david-stakeholder-narrative"
          characterName="David"
        />
      </div>
    </motion.div>
  );

  const renderWorkshopPhase = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6"
    >
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Storytelling Mastery"
        lessonTitle="Stakeholder Communication Workshop"
        characterName="David"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">David's Stakeholder Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/4')}>
              Back to Chapter 4
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Message Creator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="w-5 h-5 text-blue-600" />
                Message Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stakeholder Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Stakeholder Audience</label>
                <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your audience..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stakeholderTypes.map((stakeholder) => (
                      <SelectItem key={stakeholder.id} value={stakeholder.id}>
                        <div className="flex items-center gap-2">
                          <stakeholder.icon className="w-4 h-4" />
                          {stakeholder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Stakeholder Details */}
              {selectedStakeholder && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  {(() => {
                    const selected = stakeholderTypes.find(s => s.id === selectedStakeholder);
                    return selected ? (
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{selected.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selected.description}</p>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-blue-600 mb-1">They need data about:</p>
                          <div className="flex flex-wrap gap-1">
                            {selected.dataNeeds.map((need, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{need}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 bg-white p-2 rounded">
                          <strong>Communication style:</strong> {selected.communicationStyle}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Create Button */}
              <Button 
                onClick={createStakeholderMessage}
                disabled={!selectedStakeholder || isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isCreating ? (
                  <>
                    <Users className="w-4 h-4 mr-2 animate-pulse" />
                    David is crafting message...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Create with David's Expertise
                  </>
                )}
              </Button>

              {/* Custom Context Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or describe your communication context</label>
                <Textarea
                  placeholder="Describe the specific situation, data you need to present, and what response you're hoping to achieve from this stakeholder group..."
                  value={communicationContext}
                  onChange={(e) => setCommunicationContext(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Message Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Your Message Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stakeholderMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Presentation className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages created yet.</p>
                  <p className="text-sm">Create your first targeted message!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stakeholderMessages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">{message.stakeholder}</h4>
                        <Badge variant="outline">Targeted</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong className="text-blue-800">Message:</strong> {message.message}
                        </div>
                        <div className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                          <strong className="text-green-800">Data Points:</strong> {message.dataPoints}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {stakeholderMessages.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Stakeholder Communication Workshop
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

export default DavidStakeholderCommunication;