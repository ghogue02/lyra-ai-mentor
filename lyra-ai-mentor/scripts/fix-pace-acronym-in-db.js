#!/usr/bin/env node

/**
 * Fix PACE acronym in existing toolkit items
 * Changes "Approach:" to "Execute:" in why_this_works field
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixPaceAcronym() {
  console.log('Starting PACE acronym fix...');
  
  try {
    // Fetch all toolkit items that might have PACE email data
    const { data: items, error: fetchError } = await supabase
      .from('toolkit_items')
      .select('id, metadata')
      .eq('file_type', 'pace_email');

    if (fetchError) {
      console.error('Error fetching toolkit items:', fetchError);
      return;
    }

    console.log(`Found ${items?.length || 0} PACE email items to check`);

    let updatedCount = 0;
    
    for (const item of items || []) {
      try {
        if (!item.metadata) continue;
        
        const metadata = typeof item.metadata === 'string' 
          ? JSON.parse(item.metadata) 
          : item.metadata;
        
        if (metadata.pace_data?.why_this_works?.includes('Approach:')) {
          // Update the why_this_works field
          metadata.pace_data.why_this_works = metadata.pace_data.why_this_works.replace(
            /^Approach:/gm,
            'Execute:'
          );
          
          // Update the item in the database
          const { error: updateError } = await supabase
            .from('toolkit_items')
            .update({ metadata: JSON.stringify(metadata) })
            .eq('id', item.id);
          
          if (updateError) {
            console.error(`Error updating item ${item.id}:`, updateError);
          } else {
            updatedCount++;
            console.log(`✓ Updated item ${item.id}`);
          }
        }
      } catch (err) {
        console.error(`Error processing item ${item.id}:`, err);
      }
    }
    
    console.log(`\n✨ Fix complete! Updated ${updatedCount} items.`);
    
  } catch (error) {
    console.error('Error during fix:', error);
  }
}

// Run the fix
fixPaceAcronym().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});