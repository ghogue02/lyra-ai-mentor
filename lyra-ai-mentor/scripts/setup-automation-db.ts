#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

import { supabase } from '../src/integrations/supabase/client';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Setup the automation database schema
 * Usage: npm run setup-automation-db
 */

async function setupAutomationDatabase() {
  console.log('🗄️ Setting up Automation Database Schema...');
  console.log('============================================');

  try {
    // Read the schema SQL file
    const schemaPath = join(__dirname, '..', 'database', 'schemas', 'automation-schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading schema file...');
    console.log(`   File: ${schemaPath}`);
    console.log(`   Size: ${schemaSQL.length} characters`);

    // Split SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.toLowerCase().includes('drop table')) {
        console.log(`   ${i + 1}. Dropping existing table...`);
      } else if (statement.toLowerCase().includes('create table')) {
        const tableName = statement.match(/create table (\w+\.\w+)/i)?.[1] || 'unknown';
        console.log(`   ${i + 1}. Creating table: ${tableName}`);
      } else if (statement.toLowerCase().includes('create index')) {
        const indexName = statement.match(/create index (\w+)/i)?.[1] || 'unknown';
        console.log(`   ${i + 1}. Creating index: ${indexName}`);
      } else if (statement.toLowerCase().includes('create policy')) {
        console.log(`   ${i + 1}. Creating security policy...`);
      } else if (statement.toLowerCase().includes('insert into')) {
        console.log(`   ${i + 1}. Inserting sample data...`);
      } else {
        console.log(`   ${i + 1}. Executing statement...`);
      }

      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Some errors are expected (like table already exists)
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist')) {
          console.log(`      ⚠️  ${error.message}`);
        } else {
          console.error(`      ❌ Error: ${error.message}`);
        }
      } else {
        console.log(`      ✅ Success`);
      }
    }

    console.log('\n🧪 Testing database connection...');
    
    // Test the tables were created
    const { data: jobs, error: jobsError } = await supabase
      .from('automation_jobs')
      .select('count(*)')
      .single();

    if (jobsError) {
      console.error('❌ Error testing automation_jobs table:', jobsError.message);
    } else {
      console.log('✅ automation_jobs table is accessible');
    }

    const { data: tasks, error: tasksError } = await supabase
      .from('scheduled_tasks')
      .select('count(*)')
      .single();

    if (tasksError) {
      console.error('❌ Error testing scheduled_tasks table:', tasksError.message);
    } else {
      console.log('✅ scheduled_tasks table is accessible');
    }

    const { data: runs, error: runsError } = await supabase
      .from('task_runs')
      .select('count(*)')
      .single();

    if (runsError) {
      console.error('❌ Error testing task_runs table:', runsError.message);
    } else {
      console.log('✅ task_runs table is accessible');
    }

    console.log('\n✅ Automation database schema setup complete!');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run start-pipeline');
    console.log('2. The automation system should now work without database errors');
    console.log('3. Jobs and tasks will be properly persisted');

  } catch (error) {
    console.error('❌ Error setting up automation database:', error);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution if RPC doesn't work
async function setupAutomationDatabaseDirect() {
  console.log('🔄 Trying direct SQL execution...');
  
  try {
    // Create tables one by one
    const tables = [
      {
        name: 'automation_jobs',
        sql: `
          CREATE TABLE IF NOT EXISTS public.automation_jobs (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT NOT NULL,
            parameters JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            progress INTEGER NOT NULL DEFAULT 0,
            result JSONB,
            error TEXT,
            retries INTEGER NOT NULL DEFAULT 0,
            max_retries INTEGER NOT NULL DEFAULT 3,
            estimated_duration INTEGER,
            actual_duration INTEGER
          );
        `
      },
      {
        name: 'scheduled_tasks',
        sql: `
          CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            schedule TEXT NOT NULL,
            enabled BOOLEAN NOT NULL DEFAULT TRUE,
            parameters JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            last_run TIMESTAMP WITH TIME ZONE,
            next_run TIMESTAMP WITH TIME ZONE NOT NULL,
            run_count INTEGER NOT NULL DEFAULT 0,
            failure_count INTEGER NOT NULL DEFAULT 0
          );
        `
      },
      {
        name: 'task_runs',
        sql: `
          CREATE TABLE IF NOT EXISTS public.task_runs (
            id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            end_time TIMESTAMP WITH TIME ZONE,
            status TEXT NOT NULL,
            result JSONB,
            error TEXT,
            duration INTEGER
          );
        `
      }
    ];

    for (const table of tables) {
      console.log(`📝 Creating table: ${table.name}`);
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      
      if (error) {
        console.error(`❌ Error creating ${table.name}:`, error.message);
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    }

    console.log('\n✅ Basic automation tables created!');
    console.log('🚀 Try running the automation pipeline again.');

  } catch (error) {
    console.error('❌ Error in direct setup:', error);
  }
}

// Run the setup
setupAutomationDatabase().catch(() => {
  console.log('\n🔄 Primary setup failed, trying alternative approach...');
  setupAutomationDatabaseDirect();
});

export default setupAutomationDatabase;