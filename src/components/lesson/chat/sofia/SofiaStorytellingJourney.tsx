import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Heart, Users, ChevronRight, ArrowLeft } from 'lucide-react';

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
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sofia's Storytelling Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join Sofia Martinez as she discovers her authentic voice and transforms organizational impact through powerful storytelling.
        </p>
      </div>

      {sofiaStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              Meet Sofia Martinez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-purple-700 mb-2">The Challenge</h3>
                <p className="text-gray-700">{sofiaStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700 mb-2">The Transformation</h3>
                <p className="text-gray-700">{sofiaStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-purple-800 italic">"{sofiaStory.quote}"</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {sofiaStory.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => handlePhaseChange('voice-discovery')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
        >
          Begin Voice Discovery <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
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
            <Sparkles className="w-8 h-8 text-purple-600" />
            Voice Discovery Workshop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Sofia's first breakthrough came when she learned to identify her authentic voice. 
            Like Sofia, you'll discover the unique perspective that makes your stories powerful.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-3">What Sofia Learned</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Your personal connection to the mission is your superpower</li>
                <li>• Vulnerability creates authentic connection</li>
                <li>• Every data point represents a real person's story</li>
                <li>• Your unique perspective matters</li>
              </ul>
            </div>
            
            <div className="p-6 bg-pink-50 rounded-lg">
              <h3 className="font-semibold text-pink-700 mb-3">Your Voice Discovery</h3>
              <p className="text-gray-700 mb-4">
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
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('intro')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={() => handlePhaseChange('story-crafting')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Continue to Story Crafting <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
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
            <Users className="w-8 h-8 text-purple-600" />
            Story Crafting Masterclass
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Sofia transformed her organization's impact by learning to craft compelling narratives. 
            Now it's your turn to build stories that move hearts and minds.
          </p>
          
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-3">Sofia's Story Framework</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <h4 className="font-semibold">Connect</h4>
                <p className="text-sm text-gray-600">Start with shared values</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <h4 className="font-semibold">Transform</h4>
                <p className="text-sm text-gray-600">Show the journey</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <h4 className="font-semibold">Inspire</h4>
                <p className="text-sm text-gray-600">Call to action</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('voice-discovery')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={() => handlePhaseChange('impact-communication')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Continue to Impact Communication <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
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
            <Sparkles className="w-8 h-8 text-purple-600" />
            Impact Communication Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Sofia's final transformation: turning stories into measurable impact. 
            Learn how she secured $2.5M in funding and 3x donor engagement.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-3">Sofia's Results</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• $2.5M in new funding secured</li>
                <li>• 3x increase in donor engagement</li>
                <li>• Board members became story ambassadors</li>
                <li>• Community partnerships doubled</li>
              </ul>
            </div>
            
            <div className="p-6 bg-pink-50 rounded-lg">
              <h3 className="font-semibold text-pink-700 mb-3">Your Impact Plan</h3>
              <p className="text-gray-700 mb-4">
                Ready to apply Sofia's strategies to your organization?
              </p>
              <Button 
                onClick={() => handlePhaseChange('complete')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Complete Sofia's Journey
              </Button>
            </div>
          </div>

          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('story-crafting')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
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
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You've completed Sofia's Storytelling Journey. You now have the tools to discover your authentic voice and create compelling narratives that drive real impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentPhase('intro')}
          >
            Restart Journey
          </Button>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SofiaStorytellingJourney;