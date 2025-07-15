import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Timer, 
  Trophy,
  Lock,
  CheckCircle2,
  PlayCircle,
  MessageCircle,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles,
  Eye
} from 'lucide-react';
import { MobileResponsiveWrapper, ResponsiveGrid, TouchTarget, ResponsiveText } from '@/components/ui/mobile-responsive-wrapper';
import { MayaMicroLesson, MicroLessonData, ChatMessage } from './MayaMicroLesson';
import MayaMicroLessonMinimal from './MayaMicroLessonMinimal';
import { MayaEmailRecipeBuilder } from './MayaEmailRecipeBuilder';
import { MayaInteractiveEmailPractice } from './MayaInteractiveEmailPractice';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';
import '@/styles/glassmorphism.css';

// Sample micro-lessons for Chapter 2, Lesson 5 - Lyra narrates Maya's story
const CHAPTER_2_LESSON_5_MICRO_LESSONS: MicroLessonData[] = [
  {
    id: 'ml-2-5-1',
    lessonNumber: 1,
    title: 'Meet Maya\'s Challenge',
    estimatedTime: 120, // 2 minutes
    objective: 'Understand Maya\'s email anxiety and time constraints',
    type: 'chat',
    chatFlow: [
      {
        id: 'intro-1',
        sender: 'maya', // Using maya sender but Lyra narrates
        text: 'Meet Maya Rodriguez, Program Director at Hope Gardens Community Center. She has a challenge that might sound familiar...',
        emotion: 'worried',
        delay: 1500,
        animation: 'slide'
      },
      {
        id: 'intro-2',
        sender: 'maya',
        text: 'Maya loves her work, but there\'s one thing stealing precious time from her family - email. She spends 32 minutes writing each one.',
        emotion: 'worried',
        delay: 2000
      },
      {
        id: 'intro-3',
        sender: 'maya',
        text: 'With 15+ emails per week, that\'s over 8 hours away from her children. Maya needs a solution. How would you help her?',
        emotion: 'worried',
        choices: [
          'I\'d find a faster method',
          'I\'d use templates',
          'I\'d learn AI tools'
        ]
      },
      {
        id: 'response-1',
        sender: 'maya',
        text: 'Excellent thinking! Maya discovered something that transformed her email writing completely. Let me show you her journey...',
        emotion: 'hopeful',
        delay: 1500
      },
      {
        id: 'preview-1',
        sender: 'maya',
        text: 'Maya learned about the "Email Recipe Method" - a simple 3-ingredient approach that works like magic with AI. Want to see a real example?',
        emotion: 'excited',
        showAIButton: true,
        aiPrompt: 'Show Maya\'s before and after email transformation'
      },
      {
        id: 'discovery-1',
        sender: 'maya',
        text: 'Amazing, right? From 32 minutes to 5 seconds! Ready to learn Maya\'s secret recipe?',
        emotion: 'excited',
        choices: [
          'Yes, teach me!',
          'How does it work?'
        ],
        delay: 2000
      }
    ],
    successMetric: 'Understood Maya\'s challenge'
  },
  {
    id: 'ml-2-5-2',
    lessonNumber: 2,
    title: 'The Email Recipe Secret',
    estimatedTime: 150, // 2.5 minutes
    objective: 'Learn the 3-ingredient email recipe method',
    type: 'chat',
    chatFlow: [
      {
        id: 'recipe-1',
        sender: 'maya',
        text: 'Maya discovered the Email Recipe has just 3 simple ingredients. Like her grandmother\'s cooking - simple ingredients, amazing results!',
        emotion: 'confident',
        animation: 'slide'
      },
      {
        id: 'recipe-2',
        sender: 'maya',
        text: '🥇 First, Maya identifies her PURPOSE - What does she need? To inform, request, thank, or invite?',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-3',
        sender: 'maya',
        text: '🎯 Next, Maya considers her AUDIENCE - Who will read this? A parent, donor, volunteer, or board member?',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-4',
        sender: 'maya',
        text: '❤️ Finally, Maya chooses her TONE - How should it feel? Warm, professional, urgent, or grateful?',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-5',
        sender: 'maya',
        text: 'These 3 ingredients transformed Maya\'s 32-minute emails into 5-minute successes. Which ingredient would help you most?',
        emotion: 'confident',
        choices: [
          'Purpose - clarity is key',
          'Audience - know who you\'re writing to',
          'Tone - the feeling matters'
        ]
      },
      {
        id: 'recipe-6',
        sender: 'maya',
        text: 'Exactly! Now let\'s see how Maya used this recipe to solve a real challenge from yesterday...',
        emotion: 'excited'
      }
    ],
    successMetric: 'Learned the email recipe'
  },
  {
    id: 'ml-2-5-3',
    lessonNumber: 3,
    title: 'Maya\'s Real Challenge',
    estimatedTime: 180, // 3 minutes
    objective: 'Apply the recipe to a real email scenario',
    type: 'interactive',
    interactiveContent: MayaEmailRecipeBuilder, // Direct component reference
    successMetric: 'Built first email recipe'
  },
  {
    id: 'ml-2-5-4',
    lessonNumber: 4,
    title: 'Your First AI Email',
    estimatedTime: 180, // 3 minutes
    objective: 'Practice writing an email with AI assistance',
    type: 'interactive',
    interactiveContent: MayaInteractiveEmailPractice,
    successMetric: 'Completed first AI-assisted email'
  },
  {
    id: 'ml-2-5-5',
    lessonNumber: 5,
    title: 'Maya\'s Transformation',
    estimatedTime: 180, // 3 minutes
    objective: 'See the AI magic and celebrate transformation',
    type: 'chat',
    chatFlow: [
      {
        id: 'transform-1',
        sender: 'maya',
        text: 'Maya couldn\'t believe it - she wrote that email in just 5 minutes instead of her usual 32!',
        emotion: 'excited',
        animation: 'bounce'
      },
      {
        id: 'transform-2',
        sender: 'maya',
        text: 'Let me show you the exact email Maya generated with AI using her recipe method. Ready to see the magic?',
        emotion: 'excited',
        showAIButton: true,
        aiPrompt: 'Generate Maya\'s email to Sarah about Jayden\'s robotics progress'
      },
      {
        id: 'transform-3',
        sender: 'maya',
        text: 'That\'s 27 minutes saved on ONE email. With 15 emails weekly, Maya reclaimed over 6 hours for what matters most.',
        emotion: 'excited',
        delay: 2000
      },
      {
        id: 'transform-4',
        sender: 'maya',
        text: 'Maya now has more time with her children and the families at Hope Gardens. Her transformation inspires others. Are you ready to follow her path?',
        emotion: 'excited',
        choices: [
          'Yes, I want to transform too!',
          'I\'m ready to practice',
          'Maya\'s story gives me hope'
        ]
      },
      {
        id: 'celebrate-1',
        sender: 'system',
        text: '🎉 Achievement Unlocked: Email Time Ninja!',
        delay: 1000
      },
      {
        id: 'next-1',
        sender: 'maya',
        text: 'You\'ve completed Maya\'s first milestone! Her journey continues with even more powerful techniques. Ready for the next chapter?',
        emotion: 'excited'
      }
    ],
    successMetric: 'Completed transformation story'
  }
];

