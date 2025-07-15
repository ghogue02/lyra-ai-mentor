import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Zap } from 'lucide-react';

export function BusinessIntelligence() {
  const metrics = [
    {
      title: 'Revenue Impact',
      value: '$12,450',
      change: '+23.5%',
      trend: 'up',
      description: 'Monthly recurring revenue from AI features'
    },
    {
      title: 'User Engagement',
      value: '89.2%',
      change: '+12.1%',
      trend: 'up',
      description: 'Users actively using AI playground'
    },
    {
      title: 'Feature Adoption',
      value: '76.8%',
      change: '+5.4%',
      trend: 'up',
      description: 'New feature usage rate'
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      change: '-1.8%',
      trend: 'down',
      description: 'Monthly user churn'
    }
  ];

  const insights = [
    {
      title: 'Peak Usage Hours',
      value: '9 AM - 3 PM EST',
      icon: Users,
      description: 'Highest activity during business hours'
    },
    {
      title: 'Most Popular Feature',
      value: 'Lyra Chat',
      icon: Zap,
      description: '78% of users engage with AI chat weekly'
    },
    {
      title: 'Growth Opportunity',
      value: 'Mobile Usage',
      icon: Target,
      description: '45% increase in mobile sessions'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                <span>vs last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Key Business Insights
          </CardTitle>
          <CardDescription>
            AI-driven insights for business optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <insight.icon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">{insight.title}</div>
                  <div className="text-sm text-blue-600 font-semibold">{insight.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{insight.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>AI-powered optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
              <div>
                <div className="font-medium">Expand Mobile Features</div>
                <div className="text-sm text-gray-500">
                  Mobile usage has increased 45%. Consider developing mobile-first features.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-green-100 text-green-800">Medium Priority</Badge>
              <div>
                <div className="font-medium">Optimize Peak Hours</div>
                <div className="text-sm text-gray-500">
                  Scale resources during 9 AM - 3 PM EST for better performance.
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge className="bg-yellow-100 text-yellow-800">Low Priority</Badge>
              <div>
                <div className="font-medium">A/B Test New Features</div>
                <div className="text-sm text-gray-500">
                  Test variations of the AI playground interface for better engagement.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}