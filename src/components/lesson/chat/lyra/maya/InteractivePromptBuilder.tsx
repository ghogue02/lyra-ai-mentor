import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, Users, Heart, Zap, Plus, Trash2, Edit3, Sparkles, ChevronRight } from 'lucide-react';

interface InteractivePromptBuilderProps {
  userChallenge: string;
  onPromptGenerated: (prompt: string, paceBreakdown: PaceFramework) => void;
  onCoachingRequest: (prompt: string) => void;
}

interface PaceFramework {
  purpose: string;
  audience: string;
  connection: string;
  engagement: string;
}

interface PaceSection {
  id: keyof PaceFramework;
  title: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  description: string;
  suggestions: string[];
}

const InteractivePromptBuilder: React.FC<InteractivePromptBuilderProps> = ({
  userChallenge,
  onPromptGenerated,
  onCoachingRequest
}) => {
  const [paceFramework, setPaceFramework] = useState<PaceFramework>({
    purpose: '',
    audience: '',
    connection: '',
    engagement: ''
  });

  const [currentSection, setCurrentSection] = useState<keyof PaceFramework>('purpose');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  const paceSection: PaceSection[] = [
    {
      id: 'purpose',
      title: 'Purpose',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-blue-500',
      placeholder: 'What do you want to achieve with this communication?',
      description: 'Define your clear, specific goal',
      suggestions: [
        'Inform about project updates',
        'Persuade to take action',
        'Build relationship and trust',
        'Solve a specific problem',
        'Celebrate achievements'
      ]
    },
    {
      id: 'audience',
      title: 'Audience',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500',
      placeholder: 'Who are you communicating with? What do they care about?',
      description: 'Understand your audience deeply',
      suggestions: [
        'Busy executives who need quick decisions',
        'Team members who need clarity',
        'Clients who value results',
        'Stakeholders who need reassurance',
        'Community members who want involvement'
      ]
    },
    {
      id: 'connection',
      title: 'Connection',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-purple-500',
      placeholder: 'How will you create emotional connection?',
      description: 'Build emotional resonance',
      suggestions: [
        'Share a personal story',
        'Use relatable examples',
        'Address their specific concerns',
        'Show genuine appreciation',
        'Connect to shared values'
      ]
    },
    {
      id: 'engagement',
      title: 'Engagement',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-orange-500',
      placeholder: 'How will you keep them engaged and encourage action?',
      description: 'Drive action and response',
      suggestions: [
        'Ask specific questions',
        'Include clear next steps',
        'Create urgency or importance',
        'Use interactive elements',
        'Provide easy ways to respond'
      ]
    }
  ];

  const currentSectionData = paceSection.find(section => section.id === currentSection)!;

  const handleSectionUpdate = (value: string) => {
    setPaceFramework(prev => ({
      ...prev,
      [currentSection]: value
    }));
  };

  const handleSuggestionAdd = (suggestion: string) => {
    const currentValue = paceFramework[currentSection];
    const newValue = currentValue ? `${currentValue}. ${suggestion}` : suggestion;
    setPaceFramework(prev => ({
      ...prev,
      [currentSection]: newValue
    }));
  };

  const generatePrompt = () => {
    setIsBuilding(true);
    
    const prompt = `
You are helping with: ${userChallenge}

PURPOSE: ${paceFramework.purpose}
AUDIENCE: ${paceFramework.audience}
CONNECTION: ${paceFramework.connection}
ENGAGEMENT: ${paceFramework.engagement}

Using this PACE framework, create content that:
- Achieves the purpose clearly
- Speaks directly to the audience
- Creates emotional connection
- Drives engagement and action

Make it personal, specific, and actionable.
    `.trim();

    setGeneratedPrompt(prompt);
    
    setTimeout(() => {
      setIsBuilding(false);
      onPromptGenerated(prompt, paceFramework);
    }, 1000);
  };

  const isComplete = Object.values(paceFramework).every(value => value.trim().length > 0);
  const currentIndex = paceSection.findIndex(section => section.id === currentSection);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Edit3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Interactive Prompt Builder</h2>
        <p className="text-gray-600">
          Build your PACE framework step by step. Lyra will guide you through each section.
        </p>
      </motion.div>

      {/* PACE Progress */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {paceSection.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer ${
                  currentSection === section.id
                    ? section.color
                    : paceFramework[section.id]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
                onClick={() => setCurrentSection(section.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {section.icon}
              </motion.div>
              {index < paceSection.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Section Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${currentSectionData.color}`}>
                  {currentSectionData.icon}
                </div>
                {currentSectionData.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{currentSectionData.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder={currentSectionData.placeholder}
                  value={paceFramework[currentSection]}
                  onChange={(e) => handleSectionUpdate(e.target.value)}
                  className="min-h-32"
                />
                
                <div>
                  <h4 className="font-medium mb-2">Suggestions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSectionData.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionAdd(suggestion)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                const prevIndex = Math.max(0, currentIndex - 1);
                setCurrentSection(paceSection[prevIndex].id);
              }}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {paceFramework[currentSection] && (
                <Button
                  variant="outline"
                  onClick={() => onCoachingRequest(paceFramework[currentSection])}
                  className="text-purple-600 border-purple-300"
                >
                  Get Lyra's Feedback
                </Button>
              )}
              
              {currentIndex < paceSection.length - 1 ? (
                <Button
                  onClick={() => {
                    const nextIndex = Math.min(paceSection.length - 1, currentIndex + 1);
                    setCurrentSection(paceSection[nextIndex].id);
                  }}
                  disabled={!paceFramework[currentSection]}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={generatePrompt}
                  disabled={!isComplete || isBuilding}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isBuilding ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Building...
                    </>
                  ) : (
                    <>
                      Generate Prompt <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* PACE Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your PACE Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paceSection.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${section.color}`}>
                        {section.icon}
                      </div>
                      <h4 className="font-medium text-sm">{section.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded min-h-12">
                      {paceFramework[section.id] || `Define your ${section.title.toLowerCase()}...`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Prompt Preview */}
      <AnimatePresence>
        {generatedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Generated Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractivePromptBuilder;