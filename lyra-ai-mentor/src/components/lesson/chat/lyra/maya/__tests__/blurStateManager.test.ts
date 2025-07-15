import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BlurStateManager, type BlurLevel } from '../blurStateManager';
import { type LyraNarrativeMessage } from '../types';

describe('BlurStateManager', () => {
  let manager: BlurStateManager;
  let onBlurChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onBlurChange = vi.fn();
    manager = new BlurStateManager({
      initialBlurLevel: 'full',
      transitionDuration: 100,
      onBlurChange
    });
  });

  afterEach(() => {
    manager.dispose();
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should initialize with default full blur', () => {
      const defaultManager = new BlurStateManager();
      expect(defaultManager.getCurrentLevel()).toBe('full');
    });

    it('should accept custom initial blur level', () => {
      const customManager = new BlurStateManager({ initialBlurLevel: 'partial' });
      expect(customManager.getCurrentLevel()).toBe('partial');
    });
  });

  describe('Message Triggers', () => {
    it('should transition to clear on blur-clear trigger', () => {
      const message: LyraNarrativeMessage = {
        id: 'test-1',
        content: 'Test message',
        type: 'lyra-unified',
        trigger: 'blur-clear'
      };

      const result = manager.handleMessageTrigger(message);
      
      expect(result.newBlurLevel).toBe('clear');
      expect(result.shouldAnimate).toBe(true);
      expect(manager.getCurrentLevel()).toBe('clear');
    });

    it('should transition to partial on blur-partial trigger', () => {
      const message: LyraNarrativeMessage = {
        id: 'test-2',
        content: 'Test message',
        type: 'lyra-unified',
        trigger: 'blur-partial'
      };

      const result = manager.handleMessageTrigger(message);
      
      expect(result.newBlurLevel).toBe('partial');
      expect(result.shouldAnimate).toBe(true);
    });

    it('should not transition without trigger', () => {
      const message: LyraNarrativeMessage = {
        id: 'test-3',
        content: 'Test message',
        type: 'lyra-unified'
      };

      const result = manager.handleMessageTrigger(message);
      
      expect(result.newBlurLevel).toBe('full');
      expect(result.shouldAnimate).toBe(false);
    });
  });

  describe('Narrative Completion', () => {
    it('should transition to clear on narrative complete', () => {
      const result = manager.handleNarrativeComplete();
      
      expect(result.newBlurLevel).toBe('clear');
      expect(result.shouldAnimate).toBe(true);
      expect(onBlurChange).toHaveBeenCalledWith('clear');
    });

    it('should not animate if already clear', () => {
      // First set to clear
      manager.handleNarrativeComplete();
      onBlurChange.mockClear();

      // Second call should not animate
      const result = manager.handleNarrativeComplete();
      
      expect(result.newBlurLevel).toBe('clear');
      expect(result.shouldAnimate).toBe(false);
      expect(onBlurChange).not.toHaveBeenCalled();
    });
  });

  describe('Fast Forward', () => {
    it('should immediately clear blur on fast forward', () => {
      const result = manager.handleFastForward();
      
      expect(result.newBlurLevel).toBe('clear');
      expect(result.shouldAnimate).toBe(false); // Should be immediate
      expect(manager.isInTransition()).toBe(false);
    });

    it('should work even if already transitioning', () => {
      // Start a transition
      manager.handleMessageTrigger({
        id: 'test',
        content: 'Test',
        type: 'lyra-unified',
        trigger: 'blur-partial'
      });
      
      expect(manager.isInTransition()).toBe(true);

      // Fast forward should override
      const result = manager.handleFastForward();
      expect(result.newBlurLevel).toBe('clear');
      expect(result.shouldAnimate).toBe(false);
    });
  });

  describe('Stage Changes', () => {
    it('should transition to new stage blur level', () => {
      const result = manager.handleStageChange('partial');
      
      expect(result.newBlurLevel).toBe('partial');
      expect(result.shouldAnimate).toBe(true);
    });

    it('should not transition if same level', () => {
      const result = manager.handleStageChange('full');
      
      expect(result.shouldAnimate).toBe(false);
      expect(onBlurChange).not.toHaveBeenCalled();
    });

    it('should handle undefined stage blur level', () => {
      const result = manager.handleStageChange(undefined);
      
      expect(result.newBlurLevel).toBe('full');
      expect(result.shouldAnimate).toBe(false);
    });
  });

  describe('Transition Management', () => {
    it('should track transition state', async () => {
      vi.useFakeTimers();
      
      expect(manager.isInTransition()).toBe(false);
      
      manager.handleMessageTrigger({
        id: 'test',
        content: 'Test',
        type: 'lyra-unified',
        trigger: 'blur-clear'
      });
      
      expect(manager.isInTransition()).toBe(true);
      
      // Advance past transition duration
      vi.advanceTimersByTime(100);
      
      expect(manager.isInTransition()).toBe(false);
      
      vi.useRealTimers();
    });

    it('should calculate appropriate transition delays', () => {
      // Full to clear should have delay
      const fullToClear = manager.handleNarrativeComplete();
      expect(fullToClear.transitionDelay).toBeGreaterThan(0);

      // Set to partial
      manager.handleStageChange('partial');
      
      // Partial transitions should be quicker
      const partialToClear = manager.handleNarrativeComplete();
      expect(partialToClear.transitionDelay).toBeLessThan(fullToClear.transitionDelay!);
    });
  });

  describe('Reset and Cleanup', () => {
    it('should reset to initial state', () => {
      // Change state
      manager.handleNarrativeComplete();
      expect(manager.getCurrentLevel()).toBe('clear');
      
      // Reset
      manager.reset();
      expect(manager.getCurrentLevel()).toBe('full');
      expect(manager.isInTransition()).toBe(false);
    });

    it('should clean up timeouts on dispose', () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      // Start a transition
      manager.handleNarrativeComplete();
      
      // Dispose should clear timeouts
      manager.dispose();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid transitions gracefully', () => {
      const transitions: BlurLevel[] = ['partial', 'clear', 'full', 'partial', 'clear'];
      
      transitions.forEach((level) => {
        manager.handleStageChange(level);
      });
      
      // Should end at the last requested level
      expect(manager.getCurrentLevel()).toBe('clear');
    });

    it('should handle redundant transitions', () => {
      // Set to clear
      manager.handleNarrativeComplete();
      onBlurChange.mockClear();
      
      // Multiple calls to same state
      manager.handleStageChange('clear');
      manager.handleStageChange('clear');
      manager.handleStageChange('clear');
      
      // Should not trigger multiple changes
      expect(onBlurChange).not.toHaveBeenCalled();
    });
  });
});