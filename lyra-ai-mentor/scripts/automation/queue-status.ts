#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

import { ContentAutomationPipeline } from '../../src/services/contentAutomationPipeline';
import { AutomationScheduler } from '../../src/services/automationScheduler';

/**
 * Check the status of the automation queue and scheduler
 * Usage: npm run queue-status
 */

async function checkQueueStatus() {
  console.log('📊 Checking automation system status...\n');
  
  try {
    const pipeline = new ContentAutomationPipeline();
    const scheduler = new AutomationScheduler();
    
    // Get queue status
    const queueStatus = await pipeline.getQueueStatus();
    
    console.log('🔄 Queue Status:');
    console.log(`  Total Jobs: ${queueStatus.total}`);
    console.log(`  Pending: ${queueStatus.pending}`);
    console.log(`  Processing: ${queueStatus.processing}`);
    console.log(`  Completed: ${queueStatus.completed}`);
    console.log(`  Failed: ${queueStatus.failed}`);
    console.log(`  Health Score: ${queueStatus.queueHealthScore}%`);
    console.log(`  Avg Processing Time: ${Math.round(queueStatus.averageProcessingTime / 1000)}s`);
    
    // Get scheduler status
    const schedulerStatus = await scheduler.getSchedulerStatus();
    
    console.log('\n📅 Scheduler Status:');
    console.log(`  Running: ${schedulerStatus.isRunning ? 'Yes' : 'No'}`);
    console.log(`  Total Tasks: ${schedulerStatus.totalTasks}`);
    console.log(`  Active Tasks: ${schedulerStatus.activeTasks}`);
    console.log(`  System Health: ${schedulerStatus.systemHealth}%`);
    
    // Show upcoming tasks
    if (schedulerStatus.upcomingTasks.length > 0) {
      console.log('\n⏰ Upcoming Tasks:');
      schedulerStatus.upcomingTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.name} (${task.type})`);
        console.log(`     Next Run: ${task.nextRun.toLocaleString()}`);
        console.log(`     Runs: ${task.runCount}, Failures: ${task.failureCount}`);
      });
    }
    
    // Show recent runs
    if (schedulerStatus.recentRuns.length > 0) {
      console.log('\n🏃 Recent Runs:');
      schedulerStatus.recentRuns.slice(0, 5).forEach((run, index) => {
        const statusEmoji = run.status === 'completed' ? '✅' : 
                           run.status === 'failed' ? '❌' : 
                           run.status === 'running' ? '🔄' : '⏸️';
        console.log(`  ${index + 1}. ${statusEmoji} ${run.status} (${run.duration}ms)`);
        console.log(`     Started: ${run.startTime.toLocaleString()}`);
        if (run.error) {
          console.log(`     Error: ${run.error}`);
        }
      });
    }
    
    // Health assessment
    console.log('\n🩺 Health Assessment:');
    const overallHealth = Math.round((queueStatus.queueHealthScore + schedulerStatus.systemHealth) / 2);
    const healthStatus = overallHealth >= 90 ? 'Excellent' :
                        overallHealth >= 70 ? 'Good' :
                        overallHealth >= 50 ? 'Fair' : 'Poor';
    
    console.log(`  Overall Health: ${overallHealth}% (${healthStatus})`);
    
    if (overallHealth < 70) {
      console.log('\n⚠️ Recommendations:');
      if (queueStatus.failed > 0) {
        console.log('  - Investigate failed jobs');
      }
      if (queueStatus.averageProcessingTime > 60000) {
        console.log('  - Consider optimizing job processing');
      }
      if (!schedulerStatus.isRunning) {
        console.log('  - Start the scheduler');
      }
    }
    
    // Performance metrics
    console.log('\n📈 Performance Metrics:');
    const successRate = queueStatus.total > 0 ? 
      ((queueStatus.completed / queueStatus.total) * 100).toFixed(1) : '0.0';
    const throughput = queueStatus.completed; // Jobs per session
    
    console.log(`  Success Rate: ${successRate}%`);
    console.log(`  Throughput: ${throughput} jobs completed`);
    console.log(`  Queue Efficiency: ${queueStatus.queueHealthScore}%`);
    
  } catch (error) {
    console.error('❌ Error checking queue status:', error);
    process.exit(1);
  }
}

// Always run when executed via npm scripts
console.log('📊 Checking queue status...');
checkQueueStatus();

export default checkQueueStatus;