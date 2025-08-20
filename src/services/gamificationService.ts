import { supabase } from '@/integrations/supabase/client';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'character' | 'skill' | 'milestone' | 'special';
  characterId?: string;
  requirement: BadgeRequirement;
  unlockedAt?: Date;
  progress?: number;
}

export interface BadgeRequirement {
  type: 'component_completion' | 'time_spent' | 'streak' | 'skill_mastery' | 'first_action';
  componentIds?: string[];
  minimumTime?: number;
  streakDays?: number;
  skillId?: string;
  action?: string;
}

export interface ProgressData {
  userId: string;
  completedComponents: string[];
  timeSpentByComponent: Record<string, number>; // component ID -> minutes
  skillsMastered: string[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  totalTimeSpent: number; // total minutes
  badges: Badge[];
  level: number;
  experience: number;
  nextLevelExperience: number;
}

export interface ComponentProgress {
  componentId: string;
  characterId: string;
  completedAt?: Date;
  timeSpent: number; // minutes
  attempts: number;
  score?: number;
}

class GamificationService {
  private static instance: GamificationService;
  private progressData: ProgressData | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;
  private sessionStartTime: Date = new Date();
  private currentComponentStartTime: Map<string, Date> = new Map();

  private constructor() {
    this.loadProgress();
  }

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Define all available badges
  private readonly BADGES: Badge[] = [
    // First action badges
    {
      id: 'first_ai_prompt',
      name: 'First AI Prompt',
      description: 'Complete your first AI exercise',
      icon: '🎯',
      category: 'milestone',
      requirement: { type: 'first_action', action: 'complete_exercise' }
    },
    
    // Character mastery badges
    {
      id: 'communication_pro',
      name: 'Communication Pro',
      description: 'Master all Maya\'s communication tools',
      icon: '💬',
      category: 'character',
      characterId: 'maya',
      requirement: { 
        type: 'component_completion',
        componentIds: [
          'MayaEmailComposer', 'MayaCommunicationCoach', 'MayaConfidenceBuilder',
          'MayaSubjectLineWorkshop', 'MayaTemplateLibrary', 'MayaToneChecker'
        ]
      }
    },
    {
      id: 'data_storyteller',
      name: 'Data Storyteller',
      description: 'Complete all of David\'s data visualization components',
      icon: '📊',
      category: 'character',
      characterId: 'david',
      requirement: {
        type: 'component_completion',
        componentIds: [
          'DavidDataStoryFinder', 'DavidDataVisualizer', 'DavidInsightGenerator',
          'DavidDataNarrator', 'DavidPresentationCoach', 'DavidQuickCharts'
        ]
      }
    },
    {
      id: 'automation_wizard',
      name: 'Automation Wizard',
      description: 'Finish all of Rachel\'s automation tools',
      icon: '🔮',
      category: 'character',
      characterId: 'rachel',
      requirement: {
        type: 'component_completion',
        componentIds: [
          'RachelAutomationVision', 'RachelProcessMapper', 'RachelTaskAutomator',
          'RachelWorkflowOptimizer', 'RachelEfficiencyAnalyzer', 'RachelQuickAutomation'
        ]
      }
    },
    {
      id: 'change_leader',
      name: 'Change Leader',
      description: 'Complete Alex\'s change management journey',
      icon: '🚀',
      category: 'character',
      characterId: 'alex',
      requirement: {
        type: 'component_completion',
        componentIds: [
          'AlexChangeStrategy', 'AlexStrategicPlanning', 'AlexLeadershipDevelopment',
          'AlexDecisionFramework', 'AlexOrganizationalHealth', 'AlexQuickStrategy'
        ]
      }
    },
    {
      id: 'voice_pioneer',
      name: 'Voice Pioneer',
      description: 'Master Sofia\'s voice and storytelling features',
      icon: '🎤',
      category: 'character',
      characterId: 'sofia',
      requirement: {
        type: 'component_completion',
        componentIds: [
          'SofiaVoiceDiscovery', 'SofiaStoryCreator', 'SofiaAuthenticityChecker',
          'SofiaNarrativeBuilder', 'SofiaVoiceCoach', 'SofiaVoiceRecorder'
        ]
      }
    },

    // Milestone badges
    {
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      description: 'Spend 60 minutes learning with AI',
      icon: '⏰',
      category: 'milestone',
      requirement: { type: 'time_spent', minimumTime: 60 }
    },
    {
      id: 'consistent_learner',
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'milestone',
      requirement: { type: 'streak', streakDays: 7 }
    },
    {
      id: 'ai_explorer',
      name: 'AI Explorer',
      description: 'Try components from all 5 characters',
      icon: '🗺️',
      category: 'milestone',
      requirement: {
        type: 'component_completion',
        componentIds: ['maya_any', 'david_any', 'rachel_any', 'alex_any', 'sofia_any']
      }
    },
    {
      id: 'quick_learner',
      name: 'Quick Learner',
      description: 'Complete 10 components',
      icon: '⚡',
      category: 'milestone',
      requirement: { type: 'component_completion', componentIds: Array(10).fill('any') }
    },
    {
      id: 'master_learner',
      name: 'Master Learner',
      description: 'Complete 25 components',
      icon: '🎓',
      category: 'milestone',
      requirement: { type: 'component_completion', componentIds: Array(25).fill('any') }
    }
  ];

