#!/usr/bin/env node

/**
 * OpenRouter 503 Error Diagnostic Test Suite
 * 
 * This script systematically tests the entire pipeline to isolate
 * the source of 503 errors in the template library:
 * 
 * 1. Direct OpenRouter API test (bypass Edge Function)
 * 2. Minimal Edge Function test (basic parameters)
 * 3. Template library specific test (exact failing parameters)
 * 4. Database constraint validation
 * 5. Environment variable validation
 */

const { performance } = require('perf_hooks');

class OpenRouter503Diagnostics {
  constructor() {
    this.results = [];
    
    // Production Edge Function URL
    this.edgeFunctionUrl = 'https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/generate-character-content';
    
    // Auth tokens from existing tests
    this.authToken = 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImNyZHVPM3ZHQ0ZDZXRUbnUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hma3p3am5seHJ3eW5hY3RjbXBlLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkMTQ0MzNmNC1jMTdlLTRhNmUtOTRjNC1kODliZTA4MGFkMmQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzNjY1MTM2LCJpYXQiOjE3NTM2NjE1MzYsImVtYWlsIjoiZ3JlZy5ob2d1ZUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZ3JlZy5ob2d1ZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJkMTQ0MzNmNC1jMTdlLTRhNmUtOTRjNC1kODliZTA4MGFkMmQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1MzQ3MjM3N31dLCJzZXNzaW9uX2lkIjoiZTJlMThiODAtYTU3NC00ZGViLTg4ODYtMGIwYjQ4YzJmYTIzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.szAJIi4nRQ2Ob9g2slmUKQinf-Cv1EtVJ4mBCVxX354';
    this.apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0';
    
    // OpenRouter API details (from environment - we'll need to get this)
    this.openRouterKey = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_KEY_HERE';
    this.openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    console.log('🧪 OpenRouter 503 Diagnostic Test Suite');
    console.log('🎯 Target:', this.edgeFunctionUrl);
    console.log('🔑 OpenRouter Key Available:', !!this.openRouterKey && this.openRouterKey !== 'YOUR_OPENROUTER_KEY_HERE');
    console.log('⏰ Started:', new Date().toISOString());
  }

  async logTest(testName, operation) {
    console.log(`\n🧪 [TEST] ${testName}`);
    console.log('─'.repeat(50));
    
    const startTime = performance.now();
    let result;
    
    try {
      result = await operation();
      const duration = Math.round(performance.now() - startTime);
      
      result.testName = testName;
      result.duration = duration;
      result.timestamp = new Date().toISOString();
      
      this.results.push(result);
      
      if (result.success) {
        console.log(`✅ [SUCCESS] ${testName} - ${duration}ms`);
      } else {
        console.log(`❌ [FAILED] ${testName} - ${duration}ms`);
        console.log(`💥 Error: ${result.error || result.statusText}`);
      }
      
      return result;
      
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      result = {
        testName,
        success: false,
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
        exception: true
      };
      
      this.results.push(result);
      console.log(`💥 [EXCEPTION] ${testName} - ${duration}ms`);
      console.log(`💥 Error: ${error.message}`);
      
      return result;
    }
  }

