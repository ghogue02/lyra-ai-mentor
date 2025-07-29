import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { Mail, Send, Loader2, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIEmailComposerRendererProps {
  elementId: number;
  title: string;
  configuration: any;
  onComplete?: () => void;
}

export const AIEmailComposerRenderer: React.FC<AIEmailComposerRendererProps> = ({
  elementId,
  title,
  configuration,
  onComplete
}) => {
  const [phase, setPhase] = useState<'setup' | 'composing' | 'result'>('setup');
  const [emailType, setEmailType] = useState('fundraising');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional-warm');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const { callAI, loading } = useAITestingAssistant();
  const { toast } = useToast();

  const emailTypes = [
    { value: 'fundraising', label: 'Fundraising Campaign', description: 'Emergency or ongoing fundraising appeal' },
    { value: 'donor_update', label: 'Donor Update', description: 'Impact reports and thank you messages' },
    { value: 'volunteer', label: 'Volunteer Outreach', description: 'Recruitment and coordination emails' },
    { value: 'partnership', label: 'Partnership', description: 'Collaboration and networking outreach' },
    { value: 'board', label: 'Board Communication', description: 'Updates and requests to board members' }
  ];

  const toneOptions = [
    { value: 'professional-warm', label: 'Professional & Warm' },
    { value: 'urgent-compelling', label: 'Urgent & Compelling' },
    { value: 'grateful-personal', label: 'Grateful & Personal' },
    { value: 'inspiring-motivational', label: 'Inspiring & Motivational' }
  ];

  const handleComposeEmail = async () => {
    if (!context.trim() || !audience.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both context and audience details.",
        variant: "destructive"
      });
      return;
    }

    setPhase('composing');

    const characterContext = `Character: ${configuration.character || 'Sofia Martinez'}
Scenario: ${configuration.scenario || 'professional email communication'}
Emotional Arc: ${configuration.emotional_arc ? 'Include emotional storytelling' : 'Keep professional tone'}`;

    const prompt = `Compose a ${emailType} email with the following details:

Email Type: ${emailTypes.find(t => t.value === emailType)?.label}
Subject Line: ${subject || 'Please suggest an engaging subject line'}
Tone: ${toneOptions.find(t => t.value === tone)?.label}

Context/Situation:
${context}

Target Audience: ${audience}

Requirements:
1. Write a compelling subject line if none provided
2. Use ${tone} tone throughout
3. Include a clear call-to-action
4. Keep it concise but impactful (2-3 paragraphs max)
5. Make it feel personal and authentic
6. Include nonprofit-specific language and appeal

${configuration.target_amount ? `Target Amount: ${configuration.target_amount}` : ''}
${configuration.story ? `Story Context: ${configuration.story}` : ''}

Please format as:
Subject: [subject line]
Email Body: [email content]`;

    try {
      // Use character from configuration or default to Sofia (communication expert)
      const characterType = configuration.character?.toLowerCase() || 'sofia';
      const result = await callAI('ai_email_composer', prompt, characterContext, characterType);
      setGeneratedEmail(result);
      setPhase('result');
      
      toast({
        title: "Email Composed!",
        description: "Your professional email has been generated and is ready to send."
      });
    } catch (error) {
      console.error('Error composing email:', error);
      toast({
        title: "Composition Failed",
        description: "Please try again with different details.",
        variant: "destructive"
      });
      setPhase('setup');
    }
  };

  const handleStartOver = () => {
    setPhase('setup');
    setEmailType('fundraising');
    setSubject('');
    setContext('');
    setAudience('');
    setTone('professional-warm');
    setGeneratedEmail('');
  };

  if (phase === 'setup') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Type
              </label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  {emailTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Subject Line (optional)
              </label>
              <Input
                placeholder="Leave blank for AI to suggest a compelling subject line"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Context & Situation
              </label>
              <Textarea
                placeholder="Describe what this email is about, what happened, what you need, or what you want to communicate..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Target Audience
              </label>
              <Textarea
                placeholder="Who are you emailing? (e.g., regular donors, potential major donors, volunteers, board members, community partners...)"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tone & Style
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleComposeEmail}
            disabled={loading || !context.trim() || !audience.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Composing Email...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Compose Email with AI
              </>
            )}
          </Button>

          {configuration.timeSavings && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="font-medium text-accent">Time Savings</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Before:</strong> {configuration.timeSavings.before} | 
                <strong> After:</strong> {configuration.timeSavings.after} | 
                <strong> Savings:</strong> {configuration.timeSavings.metric}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (phase === 'composing') {
    return (
      <Card className="p-6 bg-background border-border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Composing Your Email</h3>
          <p className="text-muted-foreground">
            Creating a compelling, professional email that gets results...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-background border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Your Professional Email</h3>
          </div>
          <Badge variant="secondary">Ready to Send</Badge>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <span className="text-sm font-medium text-muted-foreground">Email Preview</span>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-mono">
                {generatedEmail}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleStartOver} variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Compose Another Email
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Continue Learning
          </Button>
        </div>

        {configuration.timeSavings && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">Mission Accomplished</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You just saved <strong>{configuration.timeSavings.metric}</strong> by using AI to compose professional, compelling emails.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};