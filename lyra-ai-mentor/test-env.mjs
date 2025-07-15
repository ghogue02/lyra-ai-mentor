import dotenv from 'dotenv';

console.log('🔧 Testing environment loading...');

// Load .env file
const result = dotenv.config();

console.log('✅ Dotenv result:', result.error ? 'Error: ' + result.error : 'Success');

// Check if OPENAI_API_KEY is loaded
console.log('🔑 OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');

if (process.env.OPENAI_API_KEY) {
  console.log('   First 20 chars:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
}

console.log('📁 Current working directory:', process.cwd());
console.log('📄 .env file exists:', await import('fs').then(fs => fs.existsSync('.env')));

// Test dynamic import of aiService
try {
  console.log('\n🧪 Testing dynamic import of aiService...');
  const { AIService } = await import('./src/services/aiService.js');
  console.log('✅ AIService imported successfully');
  
  const aiService = new AIService();
  console.log('✅ AIService instance created');
} catch (error) {
  console.log('❌ AIService import failed:', error.message);
}

console.log('\n🎯 Environment is ready for automation pipeline!');