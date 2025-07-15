import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Clock, User, Target, Sparkles, Send } from 'lucide-react';

interface AIEmailComposerRendererProps {
  element: {
    id: number;
    title: string;
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const AIEmailComposerRenderer: React.FC<AIEmailComposerRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [emailContext, setEmailContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');

  const config = element.configuration || {};
  const phases = config.phases || [];
  const character = config.character || 'Maya Rodriguez';
  const timeSavings = config.timeSavings || {};

  const currentPhaseData = phases[currentPhase];

  const handleGenerateEmail = async () => {
    if (!emailContext.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI email generation with realistic delay
    setTimeout(() => {
      const sampleEmails = {
        parent_concern: `Dear Sarah,

Thank you for reaching out about the new pickup time. I completely understand your concern about the 5:30 PM schedule conflicting with your work hours.

Let me share some context: we implemented the earlier pickup time to better align with our staff schedules and ensure quality supervision. However, I recognize this creates challenges for working parents like yourself.

Here are three options I'd like to offer:

1. **Extended Care Program**: We offer supervised activities until 6:30 PM for a small additional fee ($15/week)
2. **Carpool Network**: I can connect you with other families who might share pickup responsibilities
3. **Flexible Payment Plan**: If cost is a concern, we can discuss payment options for the extended care

Emma is such a joy to have in our program, and I want to ensure this works for your family. Would you like to schedule a brief call to discuss which option might work best?

Looking forward to finding a solution together.

Warm regards,
Maya Rodriguez
Program Director`,
        
        board_concern: `Dear Patricia,

Thank you for bringing this important concern to my attention. I appreciate the board's fiduciary responsibility and your direct communication about the after-school program's sustainability.

I'm pleased to provide the requested information and share some promising developments:

**Current Cost Analysis:**
- Cost per child: $156/month (down from $162 last quarter through efficiency improvements)
- 85% of costs covered by current grant funding
- Administrative overhead: 12% (well below sector average of 18%)

**Alternative Funding Pipeline:**
- Corporate sponsorship initiative launched with 3 companies expressing interest
- Community foundation grant ($75K) submitted, decision expected next month
- Parent fundraising committee raised $12K in Q3 (exceeding goal by 40%)

**Sustainability Measures:**
- Volunteer tutor program reducing staffing costs by 20%
- Shared resources agreement with neighboring center
- Equipment lease-to-own program reducing capital expenses

The data shows strong program health with diversified funding strategy. I'd be honored to present these findings to the board and discuss the program's transformative impact on 60 children and their families.

Would you prefer a pre-meeting call to review these materials?

Best regards,
Maya Rodriguez`
      };

      setGeneratedEmail(sampleEmails.parent_concern);
      setIsGenerating(false);
    }, 2000);
  };

  const handleNextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      onComplete();
    }
  };

  if (isElementCompleted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Mail className="w-5 h-5" />
            {element.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-700">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Completed!</span>
            <Badge className="bg-green-600 text-white">
              Time Saved: {timeSavings.metric || '84%'}
            </Badge>
          </div>
          <p className="text-sm text-green-600 mt-2">
            You've mastered AI-powered email composition with {character}'s techniques.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Mail className="w-5 h-5" />
          {element.title}
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="text-blue-700">
            <User className="w-3 h-3 mr-1" />
            {character}
          </Badge>
          <Badge variant="outline" className="text-green-700">
            <Clock className="w-3 h-3 mr-1" />
            {timeSavings.before || '30 min'} → {timeSavings.after || '5 min'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Phase {currentPhase + 1} of {phases.length}
          </span>
          <div className="flex gap-1">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentPhase ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Phase Content */}
        {currentPhaseData && (
          <div className="space-y-4">
            <div className="bg-white/50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                {currentPhaseData.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {currentPhaseData.description}
              </p>
              <Badge variant="outline" className="text-purple-700">
                <Target className="w-3 h-3 mr-1" />
                {currentPhaseData.duration || '5 minutes'}
              </Badge>
            </div>

            {/* Email Context Input */}
            {currentPhase === 0 && (
              <div className="space-y-3">
                <Label htmlFor="email-context" className="text-sm font-medium">
                  Describe the email situation you need help with:
                </Label>
                <Textarea
                  id="email-context"
                  placeholder="e.g., A parent is concerned about new pickup times conflicting with work..."
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleGenerateEmail}
                  disabled={!emailContext.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating AI Response...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Email with AI
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Generated Email Display */}
            {generatedEmail && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Generated Email:</Label>
                <div className="bg-white border rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {generatedEmail}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm font-medium">
                    How would you refine this email?
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Add any adjustments or feedback..."
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
            disabled={currentPhase === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNextPhase}
            disabled={currentPhase === 0 && !generatedEmail}
          >
            {currentPhase === phases.length - 1 ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              'Next Phase'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};