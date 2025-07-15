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
  Wand2,
  Rocket,
  Star
} from 'lucide-react';
import { MobileResponsiveWrapper, ResponsiveGrid, TouchTarget, ResponsiveText } from '@/components/ui/mobile-responsive-wrapper';
import { MayaMicroLessonEnhanced, MicroLessonData, ChatMessage } from './MayaMicroLessonEnhanced';
import { MayaEmailRecipeBuilderEnhanced } from './MayaEmailRecipeBuilderEnhanced';
import { MayaInteractiveEmailPracticeEnhanced } from './MayaInteractiveEmailPracticeEnhanced';
import { useAuth } from '@/contexts/AuthContext';
import { useAdaptiveAI } from '@/hooks/useAdaptiveAI';
import { toast } from 'sonner';
import '@/styles/glassmorphism.css';

// Enhanced micro-lessons with AI showcase
const ENHANCED_MICRO_LESSONS: MicroLessonData[] = [
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
        sender: 'maya',
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
        text: 'Excellent thinking! Maya discovered something that transformed her email writing completely. Want to see the magic?',
        emotion: 'hopeful',
        delay: 1500
      },
      {
        id: 'ai-teaser',
        sender: 'maya',
        text: 'Watch this! Maya can now write a perfect email in just 5 seconds using AI. Let me show you...',
        emotion: 'excited',
        showAIButton: true,
        aiPrompt: 'Write a warm email to a concerned parent about their child\'s progress in our after-school program'
      },
      {
        id: 'discovery-1',
        sender: 'maya',
        text: 'Amazing, right? But here\'s the secret - it\'s not just about using AI, it\'s about knowing HOW to use it. Ready to learn?',
        emotion: 'excited',
        choices: [
          'Yes, teach me!',
          'Show me more first'
        ]
      }
    ],
    successMetric: 'Understood Maya\'s challenge and saw AI demo'
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
        text: '🎯 First Ingredient: PURPOSE - What does your email need to achieve? Inform, request, thank, or invite?',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-3',
        sender: 'maya',
        text: '👥 Second Ingredient: AUDIENCE - Who will read this? Each person needs a different approach.',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-4',
        sender: 'maya',
        text: '❤️ Third Ingredient: TONE - How should it feel? The emotional flavor makes all the difference.',
        emotion: 'confident',
        delay: 2000
      },
      {
        id: 'recipe-magic',
        sender: 'maya',
        text: 'Watch how these 3 ingredients create instant AI magic! This parent email took 32 minutes before...',
        emotion: 'confident',
        showAIButton: true,
        aiPrompt: 'Purpose: Update parent. Audience: Busy working mom. Tone: Warm and reassuring. Write email about child doing well.'
      },
      {
        id: 'recipe-5',
        sender: 'maya',
        text: '5 seconds! That\'s the power of the recipe method. Which ingredient resonates with you most?',
        emotion: 'excited',
        choices: [
          'Purpose - clarity is everything',
          'Audience - know who you\'re writing to',
          'Tone - emotions matter'
        ]
      },
      {
        id: 'recipe-6',
        sender: 'maya',
        text: 'Perfect! Now let\'s practice building a real recipe together...',
        emotion: 'excited'
      }
    ],
    successMetric: 'Learned the email recipe and saw AI transformation'
  },
  {
    id: 'ml-2-5-3',
    lessonNumber: 3,
    title: 'Build Your Recipe',
    estimatedTime: 180, // 3 minutes
    objective: 'Create an email recipe with visual feedback and AI demo',
    type: 'interactive',
    interactiveContent: MayaEmailRecipeBuilderEnhanced,
    successMetric: 'Built complete email recipe with AI generation'
  },
  {
    id: 'ml-2-5-4',
    lessonNumber: 4,
    title: 'Master AI Prompts',
    estimatedTime: 180, // 3 minutes
    objective: 'Learn HOW to use AI effectively for emails',
    type: 'interactive',
    interactiveContent: MayaInteractiveEmailPracticeEnhanced,
    successMetric: 'Learned AI prompt techniques and generated email'
  },
  {
    id: 'ml-2-5-5',
    lessonNumber: 5,
    title: 'Your Transformation',
    estimatedTime: 120, // 2 minutes
    objective: 'Celebrate your new AI email mastery',
    type: 'chat',
    chatFlow: [
      {
        id: 'transform-1',
        sender: 'maya',
        text: 'You did it! You\'ve learned my complete system. Let\'s see your transformation...',
        emotion: 'excited',
        animation: 'bounce'
      },
      {
        id: 'transform-2',
        sender: 'maya',
        text: 'Before: 32 minutes of anxiety, rewriting, second-guessing. After: 5 seconds of confidence with AI!',
        emotion: 'excited',
        delay: 2000
      },
      {
        id: 'transform-3',
        sender: 'maya',
        text: 'That\'s 31 minutes and 55 seconds saved on EVERY email. With 15 emails weekly, you\'ve reclaimed 8 hours!',
        emotion: 'excited',
        delay: 2000
      },
      {
        id: 'final-demo',
        sender: 'maya',
        text: 'One last magic trick! Watch me handle this morning\'s toughest email challenge...',
        emotion: 'confident',
        showAIButton: true,
        aiPrompt: 'Urgent but caring email to donor who missed our fundraiser, thanking them for past support and sharing how they can still help'
      },
      {
        id: 'transform-4',
        sender: 'maya',
        text: 'See? Complex situations become simple with your new skills. How do you feel about email writing now?',
        emotion: 'excited',
        choices: [
          'Confident and ready!',
          'Excited to save time!',
          'Transformed completely!'
        ]
      },
      {
        id: 'celebrate-1',
        sender: 'system',
        text: '🎉 Achievement Unlocked: AI Email Master!',
        delay: 1000
      },
      {
        id: 'next-1',
        sender: 'maya',
        text: 'You\'re now part of the Email Transformation Club! Ready to tackle any email in seconds. What will you do with your 8 hours?',
        emotion: 'excited'
      }
    ],
    successMetric: 'Completed transformation and mastered AI email system'
  }
];

interface MayaMicroLessonHubEnhancedProps {
  chapterId: number;
  lessonId: number;
}

export const MayaMicroLessonHubEnhanced: React.FC<MayaMicroLessonHubEnhancedProps> = ({ 
  chapterId, 
  lessonId 
}) => {
  const { user } = useAuth();
  const { mayaMetrics, refreshMayaMetrics } = useAdaptiveAI();
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [showHub, setShowHub] = useState(true);
  const [totalAIGenerations, setTotalAIGenerations] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`maya-micro-progress-enhanced-${chapterId}-${lessonId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedLessons(new Set(progress.completed));
      setTotalTimeSpent(progress.totalTime || 0);
      setTotalAIGenerations(progress.aiGenerations || 0);
    }
  }, [chapterId, lessonId]);
  
  // Save progress
  const saveProgress = () => {
    localStorage.setItem(`maya-micro-progress-enhanced-${chapterId}-${lessonId}`, JSON.stringify({
      completed: Array.from(completedLessons),
      totalTime: totalTimeSpent,
      aiGenerations: totalAIGenerations,
      lastUpdated: new Date().toISOString()
    }));
  };
  
  const handleStartLesson = (index: number) => {
    setCurrentLessonIndex(index);
    setShowHub(false);
  };
  
  const handleLessonComplete = (metrics: any) => {
    const lessonId = ENHANCED_MICRO_LESSONS[currentLessonIndex!].id;
    
    // Update completed set
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    setTotalTimeSpent(prev => prev + metrics.timeSpent);
    
    // Track AI usage
    if (metrics.aiGenerated) {
      setTotalAIGenerations(prev => prev + 1);
    }
    
    // Save progress
    saveProgress();
    
    // Refresh Maya metrics
    if (user?.id) {
      refreshMayaMetrics();
    }
    
    // Auto-continue to next lesson if available
    if (metrics.autoContinue) {
      const nextIndex = currentLessonIndex! + 1;
      if (nextIndex < ENHANCED_MICRO_LESSONS.length) {
        // Small delay for transition
        setTimeout(() => {
          setCurrentLessonIndex(nextIndex);
        }, 300);
      } else {
        // All lessons complete - show celebration then return to hub
        setShowCelebration(true);
        toast.success('🎉 All micro-lessons complete!', {
          description: 'You\'ve mastered AI email writing!',
          duration: 5000
        });
        
        setTimeout(() => {
          setShowCelebration(false);
          setShowHub(true);
          setCurrentLessonIndex(null);
        }, 5000);
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
    for (let i = 0; i < ENHANCED_MICRO_LESSONS.length; i++) {
      if (!completedLessons.has(ENHANCED_MICRO_LESSONS[i].id)) {
        return i;
      }
    }
    return null;
  };
  
  const progressPercentage = (completedLessons.size / ENHANCED_MICRO_LESSONS.length) * 100;
  const timeSavedPerEmail = 31.9; // minutes
  const emailsPerWeek = 15;
  const potentialWeeklyTimeSaved = completedLessons.size > 0 ? (timeSavedPerEmail * emailsPerWeek * (completedLessons.size / ENHANCED_MICRO_LESSONS.length)) : 0;
  
  if (!showHub && currentLessonIndex !== null) {
    return (
      <MayaMicroLessonEnhanced
        lessonData={ENHANCED_MICRO_LESSONS[currentLessonIndex]}
        onComplete={handleLessonComplete}
        onBack={handleBackToHub}
      />
    );
  }
  
  return (
    <MobileResponsiveWrapper maxWidth="4xl" padding="medium">
      {/* Hero Section with AI Focus */}
      <div className="glass-purple rounded-2xl mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20 animate-pulse" />
        <div className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <ResponsiveText size="xl" className="font-bold bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
                Maya's AI Email Mastery Journey
              </ResponsiveText>
              <p className="text-purple-700 mb-4 font-medium">
                Transform 32-minute emails into 5-second AI magic ✨
              </p>
              
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-800">Transformation Progress</span>
                  <span className="font-semibold text-purple-900">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-3 shadow-inner" />
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-purple-700 mt-2">
                  <span>{completedLessons.size} of {ENHANCED_MICRO_LESSONS.length} completed</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {totalAIGenerations} AI emails generated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Impact Stats - Show potential time savings */}
      <ResponsiveGrid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="small" className="mb-6">
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 rounded-xl" />
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">{completedLessons.size}</div>
            <div className="text-xs text-gray-600 relative z-10">Skills Learned</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 rounded-xl" />
            <Wand2 className="w-6 h-6 text-purple-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">{totalAIGenerations}</div>
            <div className="text-xs text-gray-600 relative z-10">AI Emails</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-xl" />
            <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">5</div>
            <div className="text-xs text-gray-600 relative z-10">Seconds/Email</div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
          <div className="p-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-xl" />
            <Rocket className="w-6 h-6 text-green-500 mx-auto mb-2 relative z-10" />
            <div className="text-2xl font-bold relative z-10">{Math.round(potentialWeeklyTimeSaved)}</div>
            <div className="text-xs text-gray-600 relative z-10">Min/Week Saved</div>
          </div>
        </div>
      </ResponsiveGrid>
      
      {/* Micro-Lessons Grid with Enhanced UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Your AI Transformation Path</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Calendar className="w-3 h-3 mr-1" />
            ~12 min total
          </Badge>
        </div>
        
        {ENHANCED_MICRO_LESSONS.map((lesson, index) => {
          const isCompleted = completedLessons.has(lesson.id);
          const isLocked = index > 0 && !completedLessons.has(ENHANCED_MICRO_LESSONS[index - 1].id);
          const isNext = index === getNextAvailableLesson();
          
          return (
            <TouchTarget
              key={lesson.id}
              onClick={() => !isLocked && handleStartLesson(index)}
              className={`w-full ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`glass-card rounded-xl transition-all transform ${
                isNext ? 'border-purple-300 shadow-lg scale-[1.02] ring-2 ring-purple-400/30' : ''
              } ${!isLocked ? 'hover:shadow-lg hover:scale-[1.01]' : ''} ${isCompleted ? 'glass-green' : ''}`}>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
                      isLocked ? 'bg-gray-100' : 
                      isNext ? 'bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse' :
                      'bg-purple-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : lesson.type === 'chat' ? (
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                      ) : lesson.type === 'interactive' ? (
                        <Wand2 className="w-6 h-6 text-purple-600" />
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
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700 text-xs animate-pulse">
                              Next Up!
                            </Badge>
                            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Timer className="w-3 h-3 mr-1" />
                          {Math.ceil(lesson.estimatedTime / 60)} min
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lesson.type === 'chat' ? '💬 Story' : 
                           lesson.type === 'interactive' ? '✨ AI Practice' : 
                           '🎯 Learn & Do'}
                        </Badge>
                        {(lesson.lessonNumber === 1 || lesson.lessonNumber === 2 || lesson.lessonNumber === 5) && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            <Wand2 className="w-3 h-3 mr-1" />
                            AI Demo
                          </Badge>
                        )}
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
      
      {/* AI Impact Summary (if progress > 0) */}
      {completedLessons.size > 0 && (
        <div className="mt-6 glass-green rounded-xl shadow-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Your AI Transformation Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {timeSavedPerEmail * completedLessons.size}
                </div>
                <div className="text-xs text-purple-600">Minutes Saved Per Email</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {Math.round(potentialWeeklyTimeSaved / 60)}
                </div>
                <div className="text-xs text-green-600">Hours Reclaimed Weekly</div>
              </div>
            </div>
            
            {completedLessons.size === ENHANCED_MICRO_LESSONS.length && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
                <p className="text-sm font-semibold text-purple-900">
                  🎉 Full transformation achieved! You're saving 8+ hours every week!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Continue Button with AI emphasis */}
      {getNextAvailableLesson() !== null && (
        <div className="mt-6">
          <button 
            className="w-full glass-button rounded-xl py-4 px-6 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all relative overflow-hidden"
            onClick={() => handleStartLesson(getNextAvailableLesson()!)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
            <div className="relative flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5 animate-pulse" />
              Continue AI Journey ({Math.ceil(ENHANCED_MICRO_LESSONS[getNextAvailableLesson()!].estimatedTime / 60)} min)
              <Sparkles className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
      
      {/* Completion Celebration with AI focus */}
      {completedLessons.size === ENHANCED_MICRO_LESSONS.length && !showCelebration && (
        <div className="mt-6 glass-strong rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/40 to-orange-50/40" />
          <div className="p-6 text-center relative z-10">
            <div className="flex justify-center gap-2 mb-3">
              <Star className="w-8 h-8 text-yellow-600 animate-pulse" />
              <Trophy className="w-12 h-12 text-yellow-600" />
              <Star className="w-8 h-8 text-yellow-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-yellow-900 mb-2">
              AI Email Master Achievement Unlocked!
            </h3>
            <p className="text-yellow-800 mb-4">
              You've mastered the 32min → 5sec transformation in just {Math.round(totalTimeSpent / 60)} minutes!
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge className="bg-purple-100 text-purple-700">
                <Wand2 className="w-3 h-3 mr-1" />
                {totalAIGenerations} AI Emails Created
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                <Zap className="w-3 h-3 mr-1" />
                8 Hours/Week Saved
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-strong rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-pink-100/20" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                Transformation Complete!
              </h2>
              <p className="text-gray-700 mb-6">
                You've mastered AI email writing and reclaimed your time!
              </p>
              <div className="space-y-2 text-left bg-white/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time per email:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 line-through">32 min</Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge variant="outline" className="bg-green-50 text-green-700">5 sec</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weekly time saved:</span>
                  <Badge className="bg-purple-100 text-purple-700">8+ hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence level:</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => {
                  setShowCelebration(false);
                  setShowHub(true);
                  setCurrentLessonIndex(null);
                }}
              >
                View My Journey
              </Button>
            </div>
          </div>
        </div>
      )}
    </MobileResponsiveWrapper>
  );
};

export default MayaMicroLessonHubEnhanced;