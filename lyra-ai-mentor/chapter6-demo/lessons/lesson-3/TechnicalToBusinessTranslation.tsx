import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, DollarSign, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';

export const TechnicalToBusinessTranslation: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      title: "Speaking Business Language",
      content: "Technical professionals often get lost in implementation details when business stakeholders need to understand outcomes and impacts. Learning to translate technical insights into business language is crucial for influence and decision-making.",
      alexStory: "I used to say 'Our customer churn rate increased 15% due to API latency issues.' Now I say 'We're losing $50K monthly in revenue because our app is too slow.' Same data, but one drives immediate action.",
      keyInsight: "Translate technical metrics into business impact and outcomes",
      icon: Users,
      example: "Technical: 'Database query performance degraded 40%' → Business: 'Customer wait times increased, risking $200K in lost sales'"
    },
    {
      title: "Connecting Data to Revenue",
      content: "Business leaders think in terms of revenue, costs, and growth. Every technical insight should connect to financial impact when possible. This transforms data from interesting to essential.",
      alexStory: "I analyzed our user engagement data and found that users who completed onboarding were 5x more likely to upgrade to premium. I presented this as 'Improving onboarding could increase our premium conversion rate from 8% to 20%, adding $2M in annual revenue.'",
      keyInsight: "Always connect technical findings to financial outcomes",
      icon: DollarSign,
      example: "User engagement patterns → Revenue opportunities and cost savings"
    },
    {
      title: "Risk Communication",
      content: "Technical risks need to be communicated in business terms. Instead of talking about system failures, talk about business continuity, customer satisfaction, and competitive advantage.",
      alexStory: "When our infrastructure needed upgrading, I stopped talking about 'technical debt' and started presenting 'business risk.' I showed how system downtime costs us $10K per hour and puts us at competitive disadvantage. The budget was approved immediately.",
      keyInsight: "Frame technical risks as business risks with clear consequences",
      icon: TrendingUp,
      example: "System vulnerabilities → Business continuity risks and competitive threats"
    },
    {
      title: "Actionable Recommendations",
      content: "Business stakeholders need clear next steps, not just insights. Every technical analysis should end with specific, prioritized recommendations that align with business goals.",
      alexStory: "I learned to structure my recommendations using the 'Impact vs. Effort' framework. Instead of listing 10 technical improvements, I present 3 initiatives ranked by business impact and implementation complexity.",
      keyInsight: "Provide clear, prioritized recommendations that drive business decisions",
      icon: ArrowRight,
      example: "Technical analysis → Prioritized action plan with business justification"
    }
  ];

  const translationExamples = [
    {
      technical: "The algorithm's precision score improved from 0.73 to 0.89",
      business: "Our recommendation engine now correctly identifies customer preferences 89% of the time, reducing returned items by 22%",
      impact: "Revenue protection and customer satisfaction"
    },
    {
      technical: "Database query response time decreased from 2.1s to 0.4s",
      business: "Page load times improved by 80%, reducing customer abandonment during checkout",
      impact: "Conversion rate and sales improvement"
    },
    {
      technical: "API endpoint availability increased to 99.95%",
      business: "System downtime reduced from 4 hours to 20 minutes monthly, improving customer experience",
      impact: "Customer retention and brand protection"
    }
  ];

  const businessFrameworks = [
    {
      name: "Revenue Impact",
      description: "Connect findings to sales, conversion, or pricing opportunities",
      questions: ["How does this affect our bottom line?", "What's the revenue opportunity?", "How much could we save?"]
    },
    {
      name: "Customer Impact",
      description: "Translate metrics into customer experience and satisfaction",
      questions: ["How does this affect our customers?", "What's the user experience impact?", "Does this improve retention?"]
    },
    {
      name: "Competitive Advantage",
      description: "Frame insights in terms of market position and differentiation",
      questions: ["How does this compare to competitors?", "What's our competitive advantage?", "Are we falling behind?"]
    },
    {
      name: "Risk Mitigation",
      description: "Present technical risks as business continuity concerns",
      questions: ["What's the business risk?", "What happens if we don't act?", "How do we protect the business?"]
    }
  ];

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
    }
  };

  const canProceed = completedSections.length === sections.length;

  const handleNext = () => {
    navigate('/lesson-4');
  };

  return (
    <div className="technical-to-business-translation min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Technical to Business Translation</h1>
          <p className="text-xl text-gray-600">Bridge the gap between technical insights and business impact</p>
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
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-purple-500 text-white'
                    : completedSections.includes(index)
                    ? 'bg-purple-100 text-purple-700'
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
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <sections[currentSection].icon className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sections[currentSection].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Translation Strategy</h3>
              <p className="text-gray-700 leading-relaxed">
                {sections[currentSection].content}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-3">Alex's Experience</h3>
              <p className="text-purple-800 leading-relaxed">
                {sections[currentSection].alexStory}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Translation Example</h3>
              <p className="text-blue-800 leading-relaxed">
                {sections[currentSection].example}
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
                    ? 'bg-purple-100 text-purple-700 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
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
                    className="px-4 py-2 text-purple-600 hover:text-purple-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translation Examples */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Translation Examples</h2>
          <div className="space-y-6">
            {translationExamples.map((example, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-6">
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Technical Language</h3>
                    <p className="text-red-800">{example.technical}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Business Language</h3>
                    <p className="text-green-800">{example.business}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Business Impact</h3>
                    <p className="text-blue-800">{example.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Frameworks */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Communication Frameworks</h2>
          <div className="grid gap-6">
            {businessFrameworks.map((framework, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{framework.name}</h3>
                <p className="text-gray-700 mb-4">{framework.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Key Questions:</h4>
                  <ul className="space-y-1">
                    {framework.questions.map((question, qIndex) => (
                      <li key={qIndex} className="text-gray-600 text-sm">• {question}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Activity</h2>
          <div className="bg-pink-50 rounded-lg p-6">
            <h3 className="font-semibold text-pink-900 mb-3">Technical Translation Challenge</h3>
            <p className="text-pink-800 mb-4">
              Take a recent technical finding from your work and practice translating it:
            </p>
            <ul className="space-y-2 text-pink-800">
              <li>• Write your technical finding in precise technical language</li>
              <li>• Translate it into business impact language</li>
              <li>• Connect it to revenue, cost savings, or customer impact</li>
              <li>• Frame it as a business risk or opportunity</li>
              <li>• Create a specific, actionable recommendation</li>
            </ul>
          </div>
        </div>

        {/* Next Lesson */}
        {canProceed && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
            >
              Continue to Stakeholder Presentation Mastery
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};