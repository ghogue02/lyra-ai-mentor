import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresentationChart, Users, MessageSquare, Zap, CheckCircle, ChevronRight } from 'lucide-react';

export const TechnicalPresentationLab: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Audience Analysis",
      description: "Analyze your audience's technical background and business priorities.",
      task: "Map your audience's knowledge level and decision-making authority",
      icon: Users,
      audienceTypes: [
        "C-Suite: High influence, low technical knowledge",
        "VPs: Medium influence, medium technical knowledge", 
        "Managers: Medium influence, high technical knowledge",
        "Peers: Low influence, very high technical knowledge"
      ]
    },
    {
      title: "Technical Translation",
      description: "Convert complex technical concepts into accessible business language.",
      task: "Practice translating technical jargon into clear business impact",
      icon: MessageSquare,
      techniques: [
        "Use analogies and metaphors",
        "Focus on outcomes, not processes",
        "Quantify business impact",
        "Eliminate unnecessary technical detail"
      ]
    },
    {
      title: "Visual Communication",
      description: "Create visual aids that support understanding rather than overwhelm.",
      task: "Design visuals that clarify rather than complicate your message",
      icon: PresentationChart,
      visualPrinciples: [
        "One concept per slide",
        "Use visuals to explain, not decorate",
        "Progressive disclosure of complexity",
        "Consistent visual language"
      ]
    },
    {
      title: "Q&A Mastery",
      description: "Handle technical questions and objections with confidence and clarity.",
      task: "Practice responding to challenging questions from different stakeholder types",
      icon: Zap,
      strategies: [
        "Acknowledge expertise and validate concerns",
        "Bridge back to business impact",
        "Use 'park and follow-up' for tangential questions",
        "Stay calm and collaborative under pressure"
      ]
    }
  ];

  const scenarioQuestions = [
    {
      type: "Executive Challenge",
      question: "This technical solution seems expensive and risky. Why can't we just use our existing system?",
      guidance: "Address risk perception and demonstrate ROI"
    },
    {
      type: "Technical Objection", 
      question: "Your proposed architecture doesn't account for our legacy constraints. How do you plan to handle integration?",
      guidance: "Show technical depth while maintaining business focus"
    },
    {
      type: "Timeline Pressure",
      question: "The board wants this implemented in 3 months. Is that realistic given the technical complexity?",
      guidance: "Balance honesty about constraints with solution-oriented thinking"
    }
  ];

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const isWorkshopComplete = completedSteps.length === steps.length;

  return (
    <div className="technical-presentation-lab min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <PresentationChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Presentation Lab</h1>
          <p className="text-lg text-gray-600">Present complex technical concepts to any audience</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lab Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <steps[currentStep].icon className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="font-semibold text-orange-900 mb-3">Your Task</h3>
              <p className="text-orange-800 leading-relaxed">
                {steps[currentStep].task}
              </p>
            </div>

            {/* Step-specific content */}
            {(steps[currentStep].audienceTypes || steps[currentStep].techniques || 
              steps[currentStep].visualPrinciples || steps[currentStep].strategies) && (
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3">
                  {currentStep === 0 ? 'Audience Types' : 
                   currentStep === 1 ? 'Translation Techniques' :
                   currentStep === 2 ? 'Visual Principles' : 'Q&A Strategies'}
                </h3>
                <ul className="space-y-2">
                  {(steps[currentStep].audienceTypes || steps[currentStep].techniques || 
                    steps[currentStep].visualPrinciples || steps[currentStep].strategies)?.map((item, index) => (
                    <li key={index} className="text-red-800 flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Q&A Practice Scenarios */}
            {currentStep === 3 && (
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Practice Scenarios</h3>
                <div className="space-y-4">
                  {scenarioQuestions.map((scenario, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                      <h4 className="font-medium text-gray-900 mb-2">{scenario.type}</h4>
                      <p className="text-gray-700 mb-2 italic">"{scenario.question}"</p>
                      <p className="text-yellow-800 text-sm">
                        <span className="font-medium">Guidance:</span> {scenario.guidance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => handleStepComplete(currentStep)}
                disabled={completedSteps.includes(currentStep)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  completedSteps.includes(currentStep)
                    ? 'bg-orange-100 text-orange-700 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {completedSteps.includes(currentStep) ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Step Complete
                  </>
                ) : (
                  'Complete Step'
                )}
              </button>

              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 && completedSteps.includes(currentStep) && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-4 py-2 text-orange-600 hover:text-orange-800"
                  >
                    Next Step
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Completion */}
        {isWorkshopComplete && (
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Technical Presentation Lab Complete!</h2>
            <p className="text-white text-lg mb-4">
              You've mastered technical presentation skills
            </p>
            <button
              onClick={() => navigate('/lesson-5')}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Return to Workshops
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};