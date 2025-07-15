#!/usr/bin/env ts-node
/**
 * Test script to verify interactive element fixes
 */

import { supabase } from '../src/integrations/supabase/client';

async function testInteractiveElementQueries() {
  console.log('🧪 Testing interactive element database queries...');
  
  try {
    // Test the query that was failing - using correct column name
    const { data: progressData, error: progressError } = await supabase
      .from('interactive_element_progress')
      .select('interactive_element_id')
      .eq('lesson_id', 5)
      .eq('completed', true)
      .limit(5);
    
    if (progressError) {
      console.error('❌ Progress query failed:', progressError);
      return false;
    }
    
    console.log('✅ Progress query successful, found', progressData?.length || 0, 'completed elements');
    
    // Test interactive elements query
    const { data: elementsData, error: elementsError } = await supabase
      .from('interactive_elements')
      .select('id, title, type, content, configuration')
      .eq('lesson_id', 5)
      .eq('is_active', true)
      .limit(3);
    
    if (elementsError) {
      console.error('❌ Elements query failed:', elementsError);
      return false;
    }
    
    console.log('✅ Elements query successful, found', elementsData?.length || 0, 'elements');
    
    // Test data type safety
    if (elementsData) {
      for (const element of elementsData) {
        const titleType = typeof element.title;
        const typeType = typeof element.type;
        const contentType = typeof element.content;
        
        console.log(`📋 Element ${element.id}:`);
        console.log(`  - title: ${titleType} (${element.title})`);
        console.log(`  - type: ${typeType} (${element.type})`);
        console.log(`  - content: ${contentType} (length: ${element.content?.length || 0})`);
        
        if (titleType !== 'string' || typeType !== 'string') {
          console.warn(`⚠️ Non-string types detected in element ${element.id}`);
        }
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testInteractiveElementQueries()
  .then(success => {
    if (success) {
      console.log('\n🎉 All tests passed! Interactive element fixes are working.');
    } else {
      console.log('\n💥 Tests failed. Check errors above.');
    }
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
  });