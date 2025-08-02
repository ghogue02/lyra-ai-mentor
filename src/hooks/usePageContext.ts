import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  completed: boolean;
  unlocked: boolean;
  route: string;
}

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
  microLessons?: MicroLesson[];
  currentLessonId?: string;
  progressSummary?: {
    completed: number;
    total: number;
    percentage: number;
  };
  availableActions?: string[];
  contextualHints?: string[];
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
  '2': 'Maya\'s Communication Mastery',
  '3': 'Data and Ethics',
  '4': 'Implementation Strategies', 
  '5': 'Advanced AI Applications'
};

// Chapter 2 micro-lessons data for context awareness
const chapter2MicroLessons = [
  {
    id: 'pace-framework',
    title: 'PACE Framework Foundation',
    description: 'Master the core framework: Purpose → Audience → Context → Execute',
    difficulty: 'Beginner',
    completed: true,
    unlocked: true,
    route: '/chapter/2/interactive/maya-pace'
  },
  {
    id: 'tone-mastery',
    title: 'Tone Mastery Workshop',
    description: 'Adapt your voice for different audiences with confidence and authenticity',
    difficulty: 'Intermediate',
    completed: true,
    unlocked: true,
    route: '/chapter/2/interactive/maya-tone-mastery'
  },
  {
    id: 'template-library',
    title: 'Template Library Builder',
    description: 'Create reusable email templates for organizational efficiency',
    difficulty: 'Intermediate',
    completed: true,
    unlocked: true,
    route: '/chapter/2/interactive/template-library'
  },
  {
    id: 'difficult-conversations',
    title: 'Difficult Conversations Guide',
    description: 'Handle challenging communications with empathy and skill',
    difficulty: 'Advanced',
    completed: true,
    unlocked: true,
    route: '/chapter/2/interactive/difficult-conversations'
  },
  {
    id: 'subject-workshop',
    title: 'Subject Line Workshop',
    description: 'Craft compelling email openings that get opened and read',
    difficulty: 'Intermediate',
    completed: true,
    unlocked: true,
    route: '/chapter/2/interactive/subject-workshop'
  }
];

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
      
      // Enhanced context for Chapter 2
      if (chapterNum === 2) {
        const completedCount = chapter2MicroLessons.filter(lesson => lesson.completed).length;
        const totalCount = chapter2MicroLessons.length;
        const progressPercentage = (completedCount / totalCount) * 100;
        
        return {
          type: 'chapter-hub',
          title: `Chapter ${chapterNum} Hub`,
          description: `Chapter ${chapterNum}: ${chapterTitles[chapterNum.toString()]} - Follow Maya Rodriguez as she transforms from email overwhelm to confident communication mastery`,
          chapterNumber: chapterNum,
          chapterTitle: chapterTitles[chapterNum.toString()],
          phase: 'exploration',
          microLessons: chapter2MicroLessons,
          progressSummary: {
            completed: completedCount,
            total: totalCount,
            percentage: progressPercentage
          },
          availableActions: [
            'Start any micro-lesson',
            'Review completed lessons',
            'Continue with PACE Framework',
            'Explore Tone Mastery Workshop',
            'Build Template Library',
            'Practice Difficult Conversations',
            'Craft Subject Lines'
          ],
          contextualHints: [
            'All 5 micro-lessons follow Maya\'s real experiences at Hope Gardens Community Center',
            'Start with PACE Framework if you\'re new to structured communication',
            'The Difficult Conversations Guide is the most advanced lesson',
            'Template Library Builder helps create reusable organizational assets',
            'Subject Line Workshop focuses on email engagement tactics'
          ]
        };
      }
      
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
      
      // Enhanced context for Chapter 2 interactive lessons
      if (chapterNum === 2) {
        const currentLesson = chapter2MicroLessons.find(lesson => 
          lesson.route === path || lesson.id === journeyKey || 
          lesson.route.includes(journeyKey)
        );
        
        if (currentLesson) {
          return {
            type: 'interactive-journey',
            title: `${currentLesson.title} with Maya`,
            description: `${currentLesson.description} - Interactive learning with Maya Rodriguez`,
            chapterNumber: chapterNum,
            chapterTitle: chapterTitles[chapterNum.toString()],
            journeyName: currentLesson.title,
            character: 'Maya',
            phase: 'learning',
            currentLessonId: currentLesson.id,
            microLessons: chapter2MicroLessons,
            availableActions: [
              'Complete current lesson',
              'Ask Maya for specific guidance',
              'Review lesson objectives',
              'Return to chapter hub',
              'Move to next lesson'
            ],
            contextualHints: [
              `This is a ${currentLesson.difficulty.toLowerCase()}-level lesson`,
              'Maya\'s experiences at Hope Gardens Community Center guide this lesson',
              'Focus on practical application of communication techniques',
              'Real-world scenarios help reinforce learning'
            ]
          };
        }
      }
      
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