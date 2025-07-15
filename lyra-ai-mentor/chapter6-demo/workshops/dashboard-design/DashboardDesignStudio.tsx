import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Eye, Layers, Zap, CheckCircle, ChevronRight } from 'lucide-react';

export const DashboardDesignStudio: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Dashboard Audit",
      description: "Examine this overcomplicated executive dashboard and identify usability issues.",
      task: "List 5 major problems with this dashboard design",
      icon: Eye,
      problems: [
        "Too many charts overwhelming the viewer",
        "No clear visual hierarchy",
        "Inconsistent color usage",
        "Technical jargon in labels",
        "No clear call-to-action"
      ]
    },
    {
      title: "User-Centered Design",
      description: "Redesign the dashboard with a focus on the executive's key decisions and time constraints.",
      task: "Create a layout that serves the executive's primary needs",
      icon: Layers,
      principles: [
        "Most critical metrics at top-left",
        "Use progressive disclosure for details",
        "Consistent visual language",
        "Business language, not technical terms"
      ]
    },
    {
      title: "Visual Hierarchy",
      description: "Apply color, typography, and spacing to guide the eye to key insights.",
      task: "Design a clear information hierarchy",
      icon: BarChart3,
      techniques: [
        "Size indicates importance",
        "Color highlights exceptions",
        "White space creates focus",
        "Typography guides reading order"
      ]
    },
    {
      title: "Interactive Elements",
      description: "Add interactive features that enhance understanding without adding complexity.",
      task: "Design meaningful interactions that serve business needs",
      icon: Zap,
      interactions: [
        "Drill-down for context",
        "Hover for additional detail",
        "Filtering for personalization",
        "Alerts for actionable items"
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
    <div className="dashboard-design-studio min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Design Studio</h1>
          <p className="text-lg text-gray-600">Create intuitive, actionable dashboards</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Design Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <steps[currentStep].icon className="w-6 h-6 text-green-600" />
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

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3">Your Task</h3>
              <p className="text-green-800 leading-relaxed">
                {steps[currentStep].task}
              </p>
            </div>

            {/* Step-specific content */}
            {(steps[currentStep].problems || steps[currentStep].principles || 
              steps[currentStep].techniques || steps[currentStep].interactions) && (
              <div className="bg-teal-50 rounded-lg p-6">
                <h3 className="font-semibold text-teal-900 mb-3">
                  {currentStep === 0 ? 'Common Problems' : 
                   currentStep === 1 ? 'Design Principles' :
                   currentStep === 2 ? 'Visual Techniques' : 'Interaction Types'}
                </h3>
                <ul className="space-y-2">
                  {(steps[currentStep].problems || steps[currentStep].principles || 
                    steps[currentStep].techniques || steps[currentStep].interactions)?.map((item, index) => (
                    <li key={index} className="text-teal-800 flex items-start">
                      <span className="text-teal-600 mr-2">•</span>
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
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
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
                    className="px-4 py-2 text-green-600 hover:text-green-800"
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
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Design Studio Complete!</h2>
            <p className="text-white text-lg mb-4">
              You've mastered dashboard design principles
            </p>
            <button
              onClick={() => navigate('/lesson-5')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
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