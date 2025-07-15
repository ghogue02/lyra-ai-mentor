import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AIImpactCalculatorProps {
  character: {
    name: string;
    role: string;
  };
  onComplete: () => void;
}

interface Task {
  name: string;
  hoursPerWeek: number;
  aiReduction: number;
}

interface ImpactMetrics {
  totalHoursSaved: number;
  dollarsSaved: number;
  tasksAutomated: number;
  roiPercentage: number;
  additionalCapacity: string;
}

const commonTasks = {
  communications: [
    { name: 'Email drafting', avgHours: 5, aiPotential: 70 },
    { name: 'Report writing', avgHours: 8, aiPotential: 60 },
    { name: 'Social media posts', avgHours: 3, aiPotential: 80 },
    { name: 'Grant proposals', avgHours: 10, aiPotential: 50 }
  ],
  data: [
    { name: 'Data analysis', avgHours: 6, aiPotential: 75 },
    { name: 'Report generation', avgHours: 4, aiPotential: 85 },
    { name: 'Trend identification', avgHours: 3, aiPotential: 90 },
    { name: 'Dashboard updates', avgHours: 2, aiPotential: 95 }
  ],
  operations: [
    { name: 'Meeting summaries', avgHours: 3, aiPotential: 80 },
    { name: 'Process documentation', avgHours: 4, aiPotential: 70 },
    { name: 'Training materials', avgHours: 5, aiPotential: 65 },
    { name: 'FAQ responses', avgHours: 2, aiPotential: 90 }
  ]
};

export default function AIImpactCalculator({ character, onComplete }: AIImpactCalculatorProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [teamSize, setTeamSize] = useState(1);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  const addTask = (taskTemplate: any) => {
    const newTask: Task = {
      name: taskTemplate.name,
      hoursPerWeek: taskTemplate.avgHours,
      aiReduction: taskTemplate.aiPotential
    };
    setTasks([...tasks, newTask]);
    
    if (tasks.length === 1) {
      onComplete();
    }
  };

  const updateTaskHours = (index: number, hours: number) => {
    const updated = [...tasks];
    updated[index].hoursPerWeek = hours;
    setTasks(updated);
  };

  const updateTaskReduction = (index: number, reduction: number) => {
    const updated = [...tasks];
    updated[index].aiReduction = reduction;
    setTasks(updated);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const calculateImpact = () => {
    if (tasks.length === 0) return;

    const weeklyHoursSaved = tasks.reduce((sum, task) => 
      sum + (task.hoursPerWeek * (task.aiReduction / 100)), 0
    ) * teamSize;
    
    const annualHoursSaved = weeklyHoursSaved * 52;
    const dollarsSaved = annualHoursSaved * hourlyRate;
    const tasksAutomated = tasks.filter(t => t.aiReduction >= 50).length;
    const totalHours = tasks.reduce((sum, task) => sum + task.hoursPerWeek, 0) * teamSize * 52;
    const roiPercentage = (annualHoursSaved / totalHours) * 100;

    // Calculate what could be done with saved time
    const additionalPrograms = Math.floor(annualHoursSaved / 200);
    const additionalClients = Math.floor(annualHoursSaved / 50);

    setMetrics({
      totalHoursSaved: Math.round(annualHoursSaved),
      dollarsSaved: Math.round(dollarsSaved),
      tasksAutomated,
      roiPercentage: Math.round(roiPercentage),
      additionalCapacity: `${additionalPrograms} new programs or serve ${additionalClients} more clients`
    });
    setShowCharts(true);
  };

  const getTaskCategory = () => {
    if (character.role.includes('Communications')) return 'communications';
    if (character.role.includes('Data')) return 'data';
    return 'operations';
  };

  const relevantTasks = commonTasks[getTaskCategory() as keyof typeof commonTasks];

  // Chart data
  const barChartData = {
    labels: tasks.map(t => t.name),
    datasets: [
      {
        label: 'Current Hours',
        data: tasks.map(t => t.hoursPerWeek),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      },
      {
        label: 'With AI',
        data: tasks.map(t => t.hoursPerWeek * (1 - t.aiReduction / 100)),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  const doughnutData = {
    labels: ['Time Saved', 'Remaining Work'],
    datasets: [{
      data: [
        metrics?.totalHoursSaved || 0,
        (tasks.reduce((sum, t) => sum + t.hoursPerWeek, 0) * 52 * teamSize) - (metrics?.totalHoursSaved || 0)
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(229, 231, 235, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-900">
            <TrendingUp className="h-5 w-5 mr-2" />
            Calculate Your AI Impact
          </CardTitle>
          <CardDescription className="text-emerald-700">
            See the real time and cost savings AI can bring to your work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-800">
            Add your regular tasks and see how much time AI could save you. 
            Calculate ROI and discover what else you could accomplish.
          </p>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
          <Input
            id="hourly-rate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor="team-size">Team Size</Label>
          <Input
            id="team-size"
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      {/* Task Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Common {character.role} Tasks</CardTitle>
          <CardDescription>Click to add tasks you regularly perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {relevantTasks.map((task, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addTask(task)}
                disabled={tasks.some(t => t.name === task.name)}
              >
                <div className="text-left">
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-gray-500">
                    ~{task.avgHours}h/week • {task.aiPotential}% AI potential
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Tasks */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{task.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Hours per week</Label>
                      <Input
                        type="number"
                        value={task.hoursPerWeek}
                        onChange={(e) => updateTaskHours(index, parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">AI efficiency ({task.aiReduction}%)</Label>
                      <Slider
                        value={[task.aiReduction]}
                        onValueChange={(value) => updateTaskReduction(index, value[0])}
                        max={100}
                        step={5}
                        className="mt-3"
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Time saved: {(task.hoursPerWeek * task.aiReduction / 100).toFixed(1)} hours/week
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button onClick={calculateImpact} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Calculate Impact
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metrics.totalHoursSaved.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Hours/Year Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">${metrics.dollarsSaved.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Annual Savings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metrics.roiPercentage}%</p>
                      <p className="text-xs text-gray-500">Efficiency Gain</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Users className="h-8 w-8 text-orange-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{metrics.tasksAutomated}</p>
                      <p className="text-xs text-gray-500">Tasks Automated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            {showCharts && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Time Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Bar 
                      data={barChartData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Hours per Week'
                            }
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Annual Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Doughnut 
                      data={doughnutData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Additional Capacity */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">With Your Saved Time, You Could:</h3>
                <p className="text-gray-700">{metrics.additionalCapacity}</p>
                <div className="mt-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-gray-600">
                    That's {Math.round(metrics.totalHoursSaved / 40)} full work weeks per year!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}