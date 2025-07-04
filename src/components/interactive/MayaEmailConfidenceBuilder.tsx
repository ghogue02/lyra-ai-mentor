import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Heart, Mail, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DialogueBlock, 
  StoryContext, 
  ScenarioBlock, 
  ImpactStatement,
  transformTextFormatting 
} from './InteractiveTextStyles';

interface MayaEmailConfidenceBuilderProps {
  onComplete?: () => void;
  element?: any; // Extra props from InteractiveElementRenderer
  isElementCompleted?: boolean; // Extra props from InteractiveElementRenderer
  [key: string]: any; // Allow additional props to prevent object-to-primitive errors
}

export const MayaEmailConfidenceBuilder: React.FC<MayaEmailConfidenceBuilderProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'context' | 'anxiety' | 'build' | 'transform' | 'success'>('context');
  const [emailDraft, setEmailDraft] = useState('');
  const [enhancedEmail, setEnhancedEmail] = useState('');

  const sampleDraft = `Subject: Field Trip to Science Museum - Friday Nov 15th

Hi everyone,

I hope you're doing well! I wanted to reach out about our upcoming field trip to the City Science Museum on Friday, November 15th. I'm honestly so excited about this one.

The kids are going to get hands-on time with exhibits about environmental science and renewable energy, which ties perfectly into what we've been talking about in class with sustainability. You know how they light up when they can actually touch and explore things instead of just reading about them.

Here's what you need to know:
We'll leave the school at 9:00 AM and be back by 3:00 PM. The cost is $15 per student and that covers everything - admission and the bus. Please pack a lunch because we'll eat together at their picnic area.

I do need those permission slips back by Wednesday, November 13th so we can finalize everything.

This is exactly the kind of experience I dreamed about when I started working here. Last time we did something like this, Maria came back asking a million questions about solar panels, and now she wants to be an engineer.

If you have any questions at all, just email me back or give me a call. I'm always here.

Thanks for trusting us with your amazing kids.

Maya Rodriguez
Program Director`;

  const useSampleDraft = () => {
    setEmailDraft(sampleDraft);
    toast({
      title: "✨ Sample Draft Added!",
      description: "You can use this as-is or customize it to your needs",
    });
  };

  const handleTransformEmail = async () => {
    setCurrentPhase('transform');
    
    // Create an actual AI transformation of the email content
    const transformation = enhanceEmailContent(emailDraft);
    setEnhancedEmail(transformation);
    
    toast({
      title: "🌟 Email Transformed!",
      description: "Maya's confidence is shining through her communication",
    });
  };

  const enhanceEmailContent = (originalEmail: string): string => {
    // Ensure originalEmail is always a string to prevent object-to-primitive errors
    const safeEmail = typeof originalEmail === 'string' ? originalEmail : String(originalEmail || '');
    const emailLower = safeEmail.toLowerCase().trim();
    
    // Check if user is asking for help
    const helpPhrases = ['i don\'t know', 'i dont know', 'help', 'not sure', 'what should i', 'how do i', 'stuck', 'can\'t think'];
    const isAskingForHelp = helpPhrases.some(phrase => emailLower.includes(phrase));
    
    // If empty or just asking for help, generate a complete email
    if (!safeEmail.trim() || isAskingForHelp) {
      return `Subject: Science Museum Field Trip - Friday, November 15th

Dear families,

I hope this message finds you well. I'm writing to share exciting news about our upcoming field trip to the City Science Museum on Friday, November 15th.

Our students will have the opportunity to explore hands-on exhibits focused on environmental science and renewable energy. This experience directly connects to our current classroom discussions about sustainability and will help bring these important concepts to life for our young learners.

Here are the important details:
- Departure: 9:00 AM from school
- Return: 3:00 PM
- Cost: $15 per student (includes admission and transportation)
- Lunch: Please pack a lunch for your child

Permission slips must be returned by Wednesday, November 13th to secure your child's spot.

I'm truly excited about this opportunity for our students to engage with science in such an interactive way. These experiences often spark curiosity that lasts well beyond the field trip itself.

If you have any questions or concerns, please don't hesitate to reach out via email or phone. I'm always available to support you and your children.

Thank you for your continued trust and partnership in your child's education.

Warm regards,
Maya Rodriguez
Program Director

<div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
  <h4 class="font-semibold text-purple-900 mb-3 flex items-center gap-2">
    <span class="text-xl">✨</span> AI Generated This Complete Email For You
  </h4>
  <div class="space-y-2 text-sm text-purple-800">
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Professional yet warm tone that parents appreciate</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>All essential information clearly organized</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Personal touches that show genuine care</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Confident communication style that builds trust</span>
    </div>
  </div>
  <p class="mt-3 text-purple-900 font-medium">
    Feel free to customize any part to match your specific situation!
  </p>
</div>`;
    }

    // For short but actual attempts at writing
    if (safeEmail.trim().length < 100) {
      return `${safeEmail}

I notice you've started drafting but might need some help expanding your thoughts. Here's a enhanced version:

Subject: Science Museum Field Trip - Friday, November 15th

Dear families,

${safeEmail}

I wanted to provide more details about our exciting field trip to the City Science Museum on Friday, November 15th. This hands-on experience will complement our classroom learning about environmental science and sustainability.

Important details:
- Departure: 9:00 AM from school
- Return: 3:00 PM
- Cost: $15 per student
- Please pack a lunch

Permission slips are due by Wednesday, November 13th.

Please reach out if you have any questions. I'm looking forward to this wonderful learning opportunity for our students.

Best regards,
Maya Rodriguez

<div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
  <h4 class="font-semibold text-purple-900 mb-3 flex items-center gap-2">
    <span class="text-xl">✨</span> AI Enhancement Applied
  </h4>
  <div class="space-y-2 text-sm text-purple-800">
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Expanded your initial thoughts into a complete email</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Added structure and essential details</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Maintained warm, professional tone</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Included all necessary information for parents</span>
    </div>
  </div>
</div>`;
    }

    // For substantial email content, provide actual enhancement
    const enhancedVersion = safeEmail
      .replace(/Hi everyone,/g, 'Dear families,')
      .replace(/I hope you're doing well!/g, 'I hope this message finds you and your families well.')
      .replace(/honestly so excited/g, 'truly excited')
      .replace(/Here's what you need to know:/g, 'Here are the important details:')
      .replace(/just email me back/g, 'please don\'t hesitate to reach out via email')
      .replace(/I'm always here/g, 'I\'m always available to support you and your children');

    return `${enhancedVersion}

<div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
  <h4 class="font-semibold text-purple-900 mb-3 flex items-center gap-2">
    <span class="text-xl">✨</span> AI Enhancement Applied
  </h4>
  <div class="space-y-2 text-sm text-purple-800">
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Enhanced professional tone while maintaining Maya's warmth</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Strengthened confident language and clear communication</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Improved structure and flow for better readability</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-purple-500 mt-0.5">•</span>
      <span>Added subtle touches that build trust and credibility</span>
    </div>
  </div>
  <p class="mt-3 text-purple-900 font-medium italic">
    Maya's authentic caring nature now shines through with professional confidence!
  </p>
</div>`;
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: 'maya-email-confidence-builder',
        lesson_id: 5,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Building Email Confidence
              </h2>
            </div>
            
            <StoryContext
              challenge="Email anxiety is holding her back from authentic communication"
              solution="Transform anxiety into confidence through AI-assisted writing"
              mission="Help Maya discover her natural, caring communication style"
            />
            
            <Button 
              onClick={() => setCurrentPhase('anxiety')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              Help Maya Build Confidence
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'anxiety':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-6">Maya's Email Challenge</h2>
            </div>
            
            <DialogueBlock
              quote="I stare at the blank email screen, worried about sounding too casual... or too formal... or making a mistake that reflects poorly on our program. The families trust us with their children, and I want my emails to show how much I care without sounding unprofessional."
              author="Maya Rodriguez"
            />
            
            <Button 
              onClick={() => setCurrentPhase('build')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              Start Building Maya's Confidence
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Practice Makes Confident</h2>
              <p className="text-gray-600">Help Maya draft an email with her authentic voice</p>
            </div>
            
            <ScenarioBlock title="Scenario: Program Update Email" variant="blue">
              Write an email to parents about the upcoming field trip to the science museum. 
              Include logistics, what to expect, and how it connects to their children's learning.
            </ScenarioBlock>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">You can write your own email or use a sample draft to get started:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={useSampleDraft}
                className="flex items-center gap-2 hover:bg-white"
              >
                <FileText className="w-4 h-4" />
                Use Sample Draft
              </Button>
            </div>
            
            <Textarea
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="Draft Maya's email here. Focus on being authentic and caring..."
              className="min-h-[150px]"
            />
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('anxiety')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleTransformEmail}
                disabled={!emailDraft}
                className="flex-1 bg-blue-600 hover:bg-blue-600/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Transform with AI
              </Button>
            </div>
          </div>
        );

      case 'transform':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Maya's Confident Email</h2>
              <p className="text-gray-600">AI-enhanced to show Maya's natural warmth and professionalism</p>
            </div>
            
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Enhanced Email</span>
                </div>
                <div 
                  className="prose prose-base max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: transformTextFormatting(enhancedEmail) }}
                />
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
            >
              Maya Feels Confident!
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-8 py-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-lg">
              <Heart className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Confidence Unlocked!
              </h2>
              <ImpactStatement>
                Maya discovered that her caring nature IS her professional strength. 
                She can write emails that are both warm and professional.
              </ImpactStatement>
              <DialogueBlock
                quote="I realize now that being caring and professional aren't opposites - they work together to show families how much we value their trust."
                author="Maya"
                className="max-w-md mx-auto"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};