-- Database Constraint Investigation Script
-- This script helps identify the current check constraints causing Edge Function failures

-- 1. Check current constraints on generated_content table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'generated_content'::regclass 
AND contype = 'c'
ORDER BY conname;

-- 2. Check table structure
\d generated_content;

-- 3. Check what values are currently allowed for content_type
SELECT DISTINCT content_type 
FROM generated_content 
ORDER BY content_type;

-- 4. Check what values are currently allowed for character_type
SELECT DISTINCT character_type 
FROM generated_content 
ORDER BY character_type;

-- 5. Sample recent records to understand current data patterns
SELECT 
    id,
    character_type,
    content_type,
    title,
    created_at,
    approval_status
FROM generated_content 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Check for any failed insertions in logs (if available)
-- This would typically be in application logs, not database

-- 7. Identify the specific constraint definitions that are failing
-- Expected constraint fixes needed:

-- For content_type constraint (currently failing for 'email' and 'article'):
-- Expected to need: CHECK (content_type IN ('email', 'lesson', 'article'))

-- For character_type constraint (currently failing for 'rachel', 'sofia', 'david'):
-- Expected to need: CHECK (character_type IN ('maya', 'rachel', 'sofia', 'david', 'alex'))

-- 8. Test constraint by attempting manual insert (to confirm issue)
-- DO NOT RUN IN PRODUCTION - FOR TESTING ONLY:
/*
INSERT INTO generated_content (
    user_id,
    character_type,
    content_type,
    title,
    content,
    metadata,
    approval_status
) VALUES (
    null, -- test anonymous
    'rachel', -- This should fail if constraint is wrong
    'email',  -- This should fail if constraint is wrong
    'Test Title',
    'Test content',
    '{}',
    'pending'
);
*/

-- 9. Check table creation script or migration history
-- This would help understand why constraints were set incorrectly
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace
FROM pg_tables 
WHERE tablename = 'generated_content';

-- 10. Check if there are any triggers that might be interfering
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'generated_content';

-- Expected constraint fixes to implement:
/*
-- Fix content_type constraint
ALTER TABLE generated_content 
DROP CONSTRAINT generated_content_content_type_check;

ALTER TABLE generated_content 
ADD CONSTRAINT generated_content_content_type_check 
CHECK (content_type IN ('email', 'lesson', 'article'));

-- Fix character_type constraint  
ALTER TABLE generated_content 
DROP CONSTRAINT generated_content_character_type_check;

ALTER TABLE generated_content 
ADD CONSTRAINT generated_content_character_type_check 
CHECK (character_type IN ('maya', 'rachel', 'sofia', 'david', 'alex'));
*/