import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Shield, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Users, 
  Target,
  Clock,
  Zap,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ConversationScenario {
  id: string;
  title: string;
  category: 'donor' | 'volunteer' | 'board' | 'staff' | 'parent';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  situation: string;
  challenge: string;
  stakeholders: string[];
  emotionalFactors: string[];
  timeConstraints: string;
  suggestedApproach: string;
}

interface ConversationAnalysis {
  empathyScore: number;
  clarityScore: number;
  solutionFocusScore: number;
  professionalismScore: number;
  overallScore: number;
  feedback: string[];
  suggestions: string[];
  improvedVersion?: string;
}

interface MayaDifficultConversationsWorkshopProps {
  onComplete?: (score: number) => void;
}

const MayaDifficultConversationsWorkshop: React.FC<MayaDifficultConversationsWorkshopProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mayaConfidence, setMayaConfidence] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const phases = [
    { title: "Maya's Challenge", description: "Understanding difficult conversations" },
    { title: "Empathy Framework", description: "Leading with understanding" },
    { title: "Scenario Practice", description: "Real-world application" },
    { title: "Mastery Achieved", description: "Confident communication" }
  ];

  const conversationScenarios: ConversationScenario[] = [
    {
      id: 'angry-parent',
      title: 'Upset Parent About Program Changes',
      category: 'parent',
      difficulty: 'intermediate',
      situation: 'A parent is angry about changes to the after-school pickup procedure that affects their work schedule.',
      challenge: 'The parent is emotional and feels unheard. They\'re considering withdrawing their child.',
      stakeholders: ['Parent', 'Child', 'Other families', 'Staff safety'],
      emotionalFactors: ['Frustration', 'Feeling unheard', 'Work stress', 'Child\'s wellbeing'],
      timeConstraints: 'End of school day, parent needs immediate resolution',
      suggestedApproach: 'Acknowledge feelings, explain reasoning with empathy, offer solutions'
    },
    {
      id: 'disappointed-donor',
      title: 'Major Donor Questioning Impact',
      category: 'donor',
      difficulty: 'advanced',
      situation: 'A major donor is questioning the effectiveness of their contribution after reading negative news coverage.',
      challenge: 'Donor is considering reducing support and wants detailed explanations of fund usage.',
      stakeholders: ['Donor', 'Organization reputation', 'Other funders', 'Beneficiaries'],
      emotionalFactors: ['Disappointment', 'Betrayed trust', 'Public embarrassment', 'Financial concerns'],
      timeConstraints: 'Urgent - donor meeting scheduled for tomorrow',
      suggestedApproach: 'Transparent communication, concrete data, action plan for improvement'
    },
    {
      id: 'volunteer-conflict',
      title: 'Volunteer Team Personality Clash',
      category: 'volunteer',
      difficulty: 'beginner',
      situation: 'Two long-term volunteers are having a personality conflict that\'s affecting team morale.',
      challenge: 'Both are valuable contributors but their tension is making others uncomfortable.',
      stakeholders: ['Both volunteers', 'Other team members', 'Program beneficiaries'],
      emotionalFactors: ['Hurt feelings', 'Defensive attitudes', 'Team anxiety', 'Loyalty conflicts'],
      timeConstraints: 'Ongoing situation affecting weekly team meetings',
      suggestedApproach: 'Individual conversations first, then facilitated discussion'
    },
    {
      id: 'board-disagreement',
      title: 'Board Member Strategic Disagreement',
      category: 'board',
      difficulty: 'advanced',
      situation: 'A influential board member strongly opposes a new program direction in a public board meeting.',
      challenge: 'Other board members are taking sides, threatening organizational unity.',
      stakeholders: ['Board member', 'Other board members', 'Staff', 'Organization mission'],
      emotionalFactors: ['Public disagreement', 'Authority challenge', 'Mission passion', 'Leadership stress'],
      timeConstraints: 'Public meeting in progress, decision needed today',
      suggestedApproach: 'Respectful acknowledgment, focus on shared mission, table for private discussion'
    }
  ];

  const empathyFramework = {
    steps: [
      {
        title: "Listen First",
        description: "Truly hear what the person is saying and feeling",
        techniques: ["Active listening", "Reflect back what you hear", "Ask clarifying questions"],
        mayaExample: "I can hear how frustrated you are about the pickup changes..."
      },
      {
        title: "Acknowledge Feelings",
        description: "Validate their emotions without necessarily agreeing with their position",
        techniques: ["Use feeling words", "Show understanding", "Avoid defensive responses"],
        mayaExample: "I understand this change is really disrupting your routine and that's stressful."
      },
      {
        title: "Find Common Ground",
        description: "Identify shared values and goals",
        techniques: ["Focus on what you both want", "Emphasize shared caring", "Build on agreements"],
        mayaExample: "We both want what's best for your daughter and all our children's safety."
      },
      {
        title: "Collaborate on Solutions",
        description: "Work together to find a path forward",
        techniques: ["Ask for their ideas", "Offer options", "Commit to follow-up"],
        mayaExample: "What if we tried this adjustment for two weeks and then check in?"
      }
    ]
  };

  useEffect(() => {
    // Simulate Maya's confidence building
    const timer = setInterval(() => {
      setMayaConfidence(prev => Math.min(prev + 1, 100));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const analyzeResponse = async () => {
    if (!userResponse.trim() || !selectedScenario) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis based on response content
    const responseLength = userResponse.length;
    const hasEmpathyWords = /understand|feel|hear|appreciate|acknowledge/i.test(userResponse);
    const hasSolutionFocus = /solution|work together|help|options|try|consider/i.test(userResponse);
    const hasApology = /sorry|apologize|regret/i.test(userResponse);
    const hasBlame = /fault|wrong|bad|stupid|problem/i.test(userResponse);
    
    const empathyScore = hasEmpathyWords ? 85 : hasApology ? 70 : 45;
    const clarityScore = responseLength > 100 ? 80 : responseLength > 50 ? 65 : 40;
    const solutionFocusScore = hasSolutionFocus ? 90 : 50;
    const professionalismScore = hasBlame ? 40 : 80;
    
    const overallScore = Math.round((empathyScore + clarityScore + solutionFocusScore + professionalismScore) / 4);
    
    const feedback = [];
    const suggestions = [];
    
    if (empathyScore >= 80) {
      feedback.push("Excellent empathy - you're truly hearing their concerns");
    } else {
      suggestions.push("Try acknowledging their feelings first: 'I can see how frustrating this is...'");
    }
    
    if (solutionFocusScore >= 80) {
      feedback.push("Great solution focus - you're working toward resolution");
    } else {
      suggestions.push("Offer collaborative solutions: 'What if we try...' or 'How can we make this work?'");
    }
    
    if (professionalismScore < 60) {
      suggestions.push("Avoid blame language - focus on moving forward together");
    }
    
    let improvedVersion = "";
    if (overallScore < 80) {
      improvedVersion = generateImprovedResponse(selectedScenario, userResponse);
    }
    
    const mockAnalysis: ConversationAnalysis = {
      empathyScore,
      clarityScore,
      solutionFocusScore,
      professionalismScore,
      overallScore,
      feedback,
      suggestions,
      improvedVersion
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    
    if (overallScore >= 70) {
      setCompletedScenarios(prev => [...prev, selectedScenario.id]);
    }
    
    onComplete?.(overallScore);
  };

  const generateImprovedResponse = (scenario: ConversationScenario, original: string): string => {
    const templates = {
      'angry-parent': "I can hear how frustrated you are about these pickup changes, and I completely understand how disruptive this is to your work schedule. As a parent myself, I know how carefully we plan our days around our children. Let me explain why we made this change - it's all about keeping every child safe. But I also want to work with you to find a solution that works for your family. What if we tried...",
      'disappointed-donor': "Thank you for bringing your concerns directly to me - that shows how much you care about our mission. I understand how disappointing and confusing the news coverage must be. You deserve complete transparency about how your generous contribution is being used. Let me share the specific impact your support has made, address each concern you've raised, and show you exactly how we're strengthening our programs...",
      'volunteer-conflict': "I'm so grateful for both of your dedication to our mission - you've each contributed so much. I can see there are some tensions affecting our team, and I want to address this before it impacts the great work we're doing together. I'd like to meet with each of you individually first to understand your perspectives, then we can work together on making our team even stronger...",
      'board-disagreement': "I really appreciate your passion for our mission - it's exactly why we need strong voices on this board. I can see you have significant concerns about this direction, and those concerns deserve our full attention. Given the importance of this decision, I think we should table this for a focused discussion where we can dive deeper into your insights. Our unity as a board is essential to our effectiveness..."
    };
    
    return templates[scenario.id as keyof typeof templates] || original;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-700">Maya's Difficult Conversations Workshop</CardTitle>
        <CardDescription className="text-lg mt-2">
          Master empathy-driven communication for challenging situations
        </CardDescription>
        <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-green-50 rounded-lg">
          <Heart className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Maya's Confidence Level: {mayaConfidence}%
          </span>
          <Progress value={mayaConfidence} className="w-32 h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Progress value={(currentPhase + 1) / phases.length * 100} className="h-2" />
          <p className="text-center text-sm text-gray-600 mt-2">
            {phases[currentPhase].title}: {phases[currentPhase].description}
          </p>
        </div>

        {currentPhase === 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-green-700">Maya's Difficult Conversation Challenge</h3>
              <p className="text-gray-700 mb-4">
                Maya faced her biggest communication challenge when an angry parent confronted her about program changes. 
                Her first instinct was to defend the decision, but she quickly realized this approach only made things worse.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-red-700 text-sm">Before Maya's Training:</p>
                  <ul className="text-xs text-red-600 mt-1">
                    <li>• Defensive responses escalated tension</li>
                    <li>• Focused on being "right" vs. understanding</li>
                    <li>• Left people feeling unheard</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-green-700 text-sm">After Empathy Training:</p>
                  <ul className="text-xs text-green-600 mt-1">
                    <li>• Listens first, responds second</li>
                    <li>• Acknowledges feelings before facts</li>
                    <li>• Finds solutions together</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-600">
                  "I learned that difficult conversations aren't about winning or losing - they're about understanding 
                  and finding a path forward together. When I started with empathy instead of explanations, 
                  everything changed."
                </p>
                <p className="text-sm mt-2 font-semibold text-green-600">- Maya Rodriguez</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase(1)} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Learn Maya's Empathy Framework <Heart className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 1 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-green-700">Maya's 4-Step Empathy Framework</h3>
            
            <div className="grid gap-4">
              {empathyFramework.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="p-4 rounded-lg border-l-4 border-green-400 bg-green-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">{step.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{step.description}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Techniques:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.techniques.map((technique, techIdx) => (
                              <Badge key={techIdx} variant="secondary" className="text-xs">
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white p-2 rounded text-sm">
                          <p className="text-xs font-medium text-green-600 mb-1">Maya's Example:</p>
                          <p className="text-gray-700 italic">"{step.mayaExample}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={() => setCurrentPhase(2)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Practice with Real Scenarios <Target className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-green-700">Practice with Maya's Real Scenarios</h3>
            
            {!selectedScenario && (
              <div className="grid gap-4">
                {conversationScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className="p-4 rounded-lg border-2 text-left transition-all hover:border-green-400 hover:bg-green-50"
                  >
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{scenario.title}</h4>
                          <Badge variant={scenario.difficulty === 'beginner' ? 'secondary' : scenario.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                            {scenario.difficulty}
                          </Badge>
                          {completedScenarios.includes(scenario.id) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{scenario.situation}</p>
                        <p className="text-xs text-red-600">{scenario.challenge}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedScenario && (
              <div className="space-y-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      {selectedScenario.title}
                      <Badge variant={selectedScenario.difficulty === 'beginner' ? 'secondary' : selectedScenario.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                        {selectedScenario.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="situation" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="situation">Situation</TabsTrigger>
                        <TabsTrigger value="stakeholders">People</TabsTrigger>
                        <TabsTrigger value="emotions">Emotions</TabsTrigger>
                        <TabsTrigger value="approach">Approach</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="situation" className="space-y-3">
                        <p><strong>The Situation:</strong> {selectedScenario.situation}</p>
                        <p><strong>The Challenge:</strong> {selectedScenario.challenge}</p>
                        <p><strong>Time Constraints:</strong> {selectedScenario.timeConstraints}</p>
                      </TabsContent>
                      
                      <TabsContent value="stakeholders" className="space-y-2">
                        <p className="font-medium">People Affected:</p>
                        {selectedScenario.stakeholders.map((person, idx) => (
                          <Badge key={idx} variant="outline" className="mr-2">
                            {person}
                          </Badge>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="emotions" className="space-y-2">
                        <p className="font-medium">Emotional Factors:</p>
                        {selectedScenario.emotionalFactors.map((emotion, idx) => (
                          <Badge key={idx} variant="secondary" className="mr-2">
                            {emotion}
                          </Badge>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="approach" className="space-y-2">
                        <p className="font-medium">Maya's Suggested Approach:</p>
                        <p className="text-sm text-gray-700">{selectedScenario.suggestedApproach}</p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How would you respond? Use Maya's empathy framework:
                    </label>
                    <Textarea
                      placeholder="Write your response using the 4-step framework: Listen, Acknowledge, Find Common Ground, Collaborate..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="h-32"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={analyzeResponse}
                      disabled={!userResponse.trim() || isAnalyzing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Response...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Analyze My Response
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setSelectedScenario(null)}
                      variant="outline"
                    >
                      Choose Different Scenario
                    </Button>
                  </div>
                </div>

                {analysis && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <Card className="border-2 border-green-200">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div className="flex items-center justify-center gap-3">
                            <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore).split(' ')[0]}`}>
                              {analysis.overallScore}
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-600">Empathy Score</p>
                              <Badge className={getScoreColor(analysis.overallScore)}>
                                {analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : 'Needs Work'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Detailed Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Heart className="w-6 h-6 mx-auto mb-2 text-green-600" />
                          <p className="text-sm text-gray-600">Empathy</p>
                          <div className="mt-2">
                            <p className="text-2xl font-bold text-green-600">{analysis.empathyScore}</p>
                            <Progress value={analysis.empathyScore} className="mt-1" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <p className="text-sm text-gray-600">Clarity</p>
                          <div className="mt-2">
                            <p className="text-2xl font-bold text-blue-600">{analysis.clarityScore}</p>
                            <Progress value={analysis.clarityScore} className="mt-1" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Lightbulb className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-sm text-gray-600">Solutions</p>
                          <div className="mt-2">
                            <p className="text-2xl font-bold text-purple-600">{analysis.solutionFocusScore}</p>
                            <Progress value={analysis.solutionFocusScore} className="mt-1" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Shield className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                          <p className="text-sm text-gray-600">Professional</p>
                          <div className="mt-2">
                            <p className="text-2xl font-bold text-orange-600">{analysis.professionalismScore}</p>
                            <Progress value={analysis.professionalismScore} className="mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Feedback */}
                    {analysis.feedback.length > 0 && (
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-800">✅ What You Did Well</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.feedback.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                <span className="text-green-800">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-800">💡 How to Improve</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <span className="text-yellow-800">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Improved Version */}
                    {analysis.improvedVersion && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-800">🔧 Maya's Enhanced Version</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Your response:</p>
                              <p className="text-gray-800 bg-white p-3 rounded border text-sm">{userResponse}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Maya's enhanced version:</p>
                              <p className="text-blue-800 bg-white p-3 rounded border font-medium text-sm">
                                {analysis.improvedVersion}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => {
                          setUserResponse('');
                          setAnalysis(null);
                          setSelectedScenario(null);
                        }}
                        variant="outline"
                      >
                        Try Another Scenario
                      </Button>
                      {completedScenarios.length >= 2 && (
                        <Button
                          onClick={() => setCurrentPhase(3)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Workshop <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentPhase === 3 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Difficult Conversations Mastery!</h3>
              
              <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-green-600">{completedScenarios.length}</p>
                  <p className="text-sm text-gray-600">Scenarios Mastered</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-blue-600">100%</p>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">∞</p>
                  <p className="text-sm text-gray-600">Future Success</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <p className="font-semibold text-gray-700 mb-2">Maya's Final Transformation:</p>
                <p className="text-sm text-gray-600">
                  "Difficult conversations are no longer something I dread - they're opportunities to deepen relationships 
                  and find solutions together. Leading with empathy changed everything."
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                You've mastered Maya's empathy-driven approach to difficult conversations!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MayaDifficultConversationsWorkshop;