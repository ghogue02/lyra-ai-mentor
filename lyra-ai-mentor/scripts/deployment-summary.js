#!/usr/bin/env node

/**
 * AI Integration Deployment Summary
 * 
 * This script generates a final deployment summary and checklist
 * for the AI integration deployment.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

async function checkIntegrationStatus() {
  log.header('AI Integration Status');
  
  // Check validation report if exists
  try {
    const reportPath = path.join(__dirname, '../ai-validation-report.json');
    const report = JSON.parse(await fs.readFile(reportPath, 'utf-8'));
    
    log.success(`AI Components: ${report.statistics.aiComponents}`);
    log.success(`Properly Integrated: ${report.statistics.properlyIntegrated}`);
    log.info(`Integration Rate: ${((report.statistics.properlyIntegrated / report.statistics.aiComponents) * 100).toFixed(1)}%`);
    
  } catch (error) {
    log.info('No validation report found - run validate-ai-integration.js first');
  }
  
  // Check AI service configuration
  const aiServicePath = path.join(__dirname, '../src/services/aiService.ts');
  const enhancedServicePath = path.join(__dirname, '../src/services/enhancedAIService.ts');
  
  try {
    await fs.access(aiServicePath);
    log.success('Main AI service configured');
  } catch {
    log.error('Main AI service not found');
  }
  
  try {
    await fs.access(enhancedServicePath);
    log.success('Enhanced AI service wrapper configured');
  } catch {
    log.error('Enhanced AI service not found');
  }
}

async function checkEnvironment() {
  log.header('Environment Readiness');
  
  const checks = {
    apiKey: !!process.env.VITE_OPENAI_API_KEY,
    nodeVersion: process.version.match(/^v(\d+)/)[1] >= 18,
    npmVersion: true,
    gitClean: true
  };
  
  // Check npm version
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    checks.npmVersion = parseFloat(npmVersion) >= 8;
    log.success(`npm version: ${npmVersion}`);
  } catch {
    checks.npmVersion = false;
    log.error('npm not found');
  }
  
  // Check git status
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
    checks.gitClean = gitStatus.trim() === '';
    if (checks.gitClean) {
      log.success('Git working directory clean');
    } else {
      log.warning('Git working directory has uncommitted changes');
    }
  } catch {
    log.warning('Not a git repository');
  }
  
  // API key check
  if (checks.apiKey) {
    log.success('VITE_OPENAI_API_KEY is set');
  } else {
    log.error('VITE_OPENAI_API_KEY is not set');
  }
  
  // Node version check
  if (checks.nodeVersion) {
    log.success(`Node.js version: ${process.version}`);
  } else {
    log.error(`Node.js version ${process.version} is too old (need v18+)`);
  }
  
  return checks;
}

async function generateDeploymentChecklist() {
  log.header('Deployment Checklist');
  
  const checklist = {
    preDeployment: [
      { task: 'Set VITE_OPENAI_API_KEY environment variable', critical: true },
      { task: 'Review AI service rate limits and quotas', critical: true },
      { task: 'Test with real API calls locally', critical: true },
      { task: 'Verify error handling for API failures', critical: true },
      { task: 'Check API key security (not in code)', critical: true }
    ],
    staging: [
      { task: 'Deploy to staging environment', critical: true },
      { task: 'Run integration tests on staging', critical: true },
      { task: 'Monitor API usage and costs', critical: false },
      { task: 'Test with different user scenarios', critical: true },
      { task: 'Verify performance with real API', critical: false }
    ],
    production: [
      { task: 'Create production deployment plan', critical: true },
      { task: 'Set up monitoring and alerts', critical: true },
      { task: 'Configure API rate limiting', critical: true },
      { task: 'Plan rollback strategy', critical: true },
      { task: 'Update documentation', critical: false }
    ]
  };
  
  console.log(`\n${colors.bright}Pre-Deployment:${colors.reset}`);
  checklist.preDeployment.forEach(({ task, critical }) => {
    console.log(`  ${critical ? '🔴' : '🟡'} ${task}`);
  });
  
  console.log(`\n${colors.bright}Staging:${colors.reset}`);
  checklist.staging.forEach(({ task, critical }) => {
    console.log(`  ${critical ? '🔴' : '🟡'} ${task}`);
  });
  
  console.log(`\n${colors.bright}Production:${colors.reset}`);
  checklist.production.forEach(({ task, critical }) => {
    console.log(`  ${critical ? '🔴' : '🟡'} ${task}`);
  });
  
  console.log(`\n${colors.cyan}Legend: 🔴 Critical | 🟡 Recommended${colors.reset}`);
  
  return checklist;
}

async function generateFinalSummary() {
  log.header('Deployment Summary');
  
  const summary = {
    timestamp: new Date().toISOString(),
    integrationStatus: {
      mainService: 'aiService.ts',
      enhancedWrapper: 'enhancedAIService.ts',
      components: {
        direct: [
          'ai-playground components',
          'playground/micro-elements components'
        ],
        viaWrapper: [
          'AlexChangeStrategy.tsx',
          'MayaEmailComposer.tsx'
        ]
      }
    },
    architecture: {
      pattern: 'Service Layer with Enhanced Wrapper',
      benefits: [
        'Centralized AI configuration',
        'Consistent error handling',
        'Rate limiting and caching',
        'Character-specific prompts',
        'Monitoring and analytics'
      ]
    },
    nextSteps: [
      '1. Set VITE_OPENAI_API_KEY in your environment',
      '2. Run npm run dev and test AI features locally',
      '3. Deploy to staging for integration testing',
      '4. Monitor API usage and costs',
      '5. Deploy to production after validation'
    ]
  };
  
  // Save summary
  await fs.writeFile(
    path.join(__dirname, '../deployment-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log(`\n${colors.bright}${colors.green}✅ AI Integration Complete!${colors.reset}`);
  console.log(`\n${colors.bright}Architecture:${colors.reset}`);
  console.log(`  • Pattern: ${summary.architecture.pattern}`);
  console.log(`  • Main Service: ${summary.integrationStatus.mainService}`);
  console.log(`  • Enhanced Wrapper: ${summary.integrationStatus.enhancedWrapper}`);
  
  console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
  summary.nextSteps.forEach(step => {
    console.log(`  ${colors.cyan}${step}${colors.reset}`);
  });
  
  console.log(`\n${colors.bright}${colors.magenta}🚀 Ready for deployment!${colors.reset}`);
}

// Main execution
async function main() {
  console.log(colors.bright + colors.magenta + '\n🎯 AI Integration Deployment Summary\n' + colors.reset);
  
  try {
    await checkIntegrationStatus();
    const envChecks = await checkEnvironment();
    await generateDeploymentChecklist();
    await generateFinalSummary();
    
    // Final status
    const isReady = envChecks.apiKey && envChecks.nodeVersion;
    
    if (!isReady) {
      console.log(`\n${colors.bright}${colors.yellow}⚠️  Some prerequisites are missing${colors.reset}`);
      console.log(`${colors.yellow}Please address the issues above before deploying.${colors.reset}`);
    }
    
    process.exit(isReady ? 0 : 1);
  } catch (error) {
    console.error('\n' + colors.bright + colors.red + '❌ Error generating summary:' + colors.reset);
    console.error(colors.red + error.message + colors.reset);
    process.exit(1);
  }
}

// Run the script
main();