import { lazy } from 'react';

// Lazy load page components
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyAuth = lazy(() => import('@/pages/Auth'));
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyNotFound = lazy(() => import('@/pages/NotFound'));
export const LazyContentLab = lazy(() => import('@/pages/ContentLab'));
export const LazyLesson = lazy(() => import('@/pages/Lesson'));
export const LazyInteractiveJourney = lazy(() => import('@/pages/InteractiveJourney'));

// Lazy load chapter hub components
export const LazyChapter1Hub = lazy(() => import('@/pages/Chapter1Hub'));
export const LazyChapter2Hub = lazy(() => import('@/pages/Chapter2Hub'));
export const LazyChapter3Hub = lazy(() => import('@/pages/Chapter3Hub'));
export const LazyChapter4Hub = lazy(() => import('@/pages/Chapter4Hub'));
export const LazyChapter5Hub = lazy(() => import('@/pages/Chapter5Hub'));
export const LazyChapter6Hub = lazy(() => import('@/pages/Chapter6Hub'));
export const LazyChapter7Hub = lazy(() => import('@/pages/Chapter7Hub'));
export const LazyTestLyra = lazy(() => import('@/pages/TestLyra'));
export const LazyTestMaya = lazy(() => import('@/pages/TestMaya'));

// Lazy load chapter page components
export const LazyChapterOverviewPage = lazy(() => import('@/components/chapter/ChapterPages').then(m => ({ default: m.ChapterOverviewPage })));
export const LazyChapterLessonPage = lazy(() => import('@/components/chapter/ChapterPages').then(m => ({ default: m.ChapterLessonPage })));