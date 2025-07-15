import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Mic, Volume2, Users, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SofiaVoiceVisualization } from '@/components/magical/SofiaVoiceVisualization';
import { ExportButton } from '@/components/ui/ExportButton';
import { UseInSuggestions } from '@/components/ui/UseInSuggestions';
import { ExportData } from '@/services/exportService';

interface VoiceProfile {
  id: string;
  label: string;
  description: string;
  toneWords: string[];
  example: string;
  selected: boolean;
}

interface SofiaVoiceDiscoveryProps {
  onComplete?: () => void;
}

export const SofiaVoiceDiscovery: React.FC<SofiaVoiceDiscoveryProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'discover' | 'practice' | 'enhance' | 'success'>('context');
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([
    {
      id: 'empathetic-advocate',
      label: 'Empathetic Advocate',
      description: 'Leads with heart, connects through shared humanity',
      toneWords: ['compassionate', 'understanding', 'inclusive', 'nurturing'],
      example: "Every person who walks through our doors carries a story that deserves to be heard. We don't just provide services—we witness resilience, celebrate small victories, and stand alongside our community through every challenge.",
      selected: false
    },
    {
      id: 'data-driven-storyteller',
      label: 'Data-Driven Storyteller',
      description: 'Blends compelling numbers with human narratives',
      toneWords: ['evidence-based', 'clear', 'credible', 'impactful'],
      example: "Our numbers tell a story: 87% of families stabilize within 6 months, but behind that statistic is Maria, who went from sleeping in her car to securing stable housing and enrolling her daughter in our tutoring program.",
      selected: false
    },
    {
      id: 'inspiring-visionary',
      label: 'Inspiring Visionary',
      description: 'Paints pictures of possibility and transformation',
      toneWords: ['hopeful', 'ambitious', 'motivating', 'forward-thinking'],
      example: "Imagine a community where every child has access to quality after-school care, where seniors age with dignity, and where families facing crisis find not just assistance but pathways to thriving. This isn't just our dream—it's our blueprint.",
      selected: false
    },
    {
      id: 'collaborative-connector',
      label: 'Collaborative Connector',
      description: 'Builds bridges and emphasizes collective impact',
      toneWords: ['inclusive', 'partnership-focused', 'community-minded', 'collaborative'],
      example: "We don't work in silos—we're part of an ecosystem. When local businesses, schools, government, and community members unite around shared values, that's when real transformation happens. We're stronger together.",
      selected: false
    }
  ]);

  const [practiceScenario, setPracticeScenario] = useState('');
  const [enhancedMessage, setEnhancedMessage] = useState('');

  const selectedVoice = voiceProfiles.find(v => v.selected);

  const handleVoiceSelection = (voiceId: string) => {
    setVoiceProfiles(prev => prev.map(voice => ({
      ...voice,
      selected: voice.id === voiceId
    })));
  };

  const enhanceMessage = async () => {
    if (!practiceScenario || !selectedVoice) return;
    
    setCurrentPhase('enhance');
    
    // Simulate AI enhancement based on selected voice profile
    const enhancement = `${practiceScenario}

AI Enhancement Applied:
✨ Tone aligned with ${selectedVoice.label} style
✨ Language optimized for ${selectedVoice.toneWords.join(', ')} communication
✨ Audience engagement strategies incorporated
✨ Call-to-action strengthened for maximum impact

Your authentic voice shines through while professional polish elevates your message. This communication will resonate with your audience and drive the response you're seeking.`;

    setEnhancedMessage(enhancement);
    
    toast({
      title: "✨ Voice Enhancement Complete!",
      description: `Your message has been enhanced with ${selectedVoice.label} style`,
    });
  };

  const getExportData = (): ExportData => ({
    title: `Voice Discovery - ${selectedVoice?.label || 'Exploration'} - ${new Date().toLocaleDateString()}`,
    content: enhancedMessage || practiceScenario,
    metadata: {
      createdAt: new Date().toISOString(),
      author: 'Sofia Martinez',
      tags: ['voice', 'storytelling', selectedVoice?.label || 'discovery'],
      voiceProfile: selectedVoice
    },
    sections: [
      {
        title: 'Selected Voice Profile',
        content: selectedVoice ? `${selectedVoice.label}: ${selectedVoice.description}\nTone Words: ${selectedVoice.toneWords.join(', ')}\nExample: ${selectedVoice.example}` : 'No voice profile selected',
        type: 'text'
      },
      {
        title: 'Practice Content',
        content: practiceScenario || 'No practice content',
        type: 'text'
      },
      {
        title: 'Enhanced Version',
        content: enhancedMessage || 'Not yet enhanced',
        type: 'text'
      }
    ]
  });

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    // Track completion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'sofia-voice-discovery',
        lesson_id: 12,
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
              <div className="inline-flex p-4 bg-purple-100 rounded-full">
                <Mic className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">Sofia's Voice Discovery</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p>Sofia has the mission story, but every time she tries to communicate, she feels like she's wearing someone else's clothes. Formal grant language? Corporate speak? Neither feels authentic.</p>
                <p className="font-semibold text-purple-700">The board wants "professional" communication, but Sofia's heart speaks in compassion.</p>
                <p>Time to discover Sofia's authentic voice—one that's both professional and genuinely her.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">What you'll discover:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>Your authentic communication style</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>How to adapt your voice for different audiences</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span>Professional tone that stays true to your values</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('discover')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Discover Sofia's Voice
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'discover':
        return (
          <div className="space-y-6">
            <SofiaVoiceVisualization 
              profiles={voiceProfiles.map(voice => ({
                id: voice.id,
                name: voice.label,
                description: voice.description,
                color: 'purple'
              }))}
              selectedProfile={voiceProfiles.find(v => v.selected)?.id}
              onProfileSelect={(profileId) => handleVoiceSelection(profileId)}
            />
            
            {/* Show detailed information for selected voice */}
            {voiceProfiles.find(v => v.selected) && (
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-purple-700">
                      {voiceProfiles.find(v => v.selected)?.label}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {voiceProfiles.find(v => v.selected)?.toneWords.map((word, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                    
                    <div className="bg-white p-3 rounded text-sm italic border-l-4 border-purple-400">
                      "{voiceProfiles.find(v => v.selected)?.example}"
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentPhase('practice')}
                disabled={!selectedVoice}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Practice This Voice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Practice Your Voice</h2>
              <p className="text-gray-600">Write a message using your {selectedVoice?.label} style</p>
            </div>
            
            {selectedVoice && (
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Your Voice Profile: {selectedVoice.label}</h3>
                  <p className="text-sm text-gray-700 mb-3">{selectedVoice.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVoice.toneWords.map((word, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {word}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Practice Scenario: Write a donor update email about your latest program impact
              </label>
              <Textarea
                value={practiceScenario}
                onChange={(e) => setPracticeScenario(e.target.value)}
                placeholder="Draft your donor update using your authentic voice style..."
                className="min-h-[150px]"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('discover')}
                className="flex-1"
              >
                Change Voice
              </Button>
              <Button 
                onClick={enhanceMessage}
                disabled={!practiceScenario}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Message
              </Button>
            </div>
          </div>
        );

      case 'enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Your Enhanced Voice</h2>
              <p className="text-gray-600">AI-polished while preserving your authentic style</p>
            </div>
            
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedMessage}
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">✨ Voice Enhancement Applied:</span> Maintained your 
                authentic {selectedVoice?.label} style while adding professional polish, 
                optimizing for audience engagement, and strengthening calls-to-action.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('practice')}
                className="flex-1"
              >
                Edit Message
              </Button>
              <ExportButton
                data={getExportData}
                formats={['pdf', 'docx', 'txt']}
                variant="outline"
                className="flex-1"
                characterName="Sofia"
                suggestUseIn={['Maya Email Composer', 'David Presentation', 'Social Media Posts']}
              />
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Complete Discovery
              </Button>
            </div>
            
            {/* Use In Suggestions */}
            <UseInSuggestions
              content={{
                voiceProfile: selectedVoice,
                originalMessage: practiceScenario,
                enhancedMessage: enhancedMessage,
                toneWords: selectedVoice?.toneWords || []
              }}
              contentType="story"
              fromCharacter="Sofia"
              componentType="sofia-voice"
              className="mt-4"
            />
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <Mic className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Sofia's Voice Discovered!</h2>
              <div className="max-w-md mx-auto space-y-3 text-gray-600">
                <p className="text-lg">Sofia now has her authentic communication style: {selectedVoice?.label}!</p>
                <p>No more borrowed corporate speak. Every message now reflects her genuine passion while maintaining professional impact.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-purple-50 p-6 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Sofia's Voice Superpowers:</h3>
              <ul className="space-y-2 text-left">
                <li>✅ Authentic style that feels natural</li>
                <li>✅ Professional tone that impresses boards</li>
                <li>✅ Audience adaptation while staying true</li>
                <li>✅ Confidence in every communication</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Next: Sofia creates her breakthrough story using this newfound voice...
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