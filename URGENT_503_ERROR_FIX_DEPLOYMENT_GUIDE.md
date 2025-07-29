# 🚨 URGENT: 503 Error Fix Deployment Guide

## Issue Summary
The OpenRouter Edge Function is returning 503 Service Unavailable errors due to database constraint violations.

### Root Causes Identified:
1. **user_id constraint**: Column has NOT NULL constraint but Edge Function sends NULL for anonymous users
2. **character_type constraint**: Missing support for all characters (maya, rachel, sofia, david, alex, lyra)
3. **content_type constraint**: Missing support for all content types (email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint)
4. **Missing character definition**: Lyra character not defined in Edge Function

## 🔧 IMMEDIATE FIX REQUIRED

### Step 1: Apply Database Constraint Fixes

**Go to**: https://supabase.com/dashboard/project/hfkzwjnlxrwynactcmpe/sql

**Copy and execute this SQL**:
```sql
-- URGENT: Fix Database Constraints Causing 503 Errors in OpenRouter Edge Function
-- Date: 2025-07-29

-- Step 1: Fix user_id constraint to allow NULL (for anonymous users)
ALTER TABLE public.generated_content 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Drop existing restrictive constraints
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Step 3: Add corrected constraints with all required values
-- Character types based on all characters in the system
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN (
    'maya', 
    'rachel', 
    'sofia', 
    'david', 
    'alex', 
    'lyra'
));

-- Content types based on actual usage in edge functions
ALTER TABLE public.generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN (
    'email', 
    'lesson', 
    'article', 
    'social_post', 
    'newsletter', 
    'blog_post',
    'ecosystem-blueprint'
));

-- Step 4: Add comments to document the changes
COMMENT ON CONSTRAINT generated_content_character_type_check ON public.generated_content 
IS 'Updated 2025-07-29: Allows all character types for AI content generation - maya, rachel, sofia, david, alex, lyra';

COMMENT ON CONSTRAINT generated_content_content_type_check ON public.generated_content 
IS 'Updated 2025-07-29: Allows all content types for microlesson AI generation features';

-- Step 5: Add comment to user_id column to document the change
COMMENT ON COLUMN public.generated_content.user_id 
IS 'Updated 2025-07-29: Allows NULL for anonymous content generation via Edge Functions';

-- Step 6: Verify constraints are properly applied (for monitoring)
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.generated_content'::regclass 
AND contype = 'c'
AND (conname LIKE '%character_type%' OR conname LIKE '%content_type%')
ORDER BY conname;

-- Step 7: Verify user_id column allows NULL
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'generated_content' 
AND column_name = 'user_id';
```

### Step 2: Deploy Updated Edge Function

The Edge Function has been updated with Lyra character support. Deploy it using:

```bash
supabase functions deploy generate-character-content
```

Or if you can't use CLI, copy the updated `supabase/functions/generate-character-content/index.ts` through the Supabase dashboard.

## 🧪 VERIFICATION STEPS

After applying the fixes, run the test:

```bash
node test-edge-function-fixed.js
```

### Expected Results After Fix:
- ✅ **Maya Email**: 200 OK (should generate content)
- ✅ **Rachel Article**: 200 OK (should generate content)  
- ✅ **Sofia Social Post**: 200 OK (should generate content)
- ✅ **David Ecosystem Blueprint**: 200 OK (should generate content)
- ✅ **Alex Newsletter**: 200 OK (should generate content)
- ✅ **Lyra Lesson**: 200 OK (should generate content)

## 🚨 CRITICAL MONITORING

After deployment, monitor:

1. **Edge Function Logs**: Check for any remaining constraint violations
2. **Database Performance**: Ensure constraints don't impact performance
3. **Content Generation**: Test all character/content type combinations

## ⏰ TIMELINE

- **URGENT**: Apply database fixes immediately (5 minutes)
- **HIGH**: Deploy updated Edge Function (10 minutes)
- **MEDIUM**: Verify all tests pass (15 minutes)
- **LOW**: Monitor production logs (ongoing)

## 🔄 ROLLBACK PLAN

If issues occur, rollback SQL:

```sql
-- Rollback: Re-add NOT NULL constraint to user_id
ALTER TABLE public.generated_content 
ALTER COLUMN user_id SET NOT NULL;

-- Rollback: Restore original restrictive constraints
ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_character_type_check;

ALTER TABLE public.generated_content 
DROP CONSTRAINT IF EXISTS generated_content_content_type_check;

-- Add original restrictive constraints (if needed)
-- ALTER TABLE public.generated_content 
-- ADD CONSTRAINT generated_content_character_type_check 
-- CHECK (character_type IN ('maya'));
```

## 📁 FILES CREATED/MODIFIED

1. ✅ `supabase/migrations/20250729110531_fix_database_constraints_urgent.sql` - Database fixes
2. ✅ `supabase/functions/generate-character-content/index.ts` - Added Lyra character
3. ✅ `test-edge-function-fixed.js` - Verification test
4. ✅ `URGENT_503_ERROR_FIX_DEPLOYMENT_GUIDE.md` - This deployment guide

## 🎯 IMPACT

After applying these fixes:
- ✅ All 503 errors resolved
- ✅ All 6 characters supported (maya, rachel, sofia, david, alex, lyra)
- ✅ All 7 content types supported (email, lesson, article, social_post, newsletter, blog_post, ecosystem-blueprint)
- ✅ Anonymous usage supported (user_id can be NULL)
- ✅ Edge Function fully operational

**This will immediately resolve the OpenRouter integration issues and restore full functionality.**