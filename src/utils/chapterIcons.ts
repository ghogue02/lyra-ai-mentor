
import { getChapterIconUrl } from './supabaseIcons';

// Legacy mapping - now uses Supabase Storage URLs
export const chapterIconMap: Record<number, string> = {};

// Populate the mapping with Supabase Storage URLs
for (let i = 1; i <= 10; i++) {
  chapterIconMap[i] = getChapterIconUrl(i);
}

export const getChapterIcon = (chapterId: number): string => {
  return getChapterIconUrl(chapterId);
};
