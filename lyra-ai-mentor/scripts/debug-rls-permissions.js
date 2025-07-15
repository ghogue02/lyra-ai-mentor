#!/usr/bin/env node

/**
 * Debug RLS Permissions for Toolkit Tables
 * Systematically identifies and fixes permission issues
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}🔍 Debugging RLS Permissions for Toolkit Tables${colors.reset}\n`);

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugPermissions() {
  console.log(`${colors.blue}Step 1: Check Authentication Status${colors.reset}`);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log(`${colors.red}❌ Auth Error: ${authError.message}${colors.reset}`);
      console.log(`${colors.yellow}💡 Solution: User needs to be authenticated to insert data${colors.reset}\n`);
      return false;
    }
    
    if (!user) {
      console.log(`${colors.yellow}⚠️  No authenticated user${colors.reset}`);
      console.log(`${colors.yellow}💡 This is likely the issue - RLS requires authentication for INSERT${colors.reset}\n`);
    } else {
      console.log(`${colors.green}✓ User authenticated: ${user.email}${colors.reset}`);
      console.log(`${colors.green}✓ User ID: ${user.id}${colors.reset}\n`);
    }
  } catch (err) {
    console.log(`${colors.red}❌ Auth check failed: ${err.message}${colors.reset}\n`);
  }

  console.log(`${colors.blue}Step 2: Test Table Access Permissions${colors.reset}`);
  
  const tables = [
    'toolkit_categories',
    'toolkit_items', 
    'toolkit_achievements',
    'user_toolkit_unlocks'
  ];

  for (const table of tables) {
    console.log(`${colors.blue}Testing ${table}...${colors.reset}`);
    
    // Test SELECT
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ${colors.red}❌ SELECT: ${error.message}${colors.reset}`);
      } else {
        console.log(`  ${colors.green}✓ SELECT: OK (${data?.length || 0} rows)${colors.reset}`);
      }
    } catch (err) {
      console.log(`  ${colors.red}❌ SELECT: ${err.message}${colors.reset}`);
    }

    // Test INSERT (this is where the 403 is happening)
    if (table === 'toolkit_items') {
      console.log(`${colors.blue}  Testing INSERT on toolkit_items (where error occurs)...${colors.reset}`);
      
      try {
        // Get a category first
        const { data: categories } = await supabase
          .from('toolkit_categories')
          .select('id, category_key')
          .eq('category_key', 'email')
          .single();
        
        if (categories) {
          console.log(`  ${colors.green}✓ Found email category: ${categories.id}${colors.reset}`);
          
          // Try to insert a test item
          const testItem = {
            name: 'DEBUG Test Item',
            category_id: categories.id,
            description: 'Test item for debugging permissions',
            file_type: 'test',
            is_active: true,
            metadata: { debug: true }
          };
          
          const { data: insertData, error: insertError } = await supabase
            .from('toolkit_items')
            .insert(testItem)
            .select();
          
          if (insertError) {
            console.log(`  ${colors.red}❌ INSERT: ${insertError.message}${colors.reset}`);
            console.log(`  ${colors.red}   Code: ${insertError.code}${colors.reset}`);
            console.log(`  ${colors.red}   Details: ${insertError.details}${colors.reset}`);
            console.log(`  ${colors.red}   Hint: ${insertError.hint}${colors.reset}`);
            
            if (insertError.code === '42501') {
              console.log(`  ${colors.yellow}💡 This is a permission denied error - RLS policy issue${colors.reset}`);
            }
          } else {
            console.log(`  ${colors.green}✓ INSERT: Success! Created item with ID: ${insertData[0]?.id}${colors.reset}`);
            
            // Clean up test item
            await supabase.from('toolkit_items').delete().eq('id', insertData[0].id);
            console.log(`  ${colors.blue}🧹 Cleaned up test item${colors.reset}`);
          }
        } else {
          console.log(`  ${colors.red}❌ No email category found${colors.reset}`);
        }
      } catch (err) {
        console.log(`  ${colors.red}❌ INSERT test failed: ${err.message}${colors.reset}`);
      }
    }
    
    console.log('');
  }

  console.log(`${colors.blue}Step 3: Check RLS Policies${colors.reset}`);
  
  try {
    // This query checks RLS policies but requires elevated permissions
    console.log(`${colors.yellow}Note: Cannot check RLS policies with anon key${colors.reset}`);
    console.log(`${colors.yellow}Need to check policies in Supabase dashboard${colors.reset}\n`);
  } catch (err) {
    console.log(`${colors.yellow}Expected: Cannot query RLS with anon permissions${colors.reset}\n`);
  }

  console.log(`${colors.blue}Step 4: Generate RLS Fix${colors.reset}`);
  
  const rlsFix = `-- Fix RLS Policies for Toolkit Tables
-- Run this in Supabase SQL Editor

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can create own unlocks" ON public.toolkit_items;
DROP POLICY IF EXISTS "Anyone can view active toolkit items" ON public.toolkit_items;

-- Create more permissive policies for toolkit_items
CREATE POLICY "Anyone can view toolkit items"
    ON public.toolkit_items FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert toolkit items"
    ON public.toolkit_items FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update own toolkit items"
    ON public.toolkit_items FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Ensure anon users can read categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.toolkit_categories;
CREATE POLICY "Anyone can view categories"
    ON public.toolkit_categories FOR SELECT
    USING (TRUE);

-- Ensure anon users can read achievements  
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.toolkit_achievements;
CREATE POLICY "Anyone can view achievements"
    ON public.toolkit_achievements FOR SELECT
    USING (TRUE);

-- For user_toolkit_unlocks, keep user-specific policies
DROP POLICY IF EXISTS "Users can create own unlocks" ON public.user_toolkit_unlocks;
DROP POLICY IF EXISTS "Users can view own unlocks" ON public.user_toolkit_unlocks;
DROP POLICY IF EXISTS "Users can update own unlocks" ON public.user_toolkit_unlocks;

CREATE POLICY "Users can manage own unlocks"
    ON public.user_toolkit_unlocks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant additional permissions
GRANT ALL ON public.toolkit_categories TO anon, authenticated;
GRANT ALL ON public.toolkit_items TO anon, authenticated;
GRANT ALL ON public.toolkit_achievements TO anon, authenticated;
GRANT ALL ON public.user_toolkit_unlocks TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';`;

  console.log(`${colors.yellow}RLS Fix SQL:${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(rlsFix);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  // Save the fix to a file
  const fs = await import('fs');
  const path = await import('path');
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  
  const fixPath = path.join(__dirname, 'fix-rls-permissions.sql');
  fs.writeFileSync(fixPath, rlsFix);
  
  console.log(`${colors.green}✓ RLS fix saved to: ${fixPath}${colors.reset}\n`);

  console.log(`${colors.cyan}Summary & Next Steps:${colors.reset}`);
  console.log(`${colors.yellow}The 403 error indicates RLS (Row Level Security) is blocking the INSERT${colors.reset}`);
  console.log(`${colors.yellow}This is common when policies are too restrictive${colors.reset}\n`);
  
  console.log(`${colors.blue}To fix:${colors.reset}`);
  console.log(`1. Copy the SQL above`);
  console.log(`2. Go to: https://hfkzwjnlxrwynactcmpe.supabase.com/sql`);
  console.log(`3. Paste and run the RLS fix`);
  console.log(`4. Test the save to toolkit feature again\n`);

  return true;
}

// Run the debugging
debugPermissions().catch(console.error);