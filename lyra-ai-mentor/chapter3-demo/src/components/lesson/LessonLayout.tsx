import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle, Star } from 'lucide-react';
import { SofiaLesson } from '../../types/sofia';
import { SofiaCharacter } from '../character/SofiaCharacter';
import { VoiceExerciseCard } from '../ui/VoiceExerciseCard';

interface LessonLayoutProps {
  lesson: SofiaLesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const LessonLayout: React.FC<LessonLayoutProps> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious
}) => {
  const [currentSection, setCurrentSection] = useState<'intro' | 'content' | 'practice' | 'conclusion'>('intro');
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const sections = [
    { id: 'intro', title: 'Introduction', icon: BookOpen },
    { id: 'content', title: 'Main Content', icon: Star },
    { id: 'practice', title: 'Practice', icon: CheckCircle },
    { id: 'conclusion', title: 'Conclusion', icon: CheckCircle }
  ];

  const currentSectionIndex = sections.findIndex(s => s.id === currentSection);

  const handleExerciseComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  const handleActivityComplete = (activityId: string) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities([...completedActivities, activityId]);
    }
  };

  const isLessonComplete = () => {
    const totalExercises = lesson.sections.main_content.exercises.length;
    const totalActivities = lesson.sections.practice.activities.length;
    return completedExercises.length === totalExercises && completedActivities.length === totalActivities;
  };

  const renderIntroduction = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to {lesson.title}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Sofia's Welcome</h4>
            <p className="text-gray-600 leading-relaxed">
              {lesson.sections.introduction.sofia_welcome}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Lesson Overview</h4>
            <p className="text-gray-600 leading-relaxed">
              {lesson.sections.introduction.lesson_overview}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Lesson Duration</h4>
              <p className="text-gray-600">{lesson.duration} minutes</p>
            </div>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-semibold text-gray-800">Learning Objective</h4>
            <p className="text-gray-600">{lesson.objective}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMainContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Theory & Concepts</h3>
        <div className="space-y-4">
          {lesson.sections.main_content.theory.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">Voice Exercises</h3>
        {lesson.sections.main_content.exercises.map((exercise, index) => (
          <VoiceExerciseCard
            key={exercise.id}
            exercise={exercise}
            onComplete={() => handleExerciseComplete(exercise.id)}
            showSofiaCoaching={true}
          />
        ))}
      </div>

      {lesson.sections.main_content.scenarios && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Practice Scenarios</h3>
          {lesson.sections.main_content.scenarios.map((scenario, index) => (
            <div key={scenario.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{scenario.title}</h4>
              <p className="text-gray-600 mb-4">{scenario.context}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Challenges</h5>
                  <ul className="space-y-1">
                    {scenario.challenges.map((challenge, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">• {challenge}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Solutions</h5>
                  <ul className="space-y-1">
                    {scenario.solutions.map((solution, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">• {solution}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-4">
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

  const renderPractice = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Practice Activities</h3>
        <div className="space-y-4">
          {lesson.sections.practice.activities.map((activity, index) => (
            <div key={activity.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{activity.name}</h4>
              <p className="text-gray-600 mb-4">{activity.description}</p>
              
              <div className="mb-4">
                <h5 className="font-semibold text-gray-700 mb-2">Steps</h5>
                <ol className="space-y-1">
                  {activity.steps.map((step, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">
                      {idx + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="font-semibold text-purple-800 mb-2">Sofia's Encouragement</h5>
                <p className="text-purple-700 text-sm italic">"{activity.sofia_encouragement}"</p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => handleActivityComplete(activity.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    completedActivities.includes(activity.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedActivities.includes(activity.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Reflection Questions</h3>
        <div className="space-y-4">
          {lesson.sections.practice.reflection_questions.map((question, index) => (
            <div key={index} className="bg-yellow-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium">{question}</p>
              <textarea
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Write your reflection here..."
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderConclusion = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Lesson Summary</h3>
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Sofia's Summary</h4>
          <p className="text-gray-600 leading-relaxed">
            {lesson.sections.conclusion.sofia_summary}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Takeaways</h3>
        <div className="space-y-3">
          {lesson.sections.conclusion.key_takeaways.map((takeaway, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Next Steps</h3>
        <p className="text-gray-700 leading-relaxed">
          {lesson.sections.conclusion.next_steps}
        </p>
        
        {isLessonComplete() && (
          <div className="mt-6 text-center">
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Complete Lesson</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'intro': return renderIntroduction();
      case 'content': return renderMainContent();
      case 'practice': return renderPractice();
      case 'conclusion': return renderConclusion();
      default: return renderIntroduction();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
              <p className="text-gray-600 mt-1">{lesson.objective}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-lg font-semibold text-blue-600">
                  {Math.round(((completedExercises.length + completedActivities.length) / 
                    (lesson.sections.main_content.exercises.length + lesson.sections.practice.activities.length)) * 100)}%
                </p>
              </div>
              <SofiaCharacter mood="encouraging" showQuote={false} showStats={false} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <section.icon className="w-4 h-4 inline mr-2" />
                  {section.title}
                </button>
              ))}
            </div>

            <button
              onClick={onNext}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default LessonLayout;