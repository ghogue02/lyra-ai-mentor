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
            mode="floating"
            position="bottom-right"
            onEngagementChange={() => {}}
            className="w-full h-full shadow-2xl"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsGlobalChatExpanded(true)}
      className={cn(
        "fixed bottom-4 right-4 z-40",
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
  );
};

function generateContextualContent(context: any): string {
  switch (context.type) {
    case 'dashboard':
      return `User is on their learning dashboard, viewing their progress and available chapters. Help them navigate their learning journey.`;
    
    case 'chapter-hub':
      return `User is exploring Chapter ${context.chapterNumber}: ${context.chapterTitle}. They can see available lessons and interactive journeys.`;
    
    case 'interactive-journey':
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
      return `Welcome to Chapter ${context.chapterNumber}! I can help you understand what you'll learn in "${context.chapterTitle}" or guide you to the perfect lesson for your needs.`;
    
    case 'interactive-journey':
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