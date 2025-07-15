import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, CheckCircle, ChevronRight } from 'lucide-react';

export const DataStorytellingWorkshop: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [storyDraft, setStoryDraft] = useState('');

  const steps = [
    {
      title: "Data Analysis Challenge",
      description: "You've been analyzing customer churn data and discovered that customers who don't engage with your mobile app within the first 7 days are 3x more likely to cancel their subscription within 90 days. Current first-week engagement is only 35%.",
      task: "Analyze this data and identify the key business insight",
      guidance: "Look beyond the numbers - what does this mean for the business?",
      sampleData: {
        totalCustomers: 10000,
        firstWeekEngagement: 3500,
        churnRate: {
          engaged: 8,
          notEngaged: 24
        },
        averageCustomerValue: 1200
      }
    },
    {
      title: "Narrative Structure",
      description: "Transform your analysis into a compelling story using the classic narrative arc: Context → Conflict → Resolution.",
      task: "Structure your findings into a clear narrative",
      guidance: "Context: What's the business situation? Conflict: What's the problem? Resolution: What's the opportunity?",
      framework: {
        context: "Customer acquisition and retention challenges",
        conflict: "Low first-week engagement leading to high churn",
        resolution: "Improve onboarding to reduce churn and increase revenue"
      }
    },
    {
      title: "Business Impact Translation",
      description: "Connect your technical findings to clear business outcomes and financial impact.",
      task: "Calculate and present the business impact",
      guidance: "Show the cost of inaction and the value of taking action",
      calculations: {
        currentMonthlyChurn: 800,
        potentialChurnReduction: 400,
        monthlyRevenueSaved: 480000,
        annualRevenueSaved: 5760000
      }
    },
    {
      title: "Actionable Recommendations",
      description: "Provide specific, prioritized recommendations that stakeholders can act upon immediately.",
      task: "Develop 3 specific recommendations with implementation priorities",
      guidance: "Focus on high-impact, feasible actions with clear next steps",
      recommendations: [
        "Implement personalized onboarding flow within 30 days",
        "Create in-app engagement triggers for first-week users",
        "A/B test onboarding variations to optimize engagement"
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

  const handleComplete = () => {
    navigate('/lesson-5');
  };

  return (
    <div className="data-storytelling-workshop min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Storytelling Workshop</h1>
          <p className="text-lg text-gray-600">Transform raw data into compelling business narratives</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Workshop Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold text-lg">{currentStep + 1}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Scenario</h3>
              <p className="text-gray-700 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Your Task</h3>
              <p className="text-blue-800 leading-relaxed">
                {steps[currentStep].task}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">Alex's Guidance</h3>
              <p className="text-yellow-800 leading-relaxed">
                {steps[currentStep].guidance}
              </p>
            </div>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Sample Data</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-indigo-600">10,000</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">First Week Engagement</p>
                    <p className="text-2xl font-bold text-indigo-600">35%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Churn Rate (Engaged)</p>
                    <p className="text-2xl font-bold text-green-600">8%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Churn Rate (Not Engaged)</p>
                    <p className="text-2xl font-bold text-red-600">24%</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Narrative Framework</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-medium text-gray-900">Context</p>
                    <p className="text-gray-700">What's the business situation?</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-medium text-gray-900">Conflict</p>
                    <p className="text-gray-700">What's the problem or challenge?</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-medium text-gray-900">Resolution</p>
                    <p className="text-gray-700">What's the opportunity or solution?</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Business Impact Calculations</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center">
                    <span className="text-gray-700">Current Monthly Churn</span>
                    <span className="font-bold text-red-600">800 customers</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center">
                    <span className="text-gray-700">Potential Monthly Savings</span>
                    <span className="font-bold text-green-600">$480,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center">
                    <span className="text-gray-700">Annual Revenue Impact</span>
                    <span className="font-bold text-blue-600">$5.76M</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">Recommendation Framework</h3>
                <div className="space-y-3">
                  {steps[currentStep].recommendations?.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Area */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Your Response</h3>
              <textarea
                value={storyDraft}
                onChange={(e) => setStoryDraft(e.target.value)}
                placeholder="Write your data story here..."
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => handleStepComplete(currentStep)}
                disabled={completedSteps.includes(currentStep)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  completedSteps.includes(currentStep)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
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
                    className="px-4 py-2 text-blue-600 hover:text-blue-800"
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
            <h2 className="text-2xl font-bold text-white mb-2">Workshop Complete!</h2>
            <p className="text-white text-lg mb-4">
              You've mastered the art of data storytelling
            </p>
            <button
              onClick={handleComplete}
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