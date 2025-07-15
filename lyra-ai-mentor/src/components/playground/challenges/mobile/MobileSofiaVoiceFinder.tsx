import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Volume2,
  MessageSquare,
  Target,
  Heart,
  Zap,
  ArrowRight,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useResponsive, useSwipeGestures } from '@/hooks/useResponsive';
import { MobilePlaygroundWrapper } from '../../MobilePlaygroundWrapper';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  traits: string[];
  example: string;
  color: string;
  icon: React.ReactNode;
}

const voiceProfiles: VoiceProfile[] = [
  {
    id: 'empathetic-educator',
    name: 'Empathetic Educator',
    description: 'Warm, supportive, and focused on understanding',
    traits: ['Compassionate', 'Patient', 'Encouraging', 'Clear'],
    example: "I understand this can feel overwhelming. Let's break it down together, step by step.",
    color: 'from-pink-500 to-rose-500',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 'inspiring-visionary',
    name: 'Inspiring Visionary',
    description: 'Passionate, forward-thinking, and motivational',
    traits: ['Enthusiastic', 'Bold', 'Optimistic', 'Compelling'],
    example: "Together, we're not just solving problems—we're creating a future where every voice matters!",
    color: 'from-purple-500 to-indigo-500',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'practical-strategist',
    name: 'Practical Strategist',
    description: 'Direct, efficient, and results-oriented',
    traits: ['Clear', 'Logical', 'Action-focused', 'Precise'],
    example: "Here's our three-step plan: First, we identify. Second, we implement. Third, we measure.",
    color: 'from-blue-500 to-cyan-500',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'collaborative-connector',
    name: 'Collaborative Connector',
    description: 'Inclusive, relationship-focused, and community-minded',
    traits: ['Welcoming', 'Inclusive', 'Engaging', 'Thoughtful'],
    example: "I'd love to hear your perspective on this. What resonates with you, and what would you add?",
    color: 'from-green-500 to-teal-500',
    icon: <MessageSquare className="w-5 h-5" />
  }
];

interface WritingScenario {
  id: string;
  title: string;
  audience: string;
  context: string;
  goal: string;
}

const scenarios: WritingScenario[] = [
  {
    id: 'donor-appeal',
    title: 'Annual Fundraising Appeal',
    audience: 'Potential donors',
    context: 'Writing the opening paragraph for your annual fundraising campaign email',
    goal: 'Inspire donations while staying true to your authentic voice'
  },
  {
    id: 'volunteer-welcome',
    title: 'New Volunteer Welcome',
    audience: 'First-time volunteers',
    context: 'Creating a welcome message for new volunteers joining your program',
    goal: 'Make volunteers feel valued and excited to contribute'
  },
  {
    id: 'impact-story',
    title: 'Impact Story Introduction',
    audience: 'Newsletter subscribers',
    context: 'Starting a story about how your programs changed someone\'s life',
    goal: 'Connect emotionally while maintaining professionalism'
  }
];

