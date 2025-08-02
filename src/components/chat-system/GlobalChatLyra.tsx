import React, { useEffect, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePageContext } from '@/hooks/usePageContext';
import { useGlobalChat } from '@/contexts/GlobalChatContext';
import { useChatLyra } from '@/hooks/useChatLyra';
import ChatLyra from './ChatLyra';
import { cn } from '@/lib/utils';

const GlobalChatLyra: React.FC = () => {
  const pageContext = usePageContext();
  const { isGlobalChatExpanded, setIsGlobalChatExpanded, conversationId } = useGlobalChat();
  
  // Create dynamic lesson context based on current page
  const lessonContext = useMemo(() => ({
    chapterTitle: pageContext.chapterTitle || pageContext.title,
    lessonTitle: pageContext.lessonTitle || pageContext.description,
    content: generateContextualContent(pageContext),
    phase: pageContext.phase || 'general'
  }), [pageContext]);

  // Generate contextual welcome message when chat opens
  const { sendMessage } = useChatLyra({ 
    lessonContext,
    conversationId 
  });

  // Generate contextual greeting when chat opens (but don't auto-send)
  const contextualGreeting = useMemo(() => 
    generateContextualGreeting(pageContext), [pageContext]);

  if (isGlobalChatExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] max-h-[80vh]">
        <div className="w-full h-full">
          <ChatLyra
            lessonContext={lessonContext}
            mode="embedded"
            position="bottom-right"
            onEngagementChange={() => {}}
            showMinimize={true}
            onMinimize={() => setIsGlobalChatExpanded(false)}
            className="w-full h-full shadow-2xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setIsGlobalChatExpanded(true)}
        className={cn(
        "w-14 h-14 rounded-full",
        "nm-button-primary nm-shadow-glow",
        "flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        "transition-all duration-200",
        "group"
      )}
      title="Chat with Lyra"
    >
      <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      
      {/* Subtle pulsing animation */}
      <div className="absolute inset-0 rounded-full nm-button-primary opacity-50 animate-ping" />
    </button>
    </div>
  );
};

function generateContextualContent(context: any): string {
  switch (context.type) {
    case 'dashboard':
      return `User is on their learning dashboard, viewing their progress and available chapters. Help them navigate their learning journey.`;
    
    case 'chapter-hub':
      if (context.chapterNumber === 1 && context.microLessons) {
        const progress = context.progressSummary;
        const availableLessons = context.microLessons.map(lesson => `${lesson.title} (${lesson.difficulty})`).join(', ');
        
        return `User is on Chapter 1: Introduction to AI for Nonprofits hub. Progress: ${progress.completed} of ${progress.total} micro-lessons completed (${Math.round(progress.percentage)}%).

Available micro-lessons: ${availableLessons}

Context: Beginning the AI journey with Lyra as their guide through foundational AI concepts and ethical considerations for nonprofit organizations.

Learning paths:
- AI Ethics for Nonprofits: Essential foundation for responsible AI implementation
- AI Fundamentals & Terminology: Core concepts every nonprofit leader should know
- AI Applications in Nonprofits: Practical use cases and real-world examples
- Getting Started with AI Tools: Hands-on introduction to immediately useful AI tools
- AI Implementation Roadmap: Advanced strategic planning for organizational AI adoption

User can start with AI Ethics for a strong foundation, explore fundamentals, or get guidance on the best learning path. All lessons focus on nonprofit-specific applications and ethical considerations.`;
      } else if (context.chapterNumber === 2 && context.microLessons) {
        const progress = context.progressSummary;
        const availableLessons = context.microLessons.map(lesson => `${lesson.title} (${lesson.difficulty})`).join(', ');
        
        return `User is on Chapter 2: Maya's Communication Mastery hub. Progress: ${progress.completed} of ${progress.total} micro-lessons completed (${Math.round(progress.percentage)}%).

Available micro-lessons: ${availableLessons}

Context: Maya Rodriguez transforms from email overwhelm to confident communication mastery at Hope Gardens Community Center. Each lesson builds on her real experiences.

Learning paths:
- PACE Framework: Beginner-level foundation (Purpose → Audience → Context → Execute)
- Tone Mastery & Template Library: Intermediate workshops for voice adaptation and efficiency
- Difficult Conversations Guide: Advanced lesson for challenging communications
- Subject Line Workshop: Practical email engagement tactics

User can start any lesson, review completed ones, or get guidance on the best path forward. All lessons feature Maya's real nonprofit scenarios and practical applications.`;
      }
      return `User is exploring Chapter ${context.chapterNumber}: ${context.chapterTitle}. They can see available lessons and interactive journeys.`;
    
    case 'interactive-journey':
      if (context.chapterNumber === 1 && context.currentLessonId && context.microLessons) {
        const currentLesson = context.microLessons.find(l => l.id === context.currentLessonId);
        if (currentLesson) {
          return `User is in "${currentLesson.title}" with Lyra.

Lesson details:
- Focus: ${currentLesson.description}
- Difficulty: ${currentLesson.difficulty}
- Status: ${currentLesson.completed ? 'Completed' : 'In Progress'}
- Current phase: ${context.phase}

${currentLesson.id === 'ai-ethics' ? 
  'Learning context: Exploring fundamental ethical principles for AI in nonprofit organizations. This lesson covers responsible AI implementation, bias prevention, transparency, and accountability in nonprofit contexts.' :
  'Learning context: Building foundational AI knowledge specifically tailored for nonprofit organizations and their unique challenges and opportunities.'
}

Available guidance: Lesson-specific help, ethical considerations, practical examples for nonprofits, next steps, or navigation back to chapter hub. Focus on responsible AI implementation and nonprofit-specific applications.`;
        }
      } else if (context.chapterNumber === 2 && context.currentLessonId && context.microLessons) {
        const currentLesson = context.microLessons.find(l => l.id === context.currentLessonId);
        if (currentLesson) {
          return `User is in "${currentLesson.title}" with Maya Rodriguez.

Lesson details:
- Focus: ${currentLesson.description}
- Difficulty: ${currentLesson.difficulty}
- Status: ${currentLesson.completed ? 'Completed' : 'In Progress'}

Learning context: Maya's real experiences at Hope Gardens Community Center. This ${currentLesson.difficulty.toLowerCase()}-level lesson emphasizes practical communication techniques through authentic nonprofit scenarios.

Available guidance: Lesson-specific help, Maya's insights, practical examples, next steps, or navigation back to chapter hub. Focus on real-world application and Maya's transformation journey.`;
        }
      }
      return `User is in an interactive learning journey with ${context.character || 'Lyra'} in Chapter ${context.chapterNumber}. Current phase: ${context.phase}. The journey focuses on ${context.journeyName || 'AI foundations and capabilities'}.`;
    
    case 'lesson':
      return `User is studying a specific lesson: ${context.lessonTitle} in Chapter ${context.chapterNumber}.`;
    
    case 'profile':
      return `User is updating their profile and learning preferences.`;
    
    default:
      return `User is exploring the AI for Nonprofits learning platform.`;
  }
}

