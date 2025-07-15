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
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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

const SofiaVoiceFinder: React.FC<{ onComplete?: (score: number) => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'discovery' | 'practice' | 'transform' | 'complete'>('intro');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [originalText, setOriginalText] = useState('');
  const [transformedText, setTransformedText] = useState('');
  const [voiceStrength, setVoiceStrength] = useState(0);

  const scenario = scenarios[currentScenario];
  const selectedProfile = voiceProfiles.find(v => v.id === selectedVoice);

  const analyzeVoiceAlignment = (text: string) => {
    if (!selectedProfile) return 0;
    
    // Simple analysis based on trait keywords
    let score = 0;
    const lowerText = text.toLowerCase();
    
    // Check for voice-specific keywords
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
    
    // Simulate AI transformation based on voice profile
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sofia's Authentic Voice Finder</CardTitle>
                    <CardDescription>Discover and amplify your unique professional voice</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What You'll Discover:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Identify your authentic communication style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Transform generic text into your unique voice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Use AI to enhance (not replace) your authenticity</span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-purple-200 bg-purple-50">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>Remember:</strong> Your authentic voice is your superpower. AI helps you express it more clearly, not change who you are.
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
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Voice Discovery</CardTitle>
                <CardDescription>
                  Which communication style feels most natural to you?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedVoice} onValueChange={setSelectedVoice}>
                  {voiceProfiles.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Label 
                        htmlFor={profile.id}
                        className="cursor-pointer"
                      >
                        <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          selectedVoice === profile.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}>
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={profile.id} id={profile.id} className="mt-1" />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-md bg-gradient-to-r ${profile.color} text-white`}>
                                  {profile.icon}
                                </div>
                                <h3 className="font-semibold">{profile.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground">{profile.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {profile.traits.map((trait) => (
                                  <Badge key={trait} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                              <blockquote className="text-sm italic border-l-2 pl-3 text-muted-foreground">
                                "{profile.example}"
                              </blockquote>
                            </div>
                          </div>
                        </div>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                <Button 
                  onClick={() => setPhase('practice')}
                  disabled={!selectedVoice}
                  size="lg"
                  className="w-full"
                >
                  Practice with This Voice
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Voice Practice</CardTitle>
                    <CardDescription>
                      Write in your natural style, then see how AI can enhance it
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    {selectedProfile?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Scenario:</strong> {scenario.title}
                    <p className="mt-1"><strong>Audience:</strong> {scenario.audience}</p>
                    <p className="mt-1">{scenario.context}</p>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="original-text">Write your message (be yourself!):</Label>
                    <Textarea
                      id="original-text"
                      placeholder="Start writing in your natural voice..."
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      className="min-h-[150px] mt-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={transformWithAI}
                      disabled={originalText.length < 20}
                      className="flex-1"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Transform with AI
                    </Button>
                    <Button 
                      onClick={() => setPhase('transform')}
                      variant="outline"
                      disabled={!transformedText}
                    >
                      Skip to Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'transform' && transformedText && (
          <motion.div
            key="transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Voice Transformation</CardTitle>
                <CardDescription>
                  See how AI enhanced your authentic voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Your Original:</h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{originalText}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">AI-Enhanced Version:</h4>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm">{transformedText}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Voice Alignment Score:</span>
                    <span className="text-2xl font-bold text-primary">{voiceStrength}%</span>
                  </div>
                  <Progress value={voiceStrength} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    This measures how well the enhanced version aligns with your chosen {selectedProfile?.name} voice profile.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
                      setOriginalText('');
                      setTransformedText('');
                      setPhase('practice');
                    }}
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Another Scenario
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    className="flex-1"
                  >
                    Complete Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              <Mic className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Voice Discovery Complete!</h2>
              <p className="text-lg">You've found your authentic {selectedProfile?.name} voice</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Your Voice Profile:</h3>
                <div className="max-w-md mx-auto">
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${selectedProfile?.color} text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      {selectedProfile?.icon}
                      <h4 className="text-lg font-semibold">{selectedProfile?.name}</h4>
                    </div>
                    <p className="text-sm mb-3">{selectedProfile?.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile?.traits.map((trait) => (
                        <span key={trait} className="px-2 py-1 bg-white/20 rounded text-xs">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Next Steps:</h4>
                  <ul className="text-sm text-left space-y-1">
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
};

export default SofiaVoiceFinder;