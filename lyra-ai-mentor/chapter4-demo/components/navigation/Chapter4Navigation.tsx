// Chapter 4 David Chen Navigation Component
// Leadership Communication Navigation System

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Presentation,
  BookOpen,
  Award,
  ArrowRight,
  Clock
} from 'lucide-react';

interface Chapter4NavigationProps {
  currentLesson?: number;
  userProgress?: {
    lessonsCompleted: number[];
    workshopsCompleted: number[];
    overallProgress: number;
  };
  onLessonSelect?: (lessonId: number) => void;
  onWorkshopSelect?: (workshopId: number) => void;
}

const Chapter4Navigation: React.FC<Chapter4NavigationProps> = ({
  currentLesson = 0,
  userProgress = { lessonsCompleted: [], workshopsCompleted: [], overallProgress: 0 },
  onLessonSelect,
  onWorkshopSelect
}) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'workshops' | 'progress'>('lessons');

  const lessons = [
    {
      id: 1,
      title: 'Leadership Communication Foundations',
      subtitle: 'Building Your Leadership Voice',
      description: 'Master the fundamental principles of leadership communication and develop your authentic leadership voice.',
      duration: '45 minutes',
      difficulty: 'Beginner',
      icon: MessageSquare,
      color: 'blue',
      objectives: [
        'Understand core principles of leadership communication',
        'Develop authentic leadership voice and presence',
        'Learn to adapt communication style to different audiences',
        'Master the art of influential messaging',
        'Build confidence in leadership communication'
      ]
    },
    {
      id: 2,
      title: 'Team Building Through Communication',
      subtitle: 'Creating High-Performing Teams',
      description: 'Learn how to use communication as a tool for building trust, fostering collaboration, and creating psychological safety.',
      duration: '50 minutes',
      difficulty: 'Intermediate',
      icon: Users,
      color: 'green',
      objectives: [
        'Build trust through transparent communication',
        'Foster collaboration and psychological safety',
        'Master team meeting facilitation',
        'Handle team conflicts effectively',
        'Create communication norms that drive performance'
      ]
    },
    {
      id: 3,
      title: 'Managing Up and Down',
      subtitle: 'Multi-Directional Leadership',
      description: 'Master the art of communicating effectively with executives, peers, and direct reports.',
      duration: '55 minutes',
      difficulty: 'Advanced',
      icon: TrendingUp,
      color: 'purple',
      objectives: [
        'Communicate effectively with senior leadership',
        'Influence without authority across peer groups',
        'Provide clear direction to direct reports',
        'Navigate complex organizational dynamics',
        'Build relationships that drive results'
      ]
    },
    {
      id: 4,
      title: 'Crisis Communication Leadership',
      subtitle: 'Leading Through Uncertainty',
      description: 'Learn to communicate effectively during crises, maintaining team confidence and stakeholder trust.',
      duration: '60 minutes',
      difficulty: 'Advanced',
      icon: AlertTriangle,
      color: 'red',
      objectives: [
        'Communicate clearly under pressure',
        'Maintain team confidence during crises',
        'Manage stakeholder expectations effectively',
        'Make decisions with incomplete information',
        'Build organizational resilience through communication'
      ]
    },
    {
      id: 5,
      title: 'Executive Communication Workshops',
      subtitle: 'Mastering Advanced Leadership Communication',
      description: 'Four intensive workshops focusing on advanced leadership communication skills.',
      duration: '90 minutes',
      difficulty: 'Advanced',
      icon: Presentation,
      color: 'orange',
      objectives: [
        'Master one-on-one conversation skills',
        'Facilitate engaging and productive team meetings',
        'Deliver compelling executive presentations',
        'Lead organizational change through communication',
        'Integrate all leadership communication skills'
      ]
    }
  ];

  const workshops = [
    {
      id: 1,
      title: 'One-on-One Conversation Mastery',
      subtitle: 'Building Relationships That Drive Results',
      description: 'Master the art of one-on-one conversations that build trust, drive performance, and develop people.',
      duration: '2 hours',
      difficulty: 'Advanced',
      skills: ['Coaching conversations', 'Feedback delivery', 'Difficult conversations', 'Relationship building']
    },
    {
      id: 2,
      title: 'Team Meeting Facilitation',
      subtitle: 'Transforming Meetings Into Powerful Team Tools',
      description: 'Learn to facilitate meetings that energize teams, drive decisions, and build alignment.',
      duration: '2 hours',
      difficulty: 'Advanced',
      skills: ['Meeting design', 'Facilitation techniques', 'Group dynamics', 'Decision making']
    },
    {
      id: 3,
      title: 'Executive Presentation Skills',
      subtitle: 'Influencing at the Highest Levels',
      description: 'Master the art of presenting to executives and senior leaders with gravitas and influence.',
      duration: '2 hours',
      difficulty: 'Expert',
      skills: ['Executive communication', 'Presentation structure', 'Handling pressure', 'Strategic thinking']
    },
    {
      id: 4,
      title: 'Change Communication Strategy',
      subtitle: 'Leading Organizational Transformation',
      description: 'Master the art of communicating change across large organizations.',
      duration: '2 hours',
      difficulty: 'Expert',
      skills: ['Strategic planning', 'Stakeholder management', 'Resistance management', 'Change leadership']
    }
  ];

  const isLessonUnlocked = (lessonId: number) => {
    if (lessonId === 1) return true;
    return userProgress.lessonsCompleted.includes(lessonId - 1);
  };

  const isWorkshopUnlocked = (workshopId: number) => {
    return userProgress.lessonsCompleted.includes(4); // All lessons must be completed
  };

  const getLessonStatus = (lessonId: number) => {
    if (userProgress.lessonsCompleted.includes(lessonId)) return 'completed';
    if (currentLesson === lessonId) return 'current';
    if (isLessonUnlocked(lessonId)) return 'available';
    return 'locked';
  };

  const getWorkshopStatus = (workshopId: number) => {
    if (userProgress.workshopsCompleted.includes(workshopId)) return 'completed';
    if (isWorkshopUnlocked(workshopId)) return 'available';
    return 'locked';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">DC</span>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Chapter 4: Leading Through Communication</h1>
            <p className="text-lg text-gray-600">with David Chen, Senior Director of Engineering</p>
          </div>
        </div>
        
        <Card className="border-blue-200 bg-blue-50 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <p className="text-blue-800 italic text-lg">
              "Great leaders aren't born - they're made through great communication. Let me show you how to transform your technical expertise into leadership impact."
            </p>
            <p className="text-blue-700 mt-2 font-medium">- David Chen</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Chapter Completion</span>
              <span className="text-sm text-gray-500">{userProgress.overallProgress}% complete</span>
            </div>
            <Progress value={userProgress.overallProgress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{userProgress.lessonsCompleted.length}/5 lessons completed</span>
              <span>{userProgress.workshopsCompleted.length}/4 workshops completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-2">
        {['lessons', 'workshops', 'progress'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab as any)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Communication Lessons</CardTitle>
              <p className="text-gray-600">Build your leadership communication skills step by step</p>
            </CardHeader>
          </Card>

          <div className="grid gap-6">
            {lessons.map((lesson) => {
              const status = getLessonStatus(lesson.id);
              const IconComponent = lesson.icon;
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`border-l-4 ${
                    status === 'completed' ? 'border-l-green-500 bg-green-50' :
                    status === 'current' ? 'border-l-blue-500 bg-blue-50' :
                    status === 'available' ? 'border-l-gray-300' :
                    'border-l-gray-200 bg-gray-50'
                  } transition-all duration-200 hover:shadow-md`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                          {status === 'current' && <Circle className="h-6 w-6 text-blue-500 fill-current" />}
                          {status === 'available' && <Circle className="h-6 w-6 text-gray-400" />}
                          {status === 'locked' && <Lock className="h-6 w-6 text-gray-300" />}
                          <IconComponent className={`h-6 w-6 ${
                            status === 'locked' ? 'text-gray-300' : `text-${lesson.color}-500`
                          }`} />
                        </div>
                        <div>
                          <CardTitle className={status === 'locked' ? 'text-gray-400' : ''}>
                            Lesson {lesson.id}: {lesson.title}
                          </CardTitle>
                          <p className={`text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {lesson.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={status === 'locked' ? 'text-gray-400' : 'text-gray-700'}>
                      {lesson.description}
                    </p>
                    
                    <div>
                      <h4 className={`font-semibold mb-2 ${status === 'locked' ? 'text-gray-400' : ''}`}>
                        Learning Objectives:
                      </h4>
                      <ul className="space-y-1">
                        {lesson.objectives.slice(0, 3).map((objective, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-sm ${
                            status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <span className={`mt-1 ${
                              status === 'locked' ? 'text-gray-300' : `text-${lesson.color}-500`
                            }`}>•</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                        {lesson.objectives.length > 3 && (
                          <li className={`text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-500'}`}>
                            +{lesson.objectives.length - 3} more objectives
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-2">
                        {status === 'completed' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                        {status === 'current' && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => onLessonSelect?.(lesson.id)}
                        disabled={status === 'locked'}
                        variant={status === 'current' ? 'default' : 'outline'}
                        className="flex items-center gap-2"
                      >
                        {status === 'completed' ? 'Review' : 
                         status === 'current' ? 'Continue' : 
                         status === 'available' ? 'Start Lesson' : 'Locked'}
                        {status !== 'locked' && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Workshops Tab */}
      {activeTab === 'workshops' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Executive Communication Workshops</CardTitle>
              <p className="text-gray-600">Advanced hands-on workshops for leadership communication mastery</p>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Prerequisites</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  Complete all five lessons to unlock the executive communication workshops
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {workshops.map((workshop) => {
              const status = getWorkshopStatus(workshop.id);
              
              return (
                <Card 
                  key={workshop.id} 
                  className={`border-l-4 ${
                    status === 'completed' ? 'border-l-green-500 bg-green-50' :
                    status === 'available' ? 'border-l-orange-500' :
                    'border-l-gray-200 bg-gray-50'
                  } transition-all duration-200 hover:shadow-md`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                          {status === 'available' && <Circle className="h-6 w-6 text-orange-500" />}
                          {status === 'locked' && <Lock className="h-6 w-6 text-gray-300" />}
                          <Presentation className={`h-6 w-6 ${
                            status === 'locked' ? 'text-gray-300' : 'text-orange-500'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className={status === 'locked' ? 'text-gray-400' : ''}>
                            Workshop {workshop.id}: {workshop.title}
                          </CardTitle>
                          <p className={`text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {workshop.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(workshop.difficulty)}>
                          {workshop.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{workshop.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={status === 'locked' ? 'text-gray-400' : 'text-gray-700'}>
                      {workshop.description}
                    </p>
                    
                    <div>
                      <h4 className={`font-semibold mb-2 ${status === 'locked' ? 'text-gray-400' : ''}`}>
                        Key Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {workshop.skills.map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className={status === 'locked' ? 'text-gray-400 border-gray-300' : ''}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-2">
                        {status === 'completed' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => onWorkshopSelect?.(workshop.id)}
                        disabled={status === 'locked'}
                        variant={status === 'available' ? 'default' : 'outline'}
                        className="flex items-center gap-2"
                      >
                        {status === 'completed' ? 'Review' : 
                         status === 'available' ? 'Start Workshop' : 'Locked'}
                        {status !== 'locked' && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <p className="text-gray-600">Track your journey through David's leadership communication program</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Lessons Progress</h3>
                  {lessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id);
                    return (
                      <div key={lesson.id} className="flex items-center gap-3">
                        {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {status === 'current' && <Circle className="h-5 w-5 text-blue-500 fill-current" />}
                        {status === 'available' && <Circle className="h-5 w-5 text-gray-400" />}
                        {status === 'locked' && <Lock className="h-5 w-5 text-gray-300" />}
                        <span className={`text-sm ${status === 'locked' ? 'text-gray-400' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Workshops Progress</h3>
                  {workshops.map((workshop) => {
                    const status = getWorkshopStatus(workshop.id);
                    return (
                      <div key={workshop.id} className="flex items-center gap-3">
                        {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {status === 'available' && <Circle className="h-5 w-5 text-orange-500" />}
                        {status === 'locked' && <Lock className="h-5 w-5 text-gray-300" />}
                        <span className={`text-sm ${status === 'locked' ? 'text-gray-400' : ''}`}>
                          {workshop.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Chapter4Navigation;