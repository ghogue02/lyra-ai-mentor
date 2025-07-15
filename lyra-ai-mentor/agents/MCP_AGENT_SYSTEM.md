# MCP Agent System - Database Connection Management

## 🔗 MCP Connection Agent

### Purpose
Manages Model Context Protocol (MCP) connections for database access, API integrations, and external services required for chapter development.

### Responsibilities
1. Initialize and maintain Supabase database connections
2. Query database for content analysis
3. Manage API connections for AI tools
4. Handle connection health monitoring
5. Provide data access for other agents

## 🗄️ Supabase Configuration

### Connection Details
- **Project ID**: hfkzwjnlxrwynactcmpe
- **Project Name**: HelloLyra
- **Anon API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0
- **URL**: https://hfkzwjnlxrwynactcmpe.supabase.co

### Database Schema (Key Tables)
```sql
chapters (id, title, description, order_index, icon, duration, is_published)
lessons (id, chapter_id, title, subtitle, order_index, estimated_duration)
content_blocks (id, lesson_id, type, title, content, metadata, order_index)
interactive_elements (id, lesson_id, type, title, content, configuration, order_index)
lesson_progress (user_id, lesson_id, completed, progress_percentage, chapter_completed)
chat_conversations (user_id, lesson_id, chapter_id, title, lesson_context)
chat_messages (conversation_id, content, is_user_message, message_order)
```

## 🤖 MCP Agent Commands

### Initialize Connection
```bash
# Start MCP server with Supabase connection
./claude-flow mcp start --port 3000

# Test connection
./claude-flow sparc run mcp-agent "Test Supabase connection for HelloLyra project"
```

### Data Queries for Tone Analysis
```bash
# Get Chapter 1 content
./claude-flow sparc run mcp-agent "Query all Chapter 1 lessons and content blocks for tone analysis"

# Get interactive elements
./claude-flow sparc run mcp-agent "Extract Chapter 1 interactive elements and AI chat configurations"

# Get Lyra personality examples
./claude-flow sparc run mcp-agent "Find all Lyra chat examples from Chapter 1"
```

### Connection Health
```bash
# Monitor connection status
./claude-flow mcp status

# Test database queries
./claude-flow sparc run mcp-agent "Run health check on all database connections"
```

## 📊 Content Analysis Queries

### Chapter 1 Tone Analysis
```sql
-- Get all Chapter 1 content blocks
SELECT 
  l.title as lesson_title,
  cb.type,
  cb.title as block_title,
  cb.content,
  cb.order_index
FROM chapters c
JOIN lessons l ON c.id = l.chapter_id
JOIN content_blocks cb ON l.id = cb.lesson_id
WHERE c.order_index = 10  -- Chapter 1
ORDER BY l.order_index, cb.order_index;

-- Get all Chapter 1 interactive elements
SELECT 
  l.title as lesson_title,
  ie.type,
  ie.title,
  ie.content,
  ie.configuration,
  ie.order_index
FROM chapters c
JOIN lessons l ON c.id = l.chapter_id
JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE c.order_index = 10
ORDER BY l.order_index, ie.order_index;

-- Get Lyra chat configurations
SELECT 
  l.title as lesson_title,
  ie.title,
  ie.configuration->>'initialMessage' as lyra_greeting,
  ie.configuration->>'context' as lesson_context,
  ie.configuration->>'personality' as lyra_personality
FROM chapters c
JOIN lessons l ON c.id = l.chapter_id
JOIN interactive_elements ie ON l.id = ie.lesson_id
WHERE c.order_index = 10
AND ie.type = 'lyra_chat'
ORDER BY l.order_index, ie.order_index;
```

## 🔧 Agent Integration

### With Other Agents
```bash
# Content Creator uses MCP for research
./claude-flow sparc run content-creator "Create Chapter 2 content using tone analysis from MCP agent"

# UX Reviewer accesses user data
./claude-flow sparc run ux-reviewer "Analyze user engagement patterns via MCP connection"

# Testing Agent validates against database
./claude-flow sparc run tester "Test new content against existing database structure"
```

### Memory Integration
```bash
# Store database insights
./claude-flow memory store "chapter_1_tone_analysis" "$(./claude-flow sparc run mcp-agent 'Extract tone analysis')"

# Share connection status
./claude-flow memory store "mcp_connection_status" "Active - Supabase HelloLyra connected"
```

## 🚀 Setup Instructions

### 1. Initialize MCP Connection
```bash
# Set environment variables
export SUPABASE_URL="https://hfkzwjnlxrwynactcmpe.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

# Start MCP server
./claude-flow mcp start --port 3000
```

### 2. Test Connection
```bash
# Verify database access
./claude-flow sparc run mcp-agent "List all chapters in HelloLyra database"
```

### 3. Begin Tone Analysis
```bash
# Extract Chapter 1 content for analysis
./claude-flow sparc run mcp-agent "Complete tone analysis of Chapter 1 including all content blocks, interactive elements, and Lyra personality examples"
```

## 📋 Data Requirements

### For Tone Analysis, Need Access To:
1. **Content Blocks**: All text content from Chapter 1 lessons
2. **Interactive Elements**: Lyra chat configurations and prompts
3. **Lesson Structure**: How concepts are introduced and built upon
4. **User Engagement Data**: What works well in Chapter 1

### For Chapter Development, Need Access To:
1. **Database Schema**: To maintain consistency
2. **Progress Tracking**: To understand user journeys
3. **Content Performance**: What content resonates
4. **AI Usage Patterns**: How users interact with Lyra

This MCP Agent System provides the foundation for data-driven chapter development while maintaining direct access to your production database for accurate tone analysis and content consistency.