/**
 * Real-time Performance Dashboard for GPT-4.1 Integration
 * Provides visual monitoring of costs, performance, and optimization metrics
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CostAnalyzer, CostMetrics, TokenUsage } from '../analysis/CostAnalyzer';
import { PerformanceMonitor, PerformanceMetrics, PerformanceAlert } from '../monitoring/PerformanceMonitor';
import { OptimizationEngine } from '../optimization/OptimizationEngine';

interface DashboardProps {
  costAnalyzer: CostAnalyzer;
  performanceMonitor: PerformanceMonitor;
  optimizationEngine: OptimizationEngine;
  refreshInterval?: number;
}

interface ChartDataPoint {
  timestamp: string;
  value: number;
  label: string;
}

export const PerformanceDashboard: React.FC<DashboardProps> = ({
  costAnalyzer,
  performanceMonitor,
  optimizationEngine,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [costMetrics, setCostMetrics] = useState<CostMetrics | null>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [activeAlerts, setActiveAlerts] = useState<PerformanceAlert[]>([]);
  const [optimizationMetrics, setOptimizationMetrics] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | '24h' | 'week'>('24h');
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Auto-refresh data
  useEffect(() => {
    const refreshData = () => {
      try {
        setCostMetrics(costAnalyzer.getCostMetrics('day'));
        setPerformanceStats(performanceMonitor.getPerformanceStats(selectedTimeframe === 'week' ? '24h' : selectedTimeframe));
        setActiveAlerts(performanceMonitor.getActiveAlerts());
        setOptimizationMetrics(optimizationEngine.getOptimizationMetrics());
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
      }
    };

    refreshData();
    const interval = setInterval(refreshData, refreshInterval);

    return () => clearInterval(interval);
  }, [costAnalyzer, performanceMonitor, optimizationEngine, selectedTimeframe, refreshInterval]);

  // Chart data preparation
  const costTrendData = useMemo(() => {
    if (!costMetrics) return [];
    
    const now = new Date();
    const data: ChartDataPoint[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: time.toISOString(),
        value: costMetrics.dailyCost / 24, // Hourly average
        label: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
    }
    
    return data;
  }, [costMetrics]);

  const handleStartMonitoring = () => {
    performanceMonitor.startMonitoring(10000); // 10 second intervals
    setIsMonitoring(true);
  };

  const handleStopMonitoring = () => {
    performanceMonitor.stopMonitoring();
    setIsMonitoring(false);
  };

  const handleResolveAlert = (alertId: string) => {
    performanceMonitor.resolveAlert(alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  if (!costMetrics || !performanceStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading performance data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GPT-4.1 Performance Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time monitoring and cost optimization</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as 'hour' | '24h' | 'week')}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="hour">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">Last Week</option>
            </select>
            <button
              onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
              className={`px-4 py-2 rounded-md font-medium ${
                isMonitoring
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-red-800">🚨 Active Alerts</h2>
          <div className="grid gap-3">
            {activeAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getAlertSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-sm opacity-75 mt-1">
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Cost Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ${costMetrics.dailyCost.toFixed(4)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              💰
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Avg per request: ${costMetrics.averageCostPerRequest.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {(performanceStats.averageResponseTime / 1000).toFixed(2)}s
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              P95: {(performanceStats.p95ResponseTime / 1000).toFixed(2)}s
            </div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-red-600">
                {(performanceStats.currentErrorRate * 100).toFixed(2)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              🚫
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Target: &lt; 1.0%
            </div>
          </div>
        </div>

        {/* Optimization Savings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-purple-600">
                ${optimizationMetrics?.totalCostSaved.toFixed(4) || '0.0000'}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              🎯
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-500">
              Cache hit rate: {((optimizationMetrics?.cacheHitRate || 0) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cost Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Trend (24h)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {costTrendData.map((point, index) => (
              <div
                key={index}
                className="bg-green-500 rounded-t flex-1 relative group"
                style={{ height: `${Math.max(4, (point.value / Math.max(...costTrendData.map(p => p.value))) * 240)}px` }}
                title={`${point.label}: $${point.value.toFixed(6)}`}
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-xs text-gray-500 mt-1">
                  {index % 4 === 0 ? point.label.split(':')[0] + 'h' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Throughput</span>
                <span>{performanceStats.averageThroughput.toFixed(1)} req/s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (performanceStats.averageThroughput / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Token Processing Rate</span>
                <span>{performanceStats.tokenProcessingEfficiency.toFixed(0)} tokens/s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (performanceStats.tokenProcessingEfficiency / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Context Processing</span>
                <span>{(performanceStats.averageContextProcessingTime / 1000).toFixed(1)}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (performanceStats.averageContextProcessingTime / 30000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Comparison */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Model Cost Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Model</th>
                  <th className="text-right py-2">Input ($/1M)</th>
                  <th className="text-right py-2">Output ($/1M)</th>
                  <th className="text-right py-2">Context Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-green-600">GPT-4.1</td>
                  <td className="text-right py-2">$2.00</td>
                  <td className="text-right py-2">$8.00</td>
                  <td className="text-right py-2">1,000,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">GPT-4</td>
                  <td className="text-right py-2">$30.00</td>
                  <td className="text-right py-2">$60.00</td>
                  <td className="text-right py-2">128,000</td>
                </tr>
                <tr>
                  <td className="py-2">GPT-3.5-Turbo</td>
                  <td className="text-right py-2">$0.50</td>
                  <td className="text-right py-2">$1.50</td>
                  <td className="text-right py-2">16,385</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              💡 GPT-4.1 offers 93% cost savings compared to GPT-4 for input tokens
              while providing 8x larger context capacity.
            </p>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
          <div className="space-y-3">
            {optimizationEngine.getOptimizationRecommendations().strategies.map((strategy, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  strategy.priority === 'high'
                    ? 'border-red-400 bg-red-50'
                    : strategy.priority === 'medium'
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-blue-400 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm opacity-75 mt-1">
                      Expected savings: {strategy.expectedSavings}%
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    strategy.priority === 'high'
                      ? 'bg-red-200 text-red-800'
                      : strategy.priority === 'medium'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {strategy.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {optimizationEngine.getOptimizationRecommendations().strategies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                🎉 All optimization strategies are currently active!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;