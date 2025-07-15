import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Clock, Copy, CheckSquare, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectPlannerProps {
  onComplete?: () => void;
}

interface ProjectPhase {
  name: string;
  duration: string;
  milestones: string[];
  dependencies: string[];
  resources: string[];
}

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({ onComplete }) => {
  const [projectType, setProjectType] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTimeline, setProjectTimeline] = useState<string>('3_months');
  const [projectPlan, setProjectPlan] = useState('');
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);

  const projectTypes = [
    { value: 'event_planning', label: 'Event Planning', description: 'Fundraisers, galas, community events' },
    { value: 'program_launch', label: 'Program Launch', description: 'New service or initiative rollout' },
    { value: 'campaign_development', label: 'Campaign Development', description: 'Fundraising or awareness campaigns' },
    { value: 'facility_project', label: 'Facility Project', description: 'Renovations, moves, or space changes' },
    { value: 'technology_implementation', label: 'Technology Implementation', description: 'New systems or digital tools' },
    { value: 'strategic_planning', label: 'Strategic Planning', description: 'Organizational planning process' }
  ];

  const timelines = [
    { value: '1_month', label: '1 Month', description: 'Quick turnaround project' },
    { value: '3_months', label: '3 Months', description: 'Standard project timeline' },
    { value: '6_months', label: '6 Months', description: 'Complex implementation' },
    { value: '1_year', label: '1 Year', description: 'Major initiative' }
  ];

  const createProjectPlan = async () => {
    if (!projectType || !projectName.trim() || !projectDescription.trim()) {
      toast.error('Please complete all project details');
      return;
    }

    setIsPlanning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateProjectPlan();
      setProjectPlan(result.plan);
      setProjectPhases(result.phases);
      
      toast.success('Project plan created successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create project plan. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  const generateProjectPlan = () => {
    const selectedType = projectTypes.find(t => t.value === projectType);
    const selectedTimeline = timelines.find(t => t.value === projectTimeline);
    
    let plan = '';
    let phases: ProjectPhase[] = [];

    switch (projectType) {
      case 'event_planning':
        plan = `# Project Plan: ${projectName}

## Project Overview
**Type**: ${selectedType?.label}
**Timeline**: ${selectedTimeline?.label}
**Description**: ${projectDescription}

## Executive Summary
This comprehensive project plan outlines the strategy for planning and executing ${projectName}. The plan includes detailed phases, milestones, resource requirements, and risk mitigation strategies to ensure successful delivery.

## Project Phases

### Phase 1: Planning & Strategy (Weeks 1-3)
**Objectives**: Define event goals, establish budget, secure venue
**Key Activities**:
- Form planning committee
- Define event objectives and success metrics
- Create preliminary budget
- Research and book venue
- Develop event theme and branding

**Milestones**:
✓ Planning committee formed
✓ Budget approved
✓ Venue contracted
✓ Save-the-date sent

### Phase 2: Vendor & Program Development (Weeks 4-8)
**Objectives**: Secure all vendors, finalize program, launch marketing
**Key Activities**:
- Contract catering, AV, entertainment
- Develop detailed run-of-show
- Create marketing materials
- Launch ticket sales/registration
- Recruit volunteers

**Milestones**:
✓ All vendors contracted
✓ Program finalized
✓ Marketing campaign launched
✓ 50% registration target met

### Phase 3: Execution & Follow-up (Weeks 9-12)
**Objectives**: Final preparations, event execution, post-event activities
**Key Activities**:
- Finalize logistics and staffing
- Conduct volunteer training
- Execute event
- Send thank you communications
- Complete financial reconciliation
- Gather and analyze feedback

**Milestones**:
✓ Event successfully executed
✓ Thank yous sent within 48 hours
✓ Final report completed
✓ Lessons learned documented

## Resource Requirements
- **Human Resources**: Event coordinator, marketing lead, volunteer coordinator, finance support
- **Budget**: Venue, catering, marketing, AV, entertainment, supplies
- **Technology**: Registration platform, payment processing, email marketing
- **Volunteers**: 20-30 for event day

## Risk Mitigation
- **Low attendance**: Early marketing, personal outreach, incentives
- **Weather (outdoor events)**: Backup indoor option, tent rental
- **Vendor issues**: Backup vendor list, clear contracts
- **Budget overrun**: 10% contingency, regular monitoring

## Success Metrics
- Attendance target: [Number]
- Revenue goal: $[Amount]
- Donor satisfaction: 90%+
- Media coverage: [Number] outlets`;

        phases = [
          {
            name: 'Planning & Strategy',
            duration: '3 weeks',
            milestones: ['Committee formed', 'Budget approved', 'Venue booked', 'Save-the-date sent'],
            dependencies: ['Board approval', 'Initial funding'],
            resources: ['Event coordinator', 'Planning committee', 'Finance team']
          },
          {
            name: 'Vendor & Program Development',
            duration: '5 weeks',
            milestones: ['Vendors contracted', 'Program finalized', 'Marketing launched', '50% registration'],
            dependencies: ['Venue confirmation', 'Budget approval'],
            resources: ['Marketing lead', 'Design team', 'Vendor relationships']
          },
          {
            name: 'Execution & Follow-up',
            duration: '4 weeks',
            milestones: ['Event executed', 'Thank yous sent', 'Report completed', 'Lessons documented'],
            dependencies: ['All prior phases', 'Volunteer recruitment'],
            resources: ['Full team', '20-30 volunteers', 'AV support']
          }
        ];
        break;

      case 'program_launch':
        plan = `# Project Plan: ${projectName}

## Project Overview
**Type**: ${selectedType?.label}
**Timeline**: ${selectedTimeline?.label}
**Description**: ${projectDescription}

## Executive Summary
This project plan guides the successful launch of ${projectName}, ensuring all operational, staffing, and community engagement elements are in place for sustainable program delivery.

## Project Phases

### Phase 1: Program Design & Development (Month 1)
**Objectives**: Finalize program model, secure resources, develop materials
**Key Activities**:
- Conduct needs assessment
- Design program curriculum/model
- Develop policies and procedures
- Create participant materials
- Establish evaluation framework

**Milestones**:
✓ Needs assessment completed
✓ Program model approved
✓ Materials developed
✓ Evaluation plan finalized

### Phase 2: Staffing & Training (Month 2)
**Objectives**: Hire staff, train team, establish partnerships
**Key Activities**:
- Recruit and hire program staff
- Conduct comprehensive training
- Establish referral partnerships
- Set up data systems
- Pilot with small group

**Milestones**:
✓ Staff hired and trained
✓ Partnerships established
✓ Systems operational
✓ Pilot feedback incorporated

### Phase 3: Launch & Stabilization (Month 3)
**Objectives**: Full program launch, participant enrollment, continuous improvement
**Key Activities**:
- Launch outreach campaign
- Begin participant enrollment
- Deliver program services
- Monitor quality and outcomes
- Adjust based on feedback

**Milestones**:
✓ Program launched
✓ Enrollment targets met
✓ First cycle completed
✓ Improvement plan created

## Resource Requirements
- **Staffing**: Program director, 2-3 direct service staff, administrative support
- **Space**: Program facility, meeting rooms, storage
- **Materials**: Curriculum, supplies, technology
- **Funding**: Staff salaries, operations, materials, evaluation

## Implementation Timeline
- Week 1-2: Needs assessment and stakeholder input
- Week 3-4: Program design and curriculum development
- Week 5-6: Material creation and system setup
- Week 7-8: Staff recruitment and hiring
- Week 9-10: Training and partnership development
- Week 11-12: Pilot, launch, and initial operations

## Quality Assurance
- Weekly team meetings
- Monthly stakeholder check-ins
- Participant feedback surveys
- Quarterly outcome evaluation
- Continuous improvement process`;

        phases = [
          {
            name: 'Program Design & Development',
            duration: '4 weeks',
            milestones: ['Needs assessment', 'Model approved', 'Materials created', 'Evaluation framework'],
            dependencies: ['Funding secured', 'Leadership approval'],
            resources: ['Program designer', 'Subject matter experts', 'Community input']
          },
          {
            name: 'Staffing & Training',
            duration: '4 weeks',
            milestones: ['Staff hired', 'Training completed', 'Partnerships formed', 'Pilot conducted'],
            dependencies: ['Program model finalized', 'Budget approved'],
            resources: ['HR support', 'Training team', 'Partner organizations']
          },
          {
            name: 'Launch & Stabilization',
            duration: '4 weeks',
            milestones: ['Program launched', 'Enrollment target met', 'First cycle done', 'Improvements identified'],
            dependencies: ['Staff trained', 'Materials ready', 'Systems operational'],
            resources: ['Full program team', 'Marketing support', 'Evaluation tools']
          }
        ];
        break;

      default:
        plan = `# Project Plan: ${projectName}

## Project Overview
**Type**: ${selectedType?.label}
**Timeline**: ${selectedTimeline?.label}
**Description**: ${projectDescription}

## Project Structure

### Phase 1: Initiation & Planning
**Duration**: ${projectTimeline === '1_month' ? '1 week' : '2-3 weeks'}
- Define project scope and objectives
- Identify stakeholders and form project team
- Develop project charter
- Create detailed project plan
- Secure resources and budget

### Phase 2: Execution & Development
**Duration**: ${projectTimeline === '1_month' ? '2 weeks' : '60% of timeline'}
- Implement project activities
- Regular team meetings and progress monitoring
- Stakeholder communication
- Quality control and risk management
- Adjust plan as needed

### Phase 3: Monitoring & Control
**Duration**: Concurrent with Phase 2
- Track progress against milestones
- Manage changes and issues
- Ensure quality standards
- Budget monitoring
- Risk mitigation

### Phase 4: Closure & Evaluation
**Duration**: ${projectTimeline === '1_month' ? '1 week' : '2 weeks'}
- Complete final deliverables
- Conduct project evaluation
- Document lessons learned
- Celebrate success
- Transition to operations

## Key Success Factors
- Clear communication channels
- Regular progress monitoring
- Stakeholder engagement
- Risk management
- Team collaboration

## Deliverables
- [List specific project deliverables]
- Progress reports
- Final project documentation
- Evaluation report`;

        phases = [
          {
            name: 'Initiation & Planning',
            duration: '2-3 weeks',
            milestones: ['Charter approved', 'Team formed', 'Plan finalized', 'Resources secured'],
            dependencies: ['Executive approval', 'Initial funding'],
            resources: ['Project manager', 'Core team', 'Stakeholders']
          },
          {
            name: 'Execution & Development',
            duration: '60% of timeline',
            milestones: ['Key deliverables completed', 'Milestones achieved', 'Quality standards met'],
            dependencies: ['Planning complete', 'Resources available'],
            resources: ['Full project team', 'Subject matter experts', 'Vendors/partners']
          },
          {
            name: 'Closure & Evaluation',
            duration: '2 weeks',
            milestones: ['Deliverables accepted', 'Evaluation complete', 'Lessons documented', 'Celebration held'],
            dependencies: ['All activities complete', 'Stakeholder sign-off'],
            resources: ['Project team', 'Evaluator', 'Leadership']
          }
        ];
    }

    return { plan, phases };
  };

  const copyProjectPlan = () => {
    navigator.clipboard.writeText(projectPlan);
    toast.success('Project plan copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-600" />
            Project Planner
          </CardTitle>
          <p className="text-sm text-gray-600">
            Break down complex initiatives into manageable phases and milestones
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Type</label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Timeline</label>
              <Select value={projectTimeline} onValueChange={setProjectTimeline}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timelines.map((timeline) => (
                    <SelectItem key={timeline.value} value={timeline.value}>
                      <div>
                        <div className="font-medium">{timeline.label}</div>
                        <div className="text-xs text-gray-500">{timeline.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., 'Annual Gala 2024' or 'Youth Mentorship Program Launch'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project Description</label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project goals, scope, and key stakeholders. What do you hope to achieve?"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={createProjectPlan} 
            disabled={isPlanning || !projectType || !projectName.trim() || !projectDescription.trim()}
            className="w-full"
          >
            {isPlanning ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Project Plan...
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                Generate Project Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {projectPlan && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Complete Project Plan</CardTitle>
                <Button variant="outline" size="sm" onClick={copyProjectPlan}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Plan
                </Button>
              </div>
              <Badge variant="secondary" className="w-fit">
                {projectTypes.find(t => t.value === projectType)?.label} - {timelines.find(t => t.value === projectTimeline)?.label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
                  {projectPlan}
                </pre>
              </div>
            </CardContent>
          </Card>

          {projectPhases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Project Timeline & Phases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectPhases.map((phase, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg flex items-center gap-2">
                          <Badge className="bg-indigo-600 text-white">Phase {index + 1}</Badge>
                          {phase.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Duration: {phase.duration}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Milestones</p>
                        <ul className="space-y-1">
                          {phase.milestones.map((milestone, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckSquare className="h-3 w-3 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-gray-700 mb-1">Dependencies</p>
                        <ul className="space-y-1">
                          {phase.dependencies.map((dep, i) => (
                            <li key={i} className="text-gray-600">• {dep}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Users className="h-4 w-4" />Resources
                        </p>
                        <ul className="space-y-1">
                          {phase.resources.map((resource, i) => (
                            <li key={i} className="text-gray-600">• {resource}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Next steps:</strong> Share this plan with your team, assign phase leaders, and schedule kickoff meetings. Regular check-ins ensure project stays on track.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};