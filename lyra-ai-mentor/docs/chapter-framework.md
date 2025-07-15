
# AI Learning Hub - Chapter Framework Documentation

## Table of Contents
1. [Content Architecture](#content-architecture)
2. [Database Schema & Backend Setup](#database-schema--backend-setup)
3. [UI/UX Patterns & Components](#uiux-patterns--components)
4. [Interactive Elements](#interactive-elements)
5. [Content Guidelines](#content-guidelines)
6. [Technical Implementation](#technical-implementation)
7. [Chapter Templates](#chapter-templates)

## Content Architecture

### Chapter Structure
Each chapter follows a consistent 3-layer architecture:
1. **Content Blocks** - Core educational content (text, images, videos)
2. **Interactive Elements** - Engagement tools (quizzes, reflections, chat)
3. **Progress Tracking** - Completion states and user progress

### Content Block Types
- `text` - Rich text content with markdown support
- `image` - Images with captions and metadata
- `video` - Video embeds with playback tracking
- `ai_generated_image` - Special handling for AI-generated visuals

### Interactive Element Types
- `lyra_chat` - AI mentor chat (triggers content blocking)
- `knowledge_check` - Multiple choice questions
- `reflection` - Text input for user thoughts
- `callout_box` - Highlighted information boxes

## Database Schema & Backend Setup

### Core Tables Structure
```sql
-- Chapters table
chapters (id, title, description, order_index, icon, duration, is_published)

-- Lessons table  
lessons (id, chapter_id, title, subtitle, order_index, estimated_duration, is_published)

-- Content blocks
content_blocks (id, lesson_id, type, title, content, metadata, order_index)

-- Interactive elements
interactive_elements (id, lesson_id, type, title, content, configuration, order_index)

-- Progress tracking
lesson_progress (user_id, lesson_id, completed, progress_percentage, chapter_completed)
lesson_progress_detailed (user_id, lesson_id, content_block_id, completed, time_spent)
interactive_element_progress (user_id, lesson_id, interactive_element_id, completed)

-- Chat system
chat_conversations (user_id, lesson_id, chapter_id, title, lesson_context)
chat_messages (conversation_id, user_id, lesson_id, content, is_user_message, message_order)
```

### Required Database Inserts for New Chapter
1. Insert chapter record with proper order_index
2. Insert lesson record(s) linked to chapter
3. Insert content_blocks for each educational section
4. Insert interactive_elements for engagement points
5. Ensure proper order_index sequencing across all elements

## UI/UX Patterns & Components

### Layout Pattern
```
LessonHeader (progress, navigation, completion status)
├── Back to Dashboard button
├── Chapter badge + completion indicator  
├── Lesson title and subtitle
└── LessonProgress component

LessonContent (merged content blocks + interactive elements)
├── ContentBlockRenderer for educational content
├── InteractiveElementRenderer for engagement
├── Content blocking based on chat engagement
└── Smooth animations for newly unlocked content

ChapterCompletion (bottom completion button)
LessonNavigation (chapter navigation links)
```

### Component Responsibilities
- **LessonHeader**: User orientation, progress display, completion actions
- **LessonContent**: Core content delivery with engagement blocking
- **ContentBlockRenderer**: Handles text, image, video content types
- **InteractiveElementRenderer**: Routes to specific interactive components
- **LessonProgress**: Visual progress tracking with engagement requirements

### Content Blocking System
- First `lyra_chat` element creates a blocking point
- Content after chat requires minimum engagement (3 exchanges)
- Blocked content is hidden (not grayed out)
- Smooth fade-in animation when content unlocks

## Interactive Elements

### Lyra Chat Configuration
```json
{
  "type": "lyra_chat",
  "title": "Chat with Lyra",
  "content": "Contextual prompt for the lesson topic",
  "configuration": {
    "minimumEngagement": 3,
    "blockingEnabled": true,
    "chatType": "persistent"
  }
}
```

### Knowledge Check Configuration
```json
{
  "type": "knowledge_check",
  "title": "Check Your Understanding",
  "content": "Question text",
  "configuration": {
    "question": "What is the main benefit of AI?",
    "options": ["Option A", "Option B", "Option C"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of the correct answer"
  }
}
```

### Reflection Configuration
```json
{
  "type": "reflection",
  "title": "Reflect on This",
  "content": "Reflection prompt",
  "configuration": {
    "prompt": "How might you apply this in your organization?",
    "placeholderText": "Share your thoughts...",
    "minLength": 50
  }
}
```

## Content Guidelines

### Educational Content Structure
1. **Hook** - Engaging opening that connects to user's world
2. **Context** - Why this matters for non-profit professionals  
3. **Core Content** - Main educational material (3-5 sections)
4. **Application** - Real-world examples and use cases
5. **Engagement Point** - Lyra chat for discussion and questions
6. **Practice** - Knowledge checks or reflections
7. **Synthesis** - Key takeaways and next steps

### Writing Style Guidelines
- **Conversational**: Use "you" and direct address
- **Accessible**: Avoid jargon, explain technical terms
- **Practical**: Focus on actionable insights
- **Empathetic**: Acknowledge non-profit challenges
- **Progressive**: Build complexity gradually

### Content Pacing
- **Text blocks**: 150-300 words each
- **Total lesson**: 1,500-2,500 words
- **Interactive spacing**: Every 3-4 content blocks
- **Chat placement**: 60-70% through content
- **Estimated duration**: 15-25 minutes per lesson

## Technical Implementation

### File Structure for New Chapter
```
Database inserts:
├── chapters table (chapter info)
├── lessons table (lesson info)  
├── content_blocks table (educational content)
└── interactive_elements table (engagement tools)

No new code files needed - existing components handle all content types
```

### Content Order Index Strategy
- Content blocks and interactive elements share same order sequence
- Increment by 10 (10, 20, 30) to allow easy insertions
- Lyra chat typically at index 60-70% through content
- Knowledge checks and reflections interspersed throughout

### Lyra Chat Integration
- Uses existing `usePersistentChat` hook
- Automatically personalizes based on user profile
- Streams responses with natural pacing
- Tracks engagement for content unlocking
- Saves all conversations to database

## Chapter Templates

### Template 1: Technology Introduction
**Structure**: Hook → What is X? → Why it Matters → Key Features → Real Examples → Chat → Practice → Takeaways

**Interactive Pattern**:
- Callout box early (definitions)
- Lyra chat at 65% (application discussion)  
- Knowledge check at 85% (comprehension)
- Reflection at 100% (personal application)

### Template 2: Practical Application
**Structure**: Challenge → Solution Overview → Step-by-Step → Case Studies → Chat → Implementation → Reflection

**Interactive Pattern**:
- Reflection early (current challenges)
- Lyra chat at 70% (implementation questions)
- Knowledge check at 90% (process understanding)
- Final reflection (action planning)

### Template 3: Strategic Understanding  
**Structure**: Big Picture → Impact Analysis → Opportunity Areas → Risk Considerations → Chat → Decision Framework → Planning

**Interactive Pattern**:
- Callout box (key statistics)
- Lyra chat at 60% (strategic discussion)
- Multiple knowledge checks (decision points)
- Strategic reflection (organizational fit)

## Best Practices

### Content Creation
1. Start with learning objectives
2. Map to user personas and use cases
3. Create content outline with interaction points
4. Write conversational, accessible content
5. Test reading flow and pacing
6. Validate technical accuracy

### Database Setup
1. Always increment order_index by 10
2. Set proper lesson duration estimates  
3. Include rich metadata for content blocks
4. Configure interactive elements completely
5. Test content blocking behavior
6. Verify progress tracking works

### Quality Assurance
1. Test complete user journey
2. Verify chat engagement unlocks content
3. Check all interactive elements function
4. Validate progress tracking accuracy
5. Test on different screen sizes
6. Ensure accessibility compliance

---

*This framework ensures consistency and quality across all chapters while maintaining the engaging, personalized experience that makes the AI Learning Hub effective for non-profit professionals.*
