import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Calendar,
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Link2,
  Timer,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AIService } from '@/services/aiService';

interface EmailInSequence {
  id: string;
  day: number;
  subject: string;
  purpose: string;
  keyMessage: string;
  cta: string;
}

interface SequenceTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  emails: Partial<EmailInSequence>[];
}

const sequenceTemplates: SequenceTemplate[] = [
  {
    id: 'welcome',
    name: 'New Donor Welcome',
    description: 'Onboard and engage new supporters',
    duration: 30,
    emails: [
      { day: 0, purpose: 'Welcome & thank you' },
      { day: 3, purpose: 'Share impact story' },
      { day: 7, purpose: 'Introduce programs' },
      { day: 14, purpose: 'Volunteer opportunities' },
      { day: 30, purpose: 'Monthly giving invite' }
    ]
  },
  {
    id: 'campaign',
    name: 'Fundraising Campaign',
    description: 'Multi-touch donation appeal',
    duration: 14,
    emails: [
      { day: 0, purpose: 'Campaign launch' },
      { day: 3, purpose: 'Story spotlight' },
      { day: 7, purpose: 'Progress update' },
      { day: 10, purpose: 'Urgency reminder' },
      { day: 14, purpose: 'Final appeal' }
    ]
  },
  {
    id: 'event',
    name: 'Event Promotion',
    description: 'Drive registrations and attendance',
    duration: 21,
    emails: [
      { day: 0, purpose: 'Save the date' },
      { day: 7, purpose: 'Early bird special' },
      { day: 14, purpose: 'Speaker highlight' },
      { day: 19, purpose: 'Last chance' },
      { day: 21, purpose: 'Day-of reminder' }
    ]
  }
];

interface SequenceGoal {
  context: string;
  audience: string;
  objective: string;
  constraints: string[];
}

const sequenceGoals: SequenceGoal[] = [
  {
    context: 'Year-end giving campaign',
    audience: 'Active donors',
    objective: 'Raise $50,000 in December',
    constraints: ['Holiday sensitivity', 'Donor fatigue awareness', 'Tax deadline focus']
  },
  {
    context: 'Volunteer recruitment drive',
    audience: 'Community members',
    objective: 'Recruit 30 new volunteers',
    constraints: ['Time commitment clarity', 'Training schedule', 'Background check process']
  },
  {
    context: 'Capital campaign launch',
    audience: 'Major donor prospects',
    objective: 'Secure $500K in pledges',
    constraints: ['High-touch approach', 'Exclusive messaging', 'Personal follow-up needed']
  }
];

