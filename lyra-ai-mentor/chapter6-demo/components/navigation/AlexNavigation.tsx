import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, PresentationChart, Workshop } from 'lucide-react';

export const AlexNavigation: React.FC = () => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/', label: 'Alex Rivera', icon: BarChart3, description: 'Meet Alex' },
    { path: '/lesson-1', label: 'Foundations', icon: BarChart3, description: 'Data Communication Basics' },
    { path: '/lesson-2', label: 'Visualization', icon: TrendingUp, description: 'Visual Clarity' },
    { path: '/lesson-3', label: 'Translation', icon: Users, description: 'Technical to Business' },
    { path: '/lesson-4', label: 'Presentation', icon: PresentationChart, description: 'Stakeholder Mastery' },
    { path: '/lesson-5', label: 'Workshops', icon: Workshop, description: 'Practice Sessions' }
  ];

  return (
    <nav className="alex-navigation bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AR</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Chapter 6: Alex Rivera</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={item.description}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Data Communication Journey</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {navigationItems.slice(1).map((item, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      location.pathname === item.path ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};