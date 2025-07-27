import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Eye, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

type DavidJourneyPhase = 'intro' | 'data-visualization' | 'story-extraction' | 'impact-reporting' | 'complete';

const DavidDataJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStory } = useCharacterStory();
  const [currentPhase, setCurrentPhase] = useState<DavidJourneyPhase>('intro');
  
  const davidStory = getStory('david');

  const handlePhaseChange = (phase: DavidJourneyPhase) => {
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
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <BarChart3 className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          David's Data Storytelling Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join David Chen as he transforms invisible data into compelling stories that drive engagement and understanding.
        </p>
      </div>

      {davidStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Meet David Chen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-2">The Challenge</h3>
                <p className="text-gray-700">{davidStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-700 mb-2">The Transformation</h3>
                <p className="text-gray-700">{davidStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-800 italic">"{davidStory.quote}"</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {davidStory.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{davidStory.timeMetrics.before}</div>
                <div className="text-sm text-gray-600">Before</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{davidStory.timeMetrics.after}</div>
                <div className="text-sm text-gray-600">After</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => handlePhaseChange('data-visualization')}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg"
        >
          Begin Data Visualization <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderDataVisualization = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
            Data Visualization Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            David's breakthrough came when he learned that data visualization isn't about charts—it's about clarity. 
            Discover how to make your data speak to everyone.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-700 mb-3">David's Visualization Principles</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Every number represents a real person</li>
                <li>• Simple beats complex every time</li>
                <li>• Context is everything</li>
                <li>• Tell the story behind the data</li>
                <li>• Make it actionable</li>
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-700 mb-3">Your Data Story</h3>
              <p className="text-gray-700 mb-4">
                What story is your organization's data trying to tell?
              </p>
              <textarea 
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Describe one key metric that shows your impact..."
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <h3 className="font-semibold text-emerald-700 mb-3">David's Transformation Framework</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <h4 className="font-semibold">Collect</h4>
                <p className="text-sm text-gray-600">Gather meaningful data</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <h4 className="font-semibold">Clarify</h4>
                <p className="text-sm text-gray-600">Find the key insight</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <h4 className="font-semibold">Visualize</h4>
                <p className="text-sm text-gray-600">Make it clear</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                <h4 className="font-semibold">Communicate</h4>
                <p className="text-sm text-gray-600">Share the story</p>
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
              onClick={() => handlePhaseChange('story-extraction')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              Continue to Story Extraction <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStoryExtraction = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-emerald-600" />
            Story Extraction Workshop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            David discovered that every dataset contains multiple stories. The key is knowing which story to tell and when. 
            Learn his systematic approach to extracting compelling narratives from data.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-emerald-700">David's Story Types</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded border-l-4 border-emerald-400">
                  <h4 className="font-medium">Progress Stories</h4>
                  <p className="text-sm text-gray-600">Show improvement over time</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded border-l-4 border-emerald-400">
                  <h4 className="font-medium">Comparison Stories</h4>
                  <p className="text-sm text-gray-600">Benchmark against others</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded border-l-4 border-emerald-400">
                  <h4 className="font-medium">Impact Stories</h4>
                  <p className="text-sm text-gray-600">Connect data to human outcomes</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-teal-700">Your Story Selection</h3>
              <div className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-3">
                  Which type of story would best serve your next presentation or report?
                </p>
                <select className="w-full p-2 border rounded">
                  <option>Select a story type...</option>
                  <option>Progress Story</option>
                  <option>Comparison Story</option>
                  <option>Impact Story</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('data-visualization')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={() => handlePhaseChange('impact-reporting')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              Continue to Impact Reporting <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderImpactReporting = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600" />
            Impact Reporting Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            David's ultimate achievement: transforming board meetings from data dumps into strategic conversations. 
            See how he increased engagement by 156% and board understanding by 200%.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-700 mb-3">David's Results</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 156% increase in donor engagement</li>
                <li>• 200% improvement in board understanding</li>
                <li>• Monthly reports became strategic tools</li>
                <li>• Data-driven decision making adopted</li>
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-700 mb-3">Your Impact Strategy</h3>
              <p className="text-gray-700 mb-4">
                Ready to transform your data into organizational intelligence?
              </p>
              <Button 
                onClick={() => handlePhaseChange('complete')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                Complete David's Journey
              </Button>
            </div>
          </div>

          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('story-extraction')}
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
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <TrendingUp className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You've completed David's Data Storytelling Journey. You now have the skills to transform your data into compelling stories that drive engagement and understanding.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3"
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
      case 'data-visualization':
        return renderDataVisualization();
      case 'story-extraction':
        return renderStoryExtraction();
      case 'impact-reporting':
        return renderImpactReporting();
      case 'complete':
        return renderCompletePhase();
      default:
        return renderIntroPhase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <MicroLessonNavigator
        chapterNumber={4}
        chapterTitle="David's Data Journey"
        lessonTitle="Interactive David Journey"
        characterName="David"
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

export default DavidDataJourney;