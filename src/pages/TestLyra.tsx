import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TestTube, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LyraFoundationsChat from '@/components/lesson/chat/lyra/LyraFoundationsChat';

const TestLyra: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center">
                  <TestTube className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Lyra Chat Test Environment</h1>
                  <p className="text-sm text-muted-foreground">
                    Test the interactive chat experience before Chapter 1 integration
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <TestTube className="w-3 h-3 mr-1" />
              Testing Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Test Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="premium-card border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-2 text-amber-900">
                    Test Environment for Lyra Chat Feature
                  </h2>
                  <p className="text-amber-800 mb-4">
                    This is a safe testing environment for the new interactive Lyra chat feature. 
                    Test all conversation flows, UI interactions, and character responses before 
                    integrating into the Chapter 1 lesson flow.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <MessageCircle className="w-4 h-4" />
                      <span>6 Conversation Starters</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Heart className="w-4 h-4" />
                      <span>Nonprofit-Focused Topics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Sparkles className="w-4 h-4" />
                      <span>Lyra's Authentic Personality</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <TestTube className="w-4 h-4" />
                      <span>Full Integration Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Test Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Features to Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Conversation Starters",
                description: "Test all 6 nonprofit-focused conversation topics",
                icon: MessageCircle,
                color: "from-blue-500 to-cyan-400"
              },
              {
                title: "Lyra's Personality",
                description: "Verify warm, encouraging, mission-focused responses",
                icon: Heart,
                color: "from-pink-500 to-rose-400"
              },
              {
                title: "UI/UX Flow",
                description: "Test responsive design and interaction patterns",
                icon: Sparkles,
                color: "from-purple-500 to-indigo-400"
              }
            ].map((feature, index) => (
              <Card key={index} className="premium-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Main Chat Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LyraFoundationsChat 
            className="max-w-6xl mx-auto"
            embedded={false}
            onEngagementChange={(hasEngaged) => {
              console.log('Engagement changed:', hasEngaged);
            }}
          />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="max-w-2xl mx-auto premium-card border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TestTube className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Ready for Integration</span>
              </div>
              <p className="text-sm text-green-800 mb-4">
                Once testing is complete, this chat component will be seamlessly integrated 
                into the Chapter 1 "Meet Lyra & AI Foundations" lesson as the interactive 
                "first-chat" phase.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-green-700">
                <span>✅ Component Architecture</span>
                <span>✅ Character Integration</span>
                <span>✅ Nonprofit Focus</span>
                <span>✅ Responsive Design</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TestLyra;