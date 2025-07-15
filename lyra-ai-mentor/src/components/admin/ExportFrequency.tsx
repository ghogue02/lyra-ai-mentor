import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, FileJson, FileSpreadsheet, FileType, Clock, TrendingUp } from 'lucide-react';

interface ExportData {
  totalExports: number;
  byFormat: {
    format: string;
    count: number;
    percentage: number;
    averageSize: number;
    totalSize: number;
  }[];
  byTimeOfDay: {
    hour: number;
    count: number;
  }[];
  byDayOfWeek: {
    day: string;
    count: number;
  }[];
  trends: {
    date: string;
    exports: number;
    uniqueUsers: number;
  }[];
  topExporters: {
    userId: string;
    exportCount: number;
    favoriteFormat: string;
    totalSize: number;
  }[];
  exportMetrics: {
    averageSize: number;
    averageDuration: number;
    successRate: number;
    totalSize: number;
    peakHour: number;
    peakDay: string;
  };
  templateUsage: {
    templateId: string;
    templateName: string;
    usageCount: number;
    lastUsed: string;
  }[];
}

const formatIcons = {
  pdf: FileText,
  docx: FileText,
  txt: FileType,
  json: FileJson,
  csv: FileSpreadsheet
};

export function ExportFrequency() {
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadExportData();
  }, [timeRange]);

  const loadExportData = async () => {
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

      // Fetch export analytics
      const { data: exports, error: exportError } = await supabase
        .from('export_analytics')
        .select('*')
        .gte('exported_at', startDate.toISOString())
        .lte('exported_at', endDate.toISOString());

      if (exportError) throw exportError;

      // Fetch export tracking for detailed metrics
      const { data: tracking, error: trackingError } = await supabase
        .from('export_tracking')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (trackingError) throw trackingError;

      // Process data
      const totalExports = exports?.length || 0;
      
      // Group by format
      const formatMap = new Map<string, { count: number; totalSize: number }>();
      const hourMap = new Map<number, number>();
      const dayMap = new Map<string, number>();
      const userMap = new Map<string, { count: number; formats: Map<string, number>; totalSize: number }>();
      const dateMap = new Map<string, { exports: number; users: Set<string> }>();
      const templateMap = new Map<string, { name: string; count: number; lastUsed: string }>();

      exports?.forEach(exp => {
        // Format aggregation
        const formatData = formatMap.get(exp.format) || { count: 0, totalSize: 0 };
        formatData.count++;
        formatMap.set(exp.format, formatData);

        // Time aggregation
        const exportDate = new Date(exp.exported_at);
        const hour = exportDate.getHours();
        const dayOfWeek = exportDate.toLocaleDateString('en', { weekday: 'short' });
        const dateStr = exportDate.toLocaleDateString();

        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
        dayMap.set(dayOfWeek, (dayMap.get(dayOfWeek) || 0) + 1);

        // Daily trends
        const dateData = dateMap.get(dateStr) || { exports: 0, users: new Set() };
        dateData.exports++;
        dateMap.set(dateStr, dateData);

        // Template usage
        if (exp.template_id) {
          const templateData = templateMap.get(exp.template_id) || { 
            name: `Template ${exp.template_id}`, 
            count: 0, 
            lastUsed: exp.exported_at 
          };
          templateData.count++;
          templateData.lastUsed = exp.exported_at;
          templateMap.set(exp.template_id, templateData);
        }
      });

      // Process tracking data for sizes and users
      tracking?.forEach(track => {
        // Update format sizes
        const formatData = formatMap.get(track.format);
        if (formatData) {
          formatData.totalSize += track.size || 0;
        }

        // User aggregation
        const userData = userMap.get(track.user_id) || { 
          count: 0, 
          formats: new Map(), 
          totalSize: 0 
        };
        userData.count++;
        userData.totalSize += track.size || 0;
        userData.formats.set(track.format, (userData.formats.get(track.format) || 0) + 1);
        userMap.set(track.user_id, userData);

        // Update date users
        const dateStr = new Date(track.timestamp).toLocaleDateString();
        const dateData = dateMap.get(dateStr);
        if (dateData) {
          dateData.users.add(track.user_id);
        }
      });

      // Convert maps to arrays
      const byFormat = Array.from(formatMap.entries()).map(([format, data]) => ({
        format,
        count: data.count,
        percentage: (data.count / totalExports) * 100,
        averageSize: data.totalSize / data.count || 0,
        totalSize: data.totalSize
      }));

      const byTimeOfDay = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourMap.get(i) || 0
      }));

      const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const byDayOfWeek = dayOrder.map(day => ({
        day,
        count: dayMap.get(day) || 0
      }));

      const trends = Array.from(dateMap.entries())
        .map(([date, data]) => ({
          date,
          exports: data.exports,
          uniqueUsers: data.users.size
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const topExporters = Array.from(userMap.entries())
        .map(([userId, data]) => {
          const favoriteFormat = Array.from(data.formats.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
          
          return {
            userId,
            exportCount: data.count,
            favoriteFormat,
            totalSize: data.totalSize
          };
        })
        .sort((a, b) => b.exportCount - a.exportCount)
        .slice(0, 10);

      const templateUsage = Array.from(templateMap.entries())
        .map(([templateId, data]) => ({
          templateId,
          templateName: data.name,
          usageCount: data.count,
          lastUsed: data.lastUsed
        }))
        .sort((a, b) => b.usageCount - a.usageCount);

      // Calculate metrics
      const totalSize = tracking?.reduce((sum, t) => sum + (t.size || 0), 0) || 0;
      const totalDuration = tracking?.reduce((sum, t) => sum + (t.duration || 0), 0) || 0;
      const successfulExports = tracking?.filter(t => t.success).length || 0;
      
      const peakHour = byTimeOfDay.reduce((max, curr) => 
        curr.count > max.count ? curr : max, byTimeOfDay[0]).hour;
      
      const peakDay = byDayOfWeek.reduce((max, curr) => 
        curr.count > max.count ? curr : max, byDayOfWeek[0]).day;

      setExportData({
        totalExports,
        byFormat,
        byTimeOfDay,
        byDayOfWeek,
        trends,
        topExporters,
        exportMetrics: {
          averageSize: totalSize / totalExports || 0,
          averageDuration: totalDuration / totalExports || 0,
          successRate: successfulExports / tracking?.length || 1,
          totalSize,
          peakHour,
          peakDay
        },
        templateUsage
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load export data');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !exportData) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading export data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Export Frequency Analysis</h2>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exportData.totalExports.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(exportData.totalExports / 30).toFixed(1)} per day avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(exportData.exportMetrics.successRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Export success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Export Size</CardTitle>
            <FileType className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(exportData.exportMetrics.averageSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {formatBytes(exportData.exportMetrics.totalSize)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exportData.exportMetrics.peakHour}:00
            </div>
            <p className="text-xs text-muted-foreground">
              {exportData.exportMetrics.peakDay} most active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Format Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Export Format Distribution</CardTitle>
          <CardDescription>Breakdown of exports by file format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height="300">
              <PieChart>
                <Pie
                  data={exportData.byFormat}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.format.toUpperCase()} (${entry.percentage.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {exportData.byFormat.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {exportData.byFormat.map((format, index) => {
                const Icon = formatIcons[format.format as keyof typeof formatIcons] || FileType;
                return (
                  <div key={format.format} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: COLORS[index % COLORS.length] }} />
                      </div>
                      <div>
                        <p className="font-medium">{format.format.toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {format.count} exports
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatBytes(format.averageSize)}</p>
                      <p className="text-sm text-muted-foreground">avg size</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>Export activity by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height="200">
              <BarChart data={exportData.byTimeOfDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                  interval={2}
                />
                <YAxis />
                <Tooltip labelFormatter={(hour) => `${hour}:00`} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Distribution</CardTitle>
            <CardDescription>Export activity by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height="200">
              <BarChart data={exportData.byDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Export Trends</CardTitle>
          <CardDescription>Daily export activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height="300">
            <LineChart data={exportData.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="exports" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Total Exports"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="uniqueUsers" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Unique Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Exporters */}
      <Card>
        <CardHeader>
          <CardTitle>Top Exporters</CardTitle>
          <CardDescription>Users with most export activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exportData.topExporters.map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium">User {user.userId.slice(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">
                      Prefers {user.favoriteFormat.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{user.exportCount} exports</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(user.totalSize)} total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Usage */}
      {exportData.templateUsage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Template Usage</CardTitle>
            <CardDescription>Most popular export templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportData.templateUsage.slice(0, 5).map((template) => (
                <div key={template.templateId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{template.templateName}</p>
                    <p className="text-sm text-muted-foreground">
                      Last used: {new Date(template.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{template.usageCount} uses</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}