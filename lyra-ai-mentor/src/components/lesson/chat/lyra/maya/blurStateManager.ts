import React from 'react';
import { type LyraNarrativeMessage } from './types';

export type BlurLevel = 'full' | 'partial' | 'clear';

export interface BlurStateConfig {
  initialBlurLevel?: BlurLevel;
  transitionDuration?: number;
  onBlurChange?: (level: BlurLevel) => void;
}

export interface BlurTransitionResult {
  newBlurLevel: BlurLevel;
  shouldAnimate: boolean;
  transitionDelay?: number;
}

/**
 * Manages blur state transitions for the Maya component
 * Ensures smooth transitions and handles narrative completion triggers
 */
export class BlurStateManager {
  private currentLevel: BlurLevel;
  private isTransitioning: boolean = false;
  private transitionDuration: number;
  private onBlurChange?: (level: BlurLevel) => void;
  private narrativeCompleteTimeout?: NodeJS.Timeout;
  private transitionTimeout?: NodeJS.Timeout;

  constructor(config: BlurStateConfig = {}) {
    this.currentLevel = config.initialBlurLevel || 'full';
    this.transitionDuration = config.transitionDuration || 1500;
    this.onBlurChange = config.onBlurChange;
  }

  /**
   * Get current blur level
   */
  getCurrentLevel(): BlurLevel {
    return this.currentLevel;
  }

  /**
   * Check if currently transitioning
   */
  isInTransition(): boolean {
    return this.isTransitioning;
  }

  /**
   * Handle message trigger events
   */
  handleMessageTrigger(message: LyraNarrativeMessage): BlurTransitionResult {
    if (message.trigger === 'blur-clear') {
      return this.transitionTo('clear');
    } else if (message.trigger === 'blur-partial') {
      return this.transitionTo('partial');
    }
    
    return {
      newBlurLevel: this.currentLevel,
      shouldAnimate: false
    };
  }

  /**
   * Handle narrative completion
   */
  handleNarrativeComplete(): BlurTransitionResult {
    // Clear any pending timeouts
    if (this.narrativeCompleteTimeout) {
      clearTimeout(this.narrativeCompleteTimeout);
    }

    // If already clear, no need to transition
    if (this.currentLevel === 'clear') {
      return {
        newBlurLevel: 'clear',
        shouldAnimate: false
      };
    }

    // Transition to clear state
    return this.transitionTo('clear');
  }

  /**
   * Handle fast forward action
   */
  handleFastForward(): BlurTransitionResult {
    // Immediately clear blur on fast forward
    return this.transitionTo('clear', { immediate: true });
  }

  /**
   * Handle stage change
   */
  handleStageChange(newStageBlurLevel?: BlurLevel): BlurTransitionResult {
    if (!newStageBlurLevel) {
      return {
        newBlurLevel: this.currentLevel,
        shouldAnimate: false
      };
    }

    return this.transitionTo(newStageBlurLevel);
  }

  /**
   * Transition to a new blur level
   */
  private transitionTo(
    targetLevel: BlurLevel, 
    options: { immediate?: boolean } = {}
  ): BlurTransitionResult {
    // Prevent redundant transitions
    if (this.currentLevel === targetLevel && !options.immediate) {
      return {
        newBlurLevel: targetLevel,
        shouldAnimate: false
      };
    }

    // Update state
    const previousLevel = this.currentLevel;
    this.currentLevel = targetLevel;
    this.isTransitioning = !options.immediate;

    // Set transition complete timeout
    if (!options.immediate) {
      // Clear any existing timeout
      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
      }
      
      this.transitionTimeout = setTimeout(() => {
        this.isTransitioning = false;
        this.transitionTimeout = undefined;
      }, this.transitionDuration);
    }

    // Notify change handler
    if (this.onBlurChange) {
      this.onBlurChange(targetLevel);
    }

    return {
      newBlurLevel: targetLevel,
      shouldAnimate: !options.immediate,
      transitionDelay: this.getTransitionDelay(previousLevel, targetLevel)
    };
  }

  /**
   * Calculate appropriate transition delay
   */
  private getTransitionDelay(from: BlurLevel, to: BlurLevel): number {
    // Full to clear needs more time for dramatic effect
    if (from === 'full' && to === 'clear') {
      return 300;
    }
    
    // Partial transitions are quicker
    if (from === 'partial' || to === 'partial') {
      return 150;
    }

    return 0;
  }

  /**
   * Reset blur state
   */
  reset(): void {
    this.currentLevel = 'full';
    this.isTransitioning = false;
    if (this.narrativeCompleteTimeout) {
      clearTimeout(this.narrativeCompleteTimeout);
    }
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.narrativeCompleteTimeout) {
      clearTimeout(this.narrativeCompleteTimeout);
    }
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
  }
}

/**
 * Hook for using blur state manager in React components
 */
export function useBlurStateManager(config?: BlurStateConfig) {
  const [manager] = React.useState(() => new BlurStateManager(config));
  
  React.useEffect(() => {
    return () => {
      manager.dispose();
    };
  }, [manager]);

  return manager;
}