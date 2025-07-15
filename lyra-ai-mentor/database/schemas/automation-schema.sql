-- Automation System Database Schema
-- This schema supports the content scaling automation pipeline

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.task_runs;
DROP TABLE IF EXISTS public.scheduled_tasks;
DROP TABLE IF EXISTS public.automation_jobs;

-- Automation Jobs Table
CREATE TABLE public.automation_jobs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('single_content', 'chapter_batch', 'learning_path', 'cross_chapter_scaling')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    parameters JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    result JSONB,
    error TEXT,
    retries INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    estimated_duration INTEGER, -- in milliseconds
    actual_duration INTEGER -- in milliseconds
);

-- Scheduled Tasks Table
CREATE TABLE public.scheduled_tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('content_generation', 'quality_check', 'performance_optimization', 'backup')),
    schedule TEXT NOT NULL, -- cron expression
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    parameters JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE NOT NULL,
    run_count INTEGER NOT NULL DEFAULT 0,
    failure_count INTEGER NOT NULL DEFAULT 0
);

-- Task Runs Table (for tracking scheduled task executions)
CREATE TABLE public.task_runs (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES public.scheduled_tasks(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    result JSONB,
    error TEXT,
    duration INTEGER -- in milliseconds
);

-- Indexes for performance
CREATE INDEX idx_automation_jobs_status ON public.automation_jobs(status);
CREATE INDEX idx_automation_jobs_priority ON public.automation_jobs(priority);
CREATE INDEX idx_automation_jobs_type ON public.automation_jobs(type);
CREATE INDEX idx_automation_jobs_created_at ON public.automation_jobs(created_at);
CREATE INDEX idx_automation_jobs_updated_at ON public.automation_jobs(updated_at);

CREATE INDEX idx_scheduled_tasks_enabled ON public.scheduled_tasks(enabled);
CREATE INDEX idx_scheduled_tasks_next_run ON public.scheduled_tasks(next_run);
CREATE INDEX idx_scheduled_tasks_type ON public.scheduled_tasks(type);

CREATE INDEX idx_task_runs_task_id ON public.task_runs(task_id);
CREATE INDEX idx_task_runs_start_time ON public.task_runs(start_time);
CREATE INDEX idx_task_runs_status ON public.task_runs(status);

-- Enable Row Level Security
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_runs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view automation jobs" ON public.automation_jobs
    FOR SELECT USING (true);

CREATE POLICY "Users can create automation jobs" ON public.automation_jobs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update automation jobs" ON public.automation_jobs
    FOR UPDATE USING (true);

CREATE POLICY "Users can view scheduled tasks" ON public.scheduled_tasks
    FOR SELECT USING (true);

CREATE POLICY "Users can create scheduled tasks" ON public.scheduled_tasks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update scheduled tasks" ON public.scheduled_tasks
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete scheduled tasks" ON public.scheduled_tasks
    FOR DELETE USING (true);

CREATE POLICY "Users can view task runs" ON public.task_runs
    FOR SELECT USING (true);

CREATE POLICY "Users can create task runs" ON public.task_runs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update task runs" ON public.task_runs
    FOR UPDATE USING (true);

-- Functions for automation
CREATE OR REPLACE FUNCTION update_automation_job_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_scheduled_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER automation_jobs_updated_at_trigger
    BEFORE UPDATE ON public.automation_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_automation_job_timestamp();

CREATE TRIGGER scheduled_tasks_updated_at_trigger
    BEFORE UPDATE ON public.scheduled_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_scheduled_task_timestamp();

-- Insert some sample data for testing
INSERT INTO public.automation_jobs (id, type, status, priority, parameters) VALUES
    ('sample_job_1', 'single_content', 'completed', 'medium', '{"characterId": "maya", "chapterNumber": 3}'),
    ('sample_job_2', 'chapter_batch', 'completed', 'high', '{"chapterNumbers": [4, 5]}'),
    ('sample_job_3', 'learning_path', 'pending', 'low', '{"pathName": "Advanced Analytics", "chapters": [4, 5, 6]}');

-- Grant permissions
GRANT ALL ON public.automation_jobs TO authenticated;
GRANT ALL ON public.scheduled_tasks TO authenticated;
GRANT ALL ON public.task_runs TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.automation_jobs IS 'Jobs in the content scaling automation pipeline';
COMMENT ON TABLE public.scheduled_tasks IS 'Scheduled tasks for automation system';
COMMENT ON TABLE public.task_runs IS 'Historical records of scheduled task executions';

COMMENT ON COLUMN public.automation_jobs.type IS 'Type of automation job: single_content, chapter_batch, learning_path, cross_chapter_scaling';
COMMENT ON COLUMN public.automation_jobs.status IS 'Current status: pending, processing, completed, failed, cancelled';
COMMENT ON COLUMN public.automation_jobs.priority IS 'Job priority: low, medium, high, critical';
COMMENT ON COLUMN public.automation_jobs.parameters IS 'JSON parameters for job execution';
COMMENT ON COLUMN public.automation_jobs.progress IS 'Completion percentage (0-100)';
COMMENT ON COLUMN public.automation_jobs.result IS 'JSON result data from completed job';

COMMENT ON COLUMN public.scheduled_tasks.schedule IS 'Cron expression for task scheduling';
COMMENT ON COLUMN public.scheduled_tasks.type IS 'Type of scheduled task: content_generation, quality_check, performance_optimization, backup';
COMMENT ON COLUMN public.scheduled_tasks.enabled IS 'Whether the task is active';
COMMENT ON COLUMN public.scheduled_tasks.next_run IS 'Next scheduled execution time';

-- Success message
SELECT 'Automation system database schema created successfully!' as result;