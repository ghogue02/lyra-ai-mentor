import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Initialize Supabase client
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

async function fixInteractiveElementsActiveStatus() {
  console.log('🔧 Fixing Interactive Elements Active Status...\n');

  try {
    // First, check current state
    const { data: beforeElements, error: beforeError } = await supabase
      .from('interactive_elements')
      .select('id, is_active, is_gated');

    if (beforeError) {
      console.error('Error checking current state:', beforeError);
      return;
    }

    const beforeStats = {
      total: beforeElements?.length || 0,
      nullActive: beforeElements?.filter(e => e.is_active === null).length || 0,
      nullGated: beforeElements?.filter(e => e.is_gated === null).length || 0,
      activeTrue: beforeElements?.filter(e => e.is_active === true).length || 0,
      activeFalse: beforeElements?.filter(e => e.is_active === false).length || 0,
    };

    console.log('📊 Before Update:');
    console.log(`Total elements: ${beforeStats.total}`);
    console.log(`NULL is_active: ${beforeStats.nullActive}`);
    console.log(`NULL is_gated: ${beforeStats.nullGated}`);
    console.log(`Active elements: ${beforeStats.activeTrue}`);
    console.log(`Inactive elements: ${beforeStats.activeFalse}`);
    console.log('\n');

    // Update all elements to be active and not gated
    console.log('🔄 Updating all elements to is_active=true and is_gated=false...');
    
    // Get all element IDs that need updating
    const elementsToUpdate = beforeElements?.filter(e => 
      e.is_active === null || e.is_active === false || e.is_gated === null || e.is_gated === true
    ) || [];

    console.log(`Found ${elementsToUpdate.length} elements to update`);

    if (elementsToUpdate.length > 0) {
      // Update in batches to avoid timeout
      const batchSize = 10;
      for (let i = 0; i < elementsToUpdate.length; i += batchSize) {
        const batch = elementsToUpdate.slice(i, i + batchSize);
        const batchIds = batch.map(e => e.id);
        
        const { error: updateError } = await supabase
          .from('interactive_elements')
          .update({ 
            is_active: true,
            is_gated: false 
          })
          .in('id', batchIds);

        if (updateError) {
          console.error(`Error updating batch ${i / batchSize + 1}:`, updateError);
        } else {
          console.log(`✅ Updated batch ${i / batchSize + 1} (${batch.length} elements)`);
        }
      }
    }

    // Verify the update
    const { data: afterElements, error: afterError } = await supabase
      .from('interactive_elements')
      .select('id, is_active, is_gated');

    if (afterError) {
      console.error('Error checking after state:', afterError);
      return;
    }

    const afterStats = {
      total: afterElements?.length || 0,
      activeTrue: afterElements?.filter(e => e.is_active === true).length || 0,
      gatedFalse: afterElements?.filter(e => e.is_gated === false).length || 0,
    };

    console.log('\n📊 After Update:');
    console.log(`Total elements: ${afterStats.total}`);
    console.log(`Active elements: ${afterStats.activeTrue}`);
    console.log(`Ungated elements: ${afterStats.gatedFalse}`);

    // Show elements per chapter
    const { data: chapterStats, error: chapterError } = await supabase
      .from('interactive_elements')
      .select(`
        id,
        is_active,
        lessons (
          id,
          chapters (
            id,
            title,
            order_index
          )
        )
      `);

    if (!chapterError && chapterStats) {
      const chapterCounts = new Map();
      
      chapterStats.forEach(elem => {
        if (elem.lessons?.chapters) {
          const chapter = elem.lessons.chapters;
          const key = `${chapter.order_index}|${chapter.title}`;
          if (!chapterCounts.has(key)) {
            chapterCounts.set(key, { total: 0, active: 0 });
          }
          const stats = chapterCounts.get(key);
          stats.total++;
          if (elem.is_active) stats.active++;
        }
      });

      console.log('\n📚 Active Elements Per Chapter:');
      const sortedChapters = Array.from(chapterCounts.entries()).sort((a, b) => {
        const aOrder = parseInt(a[0].split('|')[0]);
        const bOrder = parseInt(b[0].split('|')[0]);
        return aOrder - bOrder;
      });

      sortedChapters.forEach(([key, stats]) => {
        const [order, title] = key.split('|');
        console.log(`Chapter ${order}: ${title} - ${stats.active}/${stats.total} active`);
      });
    }

    console.log('\n✅ Fix completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Refresh your browser to see all interactive elements');
    console.log('2. Check that all elements are now visible in each chapter');
    console.log('3. Verify that the "board defense strategy" element appears in Chapter 5');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the fix
fixInteractiveElementsActiveStatus();