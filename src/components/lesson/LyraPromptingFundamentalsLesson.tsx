import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowRight, CheckCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';

export const LyraPromptingFundamentalsLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState<Array<{ prompt: string; improvement: string; quality: 'poor' | 'good' | 'excellent' }>>([]);

  const promptingPrinciples = [
    {
      title: 'Be Specific & Clear',
      description: 'Vague prompts lead to vague results. Specify exactly what you want.',
      example: 'Instead of "Write an email" → "Write a donor thank-you email for a $500 donation to our literacy program"'
    },
    {
      title: 'Provide Context',
      description: 'Give AI the background it needs to understand your situation.',
      example: 'Include details like: your role, organization type, audience, and desired outcome'
    },
    {
      title: 'Set the Format',
      description: 'Tell AI exactly how you want the output structured.',
      example: 'Ask for: bullet points, formal letter, social media post, or specific length'
    },
    {
      title: 'Include Examples',
      description: 'Show AI the style or format you prefer with examples.',
      example: 'Provide a sample of your organization\'s typical communication style'
    }
  ];

  const practiceScenarios = [
    {
      scenario: 'Write a grant proposal introduction',
      badPrompt: 'Write a grant proposal',
      goodPrompt: 'Write an introduction for a $25,000 grant proposal to support our after-school literacy program for 50 elementary students in urban Detroit. Include our mission, the community need, and how this program addresses that need. Keep it professional but passionate, around 200 words.',
      improvement: 'Added specific amount, program details, target audience, location, required elements, tone, and length'
    },
    {
      scenario: 'Create volunteer recruitment content',
      badPrompt: 'Help me get volunteers',
      goodPrompt: 'Create a Facebook post to recruit volunteers for our monthly food bank distribution. We need 10 volunteers for Saturday mornings, 9 AM-12 PM. Emphasize the impact (we serve 200 families monthly), that no experience is needed, and include a call-to-action with our volunteer coordinator\'s email. Tone should be warm and encouraging.',
      improvement: 'Added specific platform, volunteer needs, schedule, impact data, requirements, contact method, and desired tone'
    }
  ];

  const analyzePrompt = (prompt: string) => {
    const hasSpecifics = prompt.length > 50 && (prompt.includes('$') || /\d+/.test(prompt));
    const hasContext = prompt.toLowerCase().includes('nonprofit') || prompt.toLowerCase().includes('organization') || prompt.toLowerCase().includes('program');
    const hasFormat = prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('post') || prompt.toLowerCase().includes('letter');
    
    let quality: 'poor' | 'good' | 'excellent' = 'poor';
    let improvement = '';
    
    if (hasSpecifics && hasContext && hasFormat) {
      quality = 'excellent';
      improvement = 'Great prompt! You included specifics, context, and format. AI will give you exactly what you need.';
    } else if ((hasSpecifics && hasContext) || (hasContext && hasFormat)) {
      quality = 'good';
      improvement = 'Good start! Consider adding ' + 
        (!hasSpecifics ? 'specific details (numbers, dates, amounts), ' : '') +
        (!hasContext ? 'more context about your organization and situation, ' : '') +
        (!hasFormat ? 'the desired format or output structure' : '');
    } else {
      quality = 'poor';
      improvement = 'This prompt needs more detail. Add specific context about your nonprofit, what exactly you need, and how you want it formatted.';
    }
    
    return { quality, improvement };
  };

  const handlePromptSubmit = () => {
    if (!userPrompt.trim()) return;
    
    const analysis = analyzePrompt(userPrompt);
    setPromptHistory([...promptHistory, { 
      prompt: userPrompt, 
      improvement: analysis.improvement, 
      quality: analysis.quality 
    }]);
    setUserPrompt('');
  };

  const steps = [
    'Learn the 4 Core Principles',
    'See Real Examples',
    'Practice & Get Feedback',
    'Complete Your Toolkit'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Prompting Fundamentals</h1>
              <p className="text-lg text-gray-600">Master the art of communicating with AI</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-cyan-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Core Principles */}
          {currentStep === 0 && (
            <motion.div
              key="principles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-cyan-600" />
                    The 4 Core Principles of Effective Prompting
                  </CardTitle>
                  <CardDescription>
                    These principles will transform your AI interactions from frustrating to fantastic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {promptingPrinciples.map((principle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-cyan-200 rounded-lg"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">{principle.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                        <div className="bg-cyan-50 p-3 rounded text-xs text-cyan-800">
                          <strong>Example:</strong> {principle.example}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={() => setCurrentStep(1)} className="bg-cyan-600 hover:bg-cyan-700">
                  See Real Examples <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Examples */}
          {currentStep === 1 && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-600" />
                    Before & After: Real Nonprofit Scenarios
                  </CardTitle>
                  <CardDescription>
                    See how small changes make huge differences in AI results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {practiceScenarios.map((scenario, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-gray-900 mb-4">{scenario.scenario}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <Badge variant="destructive" className="mb-2">Poor Prompt</Badge>
                            <p className="text-sm text-gray-700 italic">"{scenario.badPrompt}"</p>
                          </div>
                          
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <Badge variant="default" className="mb-2 bg-green-600">Great Prompt</Badge>
                            <p className="text-sm text-gray-700 italic">"{scenario.goodPrompt}"</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Key Improvement:</strong> {scenario.improvement}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={() => setCurrentStep(2)} className="bg-cyan-600 hover:bg-cyan-700">
                  Try It Yourself <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Practice */}
          {currentStep === 2 && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-600" />
                    Practice Prompt Playground
                  </CardTitle>
                  <CardDescription>
                    Write a prompt for your nonprofit and get instant feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Prompt Challenge: Write a volunteer recruitment message
                      </label>
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Example: Help me get volunteers for our food bank..."
                        className="min-h-24"
                      />
                    </div>
                    
                    <Button 
                      onClick={handlePromptSubmit}
                      disabled={!userPrompt.trim()}
                      className="w-full"
                    >
                      Get AI Feedback
                    </Button>
                    
                    {promptHistory.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Your Prompt History & Feedback:</h3>
                        {promptHistory.map((entry, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-2">
                              <Badge variant={
                                entry.quality === 'excellent' ? 'default' : 
                                entry.quality === 'good' ? 'secondary' : 'destructive'
                              }>
                                {entry.quality}
                              </Badge>
                              <p className="text-sm italic text-gray-700">"{entry.prompt}"</p>
                            </div>
                            <p className="text-sm text-gray-600">{entry.improvement}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={() => setCurrentStep(3)} className="bg-cyan-600 hover:bg-cyan-700">
                  Complete Lesson <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 3 && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Congratulations! You've Mastered AI Prompting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You now understand the fundamental principles that make AI prompting effective. 
                      Remember: be specific, provide context, set the format, and include examples.
                    </p>
                    
                    <div className="bg-gradient-to-r from-cyan-100 to-purple-100 p-6 rounded-lg">
                      <h3 className="font-semibold mb-3">Your Prompting Toolkit:</h3>
                      <ul className="text-left space-y-2 text-sm">
                        <li>✅ 4 Core principles for better prompts</li>
                        <li>✅ Before/after examples for reference</li>
                        <li>✅ Hands-on practice with feedback</li>
                        <li>✅ Ready to communicate effectively with any AI tool</li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => navigate('/chapter/1')}
                        variant="outline"
                      >
                        Back to Chapter 1
                      </Button>
                      <Button 
                        onClick={() => navigate('/chapter/1/interactive/understanding-models')}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        Next: Understanding AI Models
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};