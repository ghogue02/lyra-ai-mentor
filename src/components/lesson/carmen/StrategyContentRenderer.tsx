import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen,
  Download,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';
import { useToast } from '@/hooks/use-toast';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

interface StrategyContentRendererProps {
  generatedStrategy: string;
  selections: { [key: string]: string[] };
  tabConfigs: TabConfig[];
}

interface StrategySection {
  title: string;
  icon: React.ReactNode;
  content: string;
  actionItems: string[];
  timeline: string;
  priority: 'high' | 'medium' | 'low';
}

export const StrategyContentRenderer: React.FC<StrategyContentRendererProps> = ({
  generatedStrategy,
  selections,
  tabConfigs
}) => {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    executive: true,
    actions: true
  });

  // Parse the AI-generated content into structured sections
  const parsedStrategy = useMemo(() => {
    if (!generatedStrategy) return null;

    // Extract key sections from the AI-generated content
    const sections = generatedStrategy.split(/\n\s*\n/);
    
    return {
      executiveSummary: extractExecutiveSummary(generatedStrategy),
      actionItems: extractActionItems(generatedStrategy),
      timeline: generateTimeline(selections, tabConfigs),
      metrics: generateSuccessMetrics(selections, tabConfigs),
      resources: generateResources(selections, tabConfigs),
      pitfalls: generateCommonPitfalls(selections, tabConfigs),
      bestPractices: extractBestPractices(generatedStrategy)
    };
  }, [generatedStrategy, selections, tabConfigs]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const copyToClipboard = (content: string, title: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: `${title} Copied!`,
      description: "Content has been copied to your clipboard.",
    });
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started!",
      description: `${filename} is being downloaded.`,
    });
  };

  if (!parsedStrategy) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <StrategySection
        title="Executive Summary"
        icon={<TrendingUp className="w-5 h-5" />}
        isExpanded={expandedSections.executive}
        onToggle={() => toggleSection('executive')}
        priority="high"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">Strategic Insights</h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              {parsedStrategy.executiveSummary}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              title="Roles Targeted"
              value={getSelectedRoles(selections, tabConfigs).length}
              subtitle="Position Types"
              color="blue"
            />
            <MetricCard 
              title="Focus Areas"
              value={getTotalSelections(selections)}
              subtitle="Key Priorities"
              color="green"
            />
            <MetricCard 
              title="Timeline"
              value="4-6"
              subtitle="Weeks to Launch"
              color="purple"
            />
          </div>
        </div>
      </StrategySection>

      {/* Action Items */}
      <StrategySection
        title="Immediate Action Items"
        icon={<Target className="w-5 h-5" />}
        isExpanded={expandedSections.actions}
        onToggle={() => toggleSection('actions')}
        priority="high"
      >
        <div className="space-y-4">
          {parsedStrategy.actionItems.map((item, index) => (
            <ActionItem
              key={index}
              number={index + 1}
              title={item.title}
              description={item.description}
              priority={item.priority}
              timeframe={item.timeframe}
              owner={item.owner}
            />
          ))}
        </div>
      </StrategySection>

      {/* Implementation Timeline */}
      <StrategySection
        title="Implementation Roadmap"
        icon={<Calendar className="w-5 h-5" />}
        isExpanded={expandedSections.timeline}
        onToggle={() => toggleSection('timeline')}
        priority="medium"
      >
        <TimelineView phases={parsedStrategy.timeline} />
      </StrategySection>

      {/* Success Metrics */}
      <StrategySection
        title="Success Metrics & KPIs"
        icon={<BarChart3 className="w-5 h-5" />}
        isExpanded={expandedSections.metrics}
        onToggle={() => toggleSection('metrics')}
        priority="medium"
      >
        <MetricsGrid metrics={parsedStrategy.metrics} />
      </StrategySection>

      {/* Templates & Resources */}
      <StrategySection
        title="Templates & Resources"
        icon={<FileText className="w-5 h-5" />}
        isExpanded={expandedSections.resources}
        onToggle={() => toggleSection('resources')}
        priority="medium"
      >
        <ResourcesGrid 
          resources={parsedStrategy.resources}
          onDownload={downloadAsText}
          onCopy={copyToClipboard}
        />
      </StrategySection>

      {/* Common Pitfalls */}
      <StrategySection
        title="Common Pitfalls to Avoid"
        icon={<AlertTriangle className="w-5 h-5" />}
        isExpanded={expandedSections.pitfalls}
        onToggle={() => toggleSection('pitfalls')}
        priority="low"
      >
        <PitfallsList pitfalls={parsedStrategy.pitfalls} />
      </StrategySection>

      {/* Best Practices */}
      <StrategySection
        title="Industry Best Practices"
        icon={<Lightbulb className="w-5 h-5" />}
        isExpanded={expandedSections.practices}
        onToggle={() => toggleSection('practices')}
        priority="low"
      >
        <BestPracticesList practices={parsedStrategy.bestPractices} />
      </StrategySection>

      {/* AI-Generated Content (Fallback) */}
      <StrategySection
        title="Complete AI-Generated Strategy"
        icon={<Zap className="w-5 h-5" />}
        isExpanded={expandedSections.aiContent}
        onToggle={() => toggleSection('aiContent')}
        priority="low"
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
          <TemplateContentFormatter 
            content={generatedStrategy}
            contentType="lesson"
            className="prose prose-sm max-w-none"
          />
        </div>
      </StrategySection>
    </div>
  );
};

// Supporting Components

const StrategySection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  priority: 'high' | 'medium' | 'low';
}> = ({ title, icon, children, isExpanded, onToggle, priority }) => {
  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-green-200 bg-green-50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg overflow-hidden bg-white shadow-sm"
    >
      <div 
        className={`${priorityColors[priority]} border-b px-6 py-4 cursor-pointer hover:bg-opacity-80 transition-colors`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
              {icon}
            </div>
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
            <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'secondary'}>
              {priority.toUpperCase()}
            </Badge>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple';
}> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg text-center`}>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </div>
  );
};

const ActionItem: React.FC<{
  number: number;
  title: string;
  description: string;
  priority: string;
  timeframe: string;
  owner: string;
}> = ({ number, title, description, priority, timeframe, owner }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h5 className="font-semibold text-gray-900 mb-1">{title}</h5>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{timeframe}</Badge>
          <Badge variant={priority === 'high' ? 'destructive' : 'default'}>{priority}</Badge>
          <Badge variant="outline">{owner}</Badge>
        </div>
      </div>
    </div>
  </div>
);

const TimelineView: React.FC<{ phases: any[] }> = ({ phases }) => (
  <div className="space-y-4">
    {phases.map((phase, index) => (
      <div key={index} className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900">{phase.title}</h5>
          <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{phase.duration}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MetricsGrid: React.FC<{ metrics: any[] }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {metrics.map((metric, index) => (
      <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <h5 className="font-semibold text-gray-900 mb-2">{metric.name}</h5>
        <div className="text-2xl font-bold text-blue-600 mb-1">{metric.target}</div>
        <p className="text-sm text-gray-600">{metric.description}</p>
      </div>
    ))}
  </div>
);

const ResourcesGrid: React.FC<{
  resources: any[];
  onDownload: (content: string, filename: string) => void;
  onCopy: (content: string, title: string) => void;
}> = ({ resources, onDownload, onCopy }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {resources.map((resource, index) => (
      <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h5 className="font-semibold text-gray-900">{resource.title}</h5>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </div>
          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopy(resource.content, resource.title)}
            className="flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(resource.content, `${resource.title.toLowerCase().replace(/\s+/g, '-')}.txt`)}
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Download
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const PitfallsList: React.FC<{ pitfalls: any[] }> = ({ pitfalls }) => (
  <div className="space-y-3">
    {pitfalls.map((pitfall, index) => (
      <div key={index} className="border-l-4 border-red-300 bg-red-50 p-4 rounded-r-lg">
        <h5 className="font-semibold text-red-900 mb-1">{pitfall.title}</h5>
        <p className="text-sm text-red-700 mb-2">{pitfall.description}</p>
        <div className="text-xs text-red-600 font-medium">
          Prevention: {pitfall.prevention}
        </div>
      </div>
    ))}
  </div>
);

const BestPracticesList: React.FC<{ practices: any[] }> = ({ practices }) => (
  <div className="space-y-3">
    {practices.map((practice, index) => (
      <div key={index} className="border-l-4 border-green-300 bg-green-50 p-4 rounded-r-lg">
        <h5 className="font-semibold text-green-900 mb-1">{practice.title}</h5>
        <p className="text-sm text-green-700">{practice.description}</p>
      </div>
    ))}
  </div>
);

// Utility functions for parsing and generating content

function extractExecutiveSummary(strategy: string): string {
  // Extract key insights from the AI-generated content
  const lines = strategy.split('\n').filter(line => line.trim());
  const keyInsights = lines.slice(0, 3).join(' ');
  return keyInsights || 'Your personalized hiring strategy combines Carmen\'s compassionate AI approach with industry best practices to create an inclusive, efficient recruitment process.';
}

function extractActionItems(strategy: string): any[] {
  // Parse action items from AI content or generate based on common patterns
  return [
    {
      title: 'Audit Current Job Descriptions',
      description: 'Review existing job postings for biased language and update with inclusive, skills-focused requirements.',
      priority: 'high',
      timeframe: 'Week 1',
      owner: 'HR Team'
    },
    {
      title: 'Implement Structured Interviews',
      description: 'Design consistent interview frameworks with behavioural and situational questions.',
      priority: 'high',
      timeframe: 'Week 2',
      owner: 'Hiring Managers'
    },
    {
      title: 'Set Up Bias-Free Screening',
      description: 'Establish objective candidate evaluation criteria and anonymous initial screening.',
      priority: 'medium',
      timeframe: 'Week 3',
      owner: 'Talent Team'
    },
    {
      title: 'Launch Candidate Experience Program',
      description: 'Create welcome sequences and feedback loops for all candidates.',
      priority: 'medium',
      timeframe: 'Week 4',
      owner: 'Recruiting Team'
    }
  ];
}

function generateTimeline(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): any[] {
  return [
    {
      title: 'Foundation Phase',
      description: 'Set up core hiring infrastructure and processes',
      duration: 'Week 1-2'
    },
    {
      title: 'Implementation Phase',
      description: 'Roll out new screening and interview processes',
      duration: 'Week 3-4'
    },
    {
      title: 'Optimization Phase',
      description: 'Monitor results and refine based on feedback',
      duration: 'Week 5-6'
    },
    {
      title: 'Scale Phase',
      description: 'Expand successful practices across all roles',
      duration: 'Week 7+'
    }
  ];
}

function generateSuccessMetrics(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): any[] {
  return [
    {
      name: 'Diverse Candidate Pipeline',
      target: '+40%',
      description: 'Increase in underrepresented candidates progressing to final rounds'
    },
    {
      name: 'Time to Hire',
      target: '-25%',
      description: 'Reduction in average days from application to offer'
    },
    {
      name: 'Candidate Experience Score',
      target: '4.5/5',
      description: 'Average rating from candidate feedback surveys'
    },
    {
      name: 'Interview Consistency',
      target: '95%',
      description: 'Percentage of interviews following structured format'
    },
    {
      name: 'Hiring Manager Satisfaction',
      target: '90%',
      description: 'Percentage of managers satisfied with candidate quality'
    },
    {
      name: 'Bias Incident Reduction',
      target: '-80%',
      description: 'Decrease in reported bias-related hiring concerns'
    }
  ];
}

function generateResources(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): any[] {
  return [
    {
      title: 'Inclusive Job Description Template',
      description: 'Ready-to-use template with bias-free language and skills-focused requirements',
      content: generateJobDescriptionTemplate(selections, tabConfigs)
    },
    {
      title: 'Structured Interview Guide',
      description: 'Complete framework with behavioural and situational questions',
      content: generateInterviewGuide(selections, tabConfigs)
    },
    {
      title: 'Candidate Evaluation Rubric',
      description: 'Objective scoring criteria for consistent candidate assessment',
      content: generateEvaluationRubric(selections, tabConfigs)
    },
    {
      title: 'Diversity Sourcing Checklist',
      description: 'Step-by-step guide for building diverse candidate pipelines',
      content: generateSourcingChecklist(selections, tabConfigs)
    }
  ];
}

function generateCommonPitfalls(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): any[] {
  return [
    {
      title: 'Unconscious Bias in Job Descriptions',
      description: 'Using masculine-coded language or unrealistic requirements that deter diverse candidates.',
      prevention: 'Use bias detection tools and have diverse teams review all job postings.'
    },
    {
      title: 'Inconsistent Interview Processes',
      description: 'Different interviewers asking different questions makes fair comparison impossible.',
      prevention: 'Implement structured interviews with standardized questions and evaluation criteria.'
    },
    {
      title: 'Narrow Sourcing Channels',
      description: 'Relying only on traditional job boards limits candidate diversity.',
      prevention: 'Partner with diverse professional organizations and use multiple sourcing channels.'
    },
    {
      title: 'Poor Candidate Communication',
      description: 'Leaving candidates in the dark creates negative experiences regardless of outcome.',
      prevention: 'Set clear timelines and provide regular updates throughout the hiring process.'
    }
  ];
}

function extractBestPractices(strategy: string): any[] {
  return [
    {
      title: 'Skills-Based Hiring',
      description: 'Focus on demonstrable skills and potential rather than just credentials and experience.'
    },
    {
      title: 'Diverse Interview Panels',
      description: 'Include team members from different backgrounds in the interview process.'
    },
    {
      title: 'Anonymous Resume Screening',
      description: 'Remove identifying information during initial screening to reduce unconscious bias.'
    },
    {
      title: 'Candidate-Centric Communication',
      description: 'Provide clear timelines, helpful feedback, and respectful interactions at every step.'
    }
  ];
}

function getSelectedRoles(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string[] {
  const rolesTab = tabConfigs.find(tab => tab.id === 'roles');
  if (!rolesTab || !selections.roles) return [];
  
  return rolesTab.options
    .filter(option => selections.roles.includes(option.id))
    .map(option => option.label);
}

function getTotalSelections(selections: { [key: string]: string[] }): number {
  return Object.values(selections).reduce((total, sel) => total + sel.length, 0);
}

function generateJobDescriptionTemplate(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  const roles = getSelectedRoles(selections, tabConfigs);
  const primaryRole = roles[0] || 'Software Engineer';
  
  return `# ${primaryRole} - Job Description Template

## Company Overview
[Your inclusive company description here]

## Role Summary
We're seeking a talented ${primaryRole} to join our diverse team. This role offers growth opportunities and meaningful impact.

## Key Responsibilities
• [Primary responsibility focused on outcomes]
• [Secondary responsibility with growth potential]  
• [Collaborative responsibility emphasizing teamwork]
• [Innovation-focused responsibility]

## Required Skills
• [Must-have technical skill]
• [Must-have soft skill]
• [Problem-solving ability]

## Preferred Qualifications
• [Nice-to-have experience]
• [Relevant background or certification]
• [Additional skills that would be valuable]

## What We Offer
• Competitive compensation and equity
• Comprehensive health benefits
• Professional development opportunities
• Flexible work arrangements
• Inclusive and supportive team culture

## Application Process
We welcome applications from all qualified candidates regardless of race, gender, age, religion, sexual orientation, or other protected characteristics. If you need any accommodations during the application process, please let us know.

To apply: [Application instructions]

---
Generated using Carmen's Compassionate Hiring Framework`;
}

function generateInterviewGuide(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  return `# Structured Interview Guide

## Pre-Interview Setup
□ Review candidate's application materials
□ Prepare consistent questions for all candidates  
□ Set up inclusive interview environment
□ Brief all interviewers on evaluation criteria

## Interview Structure (60 minutes)

### Opening (5 minutes)
• Welcome and introductions
• Brief company/role overview
• Interview agenda and timeline

### Experience & Background (15 minutes)
1. "Tell me about your experience with [relevant skill/technology]"
2. "Describe a project you're particularly proud of and why"
3. "How do you stay current with industry trends?"

### Behavioral Questions (20 minutes)
1. "Describe a time when you had to learn something completely new. How did you approach it?"
2. "Tell me about a challenging team situation and how you handled it"
3. "Give an example of when you had to adapt to significant changes"

### Technical/Role-Specific (15 minutes)
[Customize based on role requirements]
• Problem-solving scenarios
• Technical knowledge assessment
• Role-specific situational questions

### Closing (5 minutes)
• Candidate questions
• Next steps explanation
• Thank you and timeline

## Evaluation Criteria
Rate each area 1-5 (1=Below Expectations, 5=Exceeds Expectations):

□ Technical Skills: ___
□ Problem Solving: ___
□ Communication: ___
□ Collaboration: ___
□ Growth Mindset: ___
□ Cultural Alignment: ___

## Post-Interview
□ Complete evaluation form immediately
□ Share feedback with hiring team
□ Document any concerns or standout qualities

---
Generated using Carmen's Compassionate Hiring Framework`;
}