  async loadProgress(): Promise<void> {
    try {
      // Fall back to localStorage
      const savedProgress = localStorage.getItem('lyra_gamification_progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        this.progressData = {
          ...parsed,
          lastActiveDate: new Date(parsed.lastActiveDate)
        };
      } else {
        // Initialize new progress
        this.progressData = this.createNewProgress('anonymous');
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      this.progressData = this.createNewProgress('anonymous');
    }
  }

  private createNewProgress(userId: string): ProgressData {
    return {
      userId,
      completedComponents: [],
      timeSpentByComponent: {},
      skillsMastered: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date(),
      totalTimeSpent: 0,
      badges: [],
      level: 1,
      experience: 0,
      nextLevelExperience: 100
    };
  }

  async saveProgress(): Promise<void> {
    if (!this.progressData) return;

    // Clear any pending save
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Debounce saves
    this.saveTimeout = setTimeout(async () => {
      try {
        // Save to localStorage immediately
        localStorage.setItem('lyra_gamification_progress', JSON.stringify(this.progressData));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }, 1000);
  }

  startComponent(componentId: string): void {
    this.currentComponentStartTime.set(componentId, new Date());
    this.updateStreak();
  }

  completeComponent(componentId: string, score?: number): ComponentProgress {
    if (!this.progressData) {
      this.progressData = this.createNewProgress('anonymous');
    }

    const startTime = this.currentComponentStartTime.get(componentId);
    const timeSpent = startTime 
      ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) 
      : 0;

    // Update progress data
    if (!this.progressData.completedComponents.includes(componentId)) {
      this.progressData.completedComponents.push(componentId);
      this.addExperience(50); // Base XP for completion
    }

    // Update time tracking
    this.progressData.timeSpentByComponent[componentId] = 
      (this.progressData.timeSpentByComponent[componentId] || 0) + timeSpent;
    this.progressData.totalTimeSpent += timeSpent;

    // Check for new badges
    this.checkBadges();

    // Save progress
    this.saveProgress();

    // Clean up
    this.currentComponentStartTime.delete(componentId);

    return {
      componentId,
      characterId: this.getCharacterFromComponent(componentId),
      completedAt: new Date(),
      timeSpent,
      attempts: 1,
      score
    };
  }

  private getCharacterFromComponent(componentId: string): string {
    if (componentId.toLowerCase().includes('maya')) return 'maya';
    if (componentId.toLowerCase().includes('david')) return 'david';
    if (componentId.toLowerCase().includes('rachel')) return 'rachel';
    if (componentId.toLowerCase().includes('alex')) return 'alex';
    if (componentId.toLowerCase().includes('sofia')) return 'sofia';
    return 'unknown';
  }

  private updateStreak(): void {
    if (!this.progressData) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(this.progressData.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no change
    } else if (daysDiff === 1) {
      // Next day, increment streak
      this.progressData.currentStreak++;
      this.progressData.longestStreak = Math.max(
        this.progressData.currentStreak, 
        this.progressData.longestStreak
      );
    } else {
      // Streak broken
      this.progressData.currentStreak = 1;
    }

    this.progressData.lastActiveDate = new Date();
  }

  private checkBadges(): void {
    if (!this.progressData) return;

    this.BADGES.forEach(badge => {
      // Skip if already unlocked
      if (this.progressData!.badges.some(b => b.id === badge.id)) return;

      let unlocked = false;
      const progress = this.calculateBadgeProgress(badge);

      switch (badge.requirement.type) {
        case 'component_completion':
          unlocked = progress >= 1;
          break;
        case 'time_spent':
          unlocked = this.progressData.totalTimeSpent >= (badge.requirement.minimumTime || 0);
          break;
        case 'streak':
          unlocked = this.progressData.currentStreak >= (badge.requirement.streakDays || 0);
          break;
        case 'first_action':
          unlocked = this.progressData.completedComponents.length > 0;
          break;
      }

      if (unlocked) {
        const unlockedBadge = { ...badge, unlockedAt: new Date(), progress: 1 };
        this.progressData.badges.push(unlockedBadge);
        this.addExperience(100); // XP for badge unlock
        this.onBadgeUnlocked(unlockedBadge);
      }
    });
  }

