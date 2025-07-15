#!/usr/bin/env node

/**
 * Fix Character Contamination in Chapters 4-6
 * 
 * This script addresses the Sofia contamination issue where Sofia's name
 * appears in chapters that should feature David (Ch 4), Rachel (Ch 5), 
 * and Alex (Ch 6).
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const CHARACTER_FIXES = {
  // Chapter 4 (David) - Remove Sofia references
  86: {
    content: `David reviews feedback from his latest presentation, searching for patterns. The rejection letters all point to the same issue: "Your data presentations are incredibly thorough," one funder wrote, "but we had no idea what it meant for actual people."

David pulls out his phone and scrolls through successful grant announcements from other organizations. They all start with stories, not statistics. Real people with real challenges and real transformations. His charts show the same transformations, but buried under layers of methodology and correlation coefficients.`
  },
  
  87: {
    content: `David opens his laptop and stares at the spreadsheet containing 847 program participant records. A memory from a recent workshop on data storytelling echoes in his mind. He searches for "Marcus Williams" and finds row 234: Age 19, Program Entry Date: March 15, Housing Status: Unstable, Employment History: None, Program Completion: Yes, Current Employment: Full-time, Wage: $18/hour.`
  },
  
  89: {
    content: `David spends the weekend reconstructing his youth employment presentation using data storytelling principles he's been studying. Instead of starting with methodology, he begins with Marcus sleeping in his car. Instead of correlation tables, he shows the pathway from unstable housing to stable employment. The data remains rigorous, but now it breathes with human experience.`
  },
  
  // Chapter 6 (Alex) - Remove Sofia, David, and Rachel references
  98: {
    content: `That evening, Alex reaches out to nonprofit technology leaders who have been transforming their respective organizations. These pioneers have proven that AI can enhance mission work without sacrificing core values - revolutionizing communication through AI-enhanced storytelling, showing that data and human stories can amplify each other, and creating human-centered automation systems.

Alex studies their methodologies, looking for patterns that could apply to social justice work. The common thread becomes clear: successful AI adoption always starts with organizational values, not technological capabilities. Technology should amplify existing strengths rather than replace established practices.

"The question isn't whether we adopt AI," Alex writes in their journal. "It's how we ensure AI serves justice rather than perpetuating harm."`
  },
  
  99: {
    content: `Alex spends the weekend developing what they call the "Justice-Centered AI Framework" – a decision-making tool that evaluates potential AI applications against Citywide Coalition's core values. Drawing from successful nonprofit AI implementations across the sector, Alex creates four evaluation criteria: Community Amplification (Does this give marginalized voices more power?), Equity Enhancement (Does this reduce or increase disparities?), Transparency Requirement (Can we explain how this works to affected communities?), and Accountability Measures (How do we ensure community control over AI decisions?).

The framework isn't about technology specs or efficiency metrics. It's about ensuring that every AI tool serves the communities Citywide Coalition exists to support.`
  },
  
  102: {
    content: `Based on successful pilot results, Alex prepares for organization-wide AI integration using a comprehensive change management strategy. Drawing from human-centered automation principles, Alex ensures that every AI implementation creates more capacity for community relationship building rather than replacing it.

The integration plan includes mandatory "AI Justice Training" for all staff, community advisory boards for each AI tool, regular impact assessments with affected populations, and "sunset clauses" that require re-evaluation of each tool's justice impact every six months.`
  }
};

async function auditCharacterConsistency() {
  console.log('🔍 Auditing character consistency in chapters 3-6...');
  
  // Get character mentions in content blocks
  const { data: contentBlocks, error } = await supabase
    .from('content_blocks')
    .select(`
      id,
      content,
      lesson_id,
      lessons (
        id,
        title,
        order_index,
        chapter_id,
        chapters (
          id,
          title,
          order_index
        )
      )
    `)
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching content blocks:', error);
    return;
  }
  
  const contamination = [];
  
  contentBlocks.forEach(block => {
    const chapter = block.lessons?.chapters;
    if (!chapter || chapter.order_index < 3 || chapter.order_index > 6) return;
    
    const content = block.content?.toLowerCase() || '';
    const characters = [];
    
    if (content.includes('sofia')) characters.push('Sofia');
    if (content.includes('david')) characters.push('David');
    if (content.includes('rachel')) characters.push('Rachel');
    if (content.includes('alex')) characters.push('Alex');
    if (content.includes('maya')) characters.push('Maya');
    
    if (characters.length > 0) {
      contamination.push({
        blockId: block.id,
        chapter: chapter.order_index,
        chapterTitle: chapter.title,
        lesson: block.lessons.order_index,
        lessonTitle: block.lessons.title,
        characters: characters,
        contentPreview: block.content.substring(0, 200)
      });
    }
  });
  
  console.log(`\n📊 Found ${contamination.length} content blocks with character mentions:`);
  contamination.forEach(item => {
    console.log(`  Block ${item.blockId}: Ch${item.chapter} - ${item.characters.join(', ')}`);
  });
  
  return contamination;
}

async function fixCharacterContamination() {
  console.log('\n🔧 Applying character contamination fixes...');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const [blockId, fix] of Object.entries(CHARACTER_FIXES)) {
    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: fix.content })
        .eq('id', parseInt(blockId));
      
      if (error) {
        console.error(`❌ Error fixing block ${blockId}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Fixed content block ${blockId}`);
        fixedCount++;
      }
    } catch (err) {
      console.error(`❌ Exception fixing block ${blockId}:`, err);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Fix Summary:`);
  console.log(`  ✅ Fixed: ${fixedCount} content blocks`);
  console.log(`  ❌ Errors: ${errorCount} content blocks`);
  
  return { fixedCount, errorCount };
}

async function main() {
  console.log('🚀 Starting Character Contamination Fix Script\n');
  
  try {
    // Audit first
    const contamination = await auditCharacterConsistency();
    
    if (contamination.length === 0) {
      console.log('✅ No character contamination found!');
      return;
    }
    
    // Apply fixes
    const results = await fixCharacterContamination();
    
    if (results.fixedCount > 0) {
      console.log('\n🎉 Character contamination fixes completed successfully!');
      console.log('📋 Next steps:');
      console.log('  1. Bundle optimization');
      console.log('  2. Import conflict resolution');
      console.log('  3. Magical enhancement implementation');
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

main();