const MobileSofiaVoiceFinder: React.FC<{ 
  onComplete?: (score: number) => void;
  onBack?: () => void;
}> = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'discovery' | 'practice' | 'transform' | 'complete'>('intro');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [originalText, setOriginalText] = useState('');
  const [transformedText, setTransformedText] = useState('');
  const [voiceStrength, setVoiceStrength] = useState(0);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);
  
  const { isMobile, isLandscape } = useResponsive();
  const scenario = scenarios[currentScenario];
  const selectedProfile = voiceProfiles.find(v => v.id === selectedVoice);

  // Enable swipe navigation between voice profiles
  useSwipeGestures({
    onSwipeLeft: () => {
      if (phase === 'discovery' && currentVoiceIndex < voiceProfiles.length - 1) {
        setCurrentVoiceIndex(prev => prev + 1);
      }
    },
    onSwipeRight: () => {
      if (phase === 'discovery' && currentVoiceIndex > 0) {
        setCurrentVoiceIndex(prev => prev - 1);
      }
    }
  });

  const analyzeVoiceAlignment = (text: string) => {
    if (!selectedProfile) return 0;
    
    let score = 0;
    const lowerText = text.toLowerCase();
    
    // Voice-specific keywords
    if (selectedVoice === 'empathetic-educator') {
      if (lowerText.includes('understand') || lowerText.includes('together') || lowerText.includes('support')) score += 30;
    } else if (selectedVoice === 'inspiring-visionary') {
      if (lowerText.includes('future') || lowerText.includes('transform') || lowerText.includes('imagine')) score += 30;
    } else if (selectedVoice === 'practical-strategist') {
      if (lowerText.includes('plan') || lowerText.includes('step') || lowerText.includes('result')) score += 30;
    } else if (selectedVoice === 'collaborative-connector') {
      if (lowerText.includes('together') || lowerText.includes('community') || lowerText.includes('share')) score += 30;
    }
    
    // Length and structure bonuses
    if (text.length > 50 && text.length < 200) score += 20;
    if (text.includes('?') && selectedVoice === 'collaborative-connector') score += 20;
    if (text.includes('!') && selectedVoice === 'inspiring-visionary') score += 20;
    
    // General quality
    if (text.split(' ').length > 10) score += 30;
    
    return Math.min(score, 100);
  };

  const transformWithAI = () => {
    if (!selectedProfile) return;
    
    let transformed = originalText;
    
    if (selectedVoice === 'empathetic-educator') {
      transformed = `I understand how important this is to you. ${originalText} Let's work through this together, one step at a time.`;
    } else if (selectedVoice === 'inspiring-visionary') {
      transformed = `Imagine the incredible impact we can create! ${originalText} Together, we're building something extraordinary.`;
    } else if (selectedVoice === 'practical-strategist') {
      transformed = `Here's what we'll accomplish: ${originalText} Our clear action plan will deliver measurable results.`;
    } else if (selectedVoice === 'collaborative-connector') {
      transformed = `${originalText} I'd love to hear your thoughts on this approach. What resonates with you?`;
    }
    
    setTransformedText(transformed);
    setVoiceStrength(analyzeVoiceAlignment(transformed));
  };

  const handleComplete = () => {
    setPhase('complete');
    if (onComplete) {
      onComplete(voiceStrength);
    }
  };

  const content = (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Mic className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Find Your Voice</h1>
                <p className="text-gray-600">Discover and amplify your unique professional voice</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      'Identify your authentic communication style',
                      'Transform generic text into your unique voice',
                      'Use AI to enhance (not replace) your authenticity'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-purple-200 bg-purple-50">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription>
                  Your authentic voice is your superpower. AI helps you express it more clearly.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => setPhase('discovery')} 
                size="lg" 
                className="w-full"
              >
                Discover My Voice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Voice Discovery</h2>
                <p className="text-sm text-gray-600">
                  {isMobile ? 'Swipe to explore different voices' : 'Select your communication style'}
                </p>
              </div>

              {isMobile ? (
                // Mobile carousel view
                <div className="relative">
                  <div className="overflow-hidden">
                    <motion.div
                      className="flex"
                      animate={{ x: `-${currentVoiceIndex * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {voiceProfiles.map((profile) => (
                        <div key={profile.id} className="w-full flex-shrink-0 px-2">
                          <Card 
                            className={`cursor-pointer transition-all ${
                              selectedVoice === profile.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedVoice(profile.id)}
                          >
                            <CardContent className="pt-6">
                              <div className="text-center mb-4">
                                <div className={`p-3 rounded-full bg-gradient-to-r ${profile.color} text-white w-16 h-16 mx-auto mb-3 flex items-center justify-center`}>
                                  {profile.icon}
                                </div>
                                <h3 className="font-semibold text-lg">{profile.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 justify-center mb-4">
                                {profile.traits.map((trait) => (
                                  <Badge key={trait} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                              
                              <blockquote className="text-sm italic text-center text-gray-600">
                                "{profile.example}"
                              </blockquote>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Carousel indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {voiceProfiles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVoiceIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentVoiceIndex ? 'bg-primary w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Desktop/tablet grid view
                <RadioGroup value={selectedVoice} onValueChange={setSelectedVoice}>
                  <div className="grid gap-3">
                    {voiceProfiles.map((profile) => (
                      <Label 
                        key={profile.id}
                        htmlFor={profile.id}
                        className="cursor-pointer"
                      >
                        <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedVoice === profile.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}>
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={profile.id} id={profile.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded-md bg-gradient-to-r ${profile.color} text-white`}>
                                  {profile.icon}
                                </div>
                                <h3 className="font-semibold">{profile.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {profile.traits.map((trait) => (
                                  <Badge key={trait} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                              <blockquote className="text-xs italic text-gray-500">
                                "{profile.example}"
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              )}

              <Button 
                onClick={() => setPhase('practice')}
                disabled={!selectedVoice}
                size="lg"
                className="w-full"
              >
                Practice with This Voice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Voice Practice</h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  {selectedProfile?.name}
                </Badge>
              </div>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  <strong>{scenario.title}</strong>
                  <p className="mt-1 text-xs"><strong>Audience:</strong> {scenario.audience}</p>
                  <p className="mt-1 text-xs">{scenario.context}</p>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="original-text" className="text-sm font-medium mb-2 block">
                  Write your message (be yourself!):
                </Label>
                <Textarea
                  id="original-text"
                  placeholder="Start writing in your natural voice..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={transformWithAI}
                  disabled={originalText.length < 20}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Transform
                </Button>
                <Button 
                  onClick={() => setPhase('transform')}
                  variant="outline"
                  disabled={!transformedText}
                >
                  Skip
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'transform' && transformedText && (
          <motion.div
            key="transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Voice Transformation</h2>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-600">Your Original:</h4>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm">{originalText}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-600">AI-Enhanced Version:</h4>
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="pt-4">
                      <p className="text-sm">{transformedText}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice Alignment Score:</span>
                  <span className="text-2xl font-bold text-primary">{voiceStrength}%</span>
                </div>
                <Progress value={voiceStrength} className="h-3" />
                <p className="text-xs text-gray-600 text-center">
                  Alignment with {selectedProfile?.name} voice profile
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleComplete}
                  className="w-full"
                >
                  Complete Challenge
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
                    setOriginalText('');
                    setTransformedText('');
                    setPhase('practice');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Another Scenario
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 text-center space-y-6"
          >
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl">
              <Mic className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Voice Discovery Complete!</h2>
              <p>You've found your authentic {selectedProfile?.name} voice</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg bg-gradient-to-r ${selectedProfile?.color} text-white mb-4`}>
                  <div className="flex items-center gap-3 mb-3 justify-center">
                    {selectedProfile?.icon}
                    <h4 className="text-lg font-semibold">{selectedProfile?.name}</h4>
                  </div>
                  <p className="text-sm mb-3 text-center">{selectedProfile?.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedProfile?.traits.map((trait) => (
                      <span key={trait} className="px-2 py-1 bg-white/20 rounded text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Next Steps:</h4>
                  <ul className="text-xs space-y-1 text-left">
                    <li>• Practice writing in your {selectedProfile?.name} voice daily</li>
                    <li>• Use AI to enhance, not replace, your authentic style</li>
                    <li>• Remember: Your unique voice is your greatest asset</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <MobilePlaygroundWrapper
      title="Sofia's Voice Finder"
      onBack={onBack}
    >
      {content}
    </MobilePlaygroundWrapper>
  );
};

export default MobileSofiaVoiceFinder;