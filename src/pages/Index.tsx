import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalizationFlow } from '@/components/PersonalizationFlow';
import { MinimalHeader } from '@/components/MinimalHeader';
import { OptimizedVideoAnimation } from '@/components/performance/OptimizedVideoAnimation';

import { useNavigate } from 'react-router-dom';
import { getSupabaseIconUrl, getFeatureIconUrl, getAnimationUrl, SUPABASE_ICONS } from '@/utils/supabaseIcons';
const Index = () => {
  const [showPersonalization, setShowPersonalization] = useState(false);
  const navigate = useNavigate();
  if (showPersonalization) {
    return <PersonalizationFlow onComplete={() => setShowPersonalization(false)} />;
  }
  return <div className="min-h-screen" style={{background: 'var(--nm-bg)'}}>
      <MinimalHeader />
      
      {/* Hero Section - Neumorphic styled with enhanced spacing */}
      <section className="container mx-auto spacing-mobile spacing-mobile-y pt-24 sm:pt-32 lg:pt-40 pb-8 sm:pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Animation Container - Neumorphic styled */}
          <div className="mb-12 flex justify-center">
            <div className="nm-hero-card p-8">
              <OptimizedVideoAnimation
                src={getAnimationUrl('lyra-landing-page.mp4')}
                fallbackIcon={
                  <img 
                    src={getSupabaseIconUrl(SUPABASE_ICONS.heroMain)} 
                    alt="Lyra AI Mentor - Your intelligent learning companion" 
                    className="w-61 h-61 sm:w-68 sm:h-68 md:w-81 md:h-81 object-contain" 
                  />
                }
                className="w-61 h-61 sm:w-68 sm:h-68 md:w-81 md:h-81"
                context="ui"
                autoPlay={true}
                loop={true}
                muted={true}
              />
            </div>
          </div>

          <div className="nm-badge nm-badge-primary mb-4 sm:mb-6 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium inline-block">
            For Non-Profit & Public Interest Professionals
          </div>
          
          <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 text-purple-600 leading-tight text-wrap-safe">
            Master AI Without the Mystery
          </h1>
          
          <p className="text-responsive-md text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto text-wrap-safe">
            Transform your impact with AI-powered workflows. Learn practical tools, navigate ethics, and boost your mission—all with your personal AI mentor, Lyra.
          </p>
          
          <div className="flex justify-center mb-8 sm:mb-12">
            <button className="nm-button nm-button-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold" onClick={() => setShowPersonalization(true)}>
              Start Your AI Journey
            </button>
          </div>
          
          {/* Key Benefits - Neumorphic feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-16">
            <div className="nm-feature-card p-6 text-center">
              <div className="nm-icon w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
                <img src={getFeatureIconUrl('learningTarget')} alt="Tailored Learning" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Tailored Learning</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Personalized to your role, tech comfort, and learning style</p>
            </div>
            
            <div className="nm-feature-card p-6 text-center">
              <div className="nm-icon w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
                <img src={getFeatureIconUrl('missionHeart')} alt="Mission-Focused" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Mission-Focused</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Real-world examples from fundraising to program delivery</p>
            </div>
            
            <div className="nm-feature-card p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="nm-icon w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4">
                <img src={getFeatureIconUrl('achievementTrophy')} alt="Confidence Building" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 text-wrap-safe">Confidence Building</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-wrap-safe">Complete fundamental courses with actionable next steps</p>
            </div>
          </div>
        </div>
      </section>

    </div>;
};
export default Index;