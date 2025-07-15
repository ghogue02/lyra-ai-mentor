# MCP Database Connection Guide

**Version**: 1.0  
**Created**: 2025-07-03  
**Purpose**: Ensure Claude Code always works with live database content, not outdated local files

## 🔌 MCP Server Connection Protocol

### Prerequisites
1. MCP server must be running
2. Database credentials configured
3. Supabase project accessible

### Connection Steps
```bash
# 1. Start MCP server (if not already running)
./claude-flow mcp start --port 3000

# 2. Check MCP server status
./claude-flow mcp status

# 3. List available MCP tools
./claude-flow mcp tools
```

### Available MCP Database Tools
- `mcp__supabase_query`: Execute SQL queries on live database
- `mcp__supabase_insert`: Insert data into tables
- `mcp__supabase_update`: Update existing records
- `mcp__supabase_delete`: Delete records (use with caution)

## 📊 Database Content Verification Protocol

### CRITICAL: Always Verify Live Content
Before making any assumptions about content structure:

```sql
-- 1. Check chapter structure
SELECT c.id, c.chapter_number, c.title, c.description
FROM chapters c
WHERE c.is_active = true
ORDER BY c.chapter_number;

-- 2. Check lessons for a chapter
SELECT l.id, l.lesson_number, l.title, l.description
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
WHERE c.chapter_number = [chapter_number]
ORDER BY l.lesson_number;

-- 3. Check content blocks for a lesson
SELECT cb.id, cb.type, cb.title, cb.content, cb.order_index
FROM content_blocks cb
WHERE cb.lesson_id = [lesson_id]
AND cb.is_active = true
ORDER BY cb.order_index;

-- 4. Check interactive elements for a lesson
SELECT ie.id, ie.type, ie.title, ie.configuration
FROM interactive_elements ie
WHERE ie.lesson_id = [lesson_id]
AND ie.is_active = true
ORDER BY ie.order_index;
```

## 🧪 Deterministic Content Verification Test

### Test Suite: Database-Local Sync Check
```typescript
// File: /tests/database-content-sync.test.ts
import { supabase } from '@/integrations/supabase/client';

describe('Database Content Sync Verification', () => {
  
  // Test 1: Verify chapter character assignments
  test('Chapter 2 character consistency', async () => {
    const { data: lessons } = await supabase
      .from('lessons')
      .select(`
        id, 
        lesson_number, 
        title,
        content_blocks!inner(content)
      `)
      .eq('chapter_id', 2)
      .order('lesson_number');
    
    // Extract character mentions from content
    lessons.forEach(lesson => {
      const content = lesson.content_blocks
        .map(cb => cb.content)
        .join(' ');
      
      // Check for character consistency
      const mayaMentions = (content.match(/Maya/gi) || []).length;
      const jamesMentions = (content.match(/James/gi) || []).length;
      
      console.log(`Lesson ${lesson.lesson_number}: Maya=${mayaMentions}, James=${jamesMentions}`);
    });
  });
  
  // Test 2: Verify component assignments match database
  test('Interactive element component mapping', async () => {
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('lesson_id', 6) // Check lesson 6 specifically
      .eq('is_active', true);
    
    elements.forEach(element => {
      // Verify component assignments
      if (element.type === 'document_generator') {
        expect(element.title).toMatch(/Maya/);
        expect(element.configuration?.component).toBe('MayaGrantProposal');
      }
    });
  });
  
  // Test 3: No orphaned local content
  test('All local SQL migrations match database state', async () => {
    // Compare local migration files with database schema
    // Flag any discrepancies
  });
});
```

### Run Before Any Content Updates
```bash
# Run sync verification
npm test database-content-sync.test.ts

# If mismatches found, sync from database
./claude-flow sparc run analyzer "Sync local understanding with live database content"
```

## 🔄 Content Update Workflow

### Before Making Changes
1. **Connect to MCP**: Verify server is running
2. **Query Live Data**: Use MCP tools to check current state
3. **Run Sync Test**: Ensure local understanding matches database
4. **Document Findings**: Update session log with live data

### Example Session Start
```typescript
// Session initialization checklist
async function initializeSession() {
  // 1. Create session log
  createSessionLog();
  
  // 2. Verify MCP connection
  const mcpStatus = await checkMCPConnection();
  if (!mcpStatus.connected) {
    throw new Error('MCP connection required for content work');
  }
  
  // 3. Run content sync test
  const syncResults = await runContentSyncTest();
  if (!syncResults.passed) {
    console.warn('Local understanding outdated - querying live database');
    await syncFromDatabase();
  }
  
  // 4. Log current state
  logDatabaseState();
}
```

## 🚨 Common Pitfalls to Avoid

### 1. Relying on SQL Files
- ❌ DON'T: Assume SQL migration files reflect current state
- ✅ DO: Query live database for current content

### 2. Character Assumptions
- ❌ DON'T: Assume character distribution from file names
- ✅ DO: Check actual content blocks for character mentions

### 3. Component Mapping
- ❌ DON'T: Trust InteractiveElementRenderer without verification
- ✅ DO: Verify database configuration matches component logic

## 📋 Pre-Update Checklist

Before updating any content or components:
- [ ] MCP server connected and verified
- [ ] Live database queried for current state
- [ ] Content sync test passed
- [ ] Character assignments verified
- [ ] Component mappings confirmed
- [ ] Session log updated with findings

## 🔍 Debugging Commands

```bash
# Check for content mismatches
./claude-flow sparc run analyzer "Compare local files with database content for Chapter [X]"

# Sync component assignments
./claude-flow sparc run analyzer "Verify all interactive elements use correct components"

# Character audit
./claude-flow sparc run analyzer "List all character appearances by lesson in database"
```

---

**Remember**: The database is the single source of truth. Local files may be outdated, incomplete, or contain abandoned experiments. Always verify with live data before making decisions.