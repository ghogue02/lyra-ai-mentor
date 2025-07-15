import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, ArrowLeft, Heart } from 'lucide-react';

interface MayaMicroLessonTestProps {
  onBack?: () => void;
}

const MayaMicroLessonTest: React.FC<MayaMicroLessonTestProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedContent, setTypedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const steps = [
    "Hi! I'm Maya Rodriguez, and I'm so glad you're here.\n\nThis is the minimal UI version of our lesson, designed to help you focus on what matters most.",
    "I used to spend 32 minutes writing each email...\n\nThat precious time was taken away from:\n• My family at home\n• The children at Hope Gardens\n• The work I truly love\n\nSomething had to change.",
    "But then I discovered something that transformed everything:\n\nThe Email Recipe Method\n\nIt's simple, powerful, and works like magic. Let me show you how it changed my life.",
    "With just 3 simple ingredients:\n\n• Purpose - What do you need?\n• Audience - Who will read this?\n• Tone - How should it feel?\n\nI can now write emails in under 5 minutes! From 32 minutes to 5... that's 27 minutes saved per email.",
    "You've just experienced how thoughtful design makes learning feel natural.\n\nNotice how:\n• The rhythm follows natural speech\n• Pauses give you time to think\n• Clean design reduces distraction\n\nReady to transform your own email writing?"
  ];

  const currentContent = steps[currentStep] || '';

  // Enhanced typewriter effect
  useEffect(() => {
    if (!currentContent) {
      console.log('No content to type');
      return;
    }

    console.log('Starting typewriter for:', currentContent.slice(0, 50) + '...');
    
    // Reset state immediately
    setIsTyping(true);
    setTypedContent('');
    setShowContinue(false);

    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const typeChar = () => {
      if (charIndex < currentContent.length) {
        const char = currentContent[charIndex];
        const prevChar = charIndex > 0 ? currentContent[charIndex - 1] : '';
        const nextChar = charIndex < currentContent.length - 1 ? currentContent[charIndex + 1] : '';
        
        // Update content first
        setTypedContent(currentContent.slice(0, charIndex + 1));
        charIndex++;
        
        // Natural storytelling rhythm - like a human reading aloud
        let delay = 45 + Math.random() * 25; // Base: 45-70ms (comfortable reading pace)
        
        // Dramatic storytelling pauses
        if (['.', '!', '?'].includes(char)) {
          delay += 400; // Long pause at end of sentences (like breathing)
        } else if ([',', ';'].includes(char)) {
          delay += 200; // Medium pause for commas (natural speech pattern)
        } else if ([':'].includes(char)) {
          delay += 300; // Longer pause for colons (building anticipation)
        } else if (char === '-' && nextChar === ' ') {
          delay += 250; // Pause for dramatic dashes
        } else if (char === ' ' && prevChar === '.') {
          delay += 100; // Extra pause after period + space
        }
        
        // Slow down for emphasis words (capitals, numbers)
        if (char === char.toUpperCase() && char !== char.toLowerCase() && prevChar === ' ') {
          delay += 80; // Emphasize important words
        }
        
        // Vary speed for natural rhythm
        if (charIndex % 15 === 0) {
          delay += Math.random() * 30; // Random micro-pauses every ~3 words
        }
        
        // Emotional pacing based on content
        const sentence = currentContent.slice(Math.max(0, charIndex - 50), charIndex + 50).toLowerCase();
        if (sentence.includes('amazing') || sentence.includes('wonderful') || sentence.includes('excited')) {
          delay *= 0.8; // Slightly faster for excitement
        } else if (sentence.includes('challenge') || sentence.includes('difficult') || sentence.includes('struggle')) {
          delay *= 1.3; // Slower for serious topics
        } else if (sentence.includes('transformation') || sentence.includes('discovery') || sentence.includes('magic')) {
          delay *= 1.1; // Slightly slower for important moments
        }
        
        // Extra pause for line breaks and bullet points
        if (char === '\n') {
          delay += 300; // Pause between paragraphs
        } else if (char === '•') {
          delay += 150; // Brief pause before bullet points
        }
        
        timeoutId = setTimeout(typeChar, delay);
      } else {
        console.log('Typewriter complete');
        setIsTyping(false);
        setShowContinue(true);
      }
    };

    // Start typing immediately with no delay
    timeoutId = setTimeout(typeChar, 100); // Very short delay to ensure render
    
    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentContent, currentStep]);

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Lesson complete
      alert('🎉 Test lesson complete! The typewriter effect is working.');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="minimal-ui min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div className="text-sm text-gray-600">Test Lesson • Typewriter Debug</div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Maya's Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">Maya Rodriguez</div>
              <div className="text-sm text-gray-600">Hope Gardens Community Center</div>
            </div>
          </div>

          {/* Content with Typewriter */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 relative">
            <div className="text-lg leading-relaxed text-gray-800 font-['Georgia','Cambria','Times_New_Roman',serif] whitespace-pre-wrap">
              {typedContent}
              {isTyping && (
                <span className="inline-block w-0.5 h-6 bg-purple-500 ml-1 animate-pulse shadow-sm" />
              )}
            </div>
            
            {/* Storytelling rhythm indicator */}
            {isTyping && (
              <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs text-purple-600">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="opacity-70">storytelling rhythm</span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          {showContinue && (
            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Complete Test
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MayaMicroLessonTest;