#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

// Ensure environment variables are loaded before importing services
console.log('🔧 Environment check:');
console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is missing from environment');
  console.log('🔧 Please check your .env file contains:');
  console.log('   OPENAI_API_KEY=your_key_here');
  process.exit(1);
}

import { ContentAutomationPipeline } from '../../src/services/contentAutomationPipeline';
import { AutomationScheduler } from '../../src/services/automationScheduler';

/**
 * Start the automation pipeline and scheduler
 * Usage: npm run start-pipeline
 */

async function startPipeline() {
  console.log('🚀 Starting Content Scaling Automation Pipeline...');
  
  try {
    // Initialize pipeline
    const pipeline = new ContentAutomationPipeline();
    console.log('✅ Pipeline initialized');
    
    // Initialize scheduler
    const scheduler = new AutomationScheduler();
    console.log('✅ Scheduler initialized');
    
    // Start scheduler
    await scheduler.start();
    console.log('✅ Scheduler started');
    
    // Create predefined tasks
    await scheduler.createPredefinedTasks();
    console.log('✅ Predefined tasks created');
    
    // Get initial status
    const [queueStatus, schedulerStatus] = await Promise.all([
      pipeline.getQueueStatus(),
      scheduler.getSchedulerStatus()
    ]);
    
    console.log('\n📊 System Status:');
    console.log(`Queue Health: ${queueStatus.queueHealthScore}%`);
    console.log(`Total Jobs: ${queueStatus.total}`);
    console.log(`Scheduler Running: ${schedulerStatus.isRunning ? 'Yes' : 'No'}`);
    console.log(`Active Tasks: ${schedulerStatus.activeTasks}`);
    
    // Create some sample jobs
    console.log('\n🎯 Creating sample jobs...');
    
    const jobIds = await Promise.all([
      pipeline.createJob('single_content', {
        chapterNumber: 4,
        characterId: 'david',
        templateId: 'interactive-builder',
        customVariables: {
          skillName: 'Data Analysis',
          practicalScenario: 'Performance metrics dashboard'
        }
      }, 'high'),
      
      pipeline.createJob('single_content', {
        chapterNumber: 5,
        characterId: 'rachel',
        templateId: 'interactive-builder',
        customVariables: {
          skillName: 'Process Automation',
          practicalScenario: 'Workflow optimization system'
        }
      }, 'medium'),
      
      pipeline.createJob('single_content', {
        chapterNumber: 6,
        characterId: 'sofia',
        templateId: 'character-journey',
        customVariables: {
          skillName: 'Storytelling',
          practicalScenario: 'Impact narrative creation'
        }
      }, 'medium')
    ]);
    
    console.log(`✅ Created ${jobIds.length} sample jobs`);
    jobIds.forEach((jobId, index) => {
      console.log(`   Job ${index + 1}: ${jobId}`);
    });
    
    // Monitor for a few seconds
    console.log('\n👁️ Monitoring system for 10 seconds...');
    
    const monitorInterval = setInterval(async () => {
      const status = await pipeline.getQueueStatus();
      console.log(`Processing: ${status.processing}, Completed: ${status.completed}, Failed: ${status.failed}`);
    }, 2000);
    
    setTimeout(() => {
      clearInterval(monitorInterval);
      console.log('\n✅ Pipeline started successfully!');
      console.log('🌐 Access the automation dashboard at /automation-dashboard');
      console.log('📊 Monitor jobs and tasks through the web interface');
      console.log('\n🔧 Use these commands to manage the system:');
      console.log('  npm run stop-pipeline     - Stop the automation system');
      console.log('  npm run create-test-job   - Create a test job');
      console.log('  npm run queue-status      - Check queue status');
      console.log('  npm run scheduler-status  - Check scheduler status');
    }, 10000);
    
  } catch (error) {
    console.error('❌ Error starting pipeline:', error);
    process.exit(1);
  }
}

// Always run when executed via npm scripts
console.log('🚀 Starting pipeline...');
startPipeline();

export default startPipeline;