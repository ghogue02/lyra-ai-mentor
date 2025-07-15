import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, Check, Sparkles, Mic, Volume2, Target, Lightbulb, Eye, Loader2, Zap, FastForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import '@/styles/minimal-ui.css';

// Types for chat messages with Lyra's unified narrative structure
interface LyraNarrativeMessage {
  id: string;
  content: string;
  type: 'lyra-unified'; // Consolidated to single Lyra voice
  emotion?: 'warm' | 'encouraging' | 'excited' | 'proud' | 'thoughtful';
  trigger?: string;
  delay?: number;
  // Multi-layered content for different user levels
  layers?: {
    beginner: string;
    intermediate?: string;
    advanced?: string;
  };
  // Context flags for styling variety while maintaining unified voice
  context?: 'story' | 'guidance' | 'celebration' | 'reflection';
}

// Types for interactive stages with blur states
interface InteractiveStage {
  id: string;
  title: string;
  component: React.ReactNode;
  narrativeMessages: LyraNarrativeMessage[];
  panelBlurState?: 'full' | 'partial' | 'clear';
}

// Sofia's Voice Framework Data
interface VoiceProfile {
  id: string;
  label: string;
  description: string;
  example: string;
  voiceWords: string[];
}

interface StoryElement {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

const SofiaVoiceDiscoveryLesson: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<LyraNarrativeMessage[]>([]);
  const [typedContent, setTypedContent] = useState<{[key: string]: string}>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('full');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  
  const [voiceJourney, setVoiceJourney] = useState({
    values: '',
    origin: '',
    impact: '',
    craft: '',
    expression: '',
    selectedVoice: '',
    storyDraft: '',
    finalStory: '',
    voiceRecording: null as Blob | null,
    authenticity: 0
  });
  
  const [showComparison, setShowComparison] = useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = useState(true);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isInitializedRef = useRef(false);

  // Sofia's Voice Profiles based on storytelling styles
  const voiceProfiles: VoiceProfile[] = [
    {
      id: 'compassionate-connector',
      label: 'Compassionate Connector',
      description: 'Leads with empathy, builds bridges through shared humanity',
      voiceWords: ['heartfelt', 'understanding', 'genuine', 'connecting'],
      example: "When I see families struggling, I don't see statistics—I see my own childhood, when my mother worked three jobs just to keep our lights on. Every story I share connects us to something larger than ourselves."
    },
    {
      id: 'vulnerable-truth-teller',
      label: 'Vulnerable Truth-Teller',
      description: 'Shares authentic struggle and growth, inspiring through honesty',
      voiceWords: ['honest', 'raw', 'real', 'transformative'],
      example: "I used to hide my accent, my background, thinking I needed to sound 'professional.' The day I stopped pretending and started sharing my real story—that's when everything changed."
    },
    {
      id: 'hopeful-visionary',
      label: 'Hopeful Visionary',
      description: 'Paints pictures of possibility while acknowledging current reality',
      voiceWords: ['inspiring', 'forward-thinking', 'optimistic', 'possibility-focused'],
      example: "Yes, our community faces challenges. But I've seen what happens when we come together—miracles hiding in everyday moments, waiting for someone to believe they're possible."
    },
    {
      id: 'wisdom-weaver',
      label: 'Wisdom Weaver',
      description: 'Finds universal truths in personal experiences, teaches through story',
      voiceWords: ['reflective', 'insightful', 'thoughtful', 'meaningful'],
      example: "The lesson wasn't in the success—it was in the failure that taught me resilience. Sometimes our greatest gifts come wrapped in our deepest struggles."
    }
  ];

