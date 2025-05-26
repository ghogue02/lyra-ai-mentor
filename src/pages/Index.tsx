import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalizationFlow } from '@/components/PersonalizationFlow';
import { Navbar } from '@/components/Navbar';
import { Target, Heart, Award, MessageCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const [showPersonalization, setShowPersonalization] = useState(false);
  const navigate = useNavigate();
  if (showPersonalization) {
    return <PersonalizationFlow onComplete={() => setShowPersonalization(false)} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={true} />
      
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
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" onClick={() => setShowPersonalization(true)}>
              Start Your AI Journey
            </Button>
            
            <Button variant="outline" size="lg" onClick={() => navigate('/auth')} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Already have an account?
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-12">
            
            
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
                <p className="text-gray-600">Complete fundamental course with actionable next steps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
          
        </Card>
      </section>
    </div>;
};
export default Index;