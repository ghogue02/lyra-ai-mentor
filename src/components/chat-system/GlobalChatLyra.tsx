import React, { useEffect, useMemo, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePageContext } from '@/hooks/usePageContext';
import { useGlobalChat } from '@/contexts/GlobalChatContext';
import { useChatLyra } from '@/hooks/useChatLyra';
import ChatLyra from './ChatLyra';
import { cn } from '@/lib/utils';

const GlobalChatLyra: React.FC = () => {
  const pageContext = usePageContext();
  const { isGlobalChatExpanded, setIsGlobalChatExpanded, conversationId } = useGlobalChat();
  const previousConversationId = useRef<string>(conversationId);
  
  // Add debugging for context changes
  useEffect(() => {
    console.log('Context updated:', {
      type: pageContext.type,
      chapterNumber: pageContext.chapterNumber,
      currentLessonId: pageContext.currentLessonId,
      journeyName: pageContext.journeyName,
      character: pageContext.character,
      conversationId
    });
  }, [pageContext, conversationId]);

  // Create dynamic lesson context based on current page - force refresh with conversationId
  const lessonContext = useMemo(() => ({
    chapterTitle: pageContext.chapterTitle || pageContext.title,
    lessonTitle: pageContext.lessonTitle || pageContext.description,
    content: generateContextualContent(pageContext),
    phase: pageContext.phase || 'general',
    chapterNumber: pageContext.chapterNumber,
    currentLessonId: pageContext.currentLessonId
  }), [pageContext, conversationId]); // Add conversationId to force refresh

  // Generate contextual welcome message when chat opens
  const { sendMessage, clearMessages } = useChatLyra({ 
    lessonContext,
    conversationId 
  });

  // Clear messages when conversation ID changes (context change)
  useEffect(() => {
    if (previousConversationId.current !== conversationId) {
      console.log('Conversation ID changed, clearing messages:', {
        previous: previousConversationId.current,
        new: conversationId,
        context: pageContext.type
      });
      clearMessages();
      previousConversationId.current = conversationId;
    }
  }, [conversationId, clearMessages, pageContext.type]);

  // Generate contextual greeting when chat opens - force refresh with conversationId  
  const contextualGreeting = useMemo(() => {
    const greeting = generateContextualGreeting(pageContext);
    console.log('Generated greeting:', greeting, 'for context:', pageContext);
    return greeting;
  }, [pageContext, conversationId]); // Add conversationId to force refresh

  // Generate contextual quick questions based on the current page - force refresh with conversationId
  const contextualQuestions = useMemo(() => {
    if (pageContext.type === 'interactive-journey') {
      const lesson = pageContext.microLessons?.find(l => l.id === pageContext.currentLessonId);
      
      // Chapter 1 specific questions
      if (pageContext.chapterNumber === 1) {
        if (lesson?.id === 'ai-ethics') {
          return [
            "I'm worried about AI ethics - can you help?",
            "What are the most important ethical principles for nonprofits?",
            "How do I prevent bias in AI systems?",
            "What does transparency mean in AI?",
            "How can I ensure AI accountability in my organization?"
          ];
        }
        return [
          "What makes AI so powerful for nonprofits?",
          "How do I start implementing AI ethically?",
          "What are common AI misconceptions?",
          "Can you explain AI foundations simply?"
        ];
      }
      
      // Chapter 2 specific questions
      if (pageContext.chapterNumber === 2) {
        return [
          "How do I write more effective emails like Maya?",
          "What is the PACE framework?",
          "How can I improve my communication tone?",
          "Can you help me with difficult conversations?",
          "What makes a good email subject line?"
        ];
      }
      
      // Chapter 3 specific questions  
      if (pageContext.chapterNumber === 3) {
        if (lesson?.id === 'voice-discovery') {
          return [
            "How do I find my organization's storytelling voice?",
            "What makes a compelling nonprofit story?",
            "How can Sofia help me with voice discovery?",
            "What's the difference between voice and tone?",
            "How do I make my stories more engaging?"
          ];
        }
        return [
          "How do I craft compelling stories like Sofia?",
          "What makes storytelling effective for nonprofits?",
          "Can Sofia help with narrative structure?",
          "How do I connect with my audience emotionally?",
          "What's the secret to impactful storytelling?"
        ];
      }
      
      // Chapter 4 specific questions
      if (pageContext.chapterNumber === 4) {
        // Visual Storytelling specific questions
        if (lesson?.id === 'visual-storytelling') {
          return [
            "How do I create compelling data visualizations?",
            "What makes a data story effective for nonprofits?",
            "Can David help me with chart design principles?",
            "How do I choose the right visualization type?",
            "What tools should I use for data visualization?"
          ];
        }
        return [
          "How do I turn data into stories like David?",
          "What makes data visualization compelling?",
          "Can David help with impact reporting?",
          "How do I present data to different stakeholders?",
          "What tools can help with data storytelling?"
        ];
      }
      
      // Chapter 5 specific questions
      if (pageContext.chapterNumber === 5) {
        return [
          "How do I automate without losing human connection?",
          "What processes should I automate first?",
          "Can Rachel help with change management?",
          "How do I design human-centered workflows?",
          "What's the key to successful automation?"
        ];
      }
    }
    
    // Chapter hub specific questions
    if (pageContext.type === 'chapter-hub') {
      const chapterQuestions = {
        1: [
          "What will I learn in Chapter 1?",
          "Why are AI foundations important?",
          "How does this prepare me for advanced AI?",
          "What's the difference between AI types?"
        ],
        2: [
          "What will I learn about communication with Maya?",
          "How can I improve my email effectiveness?",
          "What makes Maya's approach special?",
          "How do I handle difficult conversations?"
        ],
        3: [
          "What will I learn about storytelling with Sofia?",
          "How can I make my stories more compelling?",
          "What makes Sofia's storytelling approach unique?",
          "How do I find my organization's voice?"
        ],
        4: [
          "What will I learn about data storytelling with David?",
          "How can I make my data more compelling?",
          "What makes David's data approach effective?",
          "How do I create better impact reports?"
        ],
        5: [
          "What will I learn about automation with Rachel?",
          "How can I automate without losing human connection?",
          "What makes Rachel's automation approach special?",
          "How do I lead successful change management?"
        ],
        6: [
          "What will I learn about organizational transformation?",
          "How do I lead AI initiatives in my nonprofit?",
          "What makes organizational change successful?",
          "How do I build buy-in for AI transformation?"
        ]
      };
      
      return chapterQuestions[pageContext.chapterNumber as keyof typeof chapterQuestions] || [
        "What will I learn in this chapter?",
        "How does this chapter help my nonprofit?",
        "What skills will I develop?"
      ];
    }
    
    // Default questions
    return [
      "What makes AI so powerful for nonprofit work?",
      "How can I get started with AI in my organization?",
      "What are the most common AI mistakes nonprofits make?"
    ];
  }, [pageContext, conversationId]); // Add conversationId to force refresh

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
            welcomeMessage={contextualGreeting}
            contextualQuestions={contextualQuestions}
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
      } else if (context.chapterNumber === 4 && context.progressSummary) {
        const { completed, total, percentage } = context.progressSummary;
        if (percentage === 100) {
          return `Outstanding! You've completed all ${total} micro-lessons in David's Data Storytelling Mastery! 📊 You're now equipped to transform any dataset into compelling impact narratives. Ready for the next chapter or want to review any data storytelling concepts?`;
        } else if (completed > 0) {
          return `Welcome back to David's Data Storytelling Mastery! You've completed ${completed} of ${total} lessons (${Math.round(percentage)}% done). Which data storytelling skill would you like to develop next, or need help choosing your path?`;
        } else {
          return `Welcome to David's Data Storytelling Mastery! 📊 You have 6 exciting micro-lessons ahead, following David's transformation at Riverside Children's Foundation. Want to start with Data Foundations or need guidance on which lesson fits your current needs?`;
        }
      } else if (context.chapterNumber === 5 && context.progressSummary) {
        const { completed, total, percentage } = context.progressSummary;
        if (percentage === 100) {
          return `Outstanding! You've completed all ${total} micro-lessons in Rachel's Workflow Automation Mastery! 🚀 You now know how to build human-centered workflows that enhance rather than replace human connection. Ready for the next chapter or want to review any automation concepts?`;
        } else if (completed > 0) {
          return `Welcome back to Rachel's Workflow Automation Mastery! You've completed ${completed} of ${total} lessons (${Math.round(percentage)}% done). Which automation skill would you like to develop next, or need help choosing your path?`;
        } else {
          return `Welcome to Rachel's Workflow Automation Mastery! 🤖 You have exciting micro-lessons ahead, following Rachel's transformation at Green Future Alliance. Want to start with automation vision or need guidance on which lesson fits your current needs?`;
        }
      } else if (context.chapterNumber === 6 && context.progressSummary) {
        const { completed, total, percentage } = context.progressSummary;
        if (percentage === 100) {
          return `Congratulations! You've completed all ${total} micro-lessons in Organizational Transformation! 🎯 You're now equipped to lead AI transformation initiatives. Ready for advanced topics or want to review any leadership concepts?`;
        } else if (completed > 0) {
          return `Welcome back to Organizational Transformation! You've completed ${completed} of ${total} lessons (${Math.round(percentage)}% done). Which leadership skill would you like to develop next?`;
        } else {
          return `Welcome to Organizational Transformation! 🎯 You have powerful lessons ahead on leading AI initiatives in nonprofit organizations. Ready to start your leadership journey?`;
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
      } else if (context.chapterNumber === 4 && context.currentLessonId) {
        const currentLesson = context.microLessons?.find(l => l.id === context.currentLessonId);
        if (currentLesson?.id === 'visual-storytelling') {
          return `Hi! I see you're working on "Visual Storytelling Workshop" with David! 📊

This lesson focuses on creating stunning data visualizations that communicate impact clearly.

What aspect of data visualization would you like to explore together?`;
        } else if (currentLesson?.id === 'stakeholder-communication') {
          return `Hi! I see you're working on "Stakeholder Communication Mastery" with David! 📊


This intermediate-level lesson focuses on tailoring data presentations for different audience types and contexts.


How can I help you with data storytelling concepts?`;
        } else if (currentLesson) {
          return `Hi! I see you're working on "${currentLesson.title}" with David! 📊

This ${currentLesson.difficulty.toLowerCase()}-level lesson focuses on ${currentLesson.description.toLowerCase()}.

How can I help you with data storytelling concepts?`;
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