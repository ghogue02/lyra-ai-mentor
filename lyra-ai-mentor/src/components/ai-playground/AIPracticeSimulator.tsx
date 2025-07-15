import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, MessageSquare, FileText, Mail, TrendingUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '@/services/aiService';

interface AIPracticeSimulatorProps {
  character: {
    name: string;
    role: string;
    challenge: string;
  };
  onComplete: () => void;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  context: string;
  goal: string;
  constraints: string[];
  icon: React.ReactNode;
}

const characterScenarios: Record<string, Scenario[]> = {
  'Communications Manager': [
    {
      id: 'donor-email',
      title: 'Urgent Donor Email',
      description: 'A major donor is considering reducing their support. Write a compelling email to retain them.',
      context: 'The Johnson Foundation has supported your youth programs for 5 years with $50,000 annually. They mentioned budget constraints.',
      goal: 'Convince them to maintain or increase their support',
      constraints: ['Keep under 300 words', 'Include specific impact metrics', 'Propose a meeting'],
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'crisis-response',
      title: 'Crisis Communication',
      description: 'Negative press coverage requires immediate response.',
      context: 'Local news reported administrative costs concerns. You need to address stakeholders.',
      goal: 'Restore confidence and clarify misconceptions',
      constraints: ['Address concerns directly', 'Highlight transparency', 'Stay factual'],
      icon: <MessageSquare className="h-5 w-5" />
    }
  ],
  'Founder & Executive Director': [
    {
      id: 'board-pitch',
      title: 'Board Expansion Pitch',
      description: 'Convince the board to approve a major program expansion.',
      context: 'Opportunity to expand services to a neighboring county. Requires $200,000 investment.',
      goal: 'Get unanimous board approval',
      constraints: ['5-minute presentation', 'Address risk concerns', 'Show clear ROI'],
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'vision-story',
      title: 'Vision Story for Gala',
      description: 'Create an inspiring story for the annual fundraising gala.',
      context: '500 attendees, goal to raise $300,000. Theme: "Transforming Communities Together"',
      goal: 'Inspire maximum donations',
      constraints: ['3-minute speech', 'Personal story required', 'Clear call to action'],
      icon: <Target className="h-5 w-5" />
    }
  ],
  'Data & Analytics Director': [
    {
      id: 'impact-report',
      title: 'Quarterly Impact Story',
      description: 'Transform complex data into a compelling narrative.',
      context: 'Q3 data shows 23% increase in services but 15% decrease in outcomes. Budget up 18%.',
      goal: 'Explain the data positively while being honest',
      constraints: ['Use visualizations', 'Non-technical language', 'Actionable insights'],
      icon: <FileText className="h-5 w-5" />
    }
  ],
  'Volunteer Coordinator': [
    {
      id: 'recruitment-campaign',
      title: 'Volunteer Recruitment',
      description: 'Create a campaign to recruit 50 new volunteers.',
      context: 'Summer program needs skilled volunteers. Current volunteers are aging out.',
      goal: 'Attract younger, skilled volunteers',
      constraints: ['Multi-channel approach', 'Highlight benefits', 'Easy signup process'],
      icon: <MessageSquare className="h-5 w-5" />
    }
  ],
  'Programs Director': [
    {
      id: 'program-innovation',
      title: 'Program Innovation Proposal',
      description: 'Propose a new innovative program to address emerging needs.',
      context: 'Community survey reveals mental health as top concern. Limited mental health resources.',
      goal: 'Design a feasible mental health support program',
      constraints: ['Within current budget', 'Use existing staff', 'Measurable outcomes'],
      icon: <Target className="h-5 w-5" />
    }
  ]
};

