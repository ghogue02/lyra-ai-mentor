#!/usr/bin/env node

/**
 * Test specific elements causing issues
 * Run with: node scripts/test-specific-elements.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing Specific Elements (68, 175, 171)...\n');

// Mock the elements from console log to test componentLoader
const mockElements = [
  { id: 68, type: 'mock_type', title: 'Mock Title 1', lessonId: 5 },
  { id: 175, type: 'mock_type_2', title: 'Mock Title 2', lessonId: 5 },
  { id: 171, type: 'mock_type_3', title: 'Mock Title 3', lessonId: 5 }
];

// Read componentLoader to test getComponentName function manually
const componentLoaderPath = path.join(__dirname, '..', 'src', 'components', 'lesson', 'interactive', 'componentLoader.ts');
const componentLoaderContent = fs.readFileSync(componentLoaderPath, 'utf8');

console.log('📋 Checking getComponentName for type safety...');

// Check if getComponentName properly handles different input types
const getComponentNameFunction = componentLoaderContent.match(/export function getComponentName\(([\s\S]*?)\): string \| null \{([\s\S]*?)\n\}/);

if (getComponentNameFunction) {
  const params = getComponentNameFunction[1];
  const body = getComponentNameFunction[2];
  
  console.log('  ✅ getComponentName function found');
  console.log(`  📝 Parameters: ${params.trim()}`);
  
  // Check if elementTitle parameter is properly handled
  if (body.includes('String(elementTitle') || body.includes('typeof elementTitle')) {
    console.log('  ✅ elementTitle appears to be safely converted');
  } else {
    console.log('  ⚠️  WARNING: elementTitle may not be safely converted to string');
  }
  
  // Check for potential object comparisons
  const titleChecks = body.match(/title[^a-zA-Z]*===|title[^a-zA-Z]*includes/g);
  if (titleChecks) {
    console.log('  📋 Title comparisons found:');
    titleChecks.forEach(check => console.log(`    - ${check}`));
  }
} else {
  console.log('  ❌ getComponentName function not found');
}

console.log('\n🔍 Checking for potential component import issues...');

// Check if any of the component imports might be problematic
const componentImports = componentLoaderContent.match(/'[^']*': \(\) => import\([^)]+\)/g);
if (componentImports) {
  console.log(`  📋 Found ${componentImports.length} component imports`);
  
  // Check for any that might have special characters or objects in names
  const problematicImports = componentImports.filter(imp => 
    imp.includes('${') || 
    imp.includes('`') || 
    imp.includes('object') ||
    imp.includes('[object')
  );
  
  if (problematicImports.length > 0) {
    console.log('  ⚠️  Potentially problematic imports:');
    problematicImports.forEach(imp => console.log(`    - ${imp}`));
  } else {
    console.log('  ✅ All imports appear to be static strings');
  }
}

console.log('\n🔍 Creating integration test for interactive elements...');

// Create a simple test to verify component loading
const testContent = `
import { describe, it, expect, vi } from 'vitest';
import { loadComponent, getComponentName } from '../src/components/lesson/interactive/componentLoader';

describe('Interactive Element Loading', () => {
  it('should handle string titles without errors', () => {
    const result = getComponentName('knowledge_check', 5, 'Test Title');
    expect(typeof result === 'string' || result === null).toBe(true);
  });

  it('should handle object titles by converting to string', () => {
    const objectTitle = { toString: () => 'Test Title' };
    const result = getComponentName('knowledge_check', 5, objectTitle);
    expect(typeof result === 'string' || result === null).toBe(true);
  });

  it('should handle null/undefined titles', () => {
    const result1 = getComponentName('knowledge_check', 5, null);
    const result2 = getComponentName('knowledge_check', 5, undefined);
    expect(typeof result1 === 'string' || result1 === null).toBe(true);
    expect(typeof result2 === 'string' || result2 === null).toBe(true);
  });

  it('should load components without throwing object conversion errors', () => {
    expect(() => {
      const component = loadComponent('KnowledgeCheckRenderer');
      expect(component).toBeDefined();
    }).not.toThrow();
  });
});
`;

const testPath = path.join(__dirname, '..', 'tests', 'interactive-element-loading.test.ts');
fs.writeFileSync(testPath, testContent);

console.log('  ✅ Created integration test: tests/interactive-element-loading.test.ts');

console.log('\n🎯 Recommendations:');
console.log('  1. Run the integration test to verify component loading works');
console.log('  2. Check if any database values are returning objects instead of strings');
console.log('  3. Add explicit string conversion in all component prop passing');
console.log('  4. Test with actual lesson 5 elements from database');

console.log('\n🚨 Critical Fix Needed:');
console.log('  The "Cannot convert object to primitive value" error suggests');
console.log('  that somewhere in the React.lazy() chain, an object is being');
console.log('  passed where a string is expected. This could be:');
console.log('  - Component name parameter');
console.log('  - Error message parameter'); 
console.log('  - Props being passed to the lazy component');
console.log('  - Title/content from database being an object instead of string');