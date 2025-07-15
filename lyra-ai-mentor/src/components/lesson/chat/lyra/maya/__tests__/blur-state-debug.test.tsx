import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LyraNarratedMayaSideBySideComplete from '../LyraNarratedMayaSideBySideComplete';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock framer-motion to capture blur state changes
const mockMotionDiv = vi.fn();
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => {
      mockMotionDiv(props);
      return React.createElement('div', props, props.children);
    },
    button: ({ children, className, onClick, ...props }: any) => 
      React.createElement('button', { className, onClick, ...props }, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('Maya Blur State Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should track blur state changes through narrative completion', async () => {
    console.log('🔍 Testing blur state transitions...');
    
    const { container } = render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    console.log('📋 Initial render complete');

    // Check initial blur state
    let blurOverlay = container.querySelector('.absolute.inset-0.pointer-events-none');
    if (blurOverlay) {
      console.log('📋 Initial blur classes:', blurOverlay.className);
    }

    // Fast forward through narrative messages to trigger blur-clear
    await act(async () => {
      console.log('📋 Advancing timers to complete narrative...');
      // Initial delay + all message delays + typewriter time
      vi.advanceTimersByTime(500); // Initial delay
      vi.advanceTimersByTime(6000); // First message
      vi.advanceTimersByTime(6000); // Second message  
      vi.advanceTimersByTime(12000); // Third message with blur-clear trigger
      vi.advanceTimersByTime(1000); // Completion callback delay
    });

    // Check blur state after narrative completion
    await waitFor(() => {
      blurOverlay = container.querySelector('.absolute.inset-0.pointer-events-none');
      if (blurOverlay) {
        console.log('📋 Final blur classes:', blurOverlay.className);
        
        // Check if blur-clear worked
        const hasBackdropBlurNone = blurOverlay.classList.contains('backdrop-blur-none');
        const hasNoBlur = !blurOverlay.className.includes('backdrop-blur-xl') && 
                         !blurOverlay.className.includes('backdrop-blur-sm');
        
        console.log('📋 Has backdrop-blur-none:', hasBackdropBlurNone);
        console.log('📋 Has no blur classes:', hasNoBlur);
        
        if (hasBackdropBlurNone || hasNoBlur) {
          console.log('✅ Blur cleared successfully');
        } else {
          console.log('❌ Blur not cleared - still blurred');
        }
      } else {
        console.log('❌ Blur overlay not found');
      }
    });

    // Check motion.div calls to see backdrop filter changes
    const blurRelatedCalls = mockMotionDiv.mock.calls.filter(call => 
      call[0]?.className?.includes('backdrop-blur') || 
      call[0]?.animate?.backdropFilter
    );
    
    console.log('📋 Motion div blur calls:', blurRelatedCalls.length);
    blurRelatedCalls.forEach((call, index) => {
      const props = call[0];
      console.log(`📋 Motion call ${index}:`, {
        className: props.className,
        animate: props.animate?.backdropFilter,
        initial: props.initial?.backdropFilter
      });
    });
  });

  it('should verify narrative completion callback is triggered', async () => {
    console.log('🔍 Testing narrative completion callback...');
    
    let narrativeCompleteCallbacks = 0;
    let setPanelBlurLevelCalls: string[] = [];

    // Spy on console.log to capture debug info
    const originalLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('narrative completion')) {
        narrativeCompleteCallbacks++;
      }
      if (message.includes('setPanelBlurLevel')) {
        setPanelBlurLevelCalls.push(message);
      }
      originalLog(...args);
    };

    try {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );

      await act(async () => {
        // Advance through all narrative messages
        vi.advanceTimersByTime(500 + 6000 + 6000 + 12000 + 1000);
      });

      console.log('📋 Narrative completion callbacks triggered:', narrativeCompleteCallbacks);
      console.log('📋 SetPanelBlurLevel calls:', setPanelBlurLevelCalls);

    } finally {
      console.log = originalLog;
    }
  });

  it('should verify blur trigger in message processing', async () => {
    console.log('🔍 Testing message trigger processing...');
    
    render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Check the third message (which has blur-clear trigger) 
    await act(async () => {
      vi.advanceTimersByTime(500); // Initial delay
      vi.advanceTimersByTime(6000); // First message types out
      vi.advanceTimersByTime(6000); // Second message types out
      
      // Now the third message should start typing with blur-clear trigger
      console.log('📋 Starting third message with blur-clear trigger...');
      vi.advanceTimersByTime(6000); // Third message content
      
      // The trigger should happen when typing completes
      console.log('📋 Third message typing should be complete, trigger should fire...');
      vi.advanceTimersByTime(1000); // Allow trigger to process
    });

    // Verify final state
    await waitFor(() => {
      console.log('📋 Checking final blur state after trigger...');
      // The component should now be unblurred
    });
  });
});