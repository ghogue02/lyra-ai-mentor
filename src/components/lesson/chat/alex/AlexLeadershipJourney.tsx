import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Target, Users, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

type AlexJourneyPhase = 'intro' | 'change-leadership' | 'strategic-planning' | 'team-alignment' | 'complete';

const AlexLeadershipJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStory } = useCharacterStory();
  const [currentPhase, setCurrentPhase] = useState<AlexJourneyPhase>('intro');
  
  const alexStory = getStory('alex');

  const handlePhaseChange = (phase: AlexJourneyPhase) => {
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
        <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Crown className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Alex's Leadership Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join Alex Rivera as they transform a tech-resistant team into AI champions through inclusive change management and strategic leadership.
        </p>
      </div>

      {alexStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              Meet Alex Rivera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-violet-700 mb-2">The Challenge</h3>
                <p className="text-gray-700">{alexStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-violet-700 mb-2">The Transformation</h3>
                <p className="text-gray-700">{alexStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
              <p className="text-violet-800 italic">"{alexStory.quote}"</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {alexStory.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-violet-100 text-violet-700">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{alexStory.timeMetrics.before}</div>
                <div className="text-sm text-gray-600">Before</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{alexStory.timeMetrics.after}</div>
                <div className="text-sm text-gray-600">After</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => handlePhaseChange('change-leadership')}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          Begin Change Leadership <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderChangeLeadership = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-8 h-8 text-violet-600" />
            Change Leadership Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Alex's breakthrough came when they realized that resistance to AI wasn't about technology—it was about fear. 
            By addressing the human side of change first, transformation became possible.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-violet-50 rounded-lg">
              <h3 className="font-semibold text-violet-700 mb-3">Alex's Change Principles</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Lead with empathy, not technology</li>
                <li>• Address fears before features</li>
                <li>• Start with willing champions</li>
                <li>• Show quick wins to build confidence</li>
                <li>• Make change feel collaborative, not imposed</li>
              </ul>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-3">Your Change Assessment</h3>
              <p className="text-gray-700 mb-4">
                What's the biggest fear your team has about AI?
              </p>
              <textarea 
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Describe your team's main concerns about AI..."
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-violet-700 mb-3">Alex's Transformation Framework</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <h4 className="font-semibold">Listen</h4>
                <p className="text-sm text-gray-600">Understand resistance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <h4 className="font-semibold">Educate</h4>
                <p className="text-sm text-gray-600">Share possibilities</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <h4 className="font-semibold">Experiment</h4>
                <p className="text-sm text-gray-600">Start small</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                <h4 className="font-semibold">Scale</h4>
                <p className="text-sm text-gray-600">Expand success</p>
              </div>
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
              onClick={() => handlePhaseChange('strategic-planning')}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Continue to Strategic Planning <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStrategicPlanning = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-violet-600" />
            Strategic Planning Workshop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Alex learned that successful AI adoption requires more than just good tools—it needs a clear strategy that aligns with organizational mission and values.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-violet-700">Alex's Strategic Framework</h3>
              <div className="space-y-3">
                <div className="p-3 bg-violet-50 rounded border-l-4 border-violet-400">
                  <h4 className="font-medium">Mission Alignment</h4>
                  <p className="text-sm text-gray-600">How does AI advance our core purpose?</p>
                </div>
                <div className="p-3 bg-violet-50 rounded border-l-4 border-violet-400">
                  <h4 className="font-medium">Capacity Building</h4>
                  <p className="text-sm text-gray-600">What skills do we need to develop?</p>
                </div>
                <div className="p-3 bg-violet-50 rounded border-l-4 border-violet-400">
                  <h4 className="font-medium">Impact Measurement</h4>
                  <p className="text-sm text-gray-600">How will we track success?</p>
                </div>
                <div className="p-3 bg-violet-50 rounded border-l-4 border-violet-400">
                  <h4 className="font-medium">Sustainable Growth</h4>
                  <p className="text-sm text-gray-600">How do we scale responsibly?</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-700">Your Strategic Vision</h3>
              <div className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-3">
                  How could AI help your organization better achieve its mission?
                </p>
                <textarea 
                  className="w-full p-2 border rounded mb-3"
                  rows={3}
                  placeholder="Describe your AI vision..."
                />
                <p className="text-gray-700 mb-2">
                  What would success look like in 6 months?
                </p>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Define your success metrics..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('change-leadership')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={() => handlePhaseChange('team-alignment')}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              Continue to Team Alignment <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderTeamAlignment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-8 h-8 text-violet-600" />
            Team Alignment Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Alex's greatest achievement was turning a team of skeptics into AI champions. 
            They achieved 100% team buy-in and a 40% efficiency gain while keeping everyone engaged and excited.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-violet-50 rounded-lg">
              <h3 className="font-semibold text-violet-700 mb-3">Alex's Results</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 100% team buy-in achieved</li>
                <li>• 40% efficiency gain across organization</li>
                <li>• Transformed from 20% to 100% tech adoption</li>
                <li>• Happier, more engaged team</li>
                <li>• Became model for other organizations</li>
              </ul>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-3">Your Leadership Plan</h3>
              <p className="text-gray-700 mb-4">
                Ready to lead your own AI transformation with confidence?
              </p>
              <Button 
                onClick={() => handlePhaseChange('complete')}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                Complete Alex's Journey
              </Button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-violet-700 mb-3">Alex's Leadership Secret</h3>
            <p className="text-gray-700">
              "The key to leading AI transformation isn't technical expertise—it's emotional intelligence. When you help people see AI as their ally instead of their replacement, magic happens. Fear transforms into excitement, and resistance becomes enthusiasm."
            </p>
          </div>

          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('strategic-planning')}
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
        <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Crown className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You've completed Alex's Leadership Journey. You now have the skills to lead successful AI transformation while building team alignment and sustainable change.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3"
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
      case 'change-leadership':
        return renderChangeLeadership();
      case 'strategic-planning':
        return renderStrategicPlanning();
      case 'team-alignment':
        return renderTeamAlignment();
      case 'complete':
        return renderCompletePhase();
      default:
        return renderIntroPhase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <MicroLessonNavigator
        chapterNumber={5}
        chapterTitle="Alex's Leadership Journey"
        lessonTitle="Interactive Alex Journey"
        characterName="Alex"
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

export default AlexLeadershipJourney;