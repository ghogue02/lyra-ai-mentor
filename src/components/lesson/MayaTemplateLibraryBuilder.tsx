import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Sparkles, Play, FileText, Copy, Save, Users, Heart, Mail } from 'lucide-react';
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

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
}

const MayaTemplateLibraryBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [templateDraft, setTemplateDraft] = useState('');
  const [generatedTemplates, setGeneratedTemplates] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const templateCategories: TemplateCategory[] = [
    {
      id: 'donor-thankyou',
      name: 'Donor Thank You',
      description: 'Express genuine gratitude and show impact',
      icon: Heart,
      examples: ['First-time donor welcome', 'Major gift acknowledgment', 'Recurring donor appreciation']
    },
    {
      id: 'volunteer-recruitment',
      name: 'Volunteer Recruitment',
      description: 'Inspire community members to get involved',
      icon: Users,
      examples: ['Event volunteers needed', 'Ongoing program help', 'Skill-based volunteering']
    },
    {
      id: 'program-updates',
      name: 'Program Updates',
      description: 'Keep stakeholders informed about progress',
      icon: FileText,
      examples: ['Monthly program report', 'Milestone achievements', 'Impact stories']
    },
    {
      id: 'crisis-communication',
      name: 'Crisis Communication',
      description: 'Handle urgent situations with transparency',
      icon: Mail,
      examples: ['Service disruption notice', 'Emergency response update', 'Transparency report']
    }
  ];

  const narrativeMessages = [
    {
      id: '1',
      content: "Remember how I was struggling with email overwhelm?",
      emotion: 'frustrated' as const,
      showAvatar: true
    },
    {
      id: '2', 
      content: "Well, after mastering the PACE framework, I realized I was still reinventing the wheel every day.",
      emotion: 'thoughtful' as const
    },
    {
      id: '3',
      content: "I was writing similar emails from scratch - donor thank-yous, volunteer updates, program announcements.",
      emotion: 'frustrated' as const
    },
    {
      id: '4',
      content: "That's when I discovered the power of smart templates with AI assistance.",
      emotion: 'excited' as const
    },
    {
      id: '5',
      content: "Now I have a library of 15 templates that handle 80% of my communications.",
      emotion: 'hopeful' as const
    },
    {
      id: '6',
      content: "What used to take 4 hours now takes 45 minutes. Let me show you how I built it.",
      emotion: 'enlightened' as const
    }
  ];

  const generateTemplate = async () => {
    if (!selectedCategory) return;
    
    setIsGenerating(true);
    try {
      const category = templateCategories.find(c => c.id === selectedCategory);
      
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'maya',
          contentType: 'email-template',
          topic: `${category?.name} template for nonprofit organization`,
          context: `Maya Rodriguez at Hope Gardens Community Center needs a professional ${category?.name.toLowerCase()} email template. Include merge fields for personalization and maintain Maya's warm, professional tone.`
        }
      });

      if (error) throw error;

      const newTemplate = {
        id: `template-${Date.now()}`,
        name: `${category?.name} Template`,
        content: data.content
      };

      setGeneratedTemplates([...generatedTemplates, newTemplate]);
      
      toast({
        title: "Template Generated!",
        description: `Maya created a ${category?.name.toLowerCase()} template for you.`,
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyTemplate = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Template Copied!",
        description: "Template copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy template.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Template Library Complete!",
      description: "You've mastered Maya's template building system!",
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
            src={getAnimationUrl('maya-friendly-wave.mp4')}
            fallbackIcon={<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              👋
            </div>}
            className="w-full h-full rounded-full"
            context="character"
            loop={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Maya's Template Library Builder
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Create reusable email templates for organizational efficiency
        </p>

        {/* 3-Step Journey Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8 mx-auto">
          {[
            { title: 'Maya\'s Template Crisis', desc: 'Experience her scattered email approach', color: 'from-red-500/10 to-red-500/5', animation: 'maya-email-overwhelm.mp4', fallback: '📧' },
            { title: 'Discover Template Power', desc: 'Learn systematic template building', color: 'from-purple-500/10 to-purple-500/5', animation: 'maya-lightbulb-moment.mp4', fallback: '✨' },
            { title: 'Maya\'s Template Success', desc: 'Witness her transformation', color: 'from-green-500/10 to-green-500/5', animation: 'maya-celebration.mp4', fallback: '🚀' }
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
            Begin Maya's Template Journey
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
        lessonTitle="Template Library Builder"
        characterName="Maya"
        progress={33}
      />
      
      <div className="max-w-4xl mx-auto pt-20">
        <NarrativeManager
          messages={narrativeMessages}
          onComplete={() => setCurrentPhase('workshop')}
          phaseId="maya-template-narrative"
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
        lessonTitle="Template Library Builder"
        characterName="Maya"
        progress={66 + (currentStep / 4) * 34}
      />
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-8">
          <Progress value={66 + (currentStep / 4) * 34} className="h-2 mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Maya's Template Workshop</p>
            <Button variant="outline" onClick={() => navigate('/chapter/2')}>
              Back to Chapter 2
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Template Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Template Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Choose Template Type</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateTemplate}
                disabled={!selectedCategory || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Maya is creating your template...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Template with Maya's AI
                  </>
                )}
              </Button>

              {/* Custom Template Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Or customize your own template</label>
                <Textarea
                  placeholder="Write your template here... Use [MERGE_FIELDS] for personalization"
                  value={templateDraft}
                  onChange={(e) => setTemplateDraft(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Generated Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Your Template Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No templates created yet.</p>
                  <p className="text-sm">Generate your first template to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Button 
                          onClick={() => copyTemplate(template.content)}
                          variant="outline" 
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                        {template.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completion Button */}
        {generatedTemplates.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Complete Template Library Workshop
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

export default MayaTemplateLibraryBuilder;