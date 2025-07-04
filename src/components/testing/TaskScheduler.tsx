import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckSquare, AlertCircle, BarChart, Target, Repeat } from 'lucide-react';
import { toast } from 'sonner';

interface TaskSchedulerProps {
  onComplete?: () => void;
}

interface ScheduledTask {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  frequency: string;
  timeEstimate: string;
  assignee: string;
  dependencies?: string[];
  bestTime?: string;
}

interface TaskSchedule {
  period: string;
  totalTasks: number;
  totalHours: number;
  schedule: {
    day: string;
    tasks: ScheduledTask[];
    totalTime: string;
    focusBlocks: string[];
  }[];
  optimizations: string[];
  conflicts: string[];
  recommendations: string[];
}

export const TaskScheduler: React.FC<TaskSchedulerProps> = ({ onComplete }) => {
  const [scheduleType, setScheduleType] = useState<string>('');
  const [teamSize, setTeamSize] = useState<string>('');
  const [taskList, setTaskList] = useState('');
  const [constraints, setConstraints] = useState<string>('');
  const [schedule, setSchedule] = useState<TaskSchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const scheduleTypes = [
    { value: 'daily', label: 'Daily Schedule', description: 'Optimize today\'s tasks' },
    { value: 'weekly', label: 'Weekly Schedule', description: 'Plan the week ahead' },
    { value: 'sprint', label: 'Sprint Planning', description: '2-week project sprint' },
    { value: 'monthly', label: 'Monthly Overview', description: 'Long-term planning' }
  ];

  const teamSizes = [
    { value: 'solo', label: 'Individual', description: 'Personal task management' },
    { value: 'small', label: 'Small Team (2-5)', description: 'Coordinate small group' },
    { value: 'medium', label: 'Medium Team (6-15)', description: 'Department level' },
    { value: 'large', label: 'Large Team (15+)', description: 'Organization wide' }
  ];

  const generateSchedule = async () => {
    if (!scheduleType || !teamSize || !taskList.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createTaskSchedule();
      setSchedule(result);
      
      toast.success('Task schedule optimized!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate schedule. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createTaskSchedule = (): TaskSchedule => {
    const templates: Record<string, () => TaskSchedule> = {
      weekly_individual: () => ({
        period: 'Week of November 11-17, 2024',
        totalTasks: 28,
        totalHours: 35,
        schedule: [
          {
            day: 'Monday, Nov 11',
            tasks: [
              {
                id: 1,
                title: 'Weekly Team Meeting',
                description: 'Review goals and priorities for the week',
                category: 'Meetings',
                priority: 'high',
                frequency: 'Weekly',
                timeEstimate: '1 hour',
                assignee: 'You',
                bestTime: '9:00 AM - 10:00 AM'
              },
              {
                id: 2,
                title: 'Grant Proposal Draft',
                description: 'Complete first draft of youth program grant',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '3 hours',
                assignee: 'You',
                dependencies: ['Research complete'],
                bestTime: '10:30 AM - 1:30 PM'
              },
              {
                id: 3,
                title: 'Donor Thank You Calls',
                description: 'Call 5 major donors from last week',
                category: 'Donor Relations',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '1.5 hours',
                assignee: 'You',
                bestTime: '2:30 PM - 4:00 PM'
              },
              {
                id: 4,
                title: 'Email Newsletter Review',
                description: 'Review and approve monthly newsletter',
                category: 'Communications',
                priority: 'medium',
                frequency: 'Monthly',
                timeEstimate: '30 minutes',
                assignee: 'You',
                bestTime: '4:00 PM - 4:30 PM'
              }
            ],
            totalTime: '6 hours',
            focusBlocks: ['10:30 AM - 1:30 PM: Deep work on grant proposal']
          },
          {
            day: 'Tuesday, Nov 12',
            tasks: [
              {
                id: 5,
                title: 'Board Report Preparation',
                description: 'Compile Q3 metrics and narrative',
                category: 'Reporting',
                priority: 'high',
                frequency: 'Quarterly',
                timeEstimate: '2.5 hours',
                assignee: 'You',
                bestTime: '9:00 AM - 11:30 AM'
              },
              {
                id: 6,
                title: 'Volunteer Orientation',
                description: 'Lead new volunteer orientation session',
                category: 'Volunteer Management',
                priority: 'high',
                frequency: 'Bi-weekly',
                timeEstimate: '2 hours',
                assignee: 'You',
                bestTime: '1:00 PM - 3:00 PM'
              },
              {
                id: 7,
                title: 'Budget Review Meeting',
                description: 'Monthly budget check with finance team',
                category: 'Finance',
                priority: 'medium',
                frequency: 'Monthly',
                timeEstimate: '1 hour',
                assignee: 'You',
                bestTime: '3:30 PM - 4:30 PM'
              }
            ],
            totalTime: '5.5 hours',
            focusBlocks: ['9:00 AM - 11:30 AM: Board report focus time']
          },
          {
            day: 'Wednesday, Nov 13',
            tasks: [
              {
                id: 8,
                title: 'Program Site Visits',
                description: 'Visit 3 program locations for quality check',
                category: 'Program Management',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '4 hours',
                assignee: 'You',
                bestTime: '9:00 AM - 1:00 PM'
              },
              {
                id: 9,
                title: 'Staff 1-on-1 Meetings',
                description: '3 direct report check-ins',
                category: 'Management',
                priority: 'high',
                frequency: 'Weekly',
                timeEstimate: '1.5 hours',
                assignee: 'You',
                bestTime: '2:00 PM - 3:30 PM'
              },
              {
                id: 10,
                title: 'Social Media Planning',
                description: 'Plan next week\'s social content',
                category: 'Communications',
                priority: 'low',
                frequency: 'Weekly',
                timeEstimate: '1 hour',
                assignee: 'You',
                bestTime: '3:30 PM - 4:30 PM'
              }
            ],
            totalTime: '6.5 hours',
            focusBlocks: ['9:00 AM - 1:00 PM: Field work block']
          },
          {
            day: 'Thursday, Nov 14',
            tasks: [
              {
                id: 11,
                title: 'Grant Proposal Finalization',
                description: 'Final edits and submission prep',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '2 hours',
                assignee: 'You',
                dependencies: ['Draft complete', 'Budget approved'],
                bestTime: '9:00 AM - 11:00 AM'
              },
              {
                id: 12,
                title: 'Donor Cultivation Lunch',
                description: 'Major donor meeting downtown',
                category: 'Donor Relations',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '2 hours',
                assignee: 'You',
                bestTime: '12:00 PM - 2:00 PM'
              },
              {
                id: 13,
                title: 'Event Planning Committee',
                description: 'Annual gala planning meeting',
                category: 'Events',
                priority: 'medium',
                frequency: 'Bi-weekly',
                timeEstimate: '1.5 hours',
                assignee: 'You',
                bestTime: '2:30 PM - 4:00 PM'
              },
              {
                id: 14,
                title: 'Email Inbox Management',
                description: 'Clear and organize email backlog',
                category: 'Admin',
                priority: 'low',
                frequency: 'Daily',
                timeEstimate: '45 minutes',
                assignee: 'You',
                bestTime: '4:00 PM - 4:45 PM'
              }
            ],
            totalTime: '6.25 hours',
            focusBlocks: ['9:00 AM - 11:00 AM: Grant deadline focus']
          },
          {
            day: 'Friday, Nov 15',
            tasks: [
              {
                id: 15,
                title: 'Weekly Planning Session',
                description: 'Plan next week\'s priorities',
                category: 'Planning',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '1 hour',
                assignee: 'You',
                bestTime: '9:00 AM - 10:00 AM'
              },
              {
                id: 16,
                title: 'Program Data Analysis',
                description: 'Review weekly program metrics',
                category: 'Data & Reporting',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '1.5 hours',
                assignee: 'You',
                bestTime: '10:00 AM - 11:30 AM'
              },
              {
                id: 17,
                title: 'Team Celebration Lunch',
                description: 'Monthly team appreciation lunch',
                category: 'Team Building',
                priority: 'low',
                frequency: 'Monthly',
                timeEstimate: '1.5 hours',
                assignee: 'You',
                bestTime: '12:00 PM - 1:30 PM'
              },
              {
                id: 18,
                title: 'Professional Development',
                description: 'Webinar on nonprofit leadership',
                category: 'Learning',
                priority: 'low',
                frequency: 'One-time',
                timeEstimate: '1 hour',
                assignee: 'You',
                bestTime: '2:00 PM - 3:00 PM'
              },
              {
                id: 19,
                title: 'Week Wrap-up',
                description: 'Update task lists and close out week',
                category: 'Admin',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '30 minutes',
                assignee: 'You',
                bestTime: '3:30 PM - 4:00 PM'
              }
            ],
            totalTime: '5.5 hours',
            focusBlocks: ['10:00 AM - 11:30 AM: Analytics deep dive']
          }
        ],
        optimizations: [
          'Grouped similar tasks together to minimize context switching',
          'Scheduled high-priority grant work during peak focus hours (mornings)',
          'Built in buffer time between meetings for transitions',
          'Protected deep work blocks for complex tasks',
          'Balanced desk work with field work throughout the week',
          'Front-loaded high-priority items early in the week'
        ],
        conflicts: [
          'Thursday afternoon has back-to-back meetings - consider buffer time',
          'Grant deadline and donor lunch on same day may cause stress',
          'Limited time for unexpected issues or emergencies',
          'Friday afternoon may have low energy for planning tasks'
        ],
        recommendations: [
          'Block 30 minutes each morning for email triage before deep work',
          'Consider delegating newsletter review to communications staff',
          'Build in 2-3 hours of flex time weekly for unexpected issues',
          'Schedule regular breaks between intense focus sessions',
          'Move lower priority tasks to times when energy typically dips',
          'Create templates for recurring tasks to save time'
        ]
      }),

      weekly_team: () => ({
        period: 'Team Schedule: November 11-17, 2024',
        totalTasks: 47,
        totalHours: 120,
        schedule: [
          {
            day: 'Monday, Nov 11',
            tasks: [
              {
                id: 1,
                title: 'All-Staff Meeting',
                description: 'Weekly team sync and updates',
                category: 'Meetings',
                priority: 'high',
                frequency: 'Weekly',
                timeEstimate: '1 hour',
                assignee: 'All Staff',
                bestTime: '9:00 AM - 10:00 AM'
              },
              {
                id: 2,
                title: 'Grant Research',
                description: 'Identify new funding opportunities',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'Weekly',
                timeEstimate: '2 hours',
                assignee: 'Sarah (Development)',
                bestTime: '10:00 AM - 12:00 PM'
              },
              {
                id: 3,
                title: 'Program Planning Session',
                description: 'Design winter youth program',
                category: 'Programs',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '3 hours',
                assignee: 'Program Team',
                bestTime: '10:00 AM - 1:00 PM'
              },
              {
                id: 4,
                title: 'Volunteer Scheduling',
                description: 'Create next week\'s volunteer schedule',
                category: 'Volunteer Mgmt',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '1.5 hours',
                assignee: 'Mike (Volunteer Coord)',
                bestTime: '2:00 PM - 3:30 PM'
              },
              {
                id: 5,
                title: 'Social Media Content',
                description: 'Create and schedule week\'s posts',
                category: 'Communications',
                priority: 'medium',
                frequency: 'Weekly',
                timeEstimate: '2 hours',
                assignee: 'Lisa (Communications)',
                bestTime: '1:00 PM - 3:00 PM'
              }
            ],
            totalTime: '9.5 hours (distributed)',
            focusBlocks: ['Program Team: 10 AM - 1 PM program design']
          },
          {
            day: 'Tuesday, Nov 12',
            tasks: [
              {
                id: 6,
                title: 'Client Intakes',
                description: 'New participant assessments',
                category: 'Direct Service',
                priority: 'high',
                frequency: 'Daily',
                timeEstimate: '3 hours',
                assignee: 'Case Managers',
                bestTime: '9:00 AM - 12:00 PM'
              },
              {
                id: 7,
                title: 'Donor Database Update',
                description: 'Enter new donations and update records',
                category: 'Data Entry',
                priority: 'medium',
                frequency: 'Daily',
                timeEstimate: '2 hours',
                assignee: 'Sarah (Development)',
                bestTime: '9:00 AM - 11:00 AM'
              },
              {
                id: 8,
                title: 'Finance Committee Prep',
                description: 'Prepare materials for committee meeting',
                category: 'Finance',
                priority: 'high',
                frequency: 'Monthly',
                timeEstimate: '2.5 hours',
                assignee: 'Finance Team',
                bestTime: '1:00 PM - 3:30 PM'
              },
              {
                id: 9,
                title: 'Volunteer Training',
                description: 'Train new tutoring volunteers',
                category: 'Training',
                priority: 'high',
                frequency: 'Weekly',
                timeEstimate: '2 hours',
                assignee: 'Mike & Program Staff',
                bestTime: '4:00 PM - 6:00 PM'
              }
            ],
            totalTime: '9.5 hours (distributed)',
            focusBlocks: ['Case Managers: Morning intake block']
          },
          {
            day: 'Wednesday, Nov 13',
            tasks: [
              {
                id: 10,
                title: 'Program Delivery',
                description: 'Youth after-school programs',
                category: 'Direct Service',
                priority: 'high',
                frequency: 'Daily',
                timeEstimate: '4 hours',
                assignee: 'Program Staff',
                bestTime: '2:00 PM - 6:00 PM'
              },
              {
                id: 11,
                title: 'Grant Writing',
                description: 'Complete foundation grant application',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '4 hours',
                assignee: 'Sarah & Executive Director',
                bestTime: '9:00 AM - 1:00 PM'
              },
              {
                id: 12,
                title: 'Newsletter Production',
                description: 'Write and design monthly newsletter',
                category: 'Communications',
                priority: 'medium',
                frequency: 'Monthly',
                timeEstimate: '3 hours',
                assignee: 'Lisa (Communications)',
                bestTime: '9:00 AM - 12:00 PM'
              },
              {
                id: 13,
                title: 'Facilities Maintenance',
                description: 'Weekly facility checks and repairs',
                category: 'Operations',
                priority: 'low',
                frequency: 'Weekly',
                timeEstimate: '2 hours',
                assignee: 'Operations Manager',
                bestTime: '10:00 AM - 12:00 PM'
              }
            ],
            totalTime: '13 hours (distributed)',
            focusBlocks: ['Development: Morning grant writing sprint']
          }
        ],
        optimizations: [
          'Assigned tasks based on team member expertise and availability',
          'Coordinated collaborative tasks to minimize meeting overhead',
          'Staggered direct service and administrative work',
          'Protected focus time for complex tasks like grant writing',
          'Distributed workload evenly across team members',
          'Aligned task timing with program schedules'
        ],
        conflicts: [
          'Program staff have overlapping commitments Tuesday afternoon',
          'Development director has competing priorities on Wednesday',
          'Limited coverage for front desk during all-staff meeting',
          'Volunteer training conflicts with some program times'
        ],
        recommendations: [
          'Implement task management software for better visibility',
          'Create shared calendar for all team members',
          'Establish "no meeting" blocks for focused work',
          'Cross-train staff to provide backup coverage',
          'Set up weekly check-ins between departments',
          'Build buffer time into grant deadline schedules'
        ]
      }),

      sprint_planning: () => ({
        period: 'Sprint 14: November 11-24, 2024',
        totalTasks: 32,
        totalHours: 80,
        schedule: [
          {
            day: 'Week 1',
            tasks: [
              {
                id: 1,
                title: 'Annual Gala Planning - Venue & Catering',
                description: 'Finalize venue contract and catering menu',
                category: 'Event Planning',
                priority: 'high',
                frequency: 'Sprint task',
                timeEstimate: '8 hours',
                assignee: 'Events Team',
                dependencies: ['Budget approval', 'Board input']
              },
              {
                id: 2,
                title: 'Donor Management System Migration',
                description: 'Export data from old system, clean, and import',
                category: 'Technology',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '12 hours',
                assignee: 'Tech & Development',
                dependencies: ['New system setup', 'Staff training']
              },
              {
                id: 3,
                title: 'Q4 Impact Report Design',
                description: 'Create report template and gather metrics',
                category: 'Communications',
                priority: 'medium',
                frequency: 'Quarterly',
                timeEstimate: '10 hours',
                assignee: 'Communications Team'
              },
              {
                id: 4,
                title: 'New Program Launch Prep',
                description: 'Finalize curriculum and recruit participants',
                category: 'Programs',
                priority: 'high',
                frequency: 'One-time',
                timeEstimate: '15 hours',
                assignee: 'Program Team',
                dependencies: ['Space confirmed', 'Staff hired']
              }
            ],
            totalTime: '45 hours',
            focusBlocks: ['Days 1-3: System migration intensive', 'Days 4-5: Program launch sprint']
          },
          {
            day: 'Week 2',
            tasks: [
              {
                id: 5,
                title: 'Annual Gala - Sponsorship Outreach',
                description: 'Contact potential sponsors, create packages',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'Sprint task',
                timeEstimate: '10 hours',
                assignee: 'Development Team',
                dependencies: ['Sponsorship levels approved']
              },
              {
                id: 6,
                title: 'Staff Performance Reviews',
                description: 'Complete quarterly performance reviews',
                category: 'HR',
                priority: 'medium',
                frequency: 'Quarterly',
                timeEstimate: '8 hours',
                assignee: 'Managers'
              },
              {
                id: 7,
                title: 'Budget Revision',
                description: 'Update Q4 budget based on actuals',
                category: 'Finance',
                priority: 'high',
                frequency: 'Monthly',
                timeEstimate: '6 hours',
                assignee: 'Finance Team'
              },
              {
                id: 8,
                title: 'Program Evaluation Surveys',
                description: 'Deploy and analyze participant surveys',
                category: 'Evaluation',
                priority: 'medium',
                frequency: 'Monthly',
                timeEstimate: '6 hours',
                assignee: 'Program Team'
              },
              {
                id: 9,
                title: 'Year-End Campaign Launch',
                description: 'Launch email and social campaigns',
                category: 'Fundraising',
                priority: 'high',
                frequency: 'Annual',
                timeEstimate: '5 hours',
                assignee: 'Development & Comms'
              }
            ],
            totalTime: '35 hours',
            focusBlocks: ['Days 8-9: Fundraising push', 'Day 10: Review sprint']
          }
        ],
        optimizations: [
          'Front-loaded high-dependency tasks in Week 1',
          'Grouped related tasks to maximize momentum',
          'Allocated heaviest tasks early in sprint when energy is high',
          'Built in review time at end of Week 2',
          'Coordinated cross-team dependencies',
          'Protected time for unexpected issues (15% buffer)'
        ],
        conflicts: [
          'Gala planning and year-end campaign may compete for resources',
          'System migration could impact daily operations',
          'Performance reviews during busy fundraising period',
          'Multiple high-priority items in Week 1'
        ],
        recommendations: [
          'Daily 15-minute stand-ups to track sprint progress',
          'Designate sprint champion to remove blockers',
          'Create contingency plans for system migration',
          'Consider pushing non-critical tasks to next sprint',
          'Schedule sprint retrospective for continuous improvement',
          'Use project management tool for real-time updates'
        ]
      })
    };

    if (scheduleType === 'weekly' && teamSize === 'solo') {
      return templates.weekly_individual();
    } else if (scheduleType === 'weekly' && teamSize !== 'solo') {
      return templates.weekly_team();
    } else if (scheduleType === 'sprint') {
      return templates.sprint_planning();
    } else {
      return templates.weekly_individual(); // default
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Meeting')) return <Users className="h-4 w-4" />;
    if (category.includes('Fundraising') || category.includes('Grant')) return <Target className="h-4 w-4" />;
    if (category.includes('Program')) return <CheckSquare className="h-4 w-4" />;
    if (category.includes('Data') || category.includes('Report')) return <BarChart className="h-4 w-4" />;
    return <Calendar className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Task Scheduler
          </CardTitle>
          <p className="text-sm text-gray-600">
            Optimize task scheduling for maximum productivity
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Schedule Type</label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose schedule period" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Team Size</label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger>
                  <SelectValue placeholder="How many people?" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div>
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-gray-500">{size.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tasks to Schedule</label>
            <Textarea
              value={taskList}
              onChange={(e) => setTaskList(e.target.value)}
              placeholder="List your tasks, priorities, and deadlines. For example: 'Grant proposal due Friday (high priority), Weekly team meeting, Donor calls (medium), Monthly report...'"
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Constraints & Preferences (Optional)</label>
            <Textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="Any scheduling constraints? For example: 'No meetings before 10am, Fridays for planning, Program hours 2-6pm...'"
              rows={2}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generateSchedule} 
            disabled={isGenerating || !scheduleType || !teamSize || !taskList.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Optimizing Schedule...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Optimal Schedule
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {schedule && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{schedule.period}</CardTitle>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Total Tasks: {schedule.totalTasks}</span>
                    <span>Total Hours: {schedule.totalHours}</span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {scheduleType === 'sprint' ? 'Sprint View' : 'Calendar View'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {schedule.schedule.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{day.day}</CardTitle>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {day.totalTime}
                  </Badge>
                </div>
                {day.focusBlocks.length > 0 && (
                  <div className="mt-2">
                    {day.focusBlocks.map((block, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-800 mr-2">
                        <Target className="h-3 w-3 mr-1" />
                        {block}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          {getCategoryIcon(task.category)}
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {task.assignee}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.timeEstimate}
                        </Badge>
                        {task.frequency !== 'One-time' && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="h-3 w-3 mr-1" />
                            {task.frequency}
                          </Badge>
                        )}
                        {task.bestTime && (
                          <Badge variant="secondary" className="text-xs">
                            {task.bestTime}
                          </Badge>
                        )}
                      </div>
                      
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Dependencies: {task.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                  Schedule Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {schedule.optimizations.map((opt, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-sm">{opt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Potential Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {schedule.conflicts.map((conflict, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">!</span>
                      <span className="text-sm">{conflict}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduling Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {schedule.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">→</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};