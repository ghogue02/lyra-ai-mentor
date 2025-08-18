import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, Heart, Users, Zap, Copy, Download, Wand2 } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { FloatingCarmenAvatar } from '@/components/lesson/FloatingCarmenAvatar';

const CarmenEngagementBuilder: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'workshop' | 'results'>('intro');
  const [isCompleted, setIsCompleted] = useState(false);
  const [narrativePaused, setNarrativePaused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [aiContent, setAiContent] = useState<{
    engagementSurvey?: string;
    teamStrategy?: string;
    recognitionPlan?: string;
  }>({});
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { callAI, loading } = useAITestingAssistant();

  const generateAIContent = async (type: 'engagement-survey' | 'team-strategy' | 'recognition-plan') => {
    setGeneratingContent(type);
    try {
      let prompt = '';
      let context = 'Carmen creates personalized engagement strategies using AI-powered people analytics combined with human-centered design thinking to make every team member feel valued and motivated.';
      
      switch (type) {
        case 'engagement-survey':
          prompt = 'Create a comprehensive employee engagement survey that captures individual motivation patterns, communication preferences, and personalized recognition styles';
          break;
        case 'team-strategy':
          prompt = 'Generate a team engagement strategy that balances individual personalization with collective mission connection and shared values';
          break;
        case 'recognition-plan':
          prompt = 'Design a personalized recognition plan that offers multiple pathways for appreciation based on different personality types and motivation patterns';
          break;
      }
      
      const result = await callAI('article', prompt, context, 'carmen');
      
      setAiContent(prev => ({
        ...prev,
        [type.replace('-', '')]: result
      }));
      
      toast({
        title: "AI Content Generated!",
        description: `Carmen's ${type.replace('-', ' ')} has been created with personalization and heart.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingContent(null);
    }
  };

  const copyContent = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  const handlePhaseComplete = (phase: string) => {
    if (phase === 'intro') {
      setCurrentPhase('workshop');
    } else if (phase === 'workshop') {
      setCurrentPhase('results');
    } else if (phase === 'results') {
      setIsCompleted(true);
      toast({
        title: "🎉 Engagement Builder Mastery Complete!",
        description: "You've learned to create personalized engagement strategies with AI insights.",
      });
      setTimeout(() => navigate('/chapter/7'), 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-orange-800 mb-4">
            Engagement Builder Journey Complete!
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            You've mastered Carmen's approach to AI-powered employee engagement.
          </p>
          <Button onClick={() => navigate('/chapter/7')} className="bg-orange-600 hover:bg-orange-700">
            Return to Chapter 7
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      {/* Carmen's Character Guidance */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Carmen's Engagement Philosophy</h3>
              <p className="text-amber-700 text-sm">
                "Engagement isn't one-size-fits-all. Let's use AI to understand each person's unique motivations and create personalized experiences."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carmen's Floating Avatar */}
      <FloatingCarmenAvatar
        position="bottom-right"
        className="z-40"
        disabled={showChat}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800">
              Employee Engagement Builder
            </h1>
          </div>
          <p className="text-lg text-orange-700 max-w-3xl mx-auto">
            Create personalized engagement strategies using Carmen's blend of AI-powered people analytics and human-centered design thinking.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[
              { phase: 'intro', label: 'Insights', icon: Heart },
              { phase: 'workshop', label: 'Builder Lab', icon: Zap },
              { phase: 'results', label: 'Impact', icon: Users }
            ].map(({ phase, label, icon: Icon }) => (
              <div
                key={phase}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  currentPhase === phase
                    ? 'bg-orange-600 text-white'
                    : phase === 'intro' || (phase === 'workshop' && currentPhase === 'results')
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        {currentPhase === 'intro' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Understanding Engagement Through Carmen's Lens
              </CardTitle>
              <CardDescription>
                Discover how AI-powered insights reveal what truly motivates each team member
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">💡 Carmen's Engagement Philosophy</h3>
                  <p className="text-amber-700">
                    "Engagement isn't one-size-fits-all. When we use AI to understand each person's unique motivations, 
                    we can create experiences that make everyone feel valued, challenged, and connected to our mission."
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">🔍 AI-Powered Insights</h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>• Communication style preferences</li>
                      <li>• Motivation pattern analysis</li>
                      <li>• Work-life balance indicators</li>
                      <li>• Growth opportunity identification</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">🎯 Personalization Engine</h3>
                    <ul className="space-y-2 text-green-700 text-sm">
                      <li>• Customized recognition approaches</li>
                      <li>• Tailored development plans</li>
                      <li>• Individual communication cadences</li>
                      <li>• Personal mission alignment</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">❤️ Human Connection</h3>
                    <ul className="space-y-2 text-purple-700 text-sm">
                      <li>• Meaningful one-on-one conversations</li>
                      <li>• Authentic appreciation moments</li>
                      <li>• Values-based team building</li>
                      <li>• Purpose-driven project assignments</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">📊 Engagement Analytics Dashboard</h3>
                  <p className="text-orange-700 mb-3">
                    Track engagement drivers across your team with real-time insights:
                  </p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-xs text-gray-600">Purpose Alignment</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-xs text-gray-600">Growth Opportunities</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-purple-600">78%</div>
                      <div className="text-xs text-gray-600">Work-Life Balance</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-orange-600">94%</div>
                      <div className="text-xs text-gray-600">Team Connection</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('intro')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Enter the Engagement Lab
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === 'workshop' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Engagement Strategy Builder Lab
              </CardTitle>
              <CardDescription>
                Create personalized engagement plans using AI insights and human wisdom
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">🧪 Interactive Lab Exercise</h3>
                  <p className="text-blue-700 mb-4">
                    Design engagement strategies for three different team member profiles using Carmen's AI-powered approach.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">👨‍💻 Alex - Data Analyst</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>AI Insights:</strong> Prefers autonomy, motivated by problem-solving, values work-life balance
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <strong>Engagement Plan:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Flexible schedule options</li>
                            <li>• Complex analytical projects</li>
                            <li>• Monthly innovation time</li>
                            <li>• Skill development stipend</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">👩‍🎓 Maria - Program Manager</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>AI Insights:</strong> Thrives on collaboration, seeks leadership growth, values recognition
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <strong>Engagement Plan:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Cross-team project leadership</li>
                            <li>• Public recognition moments</li>
                            <li>• Mentorship opportunities</li>
                            <li>• Strategic planning involvement</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">👨‍🏫 David - Communications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <strong>AI Insights:</strong> Creative energy, needs variety, values impact visibility
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <strong>Engagement Plan:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Rotating project assignments</li>
                            <li>• Impact story sharing</li>
                            <li>• Creative brainstorming sessions</li>
                            <li>• External conference speaking</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">🎯 Engagement Strategy Framework</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-purple-700">Individual Level:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>✓ Personalized recognition style</li>
                        <li>✓ Custom development pathway</li>
                        <li>✓ Preferred communication frequency</li>
                        <li>✓ Work arrangement flexibility</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-purple-700">Team Level:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>✓ Collaborative project design</li>
                        <li>✓ Shared mission moments</li>
                        <li>✓ Peer recognition systems</li>
                        <li>✓ Collective celebration rituals</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('workshop')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    See Engagement Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === 'results' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Engagement Transformation Results
              </CardTitle>
              <CardDescription>
                See the impact of Carmen's personalized engagement approach
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4">🎉 Engagement Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Employee Satisfaction:</span>
                        <span className="font-bold text-green-800">+55%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Retention Rate:</span>
                        <span className="font-bold text-green-800">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Productivity:</span>
                        <span className="font-bold text-green-800">+35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Innovation Ideas:</span>
                        <span className="font-bold text-green-800">+120%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4">💫 Cultural Transformation</h3>
                    <div className="space-y-3 text-blue-700">
                      <p>• Everyone feels uniquely valued and understood</p>
                      <p>• Recognition became meaningful and personal</p>
                      <p>• Professional development aligned with individual goals</p>
                      <p>• Team collaboration strengthened through appreciation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3">🌟 Carmen's Engagement Secrets</h3>
                  <ul className="text-orange-700 space-y-2">
                    <li>• Use AI to discover individual motivation patterns, then personalize accordingly</li>
                    <li>• Create multiple pathways for recognition to match different personality types</li>
                    <li>• Balance individual growth with collective mission connection</li>
                    <li>• Regularly check engagement pulse and adjust strategies based on feedback</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-3">🚀 Implementation Roadmap</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Week 1-2:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Survey team on preferences</li>
                        <li>• Analyze current engagement data</li>
                        <li>• Identify personalization opportunities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Week 3-4:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Implement personalized recognition</li>
                        <li>• Launch individual development plans</li>
                        <li>• Create flexible work arrangements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Month 2+:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Monitor engagement metrics</li>
                        <li>• Refine personalization strategies</li>
                        <li>• Scale successful approaches</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('results')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Engagement Journey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarmenEngagementBuilder;