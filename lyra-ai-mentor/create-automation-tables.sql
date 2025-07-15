-- Create automation system tables manually
-- Execute these statements in your Supabase SQL editor

-- 1. Create automation_jobs table
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

-- 2. Create scheduled_tasks table
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

-- 3. Create task_runs table
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

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_automation_jobs_status ON public.automation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_priority ON public.automation_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_created_at ON public.automation_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_enabled ON public.scheduled_tasks(enabled);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_next_run ON public.scheduled_tasks(next_run);

CREATE INDEX IF NOT EXISTS idx_task_runs_task_id ON public.task_runs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_start_time ON public.task_runs(start_time);

-- 5. Enable RLS and create policies
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_runs ENABLE ROW LEVEL SECURITY;

-- Policies for automation_jobs
CREATE POLICY IF NOT EXISTS "Enable all access for automation_jobs" ON public.automation_jobs
    FOR ALL USING (true);

-- Policies for scheduled_tasks
CREATE POLICY IF NOT EXISTS "Enable all access for scheduled_tasks" ON public.scheduled_tasks
    FOR ALL USING (true);

-- Policies for task_runs
CREATE POLICY IF NOT EXISTS "Enable all access for task_runs" ON public.task_runs
    FOR ALL USING (true);

-- 6. Insert sample data
INSERT INTO public.automation_jobs (id, type, status, priority, parameters) VALUES
    ('sample_job_1', 'single_content', 'completed', 'medium', '{"characterId": "maya", "chapterNumber": 3}'),
    ('sample_job_2', 'chapter_batch', 'completed', 'high', '{"chapterNumbers": [4, 5]}'),
    ('sample_job_3', 'learning_path', 'pending', 'low', '{"pathName": "Advanced Analytics", "chapters": [4, 5, 6]}')
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Automation database tables created successfully!' as result;