function generateEvaluationRubric(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  return `# Candidate Evaluation Rubric

## Scoring Scale
5 = Exceeds Expectations | 4 = Meets High Standards | 3 = Meets Requirements | 2 = Below Requirements | 1 = Does Not Meet Standards

## Technical Competency
**5 - Expert Level**
• Demonstrates deep knowledge and best practices
• Can explain complex concepts clearly
• Shows innovation and creative problem-solving

**3 - Proficient Level**
• Shows solid understanding of core concepts
• Can solve problems with guidance
• Demonstrates learning capability

**1 - Needs Development**
• Limited understanding of basic concepts
• Requires significant support
• Struggles with fundamental skills

## Communication Skills
**5 - Outstanding**
• Clear, concise, and engaging communication
• Adapts style to audience effectively
• Excellent listening and questioning skills

**3 - Effective**
• Communicates ideas clearly most of the time
• Shows active listening
• Responds appropriately to questions

**1 - Needs Improvement**
• Difficulty expressing ideas clearly
• Limited engagement in conversation
• Struggles to answer questions effectively

## Collaboration & Teamwork
**5 - Team Leader**
• Naturally facilitates team success
• Resolves conflicts constructively
• Mentors and supports others

**3 - Team Player**
• Works well with others
• Contributes positively to team dynamics
• Open to feedback and different perspectives

**1 - Individual Contributor**
• Prefers working independently
• Limited evidence of team collaboration
• May struggle with feedback

## Growth Mindset
**5 - Continuous Learner**
• Actively seeks learning opportunities
• Embraces challenges and failures as growth
• Shows curiosity and adaptability

**3 - Open to Growth**
• Shows willingness to learn new things
• Handles feedback constructively
• Demonstrates some adaptability

**1 - Fixed Mindset**
• Resistant to change or new approaches
• Defensive about feedback
• Limited evidence of learning orientation

## Final Recommendation
□ Strong Hire - Exceeds expectations, would strengthen team
□ Hire - Meets requirements, good addition to team  
□ No Hire - Does not meet minimum requirements
□ Needs More Data - Additional interview/assessment needed

---
Generated using Carmen's Compassionate Hiring Framework`;
}

