// Test the production Edge Function to confirm the schema issue
async function testProductionEdgeFunction() {
  console.log('🚀 Testing Production Edge Function...');
  
  const testPayload = {
    characterType: 'maya',
    contentType: 'email',
    topic: 'Email automation for small businesses',
    context: 'Test request to verify database schema fix'
  };

  try {
    const response = await fetch('https://hfkzwjnlxrwynactcmpe.supabase.co/functions/v1/generate-character-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImNyZHVPM3ZHQ0ZDZXRUbnUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hma3p3am5seHJ3eW5hY3RjbXBlLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkMTQ0MzNmNC1jMTdlLTRhNmUtOTRjNC1kODliZTA4MGFkMmQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzNjY1MTM2LCJpYXQiOjE3NTM2NjE1MzYsImVtYWlsIjoiZ3JlZy5ob2d1ZUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZ3JlZy5ob2d1ZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJkMTQ0MzNmNC1jMTdlLTRhNmUtOTRjNC1kODliZTA4MGFkMmQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1MzQ3MjM3N31dLCJzZXNzaW9uX2lkIjoiZTJlMThiODAtYTU3NC00ZGViLTg4ODYtMGIwYjQ4YzJmYTIzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.szAJIi4nRQ2Ob9g2slmUKQinf-Cv1EtVJ4mBCVxX354',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0'
      },
      body: JSON.stringify(testPayload)
    });

    console.log('📊 Production Response Status:', response.status);
    console.log('📊 Production Response Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📝 Production Response Body Length:', responseText.length);
    console.log('📝 Production Response Body Preview:', responseText.substring(0, 500));

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Production Edge Function Test SUCCESSFUL!');
        console.log('🎉 Generated Content ID:', data.contentId);
        return { success: true, data };
      } catch (parseError) {
        console.log('✅ Production function returned data but failed JSON parsing');
        return { success: true, text: responseText };
      }
    } else {
      console.log('❌ Production Edge Function Test FAILED');
      console.log('💥 Error Response:', responseText);
      return { success: false, error: responseText };
    }

  } catch (error) {
    console.log('💥 Production Edge Function Test EXCEPTION:', error.message);
    return { success: false, exception: error.message };
  }
}

// Run the test
testProductionEdgeFunction().then(result => {
  console.log('\n🏁 Production Test Result:', result.success ? 'SUCCESS' : 'FAILED');
});