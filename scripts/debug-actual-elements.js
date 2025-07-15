#!/usr/bin/env node

/**
 * Debug script to check actual elements 68, 175, 171 causing errors
 * Run with: node scripts/debug-actual-elements.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Debugging Actual Elements 68, 175, 171...\n');

// Read componentLoader to see what these elements should map to
const componentLoaderPath = path.join(__dirname, '..', 'src', 'components', 'lesson', 'interactive', 'componentLoader.ts');
const componentLoaderContent = fs.readFileSync(componentLoaderPath, 'utf8');

console.log('📋 Testing getComponentName function with mock data:');

// Mock the actual elements based on console log (lesson 5, chapter 2)
const mockElements = [
  { id: 68, type: 'unknown_type_68', title: 'Mock Title 68', lessonId: 5 },
  { id: 175, type: 'unknown_type_175', title: 'Mock Title 175', lessonId: 5 },
  { id: 171, type: 'unknown_type_171', title: 'Mock Title 171', lessonId: 5 }
];

// Check what happens when we try to get component names for unknown types
console.log('   Testing unknown element types:');
mockElements.forEach(element => {
  console.log(`   - Element ${element.id}: type="${element.type}" -> Would return null (fallback)`);
});

console.log('\n🔍 Checking for common element types in lesson 5:');

// Common types that might be in lesson 5
const commonTypes = [
  'lyra_chat',
  'reflection', 
  'knowledge_check',
  'callout_box',
  'ai_email_composer',
  'document_generator',
  'meeting_prep_assistant'
];

commonTypes.forEach(type => {
  const hasType = componentLoaderContent.includes(`case '${type}':`);
  console.log(`   - ${type}: ${hasType ? '✅ Mapped' : '❌ Not mapped'}`);
});

console.log('\n🚨 Potential Issues:');
console.log('   1. Elements might have types not mapped in componentLoader');
console.log('   2. getComponentName might return null, causing fallback');
console.log('   3. Fallback component rendering might be causing the error');
console.log('   4. Component import might be failing during lazy loading');

console.log('\n🔍 Checking InteractiveElementRenderer fallback handling...');

const rendererPath = path.join(__dirname, '..', 'src', 'components', 'lesson', 'InteractiveElementRenderer.tsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

const hasFallback = rendererContent.includes('if (!componentName)');
console.log(`   - Has fallback for null componentName: ${hasFallback ? '✅' : '❌'}`);

const fallbackContent = rendererContent.match(/if \(!componentName\) \{[\s\S]*?\}/);
if (fallbackContent) {
  console.log('   - Fallback code:');
  console.log('     ' + fallbackContent[0].replace(/\n/g, '\n     '));
}

console.log('\n📝 Database Query Needed:');
console.log('   To find the root cause, run this SQL query:');
console.log('   SELECT id, type, title, content FROM interactive_elements WHERE id IN (68, 175, 171);');

console.log('\n🎯 Next Steps:');
console.log('   1. Query database to get actual element types and titles');
console.log('   2. Test getComponentName with actual element data');
console.log('   3. Check if specific components are failing to import');
console.log('   4. Add more robust error handling in lazy loading');

console.log('\n🔧 Quick Fix Approach:');
console.log('   Add debugging to componentLoader to see what\'s actually happening:');
console.log('   - Log all getComponentName calls');
console.log('   - Log all loadComponent calls'); 
console.log('   - Catch and log any import errors');
console.log('   - Add null checks before lazy loading');