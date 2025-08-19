import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  Zap, 
  Monitor, 
  Cpu, 
  MemoryStick,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  StopCircle,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';
import { 
  PerformanceTestResult, 
  PerformanceTestSuite,
  performanceUtils,
  LowEndDeviceSimulator,
  DeviceSpec 
} from '@/utils/performanceTesting';

// ================================
// PERFORMANCE DASHBOARD COMPONENT
// ================================

interface PerformanceDashboardProps {
  className?: string;
  onTestComplete?: (results: PerformanceTestResult[]) => void;
  autoStart?: boolean;
  showRealTimeMetrics?: boolean;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className,
  onTestComplete,
  autoStart = false,
  showRealTimeMetrics = true
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PerformanceTestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    fps: 0,
    memory: 0,
    cpu: 0
  });
  const [deviceSpec, setDeviceSpec] = useState<DeviceSpec | null>(null);

  // Initialize device capabilities
  useEffect(() => {
    const spec = performanceUtils.checkDeviceCapabilities();
    setDeviceSpec(spec);
  }, []);

  // Auto-start tests if enabled
  useEffect(() => {
    if (autoStart && deviceSpec && !isRunning) {
      runPerformanceTests();
    }
  }, [autoStart, deviceSpec]);

  // Real-time metrics monitoring
  useEffect(() => {
    if (!showRealTimeMetrics) return;

    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateMetrics = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      frameCount++;

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        
        setRealTimeMetrics(prev => ({
          ...prev,
          fps,
          memory: getMemoryUsage(),
          cpu: getCpuUsage()
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      if (showRealTimeMetrics) {
        requestAnimationFrame(updateMetrics);
      }
    };

    updateMetrics();
  }, [showRealTimeMetrics]);

  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100;
    }
    return 0;
  };

  const getCpuUsage = (): number => {
    // Simplified CPU estimation based on frame timing
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      Math.random();
    }
    const duration = performance.now() - start;
    return Math.min(100, Math.round(duration * 2));
  };

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const testSuite = new PerformanceTestSuite();
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 500);

      setCurrentTest('Running comprehensive performance tests...');
      const testResults = await testSuite.runAllTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(testResults);
      setCurrentTest('Tests completed');
      
      if (onTestComplete) {
        onTestComplete(testResults);
      }
    } catch (error) {
      console.error('Performance tests failed:', error);
      setCurrentTest('Tests failed - check console for details');
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentTest('');
      }, 2000);
    }
  };

  const getDeviceIcon = (screen: string) => {
    switch (screen) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Laptop className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 45) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (memory: number) => {
    if (memory <= 30) return 'text-green-600';
    if (memory <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallPerformance = useMemo(() => {
    if (results.length === 0) return null;
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const percentage = Math.round((passed / total) * 100);
    
    return {
      passed,
      total,
      percentage,
      status: percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-improvement'
    };
  }, [results]);

  return (
    <Card className={cn('w-full space-y-6', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Performance Dashboard
          </div>
          <div className="flex items-center gap-2">
            {deviceSpec && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getDeviceIcon(deviceSpec.screen)}
                {deviceSpec.ram}GB RAM
              </div>
            )}
            <Button
              onClick={runPerformanceTests}
              disabled={isRunning}
              size="sm"
              className="transform transition-all duration-200 hover:scale-105"
            >
              {isRunning ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real-time Metrics */}
        {showRealTimeMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Current FPS</p>
                    <p className={cn('text-2xl font-bold', getPerformanceColor(realTimeMetrics.fps))}>
                      {realTimeMetrics.fps}
                    </p>
                  </div>
                  <Gauge className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Progress 
                    value={Math.min((realTimeMetrics.fps / 60) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Memory Usage</p>
                    <p className={cn('text-2xl font-bold', getMemoryColor(realTimeMetrics.memory))}>
                      {realTimeMetrics.memory}MB
                    </p>
                  </div>
                  <MemoryStick className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <Progress 
                    value={Math.min((realTimeMetrics.memory / 100) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">CPU Load</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {realTimeMetrics.cpu}%
                    </p>
                  </div>
                  <Cpu className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <Progress 
                    value={realTimeMetrics.cpu} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Progress */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="animate-spin w-5 h-5">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium text-purple-900">{currentTest}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-purple-700 mt-2">{progress}% complete</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overall Performance Summary */}
        {overallPerformance && (
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Performance</h3>
                <div className="flex items-center gap-2">
                  {overallPerformance.status === 'excellent' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : overallPerformance.status === 'good' ? (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <Badge 
                    variant={overallPerformance.percentage >= 80 ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {overallPerformance.percentage}% Pass Rate
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{overallPerformance.passed}</p>
                  <p className="text-sm text-gray-600">Tests Passed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{overallPerformance.total - overallPerformance.passed}</p>
                  <p className="text-sm text-gray-600">Tests Failed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{overallPerformance.total}</p>
                  <p className="text-sm text-gray-600">Total Tests</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{overallPerformance.percentage}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    'border-2 transform transition-all duration-200 hover:shadow-md',
                    result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <h4 className="font-semibold text-gray-900">{result.testName}</h4>
                        </div>
                        <Badge 
                          variant={result.passed ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                          <p className={cn('text-lg font-bold', getPerformanceColor(result.averageFps))}>
                            {result.averageFps}
                          </p>
                          <p className="text-xs text-gray-600">Avg FPS</p>
                        </div>
                        <div className="text-center">
                          <p className={cn('text-lg font-bold', getPerformanceColor(result.minFps))}>
                            {result.minFps}
                          </p>
                          <p className="text-xs text-gray-600">Min FPS</p>
                        </div>
                        <div className="text-center">
                          <p className={cn('text-lg font-bold', getMemoryColor(result.memoryPeak))}>
                            {result.memoryPeak}MB
                          </p>
                          <p className="text-xs text-gray-600">Peak Memory</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-700">
                            {(result.duration / 1000).toFixed(1)}s
                          </p>
                          <p className="text-xs text-gray-600">Duration</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {getDeviceIcon(result.deviceSpec.screen)}
                        <span className="text-sm text-gray-600">
                          {result.deviceSpec.ram}GB RAM, {result.deviceSpec.cpu} CPU
                        </span>
                      </div>

                      {result.recommendations.length > 0 && (
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium text-gray-900 mb-2">Recommendations:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {result.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-purple-600 mt-1 font-bold">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Performance Check */}
        <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Target: 60fps on 2GB RAM devices</h4>
                <p className="text-sm text-purple-700">
                  Optimized for smooth interactions on low-end hardware
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PerformanceDashboard;