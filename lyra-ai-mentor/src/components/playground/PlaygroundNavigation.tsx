import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Route, BarChart3, ArrowRight } from 'lucide-react';

const PlaygroundNavigation: React.FC = () => {
  const navigate = useNavigate();

  const playgroundLinks = [
    {
      path: '/ai-playground',
      title: 'AI Playground',
      description: 'Interactive challenges with Maya, Sofia, David, Rachel & Alex',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      path: '/journey-showcase',
      title: 'Journey Showcase',
      description: 'See real transformation stories from nonprofit leaders',
      icon: <Route className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      path: '/skills-dashboard',
      title: 'Skills Dashboard',
      description: 'Track your AI mastery progress and achievements',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {playgroundLinks.map((link) => (
        <Card 
          key={link.path}
          className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => navigate(link.path)}
        >
          <CardHeader>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${link.color} text-white w-fit mb-2`}>
              {link.icon}
            </div>
            <CardTitle className="text-lg">{link.title}</CardTitle>
            <CardDescription>{link.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="ghost" 
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              Explore
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlaygroundNavigation;