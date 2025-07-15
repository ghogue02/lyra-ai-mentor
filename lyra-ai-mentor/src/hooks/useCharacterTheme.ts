import { useEffect } from 'react';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';

export const useCharacterTheme = (characterId: string | undefined) => {
  useEffect(() => {
    if (!characterId) return;
    
    // Remove any existing character theme classes
    const themeClasses = ['maya-theme', 'sofia-theme', 'david-theme', 'rachel-theme', 'alex-theme'];
    themeClasses.forEach(cls => document.body.classList.remove(cls));
    
    // Add the new character theme class
    const themeClass = `${characterId.toLowerCase()}-theme`;
    if (themeClasses.includes(themeClass)) {
      document.body.classList.add(themeClass);
    }
    
    // Cleanup on unmount
    return () => {
      themeClasses.forEach(cls => document.body.classList.remove(cls));
    };
  }, [characterId]);
};

export const getCharacterColors = (characterId: string) => {
  const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
    maya: {
      primary: '#9333EA',
      secondary: '#06B6D4',
      accent: '#F3E8FF'
    },
    sofia: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#EDE9FE'
    },
    david: {
      primary: '#10B981',
      secondary: '#3B82F6',
      accent: '#D1FAE5'
    },
    rachel: {
      primary: '#14B8A6',
      secondary: '#6366F1',
      accent: '#CCFBF1'
    },
    alex: {
      primary: '#8B5CF6',
      secondary: '#F59E0B',
      accent: '#EDE9FE'
    }
  };
  
  return colors[characterId.toLowerCase()] || colors.maya;
};