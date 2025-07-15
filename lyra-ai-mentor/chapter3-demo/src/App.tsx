import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChapterNavigation } from './components/navigation/ChapterNavigation';
import { LessonLayout } from './components/lesson/LessonLayout';
import { WorkshopLayout } from './components/workshop/WorkshopLayout';
import { sofiaLessons } from './data/lessons';
import { sofiaWorkshops } from './data/workshops';

interface AppState {
  currentView: 'navigation' | 'lesson' | 'workshop';
  currentLessonId: string | null;
  currentWorkshopId: string | null;
  completedLessons: string[];
  completedWorkshops: string[];
}

function App() {
  const [state, setState] = useState<AppState>({
    currentView: 'navigation',
    currentLessonId: null,
    currentWorkshopId: null,
    completedLessons: JSON.parse(localStorage.getItem('sofia-completed-lessons') || '[]'),
    completedWorkshops: JSON.parse(localStorage.getItem('sofia-completed-workshops') || '[]')
  });

  const saveProgress = (newState: Partial<AppState>) => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
    
    if (newState.completedLessons) {
      localStorage.setItem('sofia-completed-lessons', JSON.stringify(newState.completedLessons));
    }
    if (newState.completedWorkshops) {
      localStorage.setItem('sofia-completed-workshops', JSON.stringify(newState.completedWorkshops));
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    setState({
      ...state,
      currentView: 'lesson',
      currentLessonId: lessonId
    });
  };

  const handleSelectWorkshop = (workshopId: string) => {
    setState({
      ...state,
      currentView: 'workshop',
      currentWorkshopId: workshopId
    });
  };

  const handleLessonComplete = () => {
    if (state.currentLessonId && !state.completedLessons.includes(state.currentLessonId)) {
      const newCompletedLessons = [...state.completedLessons, state.currentLessonId];
      saveProgress({ completedLessons: newCompletedLessons });
    }
    handleBackToNavigation();
  };

  const handleWorkshopComplete = () => {
    if (state.currentWorkshopId && !state.completedWorkshops.includes(state.currentWorkshopId)) {
      const newCompletedWorkshops = [...state.completedWorkshops, state.currentWorkshopId];
      saveProgress({ completedWorkshops: newCompletedWorkshops });
    }
    handleBackToNavigation();
  };

  const handleBackToNavigation = () => {
    setState({
      ...state,
      currentView: 'navigation',
      currentLessonId: null,
      currentWorkshopId: null
    });
  };

  const handleNextLesson = () => {
    if (state.currentLessonId) {
      const currentIndex = sofiaLessons.findIndex(l => l.id === state.currentLessonId);
      if (currentIndex < sofiaLessons.length - 1) {
        const nextLesson = sofiaLessons[currentIndex + 1];
        handleSelectLesson(nextLesson.id);
      } else {
        handleBackToNavigation();
      }
    }
  };

  const handlePreviousLesson = () => {
    if (state.currentLessonId) {
      const currentIndex = sofiaLessons.findIndex(l => l.id === state.currentLessonId);
      if (currentIndex > 0) {
        const previousLesson = sofiaLessons[currentIndex - 1];
        handleSelectLesson(previousLesson.id);
      } else {
        handleBackToNavigation();
      }
    }
  };

  const getCurrentLesson = () => {
    return state.currentLessonId ? sofiaLessons.find(l => l.id === state.currentLessonId) : null;
  };

  const getCurrentWorkshop = () => {
    return state.currentWorkshopId ? sofiaWorkshops.find(w => w.id === state.currentWorkshopId) : null;
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'lesson':
        const currentLesson = getCurrentLesson();
        if (!currentLesson) return <Navigate to="/" />;
        
        return (
          <LessonLayout
            lesson={currentLesson}
            onComplete={handleLessonComplete}
            onNext={handleNextLesson}
            onPrevious={handlePreviousLesson}
          />
        );

      case 'workshop':
        const currentWorkshop = getCurrentWorkshop();
        if (!currentWorkshop) return <Navigate to="/" />;
        
        return (
          <WorkshopLayout
            workshop={currentWorkshop}
            onComplete={handleWorkshopComplete}
            onBack={handleBackToNavigation}
          />
        );

      default:
        return (
          <ChapterNavigation
            onSelectLesson={handleSelectLesson}
            onSelectWorkshop={handleSelectWorkshop}
            completedLessons={state.completedLessons}
            completedWorkshops={state.completedWorkshops}
          />
        );
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={renderCurrentView()} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;