const EmailSequencePlanner: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentGoal, setCurrentGoal] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('welcome');
  const [sequence, setSequence] = useState<EmailInSequence[]>([]);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<EmailInSequence[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [savedSequences, setSavedSequences] = useState<{name: string, emails: EmailInSequence[]}[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const aiService = AIService.getInstance();
  const goal = sequenceGoals[currentGoal];
  const template = sequenceTemplates.find(t => t.id === selectedTemplate);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize sequence from template
    if (template) {
      setSequence(template.emails.map((email, index) => ({
        id: `email-${index}`,
        day: email.day || 0,
        subject: email.subject || '',
        purpose: email.purpose || '',
        keyMessage: '',
        cta: ''
      })));
    }
  }, [selectedTemplate]);

  const generateAISequence = async () => {
    setIsGenerating(true);
    try {
      const response = await aiService.generateResponse({
        prompt: `Create a detailed email sequence for:
        Context: ${goal.context}
        Audience: ${goal.audience}
        Objective: ${goal.objective}
        Template: ${template?.name}
        
        For each email in the sequence, provide:
        - Day number (when to send)
        - Subject line
        - Purpose
        - Key message (1-2 sentences)
        - Call to action
        
        Format as JSON array with these exact fields: day, subject, purpose, keyMessage, cta`,
        context: "You are an expert email marketing strategist for nonprofits.",
        temperature: 0.8
      });

      try {
        const suggestions = JSON.parse(response.content);
        const formattedSuggestions = suggestions.map((email: any, index: number) => ({
          id: `ai-${index}`,
          day: email.day || index * 3,
          subject: email.subject || '',
          purpose: email.purpose || '',
          keyMessage: email.keyMessage || '',
          cta: email.cta || ''
        }));
        setAiSuggestion(formattedSuggestions);
      } catch {
        // Fallback suggestions
        setAiSuggestion([
          {
            id: 'ai-1',
            day: 0,
            subject: 'Your Gift Can Change Everything This December',
            purpose: 'Campaign launch',
            keyMessage: 'As we approach year-end, your support can make twice the impact with our matching grant.',
            cta: 'Double Your Impact Today'
          },
          {
            id: 'ai-2',
            day: 3,
            subject: 'Meet Sarah: The Student You Can Help',
            purpose: 'Story spotlight',
            keyMessage: 'Sarah dreams of becoming a doctor, but needs help with school supplies and tutoring.',
            cta: 'Help Sarah Succeed'
          }
        ]);
      }
    } catch (error) {
      console.error('Error generating sequence:', error);
    }
    setIsGenerating(false);
  };

  const updateEmail = (id: string, field: keyof EmailInSequence, value: any) => {
    setSequence(prev => prev.map(email => 
      email.id === id ? { ...email, [field]: value } : email
    ));
  };

  const addEmail = () => {
    const newEmail: EmailInSequence = {
      id: `email-${Date.now()}`,
      day: sequence.length > 0 ? Math.max(...sequence.map(e => e.day)) + 3 : 0,
      subject: '',
      purpose: '',
      keyMessage: '',
      cta: ''
    };
    setSequence(prev => [...prev, newEmail].sort((a, b) => a.day - b.day));
  };

  const removeEmail = (id: string) => {
    setSequence(prev => prev.filter(email => email.id !== id));
  };

  const analyzeSequence = () => {
    setShowReview(true);
    
    let currentScore = 0;
    
    // Has appropriate number of emails (3-7 is ideal)
    if (sequence.length >= 3 && sequence.length <= 7) currentScore += 20;
    
    // All emails have complete information
    const completeEmails = sequence.filter(email => 
      email.subject && email.purpose && email.keyMessage && email.cta
    );
    if (completeEmails.length === sequence.length) currentScore += 30;
    else if (completeEmails.length >= sequence.length * 0.8) currentScore += 20;
    
    // Good spacing (not too frequent)
    const goodSpacing = sequence.every((email, index) => {
      if (index === 0) return true;
      const dayDiff = email.day - sequence[index - 1].day;
      return dayDiff >= 2 && dayDiff <= 7;
    });
    if (goodSpacing) currentScore += 20;
    
    // Variety in CTAs
    const uniqueCTAs = new Set(sequence.map(e => e.cta.toLowerCase())).size;
    if (uniqueCTAs >= sequence.length * 0.7) currentScore += 15;
    
    // Progressive messaging
    const hasProgression = sequence.some(e => e.purpose.toLowerCase().includes('launch')) &&
                          sequence.some(e => e.purpose.toLowerCase().includes('update')) &&
                          sequence.some(e => e.purpose.toLowerCase().includes('final') || e.purpose.toLowerCase().includes('last'));
    if (hasProgression) currentScore += 15;
    
    setScore(currentScore);
    setProgress(((currentGoal + 1) / sequenceGoals.length) * 100);
    
    if (currentScore >= 70) {
      setSavedSequences(prev => [...prev, {
        name: `${goal.context} - ${template?.name}`,
        emails: sequence
      }]);
    }
  };

  const moveToNext = () => {
    if (currentGoal < sequenceGoals.length - 1) {
      setCurrentGoal(prev => prev + 1);
      setSequence([]);
      setEditingEmail(null);
      setAiSuggestion([]);
      setShowReview(false);
      setScore(0);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email Sequence Planner</h2>
              <p className="text-sm text-muted-foreground">Design multi-email campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              Goal {currentGoal + 1} / {sequenceGoals.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showReview ? (
          <motion.div
            key="planner"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium">Context:</span>
                      <p className="text-sm text-muted-foreground">{goal.context}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Audience:</span>
                      <p className="text-sm text-muted-foreground">{goal.audience}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Objective:</span>
                    <p className="text-sm text-muted-foreground">{goal.objective}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Constraints:</span>
                    <ul className="mt-1">
                      {goal.constraints.map((constraint, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {constraint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Email Sequence</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sequenceTemplates.map(temp => (
                          <SelectItem key={temp.id} value={temp.id}>
                            {temp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={addEmail}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sequence.map((email, index) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Day {email.day}</span>
                          </div>
                          <Badge variant="outline">{email.purpose || 'No purpose set'}</Badge>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeEmail(email.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {editingEmail === email.id ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Subject Line</Label>
                            <Input
                              placeholder="Email subject..."
                              value={email.subject}
                              onChange={(e) => updateEmail(email.id, 'subject', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Purpose</Label>
                            <Input
                              placeholder="What's this email's goal?"
                              value={email.purpose}
                              onChange={(e) => updateEmail(email.id, 'purpose', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Key Message</Label>
                            <Textarea
                              placeholder="Main point to communicate..."
                              value={email.keyMessage}
                              onChange={(e) => updateEmail(email.id, 'keyMessage', e.target.value)}
                              className="min-h-[60px]"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Call to Action</Label>
                            <Input
                              placeholder="CTA text..."
                              value={email.cta}
                              onChange={(e) => updateEmail(email.id, 'cta', e.target.value)}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingEmail(null)}
                          >
                            Done Editing
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="space-y-2 cursor-pointer"
                          onClick={() => setEditingEmail(email.id)}
                        >
                          {email.subject && (
                            <p className="text-sm font-medium">{email.subject}</p>
                          )}
                          {email.keyMessage && (
                            <p className="text-sm text-muted-foreground">{email.keyMessage}</p>
                          )}
                          {email.cta && (
                            <Badge variant="secondary">{email.cta}</Badge>
                          )}
                          {!email.subject && !email.keyMessage && (
                            <p className="text-sm text-muted-foreground italic">Click to add details...</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {sequence.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No emails in sequence yet</p>
                      <p className="text-sm">Select a template or add emails manually</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={generateAISequence}
                    variant="outline"
                    disabled={isGenerating || sequence.length === 0}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Enhancement
                  </Button>
                  <Button
                    onClick={analyzeSequence}
                    disabled={sequence.length < 2}
                    className="flex-1"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Review Sequence
                  </Button>
                </div>

                {aiSuggestion.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong>AI-Enhanced Sequence Available</strong>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => setSequence(aiSuggestion)}
                        >
                          Use AI Sequence
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Alert className="mt-4">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sequence Best Practices:</strong> Space emails 2-4 days apart, 
                    vary your CTAs, and build momentum toward your goal.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sequence Analysis</CardTitle>
                <CardDescription>
                  How effective is your email campaign?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{score}%</div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Your Email Timeline:</h4>
                  <div className="relative">
                    {sequence.map((email, index) => (
                      <div key={email.id} className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 w-20">
                          <Timer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Day {email.day}</span>
                        </div>
                        <div className="flex-1 p-3 bg-muted/50 rounded">
                          <p className="font-medium text-sm">{email.subject || 'No subject'}</p>
                          <p className="text-xs text-muted-foreground">{email.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${sequence.length >= 3 && sequence.length <= 7 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Optimal sequence length ({sequence.length} emails)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Complete email information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${score >= 70 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Good email spacing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${new Set(sequence.map(e => e.cta.toLowerCase())).size >= sequence.length * 0.7 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className="text-sm">Varied calls to action</span>
                  </div>
                </div>

                {score >= 70 ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Excellent sequence! This campaign structure will effectively guide supporters toward your goal.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Good foundation! Consider adding more variety to your CTAs and ensuring proper spacing between emails.
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={moveToNext} className="w-full">
                  {currentGoal < sequenceGoals.length - 1 ? (
                    <>
                      Next Campaign Goal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Planner
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {savedSequences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Campaign Library</CardTitle>
              <CardDescription>Email sequences ready to deploy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedSequences.map((seq, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{seq.name}</p>
                      <Badge variant="outline">{seq.emails.length} emails</Badge>
                    </div>
                    <div className="flex gap-2">
                      {seq.emails.map((email, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Day {email.day}</span>
                          {i < seq.emails.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmailSequencePlanner;