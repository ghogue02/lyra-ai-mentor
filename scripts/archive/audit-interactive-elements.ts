import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Initialize Supabase client
const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

async function auditInteractiveElements() {
  console.log('🔍 Auditing Interactive Elements in Supabase...\n');

  try {
    // 1. Get all interactive elements with their relationships
    const { data: elements, error: elementsError } = await supabase
      .from('interactive_elements')
      .select(`
        *,
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
      .order('lesson_id')
      .order('order_index');

    if (elementsError) {
      console.error('Error fetching interactive elements:', elementsError);
      return;
    }

    console.log(`📊 Total Interactive Elements: ${elements?.length || 0}\n`);

    // 2. Count elements per chapter and lesson
    const elementsByChapter = new Map();
    const elementsByLesson = new Map();
    
    elements?.forEach(element => {
      if (element.lessons) {
        const chapterId = element.lessons.chapters?.id;
        const chapterTitle = element.lessons.chapters?.title;
        const chapterOrder = element.lessons.chapters?.order_index;
        const lessonId = element.lessons.id;
        const lessonTitle = element.lessons.title;
        
        // Count by chapter
        const chapterKey = `${chapterOrder}|${chapterId}|${chapterTitle}`;
        if (!elementsByChapter.has(chapterKey)) {
          elementsByChapter.set(chapterKey, []);
        }
        elementsByChapter.get(chapterKey).push(element);
        
        // Count by lesson
        const lessonKey = `${lessonId}|${lessonTitle}|${chapterOrder}`;
        if (!elementsByLesson.has(lessonKey)) {
          elementsByLesson.set(lessonKey, []);
        }
        elementsByLesson.get(lessonKey).push(element);
      }
    });

    // 3. Display elements per chapter
    console.log('📚 Elements Per Chapter:');
    console.log('========================');
    const sortedChapters = Array.from(elementsByChapter.entries()).sort((a, b) => {
      const aOrder = parseInt(a[0].split('|')[0]);
      const bOrder = parseInt(b[0].split('|')[0]);
      return aOrder - bOrder;
    });
    
    sortedChapters.forEach(([chapterKey, chapterElements]) => {
      const [order, id, title] = chapterKey.split('|');
      console.log(`\nChapter ${order}: ${title} (${chapterElements.length} elements)`);
      console.log(`  Chapter ID: ${id}`);
      console.log(`  Elements:`);
      chapterElements.forEach((elem, idx) => {
        console.log(`    ${idx + 1}. "${elem.title}" (Type: ${elem.type}, Order: ${elem.order_index})`);
      });
    });

    // 4. Find elements with "board defense strategy" in title
    console.log('\n\n🎯 Elements with "board defense strategy" in title:');
    console.log('===================================================');
    const boardDefenseElements = elements?.filter(e => 
      e.title.toLowerCase().includes('board defense strategy')
    ) || [];
    
    if (boardDefenseElements.length > 0) {
      boardDefenseElements.forEach(elem => {
        console.log(`\n- Title: "${elem.title}"`);
        console.log(`  Lesson: ${elem.lessons?.title}`);
        console.log(`  Chapter: ${elem.lessons?.chapters?.title}`);
        console.log(`  Type: ${elem.type}`);
        console.log(`  Order: ${elem.order_index}`);
        console.log(`  Gated: ${elem.is_gated}`);
        console.log(`  Active: ${elem.is_active}`);
      });
    } else {
      console.log('No elements found with "board defense strategy" in title.');
    }

    // 5. List all unique element titles
    console.log('\n\n📋 All Unique Element Titles:');
    console.log('=============================');
    const uniqueTitles = [...new Set(elements?.map(e => e.title) || [])];
    uniqueTitles.sort().forEach((title, idx) => {
      console.log(`${idx + 1}. "${title}"`);
    });

    // 6. Check content gating status
    console.log('\n\n🔒 Content Gating Analysis:');
    console.log('===========================');
    const gatedElements = elements?.filter(e => e.is_gated) || [];
    const activeElements = elements?.filter(e => e.is_active) || [];
    const inactiveElements = elements?.filter(e => !e.is_active) || [];
    
    console.log(`Total Elements: ${elements?.length || 0}`);
    console.log(`Gated Elements: ${gatedElements.length}`);
    console.log(`Active Elements: ${activeElements.length}`);
    console.log(`Inactive Elements: ${inactiveElements.length}`);
    
    if (gatedElements.length > 0) {
      console.log('\nGated Elements:');
      gatedElements.forEach(elem => {
        console.log(`  - "${elem.title}" in ${elem.lessons?.title}`);
      });
    }

    // 7. Analyze why only 2 elements per chapter are showing
    console.log('\n\n🔍 Analysis: Why Only 2 Elements Per Chapter?');
    console.log('=============================================');
    
    // Check element distribution by order_index
    const orderIndexDistribution = new Map();
    elements?.forEach(elem => {
      const orderIndex = elem.order_index;
      if (!orderIndexDistribution.has(orderIndex)) {
        orderIndexDistribution.set(orderIndex, 0);
      }
      orderIndexDistribution.set(orderIndex, orderIndexDistribution.get(orderIndex) + 1);
    });
    
    console.log('\nElement Distribution by order_index:');
    const sortedOrders = Array.from(orderIndexDistribution.entries()).sort((a, b) => a[0] - b[0]);
    sortedOrders.forEach(([orderIndex, count]) => {
      console.log(`  Order ${orderIndex}: ${count} elements`);
    });

    // Check for any filtering conditions
    console.log('\n\nPotential Issues:');
    console.log('- Inactive elements:', inactiveElements.length);
    console.log('- Gated elements:', gatedElements.length);
    
    // Check lesson distribution
    console.log('\n📖 Elements Per Lesson:');
    console.log('=======================');
    const sortedLessons = Array.from(elementsByLesson.entries()).sort((a, b) => {
      const aChapterOrder = parseInt(a[0].split('|')[2]);
      const bChapterOrder = parseInt(b[0].split('|')[2]);
      return aChapterOrder - bChapterOrder;
    });
    
    sortedLessons.forEach(([lessonKey, lessonElements]) => {
      const [id, title, chapterOrder] = lessonKey.split('|');
      console.log(`\nLesson: ${title} (Chapter ${chapterOrder})`);
      console.log(`  Count: ${lessonElements.length} elements`);
      lessonElements.forEach((elem, idx) => {
        console.log(`    ${idx + 1}. "${elem.title}" (Order: ${elem.order_index}, Active: ${elem.is_active}, Gated: ${elem.is_gated})`);
      });
    });

    // Export full data for further analysis
    const fs = await import('fs/promises');
    const outputPath = './interactive-elements-audit.json';
    await fs.writeFile(outputPath, JSON.stringify({
      totalElements: elements?.length || 0,
      elementsByChapter: Object.fromEntries(
        Array.from(elementsByChapter.entries()).map(([key, elems]) => [
          key,
          elems.map(e => ({
            id: e.id,
            title: e.title,
            type: e.type,
            order_index: e.order_index,
            is_active: e.is_active,
            is_gated: e.is_gated
          }))
        ])
      ),
      gatedElements: gatedElements.map(e => ({ title: e.title, lesson: e.lessons?.title })),
      inactiveElements: inactiveElements.map(e => ({ title: e.title, lesson: e.lessons?.title })),
      uniqueTitles,
      orderIndexDistribution: Object.fromEntries(orderIndexDistribution)
    }, null, 2));
    
    console.log(`\n✅ Full audit data saved to ${outputPath}`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the audit
auditInteractiveElements();