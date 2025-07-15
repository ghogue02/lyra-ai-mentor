import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Zap, Brain, Target } from 'lucide-react';

const skills = [
  {
    category: 'Communication',
    skills: [
      { name: 'Email Writing', progress: 80, level: 'Advanced' },
      { name: 'Grant Proposals', progress: 65, level: 'Intermediate' },
      { name: 'Social Media', progress: 90, level: 'Expert' },
      { name: 'Report Writing', progress: 70, level: 'Advanced' }
    ]
  },
  {
    category: 'Data & Analytics',
    skills: [
      { name: 'Data Storytelling', progress: 55, level: 'Intermediate' },
      { name: 'Visualization', progress: 45, level: 'Beginner' },
      { name: 'Impact Metrics', progress: 75, level: 'Advanced' },
      { name: 'Trend Analysis', progress: 60, level: 'Intermediate' }
    ]
  },
  {
    category: 'Automation',
    skills: [
      { name: 'Workflow Design', progress: 85, level: 'Advanced' },
      { name: 'Process Optimization', progress: 70, level: 'Advanced' },
      { name: 'Task Automation', progress: 95, level: 'Expert' },
      { name: 'AI Integration', progress: 80, level: 'Advanced' }
    ]
  }
];

export default function SkillsDashboard() {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'default';
      case 'Advanced': return 'secondary';
      case 'Intermediate': return 'outline';
      default: return 'outline';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your AI Skills Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress in mastering AI tools for nonprofit work
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Award className="h-8 w-8 text-yellow-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-500">Skills Unlocked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Zap className="h-8 w-8 text-purple-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-gray-500">Expert Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Brain className="h-8 w-8 text-blue-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">72%</p>
                  <p className="text-xs text-gray-500">Overall Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Target className="h-8 w-8 text-green-500" />
                <div className="text-right">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-gray-500">Goals Achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills by Category */}
        <div className="space-y-8">
          {skills.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category} Skills</CardTitle>
                <CardDescription>
                  Your progress in {category.category.toLowerCase()} AI tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <Badge variant={getLevelColor(skill.level) as any}>
                          {skill.level}
                        </Badge>
                      </div>
                      <Progress 
                        value={skill.progress} 
                        className="h-2"
                        indicatorClassName={getProgressColor(skill.progress)}
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {skill.progress}% Complete
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Recommended Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Complete Data Visualization basics to unlock advanced analytics</li>
              <li>• Practice more Grant Proposals to reach Advanced level</li>
              <li>• Try the AI Playground scenarios for hands-on experience</li>
            </ul>
            <Button 
              onClick={() => navigate('/ai-playground')}
              className="mt-4"
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}