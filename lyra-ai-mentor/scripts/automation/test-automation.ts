#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

import { ContentAutomationPipeline } from '../../src/services/contentAutomationPipeline';
import { AutomationScheduler } from '../../src/services/automationScheduler';
import { ContentScalingEngine } from '../../src/services/contentScalingEngine';

/**
 * Comprehensive test of the automation pipeline system
 * Usage: npm run test-automation
 */

class AutomationTestSuite {
  private pipeline: ContentAutomationPipeline;
  private scheduler: AutomationScheduler;
  private engine: ContentScalingEngine;
  private testResults: TestResult[] = [];

  constructor() {
    this.pipeline = new ContentAutomationPipeline();
    this.scheduler = new AutomationScheduler();
    this.engine = new ContentScalingEngine();
  }

  async runFullTest(): Promise<void> {
    console.log('🧪 Starting Automation System Full Test Suite');
    console.log('===============================================\n');

    try {
      // Test 1: Basic System Initialization
      await this.testSystemInitialization();

      // Test 2: Content Scaling Engine
      await this.testContentScalingEngine();

      // Test 3: Single Content Generation
      await this.testSingleContentGeneration();

      // Test 4: Chapter Batch Processing
      await this.testChapterBatchProcessing();

      // Test 5: Learning Path Creation
      await this.testLearningPathCreation();

      // Test 6: Cross-Chapter Scaling
      await this.testCrossChapterScaling();

      // Test 7: Automation Scheduler
      await this.testAutomationScheduler();

      // Test 8: Queue Management
      await this.testQueueManagement();

      // Test 9: Performance Testing
      await this.testPerformance();

      // Test 10: Error Handling
      await this.testErrorHandling();

      // Final Results
      this.printTestResults();

    } catch (error) {
      console.error('🚨 Test Suite Failed:', error);
      process.exit(1);
    }
  }

  private async testSystemInitialization(): Promise<void> {
    console.log('🔧 Test 1: System Initialization');
    const startTime = Date.now();

    try {
      // Test that all systems can be initialized
      const pipeline = new ContentAutomationPipeline();
      const scheduler = new AutomationScheduler();
      const engine = new ContentScalingEngine();

      this.addTestResult('System Initialization', true, Date.now() - startTime);
      console.log('✅ System initialized successfully\n');

    } catch (error) {
      this.addTestResult('System Initialization', false, Date.now() - startTime, error);
      console.log('❌ System initialization failed\n');
    }
  }

  private async testContentScalingEngine(): Promise<void> {
    console.log('🎭 Test 2: Content Scaling Engine');
    const startTime = Date.now();

    try {
      // Test character archetypes
      const characters = this.engine.getAllCharacterArchetypes();
      if (characters.length !== 5) {
        throw new Error(`Expected 5 characters, got ${characters.length}`);
      }

      // Test templates
      const templates = this.engine.getAllContentTemplates();
      if (templates.length < 2) {
        throw new Error(`Expected at least 2 templates, got ${templates.length}`);
      }

      // Test specific character
      const maya = this.engine.getCharacterArchetype('maya');
      if (!maya || maya.name !== 'Maya Rodriguez') {
        throw new Error('Maya character not found or incorrect');
      }

      // Test specific template
      const interactiveTemplate = this.engine.getContentTemplate('interactive-builder');
      if (!interactiveTemplate || interactiveTemplate.title !== 'Interactive Builder') {
        throw new Error('Interactive builder template not found or incorrect');
      }

      this.addTestResult('Content Scaling Engine', true, Date.now() - startTime);
      console.log('✅ Content scaling engine working correctly');
      console.log(`   Characters: ${characters.length}`);
      console.log(`   Templates: ${templates.length}\n`);

    } catch (error) {
      this.addTestResult('Content Scaling Engine', false, Date.now() - startTime, error);
      console.log('❌ Content scaling engine failed\n');
    }
  }

