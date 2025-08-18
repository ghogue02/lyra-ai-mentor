import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  ChevronRight, 
  ChevronDown, 
  Undo, 
  RotateCcw,
  Check,
  ArrowUp,
  ArrowDown,
  Target,
  MapPin,
  Lightbulb
} from 'lucide-react';

// ================================
// TYPE DEFINITIONS
// ================================

export interface DecisionNode {
  id: string;
  title: string;
  description?: string;
  question?: string;
  type: 'root' | 'decision' | 'outcome' | 'branch';
  level: number;
  parentId?: string;
  children: string[]; // IDs of child nodes
  choices?: DecisionChoice[];
  outcome?: DecisionOutcome;
  position?: { x: number; y: number };
  metadata?: {
    weight?: number; // Importance of this decision
    risk?: 'low' | 'medium' | 'high';
    effort?: 'low' | 'medium' | 'high';
    impact?: 'low' | 'medium' | 'high';
    tags?: string[];
  };
}

export interface DecisionChoice {
  id: string;
  label: string;
  description?: string;
  leadsTo: string; // ID of the node this choice leads to
  icon?: React.ReactNode;
  consequences?: string[];
  recommended?: boolean;
  requiresInput?: boolean;
  inputType?: 'text' | 'number' | 'scale';
  inputValue?: any;
}

export interface DecisionOutcome {
  type: 'success' | 'failure' | 'neutral' | 'requires-attention';
  title: string;
  description: string;
  recommendations?: string[];
  nextSteps?: string[];
  resources?: { title: string; url?: string; description?: string }[];
}

export interface DecisionPath {
  nodeId: string;
  choiceId?: string;
  timestamp: Date;
  level: number;
}

export interface DecisionTreeState {
  currentNodeId: string;
  visitedNodes: Set<string>;
  decisionPath: DecisionPath[];
  choices: { [nodeId: string]: string }; // nodeId -> choiceId
  isComplete: boolean;
}

export interface InteractiveDecisionTreeProps {
  title: string;
  description?: string;
  nodes: { [nodeId: string]: DecisionNode };
  rootNodeId: string;
  state: DecisionTreeState;
  onStateChange: (state: DecisionTreeState) => void;
  onComplete?: (finalPath: DecisionPath[], finalChoices: { [nodeId: string]: string }) => void;
  className?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  showProgress?: boolean;
  allowBacktrack?: boolean;
  showMiniMap?: boolean;
  visualMode?: 'linear' | 'tree' | 'flowchart';
  autoSave?: boolean;
}

// ================================
// THEME CONFIGURATION
// ================================

const themeColors = {
  carmen: {
    primary: 'bg-purple-600',
    primaryText: 'text-purple-700',
    secondary: 'bg-purple-50 border-purple-200',
    accent: 'border-purple-400',
    node: 'bg-gradient-to-br from-purple-100 to-cyan-100',
    path: 'stroke-purple-500'
  },
  sofia: {
    primary: 'bg-rose-600',
    primaryText: 'text-rose-700',
    secondary: 'bg-rose-50 border-rose-200',
    accent: 'border-rose-400',
    node: 'bg-gradient-to-br from-rose-100 to-purple-100',
    path: 'stroke-rose-500'
  },
  alex: {
    primary: 'bg-blue-600',
    primaryText: 'text-blue-700',
    secondary: 'bg-blue-50 border-blue-200',
    accent: 'border-blue-400',
    node: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    path: 'stroke-blue-500'
  },
  maya: {
    primary: 'bg-green-600',
    primaryText: 'text-green-700',
    secondary: 'bg-green-50 border-green-200',
    accent: 'border-green-400',
    node: 'bg-gradient-to-br from-green-100 to-teal-100',
    path: 'stroke-green-500'
  },
  default: {
    primary: 'bg-gray-600',
    primaryText: 'text-gray-700',
    secondary: 'bg-gray-50 border-gray-200',
    accent: 'border-gray-400',
    node: 'bg-gradient-to-br from-gray-100 to-gray-200',
    path: 'stroke-gray-500'
  }
};

const nodeTypeIcons = {
  root: Target,
  decision: GitBranch,
  outcome: Check,
  branch: ChevronRight
};

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Creates an engagement strategy decision tree from Carmen's options
 */
export const createEngagementDecisionTree = (
  teamSizeOptions: any[],
  challengeOptions: any[],
  strategyOptions: any[],
  goalOptions: any[]
): { nodes: { [nodeId: string]: DecisionNode }, rootNodeId: string } => {
  const nodes: { [nodeId: string]: DecisionNode } = {
    'root': {
      id: 'root',
      title: 'Team Engagement Challenge',
      description: 'Every team is unique. Let\'s find the right engagement approach for yours.',
      question: 'What\'s the first step to building a thriving team?',
      type: 'root',
      level: 0,
      children: ['team-size'],
      choices: [{
        id: 'start-journey',
        label: 'Begin Engagement Journey',
        description: 'Start with understanding your team dynamics',
        leadsTo: 'team-size',
        icon: '🚀',
        recommended: true
      }]
    },
    'team-size': {
      id: 'team-size',
      title: 'Team Size & Structure',
      description: 'Team size affects communication patterns and engagement strategies.',
      question: 'How large is your team?',
      type: 'decision',
      level: 1,
      parentId: 'root',
      children: ['challenges'],
      choices: teamSizeOptions.map(option => ({
        id: option.id,
        label: option.label,
        description: option.description,
        leadsTo: 'challenges',
        icon: '👥',
        recommended: option.recommended
      }))
    },
    'challenges': {
      id: 'challenges',
      title: 'Engagement Challenges',
      description: 'Understanding current pain points helps target solutions.',
      question: 'What are your biggest engagement challenges? (Select up to 3)',
      type: 'decision',
      level: 2,
      parentId: 'team-size',
      children: ['strategies'],
      choices: challengeOptions.map(option => ({
        id: option.id,
        label: option.label,
        description: option.description,
        leadsTo: 'strategies',
        icon: '⚠️',
        recommended: option.recommended,
        consequences: [`Affects: ${option.label.toLowerCase()} patterns`]
      }))
    },
    'strategies': {
      id: 'strategies',
      title: 'Engagement Strategies',
      description: 'Choose approaches that align with your team\'s needs and culture.',
      question: 'Which strategies resonate with your leadership style? (Select up to 4)',
      type: 'decision',
      level: 3,
      parentId: 'challenges',
      children: ['goals'],
      choices: strategyOptions.map(option => ({
        id: option.id,
        label: option.label,
        description: option.description,
        leadsTo: 'goals',
        icon: '💡',
        recommended: option.recommended
      }))
    },
    'goals': {
      id: 'goals',
      title: 'Engagement Goals',
      description: 'Clear outcomes help measure engagement strategy success.',
      question: 'What outcomes are you aiming for? (Select up to 3)',
      type: 'decision',
      level: 4,
      parentId: 'strategies',
      children: ['outcome'],
      choices: goalOptions.map(option => ({
        id: option.id,
        label: option.label,
        description: option.description,
        leadsTo: 'outcome',
        icon: '🎯',
        recommended: option.recommended
      }))
    },
    'outcome': {
      id: 'outcome',
      title: 'Your Personalized Strategy',
      description: 'Ready to create your AI-powered engagement framework',
      type: 'outcome',
      level: 5,
      parentId: 'goals',
      children: [],
      outcome: {
        type: 'success',
        title: 'Engagement Strategy Ready!',
        description: 'You\'ve mapped your team\'s needs and preferences. Carmen will now create your personalized engagement strategy.',
        recommendations: [
          'Your selections will guide AI-powered individual insights',
          'Strategies will be tailored to your team size and challenges',
          'Implementation steps will match your leadership goals',
          'Measurement approaches will track your specific outcomes'
        ],
        nextSteps: [
          'Review your decision path',
          'Generate your personalized strategy',
          'Implement recommendations systematically',
          'Monitor engagement improvements',
          'Adjust based on team feedback'
        ],
        resources: [
          {
            title: 'Carmen\'s Framework',
            description: 'AI-Powered Individual Insights + Personalized Recognition + Growth Alignment + Psychological Safety + Continuous Pulse'
          },
          {
            title: 'Implementation Guide',
            description: 'Step-by-step approach to rolling out your engagement strategy'
          }
        ]
      }
    }
  };

  return { nodes, rootNodeId: 'root' };
};

