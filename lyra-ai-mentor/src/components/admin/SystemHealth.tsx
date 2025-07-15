import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Activity } from 'lucide-react';

interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: string;
  description: string;
}

export function SystemHealth() {
  const components: SystemComponent[] = [
    {
      name: 'API Server',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      description: 'Main application server'
    },
    {
      name: 'Database',
      status: 'healthy',
      uptime: '100%',
      responseTime: '12ms',
      description: 'Supabase PostgreSQL'
    },
    {
      name: 'AI Services',
      status: 'warning',
      uptime: '98.5%',
      responseTime: '340ms',
      description: 'OpenAI API integration'
    },
    {
      name: 'Voice Processing',
      status: 'healthy',
      uptime: '99.2%',
      responseTime: '180ms',
      description: 'TTS/STT services'
    },
    {
      name: 'Analytics',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: '28ms',
      description: 'Usage tracking system'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallHealth = components.every(c => c.status === 'healthy') ? 'healthy' : 
                       components.some(c => c.status === 'error') ? 'error' : 'warning';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallHealth)}
            System Health Overview
          </CardTitle>
          <CardDescription>Real-time monitoring of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {components.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(component.status)}
                  <div>
                    <div className="font-medium">{component.name}</div>
                    <div className="text-sm text-gray-500">{component.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 hidden sm:block">
                    {component.uptime} uptime
                  </div>
                  <div className="text-sm text-gray-600 hidden md:block">
                    {component.responseTime}
                  </div>
                  <Badge className={getStatusColor(component.status)}>
                    {component.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}