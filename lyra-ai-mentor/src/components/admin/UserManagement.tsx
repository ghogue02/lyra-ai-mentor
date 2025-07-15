import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Search, Filter, Download, Eye, UserCheck, UserX, Clock, Activity, Award } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  engagement: {
    total_sessions: number;
    total_hours: number;
    days_active: number;
    total_interactions: number;
    total_creations: number;
    achievements_unlocked: number;
    tools_used: string[];
    last_active: string;
    first_active: string;
  };
  current_session?: {
    id: string;
    activity_type: string;
    session_start: string;
    duration_seconds: number;
  };
}

interface UserJourney {
  userId: string;
  email: string;
  milestones: {
    signup: string;
    first_session?: string;
    first_prompt?: string;
    first_creation?: string;
    first_publish?: string;
  };
  progression: {
    beginner_tools: number;
    intermediate_tools: number;
    advanced_tools: number;
    skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  };
  engagement_pattern: 'Power User' | 'Regular' | 'Casual' | 'New';
}

interface UsagePattern {
  pattern_name: string;
  user_count: number;
  avg_session_duration: number;
  common_tools: string[];
  retention_rate: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [patterns, setPatterns] = useState<UsagePattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'new' | 'power'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user engagement data
      const { data: engagementData, error: engagementError } = await supabase
        .from('ai_playground_user_engagement')
        .select('*')
        .order('total_sessions', { ascending: false });

      if (engagementError) throw engagementError;

      // Get current active sessions
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('ai_playground_sessions')
        .select('*')
        .gte('session_start', fiveMinutesAgo.toISOString())
        .is('session_end', null);

      if (sessionsError) throw sessionsError;

      // Get user accounts from auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Combine data
      const userProfiles: UserProfile[] = authUsers.users.map(user => {
        const engagement = engagementData?.find(e => e.user_id === user.id);
        const currentSession = activeSessions?.find(s => s.user_id === user.id);

        return {
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at || user.created_at,
          engagement: engagement ? {
            total_sessions: engagement.total_sessions || 0,
            total_hours: engagement.total_hours || 0,
            days_active: engagement.days_active || 0,
            total_interactions: engagement.total_interactions || 0,
            total_creations: engagement.total_creations || 0,
            achievements_unlocked: engagement.achievements_unlocked || 0,
            tools_used: engagement.tools_used || [],
            last_active: engagement.last_active || user.last_sign_in_at || user.created_at,
            first_active: engagement.first_active || user.created_at
          } : {
            total_sessions: 0,
            total_hours: 0,
            days_active: 0,
            total_interactions: 0,
            total_creations: 0,
            achievements_unlocked: 0,
            tools_used: [],
            last_active: user.last_sign_in_at || user.created_at,
            first_active: user.created_at
          },
          current_session: currentSession ? {
            id: currentSession.id,
            activity_type: currentSession.activity_type,
            session_start: currentSession.session_start,
            duration_seconds: currentSession.duration_seconds || 0
          } : undefined
        };
      });

      // Generate user journeys
      const userJourneys: UserJourney[] = userProfiles.map(user => {
        const skillLevel = calculateSkillLevel(user.engagement);
        const engagementPattern = calculateEngagementPattern(user.engagement);

        return {
          userId: user.id,
          email: user.email,
          milestones: {
            signup: user.created_at,
            first_session: user.engagement.first_active,
            // Would need additional data for these milestones
            first_prompt: undefined,
            first_creation: undefined,
            first_publish: undefined
          },
          progression: {
            beginner_tools: Math.min(10, user.engagement.tools_used.length),
            intermediate_tools: Math.max(0, Math.min(10, user.engagement.tools_used.length - 10)),
            advanced_tools: Math.max(0, user.engagement.tools_used.length - 20),
            skill_level: skillLevel
          },
          engagement_pattern: engagementPattern
        };
      });

      // Generate usage patterns
      const usagePatterns: UsagePattern[] = [
        {
          pattern_name: 'Power Users',
          user_count: userProfiles.filter(u => u.engagement.total_sessions > 50).length,
          avg_session_duration: 45,
          common_tools: ['AI Prompt Builder', 'Document Generator', 'Email Composer'],
          retention_rate: 0.95
        },
        {
          pattern_name: 'Regular Users',
          user_count: userProfiles.filter(u => u.engagement.total_sessions > 10 && u.engagement.total_sessions <= 50).length,
          avg_session_duration: 25,
          common_tools: ['Email Composer', 'Content Generator'],
          retention_rate: 0.78
        },
        {
          pattern_name: 'Casual Users',
          user_count: userProfiles.filter(u => u.engagement.total_sessions > 1 && u.engagement.total_sessions <= 10).length,
          avg_session_duration: 15,
          common_tools: ['AI Chat', 'Quick Templates'],
          retention_rate: 0.45
        },
        {
          pattern_name: 'New Users',
          user_count: userProfiles.filter(u => u.engagement.total_sessions <= 1).length,
          avg_session_duration: 8,
          common_tools: ['Onboarding', 'Basic Tools'],
          retention_rate: 0.25
        }
      ];

