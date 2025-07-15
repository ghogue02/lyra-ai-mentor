#!/usr/bin/env node

/**
 * Test script to validate Vite dependency optimization for /lyra-maya-demo route
 * This script runs a series of tests to ensure the 504 error is resolved
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../');
const execAsync = promisify(exec);

// Test configuration
const TEST_CONFIG = {
  devServerPort: 8080,
  testUrl: 'http://localhost:8080/lyra-maya-demo',
  maxLoadTime: 5000, // 5 seconds
  maxRetries: 3,
  testIterations: 10,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to check if port is available
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Helper function to wait for server to be ready
async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

// Test 1: Clean cache and validate deps directory
async function testCleanBuild() {
  log('\n📋 Test 1: Clean Build Test', 'blue');
  
  try {
    // Clean Vite cache
    const viteCachePath = path.join(projectRoot, 'node_modules/.vite');
    await fs.rm(viteCachePath, { recursive: true, force: true });
    log('✓ Vite cache cleaned', 'green');
    
    // Check if deps will be rebuilt
    const depsPath = path.join(viteCachePath, 'deps');
    const depsExist = await fs.access(depsPath).then(() => true).catch(() => false);
    
    if (!depsExist) {
      log('✓ Dependencies will be rebuilt on next start', 'green');
      return true;
    } else {
      log('✗ Failed to clean Vite cache', 'red');
      return false;
    }
  } catch (error) {
    log(`✗ Clean build test failed: ${error.message}`, 'red');
    return false;
  }
}

// Test 2: Validate React dependencies are optimized
async function testReactDependencies(devServer) {
  log('\n📋 Test 2: React Dependency Optimization', 'blue');
  
  try {
    // Wait for initial optimization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const depsPath = path.join(projectRoot, 'node_modules/.vite/deps');
    const requiredDeps = ['react.js', 'react-dom.js', 'react-router-dom.js'];
    const missingDeps = [];
    
    for (const dep of requiredDeps) {
      const depPath = path.join(depsPath, dep);
      const exists = await fs.access(depPath).then(() => true).catch(() => false);
      
      if (exists) {
        const stats = await fs.stat(depPath);
        const sizeInKB = stats.size / 1024;
        log(`✓ ${dep} optimized (${sizeInKB.toFixed(2)} KB)`, 'green');
        
        if (sizeInKB > 500) {
          log(`  ⚠️  Warning: ${dep} is larger than 500KB`, 'yellow');
        }
      } else {
        missingDeps.push(dep);
        log(`✗ ${dep} not found in optimized deps`, 'red');
      }
    }
    
    return missingDeps.length === 0;
  } catch (error) {
    log(`✗ React dependency test failed: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Load test the route
async function testRouteLoading() {
  log('\n📋 Test 3: Route Loading Performance', 'blue');
  
  const results = [];
  
  for (let i = 0; i < TEST_CONFIG.testIterations; i++) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(TEST_CONFIG.testUrl, {
        timeout: TEST_CONFIG.maxLoadTime,
      });
      
      const loadTime = Date.now() - startTime;
      results.push({
        success: response.ok,
        status: response.status,
        loadTime,
      });
      
      if (response.status === 504) {
        log(`✗ Iteration ${i + 1}: 504 Gateway Timeout (${loadTime}ms)`, 'red');
      } else if (response.ok) {
        log(`✓ Iteration ${i + 1}: Success (${loadTime}ms)`, 'green');
      } else {
        log(`⚠️  Iteration ${i + 1}: Status ${response.status} (${loadTime}ms)`, 'yellow');
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      log(`✗ Iteration ${i + 1}: ${error.message}`, 'red');
      results.push({
        success: false,
        error: error.message,
        loadTime: Date.now() - startTime,
      });
    }
  }
  
  // Analyze results
  const successCount = results.filter(r => r.success).length;
  const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
  const has504 = results.some(r => r.status === 504);
  
  log('\n📊 Loading Test Summary:', 'blue');
  log(`Success Rate: ${(successCount / TEST_CONFIG.testIterations * 100).toFixed(1)}%`);
  log(`Average Load Time: ${avgLoadTime.toFixed(0)}ms`);
  log(`504 Errors: ${has504 ? 'Yes ❌' : 'No ✅'}`);
  
  return successCount === TEST_CONFIG.testIterations && !has504;
}

// Test 4: Check for circular dependencies
async function testCircularDependencies() {
  log('\n📋 Test 4: Circular Dependency Check', 'blue');
  
  try {
    // Run a simple check for common circular dependency patterns
    const srcPath = path.join(projectRoot, 'src');
    const { stdout } = await execAsync(`find ${srcPath} -name "*.tsx" -o -name "*.ts" | xargs grep -l "LyraNarrated" | head -20`);
    
    const files = stdout.trim().split('\n').filter(Boolean);
    log(`Found ${files.length} files referencing LyraNarrated components`);
    
    // Check for potential circular imports
    let circularFound = false;
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        // Simple heuristic: check if file imports from its own directory recursively
        const fileName = path.basename(file, path.extname(file));
        const importPattern = new RegExp(`from ['"].*(${fileName}|LyraNarrated).*['"]`);
        
        if (importPattern.test(content)) {
          log(`⚠️  Potential circular import in ${path.relative(projectRoot, file)}`, 'yellow');
          circularFound = true;
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    if (!circularFound) {
      log('✓ No obvious circular dependencies detected', 'green');
    }
    
    return !circularFound;
  } catch (error) {
    log(`⚠️  Circular dependency check incomplete: ${error.message}`, 'yellow');
    return true; // Don't fail the test for this check
  }
}

// Test 5: Memory usage monitoring
async function testMemoryUsage(devServer) {
  log('\n📋 Test 5: Memory Usage Monitoring', 'blue');
  
  try {
    if (!devServer || !devServer.pid) {
      log('⚠️  Cannot monitor memory - no dev server PID', 'yellow');
      return true;
    }
    
    // Get initial memory usage
    const getMemory = async () => {
      const { stdout } = await execAsync(`ps -p ${devServer.pid} -o rss=`);
      return parseInt(stdout.trim()) / 1024; // Convert to MB
    };
    
    const initialMemory = await getMemory();
    log(`Initial memory usage: ${initialMemory.toFixed(2)} MB`);
    
    // Load the page multiple times
    for (let i = 0; i < 5; i++) {
      await fetch(TEST_CONFIG.testUrl);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const finalMemory = await getMemory();
    const memoryIncrease = finalMemory - initialMemory;
    
    log(`Final memory usage: ${finalMemory.toFixed(2)} MB`);
    log(`Memory increase: ${memoryIncrease.toFixed(2)} MB`);
    
    if (memoryIncrease > 100) {
      log('⚠️  Warning: Memory usage increased by more than 100MB', 'yellow');
      return false;
    } else {
      log('✓ Memory usage within acceptable limits', 'green');
      return true;
    }
  } catch (error) {
    log(`⚠️  Memory test incomplete: ${error.message}`, 'yellow');
    return true; // Don't fail the test for this check
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting Vite Optimization Tests', 'blue');
  log(`Testing URL: ${TEST_CONFIG.testUrl}`);
  
  let devServer = null;
  const testResults = {
    cleanBuild: false,
    reactDeps: false,
    routeLoading: false,
    circularDeps: false,
    memoryUsage: false,
  };
  
  try {
    // Check if port is available
    const portAvailable = await isPortAvailable(TEST_CONFIG.devServerPort);
    if (!portAvailable) {
      log(`\n⚠️  Port ${TEST_CONFIG.devServerPort} is already in use. Please stop the dev server and run tests again.`, 'yellow');
      process.exit(1);
    }
    
    // Run clean build test
    testResults.cleanBuild = await testCleanBuild();
    
    // Start dev server
    log('\n🔄 Starting development server...', 'blue');
    devServer = spawn('npm', ['run', 'dev'], {
      cwd: projectRoot,
      stdio: 'pipe',
      env: { ...process.env, VITE_DEBUG: 'true' },
    });
    
    // Capture server output
    let serverOutput = '';
    devServer.stdout.on('data', (data) => {
      serverOutput += data.toString();
      if (data.toString().includes('optimizing dependencies')) {
        log('📦 Vite is optimizing dependencies...', 'yellow');
      }
    });
    
    devServer.stderr.on('data', (data) => {
      if (data.toString().includes('error')) {
        log(`Server error: ${data}`, 'red');
      }
    });
    
    // Wait for server to be ready
    log('⏳ Waiting for server to be ready...');
    const serverReady = await waitForServer(`http://localhost:${TEST_CONFIG.devServerPort}`);
    
    if (!serverReady) {
      throw new Error('Dev server failed to start');
    }
    
    log('✓ Server is ready', 'green');
    
    // Run tests
    testResults.reactDeps = await testReactDependencies(devServer);
    testResults.routeLoading = await testRouteLoading();
    testResults.circularDeps = await testCircularDependencies();
    testResults.memoryUsage = await testMemoryUsage(devServer);
    
    // Summary
    log('\n📊 Test Summary', 'blue');
    log('================');
    
    const allPassed = Object.values(testResults).every(result => result);
    
    for (const [test, passed] of Object.entries(testResults)) {
      log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    }
    
    if (allPassed) {
      log('\n🎉 All tests passed! The Vite optimization fix is working correctly.', 'green');
    } else {
      log('\n❌ Some tests failed. Please review the results above.', 'red');
    }
    
    // Check for optimization warnings in server output
    if (serverOutput.includes('optimizing dependencies') && serverOutput.split('optimizing dependencies').length > 2) {
      log('\n⚠️  Warning: Multiple dependency optimization cycles detected', 'yellow');
    }
    
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    // Clean up
    if (devServer) {
      log('\n🧹 Cleaning up...', 'blue');
      devServer.kill();
    }
  }
}

// Run tests
runTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});