function generateContextualGreeting(context: any): string {
  switch (context.type) {
    case 'dashboard':
      return "Hi! I can see you're on your learning dashboard. Ready to dive into your next chapter or need help navigating your progress?";
    
    case 'chapter-hub':
      if (context.chapterNumber === 1 && context.progressSummary) {
        const { completed, total, percentage } = context.progressSummary;
        if (percentage === 100) {
          return `Excellent! You've completed all ${total} micro-lessons in Chapter 1! 🎉 You now have a solid foundation in AI concepts. Ready to move to the next chapter or review anything?`;
        } else if (completed > 0) {
          return `Welcome back to your AI journey! You've completed ${completed} of ${total} lessons (${Math.round(percentage)}% done). Which AI concept would you like to explore next, or need guidance on your learning path?`;
        } else {
          return `Welcome to Chapter 1: Introduction to AI for Nonprofits! 🤖 I'm Lyra, your AI guide. You have 5 foundational lessons ahead. Want to start with AI Ethics to build a strong foundation, or need help choosing the right starting point?`;
        }
      } else if (context.chapterNumber === 2 && context.progressSummary) {
        const { completed, total, percentage } = context.progressSummary;
        if (percentage === 100) {
          return `Congratulations! You've completed all ${total} micro-lessons in Maya's Communication Mastery! 🎉 Ready to move to the next chapter or want to review any concepts?`;
        } else if (completed > 0) {
          return `Welcome back to Maya's Communication Mastery! You've completed ${completed} of ${total} lessons (${Math.round(percentage)}% done). Which lesson would you like to tackle next, or need help choosing?`;
        } else {
          return `Welcome to Maya's Communication Mastery! 📧 You have 5 exciting micro-lessons ahead, following Maya's transformation at Hope Gardens Community Center. Want to start with the PACE Framework or need guidance on which lesson fits your needs?`;
        }
      }
      return `Welcome to Chapter ${context.chapterNumber}! I can help you understand what you'll learn in "${context.chapterTitle}" or guide you to the perfect lesson for your needs.`;
    
    case 'interactive-journey':
      if (context.chapterNumber === 1 && context.currentLessonId) {
        const currentLesson = context.microLessons?.find(l => l.id === context.currentLessonId);
        if (currentLesson?.id === 'ai-ethics') {
          return `Hi! I see you're exploring "AI Ethics for Nonprofits" with me! 🤖 This is such an important foundation for responsible AI use. The ethical principles we're covering will guide all your future AI decisions. What aspect of AI ethics would you like to dive deeper into?`;
        } else if (currentLesson) {
          return `Hi! I see you're working on "${currentLesson.title}" with me! 🤖 This ${currentLesson.difficulty.toLowerCase()}-level lesson focuses on ${currentLesson.description.toLowerCase()}. How can I help you understand these AI concepts better?`;
        }
      } else if (context.chapterNumber === 2 && context.currentLessonId) {
        const currentLesson = context.microLessons?.find(l => l.id === context.currentLessonId);
        if (currentLesson) {
          return `Hi! I see you're working on "${currentLesson.title}" with Maya! 📧 This ${currentLesson.difficulty.toLowerCase()}-level lesson focuses on ${currentLesson.description.toLowerCase()}. Need help with any specific aspect or want Maya's insights?`;
        }
      }
      return `I see you're working through the interactive journey${context.character ? ` with ${context.character}` : ''}! How can I support your learning about ${context.journeyName || 'AI capabilities'}?`;
    
    case 'lesson':
      return `You're studying "${context.lessonTitle}" - great choice! Need help understanding any concepts or want to explore this topic deeper?`;
    
    case 'profile':
      return "I notice you're updating your profile. Want tips on optimizing your learning experience based on your preferences?";
    
    default:
      return "Hi there! I'm Lyra, your AI learning companion. How can I help you with your nonprofit AI journey today?";
  }
}

export default GlobalChatLyra;