import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface PACEAssessmentProps {
  onComplete: (results: PACEResults) => void;
}

interface PACEResults {
  currentSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  learningPreferences: string[];
  confidenceAreas: string[];
  personalizedPath: string[];
  adaptiveSettings: {
    pacing: 'slow' | 'medium' | 'fast';
    supportLevel: 'high' | 'medium' | 'low';
    practiceFrequency: 'daily' | 'frequent' | 'moderate';
  };
}

export const PACEAssessment: React.FC<PACEAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    {
      id: 'experience',
      title: 'Speaking Experience',
      question: 'How would you describe your current speaking experience?',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner - I avoid speaking opportunities when possible' },
        { value: 'intermediate', label: 'Intermediate - I can speak but feel nervous' },
        { value: 'advanced', label: 'Advanced - I speak regularly and feel mostly confident' }
      ]
    },
    {
      id: 'fears',
      title: 'Speaking Fears',
      question: 'What aspects of speaking make you most nervous? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'large_audience', label: 'Speaking to large groups' },
        { value: 'authority_figures', label: 'Speaking to authority figures or executives' },
        { value: 'being_judged', label: 'Fear of being judged or criticized' },
        { value: 'forgetting_content', label: 'Forgetting what to say' },
        { value: 'voice_quality', label: 'Voice sounding weak or shaky' },
        { value: 'questions', label: 'Handling questions from the audience' }
      ]
    },
    {
      id: 'goals',
      title: 'Learning Goals',
      question: 'What are your primary goals for improving your speaking? (Select all that apply)',
      type: 'multiple',
      options: [
        { value: 'confidence', label: 'Build overall confidence' },
        { value: 'voice_strength', label: 'Develop a stronger, clearer voice' },
        { value: 'presentation_skills', label: 'Improve presentation delivery' },
        { value: 'audience_engagement', label: 'Better audience engagement' },
        { value: 'professional_growth', label: 'Career advancement' },
        { value: 'personal_development', label: 'Personal growth and self-expression' }
      ]
    },
    {
      id: 'learning_style',
      title: 'Learning Preferences',
      question: 'How do you prefer to learn new skills?',
      type: 'single',
      options: [
        { value: 'hands_on', label: 'Hands-on practice and experimentation' },
        { value: 'theory_first', label: 'Understanding theory before practicing' },
        { value: 'examples', label: 'Learning from examples and case studies' },
        { value: 'feedback', label: 'Guided practice with frequent feedback' }
      ]
    },
    {
      id: 'pace_preference',
      title: 'Learning Pace',
      question: 'What learning pace works best for you?',
      type: 'single',
      options: [
        { value: 'slow', label: 'Slow and steady - I need time to absorb each concept' },
        { value: 'medium', label: 'Moderate pace - balanced learning and practice' },
        { value: 'fast', label: 'Fast pace - I learn quickly and want to progress rapidly' }
      ]
    },
    {
      id: 'support_needed',
      title: 'Support Level',
      question: 'How much guidance and support do you prefer?',
      type: 'single',
      options: [
        { value: 'high', label: 'High support - Detailed guidance and frequent check-ins' },
        { value: 'medium', label: 'Moderate support - Some guidance with independence' },
        { value: 'low', label: 'Low support - Minimal guidance, prefer self-directed learning' }
      ]
    },
    {
      id: 'practice_frequency',
      title: 'Practice Commitment',
      question: 'How often are you willing to practice speaking exercises?',
      type: 'single',
      options: [
        { value: 'daily', label: 'Daily - 10-15 minutes every day' },
        { value: 'frequent', label: 'Frequent - 3-4 times per week' },
        { value: 'moderate', label: 'Moderate - 1-2 times per week' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate PACE results
      const results = calculatePACEResults();
      onComplete(results);
    }
  };

  const calculatePACEResults = (): PACEResults => {
    const skillLevel = answers.experience || 'beginner';
    
    const learningPreferences = [];
    if (answers.learning_style) {
      learningPreferences.push(answers.learning_style);
    }
    if (answers.fears && Array.isArray(answers.fears)) {
      learningPreferences.push(...answers.fears);
    }

    const confidenceAreas = answers.goals || [];

    const personalizedPath = generatePersonalizedPath(skillLevel, answers.goals, answers.fears);

    const adaptiveSettings = {
      pacing: answers.pace_preference || 'medium',
      supportLevel: answers.support_needed || 'medium',
      practiceFrequency: answers.practice_frequency || 'moderate'
    };

    return {
      currentSkillLevel: skillLevel,
      learningPreferences,
      confidenceAreas,
      personalizedPath,
      adaptiveSettings
    };
  };

  const generatePersonalizedPath = (skillLevel: string, goals: string[], fears: string[]) => {
    const path = [];
    
    // Always start with foundations
    path.push('Voice Foundation Workshop');
    
    if (skillLevel === 'beginner' || fears?.includes('voice_quality')) {
      path.push('Extended Voice Exercises');
    }
    
    if (goals?.includes('presentation_skills') || goals?.includes('professional_growth')) {
      path.push('Presentation Design Mastery');
    }
    
    if (fears?.includes('large_audience') || goals?.includes('audience_engagement')) {
      path.push('Audience Engagement Techniques');
    }
    
    if (fears?.includes('being_judged') || goals?.includes('confidence')) {
      path.push('Confidence Building Systems');
    }
    
    // Advanced workshops based on specific needs
    if (skillLevel === 'advanced' || goals?.includes('voice_strength')) {
      path.push('Vocal Technique Mastery Workshop');
    }
    
    if (goals?.includes('presentation_skills')) {
      path.push('Slide Design Workshop');
    }
    
    if (fears?.includes('questions')) {
      path.push('Q&A Handling Guide');
    }
    
    if (fears?.includes('large_audience') || goals?.includes('professional_growth')) {
      path.push('Stage Presence Training');
    }
    
    return path;
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getQuestionIcon = (id: string) => {
    switch (id) {
      case 'experience': return Brain;
      case 'fears': return Target;
      case 'goals': return Zap;
      case 'learning_style': return Users;
      case 'pace_preference': return ArrowRight;
      case 'support_needed': return Users;
      case 'practice_frequency': return CheckCircle;
      default: return Brain;
    }
  };

  const IconComponent = getQuestionIcon(currentQ.id);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">PACE Assessment</h2>
        <p className="text-gray-600">Personalized Adaptive Confidence Enhancement</p>
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{currentQ.title}</h3>
            <p className="text-gray-600">{currentQ.question}</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <label
              key={option.value}
              className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                currentQ.type === 'single'
                  ? answers[currentQ.id] === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                  : answers[currentQ.id]?.includes(option.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type={currentQ.type === 'single' ? 'radio' : 'checkbox'}
                  name={currentQ.id}
                  value={option.value}
                  checked={
                    currentQ.type === 'single'
                      ? answers[currentQ.id] === option.value
                      : answers[currentQ.id]?.includes(option.value) || false
                  }
                  onChange={(e) => {
                    if (currentQ.type === 'single') {
                      handleAnswer(currentQ.id, option.value);
                    } else {
                      const current = answers[currentQ.id] || [];
                      if (e.target.checked) {
                        handleAnswer(currentQ.id, [...current, option.value]);
                      } else {
                        handleAnswer(currentQ.id, current.filter((v: string) => v !== option.value));
                      }
                    }
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQ.id] || (Array.isArray(answers[currentQ.id]) && answers[currentQ.id].length === 0)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>{currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PACEAssessment;