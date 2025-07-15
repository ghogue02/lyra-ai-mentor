import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Target, Clock, Users, BookOpen, CheckCircle, Star } from 'lucide-react';
import { SofiaWorkshop } from '../../types/sofia';
import { SofiaCharacter } from '../character/SofiaCharacter';
import { VoiceExerciseCard } from '../ui/VoiceExerciseCard';

interface WorkshopLayoutProps {
  workshop: SofiaWorkshop;
  onComplete?: () => void;
  onBack?: () => void;
}

export const WorkshopLayout: React.FC<WorkshopLayoutProps> = ({
  workshop,
  onComplete,
  onBack
}) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const handleExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  const isWorkshopComplete = () => {
    return completedModules.length === workshop.modules.length;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentModule = () => workshop.modules[currentModule];

  const renderWorkshopHeader = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{workshop.title}</h1>
          <p className="text-gray-600 mt-1">{workshop.focus_area}</p>
          <div className="flex items-center space-x-4 mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(workshop.skill_level)}`}>
              {workshop.skill_level}
            </span>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{workshop.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{workshop.modules.length} modules</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="text-lg font-semibold text-blue-600">
              {Math.round((completedModules.length / workshop.modules.length) * 100)}%
            </p>
          </div>
          <SofiaCharacter mood="excited" showQuote={false} showStats={false} />
        </div>
      </div>
    </div>
  );

  const renderLearningObjectives = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Objectives</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workshop.learning_objectives.map((objective, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Target className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-700">{objective}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModuleNavigation = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Lessons</span>
        </button>
        
        <div className="flex space-x-2">
          {workshop.modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentModule === index
                  ? 'bg-blue-600 text-white'
                  : completedModules.includes(module.id)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {completedModules.includes(module.id) && (
                <CheckCircle className="w-4 h-4 inline mr-2" />
              )}
              Module {index + 1}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
            disabled={currentModule === 0}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={() => setCurrentModule(Math.min(workshop.modules.length - 1, currentModule + 1))}
            disabled={currentModule === workshop.modules.length - 1}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentModule = () => {
    const module = getCurrentModule();
    
    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{module.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{module.content}</p>
          
          {!completedModules.includes(module.id) && (
            <div className="text-center">
              <button
                onClick={() => handleModuleComplete(module.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mark Module Complete
              </button>
            </div>
          )}
          
          {completedModules.includes(module.id) && (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Module Complete!</h3>
              <p className="text-green-600">Great job completing this module.</p>
            </div>
          )}
        </div>

        {/* Module Exercises */}
        {module.exercises.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Module Exercises</h3>
            {module.exercises.map((exercise) => (
              <VoiceExerciseCard
                key={exercise.id}
                exercise={exercise}
                onComplete={() => handleExerciseComplete(exercise.id)}
                showSofiaCoaching={true}
              />
            ))}
          </div>
        )}

        {/* Practice Scenarios */}
        {module.practice_scenarios.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Practice Scenarios</h3>
            {module.practice_scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">{scenario.title}</h4>
                <p className="text-gray-600 mb-4">{scenario.context}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Sofia's Guidance</h5>
                  {scenario.sofia_guidance.map((guidance, idx) => (
                    <p key={idx} className="text-blue-700 text-sm italic mb-2">"{guidance}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderSofiaCoachingTips = () => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Sofia's Coaching Tips</h2>
      <div className="space-y-4">
        {workshop.sofia_coaching_tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-700 italic">"{tip}"</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkshopCompletion = () => {
    if (!isWorkshopComplete()) return null;

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Workshop Complete!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! You've completed the {workshop.title} workshop. 
            You've gained valuable skills in {workshop.focus_area.toLowerCase()}.
          </p>
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200"
          >
            Complete Workshop
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderWorkshopHeader()}
        {renderLearningObjectives()}
        {renderModuleNavigation()}
        {renderCurrentModule()}
        {renderSofiaCoachingTips()}
        {renderWorkshopCompletion()}
      </div>
    </div>
  );
};

export default WorkshopLayout;