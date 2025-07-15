import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, Zap, Layers, CheckCircle, ChevronRight } from 'lucide-react';

export const VisualizationAndClarity: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      title: "The Power of Visual Clarity",
      content: "Visual communication can transform complex data into instant understanding. But many technical professionals create charts that confuse rather than clarify. The key is choosing the right visual for your message.",
      alexStory: "I once spent a week creating a complex dashboard with 15 different charts. The stakeholders were overwhelmed. I redesigned it with just 3 key visualizations that told the complete story. They finally understood our customer journey.",
      keyInsight: "Less is more: focus on the few visuals that matter most",
      icon: Eye,
      example: "A single well-designed customer funnel chart replaced 15 separate analytics reports"
    },
    {
      title: "Choosing the Right Chart Type",
      content: "Different data relationships require different visual approaches. Bar charts for comparisons, line charts for trends, scatter plots for correlations. The chart type should match your data story.",
      alexStory: "I learned this when presenting quarterly sales data. I used a pie chart to show sales by region, but the CEO couldn't compare the regions easily. A simple bar chart made the performance gaps immediately obvious.",
      keyInsight: "Match your chart type to your data relationship and audience need",
      icon: TrendingUp,
      example: "Bar charts for comparisons, line charts for trends, scatter plots for correlations"
    },
    {
      title: "Design for Comprehension",
      content: "Visual design isn't just about looking good—it's about cognitive processing. Use color strategically, minimize chartjunk, and guide the eye to key insights. Every design choice should serve understanding.",
      alexStory: "I redesigned our monthly performance report using color only to highlight exceptions and trends. Instead of rainbow charts, I used gray for context and bright colors for insights. Reading time dropped from 30 minutes to 5 minutes.",
      keyInsight: "Design choices should reduce cognitive load and highlight insights",
      icon: Layers,
      example: "Strategic use of color and whitespace to guide attention to key findings"
    },
    {
      title: "Interactive Engagement",
      content: "Modern audiences expect to explore data, not just view it. Interactive visualizations let stakeholders discover insights themselves, creating deeper understanding and buy-in.",
      alexStory: "I created an interactive dashboard for our product team that let them filter by user segment, time period, and feature usage. They discovered patterns I never would have shown in static reports. Now they use it daily for decision-making.",
      keyInsight: "Interactive exploration creates deeper understanding and ownership",
      icon: Zap,
      example: "Self-service dashboards that let users explore data and discover insights"
    }
  ];

  const visualizationExamples = [
    {
      type: "Before",
      description: "Complex technical dashboard with 15 charts",
      problems: ["Information overload", "No clear hierarchy", "Technical jargon", "Cognitive overwhelm"]
    },
    {
      type: "After",
      description: "Simplified dashboard with 3 key visualizations",
      improvements: ["Clear data story", "Visual hierarchy", "Business language", "Instant comprehension"]
    }
  ];

  const chartGuidelines = [
    { type: "Bar Charts", use: "Comparing categories", example: "Sales by region" },
    { type: "Line Charts", use: "Showing trends over time", example: "Monthly revenue growth" },
    { type: "Scatter Plots", use: "Showing correlations", example: "Price vs. demand relationship" },
    { type: "Pie Charts", use: "Parts of a whole (use sparingly)", example: "Market share distribution" },
    { type: "Heat Maps", use: "Showing patterns in matrices", example: "User activity by time/day" }
  ];

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
    }
  };

  const canProceed = completedSections.length === sections.length;

  const handleNext = () => {
    navigate('/lesson-3');
  };

  return (
    <div className="visualization-and-clarity min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Visualization & Clarity</h1>
          <p className="text-xl text-gray-600">Transform complex data into clear visual stories</p>
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
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-green-500 text-white'
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
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <sections[currentSection].icon className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sections[currentSection].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Visualization Principle</h3>
              <p className="text-gray-700 leading-relaxed">
                {sections[currentSection].content}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3">Alex's Experience</h3>
              <p className="text-green-800 leading-relaxed">
                {sections[currentSection].alexStory}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Practical Example</h3>
              <p className="text-blue-800 leading-relaxed">
                {sections[currentSection].example}
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Key Insight</h3>
              <p className="text-yellow-800 font-medium">
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
                    : 'bg-green-500 text-white hover:bg-green-600'
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
                    className="px-4 py-2 text-green-600 hover:text-green-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Guidelines */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chart Selection Guide</h2>
          <div className="grid gap-4">
            {chartGuidelines.map((chart, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{chart.type}</h3>
                  <p className="text-gray-600 text-sm">{chart.use}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">{chart.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After Example */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transformation Example</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {visualizationExamples.map((example, index) => (
              <div key={index} className={`p-6 rounded-lg ${
                example.type === 'Before' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'
              }`}>
                <h3 className={`font-semibold mb-3 ${
                  example.type === 'Before' ? 'text-red-900' : 'text-green-900'
                }`}>
                  {example.type}: {example.description}
                </h3>
                <ul className="space-y-2">
                  {(example.problems || example.improvements)?.map((item, itemIndex) => (
                    <li key={itemIndex} className={`text-sm ${
                      example.type === 'Before' ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {example.type === 'Before' ? '❌' : '✅'} {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Activity</h2>
          <div className="bg-teal-50 rounded-lg p-6">
            <h3 className="font-semibold text-teal-900 mb-3">Visualization Audit</h3>
            <p className="text-teal-800 mb-4">
              Review your last data presentation and evaluate each chart:
            </p>
            <ul className="space-y-2 text-teal-800">
              <li>• Does the chart type match the data relationship?</li>
              <li>• Can you understand the key insight in 5 seconds?</li>
              <li>• Is color used strategically to highlight insights?</li>
              <li>• Could you remove any elements without losing meaning?</li>
              <li>• Would an interactive version add value?</li>
            </ul>
          </div>
        </div>

        {/* Next Lesson */}
        {canProceed && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-lg"
            >
              Continue to Technical Translation
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};