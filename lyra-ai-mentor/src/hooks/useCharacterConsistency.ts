import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CharacterType } from '@/config/aiConfig';
import { toast } from 'sonner';

// Character route mapping
const characterRoutes: Record<CharacterType, string[]> = {
  maya: ['/chapter2', '/chapter2/maya', '/maya-'],
  sofia: ['/chapter3', '/sofia-'],
  david: ['/chapter4', '/david-'],
  rachel: ['/chapter5', '/rachel-'],
  alex: ['/chapter6', '/alex-'],
  lyra: ['/'] // Lyra is present everywhere as the guide
};

// Character consistency validation
export function useCharacterConsistency(currentCharacter?: CharacterType) {
  const navigate = useNavigate();
  const location = useLocation();
  const previousCharacter = useRef<CharacterType | undefined>(currentCharacter);

  // Validate character matches route
  const validateCharacterRoute = useCallback(() => {
    if (!currentCharacter) return true;

    const validRoutes = characterRoutes[currentCharacter];
    const currentPath = location.pathname.toLowerCase();
    
    const isValidRoute = validRoutes.some(route => 
      currentPath.includes(route)
    );

    if (!isValidRoute && currentCharacter !== 'lyra') {
      console.warn(`Character ${currentCharacter} accessed from invalid route: ${currentPath}`);
      return false;
    }

    return true;
  }, [currentCharacter, location.pathname]);

  // Handle character transitions
  const handleCharacterTransition = useCallback((
    fromCharacter: CharacterType | undefined,
    toCharacter: CharacterType | undefined
  ) => {
    if (!fromCharacter || !toCharacter || fromCharacter === toCharacter) return;

    // Smooth transition messaging
    const transitionMessages = {
      'maya-sofia': "Moving from email mastery to voice storytelling!",
      'sofia-david': "Transitioning from voice to data insights!",
      'david-rachel': "Shifting from data analysis to automation!",
      'rachel-alex': "Progressing from automation to change management!",
      'default': `Continuing your journey with ${toCharacter}!`
    };

    const key = `${fromCharacter}-${toCharacter}` as keyof typeof transitionMessages;
    const message = transitionMessages[key] || transitionMessages.default;
    
    toast.info(message, {
      duration: 3000,
      icon: '🚀'
    });
  }, []);

  // Character-specific navigation
  const navigateToCharacter = useCallback((character: CharacterType) => {
    const routes: Record<CharacterType, string> = {
      maya: '/chapter2/maya',
      sofia: '/chapter3',
      david: '/chapter4',
      rachel: '/chapter5',
      alex: '/chapter6',
      lyra: '/'
    };

    const targetRoute = routes[character];
    if (targetRoute) {
      // Handle transition
      handleCharacterTransition(currentCharacter, character);
      navigate(targetRoute);
    }
  }, [currentCharacter, navigate, handleCharacterTransition]);

  // Validate on mount and route changes
  useEffect(() => {
    const isValid = validateCharacterRoute();
    
    if (!isValid) {
      // Redirect to appropriate character route
      const suggestedCharacter = Object.entries(characterRoutes).find(
        ([_, routes]) => routes.some(route => 
          location.pathname.toLowerCase().includes(route)
        )
      )?.[0] as CharacterType;

      if (suggestedCharacter && suggestedCharacter !== currentCharacter) {
        console.log(`Suggesting character switch to: ${suggestedCharacter}`);
      }
    }
  }, [validateCharacterRoute, location.pathname, currentCharacter]);

  // Track character changes
  useEffect(() => {
    if (previousCharacter.current !== currentCharacter) {
      handleCharacterTransition(previousCharacter.current, currentCharacter);
      previousCharacter.current = currentCharacter;
    }
  }, [currentCharacter, handleCharacterTransition]);

  return {
    validateCharacterRoute,
    navigateToCharacter,
    isValidRoute: validateCharacterRoute()
  };
}

// Hook for character progress tracking
export function useCharacterProgress(character: CharacterType) {
  const progressKey = `character-progress-${character}`;
  
  const getProgress = useCallback(() => {
    const stored = localStorage.getItem(progressKey);
    return stored ? JSON.parse(stored) : {
      started: false,
      completed: false,
      milestones: [],
      lastAccessed: null
    };
  }, [progressKey]);

  const updateProgress = useCallback((updates: Partial<{
    started: boolean;
    completed: boolean;
    milestones: string[];
    lastAccessed: string;
  }>) => {
    const current = getProgress();
    const updated = {
      ...current,
      ...updates,
      lastAccessed: new Date().toISOString()
    };
    localStorage.setItem(progressKey, JSON.stringify(updated));
  }, [progressKey, getProgress]);

  const addMilestone = useCallback((milestone: string) => {
    const current = getProgress();
    if (!current.milestones.includes(milestone)) {
      updateProgress({
        milestones: [...current.milestones, milestone]
      });
    }
  }, [getProgress, updateProgress]);

  return {
    progress: getProgress(),
    updateProgress,
    addMilestone
  };
}

// Hook for cross-character state consistency
export function useCrossCharacterState() {
  const STORAGE_KEY = 'lyra-cross-character-state';
  
  const getState = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      unlockedCharacters: ['maya'], // Maya is unlocked by default
      completedChapters: [],
      globalProgress: 0,
      preferences: {}
    };
  }, []);

  const updateState = useCallback((updates: any) => {
    const current = getState();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [getState]);

  const unlockCharacter = useCallback((character: CharacterType) => {
    const current = getState();
    if (!current.unlockedCharacters.includes(character)) {
      updateState({
        unlockedCharacters: [...current.unlockedCharacters, character]
      });
      toast.success(`${character} is now available!`, {
        icon: '🎉',
        duration: 4000
      });
    }
  }, [getState, updateState]);

  const completeChapter = useCallback((chapter: number) => {
    const current = getState();
    if (!current.completedChapters.includes(chapter)) {
      const updated = {
        completedChapters: [...current.completedChapters, chapter],
        globalProgress: ((current.completedChapters.length + 1) / 6) * 100
      };
      updateState(updated);
      
      // Unlock next character
      const characterUnlockMap: Record<number, CharacterType> = {
        2: 'sofia',
        3: 'david',
        4: 'rachel',
        5: 'alex'
      };
      
      const nextCharacter = characterUnlockMap[chapter];
      if (nextCharacter) {
        unlockCharacter(nextCharacter);
      }
    }
  }, [getState, updateState, unlockCharacter]);

  return {
    state: getState(),
    updateState,
    unlockCharacter,
    completeChapter
  };
}