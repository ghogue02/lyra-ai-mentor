#!/usr/bin/env node

/**
 * Validate and Fix Database Issues
 * This script combines validation with automatic fixing
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}🔧 Database Validation & Auto-Fix Tool${colors.reset}\n`);

/**
 * Run a command and capture output
 */
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { 
      stdio: 'pipe',
      shell: true,
      env: { ...process.env }
    });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });
    
    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Main validation and fix flow
 */
async function validateAndFix() {
  const steps = [
    {
      name: 'Initial Validation',
      command: 'node',
      args: ['scripts/verify-toolkit-fix.js'],
      critical: false
    },
    {
      name: 'Generate Fix',
      command: 'node',
      args: ['scripts/automated-db-fix.js'],
      condition: (prev) => prev.code !== 0,
      critical: false
    },
    {
      name: 'Apply Fix',
      command: './scripts/apply-db-fix.sh',
      args: [],
      condition: (prev) => fs.access(path.join(__dirname, 'apply-db-fix.sh')).then(() => true).catch(() => false),
      critical: false
    },
    {
      name: 'Final Validation',
      command: 'node', 
      args: ['scripts/verify-toolkit-fix.js'],
      condition: (prev) => true,
      critical: true
    }
  ];
  
  const results = [];
  let previousResult = null;
  
  for (const step of steps) {
    console.log(`\n${colors.blue}📋 ${step.name}...${colors.reset}\n`);
    
    // Check condition
    if (step.condition && !await step.condition(previousResult)) {
      console.log(`${colors.yellow}⏭️  Skipping (condition not met)${colors.reset}`);
      continue;
    }
    
    try {
      const result = await runCommand(step.command, step.args);
      results.push({ step: step.name, ...result });
      previousResult = result;
      
      if (result.code === 0) {
        console.log(`\n${colors.green}✅ ${step.name} completed successfully${colors.reset}`);
      } else if (!step.critical) {
        console.log(`\n${colors.yellow}⚠️  ${step.name} failed (non-critical)${colors.reset}`);
      } else {
        console.log(`\n${colors.red}❌ ${step.name} failed${colors.reset}`);
        return { success: false, results };
      }
    } catch (error) {
      console.error(`\n${colors.red}❌ Error in ${step.name}: ${error.message}${colors.reset}`);
      results.push({ step: step.name, error: error.message });
      
      if (step.critical) {
        return { success: false, results };
      }
    }
  }
  
  return { success: true, results };
}

/**
 * Generate report
 */
async function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    success: results.success,
    steps: results.results.map(r => ({
      name: r.step,
      exitCode: r.code,
      hasError: r.code !== 0 || !!r.error,
      error: r.error || (r.code !== 0 ? 'Non-zero exit code' : null)
    })),
    summary: {
      totalSteps: results.results.length,
      successfulSteps: results.results.filter(r => r.code === 0).length,
      failedSteps: results.results.filter(r => r.code !== 0).length
    }
  };
  
  // Save report
  const reportPath = path.join(__dirname, 'logs', `db-fix-report-${Date.now()}.json`);
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n${colors.magenta}📊 Report saved to: ${reportPath}${colors.reset}`);
  
  return report;
}

/**
 * Integration with MCP tools
 */
async function updateMCPMemory(report) {
  try {
    // Store in MCP memory using CLI
    const memoryData = {
      timestamp: report.timestamp,
      success: report.success,
      summary: report.summary
    };
    
    const command = `npx claude-flow memory store "db-validation/${Date.now()}" '${JSON.stringify(memoryData)}'`;
    await runCommand(command);
    
    console.log(`${colors.green}✓ Updated MCP memory${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not update MCP memory: ${error.message}${colors.reset}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.cyan}Starting automated validation and fix process...${colors.reset}\n`);
  
  // Check environment
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    console.log(`${colors.yellow}⚠️  DATABASE_URL not set. Some fixes may require manual intervention.${colors.reset}\n`);
  }
  
  // Run validation and fix
  const results = await validateAndFix();
  
  // Generate report
  const report = await generateReport(results);
  
  // Update MCP memory
  await updateMCPMemory(report);
  
  // Summary
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  
  if (results.success) {
    console.log(`${colors.green}✅ All validations passed!${colors.reset}`);
    console.log(`${colors.green}   The database is properly configured.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ Validation failed!${colors.reset}`);
    console.log(`${colors.red}   Manual intervention may be required.${colors.reset}\n`);
    
    console.log(`${colors.yellow}📝 Next steps:${colors.reset}`);
    console.log(`1. Check the report at: logs/`);
    console.log(`2. Review errors in Supabase logs`);
    console.log(`3. Run manual fix: npm run db:fix`);
    console.log(`4. Contact support if issues persist\n`);
  }
  
  process.exit(results.success ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}❌ Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run
main().catch((error) => {
  console.error(`${colors.red}❌ Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});