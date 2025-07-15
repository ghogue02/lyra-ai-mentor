import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MayaMicroLessonHub } from '@/components/maya/MayaMicroLessonHub';
import { 
  ArrowLeft,
  Sparkles,
  Timer,
  MessageCircle,
  Smartphone,
  Trophy,
  TrendingUp,
  Users,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileResponsiveWrapper, ResponsiveGrid } from '@/components/ui/mobile-responsive-wrapper';

export default function MicroLessonDemo() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!showDemo ? (
        <MobileResponsiveWrapper maxWidth="6xl" padding="medium">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              NEW: Micro-Learning Architecture
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Long Lessons into Micro-Wins
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience Maya's Chapter 2, Lesson 5 reimagined as bite-sized, 
              chat-driven micro-lessons that respect your time and boost engagement.
            </p>
          </div>
          
          {/* Key Features */}
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="medium" className="mb-12">
            <Card>
              <CardHeader>
                <Timer className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">2-3 Minute Chunks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Perfect for busy non-profit workers who multitask. 
                  Complete a lesson while waiting for coffee!
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle className="text-lg">Chat-Driven Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maya talks TO you, not AT you. Interactive conversations 
                  that feel personal and engaging.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Smartphone className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">Mobile-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimized for one-handed use. Large touch targets, 
                  readable text, and smooth animations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                <CardTitle className="text-lg">Micro-Wins System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Celebrate progress every 2 minutes. Build confidence 
                  with frequent victories.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Visual progress bars, completion badges, and time 
                  tracking to show your journey.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-pink-500 mb-2" />
                <CardTitle className="text-lg">Hybrid Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Scripted storylines with AI enhancements ensure 
                  consistent, high-quality learning.
                </p>
              </CardContent>
            </Card>
          </ResponsiveGrid>
          
          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Before: Traditional Lesson
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>15-20 minute reading blocks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Wall of text that feels daunting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Passive consumption of content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Easy to lose focus or get interrupted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Desktop-optimized layouts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  After: Micro-Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>2-3 minute focused chunks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Interactive chat conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Active participation with choices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Natural pause points for busy lives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mobile-first, one-handed use</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Architecture Overview */}
          <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Micro-Lesson Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Structure</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• 5-6 micro-lessons per topic</li>
                    <li>• 2-3 minutes each</li>
                    <li>• Total: 12-15 minutes</li>
                    <li>• Sequential unlocking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Content Types</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Chat conversations</li>
                    <li>• Interactive exercises</li>
                    <li>• Quick practices</li>
                    <li>• Mini celebrations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Engagement</h4>
                  <ul className="text-sm space-y-1 text-purple-700">
                    <li>• Maya's emotional journey</li>
                    <li>• User choice points</li>
                    <li>• Progress visualization</li>
                    <li>• Instant feedback</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={() => setShowDemo(true)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Try the Micro-Lesson Demo
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Experience Maya's Chapter 2, Lesson 5 in the new format
            </p>
          </div>
        </MobileResponsiveWrapper>
      ) : (
        <MayaMicroLessonHub chapterId={2} lessonId={5} />
      )}
    </div>
  );
}