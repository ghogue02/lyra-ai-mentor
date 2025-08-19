/**
 * Component-Level Performance Profiler
 * Tracks render performance, lifecycle timing, and component-specific metrics
 */

import React from 'react';
import { PerformanceMetrics } from '../types';

interface ComponentPerformanceData {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  avgRenderTime: number;
  slowestRender: number;
  fastestRender: number;
  lastRenderTime: Date;
  props: Record<string, any>;
  state: Record<string, any>;
  lifecycle: {
    mount: number;
    update: number;
    unmount: number;
  };
  errors: number;
  warnings: number;
}

export class ComponentProfiler {
  private static instance: ComponentProfiler;
  private profiles: Map<string, ComponentPerformanceData> = new Map();
  private isEnabled = false;
  private observers: Map<string, PerformanceObserver> = new Map();
  private renderStartTimes: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): ComponentProfiler {
    if (!ComponentProfiler.instance) {
      ComponentProfiler.instance = new ComponentProfiler();
    }
    return ComponentProfiler.instance;
  }

  /**
   * Enable component profiling
   */
  enable(): void {
    this.isEnabled = true;
    this.setupPerformanceObservers();
    console.log('📊 Component profiling enabled');
  }

  /**
   * Disable component profiling
   */
  disable(): void {
    this.isEnabled = false;
    this.cleanup();
    console.log('📊 Component profiling disabled');
  }

  /**
   * Start profiling a component render
   */
  startRender(componentName: string, props?: any, state?: any): string {
    if (!this.isEnabled) return '';

    const renderKey = `${componentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    this.renderStartTimes.set(renderKey, startTime);
    
    // Mark the start in performance timeline
    performance.mark(`${componentName}-render-start`);
    
    // Initialize or update component profile
    let profile = this.profiles.get(componentName);
    if (!profile) {
      profile = {
        componentName,
        renderCount: 0,
        totalRenderTime: 0,
        avgRenderTime: 0,
        slowestRender: 0,
        fastestRender: Infinity,
        lastRenderTime: new Date(),
        props: {},
        state: {},
        lifecycle: { mount: 0, update: 0, unmount: 0 },
        errors: 0,
        warnings: 0
      };
      this.profiles.set(componentName, profile);
    }

    // Update props and state snapshots
    if (props) profile.props = { ...props };
    if (state) profile.state = { ...state };

    return renderKey;
  }

  /**
   * End profiling a component render
   */
  endRender(componentName: string, renderKey: string): number {
    if (!this.isEnabled || !renderKey) return 0;

    const startTime = this.renderStartTimes.get(renderKey);
    if (!startTime) return 0;

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Mark the end in performance timeline
    performance.mark(`${componentName}-render-end`);
    performance.measure(
      `${componentName}-render`,
      `${componentName}-render-start`,
      `${componentName}-render-end`
    );

    // Update profile
    const profile = this.profiles.get(componentName);
    if (profile) {
      profile.renderCount++;
      profile.totalRenderTime += renderTime;
      profile.avgRenderTime = profile.totalRenderTime / profile.renderCount;
      profile.slowestRender = Math.max(profile.slowestRender, renderTime);
      profile.fastestRender = Math.min(profile.fastestRender, renderTime);
      profile.lastRenderTime = new Date();
    }

    // Clean up
    this.renderStartTimes.delete(renderKey);

    // Check for performance issues
    this.analyzeRenderPerformance(componentName, renderTime);

    return renderTime;
  }

  /**
   * Track component lifecycle events
   */
  trackLifecycle(componentName: string, event: 'mount' | 'update' | 'unmount'): void {
    if (!this.isEnabled) return;

    const profile = this.profiles.get(componentName);
    if (profile) {
      profile.lifecycle[event]++;
    }

    performance.mark(`${componentName}-${event}`);
  }

  /**
   * Track component errors
   */
  trackError(componentName: string, error: Error): void {
    if (!this.isEnabled) return;

    const profile = this.profiles.get(componentName);
    if (profile) {
      profile.errors++;
    }

    console.warn(`Component error in ${componentName}:`, error);
  }

  /**
   * Track component warnings
   */
  trackWarning(componentName: string, warning: string): void {
    if (!this.isEnabled) return;

    const profile = this.profiles.get(componentName);
    if (profile) {
      profile.warnings++;
    }

    console.warn(`Component warning in ${componentName}:`, warning);
  }

  /**
   * Get performance data for a specific component
   */
  getComponentProfile(componentName: string): ComponentPerformanceData | undefined {
    return this.profiles.get(componentName);
  }

  /**
   * Get all component profiles
   */
  getAllProfiles(): ComponentPerformanceData[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => b.avgRenderTime - a.avgRenderTime);
  }

  /**
   * Get top slow components
   */
  getSlowComponents(limit: number = 10): ComponentPerformanceData[] {
    return this.getAllProfiles()
      .filter(profile => profile.renderCount > 5) // Only components with meaningful data
      .slice(0, limit);
  }

  /**
   * Get components with high error rates
   */
  getProblematicComponents(): ComponentPerformanceData[] {
    return this.getAllProfiles()
      .filter(profile => profile.errors > 0 || profile.warnings > 5)
      .sort((a, b) => (b.errors + b.warnings) - (a.errors + a.warnings));
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalComponents: number;
    totalRenders: number;
    avgRenderTime: number;
    slowestComponent: string;
    fastestComponent: string;
    totalErrors: number;
    totalWarnings: number;
    memoryImpact: number;
  } {
    const profiles = this.getAllProfiles();
    
    if (profiles.length === 0) {
      return {
        totalComponents: 0,
        totalRenders: 0,
        avgRenderTime: 0,
        slowestComponent: '',
        fastestComponent: '',
        totalErrors: 0,
        totalWarnings: 0,
        memoryImpact: 0
      };
    }

    const totalRenders = profiles.reduce((sum, p) => sum + p.renderCount, 0);
    const totalRenderTime = profiles.reduce((sum, p) => sum + p.totalRenderTime, 0);
    const totalErrors = profiles.reduce((sum, p) => sum + p.errors, 0);
    const totalWarnings = profiles.reduce((sum, p) => sum + p.warnings, 0);
    
    const slowestComponent = profiles.reduce((slowest, current) => 
      current.avgRenderTime > slowest.avgRenderTime ? current : slowest
    );
    
    const fastestComponent = profiles.reduce((fastest, current) => 
      current.avgRenderTime < fastest.avgRenderTime ? current : fastest
    );

    return {
      totalComponents: profiles.length,
      totalRenders,
      avgRenderTime: totalRenderTime / totalRenders,
      slowestComponent: slowestComponent.componentName,
      fastestComponent: fastestComponent.componentName,
      totalErrors,
      totalWarnings,
      memoryImpact: this.estimateMemoryImpact()
    };
  }

  /**
   * Clear all profiles
   */
  clearProfiles(): void {
    this.profiles.clear();
    this.renderStartTimes.clear();
    console.log('📊 Component profiles cleared');
  }

  /**
   * Export profile data
   */
  exportProfiles(): string {
    const data = {
      profiles: Array.from(this.profiles.values()),
      summary: this.getPerformanceSummary(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Private methods
  private setupPerformanceObservers(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.includes('-render')) {
            this.processMeasurement(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
      this.observers.set('main', observer);
    } catch (error) {
      console.warn('Failed to setup component performance observers:', error);
    }
  }

  private processMeasurement(entry: PerformanceEntry): void {
    // Additional processing of performance measurements
    // This can be used for more detailed analysis
  }

  private analyzeRenderPerformance(componentName: string, renderTime: number): void {
    const profile = this.profiles.get(componentName);
    if (!profile) return;

    // Check for performance issues
    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Check for unusual render time spikes
    if (profile.renderCount > 10 && renderTime > profile.avgRenderTime * 3) {
      console.warn(`Render time spike in ${componentName}: ${renderTime.toFixed(2)}ms (avg: ${profile.avgRenderTime.toFixed(2)}ms)`);
    }

    // Check for excessive re-renders
    if (profile.renderCount > 100) {
      const recentRenders = performance.getEntriesByName(`${componentName}-render`)
        .slice(-10); // Last 10 renders
      
      if (recentRenders.length === 10) {
        const recentDuration = recentRenders[recentRenders.length - 1].startTime - recentRenders[0].startTime;
        if (recentDuration < 1000) { // 10 renders in less than 1 second
          console.warn(`Excessive re-renders detected in ${componentName}: 10 renders in ${recentDuration.toFixed(2)}ms`);
        }
      }
    }
  }

  private estimateMemoryImpact(): number {
    // Estimate memory usage of profiling data
    const profilesSize = JSON.stringify(Array.from(this.profiles.values())).length;
    const renderTimesSize = this.renderStartTimes.size * 100; // Rough estimate
    return (profilesSize + renderTimesSize) / 1024; // Convert to KB
  }

  private cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.renderStartTimes.clear();
  }
}

/**
 * Higher-Order Component for automatic performance profiling
 */
export function withPerformanceProfiler<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const profiler = ComponentProfiler.getInstance();
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  return class ProfiledComponent extends React.Component<P> {
    private renderKey: string = '';

    componentDidMount() {
      profiler.trackLifecycle(displayName, 'mount');
    }

    componentDidUpdate() {
      profiler.trackLifecycle(displayName, 'update');
    }

    componentWillUnmount() {
      profiler.trackLifecycle(displayName, 'unmount');
    }

    componentDidCatch(error: Error) {
      profiler.trackError(displayName, error);
    }

    render() {
      this.renderKey = profiler.startRender(displayName, this.props, this.state);
      
      try {
        const result = React.createElement(WrappedComponent, this.props);
        
        // Use setTimeout to ensure render is complete
        setTimeout(() => {
          profiler.endRender(displayName, this.renderKey);
        }, 0);
        
        return result;
      } catch (error) {
        profiler.trackError(displayName, error as Error);
        throw error;
      }
    }
  };
}

/**
 * React Hook for performance profiling
 */
export function usePerformanceProfiler(componentName: string, dependencies?: any[]) {
  const profiler = ComponentProfiler.getInstance();
  const renderCountRef = React.useRef(0);
  const renderKeyRef = React.useRef<string>('');

  React.useEffect(() => {
    profiler.trackLifecycle(componentName, 'mount');
    return () => {
      profiler.trackLifecycle(componentName, 'unmount');
    };
  }, [componentName]);

  React.useEffect(() => {
    if (renderCountRef.current > 0) {
      profiler.trackLifecycle(componentName, 'update');
    }
  }, dependencies);

  // Track render start
  React.useMemo(() => {
    renderKeyRef.current = profiler.startRender(componentName);
    renderCountRef.current++;
  }, dependencies);

  // Track render end
  React.useEffect(() => {
    profiler.endRender(componentName, renderKeyRef.current);
  });

  return {
    trackError: (error: Error) => profiler.trackError(componentName, error),
    trackWarning: (warning: string) => profiler.trackWarning(componentName, warning),
    getProfile: () => profiler.getComponentProfile(componentName)
  };
}

/**
 * React Profiler wrapper component
 */
export const PerformanceProfiler: React.FC<{
  id: string;
  children: React.ReactNode;
  onRender?: (id: string, phase: 'mount' | 'update', actualDuration: number) => void;
}> = ({ id, children, onRender }) => {
  const profiler = ComponentProfiler.getInstance();

  const handleRender = React.useCallback(
    (profilerId: string, phase: 'mount' | 'update', actualDuration: number) => {
      profiler.trackLifecycle(profilerId, phase);
      
      // Track the actual duration from React Profiler
      const profile = profiler.getComponentProfile(profilerId);
      if (profile) {
        profile.totalRenderTime += actualDuration;
        profile.renderCount++;
        profile.avgRenderTime = profile.totalRenderTime / profile.renderCount;
        profile.slowestRender = Math.max(profile.slowestRender, actualDuration);
        profile.fastestRender = Math.min(profile.fastestRender, actualDuration);
        profile.lastRenderTime = new Date();
      }

      onRender?.(profilerId, phase, actualDuration);
    },
    [profiler, onRender]
  );

  return React.createElement(
    React.Profiler,
    { id, onRender: handleRender },
    children
  );
};