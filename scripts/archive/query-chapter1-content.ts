import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Initialize Supabase client
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

async function queryChapter1Content() {
  console.log('🔍 Querying Chapter 1 content from Supabase...\n');

  try {
    // 1. First, let's see all chapters
    const { data: allChapters, error: allChaptersError } = await supabase
      .from('chapters')
      .select('*')
      .order('order_index');

    if (allChaptersError) {
      console.error('Error fetching all chapters:', allChaptersError);
      return;
    }

    console.log('📚 All Chapters:');
    allChapters?.forEach(ch => {
      console.log(`  - Chapter ${ch.order_index}: ${ch.title} (ID: ${ch.id})`);
    });
    console.log('\n---\n');

    // Now get Chapter 1 (order_index 1)
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('order_index', 1) // Chapter 1 is order_index 1
      .single();

    if (chapterError) {
      console.error('Error fetching chapter:', chapterError);
      return;
    }

    console.log('📚 Chapter 1 Details:');
    console.log(JSON.stringify(chapter, null, 2));
    console.log('\n---\n');

    // 2. Get all lessons for Chapter 1
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapter.id)
      .order('order_index');

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return;
    }

    console.log(`📖 Found ${lessons?.length || 0} lessons in Chapter 1:`);
    lessons?.forEach(lesson => {
      console.log(`  - Lesson ${lesson.order_index + 1}: ${lesson.title}`);
    });
    console.log('\n---\n');

    // 3. Get all content blocks for Chapter 1 lessons
    const lessonIds = lessons?.map(l => l.id) || [];
    
    const { data: contentBlocks, error: contentError } = await supabase
      .from('content_blocks')
      .select('*')
      .in('lesson_id', lessonIds)
      .order('lesson_id')
      .order('order_index');

    if (contentError) {
      console.error('Error fetching content blocks:', contentError);
      return;
    }

    console.log(`📝 Found ${contentBlocks?.length || 0} content blocks across all lessons`);
    
    // 4. Get all interactive elements for Chapter 1 lessons
    const { data: interactiveElements, error: interactiveError } = await supabase
      .from('interactive_elements')
      .select('*')
      .in('lesson_id', lessonIds)
      .order('lesson_id')
      .order('order_index');

    if (interactiveError) {
      console.error('Error fetching interactive elements:', interactiveError);
      return;
    }

    console.log(`🎮 Found ${interactiveElements?.length || 0} interactive elements across all lessons`);
    console.log('\n---\n');

    // Compile all data for tone analysis
    const chapter1Data = {
      chapter,
      lessons,
      contentBlocks,
      interactiveElements,
      summary: {
        totalLessons: lessons?.length || 0,
        totalContentBlocks: contentBlocks?.length || 0,
        totalInteractiveElements: interactiveElements?.length || 0,
        contentTypes: [...new Set(contentBlocks?.map(cb => cb.type) || [])],
        interactiveTypes: [...new Set(interactiveElements?.map(ie => ie.type) || [])]
      }
    };

    // Save to file for tone analysis
    const fs = await import('fs/promises');
    const outputPath = './chapter1-content-data.json';
    await fs.writeFile(outputPath, JSON.stringify(chapter1Data, null, 2));
    
    console.log(`✅ Data saved to ${outputPath} for tone analysis`);
    console.log('\n📊 Summary:');
    console.log(JSON.stringify(chapter1Data.summary, null, 2));

    return chapter1Data;

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the query
queryChapter1Content();