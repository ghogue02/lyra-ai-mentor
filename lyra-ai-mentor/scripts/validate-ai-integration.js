#!/usr/bin/env node

/**
 * AI Integration Validation Script
 * 
 * This script validates that all AI components are properly integrated
 * with the real AI service and ready for deployment.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// Configuration
const CONFIG = {
  componentsDir: path.join(__dirname, '../src/components'),
  aiServicePath: path.join(__dirname, '../src/services/aiService.ts'),
  validationResults: {
    totalComponents: 0,
    aiComponents: 0,
    properlyIntegrated: 0,
    issues: []
  }
};

async function findAIComponents() {
  log.header('Finding AI Components');
  
  const components = [];
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        CONFIG.validationResults.totalComponents++;
        
        const content = await fs.readFile(fullPath, 'utf-8');
        
        // Check for AI service usage
        if (content.includes('AIService') || content.includes('aiService')) {
          components.push({
            path: fullPath,
            relativePath: path.relative(CONFIG.componentsDir, fullPath),
            name: entry.name,
            content
          });
        }
      }
    }
  }
  
  await scanDirectory(CONFIG.componentsDir);
  
  CONFIG.validationResults.aiComponents = components.length;
  log.success(`Found ${components.length} AI components out of ${CONFIG.validationResults.totalComponents} total`);
  
  return components;
}

async function validateComponents(components) {
  log.header('Validating AI Integration');
  
  for (const component of components) {
    const issues = [];
    
    // Check for proper import
    const hasProperImport = 
      component.content.includes("import { AIService } from '@/services/aiService'") ||
      component.content.includes('import { aiService } from "@/services/aiService"') ||
      component.content.includes("import { aiService } from '@/services/aiService'");
    
    if (!hasProperImport) {
      issues.push('Missing proper AIService import');
    }
    
    // Check for mock/simulate patterns that shouldn't exist
    if (component.content.match(/simulateAI|mockAI|simulatedResponse|mockResponse/)) {
      issues.push('Contains mock/simulate patterns');
    }
    
    // Check for proper error handling
    const hasAICall = component.content.match(/aiService\.(generateResponse|streamResponse|generatePrompt|improveText|transcribeAudio|generateSpeech|generateImage)/);
    if (hasAICall) {
      const hasTryCatch = component.content.includes('try {') && component.content.includes('catch');
      const hasErrorHandling = component.content.includes('.catch(') || component.content.includes('onError');
      
      if (!hasTryCatch && !hasErrorHandling) {
        issues.push('Missing error handling for AI calls');
      }
    }
    
    // Check for API key usage (should not be in components)
    if (component.content.includes('OPENAI_API_KEY') || component.content.includes('openai_api_key')) {
      issues.push('Contains direct API key reference');
    }
    
    if (issues.length === 0) {
      CONFIG.validationResults.properlyIntegrated++;
      log.success(`✓ ${component.relativePath}`);
    } else {
      CONFIG.validationResults.issues.push({
        component: component.relativePath,
        issues
      });
      log.warning(`⚠ ${component.relativePath}`);
      issues.forEach(issue => log.info(`  - ${issue}`));
    }
  }
}

async function checkEnvironment() {
  log.header('Environment Check');
  
  // Check for API key
  const hasApiKey = !!process.env.VITE_OPENAI_API_KEY;
  if (hasApiKey) {
    log.success('VITE_OPENAI_API_KEY is set');
  } else {
    log.warning('VITE_OPENAI_API_KEY is not set - required for production');
  }
  
  // Check AI service file
  try {
    await fs.access(CONFIG.aiServicePath);
    log.success('AI service file exists');
    
    // Check service configuration
    const serviceContent = await fs.readFile(CONFIG.aiServicePath, 'utf-8');
    
    if (serviceContent.includes('VITE_OPENAI_API_KEY')) {
      log.success('AI service configured to use environment variable');
    }
    
    if (serviceContent.includes('rate limiting')) {
      log.success('Rate limiting implemented');
    }
    
    if (serviceContent.includes('retry')) {
      log.success('Retry logic implemented');
    }
    
    if (serviceContent.includes('cache')) {
      log.success('Caching implemented');
    }
    
  } catch (error) {
    log.error('AI service file not found');
  }
}

async function generateReport() {
  log.header('Summary Report');
  
  const { totalComponents, aiComponents, properlyIntegrated, issues } = CONFIG.validationResults;
  
  console.log(`\n${colors.bright}Component Statistics:${colors.reset}`);
  console.log(`  Total Components: ${totalComponents}`);
  console.log(`  AI Components: ${aiComponents}`);
  console.log(`  Properly Integrated: ${properlyIntegrated}`);
  console.log(`  Components with Issues: ${issues.length}`);
  
  const integrationRate = aiComponents > 0 ? ((properlyIntegrated / aiComponents) * 100).toFixed(1) : 0;
  console.log(`  Integration Success Rate: ${integrationRate}%`);
  
  if (issues.length > 0) {
    console.log(`\n${colors.bright}${colors.yellow}Components Requiring Attention:${colors.reset}`);
    issues.forEach(({ component, issues }) => {
      console.log(`\n  ${colors.yellow}${component}:${colors.reset}`);
      issues.forEach(issue => console.log(`    - ${issue}`));
    });
  }
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    statistics: CONFIG.validationResults,
    environmentReady: !!process.env.VITE_OPENAI_API_KEY,
    recommendation: integrationRate >= 95 ? 'READY_FOR_DEPLOYMENT' : 'NEEDS_ATTENTION'
  };
  
  await fs.writeFile(
    path.join(__dirname, '../ai-validation-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n${colors.bright}Recommendation: ${
    report.recommendation === 'READY_FOR_DEPLOYMENT' 
      ? colors.green + '✅ Ready for deployment' 
      : colors.yellow + '⚠️ Needs attention before deployment'
  }${colors.reset}`);
}

// Main execution
async function main() {
  console.log(colors.bright + colors.cyan + '\n🔍 AI Integration Validation\n' + colors.reset);
  
  try {
    await checkEnvironment();
    const components = await findAIComponents();
    await validateComponents(components);
    await generateReport();
    
    console.log('\n' + colors.bright + colors.green + '✨ Validation complete!' + colors.reset);
    process.exit(0);
  } catch (error) {
    console.error('\n' + colors.bright + colors.red + '❌ Validation failed:' + colors.reset);
    console.error(colors.red + error.message + colors.reset);
    process.exit(1);
  }
}

// Run the script
main();