import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TouchTarget, MobileResponsiveWrapper } from '@/components/ui/mobile-responsive-wrapper';
import { 
  MessageCircle,
  CheckCircle2,
  Edit3,
  Sparkles,
  Send,
  Heart,
  ChevronRight,
  Lightbulb,
  Wand2,
  Zap,
  Trophy
} from 'lucide-react';
import '@/styles/glassmorphism.css';
import { toast } from 'sonner';

interface EmailPracticeProps {
  onComplete: () => void;
}

export const MayaInteractiveEmailPractice: React.FC<EmailPracticeProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'tips' | 'demo' | 'practice' | 'sandwich' | 'generate' | 'success'>('intro');
  const [emailDraft, setEmailDraft] = useState('');
  const [showMayaHelp, setShowMayaHelp] = useState(false);
  const [mayaSuggestion, setMayaSuggestion] = useState('');
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [aiGeneratedEmail, setAIGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  
  // Individual tip inputs
  const [tipInputs, setTipInputs] = useState({
    purpose: '',
    audience: '',
    details: '',
    tone: ''
  });
  const [combinedPrompt, setCombinedPrompt] = useState('');
  const [userGeneratedEmail, setUserGeneratedEmail] = useState('');
  
  const emailContext = {
    recipient: 'Sarah Johnson (parent)',
    purpose: 'Update about child\'s progress in after-school program',
    tone: 'Warm and professional',
    keyPoints: [
      'Jayden has been participating actively',
      'Made new friends in the robotics club',
      'Upcoming showcase next Friday at 3pm'
    ]
  };
  
  const mayaMagicTips = [
    {
      id: 1,
      title: 'Start with the Recipe',
      description: 'Tell AI your Purpose + Audience + Tone',
      example: '"Write an email to update a parent about their child\'s progress with a warm, professional tone"',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Add Specific Details',
      description: 'Include names, dates, and key information',
      example: '"Child\'s name is Jayden, showcase is Friday at 3pm"',
      icon: '📝'
    },
    {
      id: 3,
      title: 'Ask for Structure',
      description: 'Request greeting, body paragraphs, and closing',
      example: '"Include a friendly greeting, 2-3 paragraphs, and invitation to the showcase"',
      icon: '🏗️'
    },
    {
      id: 4,
      title: 'Refine the Tone',
      description: 'Guide AI to match your voice',
      example: '"Make it sound caring but professional, like a teacher who really knows the child"',
      icon: '💝'
    }
  ];
  
  const handleGetHelp = () => {
    setShowMayaHelp(true);
    setMayaSuggestion(`Try starting with: "Hi Sarah, I hope this email finds you well. I wanted to share some wonderful news about Jayden's progress..."`);
  };
  
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setShowAIGeneration(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const generatedEmail = `Subject: Jayden's Wonderful Progress in Robotics Club

Hi Sarah,

I hope this email finds you well! I wanted to take a moment to share some exciting news about Jayden's progress in our after-school program.

Over the past few weeks, Jayden has been actively participating in our robotics club and it's been wonderful to watch him grow. Not only has he shown great enthusiasm for learning new programming concepts, but he's also made several new friends who share his interests. His confidence has really blossomed!

I'm thrilled to invite you to our upcoming robotics showcase next Friday at 3pm in the community center. The students will be demonstrating their robot creations, and Jayden is particularly excited to show you what he's built. Light refreshments will be provided.

Please let me know if you'll be able to attend. Jayden speaks of you often and I know it would mean the world to him to have you there.

Warm regards,
Maya Rodriguez
Program Director, Hope Gardens Community Center`;
    
    setAIGeneratedEmail(generatedEmail);
    setIsGenerating(false);
  };
  
  const handleSendEmail = () => {
    setCurrentStep('success');
    setTimeout(onComplete, 2000);
  };
  
  const getPromptFromTips = () => {
    return `Write an email to update a parent (Sarah Johnson) about their child's (Jayden) progress in our after-school robotics program. Use a warm, professional tone. Include that Jayden has been participating actively, made new friends, and there's a showcase next Friday at 3pm. Make it sound caring but professional, like a teacher who really knows the child.`;
  };
  
  const renderStep = () => {
    switch(currentStep) {
      case 'intro':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Maya's AI Email Magic</h3>
              <p className="text-sm text-gray-600">
                Learn how to use AI to write perfect emails in 5 minutes!
              </p>
            </div>
            
            <div className="glass-purple rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-900 font-medium">
                      "I used to spend 32 minutes on each email. Now with AI and my 4 magic tips, it takes just 5 minutes. Let me show you how!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('tips')}
            >
              Learn Maya's 4 Magic Tips
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'tips':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Maya's 4 Magic Tips for AI</h3>
              <p className="text-sm text-gray-600">Click each tip to see how it works!</p>
            </div>
            
            <div className="space-y-3">
              {mayaMagicTips.map((tip, index) => (
                <TouchTarget
                  key={tip.id}
                  onClick={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
                  className="w-full"
                >
                  <div className={`glass-card rounded-xl transition-all transform hover:scale-[1.02] ${
                    selectedTip === tip.id ? 'glass-purple shadow-lg' : ''
                  }`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{tip.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">Tip {tip.id}: {tip.title}</h4>
                          <p className="text-xs text-gray-600">{tip.description}</p>
                          
                          {selectedTip === tip.id && (
                            <div className="mt-3 glass rounded-lg p-3 animate-fade-in">
                              <p className="text-xs text-purple-800 font-medium">Example:</p>
                              <p className="text-xs text-purple-700 mt-1 italic">"{tip.example}"</p>
                            </div>
                          )}
                        </div>
                        <CheckCircle2 className={`w-5 h-5 transition-opacity ${
                          selectedTip === tip.id ? 'text-purple-600 opacity-100' : 'opacity-0'
                        }`} />
                      </div>
                    </div>
                  </div>
                </TouchTarget>
              ))}
            </div>
            
            <div className="glass-green rounded-xl shadow-sm">
              <div className="p-4">
                <p className="text-sm text-green-900 font-medium flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Pro tip: The more specific you are, the better AI performs!
                </p>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('demo')}
            >
              See AI in Action
              <Wand2 className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'demo':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Wand2 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Watch AI Work Its Magic!</h3>
              <p className="text-sm text-gray-600">Maya's real email challenge</p>
            </div>
            
            <div className="glass-blue rounded-xl shadow-sm">
              <div className="p-4">
                <h4 className="text-base font-semibold mb-3">The Challenge</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">To:</Badge>
                    <span>{emailContext.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Purpose:</Badge>
                    <span>{emailContext.purpose}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Tone:</Badge>
                    <span>{emailContext.tone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-purple rounded-xl shadow-sm">
              <div className="p-4">
                <h4 className="text-base font-semibold mb-2">Maya's AI Prompt:</h4>
                <p className="text-sm text-purple-800 italic">
                  "{getPromptFromTips()}"
                </p>
              </div>
            </div>
            
            {!showAIGeneration ? (
              <TouchTarget onClick={handleAIGenerate} className="w-full">
                <div className="glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
                    <div className="relative flex items-center justify-center gap-3">
                      <Wand2 className="w-8 h-8 text-purple-600 animate-pulse" />
                      <span className="text-lg font-bold text-purple-900">Click to Generate with AI</span>
                      <Sparkles className="w-6 h-6 text-pink-600 animate-bounce" />
                    </div>
                  </div>
                </div>
              </TouchTarget>
            ) : (
              <div className="space-y-4">
                {isGenerating ? (
                  <div className="glass rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full border-3 border-purple-600 border-t-transparent animate-spin mx-auto mb-3" />
                    <p className="text-purple-900 font-semibold">AI is crafting your perfect email...</p>
                    <p className="text-sm text-purple-700 mt-2">This takes about 5 seconds</p>
                  </div>
                ) : (
                  <div className="glass-green rounded-xl shadow-lg animate-scale-in">
                    <div className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <h4 className="font-semibold text-green-900">AI Generated in 5 seconds!</h4>
                      </div>
                      <div className="glass rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {aiGeneratedEmail}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                        <Zap className="w-4 h-4" />
                        <span>Maya saved 27 minutes with this one email!</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {aiGeneratedEmail && !isGenerating && (
              <button 
                className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => setCurrentStep('practice')}
              >
                Your Turn to Try!
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        );
        
      case 'practice':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Edit3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Your Turn to Build an AI Prompt!</h3>
              <p className="text-sm text-gray-600">Fill in each magic ingredient separately</p>
            </div>
            
            {/* Individual Tip Inputs */}
            <div className="space-y-3">
              {/* Purpose */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-purple-900">1. Purpose</label>
                    <p className="text-xs text-purple-700">What do you need? (inform, request, thank, invite)</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Update parent about child's progress"
                  value={tipInputs.purpose}
                  onChange={(e) => setTipInputs({...tipInputs, purpose: e.target.value})}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
              
              {/* Audience */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">📝</span>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-purple-900">2. Audience</label>
                    <p className="text-xs text-purple-700">Who will read this?</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Sarah (Jayden's mom)"
                  value={tipInputs.audience}
                  onChange={(e) => setTipInputs({...tipInputs, audience: e.target.value})}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
              
              {/* Specific Details */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">🏗️</span>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-purple-900">3. Specific Details</label>
                    <p className="text-xs text-purple-700">Names, dates, key information</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Robotics showcase Friday 3pm, Jayden made friends"
                  value={tipInputs.details}
                  onChange={(e) => setTipInputs({...tipInputs, details: e.target.value})}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
              
              {/* Tone */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">💝</span>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-purple-900">4. Tone</label>
                    <p className="text-xs text-purple-700">How should it feel?</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Warm, encouraging, professional"
                  value={tipInputs.tone}
                  onChange={(e) => setTipInputs({...tipInputs, tone: e.target.value})}
                  className="w-full glass-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
            </div>
            
            <button 
              className={`w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 transition-all ${
                Object.values(tipInputs).every(v => v.length > 3) ? 'transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => {
                if (Object.values(tipInputs).every(v => v.length > 3)) {
                  // Combine inputs into a prompt
                  const prompt = `Write an email to ${tipInputs.audience} to ${tipInputs.purpose}. Include these details: ${tipInputs.details}. Use a ${tipInputs.tone} tone. Include a proper greeting, body paragraphs, and closing.`;
                  setCombinedPrompt(prompt);
                  setCurrentStep('sandwich');
                }
              }}
              disabled={!Object.values(tipInputs).every(v => v.length > 3)}
            >
              Make My AI Prompt Sandwich 🥪
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'sandwich':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">🥪</span>
              <h3 className="text-lg font-semibold">Your AI Prompt Sandwich!</h3>
              <p className="text-sm text-gray-600">Here's your complete prompt - edit if needed</p>
            </div>
            
            <div className="glass-purple rounded-xl p-4">
              <label className="text-sm font-semibold text-purple-900 mb-2 block">Your Combined AI Prompt:</label>
              <textarea
                value={combinedPrompt}
                onChange={(e) => setCombinedPrompt(e.target.value)}
                className="w-full min-h-[120px] resize-none glass-input rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
            </div>
            
            <div className="glass-green rounded-lg p-3">
              <p className="text-xs text-green-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Perfect! You've combined all 4 magic tips into one powerful prompt!</span>
              </p>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('generate')}
            >
              Generate My Email with AI
              <Wand2 className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'generate':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Wand2 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Let's Generate Your Email!</h3>
              <p className="text-sm text-gray-600">Click the magic button to see AI in action</p>
            </div>
            
            <div className="glass-purple rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Your AI Prompt:</h4>
              <p className="text-sm text-purple-800 italic">"{combinedPrompt}"</p>
            </div>
            
            {!userGeneratedEmail ? (
              <TouchTarget onClick={async () => {
                setIsGenerating(true);
                
                try {
                  // Use the actual AI service with the user's combined prompt
                  const response = await enhancedAIService.generateEmail({
                    purpose: tipInputs.purpose,
                    audience: tipInputs.audience,
                    tone: tipInputs.tone,
                    includeSubject: true
                  });
                  
                  // Add a visual delay for effect
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  
                  setUserGeneratedEmail(response);
                  toast.success('AI generated your custom email in 5 seconds! 🎉');
                } catch (error) {
                  // Fallback if AI service fails
                  const generatedEmail = `Subject: Jayden's Wonderful Progress Update

Dear ${tipInputs.audience},

I hope this message finds you well. I wanted to take a moment to share some exciting updates about Jayden's progress in our after-school program.

${tipInputs.details.includes('robotics') ? 'Jayden has been actively participating in our robotics club and has shown remarkable growth. Not only has he mastered new programming concepts, but he\'s also developed strong friendships with his peers who share similar interests.' : 'Jayden has been making wonderful progress in our program.'}

${tipInputs.details.includes('showcase') || tipInputs.details.includes('Friday') ? 'I\'m delighted to invite you to our upcoming showcase this Friday at 3pm. The students will be presenting their projects, and Jayden is particularly excited to show you what he\'s been working on. Your presence would mean so much to him.' : 'We have some upcoming events where Jayden will be showcasing his work.'}

It\'s been a joy watching Jayden grow in confidence and skill. His enthusiasm is contagious, and he\'s become a positive influence on his classmates.

Please let me know if you have any questions or if you\'d like to discuss Jayden\'s progress further. Thank you for your continued support.

Warm regards,
Maya Rodriguez
Program Director`;
                  
                  setUserGeneratedEmail(generatedEmail);
                  toast.success('Email generated successfully! 🎉');
                }
                
                setIsGenerating(false);
              }} className="w-full">
                <div className="glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
                    <div className="relative flex items-center justify-center gap-3">
                      {isGenerating ? (
                        <>
                          <div className="w-6 h-6 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                          <span className="text-lg font-bold text-purple-900">AI is writing your email...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-8 h-8 text-purple-600 animate-pulse" />
                          <span className="text-lg font-bold text-purple-900">Generate My Email Now!</span>
                          <Sparkles className="w-6 h-6 text-pink-600 animate-bounce" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TouchTarget>
            ) : (
              <div className="space-y-4">
                <div className="glass-green rounded-xl shadow-lg animate-scale-in">
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <h4 className="font-semibold text-green-900">Your AI-Generated Email!</h4>
                    </div>
                    <div className="glass rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                      {userGeneratedEmail}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                      <Zap className="w-4 h-4" />
                      <span>Generated in 5 seconds using your custom prompt!</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="glass-red rounded-xl p-4">
                    <p className="text-3xl font-bold text-red-700">32 min</p>
                    <p className="text-xs text-red-600">Without AI</p>
                  </div>
                  <div className="glass-green rounded-xl p-4">
                    <p className="text-3xl font-bold text-green-700">5 sec</p>
                    <p className="text-xs text-green-600">With AI + Your Recipe</p>
                  </div>
                </div>
                
                <button 
                  className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  onClick={handleSendEmail}
                >
                  Complete Lesson - I'm an AI Email Master!
                  <Trophy className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        );
        
      case 'compare':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Fantastic Job!</h3>
              <p className="text-sm text-gray-600">You've mastered Maya's AI email method!</p>
            </div>
            
            <div className="glass rounded-xl">
              <div className="p-4">
                <h4 className="text-base font-semibold mb-3">Your AI Prompt:</h4>
                <p className="text-sm text-gray-700 italic">{emailDraft}</p>
              </div>
            </div>
            
            <div className="glass-green rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-900 font-medium mb-1">Maya says:</p>
                    <p className="text-sm text-green-800">
                      "Perfect! You used all 4 magic tips. With practice, you'll write emails in 5 minutes too!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="glass-red rounded-xl p-4">
                <p className="text-3xl font-bold text-red-700">32 min</p>
                <p className="text-xs text-red-600">Without AI</p>
              </div>
              <div className="glass-green rounded-xl p-4">
                <p className="text-3xl font-bold text-green-700">5 min</p>
                <p className="text-xs text-green-600">With AI</p>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={handleSendEmail}
            >
              Complete Lesson
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'context':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Your Email Challenge</h3>
            </div>
            
            <div className="glass-blue rounded-xl shadow-sm">
              <div className="p-4">
                <h4 className="text-base font-semibold mb-3">Email Recipe</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">To:</Badge>
                    <span className="text-sm">{emailContext.recipient}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Purpose:</Badge>
                    <span className="text-sm">{emailContext.purpose}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Tone:</Badge>
                    <span className="text-sm">{emailContext.tone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl">
              <div className="p-4">
                <h4 className="text-base font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Key Points to Include
                </h4>
                <div>
                  <ul className="space-y-2">
                    {emailContext.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={() => setCurrentStep('writing')}
            >
              Start Writing
              <Edit3 className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'writing':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Write Your Email</h3>
              <Badge variant="outline">
                <MessageCircle className="w-3 h-3 mr-1" />
                5 min goal
              </Badge>
            </div>
            
            <div className="glass-card rounded-xl">
              <div className="p-4">
                <textarea
                  placeholder="Start typing your email here..."
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full min-h-[200px] resize-none glass-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
              </div>
            </div>
            
            {!showMayaHelp && (
              <TouchTarget onClick={handleGetHelp} className="w-full">
                <div className="glass-purple rounded-xl hover:shadow-md transition-all cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-purple-900 font-medium">Need help? Click for Maya's suggestion</span>
                    </div>
                  </div>
                </div>
              </TouchTarget>
            )}
            
            {showMayaHelp && (
              <div className="glass-green rounded-xl shadow-sm animate-fade-in">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-900 font-medium">{mayaSuggestion}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                className="flex-1 glass-button rounded-xl py-3 px-4 font-medium"
                onClick={() => setCurrentStep('context')}
              >
                Review Recipe
              </button>
              <button 
                className={`flex-1 glass-button rounded-xl py-3 px-4 font-medium bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 transition-all ${
                  emailDraft.length < 50 ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
                onClick={() => emailDraft.length > 50 ? setCurrentStep('review') : null}
                disabled={emailDraft.length < 50}
              >
                Review Email
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        );
        
      case 'review':
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Great Job!</h3>
              <p className="text-sm text-gray-600">Your email is ready to send</p>
            </div>
            
            <div className="glass rounded-xl">
              <div className="p-4">
                <h4 className="text-base font-semibold mb-3">Your Email</h4>
                <p className="text-sm whitespace-pre-wrap text-gray-700">{emailDraft}</p>
              </div>
            </div>
            
            <div className="glass-green rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-900 font-medium mb-1">Maya says:</p>
                    <p className="text-sm text-green-800">
                      "You did it! That took less than 5 minutes. See how the recipe method makes it so much easier?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={handleSendEmail}
            >
              Send Email
              <Send className="w-5 h-5 ml-2" />
            </button>
          </div>
        );
        
      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in shadow-lg">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Email Sent!</h3>
            <p className="text-sm text-gray-600">
              You've just saved 27 minutes!
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-medium">+50 Confidence Points</span>
            </div>
          </div>
        );
    }
  };
  
  return (
    <MobileResponsiveWrapper maxWidth="sm" padding="none">
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-full max-w-md">
          {renderStep()}
        </div>
      </div>
    </MobileResponsiveWrapper>
  );
};

export default MayaInteractiveEmailPractice;