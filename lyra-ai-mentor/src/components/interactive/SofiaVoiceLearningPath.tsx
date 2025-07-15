import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Volume2,
  Heart,
  Sparkles,
  MessageCircle,
  Users,
  Target,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Zap,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { LearningPath } from '@/components/learning/LearningPath';
import { enhancedAIService } from '@/services/enhancedAIService';

interface VoiceElement {
  type: 'tone' | 'style' | 'purpose';
  label: string;
  emoji: string;
  description: string;
}

const toneOptions: VoiceElement[] = [
  { type: 'tone', label: 'Warm & Welcoming', emoji: '🤗', description: 'Inviting and inclusive' },
  { type: 'tone', label: 'Passionate & Inspiring', emoji: '✨', description: 'Energetic and motivating' },
  { type: 'tone', label: 'Calm & Reassuring', emoji: '🕊️', description: 'Peaceful and supportive' },
];

const styleOptions: VoiceElement[] = [
  { type: 'style', label: 'Personal Stories', emoji: '📖', description: 'Share experiences' },
  { type: 'style', label: 'Clear Facts', emoji: '📊', description: 'Data-driven approach' },
  { type: 'style', label: 'Emotional Connection', emoji: '💝', description: 'Heart-centered' },
];

const purposeOptions: VoiceElement[] = [
  { type: 'purpose', label: 'Build Trust', emoji: '🤝', description: 'Create connection' },
  { type: 'purpose', label: 'Inspire Action', emoji: '🚀', description: 'Motivate change' },
  { type: 'purpose', label: 'Share Vision', emoji: '🌟', description: 'Paint the future' },
];

