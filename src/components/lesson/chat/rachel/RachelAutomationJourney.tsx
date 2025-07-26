import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacterStory } from '../../../../contexts/CharacterStoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Clock, Users, ChevronRight, ArrowLeft } from 'lucide-react';

type RachelJourneyPhase = 'intro' | 'workflow-design' | 'automation-building' | 'team-efficiency' | 'complete';

const RachelAutomationJourney: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStory } = useCharacterStory();
  const [currentPhase, setCurrentPhase] = useState<RachelJourneyPhase>('intro');
  
  const rachelStory = getStory('rachel');

  const handlePhaseChange = (phase: RachelJourneyPhase) => {
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
        <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Zap className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Rachel's Automation Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join Rachel Thompson as she transforms her drowning team into an efficient powerhouse through AI-powered automation workflows.
        </p>
      </div>

      {rachelStory && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              Meet Rachel Thompson
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-teal-700 mb-2">The Challenge</h3>
                <p className="text-gray-700">{rachelStory.challenge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-teal-700 mb-2">The Transformation</h3>
                <p className="text-gray-700">{rachelStory.transformation}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <p className="text-teal-800 italic">"{rachelStory.quote}"</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {rachelStory.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-teal-100 text-teal-700">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{rachelStory.timeMetrics.before}</div>
                <div className="text-sm text-gray-600">Before</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{rachelStory.timeMetrics.after}</div>
                <div className="text-sm text-gray-600">After</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => handlePhaseChange('workflow-design')}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
        >
          Begin Workflow Design <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderWorkflowDesign = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-teal-600" />
            Workflow Design Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Rachel's first breakthrough was learning to see her team's work as a series of interconnected workflows. 
            Once she mapped these out, automation opportunities became obvious.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-700 mb-3">Rachel's Workflow Principles</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Map before you automate</li>
                <li>• Start with the most repetitive tasks</li>
                <li>• Focus on high-volume, low-decision work</li>
                <li>• Always keep humans in the loop for key decisions</li>
                <li>• Measure impact, not just efficiency</li>
              </ul>
            </div>
            
            <div className="p-6 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-700 mb-3">Your Workflow Mapping</h3>
              <p className="text-gray-700 mb-4">
                What repetitive task consumes the most time in your organization?
              </p>
              <textarea 
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Describe a task your team does repeatedly..."
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
            <h3 className="font-semibold text-teal-700 mb-3">Rachel's Automation Assessment</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <h4 className="font-semibold">Frequency</h4>
                <p className="text-sm text-gray-600">How often is this done?</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <h4 className="font-semibold">Complexity</h4>
                <p className="text-sm text-gray-600">How many decisions required?</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <h4 className="font-semibold">Impact</h4>
                <p className="text-sm text-gray-600">What time would be saved?</p>
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
              onClick={() => handlePhaseChange('automation-building')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              Continue to Automation Building <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAutomationBuilding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-teal-600" />
            Automation Building Workshop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Rachel discovered that building effective automation isn't about replacing humans—it's about amplifying their impact. 
            Learn her systematic approach to creating workflows that actually work.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-teal-700">Rachel's Automation Types</h3>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                  <h4 className="font-medium">Data Collection</h4>
                  <p className="text-sm text-gray-600">Automatically gather and organize information</p>
                </div>
                <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                  <h4 className="font-medium">Communication</h4>
                  <p className="text-sm text-gray-600">Send updates and notifications</p>
                </div>
                <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                  <h4 className="font-medium">Report Generation</h4>
                  <p className="text-sm text-gray-600">Create consistent, formatted reports</p>
                </div>
                <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                  <h4 className="font-medium">Process Triggers</h4>
                  <p className="text-sm text-gray-600">Start workflows based on events</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-cyan-700">Your Automation Plan</h3>
              <div className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-3">
                  Which automation type would provide the biggest impact for your team?
                </p>
                <select className="w-full p-2 border rounded mb-3">
                  <option>Select automation type...</option>
                  <option>Data Collection</option>
                  <option>Communication</option>
                  <option>Report Generation</option>
                  <option>Process Triggers</option>
                </select>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Describe how this would help your team..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('workflow-design')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={() => handlePhaseChange('team-efficiency')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              Continue to Team Efficiency <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderTeamEfficiency = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-600" />
            Team Efficiency Transformation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Rachel's greatest success was getting her team to embrace automation instead of fear it. 
            She saved 20 hours per week across the team and made everyone happier in the process.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-teal-50 rounded-lg">
              <h3 className="font-semibold text-teal-700 mb-3">Rachel's Results</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 60% of routine tasks automated</li>
                <li>• 20 hours/week saved across team</li>
                <li>• 40% increase in strategic work time</li>
                <li>• Happier, more engaged team</li>
                <li>• Zero job losses from automation</li>
              </ul>
            </div>
            
            <div className="p-6 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-700 mb-3">Your Efficiency Strategy</h3>
              <p className="text-gray-700 mb-4">
                Ready to transform your team's relationship with technology?
              </p>
              <Button 
                onClick={() => handlePhaseChange('complete')}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                Complete Rachel's Journey
              </Button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
            <h3 className="font-semibold text-teal-700 mb-3">Rachel's Team Transformation Secret</h3>
            <p className="text-gray-700">
              "I learned that automation anxiety comes from fear of being replaced. Instead, I positioned every automation as 
              freeing up time for the meaningful work only humans can do. Once my team saw automation as their ally, not their enemy, 
              everything changed."
            </p>
          </div>

          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={() => handlePhaseChange('automation-building')}
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
        <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Zap className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          You've completed Rachel's Automation Journey. You now have the knowledge to design and implement AI-powered workflows that amplify your team's impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3"
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
      case 'workflow-design':
        return renderWorkflowDesign();
      case 'automation-building':
        return renderAutomationBuilding();
      case 'team-efficiency':
        return renderTeamEfficiency();
      case 'complete':
        return renderCompletePhase();
      default:
        return renderIntroPhase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {renderPhase()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RachelAutomationJourney;