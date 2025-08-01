import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Mail, Play, Zap, Eye, Brain, Target, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
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

interface SubjectLineStrategy {
  id: string;
  name: string;
  description: string;
  psychology: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
  openRate: string;
}

interface GeneratedSubjectLine {
  id: string;
  content: string;
  strategy: string;
  score: number;
  reasoning: string;
}

const MayaSubjectLineWorkshop: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [emailContext, setEmailContext] = useState('');
  const [generatedSubjectLines, setGeneratedSubjectLines] = useState<GeneratedSubjectLine[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testedStrategies, setTestedStrategies] = useState<string[]>([]);

  const subjectLineStrategies: SubjectLineStrategy[] = [
    {
      id: 'curiosity-gap',
      name: 'Curiosity Gap',
      description: 'Create intrigue without revealing everything',
      psychology: 'Leverages human need to fill information gaps',
      icon: Eye,
      examples: ['What Sarah discovered changed everything...', 'The one thing donors never expect', 'Behind the scenes: Why we almost quit'],
      openRate: '23-31%'
    },
    {
      id: 'urgency-scarcity',
      name: 'Urgency & Scarcity',
      description: 'Time-sensitive or limited opportunities',
      psychology: 'Fear of Missing Out (FOMO) drives immediate action',
      icon: Zap,
      examples: ['48 hours left to help Maria', 'Only 12 spots remaining', 'Final call: Winter shelter funding'],
      openRate: '18-25%'
    },
    {
      id: 'personalization',
      name: 'Personal Connection',
      description: 'Direct relevance to recipient interests',
      psychology: 'People prioritize personally relevant information',
      icon: Target,
      examples: ['Sarah, your impact this year...', 'For volunteers like you', 'Your neighborhood needs this'],
      openRate: '26-35%'
    },
    {
      id: 'social-proof',
      name: 'Social Proof',
      description: 'Show what others are doing/saying',
      psychology: 'We follow others\' behavior to validate our choices',
      icon: TrendingUp,
      examples: ['1,247 supporters already joined', 'Why Maria chose Hope Gardens', 'Community leaders recommend...'],
      openRate: '20-28%'
    },
    {
      id: 'benefit-focused',
      name: 'Benefit Promise',
      description: 'Clear value proposition upfront',
      psychology: 'People seek immediate value and benefit clarity',
      icon: Brain,
      examples: ['Cut your admin time by 60%', 'Free training: Grant writing mastery', 'Double your donor retention'],
      openRate: '15-22%'
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "You know what happened after I mastered difficult conversations?",
      emotion: 'excited' as const,
      showAvatar: true
    },
    {
      id: '2',
      content: "People started opening my emails! But not all of them.",
      emotion: 'hopeful' as const
    },
    {
      id: '3',
      content: "I realized the subject line was like the front door - if it's not inviting, no one comes in.",
      emotion: 'thoughtful' as const
    },
    {
      id: '4',
      content: "I was writing boring subjects like 'Monthly Update' and 'Important Information.'",
      emotion: 'frustrated' as const
    },
    {
      id: '5',
      content: "Then I learned about psychology principles and everything changed.",
      emotion: 'enlightened' as const
    },
    {
      id: '6',
      content: "Now my open rates went from 12% to 34%. Let me show you the strategies that work.",
      emotion: 'amazed' as const
    }
  ];

  const generateSubjectLines = async () => {
    if (!selectedStrategy || !emailContext.trim()) return;
    
    setIsGenerating(true);
    try {
      const strategy = subjectLineStrategies.find(s => s.id === selectedStrategy);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'subject-lines',
          topic: `${strategy?.name} subject lines`,
          context: `Maya Rodriguez needs to create compelling subject lines using the ${strategy?.name} strategy for this email context: "${emailContext}". Psychology principle: ${strategy?.psychology}. Generate 3 different subject lines with scores (1-10) and reasoning for each. Format as JSON array with: content, score, reasoning.`
        }
      });

      if (error) throw error;

      let newSubjectLines: GeneratedSubjectLine[];
      try {
        const parsed = JSON.parse(data.content);
        newSubjectLines = parsed.map((line: any, index: number) => ({
          id: `${selectedStrategy}-${Date.now()}-${index}`,
          content: line.content,
          strategy: strategy?.name || selectedStrategy,
          score: line.score || Math.floor(Math.random() * 3) + 7,
          reasoning: line.reasoning || 'Uses proven psychology principles'
        }));
      } catch {
        // Fallback if JSON parsing fails
        const lines = data.content.split('\n').filter(line => line.trim());
        newSubjectLines = lines.slice(0, 3).map((line, index) => ({
          id: `${selectedStrategy}-${Date.now()}-${index}`,
          content: line.replace(/^\d+\.?\s*/, '').trim(),
          strategy: strategy?.name || selectedStrategy,
          score: Math.floor(Math.random() * 3) + 7,
          reasoning: `Uses ${strategy?.psychology.toLowerCase()}`
        }));
      }

      setGeneratedSubjectLines([...generatedSubjectLines, ...newSubjectLines]);
      
      if (!testedStrategies.includes(selectedStrategy)) {
        setTestedStrategies([...testedStrategies, selectedStrategy]);
      }
      
      toast({
        title: "Subject Lines Generated!",
        description: `Maya created ${newSubjectLines.length} compelling subject lines using ${strategy?.name}.`,
      });
    } catch (error) {
      console.error('Error generating subject lines:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate subject lines. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copySubjectLine = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Subject Line Copied!",
        description: "Subject line copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy subject line.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Subject Line Mastery Achieved!",
      description: "You've learned Maya's psychology-driven approach to compelling subject lines!",
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
            src={getAnimationUrl('maya-creative-spark.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              ✉️
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Maya's Subject Line Workshop
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Craft compelling email openings that get opened and read
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Maya\'s Email Invisibility', desc: 'When important emails went unread', color: 'from-gray-500/10 to-gray-500/5', animation: 'maya-inbox-ignore.mp4', fallback: '📧' },
            { title: 'Psychology Principles', desc: 'Learn what makes people click', color: 'from-purple-500/10 to-purple-500/5', animation: 'maya-psychology-discovery.mp4', fallback: '🧠' },
            { title: 'Maya\'s Open Rate Success', desc: 'From 12% to 34% open rates', color: 'from-green-500/10 to-green-500/5', animation: 'maya-metrics-triumph.mp4', fallback: '📈' }
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
            Begin Maya's Subject Line Journey
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
        lessonTitle="Subject Line Workshop"
        characterName="Maya"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="maya-subjects-narrative"
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
        lessonTitle="Subject Line Workshop"
        characterName="Maya"
        progress={66 + (testedStrategies.length / 5) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (testedStrategies.length / 5) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Maya's Subject Line Workshop • {testedStrategies.length}/5 strategies tested</p>
            <Button variant="outline" onClick={() => navigate('/chapter/2')}>
              Back to Chapter 2
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Strategy Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Psychology-Driven Subject Lines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Psychology Strategy</label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a psychology principle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectLineStrategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        <div className="flex items-center gap-2">
                          <strategy.icon className="w-4 h-4" />
                          <span>{strategy.name}</span>
                          {testedStrategies.includes(strategy.id) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Strategy Details */}
              {selectedStrategy && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  {(() => {
                    const strategy = subjectLineStrategies.find(s => s.id === selectedStrategy);
                    return (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-blue-800">{strategy?.name}</h4>
                          <Badge className="bg-blue-100 text-blue-800">{strategy?.openRate} open rate</Badge>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">{strategy?.description}</p>
                        <p className="text-xs text-blue-600"><strong>Psychology:</strong> {strategy?.psychology}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-blue-800">Examples:</p>
                          <ul className="text-xs text-blue-600 list-disc ml-4">
                            {strategy?.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Email Context */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Context & Purpose</label>
                <Textarea
                  placeholder="Describe your email purpose, audience, and key message..."
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateSubjectLines}
                disabled={!selectedStrategy || !emailContext.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Maya is crafting subject lines...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Psychology-Based Subject Lines
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right Side - Generated Subject Lines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Maya's High-Converting Subject Lines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedSubjectLines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No subject lines created yet.</p>
                  <p className="text-sm">Choose a strategy and describe your email context!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedSubjectLines.map((subjectLine) => (
                    <div key={subjectLine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{subjectLine.strategy}</Badge>
                            <span className="text-sm font-semibold text-green-600">Score: {subjectLine.score}/10</span>
                          </div>
                          <p className="font-medium text-gray-900 cursor-pointer" onClick={() => copySubjectLine(subjectLine.content)}>
                            {subjectLine.content}
                          </p>
                        </div>
                        <Button 
                          onClick={() => copySubjectLine(subjectLine.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{subjectLine.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {testedStrategies.length >= 3 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Master Subject Line Psychology
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

export default MayaSubjectLineWorkshop;