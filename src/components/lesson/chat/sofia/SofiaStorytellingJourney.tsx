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

type SofiaJourneyPhase = 'intro' | 'voice-discovery' | 'story-crafting' | 'impact-communication' | 'complete';

const SofiaStorytellingJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStory } = useCharacterStory();
  const [currentPhase, setCurrentPhase] = useState<SofiaJourneyPhase>('intro');
  
  const sofiaStory = getStory('sofia');

  const handlePhaseChange = (phase: SofiaJourneyPhase) => {
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
            alt="Sofia Martinez"
            className="w-full h-full rounded-full object-cover border-4 border-primary/20"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
          Sofia's Storytelling Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join Sofia Martinez as she discovers her authentic voice and transforms organizational impact through powerful storytelling.
        </p>
      </div>

      {sofiaStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BrandedIcon 
                type="mission" 
                variant="static" 
                size="lg"
                className="text-primary"
              />
              Meet Sofia Martinez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">The Challenge</h3>
                <p className="text-muted-foreground">{sofiaStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">The Transformation</h3>
                <p className="text-muted-foreground">{sofiaStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <p className="text-primary italic">"{sofiaStory.quote}"</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {sofiaStory.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <BrandedButton 
          onClick={() => handlePhaseChange('voice-discovery')}
          icon="mission"
          size="lg"
          className="text-lg px-8 py-3"
        >
          Begin Voice Discovery <ChevronRight className="w-5 h-5 ml-2" />
        </BrandedButton>
      </div>
    </motion.div>
  );

  const renderVoiceDiscovery = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BrandedIcon 
              type="communication" 
              variant="static" 
              size="lg"
              className="text-primary"
            />
            Voice Discovery Workshop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Sofia's first breakthrough came when she learned to identify her authentic voice. 
            Like Sofia, you'll discover the unique perspective that makes your stories powerful.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-primary/5 rounded-lg">
              <h3 className="font-semibold text-primary mb-3">What Sofia Learned</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your personal connection to the mission is your superpower</li>
                <li>• Vulnerability creates authentic connection</li>
                <li>• Every data point represents a real person's story</li>
                <li>• Your unique perspective matters</li>
              </ul>
            </div>
            
            <div className="p-6 bg-secondary/5 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Your Voice Discovery</h3>
              <p className="text-muted-foreground mb-4">
                Take a moment to reflect on what makes your organization's story unique.
              </p>
              <textarea 
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="What personal connection do you have to your organization's mission?"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <BrandedButton 
              variant="outline"
              onClick={() => handlePhaseChange('intro')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </BrandedButton>
            <BrandedButton 
              onClick={() => handlePhaseChange('story-crafting')}
              icon="growth"
            >
              Continue to Story Crafting <ChevronRight className="w-4 h-4 ml-2" />
            </BrandedButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStoryCrafting = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BrandedIcon 
              type="network" 
              variant="static" 
              size="lg"
              className="text-primary"
            />
            Story Crafting Masterclass
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Sofia transformed her organization's impact by learning to craft compelling narratives. 
            Now it's your turn to build stories that move hearts and minds.
          </p>
          
          <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <h3 className="font-semibold text-primary mb-3">Sofia's Story Framework</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <h4 className="font-semibold">Connect</h4>
                <p className="text-sm text-muted-foreground">Start with shared values</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <h4 className="font-semibold">Transform</h4>
                <p className="text-sm text-muted-foreground">Show the journey</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <h4 className="font-semibold">Inspire</h4>
                <p className="text-sm text-muted-foreground">Call to action</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <BrandedButton 
              variant="outline"
              onClick={() => handlePhaseChange('voice-discovery')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </BrandedButton>
            <BrandedButton 
              onClick={() => handlePhaseChange('impact-communication')}
              icon="achievement"
            >
              Continue to Impact Communication <ChevronRight className="w-4 h-4 ml-2" />
            </BrandedButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderImpactCommunication = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BrandedIcon 
              type="achievement" 
              variant="static" 
              size="lg"
              className="text-primary"
            />
            Impact Communication Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Sofia's final transformation: turning stories into measurable impact. 
            Learn how she secured $2.5M in funding and 3x donor engagement.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-primary/5 rounded-lg">
              <h3 className="font-semibold text-primary mb-3">Sofia's Results</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• $2.5M in new funding secured</li>
                <li>• 3x increase in donor engagement</li>
                <li>• Board members became story ambassadors</li>
                <li>• Community partnerships doubled</li>
              </ul>
            </div>
            
            <div className="p-6 bg-secondary/5 rounded-lg">
              <h3 className="font-semibold text-secondary mb-3">Your Impact Plan</h3>
              <p className="text-muted-foreground mb-4">
                Ready to apply Sofia's strategies to your organization?
              </p>
              <BrandedButton 
                onClick={() => handlePhaseChange('complete')}
                className="w-full"
                icon="achievement"
              >
                Complete Sofia's Journey
              </BrandedButton>
            </div>
          </div>

          <div className="flex justify-start">
            <BrandedButton 
              variant="outline"
              onClick={() => handlePhaseChange('story-crafting')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </BrandedButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCompletePhase = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <BrandedIcon 
            type="achievement" 
            variant="animated" 
            size="xl"
            className="w-full h-full"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          You've completed Sofia's Storytelling Journey. You now have the tools to discover your authentic voice and create compelling narratives that drive real impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BrandedButton 
            onClick={() => navigate('/dashboard')}
            icon="achievement"
            size="lg"
            className="px-8 py-3"
          >
            Return to Dashboard
          </BrandedButton>
          <BrandedButton 
            variant="outline"
            onClick={() => setCurrentPhase('intro')}
          >
            Restart Journey
          </BrandedButton>
        </div>
      </div>
    </motion.div>
  );

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return renderIntroPhase();
      case 'voice-discovery':
        return renderVoiceDiscovery();
      case 'story-crafting':
        return renderStoryCrafting();
      case 'impact-communication':
        return renderImpactCommunication();
      case 'complete':
        return renderCompletePhase();
      default:
        return renderIntroPhase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SofiaStorytellingJourney;