interface MayaMicroLessonHubProps {
  chapterId: number;
  lessonId: number;
}

export const MayaMicroLessonHub: React.FC<MayaMicroLessonHubProps> = ({ 
  chapterId, 
  lessonId 
}) => {
  const { user } = useAuth();
  const { mayaMetrics, refreshMayaMetrics } = useAdaptiveAI();
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [showHub, setShowHub] = useState(true);
  const [useMinimalUI, setUseMinimalUI] = useState(false);
  
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`maya-micro-progress-${chapterId}-${lessonId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedLessons(new Set(progress.completed));
      setTotalTimeSpent(progress.totalTime || 0);
    }
    
    // Load UI preference
    const uiPreference = localStorage.getItem('maya-minimal-ui-preference');
    if (uiPreference === 'true') {
      setUseMinimalUI(true);
    }
  }, [chapterId, lessonId]);
  
  // Save progress
  const saveProgress = () => {
    localStorage.setItem(`maya-micro-progress-${chapterId}-${lessonId}`, JSON.stringify({
      completed: Array.from(completedLessons),
      totalTime: totalTimeSpent
    }));
  };
  
  const handleStartLesson = (index: number) => {
    setCurrentLessonIndex(index);
    setShowHub(false);
  };
  
  const handleLessonComplete = (metrics: any) => {
    const lessonId = CHAPTER_2_LESSON_5_MICRO_LESSONS[currentLessonIndex!].id;
    
    // Update completed set
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    setTotalTimeSpent(prev => prev + metrics.timeSpent);
    
    // Save progress
    saveProgress();
    
    // Refresh Maya metrics
    if (user?.id) {
      refreshMayaMetrics();
    }
    
    // Auto-continue to next lesson if available
    if (metrics.autoContinue) {
      const nextIndex = currentLessonIndex! + 1;
      if (nextIndex < CHAPTER_2_LESSON_5_MICRO_LESSONS.length) {
        // Small delay for transition
        setTimeout(() => {
          setCurrentLessonIndex(nextIndex);
        }, 300);
      } else {
        // All lessons complete - return to hub
        setShowHub(true);
        setCurrentLessonIndex(null);
      }
    } else {
      // Manual return to hub
      setShowHub(true);
      setCurrentLessonIndex(null);
    }
  };
  
  const handleBackToHub = () => {
    setShowHub(true);
    setCurrentLessonIndex(null);
  };
  
  const getNextAvailableLesson = () => {
    for (let i = 0; i < CHAPTER_2_LESSON_5_MICRO_LESSONS.length; i++) {
      if (!completedLessons.has(CHAPTER_2_LESSON_5_MICRO_LESSONS[i].id)) {
        return i;
      }
    }
    return null;
  };
  
  const progressPercentage = (completedLessons.size / CHAPTER_2_LESSON_5_MICRO_LESSONS.length) * 100;
  
  if (!showHub && currentLessonIndex !== null) {
    const lesson = CHAPTER_2_LESSON_5_MICRO_LESSONS[currentLessonIndex];
    
    console.log('Rendering lesson. useMinimalUI:', useMinimalUI, 'lesson:', lesson.title);
    
    // Use minimal UI if preference is set
    if (useMinimalUI) {
      console.log('Rendering MayaMicroLessonMinimal component');
      return (
        <div key={`minimal-${lesson.id}`} className="w-full h-full">
          <MayaMicroLessonMinimal
            lessonId={lesson.id}
            title={lesson.title}
            description={lesson.objective}
            scenario={lesson.chatFlow?.[0]?.text || 'Let\'s explore this together.'}
            onComplete={(data) => {
              console.log('Minimal lesson completed:', data);
              handleLessonComplete({ ...data, timeSpent: lesson.estimatedTime });
            }}
            onBack={handleBackToHub}
            userId={user?.id}
          />
        </div>
      );
    }
    
    // Default to glass UI
    console.log('Rendering MayaMicroLesson component (glass UI)');
    return (
      <div key={`glass-${lesson.id}`} className="w-full h-full">
        <MayaMicroLesson
          lessonData={lesson}
          onComplete={handleLessonComplete}
          onBack={handleBackToHub}
          useMinimalUI={useMinimalUI}
        />
      </div>
    );
  }
  
  return (
    <MobileResponsiveWrapper maxWidth="4xl" padding="medium">
      {/* Hero Section */}
      <div className="glass-purple rounded-2xl mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 animate-pulse" />
        <div className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <ResponsiveText size="xl" className="font-bold bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
                    Maya's Email Confidence Journey
                  </ResponsiveText>
                  <p className="text-purple-700 mb-4 font-medium">
                    Transform email anxiety into confidence with 5 micro-lessons
                  </p>
                </div>
                {/* UI Toggle - Enhanced Visibility */}
                <TouchTarget
                  onClick={() => {
                    console.log('Eye icon clicked. Current state:', useMinimalUI, 'Switching to:', !useMinimalUI);
                    setUseMinimalUI(!useMinimalUI);
                    localStorage.setItem('maya-minimal-ui-preference', (!useMinimalUI).toString());
                  }}
                  className="ml-4 relative"
                >
                  <div className={`
                    glass-card rounded-xl p-3 transition-all cursor-pointer
                    shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95
                    border-2 ${useMinimalUI ? 'border-purple-400 bg-purple-100/80' : 'border-purple-200 bg-white/80'}
                    relative z-10
                  `}>
                    <div className="relative">
                      <Eye className={`w-6 h-6 transition-colors ${useMinimalUI ? 'text-purple-700' : 'text-purple-600'}`} />
                      {/* Pulsing indicator */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all ${
                        useMinimalUI ? 'bg-green-500 animate-pulse' : 'bg-purple-500 animate-pulse'
                      }`} />
                    </div>
                    <span className={`text-xs font-semibold mt-1 block transition-colors ${
                      useMinimalUI ? 'text-purple-800' : 'text-purple-700'
                    }`}>
                      {useMinimalUI ? 'Minimal' : 'Glass'}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    Switch to {useMinimalUI ? 'Glass' : 'Minimal'} UI
                  </div>
                </TouchTarget>
              </div>
              
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-800">Overall Progress</span>
                  <span className="font-semibold text-purple-900">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-3 shadow-inner" />
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-purple-700 mt-2">
                  <span>{completedLessons.size} of {CHAPTER_2_LESSON_5_MICRO_LESSONS.length} completed</span>
                  <span>{Math.round(totalTimeSpent / 60)} min total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <ResponsiveGrid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="small" className="mb-6">
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 rounded-xl" />
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">{completedLessons.size}</div>
            <div className="text-xs text-gray-600 relative z-10">Lessons Done</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-xl" />
            <Timer className="w-6 h-6 text-blue-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">{Math.round(totalTimeSpent / 60)}</div>
            <div className="text-xs text-gray-600 relative z-10">Minutes</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-xl" />
            <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">2-3</div>
            <div className="text-xs text-gray-600 relative z-10">Min/Lesson</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-xl" />
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">+{completedLessons.size * 10}</div>
            <div className="text-xs text-gray-600 relative z-10">Confidence</div>
          </div>
        </div>
      </ResponsiveGrid>
      
      {/* Micro-Lessons Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Today's Micro-Lessons</h3>
          <Badge variant="secondary">
            <Calendar className="w-3 h-3 mr-1" />
            ~12 min total
          </Badge>
        </div>
        
        {CHAPTER_2_LESSON_5_MICRO_LESSONS.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id);
          const isLocked = index > 0 && !completedLessons.has(CHAPTER_2_LESSON_5_MICRO_LESSONS[index - 1].id);
          const isNext = index === getNextAvailableLesson();
          
          return (
            <TouchTarget
              key={lesson.id}
              onClick={() => !isLocked && handleStartLesson(index)}
              className={`w-full ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`glass-card rounded-xl transition-all transform ${
                isNext ? 'border-purple-300 shadow-lg scale-[1.02]' : ''
              } ${!isLocked ? 'hover:shadow-lg hover:scale-[1.01]' : ''} ${isCompleted ? 'glass-green' : ''}`}>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      isCompleted ? 'bg-green-100' : 
                      isLocked ? 'bg-gray-100' : 
                      'bg-purple-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : lesson.type === 'chat' ? (
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                      ) : lesson.type === 'interactive' ? (
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Target className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="font-semibold text-sm">
                            Lesson {lesson.lessonNumber}: {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{lesson.objective}</p>
                        </div>
                        {isNext && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            Next
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Timer className="w-3 h-3 mr-1" />
                          {Math.ceil(lesson.estimatedTime / 60)} min
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type === 'chat' ? '💬 Story' : 
                           lesson.type === 'interactive' ? '✨ Interactive' : 
                           '🎯 Practice'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div>
                      {isCompleted ? (
                        <div className="text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : !isLocked ? (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </TouchTarget>
          );
        })}
      </div>
      
      {/* Maya's Impact Summary (if progress > 0) */}
      {completedLessons.size > 0 && mayaMetrics && (
        <div className="mt-6 glass-green rounded-xl shadow-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Your Impact So Far</h3>
            <div className="space-y-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {Math.round(mayaMetrics.emailEfficiencyImprovement)}%
                </div>
                <div className="text-xs text-green-600">Faster Emails</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(mayaMetrics.timeReclaimed / 60)} hrs
                </div>
                <div className="text-xs text-blue-600">Time Saved</div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Continue Button (if there's a next lesson) */}
      {getNextAvailableLesson() !== null && (
        <div className="mt-6">
          <button 
            className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-900 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            onClick={() => handleStartLesson(getNextAvailableLesson()!)}
          >
            <PlayCircle className="w-5 h-5 mr-2 animate-pulse" />
            Continue Journey ({Math.ceil(CHAPTER_2_LESSON_5_MICRO_LESSONS[getNextAvailableLesson()!].estimatedTime / 60)} min)
          </button>
        </div>
      )}
      
      {/* Completion Celebration */}
      {completedLessons.size === CHAPTER_2_LESSON_5_MICRO_LESSONS.length && (
        <div className="mt-6 glass-strong rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/40 to-orange-50/40" />
          <div className="p-6 text-center relative z-10">
            <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              All Micro-Lessons Complete!
            </h3>
            <p className="text-yellow-800 mb-4">
              You've transformed email anxiety into confidence in just {Math.round(totalTimeSpent / 60)} minutes!
            </p>
            <button className="glass-button rounded-xl py-3 px-6 font-semibold bg-gradient-to-r from-yellow-600/30 to-orange-600/30 hover:from-yellow-600/40 hover:to-orange-600/40 text-yellow-900">
              Continue to Next Chapter
            </button>
          </div>
        </div>
      )}
    </MobileResponsiveWrapper>
  );
};

export default MayaMicroLessonHub;