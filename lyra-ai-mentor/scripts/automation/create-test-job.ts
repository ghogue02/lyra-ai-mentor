#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

import { ContentAutomationPipeline } from '../../src/services/contentAutomationPipeline';

/**
 * Create a test job for the automation pipeline
 * Usage: npm run create-test-job [type] [priority]
 */

async function createTestJob() {
  console.log('🧪 Creating test job...');
  
  try {
    const pipeline = new ContentAutomationPipeline();
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    const jobType = args[0] || 'single_content';
    const priority = args[1] || 'medium';
    
    let jobId: string;
    
    switch (jobType) {
      case 'single_content':
        jobId = await pipeline.createJob('single_content', {
          chapterNumber: Math.floor(Math.random() * 4) + 3, // Chapters 3-6
          characterId: ['maya', 'alex', 'david', 'rachel', 'sofia'][Math.floor(Math.random() * 5)],
          templateId: 'interactive-builder',
          customVariables: {
            skillName: 'Test Skill',
            practicalScenario: 'Test scenario for automation'
          }
        }, priority as any);
        break;
        
      case 'chapter_batch':
        jobId = await pipeline.createJob('chapter_batch', {
          chapterNumber: 4,
          characterIds: ['david', 'rachel'],
          templateIds: ['interactive-builder'],
          customVariables: {
            batchName: 'Test Batch',
            qualityThreshold: 0.8
          }
        }, priority as any);
        break;
        
      case 'learning_path':
        jobId = await pipeline.createJob('learning_path', {
          pathName: 'Test Learning Path',
          chapters: [4, 5],
          skills: ['data-analysis', 'process-automation'],
          sequentialProcessing: true
        }, priority as any);
        break;
        
      case 'cross_chapter_scaling':
        jobId = await pipeline.createJob('cross_chapter_scaling', {
          sourceChapter: 2,
          targetChapters: [4, 5],
          pattern: 'maya_patterns',
          customizations: {
            adaptToCharacter: true,
            maintainQuality: true
          }
        }, priority as any);
        break;
        
      default:
        throw new Error(`Unknown job type: ${jobType}`);
    }
    
    console.log(`✅ Created test job: ${jobId}`);
    console.log(`   Type: ${jobType}`);
    console.log(`   Priority: ${priority}`);
    
    // Monitor job for a few seconds
    console.log('\n👁️ Monitoring job progress...');
    
    const monitorInterval = setInterval(async () => {
      const status = await pipeline.getJobStatus(jobId);
      if (status) {
        console.log(`Job ${jobId}: ${status.status} (${status.progress}%)`);
        
        if (status.status === 'completed') {
          console.log('✅ Job completed successfully!');
          console.log('Result:', status.result);
          clearInterval(monitorInterval);
        } else if (status.status === 'failed') {
          console.log('❌ Job failed:', status.error);
          clearInterval(monitorInterval);
        }
      }
    }, 2000);
    
    // Stop monitoring after 30 seconds
    setTimeout(() => {
      clearInterval(monitorInterval);
      console.log('\n⏰ Monitoring stopped. Job may still be processing.');
      console.log('💡 Check the automation dashboard for full status.');
    }, 30000);
    
  } catch (error) {
    console.error('❌ Error creating test job:', error);
    process.exit(1);
  }
}

// Always run when executed via npm scripts
console.log('🧪 Creating test job...');
createTestJob();

export default createTestJob;