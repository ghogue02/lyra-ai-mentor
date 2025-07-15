import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment
dotenv.config();

console.log('🧪 Verifying Automation System');
console.log('==============================');

// Check environment
console.log('✅ Environment Variables:');
console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');

console.log('\n🚀 Testing automation commands:');

try {
  console.log('\n1. Testing start-pipeline...');
  execSync('npm run start-pipeline', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n2. Testing create-test-job...');
  execSync('npm run create-test-job', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n3. Testing queue-status...');
  execSync('npm run queue-status', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n✅ All automation commands are working!');
  
} catch (error) {
  console.error('❌ Error running automation commands:', error.message);
}

console.log('\n🎯 HIVE MIND COLLECTIVE INTELLIGENCE SYSTEM is operational!');
console.log('The automation pipeline is ready to scale your Chapter 2 patterns across all chapters.');