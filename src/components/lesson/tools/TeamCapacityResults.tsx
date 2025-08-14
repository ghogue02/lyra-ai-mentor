import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Target, AlertTriangle, CheckCircle2, Clock, ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';

interface TeamCapacityResultsProps {
  data?: {
    available: number;
    reqHours: number;
    utilizationRate: number;
    riskLevel: string;
    recommendation: string;
    team: Array<{
      id: string;
      name: string;
      role: string;
      hoursPerWeek: number;
      currentTasks: string[];
    }>;
    requirements: Array<{
      id: string;
      category: string;
      hours: number;
    }>;
    aiContent: string;
    selectedScenario?: {
      name: string;
      description: string;
    };
  };
}

const TeamCapacityResults: React.FC<TeamCapacityResultsProps> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state or props
  const resultData = data || location.state?.capacityData;
  
  if (!resultData) {
    navigate('/chapter/3/interactive/team-capacity');
    return null;
  }

  const {
    available,
    reqHours,
    utilizationRate,
    riskLevel,
    recommendation,
    team,
    requirements,
    aiContent,
    selectedScenario
  } = resultData;

  // Prepare chart data
  const teamWorkloadData = team.map(member => ({
    name: member.name,
    hours: member.hoursPerWeek,
    role: member.role,
    fill: member.hoursPerWeek > 25 ? 'hsl(var(--warning))' : 
          member.hoursPerWeek > 15 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'
  }));

  const requirementsData = requirements.map(req => ({
    category: req.category,
    hours: req.hours,
    fill: req.hours > 30 ? 'hsl(var(--warning))' : 'hsl(var(--primary))'
  }));

  const capacityBreakdown = [
    { name: 'Used', value: reqHours, fill: 'hsl(var(--primary))' },
    { name: 'Available', value: Math.max(0, available - reqHours), fill: 'hsl(var(--accent))' }
  ];

  const timelineData = [
    { week: 'Week 1', capacity: available, demand: reqHours * 0.3 },
    { week: 'Week 2', capacity: available, demand: reqHours * 0.4 },
    { week: 'Week 3', capacity: available, demand: reqHours * 0.2 },
    { week: 'Week 4', capacity: available, demand: reqHours * 0.1 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'hsl(var(--warning))';
      case 'medium': return 'hsl(var(--chart-3))';
      default: return 'hsl(var(--accent))';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50"
    >
      <MicroLessonNavigator 
        chapterNumber={3} 
        chapterTitle="Sofia's Storytelling Mastery" 
        lessonTitle="Capacity Analysis Results" 
        characterName="Sofia" 
        progress={100} 
      />
      
      <div className="container mx-auto max-w-7xl pt-20 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/chapter/3/interactive/team-capacity')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Calculator
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Capacity Analysis Results
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered insights for {selectedScenario?.name || 'your project'}
              </p>
            </div>
          </div>
          <Badge variant={getRiskBadgeVariant(riskLevel)} className="text-sm px-3 py-1">
            {riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="gradient-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{available}h</div>
                  <div className="text-sm text-muted-foreground">Available Weekly</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{reqHours}h</div>
                  <div className="text-sm text-muted-foreground">Required Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Utilization Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-accent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {riskLevel === 'low' ? (
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                ) : (
                  <AlertTriangle className="w-8 h-8" style={{ color: getRiskColor(riskLevel) }} />
                )}
                <div>
                  <div className="text-2xl font-bold">{team.length}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capacity Utilization Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Capacity Utilization Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Utilization</span>
                <span className="text-sm font-bold">{utilizationRate.toFixed(1)}%</span>
              </div>
              <Progress 
                value={Math.min(utilizationRate, 100)} 
                className="h-4" 
                style={{
                  background: `linear-gradient(to right, ${getRiskColor(riskLevel)} 0%, ${getRiskColor(riskLevel)} ${Math.min(utilizationRate, 100)}%, hsl(var(--muted)) ${Math.min(utilizationRate, 100)}%)`
                }}
              />
              <div className="text-sm text-muted-foreground">
                {recommendation}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Team Workload Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Team Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: {
                    label: "Hours per Week",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamWorkloadData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">{data.role}</p>
                              <p className="text-primary font-bold">{data.hours}h/week</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Requirements Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: {
                    label: "Hours Required",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requirementsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="hours"
                      label={({ category, hours }) => `${category}: ${hours}h`}
                    >
                      {requirementsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Capacity vs Demand Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  capacity: {
                    label: "Weekly Capacity",
                    color: "hsl(var(--accent))",
                  },
                  demand: {
                    label: "Projected Demand", 
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip />
                    <Line type="monotone" dataKey="capacity" stroke="hsl(var(--accent))" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="demand" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Capacity Overview Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Capacity Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  used: {
                    label: "Used Capacity",
                    color: "hsl(var(--primary))",
                  },
                  available: {
                    label: "Available Capacity",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capacityBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}h`}
                    >
                      {capacityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis */}
        {aiContent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Sofia's AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIContentDisplay content={aiContent} className="text-base" />
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate('/chapter/3/interactive/team-capacity')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Recalculate
          </Button>
          <Button 
            onClick={() => navigate('/chapter/3')}
            className="flex items-center gap-2"
          >
            Continue Learning
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCapacityResults;