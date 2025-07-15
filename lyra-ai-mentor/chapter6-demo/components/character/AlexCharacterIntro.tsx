import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, PresentationChart } from 'lucide-react';

export const AlexCharacterIntro: React.FC = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);

  const alexStories = [
    {
      title: "The Data Analyst's Dilemma",
      content: "I started as a data analyst, buried in spreadsheets and SQL queries. I could find amazing insights, but nobody understood what I was trying to tell them. My presentations were technical masterpieces that put executives to sleep.",
      visual: <BarChart3 className="w-16 h-16 text-blue-500" />,
      lesson: "Technical expertise alone isn't enough"
    },
    {
      title: "The Visualization Breakthrough",
      content: "One day, I replaced a 20-slide technical presentation with a single interactive dashboard. The CEO understood our customer churn problem instantly. That's when I realized: data communication is about clarity, not complexity.",
      visual: <TrendingUp className="w-16 h-16 text-green-500" />,
      lesson: "Visual clarity transforms understanding"
    },
    {
      title: "Building Bridges",
      content: "I became the translator between our technical team and business stakeholders. Every data story I told connected numbers to business outcomes. I learned that great data communication makes everyone smarter.",
      visual: <Users className="w-16 h-16 text-purple-500" />,
      lesson: "Communication builds understanding"
    },
    {
      title: "The Master Presenter",
      content: "Now I help organizations turn their data into compelling stories. Whether it's a technical deep-dive or an executive summary, I know how to make complex information accessible and actionable.",
      visual: <PresentationChart className="w-16 h-16 text-orange-500" />,
      lesson: "Great communication drives action"
    }
  ];

  const handleStartJourney = () => {
    navigate('/lesson-1');
  };

  return (
    <div className="alex-character-intro min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">AR</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Alex Rivera</h1>
            <p className="text-xl text-gray-600">Data Communication Expert</p>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            "Data tells a story, but only if you know how to listen—and more importantly, how to translate that story for others."
          </p>
        </div>

        {/* Story Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {alexStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStory ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="mb-6">
              {alexStories[currentStory].visual}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {alexStories[currentStory].title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {alexStories[currentStory].content}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-semibold">
                Key Insight: {alexStories[currentStory].lesson}
              </p>
            </div>
          </div>
        </div>

        {/* Alex's Expertise */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You'll Learn With Alex
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Data Communication Foundations</h3>
                  <p className="text-gray-600">Transform complex data into clear, actionable insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Visualization Mastery</h3>
                  <p className="text-gray-600">Create compelling visual stories that drive understanding</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Technical Translation</h3>
                  <p className="text-gray-600">Bridge the gap between technical and business teams</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <PresentationChart className="w-6 h-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Presentation Excellence</h3>
                  <p className="text-gray-600">Master stakeholder presentations and executive communication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={handleStartJourney}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Start Your Data Communication Journey
          </button>
          <p className="text-gray-600 mt-4">
            Transform your technical expertise into powerful communication skills
          </p>
        </div>
      </div>
    </div>
  );
};