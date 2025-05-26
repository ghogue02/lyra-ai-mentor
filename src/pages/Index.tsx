
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalizationFlow } from '@/components/PersonalizationFlow';
import { ChapterCard } from '@/components/ChapterCard';
import { Navbar } from '@/components/Navbar';
import { Brain, Gears, Heart, Scale, Target, BookOpen, Award, MessageCircle } from 'lucide-react';

const Index = () => {
  const [showPersonalization, setShowPersonalization] = useState(false);

  const chapters = [
    { id: 1, title: "What Is AI Anyway?", icon: Brain, description: "Demystify artificial intelligence with real-world examples", duration: "15 min" },
    { id: 2, title: "How Machines Learn", icon: Gears, description: "ML basics without the technical jargon", duration: "20 min" },
    { id: 3, title: "From Data to Insight", icon: Target, description: "Practical AI tools you can use today", duration: "25 min" },
    { id: 4, title: "AI Ethics & Impact", icon: Scale, description: "Navigate the ethical landscape responsibly", duration: "18 min" },
    { id: 5, title: "Non-Profit Playbook", icon: Heart, description: "Grant writing, donor outreach, and operations", duration: "30 min" },
    { id: 6, title: "Your Action Plan", icon: BookOpen, description: "Create your AI-powered workflow", duration: "20 min" }
  ];

  if (showPersonalization) {
    return <PersonalizationFlow onComplete={() => setShowPersonalization(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-2 text-sm font-medium">
            For Non-Profit & Public Interest Professionals
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent leading-tight">
            Master AI Without the Mystery
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Transform your impact with AI-powered workflows. Learn practical tools, navigate ethics, and boost your mission—all with your personal AI mentor, Lyra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => setShowPersonalization(true)}
            >
              Start Your AI Journey
            </Button>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Lyra, your AI mentor</span>
            </div>
          </div>
          
          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Tailored Learning</h3>
                <p className="text-gray-600">Personalized to your role, tech comfort, and learning style</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mission-Focused</h3>
                <p className="text-gray-600">Real-world examples from fundraising to program delivery</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Confidence Building</h3>
                <p className="text-gray-600">Complete with certificate and actionable next steps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Six focused chapters designed to take you from AI curious to AI confident
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {chapters.map((chapter) => (
            <ChapterCard 
              key={chapter.id} 
              chapter={chapter}
              isLocked={chapter.id > 1}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Amplify Your Impact?</h3>
            <p className="text-lg mb-6 text-purple-50">
              Join thousands of non-profit professionals who've transformed their work with AI
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
              onClick={() => setShowPersonalization(true)}
            >
              Get Started Free
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
