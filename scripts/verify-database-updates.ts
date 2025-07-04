#!/usr/bin/env ts-node
/**
 * Verify Database Updates
 * Check if our updates are actually being saved
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

async function verifyDatabaseUpdates() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log('🔍 Verifying Database Updates\n')
  
  // Test 1: Try to update a single block and verify
  const { data: testBlock } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('id', 54)
    .single()
  
  if (testBlock) {
    console.log('📝 Test Block Before Update:')
    console.log('ID:', testBlock.id)
    console.log('Title:', testBlock.title)
    console.log('Content preview:', testBlock.content?.substring(0, 100))
    console.log('Has heading:', testBlock.content?.includes('#'))
    
    // Try to update with a heading
    const newContent = `## ${testBlock.title}\n\n${testBlock.content}`
    
    const { error: updateError, data: updated } = await supabase
      .from('content_blocks')
      .update({ content: newContent })
      .eq('id', 54)
      .select()
      .single()
    
    if (updateError) {
      console.log('\n❌ Update Error:', updateError)
    } else {
      console.log('\n✅ Update successful')
      
      // Verify the update
      const { data: verifyBlock } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('id', 54)
        .single()
      
      console.log('\n📝 After Update:')
      console.log('Has heading now:', verifyBlock?.content?.includes('#'))
      console.log('Content preview:', verifyBlock?.content?.substring(0, 100))
    }
  }
  
  // Check recently updated blocks
  const { data: recentBlocks } = await supabase
    .from('content_blocks')
    .select('id, title, content, updated_at')
    .order('updated_at', { ascending: false })
    .limit(10)
  
  console.log('\n🕐 Recently Updated Blocks:')
  recentBlocks?.forEach(block => {
    const hasHeading = block.content?.includes('#') || block.content?.includes('##')
    console.log(`ID ${block.id}: ${block.title} - Has heading: ${hasHeading} - Updated: ${block.updated_at}`)
  })
  
  // Check if we have the right permissions
  const { data: authUser } = await supabase.auth.getUser()
  console.log('\n🔐 Auth Status:', authUser ? 'Authenticated' : 'Not authenticated')
  
  // Try direct SQL approach
  console.log('\n🔧 Testing direct update approach...')
  
  // Count current headings
  const { count: beforeCount } = await supabase
    .from('content_blocks')
    .select('*', { count: 'exact', head: true })
    .like('content', '%##%')
  
  console.log('Blocks with ## headings before:', beforeCount || 0)
  
  // Try batch update with RPC or direct query
  const { data: contentToFix } = await supabase
    .from('content_blocks')
    .select('id, title, content')
    .eq('is_active', true)
    .not('content', 'like', '%#%')
    .limit(5)
  
  if (contentToFix && contentToFix.length > 0) {
    console.log(`\nFound ${contentToFix.length} blocks without headings. Updating...`)
    
    for (const block of contentToFix) {
      const heading = block.title ? `## ${block.title}` : '## Content Section'
      const newContent = `${heading}\n\n${block.content || ''}`
      
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: newContent })
        .eq('id', block.id)
      
      if (error) {
        console.log(`❌ Failed to update block ${block.id}:`, error.message)
      } else {
        console.log(`✅ Updated block ${block.id}`)
      }
    }
  }
  
  // Final count
  const { count: afterCount } = await supabase
    .from('content_blocks')
    .select('*', { count: 'exact', head: true })
    .like('content', '%##%')
  
  console.log('\nBlocks with ## headings after:', afterCount || 0)
  console.log('Headings added:', (afterCount || 0) - (beforeCount || 0))
}

verifyDatabaseUpdates().catch(console.error)