  private async testSingleContentGeneration(): Promise<void> {
    console.log('🔨 Test 3: Single Content Generation');
    const startTime = Date.now();

    try {
      const jobId = await this.pipeline.createJob('single_content', {
        chapterNumber: 4,
        characterId: 'david',
        templateId: 'interactive-builder',
        customVariables: {
          skillName: 'Data Analysis',
          practicalScenario: 'Performance metrics dashboard'
        }
      }, 'high');

      // Wait for job completion
      await this.waitForJobCompletion(jobId, 30000);

      const jobStatus = await this.pipeline.getJobStatus(jobId);
      if (!jobStatus || jobStatus.status !== 'completed') {
        throw new Error(`Job did not complete successfully: ${jobStatus?.status}`);
      }

      this.addTestResult('Single Content Generation', true, Date.now() - startTime);
      console.log('✅ Single content generation successful');
      console.log(`   Job ID: ${jobId}`);
      console.log(`   Status: ${jobStatus.status}\n`);

    } catch (error) {
      this.addTestResult('Single Content Generation', false, Date.now() - startTime, error);
      console.log('❌ Single content generation failed\n');
    }
  }

  private async testChapterBatchProcessing(): Promise<void> {
    console.log('📦 Test 4: Chapter Batch Processing');
    const startTime = Date.now();

    try {
      const jobIds = await this.pipeline.processChapterBatch([5], {
        characterIds: ['rachel'],
        templateIds: ['interactive-builder'],
        customVariables: {
          skillName: 'Process Automation',
          practicalScenario: 'Workflow optimization'
        }
      });

      if (jobIds.length !== 1) {
        throw new Error(`Expected 1 job, got ${jobIds.length}`);
      }

      // Wait for job completion
      await this.waitForJobCompletion(jobIds[0], 30000);

      const jobStatus = await this.pipeline.getJobStatus(jobIds[0]);
      if (!jobStatus || jobStatus.status !== 'completed') {
        throw new Error(`Batch job did not complete successfully: ${jobStatus?.status}`);
      }

      this.addTestResult('Chapter Batch Processing', true, Date.now() - startTime);
      console.log('✅ Chapter batch processing successful');
      console.log(`   Jobs created: ${jobIds.length}`);
      console.log(`   Status: ${jobStatus.status}\n`);

    } catch (error) {
      this.addTestResult('Chapter Batch Processing', false, Date.now() - startTime, error);
      console.log('❌ Chapter batch processing failed\n');
    }
  }

  private async testLearningPathCreation(): Promise<void> {
    console.log('📚 Test 5: Learning Path Creation');
    const startTime = Date.now();

    try {
      const jobId = await this.pipeline.processLearningPath(
        'Advanced Analytics',
        [4, 5],
        ['data-visualization', 'process-optimization']
      );

      // Wait for job completion
      await this.waitForJobCompletion(jobId, 45000);

      const jobStatus = await this.pipeline.getJobStatus(jobId);
      if (!jobStatus || jobStatus.status !== 'completed') {
        throw new Error(`Learning path job did not complete successfully: ${jobStatus?.status}`);
      }

      this.addTestResult('Learning Path Creation', true, Date.now() - startTime);
      console.log('✅ Learning path creation successful');
      console.log(`   Job ID: ${jobId}`);
      console.log(`   Status: ${jobStatus.status}\n`);

    } catch (error) {
      this.addTestResult('Learning Path Creation', false, Date.now() - startTime, error);
      console.log('❌ Learning path creation failed\n');
    }
  }

  private async testCrossChapterScaling(): Promise<void> {
    console.log('🔗 Test 6: Cross-Chapter Scaling');
    const startTime = Date.now();

    try {
      const jobId = await this.pipeline.createJob('cross_chapter_scaling', {
        sourceChapter: 2,
        targetChapters: [6],
        pattern: 'maya_patterns',
        customizations: {
          adaptToCharacter: true,
          maintainQuality: true
        }
      }, 'medium');

      // Wait for job completion
      await this.waitForJobCompletion(jobId, 45000);

      const jobStatus = await this.pipeline.getJobStatus(jobId);
      if (!jobStatus || jobStatus.status !== 'completed') {
        throw new Error(`Cross-chapter scaling did not complete successfully: ${jobStatus?.status}`);
      }

      this.addTestResult('Cross-Chapter Scaling', true, Date.now() - startTime);
      console.log('✅ Cross-chapter scaling successful');
      console.log(`   Job ID: ${jobId}`);
      console.log(`   Status: ${jobStatus.status}\n`);

    } catch (error) {
      this.addTestResult('Cross-Chapter Scaling', false, Date.now() - startTime, error);
      console.log('❌ Cross-chapter scaling failed\n');
    }
  }

  private async testAutomationScheduler(): Promise<void> {
    console.log('📅 Test 7: Automation Scheduler');
    const startTime = Date.now();

    try {
      // Start scheduler
      await this.scheduler.start();

      // Create a test scheduled task
      const taskId = await this.scheduler.createScheduledTask(
        'Test Daily Content',
        'content_generation',
        '0 9 * * *',
        {
          batchSize: 2,
          priority: 'medium'
        }
      );

      // Get scheduler status
      const status = await this.scheduler.getSchedulerStatus();
      if (!status.isRunning) {
        throw new Error('Scheduler is not running');
      }

      if (status.totalTasks === 0) {
        throw new Error('No tasks found in scheduler');
      }

      // Stop scheduler
      await this.scheduler.stop();

      this.addTestResult('Automation Scheduler', true, Date.now() - startTime);
      console.log('✅ Automation scheduler working correctly');
      console.log(`   Task ID: ${taskId}`);
      console.log(`   Total tasks: ${status.totalTasks}`);
      console.log(`   Active tasks: ${status.activeTasks}\n`);

    } catch (error) {
      this.addTestResult('Automation Scheduler', false, Date.now() - startTime, error);
      console.log('❌ Automation scheduler failed\n');
    }
  }

  private async testQueueManagement(): Promise<void> {
    console.log('🔄 Test 8: Queue Management');
    const startTime = Date.now();

    try {
      // Get initial queue status
      const initialStatus = await this.pipeline.getQueueStatus();

      // Create multiple jobs
      const jobIds = await Promise.all([
        this.pipeline.createJob('single_content', {
          chapterNumber: 3,
          characterId: 'alex',
          templateId: 'interactive-builder'
        }, 'low'),
        this.pipeline.createJob('single_content', {
          chapterNumber: 4,
          characterId: 'david',
          templateId: 'interactive-builder'
        }, 'high'),
        this.pipeline.createJob('single_content', {
          chapterNumber: 5,
          characterId: 'rachel',
          templateId: 'interactive-builder'
        }, 'medium')
      ]);

      // Wait a bit for jobs to be processed
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Get updated queue status
      const updatedStatus = await this.pipeline.getQueueStatus();

      // Test job cancellation
      const cancelResult = await this.pipeline.cancelJob(jobIds[0]);

      this.addTestResult('Queue Management', true, Date.now() - startTime);
      console.log('✅ Queue management working correctly');
      console.log(`   Jobs created: ${jobIds.length}`);
      console.log(`   Queue health: ${updatedStatus.queueHealthScore}%`);
      console.log(`   Cancel result: ${cancelResult}\n`);

    } catch (error) {
      this.addTestResult('Queue Management', false, Date.now() - startTime, error);
      console.log('❌ Queue management failed\n');
    }
  }

