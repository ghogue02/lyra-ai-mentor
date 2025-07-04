import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Clock, CheckCircle, Sparkles, Heart, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import { 
  DialogueBlock, 
  EmotionBlock,
  ScenarioBlock,
  ImpactStatement 
} from './InteractiveTextStyles';

interface MayaParentResponseEmailProps {
  onComplete?: () => void;
  element?: any; // Extra props from InteractiveElementRenderer
  isElementCompleted?: boolean; // Extra props from InteractiveElementRenderer
  [key: string]: any; // Allow additional props to prevent object-to-primitive errors
}

interface TemplateSection {
  id: string;
  label: string;
  placeholder: string;
  suggestions: string[];
  userInput: string;
  aiEnhanced: string;
}

export const MayaParentResponseEmail: React.FC<MayaParentResponseEmailProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'compose' | 'preview' | 'success'>('setup');
  const [selectedTone, setSelectedTone] = useState<'warm' | 'professional' | 'solution'>('warm');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showEnhancements, setShowEnhancements] = useState(false);
  const [successStep, setSuccessStep] = useState(0);
  
  const [sections, setSections] = useState<TemplateSection[]>([
    {
      id: 'opening',
      label: 'Start with understanding',
      placeholder: 'Click a phrase or type your own warm acknowledgment',
      suggestions: [
        "Hi Sarah, I completely understand your concern about the pickup time change, and I want you to know that Emma's place in our program is important to us.",
        "Dear Sarah, Thank you for reaching out. I can absolutely hear the stress in your message, and I want to assure you that we're here to find a solution together.",
        "Hi Sarah, First, let me say how much we value having Emma in our program. I understand this schedule change creates a real challenge for your family."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'explanation',
      label: 'Explain with transparency',
      placeholder: 'Choose how to explain the change or write your own',
      suggestions: [
        "The change to 5:30 PM was necessary due to new staff scheduling requirements and enhanced safety protocols during darker evening hours.",
        "We had to adjust our hours to ensure proper staff coverage and maintain the high-quality supervision that keeps all our kids safe.",
        "This decision came after careful consideration of staff availability and child safety requirements, especially as daylight hours shorten."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'solutions',
      label: 'Offer concrete options',
      placeholder: 'Select solutions or customize for Sarah\'s situation',
      suggestions: [
        "I'm excited to share that we have several options: Extended care until 6:30 PM for just $5/day (sliding scale available), our new parent carpool network, or a work-study opportunity for Emma.",
        "Here are three ways we can make this work: 1) Affordable extended care, 2) Connection with other downtown parents for pickup sharing, 3) A special helper role for Emma with our younger students.",
        "Let's explore these possibilities together: Our extended care program, carpool matching with families in your area, or discussing a modified schedule that works better for you."
      ],
      userInput: '',
      aiEnhanced: ''
    },
    {
      id: 'closing',
      label: 'End with partnership',
      placeholder: 'Choose a warm closing or write your own',
      suggestions: [
        "Emma is such a bright light in our program, and we'll do everything we can to keep her with us. Could we chat this afternoon to discuss which option works best for your family?",
        "Please know that we're committed to finding a solution that works for you. Would you be available for a quick call today or tomorrow to go over these options in detail?",
        "We're in this together, Sarah. Emma's well-being is our shared priority. Let me know when you're free to talk, and we'll create a plan that gives you peace of mind."
      ],
      userInput: '',
      aiEnhanced: ''
    }
  ]);

  // Timer effect
  useEffect(() => {
    if (currentStep === 'compose' && startTime === 0) {
      setStartTime(Date.now());
    }
    
    if (currentStep === 'compose') {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep, startTime]);

  // Success sequence animation
  useEffect(() => {
    if (currentStep === 'success') {
      const timers = [
        setTimeout(() => setSuccessStep(1), 500),   // Show time saved
        setTimeout(() => setSuccessStep(2), 2000),  // Show Sarah's reply
        setTimeout(() => setSuccessStep(3), 4000),  // Show Lyra's coaching
        setTimeout(() => setSuccessStep(4), 6000),  // Show personal application
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [currentStep]);

  const handleSuggestionClick = (sectionId: string, suggestion: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, userInput: suggestion, aiEnhanced: enhanceText(suggestion) }
        : section
    ));
  };

  const handleInputChange = (sectionId: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, userInput: value }
        : section
    ));
  };

  const handleInputBlur = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.userInput) {
      setSections(prev => prev.map(s => 
        s.id === sectionId 
          ? { ...s, aiEnhanced: enhanceText(s.userInput) }
          : s
      ));
      setShowEnhancements(true);
      setTimeout(() => setShowEnhancements(false), 2000);
    }
  };

  const enhanceText = (text: string): string => {
    // Simulate AI enhancement
    const enhancements: { [key: string]: string } = {
      "don't worry": "I understand your concern",
      "can't": "we're working to find a way to",
      "policy": "to ensure all children's safety",
      "sorry": "I understand this creates a challenge"
    };
    
    let enhanced = text;
    Object.entries(enhancements).forEach(([key, value]) => {
      enhanced = enhanced.replace(new RegExp(key, 'gi'), value);
    });
    
    return enhanced;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Number(seconds) / 60);
    const secs = Number(seconds) % 60;
    return `${String(mins)}:${String(secs).padStart(2, '0')}`;
  };

  const isComplete = sections.every(s => s.userInput || s.aiEnhanced);

  const getFinalEmail = () => {
    return sections.map(s => s.aiEnhanced || s.userInput).join('\n\n');
  };

  if (currentStep === 'setup') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">Monday 8:47 AM</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">From:</span>
                  <span>Sarah Chen &lt;sarahchen@email.com&gt;</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-semibold">Subject:</span>
                  <span className="text-red-600 font-medium">Urgent - Program Changes?</span>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>Hi Maya,</p>
                  <p>I just saw the notice about the new 5:30 PM pickup time starting next month. As a single parent working until 6 PM downtown, I'm really concerned about how this will work for Emma and me.</p>
                  <p>She loves the program and her friends there. Is there any flexibility? I'm worried she'll have to drop out, and I don't know what I'll do for childcare. Can we talk about options?</p>
                  <p>I'm feeling pretty stressed about this.</p>
                  <p>Thanks,<br />Sarah Chen</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmotionBlock className="mb-6">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Maya's Inner Thoughts</p>
                <p className="text-gray-700 italic leading-relaxed">
                  "Sarah never emails unless something's really wrong. I can feel her stress. Emma would be devastated to leave the program. I need to help, but how do I balance empathy with our policies?"
                </p>
              </div>
            </div>
          </EmotionBlock>
          
          <Button 
            onClick={() => setCurrentStep('compose')} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Help Maya Transform Anxiety into Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'compose') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Composing Response to Sarah</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSelectedTone('warm')}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                selectedTone === 'warm' 
                  ? "bg-orange-100 text-orange-700 border-2 border-orange-300" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              🤗 Warm & Understanding
            </button>
            <button
              onClick={() => setSelectedTone('professional')}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                selectedTone === 'professional' 
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              💼 Professional & Caring
            </button>
            <button
              onClick={() => setSelectedTone('solution')}
              className={cn(
                "px-3 py-1 rounded-full text-sm transition-colors",
                selectedTone === 'solution' 
                  ? "bg-green-100 text-green-700 border-2 border-green-300" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              🎯 Solution-Focused
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                  {index + 1}
                </span>
                <h4 className="font-medium">{section.label}</h4>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{section.placeholder}</p>
                
                <div className="flex flex-wrap gap-2">
                  {section.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(section.id, suggestion)}
                      className="text-left text-sm p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                    >
                      <span className="text-blue-600 mr-1">🔹</span>
                      {suggestion.substring(0, 60)}...
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <textarea
                    value={section.userInput}
                    onChange={(e) => handleInputChange(section.id, e.target.value)}
                    onBlur={() => handleInputBlur(section.id)}
                    placeholder="Or write your own..."
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                  {showEnhancements && section.aiEnhanced && section.aiEnhanced !== section.userInput && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-2 right-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Enhanced
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setCurrentStep('preview')}
              disabled={!isComplete}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Preview Your Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'preview') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <h3 className="text-lg font-semibold">Your Email (AI-Enhanced)</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <span className="font-semibold">To:</span> Sarah Chen
            </div>
            <div>
              <span className="font-semibold">Subject:</span> Re: Urgent - Program Changes?
            </div>
            <div className="border-t pt-4 space-y-3 whitespace-pre-wrap">
              {getFinalEmail()}
              
              <p className="mt-4">Warmly,<br />Maya</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setCurrentStep('compose')}
              variant="outline"
              className="flex-1"
            >
              ✏️ Edit More
            </Button>
            <Button
              onClick={() => {
                setCurrentStep('success');
                if (onComplete) onComplete();
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              ✨ Send with Confidence
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Time Victory */}
        {successStep >= 1 && (
          <Card className="animate-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Email sent!</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-bold text-green-600">{formatTime(elapsedTime)}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-xl text-gray-400 line-through">32:00</span>
                  </div>
                  <p className="text-lg text-green-600 font-medium">You saved 27 minutes! 🎉</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Sarah's Reply */}
        {successStep >= 2 && (
          <Card className="animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">New message from Sarah Chen!</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm">
                <p>Maya,</p>
                <p>I can't tell you how relieved I am! When I sent that email this morning, I was in such a panic. Your response made me feel heard and gave me real options.</p>
                <p>The extended care program sounds perfect - I had no idea it was so affordable. And I love the idea of connecting with other downtown parents for backup coverage.</p>
                <p>Thank you for caring about Emma and our family. This is why we love Hope Gardens so much.</p>
                <p>Can we talk tomorrow afternoon?</p>
                <p>Gratefully,<br />Sarah</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Lyra's Coaching */}
        {successStep >= 3 && (
          <Card className="animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Lyra's Insights</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium text-purple-900">
                Wow, Maya! That was masterful communication! 🌟
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">🎯</span>
                  <p className="text-sm">Validated feelings BEFORE explaining = instant trust</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">🎯</span>
                  <p className="text-sm">Used "solution sandwich" = acknowledge→explain→solve</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">🎯</span>
                  <p className="text-sm">Offered 3 options = transformed anxiety into agency</p>
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <p className="text-sm font-medium text-purple-900">
                  💡 Pro tip: Save this as a template! The pattern works for any difficult news.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Personal Application */}
        {successStep >= 4 && (
          <Card className="animate-in slide-in-from-bottom-4 duration-500 border-2 border-purple-200">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Make It Yours
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Think about YOUR inbox. Is there an email you've been avoiding? Try Maya's approach:</p>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-purple-600">1.</span>
                  <span>Start with understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-purple-600">2.</span>
                  <span>Explain with transparency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-purple-600">3.</span>
                  <span>Offer concrete options</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-purple-600">4.</span>
                  <span>End with partnership</span>
                </li>
              </ol>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                🎯 Try It Now with Your Email
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
};