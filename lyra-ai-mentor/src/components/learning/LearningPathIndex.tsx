import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Sparkles, 
  Mail, 
  BarChart3, 
  Zap, 
  MessageSquare,
  Target,
  Brain,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LearningPathCard {
  id: string;
  title: string;
  character: string;
  characterColor: string;
  skill: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  outcomes: string[];
  route: string;
}

const learningPaths: LearningPathCard[] = [
  {
    id: 'maya-email',
    title: 'Email Mastery in 5 Minutes',
    character: 'Maya',
    characterColor: 'purple',
    skill: 'AI-Powered Email Writing',
    description: 'Transform 32-minute email struggles into 5-minute victories with the Email Recipe Method',
    duration: '5 minutes',
    icon: <Mail className="w-6 h-6" />,
    difficulty: 'Beginner',
    outcomes: [
      'Write emails 84% faster',
      'Master the 3-ingredient recipe',
      'Never stare at blank screen again'
    ],
    route: '/learning/maya-email'
  },
  {
    id: 'david-data',
    title: 'Data Stories That Inspire',
    character: 'David',
    characterColor: 'orange',
    skill: 'Data Storytelling',
    description: 'Turn boring spreadsheets into compelling narratives that drive action',
    duration: '5 minutes',
    icon: <BarChart3 className="w-6 h-6" />,
    difficulty: 'Beginner',
    outcomes: [
      'Find stories in any dataset',
      'Create 3x more engaging reports',
      'Drive 2x more decisions'
    ],
    route: '/learning/david-data'
  },
  {
    id: 'rachel-automation',
    title: 'Automate in 5 Minutes',
    character: 'Rachel',
    characterColor: 'blue',
    skill: 'Workflow Automation',
    description: 'Identify and automate repetitive tasks to save hours every week',
    duration: '5 minutes',
    icon: <Zap className="w-6 h-6" />,
    difficulty: 'Intermediate',
    outcomes: [
      'Save 10+ hours per week',
      'Automate repetitive tasks',
      'Focus on meaningful work'
    ],
    route: '/learning/rachel-automation'
  },
  {
    id: 'sofia-voice',
    title: 'Find Your Authentic Voice',
    character: 'Sofia',
    characterColor: 'pink',
    skill: 'Authentic Communication',
    description: 'Discover and amplify your unique voice to connect with any audience',
    duration: '5 minutes',
    icon: <MessageSquare className="w-6 h-6" />,
    difficulty: 'Beginner',
    outcomes: [
      'Write in your authentic voice',
      'Connect emotionally with readers',
      'Build trust through stories'
    ],
    route: '/learning/sofia-voice'
  },
  {
    id: 'alex-strategy',
    title: 'Strategic Thinking with AI',
    character: 'Alex',
    characterColor: 'green',
    skill: 'AI Strategy Planning',
    description: 'Use AI to create comprehensive strategies and make better decisions',
    duration: '5 minutes',
    icon: <Target className="w-6 h-6" />,
    difficulty: 'Advanced',
    outcomes: [
      'Create strategies 5x faster',
      'Consider all perspectives',
      'Make data-driven decisions'
    ],
    route: '/learning/alex-strategy'
  }
];

export const LearningPathIndex: React.FC = () => {
  const navigate = useNavigate();
  
  const getCharacterGradient = (color: string) => {
    const gradients = {
      purple: 'from-purple-600 to-purple-400',
      orange: 'from-orange-600 to-orange-400',
      blue: 'from-blue-600 to-blue-400',
      pink: 'from-pink-600 to-pink-400',
      green: 'from-green-600 to-green-400'
    };
    return gradients[color as keyof typeof gradients] || gradients.purple;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-yellow-100 text-yellow-800',
      Advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.Beginner;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          5-Minute AI Learning Paths
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master practical AI skills in focused 5-minute sessions. 
          Each path teaches you exactly what you need, when you need it.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">5 min</p>
            <p className="text-sm text-gray-600">Per lesson</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">3 steps</p>
            <p className="text-sm text-gray-600">Learn → Practice → Apply</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">80%</p>
            <p className="text-sm text-gray-600">Faster results</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">Real</p>
            <p className="text-sm text-gray-600">Practical skills</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <Card 
            key={path.id}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(path.route)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCharacterGradient(path.characterColor)} flex items-center justify-center text-white`}>
                  {path.icon}
                </div>
                <Badge className={getDifficultyColor(path.difficulty)}>
                  {path.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                {path.title}
              </CardTitle>
              <CardDescription className="mt-2">
                <span className="font-medium text-gray-900">{path.character}</span> • {path.skill}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {path.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  You'll learn to:
                </p>
                <ul className="space-y-1">
                  {path.outcomes.map((outcome, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{path.duration}</span>
                </div>
                <Button 
                  size="sm" 
                  className="group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                >
                  Start Learning
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
        <CardContent className="text-center py-12">
          <h3 className="text-2xl font-bold mb-4">
            Why 5-Minute Learning Works
          </h3>
          <div className="max-w-2xl mx-auto space-y-4 text-gray-700">
            <p>
              <strong>🧠 Focused Learning:</strong> One skill at a time prevents overwhelm
            </p>
            <p>
              <strong>⚡ Immediate Application:</strong> Practice while concepts are fresh
            </p>
            <p>
              <strong>🎯 Clear Outcomes:</strong> Know exactly what you'll achieve
            </p>
            <p>
              <strong>📈 Build Momentum:</strong> Small wins lead to big transformations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};