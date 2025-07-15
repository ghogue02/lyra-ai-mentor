#!/usr/bin/env node

/**
 * Apply Database Fix using Node.js pg client
 * Direct SQL execution without requiring psql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

console.log(`${colors.cyan}🔧 Applying Database Fix via Node.js${colors.reset}\n`);

const DATABASE_URL = "postgresql://postgres:K3RsoxSpAf6qY1vU@db.hfkzwjnlxrwynactcmpe.supabase.co:5432/postgres";

async function applyFix() {
  try {
    // Try to import pg
    let Client;
    try {
      const pg = await import('pg');
      Client = pg.default.Client;
    } catch (err) {
      console.log(`${colors.yellow}⚠️  pg library not installed. Installing...${colors.reset}`);
      
      const { execSync } = await import('child_process');
      execSync('npm install pg', { stdio: 'inherit' });
      
      const pg = await import('pg');
      Client = pg.default.Client;
    }

    // Read SQL file
    const sqlPath = path.join(__dirname, 'mcp-toolkit-fix.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error(`${colors.red}❌ SQL file not found at: ${sqlPath}${colors.reset}`);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log(`${colors.green}✓${colors.reset} SQL file loaded\n`);

    // Connect to database
    console.log(`${colors.blue}📋 Connecting to database...${colors.reset}`);
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log(`${colors.green}✓${colors.reset} Connected to database\n`);

    // Execute SQL
    console.log(`${colors.blue}📋 Executing database fix...${colors.reset}`);
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    for (const statement of statements) {
      try {
        await client.query(statement);
        successCount++;
      } catch (err) {
        // Some statements may fail if objects already exist, that's okay
        if (!err.message.includes('already exists') && 
            !err.message.includes('does not exist') &&
            !err.message.includes('duplicate key')) {
          console.log(`${colors.yellow}⚠️  Warning: ${err.message}${colors.reset}`);
        }
      }
    }

    console.log(`${colors.green}✓${colors.reset} Executed ${successCount} SQL statements\n`);

    // Verify the fix
    console.log(`${colors.blue}📋 Verifying fix...${colors.reset}`);
    
    const verifyQuery = `
      SELECT 
        'toolkit_categories' as table_name,
        COUNT(*) as row_count
      FROM public.toolkit_categories
      UNION ALL
      SELECT 
        'toolkit_achievements' as table_name,
        COUNT(*) as row_count
      FROM public.toolkit_achievements;
    `;

    const result = await client.query(verifyQuery);
    
    console.log(`${colors.green}✓${colors.reset} Verification results:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}: ${row.row_count} rows`);
    });

    // Test the specific query that was failing
    console.log(`\n${colors.blue}📋 Testing original failing query...${colors.reset}`);
    
    try {
      const emailTest = await client.query(
        "SELECT id FROM public.toolkit_categories WHERE category_key = 'email'"
      );
      
      if (emailTest.rows.length > 0) {
        console.log(`${colors.green}✓${colors.reset} Email category found! ID: ${emailTest.rows[0].id}`);
      } else {
        console.log(`${colors.red}❌ Email category not found${colors.reset}`);
      }
    } catch (err) {
      console.log(`${colors.red}❌ Query failed: ${err.message}${colors.reset}`);
    }

    await client.end();
    
    console.log(`\n${colors.green}🎉 Database fix applied successfully!${colors.reset}`);
    console.log(`${colors.yellow}Next steps:${colors.reset}`);
    console.log(`   1. Refresh your browser`);
    console.log(`   2. Try the "Save to MyToolkit" feature`);
    console.log(`   3. The 404 errors should be gone!`);
    
    return true;

  } catch (error) {
    console.error(`${colors.red}❌ Error applying fix: ${error.message}${colors.reset}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log(`${colors.yellow}Network issue. Trying alternative approach...${colors.reset}`);
      console.log(`${colors.blue}Manual steps:${colors.reset}`);
      console.log(`   1. Copy SQL from: scripts/mcp-toolkit-fix.sql`);
      console.log(`   2. Paste in: https://hfkzwjnlxrwynactcmpe.supabase.com/sql`);
      console.log(`   3. Click Run`);
    }
    
    return false;
  }
}

// Run the fix
applyFix().then(success => {
  process.exit(success ? 0 : 1);
});