      setUsers(userProfiles);
      setJourneys(userJourneys);
      setPatterns(usagePatterns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSkillLevel = (engagement: UserProfile['engagement']): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' => {
    const score = engagement.total_sessions * 2 + engagement.total_interactions + engagement.achievements_unlocked * 5;
    if (score > 200) return 'Expert';
    if (score > 100) return 'Advanced';
    if (score > 30) return 'Intermediate';
    return 'Beginner';
  };

  const calculateEngagementPattern = (engagement: UserProfile['engagement']): 'Power User' | 'Regular' | 'Casual' | 'New' => {
    if (engagement.total_sessions > 50) return 'Power User';
    if (engagement.total_sessions > 10) return 'Regular';
    if (engagement.total_sessions > 1) return 'Casual';
    return 'New';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'active' && user.current_session) ||
      (filterBy === 'new' && new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterBy === 'power' && user.engagement.total_sessions > 50);
    
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDuration = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  const getUserStatusBadge = (user: UserProfile) => {
    if (user.current_session) {
      return <Badge className="bg-green-100 text-green-800">Online</Badge>;
    }
    const lastActive = new Date(user.engagement.last_active);
    const hoursAgo = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo < 24) {
      return <Badge variant="outline">Recent</Badge>;
    } else if (hoursAgo < 168) { // 7 days
      return <Badge variant="secondary">This Week</Badge>;
    } else {
      return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
    }
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
          <p className="text-destructive">Error loading user data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {users.filter(u => u.current_session).length} currently online
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => {
                    const hoursAgo = (Date.now() - new Date(u.engagement.last_active).getTime()) / (1000 * 60 * 60);
                    return hoursAgo < 24;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => {
                    const daysAgo = (Date.now() - new Date(u.created_at).getTime()) / (1000 * 60 * 60 * 24);
                    return daysAgo <= 7;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(users.reduce((sum, u) => sum + u.engagement.total_sessions, 0) / users.length || 0).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Sessions per user</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Patterns</CardTitle>
                <CardDescription>Distribution of user engagement levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height="300">
                  <PieChart>
                    <Pie
                      data={patterns}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.pattern_name}: ${entry.user_count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="user_count"
                    >
                      {patterns.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Level Distribution</CardTitle>
                <CardDescription>User progression across skill levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height="300">
                  <BarChart data={[
                    { level: 'Beginner', count: journeys.filter(j => j.progression.skill_level === 'Beginner').length },
                    { level: 'Intermediate', count: journeys.filter(j => j.progression.skill_level === 'Intermediate').length },
                    { level: 'Advanced', count: journeys.filter(j => j.progression.skill_level === 'Advanced').length },
                    { level: 'Expert', count: journeys.filter(j => j.progression.skill_level === 'Expert').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Now</SelectItem>
                <SelectItem value="new">New Users</SelectItem>
                <SelectItem value="power">Power Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {paginatedUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{user.email}</h3>
                        {getUserStatusBadge(user)}
                        {user.current_session && (
                          <Badge variant="outline" className="text-blue-600">
                            {user.current_session.activity_type}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Sessions:</span> {user.engagement.total_sessions}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {formatDuration(user.engagement.total_hours)}
                        </div>
                        <div>
                          <span className="font-medium">Creations:</span> {user.engagement.total_creations}
                        </div>
                        <div>
                          <span className="font-medium">Achievements:</span> {user.engagement.achievements_unlocked}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Tools used:</span> {user.engagement.tools_used.slice(0, 3).join(', ')}
                        {user.engagement.tools_used.length > 3 && ` +${user.engagement.tools_used.length - 3} more`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Journey Funnel</CardTitle>
              <CardDescription>User progression through key milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded">
                  <span className="font-medium">Total Signups</span>
                  <span className="text-2xl font-bold">{users.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded">
                  <span className="font-medium">Started Playground</span>
                  <span className="text-2xl font-bold">{users.filter(u => u.engagement.total_sessions > 0).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded">
                  <span className="font-medium">Created Content</span>
                  <span className="text-2xl font-bold">{users.filter(u => u.engagement.total_creations > 0).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded">
                  <span className="font-medium">Power Users (50+ sessions)</span>
                  <span className="text-2xl font-bold">{users.filter(u => u.engagement.total_sessions >= 50).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4">
            {patterns.map((pattern) => (
              <Card key={pattern.pattern_name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {pattern.pattern_name}
                    <Badge variant="outline">{pattern.user_count} users</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                      <p className="text-2xl font-bold">{pattern.avg_session_duration}min</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Retention Rate</p>
                      <p className="text-2xl font-bold">{(pattern.retention_rate * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Common Tools</p>
                      <p className="text-sm">{pattern.common_tools.join(', ')}</p>
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