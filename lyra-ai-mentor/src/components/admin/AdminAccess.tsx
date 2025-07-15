/**
 * Admin Access Component - Quick access to admin tools
 * For development and configuration purposes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, ArrowRight, Lock, Unlock } from 'lucide-react';

interface AdminAccessProps {
  className?: string;
}

export const AdminAccess: React.FC<AdminAccessProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    // Simple dev unlock - in production this would have proper auth
    const password = prompt('Enter admin password:');
    if (password === 'lyra-dev-2025') {
      setIsUnlocked(true);
    } else {
      alert('Incorrect password');
    }
  };

  const adminTools = [
    {
      id: 'rules-engine',
      title: 'Rules Engine Configurator',
      description: 'Configure all lesson generation rules and preferences',
      icon: <Settings className="w-5 h-5" />,
      route: '/admin/rules-engine',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'lesson-generator',
      title: 'Lesson Generator',
      description: 'Generate new lessons using configured rules',
      icon: <Zap className="w-5 h-5" />,
      route: '/admin/lesson-generator',
      status: 'coming-soon',
      priority: 'high'
    }
  ];

  if (!isUnlocked) {
    return (
      <Card className={`border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6 text-center">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Admin Tools</h3>
          <p className="text-sm text-gray-500 mb-4">
            Access configuration and development tools
          </p>
          <Button 
            onClick={handleUnlock}
            variant="outline"
            size="sm"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Unlock Admin Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Admin Tools
          </span>
          <Badge variant="secondary" className="text-xs">
            Development
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {adminTools.map(tool => (
          <div
            key={tool.id}
            className={`p-3 rounded-lg border transition-all ${
              tool.status === 'active' 
                ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 cursor-pointer' 
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => tool.status === 'active' && navigate(tool.route)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tool.status === 'active' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {tool.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    tool.status === 'active' ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {tool.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {tool.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tool.priority === 'high' && (
                  <Badge variant="outline" className="text-xs">
                    High Priority
                  </Badge>
                )}
                {tool.status === 'active' ? (
                  <ArrowRight className="w-4 h-4 text-purple-600" />
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🎯 Next: Complete Rules Engine → Generate lessons 10x faster
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccess;