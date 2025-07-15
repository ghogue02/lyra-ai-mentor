import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Award, TrendingUp, Clock } from 'lucide-react';

export default function SkillsDashboardPage() {
  const navigate = useNavigate();

  const skills = [
    { name: "Prompt Engineering", progress: 75, level: "Advanced" },
    { name: "AI Writing", progress: 60, level: "Intermediate" },
    { name: "Data Analysis", progress: 40, level: "Beginner" },
    { name: "Image Generation", progress: 30, level: "Beginner" },
    { name: "Code Assistance", progress: 85, level: "Expert" }
  ];

  const achievements = [
    { title: "First AI Prompt", icon: Star, color: "text-yellow-500" },
    { title: "Content Creator", icon: Award, color: "text-purple-500" },
    { title: "Data Explorer", icon: TrendingUp, color: "text-blue-500" },
    { title: "Quick Learner", icon: Clock, color: "text-green-500" }
  ];

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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skills Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your AI skills growth and mastery levels
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skills Progress</CardTitle>
              <CardDescription>Your current skill levels and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                  <div className="text-right text-sm text-gray-500">
                    {skill.progress}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Milestones you've unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
                    <span className="font-medium">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Learning Recommendations</CardTitle>
            <CardDescription>Suggested next steps based on your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Practice Data Analysis</h3>
                <p className="text-gray-600 mb-3">
                  Your data analysis skills could use some work. Try the interactive data visualization tools.
                </p>
                <Button variant="outline" size="sm">
                  Start Practice
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Explore Image Generation</h3>
                <p className="text-gray-600 mb-3">
                  Take your creative skills to the next level with advanced image generation techniques.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}