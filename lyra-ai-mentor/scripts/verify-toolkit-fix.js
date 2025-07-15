#!/usr/bin/env node

/**
 * Verify Toolkit Database Fix
 * Run this after applying the SQL fix to ensure everything is working
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying Toolkit Database Fix...\n');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function verifyFix() {
  let allPassed = true;
  const results = {
    tables: {},
    categories: 0,
    achievements: 0,
    errors: []
  };

  // 1. Check if tables exist
  console.log('📊 Checking tables...');
  const requiredTables = [
    'toolkit_categories',
    'toolkit_items', 
    'user_toolkit_unlocks',
    'toolkit_achievements',
    'user_toolkit_achievements'
  ];

  for (const tableName of requiredTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results.tables[tableName] = false;
        results.errors.push(`Table ${tableName}: ${error.message}`);
        console.log(`  ${colors.red}✗${colors.reset} ${tableName} - ${error.message}`);
        allPassed = false;
      } else {
        results.tables[tableName] = true;
        console.log(`  ${colors.green}✓${colors.reset} ${tableName} exists`);
      }
    } catch (err) {
      results.tables[tableName] = false;
      results.errors.push(`Table ${tableName}: ${err.message}`);
      console.log(`  ${colors.red}✗${colors.reset} ${tableName} - Error`);
      allPassed = false;
    }
  }

  // 2. Check categories
  console.log('\n📁 Checking categories...');
  try {
    const { data: categories, error } = await supabase
      .from('toolkit_categories')
      .select('category_key, name')
      .order('order_index');

    if (error) {
      console.log(`  ${colors.red}✗${colors.reset} Error fetching categories: ${error.message}`);
      results.errors.push(`Categories: ${error.message}`);
      allPassed = false;
    } else if (!categories || categories.length === 0) {
      console.log(`  ${colors.yellow}⚠${colors.reset} No categories found - run seed data`);
      results.categories = 0;
      allPassed = false;
    } else {
      results.categories = categories.length;
      console.log(`  ${colors.green}✓${colors.reset} Found ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`    - ${cat.category_key}: ${cat.name}`);
      });

      // Check for email category specifically
      const emailCategory = categories.find(c => c.category_key === 'email');
      if (!emailCategory) {
        console.log(`  ${colors.red}✗${colors.reset} Missing 'email' category!`);
        allPassed = false;
      }
    }
  } catch (err) {
    console.log(`  ${colors.red}✗${colors.reset} Error: ${err.message}`);
    results.errors.push(`Categories: ${err.message}`);
    allPassed = false;
  }

  // 3. Check achievements
  console.log('\n🏆 Checking achievements...');
  try {
    const { count, error } = await supabase
      .from('toolkit_achievements')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ${colors.red}✗${colors.reset} Error: ${error.message}`);
      results.errors.push(`Achievements: ${error.message}`);
      allPassed = false;
    } else {
      results.achievements = count || 0;
      console.log(`  ${colors.green}✓${colors.reset} Found ${count} achievements`);
    }
  } catch (err) {
    console.log(`  ${colors.red}✗${colors.reset} Error: ${err.message}`);
    results.errors.push(`Achievements: ${err.message}`);
    allPassed = false;
  }

  // 4. Test the specific query that was failing
  console.log('\n🧪 Testing original failing query...');
  try {
    const { data, error } = await supabase
      .from('toolkit_categories')
      .select('id')
      .eq('category_key', 'email')
      .single();

    if (error) {
      console.log(`  ${colors.red}✗${colors.reset} Query failed: ${error.message}`);
      results.errors.push(`Email category query: ${error.message}`);
      allPassed = false;
    } else if (data) {
      console.log(`  ${colors.green}✓${colors.reset} Email category query successful!`);
      console.log(`    Category ID: ${data.id}`);
    }
  } catch (err) {
    console.log(`  ${colors.red}✗${colors.reset} Error: ${err.message}`);
    results.errors.push(`Email category query: ${err.message}`);
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Verification Summary:');
  console.log('='.repeat(50));

  if (allPassed) {
    console.log(`\n${colors.green}✅ All checks passed! The toolkit database is properly configured.${colors.reset}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Regenerate TypeScript types:');
    console.log(`   ${colors.blue}npx supabase gen types typescript --local > src/integrations/supabase/types.ts${colors.reset}`);
    console.log('2. Test the save to toolkit feature in the app');
  } else {
    console.log(`\n${colors.red}❌ Some checks failed.${colors.reset}`);
    
    if (Object.values(results.tables).some(v => !v)) {
      console.log('\n📝 To fix missing tables:');
      console.log('1. Go to Supabase SQL Editor');
      console.log('2. Copy the SQL from FIX_TOOLKIT_TABLES.md');
      console.log('3. Run the entire script');
    } else if (results.categories === 0 || results.achievements === 0) {
      console.log('\n📝 Tables exist but data is missing:');
      console.log(`   ${colors.blue}npm run db:seed${colors.reset}`);
    }

    if (results.errors.length > 0) {
      console.log('\n🔴 Errors encountered:');
      results.errors.forEach(err => console.log(`  - ${err}`));
    }
  }

  return allPassed;
}

// Run verification
verifyFix().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});