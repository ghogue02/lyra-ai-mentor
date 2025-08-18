import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  InteractiveDecisionTree, 
  createEngagementDecisionTree,
  DecisionTreeState,
  DecisionPath
} from './InteractiveDecisionTree';
import { OptionItem } from '@/components/ui/VisualOptionGrid';
import { GitBranch, Sparkles, Heart, RotateCcw, Play, ChevronRight } from 'lucide-react';

// ================================
// TYPES
// ================================

export interface EngagementDecisionTreeProps {
  teamSizeOptions: OptionItem[];
  challengeOptions: OptionItem[];
  strategyOptions: OptionItem[];
  goalOptions: OptionItem[];
  onSelectionComplete: (selections: {
    teamSize: string[];
    challenges: string[];
    strategies: string[];
    goals: string[];
  }) => void;
  onGenerateStrategy: () => void;
  className?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  isGenerating?: boolean;
}

export interface MultiSelectDecisionState {
  teamSize: string[];
  challenges: string[];
  strategies: string[];
  goals: string[];
  currentStep: 'team-size' | 'challenges' | 'strategies' | 'goals' | 'complete';
  isComplete: boolean;
}

// ================================
// CUSTOM MULTI-SELECT HANDLER
// ================================

export const EngagementDecisionTree: React.FC<EngagementDecisionTreeProps> = ({
  teamSizeOptions,
  challengeOptions,
  strategyOptions,
  goalOptions,
  onSelectionComplete,
  onGenerateStrategy,
  className,
  characterTheme = 'carmen',
  isGenerating = false
}) => {
  const [multiSelectState, setMultiSelectState] = useState<MultiSelectDecisionState>({
    teamSize: [],
    challenges: [],
    strategies: [],
    goals: [],
    currentStep: 'team-size',
    isComplete: false
  });

  const [showMultiSelectOverlay, setShowMultiSelectOverlay] = useState(false);
  const [currentMultiOptions, setCurrentMultiOptions] = useState<OptionItem[]>([]);
  const [currentSelectionType, setCurrentSelectionType] = useState<'challenges' | 'strategies' | 'goals' | null>(null);

  // Create the decision tree structure
  const { nodes, rootNodeId } = createEngagementDecisionTree(
    teamSizeOptions,
    challengeOptions,
    strategyOptions,
    goalOptions
  );

  // Standard decision tree state for single selections
  const [treeState, setTreeState] = useState<DecisionTreeState>({
    currentNodeId: rootNodeId,
    visitedNodes: new Set([rootNodeId]),
    decisionPath: [{ nodeId: rootNodeId, timestamp: new Date(), level: 0 }],
    choices: {},
    isComplete: false
  });

  // Handle tree state changes and intercept multi-select nodes
  const handleTreeStateChange = useCallback((newTreeState: DecisionTreeState) => {
    const currentNode = nodes[newTreeState.currentNodeId];
    
    // Check if we're entering a multi-select node
    if (currentNode && ['challenges', 'strategies', 'goals'].includes(currentNode.id)) {
      setShowMultiSelectOverlay(true);
      setCurrentSelectionType(currentNode.id as 'challenges' | 'strategies' | 'goals');
      
      switch (currentNode.id) {
        case 'challenges':
          setCurrentMultiOptions(challengeOptions);
          break;
        case 'strategies':
          setCurrentMultiOptions(strategyOptions);
          break;
        case 'goals':
          setCurrentMultiOptions(goalOptions);
          break;
      }
      
      return; // Don't update tree state yet
    }
    
    setTreeState(newTreeState);
  }, [nodes, challengeOptions, strategyOptions, goalOptions]);

  // Handle multi-select completion
  const handleMultiSelectComplete = useCallback((selections: string[]) => {
    if (!currentSelectionType) return;

    const newMultiState = {
      ...multiSelectState,
      [currentSelectionType]: selections
    };

    // Update current step
    const stepOrder = ['team-size', 'challenges', 'strategies', 'goals', 'complete'];
    const currentIndex = stepOrder.indexOf(currentSelectionType);
    const nextStep = stepOrder[currentIndex + 1] as typeof newMultiState.currentStep;
    
    newMultiState.currentStep = nextStep;
    newMultiState.isComplete = nextStep === 'complete';

    setMultiSelectState(newMultiState);
    setShowMultiSelectOverlay(false);
    setCurrentSelectionType(null);

    // Update the tree state to move to next node
    const nextNodeId = nextStep === 'complete' ? 'outcome' : nextStep;
    const updatedTreeState = {
      ...treeState,
      currentNodeId: nextNodeId,
      visitedNodes: new Set([...treeState.visitedNodes, nextNodeId]),
      decisionPath: [
        ...treeState.decisionPath,
        {
          nodeId: nextNodeId,
          choiceId: `${currentSelectionType}-multi-select`,
          timestamp: new Date(),
          level: treeState.decisionPath.length
        }
      ],
      choices: {
        ...treeState.choices,
        [currentSelectionType]: selections.join(',')
      },
      isComplete: nextStep === 'complete'
    };

    setTreeState(updatedTreeState);

    // Notify parent of updated selections
    onSelectionComplete(newMultiState);
  }, [currentSelectionType, multiSelectState, treeState, onSelectionComplete]);

  // Handle final completion
  const handleDecisionComplete = useCallback((finalPath: DecisionPath[], finalChoices: { [nodeId: string]: string }) => {
    onGenerateStrategy();
  }, [onGenerateStrategy]);

  // Reset function
  const handleReset = useCallback(() => {
    setMultiSelectState({
      teamSize: [],
      challenges: [],
      strategies: [],
      goals: [],
      currentStep: 'team-size',
      isComplete: false
    });
    
    setTreeState({
      currentNodeId: rootNodeId,
      visitedNodes: new Set([rootNodeId]),
      decisionPath: [{ nodeId: rootNodeId, timestamp: new Date(), level: 0 }],
      choices: {},
      isComplete: false
    });
    
    setShowMultiSelectOverlay(false);
    setCurrentSelectionType(null);
  }, [rootNodeId]);

  // ================================
  // MULTI-SELECT OVERLAY COMPONENT
  // ================================

  const renderMultiSelectOverlay = () => {
    if (!showMultiSelectOverlay || !currentSelectionType) return null;

    const maxSelections = {
      challenges: 3,
      strategies: 4,
      goals: 3
    }[currentSelectionType];

    const currentSelections = multiSelectState[currentSelectionType];
    const nodeInfo = nodes[currentSelectionType];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-cyan-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-purple-600" />
              {nodeInfo?.title}
            </h2>
            <p className="text-gray-600 mb-4">{nodeInfo?.question}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Select up to {maxSelections} options
              </Badge>
              <Badge variant={currentSelections.length > 0 ? "default" : "outline"}>
                {currentSelections.length} selected
              </Badge>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-2">
              {currentMultiOptions.map((option, index) => {
                const isSelected = currentSelections.includes(option.id);
                const isDisabled = !isSelected && currentSelections.length >= maxSelections;
                
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      if (isSelected) {
                        // Remove selection
                        handleMultiSelectComplete(currentSelections.filter(id => id !== option.id));
                      } else if (!isDisabled) {
                        // Add selection (don't auto-complete, let them choose more)
                        const newSelections = [...currentSelections, option.id];
                        setMultiSelectState(prev => ({
                          ...prev,
                          [currentSelectionType]: newSelections
                        }));
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      'relative p-4 rounded-lg border-2 text-left transition-all duration-200',
                      'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                      'cursor-pointer select-none active:scale-[0.98]',
                      isSelected 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-purple-300 bg-white',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                        isSelected 
                          ? 'bg-purple-600 border-purple-600 text-white' 
                          : 'border-gray-300'
                      )}>
                        {isSelected && <span className="text-xs">✓</span>}
                      </div>
                    </div>

                    <div className="pr-8">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{option.label}</h3>
                        {option.recommended && (
                          <Badge variant="secondary" className="text-xs">Rec</Badge>
                        )}
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowMultiSelectOverlay(false);
                setCurrentSelectionType(null);
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => handleMultiSelectComplete(currentSelections)}
              disabled={currentSelections.length === 0}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Continue with {currentSelections.length} selection{currentSelections.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ================================
  // MAIN RENDER
  // ================================

  return (
    <div className={cn("w-full", className)}>
      {/* Main Decision Tree */}
      <InteractiveDecisionTree
        title="Personalized Engagement Strategy Builder"
        description="Navigate through each decision point to build your custom engagement approach"
        nodes={nodes}
        rootNodeId={rootNodeId}
        state={treeState}
        onStateChange={handleTreeStateChange}
        onComplete={handleDecisionComplete}
        characterTheme={characterTheme}
        showProgress={true}
        allowBacktrack={true}
        showMiniMap={true}
        visualMode="linear"
        autoSave={true}
      />

      {/* Multi-Select Overlay */}
      {renderMultiSelectOverlay()}

      {/* Selection Summary */}
      {(multiSelectState.challenges.length > 0 || multiSelectState.strategies.length > 0 || multiSelectState.goals.length > 0) && (
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-cyan-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Your Selections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {multiSelectState.teamSize.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Team Size:</p>
                <div className="flex flex-wrap gap-2">
                  {multiSelectState.teamSize.map(id => {
                    const option = teamSizeOptions.find(opt => opt.id === id);
                    return option ? (
                      <Badge key={id} variant="secondary" className="bg-blue-100 text-blue-700">
                        {option.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {multiSelectState.challenges.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Challenges:</p>
                <div className="flex flex-wrap gap-2">
                  {multiSelectState.challenges.map(id => {
                    const option = challengeOptions.find(opt => opt.id === id);
                    return option ? (
                      <Badge key={id} variant="secondary" className="bg-red-100 text-red-700">
                        {option.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {multiSelectState.strategies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Strategies:</p>
                <div className="flex flex-wrap gap-2">
                  {multiSelectState.strategies.map(id => {
                    const option = strategyOptions.find(opt => opt.id === id);
                    return option ? (
                      <Badge key={id} variant="secondary" className="bg-green-100 text-green-700">
                        {option.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {multiSelectState.goals.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {multiSelectState.goals.map(id => {
                    const option = goalOptions.find(opt => opt.id === id);
                    return option ? (
                      <Badge key={id} variant="secondary" className="bg-purple-100 text-purple-700">
                        {option.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-purple-200">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              
              {multiSelectState.isComplete && (
                <Button
                  onClick={onGenerateStrategy}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 animate-pulse" />
                      Creating Strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate My Strategy
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EngagementDecisionTree;