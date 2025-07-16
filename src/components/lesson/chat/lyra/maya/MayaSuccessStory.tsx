import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Trophy, Copy, Check, Target, Users, Heart, Zap, MessageCircle } from 'lucide-react';

interface PACEFramework {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
}

interface MayaSuccessStoryProps {
  mayaPaceResult: PACEFramework;
  mayaPrompt: string;
  onContinue: () => void;
}

const MayaSuccessStory: React.FC<MayaSuccessStoryProps> = ({
  mayaPaceResult,
  mayaPrompt,
  onContinue
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [currentView, setCurrentView] = useState<'story' | 'details'>('story');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const mayaFinalEmail = `Hi [Manager's Name],

I wanted to reach out immediately regarding the project deliverables that were due today. I need to inform you that I will not be able to meet this deadline, and I take full responsibility for this delay.

I understand this impacts the team's timeline and apologize for any inconvenience this may cause. Here's my plan to get back on track:

• I will have the deliverables completed by [specific date]
• I'm prioritizing this work above all other tasks
• I've identified the bottlenecks and have a clear path forward

If there are any resources or support that could help expedite this, please let me know. I'm committed to ensuring this doesn't happen again.

Thank you for your understanding.

Best regards,
Maya`;

  const paceIcons = {
    Purpose: Target,
    Audience: Users,
    Connection: Heart,
    Engagement: Zap
  };

  const paceColors = {
    Purpose: 'text-blue-600 bg-blue-50',
    Audience: 'text-green-600 bg-green-50',
    Connection: 'text-pink-600 bg-pink-50',
    Engagement: 'text-purple-600 bg-purple-50'
  };

  const renderStory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Maya's Amazing Transformation! 🎉</h2>
        <p className="text-gray-600 text-lg">
          From 2 hours of frustration to 20 minutes of success
        </p>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" />
            Maya's Success Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💫 What happened next:</h4>
              <p className="text-sm text-gray-700">
                Using the PACE framework you helped her build, Maya created a powerful prompt that generated exactly what she needed. Her manager responded within an hour, thanking her for the transparency and offering additional resources to help her catch up.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">😰 Before PACE:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 2 hours of staring at blank screen</li>
                  <li>• Generic, cold AI responses</li>
                  <li>• Increased anxiety and stress</li>
                  <li>• No clear communication strategy</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✨ After PACE:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 20 minutes to perfect email</li>
                  <li>• Professional, personalized message</li>
                  <li>• Confident communication</li>
                  <li>• Manager's positive response</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📧 The result:</h4>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {mayaFinalEmail}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💬 Maya's reflection:</h4>
              <p className="text-sm text-yellow-700 italic">
                "I can't believe the difference! The PACE framework didn't just help me write better prompts - it changed how I think about communication entirely. I now approach every important message with Purpose, Audience, Connection, and Engagement in mind."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => setCurrentView('details')}
          variant="outline"
          className="mr-4"
        >
          See How Maya Did It
        </Button>
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Build Your Own Toolkit
        </Button>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Button
          onClick={() => setCurrentView('story')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Maya's Story
        </Button>
        <h3 className="text-2xl font-bold mb-2">Maya's PACE Framework in Action</h3>
        <p className="text-gray-600">
          Here's exactly how Maya built her successful prompt
        </p>
      </div>

      <Tabs defaultValue="pace" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pace">PACE Framework</TabsTrigger>
          <TabsTrigger value="prompt">Final Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="pace" className="space-y-4">
          {Object.entries(paceIcons).map(([key, Icon]) => (
            <Card key={key} className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className={`w-5 h-5 ${paceColors[key as keyof typeof paceColors].split(' ')[0]}`} />
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                  {mayaPaceResult[key as keyof PACEFramework]}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prompt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  Maya's Final Prompt
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(mayaPrompt)}
                >
                  {copiedPrompt ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedPrompt ? 'Copied!' : 'Copy'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {mayaPrompt}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Now Build Your Own Toolkit
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentView === 'story' ? renderStory() : renderDetails()}
      </motion.div>
    </div>
  );
};

export default MayaSuccessStory;