export const SofiaVoiceLearningPath: React.FC = () => {
  const [selectedElements, setSelectedElements] = useState<{
    tone?: VoiceElement;
    style?: VoiceElement;
    purpose?: VoiceElement;
  }>({});
  const [voiceProfile, setVoiceProfile] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceScenario, setPracticeScenario] = useState('');

  const objectives = [
    {
      id: '1',
      title: 'Discover Your Authentic Voice',
      description: 'Identify what makes your communication style unique and powerful'
    },
    {
      id: '2',
      title: 'Build Voice Confidence',
      description: 'Learn to communicate with authenticity in any situation'
    },
    {
      id: '3',
      title: 'Create Your Voice Profile',
      description: 'Develop a personal guide for consistent, authentic communication'
    }
  ];

  const steps = [
    {
      id: 'learn',
      title: 'Explore Voice Elements',
      duration: '30 seconds',
      type: 'learn' as const,
      content: null,
      completed: false
    },
    {
      id: 'practice',
      title: 'Find Your Voice',
      duration: '2 minutes',
      type: 'practice' as const,
      content: null,
      completed: false
    },
    {
      id: 'apply',
      title: 'Create Voice Profile',
      duration: '2.5 minutes',
      type: 'apply' as const,
      content: null,
      completed: false
    }
  ];

  const tips = [
    { id: '1', tip: 'Your authentic voice is already within you - we\'re just uncovering it!', emoji: '💎' },
    { id: '2', tip: 'Mix personal stories with facts for maximum impact and connection', emoji: '🎯' },
    { id: '3', tip: 'Practice your voice with friends first - they\'ll give honest feedback', emoji: '👥' },
    { id: '4', tip: 'Record yourself speaking to hear how you really sound to others', emoji: '🎙️' },
    { id: '5', tip: 'AI can help you practice different voice styles - experiment freely!', emoji: '🤖' }
  ];

  const handleSelectElement = (element: VoiceElement) => {
    setSelectedElements(prev => ({
      ...prev,
      [element.type]: element
    }));
  };

  const generateVoiceProfile = async () => {
    if (!selectedElements.tone || !selectedElements.style || !selectedElements.purpose) {
      toast.error('Please select all three voice elements first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const profile = `🎤 Your Unique Voice Profile

Voice Formula: ${selectedElements.tone.label} + ${selectedElements.style.label} + ${selectedElements.purpose.label}

Your Authentic Voice:
You communicate with a ${selectedElements.tone.label.toLowerCase()} approach that immediately puts people at ease. Your natural tendency to use ${selectedElements.style.label.toLowerCase()} helps you connect deeply with your audience while maintaining authenticity.

When You Speak:
• Start with ${selectedElements.tone.emoji} ${selectedElements.tone.description} energy
• Incorporate ${selectedElements.style.emoji} ${selectedElements.style.description} elements
• Always aim to ${selectedElements.purpose.emoji} ${selectedElements.purpose.description}

Your Superpower:
The combination of these elements creates a voice that is uniquely yours - one that resonates with authenticity and builds genuine connections.

Practice Phrase:
"Hi, I'm here to share something close to my heart. Let me tell you why this matters..."

Remember: Your voice is perfect when it's authentically you!`;

      setVoiceProfile(profile);
      toast.success('Voice profile created!');
    } catch (error) {
      toast.error('Failed to generate voice profile');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyProfile = () => {
    navigator.clipboard.writeText(voiceProfile);
    toast.success('Voice profile copied to clipboard!');
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'learn':
        return (
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-pink-600" />
                The Voice Discovery Method
              </h3>
              <p className="text-gray-700 mb-4">
                Your authentic voice is like a fingerprint - unique to you! Let's discover it by exploring three key elements:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your Tone (How you sound)</p>
                    <p className="text-sm text-gray-600">The emotional color of your voice</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-pink-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your Style (How you share)</p>
                    <p className="text-sm text-gray-600">The way you structure your message</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your Purpose (Why you speak)</p>
                    <p className="text-sm text-gray-600">The impact you want to create</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">Voice Example:</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Maya Angelou had a warm tone, used personal stories, and aimed to inspire - 
                      creating a voice that moved millions. What's your unique combination?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3 text-center">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <Volume2 className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="text-xs font-medium">Tone Sets Mood</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs font-medium">Style Builds Connection</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <Target className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs font-medium">Purpose Drives Action</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Discover Your Voice Elements</h3>
              <p className="text-gray-600 mt-1">Choose what feels most natural to you</p>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">1</span>
                </div>
                What's Your Natural Tone?
              </h4>
              <div className="grid gap-2">
                {toneOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.tone?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-pink-700">2</span>
                </div>
                How Do You Share Best?
              </h4>
              <div className="grid gap-2">
                {styleOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.style?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Purpose Selection */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-700">3</span>
                </div>
                What's Your Speaking Goal?
              </h4>
              <div className="grid gap-2">
                {purposeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={selectedElements.purpose?.label === option.label ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleSelectElement(option)}
                  >
                    <span className="text-lg mr-3">{option.emoji}</span>
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-80">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Voice Preview */}
            {Object.keys(selectedElements).length > 0 && (
              <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Your Voice Emerging:</h4>
                  <div className="space-y-1 text-sm">
                    {selectedElements.tone && (
                      <p>✓ Tone: {selectedElements.tone.label} {selectedElements.tone.emoji}</p>
                    )}
                    {selectedElements.style && (
                      <p>✓ Style: {selectedElements.style.label} {selectedElements.style.emoji}</p>
                    )}
                    {selectedElements.purpose && (
                      <p>✓ Purpose: {selectedElements.purpose.label} {selectedElements.purpose.emoji}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-6">
            {!voiceProfile ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Ready to Create Your Voice Profile!</h3>
                <p className="text-gray-600">
                  Let's capture your authentic voice in a personal guide
                </p>
                
                {/* Show selected elements */}
                <Card className="bg-gradient-to-r from-pink-50 to-purple-50 max-w-md mx-auto">
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span>Tone:</span>
                        <span className="font-medium">
                          {selectedElements.tone?.label} {selectedElements.tone?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Style:</span>
                        <span className="font-medium">
                          {selectedElements.style?.label} {selectedElements.style?.emoji}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>Purpose:</span>
                        <span className="font-medium">
                          {selectedElements.purpose?.label} {selectedElements.purpose?.emoji}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={generateVoiceProfile}
                  disabled={isGenerating || !selectedElements.tone || !selectedElements.style || !selectedElements.purpose}
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                      Creating profile...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Generate Voice Profile
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>💡 Next Step:</strong> Your voice profile will include personalized tips, 
                    practice phrases, and guidance for authentic communication!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Voice Profile</h3>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Ready to use
                  </Badge>
                </div>

                {/* Profile Display */}
                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {voiceProfile}
                    </pre>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={copyProfile} className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                  <Button 
                    onClick={() => {
                      setVoiceProfile('');
                      setSelectedElements({});
                    }} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Different Voice
                  </Button>
                </div>

                {/* Impact Message */}
                <Card className="border-pink-200 bg-pink-50/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium text-pink-900 mb-2">
                      🌟 You Found Your Voice!
                    </h4>
                    <p className="text-sm text-pink-800">
                      Research shows authentic communication increases:<br />
                      • Trust by 73%<br />
                      • Engagement by 65%<br />
                      • Impact by 89%<br />
                      <strong>Your voice matters - use it!</strong>
                    </p>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 mb-3">Ready to practice?</p>
                  <p className="text-sm text-gray-500">
                    Try recording yourself using your new voice profile, or practice with a trusted friend!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LearningPath
      title="Find Your Voice in 5 Minutes"
      skill="Authentic Communication Discovery"
      estimatedMinutes={5}
      objectives={objectives}
      steps={steps}
      tips={tips}
      onComplete={(data) => {
        console.log('Learning path completed:', data);
        toast.success('You\'ve discovered your authentic voice!');
      }}
    >
      {renderStepContent(steps.find(s => !s.completed)?.id || 'learn')}
    </LearningPath>
  );
};