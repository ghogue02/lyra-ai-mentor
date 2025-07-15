import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Copy, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw,
  Heart,
  Users,
  Clock,
  Target,
  Mail,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  ScenarioBlock, 
  DialogueBlock,
  ImpactStatement,
  FeatureItem 
} from './InteractiveTextStyles';

interface MayaPromptSandwichBuilderProps {
  onComplete?: () => void;
  element?: any; // Extra props from InteractiveElementRenderer
  isElementCompleted?: boolean; // Extra props from InteractiveElementRenderer
  [key: string]: any; // Allow additional props to prevent object-to-primitive errors
}

interface PromptLayer {
  tone: string;
  context: string;
  template: string;
}

const toneOptions = [
  { id: 'professional', label: 'Professional & Formal', icon: '👔', color: 'blue' },
  { id: 'warm', label: 'Warm & Friendly', icon: '🤗', color: 'orange' },
  { id: 'urgent', label: 'Urgent & Action-Oriented', icon: '🚨', color: 'red' },
  { id: 'empathetic', label: 'Empathetic & Understanding', icon: '💝', color: 'rose' },
  { id: 'excited', label: 'Excited & Enthusiastic', icon: '🎉', color: 'yellow' }
];

const contextOptions = [
  { id: 'parents-first', label: 'Parents - First Contact', icon: '👋' },
  { id: 'parents-concern', label: 'Parents - Addressing Concern', icon: '😟' },
  { id: 'donors-new', label: 'Donors - First Appeal', icon: '💝' },
  { id: 'donors-thank', label: 'Donors - Thank You', icon: '🙏' },
  { id: 'board-update', label: 'Board - Program Update', icon: '📊' },
  { id: 'staff-announce', label: 'Staff - Announcement', icon: '📢' },
  { id: 'volunteers-recruit', label: 'Volunteers - Recruitment', icon: '🤝' },
  { id: 'community-invite', label: 'Community - Event Invite', icon: '🎪' }
];

const templateOptions = [
  { id: 'event', label: 'Event Announcement', icon: '📅' },
  { id: 'fundraising', label: 'Fundraising Appeal', icon: '💰' },
  { id: 'update', label: 'Program Update', icon: '📰' },
  { id: 'schedule', label: 'Schedule Change', icon: '🕐' },
  { id: 'thanks', label: 'Thank You Message', icon: '💌' },
  { id: 'resolution', label: 'Problem Resolution', icon: '🔧' },
  { id: 'meeting', label: 'Meeting Request', icon: '🤝' },
  { id: 'newsletter', label: 'Newsletter Content', icon: '📧' }
];

const getPromptText = (layer: PromptLayer): string => {
  const toneMap: Record<string, string> = {
    professional: "Write in a professional and formal tone that conveys competence and reliability",
    warm: "Write in a warm and friendly tone that makes the reader feel valued and welcomed",
    urgent: "Write in an urgent, action-oriented tone that motivates immediate response",
    empathetic: "Write in an empathetic and understanding tone that shows genuine care",
    excited: "Write in an excited and enthusiastic tone that spreads positive energy"
  };

  const contextMap: Record<string, string> = {
    'parents-first': "for parents who are new to our program and need welcoming information",
    'parents-concern': "for a concerned parent who needs reassurance and solutions",
    'donors-new': "for potential first-time donors who need to understand our impact",
    'donors-thank': "for existing donors to express deep gratitude for their support",
    'board-update': "for board members who need comprehensive program insights",
    'staff-announce': "for staff members about important organizational updates",
    'volunteers-recruit': "for recruiting new volunteers to join our mission",
    'community-invite': "for community members to invite them to participate"
  };

  const templateMap: Record<string, string> = {
    event: "Create an event announcement email that includes date, time, location, purpose, and RSVP details",
    fundraising: "Create a fundraising appeal that shares a story, explains the need, and makes a clear ask",
    update: "Create a program update that highlights recent achievements and upcoming plans",
    schedule: "Create a schedule change notification that explains the change and provides alternatives",
    thanks: "Create a heartfelt thank you message that acknowledges specific contributions",
    resolution: "Create a problem resolution email that acknowledges concerns and provides solutions",
    meeting: "Create a meeting request that explains the purpose and suggests specific times",
    newsletter: "Create newsletter content that engages readers with stories and updates"
  };

  const tone = String(toneMap[layer.tone] || "");
  const context = String(contextMap[layer.context] || "");
  const template = String(templateMap[layer.template] || "");

  if (!tone && !context && !template) return "";

  return `${tone}${context ? `, ${context}` : ""}${template ? `. ${template}` : ""}.

Remember to:
- Address the recipient by name when possible
- Keep paragraphs short and scannable
- Include a clear call-to-action
- Sign off with appropriate warmth`;
};

