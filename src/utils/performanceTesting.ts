// ================================
// PERFORMANCE TESTING SUITE
// Target: 60fps on 2GB RAM devices
// ================================

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  interactionDelay: number;
  frameDrops: number;
  cpuUsage?: number;
  timestamp: number;
}

export interface DeviceSpec {
  ram: number;
  cpu: 'low' | 'medium' | 'high';
  gpu: 'integrated' | 'dedicated';
  screen: 'mobile' | 'tablet' | 'desktop';
}

export interface PerformanceTestResult {
  testName: string;
  passed: boolean;
  metrics: PerformanceMetrics[];
  averageFps: number;
  minFps: number;
  maxFps: number;
  memoryPeak: number;
  recommendations: string[];
  deviceSpec: DeviceSpec;
  duration: number;
}

// ================================
// PERFORMANCE MONITOR CLASS
// ================================

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private frameCount = 0;
  private lastFrameTime = 0;
  private animationId?: number;
  private isMonitoring = false;
  private memoryBaseline = 0;
  private testStartTime = 0;

  constructor() {
    this.memoryBaseline = this.getMemoryUsage();
  }

  // Start monitoring performance
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.testStartTime = performance.now();
    this.metrics = [];
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    
    // Start frame monitoring
    this.monitorFrame();
  }

  // Stop monitoring and return results
  stopMonitoring(): PerformanceMetrics[] {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    return [...this.metrics];
  }

  // Monitor individual frame performance
  private monitorFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    const fps = 1000 / frameTime;
    
    // Collect metrics every 100ms to avoid overhead
    if (this.frameCount % 6 === 0) {
      const metrics: PerformanceMetrics = {
        fps: Math.round(fps * 10) / 10,
        memoryUsage: this.getMemoryUsage(),
        renderTime: frameTime,
        interactionDelay: this.measureInteractionDelay(),
        frameDrops: fps < 55 ? 1 : 0,
        timestamp: currentTime
      };
      
      this.metrics.push(metrics);
    }

    this.lastFrameTime = currentTime;
    this.frameCount++;
    
    this.animationId = requestAnimationFrame(this.monitorFrame);
  };

  // Get current memory usage
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100;
    }
    return 0;
  }

  // Measure interaction responsiveness
  private measureInteractionDelay(): number {
    const start = performance.now();
    // Simulate a small DOM operation
    const element = document.createElement('div');
    element.style.transform = 'translateX(1px)';
    document.body.appendChild(element);
    document.body.removeChild(element);
    return performance.now() - start;
  }

  // Calculate test results
  calculateResults(testName: string, deviceSpec: DeviceSpec): PerformanceTestResult {
    if (this.metrics.length === 0) {
      throw new Error('No metrics collected. Run startMonitoring() first.');
    }

    const fpsList = this.metrics.map(m => m.fps);
    const memoryList = this.metrics.map(m => m.memoryUsage);
    const frameDrops = this.metrics.reduce((sum, m) => sum + m.frameDrops, 0);
    
    const averageFps = fpsList.reduce((sum, fps) => sum + fps, 0) / fpsList.length;
    const minFps = Math.min(...fpsList);
    const maxFps = Math.max(...fpsList);
    const memoryPeak = Math.max(...memoryList);
    
    // Performance criteria for 2GB RAM devices
    const TARGET_FPS = 60;
    const MIN_ACCEPTABLE_FPS = 55;
    const MAX_MEMORY_MB = 50; // Conservative limit for 2GB devices
    const MAX_FRAME_DROPS = Math.floor(this.metrics.length * 0.05); // 5% tolerance
    
    const passed = averageFps >= MIN_ACCEPTABLE_FPS && 
                  minFps >= 45 && 
                  memoryPeak <= MAX_MEMORY_MB &&
                  frameDrops <= MAX_FRAME_DROPS;

    const recommendations: string[] = [];
    
    if (averageFps < TARGET_FPS) {
      recommendations.push(`Average FPS (${averageFps.toFixed(1)}) below target (${TARGET_FPS}). Consider reducing animation complexity.`);
    }
    if (minFps < MIN_ACCEPTABLE_FPS) {
      recommendations.push(`Minimum FPS (${minFps.toFixed(1)}) too low. Optimize rendering bottlenecks.`);
    }
    if (memoryPeak > MAX_MEMORY_MB) {
      recommendations.push(`Memory usage (${memoryPeak}MB) exceeds limit. Implement better cleanup.`);
    }
    if (frameDrops > MAX_FRAME_DROPS) {
      recommendations.push(`Too many frame drops (${frameDrops}). Use GPU acceleration and reduce DOM manipulation.`);
    }

    return {
      testName,
      passed,
      metrics: this.metrics,
      averageFps: Math.round(averageFps * 10) / 10,
      minFps: Math.round(minFps * 10) / 10,
      maxFps: Math.round(maxFps * 10) / 10,
      memoryPeak,
      recommendations,
      deviceSpec,
      duration: performance.now() - this.testStartTime
    };
  }
}

