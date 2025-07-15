import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresentationChart, Users, Clock, Target, CheckCircle, ChevronRight } from 'lucide-react';

export const StakeholderPresentationMastery: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    {
      title: "Executive Presentation Strategy",
      content: "Presenting to executives requires a completely different approach than technical presentations. Executives need the bottom line first, clear recommendations, and time-efficient delivery. They're making decisions, not learning technical details.",
      alexStory: "I learned this the hard way when I presented a detailed analysis to our CEO and got cut off after 2 minutes. Now I start every executive presentation with the key recommendation and business impact. The CEO gets what they need immediately, then I can provide supporting details if requested.",
      keyInsight: "Lead with conclusions and business impact, not technical methodology",
      icon: Target,
      framework: "Bottom Line Up Front (BLUF): Recommendation → Impact → Supporting Evidence"
    },
    {
      title: "Stakeholder Mapping",
      content: "Different stakeholders have different priorities and decision-making authority. Understanding each audience helps you tailor your message and approach for maximum impact.",
      alexStory: "I created stakeholder personas for our quarterly reviews. The CFO wants ROI numbers, the CTO wants technical feasibility, and the VP of Sales wants customer impact. Same data, three different presentations, each focused on their specific concerns.",
      keyInsight: "Customize your message for each stakeholder's priorities and decision-making role",
      icon: Users,
      framework: "Stakeholder Matrix: Influence vs. Interest, customized messaging for each quadrant"
    },
    {
      title: "Time Management",
      content: "Executives have limited time and attention. Structure your presentations to deliver maximum value in minimum time. Always prepare multiple versions: 2-minute, 10-minute, and full presentations.",
      alexStory: "I now prepare every presentation with a 'pyramid structure.' I can deliver the core message in 2 minutes, expand to 10 minutes with key details, or go full 30 minutes with comprehensive analysis. This flexibility has saved me countless times when meetings run short.",
      keyInsight: "Prepare multiple presentation lengths to respect stakeholder time constraints",
      icon: Clock,
      framework: "Pyramid Structure: Core message → Key details → Comprehensive analysis"
    },
    {
      title: "Handling Questions and Objections",
      content: "Stakeholder questions often reveal concerns, objections, or different priorities. Learning to address these effectively builds credibility and drives decision-making.",
      alexStory: "When presenting our customer analytics findings, the VP of Marketing challenged our methodology. Instead of getting defensive, I acknowledged their expertise and showed how our findings aligned with their customer insights. This collaboration led to better buy-in and implementation.",
      keyInsight: "Use questions and objections as opportunities to build alignment and credibility",
      icon: PresentationChart,
      framework: "AEIOU Method: Acknowledge → Explore → Inform → Options → Unity"
    }
  ];

  const presentationStructures = [
    {
      audience: "C-Suite Executives",
      structure: "BLUF → Business Impact → Key Recommendations → Q&A",
      duration: "5-10 minutes",
      focus: "Strategic decisions and ROI"
    },
    {
      audience: "Department VPs",
      structure: "Problem → Analysis → Solution → Implementation → Resources",
      duration: "15-20 minutes",
      focus: "Operational impact and resource allocation"
    },
    {
      audience: "Technical Teams",
      structure: "Context → Methodology → Findings → Technical Implications → Next Steps",
      duration: "30-45 minutes",
      focus: "Technical accuracy and implementation details"
    },
    {
      audience: "Board Members",
      structure: "Strategic Context → Key Metrics → Risks & Opportunities → Recommendations",
      duration: "3-5 minutes",
      focus: "Governance and strategic oversight"
    }
  ];

  const questionHandlingTechniques = [
    {
      type: "Clarifying Questions",
      technique: "Acknowledge and explore the underlying concern",
      example: "That's an important point. Help me understand your specific concern about implementation timeline."
    },
    {
      type: "Challenging Questions",
      technique: "Validate their expertise while presenting your evidence",
      example: "You bring valuable experience to this discussion. Let me show you how our data supports this conclusion."
    },
    {
      type: "Tangential Questions",
      technique: "Acknowledge and redirect to core message",
      example: "That's a great question for follow-up. Let me address it after covering the key decision points."
    },
    {
      type: "Hostile Questions",
      technique: "Stay calm, find common ground, focus on shared goals",
      example: "I understand your concern about disruption. We both want to minimize risk while improving outcomes."
    }
  ];

  const handleSectionComplete = (sectionIndex: number) => {
    if (!completedSections.includes(sectionIndex)) {
      setCompletedSections([...completedSections, sectionIndex]);
    }
  };

  const canProceed = completedSections.length === sections.length;

  const handleNext = () => {
    navigate('/lesson-5');
  };

  return (
    <div className="stakeholder-presentation-mastery min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <PresentationChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stakeholder Presentation Mastery</h1>
          <p className="text-xl text-gray-600">Master the art of executive and stakeholder communication</p>
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
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
                    ? 'bg-orange-500 text-white'
                    : completedSections.includes(index)
                    ? 'bg-orange-100 text-orange-700'
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
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <sections[currentSection].icon className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sections[currentSection].title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Presentation Principle</h3>
              <p className="text-gray-700 leading-relaxed">
                {sections[currentSection].content}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="font-semibold text-orange-900 mb-3">Alex's Experience</h3>
              <p className="text-orange-800 leading-relaxed">
                {sections[currentSection].alexStory}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Framework</h3>
              <p className="text-blue-800 leading-relaxed">
                {sections[currentSection].framework}
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
                    ? 'bg-orange-100 text-orange-700 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
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
                    className="px-4 py-2 text-orange-600 hover:text-orange-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Presentation Structures */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Presentation Structures by Audience</h2>
          <div className="grid gap-6">
            {presentationStructures.map((structure, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{structure.audience}</h3>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {structure.duration}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{structure.structure}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Focus:</span> {structure.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Handling */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Handling Techniques</h2>
          <div className="space-y-4">
            {questionHandlingTechniques.map((technique, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{technique.type}</h3>
                <p className="text-gray-700 mb-2">{technique.technique}</p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-orange-800 italic">"{technique.example}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Activity</h2>
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">Stakeholder Presentation Prep</h3>
            <p className="text-red-800 mb-4">
              Plan your next stakeholder presentation using Alex's framework:
            </p>
            <ul className="space-y-2 text-red-800">
              <li>• Identify your stakeholders and their priorities</li>
              <li>• Choose the appropriate presentation structure</li>
              <li>• Prepare your BLUF statement (Bottom Line Up Front)</li>
              <li>• Anticipate likely questions and prepare responses</li>
              <li>• Create 2-minute, 10-minute, and full versions</li>
            </ul>
          </div>
        </div>

        {/* Next Lesson */}
        {canProceed && (
          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
            >
              Continue to Communication Workshops
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};