const getSampleEmail = (layer: PromptLayer): string => {
  // Generate contextual sample based on selections
  if (layer.tone === 'warm' && layer.context === 'parents-concern' && layer.template === 'resolution') {
    return `Subject: Re: Your Concern About the Schedule Change - We Have Solutions!

Dear Sarah,

Thank you for reaching out about the new 5:30 PM pickup time. I completely understand how challenging this change must be for you as a working parent, and I want you to know that Emma's place in our program is incredibly important to us.

I'm happy to share that we have several options to ensure Emma can continue thriving with us:

• Extended Care Program: We offer care until 6:30 PM for just $5/day (sliding scale available)
• Parent Carpool Network: Connect with other downtown families for pickup sharing
• Work-Study Option: Emma could help with our younger students while you commute

Your family means so much to our community, and we're committed to finding the solution that works best for you. Could we chat this afternoon to discuss which option would be most helpful?

Emma brings such joy to our program, and we'll do everything we can to keep her with us.

Warmly,
Maya Rodriguez
Program Director`;
  }

  // Default sample for other combinations
  return `Subject: [Your Subject Line Here]

Dear [Recipient Name],

[Opening paragraph acknowledging their situation or introducing the topic]

[Main content paragraph with key information or story]

[Specific details, benefits, or solutions presented clearly]

[Call-to-action or next steps]

[Warm closing that reinforces your care and commitment]

Best regards,
[Your Name]
[Your Title]`;
};

export const MayaPromptSandwichBuilder: React.FC<MayaPromptSandwichBuilderProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'build' | 'preview' | 'success'>('intro');
  const [selections, setSelections] = useState<PromptLayer>({
    tone: '',
    context: '',
    template: ''
  });
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const promptText = getPromptText(selections);
  const isComplete = selections.tone && selections.context && selections.template;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    toast({
      title: "✨ Prompt Copied!",
      description: "Your prompt sandwich is ready to use with any AI tool",
    });
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleGenerateEmail = () => {
    const email = getSampleEmail(selections);
    setGeneratedEmail(email);
    setCurrentPhase('success');
  };

  const resetSelection = (layer: keyof PromptLayer) => {
    setSelections(prev => ({ ...prev, [layer]: '' }));
  };

  if (currentPhase === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Master the AI Prompt Sandwich
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn Maya's secret to crafting perfect AI prompts that generate warm, professional emails every time
            </p>
          </div>

          <ScenarioBlock title="Maya's Discovery" variant="purple">
            After struggling with Sarah's email for 30 minutes, Maya learned this game-changing technique. 
            Now she creates emails in under 5 minutes that perfectly balance warmth and professionalism.
          </ScenarioBlock>

          <div className="space-y-4">
            <FeatureItem 
              title="Layer 1: Tone" 
              description="Set the emotional foundation - how you want your email to feel"
            />
            <FeatureItem 
              title="Layer 2: Context" 
              description="Add the recipient and situation - who you're writing to and why"
            />
            <FeatureItem 
              title="Layer 3: Template" 
              description="Choose the structure - what type of email you're creating"
            />
          </div>

          <Button 
            onClick={() => setCurrentPhase('build')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            size="lg"
          >
            Build Your Prompt Sandwich
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentPhase === 'build') {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Build Your Prompt Sandwich</span>
            <Badge variant={isComplete ? "default" : "outline"} className="text-sm">
              {Object.values(selections).filter(Boolean).length}/3 Layers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Layer 1: Tone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-purple-600">Layer 1:</span> Choose Your Tone
              </h3>
              {selections.tone && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetSelection('tone')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Change
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {toneOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelections(prev => ({ ...prev, tone: option.id }))}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-left",
                    selections.tone === option.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{option.icon}</span>
                    <CheckCircle className={cn(
                      "h-5 w-5 transition-opacity",
                      selections.tone === option.id ? "opacity-100 text-purple-600" : "opacity-0"
                    )} />
                  </div>
                  <p className="font-medium text-sm">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Layer 2: Context */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-blue-600">Layer 2:</span> Add Context
              </h3>
              {selections.context && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetSelection('context')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Change
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contextOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelections(prev => ({ ...prev, context: option.id }))}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    selections.context === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layer 3: Template */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-green-600">Layer 3:</span> Pick Template
              </h3>
              {selections.template && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetSelection('template')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Change
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelections(prev => ({ ...prev, template: option.id }))}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    selections.template === option.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Prompt Preview */}
          {promptText && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg">Your Prompt Sandwich:</h3>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 relative">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {promptText}
                </pre>
                <Button
                  onClick={handleCopyPrompt}
                  size="sm"
                  variant="outline"
                  className="absolute top-4 right-4"
                >
                  {copiedPrompt ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPhase('intro')}
              className="flex-1"
            >
              Back to Intro
            </Button>
            <Button
              onClick={() => setCurrentPhase('preview')}
              disabled={!isComplete}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Preview Email Output
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentPhase === 'preview') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Preview AI-Generated Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Sample Output</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {getSampleEmail(selections)}
            </pre>
          </div>

          <ScenarioBlock title="How Maya Uses This" variant="blue">
            Maya copies her prompt sandwich into ChatGPT or Claude, adds specific details about her situation, 
            and gets a perfectly crafted email in seconds. She then personalizes it with specific names and details.
          </ScenarioBlock>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentPhase('build')}
              className="flex-1"
            >
              Adjust Prompt
            </Button>
            <Button
              onClick={handleGenerateEmail}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              See How This Saves Time
              <Clock className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentPhase === 'success') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Prompt Sandwich Complete!
            </h2>
          </div>

          <ImpactStatement>
            What took Maya 32 agonizing minutes now takes less than 5. 
            The prompt sandwich ensures every email maintains her caring voice while sounding professional.
          </ImpactStatement>

          <div className="bg-green-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Your Time Savings
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-red-500 line-through">32 min</p>
                <p className="text-sm text-gray-600">Without AI</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-3xl font-bold text-green-600">5 min</p>
                <p className="text-sm text-gray-600">With Your Prompt</p>
              </div>
            </div>
            <p className="text-center text-green-700 font-medium">
              You'll save 27 minutes per email! 🎉
            </p>
          </div>

          <DialogueBlock
            quote="The prompt sandwich changed everything. Now I help parents like Sarah with confidence, knowing my emails sound both caring and professional. It's not about replacing my voice—it's about amplifying it."
            author="Maya Rodriguez"
          />

          <div className="space-y-3">
            <h3 className="font-semibold">Next Steps:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>1. Copy your prompt sandwich to your favorite AI tool (ChatGPT, Claude, etc.)</p>
              <p>2. Add specific details about your recipient and situation</p>
              <p>3. Review and personalize the generated email</p>
              <p>4. Send with confidence in under 5 minutes!</p>
            </div>
          </div>

          <Button
            onClick={() => {
              onComplete?.();
              toast({
                title: "🎯 Skill Mastered!",
                description: "You've learned Maya's prompt sandwich technique",
              });
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            size="lg"
          >
            Continue Maya's Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};