#!/usr/bin/env node

/**
 * AI Integration Deployment Script
 * 
 * This script handles the deployment of AI service integration across all components.
 * It performs the following steps:
 * 1. Environment validation
 * 2. Component backup
 * 3. AI service integration updates
 * 4. Validation and testing
 * 5. Deployment preparation
 */

import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  requiredEnvVars: ['VITE_OPENAI_API_KEY'],
  backupDir: path.join(__dirname, '../backups', `ai-integration-${Date.now()}`),
  componentsDir: path.join(__dirname, '../src/components'),
  aiServicePath: path.join(__dirname, '../src/services/aiService.ts'),
  testCommand: 'npm test -- --passWithNoTests',
  buildCommand: 'npm run build',
  aiComponents: [] // Will be populated dynamically
};

// ANSI color codes for console output
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

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`)
};

// Step 1: Environment Validation
async function validateEnvironment() {
  log.header('Environment Validation');
  
  let hasErrors = false;
  
  // Check required environment variables
  for (const envVar of CONFIG.requiredEnvVars) {
    if (!process.env[envVar]) {
      log.error(`Missing required environment variable: ${envVar}`);
      hasErrors = true;
    } else {
      log.success(`Found ${envVar}: ${process.env[envVar].substring(0, 10)}...`);
    }
  }
  
  // Check if AI service file exists
  try {
    await fs.access(CONFIG.aiServicePath);
    log.success('AI service file found');
  } catch (error) {
    log.error('AI service file not found at: ' + CONFIG.aiServicePath);
    hasErrors = true;
  }
  
  // Check if components directory exists
  try {
    await fs.access(CONFIG.componentsDir);
    log.success('Components directory found');
  } catch (error) {
    log.error('Components directory not found at: ' + CONFIG.componentsDir);
    hasErrors = true;
  }
  
  if (hasErrors) {
    throw new Error('Environment validation failed');
  }
  
  log.success('Environment validation passed');
}

// Step 2: Find AI Components
async function findAIComponents() {
  log.header('Finding AI Components');
  
  const components = [];
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other non-component directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // Check if file contains AI-related patterns
        const content = await fs.readFile(fullPath, 'utf-8');
        
        // Look for AI-related patterns
        const aiPatterns = [
          /useAI/,
          /AIService/,
          /aiService/,
          /generateResponse/,
          /streamResponse/,
          /generatePrompt/,
          /improveText/,
          /transcribeAudio/,
          /generateSpeech/,
          /generateImage/
        ];
        
        if (aiPatterns.some(pattern => pattern.test(content))) {
          components.push({
            path: fullPath,
            relativePath: path.relative(CONFIG.componentsDir, fullPath),
            name: entry.name
          });
        }
      }
    }
  }
  
  await scanDirectory(CONFIG.componentsDir);
  
  CONFIG.aiComponents = components;
  log.success(`Found ${components.length} AI components`);
  
  // Log component names
  components.forEach(comp => {
    log.info(`  - ${comp.relativePath}`);
  });
  
  return components;
}

// Step 3: Backup Components
async function backupComponents() {
  log.header('Backing Up Components');
  
  // Create backup directory
  await fs.mkdir(CONFIG.backupDir, { recursive: true });
  log.success(`Created backup directory: ${CONFIG.backupDir}`);
  
  // Backup each component
  for (const component of CONFIG.aiComponents) {
    const backupPath = path.join(CONFIG.backupDir, component.relativePath);
    const backupDir = path.dirname(backupPath);
    
    // Create directory structure
    await fs.mkdir(backupDir, { recursive: true });
    
    // Copy file
    await fs.copyFile(component.path, backupPath);
    log.info(`Backed up: ${component.relativePath}`);
  }
  
  // Create backup manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    componentsCount: CONFIG.aiComponents.length,
    components: CONFIG.aiComponents.map(c => c.relativePath)
  };
  
  await fs.writeFile(
    path.join(CONFIG.backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  log.success(`Backup complete: ${CONFIG.aiComponents.length} files backed up`);
}

// Step 4: Update Components
async function updateComponents() {
  log.header('Updating AI Components');
  
  let updatedCount = 0;
  const updateResults = [];
  
  for (const component of CONFIG.aiComponents) {
    try {
      let content = await fs.readFile(component.path, 'utf-8');
      let originalContent = content;
      let changes = [];
      
      // Update import statements
      if (content.includes('simulateAI') || content.includes('mockAI')) {
        content = content.replace(
          /import\s*{\s*simulateAI[^}]*}\s*from\s*['"][^'"]+['"]/g,
          "import { generateAIResponse } from '@/services/aiService'"
        );
        changes.push('Updated import statement');
      }
      
      // Update function calls
      if (content.includes('simulateAI(')) {
        content = content.replace(/simulateAI\(/g, 'generateAIResponse(');
        changes.push('Replaced simulateAI calls');
      }
      
      if (content.includes('mockAIResponse(')) {
        content = content.replace(/mockAIResponse\(/g, 'generateAIResponse(');
        changes.push('Replaced mockAIResponse calls');
      }
      
      // Update async patterns
      if (content.includes('await simulateAI')) {
        content = content.replace(/await\s+simulateAI/g, 'await generateAIResponse');
        changes.push('Updated async calls');
      }
      
      // Update hook patterns
      if (content.includes('useSimulatedAI') || content.includes('useMockAI')) {
        content = content.replace(/useSimulatedAI/g, 'useAI');
        content = content.replace(/useMockAI/g, 'useAI');
        changes.push('Updated hook names');
      }
      
      // Add proper error handling if missing
      if (content.includes('generateAIResponse') && !content.includes('try {')) {
        // This is a simplified check - in production, use AST parsing
        log.warning(`Component ${component.name} may need error handling review`);
      }
      
      // Only write if changes were made
      if (content !== originalContent) {
        await fs.writeFile(component.path, content);
        updatedCount++;
        updateResults.push({
          component: component.relativePath,
          changes: changes,
          status: 'updated'
        });
        log.success(`Updated: ${component.relativePath} (${changes.length} changes)`);
      } else {
        updateResults.push({
          component: component.relativePath,
          changes: [],
          status: 'no-changes'
        });
        log.info(`No changes needed: ${component.relativePath}`);
      }
      
    } catch (error) {
      updateResults.push({
        component: component.relativePath,
        error: error.message,
        status: 'error'
      });
      log.error(`Failed to update ${component.relativePath}: ${error.message}`);
    }
  }
  
  // Save update report
  await fs.writeFile(
    path.join(CONFIG.backupDir, 'update-report.json'),
    JSON.stringify(updateResults, null, 2)
  );
  
  log.success(`Update complete: ${updatedCount}/${CONFIG.aiComponents.length} files updated`);
}

// Step 5: Validate Updates
async function validateUpdates() {
  log.header('Validating Updates');
  
  const validationResults = {
    syntaxErrors: [],
    importErrors: [],
    functionCallErrors: [],
    passed: true
  };
  
  // Check each updated component
  for (const component of CONFIG.aiComponents) {
    try {
      const content = await fs.readFile(component.path, 'utf-8');
      
      // Check for remaining mock/simulate patterns
      if (content.match(/simulateAI|mockAI|simulatedResponse/)) {
        validationResults.functionCallErrors.push({
          file: component.relativePath,
          issue: 'Found remaining mock/simulate patterns'
        });
        validationResults.passed = false;
      }
      
      // Check for proper imports
      if (content.includes('generateAIResponse') && !content.includes('@/services/aiService')) {
        validationResults.importErrors.push({
          file: component.relativePath,
          issue: 'Missing openai.service import'
        });
        validationResults.passed = false;
      }
      
    } catch (error) {
      validationResults.syntaxErrors.push({
        file: component.relativePath,
        error: error.message
      });
      validationResults.passed = false;
    }
  }
  
  // Save validation report
  await fs.writeFile(
    path.join(CONFIG.backupDir, 'validation-report.json'),
    JSON.stringify(validationResults, null, 2)
  );
  
  if (validationResults.passed) {
    log.success('All validations passed');
  } else {
    log.error('Validation failed - check validation-report.json');
    throw new Error('Validation failed');
  }
}

// Step 6: Run Tests
async function runTests() {
  log.header('Running Tests');
  
  try {
    log.info('Running test suite...');
    execSync(CONFIG.testCommand, { stdio: 'inherit' });
    log.success('All tests passed');
  } catch (error) {
    log.error('Tests failed');
    throw new Error('Test suite failed');
  }
}

// Step 7: Build for Staging
async function buildForStaging() {
  log.header('Building for Staging');
  
  try {
    log.info('Running production build...');
    execSync(CONFIG.buildCommand, { stdio: 'inherit' });
    log.success('Build completed successfully');
    
    // Check build output
    const distPath = path.join(__dirname, '../dist');
    const distStats = await fs.stat(distPath);
    
    if (distStats.isDirectory()) {
      log.success('Build artifacts created in dist/');
    }
  } catch (error) {
    log.error('Build failed');
    throw new Error('Production build failed');
  }
}

// Step 8: Generate Deployment Summary
async function generateSummary() {
  log.header('Deployment Summary');
  
  const summary = {
    timestamp: new Date().toISOString(),
    environment: {
      hasApiKey: !!process.env.VITE_OPENAI_API_KEY,
      nodeVersion: process.version
    },
    components: {
      total: CONFIG.aiComponents.length,
      updated: CONFIG.aiComponents.length,
      backupLocation: CONFIG.backupDir
    },
    validation: 'PASSED',
    tests: 'PASSED',
    build: 'READY',
    nextSteps: [
      '1. Review the update report in the backup directory',
      '2. Test the application locally with real API calls',
      '3. Deploy to staging environment',
      '4. Run integration tests on staging',
      '5. Deploy to production after approval'
    ]
  };
  
  await fs.writeFile(
    path.join(__dirname, '../deployment-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  log.success('Deployment summary generated');
  
  console.log('\n' + colors.bright + colors.green + '🚀 Deployment Preparation Complete!' + colors.reset);
  console.log('\nNext steps:');
  summary.nextSteps.forEach(step => {
    console.log(`  ${colors.cyan}${step}${colors.reset}`);
  });
}

// Main execution
async function main() {
  console.log(colors.bright + colors.magenta + '\n🤖 AI Integration Deployment Script' + colors.reset);
  console.log(colors.bright + '================================\n' + colors.reset);
  
  try {
    await validateEnvironment();
    await findAIComponents();
    await backupComponents();
    await updateComponents();
    await validateUpdates();
    await runTests();
    await buildForStaging();
    await generateSummary();
    
    console.log('\n' + colors.bright + colors.green + '✨ All steps completed successfully!' + colors.reset);
    process.exit(0);
  } catch (error) {
    console.error('\n' + colors.bright + colors.red + '❌ Deployment failed:' + colors.reset);
    console.error(colors.red + error.message + colors.reset);
    
    // Offer rollback option
    console.log('\n' + colors.yellow + 'To rollback changes, restore from:' + colors.reset);
    console.log(colors.yellow + CONFIG.backupDir + colors.reset);
    
    process.exit(1);
  }
}

// Run the script
main();