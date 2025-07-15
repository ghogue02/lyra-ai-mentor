import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight, Check, MessageCircle, Edit3, Sparkles, Wand2 } from 'lucide-react';
import { useAdaptiveUI } from '../../hooks/useAdaptiveUI';
import '../../styles/minimal-ui.css';

interface EmailPracticeMinimalProps {
  onComplete: () => void;
  userId?: string;
}

const MayaInteractiveEmailPracticeMinimal: React.FC<EmailPracticeMinimalProps> = ({
  onComplete,
  userId
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'scenario' | 'practice' | 'ai-magic' | 'compare' | 'complete'>('intro');
  const [userEmail, setUserEmail] = useState('');
  const [aiGeneratedEmail, setAiGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [showNextAction, setShowNextAction] = useState(false);

  const adaptiveUI = useAdaptiveUI(userId);

  const scenario = {
    recipient: "Sarah Johnson (parent)",
    situation: "Her son Jayden has been making great progress in the robotics program",
    purpose: "Share good news and invite her to the showcase",
    tone: "Warm and excited"
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return "Now let's practice! I'll give you a real scenario that I faced last week. You'll write an email, then see how AI can help make it even better.";
      case 'scenario':
        return `Here's the situation: I need to email Sarah Johnson, whose son Jayden has been doing amazingly in our robotics program. He's built incredible projects and shown real leadership.\n\nI want to share this good news and invite her to our showcase next Friday. The tone should be warm and excited - this is great news to share!`;
      case 'practice':
        return "Your turn! Write an email to Sarah about Jayden's progress. Remember the recipe: Purpose (share good news + invite), Audience (busy parent), Tone (warm and excited).";
      case 'ai-magic':
        return "Great job! Now let me show you something amazing. Watch AI take your same ingredients and create a polished email in seconds.";
      case 'compare':
        return "See how AI transformed the basic elements into a professional, warm email? Both versions work - AI just helps you write faster and with more confidence.";
      case 'complete':
        return "You've mastered email writing with AI! From 32 minutes to 2 minutes - that's the transformation Maya experienced. You're ready to revolutionize your communication.";
      default:
        return "";
    }
  };

  // Typewriter effect
  useEffect(() => {
    const content = getStepContent();
    if (!content) return;

    setIsTyping(true);
    setTypedContent('');
    setShowNextAction(false);

    const wordCount = content.split(' ').length;
    adaptiveUI.startReading(wordCount);

    let charIndex = 0;
    const typeNextChar = () => {
      if (charIndex < content.length) {
        const char = content[charIndex];
        const speed = adaptiveUI.getTypewriterSpeed(char, charIndex);

        setTypedContent(prev => prev + char);
        charIndex++;

        setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        setShowNextAction(true);
        adaptiveUI.endReading();
      }
    };

    setTimeout(typeNextChar, 500);
  }, [currentStep, adaptiveUI]);

  const handleContinue = useCallback(() => {
    adaptiveUI.trackInteraction({
      type: 'click',
      timestamp: Date.now(),
      target: 'continue-button'
    });

    if (currentStep === 'intro') {
      setCurrentStep('scenario');
    } else if (currentStep === 'scenario') {
      setCurrentStep('practice');
    } else if (currentStep === 'practice' && userEmail.trim()) {
      setCurrentStep('ai-magic');
    } else if (currentStep === 'ai-magic') {
      setCurrentStep('compare');
    } else if (currentStep === 'compare') {
      setCurrentStep('complete');
    } else if (currentStep === 'complete') {
      onComplete();
    }
  }, [currentStep, userEmail, adaptiveUI, onComplete]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserEmail(e.target.value);
    adaptiveUI.trackInteraction({
      type: 'type',
      timestamp: Date.now(),
      target: 'email-draft'
    });
  };

  const generateAIEmail = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiEmail = `Subject: Jayden's Amazing Progress - Robotics Showcase Invitation! 🤖

Hi Sarah,

I hope this email finds you well! I wanted to share some wonderful news about Jayden's progress in our after-school robotics program.

Over the past few weeks, Jayden has been absolutely thriving! Not only has he mastered the technical aspects of programming and building, but he's also emerged as a natural leader among his peers. I've watched him patiently help other students debug their code and explain complex concepts with such clarity.

His latest robot creation is truly impressive - it can navigate obstacles, respond to voice commands, and even perform a little dance routine that makes everyone smile. The confidence and joy he shows while working on these projects is exactly why we do this work.

I'm thrilled to invite you to our Robotics Showcase next Friday, March 15th at 3:00 PM in the Hope Gardens main hall. Jayden is incredibly excited to demonstrate his robot and share what he's learned. Light refreshments will be provided, and it's always wonderful to see our families come together.

Please let me know if you'll be able to attend - Jayden mentions you often and I know having you there would mean the world to him.

Thank you for your continued support of our program. Students like Jayden remind us every day why this work matters.

Warm regards,
Maya Rodriguez
Program Director, Hope Gardens Community Center
maya.rodriguez@hopegardens.org
(555) 123-4567`;

    setAiGeneratedEmail(aiEmail);
    setIsGenerating(false);
  }, []);

  const progress = (() => {
    const stepOrder = ['intro', 'scenario', 'practice', 'ai-magic', 'compare', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  })();

  return (
    <div className={`minimal-ui min-h-screen ${adaptiveUI.getAmbientClass()}`}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="minimal-progress mb-8">
          <div 
            className="minimal-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main content */}
        <div className="minimal-card fade-in">
          {/* Header */}
          <div className="text-hint mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Email Practice Lab • Step {['intro', 'scenario', 'practice', 'ai-magic', 'compare', 'complete'].indexOf(currentStep) + 1} of 6
          </div>

          {/* Content with typewriter effect */}
          <div className="text-primary mb-6">
            <span className="minimal-typewriter">
              {typedContent}
              {isTyping && <span className="minimal-typewriter-cursor" />}
            </span>
          </div>

          {/* Interactive area */}
          {showNextAction && (
            <div className="slide-up">
              {/* Scenario summary */}
              {currentStep === 'scenario' && (
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-900 mb-3">Email Scenario:</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>To:</strong> {scenario.recipient}</div>
                    <div><strong>About:</strong> {scenario.situation}</div>
                    <div><strong>Purpose:</strong> {scenario.purpose}</div>
                    <div><strong>Tone:</strong> {scenario.tone}</div>
                  </div>
                </div>
              )}

              {/* Email writing practice */}
              {currentStep === 'practice' && (
                <div className="mb-6">
                  <label className="block text-secondary mb-2">
                    Write your email to Sarah:
                  </label>
                  <textarea
                    value={userEmail}
                    onChange={handleEmailChange}
                    className="minimal-input"
                    rows={8}
                    placeholder="Subject: [Your subject line]

Hi Sarah,

[Your message here...]

Best regards,
Maya"
                  />
                  {adaptiveUI.shouldSlowDown && userEmail.length < 50 && (
                    <div className="mt-2 text-hint text-sm">
                      💡 Remember: Purpose (share good news + invite), Audience (busy parent), Tone (warm and excited)
                    </div>
                  )}
                </div>
              )}

              {/* AI Magic demonstration */}
              {currentStep === 'ai-magic' && (
                <div className="mb-6">
                  {!aiGeneratedEmail ? (
                    <button
                      onClick={generateAIEmail}
                      disabled={isGenerating}
                      className="minimal-button w-full py-3 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          AI is writing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          Generate AI Email
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">AI Generated Email:</span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                          {aiGeneratedEmail}
                        </div>
                      </div>
                      <div className="text-center text-sm text-green-600">
                        ⚡ Generated in 2 seconds instead of 20 minutes!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comparison view */}
              {currentStep === 'compare' && userEmail && aiGeneratedEmail && (
                <div className="mb-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-secondary mb-2">Your Email:</h3>
                      <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap min-h-32">
                        {userEmail}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary mb-2">AI Enhanced:</h3>
                      <div className="p-3 bg-green-50 rounded text-sm whitespace-pre-wrap min-h-32">
                        {aiGeneratedEmail}
                      </div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-sm text-blue-700">
                      Both approaches work! AI helps you write faster and with more polish.
                    </div>
                  </div>
                </div>
              )}

              {/* Continue button */}
              <div className="flex justify-end">
                <button
                  onClick={handleContinue}
                  className="minimal-button"
                  disabled={currentStep === 'practice' && !userEmail.trim()}
                >
                  {currentStep === 'complete' ? (
                    <>
                      Complete
                      <Check className="inline-block w-4 h-4 ml-2" />
                    </>
                  ) : currentStep === 'ai-magic' && !aiGeneratedEmail ? (
                    <>
                      Generate Email First
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="inline-block w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Completion celebration */}
          {currentStep === 'complete' && (
            <div className="mt-6 p-6 minimal-card slide-up" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Email AI Master!</h3>
                <p className="opacity-90">
                  You've learned to combine human insight with AI efficiency. That's the future of communication!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MayaInteractiveEmailPracticeMinimal;