  private calculateBadgeProgress(badge: Badge): number {
    if (!this.progressData) return 0;

    switch (badge.requirement.type) {
      case 'component_completion':
        if (!badge.requirement.componentIds) return 0;
        
        // Handle special cases
        if (badge.requirement.componentIds.includes('any')) {
          return Math.min(1, this.progressData.completedComponents.length / badge.requirement.componentIds.length);
        }
        
        // Check character-specific components
        if (badge.requirement.componentIds.some(id => id.includes('_any'))) {
          const characterCounts: Record<string, number> = {};
          this.progressData.completedComponents.forEach(comp => {
            const char = this.getCharacterFromComponent(comp);
            characterCounts[char] = (characterCounts[char] || 0) + 1;
          });
          const requiredChars = (badge.requirement.componentIds || []).filter(id => id.includes('_any'));
          const hasAllChars = requiredChars.every(req => {
            const char = req.replace('_any', '');
            return characterCounts[char] > 0;
          });
          return hasAllChars ? 1 : (requiredChars || []).filter(req => {
            const char = req.replace('_any', '');
            return characterCounts[char] > 0;
          }).length / requiredChars.length;
        }
        
        // Regular component completion
        const completed = (badge.requirement.componentIds || []).filter(id => 
          this.progressData!.completedComponents.includes(id)
        ).length;
        return completed / badge.requirement.componentIds.length;

      case 'time_spent':
        return Math.min(1, this.progressData.totalTimeSpent / (badge.requirement.minimumTime || 1));

      case 'streak':
        return Math.min(1, this.progressData.currentStreak / (badge.requirement.streakDays || 1));

      case 'first_action':
        return this.progressData.completedComponents.length > 0 ? 1 : 0;

      default:
        return 0;
    }
  }

  private addExperience(amount: number): void {
    if (!this.progressData) return;

    this.progressData.experience += amount;

    // Check for level up
    while (this.progressData.experience >= this.progressData.nextLevelExperience) {
      this.progressData.experience -= this.progressData.nextLevelExperience;
      this.progressData.level++;
      this.progressData.nextLevelExperience = this.calculateNextLevelXP(this.progressData.level);
      this.onLevelUp(this.progressData.level);
    }
  }

  private calculateNextLevelXP(level: number): number {
    // Exponential growth formula
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private onBadgeUnlocked(badge: Badge): void {
    // Trigger notification/celebration
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('badge-unlocked', { detail: badge }));
    }
  }

  private onLevelUp(level: number): void {
    // Trigger notification/celebration
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('level-up', { detail: { level } }));
    }
  }

  getProgress(): ProgressData | null {
    return this.progressData;
  }

  getBadges(): Badge[] {
    return this.BADGES;
  }

  getUnlockedBadges(): Badge[] {
    return this.progressData?.badges || [];
  }

  getComponentProgress(componentId: string): ComponentProgress | null {
    if (!this.progressData) return null;

    const completed = this.progressData.completedComponents.includes(componentId);
    const timeSpent = this.progressData.timeSpentByComponent[componentId] || 0;

    if (!completed && timeSpent === 0) return null;

    return {
      componentId,
      characterId: this.getCharacterFromComponent(componentId),
      completedAt: completed ? new Date() : undefined,
      timeSpent,
      attempts: completed ? 1 : 0
    };
  }

  getSuggestedNextComponent(): string | null {
    if (!this.progressData) return null;

    const allComponents = [
      'MayaEmailComposer', 'MayaCommunicationCoach', 'MayaConfidenceBuilder',
      'DavidDataStoryFinder', 'DavidDataVisualizer', 'DavidInsightGenerator',
      'RachelAutomationVision', 'RachelProcessMapper', 'RachelTaskAutomator',
      'AlexChangeStrategy', 'AlexStrategicPlanning', 'AlexLeadershipDevelopment',
      'SofiaVoiceDiscovery', 'SofiaStoryCreator', 'SofiaAuthenticityChecker'
    ];

    const incompleteComponents = allComponents.filter(
      comp => !this.progressData!.completedComponents.includes(comp)
    );

    return incompleteComponents.length > 0 ? incompleteComponents[0] : null;
  }

  resetProgress(): void {
    this.progressData = this.createNewProgress('anonymous');
    this.saveProgress();
  }
}

export const gamificationService = GamificationService.getInstance();