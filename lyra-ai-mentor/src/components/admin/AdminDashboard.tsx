import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UsageStatistics } from './UsageStatistics';
import { PopularElements } from './PopularElements';
import { CompletionRates } from './CompletionRates';
import { TokenUsageReports } from './TokenUsageReports';
import { ExportFrequency } from './ExportFrequency';
import { RealTimeMetrics } from './RealTimeMetrics';
import { UserManagement } from './UserManagement';
import { SystemHealth } from './SystemHealth';
import { BusinessIntelligence } from './BusinessIntelligence';
import { AdminTools } from './AdminTools';
import { exportService } from '@/services/exportService';
import { analyticsService } from '@/services/analyticsService';
import { Download, BarChart3, Users, Coins, FileDown, Target, Activity, Settings, Brain, Shield } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('realtime');
  const [exportingReport, setExportingReport] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time updates every 30 seconds
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const exportFullReport = async () => {
    setExportingReport(true);
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const report = await analyticsService.generateReport(startDate, endDate);
      
      await exportService.export({
        title: `Analytics Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        content: report,
        metadata: {
          createdAt: new Date().toISOString(),
          reportType: 'full-analytics',
          period: '30d'
        },
        sections: [
          {
            title: 'Executive Summary',
            type: 'text',
            content: `Total Sessions: ${report.totalSessions}
Unique Users: ${report.uniqueUsers}
Average Session Duration: ${Math.floor(report.averageSessionDuration / 60000)} minutes
Total Token Usage: ${report.tokenUsage.total.toLocaleString()}
Average Completion Rate: ${(report.completionRates.reduce((sum, cr) => sum + cr.rate, 0) / report.completionRates.length * 100).toFixed(1)}%`
          },
          {
            title: 'Popular Elements',
            type: 'table',
            content: report.popularElements.map(el => ({
              Element: el.element,
              Interactions: el.interactions
            }))
          },
          {
            title: 'Token Usage by Feature',
            type: 'table',
            content: report.tokenUsage.byFeature.map(f => ({
              Feature: f.feature,
              Tokens: f.tokens
            }))
          },
          {
            title: 'Export Statistics',
            type: 'text',
            content: `Total Exports: ${report.exportStats.totalExports}
Success Rate: ${(report.exportStats.successRate * 100).toFixed(1)}%
Average Export Size: ${report.exportStats.averageSize} bytes
Average Export Duration: ${report.exportStats.averageDuration}ms`
          }
        ]
      }, {
        format: 'pdf',
        includeMetadata: true
      });
    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setExportingReport(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            AI Playground Admin Dashboard
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <Badge variant={isLive ? 'default' : 'secondary'}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </Badge>
            </div>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Real-time monitoring and analytics for AI Playground
            <span className="text-xs">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            {isLive ? 'Pause Live' : 'Start Live'}
          </Button>
          <Button 
            onClick={exportFullReport}
            disabled={exportingReport}
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Full Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="bi" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Intelligence
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tokens
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeMetrics isLive={isLive} lastUpdate={lastUpdate} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <UsageStatistics />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealth isLive={isLive} />
        </TabsContent>

        <TabsContent value="bi" className="space-y-4">
          <BusinessIntelligence />
        </TabsContent>

        <TabsContent value="elements" className="space-y-4">
          <PopularElements />
          <CompletionRates />
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <TokenUsageReports />
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <AdminTools />
          <ExportFrequency />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <FileDown className="h-4 w-4 mr-2" />
              Export User List
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Weekly Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Coins className="h-4 w-4 mr-2" />
              Token Usage Forecast
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}