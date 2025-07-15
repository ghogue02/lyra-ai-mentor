import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Calendar,
  RefreshCw,
  Eye,
  Share,
  Download,
  Plus,
  Filter,
  Search,
  Bell,
  Settings
} from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  detail: string;
}

interface QuickChart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'progress';
  data: number[];
  labels: string[];
  color: string;
}

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

const DavidMobileDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const metrics: MetricCard[] = [
    {
      id: 'participants',
      title: 'Program Participants',
      value: '1,247',
      change: 12,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      detail: '+12% vs last month'
    },
    {
      id: 'completion',
      title: 'Completion Rate',
      value: '87%',
      change: 5,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600',
      detail: '+5% vs last month'
    },
    {
      id: 'donations',
      title: 'Monthly Donations',
      value: '$24,500',
      change: -3,
      changeType: 'decrease',
      icon: DollarSign,
      color: 'text-yellow-600',
      detail: '-3% vs last month'
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction Score',
      value: '4.6/5',
      change: 8,
      changeType: 'increase',
      icon: BarChart3,
      color: 'text-purple-600',
      detail: '+8% vs last month'
    }
  ];

  const quickCharts: QuickChart[] = [
    {
      id: 'weekly-participation',
      title: 'Weekly Participation',
      type: 'bar',
      data: [280, 320, 295, 340],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      color: '#3B82F6'
    },
    {
      id: 'program-progress',
      title: 'Program Goals Progress',
      type: 'progress',
      data: [75, 82, 68, 91],
      labels: ['Youth Dev', 'Adult Ed', 'Seniors', 'Family'],
      color: '#10B981'
    },
    {
      id: 'monthly-trend',
      title: 'Monthly Engagement Trend',
      type: 'line',
      data: [85, 88, 82, 91, 87, 94],
      labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      color: '#8B5CF6'
    }
  ];

  const recentAlerts: Alert[] = [
    {
      id: '1',
      type: 'success',
      title: 'Goal Achieved!',
      message: 'Family Services program exceeded monthly target by 15%',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      type: 'warning',
      title: 'Attendance Drop',
      message: 'Youth program attendance down 8% this week',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: '3',
      type: 'info',
      title: 'Data Updated',
      message: 'December impact report data now available',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];

  const quickActions = [
    { id: 'add-data', title: 'Add Data', icon: Plus, color: 'bg-blue-600' },
    { id: 'view-report', title: 'View Report', icon: Eye, color: 'bg-green-600' },
    { id: 'share-insights', title: 'Share Insights', icon: Share, color: 'bg-purple-600' },
    { id: 'export-data', title: 'Export Data', icon: Download, color: 'bg-gray-600' }
  ];

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return TrendingUp;
      case 'decrease': return TrendingDown;
      default: return BarChart3;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Simple chart components for mobile
  const BarChartMobile: React.FC<{ data: number[], labels: string[], color: string }> = ({ data, labels, color }) => {
    const maxValue = Math.max(...data);
    return (
      <div className="space-y-2">
        {data.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-12 text-xs">{labels[index]}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full"
                style={{ 
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
            <div className="w-8 text-xs text-right">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const ProgressChartMobile: React.FC<{ data: number[], labels: string[], color: string }> = ({ data, labels, color }) => {
    return (
      <div className="space-y-3">
        {data.map((value, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{labels[index]}</span>
              <span className="font-medium">{value}%</span>
            </div>
            <Progress value={value} className="h-2" />
          </div>
        ))}
      </div>
    );
  };

  const LineChartMobile: React.FC<{ data: number[], labels: string[], color: string }> = ({ data, labels, color }) => {
    const maxValue = Math.max(...data);
    return (
      <div className="h-24 flex items-end justify-between gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full rounded-t"
              style={{ 
                height: `${(value / maxValue) * 80}px`,
                backgroundColor: color
              }}
            />
            <div className="text-xs mt-1">{labels[index]}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = (chart: QuickChart) => {
    switch (chart.type) {
      case 'bar':
        return <BarChartMobile data={chart.data} labels={chart.labels} color={chart.color} />;
      case 'progress':
        return <ProgressChartMobile data={chart.data} labels={chart.labels} color={chart.color} />;
      case 'line':
        return <LineChartMobile data={chart.data} labels={chart.labels} color={chart.color} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Data Dashboard</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" variant="outline">
              <Bell className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className="flex-1 h-7 text-xs"
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const ChangeIcon = getChangeIcon(metric.changeType);
            
            return (
              <Card key={metric.id} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                    <div className={`flex items-center gap-1 ${getChangeColor(metric.changeType)}`}>
                      <ChangeIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold">{metric.value}</div>
                  <div className="text-xs text-gray-600 leading-tight">{metric.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{metric.detail}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-12 flex flex-col items-center justify-center gap-1"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <h3 className="font-medium">Visual Insights</h3>
          {quickCharts.map((chart) => (
            <Card key={chart.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {renderChart(chart)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        {recentAlerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Recent Alerts</h3>
            <div className="space-y-2">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 p-3 rounded-r ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Insights Summary */}
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-800">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-xs text-blue-700">
              <li>• Program participation up 12% this month</li>
              <li>• Completion rates improved across all programs</li>
              <li>• Family Services exceeded monthly targets</li>
              <li>• Youth program needs attention this week</li>
            </ul>
            <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
              <Eye className="w-3 h-3 mr-1" />
              View Full Report
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="font-medium">Recent Data Updates</h3>
          <div className="space-y-2">
            {[
              { time: '2h ago', action: 'Weekly participation data synced' },
              { time: '5h ago', action: 'New survey responses processed' },
              { time: '1d ago', action: 'Monthly impact report generated' },
              { time: '2d ago', action: 'Volunteer hours data updated' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
          <br />
          David's Mobile Data Dashboard
        </div>
      </div>
    </div>
  );
};

export default DavidMobileDashboard;