  // Memoized stages to prevent recreation
  const stages = React.useMemo<InteractiveStage[]>(() => [
    {
      id: 'intro',
      title: 'Meeting Sofia',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "flex flex-col items-center justify-center h-full text-center p-8 transition-all duration-1000",
          panelBlurLevel === 'full' && "blur-xl",
          panelBlurLevel === 'partial' && "blur-sm"
        )}>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center mb-6 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Volume2 className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4">Sofia's Voice Discovery Journey</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            From silent passion to compelling voice<br/>
            The VOICE Framework
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button 
              onClick={() => setCurrentStageIndex(1)}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-200"
            >
              Begin Sofia's Journey <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'lyra-intro-1',
          content: "Let me tell you about Sofia Martinez, a woman whose heart burns with purpose but whose voice was trapped in silence.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 400,
          layers: {
            beginner: "Let me tell you about Sofia Martinez, a woman whose heart burns with purpose but whose voice was trapped in silence.",
            intermediate: "Sofia Martinez has a story that could change lives—if only she could find the courage to tell it authentically.",
            advanced: "What you're about to witness is the transformation from internal conviction to external expression—Sofia's voice discovery journey."
          }
        },
        {
          id: 'sofia-intro-2',
          content: "Sofia runs a community center in East LA, working with families facing homelessness, unemployment, and immigration challenges. She knows exactly what needs to be said—about resilience, about hope, about the power of community.\n\nBut every time she tries to speak publicly, to write grant proposals, or share her vision, the words get stuck. She knows her mission, but she doesn't know her voice.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 4000
        },
        {
          id: 'sofia-intro-3',
          content: "Can you see that blur covering her workspace? That's exactly how unclear and muffled Sofia's voice felt—like speaking through thick glass, knowing people couldn't hear her true message.\n\nWatch what happens as Sofia discovers her authentic voice through the VOICE Framework.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 9000,
          trigger: 'blur-clear'
        }
      ]
    },
    {
      id: 'values',
      title: 'V - Values Foundation',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold">V - Values Foundation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Step 1: Identify your core beliefs. Sofia learned that authentic voice comes from knowing what you truly stand for.
            </p>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ Sofia's Voice Without Values:</h4>
              <p className="text-sm text-red-700">"We help people. We provide services. We make a difference."</p>
            </div>
            
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Sofia's Values-Driven Voice:</h4>
              <p className="text-sm text-green-700">"Every family deserves dignity, safety, and the chance to thrive. No one should face crisis alone."</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">What values drive your voice?</p>
            {[
              { value: 'Human dignity above all else', description: 'Every person has inherent worth regardless of circumstances' },
              { value: 'Community over individual success', description: 'We rise together or not at all' },
              { value: 'Hope in the face of hardship', description: 'Even in darkness, possibility exists' },
              { value: 'Authentic connection over perfection', description: 'Real stories matter more than polished presentations' }
            ].map(({ value, description }) => (
              <button
                key={value}
                onClick={() => {
                  setVoiceJourney(prev => ({ ...prev, values: value }));
                  setLyraExpression('celebrating');
                  setTimeout(() => {
                    setCurrentStageIndex(2);
                    setLyraExpression('helping');
                  }, 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-orange-400 hover:bg-orange-50",
                  voiceJourney.values === value ? 'border-orange-600 bg-orange-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-1">{value}</div>
                <div className="text-xs text-gray-500">{description}</div>
              </button>
            ))}
          </div>
          
          {voiceJourney.values && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                Perfect! "{voiceJourney.values}" is your voice foundation.
              </p>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'values-story-1',
          content: "Sofia's breakthrough moment came during a board meeting she'll never forget...\n\nThe directors were discussing 'service efficiency metrics' and 'program optimization,' when a mother who'd lost her apartment asked a simple question: 'Will my kids be safe here?'",
          type: 'lyra-unified',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'values-revelation-1',
          content: "In that moment, Sofia realized the disconnect. The board was talking about numbers. The mother was asking about values.\n\nSofia had been trying to speak their language instead of speaking from her heart.",
          type: 'lyra-unified',
          emotion: 'thoughtful',
          delay: 7000
        },
        {
          id: 'values-guidance-2',
          content: "Look—the panel is starting to clear as Sofia's foundation becomes solid.\n\nThis is the 'V' in VOICE: VALUES. Before you find your voice, you must know what it stands for.\n\nWhat core belief drives everything you do?",
          type: 'lyra-unified',
          emotion: 'encouraging',
          delay: 13000,
          trigger: 'blur-clear-values'
        },
        {
          id: 'values-tip',
          content: "I've seen thousands discover their voice, and here's the truth: Your most powerful stories come from your deepest values.\n\nSofia learned to ask: 'What do I believe so strongly that I can't stay silent?'",
          type: 'lyra-unified',
          emotion: 'warm',
          delay: 19000,
          layers: {
            beginner: "Choose the value that makes your heart beat faster when you talk about it.",
            intermediate: "Values create emotional resonance. When you speak from core beliefs, your voice carries authentic power.",
            advanced: "Values-based storytelling activates mirror neurons and creates neurological empathy in listeners."
          }
        }
      ]
    },
    {
      id: 'origin',
      title: 'O - Origin Story',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold">O - Origin Story</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Step 2: Share your foundation story. Sofia discovered that her personal experience gave her voice credibility and connection.
            </p>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ Generic Professional Bio:</h4>
              <p className="text-sm text-red-700">"Sofia has 10 years of nonprofit management experience..."</p>
            </div>
            
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Sofia's Origin Voice:</h4>
              <p className="text-sm text-green-700">"I was eight when my family lost our apartment. The kindness of strangers at a community center saved us."</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">What experience shaped your mission?</p>
            {[
              { origin: 'Childhood challenge that built resilience', description: 'Early hardship that taught you strength and empathy' },
              { origin: 'Moment someone believed in you', description: 'When support changed everything and you want to pay it forward' },
              { origin: 'Witnessing injustice that sparked action', description: 'Seeing something wrong and deciding to make it right' },
              { origin: 'Personal transformation that opened your eyes', description: 'Your own change that helps you guide others' }
            ].map(({ origin, description }) => (
              <button
                key={origin}
                onClick={() => {
                  setVoiceJourney(prev => ({ ...prev, origin }));
                  setLyraExpression('celebrating');
                  setTimeout(() => {
                    setCurrentStageIndex(3);
                    setLyraExpression('helping');
                  }, 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-orange-400 hover:bg-orange-50",
                  voiceJourney.origin === origin ? 'border-orange-600 bg-orange-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-1">{origin}</div>
                <div className="text-xs text-gray-500">{description}</div>
              </button>
            ))}
          </div>
          
          {voiceJourney.origin && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                Beautiful! Your origin story gives your voice authentic power.
              </p>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'origin-story-1',
          content: `Perfect! ${voiceJourney.values || 'Your values'} create the foundation for everything.\n\nNow Sofia discovered something crucial about voice...`,
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'encouraging',
          delay: 500,
          trigger: 'show-summary'
        },
        {
          id: 'origin-mistake',
          content: "Sofia used to introduce herself with credentials: 'I have a Master's in Social Work, ten years of experience, board certifications...'\n\nPeople respected her qualifications but didn't connect with her heart.\n\nShe was listing achievements instead of sharing her story.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 4000
        },
        {
          id: 'origin-learning',
          content: "That's when Sofia learned about the 'O' in VOICE: ORIGIN STORY.\n\nWatch the panel clear as you discover this secret.\n\nYour credentials prove you can do the work. Your origin story proves why you must do the work.\n\nWhich experience made this mission inevitable for you?",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 10000,
          trigger: 'blur-clear-origin'
        },
        {
          id: 'origin-guidance',
          content: "Choose the moment that made your voice necessary.\n\nSofia learned that people don't just want to know what you do—they want to know why you can't NOT do it.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 16000,
          layers: {
            beginner: "Pick the experience that explains why this work chose you.",
            intermediate: "Origin stories create emotional credibility. People trust voices that come from lived experience.",
            advanced: "Neuroscience shows that personal narratives activate the same brain regions as direct experience."
          }
        }
      ]
    },
    {
      id: 'impact',
      title: 'I - Impact Vision',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold">I - Impact Vision</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Step 3: Articulate the transformation you create. Sofia learned to paint pictures of the change her voice makes possible.
            </p>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ Vague Impact:</h4>
              <p className="text-sm text-red-700">"We help people improve their lives and achieve their goals..."</p>
            </div>
            
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Sofia's Clear Impact Vision:</h4>
              <p className="text-sm text-green-700">"I see families who sleep soundly knowing they have a place to call home and a community that has their back."</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">What transformation do you create?</p>
            {[
              { impact: 'From isolation to belonging', description: 'People find their community and feel they matter' },
              { impact: 'From fear to hope', description: 'Anxiety transforms into possibility and confidence' },
              { impact: 'From survival to thriving', description: 'Basic needs met become foundation for growth' },
              { impact: 'From silence to voice', description: 'Others find courage to share their own stories' }
            ].map(({ impact, description }) => (
              <button
                key={impact}
                onClick={() => {
                  setVoiceJourney(prev => ({ ...prev, impact }));
                  setLyraExpression('celebrating');
                  setTimeout(() => {
                    setCurrentStageIndex(4);
                    setLyraExpression('helping');
                  }, 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-orange-400 hover:bg-orange-50",
                  voiceJourney.impact === impact ? 'border-orange-600 bg-orange-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-1">{impact}</div>
                <div className="text-xs text-gray-500">{description}</div>
              </button>
            ))}
          </div>
          
          {voiceJourney.impact && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                Powerful! Your impact vision gives your voice direction and purpose.
              </p>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'impact-insight',
          content: `Beautiful! ${voiceJourney.origin || 'Your origin story'} gives your voice authentic power.\n\nNow for Sofia's next discovery...`,
          type: 'lyra-unified',
          emotion: 'excited',
          delay: 500
        },
        {
          id: 'impact-story',
          content: "Sofia was asked to speak at a fundraising dinner. She prepared statistics about housing insecurity, recidivism rates, program success metrics.\n\nThe audience was polite but distant. They wrote small checks.\n\nThen Sofia tried something different. She painted a picture: 'Imagine Maria, no longer checking over her shoulder for landlords, helping her daughter with homework at their own kitchen table.'\n\nThe response was immediate. Bigger checks, volunteer offers, real engagement.",
          type: 'lyra-unified',
          emotion: 'thoughtful',
          delay: 3000
        },
        {
          id: 'impact-magic',
          content: "That's the 'I' in VOICE: IMPACT VISION.\n\nWatch the panel clear as this secret is revealed.\n\nPeople don't just want to know what you do—they want to see the world you're creating.\n\nStatistics inform. Vision transforms.",
          type: 'lyra-unified',
          emotion: 'warm',
          delay: 10000,
          trigger: 'blur-clear-impact'
        },
        {
          id: 'impact-action',
          content: "Choose your transformation vision.\n\nSofia learned to ask: 'When I succeed, how will people's lives actually look different?'\n\nMake them see it, feel it, want to be part of creating it.",
          type: 'lyra-unified',
          emotion: 'encouraging',
          delay: 16000,
          layers: {
            beginner: "Pick the change that gets you most excited to create!",
            intermediate: "Impact vision creates emotional investment. People support transformation they can visualize.",
            advanced: "Mirror neuron activation through vivid future scenarios drives behavioral change and commitment."
          }
        }
      ]
    },
    {
      id: 'craft',
      title: 'C - Craft & Style',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold">C - Craft & Style</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Step 4: Choose your storytelling style. Sofia discovered her unique voice by selecting the approach that felt most natural.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {voiceProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  setVoiceJourney(prev => ({ ...prev, selectedVoice: profile.id }));
                  setLyraExpression('celebrating');
                }}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  "hover:border-orange-400 hover:bg-orange-50",
                  voiceJourney.selectedVoice === profile.id ? 'border-orange-600 bg-orange-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-2">{profile.label}</div>
                <div className="text-sm text-gray-600 mb-3">{profile.description}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.voiceWords.map((word, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      {word}
                    </span>
                  ))}
                </div>
                <div className="text-xs italic text-gray-700 border-l-3 border-orange-300 pl-3">
                  "{profile.example}"
                </div>
              </button>
            ))}
          </div>
          
          {voiceJourney.selectedVoice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg"
            >
              <h4 className="font-semibold mb-2">Your Voice Profile is Ready!</h4>
              <div className="text-sm space-y-2">
                <div className="p-2 bg-white rounded border">
                  <strong>Values:</strong> {voiceJourney.values}
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Origin:</strong> {voiceJourney.origin}
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Impact:</strong> {voiceJourney.impact}
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Style:</strong> {voiceProfiles.find(p => p.id === voiceJourney.selectedVoice)?.label}
                </div>
              </div>
              
              <Button 
                onClick={() => setCurrentStageIndex(5)}
                className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600"
              >
                Express Your Voice <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'craft-insight',
          content: `Excellent! ${voiceJourney.impact || 'Your impact vision'} paints a compelling future.\n\nNow for Sofia's style breakthrough...`,
          type: 'lyra-unified',
          emotion: 'excited',
          delay: 500
        },
        {
          id: 'craft-story',
          content: "Sofia tried copying other speakers she admired. The polished CEO who never showed emotion. The academic who buried insights in theory. The activist who only expressed anger.\n\nEach attempt felt like wearing someone else's clothes. Wrong fit, wrong voice, wrong impact.\n\nThen Sofia realized: authenticity isn't about being perfect—it's about being perfectly yourself.",
          type: 'lyra-unified',
          emotion: 'thoughtful',
          delay: 3000
        },
        {
          id: 'craft-magic',
          content: "This is the 'C' in VOICE: CRAFT & STYLE.\n\nWatch the final clarity emerge as Sofia's voice becomes clear.\n\nYour style isn't about copying someone else—it's about amplifying who you already are.\n\nWhich approach feels most naturally yours?",
          type: 'lyra-unified',
          emotion: 'warm',
          delay: 10000,
          trigger: 'blur-clear-craft'
        },
        {
          id: 'craft-action',
          content: "Choose the style that makes you think: 'Yes, this is me.'\n\nSofia learned that your most powerful voice is your most authentic voice, refined and focused.",
          type: 'lyra-unified',
          emotion: 'encouraging',
          delay: 16000,
          layers: {
            beginner: "Pick the style that feels like coming home to yourself!",
            intermediate: "Authentic style creates trust. When you're genuinely yourself, people feel permission to be genuine too.",
            advanced: "Style authenticity triggers neurological safety responses, creating deeper listener engagement and retention."
          }
        }
      ]
    },
    {
      id: 'expression',
      title: 'E - Expression in Action',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold">E - Expression in Action</h3>
            </div>
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🎯 Your Complete Voice Profile:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Values:</strong> {voiceJourney.values}</div>
                <div><strong>Origin:</strong> {voiceJourney.origin}</div>
                <div><strong>Impact:</strong> {voiceJourney.impact}</div>
                <div><strong>Style:</strong> {voiceProfiles.find(p => p.id === voiceJourney.selectedVoice)?.label}</div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 mb-6 shadow-lg"
          >
            <h4 className="font-semibold mb-4">Sofia's Voice in Action</h4>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">
                {generateSofiaStory(voiceJourney)}
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => {
              setVoiceJourney({ 
                values: '',
                origin: '',
                impact: '',
                craft: '',
                expression: '',
                selectedVoice: '',
                storyDraft: '',
                finalStory: '',
                voiceRecording: null,
                authenticity: 0
              });
              setCurrentStageIndex(1);
              setPanelBlurLevel('full');
              setVisibleMessages([]);
              setTypedContent({});
              setIsTyping(null);
              messageTimeoutsRef.current.forEach(clearTimeout);
              messageTimeoutsRef.current = [];
              if (typewriterTimeoutRef.current) {
                clearTimeout(typewriterTimeoutRef.current);
              }
            }}>
              Try Another VOICE
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                const storyToCopy = generateSofiaStory(voiceJourney);
                navigator.clipboard.writeText(storyToCopy);
                setLyraExpression('celebrating');
              }}
            >
              Copy Your Voice ✨
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg"
          >
            <p className="text-sm text-orange-800">
              <Volume2 className="w-4 h-4 inline mr-2" />
              Voice discovery complete! You've learned Sofia's framework for finding and expressing authentic voice.
            </p>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'expression-magic',
          content: "Watch Sofia's complete voice transformation unfold...\n\nFrom silent passion to compelling storytelling, using the VOICE Framework you just mastered.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'excited',
          delay: 500
        },
        {
          id: 'expression-transformation',
          content: "Do you see what just happened?\n\nFrom voice uncertainty to authentic power in minutes.\n\nSofia went from hiding her truth to sharing it boldly. Her community center now has a waiting list of volunteers inspired by her storytelling. Donors don't just give money—they become advocates.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'proud',
          delay: 4000
        },
        {
          id: 'expression-deeper',
          content: "But here's what I love most about Sofia's VOICE transformation...\n\nIt wasn't about finding a new voice. It was about removing everything that was covering her real voice. About trusting that her authentic story, told with genuine heart, was exactly what the world needed to hear.\n\nThat's the real power of Values, Origin, Impact, Craft, and Expression.",
          type: 'lyra-unified',
          context: 'reflection',
          emotion: 'warm',
          delay: 10000,
          layers: {
            beginner: "You did it! You've discovered Sofia's VOICE Framework!",
            intermediate: "This framework scales. Sofia now speaks confidently to any audience, adapting her voice while staying authentic.",
            advanced: "The VOICE framework activates all elements of persuasive communication—ethos, pathos, logos, and authenticity."
          }
        },
        {
          id: 'expression-celebration',
          content: "🎉 Welcome to authentic voice mastery!\n\nYou're not just telling stories anymore. You're sharing Values-driven, Origin-rooted, Impact-focused communications that Craft authentic connection and Express your truth powerfully.\n\nJust like Sofia and her transformative voice.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'celebrating',
          delay: 17000
        }
      ]
    }
  ], [panelBlurLevel, voiceJourney, voiceProfiles]);

  const currentStage = React.useMemo(() => stages[currentStageIndex] || stages[0], [stages, currentStageIndex]);

  // Fast-forward function to skip typing animations
  const fastForwardStage = React.useCallback(() => {
    setIsFastForwarding(true);
    
    // Clear all active timeouts
    messageTimeoutsRef.current.forEach(clearTimeout);
    messageTimeoutsRef.current = [];
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    // Show all messages immediately
    const stage = currentStage;
    if (stage && stage.narrativeMessages) {
      setVisibleMessages(stage.narrativeMessages);
      
      // Complete all typed content immediately
      const completedContent: {[key: string]: string} = {};
      stage.narrativeMessages.forEach(message => {
        const content = message.layers?.[userLevel] || message.content;
        completedContent[message.id] = content;
        
        // Trigger any effects immediately
        if (message.trigger === 'blur-clear' ||
            message.trigger === 'blur-clear-values' ||
            message.trigger === 'blur-clear-origin' ||
            message.trigger === 'blur-clear-impact' ||
            message.trigger === 'blur-clear-craft') {
          setPanelBlurLevel('clear');
        }
        if (message.trigger === 'show-summary') {
          setShowSummaryPanel(true);
        }
      });
      
      setTypedContent(completedContent);
      setIsTyping(null);
    }
    
    // Reset fast-forward state after a brief delay
    setTimeout(() => setIsFastForwarding(false), 500);
  }, [currentStage, userLevel]);

  // Update expression based on stage emotions
  useEffect(() => {
    const currentMessages = currentStage?.narrativeMessages;
    if (currentMessages && currentMessages.length > 0) {
      const emotions = currentMessages[0].emotion;
      if (emotions === 'thoughtful') setLyraExpression('thinking');
      else if (emotions === 'celebrating' || emotions === 'excited') setLyraExpression('celebrating');
      else if (emotions === 'encouraging' || emotions === 'warm') setLyraExpression('helping');
      else setLyraExpression('default');
    }
  }, [currentStageIndex]);

  // Enhanced typewriter effect
  const typeMessage = React.useCallback((message: LyraNarrativeMessage, onComplete?: () => void) => {
    if (!message) return;
    
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    setIsTyping(message.id);
    let charIndex = 0;
    
    // Get content based on current user level
    const content = message.layers?.[userLevel] || message.content;
    if (!content) return;
    
    setTypedContent(prev => ({ ...prev, [message.id]: '' }));

    const typeChar = () => {
      if (charIndex < content.length) {
        const char = content[charIndex];
        setTypedContent(prev => ({ 
          ...prev, 
          [message.id]: content.slice(0, charIndex + 1) 
        }));
        charIndex++;

        // Enhanced storytelling rhythm
        let delay = 20 + Math.random() * 20;
        
        // Dramatic pauses
        if (['.', '!', '?'].includes(char)) delay += 400;
        else if ([',', ';', ':'].includes(char)) delay += 200;
        else if (char === '\n') delay += 300;
        else if (content.slice(charIndex - 3, charIndex) === '...') delay += 500;
        
        // Emotion-based pacing
        if (message.emotion === 'thoughtful') delay *= 1.2;
        else if (message.emotion === 'excited') delay *= 0.8;

        typewriterTimeoutRef.current = setTimeout(typeChar, delay);
      } else {
        setIsTyping(null);
        
        // Check for blur transition using trigger
        if (message.trigger === 'blur-clear' || 
            message.trigger === 'blur-clear-values' ||
            message.trigger === 'blur-clear-origin' ||
            message.trigger === 'blur-clear-impact' ||
            message.trigger === 'blur-clear-craft') {
          setPanelBlurLevel('clear');
        }
        if (message.trigger === 'show-summary') {
          setShowSummaryPanel(true);
        }
        
        if (onComplete) {
          setTimeout(onComplete, 600);
        }
      }
    };

    typewriterTimeoutRef.current = setTimeout(typeChar, 100);
  }, [userLevel]);

  // Process messages sequentially
  const processMessages = React.useCallback((messages: LyraNarrativeMessage[], index: number = 0) => {
    if (!messages || index >= messages.length) return;

    const message = messages[index];
    if (!message) return;
    
    const delay = index === 0 ? (message.delay || 500) : 0;

    const timeoutId = setTimeout(() => {
      setVisibleMessages(prev => {
        // Prevent duplicate messages
        const exists = prev.find(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      
      typeMessage(message, () => {
        processMessages(messages, index + 1);
      });
    }, delay);

    messageTimeoutsRef.current.push(timeoutId);
  }, [typeMessage]);

  // Load messages and manage blur state
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      isInitializedRef.current = false;
    }
    
    // Clear previous state
    messageTimeoutsRef.current.forEach(clearTimeout);
    messageTimeoutsRef.current = [];
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    setVisibleMessages([]);
    setTypedContent({});
    setIsTyping(null);
    
    const stage = currentStage;
    if (!stage) return;
    
    // Set initial blur state
    if (stage.panelBlurState) {
      setPanelBlurLevel(stage.panelBlurState);
    }
    
    // Process messages with a small delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      isInitializedRef.current = true;
      processMessages(stage.narrativeMessages);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      messageTimeoutsRef.current.forEach(clearTimeout);
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [currentStageIndex, processMessages]);

  // Auto-scroll chat
  const messagesLength = visibleMessages.length;
  const typedContentKeys = Object.keys(typedContent).length;
  
  useEffect(() => {
    if (chatRef.current && messagesLength > 0) {
      const scrollToBottom = () => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      };
      requestAnimationFrame(scrollToBottom);
    }
  }, [messagesLength, typedContentKeys]);

  // Sofia's story generator based on VOICE framework
  function generateSofiaStory(journey: typeof voiceJourney): string {
    const selectedProfile = voiceProfiles.find(p => p.id === journey.selectedVoice);
    
    if (!journey.values || !journey.origin || !journey.impact || !selectedProfile) {
      return 'Complete all VOICE steps to see Sofia\'s authentic story...';
    }

    return `"${journey.values}" – Sofia Martinez

When I was eight years old, my family lost our apartment. I remember my mother's hands shaking as she called shelter after shelter, only to hear "no space" again and again. That night, we showed up at a community center in East LA, and a woman named Carmen didn't ask questions – she just made room.

That experience – ${journey.origin.toLowerCase()} – taught me that in our most vulnerable moments, we need more than services. We need dignity. We need someone to see our humanity first.

Today, I run that same community center where Carmen once welcomed us. But here's what drives me every single day: I see ${journey.impact.toLowerCase()}. Not just families surviving crisis, but families who know they belong somewhere, families who have people in their corner.

I used to think professional meant perfect. That sharing my story would make me seem weak or unprepared. But I've learned that my voice doesn't come from hiding my struggles – it comes from transforming them into strength that others can lean on.

Every family I serve sees themselves in my story. They trust me not because I have all the answers, but because I've walked where they're walking. And when they share their stories with me, we create something bigger than both of us.

Your voice isn't about being perfect. It's about being perfectly, authentically you.

That's the voice that changes everything.`;
  }

  return (
    <div className="minimal-ui min-h-screen bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header with Lyra */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <LyraAvatar size="sm" expression={lyraExpression} animated />
            <div>
              <h1 className="font-semibold">Sofia's VOICE Framework Journey</h1>
              <p className="text-sm text-gray-600">Narrated by Lyra, your AI guide</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fastForwardStage}
              disabled={isFastForwarding}
              className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-50"
              title="Skip to end of current stage"
            >
              <FastForward className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {isFastForwarding ? 'Skipping...' : 'Fast Forward'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserLevel(userLevel === 'beginner' ? 'intermediate' : userLevel === 'intermediate' ? 'advanced' : 'beginner')}
              className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              title={`${userLevel} mode: ${
                userLevel === 'beginner' ? 'Simple explanations and encouragement' :
                userLevel === 'intermediate' ? 'Practical tips and patterns' :
                'Advanced insights and methodology'
              }. Click to cycle through levels.`}
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {userLevel} mode
            </motion.button>
            <div className="text-gray-500">
              Step {currentStageIndex + 1} of {stages.length}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content - Responsive Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Lyra's Enhanced Narrative Panel */}
          <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-b lg:border-b-0 flex flex-col bg-white">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50"
            >
              <h2 className="font-medium text-orange-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Lyra's Storytelling
              </h2>
            </motion.div>
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {visibleMessages.map((message) => (
                <div key={message.id}>
                  {/* Unified Lyra chat interface */}
                  <div className="flex gap-3">
                    <LyraAvatar size="sm" expression={lyraExpression} animated={isTyping === message.id} />
                    <div className="flex-1">
                      <div className={cn(
                        "rounded-lg p-4 border-l-4 transition-all duration-300",
                        // Context-based styling while maintaining unified Lyra voice
                        message.context === 'story' && "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400",
                        message.context === 'guidance' && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400",
                        message.context === 'celebration' && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400",
                        message.context === 'reflection' && "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400",
                        !message.context && "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400"
                      )}>
                        <div className={cn(
                          "storytelling-text whitespace-pre-wrap",
                          message.context === 'celebration' && "font-medium text-green-800",
                          message.context === 'guidance' && "text-blue-800",
                          message.context === 'reflection' && "text-purple-800",
                          (!message.context || message.context === 'story') && "text-gray-700"
                        )}>
                          {typedContent[message.id] || ''}
                          {isTyping === message.id && (
                            <span className={cn(
                              "inline-block w-0.5 h-5 ml-1 animate-pulse",
                              message.context === 'celebration' && "bg-green-500",
                              message.context === 'guidance' && "bg-blue-500",
                              message.context === 'reflection' && "bg-purple-500",
                              (!message.context || message.context === 'story') && "bg-orange-500"
                            )} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Interactive Panel with Advanced Effects */}
          <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-orange-50/50 to-amber-50/50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 border-b bg-white/80 backdrop-blur-sm"
            >
              <h2 className="font-medium flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-600" />
                {currentStage.title}
              </h2>
            </motion.div>
            <div className="flex-1 overflow-y-auto relative">
              {/* Enhanced Blur overlay with smooth transitions */}
              <motion.div 
                className={cn(
                  "absolute inset-0 pointer-events-none",
                  panelBlurLevel === 'full' && "backdrop-blur-xl",
                  panelBlurLevel === 'partial' && "backdrop-blur-sm",
                  panelBlurLevel === 'clear' && "backdrop-blur-none"
                )}
                initial={{ backdropFilter: 'blur(40px)' }}
                animate={{ 
                  backdropFilter: panelBlurLevel === 'full' ? 'blur(40px)' : 
                                 panelBlurLevel === 'partial' ? 'blur(4px)' : 'blur(0px)'
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {currentStage.component}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar with Glow Effect */}
        <div className="h-3 bg-gray-200 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 relative"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          <div className="absolute inset-0 flex justify-between items-center px-2">
            {Array.from({ length: stages.length }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full border-2",
                  i <= currentStageIndex ? "bg-white border-orange-600" : "bg-gray-300 border-gray-400"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
        
        {/* Summary Panel */}
        <VOICESummaryPanel 
          showSummaryPanel={showSummaryPanel}
          setShowSummaryPanel={setShowSummaryPanel}
          voiceJourney={voiceJourney}
          voiceProfiles={voiceProfiles}
        />
      </div>
    </div>
  );
};

// VOICE Summary Panel - Always visible with live updates
function VOICESummaryPanel({ 
  showSummaryPanel, 
  setShowSummaryPanel, 
  voiceJourney,
  voiceProfiles
}: {
  showSummaryPanel: boolean;
  setShowSummaryPanel: (show: boolean) => void;
  voiceJourney: any;
  voiceProfiles: VoiceProfile[];
}) {
  if (!showSummaryPanel) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-4 left-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-orange-800">Your VOICE Framework</h3>
          <button 
            onClick={() => setShowSummaryPanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className={cn(
            "p-2 rounded",
            voiceJourney.values ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3" />
              <span className="font-medium">VALUES:</span>
            </div>
            <div className="ml-5">{voiceJourney.values || 'Pending...'}</div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            voiceJourney.origin ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">ORIGIN:</span>
            </div>
            <div className="ml-5">{voiceJourney.origin || 'Pending...'}</div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            voiceJourney.impact ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              <span className="font-medium">IMPACT:</span>
            </div>
            <div className="ml-5">{voiceJourney.impact || 'Pending...'}</div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            voiceJourney.selectedVoice ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3 h-3" />
              <span className="font-medium">CRAFT:</span>
            </div>
            <div className="ml-5">
              {voiceJourney.selectedVoice ? 
                voiceProfiles.find(p => p.id === voiceJourney.selectedVoice)?.label : 
                'Pending...'
              }
            </div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            voiceJourney.values && voiceJourney.origin && voiceJourney.impact && voiceJourney.selectedVoice ? 
            "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Mic className="w-3 h-3" />
              <span className="font-medium">EXPRESSION:</span>
            </div>
            <div className="ml-5">
              {voiceJourney.values && voiceJourney.origin && voiceJourney.impact && voiceJourney.selectedVoice ? 
                "Ready! ✨" : "Pending..."
              }
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SofiaVoiceDiscoveryLesson;