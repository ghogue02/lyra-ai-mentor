import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Target, Zap, Heart, Rocket } from 'lucide-react';
import { MayaEmailLearningPath } from '@/components/interactive/MayaEmailLearningPath';
import { DavidDataLearningPath } from '@/components/interactive/DavidDataLearningPath';
import { SofiaVoiceLearningPath } from '@/components/interactive/SofiaVoiceLearningPath';
import { RachelAutomationLearningPath } from '@/components/interactive/RachelAutomationLearningPath';
import { AlexChangeLearningPath } from '@/components/interactive/AlexChangeLearningPath';

const LearningPathCard = ({ 
  character, 
  title, 
  description, 
  estimatedTime, 
  difficulty, 
  skills,
  path,
  color,
  icon: Icon
}: {
  character: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  path: string;
  color: string;
  icon: React.ComponentType<any>;
}) => {
  const navigate = useNavigate();

  return (
    <Card className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${color}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
              <Icon className={`w-6 h-6 ${color.replace('border-l-', 'text-').replace('-500', '-600')}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{character}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${color.replace('border-l-', 'border-').replace('-500', '-200')}`}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{skills.length} skills</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={() => navigate(path)}
          className={`w-full ${color.replace('border-l-', 'bg-').replace('-500', '-600')} hover:${color.replace('border-l-', 'bg-').replace('-500', '-700')}`}
        >
          Start Learning Path
        </Button>
      </CardContent>
    </Card>
  );
};

const LearningPathsOverview = () => {
  const navigate = useNavigate();

  const learningPaths = [
    {
      character: "Maya Rodriguez",
      title: "Email Mastery in 5 Minutes",
      description: "Transform email anxiety into confidence. Learn the recipe method for AI-powered professional communication.",
      estimatedTime: "5 minutes",
      difficulty: "Beginner" as const,
      skills: ["AI Prompting", "Email Templates", "Professional Tone", "Time Management"],
      path: "/learning-paths/maya-email",
      color: "border-l-purple-500",
      icon: Heart
    },
    {
      character: "David Chen",
      title: "Data Storytelling in 5 Minutes", 
      description: "Turn dry numbers into compelling narratives that drive action and decisions.",
      estimatedTime: "5 minutes",
      difficulty: "Intermediate" as const,
      skills: ["Data Analysis", "Storytelling", "Visualization", "Impact Communication"],
      path: "/learning-paths/david-data",
      color: "border-l-blue-500",
      icon: Target
    },
    {
      character: "Sofia Martinez",
      title: "Find Your Voice in 5 Minutes",
      description: "Discover your authentic communication style and build confidence in any situation.",
      estimatedTime: "5 minutes", 
      difficulty: "Beginner" as const,
      skills: ["Voice Discovery", "Authentic Communication", "Confidence Building", "Personal Brand"],
      path: "/learning-paths/sofia-voice",
      color: "border-l-pink-500",
      icon: User
    },
    {
      character: "Rachel Thompson",
      title: "Automate Your First Task in 5 Minutes",
      description: "Build your first automation workflow and reclaim hours every week.",
      estimatedTime: "5 minutes",
      difficulty: "Intermediate" as const, 
      skills: ["Workflow Automation", "Process Design", "Efficiency", "Time Savings"],
      path: "/learning-paths/rachel-automation",
      color: "border-l-green-500",
      icon: Zap
    },
    {
      character: "Alex Rivera", 
      title: "Lead Change in 5 Minutes",
      description: "Create a custom roadmap for leading successful organizational transformation.",
      estimatedTime: "5 minutes",
      difficulty: "Advanced" as const,
      skills: ["Change Leadership", "Strategic Planning", "Team Management", "Transformation"],
      path: "/learning-paths/alex-strategy",
      color: "border-l-orange-500", 
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            5-Minute Learning Paths
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master new skills in just 5 minutes. Each path includes hands-on practice, 
            AI-powered tools, and real-world applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <LearningPathCard key={index} {...path} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">🚀 More Paths Coming Soon</h3>
              <p className="text-gray-600">
                We're building advanced learning paths for project management, 
                grant writing, volunteer coordination, and more!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function LearningPaths() {
  return (
    <Routes>
      <Route index element={<LearningPathsOverview />} />
      <Route path="maya-email" element={<MayaEmailLearningPath />} />
      <Route path="david-data" element={<DavidDataLearningPath />} />
      <Route path="sofia-voice" element={<SofiaVoiceLearningPath />} />
      <Route path="rachel-automation" element={<RachelAutomationLearningPath />} />
      <Route path="alex-strategy" element={<AlexChangeLearningPath />} />
    </Routes>
  );
};