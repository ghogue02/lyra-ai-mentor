import React from 'react';

// Performance monitoring utilities
export interface PerformanceMetrics {
  navigationTiming?: {
    loadTime: number;
    domContentLoaded: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
  };
  resourceTiming?: {
    scripts: number;
    styles: number;
    images: number;
    total: number;
  };
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    limit: number;
  };
  bundleSize?: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    imageSize: number;
  };
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.initializeMonitoring();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring() {
    // Navigation timing
    if ('addEventListener' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.collectNavigationMetrics();
          this.collectResourceMetrics();
          this.collectMemoryMetrics();
          this.reportMetrics();
        }, 0);
      });
    }

    // Web Vitals
    this.observeWebVitals();
  }

  private collectNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    this.metrics.navigationTiming = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
    };

    // First Paint and FCP
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.navigationTiming!.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        this.metrics.navigationTiming!.firstContentfulPaint = entry.startTime;
      }
    });
  }

  private collectResourceMetrics() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceCounts = {
      scripts: 0,
      styles: 0,
      images: 0,
      total: resources.length
    };

    resources.forEach(resource => {
      if (resource.name.includes('.js')) resourceCounts.scripts++;
      else if (resource.name.includes('.css')) resourceCounts.styles++;
      else if (resource.name.match(/\.(png|jpg|jpeg|gif|svg|webp)/i)) resourceCounts.images++;
    });

    this.metrics.resourceTiming = resourceCounts;
  }

  private collectMemoryMetrics() {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.metrics.memory = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
  }

  private observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (this.metrics.navigationTiming) {
            this.metrics.navigationTiming.largestContentfulPaint = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.debug('LCP observer not supported');
      }
    }
  }

  private reportMetrics() {
    console.group('🚀 Performance Metrics');
    
    if (this.metrics.navigationTiming) {
      console.log('📊 Navigation Timing:', {
        'Load Time': `${this.metrics.navigationTiming.loadTime.toFixed(2)}ms`,
        'DOM Content Loaded': `${this.metrics.navigationTiming.domContentLoaded.toFixed(2)}ms`,
        'First Paint': this.metrics.navigationTiming.firstPaint ? 
          `${this.metrics.navigationTiming.firstPaint.toFixed(2)}ms` : 'N/A',
        'First Contentful Paint': this.metrics.navigationTiming.firstContentfulPaint ? 
          `${this.metrics.navigationTiming.firstContentfulPaint.toFixed(2)}ms` : 'N/A',
        'Largest Contentful Paint': this.metrics.navigationTiming.largestContentfulPaint ? 
          `${this.metrics.navigationTiming.largestContentfulPaint.toFixed(2)}ms` : 'N/A'
      });
    }

    if (this.metrics.resourceTiming) {
      console.log('📦 Resource Loading:', this.metrics.resourceTiming);
    }

    if (this.metrics.memory) {
      console.log('💾 Memory Usage:', {
        'Used Heap': `${(this.metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'Total Heap': `${(this.metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        'Heap Limit': `${(this.metrics.memory.limit / 1024 / 1024).toFixed(2)} MB`
      });
    }

    console.groupEnd();
  }

  // Public methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public measureComponent(componentName: string, operation: () => void): void {
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    const measureName = `${componentName}-duration`;

    performance.mark(startMark);
    operation();
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    console.debug(`⏱️ ${componentName}: ${measure.duration.toFixed(2)}ms`);
  }

  public measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    
    return operation().finally(() => {
      const duration = performance.now() - start;
      console.debug(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
    });
  }

  public clearObservers(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const mountTime = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      console.debug(`📊 ${componentName} lifetime: ${lifetime.toFixed(2)}ms`);
    };
  }, [componentName]);
}

// Bundle size analyzer
export async function analyzeBundleSize(): Promise<void> {
  if (import.meta.env.DEV) {
    try {
      const modules = await fetch('/@vite/client').then(r => r.text());
      console.log('📦 Module graph loaded:', modules.length, 'bytes');
    } catch (e) {
      console.debug('Bundle analysis not available in this environment');
    }
  }
}