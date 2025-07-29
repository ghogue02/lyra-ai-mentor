/**
 * Test using actual environment setup from the project
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hfkzwjnlxrwynactcmpe.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Environment Check:');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('ANON_KEY present:', !!SUPABASE_ANON_KEY);
console.log('ANON_KEY length:', SUPABASE_ANON_KEY?.length || 0);

if (!SUPABASE_ANON_KEY) {
    console.log('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
    console.log('💡 Create a .env file with:');
    console.log('VITE_SUPABASE_URL=https://hfkzwjnlxrwynactcmpe.supabase.co');
    console.log('VITE_SUPABASE_ANON_KEY=your_actual_anon_key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the template library scenario
console.log('\n🧪 Testing Template Library with Correct Environment');
console.log('=' .repeat(60));

try {
    const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
            characterType: 'maya',
            contentType: 'email',
            topic: 'Donor engagement email template',
            context: 'Create a professional email template for nonprofit donor engagement',
            targetAudience: 'nonprofit development staff'
        }
    });

    if (error) {
        console.log('❌ Error:', error.message);
        console.log('Status code:', error.context?.status);
        
        if (error.context?.status === 401) {
            console.log('🔑 Authentication issue - check anon key');
        } else if (error.context?.status === 503) {
            console.log('🚨 503 error - database constraints still failing');
        }
        process.exit(1);
    }

    console.log('✅ SUCCESS! Template library is working!');
    console.log('📝 Content length:', data.content.length);
    console.log('🆔 Content ID:', data.contentId);
    console.log('\n📧 Generated email preview:');
    console.log(data.content.substring(0, 300) + '...');
    
    console.log('\n🎉 The 503 errors have been resolved!');
    console.log('✅ Template library should now work in the browser');
    
} catch (error) {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
}