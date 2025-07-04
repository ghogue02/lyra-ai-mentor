import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
  console.log('🔍 Checking Interactive Elements Table Schema...\n');

  try {
    // Get one row to see the actual columns
    const { data: sampleRow, error } = await supabase
      .from('interactive_elements')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching sample row:', error);
      return;
    }

    if (sampleRow && sampleRow.length > 0) {
      console.log('📋 Actual columns in interactive_elements table:');
      console.log('=====================================');
      Object.keys(sampleRow[0]).forEach(column => {
        const value = sampleRow[0][column];
        const type = value === null ? 'null' : typeof value;
        console.log(`- ${column}: ${type}`);
      });
      
      console.log('\n📊 Sample row data:');
      console.log(JSON.stringify(sampleRow[0], null, 2));
    }

    // Check if is_active or is_gated columns exist by trying to query them
    console.log('\n🔎 Checking for is_active column:');
    try {
      const { data: activeCheck } = await supabase
        .from('interactive_elements')
        .select('id')
        .eq('is_active', true)
        .limit(1);
      console.log('✅ is_active column exists');
    } catch (e) {
      console.log('❌ is_active column does NOT exist');
    }

    console.log('\n🔎 Checking for is_gated column:');
    try {
      const { data: gatedCheck } = await supabase
        .from('interactive_elements')
        .select('id')
        .eq('is_gated', false)
        .limit(1);
      console.log('✅ is_gated column exists');
    } catch (e) {
      console.log('❌ is_gated column does NOT exist');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkSchema();