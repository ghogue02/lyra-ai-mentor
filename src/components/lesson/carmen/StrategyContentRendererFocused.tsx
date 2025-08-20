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
  Download,
  Copy,
  Share2,
  FileSpreadsheet,
  FileText
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

interface StrategyContentRendererFocusedProps {
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

export const StrategyContentRendererFocused: React.FC<StrategyContentRendererFocusedProps> = ({
  generatedStrategy,
  selections,
  tabConfigs
}) => {
  const { toast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const strategySummary = extractExecutiveSummary(generatedStrategy);
  const actionItems = generateEnhancedActionItems();

  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const copyStrategy = async () => {
    const formattedStrategy = formatStrategyForCopy(generatedStrategy, actionItems);
    await navigator.clipboard.writeText(formattedStrategy);
    toast({
      title: "Strategy Copied!",
      description: "Your hiring strategy has been copied to clipboard.",
    });
  };

  const downloadPDF = () => {
    // Generate proper PDF content
    const pdfContent = generatePDFContent(generatedStrategy, actionItems);
    // For now, create a rich text document that can be easily converted to PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carmen-hiring-strategy.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Strategy Downloaded!",
      description: "Your strategy has been downloaded as a formatted document.",
    });
  };

  const downloadSpreadsheet = () => {
    // Generate CSV content for spreadsheet
    const csvContent = generateCSVContent(actionItems);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiring-action-plan.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Action Plan Downloaded!",
      description: "Your action plan has been downloaded as a spreadsheet.",
    });
  };

  const shareStrategy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI-Generated Hiring Strategy',
          text: 'Check out this personalized hiring strategy created with Carmen\'s AI framework',
          url: window.location.href,
        });
        toast({
          title: "Shared Successfully!",
          description: "Your strategy has been shared.",
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
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Hiring Strategy</h3>
            <p className="text-sm text-gray-600">Actionable steps to transform your hiring process</p>
          </div>
        </div>
        
        <div className="text-gray-700 leading-relaxed space-y-4">
          {strategySummary.split('\n\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
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
          <h3 className="text-xl font-bold text-gray-900">Action Items</h3>
          <Badge variant="secondary" className="text-xs">
            Implement at your own pace
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
              label="Copy Strategy"
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
            💡 Pro tip: Start with any action item that makes the most sense for your team
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
  const paragraphs = strategy.includes('\n\n') 
    ? strategy.split('\n\n').filter(p => p.trim())
    : strategy.split('\n').filter(p => p.trim());
  
  if (paragraphs.length === 0) {
    throw new Error('No strategy content generated - AI response was empty');
  }
  
  // Return the full strategy content, properly formatted
  return paragraphs.join('\n\n');
}

function generateEnhancedActionItems(): ActionItem[] {
  return [
    {
      id: 'audit-descriptions',
      title: 'Audit Job Descriptions',
      description: 'Review and update job postings to remove bias and attract diverse candidates',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      color: 'bg-gradient-to-br from-blue-100 to-blue-200',
      steps: [
        'Gather all current job descriptions for your open roles',
        'Use bias detection tools (like Textio) to identify problematic language',
        'Remove gendered language, unnecessary requirements, and jargon',
        'Focus on skills and outcomes rather than years of experience',
        'Add inclusive language and highlight company culture',
        'Test revised descriptions with diverse team members'
      ],
      deliverables: [
        'Bias-free job descriptions for all open roles',
        'Template for future job postings',
        'Documentation of changes made and rationale'
      ],
      tips: [
        'Use "you will" instead of "you must" to sound more welcoming',
        'Replace "rockstar" or "ninja" with specific skill requirements',
        'Include salary ranges and benefits to increase transparency'
      ]
    },
    {
      id: 'structured-interviews',
      title: 'Implement Structured Interviews',
      description: 'Create consistent interview frameworks to ensure fair candidate evaluation',
      icon: <Users className="w-6 h-6 text-green-600" />,
      color: 'bg-gradient-to-br from-green-100 to-green-200',
      steps: [
        'Define core competencies needed for each role',
        'Create behavioral interview questions for each competency',
        'Develop scoring rubrics for consistent evaluation',
        'Train interviewers on the new process',
        'Create interview guides with question banks',
        'Establish interview panel diversity requirements'
      ],
      deliverables: [
        'Structured interview guides for each role',
        'Scoring rubrics and evaluation forms',
        'Trained interviewer team',
        'Interview process documentation'
      ],
      tips: [
        'Ask the same core questions to all candidates for fair comparison',
        'Include behavioral questions that reveal values alignment',
        'Have diverse interview panels to reduce individual bias'
      ]
    },
    {
      id: 'bias-free-screening',
      title: 'Set Up Bias-Free Screening',
      description: 'Establish objective criteria for initial candidate evaluation',
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-100 to-purple-200',
      steps: [
        'Define minimum qualifications vs. preferred qualifications',
        'Create anonymous resume review process',
        'Establish skills-based screening criteria',
        'Remove identifying information during initial screening',
        'Use diverse screening committee',
        'Document screening decisions and rationale'
      ],
      deliverables: [
        'Clear screening criteria documentation',
        'Anonymous review process',
        'Screening committee training materials',
        'Decision tracking system'
      ],
      tips: [
        'Focus on what candidates can do, not where they went to school',
        'Use blind resume reviews to reduce unconscious bias',
        'Track where candidates drop off to identify potential bias points'
      ]
    },
    {
      id: 'candidate-experience',
      title: 'Enhance Candidate Experience',
      description: 'Create positive interactions that leave all candidates feeling respected',
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      color: 'bg-gradient-to-br from-pink-100 to-pink-200',
      steps: [
        'Map current candidate journey and identify pain points',
        'Create welcome email templates with clear expectations',
        'Establish response time commitments',
        'Design feedback collection system',
        'Create rejection emails that provide value',
        'Set up follow-up process for future opportunities'
      ],
      deliverables: [
        'Candidate journey map',
        'Email templates for all touchpoints',
        'Feedback collection system',
        'Response time standards'
      ],
      tips: [
        'Respond to every application, even rejections',
        'Provide specific timeline updates during the process',
        'Offer constructive feedback when possible'
      ]
    }
  ];
}

function formatStrategyForCopy(strategy: string, actionItems: ActionItem[]): string {
  return `HIRING STRATEGY - Generated by Carmen's AI
${'='.repeat(50)}

EXECUTIVE SUMMARY
${strategy.split('\n').slice(0, 3).join('\n')}

ACTION ITEMS
${actionItems.map((item, i) => `
${i + 1}. ${item.title}
   ${item.description}
   
   Steps:
${item.steps.map(step => `   - ${step}`).join('\n')}
   
   Expected Outcomes:
${item.deliverables.map(deliverable => `   - ${deliverable}`).join('\n')}
`).join('\n')}

Generated with Carmen's Compassionate Hiring Framework
© ${new Date().getFullYear()} Lyra AI`;
}

function generatePDFContent(strategy: string, actionItems: ActionItem[]): string {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Hiring Strategy - Carmen's AI</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; }
        h2 { color: #059669; margin-top: 30px; }
        h3 { color: #dc2626; }
        .action-item { margin: 20px 0; padding: 15px; border-left: 4px solid #7c3aed; background: #f9fafb; }
        .steps { margin: 10px 0; }
        .step { margin: 5px 0; padding-left: 20px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <h1>Hiring Strategy - Carmen's AI Framework</h1>
    
    <h2>Executive Summary</h2>
    <p>${strategy.split('\n').slice(0, 3).join(' ')}</p>
    
    <h2>Action Items</h2>
    ${actionItems.map(item => `
        <div class="action-item">
            <h3>${item.title}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            
            <h4>Implementation Steps:</h4>
            <div class="steps">
                ${item.steps.map(step => `<div class="step">• ${step}</div>`).join('')}
            </div>
            
            <h4>Expected Outcomes:</h4>
            <div class="steps">
                ${item.deliverables.map(deliverable => `<div class="step">• ${deliverable}</div>`).join('')}
            </div>
            
            <h4>Pro Tips:</h4>
            <div class="steps">
                ${item.tips.map(tip => `<div class="step">• ${tip}</div>`).join('')}
            </div>
        </div>
    `).join('')}
    
    <hr style="margin-top: 40px;">
    <p><em>Generated with Carmen's Compassionate Hiring Framework<br>
    © ${new Date().getFullYear()} Lyra AI</em></p>
</body>
</html>`;
}

function generateCSVContent(actionItems: ActionItem[]): string {
  const headers = ['Action Item', 'Description', 'Step #', 'Step Description', 'Expected Outcome', 'Pro Tip'];
  const rows = [headers.join(',')];
  
  actionItems.forEach(item => {
    item.steps.forEach((step, stepIndex) => {
      const outcome = item.deliverables[stepIndex] || '';
      const tip = item.tips[stepIndex] || '';
      rows.push([
        `"${item.title}"`,
        `"${item.description}"`,
        stepIndex + 1,
        `"${step}"`,
        `"${outcome}"`,
        `"${tip}"`
      ].join(','));
    });
  });
  
  return rows.join('\n');
}