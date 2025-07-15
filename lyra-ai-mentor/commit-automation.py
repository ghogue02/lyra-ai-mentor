#!/usr/bin/env python3

import subprocess
import os
import sys

def run_command(cmd, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return 1, "", str(e)

def main():
    # Change to the project directory
    project_dir = "/Users/greghogue/Lyra New/lyra-ai-mentor"
    
    print("🚀 Committing automation system to GitHub...")
    print("=" * 50)
    
    # Check git status
    print("📊 Checking git status...")
    code, stdout, stderr = run_command("git status --porcelain", project_dir)
    if code != 0:
        print(f"❌ Error checking git status: {stderr}")
        return 1
    
    if stdout.strip():
        print(f"📝 Found {len(stdout.strip().split())} files to commit")
    else:
        print("✅ No changes to commit")
        return 0
    
    # Add all files
    print("📁 Adding all files...")
    code, stdout, stderr = run_command("git add .", project_dir)
    if code != 0:
        print(f"❌ Error adding files: {stderr}")
        return 1
    print("✅ Files added successfully")
    
    # Create commit message
    commit_message = """🤖 Add complete automation pipeline system for content scaling

## Major Features Added:

### 🏭 Content Automation Pipeline
- **ContentAutomationPipeline**: Job queue with priority processing (low, medium, high, critical)
- **AutomationWorker**: Parallel processing pool (5 concurrent workers)
- **Job Types**: single_content, chapter_batch, learning_path, cross_chapter_scaling
- **Retry Logic**: Exponential backoff with configurable max retries
- **Real-time Monitoring**: Queue health scores and performance metrics

### 📅 Automation Scheduler
- **AutomationScheduler**: Cron-based task scheduling system
- **Predefined Tasks**: Daily content generation, weekly quality checks, monthly backups
- **Task History**: Complete execution tracking and performance analysis
- **Health Assessment**: System health monitoring and alerting

### 🎛️ Automation Dashboard
- **AutomationDashboard**: React component for real-time monitoring
- **Queue Visualization**: Live job status and progress tracking
- **Performance Metrics**: Throughput, success rates, processing times
- **Scheduler Controls**: Start/stop scheduler, manage tasks

### 🗄️ Database Schema
- **automation_jobs**: Job tracking with full lifecycle management
- **scheduled_tasks**: Task scheduling and execution history
- **task_runs**: Historical execution records and performance data
- **Indexes & Policies**: Optimized for performance and security

### 🔧 CLI Tools & Scripts
- **start-pipeline.ts**: Launch complete automation system
- **create-test-job.ts**: Create and monitor test jobs
- **queue-status.ts**: Monitor system health and performance
- **test-automation.ts**: Comprehensive 10-test validation suite
- **setup-automation-db.ts**: Database schema setup utility

### 🎯 Content Scaling Features
- **Character-Driven Generation**: 5 archetypes (Maya, Alex, David, Rachel, Sofia)
- **Chapter Scaling**: Apply Chapter 2 patterns across chapters 3-6
- **Learning Path Creation**: Skill-based content sequences
- **Cross-Chapter Scaling**: Pattern replication with character adaptation
- **Quality Assurance**: Automated content quality scoring

### 🚀 Performance Optimizations
- **Parallel Processing**: Up to 5 jobs simultaneously
- **Intelligent Queuing**: Priority-based job scheduling
- **Batch Operations**: Efficient multi-chapter/character processing
- **Lazy Loading**: Optimized service initialization
- **Memory Management**: Efficient resource utilization

### 🔌 Integration Features
- **OpenAI Integration**: Real AI-powered content generation
- **Supabase Integration**: Persistent job and task storage
- **Environment Management**: Proper .env configuration
- **Error Handling**: Comprehensive error recovery and reporting

### 📋 NPM Scripts Added
- npm run setup-automation-db - Setup database schema
- npm run start-pipeline - Launch automation system
- npm run create-test-job - Create test jobs
- npm run queue-status - Monitor system status
- npm run test-automation - Run comprehensive tests

### 🎉 System Status
The HIVE MIND COLLECTIVE INTELLIGENCE SYSTEM is now fully operational and ready to scale Chapter 2 patterns across all chapters with automated content generation, intelligent job processing, and comprehensive monitoring.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"""
    
    # Commit changes
    print("💾 Creating commit...")
    code, stdout, stderr = run_command(f'git commit -m "{commit_message}"', project_dir)
    if code != 0:
        print(f"❌ Error creating commit: {stderr}")
        return 1
    print("✅ Commit created successfully")
    
    # Push to GitHub
    print("📤 Pushing to GitHub...")
    code, stdout, stderr = run_command("git push origin main", project_dir)
    if code != 0:
        print(f"❌ Error pushing to GitHub: {stderr}")
        print("stdout:", stdout)
        return 1
    print("✅ Successfully pushed to GitHub!")
    
    print("\n🎉 Automation system successfully committed and pushed!")
    print("🚀 The HIVE MIND COLLECTIVE INTELLIGENCE SYSTEM is now in your GitHub repository!")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())