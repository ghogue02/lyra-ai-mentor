import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ListTodo, Clock, Copy, AlertCircle, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface TaskPrioritizerProps {
  onComplete?: () => void;
}

interface PrioritizedTask {
  task: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  reason: string;
}

export const TaskPrioritizer: React.FC<TaskPrioritizerProps> = ({ onComplete }) => {
  const [timeframe, setTimeframe] = useState<string>('');
  const [taskList, setTaskList] = useState('');
  const [prioritizedTasks, setPrioritizedTasks] = useState<PrioritizedTask[]>([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [methodology, setMethodology] = useState<string>('eisenhower');

  const timeframes = [
    { value: 'today', label: 'Today', description: 'What must be done today' },
    { value: 'this_week', label: 'This Week', description: 'Weekly priorities' },
    { value: 'this_month', label: 'This Month', description: 'Monthly planning' },
    { value: 'this_quarter', label: 'This Quarter', description: 'Quarterly objectives' }
  ];

  const methodologies = [
    { value: 'eisenhower', label: 'Eisenhower Matrix', description: 'Urgent vs Important' },
    { value: 'impact_effort', label: 'Impact vs Effort', description: 'High impact, low effort first' },
    { value: 'deadline', label: 'Deadline Based', description: 'Time-sensitive prioritization' },
    { value: 'strategic', label: 'Strategic Alignment', description: 'Mission and goals focused' }
  ];

  const prioritizeTasks = async () => {
    if (!timeframe || !taskList.trim()) {
      toast.error('Please select timeframe and enter your tasks');
      return;
    }

    setIsPrioritizing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const tasks = parseTasks(taskList);
      const prioritized = generatePriorities(tasks);
      setPrioritizedTasks(prioritized);
      
      toast.success('Tasks prioritized successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to prioritize tasks. Please try again.');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const parseTasks = (text: string): string[] => {
    return text.split('\n').filter(task => task.trim().length > 0).map(task => task.trim());
  };

  const generatePriorities = (tasks: string[]): PrioritizedTask[] => {
    const selectedTimeframe = timeframes.find(t => t.value === timeframe);
    
    return tasks.map((task, index) => {
      // Simulate intelligent prioritization based on task content
      const isUrgent = task.toLowerCase().includes('urgent') || 
                       task.toLowerCase().includes('deadline') ||
                       task.toLowerCase().includes('today') ||
                       task.toLowerCase().includes('asap');
      
      const isHighImpact = task.toLowerCase().includes('board') ||
                          task.toLowerCase().includes('grant') ||
                          task.toLowerCase().includes('donor') ||
                          task.toLowerCase().includes('critical');
      
      const isLowEffort = task.toLowerCase().includes('email') ||
                         task.toLowerCase().includes('call') ||
                         task.toLowerCase().includes('quick') ||
                         task.toLowerCase().includes('simple');

      let priority: 'urgent' | 'high' | 'medium' | 'low';
      let reason: string;
      let suggestedTimeframe: string;

      if (methodology === 'eisenhower') {
        if (isUrgent && isHighImpact) {
          priority = 'urgent';
          reason = 'Urgent and important - do immediately';
          suggestedTimeframe = 'Today';
        } else if (!isUrgent && isHighImpact) {
          priority = 'high';
          reason = 'Important but not urgent - schedule time';
          suggestedTimeframe = 'This week';
        } else if (isUrgent && !isHighImpact) {
          priority = 'medium';
          reason = 'Urgent but less important - delegate if possible';
          suggestedTimeframe = 'Today/Tomorrow';
        } else {
          priority = 'low';
          reason = 'Neither urgent nor important - consider eliminating';
          suggestedTimeframe = 'This month or later';
        }
      } else if (methodology === 'impact_effort') {
        if (isHighImpact && isLowEffort) {
          priority = 'urgent';
          reason = 'High impact, low effort - quick win';
          suggestedTimeframe = 'Today';
        } else if (isHighImpact && !isLowEffort) {
          priority = 'high';
          reason = 'High impact but requires effort - plan carefully';
          suggestedTimeframe = 'This week';
        } else if (!isHighImpact && isLowEffort) {
          priority = 'medium';
          reason = 'Low impact but easy - batch with similar tasks';
          suggestedTimeframe = 'This week';
        } else {
          priority = 'low';
          reason = 'Low impact, high effort - reconsider necessity';
          suggestedTimeframe = 'Next month or defer';
        }
      } else {
        // Default prioritization
        const priorities: Array<'urgent' | 'high' | 'medium' | 'low'> = ['urgent', 'high', 'medium', 'low'];
        priority = priorities[Math.min(index, 3)];
        reason = 'Prioritized based on order and content analysis';
        suggestedTimeframe = index < 3 ? 'This week' : 'This month';
      }

      return {
        task,
        priority,
        effort: isLowEffort ? 'low' : (isHighImpact ? 'high' : 'medium'),
        impact: isHighImpact ? 'high' : 'medium',
        timeframe: suggestedTimeframe,
        reason
      };
    }).sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const copyPrioritizedList = () => {
    const formattedList = prioritizedTasks.map((task, index) => 
      `${index + 1}. [${task.priority.toUpperCase()}] ${task.task}\n   Timeframe: ${task.timeframe}\n   Reason: ${task.reason}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(formattedList);
    toast.success('Prioritized task list copied!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-orange-600" />
            Task Prioritizer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform overwhelming to-do lists into prioritized action plans
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select planning timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      <div>
                        <div className="font-medium">{tf.label}</div>
                        <div className="text-xs text-gray-500">{tf.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prioritization Method</label>
              <Select value={methodology} onValueChange={setMethodology}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methodologies.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div>
                        <div className="font-medium">{method.label}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Task List
            </label>
            <Textarea
              value={taskList}
              onChange={(e) => setTaskList(e.target.value)}
              placeholder="Enter your tasks, one per line. For example:\n\nFinish grant proposal for City Council\nCall major donor about year-end gift\nPrepare board meeting agenda\nReview program budget with finance team\nSend volunteer appreciation emails\nUpdate website with new program info"
              rows={8}
              className="resize-none font-mono text-sm"
            />
          </div>

          <Button 
            onClick={prioritizeTasks} 
            disabled={isPrioritizing || !timeframe || !taskList.trim()}
            className="w-full"
          >
            {isPrioritizing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Analyzing & Prioritizing...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Prioritize My Tasks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {prioritizedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Prioritized Action Plan</CardTitle>
              <Button variant="outline" size="sm" onClick={copyPrioritizedList}>
                <Copy className="h-4 w-4 mr-1" />
                Copy List
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Focus on urgent items first, then work through high priority tasks
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {prioritizedTasks.map((task, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.timeframe}
                      </Badge>
                      {task.priority === 'urgent' && <Zap className="h-4 w-4 text-red-600" />}
                    </div>
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <p className="text-sm text-gray-600 mt-1">{task.reason}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Impact: {task.impact}</span>
                      <span>Effort: {task.effort}</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Time Management Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Block time for urgent tasks immediately</li>
                    <li>Batch similar medium-priority tasks together</li>
                    <li>Consider delegating or deferring low priority items</li>
                    <li>Review and adjust priorities weekly</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};