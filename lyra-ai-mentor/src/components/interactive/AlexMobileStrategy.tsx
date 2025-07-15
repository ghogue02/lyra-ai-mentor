import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Target, 
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  Zap,
  Brain,
  Calendar,
  MapPin,
  Send,
  MoreVertical,
  ArrowLeft,
  Mic,
  Camera
} from 'lucide-react';

interface MobileStrategySession {
  id: string;
  title: string;
  type: 'quick_decision' | 'field_planning' | 'crisis_response' | 'opportunity_capture';
  location?: string;
  startTime: Date;
  context: string;
  insights: StrategyInsight[];
  actions: QuickAction[];
  status: 'active' | 'completed';
}

interface StrategyInsight {
  id: string;
  type: 'strength' | 'opportunity' | 'challenge' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

interface QuickAction {
  id: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium';
  timeframe: 'now' | 'today' | 'this_week';
  owner?: string;
  completed: boolean;
  location?: string;
}

interface MobileContext {
  view: 'dashboard' | 'session' | 'insights' | 'actions';
  currentSession?: MobileStrategySession;
}

interface FieldInput {
  type: 'voice' | 'text' | 'photo';
  content: string;
  timestamp: Date;
  location?: string;
}

const AlexMobileStrategy: React.FC = () => {
  const [mobileContext, setMobileContext] = useState<MobileContext>({ view: 'dashboard' });
  const [sessions, setSessions] = useState<MobileStrategySession[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [fieldInputs, setFieldInputs] = useState<FieldInput[]>([]);

  const sampleSessions: MobileStrategySession[] = [
    {
      id: 'session-1',
      title: 'Community Center Partnership',
      type: 'opportunity_capture',
      location: 'Downtown Community Center',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      context: 'Unexpected partnership opportunity with community center during site visit',
      status: 'completed',
      insights: [
        {
          id: 'insight-1',
          type: 'opportunity',
          title: 'Shared Space Opportunity',
          description: 'Center has unused classroom space perfect for our youth program',
          confidence: 90,
          actionable: true
        },
        {
          id: 'insight-2',
          type: 'strength',
          title: 'Aligned Mission',
          description: 'Both organizations focus on youth development and education',
          confidence: 95,
          actionable: true
        }
      ],
      actions: [
        {
          id: 'action-1',
          description: 'Schedule follow-up meeting with center director',
          priority: 'urgent',
          timeframe: 'today',
          completed: true
        },
        {
          id: 'action-2',
          description: 'Draft partnership proposal outline',
          priority: 'high',
          timeframe: 'this_week',
          completed: false
        }
      ]
    },
    {
      id: 'session-2',
      title: 'Funding Shortfall Response',
      type: 'crisis_response',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      context: 'Major funder announced 30% budget reduction effective next quarter',
      status: 'active',
      insights: [
        {
          id: 'insight-3',
          type: 'challenge',
          title: 'Budget Gap',
          description: '$75K quarterly shortfall requires immediate response',
          confidence: 100,
          actionable: true
        },
        {
          id: 'insight-4',
          type: 'recommendation',
          title: 'Diversification Strategy',
          description: 'Accelerate individual donor program and explore corporate partnerships',
          confidence: 85,
          actionable: true
        }
      ],
      actions: [
        {
          id: 'action-3',
          description: 'Contact board chair for emergency meeting',
          priority: 'urgent',
          timeframe: 'now',
          completed: true
        },
        {
          id: 'action-4',
          description: 'Prepare budget reduction scenarios',
          priority: 'urgent',
          timeframe: 'today',
          completed: false
        }
      ]
    }
  ];

  React.useEffect(() => {
    if (sessions.length === 0) {
      setSessions(sampleSessions);
    }
  }, []);

  const startNewSession = (type: MobileStrategySession['type']) => {
    const newSession: MobileStrategySession = {
      id: `session-${Date.now()}`,
      title: 'New Strategy Session',
      type,
      startTime: new Date(),
      context: '',
      insights: [],
      actions: [],
      status: 'active'
    };
    
    setSessions(prev => [newSession, ...prev]);
    setMobileContext({ view: 'session', currentSession: newSession });
  };

  const addFieldInput = (type: FieldInput['type'], content: string) => {
    const newInput: FieldInput = {
      type,
      content,
      timestamp: new Date(),
      location: 'Current Location' // In real app, would use GPS
    };
    
    setFieldInputs(prev => [newInput, ...prev]);
    
    // Simulate AI processing of input to generate insights
    if (content.trim()) {
      setTimeout(() => {
        generateInsightFromInput(content);
      }, 1000);
    }
  };

  const generateInsightFromInput = (input: string) => {
    // Simple AI simulation based on input keywords
    let insight: StrategyInsight;
    
    if (input.toLowerCase().includes('partner') || input.toLowerCase().includes('collaboration')) {
      insight = {
        id: `insight-${Date.now()}`,
        type: 'opportunity',
        title: 'Partnership Opportunity',
        description: 'Potential collaboration identified - explore shared value proposition',
        confidence: 80,
        actionable: true
      };
    } else if (input.toLowerCase().includes('problem') || input.toLowerCase().includes('challenge')) {
      insight = {
        id: `insight-${Date.now()}`,
        type: 'challenge',
        title: 'Challenge Identified',
        description: 'Issue requires strategic response and action plan',
        confidence: 85,
        actionable: true
      };
    } else {
      insight = {
        id: `insight-${Date.now()}`,
        type: 'recommendation',
        title: 'Strategic Input Captured',
        description: 'Context noted for strategic consideration',
        confidence: 70,
        actionable: false
      };
    }
    
    if (mobileContext.currentSession) {
      const updatedSession = {
        ...mobileContext.currentSession,
        insights: [...mobileContext.currentSession.insights, insight]
      };
      
      setSessions(prev => prev.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      ));
      
      setMobileContext(prev => ({ ...prev, currentSession: updatedSession }));
    }
  };

  const addQuickAction = (description: string, priority: QuickAction['priority']) => {
    if (!mobileContext.currentSession) return;
    
    const newAction: QuickAction = {
      id: `action-${Date.now()}`,
      description,
      priority,
      timeframe: priority === 'urgent' ? 'now' : priority === 'high' ? 'today' : 'this_week',
      completed: false
    };
    
    const updatedSession = {
      ...mobileContext.currentSession,
      actions: [...mobileContext.currentSession.actions, newAction]
    };
    
    setSessions(prev => prev.map(s => 
      s.id === updatedSession.id ? updatedSession : s
    ));
    
    setMobileContext(prev => ({ ...prev, currentSession: updatedSession }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quick_decision': return 'text-blue-600 bg-blue-100';
      case 'field_planning': return 'text-green-600 bg-green-100';
      case 'crisis_response': return 'text-red-600 bg-red-100';
      case 'opportunity_capture': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-green-600 bg-green-100';
      case 'opportunity': return 'text-blue-600 bg-blue-100';
      case 'challenge': return 'text-orange-600 bg-orange-100';
      case 'recommendation': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Mobile Dashboard View
  if (mobileContext.view === 'dashboard') {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">Mobile Strategy</div>
              <div className="text-purple-200 text-sm">Field Strategy & Decision Support</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-500 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{sessions.filter(s => s.status === 'active').length}</div>
              <div className="text-purple-200 text-xs">Active Sessions</div>
            </div>
            <div className="bg-purple-500 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {sessions.reduce((sum, s) => sum + s.actions.filter(a => !a.completed).length, 0)}
              </div>
              <div className="text-purple-200 text-xs">Pending Actions</div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Quick Start</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white h-auto p-3 text-left"
              onClick={() => startNewSession('quick_decision')}
            >
              <div>
                <Zap className="w-4 h-4 mb-1" />
                <div className="text-sm font-medium">Quick Decision</div>
                <div className="text-xs opacity-80">Rapid analysis</div>
              </div>
            </Button>
            
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white h-auto p-3 text-left"
              onClick={() => startNewSession('field_planning')}
            >
              <div>
                <MapPin className="w-4 h-4 mb-1" />
                <div className="text-sm font-medium">Field Planning</div>
                <div className="text-xs opacity-80">On-site strategy</div>
              </div>
            </Button>
            
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white h-auto p-3 text-left"
              onClick={() => startNewSession('crisis_response')}
            >
              <div>
                <Target className="w-4 h-4 mb-1" />
                <div className="text-sm font-medium">Crisis Response</div>
                <div className="text-xs opacity-80">Urgent issues</div>
              </div>
            </Button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white h-auto p-3 text-left"
              onClick={() => startNewSession('opportunity_capture')}
            >
              <div>
                <Lightbulb className="w-4 h-4 mb-1" />
                <div className="text-sm font-medium">Opportunity</div>
                <div className="text-xs opacity-80">Capture ideas</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="p-4">
          <h3 className="font-semibold mb-3">Recent Sessions</h3>
          <div className="space-y-3">
            {sessions.slice(0, 4).map((session) => (
              <div 
                key={session.id}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setMobileContext({ view: 'session', currentSession: session })}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getTypeColor(session.type)} variant="secondary">
                    {session.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-gray-500">{formatTimeAgo(session.startTime)}</span>
                </div>
                
                <div className="font-medium text-sm mb-1">{session.title}</div>
                <div className="text-xs text-gray-600 mb-2">{session.context}</div>
                
                <div className="flex items-center justify-between text-xs">
                  <span>{session.insights.length} insights</span>
                  <span>{session.actions.filter(a => !a.completed).length} pending actions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t p-2">
          <div className="grid grid-cols-3 gap-1">
            <Button variant="ghost" className="h-auto p-2 text-purple-600">
              <div className="text-center">
                <Smartphone className="w-5 h-5 mb-1 mx-auto" />
                <div className="text-xs">Dashboard</div>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-2"
              onClick={() => setMobileContext({ view: 'insights' })}
            >
              <div className="text-center">
                <Lightbulb className="w-5 h-5 mb-1 mx-auto" />
                <div className="text-xs">Insights</div>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="h-auto p-2"
              onClick={() => setMobileContext({ view: 'actions' })}
            >
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 mb-1 mx-auto" />
                <div className="text-xs">Actions</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Session View
  if (mobileContext.view === 'session' && mobileContext.currentSession) {
    const session = mobileContext.currentSession;
    
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white p-1"
            onClick={() => setMobileContext({ view: 'dashboard' })}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="font-semibold">{session.title}</div>
            <div className="text-purple-200 text-sm">{formatTimeAgo(session.startTime)}</div>
          </div>
          <Button variant="ghost" size="sm" className="text-white p-1">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Session Content */}
        <div className="p-4 space-y-4">
          {/* Context */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">Context:</div>
            <div className="text-sm text-blue-700">{session.context || 'No context provided yet'}</div>
          </div>

          {/* Input Methods */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Add Strategic Input:</div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`flex-1 ${isRecording ? 'bg-red-50 border-red-300' : ''}`}
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    // Simulate voice input
                    setTimeout(() => {
                      addFieldInput('voice', 'Voice input captured: Partnership opportunity with local business district');
                      setIsRecording(false);
                    }, 3000);
                  }
                }}
              >
                <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-red-600' : ''}`} />
                {isRecording ? 'Recording...' : 'Voice'}
              </Button>
              
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type strategic observations..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentInput.trim()) {
                    addFieldInput('text', currentInput);
                    setCurrentInput('');
                  }
                }}
              />
              <Button 
                size="sm"
                onClick={() => {
                  if (currentInput.trim()) {
                    addFieldInput('text', currentInput);
                    setCurrentInput('');
                  }
                }}
                disabled={!currentInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Recent Insights */}
          {session.insights.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">AI Insights:</div>
              {session.insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getInsightColor(insight.type)} variant="secondary">
                      {insight.type}
                    </Badge>
                    <div className="text-xs text-gray-500">{insight.confidence}% confidence</div>
                  </div>
                  <div className="font-medium text-sm">{insight.title}</div>
                  <div className="text-xs text-gray-600">{insight.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {session.actions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Pending Actions:</div>
              {session.actions.filter(a => !a.completed).slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-center gap-2 p-2 border rounded">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm flex-1">{action.description}</span>
                  <Badge className={getPriorityColor(action.priority)} variant="secondary">
                    {action.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Add Action */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Actions:</div>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addQuickAction('Follow up within 24 hours', 'urgent')}
              >
                📞 Follow Up
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addQuickAction('Schedule meeting to discuss', 'high')}
              >
                📅 Meeting
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addQuickAction('Document and share with team', 'medium')}
              >
                📝 Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default desktop view
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Mobile Strategy Interface</CardTitle>
              <CardDescription>
                Field-optimized strategic thinking and decision support for mobile leaders
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold mb-2">Mobile Strategy Suite</h3>
                <p className="text-gray-600 mb-4">
                  Access AI-powered strategic thinking tools optimized for field work and mobile decision-making
                </p>
                <Button 
                  onClick={() => setMobileContext({ view: 'dashboard' })}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Launch Mobile Interface
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Overview */}
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile Strategy Features</CardTitle>
                <CardDescription>Designed for strategic leaders on the move</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                    <Mic className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Voice Strategy Input</h4>
                      <p className="text-sm text-blue-600">Capture insights hands-free while in the field</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                    <Brain className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">AI Strategic Analysis</h4>
                      <p className="text-sm text-green-600">Instant insights and recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
                    <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800">Quick Decision Tools</h4>
                      <p className="text-sm text-purple-600">Rapid frameworks for time-sensitive choices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded">
                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Location-Aware Context</h4>
                      <p className="text-sm text-orange-600">Strategic context based on your location</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Alex's Mobile Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Field Strategy:</h4>
                  <ul className="space-y-1">
                    <li>• Capture insights immediately when they occur</li>
                    <li>• Use voice input for hands-free operation</li>
                    <li>• Tag observations with location context</li>
                    <li>• Convert insights to actions quickly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mobile Decision-Making:</h4>
                  <ul className="space-y-1">
                    <li>• Focus on time-sensitive decisions first</li>
                    <li>• Use simplified frameworks for speed</li>
                    <li>• Document rationale for later review</li>
                    <li>• Sync insights when back in the office</li>
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

export default AlexMobileStrategy;