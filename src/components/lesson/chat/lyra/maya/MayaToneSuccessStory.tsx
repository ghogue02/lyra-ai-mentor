import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Briefcase, Users, Heart, Copy, ThumbsUp, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ToneAdaptedPACE {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
  tone: 'professional' | 'empathetic' | 'reassuring';
  audienceType: 'board' | 'staff' | 'community';
}

interface MultiAudienceToneResult {
  board: ToneAdaptedPACE;
  staff: ToneAdaptedPACE;
  community: ToneAdaptedPACE;
  prompts: {
    board: string;
    staff: string;
    community: string;
  };
}

interface MayaToneSuccessStoryProps {
  toneResult: MultiAudienceToneResult;
  onContinue: () => void;
}

const MayaToneSuccessStory: React.FC<MayaToneSuccessStoryProps> = ({
  toneResult,
  onContinue
}) => {
  const [currentView, setCurrentView] = useState<'story' | 'comparison' | 'results'>('story');
  const { toast } = useToast();

  const audienceConfigs = {
    board: {
      title: 'Board Members',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100',
      tone: 'Professional',
      response: 'Maya, thank you for the clear financial analysis and recovery plan. Your proactive approach and transparency give us confidence in your leadership. Please proceed with Phase 1 of the mitigation strategy.',
      metrics: {
        clarity: 95,
        professionalism: 98,
        actionability: 92
      }
    },
    staff: {
      title: 'Staff Team',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      tone: 'Empathetic',
      response: 'Thank you for being so transparent with us, Maya. While this is challenging news, I appreciate how you acknowledged our concerns and showed us the path forward. Knowing our jobs are secure helps immensely.',
      metrics: {
        empathy: 96,
        clarity: 89,
        reassurance: 94
      }
    },
    community: {
      title: 'Community Members',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-100',
      tone: 'Reassuring',
      response: 'We appreciate your honesty and commitment to keeping our programs running. The community fundraising ideas sound great - we\'re ready to help however we can. Thank you for always putting families first.',
      metrics: {
        reassurance: 97,
        hope: 93,
        engagement: 95
      }
    }
  };

  const mayaStoryMessages = [
    "The transformation was incredible! By adapting my tone for each audience while keeping the same core message, I got completely different responses.",
    "The board appreciated my professional, data-driven approach and immediately approved my recovery plan.",
    "My staff felt heard and supported rather than anxious, and they're now actively helping with solutions.",
    "The community rallied together with fundraising ideas instead of panicking about service cuts.",
    "I learned that tone isn't just about words - it's about meeting people where they are emotionally while staying authentic to your message."
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  const handleCopyPrompt = (audience: keyof typeof toneResult.prompts) => {
    navigator.clipboard.writeText(toneResult.prompts[audience]);
    toast({
      title: "Prompt Copied!",
      description: `${audienceConfigs[audience].title} prompt copied to clipboard.`
    });
  };

  const renderStoryView = () => (
    <div className="space-y-8">
      {/* Maya's reflection */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Maya's Tone Mastery Success!</h2>
        <p className="text-xl text-gray-600 mb-8">
          Watch how tone adaptation transformed Maya's communication with each audience
        </p>
      </div>

      {/* Animated story messages */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-4">Maya's Reflection:</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-700 leading-relaxed text-lg"
                >
                  "{mayaStoryMessages[currentMessage]}"
                </motion.p>
              </AnimatePresence>
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-2">
                  {mayaStoryMessages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentMessage ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMessage(Math.max(0, currentMessage - 1))}
                    disabled={currentMessage === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMessage(Math.min(mayaStoryMessages.length - 1, currentMessage + 1))}
                    disabled={currentMessage === mayaStoryMessages.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-bold text-lg">95%</h4>
            <p className="text-sm text-gray-600">Average Response Satisfaction</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-bold text-lg">3/3</h4>
            <p className="text-sm text-gray-600">Audiences Successfully Engaged</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <ThumbsUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-bold text-lg">100%</h4>
            <p className="text-sm text-gray-600">Positive Audience Response</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={() => setCurrentView('comparison')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          See Tone Comparison
        </Button>
      </div>
    </div>
  );

  const renderComparisonView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Tone Adaptation Comparison</h3>
        <p className="text-gray-600">See how the same core message was adapted for each audience</p>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {(Object.keys(audienceConfigs) as Array<keyof typeof audienceConfigs>).map((audience) => {
            const config = audienceConfigs[audience];
            const Icon = config.icon;
            return (
              <TabsTrigger key={audience} value={audience} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {config.title}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(audienceConfigs) as Array<keyof typeof audienceConfigs>).map((audience) => {
          const config = audienceConfigs[audience];
          const Icon = config.icon;
          const result = toneResult[audience];
          
          return (
            <TabsContent key={audience} value={audience}>
              <Card className={`bg-gradient-to-r ${config.bgColor}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {config.title} - {config.tone} Tone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Tone-Adapted PACE:</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Purpose:</strong> {result.Purpose}
                        </div>
                        <div>
                          <strong>Connection:</strong> {result.Connection}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Audience Response:</h4>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm italic">"{config.response}"</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {Object.entries(config.metrics).map(([metric, score]) => (
                          <Badge key={metric} variant="secondary">
                            {metric}: {score}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Generated Prompt:</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyPrompt(audience)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                        {toneResult.prompts[audience]}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="text-center">
        <Button
          onClick={() => setCurrentView('results')}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          See Final Results
        </Button>
      </div>
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Tone Mastery Complete!</h3>
        <p className="text-gray-600">Maya successfully adapted her message for all three audiences</p>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center">What Maya Accomplished</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-green-800">Skills Mastered:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Multi-audience tone adaptation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Emotional connection strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Professional tone for executives</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Empathetic tone for teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Reassuring tone for communities</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-green-800">Results Achieved:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">98%</Badge>
                  <span className="text-sm">Board satisfaction & approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">94%</Badge>
                  <span className="text-sm">Staff reassurance & support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">95%</Badge>
                  <span className="text-sm">Community engagement & hope</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">100%</Badge>
                  <span className="text-sm">Positive response rate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Build My Tone Toolkit
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentView === 'story' && renderStoryView()}
        {currentView === 'comparison' && renderComparisonView()}
        {currentView === 'results' && renderResultsView()}
      </motion.div>
    </div>
  );
};

export default MayaToneSuccessStory;