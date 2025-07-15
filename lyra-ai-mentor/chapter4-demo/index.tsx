// Chapter 4: Leading Through Communication with David Chen
// Main Chapter Implementation

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Chapter4Navigation from './components/navigation/Chapter4Navigation';
import Lesson1Foundation from './components/lessons/Lesson1Foundation';
import { davidChen } from './data/characters/david-chen';
import { chapter4Lessons } from './data/lessons/lesson-data';
import { executiveWorkshops } from './data/workshops/workshop-data';
import leadershipPACEConfigs from './data/pace/leadership-pace';
import { UserProgress, NavigationState, Chapter4Props } from './types';

const Chapter4DavidChen: React.FC<Chapter4Props> = ({
  currentLesson = 0,
  currentWorkshop = 0,
  userProgress = {
    lessonsCompleted: [],
    workshopsCompleted: [],
    conceptsCompleted: [],
    exercisesCompleted: [],
    assessmentsCompleted: [],
    overallProgress: 0,
    currentStep: 0,
    timeSpent: 0,
    lastAccessed: new Date()
  },
  onProgressUpdate,
  onLessonComplete,
  onWorkshopComplete
}) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeLesson: currentLesson || null,
    activeWorkshop: currentWorkshop || null,
    activeSection: 'overview',
    sidebarOpen: false
  });

  const [progress, setProgress] = useState<UserProgress>(userProgress);

  // Update progress when user completes activities
  const updateProgress = (updates: Partial<UserProgress>) => {
    const newProgress = { ...progress, ...updates, lastAccessed: new Date() };
    setProgress(newProgress);
    onProgressUpdate?.(newProgress);
  };

  // Calculate overall progress
  useEffect(() => {
    const totalLessons = 5;
    const totalWorkshops = 4;
    const totalItems = totalLessons + totalWorkshops;
    
    const completedItems = progress.lessonsCompleted.length + progress.workshopsCompleted.length;
    const overallProgress = Math.round((completedItems / totalItems) * 100);
    
    if (overallProgress !== progress.overallProgress) {
      updateProgress({ overallProgress });
    }
  }, [progress.lessonsCompleted, progress.workshopsCompleted]);

  // Handle lesson selection
  const handleLessonSelect = (lessonId: number) => {
    setNavigationState(prev => ({
      ...prev,
      activeLesson: lessonId,
      activeWorkshop: null,
      activeSection: 'lessons'
    }));
  };

  // Handle workshop selection
  const handleWorkshopSelect = (workshopId: number) => {
    setNavigationState(prev => ({
      ...prev,
      activeWorkshop: workshopId,
      activeLesson: null,
      activeSection: 'workshops'
    }));
  };

  // Handle lesson completion
  const handleLessonComplete = (lessonId: number) => {
    if (!progress.lessonsCompleted.includes(lessonId)) {
      const newCompleted = [...progress.lessonsCompleted, lessonId];
      updateProgress({ lessonsCompleted: newCompleted });
      onLessonComplete?.(lessonId);
      
      // Auto-advance to next lesson
      if (lessonId < 5) {
        handleLessonSelect(lessonId + 1);
      } else {
        // All lessons complete, show workshops
        setNavigationState(prev => ({ ...prev, activeSection: 'workshops' }));
      }
    }
  };

  // Handle workshop completion
  const handleWorkshopComplete = (workshopId: number) => {
    if (!progress.workshopsCompleted.includes(workshopId)) {
      const newCompleted = [...progress.workshopsCompleted, workshopId];
      updateProgress({ workshopsCompleted: newCompleted });
      onWorkshopComplete?.(workshopId);
    }
  };

  // Handle navigation back to overview
  const handleBackToOverview = () => {
    setNavigationState(prev => ({
      ...prev,
      activeLesson: null,
      activeWorkshop: null,
      activeSection: 'overview'
    }));
  };

  // Render active lesson
  const renderActiveLesson = () => {
    const { activeLesson } = navigationState;
    
    switch (activeLesson) {
      case 1:
        return (
          <Lesson1Foundation
            onComplete={() => handleLessonComplete(1)}
            userProgress={{
              conceptsCompleted: progress.conceptsCompleted,
              exercisesCompleted: progress.exercisesCompleted,
              currentStep: progress.currentStep
            }}
          />
        );
      case 2:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Lesson 2: Team Building Through Communication</h2>
                <p className="text-gray-600 mb-4">Creating High-Performing Teams</p>
                <p className="text-sm text-gray-500">Implementation in progress...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Lesson 3: Managing Up and Down</h2>
                <p className="text-gray-600 mb-4">Multi-Directional Leadership</p>
                <p className="text-sm text-gray-500">Implementation in progress...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 4:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Lesson 4: Crisis Communication Leadership</h2>
                <p className="text-gray-600 mb-4">Leading Through Uncertainty</p>
                <p className="text-sm text-gray-500">Implementation in progress...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 5:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Lesson 5: Executive Communication Workshops</h2>
                <p className="text-gray-600 mb-4">Mastering Advanced Leadership Communication</p>
                <p className="text-sm text-gray-500">Implementation in progress...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  // Render active workshop
  const renderActiveWorkshop = () => {
    const { activeWorkshop } = navigationState;
    
    if (activeWorkshop) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Workshop {activeWorkshop}</h2>
              <p className="text-gray-600 mb-4">Executive Communication Workshop</p>
              <p className="text-sm text-gray-500">Workshop implementation in progress...</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show navigation overview when no specific lesson/workshop is active */}
      {!navigationState.activeLesson && !navigationState.activeWorkshop && (
        <Chapter4Navigation
          currentLesson={currentLesson}
          userProgress={{
            lessonsCompleted: progress.lessonsCompleted,
            workshopsCompleted: progress.workshopsCompleted,
            overallProgress: progress.overallProgress
          }}
          onLessonSelect={handleLessonSelect}
          onWorkshopSelect={handleWorkshopSelect}
        />
      )}

      {/* Show active lesson */}
      {navigationState.activeLesson && (
        <div>
          {/* Back to overview button */}
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={handleBackToOverview}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mb-4"
            >
              ← Back to Chapter Overview
            </button>
          </div>
          {renderActiveLesson()}
        </div>
      )}

      {/* Show active workshop */}
      {navigationState.activeWorkshop && (
        <div>
          {/* Back to overview button */}
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={handleBackToOverview}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mb-4"
            >
              ← Back to Chapter Overview
            </button>
          </div>
          {renderActiveWorkshop()}
        </div>
      )}

      {/* Chapter Data Context (for debugging/development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-400">
          <details className="bg-white p-2 rounded shadow">
            <summary>Chapter 4 Data</summary>
            <div className="mt-2 space-y-1 max-w-xs">
              <div>Character: {davidChen.name}</div>
              <div>Lessons: {chapter4Lessons.length}</div>
              <div>Workshops: {executiveWorkshops.length}</div>
              <div>PACE Configs: {leadershipPACEConfigs.length}</div>
              <div>Progress: {progress.overallProgress}%</div>
              <div>Active Lesson: {navigationState.activeLesson || 'None'}</div>
              <div>Active Workshop: {navigationState.activeWorkshop || 'None'}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default Chapter4DavidChen;
export { davidChen, chapter4Lessons, executiveWorkshops, leadershipPACEConfigs };
export type { UserProgress, NavigationState, Chapter4Props };