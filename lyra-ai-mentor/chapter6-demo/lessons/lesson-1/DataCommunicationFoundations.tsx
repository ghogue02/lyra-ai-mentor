import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, MessageSquare, Target, Users, CheckCircle, ChevronRight } from 'lucide-react';

export const DataCommunicationFoundations: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      title: "The Data Communication Challenge",
      content: "Most technical professionals struggle with a fundamental problem: they know their data inside and out, but they can't explain it to others. I learned this the hard way when I first started as a data analyst.",
      alexStory: "I remember my first presentation to the executive team. I had discovered a critical trend in our customer data, but I buried it in technical jargon and complex charts. The CEO asked me to 'just tell him what it means for the business.' I couldn't answer clearly.",
      keyInsight: "Technical expertise without communication skills limits your impact",
      icon: MessageSquare
    },
    {
      title: "Know Your Audience",
      content: "The foundation of great data communication is understanding who you're talking to. Each audience has different needs, technical backgrounds, and decision-making contexts.",
      alexStory: "I learned to create audience personas before every presentation. The CFO cares about financial impact, the product manager wants user behavior insights, and the CEO needs strategic implications. Same data, different stories.",
      keyInsight: "Adapt your message to your audience's needs and expertise level",
      icon: Users
    },
    {
      title: "Define Your Purpose",
      content: "Before diving into data, clarify what you want to achieve. Are you informing, persuading, or recommending action? Your purpose shapes how you present your findings.",
      alexStory: "I stopped creating 'data dumps' and started asking: 'What decision does this data help make?' This simple question transformed my presentations from information sharing to action-driving communication.",
      keyInsight: "Every data presentation should have a clear purpose and call to action",
      icon: Target
    },
    {
      title: "Structure Your Story",
      content: "Data communication follows a narrative structure: context, conflict, resolution. Start with the business context, present the data challenge or opportunity, then offer your insights and recommendations.",
      alexStory: "I adopted the 'So What?' framework: present the data, explain what it means, and most importantly, explain why it matters. This structure helped executives understand both the findings and their implications.",
      keyInsight: "Structure your data stories with clear context, insight, and implication",
      icon: BarChart3
    }
  ];

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
    }
  };

  const canProceed = completedSections.length === sections.length;

  const handleNext = () => {
    navigate('/lesson-2');
  };

  return (
    <div className="data-communication-foundations min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Communication Foundations</h1>
          <p className="text-xl text-gray-600">Building the basics of clear technical communication</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
            <span className="text-sm text-gray-600">
              {completedSections.length} of {sections.length} sections completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  index === currentSection
                    ? 'bg-blue-500 text-white'
                    : completedSections.includes(index)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {completedSections.includes(index) ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <span className="w-4 h-4 mr-2 text-center text-sm">{index + 1}</span>
                )}
                {section.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Current Section Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <sections[currentSection].icon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sections[currentSection].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Foundation Concept</h3>
              <p className="text-gray-700 leading-relaxed">
                {sections[currentSection].content}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Alex's Experience</h3>
              <p className="text-blue-800 leading-relaxed">
                {sections[currentSection].alexStory}
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="font-semibold text-green-900 mb-2">Key Insight</h3>
              <p className="text-green-800 font-medium">
                {sections[currentSection].keyInsight}
              </p>
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => handleSectionComplete(currentSection)}
                disabled={completedSections.includes(currentSection)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  completedSections.includes(currentSection)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {completedSections.includes(currentSection) ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </button>

              <div className="flex space-x-2">
                {currentSection > 0 && (
                  <button
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Previous
                  </button>
                )}
                {currentSection < sections.length - 1 && (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Practice Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Activity</h2>
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">Communication Foundation Assessment</h3>
            <p className="text-yellow-800 mb-4">
              Think about your last technical presentation or report. Evaluate it using Alex's foundation principles:
            </p>
            <ul className="space-y-2 text-yellow-800">
              <li>• Did you clearly identify your audience and their needs?</li>
              <li>• Was your purpose explicit and actionable?</li>
              <li>• Did you structure your findings in a logical narrative?</li>
              <li>• Could a non-technical person understand your key insights?</li>
            </ul>
          </div>
        </div>

        {/* Next Lesson */}
        {canProceed && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
            >
              Continue to Visualization & Clarity
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};