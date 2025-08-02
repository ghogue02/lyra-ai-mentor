import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

interface PageContext {
  type: string;
  title: string;
  description: string;
  chapterNumber?: number;
  chapterTitle?: string;
  lessonTitle?: string;
  journeyName?: string;
  character?: string;
  phase?: string;
}

const characterMap: Record<string, string> = {
  'maya-pace': 'Maya',
  'sofia-search': 'Sofia', 
  'david-detective': 'David',
  'rachel-researcher': 'Rachel',
  'alex-analyst': 'Alex'
};

const chapterTitles: Record<string, string> = {
  '1': 'Introduction to AI for Nonprofits',
  '2': 'AI Tools and Applications',
  '3': 'Data and Ethics',
  '4': 'Implementation Strategies', 
  '5': 'Advanced AI Applications'
};

export const usePageContext = (): PageContext => {
  const location = useLocation();
  const params = useParams();
  
  return useMemo(() => {
    const path = location.pathname;
    
    // Dashboard
    if (path === '/' || path === '/dashboard') {
      return {
        type: 'dashboard',
        title: 'Learning Dashboard',
        description: 'your learning dashboard where you can see your progress and choose your next chapter',
        phase: 'navigation'
      };
    }
    
    // Profile
    if (path === '/profile') {
      return {
        type: 'profile', 
        title: 'Profile',
        description: 'your profile settings where you can update your learning preferences',
        phase: 'profile'
      };
    }
    
    // Chapter hub
    if (path.match(/^\/chapter\/\d+$/)) {
      const chapterNum = parseInt(params.chapterId || '1');
      return {
        type: 'chapter-hub',
        title: `Chapter ${chapterNum} Hub`,
        description: `Chapter ${chapterNum}: ${chapterTitles[chapterNum.toString()] || 'AI Learning'}`,
        chapterNumber: chapterNum,
        chapterTitle: chapterTitles[chapterNum.toString()],
        phase: 'exploration'
      };
    }
    
    // Interactive journey
    if (path.match(/^\/chapter\/\d+\/interactive\/.+$/)) {
      const chapterNum = parseInt(params.chapterId || '1');
      const journeyKey = params.journeyId || '';
      const character = characterMap[journeyKey];
      
      return {
        type: 'interactive-journey',
        title: `Interactive Journey with ${character}`,
        description: `an interactive learning journey with ${character} in Chapter ${chapterNum}`,
        chapterNumber: chapterNum,
        chapterTitle: chapterTitles[chapterNum.toString()],
        journeyName: journeyKey.replace('-', ' '),
        character,
        phase: 'learning'
      };
    }
    
    // Lesson
    if (path.match(/^\/chapter\/\d+\/lesson\/.+$/)) {
      const chapterNum = parseInt(params.chapterId || '1');
      const lessonId = params.lessonId || '';
      
      return {
        type: 'lesson',
        title: `Chapter ${chapterNum} Lesson`,
        description: `a specific lesson in Chapter ${chapterNum}`,
        chapterNumber: chapterNum,
        chapterTitle: chapterTitles[chapterNum.toString()],
        lessonTitle: lessonId.replace('-', ' '),
        phase: 'learning'
      };
    }
    
    // Default fallback
    return {
      type: 'general',
      title: 'AI Learning Platform',
      description: 'the AI for Nonprofits learning platform',
      phase: 'general'
    };
  }, [location.pathname, params]);
};