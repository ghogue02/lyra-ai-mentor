import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkActiveGatedColumns() {
  console.log('🔍 Checking is_active and is_gated columns explicitly...\n');

  try {
    // Explicitly select is_active and is_gated columns
    const { data: elements, error } = await supabase
      .from('interactive_elements')
      .select('id, title, type, is_active, is_gated')
      .limit(10);

    if (error) {
      console.error('Error fetching elements:', error);
      return;
    }

    console.log('📊 First 10 elements with active/gated status:');
    console.log('=============================================');
    
    if (elements) {
      elements.forEach(elem => {
        console.log(`\nID: ${elem.id}`);
        console.log(`Title: "${elem.title}"`);
        console.log(`Type: ${elem.type}`);
        console.log(`is_active: ${elem.is_active} (type: ${typeof elem.is_active})`);
        console.log(`is_gated: ${elem.is_gated} (type: ${typeof elem.is_gated})`);
      });
    }

    // Count elements by active/gated status
    const { data: counts, error: countError } = await supabase
      .rpc('get_element_status_counts');

    if (!countError && counts) {
      console.log('\n📈 Status Counts:');
      console.log(counts);
    } else {
      // Fallback if RPC doesn't exist
      const { count: totalCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: gatedCount } = await supabase
        .from('interactive_elements')
        .select('*', { count: 'exact', head: true })
        .eq('is_gated', true);

      console.log('\n📈 Status Counts:');
      console.log(`Total elements: ${totalCount}`);
      console.log(`Active elements: ${activeCount}`);
      console.log(`Gated elements: ${gatedCount}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkActiveGatedColumns();