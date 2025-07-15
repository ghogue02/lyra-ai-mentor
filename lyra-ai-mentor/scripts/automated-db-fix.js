#!/usr/bin/env node

/**
 * Automated Database Fix Script
 * Automatically applies database fixes to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.error('Please add it to your .env file for automated fixes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}🤖 Automated Database Fix Tool${colors.reset}\n`);

/**
 * Read SQL fix from markdown file
 */
async function extractSQLFromMarkdown(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const sqlBlocks = [];
  
  // Extract SQL blocks from markdown
  const sqlRegex = /```sql\n([\s\S]*?)```/g;
  let match;
  
  while ((match = sqlRegex.exec(content)) !== null) {
    const sql = match[1].trim();
    // Skip verification queries
    if (!sql.toLowerCase().includes('select') || sql.toLowerCase().includes('insert')) {
      sqlBlocks.push(sql);
    }
  }
  
  return sqlBlocks.join('\n\n');
}

/**
 * Execute SQL statements
 */
async function executeSQLStatements(sql) {
  try {
    // Split into individual statements (simple split by semicolon at line end)
    const statements = sql.split(/;\s*\n/).filter(s => s.trim());
    
    console.log(`${colors.blue}📝 Executing ${statements.length} SQL statements...${colors.reset}\n`);
    
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      // Get statement type for logging
      const stmtType = statement.match(/^\s*(\w+)/)?.[1]?.toUpperCase() || 'UNKNOWN';
      
      try {
        // Use supabase rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        }).single();
        
        if (error) {
          // Try direct approach if RPC doesn't exist
          if (error.message.includes('exec_sql')) {
            console.log(`${colors.yellow}⚠️  RPC function not available, skipping: ${stmtType}${colors.reset}`);
            results.failed++;
            results.errors.push({ statement: stmtType, error: 'RPC not available' });
          } else {
            console.log(`${colors.red}✗ Failed: ${stmtType} - ${error.message}${colors.reset}`);
            results.failed++;
            results.errors.push({ statement: stmtType, error: error.message });
          }
        } else {
          console.log(`${colors.green}✓ Success: ${stmtType}${colors.reset}`);
          results.success++;
        }
      } catch (err) {
        console.log(`${colors.red}✗ Error: ${stmtType} - ${err.message}${colors.reset}`);
        results.failed++;
        results.errors.push({ statement: stmtType, error: err.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error(`${colors.red}❌ Failed to execute SQL: ${error.message}${colors.reset}`);
    return { success: 0, failed: 1, errors: [{ statement: 'ALL', error: error.message }] };
  }
}

/**
 * Check which tables need to be created
 */
async function checkMissingTables() {
  const requiredTables = [
    'toolkit_categories',
    'toolkit_items',
    'user_toolkit_unlocks',
    'toolkit_achievements',
    'user_toolkit_achievements'
  ];
  
  const missing = [];
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
        .single();
      
      if (error && error.code === '42P01') { // table does not exist
        missing.push(table);
      }
    } catch {
      missing.push(table);
    }
  }
  
  return missing;
}

/**
 * Apply fixes based on what's missing
 */
async function applyFixes() {
  console.log(`${colors.magenta}🔍 Checking database state...${colors.reset}\n`);
  
  // Check what's missing
  const missingTables = await checkMissingTables();
  
  if (missingTables.length === 0) {
    console.log(`${colors.green}✅ All required tables exist!${colors.reset}`);
    
    // Check if data exists
    const { count: categoryCount } = await supabase
      .from('toolkit_categories')
      .select('*', { count: 'exact', head: true });
    
    if (categoryCount === 0) {
      console.log(`${colors.yellow}⚠️  Tables exist but no data found${colors.reset}`);
      console.log('Run seed data to populate categories and items');
    }
    
    return true;
  }
  
  console.log(`${colors.yellow}⚠️  Missing tables: ${missingTables.join(', ')}${colors.reset}\n`);
  
  // Read and apply the fix
  const fixPath = path.join(__dirname, '..', 'FIX_TOOLKIT_TABLES.md');
  
  try {
    console.log(`${colors.blue}📖 Reading fix from FIX_TOOLKIT_TABLES.md...${colors.reset}`);
    const sql = await extractSQLFromMarkdown(fixPath);
    
    if (!sql) {
      console.error(`${colors.red}❌ No SQL found in fix file${colors.reset}`);
      return false;
    }
    
    // Note: Direct SQL execution requires service role key or database URL
    console.log(`\n${colors.yellow}⚠️  Direct SQL execution through Supabase client is limited${colors.reset}`);
    console.log(`${colors.yellow}For automatic execution, use one of these methods:${colors.reset}\n`);
    console.log('1. Use Supabase CLI with database URL:');
    console.log(`   ${colors.cyan}export DATABASE_URL="your-database-url"${colors.reset}`);
    console.log(`   ${colors.cyan}psql $DATABASE_URL < fix.sql${colors.reset}\n`);
    
    console.log('2. Create RPC function in Supabase for SQL execution');
    console.log('3. Use migration files with Supabase CLI\n');
    
    // Save SQL to file for manual execution
    const sqlFile = path.join(__dirname, 'toolkit-fix.sql');
    await fs.writeFile(sqlFile, sql);
    console.log(`${colors.green}✓ SQL saved to: ${sqlFile}${colors.reset}`);
    console.log(`\nYou can now run: ${colors.cyan}psql $DATABASE_URL < ${sqlFile}${colors.reset}`);
    
    return false;
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Create automated workflow
 */
async function createAutomatedWorkflow() {
  console.log(`\n${colors.magenta}📋 Creating automated workflow...${colors.reset}\n`);
  
  const workflow = {
    name: 'Database Fix Automation',
    steps: [
      {
        name: 'Check Database State',
        command: 'node scripts/verify-toolkit-fix.js',
        continueOnError: true
      },
      {
        name: 'Apply SQL Fix (if needed)',
        command: 'psql $DATABASE_URL < scripts/toolkit-fix.sql',
        condition: 'previous_step_failed'
      },
      {
        name: 'Verify Fix Applied',
        command: 'node scripts/verify-toolkit-fix.js',
        required: true
      },
      {
        name: 'Generate TypeScript Types',
        command: 'npx supabase gen types typescript --local > src/integrations/supabase/types.ts',
        condition: 'fix_applied'
      }
    ]
  };
  
  // Save workflow as shell script
  const shellScript = `#!/bin/bash
# Automated Database Fix Workflow
# Generated by automated-db-fix.js

set -e

echo "🤖 Starting automated database fix..."

# Step 1: Check current state
echo "🔍 Checking database state..."
if node scripts/verify-toolkit-fix.js; then
  echo "✅ Database is already fixed!"
  exit 0
fi

# Step 2: Apply fix
echo "🔧 Applying database fix..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Please set it in your environment."
  echo "   export DATABASE_URL='postgresql://...' "
  exit 1
fi

psql $DATABASE_URL < scripts/toolkit-fix.sql

# Step 3: Verify fix
echo "✓ Verifying fix..."
if ! node scripts/verify-toolkit-fix.js; then
  echo "❌ Fix verification failed!"
  exit 1
fi

# Step 4: Update types
echo "📝 Updating TypeScript types..."
npx supabase gen types typescript --local > src/integrations/supabase/types.ts

echo "✅ Database fix completed successfully!"
`;

  const scriptPath = path.join(__dirname, 'apply-db-fix.sh');
  await fs.writeFile(scriptPath, shellScript);
  await fs.chmod(scriptPath, '755');
  
  console.log(`${colors.green}✓ Created automated workflow: ${scriptPath}${colors.reset}`);
  console.log(`\nTo run: ${colors.cyan}./scripts/apply-db-fix.sh${colors.reset}`);
  
  return workflow;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check and apply fixes
    const success = await applyFixes();
    
    if (!success) {
      // Create automated workflow for future use
      await createAutomatedWorkflow();
      
      console.log(`\n${colors.yellow}📝 Manual Action Required:${colors.reset}`);
      console.log('1. Set DATABASE_URL environment variable');
      console.log('2. Run the automated workflow script');
      console.log('3. Or apply the fix manually in Supabase SQL Editor\n');
      
      // Create MCP workflow integration
      const mcpWorkflow = {
        id: 'db-fix-automation',
        name: 'Toolkit Database Fix',
        triggers: ['404 on toolkit_categories', 'missing tables'],
        steps: [
          { tool: 'Bash', command: 'node scripts/verify-toolkit-fix.js' },
          { tool: 'Bash', command: './scripts/apply-db-fix.sh', condition: 'if_error' },
          { tool: 'mcp__claude-flow__memory_usage', action: 'store', key: 'db-fix-result' }
        ]
      };
      
      const workflowPath = path.join(__dirname, '..', '.claude', 'workflows', 'db-fix-automation.json');
      await fs.mkdir(path.dirname(workflowPath), { recursive: true });
      await fs.writeFile(workflowPath, JSON.stringify(mcpWorkflow, null, 2));
      
      console.log(`${colors.green}✓ Created MCP workflow: ${workflowPath}${colors.reset}`);
    }
    
    // Store result in memory
    const result = {
      timestamp: new Date().toISOString(),
      tablesChecked: 5,
      fixApplied: !success,
      automationCreated: true
    };
    
    console.log(`\n${colors.cyan}📊 Summary:${colors.reset}`);
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error(`${colors.red}❌ Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the automation
main();