
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { 
  Zap, Target, Trophy, Lightbulb, Users, Calendar, 
  DollarSign, BarChart, Gamepad2, CheckCircle, Loader2
} from 'lucide-react';

// Export the completed components from InteractiveComponents
export { 
  MultipleChoiceScenarios, 
  StoryFillInBlanks, 
  SequenceSorter,
  AIToolRecommendationEngine,
  TimeSavingsCalculator
} from './InteractiveComponents';

// Export the new advanced interactive components
export {
  DonorSegmentationSimulator,
  VolunteerCoordinationGame,
  FoodRescueRouteOptimizer,
  MentorMatchingSimulator,
  AIBeforeAfterSlider,
  NonprofitAIBingo
} from './AdvancedInteractiveComponents';

// AI-Powered Components (remaining 5 of 10)
export const SuccessStoryBuilder = () => {
  const [storyData, setStoryData] = useState({
    challenge: '',
    solution: '',
    impact: ''
  });
  const [aiStory, setAiStory] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const generateStory = async () => {
    const prompt = `Challenge: ${storyData.challenge}, Solution: ${storyData.solution}, Impact: ${storyData.impact}`;
    try {
      const result = await callAI(
        'success_story',
        'Help create a compelling nonprofit success story',
        prompt
      );
      setAiStory(result);
    } catch (error) {
      setAiStory('Error generating story. Please try again!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Success Story Builder</h3>
        <p className="text-sm text-gray-600">Create compelling impact stories with AI assistance</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Challenge:</label>
          <input
            type="text"
            value={storyData.challenge}
            onChange={(e) => setStoryData(prev => ({ ...prev, challenge: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="What problem did you face?"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">AI Solution:</label>
          <input
            type="text"
            value={storyData.solution}
            onChange={(e) => setStoryData(prev => ({ ...prev, solution: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="How did AI help?"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Impact:</label>
          <input
            type="text"
            value={storyData.impact}
            onChange={(e) => setStoryData(prev => ({ ...prev, impact: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="What was the result?"
          />
        </div>
      </div>

      <Button 
        onClick={generateStory} 
        disabled={loading || !storyData.challenge}
        className="w-full"
        size="sm"
      >
        {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Lightbulb className="w-3 h-3 mr-1" />}
        Generate Story
      </Button>

      {aiStory && (
        <Card className="border border-green-200">
          <CardContent className="p-3">
            <Badge className="bg-green-100 text-green-700 mb-2">AI-Enhanced Story</Badge>
            <p className="text-sm text-gray-700">{aiStory}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const AIEthicsDecisionTree = () => {
  const [currentDecision, setCurrentDecision] = useState(0);
  const [guidance, setGuidance] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const decisions = [
    "Should we use AI to analyze donor giving patterns?",
    "Is it ethical to automate responses to sensitive volunteer inquiries?",
    "Should we use AI to screen volunteer applications?"
  ];

  const getEthicalGuidance = async () => {
    try {
      const result = await callAI(
        'ethics_guidance',
        decisions[currentDecision],
        'Nonprofit considering AI implementation for the first time'
      );
      setGuidance(result);
    } catch (error) {
      setGuidance('Error getting guidance. Please try again!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Ethics Decision Tree</h3>
        <p className="text-sm text-gray-600">Get ethical guidance for AI decisions</p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Ethical Dilemma:</h4>
          <p className="text-sm mb-3">{decisions[currentDecision]}</p>
          <Button onClick={getEthicalGuidance} disabled={loading} size="sm">
            {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Target className="w-3 h-3 mr-1" />}
            Get Ethical Guidance
          </Button>
        </CardContent>
      </Card>

      {guidance && (
        <Card className="border border-purple-200">
          <CardContent className="p-3">
            <Badge className="bg-purple-100 text-purple-700 mb-2">AI Ethics Guidance</Badge>
            <p className="text-sm text-gray-700">{guidance}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={() => {
            setCurrentDecision((prev) => (prev + 1) % decisions.length);
            setGuidance('');
          }}
          variant="outline" 
          size="sm"
        >
          Next Scenario
        </Button>
      </div>
    </div>
  );
};

export const NonprofitAIReadinessQuiz = () => {
  const [responses, setResponses] = useState<{[key: string]: number}>({});
  const [assessment, setAssessment] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const questions = [
    { id: 'tech', question: 'How comfortable is your team with technology?', scale: 'Not comfortable - Very comfortable' },
    { id: 'data', question: 'How organized is your data?', scale: 'Very messy - Well organized' },
    { id: 'budget', question: 'Do you have budget for new tools?', scale: 'No budget - Good budget' },
    { id: 'time', question: 'Do you have time to learn new systems?', scale: 'No time - Plenty of time' }
  ];

  const handleResponse = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const getAssessment = async () => {
    const responseData = questions.map(q => 
      `${q.question}: ${responses[q.id] || 0}/5`
    ).join(', ');

    try {
      const result = await callAI(
        'readiness_assessment',
        'Assess our AI readiness based on these responses',
        `Quiz responses: ${responseData}`
      );
      setAssessment(result);
    } catch (error) {
      setAssessment('Error getting assessment. Please try again!');
    }
  };

  const allAnswered = questions.every(q => responses[q.id]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Readiness Assessment</h3>
        <p className="text-sm text-gray-600">Assess your organization's readiness for AI</p>
      </div>

      <div className="space-y-3">
        {questions.map(question => (
          <Card key={question.id} className="border border-gray-200">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">{question.question}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">1</span>
                {[1, 2, 3, 4, 5].map(value => (
                  <Button
                    key={value}
                    onClick={() => handleResponse(question.id, value)}
                    variant={responses[question.id] === value ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 text-xs"
                  >
                    {value}
                  </Button>
                ))}
                <span className="text-xs text-gray-500">5</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{question.scale}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={getAssessment} 
        disabled={!allAnswered || loading}
        className="w-full"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart className="w-4 h-4 mr-2" />}
        Get Readiness Assessment
      </Button>

      {assessment && (
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <Badge className="bg-blue-100 text-blue-700 mb-2">Your AI Readiness Report</Badge>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{assessment}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const AIMythBusterSpinner = () => {
  const [selectedMyth, setSelectedMyth] = useState('');
  const [explanation, setExplanation] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const myths = [
    "AI will replace all nonprofit workers",
    "AI is too expensive for small nonprofits",
    "AI will remove the human element from nonprofits",
    "AI requires advanced technical skills to use",
    "AI will make nonprofits impersonal"
  ];

  const spinWheel = () => {
    const randomMyth = myths[Math.floor(Math.random() * myths.length)];
    setSelectedMyth(randomMyth);
    setExplanation('');
  };

  const bustMyth = async () => {
    try {
      const result = await callAI(
        'myth_buster',
        selectedMyth,
        'Explain this AI myth for nonprofit staff who are new to AI'
      );
      setExplanation(result);
    } catch (error) {
      setExplanation('Error busting myth. Please try again!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Myth Buster Spinner</h3>
        <p className="text-sm text-gray-600">Spin to debunk AI myths</p>
      </div>

      <div className="text-center space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {selectedMyth ? (
            <div>
              <Badge className="bg-red-100 text-red-700 mb-2">Myth Selected!</Badge>
              <p className="text-sm font-medium">{selectedMyth}</p>
            </div>
          ) : (
            <p className="text-gray-400">Click spin to select a myth</p>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={spinWheel} variant="outline">
            <Trophy className="w-3 h-3 mr-1" />
            Spin Wheel
          </Button>
          {selectedMyth && (
            <Button onClick={bustMyth} disabled={loading}>
              {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
              Bust This Myth!
            </Button>
          )}
        </div>
      </div>

      {explanation && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <Badge className="bg-green-100 text-green-700 mb-2">Myth Busted!</Badge>
            <div className="text-sm text-gray-700">{explanation}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const ROIImpactVisualizer = () => {
  const [metrics, setMetrics] = useState({
    volunteers: '',
    hours: '',
    programs: ''
  });
  const [analysis, setAnalysis] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const calculateROI = async () => {
    const data = `Volunteers: ${metrics.volunteers}, Weekly hours: ${metrics.hours}, Programs: ${metrics.programs}`;
    try {
      const result = await callAI(
        'roi_calculator',
        'Calculate potential ROI from AI implementation',
        data
      );
      setAnalysis(result);
    } catch (error) {
      setAnalysis('Error calculating ROI. Please try again!');
    }
  };

  const hasData = Object.values(metrics).some(value => value.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI ROI Impact Visualizer</h3>
        <p className="text-sm text-gray-600">Calculate your potential AI return on investment</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Number of volunteers:</label>
          <input
            type="number"
            value={metrics.volunteers}
            onChange={(e) => setMetrics(prev => ({ ...prev, volunteers: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Admin hours per week:</label>
          <input
            type="number"
            value={metrics.hours}
            onChange={(e) => setMetrics(prev => ({ ...prev, hours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 20"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Number of programs:</label>
          <input
            type="number"
            value={metrics.programs}
            onChange={(e) => setMetrics(prev => ({ ...prev, programs: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 5"
          />
        </div>
      </div>

      <Button 
        onClick={calculateROI} 
        disabled={!hasData || loading}
        className="w-full"
        size="sm"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-2" />}
        Calculate AI ROI
      </Button>

      {analysis && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <Badge className="bg-green-100 text-green-700 mb-2">ROI Analysis</Badge>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const CommunityImpactMultiplier = () => {
  const [orgData, setOrgData] = useState({
    beneficiaries: '',
    services: '',
    goals: ''
  });
  const [impactAnalysis, setImpactAnalysis] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const calculateMultiplier = async () => {
    const context = `Beneficiaries: ${orgData.beneficiaries}, Services: ${orgData.services}, Goals: ${orgData.goals}`;
    try {
      const result = await callAI(
        'impact_multiplier',
        'How can AI amplify our community impact?',
        context
      );
      setImpactAnalysis(result);
    } catch (error) {
      setImpactAnalysis('Error calculating impact. Please try again!');
    }
  };

  const hasData = Object.values(orgData).some(value => value.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Community Impact Multiplier</h3>
        <p className="text-sm text-gray-600">See how AI can amplify your organization's reach</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Who do you serve?</label>
          <input
            type="text"
            value={orgData.beneficiaries}
            onChange={(e) => setOrgData(prev => ({ ...prev, beneficiaries: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., homeless families, at-risk youth"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">What services do you provide?</label>
          <input
            type="text"
            value={orgData.services}
            onChange={(e) => setOrgData(prev => ({ ...prev, services: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., food assistance, job training"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">What are your growth goals?</label>
          <input
            type="text"
            value={orgData.goals}
            onChange={(e) => setOrgData(prev => ({ ...prev, goals: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., serve 2x more families"
          />
        </div>
      </div>

      <Button 
        onClick={calculateMultiplier} 
        disabled={!hasData || loading}
        className="w-full"
        size="sm"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
        Calculate Impact Multiplier
      </Button>

      {impactAnalysis && (
        <Card className="border border-purple-200">
          <CardContent className="p-4">
            <Badge className="bg-purple-100 text-purple-700 mb-2">AI Impact Amplification</Badge>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{impactAnalysis}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
