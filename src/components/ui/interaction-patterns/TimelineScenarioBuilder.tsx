import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Target,
  Users,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Eye,
  Layers,
  CheckCircle,
  AlertCircle,
  Zap,
  Award,
  BarChart3,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'skill' | 'goal' | 'method' | 'outcome';
  timeframe: number; // weeks from start
  dependencies: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  metrics?: {
    successCriteria: string[];
    kpis: string[];
  };
  icon: string;
  color: string;
}

export interface TimelineScenario {
  id: string;
  name: string;
  description: string;
  duration: number; // total weeks
  milestones: TimelineMilestone[];
  category: 'new-leader' | 'team-performance' | 'change-management' | 'skill-development';
  estimatedROI: string;
}

export interface TimelineScenarioBuilderProps {
  title?: string;
  description?: string;
  availableMilestones: Omit<TimelineMilestone, 'timeframe' | 'status'>[];
  onScenarioUpdate?: (scenario: TimelineScenario) => void;
  onMilestoneSelection?: (milestones: TimelineMilestone[]) => void;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  maxDuration?: number; // max weeks
  enableComparison?: boolean;
  enableSimulation?: boolean;
  className?: string;
}

const themeColors = {
  carmen: {
    primary: 'bg-purple-600',
    secondary: 'bg-cyan-500',
    accent: 'border-purple-200',
    gradient: 'from-purple-50 to-cyan-50',
    timeline: 'bg-gradient-to-r from-purple-500 to-cyan-500'
  },
  sofia: {
    primary: 'bg-rose-600',
    secondary: 'bg-purple-500',
    accent: 'border-rose-200',
    gradient: 'from-rose-50 to-purple-50',
    timeline: 'bg-gradient-to-r from-rose-500 to-purple-500'
  },
  alex: {
    primary: 'bg-blue-600',
    secondary: 'bg-indigo-500',
    accent: 'border-blue-200',
    gradient: 'from-blue-50 to-indigo-50',
    timeline: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  },
  maya: {
    primary: 'bg-green-600',
    secondary: 'bg-teal-500',
    accent: 'border-green-200',
    gradient: 'from-green-50 to-teal-50',
    timeline: 'bg-gradient-to-r from-green-500 to-teal-500'
  },
  default: {
    primary: 'bg-gray-600',
    secondary: 'bg-gray-500',
    accent: 'border-gray-200',
    gradient: 'from-gray-50 to-gray-100',
    timeline: 'bg-gradient-to-r from-gray-500 to-gray-600'
  }
};

const milestoneTypeColors = {
  challenge: 'bg-red-100 border-red-300 text-red-700',
  skill: 'bg-blue-100 border-blue-300 text-blue-700',
  goal: 'bg-green-100 border-green-300 text-green-700',
  method: 'bg-purple-100 border-purple-300 text-purple-700',
  outcome: 'bg-yellow-100 border-yellow-300 text-yellow-700'
};

const statusColors = {
  pending: 'bg-gray-100 border-gray-300 text-gray-600',
  'in-progress': 'bg-blue-100 border-blue-300 text-blue-700',
  completed: 'bg-green-100 border-green-300 text-green-700',
  blocked: 'bg-red-100 border-red-300 text-red-700'
};

export const TimelineScenarioBuilder: React.FC<TimelineScenarioBuilderProps> = ({
  title = "Leadership Development Timeline",
  description = "Build your leadership development journey with interactive milestones",
  availableMilestones,
  onScenarioUpdate,
  onMilestoneSelection,
  characterTheme = 'carmen',
  maxDuration = 52, // 1 year default
  enableComparison = true,
  enableSimulation = true,
  className
}) => {
  const [scenario, setScenario] = useState<TimelineScenario>({
    id: 'scenario-1',
    name: 'Custom Leadership Journey',
    description: 'Your personalized leadership development timeline',
    duration: 26, // 6 months default
    milestones: [],
    category: 'skill-development',
    estimatedROI: 'TBD'
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [draggedMilestone, setDraggedMilestone] = useState<Omit<TimelineMilestone, 'timeframe' | 'status'> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comparisonScenarios, setComparisonScenarios] = useState<TimelineScenario[]>([]);
  const [viewMode, setViewMode] = useState<'build' | 'simulate' | 'compare'>('build');

  const timelineRef = useRef<HTMLDivElement>(null);
  const theme = themeColors[characterTheme];

  // Sample scenarios for comparison
  const sampleScenarios: TimelineScenario[] = [
    {
      id: 'fast-track',
      name: 'Fast-Track Leader',
      description: 'Accelerated 3-month leadership development',
      duration: 12,
      category: 'new-leader',
      estimatedROI: '200% increase in team productivity',
      milestones: []
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Development',
      description: 'Complete 12-month leadership transformation',
      duration: 52,
      category: 'skill-development',
      estimatedROI: '350% ROI in leadership effectiveness',
      milestones: []
    }
  ];

  // Handle drag and drop
  const handleDragStart = (milestone: Omit<TimelineMilestone, 'timeframe' | 'status'>) => {
    setDraggedMilestone(milestone);
  };

  const handleDrop = (timeframe: number) => {
    if (!draggedMilestone) return;

    const newMilestone: TimelineMilestone = {
      ...draggedMilestone,
      timeframe,
      status: 'pending'
    };

    const updatedMilestones = [...scenario.milestones, newMilestone];
    const updatedScenario = {
      ...scenario,
      milestones: updatedMilestones.sort((a, b) => a.timeframe - b.timeframe)
    };

    setScenario(updatedScenario);
    setDraggedMilestone(null);

    if (onScenarioUpdate) {
      onScenarioUpdate(updatedScenario);
    }
    if (onMilestoneSelection) {
      onMilestoneSelection(updatedScenario.milestones);
    }
  };

  const removeMilestone = (milestoneId: string) => {
    const updatedMilestones = scenario.milestones.filter(m => m.id !== milestoneId);
    const updatedScenario = { ...scenario, milestones: updatedMilestones };
    setScenario(updatedScenario);

    if (onScenarioUpdate) {
      onScenarioUpdate(updatedScenario);
    }
    if (onMilestoneSelection) {
      onMilestoneSelection(updatedScenario.milestones);
    }
  };

  const updateMilestoneStatus = (milestoneId: string, status: TimelineMilestone['status']) => {
    const updatedMilestones = scenario.milestones.map(m => 
      m.id === milestoneId ? { ...m, status } : m
    );
    const updatedScenario = { ...scenario, milestones: updatedMilestones };
    setScenario(updatedScenario);

    if (onScenarioUpdate) {
      onScenarioUpdate(updatedScenario);
    }
  };

  // Simulation functionality
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    
    const sortedMilestones = [...scenario.milestones].sort((a, b) => a.timeframe - b.timeframe);
    let currentIndex = 0;
    
    const simulateStep = () => {
      if (currentIndex < sortedMilestones.length) {
        const milestone = sortedMilestones[currentIndex];
        updateMilestoneStatus(milestone.id, 'in-progress');
        
        setTimeout(() => {
          updateMilestoneStatus(milestone.id, 'completed');
          currentIndex++;
          setSimulationProgress((currentIndex / sortedMilestones.length) * 100);
          
          if (currentIndex < sortedMilestones.length) {
            setTimeout(simulateStep, 800);
          } else {
            setIsSimulating(false);
          }
        }, 1200);
      }
    };
    
    simulateStep();
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationProgress(0);
    const resetMilestones = scenario.milestones.map(m => ({ ...m, status: 'pending' as const }));
    setScenario({ ...scenario, milestones: resetMilestones });
  };

  // Timeline week markers
  const weekMarkers = Array.from({ length: Math.ceil(scenario.duration / 4) }, (_, i) => (i + 1) * 4);

  const renderTimelineHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'build' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('build')}
          className="text-xs"
        >
          <Settings className="w-3 h-3 mr-1" />
          Build
        </Button>
        
        {enableSimulation && (
          <Button
            variant={viewMode === 'simulate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('simulate')}
            className="text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Simulate
          </Button>
        )}
        
        {enableComparison && (
          <Button
            variant={viewMode === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('compare')}
            className="text-xs"
          >
            <Layers className="w-3 h-3 mr-1" />
            Compare
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );

  const renderMilestoneLibrary = () => (
    <div className="space-y-4 mb-6">
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Available Milestones
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableMilestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            draggable
            onDragStart={() => handleDragStart(milestone)}
            className={cn(
              'p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing',
              milestoneTypeColors[milestone.type],
              'hover:shadow-lg transition-all duration-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{milestone.icon}</span>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm mb-1 truncate">{milestone.title}</h5>
                <p className="text-xs opacity-80 line-clamp-2">{milestone.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {milestone.type}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTimelineAxis = () => (
    <div className="relative">
      {/* Timeline background */}
      <div className={cn('h-2 rounded-full mb-8', theme.timeline)} />
      
      {/* Week markers */}
      <div className="relative">
        {weekMarkers.map((week) => (
          <div
            key={week}
            className="absolute top-0 transform -translate-x-1/2"
            style={{ left: `${(week / scenario.duration) * 100}%` }}
          >
            <div className="w-px h-6 bg-gray-300 mb-2" />
            <span className="text-xs text-gray-500 block transform -translate-x-1/2">
              Week {week}
            </span>
          </div>
        ))}
      </div>
      
      {/* Drop zones */}
      <div className="relative mt-8 h-20">
        {Array.from({ length: Math.ceil(scenario.duration / 2) }, (_, i) => {
          const week = (i + 1) * 2;
          return (
            <div
              key={week}
              className="absolute top-0 w-8 h-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              style={{ left: `${(week / scenario.duration) * 100}%` }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(week);
              }}
              onDragOver={(e) => e.preventDefault()}
              title={`Drop milestone at week ${week}`}
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400">
                {week}w
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPlacedMilestones = () => (
    <div className="relative mt-4">
      <AnimatePresence>
        {scenario.milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute"
            style={{ left: `${(milestone.timeframe / scenario.duration) * 100}%` }}
          >
            <div
              className={cn(
                'relative p-3 rounded-lg border-2 shadow-lg cursor-pointer transform -translate-x-1/2 max-w-48',
                milestoneTypeColors[milestone.type],
                statusColors[milestone.status],
                'hover:shadow-xl transition-all duration-200'
              )}
              onClick={() => setSelectedMilestone(milestone)}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{milestone.icon}</span>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm mb-1">{milestone.title}</h5>
                  <p className="text-xs opacity-80 mb-2">{milestone.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Week {milestone.timeframe}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      {milestone.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      )}
                      {milestone.status === 'blocked' && (
                        <AlertCircle className="w-3 h-3 text-red-600" />
                      )}
                      {milestone.status === 'in-progress' && (
                        <Zap className="w-3 h-3 text-blue-600 animate-pulse" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMilestone(milestone.id);
                        }}
                        className="w-4 h-4 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderSimulationControls = () => (
    <div className="flex items-center gap-4 mb-6">
      <Button
        onClick={startSimulation}
        disabled={isSimulating || scenario.milestones.length === 0}
        className="nm-button nm-button-primary"
      >
        {isSimulating ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Simulation
          </>
        )}
      </Button>
      
      <Button
        onClick={resetSimulation}
        variant="outline"
        disabled={isSimulating}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      
      {isSimulating && (
        <div className="flex-1 max-w-xs">
          <Progress value={simulationProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            Progress: {Math.round(simulationProgress)}%
          </p>
        </div>
      )}
    </div>
  );

  const renderScenarioComparison = () => (
    <div className="space-y-6">
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Scenario Comparison
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{scenario.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Duration:</span>
                <Badge variant="outline">{scenario.duration} weeks</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Milestones:</span>
                <Badge variant="outline">{scenario.milestones.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Est. ROI:</span>
                <span className="text-xs font-medium">{scenario.estimatedROI}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {sampleScenarios.map((sample) => (
          <Card key={sample.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{sample.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{sample.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Duration:</span>
                  <Badge variant="outline">{sample.duration} weeks</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Est. ROI:</span>
                  <span className="text-xs font-medium">{sample.estimatedROI}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => {
                    setScenario({ ...sample, milestones: [] });
                    setViewMode('build');
                  }}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Use as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMilestoneDetails = () => (
    selectedMilestone && (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-4 rounded-lg border shadow-lg"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedMilestone.icon}</span>
            <div>
              <h4 className="font-semibold text-lg">{selectedMilestone.title}</h4>
              <p className="text-sm text-gray-600">{selectedMilestone.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMilestone(null)}
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Type:</span>
              <Badge variant="outline" className="ml-2">
                {selectedMilestone.type}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-gray-500">Priority:</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-2",
                  selectedMilestone.priority === 'critical' && 'border-red-400 text-red-700',
                  selectedMilestone.priority === 'high' && 'border-orange-400 text-orange-700',
                  selectedMilestone.priority === 'medium' && 'border-yellow-400 text-yellow-700',
                  selectedMilestone.priority === 'low' && 'border-gray-400 text-gray-700'
                )}
              >
                {selectedMilestone.priority}
              </Badge>
            </div>
          </div>
          
          <div>
            <span className="text-xs text-gray-500">Status:</span>
            <div className="flex items-center gap-2 mt-1">
              {(['pending', 'in-progress', 'completed', 'blocked'] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedMilestone.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateMilestoneStatus(selectedMilestone.id, status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          
          {selectedMilestone.metrics && (
            <div>
              <h5 className="font-medium text-sm mb-2">Success Criteria:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                {selectedMilestone.metrics.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    )
  );

  return (
    <div className={cn('space-y-6', className)}>
      <Card className={cn('nm-card border-2', theme.accent)}>
        <CardHeader className="pb-4">
          {renderTimelineHeader()}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* View-specific content */}
          {viewMode === 'build' && (
            <>
              {renderMilestoneLibrary()}
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Timeline Builder (Drag milestones to timeline)
                </h4>
                
                {renderTimelineAxis()}
                {renderPlacedMilestones()}
              </div>
            </>
          )}
          
          {viewMode === 'simulate' && enableSimulation && (
            <>
              {renderSimulationControls()}
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Scenario Simulation
                </h4>
                
                {renderTimelineAxis()}
                {renderPlacedMilestones()}
              </div>
            </>
          )}
          
          {viewMode === 'compare' && enableComparison && renderScenarioComparison()}
        </CardContent>
      </Card>
      
      {/* Milestone details sidebar */}
      {selectedMilestone && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 z-50">
          {renderMilestoneDetails()}
        </div>
      )}
      
      {/* Scenario summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Scenario Overview</h4>
              <p className="text-sm text-gray-600">
                {scenario.milestones.length} milestones • {scenario.duration} weeks duration
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {scenario.milestones.filter(m => m.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {scenario.milestones.filter(m => m.status === 'in-progress').length}
                </div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {Math.round((scenario.milestones.filter(m => m.status === 'completed').length / Math.max(scenario.milestones.length, 1)) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineScenarioBuilder;