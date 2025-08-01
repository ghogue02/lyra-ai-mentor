#!/usr/bin/env node

/**
 * GPT-4.1 Performance Validation System Setup Script
 * Automated setup and configuration for the performance validation system
 */

import { PerformanceValidationSystem, PerformanceConfiguration } from '../index';
import { ConfigurationLoader, ConfigurationValidator } from '../config/performance.config';
import * as fs from 'fs';
import * as path from 'path';

interface SetupOptions {
  environment?: 'development' | 'staging' | 'production';
  configFile?: string;
  validateOnly?: boolean;
  runBenchmark?: boolean;
  interactive?: boolean;
}

class PerformanceSetup {
  private options: SetupOptions;
  private config: PerformanceConfiguration;
  private perfSystem?: PerformanceValidationSystem;

  constructor(options: SetupOptions = {}) {
    this.options = options;
    this.config = ConfigurationLoader.load(options.environment);
  }

  /**
   * Main setup process
   */
  async run(): Promise<void> {
    console.log('🚀 GPT-4.1 Performance Validation System Setup');
    console.log('=' .repeat(60));

    try {
      // Step 1: Validate configuration
      await this.validateConfiguration();

      if (this.options.validateOnly) {
        console.log('✅ Configuration validation completed successfully');
        return;
      }

      // Step 2: Setup directories and files
      await this.setupDirectories();

      // Step 3: Initialize performance system
      await this.initializeSystem();

      // Step 4: Run initial benchmark if requested
      if (this.options.runBenchmark) {
        await this.runInitialBenchmark();
      }

      // Step 5: Generate setup report
      await this.generateSetupReport();

      console.log('\n🎉 Setup completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Review the generated configuration file');
      console.log('2. Set up your OpenAI API key in environment variables');
      console.log('3. Start monitoring with: npm run performance:monitor');
      console.log('4. View dashboard at: http://localhost:3000/performance');

    } catch (error) {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    }
  }

