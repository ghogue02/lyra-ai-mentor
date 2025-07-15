#!/usr/bin/env ts-node
/**
 * Debug Compliance Checker
 * Understand why scores aren't improving
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function debugComplianceChecker() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Debugging Compliance Checker Issues\n')
  
  // Check content blocks with headings
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, content, title')
    .eq('is_active', true)
    .limit(10)
  
  if (contentBlocks) {
    console.log('📝 Sample Content Blocks:')
    contentBlocks.forEach((block, i) => {
      console.log(`\nBlock ${i + 1} (ID: ${block.id}):`)
      console.log('Title:', block.title || 'No title')
      console.log('Has # in content:', block.content?.includes('#') || false)
      console.log('Has <h in content:', block.content?.includes('<h') || false)
      console.log('Content preview:', block.content?.substring(0, 100) + '...')
    })
    
    // Count blocks with headings
    const blocksWithMarkdownHeadings = contentBlocks.filter(b => b.content?.includes('#'))
    const blocksWithHtmlHeadings = contentBlocks.filter(b => b.content?.includes('<h'))
    
    console.log('\n📊 Heading Statistics:')
    console.log(`Blocks with # headings: ${blocksWithMarkdownHeadings.length}`)
    console.log(`Blocks with <h headings: ${blocksWithHtmlHeadings.length}`)
  }
  
  // Check all active content blocks
  const { data: allBlocks, count } = await supabase
    .from('content_blocks')
    .select('*', { count: 'exact', head: false })
    .eq('is_active', true)
  
  if (allBlocks) {
    const withHeadings = allBlocks.filter(b => 
      b.content?.includes('#') || b.content?.includes('<h')
    )
    
    console.log('\n📈 Overall Statistics:')
    console.log(`Total active blocks: ${count}`)
    console.log(`Blocks with headings: ${withHeadings.length}`)
    console.log(`Percentage with headings: ${Math.round((withHeadings.length / (count || 1)) * 100)}%`)
    
    // Check content lengths
    const lengths = allBlocks.map(b => b.content?.length || 0)
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const minLength = Math.min(...lengths)
    const maxLength = Math.max(...lengths)
    
    console.log('\n📏 Content Length Analysis:')
    console.log(`Average length: ${Math.round(avgLength)} characters`)
    console.log(`Min length: ${minLength} characters`)
    console.log(`Max length: ${maxLength} characters`)
    
    // Check intro/conclusion patterns
    const intros = allBlocks.filter(b => 
      b.content?.toLowerCase().includes('introduction') ||
      b.content?.toLowerCase().includes('welcome') ||
      b.content?.toLowerCase().includes('overview')
    )
    
    const conclusions = allBlocks.filter(b => 
      b.content?.toLowerCase().includes('summary') ||
      b.content?.toLowerCase().includes('conclusion') ||
      b.content?.toLowerCase().includes('key takeaway')
    )
    
    console.log('\n📚 Intro/Conclusion Patterns:')
    console.log(`Blocks with intro patterns: ${intros.length}`)
    console.log(`Blocks with conclusion patterns: ${conclusions.length}`)
  }
  
  // Check chapters and lessons
  const { data: chapters } = await supabase
    .from('chapters')
    .select(`
      *,
      lessons (id)
    `)
    .eq('is_active', true)
    .order('order_index')
  
  if (chapters) {
    console.log('\n🏛️ Chapter Structure:')
    chapters.forEach(ch => {
      console.log(`Chapter ${ch.order_index}: ${ch.title} (${ch.lessons?.length || 0} lessons)`)
    })
  }
  
  // Check lesson complexity
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      *,
      chapters!inner(order_index),
      interactive_elements (id),
      content_blocks (id)
    `)
    .order('chapters.order_index, order_index')
  
  if (lessons) {
    console.log('\n📊 Lesson Complexity:')
    const byChapter: any = {}
    
    lessons.forEach(lesson => {
      const chapterOrder = lesson.chapters?.order_index
      if (!byChapter[chapterOrder]) byChapter[chapterOrder] = []
      
      byChapter[chapterOrder].push({
        title: lesson.title,
        elements: lesson.interactive_elements?.length || 0,
        blocks: lesson.content_blocks?.length || 0,
        complexity: (lesson.interactive_elements?.length || 0) + (lesson.content_blocks?.length || 0)
      })
    })
    
    Object.entries(byChapter).forEach(([chapter, lessons]: any) => {
      console.log(`\nChapter ${chapter}:`)
      lessons.forEach((l: any, i: number) => {
        console.log(`  Lesson ${i + 1}: ${l.elements} elements, ${l.blocks} blocks (complexity: ${l.complexity})`)
      })
    })
  }
}

debugComplianceChecker().catch(console.error)