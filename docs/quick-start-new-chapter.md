
# Quick Start: Creating a New Chapter

## Step 1: Plan Content Structure
1. Define learning objectives
2. Outline 5-7 content sections
3. Plan 3-4 interactive elements
4. Choose engagement pattern (see framework templates)

## Step 2: Database Setup
Run SQL to create chapter structure:

```sql
-- 1. Insert chapter
INSERT INTO chapters (title, description, order_index, icon, duration, is_published) 
VALUES ('Chapter Title', 'Description', [next_order], 'icon-name', '25 minutes', true);

-- 2. Insert lesson(s) 
INSERT INTO lessons (chapter_id, title, subtitle, order_index, estimated_duration)
VALUES ([chapter_id], 'Lesson Title', 'Lesson Subtitle', 1, 25);

-- 3. Insert content blocks (repeat for each section)
INSERT INTO content_blocks (lesson_id, type, title, content, order_index, metadata)
VALUES ([lesson_id], 'text', 'Section Title', 'Content here...', 10, '{}');

-- 4. Insert interactive elements
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES ([lesson_id], 'lyra_chat', 'Chat with Lyra', 'Discussion prompt', '{"minimumEngagement": 3}', 60);
```

## Step 3: Content Guidelines
- **Text blocks**: 150-300 words each
- **Lyra chat**: Place at 60-70% through content
- **Order index**: Increment by 10 (10, 20, 30, etc.)
- **Duration**: Estimate 1 minute per 150 words + 2 minutes per interaction

## Step 4: Testing Checklist
- [ ] Content displays properly
- [ ] Interactive elements work
- [ ] Chat engagement unlocks content
- [ ] Progress tracking functions
- [ ] Mobile responsive
- [ ] Accessibility compliance

## Common Configurations

### Lyra Chat
```json
{
  "minimumEngagement": 3,
  "blockingEnabled": true,
  "chatType": "persistent"
}
```

### Knowledge Check
```json
{
  "question": "Question text?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Why this is correct..."
}
```

### Reflection
```json
{
  "prompt": "Reflection question?",
  "placeholderText": "Your thoughts...",
  "minLength": 50
}
```

## Need Help?
Refer to the complete framework documentation in `docs/chapter-framework.md`
