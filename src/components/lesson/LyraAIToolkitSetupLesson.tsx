import React, { useState } from 'react';
import { Cog, Check, ArrowRight, Plus, Star, Zap, Shield, DollarSign, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tools: AITool[];
}

interface AITool {
  id: string;
  name: string;
  description: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  bestFor: string[];
  pros: string[];
  cons: string[];
  recommendedFor: string[];
}

export const LyraAIToolkitSetupLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [organizationSize, setOrganizationSize] = useState<string>('');
  const [techComfort, setTechComfort] = useState<string>('');

  const toolCategories: ToolCategory[] = [
    {
      id: 'writing',
      name: 'Writing & Communication',
      description: 'Create compelling content, emails, and proposals',
      icon: <Zap className="w-5 h-5" />,
      tools: [
        {
          id: 'chatgpt',
          name: 'ChatGPT',
          description: 'Versatile AI for writing, brainstorming, and analysis',
          pricing: 'Freemium',
          difficulty: 'Beginner',
          bestFor: ['Grant writing', 'Email campaigns', 'Social media', 'Brainstorming'],
          pros: ['Easy to use', 'Flexible', 'Great for beginners', 'Strong writing capabilities'],
          cons: ['Can be generic', 'Requires good prompting', 'Limited recent data'],
          recommendedFor: ['program-manager', 'communications', 'development', 'executive']
        },
        {
          id: 'claude',
          name: 'Claude',
          description: 'Thoughtful AI excellent for analysis and ethical considerations',
          pricing: 'Freemium',
          difficulty: 'Beginner',
          bestFor: ['Policy analysis', 'Research synthesis', 'Ethical reviews', 'Complex writing'],
          pros: ['Thoughtful responses', 'Good at nuance', 'Strong ethics', 'Handles complexity well'],
          cons: ['Slower responses', 'More conservative', 'Limited availability'],
          recommendedFor: ['program-manager', 'executive', 'research']
        },
        {
          id: 'grammarly',
          name: 'Grammarly',
          description: 'AI-powered writing assistant for polished communication',
          pricing: 'Freemium',
          difficulty: 'Beginner',
          bestFor: ['Email editing', 'Proposal polishing', 'Professional tone', 'Grammar checking'],
          pros: ['Real-time editing', 'Professional tone', 'Easy integration', 'Catches errors'],
          cons: ['Limited creativity', 'Subscription for full features', 'Can be overly formal'],
          recommendedFor: ['communications', 'development', 'program-manager', 'volunteer']
        }
      ]
    },
    {
      id: 'design',
      name: 'Visual Content & Design',
      description: 'Create stunning visuals and presentations',
      icon: <Star className="w-5 h-5" />,
      tools: [
        {
          id: 'canva',
          name: 'Canva AI',
          description: 'AI-powered design platform for social media and marketing',
          pricing: 'Freemium',
          difficulty: 'Beginner',
          bestFor: ['Social media graphics', 'Flyers', 'Presentations', 'Infographics'],
          pros: ['Templates included', 'No design skills needed', 'AI image generation', 'Team collaboration'],
          cons: ['Limited customization', 'Brand recognition', 'Subscription for premium'],
          recommendedFor: ['communications', 'volunteer', 'program-manager']
        },
        {
          id: 'midjourney',
          name: 'Midjourney',
          description: 'Premium AI image generation for unique visuals',
          pricing: 'Paid',
          difficulty: 'Intermediate',
          bestFor: ['Unique illustrations', 'Campaign imagery', 'Creative concepts', 'Social impact visuals'],
          pros: ['Stunning quality', 'Highly creative', 'Unique results', 'Active community'],
          cons: ['Requires Discord', 'Learning curve', 'Subscription only', 'Time consuming'],
          recommendedFor: ['communications', 'marketing']
        }
      ]
    },
    {
      id: 'data',
      name: 'Data & Analytics',
      description: 'Understand your impact through data insights',
      icon: <Shield className="w-5 h-5" />,
      tools: [
        {
          id: 'excel-copilot',
          name: 'Microsoft Copilot (Excel)',
          description: 'AI assistance for data analysis and reporting',
          pricing: 'Paid',
          difficulty: 'Intermediate',
          bestFor: ['Data analysis', 'Report automation', 'Donor insights', 'Impact measurement'],
          pros: ['Integrates with existing tools', 'Powerful analysis', 'Natural language queries', 'Professional'],
          cons: ['Requires Microsoft 365', 'Expensive', 'Learning curve', 'Limited to Excel'],
          recommendedFor: ['program-manager', 'development', 'executive']
        },
        {
          id: 'tableau-ai',
          name: 'Tableau AI',
          description: 'Advanced data visualization with AI insights',
          pricing: 'Paid',
          difficulty: 'Advanced',
          bestFor: ['Dashboard creation', 'Complex analytics', 'Board presentations', 'Trend analysis'],
          pros: ['Professional visualizations', 'Powerful analytics', 'AI insights', 'Industry standard'],
          cons: ['Very expensive', 'Steep learning curve', 'Overkill for small orgs', 'Requires training'],
          recommendedFor: ['executive', 'research']
        }
      ]
    },
    {
      id: 'automation',
      name: 'Workflow & Automation',
      description: 'Streamline repetitive tasks and processes',
      icon: <Clock className="w-5 h-5" />,
      tools: [
        {
          id: 'zapier',
          name: 'Zapier',
          description: 'Connect apps and automate workflows',
          pricing: 'Freemium',
          difficulty: 'Intermediate',
          bestFor: ['Data entry', 'Email automation', 'CRM updates', 'Social media posting'],
          pros: ['Connects many apps', 'No coding needed', 'Time-saving', 'Reliable'],
          cons: ['Can be complex', 'Subscription for more', 'Learning curve', 'Depends on integrations'],
          recommendedFor: ['program-manager', 'development', 'communications']
        },
        {
          id: 'notion-ai',
          name: 'Notion AI',
          description: 'AI-powered workspace for project management',
          pricing: 'Freemium',
          difficulty: 'Beginner',
          bestFor: ['Project planning', 'Meeting notes', 'Content creation', 'Team collaboration'],
          pros: ['All-in-one workspace', 'AI writing help', 'Good for teams', 'Flexible structure'],
          cons: ['Can be overwhelming', 'AI features cost extra', 'Learning curve', 'Can become messy'],
          recommendedFor: ['program-manager', 'volunteer', 'executive']
        }
      ]
    }
  ];

  const getRecommendedTools = () => {
    if (!selectedRole) return [];
    
    const allTools = toolCategories.flatMap(cat => cat.tools);
    return allTools.filter(tool => tool.recommendedFor.includes(selectedRole));
  };

  const generatePersonalizedPlan = () => {
    const recommendedTools = getRecommendedTools();
    const selectedToolsData = toolCategories
      .flatMap(cat => cat.tools)
      .filter(tool => selectedTools.includes(tool.id));

    return {
      immediate: selectedToolsData.filter(tool => tool.difficulty === 'Beginner').slice(0, 2),
      nextMonth: selectedToolsData.filter(tool => tool.difficulty === 'Intermediate').slice(0, 2),
      future: selectedToolsData.filter(tool => tool.difficulty === 'Advanced').slice(0, 1)
    };
  };

  const steps = [
    'Assess Your Needs',
    'Explore AI Tools',
    'Build Your Toolkit',
    'Create Your Roadmap'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <MicroLessonNavigator 
        chapterNumber={1}
        chapterTitle="Chapter 1: AI Foundations"
        lessonTitle="Setting Up Your AI Toolkit"
        characterName="Lyra"
      />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <LyraAvatar size="md" expression="celebrating" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Setting Up Your AI Toolkit</h1>
              <p className="text-lg text-gray-600">Build your personalized AI workspace</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Assessment */}
          {currentStep === 0 && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Tell Us About Your Role
                  </CardTitle>
                  <CardDescription>
                    We'll recommend the best AI tools for your specific needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-3 block">What's your primary role?</Label>
                      <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="program-manager" id="program-manager" />
                            <Label htmlFor="program-manager">Program Manager - Running programs and managing impact</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="communications" id="communications" />
                            <Label htmlFor="communications">Communications - Marketing, social media, storytelling</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="development" id="development" />
                            <Label htmlFor="development">Development - Fundraising, grants, donor relations</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="executive" id="executive" />
                            <Label htmlFor="executive">Executive Director - Strategy, leadership, oversight</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="volunteer" id="volunteer" />
                            <Label htmlFor="volunteer">Volunteer/Board Member - Supporting the mission</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-3 block">Organization size?</Label>
                      <RadioGroup value={organizationSize} onValueChange={setOrganizationSize}>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="small" id="small" />
                            <Label htmlFor="small">Small (1-10 staff)</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium (11-50 staff)</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="large" id="large" />
                            <Label htmlFor="large">Large (50+ staff)</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-3 block">Tech comfort level?</Label>
                      <RadioGroup value={techComfort} onValueChange={setTechComfort}>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner">Beginner - Prefer simple, user-friendly tools</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate">Intermediate - Comfortable learning new tools</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced">Advanced - Love trying cutting-edge tools</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button 
                  onClick={() => setCurrentStep(1)} 
                  disabled={!selectedRole || !organizationSize || !techComfort}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Explore AI Tools <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Tool Exploration */}
          {currentStep === 1 && (
            <motion.div
              key="exploration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="w-5 h-5 text-indigo-600" />
                    AI Tools by Category
                  </CardTitle>
                  <CardDescription>
                    Explore tools organized by what they help you accomplish
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {toolCategories.map((category) => (
                      <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid gap-3">
                          {category.tools.map((tool) => (
                            <div key={tool.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{tool.name}</h4>
                                  <p className="text-sm text-gray-600">{tool.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={tool.pricing === 'Free' ? 'default' : tool.pricing === 'Freemium' ? 'secondary' : 'outline'}>
                                    {tool.pricing}
                                  </Badge>
                                  <Badge variant="outline">{tool.difficulty}</Badge>
                                  {tool.recommendedFor.includes(selectedRole) && (
                                    <Badge variant="default" className="bg-green-600">Recommended</Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-2">
                                <strong>Best for:</strong> {tool.bestFor.join(', ')}
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <strong className="text-green-700">Pros:</strong>
                                  <ul className="text-green-600 ml-2">
                                    {tool.pros.map((pro, i) => (
                                      <li key={i}>• {pro}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <strong className="text-red-700">Cons:</strong>
                                  <ul className="text-red-600 ml-2">
                                    {tool.cons.map((con, i) => (
                                      <li key={i}>• {con}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={() => setCurrentStep(2)} className="bg-indigo-600 hover:bg-indigo-700">
                  Build My Toolkit <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Tool Selection */}
          {currentStep === 2 && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" />
                    Select Your Starting Tools
                  </CardTitle>
                  <CardDescription>
                    Choose 3-5 tools to begin with. You can always add more later!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {toolCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
                        <div className="space-y-2">
                          {category.tools.map((tool) => (
                            <div key={tool.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={tool.id}
                                checked={selectedTools.includes(tool.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTools([...selectedTools, tool.id]);
                                  } else {
                                    setSelectedTools(selectedTools.filter(id => id !== tool.id));
                                  }
                                }}
                              />
                              <Label htmlFor={tool.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <span>{tool.name}</span>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">{tool.pricing}</Badge>
                                    {tool.recommendedFor.includes(selectedRole) && (
                                      <Badge variant="default" className="text-xs bg-green-600">Recommended</Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{tool.description}</p>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Selected: {selectedTools.length} tools
                </p>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  disabled={selectedTools.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Create My Implementation Plan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Implementation Plan */}
          {currentStep === 3 && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    Your Personalized AI Implementation Roadmap
                  </CardTitle>
                  <CardDescription>
                    A step-by-step plan to master your chosen AI tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const plan = generatePersonalizedPlan();
                    return (
                      <div className="space-y-6">
                        {/* Week 1-2: Immediate */}
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <h3 className="font-semibold text-green-900 mb-3">🚀 Start This Week (Beginner Tools)</h3>
                          {plan.immediate.length > 0 ? (
                            <div className="space-y-2">
                              {plan.immediate.map((tool) => (
                                <div key={tool.id} className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">{tool.name}</span>
                                  <span className="text-sm text-gray-600">- {tool.description}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-green-800">Select some beginner-friendly tools to get started!</p>
                          )}
                        </div>

                        {/* Month 1: Intermediate */}
                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <h3 className="font-semibold text-blue-900 mb-3">📈 Next Month (Intermediate Tools)</h3>
                          {plan.nextMonth.length > 0 ? (
                            <div className="space-y-2">
                              {plan.nextMonth.map((tool) => (
                                <div key={tool.id} className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">{tool.name}</span>
                                  <span className="text-sm text-gray-600">- {tool.description}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-blue-800">Once comfortable with basics, consider intermediate tools!</p>
                          )}
                        </div>

                        {/* Future: Advanced */}
                        <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                          <h3 className="font-semibold text-purple-900 mb-3">🎯 Future Goals (Advanced Tools)</h3>
                          {plan.future.length > 0 ? (
                            <div className="space-y-2">
                              {plan.future.map((tool) => (
                                <div key={tool.id} className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-purple-600" />
                                  <span className="font-medium">{tool.name}</span>
                                  <span className="text-sm text-gray-600">- {tool.description}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-purple-800">Advanced tools can provide powerful capabilities when you're ready!</p>
                          )}
                        </div>

                        {/* Success Tips */}
                        <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 p-6 rounded-lg">
                          <h3 className="font-semibold mb-3">🎉 Tips for Success</h3>
                          <ul className="space-y-2 text-sm">
                            <li>• Start with just one tool and master it before adding others</li>
                            <li>• Practice with low-stakes tasks first (like internal emails)</li>
                            <li>• Join online communities for your chosen tools</li>
                            <li>• Set aside 30 minutes weekly to experiment and learn</li>
                            <li>• Document what works well for your organization</li>
                            <li>• Share successes with your team to build enthusiasm</li>
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
              
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">🎓 Congratulations! You're Ready to Transform Your Work with AI</h3>
                  <p className="text-gray-600 text-sm">
                    You now have a personalized roadmap to implement AI tools that will make your nonprofit work 
                    more efficient, impactful, and engaging. Start with one tool this week!
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/chapter/1')}
                    variant="outline"
                  >
                    Back to Chapter 1
                  </Button>
                  <Button 
                    onClick={() => navigate('/chapter/2')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue to Chapter 2: Maya's Email Mastery
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};