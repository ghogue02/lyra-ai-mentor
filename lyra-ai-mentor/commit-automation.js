const { execSync } = require('child_process');
const path = require('path');

// Change to project directory
const projectDir = '/Users/greghogue/Lyra New/lyra-ai-mentor';
process.chdir(projectDir);

console.log('🚀 Committing automation system to GitHub...');
console.log('=' .repeat(50));

try {
    // Check git status
    console.log('📊 Checking git status...');
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
        console.log(`📝 Found ${status.trim().split('\n').length} files to commit`);
    } else {
        console.log('✅ No changes to commit');
        process.exit(0);
    }
    
    // Add all files
    console.log('📁 Adding all files...');
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ Files added successfully');
    
    // Create commit
    console.log('💾 Creating commit...');
    const commitMessage = `🤖 Add complete automation pipeline system for content scaling

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

Co-Authored-By: Claude <noreply@anthropic.com>`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('✅ Commit created successfully');
    
    // Push to GitHub
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to GitHub!');
    
    console.log('\n🎉 Automation system successfully committed and pushed!');
    console.log('🚀 The HIVE MIND COLLECTIVE INTELLIGENCE SYSTEM is now in your GitHub repository!');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Please run these commands manually:');
    console.error('1. cd "/Users/greghogue/Lyra New/lyra-ai-mentor"');
    console.error('2. git add .');
    console.error('3. git commit -m "Add automation pipeline system"');
    console.error('4. git push origin main');
    process.exit(1);
}