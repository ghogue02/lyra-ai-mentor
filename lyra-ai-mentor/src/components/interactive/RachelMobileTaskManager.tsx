import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  User, 
  MapPin,
  Calendar,
  Bell,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Flag,
  Eye,
  Edit,
  Trash2,
  Send
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: Date;
  location?: string;
  category: 'field_work' | 'admin' | 'client_visit' | 'data_collection' | 'follow_up';
  estimatedTime: number; // minutes
  actualTime?: number;
  notes: string[];
  attachments: string[];
  createdAt: Date;
  completedAt?: Date;
}

interface MobileInterface {
  view: 'dashboard' | 'tasks' | 'task_detail' | 'create_task' | 'profile';
  selectedTask?: Task;
  filterStatus: string;
  filterCategory: string;
  searchQuery: string;
}

interface Notification {
  id: string;
  type: 'reminder' | 'assignment' | 'completion' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  taskId?: string;
}

const RachelMobileTaskManager: React.FC = () => {
  const [mobileInterface, setMobileInterface] = useState<MobileInterface>({
    view: 'dashboard',
    filterStatus: 'all',
    filterCategory: 'all',
    searchQuery: ''
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser] = useState({
    name: 'Sarah Johnson',
    role: 'Field Coordinator',
    avatar: '👩‍💼'
  });

  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Client Home Visit - Martinez Family',
      description: 'Quarterly check-in with Martinez family for program compliance',
      assignee: 'Sarah Johnson',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      location: '123 Oak Street, Springfield',
      category: 'client_visit',
      estimatedTime: 90,
      notes: ['Bring updated program materials', 'Review progress since last visit'],
      attachments: ['client_file.pdf', 'program_checklist.pdf'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'task-2',
      title: 'Data Collection - Community Survey',
      description: 'Collect community feedback surveys from local businesses',
      assignee: 'Sarah Johnson',
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      location: 'Downtown Business District',
      category: 'data_collection',
      estimatedTime: 120,
      actualTime: 45,
      notes: ['Started at cafe on Main St', '3 of 12 surveys completed'],
      attachments: ['survey_template.pdf'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'task-3',
      title: 'Program Report Submission',
      description: 'Submit monthly program activity report to state office',
      assignee: 'Sarah Johnson',
      priority: 'urgent',
      status: 'pending',
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      category: 'admin',
      estimatedTime: 60,
      notes: ['Report template updated', 'Need final approval from supervisor'],
      attachments: ['monthly_report_draft.docx'],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'task-4',
      title: 'Follow-up Call - Williams Family',
      description: 'Check on progress after last weeks intervention',
      assignee: 'Sarah Johnson',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      category: 'follow_up',
      estimatedTime: 30,
      actualTime: 25,
      notes: ['Family doing well', 'Scheduled next appointment'],
      attachments: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  const sampleNotifications: Notification[] = [
    {
      id: 'notif-1',
      type: 'reminder',
      title: 'Upcoming Task',
      message: 'Client home visit starts in 30 minutes',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      taskId: 'task-1'
    },
    {
      id: 'notif-2',
      type: 'urgent',
      title: 'Urgent Task',
      message: 'Program report due in 4 hours',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      taskId: 'task-3'
    },
    {
      id: 'notif-3',
      type: 'completion',
      title: 'Task Completed',
      message: 'Follow-up call marked as complete',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      taskId: 'task-4'
    }
  ];

  React.useEffect(() => {
    if (tasks.length === 0) {
      setTasks(sampleTasks);
      setNotifications(sampleNotifications);
    }
  }, []);

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            completedAt: status === 'completed' ? new Date() : undefined 
          }
        : task
    ));
  };

  const addNote = (taskId: string, note: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, notes: [...task.notes, note] }
        : task
    ));
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const statusMatch = mobileInterface.filterStatus === 'all' || task.status === mobileInterface.filterStatus;
      const categoryMatch = mobileInterface.filterCategory === 'all' || task.category === mobileInterface.filterCategory;
      const searchMatch = task.title.toLowerCase().includes(mobileInterface.searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(mobileInterface.searchQuery.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'client_visit': return User;
      case 'data_collection': return Search;
      case 'admin': return Edit;
      case 'follow_up': return Bell;
      case 'field_work': return MapPin;
      default: return CheckCircle2;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    return task.dueDate.toDateString() === today.toDateString();
  });
  const overdueTasks = tasks.filter(task => task.dueDate < new Date() && task.status !== 'completed');

  // Mobile Dashboard View
  if (mobileInterface.view === 'dashboard') {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-lg">
                {currentUser.avatar}
              </div>
              <div>
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-purple-200 text-sm">{currentUser.role}</div>
              </div>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {unreadNotifications}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <div className="text-2xl font-bold">{todayTasks.length}</div>
              <div className="text-purple-200 text-xs">Today</div>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <div className="text-2xl font-bold">{overdueTasks.length}</div>
              <div className="text-purple-200 text-xs">Overdue</div>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-purple-200 text-xs">Done</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white h-auto p-3"
              onClick={() => setMobileInterface(prev => ({ ...prev, view: 'create_task' }))}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3"
              onClick={() => setMobileInterface(prev => ({ ...prev, view: 'tasks' }))}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="p-4">
          <h3 className="font-semibold mb-3">Today's Tasks</h3>
          <div className="space-y-3">
            {todayTasks.slice(0, 3).map((task) => {
              const CategoryIcon = getCategoryIcon(task.category);
              return (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setMobileInterface(prev => ({ ...prev, view: 'task_detail', selectedTask: task }))}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-gray-600">{task.description}</div>
                    </div>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📍 {task.location || 'Office'}</span>
                    <span>⏱️ {formatTime(task.estimatedTime)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {todayTasks.length > 3 && (
            <Button 
              variant="ghost" 
              className="w-full mt-3 text-purple-600"
              onClick={() => setMobileInterface(prev => ({ ...prev, view: 'tasks' }))}
            >
              View {todayTasks.length - 3} more tasks
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t p-2">
          <div className="grid grid-cols-4 gap-1">
            <Button variant="ghost" className="h-auto p-2 text-purple-600">
              <Smartphone className="w-5 h-5 mb-1" />
              <div className="text-xs">Dashboard</div>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-2"
              onClick={() => setMobileInterface(prev => ({ ...prev, view: 'tasks' }))}
            >
              <CheckCircle2 className="w-5 h-5 mb-1" />
              <div className="text-xs">Tasks</div>
            </Button>
            <Button variant="ghost" className="h-auto p-2">
              <Calendar className="w-5 h-5 mb-1" />
              <div className="text-xs">Calendar</div>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-2"
              onClick={() => setMobileInterface(prev => ({ ...prev, view: 'profile' }))}
            >
              <User className="w-5 h-5 mb-1" />
              <div className="text-xs">Profile</div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Task Detail View
  if (mobileInterface.view === 'task_detail' && mobileInterface.selectedTask) {
    const task = mobileInterface.selectedTask;
    const CategoryIcon = getCategoryIcon(task.category);
    
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white p-1"
            onClick={() => setMobileInterface(prev => ({ ...prev, view: 'dashboard', selectedTask: undefined }))}
          >
            ← Back
          </Button>
          <div className="flex-1">
            <div className="font-semibold">Task Details</div>
          </div>
          <Button variant="ghost" size="sm" className="text-white p-1">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Task Info */}
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{task.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                  {task.priority}
                </Badge>
                <Badge className={getStatusColor(task.status)} variant="secondary">
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Due Date</div>
                <div className="text-xs text-gray-600">{task.dueDate.toLocaleString()}</div>
              </div>
            </div>
            
            {task.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-xs text-gray-600">{task.location}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Estimated Time</div>
                <div className="text-xs text-gray-600">
                  {formatTime(task.estimatedTime)}
                  {task.actualTime && ` (actual: ${formatTime(task.actualTime)})`}
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Update Status</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={task.status === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTaskStatus(task.id, 'in_progress')}
              >
                Start Task
              </Button>
              <Button 
                variant={task.status === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTaskStatus(task.id, 'completed')}
              >
                Complete
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Notes</div>
            <div className="space-y-2">
              {task.notes.map((note, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded text-sm">
                  {note}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input placeholder="Add a note..." className="flex-1" />
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Attachments</div>
              {task.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{attachment}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default mobile interface wrapper for other views
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Mobile Task Manager</CardTitle>
              <CardDescription>
                Mobile-optimized workflow management for field staff and remote workers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              {/* Render the actual mobile interface here */}
              {/* This is where the mobile dashboard component would be rendered */}
              <div className="text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold mb-2">Mobile Task Manager</h3>
                <p className="text-gray-600 mb-4">
                  Experience the mobile interface by clicking the demo button below
                </p>
                <Button 
                  onClick={() => setMobileInterface(prev => ({ ...prev, view: 'dashboard' }))}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Launch Mobile Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Overview */}
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Features</CardTitle>
                <CardDescription>Designed for nonprofit field work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Offline Capability</h4>
                      <p className="text-sm text-blue-600">Work without internet, sync when connected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Location Integration</h4>
                      <p className="text-sm text-green-600">GPS navigation to client locations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
                    <Bell className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800">Smart Notifications</h4>
                      <p className="text-sm text-purple-600">Context-aware reminders and alerts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Time Tracking</h4>
                      <p className="text-sm text-orange-600">Automatic time logging for tasks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Mobile Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Mobile Best Practices:</h4>
                  <ul className="space-y-1">
                    <li>• Use voice-to-text for quick note taking</li>
                    <li>• Enable push notifications for urgent tasks</li>
                    <li>• Sync data when on WiFi to save cellular data</li>
                    <li>• Use location services for travel time estimates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Field Work Efficiency:</h4>
                  <ul className="space-y-1">
                    <li>• Download offline maps for remote areas</li>
                    <li>• Pre-load client information before visits</li>
                    <li>• Use camera for quick documentation</li>
                    <li>• Set up quick action shortcuts</li>
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

export default RachelMobileTaskManager;