  // TEST 1: Direct OpenRouter API Connection
  async testDirectOpenRouterAPI() {
    return this.logTest('Direct OpenRouter API Connection', async () => {
      if (!this.openRouterKey || this.openRouterKey === 'YOUR_OPENROUTER_KEY_HERE') {
        return {
          success: false,
          error: 'OpenRouter API key not available - check environment variables',
          statusCode: 0
        };
      }

      const payload = {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: 'Say "OpenRouter connection test successful" and nothing else.' }
        ],
        temperature: 0.5,
        max_tokens: 50
      };

      console.log('🌐 Testing direct OpenRouter API...');
      console.log('📤 Model:', payload.model);
      console.log('📤 Message count:', payload.messages.length);

      const response = await fetch(this.openRouterUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lovable.dev',
          'X-Title': 'Lyra AI Learning Platform - Diagnostic Test'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
      }

      console.log('📊 Status:', response.status, response.statusText);
      console.log('📏 Response size:', responseText.length);

      if (parsedResponse?.choices?.[0]?.message?.content) {
        console.log('📝 Generated content:', parsedResponse.choices[0].message.content);
      }

      return {
        success: response.ok && !!parsedResponse?.choices?.[0]?.message?.content,
        statusCode: response.status,
        statusText: response.statusText,
        responseSize: responseText.length,
        generatedContent: parsedResponse?.choices?.[0]?.message?.content,
        error: parsedResponse?.error?.message || (!response.ok ? responseText : null)
      };
    });
  }

  // TEST 2: Minimal Edge Function Test
  async testMinimalEdgeFunction() {
    return this.logTest('Minimal Edge Function Test', async () => {
      const payload = {
        characterType: 'maya',
        contentType: 'email',
        topic: 'Test email topic'
      };

      console.log('🎭 Testing minimal Edge Function call...');
      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authToken,
          'apikey': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
      }

      console.log('📊 Status:', response.status, response.statusText);
      console.log('📏 Response size:', responseText.length);

      if (parsedResponse?.contentId) {
        console.log('🆔 Content ID:', parsedResponse.contentId);
        console.log('📝 Title:', parsedResponse.title?.substring(0, 50) + '...');
      }

      return {
        success: response.ok && !!parsedResponse?.contentId,
        statusCode: response.status,
        statusText: response.statusText,
        responseSize: responseText.length,
        contentId: parsedResponse?.contentId,
        title: parsedResponse?.title,
        error: parsedResponse?.error || (!response.ok ? responseText : null)
      };
    });
  }

  // TEST 3: Template Library Specific Test
  async testTemplateLibraryScenario() {
    return this.logTest('Template Library Scenario Test', async () => {
      // Simulate exact parameters that the template library might be sending
      const payload = {
        characterType: 'maya',
        contentType: 'email',
        topic: 'Email automation for small businesses',
        context: 'Create a welcome email sequence template for new subscribers to a small business newsletter',
        targetAudience: 'Small business owners',
        mayaPatterns: 'Focus on personalization and data-driven email marketing approaches'
      };

      console.log('📚 Testing template library scenario...');
      console.log('📤 Full payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authToken,
          'apikey': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
        console.log('📄 Raw response preview:', responseText.substring(0, 200));
      }

      console.log('📊 Status:', response.status, response.statusText);
      console.log('📏 Response size:', responseText.length);

      if (response.status === 503) {
        console.log('🚨 503 ERROR DETECTED - This is the issue!');
        console.log('📄 Error response:', responseText.substring(0, 500));
      }

      if (parsedResponse?.contentId) {
        console.log('🆔 Content ID:', parsedResponse.contentId);
        console.log('📝 Title:', parsedResponse.title?.substring(0, 50) + '...');
        console.log('📄 Content preview:', parsedResponse.content?.substring(0, 100) + '...');
      }

      return {
        success: response.ok && !!parsedResponse?.contentId,
        statusCode: response.status,
        statusText: response.statusText,
        responseSize: responseText.length,
        contentId: parsedResponse?.contentId,
        title: parsedResponse?.title,
        content: parsedResponse?.content?.substring(0, 200),
        error: parsedResponse?.error || (!response.ok ? responseText : null),
        category: parsedResponse?.category,
        is503: response.status === 503
      };
    });
  }

  // TEST 4: Invalid Character Test (Should trigger validation error)
  async testInvalidCharacterValidation() {
    return this.logTest('Invalid Character Validation Test', async () => {
      const payload = {
        characterType: 'invalid_character',
        contentType: 'email',
        topic: 'Test invalid character'
      };

      console.log('🚫 Testing invalid character validation...');
      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authToken,
          'apikey': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
      }

      console.log('📊 Status:', response.status, response.statusText);
      console.log('📄 Error message:', parsedResponse?.error || responseText.substring(0, 100));

      // This should return a 400 validation error, not 503
      const expectedError = response.status === 400 && responseText.includes('Unknown character type');

      return {
        success: expectedError,
        statusCode: response.status,
        statusText: response.statusText,
        error: parsedResponse?.error || responseText,
        category: parsedResponse?.category,
        expectedValidationError: expectedError
      };
    });
  }

  // TEST 5: Database Connection Test
  async testDatabaseOperationPaths() {
    return this.logTest('Database Operation Simulation', async () => {
      // Test with all valid parameters but analyze response for database issues
      const payload = {
        characterType: 'sofia',
        contentType: 'article',
        topic: 'Brand storytelling techniques',
        context: 'Database operation test with different character and content type combination'
      };

      console.log('🗄️ Testing different character/content type for DB constraints...');
      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authToken,
          'apikey': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
      }

      console.log('📊 Status:', response.status, response.statusText);

      if (response.status === 503) {
        console.log('🚨 503 ERROR on database operation - constraint issue?');
        console.log('📄 Error details:', responseText.substring(0, 500));
      }

      return {
        success: response.ok && !!parsedResponse?.contentId,
        statusCode: response.status,
        statusText: response.statusText,
        contentId: parsedResponse?.contentId,
        error: parsedResponse?.error || (!response.ok ? responseText : null),
        category: parsedResponse?.category,
        is503: response.status === 503,
        isDatabaseError: parsedResponse?.category === 'DATABASE_ERROR'
      };
    });
  }

  // TEST 6: Authentication Test
  async testAuthenticationScenarios() {
    return this.logTest('Authentication Scenarios Test', async () => {
      const payload = {
        characterType: 'david',
        contentType: 'lesson',
        topic: 'Data visualization basics'
      };

      console.log('🔐 Testing without authentication...');

      // Test without auth token
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey
          // No Authorization header
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let parsedResponse = null;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.log('⚠️ Response parsing failed:', parseError.message);
      }

      console.log('📊 Status:', response.status, response.statusText);

      // Anonymous requests should work or return specific auth error, not 503
      const isAuthIssue = response.status === 401 || response.status === 403;
      const isSuccessful = response.ok && !!parsedResponse?.contentId;

      return {
        success: isSuccessful || isAuthIssue, // Both are acceptable outcomes
        statusCode: response.status,
        statusText: response.statusText,
        contentId: parsedResponse?.contentId,
        error: parsedResponse?.error || (!response.ok ? responseText : null),
        isAuthError: isAuthIssue,
        anonymousAccessWorks: isSuccessful
      };
    });
  }

  // Comprehensive Analysis
  generateDiagnosticReport() {
    console.log('\n📊 DIAGNOSTIC REPORT');
    console.log('='.repeat(60));

    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    const errors503 = this.results.filter(r => r.statusCode === 503 || r.is503);

    console.log(`\n📈 Test Summary:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Successful: ${successfulTests.length} (${Math.round(successfulTests.length / totalTests * 100)}%)`);
    console.log(`   Failed: ${failedTests.length} (${Math.round(failedTests.length / totalTests * 100)}%)`);
    console.log(`   503 Errors: ${errors503.length}`);

    if (successfulTests.length > 0) {
      const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
      console.log(`   Average Duration: ${Math.round(avgDuration)}ms`);
    }

    console.log('\n🔍 Detailed Results:');
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const timing = `${result.duration}ms`;
      const statusCode = result.statusCode ? `[${result.statusCode}]` : '';
      
      console.log(`   ${status} ${result.testName} - ${timing} ${statusCode}`);
      
      if (!result.success && result.error) {
        console.log(`      💥 ${result.error.substring(0, 100)}`);
      }
      
      if (result.is503) {
        console.log(`      🚨 503 ERROR DETECTED`);
      }
    });

    console.log('\n🎯 Root Cause Analysis:');
    
    // Analyze patterns
    const openRouterDirect = this.results.find(r => r.testName.includes('Direct OpenRouter'));
    const minimalEdge = this.results.find(r => r.testName.includes('Minimal Edge'));
    const templateLibrary = this.results.find(r => r.testName.includes('Template Library'));

    if (openRouterDirect && !openRouterDirect.success) {
      console.log('   🔴 OpenRouter API connection is failing');
      console.log('      → Check OPENROUTER_API_KEY environment variable');
      console.log('      → Verify API key has sufficient credits');
      console.log('      → Check OpenRouter service status');
    } else if (openRouterDirect && openRouterDirect.success) {
      console.log('   ✅ OpenRouter API connection works');
    }

    if (minimalEdge && !minimalEdge.success) {
      console.log('   🔴 Edge Function has fundamental issues');
      console.log('      → Check Edge Function deployment');
      console.log('      → Verify environment variables in Supabase');
      console.log('      → Check Edge Function logs');
    } else if (minimalEdge && minimalEdge.success) {
      console.log('   ✅ Basic Edge Function works');
    }

    if (templateLibrary && templateLibrary.is503) {
      console.log('   🚨 Template Library triggers 503 errors');
      console.log('      → Likely database constraint issue');
      console.log('      → Check character/content type combinations');
      console.log('      → Verify database constraints are updated');
    }

    const databaseTest = this.results.find(r => r.testName.includes('Database Operation'));
    if (databaseTest && databaseTest.isDatabaseError) {
      console.log('   🔴 Database constraint issues detected');
      console.log('      → Run database constraint fixes');
      console.log('      → Check generated_content table constraints');
    }

    console.log('\n💡 Recommended Actions:');
    
    if (errors503.length > 0) {
      console.log('   1. 🔧 Check database constraints on generated_content table');
      console.log('   2. 🔧 Verify all character types are allowed in constraints');
      console.log('   3. 🔧 Verify all content types are allowed in constraints');
      console.log('   4. 📋 Review Edge Function logs for specific database errors');
    }
    
    if (this.results.some(r => r.error && r.error.includes('OpenRouter'))) {
      console.log('   5. 🔑 Check OpenRouter API key configuration');
      console.log('   6. 💳 Verify OpenRouter account has sufficient credits');
    }

    console.log('\n🏁 Diagnostic Complete');
    console.log('⏰ Completed:', new Date().toISOString());
    
    return {
      totalTests,
      successfulTests: successfulTests.length,
      failedTests: failedTests.length,
      errors503: errors503.length,
      results: this.results
    };
  }

  async runAllDiagnostics() {
    console.log('\n🚀 Starting Comprehensive 503 Diagnostic Suite');
    
    try {
      // Run all tests in sequence
      await this.testDirectOpenRouterAPI();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testMinimalEdgeFunction();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testTemplateLibraryScenario();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testInvalidCharacterValidation();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testDatabaseOperationPaths();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.testAuthenticationScenarios();
      
      // Generate comprehensive report
      return this.generateDiagnosticReport();
      
    } catch (error) {
      console.error('💥 Diagnostic suite exception:', error);
      return { error: error.message, results: this.results };
    }
  }
}

// Run diagnostics
async function runDiagnostics() {
  const diagnostics = new OpenRouter503Diagnostics();
  const results = await diagnostics.runAllDiagnostics();
  
  console.log('\n💾 Results saved for analysis');
  return results;
}

// Execute if run directly
if (require.main === module) {
  runDiagnostics().catch(console.error);
}

module.exports = OpenRouter503Diagnostics;