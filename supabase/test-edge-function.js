// Test the actual Edge Function with a real request
// This simulates what the frontend would send

async function testEdgeFunction() {
  console.log('🚀 Testing Edge Function...');
  
  const testPayload = {
    characterType: 'maya',
    contentType: 'email',
    topic: 'Email automation for small businesses',
    context: 'Create a welcome email sequence for new subscribers',
    targetAudience: 'Small business owners',
    mayaPatterns: 'Focus on personalization and data-driven approaches'
  };

  try {
    const response = await fetch('http://127.0.0.1:54321/functions/v1/generate-character-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify(testPayload)
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📝 Response Body Length:', responseText.length);
    console.log('📝 Response Body Preview:', responseText.substring(0, 300) + '...');

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Edge Function Test SUCCESSFUL!');
        console.log('🎉 Generated Content ID:', data.contentId);
        console.log('📑 Title:', data.title?.substring(0, 80) + '...');
        console.log('📄 Content Length:', data.content?.length || 0);
        return { success: true, data };
      } catch (parseError) {
        console.log('✅ Edge Function returned data but failed JSON parsing');
        return { success: true, text: responseText };
      }
    } else {
      console.log('❌ Edge Function Test FAILED');
      console.log('💥 Error Response:', responseText);
      return { success: false, error: responseText };
    }

  } catch (error) {
    console.log('💥 Edge Function Test EXCEPTION:', error.message);
    return { success: false, exception: error.message };
  }
}

// Run the test
testEdgeFunction().then(result => {
  console.log('\n🏁 Final Result:', result.success ? 'SUCCESS' : 'FAILED');
});