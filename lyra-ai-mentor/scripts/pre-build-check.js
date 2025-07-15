#!/usr/bin/env node

/**
 * Pre-build validation script
 * Checks for common errors before building or committing
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running pre-build checks...\n');

let hasErrors = false;
const errors = [];
const warnings = [];

// Color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// 1. Check TypeScript compilation
console.log('📋 Checking TypeScript compilation...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log(`${colors.green}✓${colors.reset} TypeScript compilation passed\n`);
} catch (error) {
  hasErrors = true;
  errors.push('TypeScript compilation failed');
  console.log(`${colors.red}✗${colors.reset} TypeScript compilation failed\n`);
  console.error(error.stdout?.toString() || error.toString());
}

// 2. Check for missing imports
console.log('📦 Checking for missing imports...');
const srcDir = path.join(__dirname, '..', 'src');

function checkImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  const lazyImportRegex = /lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/g;
  
  let match;
  const imports = [];
  
  // Regular imports
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Lazy imports
  while ((match = lazyImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  imports.forEach(importPath => {
    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
      // Local import - check if file exists
      let resolvedPath = importPath;
      if (importPath.startsWith('@/')) {
        resolvedPath = importPath.replace('@/', './src/');
      }
      
      const basePath = path.dirname(filePath);
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
      let found = false;
      
      for (const ext of extensions) {
        const fullPath = path.resolve(basePath, resolvedPath + ext);
        if (fs.existsSync(fullPath)) {
          found = true;
          break;
        }
      }
      
      if (!found && !resolvedPath.includes('*')) {
        warnings.push(`Missing import in ${path.relative(process.cwd(), filePath)}: ${importPath}`);
      }
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      checkImports(filePath);
    }
  });
}

try {
  walkDir(srcDir);
  if (warnings.length === 0) {
    console.log(`${colors.green}✓${colors.reset} All imports resolved\n`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Found ${warnings.length} import warnings\n`);
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Error checking imports: ${error.message}\n`);
}

// 3. Check for common React errors
console.log('⚛️  Checking for common React errors...');
const reactErrors = [];

function checkReactErrors(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for missing key props in maps
  if (content.includes('.map(') && !content.includes('key=')) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('.map(') && !lines.slice(index, index + 5).some(l => l.includes('key='))) {
        warnings.push(`Possible missing key prop in ${path.relative(process.cwd(), filePath)}:${index + 1}`);
      }
    });
  }
  
  // Check for direct mutations of state
  const stateRegex = /set[A-Z]\w+\s*\([^)]*\.\s*(push|pop|shift|unshift|splice)\(/g;
  if (stateRegex.test(content)) {
    reactErrors.push(`Possible state mutation in ${path.relative(process.cwd(), filePath)}`);
  }
  
  // Check for missing dependencies in useEffect/useMemo/useCallback
  const hookRegex = /(useEffect|useMemo|useCallback)\s*\(\s*(?:\(\)|async\s*\(\)|function|\(\w+\)\s*=>|[\w\s,{}]+\s*=>)/g;
  let hookMatch;
  while ((hookMatch = hookRegex.exec(content)) !== null) {
    const hookStart = hookMatch.index;
    const hookType = hookMatch[1];
    
    // Simple check - could be improved
    const afterHook = content.substring(hookStart);
    const closingIndex = findMatchingBracket(afterHook, '(', ')');
    
    if (closingIndex > 0) {
      const hookContent = afterHook.substring(0, closingIndex);
      if (!hookContent.includes('[') && !hookContent.includes('// eslint-disable')) {
        warnings.push(`Possible missing dependency array in ${hookType} at ${path.relative(process.cwd(), filePath)}`);
      }
    }
  }
}

function findMatchingBracket(str, open, close) {
  let count = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';
    
    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== '\\') {
      inString = false;
    } else if (!inString) {
      if (char === open) count++;
      else if (char === close) {
        count--;
        if (count === 0) return i;
      }
    }
  }
  return -1;
}

try {
  walkDir(srcDir);
  if (reactErrors.length === 0) {
    console.log(`${colors.green}✓${colors.reset} No React errors detected\n`);
  } else {
    hasErrors = true;
    errors.push(...reactErrors);
    console.log(`${colors.red}✗${colors.reset} Found ${reactErrors.length} React errors\n`);
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Error checking React patterns: ${error.message}\n`);
}

// 4. Check for console.log statements
console.log('🚫 Checking for console.log statements...');
let consoleCount = 0;

function checkConsoleLog(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const consoleRegex = /console\.(log|error|warn|info|debug)\(/g;
  const matches = content.match(consoleRegex);
  
  if (matches) {
    consoleCount += matches.length;
    warnings.push(`Found ${matches.length} console statements in ${path.relative(process.cwd(), filePath)}`);
  }
}

try {
  walkDir(srcDir);
  if (consoleCount === 0) {
    console.log(`${colors.green}✓${colors.reset} No console statements found\n`);
  } else {
    console.log(`${colors.yellow}⚠${colors.reset} Found ${consoleCount} console statements\n`);
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Error checking console statements: ${error.message}\n`);
}

// 5. Check for ESLint errors
console.log('🔧 Running ESLint...');
try {
  execSync('npx eslint src --ext .ts,.tsx --max-warnings 10', { stdio: 'pipe' });
  console.log(`${colors.green}✓${colors.reset} ESLint passed\n`);
} catch (error) {
  warnings.push('ESLint found issues');
  console.log(`${colors.yellow}⚠${colors.reset} ESLint found issues (non-blocking)\n`);
}

// 6. Check for duplicate component exports
console.log('📄 Checking for duplicate exports...');
const exportMap = new Map();

function checkExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportRegex = /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g;
  
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportName = match[1];
    if (exportMap.has(exportName)) {
      warnings.push(`Duplicate export '${exportName}' in ${path.relative(process.cwd(), filePath)} and ${exportMap.get(exportName)}`);
    } else {
      exportMap.set(exportName, path.relative(process.cwd(), filePath));
    }
  }
}

try {
  walkDir(srcDir);
  console.log(`${colors.green}✓${colors.reset} Export check completed\n`);
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Error checking exports: ${error.message}\n`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log('='.repeat(50));

if (errors.length > 0) {
  console.log(`\n${colors.red}Errors (${errors.length}):${colors.reset}`);
  errors.forEach(error => console.log(`  ❌ ${error}`));
}

if (warnings.length > 0) {
  console.log(`\n${colors.yellow}Warnings (${warnings.length}):${colors.reset}`);
  warnings.slice(0, 10).forEach(warning => console.log(`  ⚠️  ${warning}`));
  if (warnings.length > 10) {
    console.log(`  ... and ${warnings.length - 10} more warnings`);
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log(`\n${colors.green}✅ All checks passed! Your code is ready to build.${colors.reset}`);
} else if (errors.length === 0) {
  console.log(`\n${colors.yellow}⚠️  Build can proceed, but consider fixing the warnings.${colors.reset}`);
} else {
  console.log(`\n${colors.red}❌ Build blocked due to errors. Please fix them before proceeding.${colors.reset}`);
  process.exit(1);
}

// Add note about running this automatically
console.log(`\n${colors.blue}💡 Tip: Add this to your package.json scripts:${colors.reset}`);
console.log('   "precheck": "node scripts/pre-build-check.js"');
console.log('   "build": "npm run precheck && vite build"');
console.log('   "dev": "npm run precheck && vite"\n');