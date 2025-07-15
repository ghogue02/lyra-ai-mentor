import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workshop, BookOpen, BarChart3, Users, PresentationChart, CheckCircle } from 'lucide-react';

export const DataCommunicationWorkshops: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
  const [completedWorkshops, setCompletedWorkshops] = useState<string[]>([]);

  const workshops = [
    {
      id: 'data-storytelling',
      title: 'Data Storytelling Workshop',
      description: 'Transform raw data into compelling narratives that drive action',
      duration: '45 minutes',
      level: 'Intermediate',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      skills: ['Narrative structure', 'Data synthesis', 'Audience engagement', 'Action-oriented conclusions'],
      activities: [
        'Analyze a complex dataset and identify key insights',
        'Create a compelling narrative arc from data findings',
        'Practice the "So What?" framework for business impact',
        'Develop clear recommendations and next steps'
      ],
      outcome: 'Master the art of turning data into actionable business stories'
    },
    {
      id: 'dashboard-design',
      title: 'Dashboard Design Studio',
      description: 'Create intuitive, actionable dashboards that inform decision-making',
      duration: '60 minutes',
      level: 'Intermediate',
      icon: BarChart3,
      color: 'from-green-500 to-teal-600',
      skills: ['Visual hierarchy', 'User experience', 'Information architecture', 'Interactive design'],
      activities: [
        'Audit an existing dashboard for usability issues',
        'Design a stakeholder-focused dashboard layout',
        'Practice color and typography for clarity',
        'Create interactive elements that enhance understanding'
      ],
      outcome: 'Design dashboards that drive immediate understanding and action'
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary Mastery',
      description: 'Master the art of concise, high-impact executive communication',
      duration: '30 minutes',
      level: 'Advanced',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      skills: ['Concise writing', 'Strategic thinking', 'Executive mindset', 'Decision support'],
      activities: [
        'Write a one-page executive summary from complex analysis',
        'Practice the "inverted pyramid" structure',
        'Develop key metrics and KPI reporting',
        'Create actionable recommendations for C-suite'
      ],
      outcome: 'Write executive summaries that get read and drive decisions'
    },
    {
      id: 'technical-presentation',
      title: 'Technical Presentation Lab',
      description: 'Present complex technical concepts to non-technical stakeholders',
      duration: '50 minutes',
      level: 'Advanced',
      icon: PresentationChart,
      color: 'from-orange-500 to-red-600',
      skills: ['Technical translation', 'Audience adaptation', 'Visual aids', 'Q&A handling'],
      activities: [
        'Present a technical concept to a business audience',
        'Practice using analogies and metaphors',
        'Handle challenging questions and objections',
        'Adapt presentation style in real-time'
      ],
      outcome: 'Present technical concepts that any audience can understand and act upon'
    }
  ];

  const handleWorkshopStart = (workshopId: string) => {
    setSelectedWorkshop(workshopId);
    navigate(`/lesson-5/${workshopId}`);
  };

  const handleWorkshopComplete = (workshopId: string) => {
    if (!completedWorkshops.includes(workshopId)) {
      setCompletedWorkshops([...completedWorkshops, workshopId]);
    }
  };

  const allWorkshopsCompleted = completedWorkshops.length === workshops.length;

  return (
    <div className="data-communication-workshops min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Workshop className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Communication Workshops</h1>
          <p className="text-xl text-gray-600">Practice your skills with hands-on communication challenges</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Workshop Progress</h2>
            <span className="text-sm text-gray-600">
              {completedWorkshops.length} of {workshops.length} workshops completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedWorkshops.length / workshops.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Alex's Workshop Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AR</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Alex's Workshop Philosophy</h2>
              <p className="text-gray-700 leading-relaxed">
                "These workshops are designed to simulate real-world communication challenges I've faced throughout my career. 
                Each one focuses on a specific scenario where technical professionals often struggle. You'll practice with realistic 
                data and stakeholder situations, building muscle memory for clear, effective communication."
              </p>
            </div>
          </div>
        </div>

        {/* Workshop Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {workshops.map((workshop) => {
            const Icon = workshop.icon;
            const isCompleted = completedWorkshops.includes(workshop.id);
            
            return (
              <div key={workshop.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${workshop.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{workshop.title}</h3>
                        <p className="text-white text-opacity-90 text-sm">
                          {workshop.duration} • {workshop.level}
                        </p>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{workshop.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Skills You'll Practice</h4>
                    <div className="flex flex-wrap gap-2">
                      {workshop.skills.map((skill, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Workshop Activities</h4>
                    <ul className="space-y-1">
                      {workshop.activities.map((activity, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Expected Outcome</h4>
                    <p className="text-sm text-gray-700">{workshop.outcome}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleWorkshopStart(workshop.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-indigo-500 text-white hover:bg-indigo-600'
                      }`}
                    >
                      {isCompleted ? 'Review Workshop' : 'Start Workshop'}
                    </button>
                    {isCompleted && (
                      <button
                        onClick={() => handleWorkshopComplete(workshop.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium"
                      >
                        ✓ Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workshop Sequence Guidance */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Workshop Sequence</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-blue-900">Start with Data Storytelling</h3>
                <p className="text-blue-800 text-sm">Build the foundation of narrative structure and business impact</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-green-900">Practice Dashboard Design</h3>
                <p className="text-green-800 text-sm">Apply visual principles to create clear, actionable dashboards</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-purple-900">Master Executive Summaries</h3>
                <p className="text-purple-800 text-sm">Distill complex analysis into executive-ready communication</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold text-orange-900">Complete Technical Presentations</h3>
                <p className="text-orange-800 text-sm">Integrate all skills in comprehensive stakeholder presentations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Recognition */}
        {allWorkshopsCompleted && (
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-white text-lg mb-4">
              You've completed all of Alex's Data Communication Workshops
            </p>
            <p className="text-white text-opacity-90">
              You now have the skills to transform complex technical insights into clear, 
              actionable business communication that drives results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};