import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandedButton } from '@/components/ui/BrandedButton';
import { BrandedIcon } from '@/components/ui/BrandedIcon';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getSupabaseIconUrl } from '@/utils/supabaseIcons';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

type CarmenJourneyPhase = 'intro' | 'talent-acquisition' | 'performance-insights' | 'engagement-building' | 'retention-mastery' | 'complete';

const CarmenPeopleManagementJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStory } = useCharacterStory();
  const [currentPhase, setCurrentPhase] = useState<CarmenJourneyPhase>('intro');
  
  const carmenStory = getStory('carmen');

  const handlePhaseChange = (phase: CarmenJourneyPhase) => {
    setCurrentPhase(phase);
  };

  const renderIntroPhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <img 
            src={getSupabaseIconUrl('lyra-avatar.png')} 
            alt="Carmen Rodriguez"
            className="w-full h-full rounded-full object-cover border-4 border-orange-400/20"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
          Carmen's People Management Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join Carmen Rodriguez as she transforms HR from overwhelming manual processes into AI-powered people management that puts humanity first.
        </p>
      </div>

      {carmenStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BrandedIcon 
                type="mission" 
                variant="static" 
                size="lg"
                className="text-orange-600"
              />
              Meet Carmen Rodriguez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-orange-600 mb-2">The Challenge</h3>
                <p className="text-muted-foreground">{carmenStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600 mb-2">The Transformation</h3>
                <p className="text-muted-foreground">{carmenStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-600/10 to-amber-500/10 rounded-lg border border-orange-400/20">
              <p className="text-orange-700 italic">"{carmenStory.quote}"</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">70%</div>
                <div className="text-sm text-orange-700">Faster Hiring</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">45%</div>
                <div className="text-sm text-amber-700">Better Retention</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">200%</div>
                <div className="text-sm text-yellow-700">Team Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <BrandedButton 
          onClick={() => handlePhaseChange('talent-acquisition')}
          icon="mission"
          size="lg"
          className="text-lg px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Begin People Management Journey <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderTalentAcquisition = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">Smart Talent Acquisition</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Carmen's first breakthrough: AI-powered hiring that finds the right people faster while preserving the human connection.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-6">
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-700 mb-3">The Problem</h3>
            <p className="text-orange-600 mb-4">
              "We were posting jobs and hoping for the best. Screening 200+ applications manually was burning me out, 
              and great candidates were slipping through the cracks during our 6-week hiring process."
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-orange-700">6 weeks average time-to-hire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-orange-700">200+ applications per position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-orange-700">Manual screening burnout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-orange-700">Lost quality candidates</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-700 mb-3">The AI Solution</h3>
            <p className="text-green-600 mb-4">
              "AI helped me build smarter job descriptions, create screening questions that actually work, 
              and develop interview guides that find culture fits, not just skill matches."
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">1.8 weeks average time-to-hire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Pre-qualified top 20 candidates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Structured culture-fit interviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">85% offer acceptance rate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('intro')}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/talent-acquisition')}
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Try AI Talent Acquisition <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderPerformanceInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">Performance Insights</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Move beyond annual reviews to continuous, data-driven performance management that helps your team thrive.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('talent-acquisition')}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/performance-insights')}
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Build Performance Dashboard <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderEngagementBuilding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">Engagement Building</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create engagement strategies that actually work using AI-powered insights and personalized approaches.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('performance-insights')}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/engagement-builder')}
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Build Engagement Strategy <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderRetentionMastery = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">Retention Mastery</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the art of keeping your best people with AI-powered retention strategies and early warning systems.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('engagement-building')}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/retention-mastery')}
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Master Retention Strategy <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderCompletePhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 text-center"
    >
      <div className="w-32 h-32 mx-auto mb-6">
        <img 
          src={getSupabaseIconUrl('lyra-avatar.png')} 
          alt="Carmen Rodriguez"
          className="w-full h-full rounded-full object-cover border-4 border-orange-400/20"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
        Congratulations!
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        You've completed Carmen's People Management Journey. You now have the AI tools to transform your HR processes while keeping humanity at the center.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <BrandedButton 
          onClick={() => navigate('/dashboard')}
          icon="achievement"
          size="lg"
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          Continue Learning Journey
        </BrandedButton>
        <BrandedButton 
          variant="outline"
          onClick={() => navigate('/chapter/7')}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          Back to Chapter 7
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return renderIntroPhase();
      case 'talent-acquisition':
        return renderTalentAcquisition();
      case 'performance-insights':
        return renderPerformanceInsights();
      case 'engagement-building':
        return renderEngagementBuilding();
      case 'retention-mastery':
        return renderRetentionMastery();
      case 'complete':
        return renderCompletePhase();
      default:
        return renderIntroPhase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-amber-50">
      <MicroLessonNavigator
        chapterNumber={7}
        chapterTitle="Carmen's People Management Journey"
        lessonTitle="Interactive Carmen Journey"
        characterName="Carmen"
        progress={currentPhase === 'complete' ? 100 : 50}
        showCelebration={currentPhase === 'complete'}
      />
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CarmenPeopleManagementJourney;