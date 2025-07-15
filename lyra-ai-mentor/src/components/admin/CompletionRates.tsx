import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface CompletionData {
  elementId: number;
  elementName: string;
  elementType: string;
  lessonId: number;
  chapterId: number;
  metrics: {
    totalAttempts: number;
    completions: number;
    abandonments: number;
    inProgress: number;
    completionRate: number;
    averageAttempts: number;
    averageTimeToComplete: number;
    successOnFirstTry: number;
    requiresMultipleAttempts: number;
  };
  trends: {
    date: string;
    completionRate: number;
    attempts: number;
  }[];
  phaseCompletion?: {
    phase: string;
    completions: number;
    abandonments: number;
    averageTime: number;
  }[];
}

interface ChapterCompletion {
  chapterId: number;
  chapterName: string;
  totalElements: number;
  completedElements: number;
  completionRate: number;
  averageElementCompletion: number;
}

export function CompletionRates() {
  const [completionData, setCompletionData] = useState<CompletionData[]>([]);
  const [chapterData, setChapterData] = useState<ChapterCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [filterBy, setFilterBy] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [view, setView] = useState<'elements' | 'chapters'>('elements');

  useEffect(() => {
    loadCompletionData();
  }, [timeRange]);

  const loadCompletionData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Fetch element analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('element_analytics_summary')
        .select('*');

      if (summaryError) throw summaryError;

      // Fetch events for trends
      const { data: eventsData, error: eventsError } = await supabase
        .from('element_analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (eventsError) throw eventsError;

      // Process completion data
      const elementMap = new Map<number, CompletionData>();

      summaryData?.forEach(summary => {
        const completionRate = summary.completion_count / (summary.start_count || 1);
        
        elementMap.set(summary.element_id, {
          elementId: summary.element_id,
          elementName: summary.element_type, // Would need actual names from a join
          elementType: summary.element_type,
          lessonId: summary.lesson_id,
          chapterId: Math.floor(summary.lesson_id / 10), // Simplified chapter calculation
          metrics: {
            totalAttempts: summary.start_count || 0,
            completions: summary.completion_count || 0,
            abandonments: summary.abandonment_count || 0,
            inProgress: (summary.start_count || 0) - (summary.completion_count || 0) - (summary.abandonment_count || 0),
            completionRate,
            averageAttempts: summary.retry_count / (summary.completion_count || 1) + 1,
            averageTimeToComplete: summary.average_time_spent || 0,
            successOnFirstTry: summary.completion_count - summary.retry_count,
            requiresMultipleAttempts: summary.retry_count
          },
          trends: [],
          phaseCompletion: summary.phase_completions ? 
            Object.entries(summary.phase_completions).map(([phase, count]) => ({
              phase,
              completions: count as number,
              abandonments: 0, // Would need separate tracking
              averageTime: (summary.average_phase_time as any)?.[phase] || 0
            })) : []
        });
      });

      // Calculate trends
      const trendMap = new Map<string, Map<number, { attempts: number; completions: number }>>();
      
      eventsData?.forEach(event => {
        const date = new Date(event.timestamp).toLocaleDateString();
        if (!trendMap.has(date)) {
          trendMap.set(date, new Map());
        }
        
        const dayData = trendMap.get(date)!;
        if (!dayData.has(event.element_id)) {
          dayData.set(event.element_id, { attempts: 0, completions: 0 });
        }
        
        const elementData = dayData.get(event.element_id)!;
        if (event.event_type === 'element_started') {
          elementData.attempts++;
        } else if (event.event_type === 'element_completed') {
          elementData.completions++;
        }
      });

      // Add trends to completion data
      trendMap.forEach((dayData, date) => {
        dayData.forEach((stats, elementId) => {
          const element = elementMap.get(elementId);
          if (element) {
            element.trends.push({
              date,
              completionRate: stats.completions / (stats.attempts || 1),
              attempts: stats.attempts
            });
          }
        });
      });

      // Sort trends by date
      elementMap.forEach(element => {
        element.trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });

      // Calculate chapter completion rates
      const chapterMap = new Map<number, ChapterCompletion>();
      
      elementMap.forEach(element => {
        if (!chapterMap.has(element.chapterId)) {
          chapterMap.set(element.chapterId, {
            chapterId: element.chapterId,
            chapterName: `Chapter ${element.chapterId}`,
            totalElements: 0,
            completedElements: 0,
            completionRate: 0,
            averageElementCompletion: 0
          });
        }
        
        const chapter = chapterMap.get(element.chapterId)!;
        chapter.totalElements++;
        chapter.completedElements += element.metrics.completions;
        chapter.averageElementCompletion += element.metrics.completionRate;
      });
      
      // Calculate chapter averages
      chapterMap.forEach(chapter => {
        chapter.completionRate = chapter.completedElements / (chapter.totalElements * 100); // Assuming 100 users
        chapter.averageElementCompletion = chapter.averageElementCompletion / chapter.totalElements;
      });

      // Apply filters
      let filteredData = Array.from(elementMap.values());
      
      switch (filterBy) {
        case 'low':
          filteredData = filteredData.filter(d => d.metrics.completionRate < 0.5);
          break;
        case 'medium':
          filteredData = filteredData.filter(d => d.metrics.completionRate >= 0.5 && d.metrics.completionRate < 0.8);
          break;
        case 'high':
          filteredData = filteredData.filter(d => d.metrics.completionRate >= 0.8);
          break;
      }

      setCompletionData(filteredData);
      setChapterData(Array.from(chapterMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load completion data');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (rate: number): string => {
    if (rate >= 0.8) return '#22c55e';
    if (rate >= 0.5) return '#eab308';
    return '#ef4444';
  };

  const getCompletionBadge = (rate: number) => {
    if (rate >= 0.8) {
      return <Badge className="bg-green-100 text-green-800">High</Badge>;
    } else if (rate >= 0.5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Low</Badge>;
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading completion rates: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Completion Rates</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Elements</SelectItem>
              <SelectItem value="high">High (≥80%)</SelectItem>
              <SelectItem value="medium">Medium (50-80%)</SelectItem>
              <SelectItem value="low">Low (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="elements">Element Details</TabsTrigger>
          <TabsTrigger value="chapters">Chapter Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="space-y-4">
          {completionData.map(element => (
            <Card key={element.elementId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{element.elementName}</CardTitle>
                    <CardDescription>
                      {element.elementType} • Lesson {element.lessonId}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCompletionBadge(element.metrics.completionRate)}
                    <span className="text-2xl font-bold">
                      {(element.metrics.completionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{element.metrics.completions} completed</span>
                    <span>{element.metrics.totalAttempts} attempts</span>
                  </div>
                  <Progress 
                    value={element.metrics.completionRate * 100} 
                    className="h-3"
                    style={{
                      '--progress-foreground': getCompletionColor(element.metrics.completionRate)
                    } as any}
                  />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                    <p className="text-xl font-semibold">{element.metrics.completions}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">Abandoned</span>
                    </div>
                    <p className="text-xl font-semibold">{element.metrics.abandonments}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">In Progress</span>
                    </div>
                    <p className="text-xl font-semibold">{element.metrics.inProgress}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Avg Time</span>
                    </div>
                    <p className="text-xl font-semibold">{formatTime(element.metrics.averageTimeToComplete)}</p>
                  </div>
                </div>

                {/* Completion Trend Chart */}
                {element.trends.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Completion Trend</h4>
                    <ResponsiveContainer width="100%" height="150">
                      <AreaChart data={element.trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          domain={[0, 1]}
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                        <Tooltip 
                          formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                          labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="completionRate" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Phase Completion if available */}
                {element.phaseCompletion && element.phaseCompletion.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Phase Completion</h4>
                    <div className="space-y-2">
                      {element.phaseCompletion.map(phase => (
                        <div key={phase.phase} className="flex items-center justify-between">
                          <span className="text-sm">{phase.phase}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {phase.completions} completed
                            </span>
                            <span className="text-sm">
                              {formatTime(phase.averageTime)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Stats */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Success on first try: </span>
                    <span className="font-medium">{element.metrics.successOnFirstTry}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Avg attempts: </span>
                    <span className="font-medium">{element.metrics.averageAttempts.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="chapters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Completion Overview</CardTitle>
              <CardDescription>Overall completion rates by chapter</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="400">
                <BarChart data={chapterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="chapterName" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} domain={[0, 1]} />
                  <Tooltip formatter={(value: any) => `${(value * 100).toFixed(1)}%`} />
                  <Legend />
                  <Bar 
                    dataKey="averageElementCompletion" 
                    fill="#8884d8" 
                    name="Average Element Completion"
                  />
                  <Bar 
                    dataKey="completionRate" 
                    fill="#82ca9d" 
                    name="Overall Chapter Completion"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {chapterData.map(chapter => (
              <Card key={chapter.chapterId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{chapter.chapterName}</CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {(chapter.averageElementCompletion * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        avg element completion
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress 
                      value={chapter.averageElementCompletion * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{chapter.completedElements} elements completed</span>
                      <span>{chapter.totalElements} total elements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}