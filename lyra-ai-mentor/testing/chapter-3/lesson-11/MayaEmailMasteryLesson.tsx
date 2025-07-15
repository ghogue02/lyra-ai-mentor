import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronRight, Check, Sparkles, Mail, Target, Lightbulb, Eye, Loader2, Zap, FastForward, Clock, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import Maya's specialized components
import { MayaEmailComposer } from '@/components/interactive/MayaEmailComposer';
import MayaToneChecker from '@/components/interactive/MayaToneChecker';
import MayaTemplateLibrary from '@/components/interactive/MayaTemplateLibrary';
import MayaConfidenceBuilder from '@/components/interactive/MayaConfidenceBuilder';

// Progress tracking
import { useComponentProgress } from '@/hooks/useComponentProgress';
import { ProgressWidget } from '@/components/ProgressWidget';

// Export functionality
import { ExportButton } from '@/components/ui/ExportButton';
import { ExportData } from '@/services/exportService';

import '@/styles/minimal-ui.css';

// Types for chat messages with Lyra's unified narrative structure
interface LyraNarrativeMessage {
  id: string;
  content: string;
  type: 'lyra-unified';
  emotion?: 'warm' | 'encouraging' | 'excited' | 'proud' | 'thoughtful';
  trigger?: string;
  delay?: number;
  layers?: {
    beginner: string;
    intermediate?: string;
    advanced?: string;
  };
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

// Component for email metrics showcase
const EmailMetricsShowcase: React.FC<{ beforeTime: number; afterTime: number }> = ({ beforeTime, afterTime }) => {
  const timeSaved = beforeTime - afterTime;
  const weeklySavings = timeSaved * 5; // 5 emails per week
  const monthlySavings = weeklySavings * 4;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <Clock className="w-8 h-8 mx-auto mb-2 text-red-600" />
        <p className="text-lg font-bold text-red-800 line-through">{beforeTime} minutes</p>
        <p className="text-sm text-red-600">Before PACE</p>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-green-600" />
        <p className="text-lg font-bold text-green-800">{afterTime} minutes</p>
        <p className="text-sm text-green-600">With PACE Framework</p>
      </div>
      <div className="col-span-2 text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
        <p className="text-xl font-bold text-purple-800">{timeSaved} minutes saved per email</p>
        <div className="text-sm text-purple-600 space-y-1 mt-2">
          <p>Weekly: {Math.floor(weeklySavings / 60)}h {weeklySavings % 60}m saved</p>
          <p>Annual: {Math.floor(annualSavings / 60)}+ hours reclaimed</p>
        </div>
      </div>
    </div>
  );
};

