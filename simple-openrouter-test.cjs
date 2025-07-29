#!/usr/bin/env node

/**
 * Simple OpenRouter API Test
 * Tests the API connection directly to verify it works
 */

const { performance } = require('perf_hooks');

async function testOpenRouterAPI() {
  console.log('🧪 Testing OpenRouter API directly...');
  
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    console.error('❌ No OPENROUTER_API_KEY environment variable found');
    return;
  }
  
  console.log('🔑 OpenRouter key available:', openRouterKey.substring(0, 20) + '...');
  
  const payload = {
    model: 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: 'You are Maya, an email marketing expert.' },
      { role: 'user', content: 'Create a short welcome email for new subscribers.' }
    ],
    temperature: 0.7,
    max_tokens: 200
  };

  const startTime = performance.now();
  
  try {
    console.log('🌐 Making request to OpenRouter...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Lyra AI Learning Platform'
      },
      body: JSON.stringify(payload)
    });

    const duration = Math.round(performance.now() - startTime);
    const responseText = await response.text();
    
    console.log('📊 Status:', response.status, response.statusText);
    console.log('⏱️ Duration:', duration + 'ms');
    console.log('📏 Response size:', responseText.length);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ OpenRouter API Test SUCCESSFUL!');
        console.log('🎉 Model used:', data.model);
        console.log('📝 Generated content:', data.choices[0]?.message?.content?.substring(0, 100) + '...');
        console.log('💰 Usage:', data.usage);
        return { success: true, data };
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
        console.log('📄 Raw response:', responseText.substring(0, 200));
        return { success: false, error: 'Parse error', raw: responseText };
      }
    } else {
      console.log('❌ OpenRouter API Test FAILED');
      console.log('💥 Error Response:', responseText);
      return { success: false, error: responseText };
    }

  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    console.log('💥 Request Exception:', error.message);
    console.log('⏱️ Duration:', duration + 'ms');
    return { success: false, exception: error.message };
  }
}

// Test multiple models to see if it's model-specific
async function testMultipleModels() {
  console.log('\n🧪 Testing Multiple Models...');
  
  const models = [
    'google/gemini-2.0-flash-001',
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o-mini'
  ];
  
  for (const model of models) {
    console.log(`\n🤖 Testing model: ${model}`);
    
    const payload = {
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello from ' + model + '"' }
      ],
      temperature: 0.5,
      max_tokens: 50
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lovable.dev',
          'X-Title': 'Lyra AI Learning Platform'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log(`📊 ${model}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log(`✅ ${model}: ${data.choices[0]?.message?.content}`);
      } else {
        console.log(`❌ ${model}: ${responseText.substring(0, 100)}`);
      }
      
    } catch (error) {
      console.log(`💥 ${model}: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function runTests() {
  console.log('🚀 Simple OpenRouter Test Suite');
  console.log('⏰ Started:', new Date().toISOString());
  
  const result1 = await testOpenRouterAPI();
  
  if (result1.success) {
    await testMultipleModels();
  }
  
  console.log('\n🏁 Test Complete');
  console.log('⏰ Finished:', new Date().toISOString());
}

if (require.main === module) {
  runTests().catch(console.error);
}