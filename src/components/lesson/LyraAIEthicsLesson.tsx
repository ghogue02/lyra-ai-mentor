import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Heart, Users, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import VideoAnimation from '@/components/ui/VideoAnimation';
import AnimatedCheckmark from '@/components/ui/AnimatedCheckmark';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { LessonCompletionScreen } from '@/components/lesson/LessonCompletionScreen';
import { EthicsScorecard } from '@/components/lesson/EthicsScorecard';

interface EthicsScenario {
  id: string;
  title: string;
  situation: string;
  options: {
    id: string;
    text: string;
    ethical: 'good' | 'concerning' | 'problematic';
    explanation: string;
  }[];
  context: string;
  principle: string;
}

export const LyraAIEthicsLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [scenarioResults, setScenarioResults] = useState<Array<{ scenarioId: string; choice: string; ethical: 'good' | 'concerning' | 'problematic' }>>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const ethicalPrinciples = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Human-Centered Impact',
      description: 'Always consider how AI affects the people you serve',
      examples: ['Will this help or potentially harm our beneficiaries?', 'Does this respect human dignity?', 'Are we solving real problems?']
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Fairness & Inclusion',
      description: 'Ensure AI doesn\'t create or amplify bias',
      examples: ['Does this work equally well for all communities?', 'Are we excluding anyone unintentionally?', 'Do our training data represent everyone?']
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Transparency & Honesty',
      description: 'Be clear about when and how you use AI',
      examples: ['Tell donors when AI helped write content', 'Explain AI recommendations to your team', 'Don\'t pretend AI output is purely human']
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy & Security',
      description: 'Protect sensitive information and donor data',
      examples: ['Never share personal details with AI', 'Use secure AI platforms', 'Get consent before AI analysis of personal data']
    }
  ];

  const ethicsScenarios: EthicsScenario[] = [
    {
      id: 'donor-emails',
      title: 'AI-Generated Donor Thank You Letters',
      situation: 'Your nonprofit wants to use AI to personalize thank-you letters to 1,000+ donors. The AI would access donor names, donation amounts, and giving history to create "personal" messages.',
      context: 'You\'re excited about the efficiency gains, but some staff worry about authenticity.',
      principle: 'Transparency & Honesty',
      options: [
        {
          id: 'no-disclosure',
          text: 'Use AI but don\'t tell donors - the letters will sound more authentic',
          ethical: 'problematic',
          explanation: 'This violates transparency principles. Donors have a right to know how their information is used and whether communications are AI-generated.'
        },
        {
          id: 'full-disclosure',
          text: 'Use AI and include a note like "This message was personalized with AI assistance"',
          ethical: 'good',
          explanation: 'Perfect! This maintains transparency while still benefiting from AI efficiency. Most donors will appreciate the honesty and effort to personalize.'
        },
        {
          id: 'avoid-ai',
          text: 'Avoid AI entirely and stick to generic thank-you templates',
          ethical: 'concerning',
          explanation: 'While not unethical, this misses an opportunity to improve donor relationships. AI can enhance personalization when used transparently.'
        }
      ]
    },
    {
      id: 'program-evaluation',
      title: 'AI Analysis of Beneficiary Data',
      situation: 'Your education nonprofit wants to use AI to analyze student performance data to identify who might be at risk of dropping out. This could help provide early intervention.',
      context: 'The data includes sensitive information about students\' backgrounds, family situations, and academic struggles.',
      principle: 'Privacy & Security',
      options: [
        {
          id: 'full-data',
          text: 'Upload all student data to a free AI platform for comprehensive analysis',
          ethical: 'problematic',
          explanation: 'This violates privacy principles. Student data is highly sensitive and should never be uploaded to free platforms without security guarantees.'
        },
        {
          id: 'anonymized-secure',
          text: 'Use anonymized data on a secure, educational AI platform with proper data agreements',
          ethical: 'good',
          explanation: 'Excellent approach! Anonymizing data and using secure platforms protects privacy while still enabling helpful analysis.'
        },
        {
          id: 'no-ai',
          text: 'Avoid AI analysis entirely to protect student privacy',
          ethical: 'concerning',
          explanation: 'While privacy-focused, this might deny students beneficial early intervention. Secure, ethical AI use could help more than manual analysis alone.'
        }
      ]
    },
    {
      id: 'grant-writing',
      title: 'AI-Assisted Grant Proposals',
      situation: 'Your nonprofit is using AI to help write grant proposals. The AI suggests including impressive statistics about your impact that are slightly exaggerated but within a reasonable range.',
      context: 'The grant deadline is tomorrow and you need funding desperately.',
      principle: 'Human-Centered Impact',
      options: [
        {
          id: 'use-exaggerated',
          text: 'Use the AI\'s impressive statistics - they\'re not technically false',
          ethical: 'problematic',
          explanation: 'This violates integrity principles. Even small exaggerations can damage trust and set unrealistic expectations for future work.'
        },
        {
          id: 'verify-accurate',
          text: 'Fact-check all AI suggestions and only use verified, accurate data',
          ethical: 'good',
          explanation: 'Perfect! AI should enhance your proposals with accurate information, not create misleading content. Integrity builds long-term relationships.'
        },
        {
          id: 'ai-disclaim',
          text: 'Use AI statistics but add a disclaimer that "data may not be fully verified"',
          ethical: 'concerning',
          explanation: 'This acknowledges uncertainty but still presents potentially inaccurate information. Better to verify data or omit questionable statistics.'
        }
      ]
    }
  ];

  const handleScenarioSubmit = () => {
    if (!selectedOption) return;
    
    const scenario = ethicsScenarios[currentScenario];
    const choice = scenario.options.find(opt => opt.id === selectedOption);
    
    if (choice) {
      setScenarioResults([...scenarioResults, {
        scenarioId: scenario.id,
        choice: choice.text,
        ethical: choice.ethical
      }]);
    }
    
    setShowExplanation(true);
  };

  const nextScenario = () => {
    if (currentScenario < ethicsScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption('');
      setShowExplanation(false);
    } else {
      setCurrentStep(2);
    }
  };

  const steps = [
    'Learn Ethical Principles',
    'Navigate Real Scenarios',
    'Build Your Ethics Framework'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16">
              <VideoAnimation
                src={getAnimationUrl('lyra-shield.mp4')}
                fallbackIcon={<Shield className="w-16 h-16 text-primary" />}
                className="w-full h-full"
                context="ui"
                loop={true}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Ethics for Nonprofits</h1>
              <p className="text-lg text-gray-600">Navigate responsible AI use in mission-driven work</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Ethical Principles */}
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
                    <div className="w-5 h-5">
                      <VideoAnimation
                        src={getAnimationUrl('lyra-thinking.mp4')}
                        fallbackIcon={<Shield className="w-5 h-5 text-purple-600" />}
                        className="w-full h-full"
                        context="ui"
                        loop={true}
                      />
                    </div>
                    Four Core Ethical Principles for Nonprofit AI
                  </CardTitle>
                  <CardDescription>
                    These principles will guide you through every AI decision
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {ethicalPrinciples.map((principle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-purple-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            {principle.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900">{principle.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                        <div className="space-y-1">
                          {principle.examples.map((example, i) => (
                            <div key={i} className="text-xs text-purple-700 bg-purple-50 p-2 rounded">
                              • {example}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={() => setCurrentStep(1)} className="bg-purple-600 hover:bg-purple-700">
                  Practice with Real Scenarios <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Scenarios */}
          {currentStep === 1 && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5">
                        <VideoAnimation
                          src={getAnimationUrl('lyra-thinking.mp4')}
                          fallbackIcon={<AlertTriangle className="w-5 h-5 text-purple-600" />}
                          className="w-full h-full"
                          context="ui"
                          loop={true}
                        />
                      </div>
                      Ethical Scenario {currentScenario + 1} of {ethicsScenarios.length}
                    </span>
                    <Badge variant="outline">{ethicsScenarios[currentScenario].principle}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {ethicsScenarios[currentScenario].title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{ethicsScenarios[currentScenario].situation}</p>
                      <p className="text-sm text-gray-600 mt-2 italic">{ethicsScenarios[currentScenario].context}</p>
                    </div>
                    
                    {!showExplanation ? (
                      <div>
                        <h3 className="font-semibold mb-3">What would you do?</h3>
                        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                          {ethicsScenarios[currentScenario].options.map((option) => (
                            <div key={option.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                              <Label htmlFor={option.id} className="text-sm flex-1 cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        <Button 
                          onClick={handleScenarioSubmit}
                          disabled={!selectedOption}
                          className="w-full mt-4"
                        >
                          Submit Your Choice
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold mb-3">Ethical Analysis</h3>
                        {ethicsScenarios[currentScenario].options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`p-3 border rounded-lg mb-3 ${
                              option.id === selectedOption ? 'ring-2 ring-purple-500' : ''
                            } ${
                              option.ethical === 'good' ? 'bg-green-50 border-green-200' :
                              option.ethical === 'concerning' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex items-center gap-2">
                                {option.ethical === 'good' && (
                                  <div className="w-5 h-5">
                                    <VideoAnimation
                                      src={getAnimationUrl('lyra-nodding-approval.mp4')}
                                      fallbackIcon={<CheckCircle className="w-5 h-5 text-green-600" />}
                                      className="w-full h-full"
                                      context="ui"
                                      loop={false}
                                    />
                                  </div>
                                )}
                                {option.ethical === 'concerning' && (
                                  <div className="w-5 h-5">
                                    <VideoAnimation
                                      src={getAnimationUrl('lyra-gentle-correction.mp4')}
                                      fallbackIcon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
                                      className="w-full h-full"
                                      context="ui"
                                      loop={false}
                                    />
                                  </div>
                                )}
                                {option.ethical === 'problematic' && (
                                  <div className="w-5 h-5">
                                    <VideoAnimation
                                      src={getAnimationUrl('lyra-gentle-correction.mp4')}
                                      fallbackIcon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                                      className="w-full h-full"
                                      context="ui"
                                      loop={false}
                                    />
                                  </div>
                                )}
                                <Badge variant={
                                  option.ethical === 'good' ? 'default' :
                                  option.ethical === 'concerning' ? 'secondary' : 'destructive'
                                }>
                                  {option.ethical === 'good' ? 'Ethical' :
                                   option.ethical === 'concerning' ? 'Concerning' : 'Problematic'}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{option.text}</p>
                                <p className="text-xs text-gray-600 mt-1">{option.explanation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button onClick={nextScenario} className="w-full bg-purple-600 hover:bg-purple-700">
                          {currentScenario < ethicsScenarios.length - 1 ? 'Next Scenario' : 'Complete Ethics Training'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Completion */}
          {currentStep === 2 && (
            <>
              <LessonCompletionScreen
                title="You're Now an AI Ethics Champion!"
                description="You've navigated complex ethical scenarios and understand how to use AI responsibly in nonprofit work. You're ready to be an ethical AI leader in your organization."
                characterType="lyra"
                achievementType="ethics"
                backRoute="/chapter/1"
                nextRoute="/chapter/1/interactive/ai-toolkit-setup"
                nextButtonText="Next: Set Up Your AI Toolkit"
                showScorecard={false}
              />
              <div className="mt-6">
                <EthicsScorecard 
                  results={scenarioResults.map((result, index) => ({
                    ...result,
                    principle: ethicsScenarios[index]?.principle || 'General Ethics'
                  }))}
                  showDetails={true}
                />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};