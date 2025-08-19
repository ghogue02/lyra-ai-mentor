import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Heart,
  Users
} from 'lucide-react';
import { getCarmenManagementIconUrl } from '@/utils/supabaseIcons';

// ================================
// TYPE DEFINITIONS
// ================================

export interface PriorityCard {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  priority: number; // 1-10 scale, 1 = highest priority
  originalPriority?: number; // For tracking changes
  metadata?: {
    effort?: 'low' | 'medium' | 'high';
    impact?: 'low' | 'medium' | 'high';
    urgency?: 'low' | 'medium' | 'high';
    risk?: 'low' | 'medium' | 'high';
    deadline?: Date;
    assignee?: string;
    tags?: string[];
    estimatedTime?: number; // in hours
    dependencies?: string[]; // IDs of other cards
  };
  customFields?: { [key: string]: any };
}

export interface PriorityGroup {
  id: string;
  title: string;
  description?: string;
  color: string;
  range: { min: number; max: number }; // Priority range for this group
  maxCards?: number;
}

export interface PriorityCardSystemProps {
  title: string;
  description?: string;
  cards: PriorityCard[];
  onCardsChange: (cards: PriorityCard[]) => void;
  onComplete?: (finalCards: PriorityCard[]) => void;
  className?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  groups?: PriorityGroup[];
  showImpactMatrix?: boolean;
  allowCustomCards?: boolean;
  dragMode?: 'free' | 'constrained' | 'grouped';
  visualizationMode?: 'list' | 'matrix' | 'kanban' | 'radial';
  showPriorityTips?: boolean;
  enableBulkActions?: boolean;
  realTimeValidation?: boolean;
  showImpactScore?: boolean;
  compactMode?: boolean;
  onPriorityChange?: (cardId: string, newPriority: number, impact: string) => void;
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
    gradient: 'from-purple-100 to-cyan-100'
  },
  sofia: {
    primary: 'bg-rose-600',
    primaryText: 'text-rose-700',
    secondary: 'bg-rose-50 border-rose-200',
    accent: 'border-rose-400',
    gradient: 'from-rose-100 to-purple-100'
  },
  alex: {
    primary: 'bg-blue-600',
    primaryText: 'text-blue-700',
    secondary: 'bg-blue-50 border-blue-200',
    accent: 'border-blue-400',
    gradient: 'from-blue-100 to-indigo-100'
  },
  maya: {
    primary: 'bg-green-600',
    primaryText: 'text-green-700',
    secondary: 'bg-green-50 border-green-200',
    accent: 'border-green-400',
    gradient: 'from-green-100 to-teal-100'
  },
  default: {
    primary: 'bg-gray-600',
    primaryText: 'text-gray-700',
    secondary: 'bg-gray-50 border-gray-200',
    accent: 'border-gray-400',
    gradient: 'from-gray-100 to-gray-200'
  }
};

const priorityColors = {
  1: 'bg-red-100 border-red-300 text-red-800', // Critical
  2: 'bg-red-50 border-red-200 text-red-700',
  3: 'bg-orange-100 border-orange-300 text-orange-800', // High
  4: 'bg-orange-50 border-orange-200 text-orange-700',
  5: 'bg-yellow-100 border-yellow-300 text-yellow-800', // Medium
  6: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  7: 'bg-green-100 border-green-300 text-green-800', // Low
  8: 'bg-green-50 border-green-200 text-green-700',
  9: 'bg-gray-100 border-gray-300 text-gray-800', // Minimal
  10: 'bg-gray-50 border-gray-200 text-gray-700'
};

const priorityLabels = {
  1: 'Critical', 2: 'Critical', 
  3: 'High', 4: 'High',
  5: 'Medium', 6: 'Medium',
  7: 'Low', 8: 'Low',
  9: 'Minimal', 10: 'Minimal'
};

// ================================
// DEFAULT GROUPS
// ================================

const defaultGroups: PriorityGroup[] = [
  { id: 'critical', title: 'Critical Priority', description: 'Urgent and important', color: 'bg-red-500', range: { min: 1, max: 2 }, maxCards: 3 },
  { id: 'high', title: 'High Priority', description: 'Important but not urgent', color: 'bg-orange-500', range: { min: 3, max: 4 }, maxCards: 5 },
  { id: 'medium', title: 'Medium Priority', description: 'Moderate importance', color: 'bg-yellow-500', range: { min: 5, max: 6 } },
  { id: 'low', title: 'Low Priority', description: 'Nice to have', color: 'bg-green-500', range: { min: 7, max: 8 } },
  { id: 'minimal', title: 'Minimal Priority', description: 'Can be deferred', color: 'bg-gray-500', range: { min: 9, max: 10 } }
];

// ================================
// MAIN COMPONENT
// ================================

export const PriorityCardSystem: React.FC<PriorityCardSystemProps> = ({
  title,
  description,
  cards,
  onCardsChange,
  onComplete,
  className,
  characterTheme = 'default',
  groups = defaultGroups,
  showImpactMatrix = false,
  allowCustomCards = false,
  dragMode = 'free',
  visualizationMode = 'list',
  showPriorityTips = true,
  enableBulkActions = false,
  realTimeValidation = true,
  showImpactScore = false,
  compactMode = false,
  onPriorityChange
}) => {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(false);
  const [undoStack, setUndoStack] = useState<PriorityCard[][]>([]);
  const [showImpactFeedback, setShowImpactFeedback] = useState(false);

  const theme = themeColors[characterTheme];

  // Calculate priority impact score
  const calculateImpactScore = useCallback((cards: PriorityCard[]) => {
    const criticalCount = cards.filter(c => c.priority <= 2).length;
    const highCount = cards.filter(c => c.priority >= 3 && c.priority <= 4).length;
    const mediumCount = cards.filter(c => c.priority >= 5 && c.priority <= 6).length;
    
    // Balanced approach: not too many critical, good distribution
    let score = 100;
    if (criticalCount > 3) score -= (criticalCount - 3) * 15;
    if (criticalCount === 0) score -= 20;
    if (highCount < 2) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }, []);

  const impactScore = calculateImpactScore(cards);

  // Generate impact feedback
  const getImpactFeedback = useCallback(() => {
    const score = impactScore;
    if (score >= 90) return { message: "Excellent prioritization! Well-balanced approach.", color: "text-green-600", icon: <Star className="w-4 h-4" /> };
    if (score >= 75) return { message: "Good priority balance. Consider fine-tuning.", color: "text-blue-600", icon: <Target className="w-4 h-4" /> };
    if (score >= 60) return { message: "Decent prioritization. Room for improvement.", color: "text-yellow-600", icon: <AlertTriangle className="w-4 h-4" /> };
    return { message: "Priority distribution needs attention.", color: "text-red-600", icon: <AlertTriangle className="w-4 h-4" /> };
  }, [impactScore]);

  // Save state for undo
  const saveToUndoStack = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-9), [...cards]]);
  }, [cards]);

  // Handle card reordering
  const handleReorder = useCallback((newCards: PriorityCard[]) => {
    saveToUndoStack();
    
    // Recalculate priorities based on position
    const updatedCards = newCards.map((card, index) => ({
      ...card,
      priority: index + 1
    }));
    
    // Show impact feedback briefly
    setShowImpactFeedback(true);
    setTimeout(() => setShowImpactFeedback(false), 3000);
    
    onCardsChange(updatedCards);
    
    // Notify parent of priority change with impact
    if (onPriorityChange && updatedCards.length > 0) {
      const topCard = updatedCards[0];
      const impact = getImpactFeedback();
      onPriorityChange(topCard.id, topCard.priority, impact.message);
    }
  }, [onCardsChange, saveToUndoStack, onPriorityChange, getImpactFeedback]);

  // Move card up/down in priority
  const moveCard = useCallback((cardId: string, direction: 'up' | 'down') => {
    saveToUndoStack();
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const newCards = [...cards];
    const targetIndex = direction === 'up' ? cardIndex - 1 : cardIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < cards.length) {
      // Swap positions
      [newCards[cardIndex], newCards[targetIndex]] = [newCards[targetIndex], newCards[cardIndex]];
      
      // Update priorities
      newCards.forEach((card, index) => {
        card.priority = index + 1;
      });
      
      onCardsChange(newCards);
    }
  }, [cards, onCardsChange, saveToUndoStack]);

  // Auto-sort by impact/effort matrix
  const autoSort = useCallback((criteria: 'impact' | 'effort' | 'urgency' | 'deadline') => {
    saveToUndoStack();
    
    const sortedCards = [...cards].sort((a, b) => {
      if (criteria === 'deadline' && a.metadata?.deadline && b.metadata?.deadline) {
        return new Date(a.metadata.deadline).getTime() - new Date(b.metadata.deadline).getTime();
      }
      
      const aValue = a.metadata?.[criteria];
      const bValue = b.metadata?.[criteria];
      
      const getValue = (val: string | undefined) => {
        switch (val) {
          case 'high': return 3;
          case 'medium': return 2;
          case 'low': return 1;
          default: return 0;
        }
      };
      
      return getValue(String(bValue)) - getValue(String(aValue));
    });
    
    // Update priorities
    const updatedCards = sortedCards.map((card, index) => ({
      ...card,
      priority: index + 1
    }));
    
    onCardsChange(updatedCards);
  }, [cards, onCardsChange, saveToUndoStack]);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    onCardsChange(previousState);
  }, [undoStack, onCardsChange]);

  // Shuffle cards randomly
  const shuffleCards = useCallback(() => {
    saveToUndoStack();
    
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const updatedCards = shuffled.map((card, index) => ({
      ...card,
      priority: index + 1
    }));
    
    onCardsChange(updatedCards);
  }, [cards, onCardsChange, saveToUndoStack]);

  // Validate prioritization
  const validatePriorities = useCallback(() => {
    const issues: string[] = [];
    
    // Check for too many critical items
    const criticalCount = cards.filter(c => c.priority <= 2).length;
    if (criticalCount > 3) {
      issues.push(`Too many critical items (${criticalCount}). Consider moving some to high priority.`);
    }
    
    // Check for deadline conflicts
    const withDeadlines = cards.filter(c => c.metadata?.deadline);
    const urgentWithLowPriority = withDeadlines.filter(c => {
      const deadline = new Date(c.metadata!.deadline!);
      const daysUntil = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && c.priority > 4;
    });
    
    if (urgentWithLowPriority.length > 0) {
      issues.push(`${urgentWithLowPriority.length} items have upcoming deadlines but low priority.`);
    }
    
    return issues;
  }, [cards]);

  // ================================
  // RENDER FUNCTIONS
  // ================================

  const renderCard = (card: PriorityCard, index: number) => {
    const isSelected = selectedCards.has(card.id);
    const isDragged = draggedCardId === card.id;
    
    return (
      <motion.div
        key={card.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'group relative',
          isDragged && 'z-10 rotate-2 shadow-xl'
        )}
      >
        <Card className={cn(
          'transition-all duration-200 cursor-grab active:cursor-grabbing',
          priorityColors[card.priority as keyof typeof priorityColors],
          isSelected && 'ring-2 ring-purple-500',
          'hover:shadow-md',
          compactMode && 'border border-gray-200'
        )}>
          <CardContent className={cn('p-4', compactMode && 'p-3')}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <Badge variant="outline" className="text-xs font-semibold">
                    #{card.priority}
                  </Badge>
                </div>
                
                {card.icon && (
                  <div className="text-lg">
                    {typeof card.icon === 'string' ? (
                      <img 
                        src={getCarmenManagementIconUrl(String(card.icon) as any)}
                        alt={card.title}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      card.icon
                    )}
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 leading-tight">
                    {card.title}
                  </h4>
                  {card.category && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {card.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={cn('text-xs', priorityColors[card.priority as keyof typeof priorityColors])}>
                  {priorityLabels[card.priority as keyof typeof priorityLabels]}
                </Badge>
                
                {!isDragged && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveCard(card.id, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveCard(card.id, 'down')}
                      disabled={index === cards.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {card.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {card.description}
              </p>
            )}

            {/* Metadata */}
            {card.metadata && (
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {card.metadata.impact && (
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {card.metadata.impact} impact
                    </Badge>
                  )}
                  {card.metadata.effort && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {card.metadata.effort} effort
                    </Badge>
                  )}
                  {card.metadata.urgency && (
                    <Badge variant="outline" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {card.metadata.urgency} urgency
                    </Badge>
                  )}
                </div>
                
                {card.metadata.deadline && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due: {new Date(card.metadata.deadline).toLocaleDateString()}
                  </div>
                )}
                
                {card.metadata.estimatedTime && (
                  <div className="text-xs text-gray-500">
                    Estimated: {card.metadata.estimatedTime}h
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderImpactMatrix = () => {
    if (!showImpactMatrix) return null;
    
    const matrixCards = cards.filter(card => 
      card.metadata?.impact && card.metadata?.effort
    );
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Impact vs Effort Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 aspect-square max-w-md mx-auto">
            {/* High Impact, Low Effort */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 text-sm mb-2">Quick Wins</h4>
              <p className="text-xs text-green-600 mb-2">High Impact, Low Effort</p>
              <div className="space-y-1">
                {matrixCards
                  .filter(c => c.metadata?.impact === 'high' && c.metadata?.effort === 'low')
                  .slice(0, 3)
                  .map(card => (
                    <div key={card.id} className="text-xs bg-white p-1 rounded border">
                      {card.title}
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* High Impact, High Effort */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">Major Projects</h4>
              <p className="text-xs text-blue-600 mb-2">High Impact, High Effort</p>
              <div className="space-y-1">
                {matrixCards
                  .filter(c => c.metadata?.impact === 'high' && c.metadata?.effort === 'high')
                  .slice(0, 3)
                  .map(card => (
                    <div key={card.id} className="text-xs bg-white p-1 rounded border">
                      {card.title}
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Low Impact, Low Effort */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 text-sm mb-2">Fill-ins</h4>
              <p className="text-xs text-yellow-600 mb-2">Low Impact, Low Effort</p>
              <div className="space-y-1">
                {matrixCards
                  .filter(c => c.metadata?.impact === 'low' && c.metadata?.effort === 'low')
                  .slice(0, 3)
                  .map(card => (
                    <div key={card.id} className="text-xs bg-white p-1 rounded border">
                      {card.title}
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Low Impact, High Effort */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <h4 className="font-semibold text-red-800 text-sm mb-2">Time Wasters</h4>
              <p className="text-xs text-red-600 mb-2">Low Impact, High Effort</p>
              <div className="space-y-1">
                {matrixCards
                  .filter(c => c.metadata?.impact === 'low' && c.metadata?.effort === 'high')
                  .slice(0, 3)
                  .map(card => (
                    <div key={card.id} className="text-xs bg-white p-1 rounded border">
                      {card.title}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderValidationFeedback = () => {
    if (!realTimeValidation) return null;
    
    const issues = validatePriorities();
    if (issues.length === 0) return null;
    
    return (
      <Card className="mb-6 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 text-sm mb-2">
                Prioritization Feedback
              </h4>
              <ul className="space-y-1">
                {issues.map((issue, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
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
            <BarChart3 className="w-5 h-5 text-purple-600" />
            {title}
          </div>
          
          <div className="flex items-center gap-2">
            {enableBulkActions && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => autoSort('impact')}
                  className="text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Sort by Impact
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shuffleCards}
                  className="text-xs"
                >
                  <Shuffle className="w-3 h-3 mr-1" />
                  Shuffle
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Undo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValidation(!showValidation)}
              className="text-xs"
            >
              {showValidation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
        </CardTitle>
        
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{cards.length} items to prioritize</span>
          {showImpactScore && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className={getImpactFeedback().color}>Impact Score: {impactScore}%</span>
            </div>
          )}
          <span className="hidden md:block">Drag to reorder • Click arrows to adjust</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real-time Impact Feedback */}
        {showImpactScore && showImpactFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              {getImpactFeedback().icon}
              <span className={cn("text-sm font-medium", getImpactFeedback().color)}>
                {getImpactFeedback().message}
              </span>
              <Badge variant="outline" className="ml-auto">
                {impactScore}% Impact
              </Badge>
            </div>
          </motion.div>
        )}
        
        {renderImpactMatrix()}
        {showValidation && renderValidationFeedback()}
        
        {/* Priority Tips - Carmen Retention Specific */}
        {showPriorityTips && characterTheme === 'carmen' && (
          <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-purple-900 text-sm">
                  Carmen's Retention Prioritization Guide
                </h4>
              </div>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• <strong>Critical:</strong> Address immediate flight risks first</li>
                <li>• <strong>High:</strong> Focus on high-impact, preventive measures</li>
                <li>• <strong>Medium:</strong> Build long-term engagement systems</li>
                <li>• <strong>Balance:</strong> Combine predictive insights with human touch</li>
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Generic Priority Tips */}
        {showPriorityTips && characterTheme !== 'carmen' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                💡 Prioritization Tips
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Limit critical items to 2-3 maximum</li>
                <li>• Consider effort vs impact when ranking</li>
                <li>• Review deadlines and dependencies</li>
                <li>• Focus on quick wins for momentum</li>
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Cards List */}
        <div className="space-y-3">
          <Reorder.Group
            axis="y"
            values={cards}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {cards.map((card, index) => (
                <Reorder.Item
                  key={card.id}
                  value={card}
                  onDragStart={() => setDraggedCardId(card.id)}
                  onDragEnd={() => setDraggedCardId(null)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {renderCard(card, index)}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
        
        {/* Completion Action */}
        {onComplete && (
          <div className="text-center pt-6 border-t">
            <Button
              onClick={() => onComplete(cards)}
              className={cn('px-8 py-3', theme.primary)}
            >
              <Star className="w-4 h-4 mr-2" />
              Finalize Priorities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriorityCardSystem;