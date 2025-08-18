import { TimelineMilestone, TimelineScenario } from '@/components/ui/interaction-patterns/TimelineScenarioBuilder';

export interface TimelineUtilities {
  validateDependencies: (milestones: TimelineMilestone[]) => boolean;
  calculateCriticalPath: (milestones: TimelineMilestone[]) => TimelineMilestone[];
  optimizeTimeframes: (milestones: TimelineMilestone[]) => TimelineMilestone[];
  generateTimelineInsights: (scenario: TimelineScenario) => TimelineInsights;
  exportScenario: (scenario: TimelineScenario) => string;
  importScenario: (data: string) => TimelineScenario | null;
}

export interface TimelineInsights {
  totalDuration: number;
  criticalPath: string[];
  bottlenecks: string[];
  recommendations: string[];
  riskFactors: Array<{
    type: 'dependency' | 'resource' | 'timeline' | 'complexity';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>;
  progressMetrics: {
    onTrack: number;
    atRisk: number;
    blocked: number;
  };
}

// Leadership-specific milestone templates
export const leadershipMilestoneTemplates: Omit<TimelineMilestone, 'timeframe' | 'status'>[] = [
  // Challenge Milestones
  {
    id: 'assessment-360',
    title: '360-Degree Leadership Assessment',
    description: 'Comprehensive evaluation of current leadership capabilities',
    type: 'challenge',
    dependencies: [],
    priority: 'high',
    icon: '🎯',
    color: '#DC2626',
    metrics: {
      successCriteria: [
        'Complete 360-degree feedback collection',
        'Identify top 3 development areas',
        'Establish baseline leadership metrics'
      ],
      kpis: ['Feedback completion rate', 'Self-awareness score', 'Gap analysis accuracy']
    }
  },
  {
    id: 'difficult-conversations',
    title: 'Difficult Conversations Mastery',
    description: 'Learn to navigate challenging workplace discussions',
    type: 'challenge',
    dependencies: ['emotional-intelligence-foundation'],
    priority: 'high',
    icon: '💬',
    color: '#DC2626',
    metrics: {
      successCriteria: [
        'Practice 5 difficult conversation scenarios',
        'Receive feedback on communication style',
        'Demonstrate conflict resolution skills'
      ],
      kpis: ['Conversation success rate', 'Conflict resolution time', 'Team satisfaction']
    }
  },
  {
    id: 'team-conflict-resolution',
    title: 'Team Conflict Resolution',
    description: 'Address and resolve team dynamics issues',
    type: 'challenge',
    dependencies: ['difficult-conversations'],
    priority: 'medium',
    icon: '⚖️',
    color: '#DC2626'
  },

  // Skill Development Milestones
  {
    id: 'emotional-intelligence-foundation',
    title: 'Emotional Intelligence Foundation',
    description: 'Build self-awareness and empathy skills',
    type: 'skill',
    dependencies: [],
    priority: 'critical',
    icon: '🧠',
    color: '#2563EB',
    metrics: {
      successCriteria: [
        'Complete EQ assessment',
        'Practice daily self-reflection',
        'Demonstrate empathetic responses'
      ],
      kpis: ['EQ score improvement', 'Team empathy rating', 'Self-awareness index']
    }
  },
  {
    id: 'strategic-thinking-development',
    title: 'Strategic Thinking Development',
    description: 'Learn long-term planning and vision creation',
    type: 'skill',
    dependencies: ['emotional-intelligence-foundation'],
    priority: 'high',
    icon: '🎯',
    color: '#2563EB'
  },
  {
    id: 'delegation-mastery',
    title: 'Delegation Mastery',
    description: 'Effective task and authority delegation',
    type: 'skill',
    dependencies: ['trust-building'],
    priority: 'medium',
    icon: '🤝',
    color: '#2563EB'
  },
  {
    id: 'coaching-skills',
    title: 'Coaching & Mentoring Skills',
    description: 'Develop others through effective coaching',
    type: 'skill',
    dependencies: ['emotional-intelligence-foundation'],
    priority: 'medium',
    icon: '👥',
    color: '#2563EB'
  },

  // Goal Achievement Milestones
  {
    id: 'team-performance-boost',
    title: 'Team Performance 25% Improvement',
    description: 'Achieve measurable team productivity gains',
    type: 'goal',
    dependencies: ['delegation-mastery', 'coaching-skills'],
    priority: 'high',
    icon: '📈',
    color: '#16A34A',
    metrics: {
      successCriteria: [
        'Measure baseline team performance',
        'Implement performance improvement plan',
        'Achieve 25% productivity increase'
      ],
      kpis: ['Team productivity metrics', 'Goal achievement rate', 'Quality scores']
    }
  },
  {
    id: 'leadership-confidence',
    title: 'Leadership Confidence Building',
    description: 'Develop confidence in leadership decisions',
    type: 'goal',
    dependencies: ['emotional-intelligence-foundation', 'strategic-thinking-development'],
    priority: 'high',
    icon: '👑',
    color: '#16A34A'
  },
  {
    id: 'team-engagement-increase',
    title: 'Team Engagement Enhancement',
    description: 'Improve team motivation and satisfaction',
    type: 'goal',
    dependencies: ['coaching-skills', 'communication-excellence'],
    priority: 'medium',
    icon: '❤️',
    color: '#16A34A'
  },

  // Method/Process Milestones
  {
    id: 'ai-coaching-setup',
    title: 'AI-Enhanced Coaching Setup',
    description: 'Implement personalized AI coaching system',
    type: 'method',
    dependencies: [],
    priority: 'medium',
    icon: '🤖',
    color: '#7C3AED',
    metrics: {
      successCriteria: [
        'Set up AI coaching platform',
        'Complete initial AI assessment',
        'Establish coaching schedule'
      ],
      kpis: ['AI engagement frequency', 'Coaching completion rate', 'Skill improvement rate']
    }
  },
  {
    id: 'peer-learning-network',
    title: 'Peer Learning Network',
    description: 'Join leadership peer learning group',
    type: 'method',
    dependencies: [],
    priority: 'low',
    icon: '🤝',
    color: '#7C3AED'
  },
  {
    id: 'feedback-system-implementation',
    title: 'Continuous Feedback System',
    description: 'Establish regular feedback mechanisms',
    type: 'method',
    dependencies: ['team-performance-boost'],
    priority: 'medium',
    icon: '🔄',
    color: '#7C3AED'
  },

  // Outcome Milestones
  {
    id: 'promotion-readiness',
    title: 'Senior Leadership Promotion Readiness',
    description: 'Demonstrate readiness for next-level leadership',
    type: 'outcome',
    dependencies: ['leadership-confidence', 'team-performance-boost'],
    priority: 'low',
    icon: '🚀',
    color: '#F59E0B'
  },
  {
    id: 'culture-transformation',
    title: 'Team Culture Transformation',
    description: 'Create positive, high-performing team culture',
    type: 'outcome',
    dependencies: ['team-engagement-increase', 'communication-excellence'],
    priority: 'medium',
    icon: '🌟',
    color: '#F59E0B'
  },

  // Additional Supporting Skills
  {
    id: 'communication-excellence',
    title: 'Communication Excellence',
    description: 'Master clear, inspiring communication',
    type: 'skill',
    dependencies: ['emotional-intelligence-foundation'],
    priority: 'high',
    icon: '📢',
    color: '#2563EB'
  },
  {
    id: 'trust-building',
    title: 'Trust Building Techniques',
    description: 'Establish and maintain team trust',
    type: 'skill',
    dependencies: ['communication-excellence'],
    priority: 'high',
    icon: '🤝',
    color: '#2563EB'
  },
  {
    id: 'change-leadership',
    title: 'Change Leadership Capability',
    description: 'Lead teams through organizational change',
    type: 'skill',
    dependencies: ['strategic-thinking-development', 'communication-excellence'],
    priority: 'medium',
    icon: '🔄',
    color: '#2563EB'
  }
];

// Timeline utility functions
export const timelineUtils: TimelineUtilities = {
  validateDependencies: (milestones: TimelineMilestone[]): boolean => {
    const milestoneIds = new Set(milestones.map(m => m.id));
    
    for (const milestone of milestones) {
      for (const depId of milestone.dependencies) {
        if (!milestoneIds.has(depId)) {
          return false;
        }
        
        const dependency = milestones.find(m => m.id === depId);
        if (dependency && dependency.timeframe >= milestone.timeframe) {
          return false;
        }
      }
    }
    return true;
  },

  calculateCriticalPath: (milestones: TimelineMilestone[]): TimelineMilestone[] => {
    const sorted = [...milestones].sort((a, b) => a.timeframe - b.timeframe);
    const criticalPath: TimelineMilestone[] = [];
    
    // Simple critical path calculation - find longest dependency chain
    const visited = new Set<string>();
    
    const findLongestPath = (milestone: TimelineMilestone): number => {
      if (visited.has(milestone.id)) return 0;
      visited.add(milestone.id);
      
      if (milestone.dependencies.length === 0) {
        return milestone.timeframe;
      }
      
      let maxPath = 0;
      for (const depId of milestone.dependencies) {
        const dep = milestones.find(m => m.id === depId);
        if (dep) {
          maxPath = Math.max(maxPath, findLongestPath(dep));
        }
      }
      
      return maxPath + (milestone.timeframe - maxPath);
    };
    
    // Find milestones on critical path
    for (const milestone of sorted) {
      visited.clear();
      const pathLength = findLongestPath(milestone);
      if (pathLength === milestone.timeframe) {
        criticalPath.push(milestone);
      }
    }
    
    return criticalPath;
  },

  optimizeTimeframes: (milestones: TimelineMilestone[]): TimelineMilestone[] => {
    const optimized = [...milestones];
    
    // Sort by dependencies to process in order
    const sorted = optimized.sort((a, b) => a.dependencies.length - b.dependencies.length);
    
    for (const milestone of sorted) {
      if (milestone.dependencies.length > 0) {
        // Find latest dependency completion
        const latestDep = milestone.dependencies.reduce((latest, depId) => {
          const dep = optimized.find(m => m.id === depId);
          return dep && dep.timeframe > latest ? dep.timeframe : latest;
        }, 0);
        
        // Adjust timeframe if necessary
        if (milestone.timeframe <= latestDep) {
          milestone.timeframe = latestDep + 2; // Add buffer
        }
      }
    }
    
    return optimized;
  },

  generateTimelineInsights: (scenario: TimelineScenario): TimelineInsights => {
    const criticalPath = timelineUtils.calculateCriticalPath(scenario.milestones);
    const riskFactors: TimelineInsights['riskFactors'] = [];
    
    // Analyze dependencies
    if (!timelineUtils.validateDependencies(scenario.milestones)) {
      riskFactors.push({
        type: 'dependency',
        severity: 'high',
        description: 'Invalid dependency structure detected',
        suggestion: 'Review and fix dependency relationships'
      });
    }
    
    // Check for bottlenecks
    const weekCounts = scenario.milestones.reduce((acc, m) => {
      acc[m.timeframe] = (acc[m.timeframe] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const bottlenecks = Object.entries(weekCounts)
      .filter(([_, count]) => count > 3)
      .map(([week]) => `Week ${week}`);
    
    if (bottlenecks.length > 0) {
      riskFactors.push({
        type: 'timeline',
        severity: 'medium',
        description: `Multiple milestones concentrated in: ${bottlenecks.join(', ')}`,
        suggestion: 'Consider spreading milestones more evenly across timeline'
      });
    }
    
    // Calculate progress metrics
    const progressMetrics = {
      onTrack: scenario.milestones.filter(m => m.status === 'completed' || m.status === 'in-progress').length,
      atRisk: scenario.milestones.filter(m => m.priority === 'critical' && m.status === 'pending').length,
      blocked: scenario.milestones.filter(m => m.status === 'blocked').length
    };
    
    const recommendations: string[] = [];
    
    if (criticalPath.length > scenario.milestones.length * 0.6) {
      recommendations.push('Consider adding parallel tracks to reduce critical path dependency');
    }
    
    if (scenario.milestones.filter(m => m.type === 'skill').length < 3) {
      recommendations.push('Add more skill development milestones for well-rounded growth');
    }
    
    if (scenario.duration > 52) {
      recommendations.push('Consider breaking into phases for better managability');
    }
    
    return {
      totalDuration: scenario.duration,
      criticalPath: criticalPath.map(m => m.title),
      bottlenecks,
      recommendations,
      riskFactors,
      progressMetrics
    };
  },

  exportScenario: (scenario: TimelineScenario): string => {
    return JSON.stringify(scenario, null, 2);
  },

  importScenario: (data: string): TimelineScenario | null => {
    try {
      const parsed = JSON.parse(data);
      
      // Validate structure
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.milestones)) {
        return null;
      }
      
      return parsed as TimelineScenario;
    } catch {
      return null;
    }
  }
};

// Scenario templates for leadership development
export const scenarioTemplates: TimelineScenario[] = [
  {
    id: 'new-leader-fast-track',
    name: 'New Leader Fast Track',
    description: 'Accelerated 3-month leadership development for new managers',
    duration: 12,
    category: 'new-leader',
    estimatedROI: '200% improvement in leadership confidence',
    milestones: [
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'assessment-360')!,
        timeframe: 1,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'emotional-intelligence-foundation')!,
        timeframe: 2,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'communication-excellence')!,
        timeframe: 4,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'difficult-conversations')!,
        timeframe: 6,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'trust-building')!,
        timeframe: 8,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'leadership-confidence')!,
        timeframe: 10,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'ai-coaching-setup')!,
        timeframe: 12,
        status: 'pending'
      }
    ]
  },
  {
    id: 'comprehensive-leadership',
    name: 'Comprehensive Leadership Development',
    description: 'Complete 12-month leadership transformation program',
    duration: 52,
    category: 'skill-development',
    estimatedROI: '350% ROI in leadership effectiveness and team performance',
    milestones: [
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'assessment-360')!,
        timeframe: 2,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'emotional-intelligence-foundation')!,
        timeframe: 4,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'ai-coaching-setup')!,
        timeframe: 6,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'communication-excellence')!,
        timeframe: 8,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'strategic-thinking-development')!,
        timeframe: 12,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'trust-building')!,
        timeframe: 16,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'difficult-conversations')!,
        timeframe: 20,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'delegation-mastery')!,
        timeframe: 24,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'coaching-skills')!,
        timeframe: 28,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'change-leadership')!,
        timeframe: 32,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'team-performance-boost')!,
        timeframe: 36,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'leadership-confidence')!,
        timeframe: 40,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'team-engagement-increase')!,
        timeframe: 44,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'culture-transformation')!,
        timeframe: 48,
        status: 'pending'
      },
      {
        ...leadershipMilestoneTemplates.find(t => t.id === 'promotion-readiness')!,
        timeframe: 52,
        status: 'pending'
      }
    ]
  }
];

export default timelineUtils;