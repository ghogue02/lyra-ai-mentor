import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Share2, ArrowRight, Sparkles, FileText, 
  Mail, Users, LineChart, Cog, Target, CheckCircle2,
  Lightbulb, Zap, Heart
} from 'lucide-react';
import { ExportButton } from '@/components/ui/ExportButton';
import { UseInSuggestions } from '@/components/ui/UseInSuggestions';
import { componentIntegrationService } from '@/services/componentIntegrationService';
import { toast } from 'sonner';

const ExportIntegrationDemo: React.FC = () => {
  const [activeCharacter, setActiveCharacter] = useState<'maya' | 'sofia' | 'david' | 'rachel' | 'alex'>('maya');
  
  // Sample content for each character
  const sampleContent = {
    maya: {
      email: `Dear Parents,

I hope this message finds you well. I wanted to reach out to share some exciting updates about our after-school program and the positive impact it's having on our students.

This month, we've seen remarkable growth in student engagement, with 95% attendance and enthusiastic participation in our new STEM activities. Your children have been particularly excited about our robotics workshop, where they're learning coding basics while building their own simple robots.

We're also thrilled to announce that we've secured additional funding that will allow us to expand our tutoring services. Starting next week, we'll offer one-on-one math support for any student who needs extra help.

Thank you for your continued trust and support. Together, we're making a real difference in these young lives.

Warm regards,
Maya Rodriguez
Program Director`,
      recipe: { tone: 'Warm & Understanding', recipient: 'Concerned Parent', purpose: 'Share Update' }
    },
    sofia: {
      story: `The Power of Second Chances: Maria's Journey

When Maria first walked through our doors, she carried the weight of countless rejections. A single mother of three, she'd been turned away from job after job, her lack of formal education becoming an insurmountable barrier.

But our workforce development program saw something others missed—determination that couldn't be taught in any classroom.

Through our partnership with local businesses, Maria enrolled in our accelerated training program. Six months later, she didn't just find a job; she discovered a career. Today, she's a certified medical assistant at Valley Health Center, providing for her family while pursuing her nursing degree in the evenings.

Maria's story isn't unique here—it's what happens when a community believes in second chances. Last year alone, we helped 127 individuals like Maria transform their lives through education and opportunity.

This is why your support matters. Every donation, every volunteer hour, every partnership creates another success story waiting to be written.`,
      voice: 'Empathetic Advocate'
    },
    david: {
      insights: {
        title: 'Q3 Program Impact Analysis',
        keyMetrics: [
          { metric: 'Youth Served', value: '347', change: '+23%', trend: 'up' },
          { metric: 'Academic Improvement', value: '82%', change: '+15%', trend: 'up' },
          { metric: 'Family Engagement', value: '91%', change: '+8%', trend: 'up' },
          { metric: 'Cost per Youth', value: '$1,235', change: '-12%', trend: 'down' }
        ],
        narrative: 'Our data reveals a compelling story: targeted interventions in academic support are yielding exponential returns. The 15% increase in academic improvement correlates directly with our new peer tutoring initiative, while the reduction in cost per youth demonstrates improved operational efficiency.'
      }
    },
    rachel: {
      workflow: {
        name: 'Volunteer Onboarding Automation',
        steps: [
          'Application submitted online',
          'Automated background check initiated',
          'Welcome email with orientation materials sent',
          'Training modules assigned based on role',
          'Scheduling system activated for first shift',
          'Feedback survey scheduled for 30 days'
        ],
        impact: 'Reduced onboarding time from 2 weeks to 3 days, saving 15 hours of staff time per volunteer'
      }
    },
    alex: {
      strategy: {
        vision: 'Transform our organization into a data-driven, community-centered force for change',
        pillars: [
          'Embrace AI to enhance human impact, not replace it',
          'Build transparent systems that empower staff and stakeholders',
          'Create sustainable funding through diversified revenue streams',
          'Foster innovation while maintaining our core mission'
        ],
        timeline: '18-month transformation roadmap with quarterly milestones'
      }
    }
  };

  const characterColors = {
    maya: 'purple',
    sofia: 'pink',
    david: 'green',
    rachel: 'teal',
    alex: 'blue'
  };

  const handleDemoExport = (character: string, format: string) => {
    toast.success(`Exported ${character}'s content as ${format.toUpperCase()}`, {
      description: 'Download will begin shortly'
    });
  };

  const handleDemoIntegration = (from: string, to: string) => {
    toast.success(`Content shared from ${from} to ${to}`, {
      description: 'Navigate to the target component to use this content'
    });
  };

  // Get integration history
  const integrationHistory = componentIntegrationService.getMostUsedIntegrations();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Export & Integration Features</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how content flows seamlessly between characters, creating a unified workflow
          that saves time and maintains consistency across all communications.
        </p>
      </div>

      <Tabs value={activeCharacter} onValueChange={(v) => setActiveCharacter(v as any)}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="maya" className="gap-2">
            <Mail className="w-4 h-4" />
            Maya
          </TabsTrigger>
          <TabsTrigger value="sofia" className="gap-2">
            <Heart className="w-4 h-4" />
            Sofia
          </TabsTrigger>
          <TabsTrigger value="david" className="gap-2">
            <LineChart className="w-4 h-4" />
            David
          </TabsTrigger>
          <TabsTrigger value="rachel" className="gap-2">
            <Cog className="w-4 h-4" />
            Rachel
          </TabsTrigger>
          <TabsTrigger value="alex" className="gap-2">
            <Target className="w-4 h-4" />
            Alex
          </TabsTrigger>
        </TabsList>

        {/* Maya's Export Demo */}
        <TabsContent value="maya">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-purple-600" />
                  Maya's Email Export
                </CardTitle>
                <CardDescription>
                  Professional emails with multiple export formats and smart integration suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{sampleContent.maya.email}</pre>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-purple-700">
                    {sampleContent.maya.recipe.tone}
                  </Badge>
                  <Badge variant="outline" className="text-purple-700">
                    {sampleContent.maya.recipe.recipient}
                  </Badge>
                  <Badge variant="outline" className="text-purple-700">
                    {sampleContent.maya.recipe.purpose}
                  </Badge>
                </div>

                <div className="pt-4 border-t">
                  <ExportButton
                    data={{
                      title: 'Parent Update Email',
                      content: sampleContent.maya.email,
                      metadata: {
                        createdAt: new Date().toISOString(),
                        author: 'Maya Rodriguez',
                        tags: ['email', 'parent-communication', 'update']
                      }
                    }}
                    formats={['pdf', 'docx', 'txt']}
                    characterName="Maya"
                    suggestUseIn={['Communication Metrics', 'Template Library', 'Sofia Story Creator']}
                    onExportComplete={(format) => handleDemoExport('Maya', format)}
                  />
                </div>

                <UseInSuggestions
                  content={{
                    email: sampleContent.maya.email,
                    recipe: sampleContent.maya.recipe
                  }}
                  contentType="email"
                  fromCharacter="Maya"
                  componentType="maya-email"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sofia's Export Demo */}
        <TabsContent value="sofia">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  Sofia's Story Export
                </CardTitle>
                <CardDescription>
                  Compelling narratives ready for multiple channels and formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-pink-700 mb-2">
                    Voice: {sampleContent.sofia.voice}
                  </p>
                  <pre className="whitespace-pre-wrap text-sm">{sampleContent.sofia.story}</pre>
                </div>

                <div className="pt-4 border-t">
                  <ExportButton
                    data={{
                      title: 'Maria\'s Success Story',
                      content: sampleContent.sofia.story,
                      metadata: {
                        createdAt: new Date().toISOString(),
                        author: 'Sofia Martinez',
                        tags: ['story', 'impact', 'success', sampleContent.sofia.voice]
                      }
                    }}
                    formats={['pdf', 'docx', 'txt']}
                    characterName="Sofia"
                    suggestUseIn={['Maya Email Composer', 'Social Media', 'Grant Proposals']}
                    onExportComplete={(format) => handleDemoExport('Sofia', format)}
                  />
                </div>

                <UseInSuggestions
                  content={{
                    story: sampleContent.sofia.story,
                    voice: sampleContent.sofia.voice
                  }}
                  contentType="story"
                  fromCharacter="Sofia"
                  componentType="sofia-story"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* David's Export Demo */}
        <TabsContent value="david">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-green-600" />
                  David's Data Export
                </CardTitle>
                <CardDescription>
                  Data insights with narrative, ready for presentations and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-green-900">{sampleContent.david.insights.title}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sampleContent.david.insights.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-green-200">
                        <p className="text-xs text-gray-600">{metric.metric}</p>
                        <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                        <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm">{sampleContent.david.insights.narrative}</p>
                </div>

                <div className="pt-4 border-t">
                  <ExportButton
                    data={{
                      title: sampleContent.david.insights.title,
                      content: sampleContent.david.insights.keyMetrics,
                      metadata: {
                        createdAt: new Date().toISOString(),
                        author: 'David Chen',
                        tags: ['analytics', 'metrics', 'quarterly-report']
                      },
                      sections: [
                        {
                          title: 'Key Metrics',
                          content: sampleContent.david.insights.keyMetrics,
                          type: 'table'
                        },
                        {
                          title: 'Analysis',
                          content: sampleContent.david.insights.narrative,
                          type: 'text'
                        }
                      ]
                    }}
                    formats={['pdf', 'docx', 'csv', 'json']}
                    characterName="David"
                    suggestUseIn={['Alex Strategy', 'Board Reports', 'Grant Proposals']}
                    onExportComplete={(format) => handleDemoExport('David', format)}
                  />
                </div>

                <UseInSuggestions
                  content={sampleContent.david.insights}
                  contentType="data"
                  fromCharacter="David"
                  componentType="david-insights"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rachel's Export Demo */}
        <TabsContent value="rachel">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="w-6 h-6 text-teal-600" />
                  Rachel's Workflow Export
                </CardTitle>
                <CardDescription>
                  Automated workflows ready for implementation and training
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-teal-900">{sampleContent.rachel.workflow.name}</h3>
                  
                  <div className="space-y-2">
                    {sampleContent.rachel.workflow.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-teal-100 p-3 rounded">
                    <p className="text-sm font-medium text-teal-900">Impact:</p>
                    <p className="text-sm text-teal-700">{sampleContent.rachel.workflow.impact}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <ExportButton
                    data={{
                      title: sampleContent.rachel.workflow.name,
                      content: sampleContent.rachel.workflow,
                      metadata: {
                        createdAt: new Date().toISOString(),
                        author: 'Rachel Thompson',
                        tags: ['workflow', 'automation', 'volunteer-management']
                      }
                    }}
                    formats={['pdf', 'docx', 'txt']}
                    characterName="Rachel"
                    suggestUseIn={['Process Documentation', 'Training Materials', 'Alex Change Management']}
                    onExportComplete={(format) => handleDemoExport('Rachel', format)}
                  />
                </div>

                <UseInSuggestions
                  content={sampleContent.rachel.workflow}
                  contentType="workflow"
                  fromCharacter="Rachel"
                  componentType="rachel-workflow"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alex's Export Demo */}
        <TabsContent value="alex">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Alex's Strategy Export
                </CardTitle>
                <CardDescription>
                  Strategic plans ready for board presentations and implementation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Vision</h3>
                    <p className="text-sm">{sampleContent.alex.strategy.vision}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Strategic Pillars</h3>
                    <ul className="space-y-1">
                      {sampleContent.alex.strategy.pillars.map((pillar, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">{pillar}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-sm font-medium text-blue-700">
                    Timeline: {sampleContent.alex.strategy.timeline}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <ExportButton
                    data={{
                      title: 'AI Transformation Strategy',
                      content: sampleContent.alex.strategy,
                      metadata: {
                        createdAt: new Date().toISOString(),
                        author: 'Alex Johnson',
                        tags: ['strategy', 'transformation', 'leadership']
                      }
                    }}
                    formats={['pdf', 'docx', 'txt']}
                    characterName="Alex"
                    suggestUseIn={['Board Presentations', 'Team Meetings', 'Grant Applications']}
                    onExportComplete={(format) => handleDemoExport('Alex', format)}
                  />
                </div>

                <UseInSuggestions
                  content={sampleContent.alex.strategy}
                  contentType="strategy"
                  fromCharacter="Alex"
                  componentType="alex-strategy"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Integration Flow Visualization */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600" />
            Content Integration Flow
          </CardTitle>
          <CardDescription>
            See how content flows between characters to create a unified workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium">Maya's Email</p>
                  <p className="text-sm text-gray-600">Professional communication</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <LineChart className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">David's Data</p>
                  <p className="text-sm text-gray-600">Add metrics to emails</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium">Enhanced Email</p>
                  <p className="text-sm text-gray-600">Data-driven communication</p>
                </div>
              </div>
            </div>
          </div>

          {integrationHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Most Used Integrations</h4>
              <div className="space-y-2">
                {integrationHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.pattern}</span>
                    <Badge variant="outline">{item.count} uses</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Save 2+ Hours Daily</h3>
            <p className="text-sm text-gray-600">
              Export templates and reuse content across multiple communications
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Unified Workflow</h3>
            <p className="text-sm text-gray-600">
              Connect data, stories, and strategies seamlessly
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Smart Suggestions</h3>
            <p className="text-sm text-gray-600">
              AI recommends where to use your content for maximum impact
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportIntegrationDemo;