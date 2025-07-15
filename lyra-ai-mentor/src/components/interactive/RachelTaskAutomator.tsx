import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Play, 
  Pause, 
  Clock, 
  Calendar,
  Mail,
  FileText,
  Database,
  Settings,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
  successRate: number;
}

interface AutomationTrigger {
  type: 'schedule' | 'email' | 'form_submission' | 'data_change' | 'manual';
  config: Record<string, any>;
  description: string;
}

interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_empty';
  value: string;
  description: string;
}

interface AutomationAction {
  id: string;
  type: 'send_email' | 'create_task' | 'update_database' | 'generate_report' | 'notify_staff';
  config: Record<string, any>;
  description: string;
  estimatedTime: number; // minutes saved
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'data_management' | 'reporting' | 'workflow';
  timeSaved: number; // minutes per month
  rule: Omit<AutomationRule, 'id' | 'isActive' | 'triggerCount' | 'successRate'>;
}

const RachelTaskAutomator: React.FC = () => {
  const [activeRules, setActiveRules] = useState<AutomationRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const automationTemplates: AutomationTemplate[] = [
    {
      id: 'thank-you-emails',
      name: 'Automatic Thank You Emails',
      description: 'Send personalized thank you emails immediately after donations',
      category: 'communication',
      timeSaved: 120, // 2 hours per month
      rule: {
        name: 'Donation Thank You Automation',
        description: 'Automatically send thank you emails for donations over $25',
        trigger: {
          type: 'form_submission',
          config: { form: 'donation_form', realtime: true },
          description: 'When donation form is submitted'
        },
        conditions: [
          {
            id: 'min-amount',
            field: 'donation_amount',
            operator: 'greater_than',
            value: '25',
            description: 'Donation amount is greater than $25'
          }
        ],
        actions: [
          {
            id: 'send-thanks',
            type: 'send_email',
            config: {
              template: 'donation_thank_you',
              to: '{{donor_email}}',
              personalization: {
                donor_name: '{{donor_name}}',
                amount: '{{donation_amount}}',
                date: '{{donation_date}}'
              }
            },
            description: 'Send personalized thank you email',
            estimatedTime: 5
          },
          {
            id: 'update-crm',
            type: 'update_database',
            config: {
              table: 'donors',
              action: 'update',
              fields: {
                last_contact: '{{today}}',
                total_donated: '{{total_donated}} + {{donation_amount}}'
              }
            },
            description: 'Update donor record in CRM',
            estimatedTime: 2
          }
        ],
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    },
    {
      id: 'weekly-reports',
      name: 'Weekly Program Reports',
      description: 'Generate and distribute weekly program performance reports',
      category: 'reporting',
      timeSaved: 180, // 3 hours per month
      rule: {
        name: 'Weekly Report Generation',
        description: 'Automatically generate and send weekly program reports every Friday',
        trigger: {
          type: 'schedule',
          config: { day: 'friday', time: '09:00', timezone: 'America/New_York' },
          description: 'Every Friday at 9 AM'
        },
        conditions: [],
        actions: [
          {
            id: 'generate-report',
            type: 'generate_report',
            config: {
              template: 'weekly_program_summary',
              data_sources: ['program_attendance', 'completion_rates', 'satisfaction_surveys'],
              date_range: 'last_7_days'
            },
            description: 'Generate weekly program summary report',
            estimatedTime: 45
          },
          {
            id: 'email-report',
            type: 'send_email',
            config: {
              template: 'weekly_report_email',
              to: ['board@nonprofit.org', 'staff@nonprofit.org'],
              subject: 'Weekly Program Report - {{week_ending}}',
              attachments: ['{{generated_report}}']
            },
            description: 'Email report to stakeholders',
            estimatedTime: 10
          }
        ]
      }
    },
    {
      id: 'volunteer-followup',
      name: 'Volunteer Follow-up Sequence',
      description: 'Automated follow-up sequence for new volunteer applications',
      category: 'workflow',
      timeSaved: 90, // 1.5 hours per month
      rule: {
        name: 'New Volunteer Follow-up',
        description: 'Multi-step follow-up sequence for volunteer applications',
        trigger: {
          type: 'form_submission',
          config: { form: 'volunteer_application' },
          description: 'When volunteer application is submitted'
        },
        conditions: [
          {
            id: 'complete-application',
            field: 'application_status',
            operator: 'equals',
            value: 'complete',
            description: 'Application is complete'
          }
        ],
        actions: [
          {
            id: 'confirmation-email',
            type: 'send_email',
            config: {
              template: 'volunteer_application_received',
              to: '{{applicant_email}}',
              delay: 0
            },
            description: 'Send immediate confirmation email',
            estimatedTime: 3
          },
          {
            id: 'background-check-reminder',
            type: 'create_task',
            config: {
              assignee: 'hr_coordinator',
              title: 'Process background check for {{applicant_name}}',
              due_date: '{{today}} + 3 days',
              priority: 'high'
            },
            description: 'Create background check task',
            estimatedTime: 2
          },
          {
            id: 'orientation-invite',
            type: 'send_email',
            config: {
              template: 'orientation_invitation',
              to: '{{applicant_email}}',
              delay: 7 // days
            },
            description: 'Send orientation invitation after 1 week',
            estimatedTime: 5
          }
        ]
      }
    },
    {
      id: 'data-backup',
      name: 'Daily Data Backup',
      description: 'Automated daily backup of critical nonprofit data',
      category: 'data_management',
      timeSaved: 60, // 1 hour per month
      rule: {
        name: 'Daily Data Backup',
        description: 'Backup critical databases and files every night',
        trigger: {
          type: 'schedule',
          config: { time: '02:00', frequency: 'daily' },
          description: 'Every day at 2 AM'
        },
        conditions: [],
        actions: [
          {
            id: 'backup-database',
            type: 'update_database',
            config: {
              action: 'backup',
              tables: ['donors', 'volunteers', 'programs', 'participants'],
              destination: 'secure_cloud_storage'
            },
            description: 'Backup all critical database tables',
            estimatedTime: 0
          },
          {
            id: 'backup-files',
            type: 'create_task',
            config: {
              action: 'file_backup',
              folders: ['/documents', '/reports', '/photos'],
              destination: 'secure_cloud_storage'
            },
            description: 'Backup important file directories',
            estimatedTime: 0
          },
          {
            id: 'notify-completion',
            type: 'notify_staff',
            config: {
              recipient: 'it_admin',
              message: 'Daily backup completed successfully',
              include_summary: true
            },
            description: 'Notify IT admin of backup status',
            estimatedTime: 15 // time saved on manual checking
          }
        ]
      }
    }
  ];

  const createFromTemplate = (template: AutomationTemplate) => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      ...template.rule,
      isActive: false,
      triggerCount: 0,
      successRate: 100
    };
    
    setActiveRules(prev => [newRule, ...prev]);
    setSelectedRule(newRule);
  };

  const toggleRule = (ruleId: string) => {
    setActiveRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const testRule = async (rule: AutomationRule) => {
    setTestResults({ status: 'testing', rule: rule.id });
    
    // Simulate testing the automation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.2; // 80% success rate
    setTestResults({
      status: success ? 'success' : 'error',
      rule: rule.id,
      message: success 
        ? 'Automation test completed successfully' 
        : 'Test failed - check trigger conditions',
      details: success ? {
        triggered: true,
        conditionsPassed: rule.conditions.length,
        actionsExecuted: rule.actions.length,
        timeSaved: rule.actions.reduce((sum, action) => sum + action.estimatedTime, 0)
      } : {
        error: 'Invalid email template configuration'
      }
    });
  };

  const addCondition = () => {
    if (!selectedRule) return;
    
    const newCondition: AutomationCondition = {
      id: `condition-${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      description: 'New condition'
    };
    
    const updatedRule = {
      ...selectedRule,
      conditions: [...selectedRule.conditions, newCondition]
    };
    
    setSelectedRule(updatedRule);
    setActiveRules(prev => prev.map(rule =>
      rule.id === updatedRule.id ? updatedRule : rule
    ));
  };

  const addAction = () => {
    if (!selectedRule) return;
    
    const newAction: AutomationAction = {
      id: `action-${Date.now()}`,
      type: 'send_email',
      config: {},
      description: 'New action',
      estimatedTime: 5
    };
    
    const updatedRule = {
      ...selectedRule,
      actions: [...selectedRule.actions, newAction]
    };
    
    setSelectedRule(updatedRule);
    setActiveRules(prev => prev.map(rule =>
      rule.id === updatedRule.id ? updatedRule : rule
    ));
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule': return Calendar;
      case 'email': return Mail;
      case 'form_submission': return FileText;
      case 'data_change': return Database;
      case 'manual': return Play;
      default: return Settings;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return Mail;
      case 'create_task': return CheckCircle2;
      case 'update_database': return Database;
      case 'generate_report': return FileText;
      case 'notify_staff': return AlertTriangle;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'text-blue-600 bg-blue-100';
      case 'data_management': return 'text-green-600 bg-green-100';
      case 'reporting': return 'text-purple-600 bg-purple-100';
      case 'workflow': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const getTotalTimeSaved = () => {
    return activeRules
      .filter(rule => rule.isActive)
      .reduce((total, rule) => 
        total + rule.actions.reduce((sum, action) => sum + action.estimatedTime, 0) * rule.triggerCount, 0
      );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Task Automator</CardTitle>
              <CardDescription>
                Create intelligent automation rules to handle repetitive nonprofit tasks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedRule ? (
            /* Dashboard View */
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{activeRules.length}</div>
                    <div className="text-sm text-gray-600">Active Rules</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(getTotalTimeSaved())}
                    </div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {activeRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tasks Automated</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(activeRules.reduce((sum, rule) => sum + rule.successRate, 0) / Math.max(activeRules.length, 1))}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Automation Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automation Templates</CardTitle>
                  <CardDescription>Pre-built automations for common nonprofit tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {automationTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                         onClick={() => createFromTemplate(template)}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{template.name}</h4>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(template.category)} variant="secondary">
                            {template.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {formatTime(template.timeSaved)}/month saved
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>🎯 {template.rule.conditions.length} conditions</span>
                          <span>⚡ {template.rule.actions.length} actions</span>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="w-4 h-4 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Rules */}
              {activeRules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Automation Rules</CardTitle>
                    <CardDescription>Manage your active and inactive automations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeRules.map((rule) => {
                        const TriggerIcon = getTriggerIcon(rule.trigger.type);
                        
                        return (
                          <div key={rule.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <TriggerIcon className="w-5 h-5 text-purple-600" />
                                <div>
                                  <h4 className="font-semibold">{rule.name}</h4>
                                  <p className="text-sm text-gray-600">{rule.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => testRule(rule)}
                                  disabled={testResults?.status === 'testing' && testResults?.rule === rule.id}
                                >
                                  {testResults?.status === 'testing' && testResults?.rule === rule.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedRule(rule)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant={rule.isActive ? "default" : "outline"}
                                  onClick={() => toggleRule(rule.id)}
                                  className={rule.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Trigger:</span>
                                <div className="text-gray-600">{rule.trigger.description}</div>
                              </div>
                              <div>
                                <span className="font-medium">Conditions:</span>
                                <div className="text-gray-600">{rule.conditions.length} checks</div>
                              </div>
                              <div>
                                <span className="font-medium">Actions:</span>
                                <div className="text-gray-600">{rule.actions.length} tasks</div>
                              </div>
                              <div>
                                <span className="font-medium">Performance:</span>
                                <div className="text-gray-600">
                                  {rule.triggerCount} runs • {rule.successRate}% success
                                </div>
                              </div>
                            </div>

                            {testResults?.rule === rule.id && (
                              <div className={`mt-3 p-3 rounded border ${
                                testResults.status === 'success' 
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : testResults.status === 'error'
                                  ? 'bg-red-50 border-red-200 text-red-800'
                                  : 'bg-blue-50 border-blue-200 text-blue-800'
                              }`}>
                                <div className="font-medium">{testResults.message}</div>
                                {testResults.details && (
                                  <div className="text-sm mt-1">
                                    {testResults.details.triggered !== undefined && (
                                      <div>✓ Trigger activated • ✓ {testResults.details.conditionsPassed} conditions passed • ✓ {testResults.details.actionsExecuted} actions executed</div>
                                    )}
                                    {testResults.details.error && (
                                      <div>Error: {testResults.details.error}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Rule Editor */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Edit Automation Rule</CardTitle>
                      <CardDescription>Configure triggers, conditions, and actions</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedRule(null)}>
                      Back to Dashboard
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Rule Name:</label>
                      <Input
                        value={selectedRule.name}
                        onChange={(e) => setSelectedRule({ ...selectedRule, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description:</label>
                      <Input
                        value={selectedRule.description}
                        onChange={(e) => setSelectedRule({ ...selectedRule, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Trigger */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trigger</CardTitle>
                      <CardDescription>When should this automation run?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Trigger Type:</label>
                          <select 
                            className="w-full mt-1 p-2 border rounded"
                            value={selectedRule.trigger.type}
                            onChange={(e) => setSelectedRule({
                              ...selectedRule,
                              trigger: { ...selectedRule.trigger, type: e.target.value as any }
                            })}
                          >
                            <option value="schedule">Schedule</option>
                            <option value="email">Email Received</option>
                            <option value="form_submission">Form Submission</option>
                            <option value="data_change">Data Change</option>
                            <option value="manual">Manual Trigger</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description:</label>
                          <Input
                            value={selectedRule.trigger.description}
                            onChange={(e) => setSelectedRule({
                              ...selectedRule,
                              trigger: { ...selectedRule.trigger, description: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conditions */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Conditions</CardTitle>
                          <CardDescription>What criteria must be met?</CardDescription>
                        </div>
                        <Button size="sm" onClick={addCondition}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Condition
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedRule.conditions.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No conditions set - automation will run for all triggers</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedRule.conditions.map((condition, index) => (
                            <div key={condition.id} className="flex items-center gap-2 p-3 border rounded">
                              <select className="p-1 border rounded text-sm">
                                <option value="equals">Equals</option>
                                <option value="contains">Contains</option>
                                <option value="greater_than">Greater than</option>
                                <option value="less_than">Less than</option>
                                <option value="not_empty">Not empty</option>
                              </select>
                              <Input
                                placeholder="Field name"
                                value={condition.field}
                                className="text-sm"
                              />
                              <Input
                                placeholder="Value"
                                value={condition.value}
                                className="text-sm"
                              />
                              <Button size="sm" variant="ghost" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Actions</CardTitle>
                          <CardDescription>What should happen when triggered?</CardDescription>
                        </div>
                        <Button size="sm" onClick={addAction}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Action
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedRule.actions.map((action, index) => {
                          const ActionIcon = getActionIcon(action.type);
                          
                          return (
                            <div key={action.id} className="border rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <ActionIcon className="w-5 h-5 text-purple-600" />
                                <div className="flex-1">
                                  <select 
                                    className="p-1 border rounded text-sm mb-2"
                                    value={action.type}
                                  >
                                    <option value="send_email">Send Email</option>
                                    <option value="create_task">Create Task</option>
                                    <option value="update_database">Update Database</option>
                                    <option value="generate_report">Generate Report</option>
                                    <option value="notify_staff">Notify Staff</option>
                                  </select>
                                  <Input
                                    placeholder="Action description"
                                    value={action.description}
                                    className="text-sm"
                                  />
                                </div>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="text-xs text-gray-600">
                                Estimated time saved: {formatTime(action.estimatedTime)} per run
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Automation Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Automation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Getting Started:</h4>
                  <ul className="space-y-1">
                    <li>• Start with simple, repetitive tasks</li>
                    <li>• Test automations thoroughly before activating</li>
                    <li>• Monitor performance and adjust as needed</li>
                    <li>• Document your automation rules for the team</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="space-y-1">
                    <li>• Use clear, descriptive names for rules</li>
                    <li>• Set appropriate conditions to avoid spam</li>
                    <li>• Include error handling and fallbacks</li>
                    <li>• Regular review and optimization</li>
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

export default RachelTaskAutomator;