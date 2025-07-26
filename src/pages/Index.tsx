import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalizationFlow } from '@/components/PersonalizationFlow';
import { MinimalHeader } from '@/components/MinimalHeader';
import VideoAnimation from '@/components/ui/VideoAnimation';

import { useNavigate } from 'react-router-dom';
import { getSupabaseIconUrl, getFeatureIconUrl, getAnimationUrl, SUPABASE_ICONS } from '@/utils/supabaseIcons';
const Index = () => {
  const [showPersonalization, setShowPersonalization] = useState(false);
  const navigate = useNavigate();
  if (showPersonalization) {
    return <PersonalizationFlow onComplete={() => setShowPersonalization(false)} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <MinimalHeader />
      
      {/* Hero Section - Optimized spacing for better visual balance */}
      <section className="container mx-auto spacing-mobile spacing-mobile-y pt-24 sm:pt-32 lg:pt-40 pb-8 sm:pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Animation - Lyra landing page animation */}
          <div className="mb-12 flex justify-center">
            <VideoAnimation
              src={getAnimationUrl('lyra-rocket.mp4')}
              fallbackIcon={
                <img 
                  src={getSupabaseIconUrl(SUPABASE_ICONS.heroMain)} 
                  alt="Lyra AI Mentor - Your intelligent learning companion" 
                  className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain" 
                />
              }
              className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
              context="ui"
              autoPlay={true}
              loop={true}
              muted={true}
            />
          </div>

          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium">
            For Non-Profit & Public Interest Professionals
          </Badge>
          
          <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 text-purple-600 leading-tight text-wrap-safe">
            Master AI Without the Mystery
          </h1>
          
          <p className="text-responsive-md text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto text-wrap-safe">
            Transform your impact with AI-powered workflows. Learn practical tools, navigate ethics, and boost your mission—all with your personal AI mentor, Lyra.
          </p>
          
          <div className="flex justify-center mb-8 sm:mb-12">
            <Button size="lg" className="mobile-button bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" onClick={() => setShowPersonalization(true)}>
              Start Your AI Journey
            </Button>
          </div>
          
          {/* Key Benefits - Larger icons with clean white backgrounds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-16">
            <Card className="mobile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="mobile-card text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border border-gray-100">
                  <img src={getFeatureIconUrl('learningTarget')} alt="Tailored Learning" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Tailored Learning</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Personalized to your role, tech comfort, and learning style</p>
              </CardContent>
            </Card>
            
            <Card className="mobile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="mobile-card text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border border-gray-100">
                  <img src={getFeatureIconUrl('missionHeart')} alt="Mission-Focused" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Mission-Focused</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Real-world examples from fundraising to program delivery</p>
              </CardContent>
            </Card>
            
            <Card className="mobile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <CardContent className="mobile-card text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border border-gray-100">
                  <img src={getFeatureIconUrl('achievementTrophy')} alt="Confidence Building" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Confidence Building</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Complete fundamental courses with actionable next steps</p>
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
    </div>;
};
export default Index;