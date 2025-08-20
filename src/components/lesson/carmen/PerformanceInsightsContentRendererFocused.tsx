import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Shield,
  Heart,
  CheckCircle,
  Copy,
  Share2,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface PerformanceInsightsContentRendererFocusedProps {
  generatedStrategy: string;
  selections: { [key: string]: string[] };
  tabConfigs: TabConfig[];
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  steps: string[];
  deliverables: string[];
  tips: string[];
}

export const PerformanceInsightsContentRendererFocused: React.FC<PerformanceInsightsContentRendererFocusedProps> = ({
  generatedStrategy,
  selections,
  tabConfigs
}) => {
  const { toast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const strategySummary = extractExecutiveSummary(generatedStrategy);
  const actionItems = generatePerformanceActionItems();

  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const copyStrategy = async () => {
    const formattedStrategy = formatStrategyForCopy(generatedStrategy, actionItems);
    await navigator.clipboard.writeText(formattedStrategy);
    toast({
      title: "Performance Strategy Copied!",
      description: "Your performance management framework has been copied to clipboard.",
    });
  };

  const shareStrategy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI-Generated Performance Management Strategy',
          text: 'Check out this personalized performance framework created with Carmen\'s AI approach',
          url: window.location.href,
        });
        toast({
          title: "Shared Successfully!",
          description: "Your performance strategy has been shared.",
        });
      } catch (error) {
        await copyStrategy(); // Fallback to copy
      }
    } else {
      await copyStrategy(); // Fallback for browsers without share API
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategic Insights - Simplified */}
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
            <h3 className="text-xl font-bold text-gray-900">Your Performance Management Strategy</h3>
            <p className="text-sm text-gray-600">Actionable steps to transform performance conversations</p>
          </div>
        </div>
        
        <div className="text-gray-700 leading-relaxed space-y-4">
          {strategySummary.split('\\n\\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Action Items - Expandable Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Implementation Roadmap</h3>
          <Badge variant="secondary" className="text-xs">
            Execute at your own pace
          </Badge>
        </div>

        {actionItems.map((item, index) => (
          <ExpandableActionCard
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedItem === item.id}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </motion.div>

      {/* Simplified Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="nm-card p-6 bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-4">Take Action</h4>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <ActionButton
              icon={<Copy className="w-4 h-4" />}
              label="Copy Framework"
              onClick={copyStrategy}
              variant="outline"
            />
            <ActionButton
              icon={<Share2 className="w-4 h-4" />}
              label="Share"
              onClick={shareStrategy}
              variant="outline"
            />
          </div>
          
          <div className="text-xs text-gray-500 mb-4">
            💡 Pro tip: Start with any action item that addresses your biggest performance challenge
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Supporting Components

const ExpandableActionCard: React.FC<{
  item: ActionItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ item, index, isExpanded, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="nm-card overflow-hidden"
  >
    <button
      onClick={onToggle}
      className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`nm-icon w-12 h-12 ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Click to expand
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 bg-gray-50"
        >
          <div className="p-6 space-y-6">
            {/* Steps */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Implementation Steps
              </h5>
              <ul className="space-y-2">
                {item.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold mt-0.5 flex-shrink-0">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Expected Outcomes
              </h5>
              <ul className="space-y-1">
                {item.deliverables.map((deliverable, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                Pro Tips
              </h5>
              <ul className="space-y-1">
                {item.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'default';
}> = ({ icon, label, onClick, variant = 'outline' }) => (
  <Button
    variant={variant}
    onClick={onClick}
    className="nm-button flex items-center gap-2 text-sm"
  >
    {icon}
    {label}
  </Button>
);

// Utility Functions

function extractExecutiveSummary(strategy: string): string {
  // Split by double newlines for proper paragraphs, fallback to single newlines
  const paragraphs = strategy.includes('\\n\\n') 
    ? strategy.split('\\n\\n').filter(p => p.trim())
    : strategy.split('\\n').filter(p => p.trim());
  
  if (paragraphs.length === 0) {
    throw new Error('No strategy content generated - AI response was empty');
  }
  
  // Return the full strategy content, properly formatted
  return paragraphs.join('\\n\\n');
}

function generatePerformanceActionItems(): ActionItem[] {
  return [
    {
      id: 'establish-clear-expectations',
      title: 'Establish Clear Performance Expectations',
      description: 'Create transparent, objective criteria for success in each role',
      icon: <Target className="w-6 h-6 text-blue-600" />,
      color: 'bg-gradient-to-br from-blue-100 to-blue-200',
      steps: [
        'Define specific, measurable goals for each team member',
        'Document role responsibilities and success metrics',
        'Create performance rubrics with clear evaluation criteria',
        'Communicate expectations during onboarding and regular check-ins',
        'Ensure goals align with team and organizational objectives',
        'Review and update expectations quarterly'
      ],
      deliverables: [
        'Written performance expectations for each role',
        'Clear success metrics and evaluation criteria',
        'Goal alignment documentation',
        'Performance rubric templates'
      ],
      tips: [
        'Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)',
        'Involve team members in setting their own performance targets',
        'Document expectations to avoid miscommunication later'
      ]
    },
    {
      id: 'implement-regular-feedback',
      title: 'Implement Regular Feedback Cycles',
      description: 'Move beyond annual reviews to continuous performance conversations',
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      color: 'bg-gradient-to-br from-green-100 to-green-200',
      steps: [
        'Schedule weekly or bi-weekly one-on-one meetings',
        'Create structured feedback templates and conversation guides',
        'Train managers on effective feedback delivery techniques',
        'Implement 360-degree feedback processes',
        'Set up peer recognition and feedback systems',
        'Document feedback discussions and action items'
      ],
      deliverables: [
        'Regular feedback meeting schedule',
        'Feedback conversation templates',
        'Manager training on feedback skills',
        '360-degree feedback system'
      ],
      tips: [
        'Focus on specific behaviors and outcomes, not personality traits',
        'Balance constructive feedback with recognition of strengths',
        'Ask for feedback from team members about your management style'
      ]
    },
    {
      id: 'eliminate-bias',
      title: 'Eliminate Bias in Performance Evaluations',
      description: 'Implement objective, data-driven performance assessment methods',
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-100 to-purple-200',
      steps: [
        'Use standardized evaluation criteria across all team members',
        'Implement multi-rater feedback systems',
        'Focus on concrete achievements and measurable outcomes',
        'Provide unconscious bias training for all managers',
        'Review performance data for patterns that might indicate bias',
        'Create calibration sessions with other managers'
      ],
      deliverables: [
        'Standardized evaluation frameworks',
        'Bias training materials and sessions',
        'Multi-rater feedback processes',
        'Performance data analysis reports'
      ],
      tips: [
        'Use concrete examples and data points in evaluations',
        'Avoid comparing team members to each other',
        'Consider cultural and communication style differences'
      ]
    },
    {
      id: 'create-development-plans',
      title: 'Create Personalized Development Plans',
      description: 'Design growth pathways that align individual aspirations with business needs',
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'bg-gradient-to-br from-orange-100 to-orange-200',
      steps: [
        'Conduct career aspiration conversations with each team member',
        'Identify skill gaps and development opportunities',
        'Create individual learning and development plans',
        'Connect team members with mentors and learning resources',
        'Set up stretch assignments and project opportunities',
        'Track progress on development goals regularly'
      ],
      deliverables: [
        'Individual development plans for each team member',
        'Mentorship program structure',
        'Learning resource library',
        'Progress tracking system'
      ],
      tips: [
        'Align development plans with career aspirations and business needs',
        'Provide both formal training and on-the-job learning opportunities',
        'Celebrate progress and achievements along the development journey'
      ]
    },
    {
      id: 'build-recognition-systems',
      title: 'Build Meaningful Recognition Systems',
      description: 'Create formal and informal ways to celebrate achievements and contributions',
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      steps: [
        'Establish both formal and informal recognition programs',
        'Create peer-to-peer recognition platforms',
        'Tie recognition to specific performance criteria',
        'Ensure recognition is timely, specific, and meaningful',
        'Celebrate both individual and team achievements',
        'Track and analyze recognition patterns for equity'
      ],
      deliverables: [
        'Formal recognition program guidelines',
        'Peer recognition platform',
        'Achievement celebration processes',
        'Recognition equity analysis reports'
      ],
      tips: [
        'Make recognition specific to the achievement and its impact',
        'Ensure recognition is timely - celebrate wins as they happen',
        'Consider different recognition preferences (public vs private, monetary vs non-monetary)'
      ]
    }
  ];
}

function formatStrategyForCopy(strategy: string, actionItems: ActionItem[]): string {
  return `PERFORMANCE MANAGEMENT STRATEGY - Generated by Carmen's AI
${'='.repeat(60)}

EXECUTIVE SUMMARY
${strategy.split('\\n').slice(0, 3).join('\\n')}

IMPLEMENTATION ROADMAP
${actionItems.map((item, i) => `
${i + 1}. ${item.title}
   ${item.description}
   
   Steps:
${item.steps.map(step => `   - ${step}`).join('\\n')}
   
   Expected Outcomes:
${item.deliverables.map(deliverable => `   - ${deliverable}`).join('\\n')}
`).join('\\n')}

Generated with Carmen's Empathetic Performance Management Framework
© ${new Date().getFullYear()} Lyra AI`;
}