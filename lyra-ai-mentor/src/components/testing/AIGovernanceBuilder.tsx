import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Users, FileText, AlertTriangle, CheckCircle, Scale, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface AIGovernanceBuilderProps {
  onComplete?: () => void;
}

interface GovernanceFramework {
  organizationContext: {
    size: string;
    dataTypes: string[];
    aiUses: string[];
    riskLevel: string;
  };
  policies: {
    title: string;
    purpose: string;
    scope: string;
    keyPoints: string[];
    implementation: string[];
    review: string;
  }[];
  ethicalPrinciples: {
    principle: string;
    description: string;
    practices: string[];
    metrics: string[];
  }[];
  decisionFramework: {
    stage: string;
    questions: string[];
    responsibility: string;
    documentation: string;
  }[];
  riskManagement: {
    risk: string;
    likelihood: string;
    impact: string;
    controls: string[];
    monitoring: string;
  }[];
  roles: {
    role: string;
    responsibilities: string[];
    authority: string[];
    training: string[];
  }[];
  compliance: {
    regulation: string;
    requirements: string[];
    implementation: string[];
    documentation: string[];
  }[];
  implementation: {
    phase: string;
    timeline: string;
    actions: string[];
    deliverables: string[];
    success: string[];
  }[];
}

export const AIGovernanceBuilder: React.FC<AIGovernanceBuilderProps> = ({ onComplete }) => {
  const [orgSize, setOrgSize] = useState<string>('');
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [aiApplications, setAiApplications] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [framework, setFramework] = useState<GovernanceFramework | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const organizationSizes = [
    { value: 'small', label: 'Small (1-25)', description: 'Lean governance approach' },
    { value: 'medium', label: 'Medium (26-100)', description: 'Structured framework' },
    { value: 'large', label: 'Large (100+)', description: 'Comprehensive governance' },
    { value: 'federated', label: 'Federated', description: 'Multiple entities' }
  ];

  const dataTypeOptions = [
    { value: 'donor_info', label: 'Donor Information', sensitive: true },
    { value: 'beneficiary_data', label: 'Beneficiary Data', sensitive: true },
    { value: 'health_records', label: 'Health Records', sensitive: true },
    { value: 'financial_data', label: 'Financial Data', sensitive: true },
    { value: 'employee_info', label: 'Employee Information', sensitive: true },
    { value: 'program_metrics', label: 'Program Metrics', sensitive: false },
    { value: 'public_content', label: 'Public Content', sensitive: false },
    { value: 'operational_data', label: 'Operational Data', sensitive: false }
  ];

  const aiApplicationOptions = [
    { value: 'content_generation', label: 'Content Generation' },
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'donor_insights', label: 'Donor Insights' },
    { value: 'chatbots', label: 'Chatbots/Virtual Assistants' },
    { value: 'predictive_analytics', label: 'Predictive Analytics' },
    { value: 'automation', label: 'Process Automation' },
    { value: 'decision_support', label: 'Decision Support' },
    { value: 'personalization', label: 'Personalization' }
  ];

  const concernOptions = [
    { value: 'bias', label: 'Bias and Fairness' },
    { value: 'privacy', label: 'Data Privacy' },
    { value: 'transparency', label: 'Transparency' },
    { value: 'accountability', label: 'Accountability' },
    { value: 'security', label: 'Security Risks' },
    { value: 'mission_alignment', label: 'Mission Alignment' },
    { value: 'job_displacement', label: 'Job Displacement' },
    { value: 'donor_trust', label: 'Donor Trust' }
  ];

  const generateFramework = async () => {
    if (!orgSize || dataTypes.length === 0 || aiApplications.length === 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = createGovernanceFramework();
      setFramework(result);
      
      toast.success('Governance framework created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate framework. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createGovernanceFramework = (): GovernanceFramework => {
    const hasSensitiveData = dataTypes.some(dt => 
      dataTypeOptions.find(dto => dto.value === dt)?.sensitive
    );
    
    const isHighRisk = hasSensitiveData || 
      aiApplications.includes('decision_support') || 
      aiApplications.includes('predictive_analytics');

    return {
      organizationContext: {
        size: organizationSizes.find(s => s.value === orgSize)?.label || '',
        dataTypes: dataTypes.map(dt => 
          dataTypeOptions.find(dto => dto.value === dt)?.label || dt
        ),
        aiUses: aiApplications.map(app => 
          aiApplicationOptions.find(ao => ao.value === app)?.label || app
        ),
        riskLevel: isHighRisk ? 'High' : 'Moderate'
      },
      policies: [
        {
          title: 'AI Acceptable Use Policy',
          purpose: 'Define appropriate and inappropriate uses of AI within the organization',
          scope: 'All staff, volunteers, and contractors using AI tools',
          keyPoints: [
            'AI must enhance, not replace, human judgment in mission-critical decisions',
            'All AI outputs must be reviewed by qualified staff before external use',
            'Personal or confidential data must not be input into public AI tools',
            'AI use must align with organizational values and mission',
            'Regular training on AI tools is mandatory for all users'
          ],
          implementation: [
            'Distribute policy to all staff and obtain acknowledgment',
            'Include in new employee onboarding',
            'Post quick reference guides near workstations',
            'Regular reminders in team meetings',
            'Annual policy review and updates'
          ],
          review: 'Quarterly review, annual major update'
        },
        {
          title: 'Data Privacy & AI Policy',
          purpose: 'Protect constituent data when using AI systems',
          scope: 'All AI tools processing personal or organizational data',
          keyPoints: [
            hasSensitiveData ? 'Health and donor data require extra protection layers' : 'All constituent data must be protected',
            'Data minimization: only use necessary data for AI tasks',
            'Anonymization required for AI training or analysis',
            'Consent mechanisms for AI-based personalization',
            'Right to opt-out of AI-driven decisions'
          ],
          implementation: [
            'Data classification system implementation',
            'AI tool vetting process for privacy compliance',
            'Regular privacy impact assessments',
            'Clear consent forms and opt-out procedures',
            'Incident response plan for data breaches'
          ],
          review: 'Bi-annual review, immediate updates for regulations'
        },
        {
          title: 'AI Procurement & Vendor Management',
          purpose: 'Ensure AI tools meet organizational standards',
          scope: 'All AI tool purchases and partnerships',
          keyPoints: [
            'Security assessment required for all AI vendors',
            'Ethical AI practices verification',
            'Data processing agreements mandatory',
            'Exit strategy and data portability requirements',
            'Cost-benefit analysis including hidden costs'
          ],
          implementation: [
            'Vendor evaluation checklist',
            'Legal review of all AI contracts',
            'Technical security assessments',
            'Pilot programs before full deployment',
            'Regular vendor performance reviews'
          ],
          review: 'Annual review of vendor relationships'
        }
      ],
      ethicalPrinciples: [
        {
          principle: 'Beneficence',
          description: 'AI should enhance our ability to do good and serve our mission',
          practices: [
            'Regular assessment of AI impact on beneficiaries',
            'Prioritize AI uses that directly improve services',
            'Measure and report positive outcomes from AI',
            'Involve beneficiaries in AI project planning'
          ],
          metrics: [
            'Number of people served improvement',
            'Service quality metrics',
            'Beneficiary satisfaction scores',
            'Mission impact indicators'
          ]
        },
        {
          principle: 'Non-maleficence',
          description: 'AI should not harm individuals or communities we serve',
          practices: [
            'Bias testing for all AI systems',
            'Human oversight for sensitive decisions',
            'Regular audits of AI outcomes',
            'Clear escalation procedures for concerns'
          ],
          metrics: [
            'Bias incident reports',
            'Override frequency tracking',
            'Complaint resolution times',
            'Harm prevention measures effectiveness'
          ]
        },
        {
          principle: 'Autonomy',
          description: 'Respect individual choice and human agency',
          practices: [
            'Transparent AI use disclosure',
            'Opt-out options for AI interactions',
            'Human alternative always available',
            'Clear explanation of AI role in decisions'
          ],
          metrics: [
            'Opt-out request rates',
            'Transparency score',
            'Human override requests',
            'User understanding assessments'
          ]
        },
        {
          principle: 'Justice',
          description: 'Fair and equitable AI use across all populations',
          practices: [
            'Demographic impact analysis',
            'Accessibility testing for AI interfaces',
            'Multi-language support requirements',
            'Digital divide considerations'
          ],
          metrics: [
            'Demographic usage patterns',
            'Accessibility compliance rate',
            'Language coverage percentage',
            'Equity gap measurements'
          ]
        }
      ],
      decisionFramework: [
        {
          stage: 'AI Project Initiation',
          questions: [
            'Does this AI use align with our mission and values?',
            'What specific problem will this AI solve?',
            'Who will be affected and how?',
            'What are the potential risks and benefits?',
            'Do we have the resources to implement responsibly?'
          ],
          responsibility: 'Department Head + AI Ethics Committee',
          documentation: 'AI Project Proposal Form'
        },
        {
          stage: 'Development/Selection',
          questions: [
            'Have we assessed bias in the AI system?',
            'Is the AI transparent enough for our needs?',
            'Can we explain AI decisions to stakeholders?',
            'Have we considered all privacy implications?',
            'Is there appropriate human oversight?'
          ],
          responsibility: 'Project Team + IT + Legal',
          documentation: 'AI Assessment Checklist'
        },
        {
          stage: 'Implementation',
          questions: [
            'Have all users been properly trained?',
            'Are monitoring systems in place?',
            'Do we have feedback mechanisms?',
            'Is the rollout plan inclusive?',
            'Have we communicated transparently?'
          ],
          responsibility: 'Implementation Team + Communications',
          documentation: 'Implementation Plan & Training Records'
        },
        {
          stage: 'Ongoing Operations',
          questions: [
            'Is the AI performing as expected?',
            'Are there any emerging biases or issues?',
            'Are stakeholders satisfied?',
            'Do we need to adjust our approach?',
            'Are we staying current with best practices?'
          ],
          responsibility: 'Operations Team + AI Ethics Committee',
          documentation: 'Monitoring Reports & Review Minutes'
        }
      ],
      riskManagement: [
        {
          risk: 'Bias in AI decisions affecting vulnerable populations',
          likelihood: isHighRisk ? 'High' : 'Medium',
          impact: 'High',
          controls: [
            'Regular bias audits using diverse test cases',
            'Diverse review teams for AI outputs',
            'Demographic impact monitoring',
            'Quick response team for bias incidents'
          ],
          monitoring: 'Monthly bias metrics review, quarterly audits'
        },
        {
          risk: 'Data breach through AI systems',
          likelihood: hasSensitiveData ? 'Medium' : 'Low',
          impact: 'High',
          controls: [
            'Encryption for all data in transit and at rest',
            'Access controls and authentication',
            'Regular security assessments',
            'Incident response plan',
            'Cyber insurance coverage'
          ],
          monitoring: 'Continuous security monitoring, quarterly penetration testing'
        },
        {
          risk: 'Mission drift through over-reliance on AI',
          likelihood: 'Medium',
          impact: 'Medium',
          controls: [
            'Regular mission alignment reviews',
            'Human-centered design requirements',
            'Stakeholder feedback loops',
            'Board oversight of AI strategy'
          ],
          monitoring: 'Quarterly mission impact assessment'
        },
        {
          risk: 'Regulatory non-compliance',
          likelihood: hasSensitiveData ? 'Medium' : 'Low',
          impact: 'High',
          controls: [
            'Regular regulatory scanning',
            'Legal review of all AI uses',
            'Compliance training for staff',
            'Documentation of all decisions'
          ],
          monitoring: 'Monthly regulatory updates, annual compliance audit'
        },
        {
          risk: 'Loss of donor trust',
          likelihood: 'Low',
          impact: 'High',
          controls: [
            'Transparent communication about AI use',
            'Donor choice and control options',
            'Success story sharing',
            'Ethical AI certification pursuit'
          ],
          monitoring: 'Donor sentiment surveys, donation pattern analysis'
        }
      ],
      roles: [
        {
          role: 'AI Ethics Committee',
          responsibilities: [
            'Review and approve AI projects',
            'Develop and update AI policies',
            'Investigate ethical concerns',
            'Provide guidance on difficult decisions',
            'Report to board on AI governance'
          ],
          authority: [
            'Approve or reject AI initiatives',
            'Require modifications to AI systems',
            'Access all AI-related documentation',
            'Commission external audits'
          ],
          training: [
            'AI ethics fundamentals',
            'Bias detection and mitigation',
            'Privacy and security principles',
            'Sector-specific AI considerations'
          ]
        },
        {
          role: 'AI Project Owners',
          responsibilities: [
            'Ensure ethical AI implementation',
            'Monitor AI system performance',
            'Address stakeholder concerns',
            'Maintain documentation',
            'Report issues promptly'
          ],
          authority: [
            'Make day-to-day AI decisions',
            'Pause AI operations if needed',
            'Request resources for compliance',
            'Escalate concerns to committee'
          ],
          training: [
            'Responsible AI practices',
            'Project-specific AI tools',
            'Monitoring and evaluation',
            'Incident response procedures'
          ]
        },
        {
          role: 'Data Protection Officer',
          responsibilities: [
            'Oversee AI data privacy compliance',
            'Conduct privacy impact assessments',
            'Handle data subject requests',
            'Liaise with regulators',
            'Train staff on data protection'
          ],
          authority: [
            'Access all data processing records',
            'Stop non-compliant processing',
            'Direct remediation efforts',
            'Report directly to leadership'
          ],
          training: [
            'Data protection regulations',
            'AI-specific privacy risks',
            'Technical security measures',
            'Incident management'
          ]
        }
      ],
      compliance: [
        ...(hasSensitiveData ? [{
          regulation: 'HIPAA (if health data)',
          requirements: [
            'Minimum necessary data use',
            'Encryption requirements',
            'Access controls',
            'Audit trails',
            'Business Associate Agreements'
          ],
          implementation: [
            'HIPAA-compliant AI vendor selection',
            'Technical safeguards deployment',
            'Workforce training program',
            'Regular risk assessments'
          ],
          documentation: [
            'Risk assessments',
            'Training records',
            'Access logs',
            'Incident reports',
            'BAA agreements'
          ]
        }] : []),
        {
          regulation: 'GDPR/State Privacy Laws',
          requirements: [
            'Lawful basis for processing',
            'Transparency obligations',
            'Data subject rights',
            'Privacy by design',
            'Data protection impact assessments'
          ],
          implementation: [
            'Privacy notices update',
            'Consent mechanisms',
            'Rights request procedures',
            'Vendor compliance verification'
          ],
          documentation: [
            'Processing records',
            'Consent records',
            'Rights requests log',
            'DPIAs',
            'Vendor assessments'
          ]
        },
        {
          regulation: 'Sector-Specific Guidelines',
          requirements: [
            'Fundraising ethics compliance',
            'Grant reporting accuracy',
            'Beneficiary protection standards',
            'Financial transparency'
          ],
          implementation: [
            'AI use disclosure in reports',
            'Accuracy verification processes',
            'Beneficiary consent procedures',
            'Audit trail maintenance'
          ],
          documentation: [
            'Compliance checklists',
            'Audit reports',
            'Disclosure statements',
            'Training materials'
          ]
        }
      ],
      implementation: [
        {
          phase: 'Phase 1: Foundation (Months 1-2)',
          timeline: '8 weeks',
          actions: [
            'Form AI Ethics Committee',
            'Conduct current state assessment',
            'Draft initial policies',
            'Identify quick wins',
            'Secure leadership commitment'
          ],
          deliverables: [
            'Committee charter',
            'Assessment report',
            'Draft policy documents',
            'Quick win implementations',
            'Leadership communication'
          ],
          success: [
            'Committee operational',
            'Baseline established',
            'Policies reviewed',
            '2-3 quick wins achieved',
            'Leadership engaged'
          ]
        },
        {
          phase: 'Phase 2: Policy Rollout (Months 3-4)',
          timeline: '8 weeks',
          actions: [
            'Finalize policies with legal review',
            'Develop training materials',
            'Conduct all-staff training',
            'Implement initial controls',
            'Launch feedback mechanisms'
          ],
          deliverables: [
            'Approved policies',
            'Training curriculum',
            'Training completion records',
            'Control implementations',
            'Feedback system'
          ],
          success: [
            'Policies approved and distributed',
            '90% staff trained',
            'Key controls operational',
            'Feedback being collected',
            'No major incidents'
          ]
        },
        {
          phase: 'Phase 3: Operationalization (Months 5-6)',
          timeline: '8 weeks',
          actions: [
            'Apply framework to existing AI',
            'Launch new AI projects with governance',
            'Conduct first audits',
            'Refine processes based on learning',
            'External stakeholder communication'
          ],
          deliverables: [
            'AI inventory and assessments',
            'New project approvals',
            'Audit reports',
            'Process improvements',
            'Stakeholder updates'
          ],
          success: [
            'All AI uses documented',
            'New projects following process',
            'Audit findings addressed',
            'Processes streamlined',
            'Positive stakeholder feedback'
          ]
        },
        {
          phase: 'Phase 4: Maturation (Ongoing)',
          timeline: 'Continuous',
          actions: [
            'Regular policy updates',
            'Continuous training',
            'Periodic audits',
            'Stakeholder engagement',
            'Industry leadership'
          ],
          deliverables: [
            'Annual policy reviews',
            'Training metrics',
            'Audit reports',
            'Stakeholder feedback',
            'Thought leadership'
          ],
          success: [
            'Policies current and effective',
            'Culture of responsible AI',
            'Clean audit results',
            'High stakeholder trust',
            'Recognition as leader'
          ]
        }
      ]
    };
  };

  const handleDataTypeToggle = (dataType: string) => {
    setDataTypes(prev => 
      prev.includes(dataType) 
        ? prev.filter(dt => dt !== dataType)
        : [...prev, dataType]
    );
  };

  const handleAiApplicationToggle = (app: string) => {
    setAiApplications(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  const handleConcernToggle = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            AI Governance Framework Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create comprehensive policies for responsible AI use
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Organization Size</label>
            <Select value={orgSize} onValueChange={setOrgSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select your organization size" />
              </SelectTrigger>
              <SelectContent>
                {organizationSizes.map((size) => (
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

          <div>
            <label className="block text-sm font-medium mb-2">Types of Data You Handle</label>
            <div className="space-y-2">
              {dataTypeOptions.map((dataType) => (
                <div key={dataType.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={dataType.value}
                    checked={dataTypes.includes(dataType.value)}
                    onCheckedChange={() => handleDataTypeToggle(dataType.value)}
                  />
                  <label
                    htmlFor={dataType.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {dataType.label}
                    {dataType.sensitive && (
                      <Badge variant="outline" className="ml-2 text-xs">Sensitive</Badge>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Applications</label>
            <div className="space-y-2">
              {aiApplicationOptions.map((app) => (
                <div key={app.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={app.value}
                    checked={aiApplications.includes(app.value)}
                    onCheckedChange={() => handleAiApplicationToggle(app.value)}
                  />
                  <label
                    htmlFor={app.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {app.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Concerns (Optional)</label>
            <div className="space-y-2">
              {concernOptions.map((concern) => (
                <div key={concern.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={concern.value}
                    checked={concerns.includes(concern.value)}
                    onCheckedChange={() => handleConcernToggle(concern.value)}
                  />
                  <label
                    htmlFor={concern.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {concern.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateFramework} 
            disabled={isGenerating || !orgSize || dataTypes.length === 0 || aiApplications.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Shield className="h-4 w-4 mr-2 animate-pulse" />
                Building Governance Framework...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Framework
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {framework && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your AI Governance Framework</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Customized for {framework.organizationContext.size} handling{' '}
                    {framework.organizationContext.dataTypes.join(', ')}
                  </p>
                </div>
                <Badge 
                  variant={framework.organizationContext.riskLevel === 'High' ? 'destructive' : 'secondary'}
                >
                  {framework.organizationContext.riskLevel} Risk Profile
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Core Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.policies.map((policy, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{policy.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{policy.purpose}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Key Points:</p>
                        <ul className="space-y-1">
                          {policy.keyPoints.map((point, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-600 mt-0.5">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          Scope: {policy.scope}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Review: {policy.review}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-600" />
                Ethical Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {framework.ethicalPrinciples.map((principle, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-1">{principle.principle}</h4>
                    <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Practices:</p>
                        <ul className="space-y-1">
                          {principle.practices.slice(0, 3).map((practice, i) => (
                            <li key={i} className="text-xs text-gray-600">• {practice}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700">Metrics:</p>
                        <ul className="space-y-1">
                          {principle.metrics.slice(0, 2).map((metric, i) => (
                            <li key={i} className="text-xs text-gray-600">• {metric}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Decision Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.decisionFramework.map((stage, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-medium mb-2">{stage.stage}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Key Questions:</p>
                        <ul className="space-y-1">
                          {stage.questions.slice(0, 3).map((question, i) => (
                            <li key={i} className="text-sm text-gray-600">• {question}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-medium">Responsibility:</span>
                        <Badge variant="outline">{stage.responsibility}</Badge>
                        <span className="font-medium">Documented in:</span>
                        <Badge variant="outline">{stage.documentation}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {framework.riskManagement.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{risk.risk}</h4>
                      <div className="flex gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            risk.likelihood === 'High' ? 'border-red-500 text-red-700' :
                            risk.likelihood === 'Medium' ? 'border-amber-500 text-amber-700' :
                            'border-green-500 text-green-700'
                          }`}
                        >
                          L: {risk.likelihood}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            risk.impact === 'High' ? 'border-red-500 text-red-700' :
                            risk.impact === 'Medium' ? 'border-amber-500 text-amber-700' :
                            'border-green-500 text-green-700'
                          }`}
                        >
                          I: {risk.impact}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Controls:</p>
                        <ul className="space-y-1">
                          {risk.controls.slice(0, 3).map((control, i) => (
                            <li key={i} className="text-xs text-gray-600">• {control}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Monitoring:</span> {risk.monitoring}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Roles & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.roles.map((role, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{role.role}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Responsibilities:</p>
                        <ul className="space-y-1">
                          {role.responsibilities.slice(0, 3).map((resp, i) => (
                            <li key={i} className="text-xs text-gray-600">• {resp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Authority:</p>
                        <ul className="space-y-1">
                          {role.authority.slice(0, 3).map((auth, i) => (
                            <li key={i} className="text-xs text-gray-600">• {auth}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Training Required:</p>
                        <ul className="space-y-1">
                          {role.training.slice(0, 3).map((train, i) => (
                            <li key={i} className="text-xs text-gray-600">• {train}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Compliance Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.compliance.map((comp, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{comp.regulation}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                        <ul className="space-y-1">
                          {comp.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="text-xs text-gray-600">• {req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Documentation Needed:</p>
                        <ul className="space-y-1">
                          {comp.documentation.slice(0, 3).map((doc, i) => (
                            <li key={i} className="text-xs text-gray-600">• {doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.implementation.map((phase, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{phase.phase}</h4>
                      <Badge variant="outline">{phase.timeline}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Actions:</p>
                        <ul className="space-y-1">
                          {phase.actions.slice(0, 3).map((action, i) => (
                            <li key={i} className="text-xs text-gray-600">• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Deliverables:</p>
                        <ul className="space-y-1">
                          {phase.deliverables.slice(0, 3).map((deliverable, i) => (
                            <li key={i} className="text-xs text-gray-600">• {deliverable}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Success Metrics:</p>
                        <ul className="space-y-1">
                          {phase.success.slice(0, 3).map((metric, i) => (
                            <li key={i} className="text-xs text-gray-600">• {metric}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-indigo-900 mb-2">Implementation Success Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800">
                    <li>Start with a pilot project to test your framework</li>
                    <li>Engage skeptics early and address their concerns</li>
                    <li>Make policies practical, not just theoretical</li>
                    <li>Celebrate compliance wins to build culture</li>
                    <li>Keep documentation simple and accessible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  <strong>Next Step:</strong> Share this framework with your leadership team and legal counsel 
                  for review. Once approved, begin with Phase 1 implementation focusing on quick wins.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};