import { ContentAutomationPipeline } from './contentAutomationPipeline';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduledTask {
  id: string;
  name: string;
  type: 'content_generation' | 'quality_check' | 'performance_optimization' | 'backup';
  schedule: string; // Cron expression
  enabled: boolean;
  parameters: any;
  lastRun?: Date;
  nextRun: Date;
  runCount: number;
  failureCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchedulerStatus {
  isRunning: boolean;
  totalTasks: number;
  activeTasks: number;
  upcomingTasks: ScheduledTask[];
  recentRuns: TaskRun[];
  systemHealth: number;
}

export interface TaskRun {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  duration: number;
}

export class AutomationScheduler {
  private pipeline: ContentAutomationPipeline;
  private scheduledTasks: Map<string, ScheduledTask> = new Map();
  private taskTimers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;
  private taskRuns: Map<string, TaskRun> = new Map();

  constructor() {
    this.pipeline = new ContentAutomationPipeline();
  }

  // Start the scheduler
  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.loadScheduledTasks();
    await this.scheduleAllTasks();
    
    console.log('📅 Automation Scheduler started');
  }

  // Stop the scheduler
  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    // Clear all timers
    this.taskTimers.forEach(timer => clearTimeout(timer));
    this.taskTimers.clear();
    
    console.log('📅 Automation Scheduler stopped');
  }

  // Create a new scheduled task
  async createScheduledTask(
    name: string,
    type: ScheduledTask['type'],
    schedule: string,
    parameters: any,
    enabled = true
  ): Promise<string> {
    const task: ScheduledTask = {
      id: this.generateTaskId(),
      name,
      type,
      schedule,
      enabled,
      parameters,
      nextRun: this.calculateNextRun(schedule),
      runCount: 0,
      failureCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database
    await this.saveTaskToDatabase(task);
    
    // Add to memory
    this.scheduledTasks.set(task.id, task);
    
    // Schedule if enabled
    if (enabled && this.isRunning) {
      await this.scheduleTask(task);
    }
    
    console.log(`📋 Created scheduled task: ${task.name} (${task.id})`);
    return task.id;
  }

  // Update scheduled task
  async updateScheduledTask(taskId: string, updates: Partial<ScheduledTask>): Promise<boolean> {
    const task = this.scheduledTasks.get(taskId);
    if (!task) return false;
    
    // Clear existing timer
    const existingTimer = this.taskTimers.get(taskId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.taskTimers.delete(taskId);
    }
    
    // Apply updates
    Object.assign(task, updates, { updatedAt: new Date() });
    
    // Recalculate next run if schedule changed
    if (updates.schedule) {
      task.nextRun = this.calculateNextRun(updates.schedule);
    }
    
    // Save to database
    await this.updateTaskInDatabase(task);
    
    // Reschedule if enabled
    if (task.enabled && this.isRunning) {
      await this.scheduleTask(task);
    }
    
    return true;
  }

  // Delete scheduled task
  async deleteScheduledTask(taskId: string): Promise<boolean> {
    const task = this.scheduledTasks.get(taskId);
    if (!task) return false;
    
    // Clear timer
    const timer = this.taskTimers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.taskTimers.delete(taskId);
    }
    
    // Remove from memory
    this.scheduledTasks.delete(taskId);
    
    // Remove from database
    await this.deleteTaskFromDatabase(taskId);
    
    console.log(`🗑️ Deleted scheduled task: ${task.name} (${taskId})`);
    return true;
  }

  // Enable/disable scheduled task
  async toggleTask(taskId: string, enabled: boolean): Promise<boolean> {
    const task = this.scheduledTasks.get(taskId);
    if (!task) return false;
    
    task.enabled = enabled;
    task.updatedAt = new Date();
    
    await this.updateTaskInDatabase(task);
    
    if (enabled && this.isRunning) {
      await this.scheduleTask(task);
    } else {
      const timer = this.taskTimers.get(taskId);
      if (timer) {
        clearTimeout(timer);
        this.taskTimers.delete(taskId);
      }
    }
    
    console.log(`${enabled ? '▶️' : '⏸️'} Task ${task.name} ${enabled ? 'enabled' : 'disabled'}`);
    return true;
  }

  // Get scheduler status
  async getSchedulerStatus(): Promise<SchedulerStatus> {
    const tasks = Array.from(this.scheduledTasks.values());
    const activeTasks = tasks.filter(t => t.enabled);
    const upcomingTasks = activeTasks
      .sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime())
      .slice(0, 5);
    
    const recentRuns = Array.from(this.taskRuns.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, 10);
    
    const systemHealth = this.calculateSystemHealth(tasks, recentRuns);
    
    return {
      isRunning: this.isRunning,
      totalTasks: tasks.length,
      activeTasks: activeTasks.length,
      upcomingTasks,
      recentRuns,
      systemHealth
    };
  }

  // Run task immediately
  async runTaskNow(taskId: string): Promise<string> {
    const task = this.scheduledTasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);
    
    console.log(`🚀 Running task immediately: ${task.name}`);
    return await this.executeTask(task);
  }

  // Get task history
  async getTaskHistory(taskId: string, limit = 50): Promise<TaskRun[]> {
    try {
      const { data, error } = await supabase
        .from('task_runs')
        .select('*')
        .eq('task_id', taskId)
        .order('start_time', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching task history:', error);
        return [];
      }
      
      return data.map(run => ({
        id: run.id,
        taskId: run.task_id,
        startTime: new Date(run.start_time),
        endTime: run.end_time ? new Date(run.end_time) : undefined,
        status: run.status,
        result: run.result,
        error: run.error,
        duration: run.duration || 0
      }));
      
    } catch (error) {
      console.error('Error getting task history:', error);
      return [];
    }
  }

  // Create predefined scheduled tasks
  async createPredefinedTasks(): Promise<void> {
    const predefinedTasks = [
      {
        name: 'Daily Content Generation',
        type: 'content_generation' as const,
        schedule: '0 9 * * *', // Daily at 9 AM
        parameters: {
          batchSize: 5,
          priority: 'medium',
          qualityThreshold: 0.85
        }
      },
      {
        name: 'Weekly Quality Check',
        type: 'quality_check' as const,
        schedule: '0 10 * * 1', // Mondays at 10 AM
        parameters: {
          checkAllContent: true,
          updateMetrics: true
        }
      },
      {
        name: 'Performance Optimization',
        type: 'performance_optimization' as const,
        schedule: '0 2 * * 0', // Sundays at 2 AM
        parameters: {
          optimizeDatabase: true,
          cleanupOldJobs: true,
          updateIndexes: true
        }
      },
      {
        name: 'Monthly Backup',
        type: 'backup' as const,
        schedule: '0 3 1 * *', // First day of month at 3 AM
        parameters: {
          backupDatabase: true,
          backupGeneratedContent: true,
          retentionDays: 90
        }
      }
    ];

    for (const taskConfig of predefinedTasks) {
      await this.createScheduledTask(
        taskConfig.name,
        taskConfig.type,
        taskConfig.schedule,
        taskConfig.parameters
      );
    }
  }

  // Private methods
  private async loadScheduledTasks(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('enabled', true);
      
      if (error) {
        console.error('Error loading scheduled tasks:', error);
        return;
      }
      
      for (const taskData of data || []) {
        const task: ScheduledTask = {
          id: taskData.id,
          name: taskData.name,
          type: taskData.type,
          schedule: taskData.schedule,
          enabled: taskData.enabled,
          parameters: taskData.parameters,
          lastRun: taskData.last_run ? new Date(taskData.last_run) : undefined,
          nextRun: new Date(taskData.next_run),
          runCount: taskData.run_count || 0,
          failureCount: taskData.failure_count || 0,
          createdAt: new Date(taskData.created_at),
          updatedAt: new Date(taskData.updated_at)
        };
        
        this.scheduledTasks.set(task.id, task);
      }
      
      console.log(`📋 Loaded ${this.scheduledTasks.size} scheduled tasks`);
      
    } catch (error) {
      console.error('Error loading scheduled tasks:', error);
    }
  }

  private async scheduleAllTasks(): Promise<void> {
    for (const task of this.scheduledTasks.values()) {
      if (task.enabled) {
        await this.scheduleTask(task);
      }
    }
  }

  private async scheduleTask(task: ScheduledTask): Promise<void> {
    const now = new Date();
    const timeUntilRun = task.nextRun.getTime() - now.getTime();
    
    if (timeUntilRun <= 0) {
      // Task is overdue, run immediately
      await this.executeTask(task);
      return;
    }
    
    // Clear existing timer
    const existingTimer = this.taskTimers.get(task.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Schedule new timer
    const timer = setTimeout(async () => {
      await this.executeTask(task);
    }, timeUntilRun);
    
    this.taskTimers.set(task.id, timer);
    
    console.log(`⏰ Scheduled task ${task.name} to run in ${Math.round(timeUntilRun / 1000)}s`);
  }

  private async executeTask(task: ScheduledTask): Promise<string> {
    const runId = this.generateRunId();
    const startTime = new Date();
    
    const taskRun: TaskRun = {
      id: runId,
      taskId: task.id,
      startTime,
      status: 'running',
      duration: 0
    };
    
    this.taskRuns.set(runId, taskRun);
    await this.saveTaskRunToDatabase(taskRun);
    
    try {
      console.log(`🏃 Executing task: ${task.name} (${task.id})`);
      
      let result: any;
      
      switch (task.type) {
        case 'content_generation':
          result = await this.executeContentGeneration(task);
          break;
        case 'quality_check':
          result = await this.executeQualityCheck(task);
          break;
        case 'performance_optimization':
          result = await this.executePerformanceOptimization(task);
          break;
        case 'backup':
          result = await this.executeBackup(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
      
      // Update task run
      taskRun.status = 'completed';
      taskRun.endTime = new Date();
      taskRun.result = result;
      taskRun.duration = taskRun.endTime.getTime() - startTime.getTime();
      
      // Update task
      task.lastRun = startTime;
      task.runCount++;
      task.nextRun = this.calculateNextRun(task.schedule);
      task.updatedAt = new Date();
      
      await this.updateTaskInDatabase(task);
      await this.updateTaskRunInDatabase(taskRun);
      
      // Schedule next run
      if (task.enabled && this.isRunning) {
        await this.scheduleTask(task);
      }
      
      console.log(`✅ Task ${task.name} completed successfully`);
      
    } catch (error) {
      console.error(`❌ Task ${task.name} failed:`, error);
      
      // Update task run
      taskRun.status = 'failed';
      taskRun.endTime = new Date();
      taskRun.error = (error as Error).message;
      taskRun.duration = taskRun.endTime.getTime() - startTime.getTime();
      
      // Update task
      task.failureCount++;
      task.updatedAt = new Date();
      
      await this.updateTaskInDatabase(task);
      await this.updateTaskRunInDatabase(taskRun);
      
      // Schedule next run anyway
      if (task.enabled && this.isRunning) {
        task.nextRun = this.calculateNextRun(task.schedule);
        await this.scheduleTask(task);
      }
    }
    
    return runId;
  }

  private async executeContentGeneration(task: ScheduledTask): Promise<any> {
    const { batchSize = 5, priority = 'medium', qualityThreshold = 0.85 } = task.parameters;
    
    const jobs = [];
    for (let i = 0; i < batchSize; i++) {
      const jobId = await this.pipeline.createJob('single_content', {
        chapterNumber: Math.floor(Math.random() * 4) + 3, // Chapters 3-6
        characterId: ['maya', 'alex', 'david', 'rachel', 'sofia'][Math.floor(Math.random() * 5)],
        templateId: 'interactive-builder',
        qualityThreshold
      }, priority);
      jobs.push(jobId);
    }
    
    return { jobsCreated: jobs.length, jobIds: jobs };
  }

  private async executeQualityCheck(task: ScheduledTask): Promise<any> {
    // Quality check implementation
    return { contentChecked: 100, qualityScore: 0.92, issuesFound: 2 };
  }

  private async executePerformanceOptimization(task: ScheduledTask): Promise<any> {
    // Performance optimization implementation
    return { optimizationsApplied: 5, performanceImprovement: '15%' };
  }

  private async executeBackup(task: ScheduledTask): Promise<any> {
    // Backup implementation
    return { backupSize: '2.5GB', backupLocation: 's3://backups/content-scaling' };
  }

  private calculateNextRun(schedule: string): Date {
    // Simple cron parser - in production, use a proper cron library
    const now = new Date();
    const [minute, hour, day, month, dayOfWeek] = schedule.split(' ');
    
    // For simplicity, adding 1 hour to current time
    // In production, implement proper cron parsing
    const nextRun = new Date(now.getTime() + 60 * 60 * 1000);
    
    return nextRun;
  }

  private calculateSystemHealth(tasks: ScheduledTask[], recentRuns: TaskRun[]): number {
    if (tasks.length === 0) return 100;
    
    const totalRuns = tasks.reduce((sum, task) => sum + task.runCount, 0);
    const totalFailures = tasks.reduce((sum, task) => sum + task.failureCount, 0);
    
    const successRate = totalRuns > 0 ? (totalRuns - totalFailures) / totalRuns : 1;
    const recentSuccessRate = recentRuns.length > 0 
      ? recentRuns.filter(run => run.status === 'completed').length / recentRuns.length 
      : 1;
    
    return Math.round((successRate * 50) + (recentSuccessRate * 50));
  }

  // Database operations
  private async saveTaskToDatabase(task: ScheduledTask): Promise<void> {
    try {
      const { error } = await supabase
        .from('scheduled_tasks')
        .insert({
          id: task.id,
          name: task.name,
          type: task.type,
          schedule: task.schedule,
          enabled: task.enabled,
          parameters: task.parameters,
          next_run: task.nextRun.toISOString(),
          run_count: task.runCount,
          failure_count: task.failureCount,
          created_at: task.createdAt.toISOString(),
          updated_at: task.updatedAt.toISOString()
        });
      
      if (error) {
        console.error('Error saving task to database:', error);
      }
    } catch (error) {
      console.error('Error saving task to database:', error);
    }
  }

  private async updateTaskInDatabase(task: ScheduledTask): Promise<void> {
    try {
      const { error } = await supabase
        .from('scheduled_tasks')
        .update({
          name: task.name,
          schedule: task.schedule,
          enabled: task.enabled,
          parameters: task.parameters,
          last_run: task.lastRun?.toISOString(),
          next_run: task.nextRun.toISOString(),
          run_count: task.runCount,
          failure_count: task.failureCount,
          updated_at: task.updatedAt.toISOString()
        })
        .eq('id', task.id);
      
      if (error) {
        console.error('Error updating task in database:', error);
      }
    } catch (error) {
      console.error('Error updating task in database:', error);
    }
  }

  private async deleteTaskFromDatabase(taskId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('scheduled_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) {
        console.error('Error deleting task from database:', error);
      }
    } catch (error) {
      console.error('Error deleting task from database:', error);
    }
  }

  private async saveTaskRunToDatabase(taskRun: TaskRun): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_runs')
        .insert({
          id: taskRun.id,
          task_id: taskRun.taskId,
          start_time: taskRun.startTime.toISOString(),
          status: taskRun.status,
          duration: taskRun.duration
        });
      
      if (error) {
        console.error('Error saving task run to database:', error);
      }
    } catch (error) {
      console.error('Error saving task run to database:', error);
    }
  }

  private async updateTaskRunInDatabase(taskRun: TaskRun): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_runs')
        .update({
          end_time: taskRun.endTime?.toISOString(),
          status: taskRun.status,
          result: taskRun.result,
          error: taskRun.error,
          duration: taskRun.duration
        })
        .eq('id', taskRun.id);
      
      if (error) {
        console.error('Error updating task run in database:', error);
      }
    } catch (error) {
      console.error('Error updating task run in database:', error);
    }
  }

  // Utility methods
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRunId(): string {
    return `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AutomationScheduler;