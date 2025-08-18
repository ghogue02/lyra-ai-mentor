import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Target, Brain, Heart, Copy, Download, Wand2 } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { FloatingCarmenAvatar } from '@/components/lesson/FloatingCarmenAvatar';

const CarmenTalentAcquisition: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'workshop' | 'results'>('intro');
  const [isCompleted, setIsCompleted] = useState(false);
  const [narrativePaused, setNarrativePaused] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [aiContent, setAiContent] = useState<{
    jobDescription?: string;
    interviewQuestions?: string;
    candidateAnalysis?: string;
  }>({});
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { callAI, loading } = useAITestingAssistant();

  const generateAIContent = async (type: 'job-description' | 'interview-questions' | 'candidate-analysis') => {
    setGeneratingContent(type);
    try {
      let prompt = '';
      let context = 'Carmen is helping create compassionate, bias-free hiring processes that combine AI efficiency with human empathy.';
      
      switch (type) {
        case 'job-description':
          prompt = 'Create an inclusive job description for a Program Manager role that removes bias, emphasizes skills over requirements, and attracts diverse candidates';
          break;
        case 'interview-questions':
          prompt = 'Generate behavioral interview questions that assess capability while reducing unconscious bias, focusing on growth mindset and values alignment';
          break;
        case 'candidate-analysis':
          prompt = 'Create a sample candidate evaluation that demonstrates objective skill assessment while highlighting potential and cultural fit';
          break;
      }
      
      const result = await callAI('article', prompt, context, 'carmen');
      
      setAiContent(prev => ({
        ...prev,
        [type.replace('-', '')]: result
      }));
      
      toast({
        title: "AI Content Generated!",
        description: `Carmen's ${type.replace('-', ' ')} has been created with empathy and precision.`,
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
        title: "🎉 Talent Acquisition Mastery Complete!",
        description: "You've learned to blend AI efficiency with human-centered hiring.",
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
            Talent Acquisition Journey Complete!
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            You've mastered Carmen's approach to compassionate, AI-powered hiring.
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
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Carmen's Guidance</h3>
              <p className="text-amber-700 text-sm">
                "Let's work together to create hiring processes that honor both efficiency and humanity. I'll guide you through each step."
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
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800">
              AI-Powered Talent Acquisition
            </h1>
          </div>
          <p className="text-lg text-orange-700 max-w-3xl mx-auto">
            Join Carmen as she transforms hiring through compassionate AI that removes bias while preserving the human connection that makes great teams.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[
              { phase: 'intro', label: 'Introduction', icon: Heart },
              { phase: 'workshop', label: 'Workshop', icon: Brain },
              { phase: 'results', label: 'Results', icon: Target }
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
                Carmen's Approach to Hiring
              </CardTitle>
              <CardDescription>
                Discover how to balance AI efficiency with human empathy in recruitment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">💡 Carmen's Philosophy</h3>
                  <p className="text-amber-700">
                    "Technology should amplify our humanity, not replace it. AI helps us see talent clearly, 
                    while our hearts help us understand the person behind the resume."
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">🎯 What You'll Learn</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Remove unconscious bias from screening</li>
                      <li>• Design inclusive job descriptions</li>
                      <li>• Use AI for candidate matching</li>
                      <li>• Maintain human connection in interviews</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">🚀 Real Impact</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• 60% more diverse candidate pools</li>
                      <li>• 40% faster screening process</li>
                      <li>• 80% improved candidate experience</li>
                      <li>• 90% better cultural fit predictions</li>
                    </ul>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('intro')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Start the Workshop
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
                <Brain className="w-5 h-5 mr-2" />
                AI-Enhanced Hiring Workshop
              </CardTitle>
              <CardDescription>
                Practice using AI tools while maintaining human-centered values
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">🔧 Interactive Exercise</h3>
                  <p className="text-blue-700 mb-4">
                    You're hiring for a Program Manager role. Use Carmen's AI-powered approach to create an inclusive hiring process.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">Step 1: AI Job Description</h4>
                      <p className="text-sm text-gray-600 mb-2">Generate bias-free, inclusive job descriptions</p>
                      <Button
                        onClick={() => generateAIContent('job-description')}
                        disabled={generatingContent === 'job-description'}
                        className="w-full mb-3 text-xs"
                        variant="outline"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        {generatingContent === 'job-description' ? 'Generating...' : 'Generate Job Description'}
                      </Button>
                      {aiContent.jobDescription && (
                        <div className="space-y-2">
                          <div className="bg-green-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                            <AIContentDisplay content={aiContent.jobDescription} />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyContent(aiContent.jobDescription!, 'Job Description')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadContent(aiContent.jobDescription!, 'job-description.txt')}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">Step 2: Interview Questions</h4>
                      <p className="text-sm text-gray-600 mb-2">AI-powered bias-free interview questions</p>
                      <Button
                        onClick={() => generateAIContent('interview-questions')}
                        disabled={generatingContent === 'interview-questions'}
                        className="w-full mb-3 text-xs"
                        variant="outline"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        {generatingContent === 'interview-questions' ? 'Generating...' : 'Generate Questions'}
                      </Button>
                      {aiContent.interviewQuestions && (
                        <div className="space-y-2">
                          <div className="bg-blue-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                            <AIContentDisplay content={aiContent.interviewQuestions} />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyContent(aiContent.interviewQuestions!, 'Interview Questions')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadContent(aiContent.interviewQuestions!, 'interview-questions.txt')}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">Step 3: Candidate Analysis</h4>
                      <p className="text-sm text-gray-600 mb-2">Objective evaluation with human empathy</p>
                      <Button
                        onClick={() => generateAIContent('candidate-analysis')}
                        disabled={generatingContent === 'candidate-analysis'}
                        className="w-full mb-3 text-xs"
                        variant="outline"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        {generatingContent === 'candidate-analysis' ? 'Generating...' : 'Generate Analysis'}
                      </Button>
                      {aiContent.candidateAnalysis && (
                        <div className="space-y-2">
                          <div className="bg-purple-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                            <AIContentDisplay content={aiContent.candidateAnalysis} />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyContent(aiContent.candidateAnalysis!, 'Candidate Analysis')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadContent(aiContent.candidateAnalysis!, 'candidate-analysis.txt')}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('workshop')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    See Results & Impact
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
                <Target className="w-5 h-5 mr-2" />
                Your Hiring Transformation Results
              </CardTitle>
              <CardDescription>
                See the impact of Carmen's compassionate AI approach
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4">🎉 Success Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Diverse Candidates:</span>
                        <span className="font-bold text-green-800">+65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Time to Hire:</span>
                        <span className="font-bold text-green-800">-40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Candidate Satisfaction:</span>
                        <span className="font-bold text-green-800">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">First-Year Retention:</span>
                        <span className="font-bold text-green-800">92%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4">💝 Human Impact</h3>
                    <div className="space-y-3 text-blue-700">
                      <p>• Eliminated unconscious bias in screening</p>
                      <p>• Created more inclusive job descriptions</p>
                      <p>• Improved candidate experience dramatically</p>
                      <p>• Built stronger, more diverse teams</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3">🌟 Key Takeaways</h3>
                  <ul className="text-orange-700 space-y-2">
                    <li>• AI removes bias while preserving human judgment</li>
                    <li>• Inclusive language leads to diverse talent pools</li>
                    <li>• Technology enhances empathy, doesn't replace it</li>
                    <li>• Great hiring combines data insights with human intuition</li>
                  </ul>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('results')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Talent Acquisition Journey
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

export default CarmenTalentAcquisition;