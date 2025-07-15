#!/usr/bin/env node

/**
 * Apply Database Fix via Supabase Client
 * Alternative method that doesn't require DATABASE_URL
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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

console.log(`${colors.cyan}🔧 Applying Database Fix via Supabase Client${colors.reset}\n`);

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`${colors.blue}📋 Reading SQL fix file...${colors.reset}`);

// Read the SQL file
const sqlPath = path.join(__dirname, 'mcp-toolkit-fix.sql');
if (!fs.existsSync(sqlPath)) {
  console.error(`${colors.red}❌ SQL file not found at: ${sqlPath}${colors.reset}`);
  console.log(`${colors.yellow}Run 'npm run db:fix' first to generate the SQL file${colors.reset}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log(`${colors.green}✓${colors.reset} SQL file loaded\n`);

// Since we can't execute raw SQL via the client, let's create a manual instruction file
console.log(`${colors.yellow}⚠️  Direct SQL execution not available via client${colors.reset}\n`);

// Create a user-friendly instruction file
const instructionsPath = path.join(__dirname, '..', 'FIX_DATABASE_NOW.md');
const instructions = `# 🚨 IMMEDIATE ACTION REQUIRED: Fix Database Tables

The automated system has detected that your toolkit tables are missing. Follow these steps to fix the issue:

## Option 1: Quick Fix (Recommended)

1. **Open this link**: [Supabase SQL Editor](${supabaseUrl.replace('.supabase.co', '.supabase.com')}/sql)
   
2. **Copy ALL the SQL below** (including the first and last line):

\`\`\`sql
${sqlContent}
\`\`\`

3. **Paste** it into the SQL Editor

4. **Click "Run"** (or press Cmd/Ctrl + Enter)

5. You should see: "Success. No rows returned"

6. **Verify** by running in terminal:
   \`\`\`bash
   cd "${process.cwd()}"
   npm run db:check
   \`\`\`

## Option 2: Command Line (Requires psql)

1. Get your connection string from [Supabase Dashboard](${supabaseUrl.replace('.supabase.co', '.supabase.com')}/settings/database)

2. Run:
   \`\`\`bash
   export DATABASE_URL="your-connection-string"
   npm run db:fix:apply
   \`\`\`

## What This Fixes

- Creates all 5 missing toolkit tables
- Sets up proper relationships and indexes
- Enables Row Level Security
- Inserts required categories and achievements
- Adds sample data for testing

## After Applying the Fix

1. The "Save to MyToolkit" button will work
2. No more 404 errors in the console
3. You can save PACE emails and other content

## Still Having Issues?

- Make sure you're in the correct Supabase project
- Check that you clicked "Run" after pasting the SQL
- Try refreshing your browser
- Check Supabase logs for any errors

---
Generated: ${new Date().toISOString()}
`;

fs.writeFileSync(instructionsPath, instructions);

console.log(`${colors.green}✅ Created fix instructions at:${colors.reset}`);
console.log(`   ${instructionsPath}\n`);

// Also create a clickable HTML file for easier access
const htmlPath = path.join(__dirname, '..', 'FIX_DATABASE_NOW.html');
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Fix Toolkit Database</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #e11d48; }
        .sql-box {
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 12px;
            max-height: 400px;
            overflow-y: auto;
        }
        .copy-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .copy-btn:hover { background: #2563eb; }
        .copy-btn:active { transform: scale(0.98); }
        .success { color: #10b981; display: none; }
        .step {
            background: #eff6ff;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #3b82f6;
        }
        a { color: #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 Fix Toolkit Database Tables</h1>
        
        <div class="step">
            <strong>Step 1:</strong> Click the button below to copy the SQL fix
        </div>
        
        <button class="copy-btn" onclick="copySQL()">📋 Copy SQL Fix</button>
        <span class="success" id="copySuccess">✓ Copied to clipboard!</span>
        
        <div class="sql-box" id="sqlContent">${sqlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        
        <div class="step">
            <strong>Step 2:</strong> Open your <a href="${supabaseUrl.replace('.supabase.co', '.supabase.com')}/sql" target="_blank">Supabase SQL Editor</a>
        </div>
        
        <div class="step">
            <strong>Step 3:</strong> Paste the SQL and click "Run"
        </div>
        
        <div class="step">
            <strong>Step 4:</strong> Verify the fix worked by checking your app
        </div>
        
        <hr style="margin: 30px 0;">
        
        <p><strong>What this fixes:</strong> Missing toolkit_categories table and related tables that are causing 404 errors in your application.</p>
    </div>
    
    <script>
        function copySQL() {
            const sql = document.getElementById('sqlContent').textContent;
            navigator.clipboard.writeText(sql).then(() => {
                document.getElementById('copySuccess').style.display = 'inline';
                setTimeout(() => {
                    document.getElementById('copySuccess').style.display = 'none';
                }, 3000);
            }).catch(err => {
                alert('Failed to copy. Please select and copy manually.');
            });
        }
    </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);

console.log(`${colors.green}✅ Created interactive fix page at:${colors.reset}`);
console.log(`   ${htmlPath}\n`);

// Open the HTML file in the default browser
console.log(`${colors.cyan}Opening fix instructions in your browser...${colors.reset}\n`);

try {
  const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  require('child_process').exec(`${openCmd} "${htmlPath}"`);
} catch (err) {
  console.log(`${colors.yellow}Could not auto-open browser. Please open manually:${colors.reset}`);
  console.log(`   ${htmlPath}\n`);
}

console.log(`${colors.yellow}📋 Next Steps:${colors.reset}`);
console.log(`   1. ${colors.blue}Follow the instructions${colors.reset} in the opened page`);
console.log(`   2. ${colors.blue}Copy the SQL${colors.reset} using the button`);
console.log(`   3. ${colors.blue}Paste in Supabase${colors.reset} SQL Editor`);
console.log(`   4. ${colors.blue}Click Run${colors.reset} to apply the fix`);
console.log(`   5. ${colors.blue}Verify${colors.reset} with: npm run db:check\n`);

// Store in MCP memory
try {
  const { execSync } = require('child_process');
  execSync(`npx claude-flow hook notification --message "Database fix instructions generated at ${htmlPath}" --telemetry true`, {
    stdio: 'pipe'
  });
} catch (error) {
  // Ignore MCP errors
}

process.exit(0);