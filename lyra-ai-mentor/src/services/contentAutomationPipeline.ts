import { supabase } from '@/integrations/supabase/client';
import { ContentScalingEngine } from './contentScalingEngine';
// AIService will be lazy loaded

export interface AutomationJob {
  id: string;
  type: 'single_content' | 'chapter_batch' | 'learning_path' | 'cross_chapter_scaling';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  parameters: any;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  progress: number;
  result?: any;
  error?: string;
  retries: number;
  maxRetries: number;
  estimatedDuration?: number;
  actualDuration?: number;
}

export interface QueueStatus {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  averageProcessingTime: number;
  queueHealthScore: number;
}

export interface JobResult {
  jobId: string;
  success: boolean;
  data?: any;
  error?: string;
  metrics: {
    processingTime: number;
    tokensUsed: number;
    qualityScore: number;
    componentSize: number;
  };
}

export class ContentAutomationPipeline {
  private scalingEngine: ContentScalingEngine;
  private workerPool: AutomationWorker[] = [];
  private jobQueue: AutomationJob[] = [];
  private processingJobs: Map<string, AutomationJob> = new Map();
  private maxConcurrentJobs = 5;
  private isProcessing = false;
  private retryDelays = [1000, 5000, 15000, 60000]; // Progressive backoff

  constructor() {
    this.scalingEngine = new ContentScalingEngine();
    this.initializeWorkers();
  }

  // Initialize worker pool for parallel processing
  private initializeWorkers(): void {
    for (let i = 0; i < this.maxConcurrentJobs; i++) {
      this.workerPool.push(new AutomationWorker(i + 1, this.scalingEngine));
    }
  }

  // Create a new automation job
  async createJob(
    type: AutomationJob['type'],
    parameters: any,
    priority: AutomationJob['priority'] = 'medium'
  ): Promise<string> {
    const job: AutomationJob = {
      id: this.generateJobId(),
      type,
      status: 'pending',
      priority,
      parameters,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      retries: 0,
      maxRetries: 3,
      estimatedDuration: this.estimateJobDuration(type, parameters)
    };

    // Store job in database
    await this.saveJobToDatabase(job);
    
    // Add to queue with priority ordering
    this.addJobToQueue(job);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    console.log(`📝 Created automation job: ${job.id} (${type}, priority: ${priority})`);
    return job.id;
  }

  // Add job to queue with priority ordering
  private addJobToQueue(job: AutomationJob): void {
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    
    // Insert job in correct priority position
    let insertIndex = this.jobQueue.length;
    for (let i = 0; i < this.jobQueue.length; i++) {
      if (priorityOrder[job.priority] < priorityOrder[this.jobQueue[i].priority]) {
        insertIndex = i;
        break;
      }
    }
    
    this.jobQueue.splice(insertIndex, 0, job);
  }

  // Start processing jobs from queue
  private async startProcessing(): Promise<void> {
    this.isProcessing = true;
    
    while (this.jobQueue.length > 0 || this.processingJobs.size > 0) {
      // Process jobs in parallel up to maxConcurrentJobs
      const availableWorkers = this.workerPool.filter(w => w.isAvailable());
      const jobsToProcess = Math.min(availableWorkers.length, this.jobQueue.length);
      
      // Start new jobs
      for (let i = 0; i < jobsToProcess; i++) {
        const job = this.jobQueue.shift()!;
        const worker = availableWorkers[i];
        
        this.processingJobs.set(job.id, job);
        this.processJob(job, worker);
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.isProcessing = false;
  }

  // Process individual job
  private async processJob(job: AutomationJob, worker: AutomationWorker): Promise<void> {
    try {
      job.status = 'processing';
      job.updatedAt = new Date();
      await this.updateJobInDatabase(job);
      
      console.log(`🔄 Processing job ${job.id} with worker ${worker.id}`);
      
      const startTime = Date.now();
      const result = await worker.processJob(job);
      const processingTime = Date.now() - startTime;
      
      job.status = 'completed';
      job.progress = 100;
      job.result = result;
      job.completedAt = new Date();
      job.actualDuration = processingTime;
      job.updatedAt = new Date();
      
      await this.updateJobInDatabase(job);
      console.log(`✅ Job ${job.id} completed in ${processingTime}ms`);
      
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      await this.handleJobFailure(job, error as Error);
    } finally {
      this.processingJobs.delete(job.id);
    }
  }

  // Handle job failure with retry logic
  private async handleJobFailure(job: AutomationJob, error: Error): Promise<void> {
    job.error = error.message;
    job.retries++;
    job.updatedAt = new Date();
    
    if (job.retries < job.maxRetries) {
      // Retry with exponential backoff
      const delay = this.retryDelays[job.retries - 1] || 60000;
      
      console.log(`🔄 Retrying job ${job.id} in ${delay}ms (attempt ${job.retries}/${job.maxRetries})`);
      
      setTimeout(() => {
        job.status = 'pending';
        this.addJobToQueue(job);
      }, delay);
      
    } else {
      job.status = 'failed';
      console.error(`💀 Job ${job.id} failed permanently after ${job.maxRetries} retries`);
    }
    
    await this.updateJobInDatabase(job);
  }

  // Get job status
  async getJobStatus(jobId: string): Promise<AutomationJob | null> {
    try {
      const { data, error } = await supabase
        .from('automation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) {
        console.error('Error fetching job status:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting job status:', error);
      return null;
    }
  }

  // Get queue status
  async getQueueStatus(): Promise<QueueStatus> {
    try {
      const { data, error } = await supabase
        .from('automation_jobs')
        .select('status, created_at, completed_at');
      
      if (error) {
        console.error('Error fetching queue status:', error);
        return this.getEmptyQueueStatus();
      }
      
      const jobs = data || [];
      const completedJobs = jobs.filter(j => j.status === 'completed' && j.completed_at);
      const averageProcessingTime = completedJobs.length > 0 
        ? completedJobs.reduce((sum, job) => {
            const duration = new Date(job.completed_at!).getTime() - new Date(job.created_at).getTime();
            return sum + duration;
          }, 0) / completedJobs.length
        : 0;
      
      const statusCounts = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const queueHealthScore = this.calculateQueueHealthScore(statusCounts, averageProcessingTime);
      
      return {
        total: jobs.length,
        pending: statusCounts.pending || 0,
        processing: statusCounts.processing || 0,
        completed: statusCounts.completed || 0,
        failed: statusCounts.failed || 0,
        averageProcessingTime,
        queueHealthScore
      };
      
    } catch (error) {
      console.error('Error getting queue status:', error);
      return this.getEmptyQueueStatus();
    }
  }

  // Calculate queue health score (0-100)
  private calculateQueueHealthScore(statusCounts: Record<string, number>, avgProcessingTime: number): number {
    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 100;
    
    const successRate = (statusCounts.completed || 0) / total;
    const failureRate = (statusCounts.failed || 0) / total;
    const processingEfficiency = Math.min(1, 30000 / Math.max(avgProcessingTime, 1000)); // 30s is target
    
    return Math.round((successRate * 50) + (processingEfficiency * 30) + ((1 - failureRate) * 20));
  }

  // Cancel job
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      const job = await this.getJobStatus(jobId);
      if (!job) return false;
      
      if (job.status === 'pending') {
        // Remove from queue
        const queueIndex = this.jobQueue.findIndex(j => j.id === jobId);
        if (queueIndex !== -1) {
          this.jobQueue.splice(queueIndex, 1);
        }
      }
      
      // Update status
      job.status = 'cancelled';
      job.updatedAt = new Date();
      await this.updateJobInDatabase(job);
      
      console.log(`🚫 Job ${jobId} cancelled`);
      return true;
      
    } catch (error) {
      console.error('Error cancelling job:', error);
      return false;
    }
  }

  // Batch processing methods
  async processChapterBatch(chapterNumbers: number[], options: any = {}): Promise<string[]> {
    const jobs: string[] = [];
    
    for (const chapterNumber of chapterNumbers) {
      const jobId = await this.createJob('chapter_batch', {
        chapterNumber,
        ...options
      }, 'high');
      jobs.push(jobId);
    }
    
    return jobs;
  }

  async processLearningPath(pathName: string, chapters: number[], skills: string[]): Promise<string> {
    return await this.createJob('learning_path', {
      pathName,
      chapters,
      skills,
      sequentialProcessing: true
    }, 'medium');
  }

  // Database operations
  private async saveJobToDatabase(job: AutomationJob): Promise<void> {
    try {
      const { error } = await supabase
        .from('automation_jobs')
        .insert({
          id: job.id,
          type: job.type,
          status: job.status,
          priority: job.priority,
          parameters: job.parameters,
          created_at: job.createdAt.toISOString(),
          updated_at: job.updatedAt.toISOString(),
          progress: job.progress,
          retries: job.retries,
          max_retries: job.maxRetries,
          estimated_duration: job.estimatedDuration
        });
      
      if (error) {
        console.error('Error saving job to database:', error);
      }
    } catch (error) {
      console.error('Error saving job to database:', error);
    }
  }

  private async updateJobInDatabase(job: AutomationJob): Promise<void> {
    try {
      const { error } = await supabase
        .from('automation_jobs')
        .update({
          status: job.status,
          updated_at: job.updatedAt.toISOString(),
          progress: job.progress,
          result: job.result,
          error: job.error,
          retries: job.retries,
          completed_at: job.completedAt?.toISOString(),
          actual_duration: job.actualDuration
        })
        .eq('id', job.id);
      
      if (error) {
        console.error('Error updating job in database:', error);
      }
    } catch (error) {
      console.error('Error updating job in database:', error);
    }
  }

  // Utility methods
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateJobDuration(type: AutomationJob['type'], parameters: any): number {
    // Estimation based on job type and complexity
    const baseDurations = {
      'single_content': 5000,
      'chapter_batch': 30000,
      'learning_path': 60000,
      'cross_chapter_scaling': 45000
    };
    
    const multipliers = {
      'interactive-builder': 1.5,
      'character-journey': 1.2,
      'multiple_characters': 2.0
    };
    
    let duration = baseDurations[type] || 10000;
    
    // Apply multipliers based on parameters
    if (parameters.templateId && multipliers[parameters.templateId]) {
      duration *= multipliers[parameters.templateId];
    }
    
    if (parameters.characterIds && Array.isArray(parameters.characterIds)) {
      duration *= parameters.characterIds.length;
    }
    
    return Math.round(duration);
  }

  private getEmptyQueueStatus(): QueueStatus {
    return {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      averageProcessingTime: 0,
      queueHealthScore: 100
    };
  }
}

// Worker class for processing jobs
class AutomationWorker {
  public id: number;
  private scalingEngine: ContentScalingEngine;
  private available = true;
  private currentJob: AutomationJob | null = null;

  constructor(id: number, scalingEngine: ContentScalingEngine) {
    this.id = id;
    this.scalingEngine = scalingEngine;
  }

  isAvailable(): boolean {
    return this.available;
  }

  async processJob(job: AutomationJob): Promise<JobResult> {
    this.available = false;
    this.currentJob = job;
    
    try {
      console.log(`🔧 Worker ${this.id} processing job ${job.id} (${job.type})`);
      
      const startTime = Date.now();
      let result: any;
      
      switch (job.type) {
        case 'single_content':
          result = await this.processSingleContent(job);
          break;
        case 'chapter_batch':
          result = await this.processChapterBatch(job);
          break;
        case 'learning_path':
          result = await this.processLearningPath(job);
          break;
        case 'cross_chapter_scaling':
          result = await this.processCrossChapterScaling(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        jobId: job.id,
        success: true,
        data: result,
        metrics: {
          processingTime,
          tokensUsed: result.tokensUsed || 0,
          qualityScore: result.qualityScore || 0.9,
          componentSize: result.componentSize || 0
        }
      };
      
    } catch (error) {
      console.error(`❌ Worker ${this.id} failed processing job ${job.id}:`, error);
      throw error;
    } finally {
      this.available = true;
      this.currentJob = null;
    }
  }

  private async processSingleContent(job: AutomationJob): Promise<any> {
    const { chapterNumber, characterId, templateId, customVariables } = job.parameters;
    
    return await this.scalingEngine.generateChapterContent(
      chapterNumber,
      characterId,
      templateId,
      customVariables
    );
  }

  private async processChapterBatch(job: AutomationJob): Promise<any> {
    const { chapterNumber, characterIds, templateIds, customVariables } = job.parameters;
    
    const results = [];
    
    for (const characterId of characterIds || ['maya', 'alex', 'david', 'rachel', 'sofia']) {
      for (const templateId of templateIds || ['interactive-builder']) {
        const result = await this.scalingEngine.generateChapterContent(
          chapterNumber,
          characterId,
          templateId,
          customVariables
        );
        results.push(result);
      }
    }
    
    return { chapterNumber, results, totalGenerated: results.length };
  }

  private async processLearningPath(job: AutomationJob): Promise<any> {
    const { pathName, chapters, skills, sequentialProcessing } = job.parameters;
    
    const results = [];
    
    for (const chapter of chapters) {
      for (const skill of skills) {
        const result = await this.scalingEngine.generateChapterContent(
          chapter,
          'maya', // Default to Maya for learning paths
          'interactive-builder',
          { skillName: skill, learningPathName: pathName }
        );
        results.push(result);
      }
    }
    
    return { pathName, chapters, results, totalGenerated: results.length };
  }

  private async processCrossChapterScaling(job: AutomationJob): Promise<any> {
    const { sourceChapter, targetChapters, pattern, customizations } = job.parameters;
    
    const results = [];
    
    for (const targetChapter of targetChapters) {
      // Cross-chapter scaling logic here
      const result = await this.scalingEngine.generateChapterContent(
        targetChapter,
        'maya',
        'interactive-builder',
        { 
          sourceChapter,
          scalingPattern: pattern,
          ...customizations
        }
      );
      results.push(result);
    }
    
    return { sourceChapter, targetChapters, results, totalGenerated: results.length };
  }
}

export default ContentAutomationPipeline;