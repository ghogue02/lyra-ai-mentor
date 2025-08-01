import type { ChatState, ChatAction, LessonModule } from '../types/chatTypes';

// Initial state factory
export const createInitialState = (params: { 
  lessonModule: LessonModule; 
  initialExpanded?: boolean 
}): ChatState => ({
  isExpanded: params.initialExpanded || false,
  isMinimized: false,
  messages: [],
  isTyping: false,
  error: null,
  currentLesson: params.lessonModule,
  lastActivity: new Date(),
  performance: {
    renderTime: 0,
    messageCount: 0,
    averageResponseTime: 0
  }
});

// Main chat reducer with immutable updates
export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_EXPANDED':
      return {
        ...state,
        isExpanded: action.payload,
        lastActivity: new Date()
      };

    case 'TOGGLE_EXPANDED':
      return {
        ...state,
        isExpanded: !state.isExpanded,
        isMinimized: false, // Reset minimized when toggling
        lastActivity: new Date()
      };

    case 'SET_MINIMIZED':
      return {
        ...state,
        isMinimized: action.payload,
        lastActivity: new Date()
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastActivity: new Date(),
        performance: {
          ...state.performance,
          messageCount: state.performance.messageCount + 1
        }
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        lastActivity: new Date()
      };

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        lastActivity: new Date()
      };

    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
        lastActivity: new Date()
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        lastActivity: new Date()
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        lastActivity: new Date()
      };

    case 'SET_LESSON_MODULE':
      return {
        ...state,
        currentLesson: action.payload,
        // Clear messages when lesson changes
        messages: [],
        lastActivity: new Date()
      };

    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: {
          ...state.performance,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

// Memoized selectors for efficient subscriptions
export const chatSelectors = {
  getUserMessageCount: (state: ChatState) => 
    state.messages.filter(m => m.isUser).length,

  getLastMessage: (state: ChatState) => 
    state.messages[state.messages.length - 1] || null,

  hasMessages: (state: ChatState) => 
    state.messages.length > 0,

  isActive: (state: ChatState) => 
    state.isExpanded && !state.isMinimized,

  getQuickQuestions: (state: ChatState) => {
    const lesson = state.currentLesson;
    if (!lesson) return [];

    // Chapter 1 - AI Foundations questions
    if (lesson.chapterNumber === 1) {
      return [
        {
          id: 'ai-beginner',
          text: "I'm new to AI - where should I start?",
          category: 'Getting Started',
          priority: 'high' as const
        },
        {
          id: 'nonprofit-ai', 
          text: "How can AI help my nonprofit's daily work?",
          category: 'Nonprofit Applications', 
          priority: 'high' as const
        },
        {
          id: 'ai-concepts',
          text: "What are the most important AI concepts?",
          category: 'Foundational Knowledge',
          priority: 'high' as const
        },
        {
          id: 'ai-ethics',
          text: "I'm worried about AI ethics - can you help?",
          category: 'Ethics & Values',
          priority: 'high' as const
        }
      ];
    }

    // Default questions for other chapters
    return [
      {
        id: 'lesson-help',
        text: `Help me understand: ${lesson.title}`,
        category: 'Lesson Support',
        priority: 'high' as const
      },
      {
        id: 'practical-application',
        text: "How can I apply this to my work?",
        category: 'Application',
        priority: 'high' as const
      }
    ];
  }
};

// Action creators for type safety
export const chatActions = {
  setExpanded: (expanded: boolean): ChatAction => ({
    type: 'SET_EXPANDED',
    payload: expanded
  }),

  toggleExpanded: (): ChatAction => ({
    type: 'TOGGLE_EXPANDED'
  }),

  setMinimized: (minimized: boolean): ChatAction => ({
    type: 'SET_MINIMIZED', 
    payload: minimized
  }),

  addMessage: (message: ChatState['messages'][0]): ChatAction => ({
    type: 'ADD_MESSAGE',
    payload: message
  }),

  setTyping: (typing: boolean): ChatAction => ({
    type: 'SET_TYPING',
    payload: typing
  }),

  setError: (error: string): ChatAction => ({
    type: 'SET_ERROR',
    payload: error
  }),

  clearError: (): ChatAction => ({
    type: 'CLEAR_ERROR'
  })
};