import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Target, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

export const ExecutiveSummaryMastery: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Executive Mindset",
      description: "Understand how executives think and what they need from your summary.",
      task: "Identify the executive's key priorities and decision-making context",
      icon: Users,
      executiveNeeds: [
        "Quick understanding of business impact",
        "Clear recommendations for action",
        "Risk assessment and mitigation",
        "Resource requirements and ROI"
      ]
    },
    {
      title: "Inverted Pyramid Structure",
      description: "Lead with conclusions, then provide supporting evidence.",
      task: "Structure your summary with the most important information first",
      icon: Target,
      structure: [
        "Executive Summary (key findings & recommendations)",
        "Business Impact (financial and strategic implications)",
        "Supporting Evidence (data and analysis)",
        "Implementation Plan (next steps and resources)"
      ]
    },
    {
      title: "Concise Writing",
      description: "Communicate maximum value in minimum words.",
      task: "Write powerful, concise statements that drive action",
      icon: FileText,
      principles: [
        "One key point per paragraph",
        "Active voice and strong verbs",
        "Quantify impact whenever possible",
        "Eliminate unnecessary words"
      ]
    },
    {
      title: "Actionable Recommendations",
      description: "Provide specific, prioritized recommendations executives can act upon.",
      task: "Create clear, implementable recommendations with business justification",
      icon: TrendingUp,
      framework: [
        "What: Specific action required",
        "Why: Business justification",
        "When: Timeline and urgency",
        "How: Implementation approach"
      ]
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
    <div className="executive-summary-mastery min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Summary Mastery</h1>
          <p className="text-lg text-gray-600">Master concise, high-impact executive communication</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Writing Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <steps[currentStep].icon className="w-6 h-6 text-purple-600" />
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

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-3">Your Task</h3>
              <p className="text-purple-800 leading-relaxed">
                {steps[currentStep].task}
              </p>
            </div>

            {/* Step-specific content */}
            {(steps[currentStep].executiveNeeds || steps[currentStep].structure || 
              steps[currentStep].principles || steps[currentStep].framework) && (
              <div className="bg-pink-50 rounded-lg p-6">
                <h3 className="font-semibold text-pink-900 mb-3">
                  {currentStep === 0 ? 'Executive Needs' : 
                   currentStep === 1 ? 'Document Structure' :
                   currentStep === 2 ? 'Writing Principles' : 'Recommendation Framework'}
                </h3>
                <ul className="space-y-2">
                  {(steps[currentStep].executiveNeeds || steps[currentStep].structure || 
                    steps[currentStep].principles || steps[currentStep].framework)?.map((item, index) => (
                    <li key={index} className="text-pink-800 flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => handleStepComplete(currentStep)}
                disabled={completedSteps.includes(currentStep)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  completedSteps.includes(currentStep)
                    ? 'bg-purple-100 text-purple-700 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
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
                    className="px-4 py-2 text-purple-600 hover:text-purple-800"
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
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Executive Summary Mastery Complete!</h2>
            <p className="text-white text-lg mb-4">
              You've mastered executive communication
            </p>
            <button
              onClick={() => navigate('/lesson-5')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
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