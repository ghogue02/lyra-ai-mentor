import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  Users,
  FileText,
  BarChart3,
  Calendar,
  Download,
  Copy,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface StrategyContentRendererCompactProps {
  generatedStrategy: string;
  selections: { [key: string]: string[] };
  tabConfigs: TabConfig[];
}

export const StrategyContentRendererCompact: React.FC<StrategyContentRendererCompactProps> = ({
  generatedStrategy,
  selections,
  tabConfigs
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('roadmap');

  const strategySummary = {
    executiveSummary: extractExecutiveSummary(generatedStrategy),
    actionItems: generateActionItems(),
    rolesTargeted: getSelectedRoles(selections, tabConfigs).length || 2,
    focusAreas: getTotalSelections(selections),
    timeline: '4-6 weeks'
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

  return (
    <div className="space-y-6">
      {/* Executive Summary - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nm-card p-6 bg-gradient-to-br from-purple-50 to-cyan-50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="nm-icon w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Strategic Insights</h3>
            <Badge className="nm-badge-primary text-xs">High Priority</Badge>
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-6">
          {strategySummary.executiveSummary}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <NeomorphicMetricCard 
            value={strategySummary.rolesTargeted}
            label="Roles Targeted"
            subtitle="Position Types"
            color="purple"
            icon={<Users className="w-4 h-4" />}
          />
          <NeomorphicMetricCard 
            value={strategySummary.focusAreas}
            label="Focus Areas"
            subtitle="Key Priorities"
            color="green"
            icon={<Target className="w-4 h-4" />}
          />
          <NeomorphicMetricCard 
            value={strategySummary.timeline}
            label="Timeline"
            subtitle="To Launch"
            color="blue"
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </motion.div>

      {/* Immediate Action Items - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="nm-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="nm-icon w-10 h-10 bg-gradient-to-br from-red-100 to-red-200">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Immediate Action Items</h3>
              <Badge variant="destructive" className="text-xs">High Priority</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategySummary.actionItems.map((item, index) => (
            <NeomorphicActionCard
              key={index}
              number={index + 1}
              title={item.title}
              description={item.description}
              timeframe={item.timeframe}
              priority={item.priority}
            />
          ))}
        </div>
      </motion.div>

      {/* Detailed Implementation - Tabbed Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="nm-card p-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 nm-nav p-1">
            <TabsTrigger value="roadmap" className="nm-tab data-[state=active]:nm-tab-active">
              <Calendar className="w-4 h-4 mr-2" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="metrics" className="nm-tab data-[state=active]:nm-tab-active">
              <BarChart3 className="w-4 h-4 mr-2" />
              Success Metrics
            </TabsTrigger>
            <TabsTrigger value="resources" className="nm-tab data-[state=active]:nm-tab-active">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="mt-6 space-y-4">
            <CompactTimelineView />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <CompactMetricsGrid />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <CompactResourcesGrid 
              onDownload={downloadAsText}
              onCopy={copyToClipboard}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="nm-card p-4 bg-gradient-to-r from-purple-50 to-cyan-50"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          <CompactActionCard
            icon={<Copy className="w-4 h-4" />}
            label="Copy Strategy"
            onClick={() => copyToClipboard(generatedStrategy, "Strategy")}
          />
          <CompactActionCard
            icon={<Download className="w-4 h-4" />}
            label="Download PDF"
            onClick={() => downloadAsText(generatedStrategy, "hiring-strategy.txt")}
          />
          <CompactActionCard
            icon={<Calendar className="w-4 h-4" />}
            label="Schedule Follow-up"
            onClick={() => window.open('#', '_blank')}
          />
          <CompactActionCard
            icon={<BookOpen className="w-4 h-4" />}
            label="View Resources"
            onClick={() => window.open('https://lyra-ai.com/resources', '_blank')}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Supporting Components

const NeomorphicMetricCard: React.FC<{
  value: string | number;
  label: string;
  subtitle: string;
  color: 'purple' | 'green' | 'blue';
  icon: React.ReactNode;
}> = ({ value, label, subtitle, color, icon }) => {
  const colorClasses = {
    purple: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800',
    green: 'bg-gradient-to-br from-green-100 to-green-200 text-green-800',
    blue: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800'
  };

  return (
    <div className={`nm-card-inset p-4 text-center ${colorClasses[color]} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-center mb-2">
        {icon}
        <span className="ml-2 text-2xl font-bold">{value}</span>
      </div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </div>
  );
};

const NeomorphicActionCard: React.FC<{
  number: number;
  title: string;
  description: string;
  timeframe: string;
  priority: string;
}> = ({ number, title, description, timeframe, priority }) => (
  <div className="nm-card-flat p-4 hover:nm-card-hover transition-all duration-300">
    <div className="flex items-start gap-3">
      <div className="nm-icon w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h5 className="font-semibold text-gray-900 mb-1">{title}</h5>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="nm-badge text-xs">{timeframe}</Badge>
          <Badge variant={priority === 'high' ? 'destructive' : 'default'} className="nm-badge text-xs">
            {priority}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

const CompactActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="nm-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
  >
    {icon}
    {label}
  </button>
);

const CompactTimelineView: React.FC = () => (
  <div className="space-y-4">
    {[
      {
        phase: 'Foundation',
        duration: 'Week 1-2',
        tasks: ['Job description audit', 'Interview framework setup', 'Team training'],
        color: 'blue'
      },
      {
        phase: 'Implementation', 
        duration: 'Week 3-4',
        tasks: ['Launch new processes', 'Begin structured interviews', 'Monitor pipeline'],
        color: 'green'
      },
      {
        phase: 'Optimization',
        duration: 'Week 5-6', 
        tasks: ['Analyze results', 'Gather feedback', 'Refine processes'],
        color: 'purple'
      }
    ].map((phase, index) => (
      <div key={index} className="nm-card-flat p-4">
        <div className="flex items-start gap-4">
          <div className={`nm-icon w-10 h-10 bg-gradient-to-br from-${phase.color}-100 to-${phase.color}-200 text-${phase.color}-600 font-bold`}>
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h5 className="font-semibold text-gray-900">{phase.phase}</h5>
              <Badge className="nm-badge-secondary text-xs">{phase.duration}</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {phase.tasks.map((task, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {task}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CompactMetricsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { name: 'Diverse Pipeline Growth', target: '+40%', description: 'Increase in underrepresented candidates' },
      { name: 'Time to Hire Reduction', target: '-25%', description: 'Days from application to offer' },
      { name: 'Candidate Experience', target: '4.5/5', description: 'Average satisfaction rating' },
      { name: 'Interview Consistency', target: '95%', description: 'Following structured format' }
    ].map((metric, index) => (
      <div key={index} className="nm-card-inset p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-2xl font-bold text-blue-600 mb-1">{metric.target}</div>
        <h5 className="font-semibold text-gray-900 mb-1">{metric.name}</h5>
        <p className="text-sm text-gray-600">{metric.description}</p>
      </div>
    ))}
  </div>
);

const CompactResourcesGrid: React.FC<{
  onDownload: (content: string, filename: string) => void;
  onCopy: (content: string, title: string) => void;
}> = ({ onDownload, onCopy }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      {
        title: 'Job Description Template',
        description: 'Bias-free template with inclusive language',
        content: 'Sample job description content...'
      },
      {
        title: 'Interview Guide',
        description: 'Structured behavioral interview framework',
        content: 'Sample interview guide content...'
      },
      {
        title: 'Evaluation Rubric',
        description: 'Objective candidate assessment criteria',
        content: 'Sample rubric content...'
      },
      {
        title: 'Sourcing Checklist',
        description: 'Diversity sourcing best practices',
        content: 'Sample checklist content...'
      }
    ].map((resource, index) => (
      <div key={index} className="nm-card-flat p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
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
            className="nm-button text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(resource.content, `${resource.title.toLowerCase().replace(/\s+/g, '-')}.txt`)}
            className="nm-button-primary text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Get
          </Button>
        </div>
      </div>
    ))}
  </div>
);

// Utility functions

function extractExecutiveSummary(strategy: string): string {
  const lines = strategy.split('\n').filter(line => line.trim());
  const keyInsights = lines.slice(0, 2).join(' ');
  return keyInsights || 'Your personalized hiring strategy combines Carmen\'s compassionate AI approach with industry best practices to create an inclusive, efficient recruitment process that reduces bias while attracting top talent.';
}

function generateActionItems() {
  return [
    {
      title: 'Audit Job Descriptions',
      description: 'Review for biased language and update with inclusive requirements.',
      priority: 'high',
      timeframe: 'Week 1'
    },
    {
      title: 'Implement Structured Interviews',
      description: 'Design consistent frameworks with behavioral questions.',
      priority: 'high', 
      timeframe: 'Week 2'
    },
    {
      title: 'Set Up Bias-Free Screening',
      description: 'Establish objective evaluation criteria and anonymous screening.',
      priority: 'medium',
      timeframe: 'Week 3'
    },
    {
      title: 'Launch Candidate Experience Program',
      description: 'Create welcome sequences and feedback loops.',
      priority: 'medium',
      timeframe: 'Week 4'
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