// ================================
// LOW-END DEVICE SIMULATION
// ================================

export class LowEndDeviceSimulator {
  private originalRequestAnimationFrame: typeof requestAnimationFrame;
  private cpuThrottleRatio = 1;
  private memoryPressure = false;

  constructor() {
    this.originalRequestAnimationFrame = window.requestAnimationFrame;
  }

  // Simulate 2GB RAM device constraints
  simulateLowEndDevice(): void {
    this.cpuThrottleRatio = 4; // Simulate 4x slower CPU
    this.memoryPressure = true;
    
    // Throttle requestAnimationFrame to simulate slower device
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return this.originalRequestAnimationFrame(() => {
        // Add artificial delay to simulate slower device
        setTimeout(() => {
          callback(performance.now());
        }, Math.random() * this.cpuThrottleRatio);
      });
    };

    // Simulate memory pressure
    if (this.memoryPressure) {
      this.createMemoryPressure();
    }
  }

  // Restore normal device performance
  restoreNormalPerformance(): void {
    window.requestAnimationFrame = this.originalRequestAnimationFrame;
    this.cpuThrottleRatio = 1;
    this.memoryPressure = false;
  }

  // Create artificial memory pressure
  private createMemoryPressure(): void {
    // Create some memory pressure to simulate constrained device
    const memoryPressureArray: number[][] = [];
    for (let i = 0; i < 100; i++) {
      memoryPressureArray.push(new Array(1000).fill(Math.random()));
    }
    
    // Clean up after a delay
    setTimeout(() => {
      memoryPressureArray.length = 0;
    }, 5000);
  }
}

// ================================
// PERFORMANCE TEST SUITE
// ================================

export class PerformanceTestSuite {
  private monitor = new PerformanceMonitor();
  private simulator = new LowEndDeviceSimulator();
  private results: PerformanceTestResult[] = [];

  async runAllTests(): Promise<PerformanceTestResult[]> {
    this.results = [];
    
    // Test 1: Normal device performance
    await this.runTest('Normal Device Performance', {
      ram: 8,
      cpu: 'high',
      gpu: 'dedicated',
      screen: 'desktop'
    });

    // Test 2: Low-end device simulation
    this.simulator.simulateLowEndDevice();
    await this.runTest('Low-End Device (2GB RAM)', {
      ram: 2,
      cpu: 'low',
      gpu: 'integrated',
      screen: 'mobile'
    });
    this.simulator.restoreNormalPerformance();

    // Test 3: Heavy interaction stress test
    await this.runStressTest('Heavy Interaction Stress Test', {
      ram: 2,
      cpu: 'low',
      gpu: 'integrated',
      screen: 'mobile'
    });

    return this.results;
  }

  private async runTest(testName: string, deviceSpec: DeviceSpec): Promise<void> {
    return new Promise((resolve) => {
      this.monitor.startMonitoring();
      
      // Simulate typical user interactions
      this.simulateUserInteractions();
      
      // Run test for 5 seconds
      setTimeout(() => {
        const metrics = this.monitor.stopMonitoring();
        const result = this.monitor.calculateResults(testName, deviceSpec);
        this.results.push(result);
        resolve();
      }, 5000);
    });
  }

  private async runStressTest(testName: string, deviceSpec: DeviceSpec): Promise<void> {
    return new Promise((resolve) => {
      this.monitor.startMonitoring();
      
      // Simulate heavy interactions
      this.simulateHeavyInteractions();
      
      // Run stress test for 10 seconds
      setTimeout(() => {
        const metrics = this.monitor.stopMonitoring();
        const result = this.monitor.calculateResults(testName, deviceSpec);
        this.results.push(result);
        resolve();
      }, 10000);
    });
  }

  private simulateUserInteractions(): void {
    const interactions = [
      () => this.simulateScroll(),
      () => this.simulateClick(),
      () => this.simulateDrag(),
      () => this.simulateTouch()
    ];

    const interval = setInterval(() => {
      const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)];
      randomInteraction();
    }, 200);

    setTimeout(() => clearInterval(interval), 4500);
  }

  private simulateHeavyInteractions(): void {
    // Simulate rapid interactions
    const heavyInterval = setInterval(() => {
      this.simulateScroll();
      this.simulateDrag();
      this.simulateClick();
    }, 50);

    setTimeout(() => clearInterval(heavyInterval), 9500);
  }

  private simulateScroll(): void {
    window.dispatchEvent(new WheelEvent('wheel', {
      deltaY: Math.random() * 100 - 50,
      bubbles: true
    }));
  }

  private simulateClick(): void {
    const elements = document.querySelectorAll('button, [role="button"]');
    if (elements.length > 0) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      randomElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  }

  private simulateDrag(): void {
    const draggableElements = document.querySelectorAll('[draggable="true"], .cursor-grab');
    if (draggableElements.length > 0) {
      const element = draggableElements[0];
      element.dispatchEvent(new DragEvent('dragstart', { bubbles: true }));
      setTimeout(() => {
        element.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
      }, 100);
    }
  }

  private simulateTouch(): void {
    const touchableElements = document.querySelectorAll('input, button, [role="slider"]');
    if (touchableElements.length > 0) {
      const element = touchableElements[Math.floor(Math.random() * touchableElements.length)];
      element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      setTimeout(() => {
        element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
      }, 150);
    }
  }
}

// ================================
// PERFORMANCE UTILITIES
// ================================

export const performanceUtils = {
  // Check if device meets minimum requirements
  checkDeviceCapabilities(): DeviceSpec {
    const navigator = window.navigator as any;
    const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown
    
    return {
      ram: memory,
      cpu: memory >= 8 ? 'high' : memory >= 4 ? 'medium' : 'low',
      gpu: 'unknown' as any,
      screen: window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile'
    };
  },

  // Quick performance check
  async quickPerformanceCheck(): Promise<boolean> {
    const monitor = new PerformanceMonitor();
    
    return new Promise((resolve) => {
      monitor.startMonitoring();
      
      // Run quick test for 2 seconds
      setTimeout(() => {
        const metrics = monitor.stopMonitoring();
        const averageFps = metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length;
        resolve(averageFps >= 55); // Return true if performance is acceptable
      }, 2000);
    });
  },

  // Format test results for display
  formatResults(results: PerformanceTestResult[]): string {
    return results.map(result => {
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      return `
${status} ${result.testName}
- Average FPS: ${result.averageFps}
- Min FPS: ${result.minFps}
- Memory Peak: ${result.memoryPeak}MB
- Device: ${result.deviceSpec.ram}GB RAM, ${result.deviceSpec.cpu} CPU
- Duration: ${(result.duration / 1000).toFixed(1)}s
${result.recommendations.length > 0 ? '- Recommendations: ' + result.recommendations.join('; ') : ''}
      `.trim();
    }).join('\n\n');
  }
};

// Export default test runner
export const runPerformanceTests = async (): Promise<PerformanceTestResult[]> => {
  const testSuite = new PerformanceTestSuite();
  return testSuite.runAllTests();
};