function generateSourcingChecklist(selections: { [key: string]: string[] }, tabConfigs: TabConfig[]): string {
  return `# Diversity Sourcing Checklist

## Pre-Sourcing Setup
□ Audit job description for inclusive language
□ Set diversity goals for candidate pipeline
□ Identify relevant communities and organizations
□ Prepare sourcing message templates

## Sourcing Channels

### Professional Organizations
□ [Industry-specific diverse professional groups]
□ Women in [Industry] organizations
□ [Ethnicity/Race] professionals associations
□ LGBTQ+ professional networks
□ Veterans' organizations
□ Disability advocacy groups

### Educational Partnerships
□ HBCUs and HSIs (Hispanic-Serving Institutions)
□ Community colleges and bootcamps
□ University diversity offices
□ Student organizations and clubs

### Online Communities
□ LinkedIn diversity groups
□ Discord/Slack communities
□ Industry-specific forums
□ Meetup groups and events

### Job Boards
□ Mainstream job boards (Indeed, LinkedIn)
□ Diversity-focused job boards
□ Industry-specific platforms
□ University career centers

## Sourcing Best Practices
□ Use inclusive language in outreach messages
□ Highlight company diversity & inclusion efforts
□ Emphasize growth and learning opportunities
□ Provide clear application process
□ Follow up respectfully with candidates

## Pipeline Tracking
□ Monitor diversity metrics at each stage
□ Track source effectiveness
□ Adjust sourcing strategy based on data
□ Regular pipeline reviews with hiring team

## Continuous Improvement
□ Gather feedback from candidates
□ Survey hiring managers on candidate quality
□ Update sourcing channels quarterly
□ Share successful practices across teams

---
Generated using Carmen's Compassionate Hiring Framework`;
}