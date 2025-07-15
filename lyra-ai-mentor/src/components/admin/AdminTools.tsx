import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  RefreshCw, 
  Trash2, 
  Download, 
  Upload, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export function AdminTools() {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(null);
    setLastAction(action);
  };

  const tools = [
    {
      id: 'cache-clear',
      title: 'Clear Cache',
      description: 'Clear application cache and temporary files',
      icon: RefreshCw,
      action: () => handleAction('cache-clear'),
      danger: false
    },
    {
      id: 'backup',
      title: 'Create Backup',
      description: 'Create a full system backup',
      icon: Download,
      action: () => handleAction('backup'),
      danger: false
    },
    {
      id: 'reset-analytics',
      title: 'Reset Analytics',
      description: 'Reset all analytics data (cannot be undone)',
      icon: Database,
      action: () => handleAction('reset-analytics'),
      danger: true
    },
    {
      id: 'cleanup',
      title: 'Data Cleanup',
      description: 'Remove old logs and temporary data',
      icon: Trash2,
      action: () => handleAction('cleanup'),
      danger: false
    },
    {
      id: 'migrate',
      title: 'Run Migrations',
      description: 'Execute pending database migrations',
      icon: Upload,
      action: () => handleAction('migrate'),
      danger: false
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Enable/disable system maintenance mode',
      icon: Settings,
      action: () => handleAction('maintenance'),
      danger: true
    }
  ];

  const systemStatus = {
    lastBackup: '2 hours ago',
    cacheSize: '2.3 GB',
    logSize: '456 MB',
    uptime: '7 days, 14 hours'
  };

  return (
    <div className="space-y-6">
      {lastAction && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Action "{lastAction}" completed successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.uptime}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.cacheSize}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Log Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.logSize}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.lastBackup}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Administration Tools</CardTitle>
          <CardDescription>
            Manage system operations and maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <tool.icon className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{tool.title}</div>
                    <div className="text-sm text-gray-500">{tool.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {tool.danger && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Danger
                    </Badge>
                  )}
                  <Button
                    variant={tool.danger ? "destructive" : "outline"}
                    size="sm"
                    onClick={tool.action}
                    disabled={loading === tool.id}
                  >
                    {loading === tool.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <tool.icon className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}