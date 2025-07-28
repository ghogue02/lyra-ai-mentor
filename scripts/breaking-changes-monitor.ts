#!/usr/bin/env node

/**
 * Breaking Changes Monitor Script
 * 
 * This script runs automated breaking changes detection during the
 * neumorphic transformation process. It can be run manually or
 * integrated into the build process.
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface MonitoringResult {
  timestamp: string;
  checkpoint: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  issues: string[];
  metrics?: any;
}

interface MonitoringConfig {
  enableContinuousMonitoring: boolean;
  checkpointInterval: number; // minutes
  alertThreshold: number; // number of failures before alert
  outputFile: string;
  notifications: {
    discord?: string;
    slack?: string;
    email?: string;
  };
}

class BreakingChangesMonitor {
  private config: MonitoringConfig;
  private results: MonitoringResult[] = [];
  private isMonitoring = false;

  constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      enableContinuousMonitoring: true,
      checkpointInterval: 5, // 5 minutes
      alertThreshold: 3,
      outputFile: './breaking-changes-report.json',
      notifications: {},
      ...config,
    };

    this.loadPreviousResults();
  }

  private loadPreviousResults() {
    if (existsSync(this.config.outputFile)) {
      try {
        const data = readFileSync(this.config.outputFile, 'utf-8');
        this.results = JSON.parse(data).results || [];
      } catch (error) {
        console.warn('Could not load previous results:', error.message);
      }
    }
  }

  private saveResults() {
    const report = {
      lastUpdated: new Date().toISOString(),
      totalCheckpoints: this.results.length,
      summary: this.generateSummary(),
      results: this.results,
    };

    writeFileSync(this.config.outputFile, JSON.stringify(report, null, 2));
  }

  private generateSummary() {
    const recent = this.results.slice(-10); // Last 10 results
    return {
      passed: recent.filter(r => r.status === 'PASSED').length,
      warnings: recent.filter(r => r.status === 'WARNING').length,
      failed: recent.filter(r => r.status === 'FAILED').length,
      trend: this.calculateTrend(),
      criticalIssues: this.getCriticalIssues(),
    };
  }

  private calculateTrend(): 'improving' | 'stable' | 'degrading' {
    if (this.results.length < 5) return 'stable';
    
    const recent = this.results.slice(-5);
    const older = this.results.slice(-10, -5);
    
    const recentFailures = recent.filter(r => r.status === 'FAILED').length;
    const olderFailures = older.filter(r => r.status === 'FAILED').length;
    
    if (recentFailures < olderFailures) return 'improving';
    if (recentFailures > olderFailures) return 'degrading';
    return 'stable';
  }

  private getCriticalIssues(): string[] {
    const critical: string[] = [];
    const recentFailures = this.results
      .filter(r => r.status === 'FAILED')
      .slice(-5);
    
    recentFailures.forEach(result => {
      critical.push(...result.issues);
    });
    
    return [...new Set(critical)]; // Remove duplicates
  }

  async runBaselineTests(): Promise<MonitoringResult> {
    console.log('🔍 Running baseline functionality tests...');
    
    try {
      const output = execSync('npm run test:run tests/breaking-changes/baseline-functionality.test.ts', {
        encoding: 'utf-8',
        timeout: 30000,
      });
      
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'baseline-functionality',
        status: 'PASSED',
        issues: [],
        metrics: { testOutput: output },
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'baseline-functionality',
        status: 'FAILED',
        issues: [`Baseline tests failed: ${error.message}`],
      };
    }
  }

  async runCSSConflictTests(): Promise<MonitoringResult> {
    console.log('🎨 Running CSS conflict detection...');
    
    try {
      const output = execSync('npm run test:run tests/breaking-changes/css-conflict-monitor.test.ts', {
        encoding: 'utf-8',
        timeout: 30000,
      });
      
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'css-conflicts',
        status: 'PASSED',
        issues: [],
        metrics: { testOutput: output },
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'css-conflicts',
        status: 'WARNING',
        issues: [`CSS conflicts detected: ${error.message}`],
      };
    }
  }

  async runResponsiveTests(): Promise<MonitoringResult> {
    console.log('📱 Running responsive behavior tests...');
    
    try {
      const output = execSync('npm run test:run tests/breaking-changes/responsive-behavior-monitor.test.ts', {
        encoding: 'utf-8',
        timeout: 30000,
      });
      
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'responsive-behavior',
        status: 'PASSED',
        issues: [],
        metrics: { testOutput: output },
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'responsive-behavior',
        status: 'FAILED',
        issues: [`Responsive tests failed: ${error.message}`],
      };
    }
  }

  async runAIFunctionalityTests(): Promise<MonitoringResult> {
    console.log('🤖 Running AI functionality tests...');
    
    try {
      const output = execSync('npm run test:run tests/breaking-changes/ai-functionality-monitor.test.ts', {
        encoding: 'utf-8',
        timeout: 45000,
      });
      
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'ai-functionality',
        status: 'PASSED',
        issues: [],
        metrics: { testOutput: output },
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'ai-functionality',
        status: 'WARNING',
        issues: [`AI functionality issues: ${error.message}`],
      };
    }
  }

  async runBuildTest(): Promise<MonitoringResult> {
    console.log('🏗️ Running build test...');
    
    try {
      const output = execSync('npm run build', {
        encoding: 'utf-8',
        timeout: 120000, // 2 minutes
      });
      
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'build-integrity',
        status: 'PASSED',
        issues: [],
        metrics: { buildOutput: output },
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        checkpoint: 'build-integrity',
        status: 'FAILED',
        issues: [`Build failed: ${error.message}`],
      };
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive breaking changes check...');
    
    const tests = [
      this.runBaselineTests(),
      this.runCSSConflictTests(),
      this.runResponsiveTests(),
      this.runAIFunctionalityTests(),
      this.runBuildTest(),
    ];
    
    const results = await Promise.allSettled(tests);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.results.push(result.value);
        this.logResult(result.value);
      } else {
        this.results.push({
          timestamp: new Date().toISOString(),
          checkpoint: `test-${index}`,
          status: 'FAILED',
          issues: [`Test execution failed: ${result.reason}`],
        });
      }
    });
    
    this.saveResults();
    this.checkAlertThreshold();
  }

  private logResult(result: MonitoringResult) {
    const statusEmoji = {
      PASSED: '✅',
      WARNING: '⚠️',
      FAILED: '❌',
    };
    
    console.log(`${statusEmoji[result.status]} ${result.checkpoint}: ${result.status}`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
  }

  private checkAlertThreshold() {
    const recentFailures = this.results
      .slice(-this.config.alertThreshold)
      .filter(r => r.status === 'FAILED');
    
    if (recentFailures.length >= this.config.alertThreshold) {
      this.sendAlert(recentFailures);
    }
  }

  private sendAlert(failures: MonitoringResult[]) {
    const alertMessage = `
🚨 BREAKING CHANGES ALERT 🚨

${failures.length} critical failures detected in the last ${this.config.alertThreshold} checks.

Recent failures:
${failures.map(f => `- ${f.checkpoint}: ${f.issues.join(', ')}`).join('\n')}

Please review the neumorphic transformation immediately.
    `.trim();
    
    console.error(alertMessage);
    
    // Save alert to file
    const alertFile = './breaking-changes-alert.txt';
    writeFileSync(alertFile, alertMessage);
    
    // Send notifications if configured
    if (this.config.notifications.discord) {
      this.sendDiscordAlert(alertMessage);
    }
  }

  private async sendDiscordAlert(message: string) {
    try {
      const webhook = this.config.notifications.discord;
      if (!webhook) return;
      
      const payload = {
        content: `\`\`\`${message}\`\`\``,
        username: 'Breaking Changes Monitor',
      };
      
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.warn('Failed to send Discord alert:', response.statusText);
      }
    } catch (error) {
      console.warn('Discord notification error:', error.message);
    }
  }

  startContinuousMonitoring() {
    if (this.isMonitoring) return;
    
    console.log(`🔄 Starting continuous monitoring (${this.config.checkpointInterval} min intervals)`);
    this.isMonitoring = true;
    
    const interval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }
      
      console.log('⏰ Running scheduled breaking changes check...');
      await this.runAllTests();
    }, this.config.checkpointInterval * 60 * 1000);
    
    // Initial run
    this.runAllTests();
  }

  stopContinuousMonitoring() {
    this.isMonitoring = false;
    console.log('⏹️ Stopped continuous monitoring');
  }

  generateReport(): string {
    const summary = this.generateSummary();
    const trend = this.calculateTrend();
    
    return `
# Breaking Changes Monitor Report
Generated: ${new Date().toISOString()}

## Summary
- Total Checkpoints: ${this.results.length}
- Recent Performance (last 10):
  - ✅ Passed: ${summary.passed}
  - ⚠️  Warnings: ${summary.warnings}
  - ❌ Failed: ${summary.failed}
- Trend: ${trend.toUpperCase()}

## Critical Issues
${summary.criticalIssues.length > 0 
  ? summary.criticalIssues.map(issue => `- ${issue}`).join('\n')
  : 'No critical issues detected'
}

## Recent Results
${this.results.slice(-5).map(r => 
  `- ${r.timestamp.split('T')[1].split('.')[0]} - ${r.checkpoint}: ${r.status}`
).join('\n')}

## Recommendations
${this.generateRecommendations()}
    `.trim();
  }

  private generateRecommendations(): string {
    const summary = this.generateSummary();
    const recommendations: string[] = [];
    
    if (summary.failed > 0) {
      recommendations.push('- Immediate attention required for failed tests');
      recommendations.push('- Review recent neumorphic changes for breaking modifications');
    }
    
    if (summary.warnings > 2) {
      recommendations.push('- Multiple warnings detected - consider addressing before continuing');
    }
    
    if (this.calculateTrend() === 'degrading') {
      recommendations.push('- Quality trend is degrading - review transformation approach');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- System appears stable - continue with transformation');
    }
    
    return recommendations.join('\n');
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  
  const monitor = new BreakingChangesMonitor();
  
  switch (command) {
    case 'run':
      monitor.runAllTests().then(() => {
        console.log('\n📊 Breaking changes check complete');
        console.log('Report saved to:', monitor['config'].outputFile);
      });
      break;
      
    case 'continuous':
      monitor.startContinuousMonitoring();
      
      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down monitor...');
        monitor.stopContinuousMonitoring();
        process.exit(0);
      });
      break;
      
    case 'report':
      console.log(monitor.generateReport());
      break;
      
    default:
      console.log(`
Breaking Changes Monitor

Usage:
  npm run monitor           - Run all breaking changes tests
  npm run monitor continuous - Start continuous monitoring
  npm run monitor report    - Generate monitoring report

Commands:
  run        Run all tests once
  continuous Start continuous monitoring (Ctrl+C to stop)
  report     Generate and display current report
      `);
  }
}

export default BreakingChangesMonitor;