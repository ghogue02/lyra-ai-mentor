#!/usr/bin/env tsx

/**
 * Content Scaling System Setup Script
 * 
 * This script sets up the content scaling system for immediate use:
 * 1. Verifies database schema
 * 2. Initializes character archetypes and templates
 * 3. Creates test data
 * 4. Validates system functionality
 * 
 * Usage: npm run setup-scaling
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SetupStep {
  name: string;
  description: string;
  action: () => Promise<void>;
}

class ContentScalingSetup {
  private steps: SetupStep[] = [];
  private completedSteps: number = 0;

  constructor() {
    this.initializeSteps();
  }

  private initializeSteps(): void {
    this.steps = [
      {
        name: 'Database Connection',
        description: 'Verify database connection and permissions',
        action: this.verifyConnection.bind(this)
      },
      {
        name: 'Schema Setup',
        description: 'Create or verify content scaling schema',
        action: this.setupSchema.bind(this)
      },
      {
        name: 'Character Archetypes',
        description: 'Initialize character archetypes data',
        action: this.initializeCharacterArchetypes.bind(this)
      },
      {
        name: 'Content Templates',
        description: 'Initialize content templates',
        action: this.initializeContentTemplates.bind(this)
      },
      {
        name: 'Test Data',
        description: 'Create test data for immediate use',
        action: this.createTestData.bind(this)
      },
      {
        name: 'System Validation',
        description: 'Validate system functionality',
        action: this.validateSystem.bind(this)
      }
    ];
  }

  async run(): Promise<void> {
    console.log('🚀 Starting Content Scaling System Setup...\n');
    
    try {
      for (const step of this.steps) {
        console.log(`📋 ${step.name}: ${step.description}`);
        await step.action();
        this.completedSteps++;
        console.log(`✅ ${step.name} completed\n`);
      }

      console.log('🎉 Content Scaling System setup completed successfully!');
      console.log(`✨ ${this.completedSteps}/${this.steps.length} steps completed\n`);
      
      await this.displayNextSteps();
      
    } catch (error) {
      console.error(`❌ Setup failed at step: ${this.steps[this.completedSteps].name}`);
      console.error(`Error: ${error}`);
      process.exit(1);
    }
  }

  private async verifyConnection(): Promise<void> {
    const { data, error } = await supabase
      .from('chapters')
      .select('count')
      .limit(1);

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    console.log('   ✓ Database connection verified');
  }

  private async setupSchema(): Promise<void> {
    // Check if character_archetypes table exists
    const { data: tables, error } = await supabase
      .rpc('get_table_info', { table_name: 'character_archetypes' });

    if (error && error.message.includes('does not exist')) {
      console.log('   ⚠️  Content scaling schema not found. Please run the SQL setup script first.');
      console.log('   📝 Run: psql -d your_database -f database/setup/01-run-content-scaling-setup.sql');
      throw new Error('Schema setup required');
    }

    console.log('   ✓ Content scaling schema verified');
  }

  private async initializeCharacterArchetypes(): Promise<void> {
    // Check if character archetypes already exist
    const { data: existing, error: checkError } = await supabase
      .from('character_archetypes')
      .select('character_id')
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check character archetypes: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log('   ✓ Character archetypes already initialized');
      return;
    }

    // Insert character archetypes (they should be inserted by the schema file)
    const { data: archetypes, error: selectError } = await supabase
      .from('character_archetypes')
      .select('*');

    if (selectError) {
      throw new Error(`Failed to verify character archetypes: ${selectError.message}`);
    }

    if (!archetypes || archetypes.length === 0) {
      throw new Error('Character archetypes not found. Please ensure the schema setup completed successfully.');
    }

    console.log(`   ✓ ${archetypes.length} character archetypes verified`);
  }

  private async initializeContentTemplates(): Promise<void> {
    // Check if content templates already exist
    const { data: existing, error: checkError } = await supabase
      .from('content_templates')
      .select('template_id')
      .limit(1);

    if (checkError) {
      throw new Error(`Failed to check content templates: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log('   ✓ Content templates already initialized');
      return;
    }

    // Verify templates exist
    const { data: templates, error: selectError } = await supabase
      .from('content_templates')
      .select('*');

    if (selectError) {
      throw new Error(`Failed to verify content templates: ${selectError.message}`);
    }

    if (!templates || templates.length === 0) {
      throw new Error('Content templates not found. Please ensure the schema setup completed successfully.');
    }

    console.log(`   ✓ ${templates.length} content templates verified`);
  }

  private async createTestData(): Promise<void> {
    // Create a test generation job for Chapter 3
    const testJobParams = {
      templateIds: ['interactive-builder'],
      characterIds: ['alex'],
      chapterNumbers: [3],
      customVariables: {
        skillName: 'Strategic Planning',
        practicalScenario: 'Creating a 3-year organizational strategy for community impact',
        timeMetrics: {
          before: '3 hours planning sessions',
          after: '45 minutes focused planning',
          savings: '2 hours 15 minutes per session',
          impactDescription: 'More time for execution and team development'
        }
      },
      qualityThreshold: 0.85
    };

    const { data: jobData, error: jobError } = await supabase
      .from('content_generation_jobs')
      .insert({
        job_type: 'single_component',
        generation_parameters: testJobParams,
        status: 'queued'
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create test job: ${jobError.message}`);
    }

    console.log(`   ✓ Test generation job created: ${jobData.id}`);

    // Create test generated content
    const { data: templateData, error: templateError } = await supabase
      .from('content_templates')
      .select('id')
      .eq('template_id', 'interactive-builder')
      .single();

    if (templateError) {
      throw new Error(`Failed to get template ID: ${templateError.message}`);
    }

    const testContent = {
      template_id: templateData.id,
      character_id: 'alex',
      chapter_number: 3,
      content_type: 'interactive-component',
      content_data: {
        componentName: 'AlexChapter3StrategicPlanningBuilder',
        props: {
          characterId: 'alex',
          skillName: 'Strategic Planning',
          practicalScenario: 'Creating a 3-year organizational strategy for community impact',
          timeMetrics: {
            before: '3 hours planning sessions',
            after: '45 minutes focused planning',
            savings: '2 hours 15 minutes per session',
            impactDescription: 'More time for execution and team development'
          }
        }
      },
      quality_score: 0.92,
      approval_status: 'approved',
      deployment_status: 'staged'
    };

    const { data: contentData, error: contentError } = await supabase
      .from('generated_content')
      .insert(testContent)
      .select()
      .single();

    if (contentError) {
      throw new Error(`Failed to create test content: ${contentError.message}`);
    }

    console.log(`   ✓ Test generated content created: ${contentData.id}`);
  }

  private async validateSystem(): Promise<void> {
    // Test the dashboard view
    const { data: dashboardData, error: dashboardError } = await supabase
      .from('content_scaling_dashboard')
      .select('*')
      .limit(5);

    if (dashboardError) {
      throw new Error(`Dashboard view failed: ${dashboardError.message}`);
    }

    console.log(`   ✓ Dashboard view working (${dashboardData.length} entries)`);

    // Test the queue function
    const { data: queueData, error: queueError } = await supabase
      .rpc('queue_chapter_generation', { 
        chapter_num: 4, 
        character_ids: ['david'], 
        template_ids: ['interactive-builder'] 
      });

    if (queueError) {
      throw new Error(`Queue function failed: ${queueError.message}`);
    }

    console.log(`   ✓ Queue function working (job ID: ${queueData})`);

    // Test scaling progress function
    const { data: progressData, error: progressError } = await supabase
      .rpc('get_scaling_progress', { chapter_nums: [3, 4] });

    if (progressError) {
      throw new Error(`Progress function failed: ${progressError.message}`);
    }

    console.log(`   ✓ Progress function working (${progressData.length} entries)`);
  }

  private async displayNextSteps(): Promise<void> {
    console.log('📋 Next Steps:');
    console.log('');
    console.log('1. 🧪 Test the system:');
    console.log('   npm run test-scaling');
    console.log('');
    console.log('2. 🎨 Create your first component:');
    console.log('   npm run create-component alex 3 interactive-builder');
    console.log('');
    console.log('3. 🚀 Start the development server:');
    console.log('   npm run dev');
    console.log('');
    console.log('4. 📊 View the scaling dashboard:');
    console.log('   http://localhost:5173/component-showcase');
    console.log('');
    console.log('5. 📚 Check the documentation:');
    console.log('   See CONTENT_SCALING_SYSTEM.md for detailed usage');
    console.log('');

    // Display system status
    const { data: stats } = await supabase
      .from('content_scaling_dashboard')
      .select('*');

    if (stats) {
      console.log('📊 System Status:');
      console.log(`   Characters: ${new Set(stats.map(s => s.character_id)).size}`);
      console.log(`   Templates: ${new Set(stats.map(s => s.template_id)).size}`);
      console.log(`   Generated Content: ${stats.reduce((sum, s) => sum + (s.content_count || 0), 0)}`);
      console.log(`   Average Quality: ${(stats.reduce((sum, s) => sum + (s.avg_quality || 0), 0) / stats.length).toFixed(2)}`);
    }
  }
}

// Run the setup
const setup = new ContentScalingSetup();
setup.run().catch(console.error);