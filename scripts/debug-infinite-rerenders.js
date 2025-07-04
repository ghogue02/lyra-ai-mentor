#!/usr/bin/env node

/**
 * Debug script to identify infinite re-render causes
 * Run with: node scripts/debug-infinite-rerenders.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Debugging Infinite Re-render Issues...\n');

// Check useLessonData for unstable dependencies
const useLessonDataPath = path.join(__dirname, '..', 'src', 'hooks', 'useLessonData.ts');
const useLessonDataContent = fs.readFileSync(useLessonDataPath, 'utf8');

console.log('📋 useLessonData.ts Analysis:');

// Check for proper useCallback usage
const fetchLessonDataMatch = useLessonDataContent.match(/const fetchLessonData = useCallback\([\s\S]*?\], \[([\s\S]*?)\]\);/);
if (fetchLessonDataMatch) {
  const dependencies = fetchLessonDataMatch[1];
  console.log('  ✅ fetchLessonData useCallback found');
  console.log(`  📝 Dependencies: [${dependencies.trim()}]`);
  
  // Check for potentially unstable dependencies
  if (dependencies.includes('user') && !dependencies.includes('user?.id')) {
    console.log('  ⚠️  WARNING: Using full user object instead of user.id');
  }
  if (dependencies.includes('updateChatEngagement') && !useLessonDataContent.includes('const updateChatEngagement = useCallback')) {
    console.log('  ⚠️  WARNING: updateChatEngagement not memoized before being used as dependency');
  }
} else {
  console.log('  ❌ fetchLessonData useCallback not found or malformed');
}

// Check updateChatEngagement
const updateChatMatch = useLessonDataContent.match(/const updateChatEngagement = useCallback\([\s\S]*?\], \[([\s\S]*?)\]\);/);
if (updateChatMatch) {
  const dependencies = updateChatMatch[1];
  console.log('  ✅ updateChatEngagement useCallback found');
  console.log(`  📝 Dependencies: [${dependencies.trim()}]`);
} else {
  console.log('  ❌ updateChatEngagement useCallback not found or malformed');
}

// Check for useEffect that might be causing loops
const useEffectMatches = useLessonDataContent.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[([\s\S]*?)\]\);/g);
if (useEffectMatches) {
  console.log('  📋 useEffect dependencies:');
  useEffectMatches.forEach((match, index) => {
    const depsMatch = match.match(/\[([\s\S]*?)\]$/);
    if (depsMatch) {
      console.log(`    ${index + 1}. [${depsMatch[1].trim()}]`);
    }
  });
}

console.log('\n🔍 Checking InteractiveElementRenderer for object issues...');

// Check InteractiveElementRenderer
const rendererPath = path.join(__dirname, '..', 'src', 'components', 'lesson', 'InteractiveElementRenderer.tsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

// Look for places where objects might be passed to string contexts
const dangerousPatterns = [
  /title.*=.*element\.title[^}]/g,
  /element\.type[^}]/g,
  /element\.content[^}]/g,
  /loadComponent\(.*element\./g
];

console.log('  📋 Checking for unsafe object usage:');
dangerousPatterns.forEach((pattern, index) => {
  const matches = rendererContent.match(pattern);
  if (matches) {
    console.log(`    ⚠️  Pattern ${index + 1}: Found ${matches.length} potential issues`);
    matches.forEach(match => console.log(`      - ${match}`));
  }
});

// Check component loader for object issues
console.log('\n🔍 Checking componentLoader for lazy loading issues...');

const componentLoaderPath = path.join(__dirname, '..', 'src', 'components', 'lesson', 'interactive', 'componentLoader.ts');
const componentLoaderContent = fs.readFileSync(componentLoaderPath, 'utf8');

// Check if getComponentName might be returning objects
const getComponentNameMatch = componentLoaderContent.match(/export function getComponentName\([\s\S]*?\): string \| null \{[\s\S]*?\}/);
if (getComponentNameMatch) {
  console.log('  ✅ getComponentName function found');
  
  // Check for cases where objects might be returned
  if (componentLoaderContent.includes('elementTitle') && !componentLoaderContent.includes('String(elementTitle')) {
    console.log('  ⚠️  WARNING: elementTitle used without String() conversion');
  }
} else {
  console.log('  ❌ getComponentName function not found or malformed');
}

console.log('\n📊 Re-render Loop Risk Assessment:');
console.log('  High Risk Factors:');
console.log('    - User object in dependencies (should be user.id)');
console.log('    - Functions not wrapped in useCallback used as dependencies');
console.log('    - Objects passed to primitive contexts in React.lazy()');
console.log('    - useEffect with unstable dependencies triggering fetchLessonData');

console.log('\n🎯 Next Steps:');
console.log('  1. Fix dependency arrays in useLessonData');
console.log('  2. Ensure all objects are converted to primitives before lazy loading');
console.log('  3. Add integration test to verify no infinite loops');
console.log('  4. Test interactive elements load without errors');