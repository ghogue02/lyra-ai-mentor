import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runAllScripts() {
  console.log('Running all Chapter 7 content creation scripts...');
  
  try {
    await execAsync('npx tsx scripts/create-chapter7-content.ts');
    console.log('✓ Basic content created');
    
    await execAsync('npx tsx scripts/create-chapter7-lesson1-complete.ts');
    console.log('✓ Lesson 1 completed');
    
    await execAsync('npx tsx scripts/create-chapter7-lessons2-4.ts');
    console.log('✓ Lessons 2-4 created');
    
    console.log('🎉 Chapter 7: AI-Powered People Management fully implemented!');
  } catch (error) {
    console.error('Error running scripts:', error);
  }
}

runAllScripts();