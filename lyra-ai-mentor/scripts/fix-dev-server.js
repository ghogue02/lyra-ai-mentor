#!/usr/bin/env node

/**
 * Fix Development Server 504 Errors
 * 
 * This script helps resolve Vite development server issues including:
 * - 504 Outdated Optimize Dep errors
 * - HMR connection problems
 * - Dependency pre-bundling conflicts
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

const CACHE_DIRS = [
  'node_modules/.vite',
  '.vite',
  'node_modules/.cache',
];

const TEMP_FILES = [
  '*.log',
  '.eslintcache',
  'tsconfig.tsbuildinfo',
];

async function cleanCache() {
  console.log('🧹 Cleaning Vite cache directories...');
  
  for (const dir of CACHE_DIRS) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      try {
        await execAsync(`rm -rf "${fullPath}"`);
        console.log(`  ✓ Removed ${dir}`);
      } catch (error) {
        console.error(`  ✗ Failed to remove ${dir}:`, error.message);
      }
    }
  }
}

async function cleanTempFiles() {
  console.log('🗑️  Cleaning temporary files...');
  
  for (const pattern of TEMP_FILES) {
    try {
      await execAsync(`rm -f ${pattern}`);
      console.log(`  ✓ Removed ${pattern}`);
    } catch (error) {
      // Ignore if no files match
    }
  }
}

async function optimizeDeps() {
  console.log('📦 Optimizing dependencies...');
  
  try {
    // First, ensure all dependencies are installed
    console.log('  → Checking dependencies...');
    await execAsync('npm install');
    
    // Force Vite to re-optimize dependencies
    console.log('  → Force optimizing with Vite...');
    await execAsync('npx vite optimize --force');
    
    console.log('  ✓ Dependencies optimized');
  } catch (error) {
    console.error('  ✗ Optimization failed:', error.message);
  }
}

async function verifyConfig() {
  console.log('🔍 Verifying Vite configuration...');
  
  const configPath = path.join(process.cwd(), 'vite.config.ts');
  if (!fs.existsSync(configPath)) {
    console.error('  ✗ vite.config.ts not found!');
    return;
  }
  
  const config = fs.readFileSync(configPath, 'utf8');
  
  // Check for important settings
  const checks = [
    { pattern: /hmr:\s*{/, name: 'HMR configuration' },
    { pattern: /optimizeDeps:\s*{/, name: 'Dependency optimization' },
    { pattern: /force:\s*mode\s*===\s*['"]development['"]/, name: 'Force optimization in dev' },
    { pattern: /preTransformRequests:\s*true/, name: 'Pre-transform requests' },
  ];
  
  for (const check of checks) {
    if (config.match(check.pattern)) {
      console.log(`  ✓ ${check.name} is configured`);
    } else {
      console.log(`  ⚠ ${check.name} might need configuration`);
    }
  }
}

async function showRecommendations() {
  console.log('\n📋 Recommendations:');
  console.log('  1. Use "npm run dev:clean" to start with a fresh cache');
  console.log('  2. If errors persist, run "npm run clean:all"');
  console.log('  3. Ensure all team members are using the same Node version');
  console.log('  4. Consider adding frequently-used dependencies to optimizeDeps.include');
  console.log('  5. Monitor the browser console for specific dependency errors');
  console.log('\n💡 Quick fixes:');
  console.log('  - For immediate relief: npm run dev:clean');
  console.log('  - For persistent issues: npm run clean:all');
  console.log('  - For dependency conflicts: npm run fix:deps');
}

async function main() {
  console.log('🚀 Fixing Vite Development Server Issues\n');
  
  try {
    await cleanCache();
    await cleanTempFiles();
    await optimizeDeps();
    await verifyConfig();
    await showRecommendations();
    
    console.log('\n✅ Server fix complete! Try running "npm run dev" now.');
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();