export default function AIPracticeSimulator({ character, onComplete }: AIPracticeSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [feedback, setFeedback] = useState<{
    strengths: string[];
    improvements: string[];
    score: number;
    example: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const aiService = AIService.getInstance();
  const scenarios = characterScenarios[character.role] || characterScenarios['Communications Manager'];

  const generateAIExample = async () => {
    if (!selectedScenario) return;
    
    setIsGenerating(true);
    setAiResponse('');
    
    try {
      await aiService.streamResponse(
        {
          prompt: `As a ${character.role}, complete this scenario:
          
${selectedScenario.description}

Context: ${selectedScenario.context}
Goal: ${selectedScenario.goal}
Constraints: ${selectedScenario.constraints.join(', ')}

Generate a professional response that meets all requirements.`,
          context: `You are an experienced ${character.role} helping with real-world scenarios.`,
          temperature: 0.8
        },
        (chunk) => {
          setAiResponse(prev => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Error generating AI example:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFeedback = async () => {
    if (!selectedScenario || !userResponse.trim()) return;
    
    setIsGettingFeedback(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Evaluate this response to the scenario and provide structured feedback.

Scenario: ${selectedScenario.description}
Goal: ${selectedScenario.goal}
Constraints: ${selectedScenario.constraints.join(', ')}

User's Response: "${userResponse}"

Provide feedback as JSON with:
- strengths (array of 3 specific strengths)
- improvements (array of 3 specific areas to improve)
- score (0-100)
- example (one paragraph showing an improved version)`,
        context: `You are an expert ${character.role} providing constructive feedback.`,
        temperature: 0.3
      });

      try {
        const parsed = JSON.parse(response.content);
        setFeedback(parsed);
        
        if (!completedScenarios.includes(selectedScenario.id)) {
          setCompletedScenarios([...completedScenarios, selectedScenario.id]);
          if (completedScenarios.length === 0) {
            onComplete();
          }
        }
      } catch (e) {
        // Fallback feedback
        setFeedback({
          strengths: [
            'Clear communication intent',
            'Addresses the main goal',
            'Professional tone'
          ],
          improvements: [
            'Could be more specific with examples',
            'Add more emotional connection',
            'Strengthen the call to action'
          ],
          score: 75,
          example: 'Your response shows good understanding. To improve, try adding specific examples and creating stronger emotional connections with your audience.'
        });
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsGettingFeedback(false);
    }
  };

  const resetScenario = () => {
    setUserResponse('');
    setAiResponse('');
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-900">
            <Target className="h-5 w-5 mr-2" />
            Practice Real-World Scenarios
          </CardTitle>
          <CardDescription className="text-amber-700">
            Apply AI tools to actual challenges from your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Practice with realistic scenarios from {character.name}'s daily work. 
            Try solving them yourself, then see how AI can help.
          </p>
        </CardContent>
      </Card>

      {/* Scenario Selection */}
      {!selectedScenario && (
        <div className="space-y-4">
          <h3 className="font-semibold">Choose a Practice Scenario</h3>
          <div className="grid gap-3">
            {scenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    completedScenarios.includes(scenario.id) 
                      ? 'border-green-300 bg-green-50/50' 
                      : ''
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {scenario.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{scenario.title}</h4>
                          {completedScenarios.includes(scenario.id) && (
                            <Badge variant="secondary" className="bg-green-100">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active Scenario */}
      <AnimatePresence>
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Scenario Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {selectedScenario.icon}
                    <span className="ml-2">{selectedScenario.title}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedScenario(null)}
                  >
                    Change Scenario
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Context</h4>
                  <p className="text-sm text-gray-600">{selectedScenario.context}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Your Goal</h4>
                  <p className="text-sm text-gray-600">{selectedScenario.goal}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Requirements</h4>
                  <ul className="text-sm text-gray-600">
                    {selectedScenario.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Response Tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="your-response">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="your-response">Your Response</TabsTrigger>
                    <TabsTrigger value="ai-example">AI Example</TabsTrigger>
                    <TabsTrigger value="feedback" disabled={!feedback}>
                      Feedback
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="your-response" className="space-y-4 mt-4">
                    <div>
                      <Textarea
                        placeholder="Write your response to this scenario..."
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        rows={8}
                        className="font-sans"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={getFeedback}
                        disabled={!userResponse.trim() || isGettingFeedback}
                        className="flex-1"
                      >
                        {isGettingFeedback ? 'Analyzing...' : 'Get AI Feedback'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetScenario}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai-example" className="space-y-4 mt-4">
                    {!aiResponse && (
                      <Button 
                        onClick={generateAIExample}
                        disabled={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? 'Generating...' : 'Generate AI Example'}
                      </Button>
                    )}
                    
                    {aiResponse && (
                      <div className="space-y-4">
                        <Alert>
                          <AlertDescription>
                            <strong>AI-Generated Example:</strong> Study how AI structures and 
                            addresses all requirements.
                          </AlertDescription>
                        </Alert>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4 mt-4">
                    {feedback && (
                      <div className="space-y-4">
                        {/* Score */}
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            {feedback.score}%
                          </div>
                          <Badge 
                            variant={feedback.score >= 80 ? 'default' : feedback.score >= 60 ? 'secondary' : 'destructive'}
                          >
                            {feedback.score >= 80 ? 'Excellent' : feedback.score >= 60 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="border-green-200 bg-green-50/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-green-900">Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {feedback.strengths.map((strength, index) => (
                                  <li key={index} className="text-sm text-green-800">
                                    • {strength}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card className="border-orange-200 bg-orange-50/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-orange-900">Areas to Improve</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {feedback.improvements.map((improvement, index) => (
                                  <li key={index} className="text-sm text-orange-800">
                                    • {improvement}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Example Improvement */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">Suggested Improvement</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700">{feedback.example}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Summary */}
      {completedScenarios.length > 0 && (
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">Practice Progress</p>
                <p className="text-sm text-blue-700">
                  You've completed {completedScenarios.length} of {scenarios.length} scenarios
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100">
                {Math.round((completedScenarios.length / scenarios.length) * 100)}% Complete
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}