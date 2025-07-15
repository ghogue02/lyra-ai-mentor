import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Zap, 
  Download,
  Copy,
  Share,
  RefreshCw,
  Sparkles,
  Plus
} from 'lucide-react';

interface QuickChart {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area';
  title: string;
  data: ChartDataPoint[];
  color: string;
  generated: Date;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area';
  icon: React.ElementType;
  sampleData: string;
}

const DavidQuickCharts: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('bar');
  const [generatedCharts, setGeneratedCharts] = useState<QuickChart[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const chartTemplates: ChartTemplate[] = [
    {
      id: 'bar',
      name: 'Bar Chart',
      description: 'Compare categories',
      type: 'bar',
      icon: BarChart3,
      sampleData: 'Youth Programs: 45\nAdult Education: 32\nSenior Services: 28\nFamily Support: 38'
    },
    {
      id: 'line',
      name: 'Line Chart',
      description: 'Show trends over time',
      type: 'line',
      icon: LineChart,
      sampleData: 'Jan: 1200\nFeb: 1350\nMar: 1450\nApr: 1600\nMay: 1750\nJun: 1900'
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      description: 'Show proportions',
      type: 'pie',
      icon: PieChart,
      sampleData: 'Program Costs: 60\nAdministration: 25\nFundraising: 10\nReserves: 5'
    },
    {
      id: 'donut',
      name: 'Donut Chart',
      description: 'Proportions with center focus',
      type: 'donut',
      icon: PieChart,
      sampleData: 'Direct Service: 70\nCapacity Building: 20\nAdvocacy: 10'
    },
    {
      id: 'area',
      name: 'Area Chart',
      description: 'Cumulative trends',
      type: 'area',
      icon: TrendingUp,
      sampleData: 'Q1: 15000\nQ2: 22000\nQ3: 28000\nQ4: 35000'
    }
  ];

  const quickTemplates = [
    {
      title: 'Program Participation',
      data: 'Youth Development: 150\nAdult Education: 89\nSenior Programs: 67\nFamily Services: 134'
    },
    {
      title: 'Monthly Donations',
      data: 'January: 15000\nFebruary: 18000\nMarch: 22000\nApril: 19000\nMay: 25000'
    },
    {
      title: 'Volunteer Hours',
      data: 'Events: 280\nPrograms: 450\nAdmin: 120\nOutreach: 195'
    },
    {
      title: 'Budget Allocation',
      data: 'Programs: 65\nStaff: 25\nOverhead: 8\nReserves: 2'
    }
  ];

  const colorSchemes = [
    { name: 'Blue', colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#EFF6FF'] },
    { name: 'Green', colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'] },
    { name: 'Purple', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'] },
    { name: 'Orange', colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'] },
    { name: 'Red', colors: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'] }
  ];

  const generateChart = async () => {
    if (!inputData.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate chart generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Parse input data
    const lines = inputData.trim().split('\n');
    const dataPoints: ChartDataPoint[] = [];
    
    lines.forEach((line, index) => {
      const [label, valueStr] = line.split(':').map(s => s.trim());
      const value = parseFloat(valueStr) || Math.random() * 100;
      
      const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      dataPoints.push({
        label,
        value,
        color: colorScheme.colors[index % colorScheme.colors.length]
      });
    });
    
    const newChart: QuickChart = {
      id: Date.now().toString(),
      type: selectedTemplate as any,
      title: chartTitle || `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Chart`,
      data: dataPoints,
      color: colorSchemes[0].colors[0],
      generated: new Date()
    };
    
    setGeneratedCharts(prev => [newChart, ...prev.slice(0, 9)]);
    setIsGenerating(false);
  };

  const loadTemplate = (template: typeof quickTemplates[0]) => {
    setInputData(template.data);
    setChartTitle(template.title);
  };

  const loadChartTemplate = (template: ChartTemplate) => {
    setSelectedTemplate(template.id);
    setInputData(template.sampleData);
    setChartTitle(`Sample ${template.name}`);
  };

  const exportChart = (chart: QuickChart) => {
    const chartData = `
CHART DATA: ${chart.title}
Type: ${chart.type}
Generated: ${chart.generated.toLocaleString()}

DATA POINTS:
${chart.data.map(point => `${point.label}: ${point.value}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(chartData.trim());
  };

  // Simple chart visualization components
  const BarChartViz: React.FC<{ data: ChartDataPoint[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-center">{title}</h3>
        {data.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-16 text-xs text-right">{point.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="h-4 rounded-full flex items-center justify-end pr-1"
                style={{ 
                  width: `${(point.value / maxValue) * 100}%`,
                  backgroundColor: point.color
                }}
              >
                <span className="text-xs text-white font-medium">
                  {point.value.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const LineChartViz: React.FC<{ data: ChartDataPoint[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-center">{title}</h3>
        <div className="h-32 flex items-end justify-between gap-1 border-b border-l">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div 
                  className="w-full rounded-t"
                  style={{ 
                    height: `${(point.value / maxValue) * 100}px`,
                    backgroundColor: point.color || '#3B82F6'
                  }}
                />
              </div>
              <div className="text-xs mt-1 text-center">{point.label}</div>
              <div className="text-xs text-gray-600">{point.value.toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChartViz: React.FC<{ data: ChartDataPoint[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-center">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-conic from-blue-500 via-green-500 to-purple-500"></div>
        </div>
        <div className="space-y-1">
          {data.map((point, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: point.color }}
                />
                <span>{point.label}</span>
              </div>
              <span className="font-medium">
                {((point.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = (chart: QuickChart) => {
    switch (chart.type) {
      case 'bar':
        return <BarChartViz data={chart.data} title={chart.title} />;
      case 'line':
      case 'area':
        return <LineChartViz data={chart.data} title={chart.title} />;
      case 'pie':
      case 'donut':
        return <PieChartViz data={chart.data} title={chart.title} />;
      default:
        return <BarChartViz data={chart.data} title={chart.title} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Quick Charts</CardTitle>
              <CardDescription>
                Generate professional charts in seconds from simple data input
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Creation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chart Data</CardTitle>
                  <CardDescription>Enter your data in simple format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Templates */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick templates:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {quickTemplates.map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left h-auto p-2"
                          onClick={() => loadTemplate(template)}
                        >
                          <div>
                            <div className="font-medium text-xs">{template.title}</div>
                            <div className="text-xs text-gray-600">
                              {template.data.split('\n').length} items
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chart Title:</label>
                    <Input
                      placeholder="Enter chart title..."
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                    />
                  </div>

                  {/* Data Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data (Label: Value format):</label>
                    <textarea
                      className="w-full h-32 p-3 border rounded-md text-sm font-mono"
                      placeholder="Programs: 45
Events: 32
Outreach: 28
Support: 38"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                    />
                    <div className="text-xs text-gray-600">
                      {inputData.split('\n').filter(line => line.trim()).length} data points
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chart Type</CardTitle>
                  <CardDescription>Choose your visualization style</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Button
                          key={template.id}
                          variant={selectedTemplate === template.id ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-center"
                          onClick={() => loadChartTemplate(template)}
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <span className="font-medium text-sm">{template.name}</span>
                          <span className="text-xs text-gray-600">{template.description}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateChart}
                disabled={!inputData.trim() || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Chart...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Quick Chart
                  </>
                )}
              </Button>
            </div>

            {/* Latest Chart Preview */}
            <div className="space-y-4">
              {generatedCharts.length > 0 ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Latest Chart</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportChart(generatedCharts[0])}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{generatedCharts[0].type} chart</Badge>
                      <Badge variant="outline">{generatedCharts[0].data.length} data points</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-lg border">
                      {renderChart(generatedCharts[0])}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Chart</h3>
                    <p className="text-center">
                      Enter your data and select a chart type<br />
                      to generate instant visualizations
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Chart Gallery */}
          {generatedCharts.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart Gallery</CardTitle>
                <CardDescription>Your recently created charts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedCharts.slice(1).map((chart) => (
                    <Card key={chart.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">{chart.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {chart.type}
                          </Badge>
                        </div>
                        <div className="bg-gray-50 rounded p-3 mb-3 h-32 flex items-center justify-center">
                          <div className="text-xs text-gray-500 text-center">
                            {chart.data.length} data points<br />
                            Generated {chart.generated.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">David's Quick Chart Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-semibold mb-2">Data Input:</h4>
                  <ul className="space-y-1">
                    <li>• Use "Label: Value" format</li>
                    <li>• One data point per line</li>
                    <li>• Numbers can include decimals</li>
                    <li>• Keep labels short and clear</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Chart Selection:</h4>
                  <ul className="space-y-1">
                    <li>• Bar charts for comparisons</li>
                    <li>• Line charts for trends</li>
                    <li>• Pie charts for proportions</li>
                    <li>• Area charts for cumulative data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="space-y-1">
                    <li>• Limit to 5-7 data points</li>
                    <li>• Use descriptive titles</li>
                    <li>• Check for data accuracy</li>
                    <li>• Consider your audience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidQuickCharts;