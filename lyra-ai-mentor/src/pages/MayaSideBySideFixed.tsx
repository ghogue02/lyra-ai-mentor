import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, Check, Sparkles, Mail, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '@/styles/minimal-ui.css';

// Types for chat messages
interface ChatMessage {
  id: string;
  content: string;
  type: 'maya' | 'system' | 'hint';
  trigger?: string;
  delay?: number;
}

// Types for interactive stages
interface InteractiveStage {
  id: string;
  title: string;
  component: React.ReactNode;
  chatMessages: ChatMessage[];
}

const MayaSideBySideFixed: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [typedContent, setTypedContent] = useState<{[key: string]: string}>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [emailDraft, setEmailDraft] = useState({
    purpose: '',
    audience: '',
    tone: '',
    generated: ''
  });
  
  const chatRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Interactive stages with corresponding chat guidance
  const stages: InteractiveStage[] = [
    {
      id: 'intro',
      title: 'Welcome',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 animate-pulse">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Ready to Transform Your Email Writing?</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            I'll guide you through the Email Recipe Method step by step. 
            Watch the chat on the left as you practice on the right.
          </p>
          <Button 
            onClick={() => setCurrentStageIndex(1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Let's Begin <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ),
      chatMessages: [
        {
          id: 'intro-1',
          content: "Hi! I'm Maya Rodriguez from Hope Gardens Community Center.\n\nI'm so excited to share my Email Recipe Method with you today.",
          type: 'maya',
          delay: 500
        },
        {
          id: 'intro-2',
          content: "Just 6 months ago, I was spending 32 minutes on every email...\n\nNow? Under 5 minutes!\n\nLet me show you how.",
          type: 'maya',
          delay: 8000 // Wait for first message to complete
        }
      ]
    },
    {
      id: 'purpose',
      title: 'Define Your Purpose',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Step 1: What's Your Purpose?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Every great email starts with a clear purpose. What do you need to accomplish?
            </p>
          </div>
          
          <div className="space-y-3">
            {['Inform about an update', 'Request something', 'Thank someone', 'Invite to an event'].map((purpose) => (
              <button
                key={purpose}
                onClick={() => {
                  setEmailDraft(prev => ({ ...prev, purpose }));
                  setTimeout(() => setCurrentStageIndex(2), 1000);
                }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-purple-400 hover:bg-purple-50 ${
                  emailDraft.purpose === purpose ? 'border-purple-600 bg-purple-100' : 'border-gray-200'
                }`}
              >
                {purpose}
              </button>
            ))}
          </div>
          
          {emailDraft.purpose && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                Great choice! "{emailDraft.purpose}" is a clear purpose.
              </p>
            </div>
          )}
        </div>
      ),
      chatMessages: [
        {
          id: 'purpose-1',
          content: "Perfect! Now let's build your Email Recipe.\n\nFirst ingredient: PURPOSE\n\nThink of this as the 'why' behind your email.",
          type: 'maya',
          delay: 500
        },
        {
          id: 'purpose-2',
          content: "I always ask myself:\n• What do I need?\n• What action do I want?\n• What's the one key message?",
          type: 'maya',
          delay: 7000
        },
        {
          id: 'purpose-hint',
          content: "💡 Pro tip: If you can't state your purpose in one sentence, your email might be trying to do too much!",
          type: 'hint',
          delay: 11000
        }
      ]
    },
    {
      id: 'audience',
      title: 'Know Your Audience',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Step 2: Who's Your Audience?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Understanding your reader shapes everything - from word choice to level of detail.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who will read this email?
            </label>
            <input
              type="text"
              value={emailDraft.audience}
              onChange={(e) => setEmailDraft(prev => ({ ...prev, audience: e.target.value }))}
              placeholder="e.g., Parent, Board member, Volunteer, Donor"
              className="w-full p-3 border rounded-lg focus:border-purple-400 focus:outline-none"
            />
          </div>
          
          {emailDraft.audience && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Consider their:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Knowledge level',
                  'Time constraints',
                  'Relationship to you',
                  'Communication style'
                ].map((consideration) => (
                  <div key={consideration} className="p-3 bg-purple-50 rounded-lg text-sm">
                    {consideration}
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => setCurrentStageIndex(3)}
                className="w-full mt-6"
              >
                Continue to Tone <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      ),
      chatMessages: [
        {
          id: 'audience-1',
          content: `Excellent! You chose to: ${emailDraft.purpose || 'communicate clearly'}\n\nNow for ingredient #2: AUDIENCE\n\nThis changes everything about how we write.`,
          type: 'maya',
          delay: 500
        },
        {
          id: 'audience-2',
          content: "I learned this the hard way...\n\nI once sent a detailed technical email to busy parents. They never read past the first paragraph!\n\nNow I always picture my reader first.",
          type: 'maya',
          delay: 7000
        }
      ]
    },
    {
      id: 'tone',
      title: 'Set the Tone',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Step 3: Choose Your Tone</h3>
            </div>
            <p className="text-gray-600 mb-6">
              The right tone builds connection. How do you want your email to feel?
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { tone: 'Warm & Friendly', icon: '😊' },
              { tone: 'Professional', icon: '💼' },
              { tone: 'Grateful', icon: '🙏' },
              { tone: 'Encouraging', icon: '💪' },
              { tone: 'Urgent', icon: '⚡' },
              { tone: 'Celebratory', icon: '🎉' }
            ].map(({ tone, icon }) => (
              <button
                key={tone}
                onClick={() => setEmailDraft(prev => ({ ...prev, tone }))}
                className={`p-4 rounded-lg border-2 transition-all hover:border-purple-400 ${
                  emailDraft.tone === tone ? 'border-purple-600 bg-purple-100' : 'border-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-medium">{tone}</div>
              </button>
            ))}
          </div>
          
          {emailDraft.tone && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h4 className="font-semibold mb-2">Your Email Recipe:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Purpose: {emailDraft.purpose}</li>
                <li>• Audience: {emailDraft.audience}</li>
                <li>• Tone: {emailDraft.tone}</li>
              </ul>
              
              <Button 
                onClick={() => setCurrentStageIndex(4)}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Generate My Email <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      ),
      chatMessages: [
        {
          id: 'tone-1',
          content: `Perfect! ${emailDraft.audience || 'Your reader'} will appreciate that.\n\nFinal ingredient: TONE\n\nThis is where the magic happens. The same message can feel completely different based on tone.`,
          type: 'maya',
          delay: 500
        },
        {
          id: 'tone-2',
          content: "Think about it:\n\n'We need to discuss Jayden's behavior'\nvs\n'I'd love to share some wonderful progress Jayden made today!'\n\nSame topic, totally different feeling!",
          type: 'maya',
          delay: 8000
        }
      ]
    },
    {
      id: 'result',
      title: 'Your Email',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Your AI-Generated Email</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">
                {emailDraft.generated || generateEmail(emailDraft)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => {
              setEmailDraft({ purpose: '', audience: '', tone: '', generated: '' });
              setCurrentStageIndex(1);
            }}>
              Try Another
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Copy Email
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <Lightbulb className="w-4 h-4 inline mr-2" />
              Time saved: ~27 minutes! With practice, this becomes second nature.
            </p>
          </div>
        </div>
      ),
      chatMessages: [
        {
          id: 'result-1',
          content: "Amazing! Look at that beautiful email!\n\nFrom 32 minutes to under 5. That's the power of the Email Recipe Method.",
          type: 'maya',
          delay: 500
        },
        {
          id: 'result-2',
          content: "Remember:\n• Purpose gives clarity\n• Audience shapes the message\n• Tone creates connection\n\nYou've just reclaimed hours of your week!",
          type: 'maya',
          delay: 7000
        },
        {
          id: 'result-3',
          content: "🎉 You did it! Welcome to the Email Recipe family!",
          type: 'system',
          delay: 13000
        }
      ]
    }
  ];

  const currentStage = stages[currentStageIndex];

  // Single typewriter function with completion callback
  const typeMessage = (message: ChatMessage, onComplete?: () => void) => {
    if (!message) return;
    
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    setIsTyping(message.id);
    let charIndex = 0;
    const content = message.content;
    setTypedContent(prev => ({ ...prev, [message.id]: '' }));

    const typeChar = () => {
      if (charIndex < content.length) {
        const char = content[charIndex];
        setTypedContent(prev => ({ 
          ...prev, 
          [message.id]: content.slice(0, charIndex + 1) 
        }));
        charIndex++;

        // Natural storytelling rhythm
        let delay = 45 + Math.random() * 25;
        if (['.', '!', '?'].includes(char)) delay += 350;
        else if ([',', ';', ':'].includes(char)) delay += 180;
        else if (char === '\n') delay += 250;
        else if (char === '•') delay += 100;

        typewriterTimeoutRef.current = setTimeout(typeChar, delay);
      } else {
        setIsTyping(null);
        if (onComplete) {
          setTimeout(onComplete, 500); // Small pause after message completes
        }
      }
    };

    typewriterTimeoutRef.current = setTimeout(typeChar, 100);
  };

  // Process messages sequentially
  const processMessages = (messages: ChatMessage[], index: number = 0) => {
    if (index >= messages.length) return;

    const message = messages[index];
    const delay = index === 0 ? (message.delay || 500) : 0; // Only use delay for first message

    const timeoutId = setTimeout(() => {
      setVisibleMessages(prev => [...prev, message]);
      
      typeMessage(message, () => {
        // After this message is done typing, process the next one
        processMessages(messages, index + 1);
      });
    }, delay);

    messageTimeoutsRef.current.push(timeoutId);
  };

  // Load messages for current stage
  useEffect(() => {
    // Clear everything when stage changes
    setVisibleMessages([]);
    setTypedContent({});
    setIsTyping(null);
    
    // Clear all timeouts
    messageTimeoutsRef.current.forEach(clearTimeout);
    messageTimeoutsRef.current = [];
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    // Start processing messages for this stage
    processMessages(currentStage.chatMessages);

    return () => {
      // Cleanup on unmount
      messageTimeoutsRef.current.forEach(clearTimeout);
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [currentStageIndex]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, typedContent]);

  // Generate email based on recipe
  function generateEmail(draft: typeof emailDraft): string {
    const { purpose, audience, tone } = draft;
    
    // Simulate AI generation based on recipe
    const templates = {
      'Inform about an update': `Subject: Exciting Update from Hope Gardens\n\nDear ${audience || 'Friend'},\n\nI hope this message finds you well! I wanted to share some wonderful news about our programs at Hope Gardens Community Center.\n\n[Your update here]\n\nThis progress wouldn't be possible without supporters like you. Thank you for being part of our community!\n\nWarm regards,\nMaya Rodriguez\nProgram Director`,
      'Request something': `Subject: Quick Request - Your Input Needed\n\nHi ${audience || 'there'},\n\nI hope you're having a great day! I'm reaching out because we value your perspective.\n\n[Your request here]\n\nI know your time is valuable, so I've kept this brief. Would you be able to help us with this by [date]?\n\nThank you so much for considering this request.\n\nBest,\nMaya`,
      'Thank someone': `Subject: Thank You! 💜\n\nDear ${audience || 'Friend'},\n\nI had to take a moment to express my heartfelt gratitude.\n\n[Your thanks here]\n\nYour [contribution/support/presence] makes such a difference in our community. We're truly grateful to have you as part of the Hope Gardens family.\n\nWith appreciation,\nMaya Rodriguez`,
      'Invite to an event': `Subject: You're Invited! Special Event at Hope Gardens\n\nHi ${audience || 'Friend'}!\n\nI'm excited to personally invite you to [event name]!\n\nWhen: [Date and time]\nWhere: Hope Gardens Community Center\nWhat: [Brief description]\n\nThis event means so much to our community, and having you there would make it even more special.\n\nPlease RSVP by [date] so we can save your spot!\n\nLooking forward to seeing you,\nMaya`
    };

    let email = templates[purpose as keyof typeof templates] || templates['Inform about an update'];
    
    // Adjust tone
    if (tone === 'Urgent') {
      email = email.replace('I hope', 'I urgently need to');
      email = email.replace('Would you be able to', 'Could you please');
    } else if (tone === 'Celebratory') {
      email = email.replace('wonderful', 'absolutely amazing');
      email = email.replace('!', '! 🎉');
    }

    setEmailDraft(prev => ({ ...prev, generated: email }));
    return email;
  }

  return (
    <div className="minimal-ui min-h-screen bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">Email Recipe Method</h1>
              <p className="text-sm text-gray-600">Interactive Learning with Maya</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStageIndex + 1} of {stages.length}
          </div>
        </div>

        {/* Main Content - Side by Side */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel (Left) */}
          <div className="w-1/2 border-r flex flex-col bg-white">
            <div className="p-4 border-b bg-purple-50">
              <h2 className="font-medium text-purple-900">Maya's Guidance</h2>
            </div>
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {visibleMessages.map((message) => (
                <div key={message.id} className={`${message.type === 'system' ? 'text-center' : ''}`}>
                  {message.type === 'maya' && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                          <div className="storytelling-text whitespace-pre-wrap">
                            {typedContent[message.id] || ''}
                            {isTyping === message.id && (
                              <span className="inline-block w-0.5 h-5 bg-purple-500 ml-1 animate-pulse" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.type === 'hint' && (
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400 ml-13">
                      <div className="text-sm text-blue-800">
                        {typedContent[message.id] || ''}
                        {isTyping === message.id && (
                          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse" />
                        )}
                      </div>
                    </div>
                  )}
                  {message.type === 'system' && (
                    <div className="bg-green-50 rounded-lg p-3 inline-block">
                      <div className="text-sm font-medium text-green-800">
                        {typedContent[message.id] || ''}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Panel (Right) */}
          <div className="w-1/2 flex flex-col bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <div className="p-4 border-b bg-white">
              <h2 className="font-medium">{currentStage.title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {currentStage.component}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MayaSideBySideFixed;