# Lesson 5 Content Issues - Detailed Report

## The Specific Problem You Identified

In the **"Enter the AI Email Revolution"** content block, the text states:

> "In the next 20 minutes, Maya will learn to use **four game-changing tools**: an AI Email Composer that adapts to any situation, a Difficult Conversation Helper for sensitive messages, an intelligent responder for quick but thoughtful replies, and a follow-up generator that turns meeting chaos into clear action items."

### Why This Is Wrong:

1. **Only 2 tools are actually available** to users after frontend filtering:
   - AI Email Composer (`ai_email_composer`)
   - Lyra Chat (`lyra_chat`)

2. **The "Difficult Conversation Helper" is filtered out** by the frontend due to rendering issues

3. **The other promised tools don't exist**:
   - "intelligent responder" - not implemented
   - "follow-up generator" - not implemented

## Additional Issues in This Block

The same content block continues with:

> "Coming up: You'll see how James tackles grant proposal deadlines, how Sofia transforms social media storytelling, how David turns data into funding gold, how Rachel automates workflow chaos, and how Alex leads organizational transformation."

### Why This Is Wrong:

1. **This is Maya's lesson (Lesson 5)** - it should focus on her story
2. **Only James has actual content** (in Lesson 6)
3. **Sofia, David, Rachel, and Alex** have no developed content in Chapter 2
4. **Lessons 7-8 are empty** (no interactive elements)

## Other Character Cross-Contamination

### In "Your Email Pain Points" block:
- Mentions: "Or perhaps you're like James (our development associate)"
- **Issue**: James hasn't been introduced yet (he appears in Lesson 6)

### In "Character Transformation Outcomes" block:
- Lists outcomes for Maya, James, Sofia, David, Rachel, and Alex
- **Issue**: Should only show Maya's outcomes in her lesson

### In "Meet Your Nonprofit Heroes" block:
- Introduces all 6 characters
- **Issue**: Should focus on Maya with at most a preview of James

## The Root Cause

The content was written assuming:
- 4 email tools would be available
- All 6 characters would have fully developed stories
- Each character would have a complete lesson

But the reality is:
- Only 2 tools work properly for users
- Only Maya and James have developed stories
- Lessons 7-8 have no interactive elements

## Solution

The SQL file `FIX_MAYA_LESSON_CONTENT.sql` will:

1. **Change "four game-changing tools"** to accurately describe the 2 available tools
2. **Remove the "Coming up" section** listing all other characters
3. **Remove James reference** from the reflection (before he's introduced)
4. **Focus character outcomes** on Maya only
5. **Update hero introductions** to focus on current lesson

## Why Direct Updates Aren't Working

The database has Row Level Security (RLS) policies that prevent programmatic updates from the frontend. You'll need to:

1. Run the SQL directly in your Supabase dashboard
2. Or temporarily adjust RLS policies to allow updates
3. Or use a service role key with elevated permissions

## Impact on User Experience

Currently users see:
- **Broken promises**: Content promises 4 tools but delivers 2
- **Confusing references**: Characters mentioned but never developed
- **Inconsistent narrative**: Jumping between characters without context

After the fix:
- **Accurate content**: Promises match delivery
- **Focused narrative**: Maya's story without distractions
- **Clear progression**: Appropriate preview of next lesson only