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
            alt="Carmen Rodriguez, HR Leader and AI Mentor - Your guide through the People Management Journey"
            className="w-full h-full rounded-full object-cover border-4 border-purple-400/20"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent" id="main-heading">
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
                className="text-purple-600"
              />
              Meet Carmen Rodriguez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">The Challenge</h3>
                <p className="text-muted-foreground">{carmenStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">The Transformation</h3>
                <p className="text-muted-foreground">{carmenStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 rounded-lg border border-purple-400/20">
              <p className="text-purple-700 italic">"{carmenStory.quote}"</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">70%</div>
                <div className="text-sm text-purple-700">Faster Hiring</div>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="text-2xl font-bold text-cyan-600">45%</div>
                <div className="text-sm text-cyan-700">Better Retention</div>
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
          className="text-lg px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Start Carmen's interactive people management journey - Learn AI-powered hiring, performance insights, engagement building, and retention strategies"
        >
          Begin People Management Journey <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
          <span className="sr-only">This will start an interactive journey through four phases: talent acquisition, performance insights, engagement building, and retention mastery</span>
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
        <h2 className="text-3xl font-bold mb-4 text-purple-600" id="talent-acquisition-heading">Smart Talent Acquisition</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Carmen's first breakthrough: AI-powered hiring that finds the right people faster while preserving the human connection.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-700 mb-3">The Problem</h3>
            <p className="text-purple-600 mb-4">
              "We were posting jobs and hoping for the best. Screening 200+ applications manually was burning me out, 
              and great candidates were slipping through the cracks during our 6-week hiring process."
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-purple-700">6 weeks average time-to-hire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-purple-700">200+ applications per position</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-purple-700">Manual screening burnout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-purple-700">Lost quality candidates</span>
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
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
          aria-label="Go back to journey introduction"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/talent-acquisition')}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Launch interactive talent acquisition workshop - Build your AI-powered hiring strategy"
        >
          Try AI Talent Acquisition <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
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
        <h2 className="text-3xl font-bold mb-4 text-purple-600" id="performance-insights-heading">Performance Insights</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Move beyond annual reviews to continuous, data-driven performance management that helps your team thrive.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('talent-acquisition')}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/performance-insights')}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Launch interactive performance insights workshop - Create data-driven performance management systems"
        >
          Build Performance Dashboard <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
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
        <h2 className="text-3xl font-bold mb-4 text-purple-600" id="engagement-building-heading">Engagement Building</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create engagement strategies that actually work using AI-powered insights and personalized approaches.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('performance-insights')}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/engagement-builder')}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Launch interactive engagement builder workshop - Develop personalized team engagement strategies"
        >
          Build Engagement Strategy <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
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
        <h2 className="text-3xl font-bold mb-4 text-purple-600" id="retention-mastery-heading">Retention Mastery</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the art of keeping your best people with AI-powered retention strategies and early warning systems.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto">
        <BrandedButton 
          variant="outline"
          onClick={() => handlePhaseChange('engagement-building')}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </BrandedButton>
        <BrandedButton 
          onClick={() => navigate('/chapter/7/interactive/retention-mastery')}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Launch interactive retention mastery workshop - Build predictive retention strategies with AI insights"
        >
          Master Retention Strategy <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
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
          alt="Carmen Rodriguez celebrating successful completion of the People Management Journey"
          className="w-full h-full rounded-full object-cover border-4 border-purple-400/20"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent" id="completion-heading">
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
          className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          aria-label="Continue to main dashboard to explore more learning opportunities"
        >
          Continue Learning Journey
        </BrandedButton>
        <BrandedButton 
          variant="outline"
          onClick={() => navigate('/chapter/7')}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
          aria-label="Return to Chapter 7 main page"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-cyan-50">
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