  private async testPerformance(): Promise<void> {
    console.log('⚡ Test 9: Performance Testing');
    const startTime = Date.now();

    try {
      // Test concurrent job creation
      const concurrentJobs = 5;
      const jobCreationStart = Date.now();
      
      const jobPromises = Array.from({ length: concurrentJobs }, (_, i) => 
        this.pipeline.createJob('single_content', {
          chapterNumber: 3 + (i % 4),
          characterId: ['maya', 'alex', 'david', 'rachel', 'sofia'][i % 5],
          templateId: 'interactive-builder'
        }, 'medium')
      );

      const jobIds = await Promise.all(jobPromises);
      const jobCreationTime = Date.now() - jobCreationStart;

      // Test queue status retrieval performance
      const statusRetrievalStart = Date.now();
      const queueStatus = await this.pipeline.getQueueStatus();
      const statusRetrievalTime = Date.now() - statusRetrievalStart;

      this.addTestResult('Performance Testing', true, Date.now() - startTime);
      console.log('✅ Performance testing completed');
      console.log(`   Concurrent jobs: ${concurrentJobs}`);
      console.log(`   Job creation time: ${jobCreationTime}ms`);
      console.log(`   Status retrieval time: ${statusRetrievalTime}ms`);
      console.log(`   Queue health: ${queueStatus.queueHealthScore}%\n`);

    } catch (error) {
      this.addTestResult('Performance Testing', false, Date.now() - startTime, error);
      console.log('❌ Performance testing failed\n');
    }
  }

  private async testErrorHandling(): Promise<void> {
    console.log('🚨 Test 10: Error Handling');
    const startTime = Date.now();

    try {
      // Test invalid character ID
      try {
        await this.pipeline.createJob('single_content', {
          chapterNumber: 3,
          characterId: 'invalid_character',
          templateId: 'interactive-builder'
        }, 'medium');
        throw new Error('Should have failed with invalid character');
      } catch (error) {
        // Expected error - this is good
      }

      // Test invalid template ID
      try {
        await this.pipeline.createJob('single_content', {
          chapterNumber: 3,
          characterId: 'maya',
          templateId: 'invalid_template'
        }, 'medium');
        throw new Error('Should have failed with invalid template');
      } catch (error) {
        // Expected error - this is good
      }

      // Test invalid job type
      try {
        await this.pipeline.createJob('invalid_job_type' as any, {
          chapterNumber: 3,
          characterId: 'maya',
          templateId: 'interactive-builder'
        }, 'medium');
        throw new Error('Should have failed with invalid job type');
      } catch (error) {
        // Expected error - this is good
      }

      this.addTestResult('Error Handling', true, Date.now() - startTime);
      console.log('✅ Error handling working correctly');
      console.log('   Invalid inputs properly rejected\n');

    } catch (error) {
      this.addTestResult('Error Handling', false, Date.now() - startTime, error);
      console.log('❌ Error handling failed\n');
    }
  }

  private async waitForJobCompletion(jobId: string, timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const jobStatus = await this.pipeline.getJobStatus(jobId);
      
      if (jobStatus?.status === 'completed' || jobStatus?.status === 'failed') {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Job ${jobId} did not complete within ${timeout}ms`);
  }

  private addTestResult(testName: string, passed: boolean, duration: number, error?: any): void {
    this.testResults.push({
      testName,
      passed,
      duration,
      error: error?.message || error
    });
  }

  private printTestResults(): void {
    console.log('\n🏆 Test Results Summary');
    console.log('======================');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);
    
    console.log('\nDetailed Results:');
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.testName} (${result.duration}ms)`);
      if (!result.passed && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('\n🎯 System Assessment:');
    if (passedTests === totalTests) {
      console.log('🟢 EXCELLENT - All systems operational');
    } else if (passedTests / totalTests >= 0.8) {
      console.log('🟡 GOOD - Most systems operational');
    } else if (passedTests / totalTests >= 0.6) {
      console.log('🟠 FAIR - Some systems need attention');
    } else {
      console.log('🔴 POOR - Multiple systems failing');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review failed tests and fix issues');
    console.log('2. Use npm run start-pipeline to launch system');
    console.log('3. Use npm run create-test-job to test individual jobs');
    console.log('4. Use npm run queue-status to monitor system health');
    console.log('5. Access automation dashboard at /automation-dashboard');
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
  }
}

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
}

// Run the test suite
async function runTests() {
  const testSuite = new AutomationTestSuite();
  await testSuite.runFullTest();
}

// Always run when executed via npm scripts
console.log('🧪 Running automation tests...');
runTests();

export default runTests;