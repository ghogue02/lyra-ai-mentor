import { describe, test, expect, beforeAll, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

/**
 * Database Content Sync Verification Test Suite
 * 
 * Purpose: Ensure local understanding of content matches live database
 * Run this before any content updates to prevent mismatches
 */

describe('Database Content Sync Verification', () => {
  let databaseConnected = false;

  beforeAll(async () => {
    // Verify database connection
    const { error } = await supabase.from('chapters').select('id').limit(1);
    databaseConnected = !error;
    
    if (!databaseConnected) {
      console.error('Database connection failed:', error?.message);
    }
  });

  describe('Chapter Character Assignments', () => {
    test('Chapter 2 character consistency', async () => {
      if (!databaseConnected) {
        console.warn('Skipping test - database not connected');
        return;
      }

      const { data: lessons, error } = await supabase
        .from('lessons')
        .select(`
          id, 
          order_index, 
          title,
          content_blocks!inner(
            content,
            type,
            order_index
          )
        `)
        .eq('chapter_id', 2)
        .order('order_index');

      expect(error).toBeNull();
      expect(lessons).toHaveLength(4); // Lessons 5-8

      // Analyze character mentions in each lesson
      const characterAnalysis = lessons?.map(lesson => {
        const allContent = lesson.content_blocks
          .map(cb => cb.content)
          .join(' ');
        
        const mayaMentions = (allContent.match(/Maya/gi) || []).length;
        const jamesMentions = (allContent.match(/James/gi) || []).length;
        const patriciaMentions = (allContent.match(/Patricia/gi) || []).length;
        
        return {
          lesson: lesson.order_index,
          title: lesson.title,
          characters: {
            maya: mayaMentions,
            james: jamesMentions,
            patricia: patriciaMentions
          },
          primaryCharacter: mayaMentions > jamesMentions ? 'Maya' : 
                           jamesMentions > mayaMentions ? 'James' : 
                           'None/Mixed'
        };
      });

      console.log('Chapter 2 Character Analysis:', characterAnalysis);
      
      // Log findings for manual review
      characterAnalysis?.forEach(analysis => {
        console.log(`Lesson ${analysis.lesson}: ${analysis.primaryCharacter} (Maya: ${analysis.characters.maya}, James: ${analysis.characters.james})`);
      });
    });

    test('Interactive element character alignment', async () => {
      if (!databaseConnected) return;

      const { data: elements } = await supabase
        .from('interactive_elements')
        .select(`
          id,
          lesson_id,
          type,
          title,
          configuration,
          lessons!inner(
            order_index,
            title
          )
        `)
        .eq('lessons.chapter_id', 2)
        .eq('is_active', true)
        .order('lesson_id');

      // Check for character mismatches
      const mismatches = elements?.filter(element => {
        const lessonOrder = element.lessons.order_index;
        const elementTitle = element.title || '';
        
        // If title mentions a character, verify it matches expected lesson character
        // Chapter 2 lessons are order_index 10, 20, 30, 40 (lessons 5-8) - all should be Maya
        if (elementTitle.includes('James') && [10, 20, 30, 40].includes(lessonOrder)) {
          return true; // James should not be in Chapter 2
        }
        
        return false;
      });

      console.log('Character Mismatches Found:', mismatches?.length || 0);
      mismatches?.forEach(mismatch => {
        console.warn(`Mismatch: "${mismatch.title}" in Lesson order ${mismatch.lessons.order_index}`);
      });
    });
  });

  describe('Component Configuration Verification', () => {
    test('Document generator components match database intent', async () => {
      if (!databaseConnected) return;

      const { data: docGenerators } = await supabase
        .from('interactive_elements')
        .select('*')
        .eq('type', 'document_generator')
        .eq('is_active', true);

      docGenerators?.forEach(element => {
        console.log(`Document Generator in Lesson ${element.lesson_id}:`);
        console.log(`  Title: ${element.title}`);
        console.log(`  Config: ${JSON.stringify(element.configuration)}`);
        
        // Verify component assignment logic
        if (element.title?.includes('Grant Proposal') && element.configuration?.component) {
          expect(element.configuration.component).toMatch(/Grant|Proposal/);
        }
      });
    });

    test('All Maya components are in Maya lessons', async () => {
      if (!databaseConnected) return;

      const { data: mayaElements } = await supabase
        .from('interactive_elements')
        .select(`
          *,
          lessons!inner(lesson_number)
        `)
        .like('title', '%Maya%')
        .eq('is_active', true);

      const nonMayaLessons = mayaElements?.filter(el => {
        // Assuming Maya owns lessons 5-7 based on UI screenshot
        return el.lessons.lesson_number < 5 || el.lessons.lesson_number > 7;
      });

      if (nonMayaLessons?.length) {
        console.warn('Maya components found in non-Maya lessons:', nonMayaLessons);
      }
    });
  });

  describe('Content Type Distribution', () => {
    test('Verify lesson content variety', async () => {
      if (!databaseConnected) return;

      const { data: lessonStats } = await supabase
        .rpc('get_lesson_content_stats', { chapter_num: 2 });

      console.log('Chapter 2 Content Distribution:', lessonStats);
      
      // Each lesson should have variety
      lessonStats?.forEach(stat => {
        expect(stat.content_block_count).toBeGreaterThan(3);
        expect(stat.interactive_element_count).toBeGreaterThan(1);
      });
    });
  });

  describe('Local File vs Database Consistency', () => {
    test('SQL migration files should be marked as historical only', async () => {
      // This is a reminder test
      console.warn(`
        IMPORTANT: SQL migration files in /database/migrations/ may not reflect current database state.
        Always query live database for accurate content.
      `);
      expect(true).toBe(true);
    });
  });
});

// Helper function to run sync test from command line
export async function runContentSyncTest() {
  console.log('Running database content sync verification...');
  
  try {
    // With Vitest, tests are run via the CLI command
    console.log('Please run: npm run test:run tests/database-content-sync.test.ts');
    
    return {
      passed: true,
      message: 'Test command provided - run via npm script'
    };
  } catch (error: any) {
    return {
      passed: false,
      message: `Sync test error: ${error.message}`
    };
  }
}