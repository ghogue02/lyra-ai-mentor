import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Timer,
  Mail,
  Calendar,
  FileText,
  Database
} from 'lucide-react';

interface QuickAutomation {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'scheduling' | 'data' | 'reporting';
  setupTime: number; // minutes
  monthlySavings: number; // hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tools: string[];
  steps: string[];
  template: string;
}

interface AutomationSetup {
  automation: QuickAutomation;
  currentStep: number;
  isComplete: boolean;
  configuration: Record<string, string>;
  testResults?: {
    success: boolean;
    message: string;
    details?: string;
  };
}

const RachelQuickAutomation: React.FC = () => {
  const [currentSetup, setCurrentSetup] = useState<AutomationSetup | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [completedAutomations, setCompletedAutomations] = useState<QuickAutomation[]>([]);

  const quickAutomations: QuickAutomation[] = [
    {
      id: 'thank-you-emails',
      name: 'Thank You Email Automation',
      description: 'Automatically send personalized thank you emails when donations are received',
      category: 'email',
      setupTime: 15,
      monthlySavings: 8,
      difficulty: 'beginner',
      tools: ['Email Platform', 'Donation System'],
      steps: [
        'Connect your donation platform to email system',
        'Create thank you email template with personalization',
        'Set up trigger for donations over $25',
        'Configure delay and frequency settings',
        'Test with sample donation data'
      ],
      template: `Subject: Thank you for your generous donation, {{donor_name}}!

Dear {{donor_name}},

Thank you so much for your generous donation of ${{amount}} to {{organization_name}}. Your support makes a real difference in the lives of those we serve.

Your contribution will help us:
- Continue our vital programs
- Reach more people in need
- Create lasting positive change in our community

We'll send you updates on how your donation is making an impact. If you have any questions, please don't hesitate to reach out.

With gratitude,
{{organization_name}} Team`
    },
    {
      id: 'volunteer-reminders',
      name: 'Volunteer Shift Reminders',
      description: 'Send automatic reminders to volunteers before their scheduled shifts',
      category: 'scheduling',
      setupTime: 20,
      monthlySavings: 6,
      difficulty: 'beginner',
      tools: ['Calendar System', 'SMS/Email Platform'],
      steps: [
        'Connect volunteer scheduling system',
        'Create reminder message templates',
        'Set reminder timing (24 hours and 2 hours before)',
        'Configure contact preferences (email/SMS)',
        'Test with upcoming volunteer shifts'
      ],
      template: `Hi {{volunteer_name}}!

This is a friendly reminder about your upcoming volunteer shift:

📅 Date: {{shift_date}}
⏰ Time: {{shift_time}}
📍 Location: {{location}}
👥 Role: {{volunteer_role}}

What to bring:
- Photo ID
- Comfortable clothing
- Water bottle

If you need to reschedule, please contact us at least 4 hours in advance.

Thank you for your dedication!
{{organization_name}}`
    },
    {
      id: 'monthly-reports',
      name: 'Monthly Report Generation',
      description: 'Automatically compile and send monthly program reports to stakeholders',
      category: 'reporting',
      setupTime: 45,
      monthlySavings: 12,
      difficulty: 'intermediate',
      tools: ['Database', 'Report Builder', 'Email Platform'],
      steps: [
        'Connect to program database and metrics systems',
        'Design monthly report template with key metrics',
        'Set up automated data collection schedule',
        'Configure stakeholder distribution list',
        'Schedule monthly generation and delivery',
        'Test with current month data'
      ],
      template: `Monthly Program Report - {{month}} {{year}}

Program Highlights:
- Participants served: {{total_participants}}
- Programs completed: {{completed_programs}}
- Satisfaction rate: {{satisfaction_rate}}%
- Volunteer hours: {{volunteer_hours}}

Key Metrics:
📊 Program Attendance: {{attendance_rate}}%
💰 Cost per participant: ${{cost_per_participant}}
⭐ Success rate: {{success_rate}}%
📈 Month-over-month growth: {{growth_rate}}%

[Detailed charts and graphs would be inserted here]

For questions about this report, contact {{contact_email}}`
    },
    {
      id: 'donor-segmentation',
      name: 'Automated Donor Segmentation',
      description: 'Automatically categorize donors and send targeted communications',
      category: 'data',
      setupTime: 30,
      monthlySavings: 10,
      difficulty: 'intermediate',
      tools: ['CRM System', 'Email Platform', 'Analytics'],
      steps: [
        'Define donor segments (new, recurring, major, lapsed)',
        'Set up automated tagging rules based on donation history',
        'Create segment-specific email templates',
        'Configure automated campaign triggers',
        'Set up performance tracking and analytics',
        'Test segmentation with sample donor data'
      ],
      template: `Donor Segmentation Rules:

New Donors (First donation < 30 days):
- Welcome series (3 emails over 2 weeks)
- Impact story highlighting first-time donor contributions

Recurring Donors (2+ donations in 12 months):
- Monthly impact updates
- Exclusive volunteer opportunities
- Annual thank you package

Major Donors ($500+ annual):
- Quarterly personal updates from leadership
- Invitation to exclusive events
- Direct impact reports

Lapsed Donors (No donation in 12+ months):
- "We miss you" re-engagement campaign
- Special comeback offer or challenge
- Brief organization update`
    },
    {
      id: 'event-followup',
      name: 'Event Follow-up Automation',
      description: 'Automatically send follow-up emails and surveys after events',
      category: 'email',
      setupTime: 25,
      monthlySavings: 5,
      difficulty: 'beginner',
      tools: ['Event Platform', 'Email System', 'Survey Tool'],
      steps: [
        'Connect event registration system',
        'Create thank you and feedback email templates',
        'Set up post-event trigger (24 hours after event)',
        'Configure survey integration for feedback collection',
        'Test with recent event attendee data'
      ],
      template: `Thank you for attending {{event_name}}!

Dear {{attendee_name}},

Thank you for joining us at {{event_name}} on {{event_date}}! We hope you found it valuable and inspiring.

Your participation helps us:
- Build stronger community connections
- Raise awareness for our cause
- Generate vital support for our programs

We'd love your feedback! Please take 2 minutes to complete our survey:
{{survey_link}}

Stay connected:
- Follow us on social media
- Sign up for our newsletter
- Join our volunteer team

Thank you again for your support!
{{organization_name}} Team`
    }
  ];

  const startSetup = (automation: QuickAutomation) => {
    setCurrentSetup({
      automation,
      currentStep: 0,
      isComplete: false,
      configuration: {},
      testResults: undefined
    });
  };

  const nextStep = () => {
    if (!currentSetup) return;
    
    const nextStepIndex = currentSetup.currentStep + 1;
    if (nextStepIndex >= currentSetup.automation.steps.length) {
      setCurrentSetup({
        ...currentSetup,
        isComplete: true
      });
    } else {
      setCurrentSetup({
        ...currentSetup,
        currentStep: nextStepIndex
      });
    }
  };

  const testAutomation = async () => {
    if (!currentSetup) return;
    
    setIsTesting(true);
    
    // Simulate testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.2; // 80% success rate
    
    setCurrentSetup({
      ...currentSetup,
      testResults: {
        success,
        message: success 
          ? 'Automation test successful! Ready to deploy.' 
          : 'Test failed. Please check your configuration.',
        details: success 
          ? `✅ Email template validated\n✅ Trigger conditions working\n✅ Integration connected`
          : `❌ Missing email template variables\n❌ Check integration permissions`
      }
    });
    
    if (success && !completedAutomations.find(a => a.id === currentSetup.automation.id)) {
      setCompletedAutomations(prev => [...prev, currentSetup.automation]);
    }
    
    setIsTesting(false);
  };

  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email': return Mail;
      case 'scheduling': return Calendar;
      case 'reporting': return FileText;
      case 'data': return Database;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'scheduling': return 'text-green-600 bg-green-100';
      case 'reporting': return 'text-purple-600 bg-purple-100';
      case 'data': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
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
              <CardTitle className="text-2xl">Quick Automation Setup</CardTitle>
              <CardDescription>
                Deploy simple automations in 15-45 minutes with step-by-step guidance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentSetup ? (
            /* Automation Selection */
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{quickAutomations.length}</div>
                    <div className="text-sm text-gray-600">Available Automations</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{completedAutomations.length}</div>
                    <div className="text-sm text-gray-600">Completed Setups</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(completedAutomations.reduce((sum, a) => sum + a.monthlySavings * 60, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Time Saved</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Automation Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ready-to-Deploy Automations</CardTitle>
                  <CardDescription>Choose an automation to set up with guided assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickAutomations.map((automation) => {
                    const Icon = getCategoryIcon(automation.category);
                    const isCompleted = completedAutomations.find(a => a.id === automation.id);
                    
                    return (
                      <div key={automation.id} className={`border rounded-lg p-4 transition-all ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md cursor-pointer'
                      }`}
                           onClick={() => !isCompleted && startSetup(automation)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(automation.category)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{automation.name}</h4>
                              <p className="text-sm text-gray-600">{automation.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-800" variant="secondary">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            )}
                            <Badge className={getDifficultyColor(automation.difficulty)} variant="secondary">
                              {automation.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">{formatTime(automation.setupTime)}</div>
                            <div className="text-xs text-blue-600">Setup Time</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">{automation.monthlySavings}h</div>
                            <div className="text-xs text-green-600">Monthly Savings</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-bold text-purple-600">{automation.steps.length}</div>
                            <div className="text-xs text-purple-600">Steps</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Tools: {automation.tools.join(', ')}
                          </div>
                          {!isCompleted && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Start Setup
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Setup Flow */
            <div className="space-y-6">
              {/* Setup Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentSetup.automation.name}</CardTitle>
                      <CardDescription>{currentSetup.automation.description}</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentSetup(null)}>
                      Back to Library
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Setup Progress</span>
                      <span>{Math.round(((currentSetup.currentStep + 1) / currentSetup.automation.steps.length) * 100)}%</span>
                    </div>
                    <Progress 
                      value={((currentSetup.currentStep + 1) / currentSetup.automation.steps.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Current Step */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Step {currentSetup.currentStep + 1} of {currentSetup.automation.steps.length}
                  </CardTitle>
                  <CardDescription>
                    {currentSetup.automation.steps[currentSetup.currentStep]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentSetup.currentStep === 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Required Tools:</h4>
                      <ul className="space-y-1">
                        {currentSetup.automation.tools.map((tool, index) => (
                          <li key={index} className="flex items-center gap-2 text-blue-700">
                            <CheckCircle2 className="w-4 h-4" />
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {currentSetup.currentStep === 1 && currentSetup.automation.template && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Template Preview:</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyTemplate(currentSetup.automation.template)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Template
                          </Button>
                        </div>
                        <div className="bg-white p-3 rounded border text-sm font-mono max-h-48 overflow-y-auto">
                          {currentSetup.automation.template}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={nextStep}
                      disabled={currentSetup.isComplete}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {currentSetup.currentStep === currentSetup.automation.steps.length - 1 ? 'Complete Setup' : 'Next Step'}
                    </Button>
                    
                    {currentSetup.isComplete && (
                      <Button 
                        onClick={testAutomation}
                        disabled={isTesting}
                        variant="outline"
                      >
                        {isTesting ? (
                          <>
                            <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Test Automation
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Test Results */}
              {currentSetup.testResults && (
                <Card className={`border-2 ${
                  currentSetup.testResults.success 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {currentSetup.testResults.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <CardTitle className={`text-lg ${
                        currentSetup.testResults.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        Test Results
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`mb-3 ${
                      currentSetup.testResults.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {currentSetup.testResults.message}
                    </p>
                    {currentSetup.testResults.details && (
                      <div className="bg-white p-3 rounded border">
                        <pre className="text-sm whitespace-pre-line">
                          {currentSetup.testResults.details}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Setup Steps Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Setup Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSetup.automation.steps.map((step, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded ${
                        index < currentSetup.currentStep ? 'bg-green-50' :
                        index === currentSetup.currentStep ? 'bg-blue-50' :
                        'bg-gray-50'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index < currentSetup.currentStep ? 'bg-green-500 text-white' :
                          index === currentSetup.currentStep ? 'bg-blue-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {index < currentSetup.currentStep ? '✓' : index + 1}
                        </div>
                        <span className={`${
                          index < currentSetup.currentStep ? 'text-green-700' :
                          index === currentSetup.currentStep ? 'text-blue-700' :
                          'text-gray-600'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Automation Tips */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg text-purple-800">Rachel's Quick Setup Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-semibold mb-2">Setup Success:</h4>
                  <ul className="space-y-1">
                    <li>• Start with beginner-level automations</li>
                    <li>• Test thoroughly before going live</li>
                    <li>• Keep templates simple and clear</li>
                    <li>• Monitor performance in first week</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Common Mistakes:</h4>
                  <ul className="space-y-1">
                    <li>• Overcomplicating initial setup</li>
                    <li>• Skipping the testing phase</li>
                    <li>• Not updating contact lists</li>
                    <li>• Forgetting to personalize templates</li>
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

export default RachelQuickAutomation;