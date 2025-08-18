import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, TrendingUp, Heart, BarChart3, Users, Copy, Download, Wand2 } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { FloatingLyraAvatar } from '@/components/lesson/FloatingLyraAvatar';

const CarmenPerformanceInsights: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'workshop' | 'results'>('intro');
  const [isCompleted, setIsCompleted] = useState(false);
  const [narrativePaused, setNarrativePaused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [aiContent, setAiContent] = useState<{
    performanceReview?: string;
    developmentPlan?: string;
    feedbackScript?: string;
  }>({});
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { callAI, loading } = useAITestingAssistant();

  const generateAIContent = async (type: 'performance-review' | 'development-plan' | 'feedback-script') => {
    setGeneratingContent(type);
    try {
      let prompt = '';
      let context = 'Carmen creates performance conversations that combine objective data analysis with meaningful human development, focusing on growth and potential rather than criticism.';
      
      switch (type) {
        case 'performance-review':
          prompt = 'Create a comprehensive performance review template that balances objective metrics with growth-focused feedback, emphasizing strengths and development opportunities';
          break;
        case 'development-plan':
          prompt = 'Generate a personalized development plan that identifies growth areas, learning opportunities, and career progression pathways based on individual strengths and aspirations';
          break;
        case 'feedback-script':
          prompt = 'Create a conversation script for delivering performance feedback that maintains psychological safety while encouraging growth and improvement';
          break;
      }
      
      const result = await callAI('performance-tool', prompt, context, 'carmen');
      
      setAiContent(prev => ({
        ...prev,
        [type.replace('-', '')]: result
      }));
      
      toast({
        title: "AI Content Generated!",
        description: `Carmen's ${type.replace('-', ' ')} has been created with empathy and insight.`,
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
        title: "🎉 Performance Insights Mastery Complete!",
        description: "You've learned to create meaningful performance conversations with AI support.",
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
            Performance Insights Journey Complete!
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            You've mastered Carmen's approach to data-driven, empathetic performance management.
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
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Carmen's Performance Wisdom</h3>
              <p className="text-amber-700 text-sm">
                "Performance conversations should light up potential, not dim spirits. Let's create reviews that truly transform people."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carmen's Floating Avatar */}
      <FloatingLyraAvatar
        position="bottom-right"
        className="z-40"
        disabled={showChat}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800">
              Performance Insights Workshop
            </h1>
          </div>
          <p className="text-lg text-orange-700 max-w-3xl mx-auto">
            Master Carmen's approach to performance management that combines objective data analysis with meaningful human development conversations.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[
              { phase: 'intro', label: 'Foundation', icon: Heart },
              { phase: 'workshop', label: 'Practice', icon: BarChart3 },
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
                Carmen's Performance Philosophy
              </CardTitle>
              <CardDescription>
                Transform performance reviews from dreaded tasks to growth conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">💡 Carmen's Insight</h3>
                  <p className="text-amber-700">
                    "Performance reviews should light up people's potential, not dim their spirits. 
                    When we lead with data and follow with heart, we create conversations that truly transform."
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">📊 Data-Driven Approach</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Objective performance metrics</li>
                      <li>• Bias-free evaluation criteria</li>
                      <li>• Progress tracking and trends</li>
                      <li>• Goal achievement analysis</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">❤️ Human-Centered Focus</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Individual growth conversations</li>
                      <li>• Strength-based development</li>
                      <li>• Career aspiration discussions</li>
                      <li>• Supportive feedback delivery</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">🎯 Workshop Outcomes</h3>
                  <p className="text-blue-700">
                    Practice creating performance insights that remove bias, identify growth opportunities, 
                    and guide meaningful development conversations that motivate and inspire.
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('intro')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Begin Performance Workshop
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
                <BarChart3 className="w-5 h-5 mr-2" />
                Interactive Performance Analysis
              </CardTitle>
              <CardDescription>
                Practice using AI-powered insights to guide meaningful performance conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">🔍 Scenario: Team Member Development</h3>
                  <p className="text-blue-700 mb-4">
                    Sarah is a fundraising coordinator who's been with your organization for 2 years. 
                    Use Carmen's approach to analyze her performance and prepare for a growth conversation.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">📈 Performance Data</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Donor Retention:</span>
                          <span className="font-medium text-green-600">88% ↑</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Event Success:</span>
                          <span className="font-medium text-green-600">95% ↑</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Team Collaboration:</span>
                          <span className="font-medium text-yellow-600">Good</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Innovation Projects:</span>
                          <span className="font-medium text-blue-600">2 initiated</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">💭 AI Insights</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>• Strong in donor relationship building</p>
                        <p>• Shows initiative in process improvement</p>
                        <p>• Ready for increased responsibility</p>
                        <p>• May benefit from leadership training</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">🎯 Growth Opportunities</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>• Cross-team project leadership</p>
                        <p>• Mentor new team members</p>
                        <p>• Develop strategic fundraising skills</p>
                        <p>• Explore major gift cultivation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">💬 Conversation Framework</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Strengths to Celebrate:</h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• "Your donor retention rate is exceptional"</li>
                        <li>• "You've shown real innovation leadership"</li>
                        <li>• "Your event success speaks to your attention to detail"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Growth Discussion:</h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• "What aspects of leadership interest you most?"</li>
                        <li>• "How can we support your strategic development?"</li>
                        <li>• "What challenges excite you for next year?"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('workshop')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    See Performance Impact
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
                Performance Management Transformation
              </CardTitle>
              <CardDescription>
                See how Carmen's approach transforms performance conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4">📊 Measurement Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Employee Satisfaction:</span>
                        <span className="font-bold text-green-800">+45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Goal Achievement:</span>
                        <span className="font-bold text-green-800">+60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Internal Promotions:</span>
                        <span className="font-bold text-green-800">+80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Performance Conversations:</span>
                        <span className="font-bold text-green-800">Weekly</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4">💝 Cultural Impact</h3>
                    <div className="space-y-3 text-blue-700">
                      <p>• Performance reviews became growth celebrations</p>
                      <p>• Bias eliminated from evaluation process</p>
                      <p>• Increased focus on strength development</p>
                      <p>• Higher employee engagement and retention</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3">🌟 Carmen's Performance Principles</h3>
                  <ul className="text-orange-700 space-y-2">
                    <li>• Lead with data, follow with empathy in every conversation</li>
                    <li>• Focus on growth potential rather than past mistakes</li>
                    <li>• Create psychological safety for honest self-reflection</li>
                    <li>• Use AI insights to uncover hidden strengths and opportunities</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-3">🎯 Your Next Steps</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Implement Immediately:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Schedule regular growth conversations</li>
                        <li>• Use data to identify development areas</li>
                        <li>• Create strength-based development plans</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Build Over Time:</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Develop AI-powered performance dashboards</li>
                        <li>• Train managers in empathetic feedback</li>
                        <li>• Create peer recognition systems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('results')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Performance Journey
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

export default CarmenPerformanceInsights;