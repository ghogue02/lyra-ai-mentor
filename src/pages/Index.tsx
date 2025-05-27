
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={true} />
      
      {/* Hero Section */}
      <section className="container mx-auto spacing-mobile spacing-mobile-y pt-20 pb-8 sm:pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/78b6315a-aa2d-415e-b3a1-fa9b74b33b97.png" 
              alt="AI Mentor Lyra"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>

          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium">
            For Non-Profit & Public Interest Professionals
          </Badge>
          
          <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 text-purple-600 leading-tight">
            Master AI Without the Mystery
          </h1>
          
          <p className="text-responsive-md text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Transform your impact with AI-powered workflows. Learn practical tools, navigate ethics, and boost your mission—all with your personal AI mentor, Lyra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12">
            <Button 
              size="lg" 
              className="mobile-button bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
              onClick={() => setShowPersonalization(true)}
            >
              Start Your AI Journey
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth')} 
              className="mobile-button flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Already have an account?</span>
              <span className="xs:hidden">Sign In</span>
            </Button>
          </div>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-16">
            <Card className="mobile-card border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Tailored Learning</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Personalized to your role, tech comfort, and learning style</p>
              </CardContent>
            </Card>
            
            <Card className="mobile-card border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Mission-Focused</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Real-world examples from fundraising to program delivery</p>
              </CardContent>
            </Card>
            
            <Card className="mobile-card border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Confidence Building</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Complete fundamental course with actionable next steps</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto spacing-mobile py-8 sm:py-16 text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
          
        </Card>
      </section>
    </div>
  );
};

export default Index;
