/**
 * Central lesson-related type definitions
 * This file serves as the single source of truth for all lesson interfaces
 */

// Core lesson context interface
export interface LessonContext {
  chapterNumber: number;
  chapterTitle?: string;
  lessonTitle?: string;
  title: string;
  content: string;
  phase?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Lesson module interface that extends LessonContext
export interface LessonModule {
  chapterNumber: number;
  chapterTitle?: string;
  title: string;
  content: string;
  phase?: string;
  objectives?: string[];
  keyTerms?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Chapter interface matching database schema
export interface Chapter {
  id: number;
  title: string;
  description: string;
  duration?: string; // Optional to match database schema
  icon?: string;
  order_index: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

// Legacy exports for backward compatibility
export type LessonContextData = LessonContext;
export type ChapterData = Chapter;