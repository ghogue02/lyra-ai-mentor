# Element Visibility Diagnosis and Fixes

## Issue Summary

During the transition from Lyra-based chat elements to character-specific chat elements (Sofia, David, Rachel, Alex), there may be visibility issues caused by:

1. **Incomplete Lyra Element Archival**: Some Lyra chat elements may still be active, competing with new character elements
2. **Order Index Conflicts**: Multiple elements with the same or conflicting order_index values within lessons
3. **Priority Issues**: New character elements (order_index = 10) may be overshadowed by other elements with lower order_index values

## Investigation Scripts

### 1. `investigate-element-visibility-issues.sql`
**Purpose**: Comprehensive investigation of all potential visibility issues
**What it checks**:
- Active Lyra elements that should be archived
- Element counts per lesson in chapters 3-6
- Order index conflicts and priority issues
- Duplicate active elements
- Character-chapter alignment validation

### 2. `quick-element-diagnosis.sql`
**Purpose**: Quick diagnostic overview
**What it provides**:
- Count of active Lyra elements (should be 0)
- Character element distribution by chapter
- Order index conflicts
- Lessons with too many elements
- Misaligned character-chapter combinations

## Fix Scripts

### 1. `archive-lyra-elements-final.sql`
**Purpose**: Complete cleanup of all Lyra-related elements
**Actions**:
- Identifies all active Lyra elements
- Archives them with detailed logging
- Verifies archival success
- Shows remaining active character elements

### 2. `ensure-character-element-priority.sql`
**Purpose**: Ensures character elements have highest visibility priority
**Actions**:
- Sets all character elements to order_index = 1 (highest priority)
- Moves other elements to higher order_index values (10, 20, 30, etc.)
- Ensures character elements are not gated
- Provides verification output

### 3. `fix-element-visibility-priority.sql`
**Purpose**: Comprehensive fix for all visibility issues
**Actions**:
- Archives remaining Lyra elements
- Sets character elements to order_index = 1
- Adjusts other elements to prevent conflicts
- Cleans up duplicates
- Verifies character-chapter alignment
- Updates visibility settings

## Recommended Execution Order

1. **First**: Run `quick-element-diagnosis.sql` to understand current state
2. **Second**: Run `archive-lyra-elements-final.sql` to clean up Lyra elements
3. **Third**: Run `ensure-character-element-priority.sql` to set proper priorities
4. **Finally**: Run `quick-element-diagnosis.sql` again to verify fixes

## Expected Outcomes

After running the fix scripts, you should have:

- **0 active Lyra elements** (all properly archived)
- **Character elements with order_index = 1** in their respective chapters:
  - Chapter 3: `sofia_chat` elements
  - Chapter 4: `david_chat` elements  
  - Chapter 5: `rachel_chat` elements
  - Chapter 6: `alex_chat` elements
- **Other elements with order_index ≥ 10** to avoid conflicts
- **No duplicate character elements** per lesson
- **Character elements not gated** (immediately visible)

## Key Database Tables Involved

- `interactive_elements`: Stores element definitions and configuration
- `lesson_elements`: Links elements to specific lessons
- `lessons`: Lesson information
- `chapters`: Chapter information

## Troubleshooting

If character elements are still not visible after running fixes:

1. Check that the lesson has the correct character type for its chapter
2. Verify no other elements have order_index = 1 in the same lesson
3. Ensure `is_active = true` and `is_gated = false` for character elements
4. Check that the lesson_elements relationship exists

## How to Execute

```bash
# Connect to your Supabase database and run each script
psql -h [your-db-host] -U [username] -d [database] -f script-name.sql
```

Or through the Supabase dashboard SQL editor.

## Safety Features

All fix scripts include:
- Transaction wrapping (BEGIN/COMMIT)
- Detailed logging in element config
- Verification queries
- No data deletion (only status changes)
- Rollback capability if issues arise