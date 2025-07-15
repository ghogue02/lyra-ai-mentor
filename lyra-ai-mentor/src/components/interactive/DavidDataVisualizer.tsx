import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Sparkles,
  Upload,
  Eye,
  Share
} from 'lucide-react';

interface ChartData {
  labels: string[];
  values: number[];
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter';
}

interface DataSet {
  id: string;
  name: string;
  data: ChartData;
  insights: string[];
  created: Date;
}

const DavidDataVisualizer: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [generatedChart, setGeneratedChart] = useState<DataSet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCharts, setSavedCharts] = useState<DataSet[]>([]);

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
    { id: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
    { id: 'scatter', label: 'Scatter Plot', icon: TrendingUp, description: 'Show relationships' }
  ];

  const sampleDatasets = [
    {
      name: 'Nonprofit Program Impact',
      csv: `Program,Participants,Completion Rate,Satisfaction
Youth Development,150,87,4.2
Adult Education,89,92,4.5
Community Health,203,78,4.1
Skills Training,67,94,4.6`
    },
    {
      name: 'Monthly Donations',
      csv: `Month,Amount,Donors
January,15000,45
February,18000,52
March,22000,61
April,19000,48
May,25000,67
June,28000,72`
    },
    {
      name: 'Volunteer Hours by Department',
      csv: `Department,Hours,Volunteers
Administration,120,8
Programs,450,15
Events,280,12
Marketing,90,6
Fundraising,200,10`
    }
  ];

  const generateVisualization = async () => {
    if (!csvData.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI chart generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Parse CSV data (simplified)
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    const dataRows = lines.slice(1).map(line => line.split(','));
    
    // Generate mock chart data
    const labels = dataRows.map(row => row[0]);
    const values = dataRows.map(row => parseFloat(row[1]) || Math.random() * 100);
    
    const chartData: ChartData = {
      labels,
      values,
      title: `${headers[1]} by ${headers[0]}`,
      type: chartType
    };

    // Generate AI insights
    const insights = [
      `${labels[values.indexOf(Math.max(...values))]} shows the highest performance with ${Math.max(...values).toFixed(1)}`,
      `There's a ${(Math.random() * 20 + 10).toFixed(1)}% variation across categories`,
      `The average value is ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}`,
      `${Math.random() > 0.5 ? 'Upward' : 'Stable'} trend observed in the data pattern`
    ];

    const newDataSet: DataSet = {
      id: Date.now().toString(),
      name: `Chart ${savedCharts.length + 1}`,
      data: chartData,
      insights,
      created: new Date()
    };

    setGeneratedChart(newDataSet);
    setIsGenerating(false);
  };

  const saveChart = () => {
    if (generatedChart) {
      setSavedCharts(prev => [generatedChart, ...prev.slice(0, 4)]);
    }
  };

  const loadSampleData = (sample: typeof sampleDatasets[0]) => {
    setCsvData(sample.csv);
    setGeneratedChart(null);
  };

  // Mock chart visualization component
  const ChartVisualization: React.FC<{ data: ChartData }> = ({ data }) => {
    const maxValue = Math.max(...data.values);
    
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-semibold text-center mb-4">{data.title}</h3>
        
        {data.type === 'bar' && (
          <div className="space-y-2">
            {data.labels.map((label, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-sm text-right">{label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(data.values[index] / maxValue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {data.values[index].toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.type === 'line' && (
          <div className="h-48 flex items-end justify-between gap-2">
            {data.values.map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(value / maxValue) * 150}px` }}
                />
                <div className="text-xs mt-2 text-center">{data.labels[index]}</div>
                <div className="text-xs text-gray-600">{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
        )}

        {data.type === 'pie' && (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-gradient-conic from-blue-500 via-green-500 to-purple-500 rounded-full mb-4"></div>
            <div className="space-y-1">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-medium">{data.values[index].toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.type === 'scatter' && (
          <div className="h-48 bg-gray-50 rounded relative">
            {data.values.map((value, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-blue-500 rounded-full"
                style={{
                  left: `${(index / (data.values.length - 1)) * 90 + 5}%`,
                  bottom: `${(value / maxValue) * 80 + 10}%`
                }}
                title={`${data.labels[index]}: ${value.toFixed(1)}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">David's Data Visualizer</CardTitle>
              <CardDescription>
                AI-generated charts and graphs from your data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Input */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Input</CardTitle>
                  <CardDescription>Upload CSV or paste your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sample Data */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Try sample datasets:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {sampleDatasets.map((sample, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3"
                          onClick={() => loadSampleData(sample)}
                        >
                          <div>
                            <div className="font-medium">{sample.name}</div>
                            <div className="text-xs text-gray-600">
                              {sample.csv.split('\n')[0]}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* CSV Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CSV Data:</label>
                    <Textarea
                      placeholder="Paste your CSV data here... (headers in first row)"
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <div className="text-xs text-gray-600">
                      {csvData.split('\n').length - 1} rows • CSV format
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Drop CSV file here or click to upload</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chart Type</CardTitle>
                  <CardDescription>Choose how to visualize your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant={chartType === type.id ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-center"
                          onClick={() => setChartType(type.id as any)}
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-gray-600">{type.description}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={generateVisualization}
                disabled={!csvData.trim() || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Visualization...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Visualization
                  </>
                )}
              </Button>
            </div>

            {/* Generated Chart */}
            <div className="space-y-4">
              {generatedChart ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Generated Chart</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={saveChart}>
                          <Download className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{generatedChart.data.type} chart</Badge>
                      <Badge variant="outline">{generatedChart.data.labels.length} data points</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartVisualization data={generatedChart.data} />
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Visualize</h3>
                    <p className="text-center">
                      Add your data and select a chart type<br />
                      to generate AI-powered visualizations
                    </p>
                  </div>
                </Card>
              )}

              {/* AI Insights */}
              {generatedChart && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">David's Data Insights</CardTitle>
                    <CardDescription className="text-blue-600">
                      AI-generated analysis of your data patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedChart.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Saved Charts */}
          {savedCharts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Visualizations</CardTitle>
                <CardDescription>Your chart library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCharts.map((chart) => (
                    <Card key={chart.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{chart.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {chart.data.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{chart.data.title}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DavidDataVisualizer;