  /**
   * Validate configuration
   */
  private async validateConfiguration(): Promise<void> {
    console.log('\n📋 Validating configuration...');

    const validation = ConfigurationValidator.validate(this.config);

    if (!validation.isValid) {
      console.error('❌ Configuration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      throw new Error('Invalid configuration');
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️  Configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    console.log('✅ Configuration validation passed');

    // Check environment variables
    await this.checkEnvironmentVariables();
  }

  /**
   * Check required environment variables
   */
  private async checkEnvironmentVariables(): Promise<void> {
    const requiredVars = ['OPENAI_API_KEY'];
    const optionalVars = ['OPENAI_BASE_URL', 'BUDGET_MONTHLY', 'WEBHOOK_URL'];

    console.log('\n🔍 Checking environment variables...');

    const missing: string[] = [];
    const present: string[] = [];

    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        present.push(varName);
      } else {
        missing.push(varName);
      }
    });

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(varName => console.error(`  - ${varName}`));
      console.log('\nPlease set these variables before running the system.');
    } else {
      console.log('✅ All required environment variables are set');
    }

    const presentOptional: string[] = [];
    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        presentOptional.push(varName);
      }
    });

    if (presentOptional.length > 0) {
      console.log('📝 Optional variables configured:');
      presentOptional.forEach(varName => console.log(`  - ${varName}`));
    }
  }

  /**
   * Setup required directories and files
   */
  private async setupDirectories(): Promise<void> {
    console.log('\n📁 Setting up directories...');

    const directories = [
      'logs/performance',
      'data/performance/cache',
      'data/performance/benchmarks',
      'data/performance/exports',
      'config/performance'
    ];

    for (const dir of directories) {
      const fullPath = path.resolve(dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  ✅ Created directory: ${dir}`);
      } else {
        console.log(`  📁 Directory exists: ${dir}`);
      }
    }

    // Create configuration file
    await this.createConfigurationFile();

    // Create startup scripts
    await this.createStartupScripts();
  }

  /**
   * Create configuration file
   */
  private async createConfigurationFile(): Promise<void> {
    const configPath = path.resolve('config/performance/performance.config.json');
    
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      console.log('  ✅ Created configuration file: config/performance/performance.config.json');
    } else {
      console.log('  📄 Configuration file exists, skipping creation');
    }
  }

  /**
   * Create startup scripts
   */
  private async createStartupScripts(): Promise<void> {
    const scripts = {
      'scripts/start-monitoring.sh': `#!/bin/bash
# Start GPT-4.1 Performance Monitoring
echo "🔍 Starting GPT-4.1 Performance Monitoring..."

export NODE_ENV=${this.config.environment}
export PERFORMANCE_CONFIG="config/performance/performance.config.json"

node -r ts-node/register src/performance/setup/monitor.ts

echo "✅ Monitoring started successfully"
`,
      'scripts/run-benchmark.sh': `#!/bin/bash
# Run GPT-4.1 Performance Benchmark
echo "📊 Running GPT-4.1 Performance Benchmark..."

export NODE_ENV=${this.config.environment}
export PERFORMANCE_CONFIG="config/performance/performance.config.json"

node -r ts-node/register src/performance/setup/benchmark.ts

echo "✅ Benchmark completed"
`,
      'scripts/performance-report.sh': `#!/bin/bash
# Generate Performance Report
echo "📈 Generating Performance Report..."

export NODE_ENV=${this.config.environment}
export PERFORMANCE_CONFIG="config/performance/performance.config.json"

node -r ts-node/register src/performance/setup/report.ts

echo "✅ Report generated"
`
    };

    for (const [filePath, content] of Object.entries(scripts)) {
      const fullPath = path.resolve(filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        fs.chmodSync(fullPath, '755'); // Make executable
        console.log(`  ✅ Created script: ${filePath}`);
      }
    }
  }

  /**
   * Initialize performance system
   */
  private async initializeSystem(): Promise<void> {
    console.log('\n⚙️ Initializing performance system...');

    this.perfSystem = new PerformanceValidationSystem(this.config);
    await this.perfSystem.initialize();

    console.log('✅ Performance system initialized');
  }

  /**
   * Run initial benchmark
   */
  private async runInitialBenchmark(): Promise<void> {
    if (!this.perfSystem) {
      throw new Error('Performance system not initialized');
    }

    console.log('\n📊 Running initial benchmark...');

    const validation = await this.perfSystem.runValidation();
    
    // Save benchmark results
    const resultsPath = path.resolve('data/performance/benchmarks/initial-benchmark.json');
    fs.writeFileSync(resultsPath, JSON.stringify(validation, null, 2));

    console.log('✅ Initial benchmark completed');
    console.log(`📄 Results saved to: ${resultsPath}`);

    // Display summary
    console.log('\n📈 Benchmark Summary:');
    console.log(`  Total Scenarios: ${validation.benchmarkResults.scenarios.length}`);
    console.log(`  Average Response Time: ${validation.benchmarkResults.summary.averageResponseTime.toFixed(0)}ms`);
    console.log(`  Total Cost: $${validation.benchmarkResults.summary.totalCost.toFixed(4)}`);
    console.log(`  Success Rate: ${(validation.benchmarkResults.summary.overallSuccessRate * 100).toFixed(1)}%`);
  }

  /**
   * Generate setup report
   */
  private async generateSetupReport(): Promise<void> {
    console.log('\n📝 Generating setup report...');

    const report = {
      setupDate: new Date().toISOString(),
      environment: this.config.environment,
      configuration: {
        costAnalysisEnabled: this.config.costAnalysis.enabled,
        monitoringEnabled: this.config.monitoring.enabled,
        optimizationEnabled: this.config.optimization.caching.enabled,
        benchmarkingEnabled: this.config.benchmarking.enabled,
        dashboardEnabled: this.config.dashboard.enabled
      },
      systemStatus: this.perfSystem ? await this.getSystemStatus() : null,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.resolve('data/performance/setup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('✅ Setup report generated');
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  /**
   * Get system status for report
   */
  private async getSystemStatus(): Promise<any> {
    if (!this.perfSystem) return null;

    try {
      return this.perfSystem.getSystemStatus();
    } catch (error) {
      console.warn('⚠️ Could not get system status:', error);
      return { error: 'Could not retrieve system status' };
    }
  }

  /**
   * Generate recommendations based on configuration
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.config.environment === 'production') {
      recommendations.push('Production environment detected - ensure proper monitoring and alerting');
      recommendations.push('Consider setting up automated benchmark scheduling');
      recommendations.push('Enable Redis caching for optimal performance');
    }

    if (!this.config.costAnalysis.budgetLimits.monthly) {
      recommendations.push('Set monthly budget limits for cost control');
    }

    if (!this.config.monitoring.alerts.webhookUrl) {
      recommendations.push('Configure webhook URL for alerts');
    }

    if (this.config.optimization.caching.strategy === 'memory') {
      recommendations.push('Consider upgrading to Redis caching for production use');
    }

    if (!this.config.benchmarking.autoSchedule.enabled) {
      recommendations.push('Enable automatic benchmark scheduling for continuous validation');
    }

    return recommendations;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const options: SetupOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--env':
      case '--environment':
        options.environment = args[++i] as any;
        break;
      case '--config':
        options.configFile = args[++i];
        break;
      case '--validate-only':
        options.validateOnly = true;
        break;
      case '--benchmark':
        options.runBenchmark = true;
        break;
      case '--interactive':
        options.interactive = true;
        break;
      case '--help':
        console.log(`
GPT-4.1 Performance Validation System Setup

Usage: node setup.ts [options]

Options:
  --env, --environment     Environment (development|staging|production)
  --config                 Custom configuration file path
  --validate-only          Only validate configuration, don't setup
  --benchmark              Run initial benchmark after setup
  --interactive            Interactive setup mode
  --help                   Show this help message

Examples:
  node setup.ts --env production --benchmark
  node setup.ts --validate-only
  node setup.ts --config custom-config.json
`);
        process.exit(0);
      default:
        console.warn(`Unknown option: ${arg}`);
    }
  }

  const setup = new PerformanceSetup(options);
  await setup.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

export { PerformanceSetup, SetupOptions };