import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Send,
  Target,
  Brain,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmailScenario {
  id: string;
  title: string;
  context: string;
  challenge: string;
  recipient: string;
  urgency: 'low' | 'medium' | 'high';
  tips: string[];
  successCriteria: string[];
}

const scenarios: EmailScenario[] = [
  {
    id: 'board-update',
    title: 'Board Meeting Update',
    context: 'You need to inform board members about a sudden change in the upcoming meeting agenda.',
    challenge: 'The meeting is tomorrow and you need to convey urgency while maintaining professionalism.',
    recipient: 'Board of Directors',
    urgency: 'high',
    tips: [
      'Start with a clear subject line that indicates urgency',
      'Be concise but include all critical information',
      'Provide clear action items',
      'End with next steps'
    ],
    successCriteria: [
      'Clear subject line with urgency indicator',
      'All key information in first paragraph',
      'Specific action items listed',
      'Professional tone maintained'
    ]
  },
  {
    id: 'donor-thank-you',
    title: 'Major Donor Thank You',
    context: 'A major donor just contributed $50,000 to your annual campaign.',
    challenge: 'Express genuine gratitude while building a deeper relationship.',
    recipient: 'Sarah Thompson, Major Donor',
    urgency: 'medium',
    tips: [
      'Personalize the message with specific impact details',
      'Share a brief story of who their donation helps',
      'Include next engagement opportunities',
      'Keep it warm but professional'
    ],
    successCriteria: [
      'Personal greeting using donor name',
      'Specific impact of their donation mentioned',
      'Story or example included',
      'Future engagement suggested'
    ]
  },
  {
    id: 'volunteer-recruitment',
    title: 'Volunteer Recruitment Drive',
    context: 'You need more volunteers for an upcoming community event in 2 weeks.',
    challenge: 'Make volunteering sound exciting and manageable for busy people.',
    recipient: 'Community Newsletter Subscribers',
    urgency: 'medium',
    tips: [
      'Lead with the impact volunteers will make',
      'Be specific about time commitments',
      'Make sign-up process clear and easy',
      'Include testimonial from past volunteer'
    ],
    successCriteria: [
      'Compelling opening about impact',
      'Clear time and date information',
      'Easy sign-up process explained',
      'Enthusiasm conveyed effectively'
    ]
  }
];

const MayaEmailChallenge: React.FC<{ onComplete?: (score: number) => void }> = ({ onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [emailDraft, setEmailDraft] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'writing' | 'ai-assist' | 'review' | 'complete'>('intro');
  const [timeSpent, setTimeSpent] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const scenario = scenarios[currentScenario];

  // Simulate AI suggestions based on the scenario
  const generateAISuggestions = () => {
    const suggestions = [
      `Subject: Urgent: Important Changes to Tomorrow's Board Meeting Agenda`,
      `Opening: "Dear Board Members, I hope this email finds you well. I'm writing to inform you of critical updates to tomorrow's meeting agenda that require your immediate attention."`,
      `Key Point Structure: 1) What changed, 2) Why it matters, 3) What we need from you`,
      `Closing: "Please confirm receipt of this email and let me know if you have any immediate questions. Looking forward to our discussion tomorrow."`
    ];
    setAiSuggestions(suggestions);
  };

  const analyzeEmail = () => {
    // Simple analysis based on key criteria
    let criteriaMetScore = 0;
    const email = emailDraft.toLowerCase();

    // Check for subject line
    if (email.includes('subject:')) criteriaMetScore += 25;
    
    // Check for greeting
    if (email.includes('dear') || email.includes('hello')) criteriaMetScore += 25;
    
    // Check for clear action items
    if (email.includes('please') || email.includes('action') || email.includes('next steps')) criteriaMetScore += 25;
    
    // Check for appropriate length (not too short, not too long)
    if (emailDraft.length > 100 && emailDraft.length < 500) criteriaMetScore += 25;

    setScore(criteriaMetScore);
    setShowFeedback(true);
  };

  const handleComplete = () => {
    setPhase('complete');
    if (onComplete) {
      onComplete(score);
    }
  };

  const resetChallenge = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    setEmailDraft('');
    setShowFeedback(false);
    setScore(0);
    setPhase('intro');
    setAiSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Maya's Email Confidence Challenge</CardTitle>
                    <CardDescription>Transform email overwhelm into confident communication</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What You'll Learn:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Structure emails for maximum clarity and impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Use AI to enhance (not replace) your unique voice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Save 2+ hours daily on email communication</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Your Scenario:</h3>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{scenario.title}</strong>
                      <p className="mt-2">{scenario.context}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{scenario.challenge}</p>
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Recipient</p>
                      <p className="font-medium">{scenario.recipient}</p>
                    </div>
                    <Badge variant={scenario.urgency === 'high' ? 'destructive' : scenario.urgency === 'medium' ? 'default' : 'secondary'}>
                      {scenario.urgency} urgency
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setPhase('writing')} 
                  size="lg" 
                  className="w-full"
                >
                  Start Writing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Draft Your Email</CardTitle>
                <CardDescription>
                  Write your email for: {scenario.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="compose">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="compose" className="space-y-4">
                    <Textarea
                      placeholder="Start with 'Subject:' followed by your subject line, then write your email..."
                      value={emailDraft}
                      onChange={(e) => setEmailDraft(e.target.value)}
                      className="min-h-[300px] font-mono"
                    />
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{emailDraft.length} characters</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Aim for 100-500 characters
                      </span>
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-3">
                    {scenario.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setPhase('ai-assist')}
                    variant="outline"
                    className="flex-1"
                    disabled={emailDraft.length < 50}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Get AI Help
                  </Button>
                  <Button 
                    onClick={analyzeEmail}
                    className="flex-1"
                    disabled={emailDraft.length < 50}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'ai-assist' && (
          <motion.div
            key="ai-assist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Assistant Suggestions</CardTitle>
                <CardDescription>
                  Here are some AI-powered suggestions to enhance your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions.length === 0 && (
                  <Button onClick={generateAISuggestions} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Suggestions
                  </Button>
                )}

                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => {
                      // In a real app, this would intelligently merge the suggestion
                      setEmailDraft(emailDraft + '\n\n' + suggestion);
                    }}
                  >
                    <p className="text-sm">{suggestion}</p>
                    <p className="text-xs text-muted-foreground mt-2">Click to add to your draft</p>
                  </motion.div>
                ))}

                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={() => setPhase('writing')}
                    variant="outline"
                  >
                    Back to Draft
                  </Button>
                  <Button 
                    onClick={analyzeEmail}
                    className="flex-1"
                  >
                    Submit Final Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showFeedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Email Analysis Results</CardTitle>
                <CardDescription>
                  Here's how your email performed against best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="w-full h-3" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Success Criteria:</h4>
                  {scenario.successCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 ${score > 50 ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>

                {score >= 75 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent work! Your email effectively addresses the scenario with clarity and professionalism.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      Good start! Consider adding more specific details and clear action items to improve your score.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={resetChallenge}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Another Scenario
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    className="flex-1"
                  >
                    Complete Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
              <p className="text-lg">You've mastered email confidence with AI assistance</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">What You've Learned:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="space-y-2">
                    <Target className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Clear Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      Organize emails for maximum impact
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Brain className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">AI Enhancement</h4>
                    <p className="text-sm text-muted-foreground">
                      Use AI to amplify your voice
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Clock className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Time Savings</h4>
                    <p className="text-sm text-muted-foreground">
                      Write effective emails 75% faster
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MayaEmailChallenge;