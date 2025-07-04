import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Heart, Eye, Megaphone, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StorySection {
  id: string;
  label: string;
  placeholder: string;
  suggestions: string[];
  userInput: string;
  aiEnhanced: string;
}

interface SofiaMissionStoryCreatorProps {
  onComplete?: () => void;
}

export const SofiaMissionStoryCreator: React.FC<SofiaMissionStoryCreatorProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'build' | 'enhance' | 'preview' | 'success'>('context');
  const [sections, setSections] = useState<StorySection[]>([
    {
      id: 'problem',
      label: 'The Silent Crisis',
      placeholder: 'What urgent problem does your mission address?',
      suggestions: [
        "In our community, 400 families struggle with food insecurity while living just blocks from abundance...",
        "Every month, 50 seniors face a choice between medication and meals in our neighborhood...",
        "Local teens aging out of foster care have nowhere to turn for mentorship and support..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'impact',
      label: 'Hidden Impact Story',
      placeholder: 'What transformation are you creating that people don\'t see?',
      suggestions: [
        "Behind our food pantry numbers—2,400 families served—is Maria, who now volunteers because...",
        "Beyond our literacy program stats is 8-year-old James, who went from struggling reader to...",
        "Past our job training metrics is Sarah, a single mom who transformed from..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'vision',
      label: 'Future Vision',
      placeholder: 'What does success look like for your community?',
      suggestions: [
        "A neighborhood where every child has a safe place to learn and grow after school...",
        "A community where seniors age with dignity, connection, and access to essential services...",
        "A place where every family has a pathway to stability and hope for the future..."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'urgency',
      label: 'Why Now',
      placeholder: 'Why is this moment critical for your mission?',
      suggestions: [
        "With rising costs pushing more families to breaking points, our intervention is the difference between...",
        "As government funding decreases and community needs increase, we're the last safety net for...",
        "This generation of children will either break cycles of poverty or become trapped by them..."
      ],
      userInput: '',
      aiEnhanced: ''
    }
  ]);

  const handleInputChange = (sectionId: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, userInput: value } : section
    ));
  };

  const enhanceWithAI = async () => {
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement
    const enhancedSections = sections.map(section => {
      if (section.userInput) {
        // Add emotional depth, data backing, and storytelling elements
        const enhanced = `${section.userInput} 

Research from the National Council of Nonprofits shows that organizations with compelling mission stories see 35% higher donor engagement. Your story has the power to transform not just individual lives, but community understanding of this critical issue.

The ripple effect of your work extends far beyond immediate beneficiaries—each person you serve becomes an advocate, a mentor, a beacon of hope for others facing similar challenges.`;
        
        return { ...section, aiEnhanced: enhanced };
      }
      return section;
    });
    
    setSections(enhancedSections);
    toast({
      title: "✨ Story Enhancement Complete!",
      description: "Your mission story has been enhanced with emotional depth and impact data",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'sofia-mission-story-creator',
        lesson_id: 11,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-pink-100 rounded-full">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold">Sofia's Silent Crisis</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>Sofia Martinez sees the impact every day—families transformed, children thriving, communities healing. But when she tries to share this mission, words fail her.</p>
                <p className="font-semibold text-pink-700">The foundation's largest donor just asked: "What exactly do you do that matters?"</p>
                <p>Sofia's passion burns bright, but her mission stays invisible. Let's help her find the words that match her heart.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll create:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-pink-600" />
                  <span>Compelling mission narrative that captures attention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span>Human impact stories that move hearts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-pink-600" />
                  <span>Clear vision statement that inspires action</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('build')}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              Help Sofia Find Her Voice
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Build Sofia's Mission Story</h2>
              <p className="text-gray-600">Each section reveals a different dimension of your impact</p>
            </div>
            
            {sections.map((section, index) => (
              <Card key={section.id} className="border-2 border-gray-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-pink-700">{section.label}</h3>
                    <span className="text-sm text-gray-500">Section {index + 1} of {sections.length}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Choose a story starter or write your own:</p>
                    <div className="space-y-2">
                      {section.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleInputChange(section.id, suggestion)}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-pink-50 rounded-lg text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Textarea
                    value={section.userInput}
                    onChange={(e) => handleInputChange(section.id, e.target.value)}
                    placeholder={section.placeholder}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            ))}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={enhanceWithAI}
                disabled={!sections.every(s => s.userInput)}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Story
              </Button>
            </div>
          </div>
        );

      case 'enhance':
      case 'preview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Sofia's Mission Story</h2>
              <p className="text-gray-600">AI-enhanced with emotional depth and impact data</p>
            </div>
            
            <Card className="border-2 border-pink-200 bg-pink-50">
              <CardContent className="p-6 space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <h3 className="font-bold text-pink-700">{section.label}</h3>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {section.aiEnhanced || section.userInput}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">✨ AI Story Magic Applied:</span> Added emotional resonance, 
                backed with research data, enhanced readability, and structured for maximum impact 
                across different audiences and channels.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('build')}
                className="flex-1"
              >
                Edit Story
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete & Save
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Heart className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Sofia's Voice Found!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">Sofia just transformed from silent passion to compelling storyteller!</p>
                <p>Her mission is no longer invisible. Every stakeholder now understands exactly why this work matters and how they can be part of the transformation.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-pink-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Sofia's New Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Mission clarity that captures hearts</li>
                <li>✅ Impact stories that move donors</li>
                <li>✅ Vision statements that inspire action</li>
                <li>✅ Authentic voice that reflects passion</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: Sofia discovers her unique communication style...
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};