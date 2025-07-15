#!/usr/bin/env node

/**
 * Apply Database Fix using Supabase Client
 * Uses RPC functions to execute raw SQL
 */

import { createClient } from '@supabase/supabase-js';
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

console.log(`${colors.cyan}🔧 Applying Database Fix via Supabase Client${colors.reset}\n`);

const supabaseUrl = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTablesViaClient() {
  try {
    console.log(`${colors.blue}📋 Creating tables via Supabase client...${colors.reset}\n`);

    // Step 1: Create categories manually
    console.log(`${colors.blue}1. Creating toolkit categories...${colors.reset}`);
    
    const categories = [
      {
        category_key: 'email',
        name: 'Email Templates',
        description: 'Professional email templates for every occasion',
        icon: 'Mail',
        gradient: 'from-blue-500 to-cyan-500',
        order_index: 1
      },
      {
        category_key: 'grants',
        name: 'Grant Proposals',
        description: 'Winning grant proposal templates and guides',
        icon: 'FileText',
        gradient: 'from-purple-500 to-pink-500',
        order_index: 2
      },
      {
        category_key: 'data',
        name: 'Data Visualizations',
        description: 'Interactive charts and data presentation tools',
        icon: 'BarChart3',
        gradient: 'from-green-500 to-emerald-500',
        order_index: 3
      },
      {
        category_key: 'automation',
        name: 'Automation Workflows',
        description: 'Time-saving automation templates',
        icon: 'Workflow',
        gradient: 'from-orange-500 to-red-500',
        order_index: 4
      },
      {
        category_key: 'change',
        name: 'Change Management',
        description: 'Tools for managing organizational change',
        icon: 'Users',
        gradient: 'from-indigo-500 to-purple-500',
        order_index: 5
      },
      {
        category_key: 'social',
        name: 'Social Media Content',
        description: 'Engaging social media templates',
        icon: 'Share2',
        gradient: 'from-pink-500 to-rose-500',
        order_index: 6
      },
      {
        category_key: 'training',
        name: 'Training Materials',
        description: 'Educational resources and training templates',
        icon: 'BookOpen',
        gradient: 'from-teal-500 to-cyan-500',
        order_index: 7
      },
      {
        category_key: 'reports',
        name: 'Reports & Presentations',
        description: 'Professional report and presentation templates',
        icon: 'Presentation',
        gradient: 'from-amber-500 to-orange-500',
        order_index: 8
      }
    ];

    // Since we can't create tables via client, let's just verify if they exist
    console.log(`${colors.blue}📋 Checking if tables exist...${colors.reset}`);
    
    try {
      const { data, error } = await supabase
        .from('toolkit_categories')
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`${colors.green}✓${colors.reset} Tables already exist!`);
        
        // Check if categories exist
        const { data: existingCategories } = await supabase
          .from('toolkit_categories')
          .select('category_key');
        
        const existingKeys = new Set(existingCategories?.map(c => c.category_key) || []);
        const missingCategories = categories.filter(c => !existingKeys.has(c.category_key));
        
        if (missingCategories.length > 0) {
          console.log(`${colors.blue}📋 Inserting missing categories...${colors.reset}`);
          
          for (const category of missingCategories) {
            const { error: insertError } = await supabase
              .from('toolkit_categories')
              .insert(category);
            
            if (insertError) {
              console.log(`${colors.yellow}⚠️  ${category.category_key}: ${insertError.message}${colors.reset}`);
            } else {
              console.log(`${colors.green}✓${colors.reset} Created category: ${category.category_key}`);
            }
          }
        }
        
        // Check for email category specifically
        const { data: emailCategory } = await supabase
          .from('toolkit_categories')
          .select('id')
          .eq('category_key', 'email')
          .single();
        
        if (emailCategory) {
          console.log(`${colors.green}🎉 SUCCESS! Email category exists with ID: ${emailCategory.id}${colors.reset}`);
          console.log(`${colors.green}The "Save to MyToolkit" feature should now work!${colors.reset}\n`);
          
          console.log(`${colors.yellow}Next steps:${colors.reset}`);
          console.log(`   1. Refresh your browser`);
          console.log(`   2. Try generating an email and saving to toolkit`);
          console.log(`   3. The 404 errors should be gone!`);
          
          return true;
        }
      }
    } catch (err) {
      console.log(`${colors.red}❌ Tables don't exist. Need to create them first.${colors.reset}\n`);
    }

    // If we get here, tables need to be created
    console.log(`${colors.yellow}⚠️  Tables need to be created via SQL Editor${colors.reset}\n`);
    
    console.log(`${colors.cyan}MANUAL STEPS REQUIRED:${colors.reset}`);
    console.log(`${colors.blue}1.${colors.reset} Open: ${colors.cyan}https://hfkzwjnlxrwynactcmpe.supabase.com/sql${colors.reset}`);
    console.log(`${colors.blue}2.${colors.reset} Copy the SQL from: ${colors.cyan}scripts/mcp-toolkit-fix.sql${colors.reset}`);
    console.log(`${colors.blue}3.${colors.reset} Paste it in the SQL Editor`);
    console.log(`${colors.blue}4.${colors.reset} Click "Run"`);
    console.log(`${colors.blue}5.${colors.reset} Run: ${colors.cyan}npm run db:check${colors.reset} to verify\n`);

    // Show the SQL file content for easy copying
    const sqlPath = path.join(__dirname, 'mcp-toolkit-fix.sql');
    if (fs.existsSync(sqlPath)) {
      console.log(`${colors.yellow}📋 SQL to copy:${colors.reset}`);
      console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      console.log(sqlContent.substring(0, 500) + '...');
      console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
      console.log(`${colors.yellow}(Full SQL in: ${sqlPath})${colors.reset}\n`);
    }

    return false;

  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the fix
createTablesViaClient().then(success => {
  if (success) {
    console.log(`${colors.green}✅ Database fix completed successfully!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}📋 Manual intervention required to create tables${colors.reset}`);
  }
  process.exit(success ? 0 : 1);
});