// Main lesson component
const MayaEmailMasteryLesson: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<LyraNarrativeMessage[]>([]);
  const [typedContent, setTypedContent] = useState<{[key: string]: string}>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [panelBlurLevel, setPanelBlurLevel] = useState<'full' | 'partial' | 'clear'>('full');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping'>('default');
  
  const [lessonData, setLessonData] = useState({
    emailsCreated: 0,
    totalTimeSaved: 0,
    skillsLearned: [] as string[],
    componentsUsed: [] as string[],
    currentTool: 'introduction'
  });
  
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [showPACESummaryPanel, setShowPACESummaryPanel] = useState(true);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isInitializedRef = useRef(false);

  // Gamification integration
  const { isCompleted, timeSpent, trackInteraction, markAsComplete } = useComponentProgress({
    componentId: 'MayaEmailMasteryLesson',
    autoStart: true,
    completionThreshold: 80
  });

  // Track skill completion
  const addSkill = (skill: string) => {
    if (!lessonData.skillsLearned.includes(skill)) {
      setLessonData(prev => ({
        ...prev,
        skillsLearned: [...prev.skillsLearned, skill]
      }));
      trackInteraction(15); // 15% progress per major skill
    }
  };

  // Track component usage
  const trackComponentUsage = (component: string) => {
    if (!lessonData.componentsUsed.includes(component)) {
      setLessonData(prev => ({
        ...prev,
        componentsUsed: [...prev.componentsUsed, component]
      }));
      trackInteraction(10); // 10% progress per component used
    }
  };

  // Memoized stages to prevent recreation
  const stages = React.useMemo<InteractiveStage[]>(() => [
    {
      id: 'intro',
      title: 'Maya\'s Email Overwhelm Crisis',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "flex flex-col items-center justify-center h-full text-center p-8 transition-all duration-1000",
          panelBlurLevel === 'full' && "blur-xl opacity-30",
          panelBlurLevel === 'partial' && "blur-sm opacity-60"
        )}>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">The Email Crisis</h2>
          <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
            Maya stares at her computer screen at 7:30 PM. One parent email has taken her 32 minutes to write, and she's still not satisfied. Her daughter called twice asking when she's coming home.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md">
            <p className="text-red-800 font-medium">This overwhelm ends tonight.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button 
              onClick={() => {
                setCurrentStageIndex(1);
                addSkill('Email Crisis Recognition');
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 text-lg px-8 py-3"
            >
              Discover the PACE Solution <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'lyra-intro-1',
          content: "I'm Lyra, and tonight I'm going to tell you about Maya's darkest hour... and her greatest breakthrough.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500,
          layers: {
            beginner: "I'm Lyra, and tonight I'm going to tell you about Maya's darkest hour... and her greatest breakthrough.",
            intermediate: "I'm Lyra. What you're about to witness is how 32 minutes of frustration became 5 minutes of confidence.",
            advanced: "I'm Lyra. This is the story of cognitive load overwhelm and the systematic framework that solved it forever."
          }
        },
        {
          id: 'maya-crisis-1',
          content: "Maya Rodriguez sits alone in her office at Hope Gardens Community Center. The fluorescent lights hum overhead as she types, deletes, and retypes the same sentence for the fourth time.\n\n'How do I tell this parent their concern is valid without admitting we made a mistake?'\n\nHer cursor blinks mockingly at a half-finished email that should have taken 5 minutes.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 4000
        },
        {
          id: 'maya-crisis-2',
          content: "Look at the screen on the right - that blur represents exactly how unclear everything felt to Maya. Every email was a mountain of decisions:\n\n• What tone should I use?\n• How formal should I be?\n• What if I say the wrong thing?\n• How do I start this?\n• How do I end it?\n\nThe paralysis was real.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'thoughtful',
          delay: 10000,
          trigger: 'blur-represents-confusion'
        },
        {
          id: 'maya-crisis-3',
          content: "But Maya's about to discover something that will change everything. A framework so powerful, so systematic, that email writing will never feel overwhelming again.\n\nWatch as her world comes into focus...",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 16000,
          trigger: 'begin-clarity'
        }
      ]
    },
    {
      id: 'composer-discovery',
      title: 'Email Recipe Builder - PACE Foundation',
      panelBlurState: 'partial',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel === 'full' && "blur-sm opacity-50",
          panelBlurLevel === 'partial' && "blur-none opacity-100"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Maya's Email Recipe Builder</h3>
            </div>
            <p className="text-gray-600 mb-6">
              The same tool Maya uses daily to craft perfect emails in under 5 minutes.
            </p>
          </div>
          
          <MayaEmailComposer 
            onComplete={(data) => {
              setLessonData(prev => ({
                ...prev,
                emailsCreated: prev.emailsCreated + data.recipesCreated,
                totalTimeSaved: prev.totalTimeSaved + data.timeSpent
              }));
              trackComponentUsage('Email Recipe Builder');
              addSkill('PACE Framework Mastery');
              setCurrentStageIndex(2);
            }}
          />
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">You're Learning Maya's PACE Framework:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">P</span>
                <span>Purpose-driven prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">A</span>
                <span>Audience awareness</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">C</span>
                <span>Connection through tone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">E</span>
                <span>Execute with confidence</span>
              </div>
            </div>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'composer-reveal-1',
          content: "And then Maya remembered something her colleague mentioned: 'What if you could teach AI to write emails exactly the way you would?'\n\nThat night, she discovered the Email Recipe Builder - the same tool that's now clearing the blur from your screen.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'encouraging',
          delay: 500,
          trigger: 'clear-composer-blur'
        },
        {
          id: 'composer-revelation-1',
          content: "Maya's breakthrough wasn't just about faster emails. It was about developing a systematic approach that removes the cognitive burden of starting from scratch every time.\n\nThis is the PACE Framework in action - watch Maya's methodology unfold before your eyes.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'composer-action-1',
          content: "Now it's your turn. Use Maya's exact Email Recipe Builder - the same tool she relies on every day at Hope Gardens.\n\nExperience how Purpose + Audience + Connection + Execution transforms email chaos into confident communication.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          layers: {
            beginner: "Try Maya's Email Recipe Builder - it makes email writing simple!",
            intermediate: "This is Maya's actual workflow - see how systematic approaches eliminate decision fatigue.",
            advanced: "Experience cognitive load theory in practice: structured frameworks reduce mental processing overhead."
          }
        }
      ]
    },
    {
      id: 'tone-mastery',
      title: 'Tone Checker - Connection Mastery',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Tone Analysis & Optimization</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's secret weapon for ensuring every email lands with the right emotional impact.
            </p>
          </div>
          
          <MayaToneChecker />
          
          <div className="mt-6 space-y-4">
            <Button 
              onClick={() => {
                trackComponentUsage('Tone Checker');
                addSkill('Emotional Intelligence in Writing');
                setCurrentStageIndex(3);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Continue to Template Library <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'tone-story-1',
          content: "Maya's next discovery happened by accident. She sent the same update email to two different parents - one formal, one warm.\n\nThe formal email got a cold, defensive response. The warm email sparked a beautiful conversation about their child's progress.\n\nSame information. Completely different outcomes.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'tone-learning-1',
          content: "That's when Maya realized: tone isn't just about being nice. It's about emotional strategy.\n\nEvery email creates a feeling in the reader. Maya learned to choose that feeling intentionally.\n\nNow she checks every important email through her Tone Analyzer - the same tool you see here.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'tone-practice-1',
          content: "Try Maya's Tone Checker now. Upload an email you've written and see how it analyzes warmth, professionalism, clarity, and confidence.\n\nThis is how Maya ensures every message builds relationships instead of barriers.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          layers: {
            beginner: "Check your email's tone - Maya's tool shows you how it feels to readers!",
            intermediate: "Tone analysis reveals the emotional subtext of your communication patterns.",
            advanced: "Empirical tone measurement enables systematic optimization of reader emotional response."
          }
        }
      ]
    },
    {
      id: 'template-efficiency',
      title: 'Template Library - Efficiency Mastery',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Professional Template Library</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's collection of proven email templates for every situation at Hope Gardens.
            </p>
          </div>
          
          <MayaTemplateLibrary />
          
          <div className="mt-6 space-y-4">
            <Button 
              onClick={() => {
                trackComponentUsage('Template Library');
                addSkill('Template-Based Efficiency');
                setCurrentStageIndex(4);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue to Confidence Building <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'template-efficiency-1',
          content: "By month three of using her new system, Maya had built something remarkable: a library of email templates that worked.\n\nNot just any templates - emails that had been tested with real parents, volunteers, and board members. Emails that got positive responses.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'proud',
          delay: 500
        },
        {
          id: 'template-wisdom-1',
          content: "Maya learned that great templates aren't about copying and pasting. They're about capturing the structure and tone that works, then customizing the content.\n\nEach template in her library represents a communication victory - a relationship strengthened, a problem solved, a connection made.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'template-action-1',
          content: "Explore Maya's actual template library. These are the frameworks she uses to handle everything from thanking volunteers to addressing parent concerns.\n\nNotice how each template includes CARE elements - Clarity, Audience-awareness, Relevance, and Engagement.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          layers: {
            beginner: "Use Maya's templates as starting points - they make email writing faster!",
            intermediate: "Templates provide consistent quality while reducing cognitive load for common scenarios.",
            advanced: "Systematic template frameworks enable scalable, relationship-building communication patterns."
          }
        }
      ]
    },
    {
      id: 'confidence-scenarios',
      title: 'Confidence Builder - Challenge Mastery',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Difficult Scenario Practice</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's practice system for handling challenging email situations with grace and confidence.
            </p>
          </div>
          
          <MayaConfidenceBuilder />
          
          <div className="mt-6 space-y-4">
            <Button 
              onClick={() => {
                trackComponentUsage('Confidence Builder');
                addSkill('Difficult Conversation Navigation');
                setCurrentStageIndex(5);
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              See Maya's Transformation <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'confidence-challenge-1',
          content: "The real test came six months later. A parent sent Maya an angry email at 4:47 PM on a Friday, demanding immediate answers about a policy change.\n\nThe old Maya would have panicked, spent her weekend crafting the perfect response, and still felt uncertain when she hit send.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'confidence-victory-1',
          content: "But this Maya? She opened her Confidence Builder, selected 'Responding to Angry Emails,' reviewed her strategy, and crafted a response in 7 minutes.\n\nThe parent called Monday morning to thank her for her thoughtful, professional reply and to apologize for their harsh tone.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'proud',
          delay: 6000
        },
        {
          id: 'confidence-mastery-1',
          content: "This is where Maya's transformation became complete - not just faster emails, but confident communication in every situation.\n\nTry her Confidence Builder. Practice the scenarios that used to keep her up at night, now solved with systematic approaches.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          layers: {
            beginner: "Practice tricky email situations with Maya's guidance - build your confidence!",
            intermediate: "Systematic practice of challenging scenarios builds communication resilience and expertise.",
            advanced: "Scenario-based learning creates neural pathways for confident responses to complex interpersonal situations."
          }
        }
      ]
    },
    {
      id: 'transformation-complete',
      title: 'Maya\'s Communication Mastery',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-8">
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Maya's Transformation Complete</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                From email overwhelm to communication mastery. From 32 minutes of stress to 5 minutes of confidence.
              </p>
            </div>
          </div>

          <EmailMetricsShowcase beforeTime={32} afterTime={5} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-purple-800">Skills Mastered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessonData.skillsLearned.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-blue-800">Tools Mastered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessonData.componentsUsed.map((component, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{component}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CardTitle className="text-lg text-green-800">Your Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emails Created:</span>
                    <span className="font-semibold">{lessonData.emailsCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time in Lesson:</span>
                    <span className="font-semibold">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span className="font-semibold">{Math.min(100, Math.round((lessonData.skillsLearned.length / 6) * 100))}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">You've Mastered Maya's Communication Framework</h3>
              <p className="text-purple-700 mb-6">
                You now have the same systematic approach to email that transformed Maya's work life and gave her back her evenings with family.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <ExportButton
                  data={(): ExportData => ({
                    title: `Maya's Email Mastery Lesson - Certificate of Completion`,
                    content: `COMMUNICATION MASTERY CERTIFICATE\n\nCongratulations! You have completed Maya's Email Communication Mastery lesson and demonstrated proficiency in:\n\n${lessonData.skillsLearned.map(skill => `• ${skill}`).join('\n')}\n\nTools Mastered:\n${lessonData.componentsUsed.map(tool => `• ${tool}`).join('\n')}\n\nTime Investment: ${Math.floor(timeSpent / 60)} minutes ${timeSpent % 60} seconds\nEmails Created: ${lessonData.emailsCreated}\nCompletion Rate: ${Math.min(100, Math.round((lessonData.skillsLearned.length / 6) * 100))}%\n\nYou are now equipped with Maya's PACE Framework for confident, efficient email communication.`,
                    metadata: {
                      createdAt: new Date().toISOString(),
                      lessonType: 'Email Communication Mastery',
                      character: 'Maya Rodriguez',
                      completionData: lessonData
                    },
                    sections: [
                      {
                        title: 'Skills Mastered',
                        content: lessonData.skillsLearned.join(', '),
                        type: 'text'
                      },
                      {
                        title: 'Tools Used',
                        content: lessonData.componentsUsed.join(', '),
                        type: 'text'
                      }
                    ]
                  })}
                  formats={['pdf', 'docx']}
                  size="lg"
                  variant="default"
                  className="bg-purple-600 hover:bg-purple-700"
                  characterName="Maya"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Download Certificate
                </ExportButton>
                
                <Button 
                  onClick={() => {
                    markAsComplete(100);
                    toast.success('Lesson completed! Maya\'s framework is now yours.');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Mark Lesson Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'transformation-celebration-1',
          content: "And here we are, one year later. Maya now handles 50+ emails daily with confidence and grace.\n\nShe leaves work on time. Her stress levels plummeted. Her relationships with parents, volunteers, and board members deepened because her communication became so much clearer and warmer.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'proud',
          delay: 500
        },
        {
          id: 'transformation-impact-1',
          content: "But the real transformation? Maya taught this framework to her entire team of 15 volunteers.\n\nNow Hope Gardens Community Center runs on clear, confident communication. Parents feel heard. Volunteers feel supported. Board members feel informed.\n\nOne email framework transformed an entire organization's culture.",
          type: 'lyra-unified',
          context: 'reflection',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'transformation-legacy-1',
          content: "Maya's story shows us that communication mastery isn't about perfection - it's about systems.\n\nYou now have the same PACE Framework, the same tools, the same systematic approach that transformed Maya's professional and personal life.\n\nThe question is: what will you do with this power?",
          type: 'lyra-unified',
          context: 'reflection',
          emotion: 'encouraging',
          delay: 12000,
          layers: {
            beginner: "You've learned Maya's email secrets - now use them to communicate with confidence!",
            intermediate: "Systematic communication frameworks scale beyond email to all professional interactions.",
            advanced: "You've experienced how cognitive load theory, emotional intelligence, and structured processes combine to create communication mastery."
          }
        },
        {
          id: 'transformation-graduation-1',
          content: "🎉 Congratulations! You've graduated from Maya's Email Communication Mastery!\n\nYou're not just writing emails anymore - you're crafting connections, building relationships, and communicating with the confidence of someone who has a proven system.\n\nWelcome to the PACE Framework family!",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'excited',
          delay: 18000
        }
      ]
    }
  ], [panelBlurLevel, lessonData, timeSpent, isCompleted]);

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
        if (message.trigger === 'blur-represents-confusion') {
          // Keep blur for confusion representation
        } else if (message.trigger === 'begin-clarity') {
          setPanelBlurLevel('partial');
        } else if (message.trigger === 'clear-composer-blur') {
          setPanelBlurLevel('clear');
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
      else if (emotions === 'excited' || emotions === 'proud') setLyraExpression('celebrating');
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
        let delay = 25 + Math.random() * 20;
        
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
        
        // Check for blur transitions
        if (message.trigger === 'begin-clarity') {
          setPanelBlurLevel('partial');
        } else if (message.trigger === 'clear-composer-blur') {
          setPanelBlurLevel('clear');
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

  return (
    <div className="minimal-ui min-h-screen bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header with Lyra and Progress */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <LyraAvatar size="sm" expression={lyraExpression} animated />
            <div>
              <h1 className="font-semibold">Chapter 3, Lesson 11: Maya's Email Communication Mastery</h1>
              <p className="text-sm text-gray-600">Narrated by Lyra • PACE Framework Journey</p>
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
              className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              title={`${userLevel} mode - Click to cycle through levels`}
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              {userLevel}
            </motion.button>
            <div className="text-gray-500">
              {currentStageIndex + 1} of {stages.length}
            </div>
          </div>
        </div>

        {/* Progress Widget */}
        <ProgressWidget
          componentId="MayaEmailMasteryLesson"
          isCompleted={isCompleted}
          timeSpent={timeSpent}
          characterName="Maya"
          characterColor="purple"
          className="mx-4 mt-4"
        />

        {/* Main Content - Responsive Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Lyra's Narrative Panel */}
          <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-b lg:border-b-0 flex flex-col bg-white">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50"
            >
              <h2 className="font-medium text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Lyra's Storytelling
              </h2>
            </motion.div>
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {visibleMessages.map((message) => (
                <div key={message.id}>
                  <div className="flex gap-3">
                    <LyraAvatar size="sm" expression={lyraExpression} animated={isTyping === message.id} />
                    <div className="flex-1">
                      <div className={cn(
                        "rounded-lg p-4 border-l-4 transition-all duration-300",
                        message.context === 'story' && "bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-400",
                        message.context === 'guidance' && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400",
                        message.context === 'celebration' && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400",
                        message.context === 'reflection' && "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400",
                        !message.context && "bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-400"
                      )}>
                        <div className={cn(
                          "storytelling-text whitespace-pre-wrap",
                          message.context === 'celebration' && "font-medium text-green-800",
                          message.context === 'guidance' && "text-blue-800",
                          message.context === 'reflection' && "text-amber-800",
                          (!message.context || message.context === 'story') && "text-gray-700"
                        )}>
                          {typedContent[message.id] || ''}
                          {isTyping === message.id && (
                            <span className={cn(
                              "inline-block w-0.5 h-5 ml-1 animate-pulse",
                              message.context === 'celebration' && "bg-green-500",
                              message.context === 'guidance' && "bg-blue-500",
                              message.context === 'reflection' && "bg-amber-500",
                              (!message.context || message.context === 'story') && "bg-purple-500"
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

          {/* Interactive Panel with Blur Effects */}
          <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 border-b bg-white/80 backdrop-blur-sm"
            >
              <h2 className="font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                {currentStage.title}
              </h2>
            </motion.div>
            <div className="flex-1 overflow-y-auto relative">
              {currentStage.component}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="h-3 bg-gray-200 relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 relative"
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
                  i <= currentStageIndex ? "bg-white border-purple-600" : "bg-gray-300 border-gray-400"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MayaEmailMasteryLesson;