import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface ImpactMetric {
  id: string;
  name: string;
  description: string;
  category: 'outcome' | 'output' | 'impact' | 'reach';
  dataType: 'number' | 'percentage' | 'currency' | 'rating';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  baseline: number;
  target: number;
  current: number;
  unit: string;
  dataPoints: DataPoint[];
  stakeholders: string[];
  collectionMethod: string;
  lastUpdated: Date;
}

interface DataPoint {
  date: Date;
  value: number;
  note?: string;
  source: string;
}

interface ImpactProgram {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  participants: number;
  metrics: ImpactMetric[];
  status: 'active' | 'completed' | 'planning' | 'paused';
  theoryOfChange: string;
  logicModel: LogicModelComponent[];
}

interface LogicModelComponent {
  type: 'inputs' | 'activities' | 'outputs' | 'outcomes' | 'impacts';
  items: string[];
}

interface ImpactReport {
  id: string;
  title: string;
  period: { start: Date; end: Date };
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  metrics: ReportMetric[];
  generatedAt: Date;
}

interface ReportMetric {
  metricId: string;
  name: string;
  achieved: number;
  target: number;
  variance: number;
  trend: 'improving' | 'declining' | 'stable';
}

const AlexImpactMeasurement: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<ImpactProgram | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'metrics' | 'trends' | 'reports'>('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [programs, setPrograms] = useState<ImpactProgram[]>([]);

  const samplePrograms: ImpactProgram[] = [
    {
      id: 'literacy-program',
      name: 'Community Literacy Initiative',
      description: 'Improving reading skills for underserved youth through tutoring and mentorship',
      startDate: new Date('2024-01-01'),
      budget: 125000,
      participants: 150,
      status: 'active',
      theoryOfChange: 'By providing quality literacy instruction and mentorship, we will improve reading levels, which leads to better academic outcomes and increased life opportunities for participating youth.',
      logicModel: [
        { type: 'inputs', items: ['Funding', 'Staff', 'Volunteers', 'Learning materials', 'Facility space'] },
        { type: 'activities', items: ['One-on-one tutoring', 'Group reading sessions', 'Family literacy workshops', 'Mentor matching'] },
        { type: 'outputs', items: ['150 students served', '300 tutoring hours/month', '12 family workshops', '75 mentor pairs'] },
        { type: 'outcomes', items: ['Improved reading levels', 'Increased school engagement', 'Enhanced family literacy practices'] },
        { type: 'impacts', items: ['Better academic performance', 'Increased graduation rates', 'Stronger community literacy culture'] }
      ],
      metrics: [
        {
          id: 'reading-level',
          name: 'Average Reading Level Improvement',
          description: 'Grade levels improved from baseline assessment',
          category: 'outcome',
          dataType: 'number',
          frequency: 'quarterly',
          baseline: 0,
          target: 1.5,
          current: 1.2,
          unit: 'grade levels',
          stakeholders: ['Students', 'Parents', 'Teachers', 'Funders'],
          collectionMethod: 'Standardized reading assessments',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2024-01-01'), value: 0, source: 'Baseline Assessment' },
            { date: new Date('2024-04-01'), value: 0.8, source: 'Q1 Assessment' },
            { date: new Date('2024-07-01'), value: 1.2, source: 'Q2 Assessment' }
          ]
        },
        {
          id: 'attendance-rate',
          name: 'Program Attendance Rate',
          description: 'Percentage of enrolled students actively participating',
          category: 'output',
          dataType: 'percentage',
          frequency: 'monthly',
          baseline: 65,
          target: 85,
          current: 78,
          unit: '%',
          stakeholders: ['Program Staff', 'Students', 'Parents'],
          collectionMethod: 'Session attendance tracking',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2024-01-01'), value: 65, source: 'Program Records' },
            { date: new Date('2024-04-01'), value: 72, source: 'Program Records' },
            { date: new Date('2024-07-01'), value: 78, source: 'Program Records' }
          ]
        },
        {
          id: 'parent-engagement',
          name: 'Family Workshop Participation',
          description: 'Number of families participating in literacy workshops',
          category: 'output',
          dataType: 'number',
          frequency: 'monthly',
          baseline: 0,
          target: 50,
          current: 38,
          unit: 'families',
          stakeholders: ['Families', 'Program Staff'],
          collectionMethod: 'Workshop attendance records',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2024-01-01'), value: 0, source: 'Workshop Records' },
            { date: new Date('2024-04-01'), value: 23, source: 'Workshop Records' },
            { date: new Date('2024-07-01'), value: 38, source: 'Workshop Records' }
          ]
        },
        {
          id: 'cost-per-participant',
          name: 'Cost per Participant',
          description: 'Program cost divided by number of active participants',
          category: 'impact',
          dataType: 'currency',
          frequency: 'quarterly',
          baseline: 950,
          target: 800,
          current: 833,
          unit: '$',
          stakeholders: ['Funders', 'Board', 'Program Staff'],
          collectionMethod: 'Financial and enrollment data analysis',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2024-01-01'), value: 950, source: 'Financial Analysis' },
            { date: new Date('2024-04-01'), value: 890, source: 'Financial Analysis' },
            { date: new Date('2024-07-01'), value: 833, source: 'Financial Analysis' }
          ]
        }
      ]
    },
    {
      id: 'job-training',
      name: 'Workforce Development Program',
      description: 'Providing job skills training and placement services for unemployed adults',
      startDate: new Date('2023-09-01'),
      budget: 200000,
      participants: 75,
      status: 'active',
      theoryOfChange: 'By providing job skills training, career counseling, and placement support, we will help unemployed adults secure stable employment, leading to improved economic stability and quality of life.',
      logicModel: [
        { type: 'inputs', items: ['Funding', 'Instructors', 'Equipment', 'Employer partnerships', 'Facilities'] },
        { type: 'activities', items: ['Skills assessment', 'Technical training', 'Soft skills workshops', 'Job placement assistance'] },
        { type: 'outputs', items: ['75 participants trained', '85% completion rate', '200 employer contacts', '60 job placements'] },
        { type: 'outcomes', items: ['Improved job skills', 'Increased employment rate', 'Higher wages', 'Better job retention'] },
        { type: 'impacts', items: ['Economic stability', 'Reduced poverty', 'Stronger families', 'Community economic growth'] }
      ],
      metrics: [
        {
          id: 'job-placement-rate',
          name: 'Job Placement Rate',
          description: 'Percentage of graduates who find employment within 3 months',
          category: 'outcome',
          dataType: 'percentage',
          frequency: 'quarterly',
          baseline: 45,
          target: 75,
          current: 68,
          unit: '%',
          stakeholders: ['Participants', 'Employers', 'Funders'],
          collectionMethod: '3-month follow-up surveys',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2023-12-01'), value: 45, source: 'Follow-up Survey' },
            { date: new Date('2024-03-01'), value: 62, source: 'Follow-up Survey' },
            { date: new Date('2024-06-01'), value: 68, source: 'Follow-up Survey' }
          ]
        },
        {
          id: 'wage-increase',
          name: 'Average Wage Increase',
          description: 'Average hourly wage increase from pre-program baseline',
          category: 'impact',
          dataType: 'currency',
          frequency: 'quarterly',
          baseline: 0,
          target: 5.50,
          current: 4.25,
          unit: '$/hour',
          stakeholders: ['Participants', 'Funders'],
          collectionMethod: 'Employment verification and wage surveys',
          lastUpdated: new Date(),
          dataPoints: [
            { date: new Date('2023-12-01'), value: 0, source: 'Baseline Survey' },
            { date: new Date('2024-03-01'), value: 3.75, source: 'Follow-up Survey' },
            { date: new Date('2024-06-01'), value: 4.25, source: 'Follow-up Survey' }
          ]
        }
      ]
    }
  ];

  React.useEffect(() => {
    if (programs.length === 0) {
      setPrograms(samplePrograms);
    }
  }, []);

  const generateImpactReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const reportData = {
      period: { start: new Date('2024-01-01'), end: new Date() },
      programs: programs,
      totalParticipants: programs.reduce((sum, p) => sum + p.participants, 0),
      totalBudget: programs.reduce((sum, p) => sum + p.budget, 0)
    };
    
    console.log('Impact report generated:', reportData);
    setIsGeneratingReport(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'outcome': return 'text-green-600 bg-green-100';
      case 'output': return 'text-blue-600 bg-blue-100';
      case 'impact': return 'text-purple-600 bg-purple-100';
      case 'reach': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'paused': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (current: number, target: number, baseline: number) => {
    const progress = baseline !== 0 ? (current - baseline) / (target - baseline) : current / target;
    if (progress > 0.8) return TrendingUp;
    if (progress < 0.4) return TrendingDown;
    return Activity;
  };

  const getTrendColor = (current: number, target: number, baseline: number) => {
    const progress = baseline !== 0 ? (current - baseline) / (target - baseline) : current / target;
    if (progress > 0.8) return 'text-green-600';
    if (progress < 0.4) return 'text-red-600';
    return 'text-yellow-600';
  };

  const formatValue = (value: number, dataType: string, unit: string) => {
    switch (dataType) {
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value}%`;
      default:
        return `${value}${unit !== 'count' ? ' ' + unit : ''}`;
    }
  };

  const calculateProgress = (current: number, target: number, baseline: number = 0) => {
    if (baseline === target) return 100;
    return Math.min(((current - baseline) / (target - baseline)) * 100, 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Impact Measurement Dashboard</CardTitle>
              <CardDescription>
                Track and analyze program outcomes, impacts, and return on investment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedProgram ? (
            /* Program Overview */
            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{programs.length}</div>
                    <div className="text-sm text-gray-600">Active Programs</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {programs.reduce((sum, p) => sum + p.participants, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Participants</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${(programs.reduce((sum, p) => sum + p.budget, 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-600">Total Investment</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {programs.reduce((sum, p) => sum + p.metrics.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Metrics Tracked</div>
                  </CardContent>
                </Card>
              </div>

              {/* Program Cards */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Program Portfolio</CardTitle>
                      <CardDescription>Click on a program to view detailed impact metrics</CardDescription>
                    </div>
                    <Button 
                      onClick={generateImpactReport}
                      disabled={isGeneratingReport}
                      variant="outline"
                    >
                      {isGeneratingReport ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export Report
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {programs.map((program) => {
                    const avgProgress = program.metrics.reduce((sum, metric) => 
                      sum + calculateProgress(metric.current, metric.target, metric.baseline), 0
                    ) / program.metrics.length;

                    return (
                      <div key={program.id} 
                           className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                           onClick={() => setSelectedProgram(program)}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{program.name}</h4>
                            <p className="text-gray-600">{program.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(program.status)} variant="secondary">
                              {program.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">{program.participants}</div>
                            <div className="text-xs text-blue-600">Participants</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">
                              ${(program.budget / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs text-green-600">Budget</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="text-lg font-bold text-purple-600">{program.metrics.length}</div>
                            <div className="text-xs text-purple-600">Metrics</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <div className="text-lg font-bold text-orange-600">{Math.round(avgProgress)}%</div>
                            <div className="text-xs text-orange-600">Avg Progress</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Started: {program.startDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={avgProgress} className="w-20 h-2" />
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Program Detail View */
            <div className="space-y-6">
              {/* Program Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedProgram.name}</CardTitle>
                      <CardDescription>{selectedProgram.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedProgram(null)}>
                      Back to Portfolio
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">{selectedProgram.participants}</div>
                      <div className="text-sm text-blue-600">Participants Served</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">
                        ${(selectedProgram.budget / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-green-600">Total Budget</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-xl font-bold text-purple-600">
                        ${Math.round(selectedProgram.budget / selectedProgram.participants)}
                      </div>
                      <div className="text-sm text-purple-600">Cost per Participant</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-xl font-bold text-orange-600">
                        {Math.round((Date.now() - selectedProgram.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))}
                      </div>
                      <div className="text-sm text-orange-600">Months Active</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Performance Metrics</CardTitle>
                  <CardDescription>Progress toward program goals and targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProgram.metrics.map((metric) => {
                    const progress = calculateProgress(metric.current, metric.target, metric.baseline);
                    const TrendIcon = getTrendIcon(metric.current, metric.target, metric.baseline);
                    
                    return (
                      <div key={metric.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{metric.name}</h4>
                            <p className="text-sm text-gray-600">{metric.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(metric.category)} variant="secondary">
                              {metric.category}
                            </Badge>
                            <TrendIcon className={`w-5 h-5 ${getTrendColor(metric.current, metric.target, metric.baseline)}`} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-lg font-bold">
                              {formatValue(metric.baseline, metric.dataType, metric.unit)}
                            </div>
                            <div className="text-xs text-gray-600">Baseline</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-lg font-bold text-blue-600">
                              {formatValue(metric.current, metric.dataType, metric.unit)}
                            </div>
                            <div className="text-xs text-blue-600">Current</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-lg font-bold text-green-600">
                              {formatValue(metric.target, metric.dataType, metric.unit)}
                            </div>
                            <div className="text-xs text-green-600">Target</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to Target</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-3" />
                        </div>
                        
                        <div className="mt-3 text-xs text-gray-600">
                          <div>Collection Method: {metric.collectionMethod}</div>
                          <div>Last Updated: {metric.lastUpdated.toLocaleDateString()}</div>
                          <div>Stakeholders: {metric.stakeholders.join(', ')}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Theory of Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Theory of Change</CardTitle>
                  <CardDescription>The logic behind how this program creates impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-blue-800">{selectedProgram.theoryOfChange}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedProgram.logicModel.map((component) => (
                      <div key={component.type} className="border rounded-lg p-4">
                        <h4 className="font-semibold capitalize mb-2 text-purple-700">
                          {component.type.replace('_', ' ')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {component.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Impact Measurement Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Impact Measurement Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Effective Measurement:</h4>
                  <ul className="space-y-1">
                    <li>• Define clear, measurable outcomes from the start</li>
                    <li>• Use both quantitative and qualitative indicators</li>
                    <li>• Collect baseline data before program launch</li>
                    <li>• Involve stakeholders in metric selection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Quality:</h4>
                  <ul className="space-y-1">
                    <li>• Ensure data collection methods are reliable</li>
                    <li>• Document data sources and limitations</li>
                    <li>• Regular data validation and cleaning</li>
                    <li>• Use data to improve program delivery</li>
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

export default AlexImpactMeasurement;