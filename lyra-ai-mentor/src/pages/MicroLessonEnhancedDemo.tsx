import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MayaMicroLessonHubEnhanced } from '@/components/maya/MayaMicroLessonHubEnhanced';
import { 
  ArrowLeft,
  Sparkles,
  Timer,
  MessageCircle,
  Smartphone,
  Trophy,
  TrendingUp,
  Users,
  BookOpen,
  Wand2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Eye,
  Rocket,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileResponsiveWrapper, ResponsiveGrid } from '@/components/ui/mobile-responsive-wrapper';

export default function MicroLessonEnhancedDemo() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-300">
              <Sparkles className="w-3 h-3 mr-1" />
              ENHANCED: AI-Powered Micro-Learning
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Maya's AI Email Revolution
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform 32-minute email struggles into 5-second AI magic through 
              interactive micro-lessons that showcase the power of AI
            </p>
          </div>
          
          {/* Key Improvements */}
          <Card className="mb-12 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Star className="w-5 h-5" />
                What's New in This Enhanced Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Fixed Auto-Continue</p>
                      <p className="text-sm text-gray-600">3-second countdown with skip option</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">AI Magic Button</p>
                      <p className="text-sm text-gray-600">See real AI generation in action</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Visual Recipe Persistence</p>
                      <p className="text-sm text-gray-600">Selected options stay visible</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Learn HOW to Use AI</p>
                      <p className="text-sm text-gray-600">4 magic tips for perfect prompts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Interactive Lesson 5</p>
                      <p className="text-sm text-gray-600">Final AI demo & celebration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Time Transformation Focus</p>
                      <p className="text-sm text-gray-600">32 min → 5 sec visualized</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Features */}
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="medium" className="mb-12">
            <Card className="border-purple-200">
              <CardHeader>
                <Wand2 className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle className="text-lg">AI Magic Buttons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Watch AI transform prompts into perfect emails in real-time. 
                  No more "imagine if" - see it happen!
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <Rocket className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">5-Second Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Experience the transformation from 32-minute struggles to 
                  5-second successes with AI assistance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">Learn AI Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Not just using AI, but mastering HOW to communicate with it 
                  for perfect results every time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <Eye className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-lg">Visual Persistence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recipe ingredients stay visible as you build, creating a 
                  clear mental model of the process.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <Timer className="w-8 h-8 text-pink-500 mb-2" />
                <CardTitle className="text-lg">Smart Auto-Continue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  3-second celebration with skip option ensures smooth flow 
                  without feeling rushed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-indigo-500 mb-2" />
                <CardTitle className="text-lg">Impact Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  See your time savings grow with each lesson. Track AI 
                  generations and celebrate wins.
                </p>
              </CardContent>
            </Card>
          </ResponsiveGrid>
          
          {/* Lesson Overview */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-purple-900">Enhanced Lesson Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                  <Badge className="bg-purple-600 text-white">1</Badge>
                  <div className="flex-1">
                    <p className="font-semibold">Meet Maya's Challenge</p>
                    <p className="text-sm text-gray-600">See AI transform a 32-min email instantly</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Wand2 className="w-3 h-3 mr-1" />
                    AI Demo
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                  <Badge className="bg-purple-600 text-white">2</Badge>
                  <div className="flex-1">
                    <p className="font-semibold">The Email Recipe Secret</p>
                    <p className="text-sm text-gray-600">Learn the 3 ingredients + watch AI magic</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Wand2 className="w-3 h-3 mr-1" />
                    AI Demo
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                  <Badge className="bg-purple-600 text-white">3</Badge>
                  <div className="flex-1">
                    <p className="font-semibold">Build Your Recipe</p>
                    <p className="text-sm text-gray-600">Visual recipe builder with AI generation</p>
                  </div>
                  <Badge variant="outline" className="text-xs">✨ Interactive</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                  <Badge className="bg-purple-600 text-white">4</Badge>
                  <div className="flex-1">
                    <p className="font-semibold">Master AI Prompts</p>
                    <p className="text-sm text-gray-600">Learn Maya's 4 magic tips for perfect AI emails</p>
                  </div>
                  <Badge variant="outline" className="text-xs">✨ Interactive</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                  <Badge className="bg-purple-600 text-white">5</Badge>
                  <div className="flex-1">
                    <p className="font-semibold">Your Transformation</p>
                    <p className="text-sm text-gray-600">Final AI demo & celebrate your mastery</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Wand2 className="w-3 h-3 mr-1" />
                    AI Demo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Transformation Preview */}
          <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-900 mb-2">The Maya Transformation</h3>
                <p className="text-purple-700">What you'll achieve in just 12 minutes</p>
              </div>
              
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 line-through mb-1">32 min</div>
                  <p className="text-sm text-gray-600">Old way</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-8 h-8 text-purple-600 mb-2" />
                  <Badge className="bg-purple-600 text-white">AI Magic</Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">5 sec</div>
                  <p className="text-sm text-gray-600">With AI</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Save 8+ hours every week!
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all"
              onClick={() => setShowDemo(true)}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Experience the AI Magic Demo
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Maya's Chapter 2, Lesson 5 - Completely Transformed
            </p>
          </div>
        </MobileResponsiveWrapper>
      ) : (
        <MayaMicroLessonHubEnhanced chapterId={2} lessonId={5} />
      )}
    </div>
  );
}