// ================================
// MAIN COMPONENT
// ================================

export const InteractiveDecisionTree: React.FC<InteractiveDecisionTreeProps> = ({
  title,
  description,
  nodes,
  rootNodeId,
  state,
  onStateChange,
  onComplete,
  className,
  characterTheme = 'default',
  showProgress = true,
  allowBacktrack = true,
  showMiniMap = false,
  visualMode = 'linear',
  autoSave = true
}) => {
  const [undoStack, setUndoStack] = useState<DecisionTreeState[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const theme = themeColors[characterTheme];
  const currentNode = nodes[state.currentNodeId];

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem(`decision-tree-${title}`, JSON.stringify(state));
    }
  }, [state, autoSave, title]);

  // Calculate progress
  const totalNodes = Object.keys(nodes).length;
  const visitedCount = state.visitedNodes.size;
  const progressPercentage = (visitedCount / totalNodes) * 100;

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: DecisionChoice) => {
    const newState: DecisionTreeState = {
      ...state,
      currentNodeId: choice.leadsTo,
      visitedNodes: new Set([...state.visitedNodes, choice.leadsTo]),
      decisionPath: [
        ...state.decisionPath,
        {
          nodeId: choice.leadsTo,
          choiceId: choice.id,
          timestamp: new Date(),
          level: currentNode.level + 1
        }
      ],
      choices: {
        ...state.choices,
        [state.currentNodeId]: choice.id
      }
    };

    // Check if we've reached an outcome
    const nextNode = nodes[choice.leadsTo];
    if (nextNode.type === 'outcome') {
      newState.isComplete = true;
    }

    // Save current state to undo stack
    setUndoStack(prev => [...prev, state]);

    onStateChange(newState);

    // Trigger completion if applicable
    if (newState.isComplete && onComplete) {
      onComplete(newState.decisionPath, newState.choices);
    }
  }, [state, currentNode, nodes, onStateChange, onComplete]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !allowBacktrack) return;

    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    onStateChange(previousState);
  }, [undoStack, allowBacktrack, onStateChange]);

  // Reset tree
  const handleReset = useCallback(() => {
    const resetState: DecisionTreeState = {
      currentNodeId: rootNodeId,
      visitedNodes: new Set([rootNodeId]),
      decisionPath: [{ nodeId: rootNodeId, timestamp: new Date(), level: 0 }],
      choices: {},
      isComplete: false
    };
    
    setUndoStack([]);
    onStateChange(resetState);
  }, [rootNodeId, onStateChange]);

  // ================================
  // RENDER FUNCTIONS
  // ================================

  const renderNodeContent = (node: DecisionNode, isCurrentNode: boolean = false) => {
    const NodeIcon = nodeTypeIcons[node.type];
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-200',
          isCurrentNode 
            ? `${theme.secondary} ${theme.accent} shadow-lg` 
            : 'border-gray-200 bg-white hover:shadow-md'
        )}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isCurrentNode ? theme.primary : 'bg-gray-100'
          )}>
            <NodeIcon className={cn(
              'w-4 h-4',
              isCurrentNode ? 'text-white' : 'text-gray-600'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{node.title}</h3>
            {node.description && (
              <p className="text-sm text-gray-600 mt-1">{node.description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            Level {node.level}
          </Badge>
        </div>

        {node.question && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">{node.question}</p>
          </div>
        )}

        {node.metadata && (
          <div className="flex gap-2 mb-3">
            {node.metadata.risk && (
              <Badge 
                variant={node.metadata.risk === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {node.metadata.risk} risk
              </Badge>
            )}
            {node.metadata.effort && (
              <Badge variant="outline" className="text-xs">
                {node.metadata.effort} effort
              </Badge>
            )}
            {node.metadata.impact && (
              <Badge 
                variant={node.metadata.impact === 'high' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {node.metadata.impact} impact
              </Badge>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const renderChoices = () => {
    if (!currentNode.choices) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Choose your path:
        </h4>
        <div className="grid gap-3">
          {currentNode.choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleChoiceSelect(choice)}
              className={cn(
                'relative p-4 rounded-lg border-2 text-left transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                'border-gray-200 hover:border-purple-300 bg-white group',
                'touch-friendly min-h-[80px] cursor-pointer select-none active:scale-[0.98] active:shadow-sm'
              )}
            >
              {/* Visual Connection Line */}
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {choice.icon && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        {choice.icon}
                      </div>
                    )}
                    <h5 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {choice.label}
                    </h5>
                    {choice.recommended && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  {choice.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{choice.description}</p>
                  )}
                  {choice.consequences && choice.consequences.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Considerations:</p>
                      {choice.consequences.map((consequence, idx) => (
                        <p key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="w-1 h-1 bg-purple-400 rounded-full" />
                          {consequence}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors group-hover:translate-x-1" />
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-purple-400 transition-colors flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 group-hover:bg-purple-400 rounded-full transition-colors" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const renderOutcome = () => {
    if (!currentNode.outcome) return null;

    const { outcome } = currentNode;
    const outcomeColors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      failure: 'bg-red-50 border-red-200 text-red-800',
      neutral: 'bg-gray-50 border-gray-200 text-gray-800',
      'requires-attention': 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className={cn('border-2', outcomeColors[outcome.type])}>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{outcome.title}</h3>
              <p className="text-gray-600">{outcome.description}</p>
            </div>

            {outcome.recommendations && outcome.recommendations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {outcome.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outcome.nextSteps && outcome.nextSteps.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Next Steps</h4>
                <ol className="space-y-2">
                  {outcome.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-600 font-semibold mt-1">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {outcome.resources && outcome.resources.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Helpful Resources</h4>
                <div className="space-y-2">
                  {outcome.resources.map((resource, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border">
                      <h5 className="font-medium text-sm">{resource.title}</h5>
                      {resource.description && (
                        <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderMiniMap = () => {
    if (!showMiniMap) return null;

    return (
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-cyan-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            Your Journey Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {state.decisionPath.map((pathItem, index) => {
              const node = nodes[pathItem.nodeId];
              const isLast = index === state.decisionPath.length - 1;
              const isVisited = state.visitedNodes.has(pathItem.nodeId);
              
              return (
                <React.Fragment key={pathItem.nodeId}>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200',
                      isLast 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg' 
                        : isVisited 
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    )}
                    title={node?.title}
                  >
                    {index + 1}
                  </motion.div>
                  {!isLast && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.05 }}
                      className="flex-shrink-0 h-0.5 w-6 bg-gradient-to-r from-purple-300 to-cyan-300"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Current Node Info */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Current Step</p>
            <p className="text-sm font-semibold text-gray-900">{currentNode.title}</p>
            {currentNode.description && (
              <p className="text-xs text-gray-600 mt-1">{currentNode.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // ================================
  // MAIN RENDER
  // ================================

  return (
    <Card className={cn('w-full nm-card', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            {title}
          </div>
          <div className="flex items-center gap-2">
            {allowBacktrack && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                className="text-xs"
              >
                <Undo className="w-3 h-3 mr-1" />
                Undo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardTitle>
        
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        
        {showProgress && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Explored: {visitedCount} of {totalNodes} nodes</span>
            <span>Level {currentNode.level}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {renderMiniMap()}
        
        {/* Current Node */}
        {renderNodeContent(currentNode, true)}
        
        {/* Choices or Outcome */}
        {state.isComplete ? renderOutcome() : renderChoices()}
        
        {/* Completion Actions */}
        {state.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-6 border-t border-purple-200"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Explore Again
              </Button>
              <Button
                onClick={() => {
                  // Trigger the onComplete callback to generate strategy
                  if (onComplete) {
                    onComplete(state.decisionPath, state.choices);
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Generate My Strategy
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveDecisionTree;